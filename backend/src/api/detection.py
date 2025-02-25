from fastapi import APIRouter, Request
from pydantic import BaseModel
from src.config.db import driver
import requests
from fastapi.responses import JSONResponse
from starlette import status


class DetectionRequest(BaseModel):
    month: str


detection_router = APIRouter(prefix="/detection")


@detection_router.post("/inference")
async def inference(request: Request, detection_request: DetectionRequest):
    """
    Perform inference on the provided transaction ID.
    """
    try:
        transaction_id = detection_request.transaction_id
        # send request to inference service
        response = requests.post(
            "http://inference:8002/inference",
            json={"transaction_id": transaction_id},
        )

    except Exception as e:
        pass
