# Configuration
import pandas as pd
from neo4j import GraphDatabase
import time

# Configuration
NEO4J_URI = "bolt://192.168.51.53:7687"  # Update with your Neo4j connection details
NEO4J_USER = "neo4j"
NEO4J_PASSWORD = "password"
CSV_FILE = (
    "/home/bulbasaur/Downloads/card_transaction.v1.csv"  # Path to your large CSV file
)
BATCH_SIZE = 5000  # Number of rows per batch


def create_indexes(session):
    """Create necessary indexes for better performance"""
    print("Creating indexes...")
    queries = [
        "CREATE INDEX user_id IF NOT EXISTS FOR (u:User) ON (u.id)",
        "CREATE INDEX card_number_owner IF NOT EXISTS FOR (c:Card) ON (c.number, c.owner)",
        "CREATE INDEX merchant_name IF NOT EXISTS FOR (m:Merchant) ON (m.name)",
    ]

    for query in queries:
        session.run(query)
    print("Indexes created successfully")


def import_batch(session, batch_df):
    """Import a batch of records into Neo4j"""
    query = """
    UNWIND $batch AS row
    // Ensure the User node is created
    MERGE (u:User {id: row.User})
    // Create a Card node uniquely tied to a user
    MERGE (c:Card {number: row.Card, owner: row.User})
    MERGE (u)-[:OWNS]->(c)
    // Ensure the Merchant node is created
    MERGE (m:Merchant { 
      name: row.MerchantName, 
      city: row.MerchantCity, 
      state: COALESCE(row.MerchantState, "UNKNOWN"), 
      zip: COALESCE(row.Zip, "UNKNOWN"), 
      mcc: row.MCC 
    })
    // Create a Transaction node for each transaction
    CREATE (t:Transaction { 
      year: toInteger(row.Year), 
      month: toInteger(row.Month), 
      day: toInteger(row.Day), 
      time: row.Time, 
      amount: toFloat(row.Amount), 
      use_chip: row.UseChip, 
      errors: row.Errors, 
      is_fraud: toBoolean(row.IsFraud) 
    })
    // Create relationships
    MERGE (c)-[:USED_IN]->(t)
    MERGE (t)-[:AT]->(m)
    """

    # Convert the DataFrame to a list of dictionaries and clean column names
    batch_data = []
    for _, row in batch_df.iterrows():
        row_dict = {}
        for col in row.index:
            # Remove spaces and special characters from column names for Neo4j compatibility
            clean_col = "".join(c if c.isalnum() else "" for c in col)
            row_dict[clean_col] = row[col]
        batch_data.append(row_dict)

    # Execute batch import
    result = session.run(query, batch=batch_data)
    return result.consume().counters


def get_database_stats(session):
    """Get current statistics from the database"""
    queries = {
        "users": "MATCH (u:User) RETURN count(u) AS count",
        "cards": "MATCH (c:Card) RETURN count(c) AS count",
        "merchants": "MATCH (m:Merchant) RETURN count(m) AS count",
        "transactions": "MATCH (t:Transaction) RETURN count(t) AS count",
    }

    stats = {}
    for name, query in queries.items():
        result = session.run(query)
        stats[name] = result.single()["count"]

    return stats


def main():
    # Connect to Neo4j
    print(f"Connecting to Neo4j at {NEO4J_URI}")
    driver = GraphDatabase.driver(NEO4J_URI, auth=(NEO4J_USER, NEO4J_PASSWORD))

    # Create a reader for the CSV that reads in chunks
    print(f"Processing CSV file: {CSV_FILE} in batches of {BATCH_SIZE}")
    csv_reader = pd.read_csv(CSV_FILE, chunksize=BATCH_SIZE)

    with driver.session() as session:
        # Create indexes
        # create_indexes(session)

        # Process each batch
        batch_num = 1
        for batch_df in csv_reader:
            print(f"\nProcessing batch {batch_num} ({len(batch_df)} records)")
            start_time = time.time()

            counters = import_batch(session, batch_df)

            end_time = time.time()
            elapsed = end_time - start_time

            print(f"Batch {batch_num} completed in {elapsed:.2f} seconds")
            print(f"Nodes created: {counters.nodes_created}")
            print(f"Relationships created: {counters.relationships_created}")

            # Get database statistics after each batch
            stats = get_database_stats(session)
            print("\nCurrent Database Statistics:")
            for entity, count in stats.items():
                print(f"  {entity}: {count}")

            # Optional: pause to let user check data in Neo4j Browser
            user_input = input(
                "\nPress Enter to continue to next batch, or type 'q' to quit: "
            )
            if user_input.lower() == "q":
                break

            batch_num += 1

    # Clean up
    driver.close()
    print("\nImport process completed")


if __name__ == "__main__":
    main()
