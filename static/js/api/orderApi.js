async function handleCartSubmit(isLoggedIn) {
  const cart = getCart();
  if (cart.length === 0) return;

  if (!isLoggedIn) {
    sessionStorage.setItem('returnTo', window.location.pathname);
    window.location.href = '/auth';
    return;
  }

  const payload = {
    items: cart.map(item => ({ product_id: item.id, quantity: item.qty }))
  };

  try {
    const res = await fetch('/api/orders', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(payload)
    });
    const data = await res.json();

    if (!res.ok) {
      alert(data.message || 'Imeshindwa kutuma order.');
      return;
    }

    alert(data.message || 'Order imetumwa!');
    localStorage.removeItem('cart');
    renderCart();
    toggleCartPanel();
  } catch (err) {
    alert('Hitilafu ya mtandao. Jaribu tena.');
  }
}