import { escapeHTML } from '../utils/dom.js';

// DATA: jina linatumika kama neno la kutafuta bidhaa
const categories = [
  { name: 'Simu', icon: '📱' },
  { name: 'Nguo', icon: '👕' },
  { name: 'Viatu', icon: '👟' },
  { name: 'Vifaa vya nyumbani', icon: '🏠' },
  { name: 'Urembo', icon: '💄' },
];

const render = (el) => {
  el.innerHTML = `
    <h2 class="section-title h5 fw-bold mb-2 px-3 px-lg-5">Kategoria</h2>
    <div class="category-list d-flex gap-3 gap-lg-4 overflow-x-auto py-2 px-3 px-lg-5" role="list">
      ${categories.map((c) => `
        <button type="button" class="category-chip" role="listitem" data-category="${escapeHTML(c.name)}">
          <span class="category-icon" aria-hidden="true">${c.icon}</span>${escapeHTML(c.name)}
        </button>`).join('')}
    </div>`;
};

// Module haitegemei showProduct: inatumia search bar iliyopo tu.
const selectCategory = (name) => {
  const input = document.getElementById('searchInput');
  if (!input) return;
  input.value = name;
  input.dispatchEvent(new Event('input', { bubbles: true }));
  document.getElementById('products')?.scrollIntoView({ behavior: 'smooth' });
};

export const initCategory = () => {
  const el = document.getElementById('category');
  if (!el) return;
  render(el);
  el.addEventListener('click', (e) => {
    const chip = e.target.closest('[data-category]');
    if (chip) selectCategory(chip.dataset.category);
  });
};