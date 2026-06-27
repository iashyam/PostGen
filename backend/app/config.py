from pydantic_settings import BaseSettings


class Settings(BaseSettings):
    # AI
    google_api_key: str = ""
    gemini_model: str = "gemini-2.0-flash"
    imagen_model: str = "imagen-3.0-generate-002"

    # MongoDB
    mongodb_uri: str = "mongodb://localhost:27017"
    mongodb_db: str = "postgen"

    # AWS S3
    aws_access_key_id: str = ""
    aws_secret_access_key: str = ""
    aws_region: str = "us-east-1"
    s3_bucket: str = "postgen-images"

    # LinkedIn OAuth
    linkedin_client_id: str = ""
    linkedin_client_secret: str = ""
    linkedin_redirect_uri: str = "http://localhost:5173/auth/callback"

    # App
    secret_key: str = "change-me-to-a-random-string"
    frontend_url: str = "http://localhost:5173"

    model_config = {"env_file": ".env", "env_file_encoding": "utf-8"}


settings = Settings()
