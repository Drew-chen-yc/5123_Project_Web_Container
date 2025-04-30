// 建立一個全域變數來追蹤彈窗
let currentPopup = null;
let isAscending = false; // 預設為降冪排序
let reviewsData = [];  // 用來儲存遊戲評論資料

// 切換排序方向的函式
function toggleSortOrder() {
  isAscending = !isAscending; // 切換排序方向
  
  // 根據排序方向對資料進行排序
  const sorted = [...reviewsData].sort((a, b) => {
    return isAscending ? a.rating - b.rating : b.rating - a.rating;
  });

  renderReviews(sorted); // 重新渲染資料

  // 更新排序圖示
  const sortIcon = document.getElementById('sort-icon');
  if (isAscending) {
    sortIcon.textContent = '↑'; // 顯示升冪箭頭
  } else {
    sortIcon.textContent = '↓'; // 顯示降冪箭頭
  }
}

// 渲染評論的函式
function renderReviews(reviews) {
  const reviewsDiv = document.getElementById('reviews');
  reviewsDiv.innerHTML = ''; // 清空現有的內容

  reviews.forEach(item => {
    const container = document.createElement('div');
    container.className = 'review-item';

    const title = document.createElement('h3');
    title.textContent = `${item.title} (Rating: ${item.rating})`;
    title.style.cursor = 'pointer';
    title.style.color = 'blue';

    // 點擊標題顯示評論
    title.onclick = () => {
      // 如果已有 popup，先移除
      if (currentPopup) {
        currentPopup.remove();
        currentPopup = null;
      }

      // 創建 review 彈窗
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

      const content = document.createElement('p');
      content.textContent = item.review;

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

      // 設定目前的 popup
      currentPopup = popup;
    };

    container.appendChild(title);
    reviewsDiv.appendChild(container);
  });
}

// 取得遊戲評論資料並渲染
fetch('http://localhost:5001/reviews')
  .then(response => response.json())
  .then(data => {
    reviewsData = data; // 儲存資料
    renderReviews(data); // 初次渲染
  });