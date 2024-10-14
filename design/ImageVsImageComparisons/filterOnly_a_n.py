import csv

# Input and output file paths
input_csv = "image_comparison_results.csv"
output_csv = "image_comparison_filtered.csv"

# Define the endings to filter by
valid_endings = ("_a_l.png", "_n_l.png")
suffix_to_remove = "_l.png"

# Open the input CSV and create the filtered output CSV
with open(input_csv, mode='r', newline='') as infile, open(output_csv, mode='w', newline='') as outfile:
    csv_reader = csv.reader(infile)
    csv_writer = csv.writer(outfile)

    for row in csv_reader:
        # Check if the first column ends with the valid endings
        if row and row[0].endswith(valid_endings):
            # Skip rows where only column A has an entry (len(row) > 1 ensures there's more than one entry)
            if len(row) > 1:
                # Remove the suffix "_l.png" from all entries in the row
                modified_row = [entry.replace(suffix_to_remove, "") for entry in row]
                csv_writer.writerow(modified_row)

print(f"Filtered and modified rows written to {output_csv}.")
