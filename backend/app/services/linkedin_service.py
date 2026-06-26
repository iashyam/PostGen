import httpx


async def fetch_managed_pages(access_token: str) -> list[dict]:
    headers = {
        "Authorization": f"Bearer {access_token}",
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
    }
    async with httpx.AsyncClient() as client:
        resp = await client.get(
            "https://api.linkedin.com/rest/organizationAcls?q=roleAssignee&role=ADMINISTRATOR&projection=(elements*(organization~(id,localizedName,logoV2(original~:playableStreams))))",
            headers=headers,
        )
        if resp.status_code != 200:
            return []

        pages = []
        for element in resp.json().get("elements", []):
            org = element.get("organization~", {})
            pages.append({
                "org_id": str(org.get("id", "")),
                "name": org.get("localizedName", ""),
            })
        return pages


async def post_to_linkedin(
    access_token: str,
    linkedin_id: str,
    content: str,
    image_url: str | None = None,
    org_id: str | None = None,
) -> dict:
    headers = {
        "Authorization": f"Bearer {access_token}",
        "Content-Type": "application/json",
        "LinkedIn-Version": "202401",
        "X-Restli-Protocol-Version": "2.0.0",
    }

    if org_id:
        author = f"urn:li:organization:{org_id}"
    else:
        author = f"urn:li:person:{linkedin_id}"

    post_body: dict = {
        "author": author,
        "lifecycleState": "PUBLISHED",
        "visibility": "PUBLIC",
        "commentary": content,
        "distribution": {
            "feedDistribution": "MAIN_FEED",
        },
    }

    if image_url:
        # Step 1: Register image upload
        async with httpx.AsyncClient() as client:
            register_resp = await client.post(
                "https://api.linkedin.com/rest/images?action=initializeUpload",
                headers=headers,
                json={
                    "initializeUploadRequest": {
                        "owner": author,
                    }
                },
            )
            if register_resp.status_code != 200:
                raise Exception(f"Failed to register image upload: {register_resp.text}")

            upload_data = register_resp.json()["value"]
            upload_url = upload_data["uploadUrl"]
            image_urn = upload_data["image"]

            # Step 2: Download image from S3 and upload to LinkedIn
            img_resp = await client.get(image_url)
            await client.put(
                upload_url,
                content=img_resp.content,
                headers={
                    "Authorization": f"Bearer {access_token}",
                    "Content-Type": "image/png",
                },
            )

            # Step 3: Attach image to post
            post_body["content"] = {
                "media": {
                    "id": image_urn,
                }
            }

    # Create post
    async with httpx.AsyncClient() as client:
        resp = await client.post(
            "https://api.linkedin.com/rest/posts",
            headers=headers,
            json=post_body,
        )
        if resp.status_code not in (200, 201):
            raise Exception(f"Failed to post to LinkedIn: {resp.text}")

        post_id = resp.headers.get("x-restli-id", "")
        return {
            "success": True,
            "post_id": post_id,
            "post_url": f"https://www.linkedin.com/feed/update/{post_id}",
        }
