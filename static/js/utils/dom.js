// Helpers zinazotumika na modules zote.

const HTML_ESCAPES = {
  '&': '&amp;',
  '<': '&lt;',
  '>': '&gt;',
  '"': '&quot;',
  "'": '&#39;',
};

// Inabadilisha herufi hatari kabla ya kuweka text kwenye innerHTML.
export const escapeHTML = (value) =>
  String(value ?? '').replace(/[&<>"']/g, (ch) => HTML_ESCAPES[ch]);

export const formatPrice = (value) => `Tsh ${Number(value).toLocaleString()}`;

export const debounce = (fn, delay = 300) => {
  let timer;
  return (...args) => {
    clearTimeout(timer);
    timer = setTimeout(() => fn(...args), delay);
  };
};

