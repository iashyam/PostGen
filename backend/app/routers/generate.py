import json

from fastapi import APIRouter
from fastapi.responses import StreamingResponse

from app.models.post import GenerateImageRequest, GeneratePostRequest, ImageResponse
from app.services.image_service import generate_images
from app.services.langgraph_chain import generate_post_stream

router = APIRouter()


@router.post("/generate-post")
async def generate_post(request: GeneratePostRequest):
    async def event_stream():
        async for event in generate_post_stream(
            topic=request.topic,
            key_points=request.key_points,
            tone=request.tone,
            length=request.length,
        ):
            yield f"data: {json.dumps(event)}\n\n"

    return StreamingResponse(event_stream(), media_type="text/event-stream")


@router.post("/generate-image", response_model=list[ImageResponse])
async def generate_image(request: GenerateImageRequest):
    images = await generate_images(
        topic=request.topic,
        style=request.style,
        post_summary=request.post_summary,
    )
    return images
