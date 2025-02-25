from fastapi import APIRouter, Request
from pydantic import BaseModel
from src.config.db import driver
import requests
from fastapi.responses import JSONResponse
from neo4j import GraphDatabase
from starlette import status
NEO4J_URI = "bolt://192.168.51.53:7687"  # Update with your Neo4j connection details
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"

class UserRequest(BaseModel):
    user_id: int

transaction_router = APIRouter(prefix="/transaction")


@transaction_router.post("/all")
async def transaction():
    """
    Perform inference on the provided transaction ID.
    """
    try:
        query = """
        MATCH (u:User)-[:OWNS]->(c:Card)-[:USED_IN]->(t:Transaction)
        RETURN u.id AS user, c.number AS card, t
        ORDER BY t.year DESC, t.month DESC, t.day DESC, t.time DESC
        LIMIT 50
        """

        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

        with driver.session() as session:
            result = session.run(query)
            transactions = [{"user": record["user"], "card": record["card"], "transaction": record["t"]} for record in result]
        return transactions
    except Exception as e:
        print(e)

@transaction_router.post("/user")
async def user(req:UserRequest):
    user_id= req.user_id
    try:
        query = """
        MATCH (u:User {id: $user_id})-[:OWNS]->(c:Card)-[:USED_IN]->(t:Transaction)
        RETURN u.id AS user, c.number AS card, t
        ORDER BY t.year DESC, t.month DESC, t.day DESC, t.time DESC
        LIMIT 50
        """

        driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

        with driver.session() as session:
            result = session.run(query, user_id=user_id)
            transactions = [{"user": record["user"], "card": record["card"], "transaction": record["t"]} for record in result]
        return transactions
    except Exception as e:
        print(e)


