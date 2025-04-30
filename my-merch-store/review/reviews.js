let currentPopup = null;
let isAscending = false;
let reviewsData = [];

// Toggle the sorting order (ascending or descending)
function toggleSortOrder() {
  isAscending = !isAscending;

  // Sort reviews based on the rating
  const sorted = [...reviewsData].sort((a, b) =>
    isAscending ? a.rating - b.rating : b.rating - a.rating
  );

  // Render the sorted reviews
  renderReviews(sorted);

  // Update the sort icon
  const sortIcon = document.getElementById('sort-icon');
  sortIcon.textContent = isAscending ? '↑' : '↓';
}

// Render the reviews on the page
function renderReviews(reviews) {
  const reviewsDiv = document.getElementById('reviews');
  reviewsDiv.innerHTML = '';

  reviews.forEach(item => {
    const container = document.createElement('div');
    container.className = 'review-item game-container';

    // Create the game title element
    const title = document.createElement('h3');
    title.className = 'game-title';
    title.textContent = item.title;
    title.style.cursor = 'pointer';
    title.style.color = 'blue';

    // Create the rating element (star shape)
    const rating = document.createElement('div');
    rating.className = 'rating-star';

    // Create the text element for the rating
    const ratingText = document.createElement('span');
    ratingText.textContent = item.rating;

    rating.appendChild(ratingText);

    // When the title is clicked, show the detailed review in a popup
    title.onclick = () => {
      if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
      }

      // Create the popup to display the full review
      const popup = document.createElement('div');
      popup.className = 'popup';
      popup.style.position = 'fixed';
      popup.style.top = '50%';
      popup.style.left = '50%';
      popup.style.transform = 'translate(-50%, -50%)';
      popup.style.backgroundColor = 'white';
      popup.style.padding = '20px';
      popup.style.border = '1px solid black';
      popup.style.boxShadow = '0 2px 10px rgba(0,0,0,0.3)';
      popup.style.zIndex = 1000;

      // Add the review content to the popup
      const content = document.createElement('p');
      content.textContent = item.review;

      // Create a "Back" button to close the popup
      const backBtn = document.createElement('button');
      backBtn.textContent = 'Back';
      backBtn.style.marginTop = '10px';
      backBtn.onclick = () => {
        popup.remove();
        currentPopup = null;
      };

      popup.appendChild(content);
      popup.appendChild(backBtn);
      document.body.appendChild(popup);
      currentPopup = popup;
    };

    container.appendChild(title);
    container.appendChild(rating);
    reviewsDiv.appendChild(container);
  });
}

// Fetch the review data from the server
fetch('http://localhost:5001/reviews')
  .then(response => response.json())
  .then(data => {
    reviewsData = data;
    renderReviews(data);
  });
