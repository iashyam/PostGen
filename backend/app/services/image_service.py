import asyncio
import logging
from io import BytesIO

from google import genai
from google.genai import types
from PIL import Image

from app.config import settings
from app.services.s3_service import get_presigned_url, upload_image

logger = logging.getLogger(__name__)

STYLE_CONFIGS = {
    "Modern 3D": {
        "description": "Modern 3D rendered illustration",
        "direction": (
            "Create a stunning 3D rendered scene with soft volumetric lighting, "
            "subtle depth of field, and glossy materials. Use floating geometric "
            "elements and abstract shapes to represent the concept. The scene should "
            "feel like a premium tech product render with smooth gradients, "
            "ambient occlusion, and a clean studio-like background. Think Apple "
            "keynote visual quality."
        ),
        "color_guidance": "Use a sophisticated palette with deep blues, purples, and warm accent highlights.",
    },
    "Minimal": {
        "description": "Clean minimalist illustration",
        "direction": (
            "Create a refined minimalist illustration using flat design principles. "
            "Use bold, simple geometric shapes with generous negative space. "
            "The composition should be intentionally sparse — every element must "
            "serve a purpose. Think Scandinavian design meets modern infographic."
        ),
        "color_guidance": "Limited palette of 3-4 harmonious colors with one accent color.",
    },
    "Photographic": {
        "description": "Editorial photography style",
        "direction": (
            "Create a photorealistic image that looks like an editorial photograph "
            "from a premium business magazine. Use cinematic lighting with soft "
            "bokeh, natural color grading, and professional composition following "
            "the rule of thirds. The image should feel authentic and aspirational."
        ),
        "color_guidance": "Natural, warm tones with professional color grading.",
    },
}

VARIANT_INSTRUCTIONS = [
    "Use a wide, panoramic composition showing the concept at a macro level.",
    "Focus on a close-up, detailed view of the most important aspect of this concept.",
]


def _build_prompt(topic: str, style: str, post_summary: str, variant: str) -> str:
    config = STYLE_CONFIGS.get(style, STYLE_CONFIGS["Modern 3D"])
    return (
        f"You are an expert visual designer creating a LinkedIn post image.\n\n"
        f"TOPIC: {topic}\n"
        f"FULL POST CONTENT:\n{post_summary}\n\n"
        f"Read the post above carefully. The image MUST directly illustrate the specific ideas, "
        f"arguments, or story in this post — not just the general topic.\n\n"
        f"VISUAL STYLE: {config['description']}\n"
        f"CREATIVE DIRECTION: {config['direction']}\n"
        f"COLOR GUIDANCE: {config['color_guidance']}\n\n"
        f"COMPOSITION: {variant}\n\n"
        f"REQUIREMENTS:\n"
        f"- The image must represent the SPECIFIC message of the post, not a generic illustration of the topic\n"
        f"- Include bold, readable text or a key phrase from the post as typography in the image\n"
        f"- The text should be a short headline (3-8 words) that captures the post's main takeaway\n"
        f"- If the post mentions specific technologies, frameworks, or tools — include their recognizable logos or icons\n"
        f"- If the post makes a comparison or discusses before/after impact, show a visual side-by-side or transformation depicting the contrast\n"
        f"- DO NOT include any watermarks\n"
        f"- Make it scroll-stopping — it should grab attention in a LinkedIn feed\n"
        f"- Maintain professional quality suitable for business social media\n"
        f"- Aspect ratio: landscape (1200x627 LinkedIn recommended)\n"
    )


async def _generate_image_async(prompt: str) -> bytes | None:
    client = genai.Client(api_key=settings.google_api_key)
    try:
        response = await client.aio.models.generate_content(
            model=settings.image_gen_model,
            contents=prompt,
            config=types.GenerateContentConfig(
                response_modalities=["IMAGE"],
            ),
        )
        if (
            response.candidates
            and response.candidates[0].content
            and response.candidates[0].content.parts
        ):
            for part in response.candidates[0].content.parts:
                if part.inline_data and part.inline_data.data:
                    return part.inline_data.data
    except Exception as e:
        logger.error(f"Image generation failed: {e}")
    return None


async def _process_image(img_bytes: bytes) -> dict:
    key = await upload_image(img_bytes)
    url = get_presigned_url(key)

    img = Image.open(BytesIO(img_bytes))
    img.thumbnail((400, 225))
    thumb_buffer = BytesIO()
    img.save(thumb_buffer, format="PNG")
    thumb_key = await upload_image(thumb_buffer.getvalue())
    thumb_url = get_presigned_url(thumb_key)

    return {"url": url, "thumbnail_url": thumb_url}


async def generate_images(topic: str, style: str, post_summary: str) -> list[dict]:
    prompts = [
        _build_prompt(topic, style, post_summary, variant)
        for variant in VARIANT_INSTRUCTIONS
    ]

    image_bytes_list = await asyncio.gather(
        *[_generate_image_async(p) for p in prompts]
    )

    results = []
    for img_bytes in image_bytes_list:
        if img_bytes:
            result = await _process_image(img_bytes)
            results.append(result)

    return results
