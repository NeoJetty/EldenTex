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

# Function to compare images and find similar ones
def find_similar_images(filename, full_ending):
    row = [filename]
    current_image_path = os.path.join(directory, filename)
    current_image = Image.open(current_image_path)
    current_hash = imagehash.average_hash(current_image)

    # Compare the current file to others with the same full ending
    for compare_filename in os.listdir(directory):
        if compare_filename == filename or not compare_filename.endswith(full_ending):
            continue

        compare_image_path = os.path.join(directory, compare_filename)
        compare_image = Image.open(compare_image_path)
        compare_hash = imagehash.average_hash(compare_image)

        if current_hash - compare_hash < 5:  # Adjust threshold if needed
            row.append(compare_filename)

    return row

# Resume from the last processed file
last_processed_file = find_last_processed_file()
print(f"Last processed file: {last_processed_file}")

# Start iterating through files in the directory
resume = last_processed_file is None  # If no file found, start from the beginning

for filename in os.listdir(directory):
    # Stop if interrupted (Ctrl+C will raise KeyboardInterrupt)
    try:
        # Only process files ending with '_l.png'
        if not filename.endswith(target_ending):
            continue

        # Check if this is the last processed file and reprocess it
        if not resume and filename == last_processed_file:
            print(f"Reprocessing the last processed file: {filename}")
            # Parse the full ending of the file (e.g., '_n_l.png')
            name_parts = filename.split('_')
            full_ending = "_" + "_".join(name_parts[-2:])

            # Find similar images and append results to the CSV
            row = find_similar_images(filename, full_ending)
            append_row_to_csv(row)

            resume = True  # Once reprocessed, start fresh processing with the next file
            continue

        # If we haven't found the last processed file yet, keep looking
        if not resume:
            continue

        # Parse the full ending of the file (e.g., '_n_l.png')
        name_parts = filename.split('_')
        full_ending = "_" + "_".join(name_parts[-2:])

        print(f"Processing file {filename}")

        # Find similar images and append results to the CSV
        row = find_similar_images(filename, full_ending)
        append_row_to_csv(row)

        processed_files += 1
        print(f"Processed {processed_files} files...")

    except KeyboardInterrupt:
        print("Interrupted by user. Saving progress.")
        break

print("Comparison completed or interrupted.")
