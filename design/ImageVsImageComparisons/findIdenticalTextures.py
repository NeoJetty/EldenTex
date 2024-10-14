# if an AEG is in multiple regions, the same texture will be multiple times in the data files.
# to reduce the amount of work for the texture analyst, we will try to find the duplicates here

import os
import imagehash
from PIL import Image
import csv

# Define the directory and the target ending for comparison
directory = r"E:\EldenTex\public\AllAET_PNG"
target_ending = "_l.png"
output_csv = "image_comparison_results.csv"
processed_files = 0  # Counter for processed files in the current session

# Function to find the last processed file in the CSV
def find_last_processed_file():
    try:
        with open(output_csv, mode='r', newline='') as csvfile:
            csv_reader = csv.reader(csvfile)
            last_row = None
            for row in csv_reader:
                if row and row[0].endswith(target_ending):
                    last_row = row
            return last_row[0] if last_row else None
    except FileNotFoundError:
        # If the file doesn't exist, we start from scratch
        return None

# Function to append rows to the CSV file
def append_row_to_csv(row):
    with open(output_csv, mode='a', newline='') as csvfile:
        csv_writer = csv.writer(csvfile)
        csv_writer.writerow(row)

# Function to load and hash all relevant images once
def load_and_hash_images():
    image_hashes = {}
    for filename in os.listdir(directory):
        if filename.endswith(target_ending):
            image_path = os.path.join(directory, filename)
            try:
                current_image = Image.open(image_path)
                current_hash = imagehash.average_hash(current_image)
                image_hashes[filename] = current_hash
                current_image.close()  # Always close image files to release resources
            except Exception as e:
                print(f"Error processing {filename}: {e}")
                continue
    return image_hashes

# Function to compare image hashes and find similar ones
def find_similar_images(image_hashes):
    for filename, current_hash in image_hashes.items():
        row = [filename]
        for compare_filename, compare_hash in image_hashes.items():
            if compare_filename == filename:
                continue

            # Compare hashes
            if current_hash - compare_hash < 5:  # Adjust threshold if needed
                row.append(compare_filename)

        # If similar images were found, append them to the CSV
        if len(row) > 1:
            append_row_to_csv(row)

# Resume from the last processed file
last_processed_file = find_last_processed_file()
print(f"Last processed file: {last_processed_file}")

# Load and hash all relevant images only once
image_hashes = load_and_hash_images()

# Perform comparisons using precomputed hashes
find_similar_images(image_hashes)

print("Comparison completed.")
