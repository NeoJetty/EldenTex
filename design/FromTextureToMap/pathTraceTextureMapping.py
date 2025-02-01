from PIL import Image
from soulstruct.eldenring.models.flver import FLVER
import os
import math

image_scale = 1000

def draw_line_from_last_to_new_point(lastX, lastY, x, y, image):
    # Bresenham's Line Algorithm to draw a line from (lastX, lastY) to (x, y)
    dx = abs(x - lastX)
    dy = abs(y - lastY)
    sx = 1 if lastX < x else -1
    sy = 1 if lastY < y else -1
    err = dx - dy

    while True:
        if lastX >= image.width or lastY >= image.height:
            break
        
        image.putpixel((lastX, lastY), 1)  # Mark the pixel

        # If the end point is reached, break
        if lastX == x and lastY == y:
            break

        # Calculate the error term and update coordinates
        e2 = 2 * err
        if e2 > -dy:
            err -= dy
            lastX += sx
        if e2 < dx:
            err += dx
            lastY += sy

def create_image_from_vertices(file_path, image_width=image_scale*2, image_height=image_scale):
    try:
        print(f"Parsing {file_path}...\n")
        flver = FLVER.from_path(file_path)

        # Create a new image with a black background
        image = Image.new("L", (image_width, image_height), color=0)  # "L" mode is for grayscale

        # Get the submesh and vertex array
        submesh = flver.submeshes[2]
        vertex_array = submesh.vertex_arrays[0]

        # Initialize the first vertex (lastX, lastY)
        lastX = int(vertex_array.array[0][5][0] * image_width)  # Scale to image width
        lastY = int(vertex_array.array[0][5][1] * image_height)  # Scale to image height

        # Assuming the structure is a single face or polygon
        for vertex in vertex_array.array:
            # Translate x, y coordinates to the image size
            x, y = vertex[5]  # Assuming x is at index 0 and y is at index 1
            
            # Scale x and y to the image size
            x_scaled = int(x * image_scale)
            y_scaled = int(y * image_scale)
            
            # Calculate the distance between the last and current point
            distance = math.sqrt((x_scaled - lastX)**2 + (y_scaled - lastY)**2)
            
            if distance > image_scale/4:
                # If the distance is greater than 100, only draw the current point
                image.putpixel((x_scaled, y_scaled), 255)  # Mark the current point
            else:
                # Otherwise, draw a line from the last point to the current one
                draw_line_from_last_to_new_point(lastX, lastY, x_scaled, y_scaled, image)
            
            # Update the last point
            lastX = x_scaled
            lastY = y_scaled
        
        # Now apply the thresholding (if value > 0, set to 255, else 0)
        for y in range(image_height):
            for x in range(image_width):
                pixel_value = image.getpixel((x, y))
                if pixel_value > 0:  # More pixels should be white
                    image.putpixel((x, y), 255)  # Set to white (255)
                else:
                    image.putpixel((x, y), 0)  # Set to black (0)

        # Save the image
        image.save("output_image.png")
        print(f"Image saved as 'output_image.png'.")
    
    except Exception as e:
        print(f"An error occurred while parsing {file_path}: {e}")

def crawl_directory_for_flver(directory):
    for filename in os.listdir(directory):
        if filename.endswith(".flver"):
            file_path = os.path.join(directory, filename)
            create_image_from_vertices(file_path)

# Define the directory containing the .flver files
directory_path = "c:/EldenMod/Data/AEG"

# Call the function
crawl_directory_for_flver(directory_path)
