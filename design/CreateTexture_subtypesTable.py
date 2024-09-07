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

# Drop the texture_subtypes table if it exists
cursor.execute('DROP TABLE IF EXISTS texture_subtypes')
print("Dropped existing 'texture_subtypes' table if it existed.")

# Create the texture_subtypes table with column names prefixed with underscores
cursor.execute('''
CREATE TABLE texture_subtypes (
    id INTEGER PRIMARY KEY,
    _a BOOLEAN DEFAULT 0,
    _n BOOLEAN DEFAULT 0,
    _r BOOLEAN DEFAULT 0,
    _v BOOLEAN DEFAULT 0,
    _d BOOLEAN DEFAULT 0,
    _em BOOLEAN DEFAULT 0,
    _3m BOOLEAN DEFAULT 0,
    _Billboards_a BOOLEAN DEFAULT 0,
    _Billboards_n BOOLEAN DEFAULT 0,
    _g BOOLEAN DEFAULT 0,
    _m BOOLEAN DEFAULT 0,
    _1m BOOLEAN DEFAULT 0,
    _van BOOLEAN DEFAULT 0,
    _vat BOOLEAN DEFAULT 0,
    _a_l BOOLEAN DEFAULT 0,
    _n_l BOOLEAN DEFAULT 0,
    _r_l BOOLEAN DEFAULT 0,
    _v_l BOOLEAN DEFAULT 0,
    _d_l BOOLEAN DEFAULT 0,
    _em_l BOOLEAN DEFAULT 0,
    _3m_l BOOLEAN DEFAULT 0,
    _Billboards_a_l BOOLEAN DEFAULT 0,
    _Billboards_n_l BOOLEAN DEFAULT 0,
    _g_l BOOLEAN DEFAULT 0,
    _m_l BOOLEAN DEFAULT 0,
    _1m_l BOOLEAN DEFAULT 0,
    _van_l BOOLEAN DEFAULT 0,
    _vat_l BOOLEAN DEFAULT 0,
    FOREIGN KEY(id) REFERENCES textures(id)
)
''')
print("Table 'texture_subtypes' created.")

# Fetch all texture IDs and names from the textures table
cursor.execute('SELECT id, name FROM textures')
textures = cursor.fetchall()

# Define the subtypes corresponding to the column names (all prefixed with _)
subtypes = [
    '_a', '_n', '_r', '_v', '_d', '_em', '_3m', '_Billboards_a', '_Billboards_n', '_g', '_m', '_1m', '_van', '_vat',
    '_a_l', '_n_l', '_r_l', '_v_l', '_d_l', '_em_l', '_3m_l', '_Billboards_a_l', '_Billboards_n_l', '_g_l', '_m_l', '_1m_l', '_van_l', '_vat_l'
]

# Iterate over each texture and populate the texture_subtypes table
for texture_id, texture_name in textures:
    subtype_values = {subtype: False for subtype in subtypes}  # Initialize all subtypes to False
    matched = False  # Flag to track if any file matches a subtype
    
    # Look for files matching the texture name and subtypes in the folder
    for filename in os.listdir(folder_path):
        if filename.startswith(texture_name):
            # Extract the subtype from the filename
            for subtype in subtypes:
                if filename.endswith(f'{subtype}.png'):
                    subtype_values[subtype] = True
                    matched = True
                    break  # Stop checking other subtypes for this file

    # If no files matched any subtype, print a message
    if not matched:
        print(f"No matching subtype found for file '{filename}' in texture '{texture_name}'.")

    # Insert or update the texture_subtypes table with the gathered data
    cursor.execute('''
        INSERT INTO texture_subtypes (id, {fields})
        VALUES (?, {placeholders})
        ON CONFLICT(id) DO UPDATE SET {updates}
    '''.format(
        fields=', '.join(subtype_values.keys()),
        placeholders=', '.join(['?'] * len(subtype_values)),
        updates=', '.join([f"{subtype} = ?" for subtype in subtype_values])
    ), [texture_id] + list(subtype_values.values()) + list(subtype_values.values()))

# Commit the transaction
conn.commit()
print("Database changes committed.")

# Close the connection
conn.close()
print("Connection closed.")
