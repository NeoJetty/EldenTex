import sqlite3
import json

# Database and JSON file paths
db_path = r'E:\EldenTex\8a2f6b3c9e4f7ab.db'
json_path = r'E:\EldenTex\design\FromTextureToMap\Maps.json'

# Load maps.json data
with open(json_path, 'r') as file:
    maps_data = json.load(file)['list']

# Create a dictionary for map_id to name lookup
map_lookup = {map_entry['id']: map_entry['name'] for map_entry in maps_data}

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Drop texture_to_map table if it exists
cursor.execute("DROP TABLE IF EXISTS texture_to_map")

# Create texture_to_map table
cursor.execute("""
CREATE TABLE texture_to_map (
    texture_id INTEGER NOT NULL,
    texture_type CHAR(20) NOT NULL,
    map_id TEXT NOT NULL,
    FOREIGN KEY (texture_id) REFERENCES textures(id)
)
""")

# Query texture_map to retrieve texture_id, texture_type, and map_id
cursor.execute("SELECT texture_id, texture_type, map_id FROM texture_map")
texture_maps = cursor.fetchall()

# Prepare the new table entries
for texture_id, texture_type, map_id in texture_maps:
    map_prefix = map_id[:6]  # Get the first 6 chars of the map_id
    if map_id in map_lookup:
        map_name = map_lookup[map_id][:20]  # Get the first 20 chars of the map name
        new_map_id = f"{map_prefix} - {map_name}"
    else:
        new_map_id = map_id

    # Insert into the texture_to_map table
    cursor.execute("""
        INSERT INTO texture_to_map (texture_id, texture_type, map_id) 
        VALUES (?, ?, ?)
    """, (texture_id, texture_type, new_map_id))

# Commit the changes and close the connection
conn.commit()
conn.close()
