import os
import csv
import shutil

# Define the directory containing the images
source_directory = r"E:\EldenTex\public\AllAET_PNG"

# CSV file with the image comparison results
input_csv = "image_comparison_results.csv"

# Function to create a folder and copy files
def copy_images_to_folder(row):
    # The first entry in the row should be the _r_l.png file
    main_file = row[0]
    
    # Extract the folder name by removing the ".png" extension
    folder_name = os.path.splitext(main_file)[0]

    # Create the folder in the current directory (where the script is run)
    if not os.path.exists(folder_name):
        os.makedirs(folder_name)

    # Copy each file listed in the row to the new folder
    for file_name in row:
        source_path = os.path.join(source_directory, file_name)
        destination_path = os.path.join(folder_name, file_name)
        
        try:
            shutil.copy(source_path, destination_path)
            print(f"Copied {file_name} to {folder_name}")
        except FileNotFoundError:
            print(f"File {file_name} not found in source directory, skipping.")

# Open the CSV file and process each row
with open(input_csv, mode='r', newline='') as csvfile:
    csv_reader = csv.reader(csvfile)
    
    for row in csv_reader:
        # Check if the first file in the row ends with '_r_l.png' and there are multiple entries
        if row and row[0].endswith('_r_l.png') and len(row) > 1:
            copy_images_to_folder(row)

print("Copying process completed.")
