
let isAscending = false;
let isAlphaAscending = true;
let reviewsData = [];
let isFilterActive = false;

const toggleBtn = document.getElementById("chat-toggle-btn");
const chatFrame = document.getElementById("chatbot-frame");

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
	
	// Format dates as MM/DD/YYYY
	function formatDate(dateStr) {
	  const date = new Date(dateStr);
	  const mm = String(date.getMonth() + 1).padStart(2, '0');
	  const dd = String(date.getDate()).padStart(2, '0');
	  const yyyy = date.getFullYear();
	  return `${mm}/${dd}/${yyyy}`;
	}

	const reviewDate = formatDate(item.review_date);
	const releaseDate = formatDate(item.release_date);
	
	const dates = document.createElement('div');
	dates.className = 'game-dates';
	dates.innerHTML = `
	  <p><strong>Reviewed on:</strong> ${reviewDate}</p>
	  <p><strong>Release date:</strong> ${releaseDate}</p>
	`;
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
	container.onclick = () => {
	  review.style.display = review.style.display === 'block' ? 'none' : 'block';
	};

    container.appendChild(title);
	container.appendChild(dates);
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

let isReviewDateAscending = true;
let isReleaseDateAscending = true;

function sortByReviewDate() {
  isReviewDateAscending = !isReviewDateAscending;
  const sorted = [...reviewsData].sort((a, b) => {
    const dateA = new Date(a.review_date);
    const dateB = new Date(b.review_date);
    return isReviewDateAscending ? dateA - dateB : dateB - dateA;
  });
  renderReviews(sorted);
  document.getElementById('review-date-icon').textContent = isReviewDateAscending ? '↑' : '↓';
}

function sortByReleaseDate() {
  isReleaseDateAscending = !isReleaseDateAscending;
  const sorted = [...reviewsData].sort((a, b) => {
    const dateA = new Date(a.release_date);
    const dateB = new Date(b.release_date);
    return isReleaseDateAscending ? dateA - dateB : dateB - dateA;
  });
  renderReviews(sorted);
  document.getElementById('release-date-icon').textContent = isReleaseDateAscending ? '↑' : '↓';
}

let sortStates = {
  rating: false,
  alphabetical: true,
  review_date: true,
  release_date: true,
};

function handleSortChange() {
  const sortType = document.getElementById('sort-select').value;
  sortStates[sortType] = !sortStates[sortType];

  const sorted = [...reviewsData].sort((a, b) => {
    switch (sortType) {
      case 'rating':
        return sortStates.rating ? a.rating - b.rating : b.rating - a.rating;
      case 'alphabetical':
        return sortStates.alphabetical
          ? a.title.localeCompare(b.title)
          : b.title.localeCompare(a.title);
      case 'review_date':
        return sortStates.review_date
          ? new Date(a.review_date) - new Date(b.review_date)
          : new Date(b.review_date) - new Date(a.review_date);
      case 'release_date':
        return sortStates.release_date
          ? new Date(a.release_date) - new Date(b.release_date)
          : new Date(b.release_date) - new Date(a.release_date);
      default:
        return 0;
    }
  });

  renderReviews(sorted);
}


function filterReleasedItems() {
  isFilterActive = !isFilterActive;

  if (isFilterActive) {
    const now = new Date();
    const releasedItems = reviewsData.filter(item => new Date(item.release_date) <= now);
    renderReviews(releasedItems);
    document.getElementById('released-filter-btn').textContent = "❌Filter Released";
  } else {
    renderReviews(reviewsData);
    document.getElementById('released-filter-btn').textContent = "Filter Released";
  }
}

toggleBtn.addEventListener("click", () => {
  // Hide or show the chatbot frame
  if (chatFrame.style.display === "block") {
    chatFrame.style.display = "none";
  } else {
    chatFrame.style.display = "block";
  }

  // Remove chatbot notice if it's still showing
    const notice = document.getElementById("chatbot-notice");
    if (notice) {
      notice.remove();
      localStorage.setItem("chat_notice_shown", "true");
    }
});

window.addEventListener("load", () => {
  const noticeDisplayed = localStorage.getItem("chat_notice_shown");

  if (!noticeDisplayed) {
    const notice = document.createElement("div");
    notice.textContent = "🤖 This is a chatbot. Click the button in the bottom-right corner to start chatting!";
    notice.style.position = "fixed";
    notice.style.bottom = "100px";
    notice.style.right = "20px";
    notice.style.backgroundColor = "#0078D4";
    notice.style.color = "white";
    notice.style.padding = "12px 16px";
    notice.style.borderRadius = "10px";
    notice.style.boxShadow = "0 2px 10px rgba(0,0,0,0.2)";
    notice.style.zIndex = 10001;
    notice.style.transition = "opacity 1s ease";
    notice.id = "chatbot-notice";
    document.body.appendChild(notice);

    setTimeout(() => {
      notice.style.opacity = "0";
      setTimeout(() => {
        notice.remove();
      }, 1000);
    }, 5000);

    // Set the localStorage flag so it's never shown again
    localStorage.setItem("chat_notice_shown", "true");
  }
});
