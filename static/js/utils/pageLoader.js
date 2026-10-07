const MIN_MS = 2000;  // muda wa chini wa kuonekana (tangu ukurasa uanze kufunguka)
const MAX_MS = 8000;  // kinga: usikwame milele

const loader = document.getElementById('pageLoader');

const hide = () => {
  if (!loader || loader.classList.contains('hidden')) return;
  loader.classList.add('hidden');
  loader.addEventListener('transitionend', () => loader.remove(), { once: true });
};

// performance.now() = milisekunde tangu ukurasa uanze kufunguka,
// kwa hiyo muda wa kupakia tayari umehesabiwa.
const hideAfterMin = () => setTimeout(hide, Math.max(0, MIN_MS - performance.now()));

if (document.readyState === 'complete') hideAfterMin();
else window.addEventListener('load', hideAfterMin, { once: true });

setTimeout(hide, MAX_MS);