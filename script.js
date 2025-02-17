

document.getElementById("searchBtn").addEventListener("click", () => {
    const query = document.getElementById("searchInput").value.trim();
    if (query) fetchBooks(query);
    else alert("Please enter a search term.");
});

function fetchBooks(query) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = `<p>Loading results for "${query}"...</p>`;

    fetch(`https://www.googleapis.com/books/v1/volumes?q=${encodeURIComponent(query)}`)
        .then(response => response.json())
        .then(data => {
            if (data.items) displayBooks(data.items);
            else resultsDiv.innerHTML = `<p>No results found for "${query}".</p>`;
        })
        .catch(err => {
            console.error(err);
            resultsDiv.innerHTML = `<p>There was an error. Try again later.</p>`;
        });
}

function displayBooks(books) {
    const resultsDiv = document.getElementById("results");
    resultsDiv.innerHTML = "";

    books.forEach(book => {
        const bookInfo = book.volumeInfo;
        const card = document.createElement("div");
        card.className = "book-card";

        card.innerHTML = `
            <img src="${bookInfo.imageLinks?.thumbnail || 'https://via.placeholder.com/150'}" alt="${bookInfo.title}">
            <h3>${bookInfo.title}</h3>
            <p>${bookInfo.authors?.join(", ") || "Unknown Author"}</p>
        `;

        card.addEventListener("click", () => showDetails(bookInfo));
        resultsDiv.appendChild(card);
    });
}

function showDetails(book) {
    const modal = document.getElementById("bookModal");
    const modalDetails = document.getElementById("modalDetails");

    modalDetails.innerHTML = `
        <h2>${book.title}</h2>
        <p><strong>Author(s):</strong> ${book.authors?.join(", ") || "Unknown"}</p>
        <p><strong>Publisher:</strong> ${book.publisher || "Unknown"}</p>
        <p><strong>Description:</strong> ${book.description || "No description available."}</p>
        <a href="${book.previewLink}" target="_blank" class="btn">Preview</a>
    `;

    modal.style.display = "flex";

    document.querySelector(".close-btn").onclick = () => (modal.style.display = "none");
}
