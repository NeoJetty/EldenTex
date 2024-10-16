import csv
import sys
import os
import json
import sqlite3

def load_csv_to_dict(file_path, key_col_index, value_col_indices=None):
    """ Load a CSV file into a dictionary using a specified column as the key. """
    result = {}
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            reader = csv.reader(file)
            for row in reader:
                key = row[key_col_index]
                if value_col_indices is None:
                    result[key] = row[1:]  # Store the rest of the row as the value (excluding the key column)
                else:
                    result[key] = [row[i] for i in value_col_indices]
    except Exception as e:
        print(f"Error loading CSV file {file_path}: {e}")
    return result

def load_json(file_path):
    """ Load a JSON file and return a dictionary mapping IDs to names. """
    result = {}
    try:
        with open(file_path, mode='r', encoding='utf-8') as file:
            data = json.load(file)
            for entry in data.get("list", []):
                result[entry["id"]] = entry["name"]
    except Exception as e:
        print(f"Error loading JSON file {file_path}: {e}")
    return result

def find_material_by_texture(texture_filename, tif_to_material_dict):
    """ Find the material name associated with a given texture filename. """
    for material, textures in tif_to_material_dict.items():
        if texture_filename in textures:
            return material
    return None

def find_models_by_material(material, material_to_aeg_dict):
    """ Find all AEG models associated with a given material and prepend 'AEG' to each model ID. """
    models = []
    dummy_status = []
    for model_id, materials in material_to_aeg_dict.items():
        if material in materials:
            is_dummy = 'Dummy' in materials  # Check if 'Dummy' is present in column F (index 5)
            models.append(model_id)  # Prepend 'AEG' to the model ID
            dummy_status.append((f"{model_id}", is_dummy))
    return models, dummy_status

def find_maps_by_model(models, aeg_to_map_dict):
    """ Find all maps associated with the given AEG models, allowing for suffix variations in model IDs. """
    maps = set()
    for model in models:
        for name_tag, map_id in aeg_to_map_dict.items():
            if name_tag.startswith(model):
                maps.add(map_id[0])  # Add the map ID to the set
    return list(maps)

def insert_texture_to_map_db(db_path, texture, map_id):
    """Insert the texture, its type, and map into the database."""
    try:
        conn = sqlite3.connect(db_path)
        cursor = conn.cursor()

        # Ensure the table exists
        cursor.execute('''
            CREATE TABLE IF NOT EXISTS texture_map (
                texture_id TEXT NOT NULL,
                texture_type TEXT NOT NULL,
                map_id TEXT NOT NULL
            )
        ''')

        texture_name_split = texture.split('_')
        texture_name = texture_name_split[0] + '_' + texture_name_split[1]
        texture_type = texture_name_split[2][:-4]

        # Insert into the database
        cursor.execute('''
            INSERT INTO texture_map (texture_id, texture_type, map_id) 
            VALUES (?, ?, ?)
        ''', (texture_id, texture_type, map_id))

        conn.commit()
    except sqlite3.Error as e:
        print(f"Database error: {e}")
    finally:
        conn.close()

def process_all_textures(base_dir, db_path):
    # Define the paths to CSV and JSON files
    tif_to_material_csv = os.path.join(base_dir, 'tifFileToMaterial.csv')
    material_to_aeg_csv = os.path.join(base_dir, 'MaterialToAEG.csv')
    aeg_to_map_csv = os.path.join(base_dir, 'AEGToMap.csv')
    map_json = os.path.join(base_dir, 'Maps.json')

    # Load all CSV files into dictionaries
    tif_to_material_dict = load_csv_to_dict(tif_to_material_csv, 0)
    material_to_aeg_dict = load_csv_to_dict(material_to_aeg_csv, 0)
    aeg_to_map_dict = load_csv_to_dict(aeg_to_map_csv, 1, [0])  # Load with Name Tag as key and Map ID as value

    # Load the JSON file for map names
    map_dict = load_json(map_json)

    # Iterate through all textures in tif_to_material_dict
    for material_id, textures in tif_to_material_dict.items():
        

        for texture in textures:
            if texture.startswith('AET'):
                print(f"Processing texture file: {texture}")
        # Find the material associated with the given texture filename
                material = material_id

                # Find all AEG models associated with that material
                models, dummy_status = find_models_by_material(material, material_to_aeg_dict)
                if not models:
                    print(f"No AEG models found for material {material}.")
                    continue

                # Find all maps associated with those AEG models
                map_ids = find_maps_by_model(models, aeg_to_map_dict)
                if not map_ids:
                    print(f"No maps found for models: {', '.join(models)}.")
                    continue

                # For each map found, insert into the database
                for map_id in map_ids:
                    map_name = map_dict.get(map_id, "Unknown Map")
                    print(f"Inserting: Texture ID: {texture}, Map ID: {map_id}")
                    insert_texture_to_map_db(db_path, texture, map_id)

base_dir = r"E:\EldenTex\design\FromTextureToMap"
db_path = r'E:\EldenTex\8a2f6b3c9e4f7ab.db'

# Process all textures and insert data into the database
process_all_textures(base_dir, db_path)
