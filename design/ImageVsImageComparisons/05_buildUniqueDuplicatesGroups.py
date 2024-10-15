import csv

# File paths
input_csv = "E:/EldenTex/design/ImageVsImageComparisons/sorted_mean_distance_a.csv"
output_csv = "E:/EldenTex/design/ImageVsImageComparisons/uniquely_grouped_duplicates.csv"

# Function to process and filter unique entries
def filter_unique_entries(input_file, output_file):
    data = []
    dropped_non_uniques = 0  # Counter for dropped non-unique entries
    seen_global = set()  # To track seen entries across all rows

    # Read the input CSV
    with open(input_file, mode='r', newline='') as infile:
        csv_reader = csv.reader(infile)
        for row in csv_reader:
            if row:  # Ensure the row is not empty
                data.append(row[1:])  # Ignore column A and keep the rest

    unique_entries = []

    # Find unique entries across all rows
    for row in data:
        unique_row = []
        seen_local = set()  # To track seen entries in the current row

        for entry in row:
            if entry not in seen_global and entry not in seen_local:
                seen_global.add(entry)  # Add to global seen set
                seen_local.add(entry)    # Add to local seen set
                unique_row.append(entry)  # Keep unique entry
            else:
                dropped_non_uniques += 1  # Increment the counter for duplicates

        if len(unique_row) > 1:  # Only keep rows with 2 or more unique entries
            unique_entries.append(unique_row)

    # Write the unique entries to the output CSV
    with open(output_file, mode='w', newline='') as outfile:
        csv_writer = csv.writer(outfile)
        for unique_row in unique_entries:
            csv_writer.writerow(unique_row)

    if dropped_non_uniques > 0:
        print(f"{dropped_non_uniques} non-unique entries dropped.")

    print(f"Unique entries written to {output_file}.")

# Execute the filtering function
filter_unique_entries(input_csv, output_csv)
