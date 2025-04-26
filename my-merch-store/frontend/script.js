// display the products
fetch('http://localhost:5001/items')
  .then(response => response.json())
  .then(data => {
    const itemsDiv = document.getElementById('items');
    data.forEach(item => {
      const div = document.createElement('div');
      div.className = 'product-item';

      // Create and add the product image
      const img = document.createElement('img');
      img.src = "http://localhost:5001/static/images/" + item.picture;  // Use the image URL from the response
      img.alt = item.name;
      img.className = 'product-image';
      div.appendChild(img);

      // Create and add product name and price
      const p = document.createElement('p');
      p.textContent = `${item.name} - $${item.price}`;
      div.appendChild(p);

      // Create and add Add to Cart button
      const btn = document.createElement('button');
      btn.textContent = 'Add to Cart';
      btn.onclick = () => updateItemQuantity(item, 1); // Use updateItemQuantity function to handle adding to cart
      div.appendChild(btn);

      // Append the product div to the items container
      itemsDiv.appendChild(div);
    });
  });

// 更新商品數量：+1 或 -1
function updateItemQuantity(item, change) {
  fetch('http://localhost:5000/cart/update', {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify({ name: item.name, price: item.price, change })
  }).then(() => showCart());
}

// 顯示購物車
function showCart() {
  fetch('http://localhost:5000/cart')
    .then(response => response.json())
    .then(cart => {
      const cartDiv = document.getElementById('cart');
      cartDiv.innerHTML = ''; // Clear current cart

      let total = 0;

      cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';

        const namePrice = document.createElement('span');
        namePrice.textContent = `${item.name} - $${item.price} x `;

        // Create and add the minus button (decrease quantity)
        const minusBtn = document.createElement('button');
        minusBtn.className = 'circle-btn';
        minusBtn.textContent = '-';
        minusBtn.onclick = () => updateItemQuantity(item, -1);

        // Quantity display
        const qtyDisplay = document.createElement('span');
        qtyDisplay.className = 'qty-display';
        qtyDisplay.textContent = item.quantity;

        // Create and add the plus button (increase quantity)
        const plusBtn = document.createElement('button');
        plusBtn.className = 'circle-btn';
        plusBtn.textContent = '+';
        plusBtn.onclick = () => updateItemQuantity(item, 1);

        // Append all the elements to the cart item div
        itemDiv.appendChild(namePrice);
        itemDiv.appendChild(minusBtn);
        itemDiv.appendChild(qtyDisplay);
        itemDiv.appendChild(plusBtn);

        cartDiv.appendChild(itemDiv);

        total += item.price * item.quantity;
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
        fetch('http://localhost:5000/cart/clear', {
          method: 'POST'
        }).then(() => showCart());
      };
      cartDiv.appendChild(clearBtn);
    });
}

// Initial load of the cart
showCart();
