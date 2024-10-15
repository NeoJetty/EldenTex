import csv

# File paths
input_csv = "E:/EldenTex/design/ImageVsImageComparisons/filtered_mean_distance.csv"
output_csv = "E:/EldenTex/design/ImageVsImageComparisons/sorted_mean_distance_n.csv"

# Function to process and filter the CSV
def process_and_sort_csv(input_file, output_file):
    data = []

    # Read the input CSV
    with open(input_file, mode='r', newline='') as infile:
        csv_reader = csv.reader(infile)
        for row in csv_reader:
            if row:  # Ensure the row is not empty
                data.append(row)

    # Sort the data by the distance in column A (convert to float for sorting)
    data.sort(key=lambda x: float(x[0]))

    # Filter and write to output CSV
    with open(output_file, mode='w', newline='') as outfile:
        csv_writer = csv.writer(outfile)
        for row in data:
            # Check if any entry in column B ends with '_a_l.png'
            filtered_row = [entry.replace("_l.png", "") for entry in row[1:] if entry.endswith("_n_l.png")]
            if filtered_row:  # Only write rows that have valid entries
                csv_writer.writerow([row[0]] + filtered_row)  # Include distance in the first column

    print(f"Sorted data written to {output_file}.")

# Execute the processing function
process_and_sort_csv(input_csv, output_csv)
