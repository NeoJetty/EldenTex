// tagContainerBuilder.js

/**
 * Fetches tags from the server and populates the specified container with checkboxes and labels.
 * @param {string} containerSelector - The CSS selector of the container to populate with tags.
 */
function populateTags(containerSelector) {
    // Fetch all tags from the server
    fetch('/allTags')
        .then(response => response.json())
        .then(data => {
            // Get the tag container element where the checkboxes will go
            const tagContainer = document.querySelector(containerSelector);

            if (!tagContainer) {
                console.error('Error: Container element not found.');
                return;
            }

            // Clear existing content
            tagContainer.innerHTML = '';

            // Iterate over each tag and create checkbox + label
            data.tags.forEach(tag => {
                // Create checkbox element
                const checkbox = document.createElement('input');
                checkbox.type = 'checkbox';
                checkbox.id = `tag-${tag.id}`;
                checkbox.value = tag.id;
                checkbox.classList.add('tag-checkbox');

                // Create label element
                const label = document.createElement('label');
                label.htmlFor = `tag-${tag.id}`;
                label.textContent = `${tag.name} (${tag.category})`;

                // Append the checkbox and label to the container
                tagContainer.appendChild(checkbox);
                tagContainer.appendChild(label);

                // Optionally add a line break for formatting
                tagContainer.appendChild(document.createElement('br'));
            });
        })
        .catch(error => {
            console.error('Error fetching tags:', error);
        });
}

export { populateTags };
