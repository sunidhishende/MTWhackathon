from neo4j import AsyncGraphDatabase
import asyncpg

# uri = os.getenv("NEO4J_URI")
# username = os.getenv("NEO4J_USER")
# password = os.getenv("NEO4J_PASSWORD")

# print(uri, username, password)

driver = AsyncGraphDatabase.driver(
    "neo4j://192.168.51.53:7687", auth=("neo4j", "password")
)


async def connect_to_neo4j():
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
        async with driver.session() as session:
            result = await session.run("RETURN 1 AS test")
            result = await result.data()
            print("Connection test:", result)
        print("Connected to Neo4j")
        return driver
    except Exception as e:
        print("Failed to connect to Neo4j:", e)
        return None


async def disconnect_from_neo4j():
    """
    Disconnect from the Neo4j database by closing the driver.

    Args:
        driver: The Neo4j driver instance to close.
    """
    if driver:
        await driver.close()
        print("Disconnected from Neo4j")


async def connect_to_postgres():
    pool = await asyncpg.create_pool(
        user="your_user",
        password="your_password",
        database="your_database",
        host="localhost",
        port=5432,
    )
    print("Connected to PostgreSQL")
    return pool


async def disconnect_from_postgres(pool: asyncpg.pool.Pool):
    """
    Disconnect from PostgreSQL by closing the connection pool.

    Args:
        pool: The asyncpg connection pool to close.
    """
    await pool.close()
    print("Disconnected from PostgreSQL")
