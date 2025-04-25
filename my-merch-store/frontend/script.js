// display the products
fetch('http://localhost:5001/items')
  .then(response => response.json())
  .then(data => {
    const itemsDiv = document.getElementById('items');
    data.forEach(item => {
      const div = document.createElement('div');
      const p = document.createElement('p');
      p.textContent = `${item.name} - $${item.price}`;
      const btn = document.createElement('button');
      btn.textContent = 'Add to Cart';
      btn.onclick = () => updateItemQuantity(item, 1); // ← 改成用 updateItemQuantity
      div.appendChild(p);
      div.appendChild(btn);
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
      cartDiv.innerHTML = '';

      let total = 0;

      cart.forEach(item => {
        const itemDiv = document.createElement('div');
        itemDiv.className = 'cart-item';

        const namePrice = document.createElement('span');
        namePrice.textContent = `${item.name} - $${item.price} x `;

        const minusBtn = document.createElement('button');
        minusBtn.className = 'circle-btn';
        minusBtn.textContent = '-';
        minusBtn.onclick = () => updateItemQuantity(item, -1);

        const qtyDisplay = document.createElement('span');
        qtyDisplay.className = 'qty-display';
        qtyDisplay.textContent = item.quantity;

        const plusBtn = document.createElement('button');
        plusBtn.className = 'circle-btn';
        plusBtn.textContent = '+';
        plusBtn.onclick = () => updateItemQuantity(item, 1);

        itemDiv.appendChild(namePrice);
        itemDiv.appendChild(minusBtn);
        itemDiv.appendChild(qtyDisplay);
        itemDiv.appendChild(plusBtn);

        cartDiv.appendChild(itemDiv);

        total += item.price * item.quantity;
      });

      const totalP = document.createElement('p');
      totalP.id = 'total';
      totalP.style.fontWeight = 'bold';
      totalP.style.marginTop = '15px';
      totalP.textContent = `Total: $${total.toFixed(2)}`;
      cartDiv.appendChild(totalP);

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

// 初始載入購物車
showCart();
