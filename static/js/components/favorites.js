function getFavorites() {
  const raw = localStorage.getItem('favorites');
  if (!raw) return [];
  return JSON.parse(raw);
}

function saveFavorites(favorites) {
  localStorage.setItem('favorites', JSON.stringify(favorites));
}

function isFavorited(id) {
  return getFavorites().some(item => item.id === id);
}

function syncFavoriteButtons(id, isFav) {
  document.querySelectorAll(`[data-fav-id="${id}"]`).forEach(function(btn){
    btn.classList.toggle('favorited', isFav);
  });
}

function addFavorite(id, name, price) {
  if (!id) return;
  const favorites = getFavorites();
  favorites.push({ id, name, price });
  saveFavorites(favorites);
  syncFavoriteButtons(id, true);
  renderFavorites();
}

function removeFavorite(id) {
  if (!id) return;
  const favorites = getFavorites().filter(item => item.id !== id);
  saveFavorites(favorites);
  syncFavoriteButtons(id, false);
  renderFavorites();
}

function toggleFavorite(id, name, price) {
  if (!id) return;
  if (isFavorited(id)) {
    removeFavorite(id);
    return;
  }
  addFavorite(id, name, price);
}

function updateFavoritesBadge(favorites) {
  document.getElementById('favoritesCount').textContent = favorites.length;
}

function renderFavoritesItemsList(favorites) {
  const listEl = document.getElementById('favoritesItemsList');
  if (favorites.length === 0) {
    listEl.innerHTML = '<p class="cart-empty">Bado hujaweka chochote kwenye vipendwa.</p>';
    return;
  }

  listEl.innerHTML = favorites.map(item => `
    <div class="cart-item">
      <span>${item.name}</span>
      <button onclick="removeFavorite('${item.id}')">Ondoa</button>
    </div>
  `).join('');
}

function renderFavorites() {
  const favorites = getFavorites();
  updateFavoritesBadge(favorites);
  renderFavoritesItemsList(favorites);
}