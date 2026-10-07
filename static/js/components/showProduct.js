import { escapeHTML, formatPrice, debounce } from '../utils/dom.js';

// ---------------------------------------------------------------
// CONFIG
// ---------------------------------------------------------------
const API_URL = '/api/searchproducts';
const MAX_VISIBLE = 5;
const SEARCH_DELAY_MS = 300;
const FALLBACK_IMAGE = 'https://placehold.co/300x200';

const MESSAGES = {
  loading: 'Inapakia bidhaa...',
  searching: 'Inatafuta...',
  error: 'Imeshindwa kupakia bidhaa. Jaribu tena.',
  empty: 'Hakuna bidhaa zinazofanana na utafutaji wako.',
};

// ---------------------------------------------------------------
// STATE (ndani ya module tu, hakuna global)
// ---------------------------------------------------------------
let currentRequest = null; // AbortController ya request inayoendelea
let products = [];         // bidhaa zilizopo kwenye grid, kwa ajili ya event delegation

// ---------------------------------------------------------------
// DOM REFERENCES
// ---------------------------------------------------------------
const getEls = () => ({
  grid: document.getElementById('productGrid'),
  status: document.getElementById('loadingText'),
  search: document.getElementById('searchInput'),
});

// ---------------------------------------------------------------
// STATUS MESSAGE
// ---------------------------------------------------------------
const showStatus = (message) => {
  const { status } = getEls();
  status.textContent = message;
  status.hidden = false;
};

const hideStatus = () => {
  getEls().status.hidden = true;
};

// ---------------------------------------------------------------
// DATA
// ---------------------------------------------------------------
const buildUrl = (term) =>
  term ? `${API_URL}?search=${encodeURIComponent(term)}` : API_URL;

const fetchProducts = async (term, signal) => {
  const response = await fetch(buildUrl(term), { signal });
  if (!response.ok) throw new Error(`HTTP ${response.status}`);
  return response.json();
};

// ---------------------------------------------------------------
// RENDER
// ---------------------------------------------------------------
const cardHTML = (product) => {
  const id = escapeHTML(product.id);
  const name = escapeHTML(product.name);
  const image = escapeHTML(product.image_url || FALLBACK_IMAGE);

  return `
    <article class="product-card" data-product-id="${id}">
      <button type="button" class="favorite-btn" data-action="favorite"
              data-fav-id="${id}" aria-label="Weka ${name} kwenye favorites">
        &#9825;
      </button>
      <img src="${image}" alt="${name}" loading="lazy">
      <div class="product-info">
        <h3 class="product-name">${name}</h3>
        <p class="product-price">${formatPrice(product.price)}</p>
        <button type="button" class="add-to-cart-btn" data-action="add-to-cart">
          Ongeza kwenye Cart
        </button>
      </div>
    </article>
  `;
};

const render = (list) => {
  const { grid } = getEls();

  if (list.length === 0) {
    products = [];
    grid.innerHTML = `<p class="product-empty">${MESSAGES.empty}</p>`;
    return;
  }

  products = list.slice(0, MAX_VISIBLE);
  const hiddenCount = list.length - products.length;

  grid.innerHTML =
    products.map(cardHTML).join('') +
    (hiddenCount > 0
      ? `<p class="product-more">Na bidhaa zingine ${hiddenCount} zinapatikana.</p>`
      : '');

  syncFavoriteIcons();
};

// Moyo ujae kwa bidhaa zilizokwisha kuwa favorites.
// isFavorited na syncFavoriteButtons zinatoka base.html.
const syncFavoriteIcons = () => {
  products.forEach(({ id }) => {
    const key = String(id);
    window.syncFavoriteButtons(key, window.isFavorited(key));
  });
};

const SKELETON_COUNT = 6;

// Kadi za kijivu zinazoonyeshwa wakati bidhaa zinapakiwa.
const renderSkeleton = () => {
  const { grid } = getEls();
  grid.closest('section')?.setAttribute('aria-busy', 'true');
  grid.innerHTML = Array.from({ length: SKELETON_COUNT }, () => `
    <div class="product-card skeleton" aria-hidden="true">
      <div class="sk-img"></div>
      <div class="product-info"><div class="sk-line"></div><div class="sk-line short"></div><div class="sk-btn"></div></div>
    </div>`).join('');
};

// ---------------------------------------------------------------
// LOAD
// ---------------------------------------------------------------
const loadProducts = async (term = '') => {
  // Futa request ya zamani ili majibu ya zamani yasifunike mapya.
  currentRequest?.abort();
  currentRequest = new AbortController();

  hideStatus();
  renderSkeleton();

  try {
    const data = await fetchProducts(term, currentRequest.signal);
    getEls().grid.closest('section')?.setAttribute('aria-busy', 'false');
    render(data);
  } catch (error) {
    if (error.name === 'AbortError') return;
    getEls().grid.innerHTML = '';
    showStatus(MESSAGES.error);
  }
};

// ---------------------------------------------------------------
// EVENTS (delegation: listener moja kwa grid nzima)
// ---------------------------------------------------------------
const handleGridClick = (event) => {
  const button = event.target.closest('[data-action]');
  if (!button) return;

  const card = button.closest('[data-product-id]');
  const product = products.find((p) => String(p.id) === card?.dataset.productId);
  if (!product) return;

  if (button.dataset.action === 'favorite') {
    window.toggleFavorite(String(product.id), product.name, product.price);
  } else if (button.dataset.action === 'add-to-cart') {
  window.addToCart(
    String(product.id),
    product.name,
    product.price,
    product.image_url || FALLBACK_IMAGE,
    button
  );
}
};

// ---------------------------------------------------------------
// INIT
// ---------------------------------------------------------------
export const initShowProduct = () => {
  const { grid, search } = getEls();
  if (!grid) return;

  grid.addEventListener('click', handleGridClick);

  const onSearch = debounce((term) => loadProducts(term), SEARCH_DELAY_MS);
  search?.addEventListener('input', (e) => onSearch(e.target.value.trim()));

  loadProducts();
};