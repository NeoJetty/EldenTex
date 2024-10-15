import csv

csv_path = 'E:/EldenTex/design/ImageVsImageComparisons/'
# Input and output file paths
input_csv = "image_comparison_results.csv"
output_csv = "image_comparison_filtered.csv"

# Define the suffix to remove and valid endings
suffix_to_remove = "_l.png"
valid_endings = ("_a", "_n")

# Open the input CSV and create the filtered output CSV
with open(csv_path + input_csv, mode='r', newline='') as infile, open(csv_path + output_csv, mode='w', newline='') as outfile:
    csv_reader = csv.reader(infile)
    csv_writer = csv.writer(outfile)

    for row in csv_reader:
        if row:
            # Skip the row if any entry contains the word 'Billboard'
            if any('Billboard' in entry for entry in row):
                continue

            # Remove the suffix "_l.png" from all entries in the row first
            modified_row = [entry.replace(suffix_to_remove, "") for entry in row]

            # Now filter the entries to only keep those ending with '_a' or '_n'
            filtered_row = [entry for entry in modified_row if entry.endswith(valid_endings)]

            # Only write rows that have 2 or more entries after filtering
            if len(filtered_row) > 1:
                csv_writer.writerow(filtered_row)

print(f"Filtered and modified rows written to {csv_path + output_csv}.")
