from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from src.config.db import (
    connect_to_neo4j,
    disconnect_from_neo4j,
    connect_to_postgres,
    disconnect_from_postgres,
)
from fastapi.middleware.cors import CORSMiddleware
import uvicorn

from src.api.detection import detection_router
from src.api.transaction import transaction_router


@asynccontextmanager
async def lifespan(app: FastAPI):
    await connect_to_neo4j()
    yield
    await disconnect_from_neo4j()
    # app.state.pool = await connect_to_postgres()
    # yield
    # await disconnect_from_postgres(app.state.pool)


app = FastAPI(title="NPCI Hackathon", lifespan=lifespan)


@app.get("/")
async def read_root(request: Request):
    return {"message": "Hello World"}


app.include_router(detection_router, prefix="/api", tags=["detection"])
app.include_router(transaction_router, prefix="/api", tags=["detection"])

app.add_middleware(
    CORSMiddleware,
    allow_credentials=True,
    allow_origins=["*"],
    allow_methods=["*"],
    allow_headers=["*"],
)

if __name__ == "__main__":
    uvicorn.run(
        "main:app",
        host="0.0.0.0",
        port=8001,
        loop="uvloop",
        reload=True,
    )
