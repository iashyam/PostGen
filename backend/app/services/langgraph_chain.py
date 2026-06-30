from typing import TypedDict

from langchain_google_genai import ChatGoogleGenerativeAI
from langgraph.graph import END, StateGraph

from app.config import settings

LENGTH_MAP = {
    "Short": "100-150 words",
    "Medium": "200-300 words",
    "Long": "400-500 words",
}

TONE_MAP = {
    "Professional": "formal, data-driven, authoritative, industry expert voice",
    "Casual": "conversational, friendly, relatable, use occasional emoji",
    "Inspirational": "motivating, uplifting, story-driven, emotionally resonant",
    "Educational": "informative, structured, clear explanations, teaching tone",
    "Storytelling": "narrative-driven, personal anecdotes, vivid descriptions, journey format",
}


class PostState(TypedDict):
    topic: str
    key_points: list[str]
    tone: str
    length: str
    research: str
    draft: str
    refined: str
    final_post: str
    hashtags: list[str]
    current_step: str


def _get_llm():
    return ChatGoogleGenerativeAI(
        model=settings.gemini_model,
        google_api_key=settings.google_api_key,
    )


async def research_topic(state: PostState) -> dict:
    llm = _get_llm()
    key_points_str = "\n".join(f"- {kp}" for kp in state["key_points"]) if state["key_points"] else ""
    key_points_section = f"Key points:\n{key_points_str}\n\n" if key_points_str else ""
    prompt = (
        f"You are a LinkedIn content research assistant. Given a topic, "
        f"identify relevant trends, statistics, industry context, and compelling angles "
        f"that would resonate with a professional LinkedIn audience.\n\n"
        f"Topic: {state['topic']}\n\n"
        f"{key_points_section}"
        f"Provide a concise research brief (3-5 bullet points) with actionable insights."
    )
    response = await llm.ainvoke(prompt)
    return {"research": response.content, "current_step": "researching"}


async def generate_draft(state: PostState) -> dict:
    llm = _get_llm()
    tone_desc = TONE_MAP.get(state["tone"], TONE_MAP["Professional"])
    length_desc = LENGTH_MAP.get(state["length"], LENGTH_MAP["Medium"])
    key_points_str = "\n".join(f"- {kp}" for kp in state["key_points"]) if state["key_points"] else ""
    key_points_section = f"Key points:\n{key_points_str}\n\n" if key_points_str else ""

    prompt = (
        f"Write a LinkedIn post draft based on the following:\n\n"
        f"Topic: {state['topic']}\n"
        f"{key_points_section}"
        f"Research context:\n{state['research']}\n\n"
        f"Requirements:\n"
        f"- Tone: {state['tone']} ({tone_desc})\n"
        f"- Length: {length_desc}\n"
        f"- Start with a strong hook that stops the scroll\n"
        f"- Use short paragraphs and line breaks for readability\n"
        f"- Include a clear narrative arc\n"
        f"- Do NOT include hashtags yet\n"
        f"- Do NOT use markdown formatting\n"
    )
    response = await llm.ainvoke(prompt)
    return {"draft": response.content, "current_step": "drafting"}


async def refine_post(state: PostState) -> dict:
    llm = _get_llm()
    prompt = (
        f"You are a LinkedIn content editor. Refine the following draft post:\n\n"
        f"---\n{state['draft']}\n---\n\n"
        f"Apply these LinkedIn best practices:\n"
        f"1. Hook: First line must be attention-grabbing (question, bold statement, or surprising fact)\n"
        f"2. Formatting: Use line breaks between paragraphs. Short sentences. One idea per line.\n"
        f"3. Use bullet points or checkmark emoji (✅) for lists\n"
        f"4. End with a call-to-action or engagement question\n"
        f"5. Keep under 3000 characters\n"
        f"6. Generate 3-5 relevant hashtags\n\n"
        f"Output the refined post followed by hashtags on the last line, prefixed with #.\n"
        f"Do NOT use markdown formatting. Output plain text only."
    )
    response = await llm.ainvoke(prompt)
    return {"refined": response.content, "current_step": "refining"}


async def format_output(state: PostState) -> dict:
    text = state["refined"]

    # Extract hashtags from the last lines
    lines = text.strip().split("\n")
    hashtags = []
    post_lines = []

    for line in reversed(lines):
        stripped = line.strip()
        if stripped and all(word.startswith("#") for word in stripped.split() if word):
            hashtags = [w for w in stripped.split() if w.startswith("#")]
            continue
        break

    # Rebuild post without trailing hashtag line
    found_content = False
    for line in lines:
        stripped = line.strip()
        if stripped and all(word.startswith("#") for word in stripped.split() if word) and not found_content:
            continue
        found_content = True
        post_lines.append(line)

    # Simpler approach: just separate content from hashtags at the end
    post_lines = []
    hashtags = []
    for line in lines:
        words = line.strip().split()
        if words and all(w.startswith("#") for w in words):
            hashtags.extend(words)
        else:
            post_lines.append(line)

    final = "\n".join(post_lines).strip()
    if hashtags:
        final += "\n\n" + " ".join(hashtags)

    # Enforce 3000 char limit
    if len(final) > 3000:
        final = final[:2997] + "..."

    return {
        "final_post": final,
        "hashtags": hashtags,
        "current_step": "complete",
    }


def build_graph():
    graph = StateGraph(PostState)
    graph.add_node("research_topic", research_topic)
    graph.add_node("generate_draft", generate_draft)
    graph.add_node("refine_post", refine_post)
    graph.add_node("format_output", format_output)

    graph.set_entry_point("research_topic")
    graph.add_edge("research_topic", "generate_draft")
    graph.add_edge("generate_draft", "refine_post")
    graph.add_edge("refine_post", "format_output")
    graph.add_edge("format_output", END)

    return graph.compile()


_compiled_graph = None


def get_graph():
    global _compiled_graph
    if _compiled_graph is None:
        _compiled_graph = build_graph()
    return _compiled_graph


async def generate_post_stream(topic: str, key_points: list[str], tone: str, length: str):
    graph = get_graph()
    initial_state = {
        "topic": topic,
        "key_points": key_points,
        "tone": tone,
        "length": length,
        "research": "",
        "draft": "",
        "refined": "",
        "final_post": "",
        "hashtags": [],
        "current_step": "starting",
    }

    async for event in graph.astream(initial_state):
        # event is dict with node name as key
        for node_name, node_output in event.items():
            step = node_output.get("current_step", node_name)
            if step == "complete":
                yield {
                    "event": "complete",
                    "content": node_output.get("final_post", ""),
                    "hashtags": node_output.get("hashtags", []),
                }
            else:
                yield {
                    "event": step,
                    "content": node_output.get("draft", node_output.get("research", "")),
                }
