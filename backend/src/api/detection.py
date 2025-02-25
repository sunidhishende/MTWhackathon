from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional
from src.config.db import driver
from httpx import AsyncClient
from fastapi.responses import JSONResponse
from starlette import status


class DetectionRequest(BaseModel):
    month: str
    day: str
    mcc: str
    minutes_since_midnight: int
    city: str
    user_chip: str
    amount: str
    has_error: Optional[str] = None
    irs_reportable: Optional[str] = None
    irs_description: Optional[str] = None


detection_router = APIRouter(prefix="/detection")


@detection_router.post("/inference")
async def inference(request: Request, detection_request: DetectionRequest):
    """
    Perform inference on the provided transaction ID.
    """
    try:
        # send request to model api
        async with AsyncClient() as client:
            response = await client.post(
                "http://model:8000/inference",
                json=detection_request.dict(),
            )

            return JSONResponse(
                content={
                    "status": "success",
                    "data": response.json(),
                },
                status_code=status.HTTP_200_OK,
            )

    except Exception as e:
        return JSONResponse(
            content={"error": str(e), "status": "error"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
