import sqlite3
import csv

# Paths
db_path = r'E:\EldenTex\8a2f6b3c9e4f7ab.db'
csv_path = r'E:\EldenTex\design\ImageVsImageComparisons\uniquely_grouped_duplicates_by_n.csv'
csv_path2 = r'E:\EldenTex\design\ImageVsImageComparisons\uniquely_grouped_duplicates_by_a.csv'

# Connect to the SQLite database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Step 1: Drop the existing table and create a new one with additional columns
cursor.execute('''DROP TABLE IF EXISTS textures_tracking_duplicates''')

cursor.execute('''
    CREATE TABLE IF NOT EXISTS textures_tracking_duplicates (
        id INTEGER PRIMARY KEY AUTOINCREMENT,
        name TEXT NOT NULL,
        copy_of_normal INTEGER DEFAULT 0,
        copy_of_albedo INTEGER DEFAULT 0
    )
''')

# Step 2: Populate the new table from the existing textures table
cursor.execute('''INSERT INTO textures_tracking_duplicates (name) SELECT name FROM textures''')
conn.commit()
print("Populated 'textures_tracking_duplicates' from 'textures'.")

# Step 3: Load CSV data for normal
with open(csv_path, newline='') as csvfile:
    csv_reader = csv.reader(csvfile)
    for row in csv_reader:
        if row:  # Ensure the row is not empty
            texture_name = row[0]  # First column is the name
            texture_name_clean = texture_name[:-2] 
            # Process all entries from Column B to END
            for similar_texture_name in row[1:]:
                # Remove the last 2 characters (_n) from similar_texture_name for the lookup
                similar_texture_name_cleaned = similar_texture_name[:-2]  

                # Get the texture ID for the cleaned texture_name
                cursor.execute('SELECT id FROM textures_tracking_duplicates WHERE name = ?', (similar_texture_name_cleaned,))
                texture_id = cursor.fetchone()
                
                if texture_id:
                    texture_id = texture_id[0]
                    # Update the new table with copy_of_normal
                    cursor.execute('UPDATE textures_tracking_duplicates SET copy_of_normal = ? WHERE name = ?', (texture_id, similar_texture_name_cleaned))
                    print(f"Updated copy_of_normal for '{similar_texture_name_cleaned}' to {texture_id}.")

# Commit changes to the database
conn.commit()
print("Database updates completed.")


# Step 4: Load CSV data for albedo
with open(csv_path2, newline='') as csvfile:
    csv_reader = csv.reader(csvfile)
    for row in csv_reader:
        if row:  # Ensure the row is not empty
            texture_name = row[0]  # First column is the name
            texture_name_clean = texture_name[:-2] 
            # Process all entries from Column B to END
            for similar_texture_name in row[1:]:
                # Remove the last 2 characters (_n) from similar_texture_name for the lookup
                similar_texture_name_cleaned = similar_texture_name[:-2]  

                # Get the texture ID for the cleaned texture_name
                cursor.execute('SELECT id FROM textures_tracking_duplicates WHERE name = ?', (similar_texture_name_cleaned,))
                texture_id = cursor.fetchone()
                
                if texture_id:
                    texture_id = texture_id[0]
                    # Update the new table with copy_of_normal
                    cursor.execute('UPDATE textures_tracking_duplicates SET copy_of_albedo = ? WHERE name = ?', (texture_id, similar_texture_name_cleaned))
                    print(f"Updated copy_of_albedo for '{similar_texture_name_cleaned}' to {texture_id}.")

# Commit changes to the database
conn.commit()
print("Database updates completed2.")

# Close the database connection
conn.close()
