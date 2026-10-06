function getCart() {
  const raw = localStorage.getItem('cart');
  if (!raw) return [];
  return JSON.parse(raw);
}

function saveCart(cart) {
  localStorage.setItem('cart', JSON.stringify(cart));
}

function addToCart(id, name, price, img_url, btnEl) {
  if (!id || !name) return;
  const cart = getCart();
  const existingItem = cart.find(item => item.id === id);

  if (existingItem) {
    existingItem.qty += 1;
  } else {
    cart.push({ id, name, price, qty: 1, img_url });
  }

  saveCart(cart);
  renderCart();
  showAddedFeedback(btnEl); 
}

function showAddedFeedback(btnEl) {
  if (!btnEl) return;
  const originalText = btnEl.textContent;
  btnEl.style.backgroundColor = 'green';
  btnEl.textContent = 'Imeongezwa!';

  setTimeout(() => {
    btnEl.style.backgroundColor = '';
    btnEl.textContent = originalText;
  }, 1000);
}

function removeFromCart(id) {
  if (!id) return;
  const cart = getCart().filter(item => item.id !== id);
  saveCart(cart);
  renderCart();
}

function getCartItemCount(cart) {
  return cart.reduce((total, item) => total + item.qty, 0);
}

function getCartTotalPrice(cart) {
  return cart.reduce((total, item) => total + (item.price * item.qty), 0);
}

function updateCartBadge(cart) {
  document.getElementById('cartCount').textContent = getCartItemCount(cart);
}

function renderCartItemsList(cart) {
  const listEl = document.getElementById('cartItemsList');
  if (cart.length === 0) {
    listEl.innerHTML = '<p class="cart-empty">Cart yako iko tupu.</p>';
    return;
  }
  listEl.innerHTML = cart.slice(0, 5).map(item => `
    <div class="cart-item">
      <img src="${item.img_url || 'https://placehold.co/50x50'}" alt="${item.name}" style="width:44px;height:44px;object-fit:cover;border-radius:8px;">
      <span>${item.name} x${item.qty}</span>
      <button onclick="removeFromCart('${item.id}')">Ondoa</button>
    </div>
  `).join('');
}

function renderCartTotal(cart) {
  const totalRow = document.getElementById('cartTotal');
  const totalAmountEl = document.getElementById('cartTotalAmount');

  if (cart.length === 0) {
    totalRow.hidden = true;
    return;
  }

  totalRow.hidden = false;
  totalAmountEl.textContent = 'Tsh ' + getCartTotalPrice(cart).toLocaleString();
}

function renderCart() {
  const cart = getCart();
  updateCartBadge(cart);
  renderCartItemsList(cart);
  renderCartTotal(cart);
}