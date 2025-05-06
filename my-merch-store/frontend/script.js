let items = []; // Track all items and their in-cart state
let popupTimeoutId = null;

const toggleBtn = document.getElementById("chat-toggle-btn");
const chatFrame = document.getElementById("chatbot-frame");

function showSpinner() {
  const spinner = document.getElementById('spinner');
  spinner.classList.remove('fade-out');
  spinner.style.display = 'flex';
}

function hideSpinner() {
  const spinner = document.getElementById('spinner');
  spinner.classList.add('fade-out');

  setTimeout(() => {
    spinner.style.display = 'none';
  }, 300); // Match CSS transition time
}

function showPopup(message, duration = 3000) {
  const popup = document.getElementById('confirmation-popup');
  document.getElementById('popup-message').textContent = message;

  popup.classList.remove('fade-out');
  popup.style.display = 'flex';

  // Clear any previous timeout
  if (popupTimeoutId) {
    clearTimeout(popupTimeoutId);
  }

  popupTimeoutId = setTimeout(() => {
    popup.classList.add('fade-out');

    // Fully hide after fade-out completes
    setTimeout(() => {
      popup.style.display = 'none';
    }, 400); // Match CSS transition time
  }, duration);
}

function closePopup() {
  const popup = document.getElementById('confirmation-popup');
  popup.classList.add('fade-out');

  if (popupTimeoutId) {
    clearTimeout(popupTimeoutId);
    popupTimeoutId = null;
  }

  setTimeout(() => {
    popup.style.display = 'none';
  }, 400); // Match CSS transition time
}


// display the products
function displayItems() {
  fetch('http://localhost:5001/items')
    .then(response => response.json())
    .then(data => {
      const itemsDiv = document.getElementById('items');
      itemsDiv.innerHTML = ''; // Clear previous contents
      items = data.map(item => {
        item.inCart = 0; // Initialize cart quantity
        const div = document.createElement('div');
        div.className = 'product-item';

        // Create a wrapper for the image and overlay
        const imageWrapper = document.createElement('div');
        imageWrapper.className = 'image-wrapper';

        // Create and add the product image
        const img = document.createElement('img');
        img.src = "http://localhost:5001/static/images/" + item.picture;  // Use the image URL from the response
        img.alt = item.name;
        img.className = 'product-image';
        imageWrapper.appendChild(img);

        // If sold out, add overlay
        const totalQuantity = item.sizes.reduce((sum, s) => sum + s.quantity, 0);
        if (totalQuantity === 0) {
          const overlay = document.createElement('div');
          overlay.className = 'sold-out-overlay';
          overlay.textContent = 'Sold Out';
          imageWrapper.appendChild(overlay);
        }
        div.appendChild(imageWrapper);

        // Create and add product name and price
        const p = document.createElement('p');
        p.textContent = `${item.name}: $${item.price}`;
        div.appendChild(p);

        const hasSizes = item.sizes.some(s => s.size !== "");

        if (hasSizes) {
          // Create size dropdown
          const dropdown = document.createElement('select');
          dropdown.className = 'size-dropdown';
          dropdown.id = `size-select-${item.id}`;

          item.sizes
            .filter(s => s.size !== "")
            .forEach(s => {
              const option = document.createElement('option');
              option.value = s.size;
              option.textContent = `${s.size} (${s.quantity} available)`;
              dropdown.appendChild(option);
            });

          div.appendChild(dropdown);
        } else {
          // Just show total quantity
          const totalQuantity = item.sizes.reduce((sum, s) => sum + s.quantity, 0);
          const qty = document.createElement('p');
          qty.textContent = `Available: ${totalQuantity}`;
          div.appendChild(qty);
        }

        // Add item description
        const desc = document.createElement('p');
        desc.textContent = `${item.description}`;
        div.appendChild(desc);

        // Create and add Add to Cart button
        const btn = document.createElement('button');
        btn.innerHTML = '<i class="fas fa-cart-plus"></i>';  // sets HTML, allowing emojis or even <img>/<svg> icons
        btn.onclick = () => {
          updateItemQuantity(item, 1);
        };
        // Disable the button if the item is out of stock
        if (item.quantity === 0) {
          btn.disabled = true;
          btn.style.backgroundColor = '#ccc';  // optional: grey out
          btn.style.cursor = 'not-allowed';
          btn.title = 'Out of stock';  // optional: tooltip
        }
        div.appendChild(btn);
        // Append the product div to the items container
        itemsDiv.appendChild(div);

        return item
      });
    });
}

function updateItemQuantity(item, change) {
  const sizeSelect = document.querySelector(`#size-select-${item.id}`);
  const selectedSize = sizeSelect ? sizeSelect.value : "";

  const sizeInfo = item.sizes.find(s => s.size === selectedSize);
  if (!sizeInfo) {
    showPopup("Please select a valid size.");
    return;
  }

  // Initialize inCart if not yet set per size
  if (!item.inCartBySize) item.inCartBySize = {};
  const currentInCart = item.inCartBySize[selectedSize] || 0;
  const newQuantity = currentInCart + change;

  if (newQuantity < 0) return;
  if (newQuantity > sizeInfo.quantity) {
    showPopup(`Only ${sizeInfo.quantity} in stock for size ${selectedSize}`);
    return;
  }

  // Update inCartBySize
  item.inCartBySize[selectedSize] = newQuantity;

  // Send to backend
  fetch('http://localhost:5001/cart/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: item.name,
      price: item.price,
      size: selectedSize,
      change: change
    })
  }).then(() => showCart());
}

