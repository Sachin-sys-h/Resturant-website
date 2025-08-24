// connecting to menu.json

async function loadMenu() {
  const res = await fetch('../data/menu.json');
  const menu = await res.json();
  const menuList = document.getElementById('menu-list');

  // index.html function

  menu.forEach(item => {
    const div = document.createElement('div');
    div.className = 'menu-item';
    div.innerHTML = `
    <div class="menu-text">
    
      <h3>${item.name}</h3>
      <p>${item.description}</p>
      <p>₹${item.price}</p>
      <button onclick="addToCart(${item.id}, '${item.name}', ${item.price}, '${item.image}')">Add to Cart</button>
      </div>
      <img src="${item.image}" alt="${item.name}" class="menu-img">
      
    `;
    menuList.appendChild(div);
  });
}
// Add to cart
function addToCart(id, name, price, image) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  const existing=cart.find(item=>item.id===id);
  if(existing){
    existing.qty=(existing.qty||1)+1;
  }else{
    cart.push({id,name,price,image,qty:1});
  }
  localStorage.setItem('cart', JSON.stringify(cart));
  alert(`${name} added to cart!`);
}
// Go to cart button function
function goToCart() {
  window.location.href = 'cart.html';
}
// back to menu button
function goToBack() {
  window.location.href = 'index.html'
}

window.onload = loadMenu;

// cart page functin
function loadCart() {
  const cartDiv = document.getElementById('cart-items');
  const totalDiv = document.getElementById('total');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartDiv.innerHTML = '';
  let total = 0;

  cart.forEach(item => {
    const div = document.createElement('div');
    div.innerHTML =  `
      <img src="${item.image}" alt="${item.name}" class="cart-item-img">
      <div class="cart-item-details">
        <div class="cart-item-name">${item.name}</div>
        <div class="cart-item-price">₹${item.price}</div>
        <div class="cart-item-qty">
          <button class="qty-btn" onclick="updateQty(${index}, -1)">-</button>
          <span class="qty-value">${item.qty}</span>
          <button class="qty-btn" onclick="updateQty(${index}, 1)">+</button>
        </div>
      </div>
    `;

    cartDiv.appendChild(div);
    total += item.price;

  });

  totalDiv.innerText = `Total: ₹${total}`;
}

// Place Order (for now just clear cart + alert)
function placeOrder() {
  const table = document.getElementById('tableNo').value;
  alert(`Order placed for Table ${table}!`);
  localStorage.removeItem('cart');
  window.location.href = 'index.html';
}

// Bill PDF
function generateBill() {
  const { jsPDF } = window.jspdf;
  const pdf = new jsPDF();
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  let y = 20;

  pdf.text("Restaurant Bill", 20, y);
  y += 10;
  cart.forEach(item => {
    pdf.text(`${item.name} - ₹${item.price}`, 20, y);
    y += 10;
  });
  pdf.save("bill.pdf");
}

if (window.location.pathname.includes("cart.html")) {
  loadCart();
}
// Load Cart with Quantity + Remove
function loadCart() {
  const cartDiv = document.getElementById('cart-items');
  const totalDiv = document.getElementById('total');
  let cart = JSON.parse(localStorage.getItem('cart')) || [];

  cartDiv.innerHTML = '';
  let total = 0;

  cart.forEach((item, index) => {
    const div = document.createElement('div');
    div.className = "cart-flex";
    div.innerHTML = ` 
      <img src="${item.image}" alt="${item.name}" style="width:50px; height:50px; object-fit:cover; margin-right:10px; border-radius: 10px;">
      <p>${item.name} - ₹${item.price}</p>
      
      <div class="qty-controls">
        <button onclick="updateQty(${index}, -1)">-</button>
        <span>${item.qty || 1}</span>
        <button onclick="updateQty(${index}, 1)">+</button>
      </div>

      
    `;

    cartDiv.appendChild(div);
    total += item.price * (item.qty || 1);
  });

  totalDiv.innerText = `Total: ₹${total}`;
}

// Update Quantity
function updateQty(index, change) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  if (!cart[index].qty) cart[index].qty = 1;

  cart[index].qty += change;

  if (cart[index].qty <= 0) {
    cart.splice(index, 1); // remove if qty 0
  }

  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}

// Remove Item
function removeItem(index) {
  let cart = JSON.parse(localStorage.getItem('cart')) || [];
  cart.splice(index, 1);
  localStorage.setItem('cart', JSON.stringify(cart));
  loadCart();
}
