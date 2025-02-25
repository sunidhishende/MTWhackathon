from neo4j import GraphDatabase
import os

uri = os.getenv("NEO4J_URI")
username = os.getenv("NEO4J_USER")
password = os.getenv("NEO4J_PASSWORD")

driver = GraphDatabase.driver(uri, auth=(username, password))


def connect_to_neo4j():
    """
    Connect to the Neo4j database using the provided credentials.

    Args:
        uri (str): The URI of the Neo4j instance (e.g., "bolt://localhost:7687").
        username (str): The username for authentication.
        password (str): The password for authentication.

    Returns:
        driver: An instance of the Neo4j driver.
    """
    try:
        # Optional: Test the connection with a simple query.
        with driver.session() as session:
            result = session.run("RETURN 1 AS test")
            print("Connection test:", result.single()["test"])
        print("Connected to Neo4j")
        return driver
    except Exception as e:
        print("Failed to connect to Neo4j:", e)
        return None


def disconnect_from_neo4j():
    """
    Disconnect from the Neo4j database by closing the driver.

    Args:
        driver: The Neo4j driver instance to close.
    """
    if driver:
        driver.close()
        print("Disconnected from Neo4j")
