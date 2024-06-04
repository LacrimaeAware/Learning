import psycopg2

# Database connection parameters
conn_params = {
    'dbname': 'esports',
    'user': 'postgres',
    'password': 'SteenEbonyPorn',  # replace with your actual password
    'host': 'localhost'
}

# Establishing the connection
conn = psycopg2.connect(**conn_params)
cursor = conn.cursor()

# Creating a table
cursor.execute("""
CREATE TABLE IF NOT EXISTS players (
    id SERIAL PRIMARY KEY,
    name VARCHAR(255),
    score INT
);
""")

# Inserting data
cursor.execute("""
INSERT INTO players (name, score) VALUES 
('Alice', 87),
('Bob', 92),
('Charlie', 78);
""")

# Committing changes
conn.commit()

# Closing the connection
cursor.close()
conn.close()

print("Database setup complete.")
