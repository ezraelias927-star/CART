// static/js/layout.js
function setPanelOpen(panelId, isOpen) {
  document.getElementById(panelId).classList.toggle('open', isOpen);
  document.getElementById('pageOverlay').hidden = !isOpen;
}

function toggleCartPanel() {
  const isOpen = document.getElementById('cartPanel').classList.contains('open');
  setPanelOpen('cartPanel', !isOpen);
}

function toggleFavoritesPanel() {
  const isOpen = document.getElementById('favoritesPanel').classList.contains('open');
  setPanelOpen('favoritesPanel', !isOpen);
}

function closePanelOnOutsideClick(panelId, toggleBtnId, clickEvent) {
  const panel = document.getElementById(panelId);
  const toggleBtn = document.getElementById(toggleBtnId);
  const clickedInsidePanel = panel.contains(clickEvent.target);
  const clickedToggleBtn = toggleBtn.contains(clickEvent.target);

  if (!clickedInsidePanel && !clickedToggleBtn) {
    setPanelOpen(panelId, false);
  }
}

document.addEventListener('DOMContentLoaded', () => {
  document.getElementById('cartToggleBtn').addEventListener('click', toggleCartPanel);
  document.getElementById('favoritesToggleBtn').addEventListener('click', toggleFavoritesPanel);
  document.getElementById('cartSubmitBtn').addEventListener('click', () => handleCartSubmit(window.isLoggedIn));

  document.addEventListener('click', function(e){
    closePanelOnOutsideClick('cartPanel', 'cartToggleBtn', e);
    closePanelOnOutsideClick('favoritesPanel', 'favoritesToggleBtn', e);
  });

  document.getElementById('year').textContent = new Date().getFullYear();
  
  if (typeof renderCart === 'function') renderCart();
  if (typeof renderFavorites === 'function') renderFavorites();
});