import sqlite3
import pandas as pd

# Path to the database and CSV file
db_path = r'E:\EldenTex\8a2f6b3c9e4f7ab.db'
csv_path = 'design/Tags_InitialTags.csv'

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create the tables
cursor.execute('''
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS tags_aggregate (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_id INTEGER NOT NULL,
    texture_id INTEGER NOT NULL,
    vote_count INTEGER NOT NULL,
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    FOREIGN KEY(texture_id) REFERENCES textures(id)
)
''')

cursor.execute('''
CREATE TABLE IF NOT EXISTS tags_per_user (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    vote BOOLEAN NOT NULL, 
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
)
''')


# Read the CSV file
df = pd.read_csv(csv_path)

current_group = None

for index, row in df.iterrows():
    
    group = row.iloc[0]
    name = row.iloc[1]

    if isinstance(group, str):
        current_group = group

    cursor.execute('''
        INSERT INTO tags (name, category)
        VALUES (?, ?)
    ''', (name, current_group))

# Commit the changes and close the connection
conn.commit()
conn.close()

print("Tables created and data populated successfully.")