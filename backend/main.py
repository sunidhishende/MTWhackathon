from fastapi import FastAPI, Request
from contextlib import asynccontextmanager
from src.config.db import connect_to_neo4j, disconnect_from_neo4j
from fastapi.middleware.cors import CORSMiddleware
import uvicorn


@asynccontextmanager
async def lifespan(app: FastAPI):
    try:
        await connect_to_neo4j()
        yield
    finally:
        await disconnect_from_neo4j()


app = FastAPI(title="NPCI Hackathon", lifespan=lifespan)


@app.get("/")
async def read_root(request: Request):
    return {"message": "Hello World"}


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
