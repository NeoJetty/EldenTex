import sqlite3
import json

# Paths
db_path = r'E:\EldenTex\8a2f6b3c9e4f7ab.db'
json_file_path = r'E:\EldenTex\design\FromTextureToMap\Maps.json'

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Delete the table maps if it exists
cursor.execute("DROP TABLE IF EXISTS maps")

# Create the table maps with map_id (auto-increment unique), id, and name
cursor.execute('''
    CREATE TABLE maps (
        map_id INTEGER PRIMARY KEY AUTOINCREMENT,
        id TEXT UNIQUE NOT NULL,
        name TEXT NOT NULL
    )
''')

# Load the JSON data from the file
with open(json_file_path, 'r') as json_file:
    data = json.load(json_file)

# Insert the data from the JSON file, ignoring the 'tags' field
for item in data['list']:
    cursor.execute('''
        INSERT OR IGNORE INTO maps (id, name)
        VALUES (?, ?)
    ''', (item['id'], item['name']))

# Commit the changes and close the connection
conn.commit()
conn.close()
