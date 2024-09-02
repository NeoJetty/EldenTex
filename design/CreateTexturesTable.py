import os
import sqlite3

# Path to the SQLite database
db_path = r'E:\EldenTex\8a2f6b3c9e4f7ab.db'
print(f"Using database: {db_path}")

# Path to the folder with the files
folder_path = r'E:\EldenTex\public\AllAET_PNG'

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create the textures table
cursor.execute('''
CREATE TABLE IF NOT EXISTS textures (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name TEXT NOT NULL
)
''')
print("Table 'textures' created or verified.")

# Initialize last_name to None
last_name = None

# Iterate over the files in the directory alphabetically
for filename in sorted(os.listdir(folder_path)):
    if filename.endswith('.png'):  # Ensure we're only looking at PNG files
        current_name = filename[:10]  # Get the first 10 characters
        #print(f"Processing file: {filename}, extracted name: {current_name}")
        
        if current_name != last_name:  # Check if the current name differs from the last
            # Insert into the database
            cursor.execute('INSERT INTO textures (name) VALUES (?)', (current_name,))
            #print(f"Inserted '{current_name}' into the database.")
            last_name = current_name  # Update the last_name to the current one

# Commit the transaction
conn.commit()
print("Database changes committed.")

# Check how many rows are in the textures table
cursor.execute('SELECT COUNT(*) FROM textures')
row_count = cursor.fetchone()[0]
print(f"Total rows in 'textures' table: {row_count}")

# Close the connection
conn.close()
print("Connection closed.")
