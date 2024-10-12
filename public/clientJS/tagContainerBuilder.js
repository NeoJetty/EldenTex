// tagContainerBuilder.js

/**
 * Fetches tags from the server and populates the specified container with checkboxes and labels.
 * 
 * @param {HTMLElement} tagContainer - The container element (usually a <div>) where the tags will be populated.
 * @returns {void}
 */
function populateTags(tagContainer) {
    // Fetch all tags from the server
    fetch('/allTags')
        .then(response => response.json())
        .then(data => {

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
