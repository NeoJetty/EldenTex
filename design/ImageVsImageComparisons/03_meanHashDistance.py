import os
import imagehash
from PIL import Image
import csv

# Define the directory containing images and the target ending for comparison
directory = r"E:\EldenTex\public\AllAET_PNG"
target_ending = "_l.png"
input_csv = "E:/EldenTex/design/ImageVsImageComparisons/image_comparison_filtered.csv"
output_csv = "E:/EldenTex/design/ImageVsImageComparisons/filtered_mean_distance.csv"

# Function to compute hash of images
def hash_image(image_path):
    try:
        with Image.open(image_path) as img:
            return imagehash.average_hash(img)
    except Exception as e:
        print(f"Error processing {image_path}: {e}")
        return None

# Function to calculate mean distance between image hashes in a row
def calculate_mean_distance(image_hashes):
    distances = []
    for i in range(len(image_hashes)):
        for j in range(i + 1, len(image_hashes)):
            distance = image_hashes[i] - image_hashes[j]
            distances.append(distance)
    return sum(distances) / len(distances) if distances else 0

# Main script to read input CSV, process images, and write output CSV
with open(input_csv, mode='r', newline='') as infile, open(output_csv, mode='w', newline='') as outfile:
    csv_reader = csv.reader(infile)
    csv_writer = csv.writer(outfile)

    for row in csv_reader:
        if row:
            # Get the image names ending with '_l.png' in the current row
            image_hashes = []
            valid_images = []

            for entry in row:
                image_name = entry + target_ending  # Append the target ending
                image_path = os.path.join(directory, image_name)
                
                # Hash the image and collect its hash
                image_hash = hash_image(image_path)
                if image_hash is not None:
                    image_hashes.append(image_hash)
                    valid_images.append(image_name)

            # Calculate the mean hash distance for the row
            mean_distance = calculate_mean_distance(image_hashes)

            # Write the mean distance followed by the original row entries (excluding the first entry)
            csv_writer.writerow([mean_distance] + valid_images)

print(f"Filtered mean distances written to {output_csv}.")
