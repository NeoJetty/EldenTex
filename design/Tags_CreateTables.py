import sqlite3
import pandas as pd

# Path to the database and CSV file
db_path = r'E:\EldenTex\8a2f6b3c9e4f7ab.db'
csv_path = 'design/Tags_InitialTags.csv'

# Connect to the database
conn = sqlite3.connect(db_path)
cursor = conn.cursor()

# Create the 'tags' table
cursor.execute('''
CREATE TABLE IF NOT EXISTS tags (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    name VARCHAR(20) NOT NULL,
    category VARCHAR(20) NOT NULL
)
''')

# Create the 'tags_aggregate' table
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

# Create the new 'tags_from_users' table without the 'vote' column
cursor.execute('''
CREATE TABLE IF NOT EXISTS tags_from_users (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    FOREIGN KEY(user_id) REFERENCES users(id)
)
''')

# Create the new 'tag_texture_associations' table with 'texture_id' and 'vote'
cursor.execute('''
CREATE TABLE IF NOT EXISTS tag_texture_associations (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    tag_id INTEGER NOT NULL,
    user_id INTEGER NOT NULL,
    texture_id INTEGER NOT NULL,
    vote BOOLEAN NOT NULL,
    FOREIGN KEY(tag_id) REFERENCES tags(id),
    FOREIGN KEY(user_id) REFERENCES users(id),
    FOREIGN KEY(texture_id) REFERENCES textures(id)
)
''')

# Create the table for favourite tag-filters/searches
cursor.execute('''
CREATE TABLE saved_tag_searches (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  user_id INTEGER NOT NULL,
  search_name TEXT NOT NULL,
  tag_filters JSON NOT NULL,  -- JSON string to store tag_id and vote pairs
  created_at DATETIME DEFAULT CURRENT_TIMESTAMP,
  FOREIGN KEY(user_id) REFERENCES users(id)
)
''')

# Check if the 'tags' table is empty
cursor.execute('SELECT COUNT(*) FROM tags')
tag_count = cursor.fetchone()[0]

# If the 'tags' table is empty, populate it from the CSV
if tag_count == 0:
    # Read the CSV file
    df = pd.read_csv(csv_path)

    # Insert tags into the 'tags' table
    current_group = None

    for index, row in df.iterrows():
        group = row.iloc[0]
        name = row.iloc[1]

        # Update current group when a new group is encountered
        if isinstance(group, str):
            current_group = group

        cursor.execute('''
            INSERT INTO tags (name, category)
            VALUES (?, ?)
        ''', (name, current_group))

    # Commit the changes
    conn.commit()
    print("Tags table populated successfully.")
else:
    print("Tags table already contains data. Skipping CSV insertion.")

# Close the connection
conn.close()
