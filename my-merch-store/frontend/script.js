let items = []; // Track all items and their in-cart state
let noticeDisplayed = false
let notice = null; // Global reference

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

  setTimeout(() => {
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
        if (item.quantity === 0) {
          const overlay = document.createElement('div');
          overlay.className = 'sold-out-overlay';
          overlay.textContent = 'Sold Out';
          imageWrapper.appendChild(overlay);
        }

        div.appendChild(imageWrapper);

        // Create and add product name and price
        const p = document.createElement('p');
        p.textContent = `${item.name} - $${item.price}`;
        div.appendChild(p);

        const qty = document.createElement('p');
        qty.textContent = `Available: ${item.quantity}`;
        div.appendChild(qty);

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
};

function updateItemQuantity(item, change) {
  const newQuantity = item.inCart + change;

  if (newQuantity < 0) return; // Prevent going below 0
  if (newQuantity > item.quantity) {
    showPopup(`Only ${item.quantity} in stock`);
    return; // Prevent going above available stock
  }

  // Update inCart quantity
  item.inCart = newQuantity;

  // Send updated data to the backend
  fetch('http://localhost:5001/cart/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: item.name, price: item.price, change })
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

        const namePrice = document.createElement('span');
        namePrice.textContent = `${item.name} - $${item.price} x `;

        // Create and add the minus button (decrease quantity)
        const minusBtn = document.createElement('button');
        minusBtn.className = 'circle-btn';
        minusBtn.id = `minus-btn-${item.id}`;  // Unique ID for easy reference
        minusBtn.textContent = '-';
        minusBtn.onclick = () => updateItemQuantity(item, -1);

        // Quantity display
        const qtyDisplay = document.createElement('span');
        qtyDisplay.className = 'qty-display';
        qtyDisplay.textContent = item.inCart;

        // Create and add the plus button (increase quantity)
        const plusBtn = document.createElement('button');
        plusBtn.className = 'circle-btn';
        plusBtn.id = `plus-btn-${item.id}`;  // Unique ID for easy reference
        plusBtn.textContent = '+';

        // Disable plus button if item.inCart >= item.quantity
        if (item.inCart >= item.quantity) {
          plusBtn.disabled = true;
          plusBtn.classList.add('disabled-btn');
        } else {
          plusBtn.onclick = () => updateItemQuantity(item, 1);
        }

        // Append all the elements to the cart item div
        itemDiv.appendChild(namePrice);
        itemDiv.appendChild(minusBtn);
        itemDiv.appendChild(qtyDisplay);
        itemDiv.appendChild(plusBtn);

        cartDiv.appendChild(itemDiv);

        total += item.price * item.inCart;
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
          items.forEach(item => item.inCart = 0);
          showCart()
        });
      };
      cartDiv.appendChild(clearBtn);

      // Create and add the "Purchase" button
      const buyBtn = document.createElement('button');
      buyBtn.textContent = 'Purchase Items';
      buyBtn.style.marginTop = '10px';

      buyBtn.onclick = () => {
        const cartItems = items.filter(item => item.inCart > 0);

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
          items.forEach(item => item.inCart = 0);
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

// Function to remove notice
function dismissNotice() {
  if (notice) {
    notice.style.opacity = "0";
    setTimeout(() => {
      if (notice) notice.remove();
      notice = null;
    }, 1000);
  }
}

toggleBtn.addEventListener("click", () => {
  // Hide or show the chatbot frame
  if (chatFrame.style.display === "block") {
    chatFrame.style.display = "none";
  } else {
    chatFrame.style.display = "block";
  }

  // Dismiss the notice when chat button is clicked
  dismissNotice();
});

// Chatbot notice (only display once)
window.addEventListener("load", () => {
  if (!noticeDisplayed) {
    notice = document.createElement("div");
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
    document.body.appendChild(notice);

    setTimeout(() => {
      dismissNotice();
    }, 5000);

    noticeDisplayed = true;
  }
});