function updateItemQuantityBySize(item, size, change) {
  const sizeInfo = item.sizes.find(s => s.size === size);
  if (!sizeInfo) return;

  if (!item.inCartBySize) item.inCartBySize = {};
  const currentInCart = item.inCartBySize[size] || 0;
  const newQuantity = currentInCart + change;

  if (newQuantity < 0 || newQuantity > sizeInfo.quantity) return;

  item.inCartBySize[size] = newQuantity;

  fetch('http://localhost:5001/cart/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({
      name: item.name,
      price: item.price,
      size: size,
      change: change
    })
  }).then(() => showCart());
}

// showing cart
function showCart() {
  fetch('http://localhost:5001/cart')
    .then(response => response.json())
    .then(cart => {
      const cartDiv = document.getElementById('cart');
      cartDiv.innerHTML = ''; // Clear current cart

      let total = 0;

      cart.forEach(cartItem => {
        // Match cart item to full item data
        const item = items.find(i => i.name === cartItem.name);
        if (!item) return; // Skip if not found

        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';

        if (item.inCartBySize) {
          Object.entries(item.inCartBySize).forEach(([size, quantity]) => {
            if (quantity <= 0) return; // Skip empty entries

            const namePrice = document.createElement('span');
            const sizeLabel = size ? ` (Size: ${size})` : '';
            namePrice.textContent = `${item.name}${sizeLabel} - $${item.price} x `;

            // Create minus button
            const minusBtn = document.createElement('button');
            minusBtn.className = 'circle-btn';
            minusBtn.textContent = '-';
            minusBtn.onclick = () => updateItemQuantityBySize(item, size, -1);

            // Quantity display
            const qtyDisplay = document.createElement('span');
            qtyDisplay.className = 'qty-display';
            qtyDisplay.textContent = quantity;

            // Create plus button
            const plusBtn = document.createElement('button');
            plusBtn.className = 'circle-btn';
            plusBtn.textContent = '+';
            plusBtn.onclick = () => updateItemQuantityBySize(item, size, 1);

            const sizeInfo = item.sizes.find(s => s.size === size);
            const availableQty = sizeInfo ? sizeInfo.quantity : 0;

            // Disable plus button if item.inCart >= item.quantity
            if (quantity >= availableQty) {
              plusBtn.disabled = true;
              plusBtn.classList.add('disabled-btn');
            } else {
              plusBtn.onclick = () => updateItemQuantityBySize(item, size, 1);
            }

            // Wrap into cart item
            const itemDiv = document.createElement('div');
            itemDiv.className = 'cart-item';
            itemDiv.appendChild(namePrice);
            itemDiv.appendChild(minusBtn);
            itemDiv.appendChild(qtyDisplay);
            itemDiv.appendChild(plusBtn);

            cartDiv.appendChild(itemDiv);

            total += item.price * quantity;
          });
        }
      });

      // Display the total price
      const totalP = document.createElement('p');
      totalP.id = 'total';
      totalP.style.fontWeight = 'bold';
      totalP.style.marginTop = '15px';
      totalP.textContent = `Total: $${total.toFixed(2)}`;
      cartDiv.appendChild(totalP);

      // Create and add the "Empty Cart" button
      const clearBtn = document.createElement('button');
      clearBtn.textContent = 'Empty Cart';
      clearBtn.style.marginTop = '10px';
      clearBtn.onclick = () => {
        fetch('http://localhost:5001/cart/clear', {
          method: 'POST'
        }).then(() => {
          items.forEach(item => {
            item.inCartBySize = {}; // Reset all in-cart quantities by size
          });
          showCart();
        });
      };
      cartDiv.appendChild(clearBtn);

      // Create and add the "Purchase" button
      const buyBtn = document.createElement('button');
      buyBtn.textContent = 'Purchase Items';
      buyBtn.style.marginTop = '10px';

      buyBtn.onclick = () => {
        // Flatten cart into list of { name, size, price, quantity }
        const cartItems = [];

        items.forEach(item => {
          if (item.inCartBySize) {
            for (const [size, quantity] of Object.entries(item.inCartBySize)) {
              if (quantity > 0) {
                cartItems.push({
                  name: item.name,
                  size,
                  price: item.price,
                  quantity
                });
              }
            }
          }
        });

        if (cartItems.length === 0) {
          showPopup('Your cart is empty.');
          return;
        }

        showSpinner();

        fetch('http://localhost:5001/cart/buy', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ cart: cartItems })
        })
        .then(response => response.json())
        .then(data => {
          items.forEach(item => {
            item.inCartBySize = {};
          });
          showCart();
          showPopup(data.message || 'Purchase complete!');
          displayItems();
        })
        .catch(err => {
          console.error('Purchase error:', err);
          showPopup('There was a problem completing your purchase.');
        })
        .finally(() => hideSpinner());
      };
      cartDiv.appendChild(buyBtn);
    });
}

// Initial load of the page
displayItems();
showCart();

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
