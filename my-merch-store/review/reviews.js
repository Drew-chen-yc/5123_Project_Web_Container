
let isAscending = false;
let isAlphaAscending = true;
let reviewsData = [];

// Fetch the review data from the server
fetch('http://localhost:5001/reviews')
  .then(response => response.json())
  .then(data => {
    reviewsData = data;
    renderReviews(data);
  });

// Render the reviews on the page
function renderReviews(reviews) {
  const reviewsDiv = document.getElementById('reviews');
  reviewsDiv.innerHTML = '';

  reviews.forEach(item => {
    const container = document.createElement('div');
    container.className = 'review-item game-container';

    const title = document.createElement('h3');
    title.className = 'game-title';
    title.textContent = item.title;
    title.style.cursor = 'pointer';

	const rating = document.createElement('div');
	rating.className = 'rating-star';

	// Generate full star icons
	for (let i = 1; i <= 5; i++) {
	  const star = document.createElement('span');
	  star.textContent = i <= Math.round(item.rating) ? '★' : '☆'; // full or empty star
	  star.style.color = '#FFD700'; // gold
	  star.style.fontSize = '18px';
	  rating.appendChild(star);
	}

    const review = document.createElement('div');
    review.className = 'review-box';
    review.textContent = item.review;
    review.style.display = 'none';

    // Toggle review visibility
    title.onclick = () => {
      review.style.display = review.style.display === 'block' ? 'none' : 'block';
    };

    container.appendChild(title);
    container.appendChild(rating);
    container.appendChild(review);
    reviewsDiv.appendChild(container);
  });
}

// Sort by rating
function sortByRating() {
  isAscending = !isAscending;
  const sorted = [...reviewsData].sort((a, b) =>
    isAscending ? a.rating - b.rating : b.rating - a.rating
  );
  renderReviews(sorted);
  document.getElementById('sort-icon').textContent = isAscending ? '↑' : '↓';
}

// Sort alphabetically
function sortByAlphabetical() {
  isAlphaAscending = !isAlphaAscending;
  const sorted = [...reviewsData].sort((a, b) => {
    const titleA = a.title.toLowerCase();
    const titleB = b.title.toLowerCase();
    if (titleA < titleB) return isAlphaAscending ? -1 : 1;
    if (titleA > titleB) return isAlphaAscending ? 1 : -1;
    return 0;
  });
  renderReviews(sorted);
  document.getElementById('alpha-sort-icon').textContent = isAlphaAscending ? '↑' : '↓';
}
