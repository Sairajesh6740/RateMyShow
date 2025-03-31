const API_URL = 'http://localhost:5000/movies';

// Function to fetch and display all movie reviews
async function fetchReviews() {
    const response = await fetch(API_URL);
    const movies = await response.json();
    const reviewList = document.getElementById('review-list');
    reviewList.innerHTML = '';

    movies.forEach(movie => {
        const li = document.createElement('li');
        li.innerHTML = `
            <strong>${movie.title}</strong> - ${movie.review} (Rating: ${movie.rating})
            <button class="edit" onclick="editReview('${movie._id}', '${movie.title}', '${movie.review}', ${movie.rating})">Edit</button>
            <button class="delete" onclick="deleteReview('${movie._id}')">X</button>
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
    // Fill the form with existing values
    document.getElementById('title').value = title;
    document.getElementById('review').value = review;
    document.getElementById('rating').value = rating;

    // Change submit button to "Update Review"
    const submitButton = document.querySelector("#review-form button");
    submitButton.textContent = "Update Review";
    submitButton.dataset.editing = id;
}
function searchReviews() {
    let searchText = document.getElementById('search').value.toLowerCase();
    let reviews = document.querySelectorAll('.list-group-item');

    reviews.forEach(review => {
        let text = review.innerText.toLowerCase();
        if (text.includes(searchText)) {
            review.style.display = 'block';
        } else {
            review.style.display = 'none';
        }
    });
}

// Load reviews on page load
fetchReviews();
