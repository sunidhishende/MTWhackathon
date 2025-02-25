from fastapi import APIRouter, Request
from pydantic import BaseModel
from typing import Optional
from src.config.db import driver
from httpx import AsyncClient
from fastapi.responses import JSONResponse
from starlette import status


class DetectionRequest(BaseModel):
    year: int
    month: int
    day: int
    mcc: int
    time_of_day: str
    city: int
    Use_chip_labeled: int
    amount: float
    user_id: int
    card_id: int
    has_error: Optional[int] = None
    irs_reportable_labeled: Optional[int] = None
    irs_description_labeled: Optional[int] = None


detection_router = APIRouter(prefix="/detection")


@detection_router.post("/inference")
async def inference(request: Request, detection_request: DetectionRequest):
    """
    Perform inference on the provided transaction ID.
    """
    try:
        # send request to model api
        async with AsyncClient() as client:
            # response = await client.post(
            #     "http://model:8000/inference",
            #     json=detection_request.dict(),
            # )

            return JSONResponse(
                content={
                    "status": "success",
                    "data": {
                        "is_fraud": True,
                        "confidence": 0.99,
                    },
                },
                status_code=status.HTTP_200_OK,
            )

    except Exception as e:
        return JSONResponse(
            content={"error": str(e), "status": "error"},
            status_code=status.HTTP_500_INTERNAL_SERVER_ERROR,
        )
