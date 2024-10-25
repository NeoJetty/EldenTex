const postData = {
    tags: [
        { tag_id: 1, vote: true },
        { tag_id: 2, vote: true },
        { tag_id: 4, vote: false }
    ],
    user_id: 1,
    search_name: 'Favourite'
};

fetch('http://localhost:3030/dbSaveTagSearches', {
    method: 'POST',
    headers: {
        'Content-Type': 'application/json'
    },
    body: JSON.stringify(postData)
})
    .then(response => response.json())
    .then(data => {
        console.log('Response:', data);
        // Optionally, display data as it would appear in the browser:
        document.body.innerHTML = `<pre>${JSON.stringify(data, null, 2)}</pre>`;
    })
    .catch(error => console.error('Error:', error));