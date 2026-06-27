import asyncio
from io import BytesIO

from google import genai
from PIL import Image

from app.config import settings
from app.services.s3_service import get_presigned_url, upload_image

STYLE_PROMPTS = {
    "Modern 3D": "3D rendered, soft lighting, glossy materials, floating objects, modern tech aesthetic",
    "Minimal": "Flat design, limited color palette, clean lines, whitespace, minimalist",
    "Isometric": "Isometric perspective, geometric shapes, technical illustration, clean angles",
    "Realistic": "Photorealistic, high quality, professional photography style, natural lighting",
}


NUMBER_OF_VARIENTS: int = 2


def _generate_image_sync(prompt: str) -> bytes | None:
    client = genai.Client(api_key=settings.google_api_key)
    response = client.models.generate_images(
        model=settings.imagen_model,
        prompt=prompt,
        config=genai.types.GenerateImagesConfig(
            number_of_images=1,
            aspect_ratio="16:9",
        ),
    )
    if response.generated_images:
        return response.generated_images[0].image.image_bytes
    return None


async def generate_images(topic: str, style: str, post_summary: str) -> list[dict]:
    style_desc = STYLE_PROMPTS.get(style, STYLE_PROMPTS["Modern 3D"])
    prompt = (
        f"Create a professional illustration for a LinkedIn post about: {topic}. "
        f"Style: {style_desc}. "
        f"Context: {post_summary[:200]}. "
        f"Professional, clean, suitable for LinkedIn. No text overlay in the image. "
        f"16:9 aspect ratio, high quality."
    )

    loop = asyncio.get_event_loop()
    results = []

    for _ in range(NUMBER_OF_VARIENTS):
        img_bytes = await loop.run_in_executor(None, _generate_image_sync, prompt)

        if img_bytes:
            key = await upload_image(img_bytes)
            url = get_presigned_url(key)

            img = Image.open(BytesIO(img_bytes))
            img.thumbnail((400, 225))
            thumb_buffer = BytesIO()
            img.save(thumb_buffer, format="PNG")
            thumb_key = await upload_image(thumb_buffer.getvalue())
            thumb_url = get_presigned_url(thumb_key)

            results.append({"url": url, "thumbnail_url": thumb_url})

    return results
