const API_URL = 'https://ratemyshow.onrender.com';

// Function to fetch and display all movie reviews
async function fetchReviews() {
    const response = await fetch(API_URL);
    const movies = await response.json();
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';

    movies.forEach(movie => {
        const li = document.createElement('li');
        li.classList.add('list-group-item', 'review-item');
        li.innerHTML = `
            <div class="review-content">
                <strong>${movie.title}</strong> - ${movie.review} <br> 
                <span class="rating">⭐ ${movie.rating}/10</span>
            </div>
            <div class="review-buttons">
                <button class="edit" onclick="editReview('${movie._id}', '${movie.title}', '${movie.review}', ${movie.rating})">✏️ Edit</button>
                <button class="delete" onclick="deleteReview('${movie._id}')">❌ Delete</button>
            </div>
        `;
        reviewList.appendChild(li);
    });
}

// Function to add a new review
document.getElementById('review-form').addEventListener('submit', async (event) => {
    event.preventDefault();

    const title = document.getElementById('title').value;
    const review = document.getElementById('review').value;
    const rating = document.getElementById('rating').value;
    const submitButton = document.querySelector("#review-form button");

    if (submitButton.dataset.editing) {
        // Update an existing review
        const movieId = submitButton.dataset.editing;
        await fetch(`${API_URL}/${movieId}`, {
            method: 'PUT',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, review, rating })
        });

        submitButton.removeAttribute("data-editing");
        submitButton.textContent = "Add Review";
    } else {
        // Create a new review
        await fetch(API_URL, {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ title, review, rating })
        });
    }

    document.getElementById('review-form').reset();
    fetchReviews(); // Refresh list
});

// Function to delete a review
async function deleteReview(id) {
    await fetch(`${API_URL}/${id}`, { method: 'DELETE' });
    fetchReviews(); // Refresh list
}

// Function to edit a review
function editReview(id, title, review, rating) {
    document.getElementById('title').value = title;
    document.getElementById('review').value = review;
    document.getElementById('rating').value = rating;

    const submitButton = document.querySelector("#review-form button");
    submitButton.textContent = "Update Review";
    submitButton.dataset.editing = id;
}

// Function to search reviews
function searchReviews() {
    let searchText = document.getElementById('search').value.toLowerCase();
    let reviews = document.querySelectorAll('.review-item');

    reviews.forEach(review => {
        let text = review.innerText.toLowerCase();
        review.style.display = text.includes(searchText) ? 'flex' : 'none';
    });
}

// Load reviews on page load
fetchReviews();
