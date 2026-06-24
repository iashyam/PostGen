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

async def generate_images(topic: str, style: str, post_summary: str) -> list[dict]:
    style_desc = STYLE_PROMPTS.get(style, STYLE_PROMPTS["Modern 3D"])
    prompt = (
        f"Create a professional illustration for a LinkedIn post about: {topic}. "
        f"Style: {style_desc}. "
        f"Context: {post_summary[:200]}. "
        f"Professional, clean, suitable for LinkedIn. No text overlay in the image. "
        f"16:9 aspect ratio, high quality."
    )

    client = genai.Client(api_key=settings.google_api_key)
    results = []

    # Generate 2 variants
    for _ in range(NUMBER_OF_VARIENTS):
        response = client.models.generate_images(
            model="imagen-3.0-generate-002",
            prompt=prompt,
            config=genai.types.GenerateImagesConfig(
                number_of_images=1,
                aspect_ratio="16:9",
            ),
        )

        if response.generated_images:
            img_bytes = response.generated_images[0].image.image_bytes

            # Upload full image
            key = await upload_image(img_bytes)
            url = get_presigned_url(key)

            # Create and upload thumbnail
            img = Image.open(BytesIO(img_bytes))
            img.thumbnail((400, 225))
            thumb_buffer = BytesIO()
            img.save(thumb_buffer, format="PNG")
            thumb_key = await upload_image(thumb_buffer.getvalue())
            thumb_url = get_presigned_url(thumb_key)

            results.append({"url": url, "thumbnail_url": thumb_url})

    return results
