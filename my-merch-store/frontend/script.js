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
      btn.onclick = () => addToCart(item);
      div.appendChild(p);
      div.appendChild(btn);
      itemsDiv.appendChild(div);
    });
  });

// add items to cart
function addToCart(item) {
  fetch('http://localhost:5000/cart', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify(item)
  }).then(() => {
    alert(`${item.name} added to cart!`);
    showCart();
  });
}

// show the cart
function showCart() {
  fetch('http://localhost:5000/cart')
    .then(response => response.json())
    .then(cart => {
      const cartDiv = document.getElementById('cart');
      cartDiv.innerHTML = '';

      cart.forEach((item, index) => {
        const p = document.createElement('p');
        p.textContent = `${item.name} - $${item.price} `;
        
        // adding remove button
        const delBtn = document.createElement('button');
        delBtn.textContent = 'Remove form cart';
        delBtn.onclick = () => deleteItem(index);

        p.appendChild(delBtn);
        cartDiv.appendChild(p);
      });

      // showing "Empty Cart" button
      const clearBtn = document.createElement('button');
      clearBtn.textContent = 'Empty Cart';
      clearBtn.onclick = clearCart;
      cartDiv.appendChild(clearBtn);
    });
}

// remove single item
function deleteItem(index) {
  fetch(`http://localhost:5000/cart/${index}`, {
    method: 'DELETE'
  }).then(() => showCart());
}

// empty cart
function clearCart() {
  fetch('http://localhost:5000/cart', {
    method: 'DELETE'
  }).then(() => showCart());
}

// show cart as default setting
showCart();
