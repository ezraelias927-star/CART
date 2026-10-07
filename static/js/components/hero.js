import { escapeHTML } from '../utils/dom.js';

// DATA: badilisha maudhui hapa tu
const hero = {
  title: 'Bidhaa bora, bei nafuu, zinafika mlangoni kwako',
  text: 'Chagua kutoka mamia ya bidhaa. Lipa kwa urahisi, pokea haraka.',
  cta: { label: 'Angalia bidhaa', target: '#products' },
  highlights: ['Uhakika wa ubora', 'Usafirishaji wa haraka', 'Msaada kila siku'],
};

const render = (el) => {
  el.innerHTML = `
    <div class="hero-inner">
      <h1 class="hero-title">${escapeHTML(hero.title)}</h1>
      <p class="hero-text">${escapeHTML(hero.text)}</p>
      <a class="hero-cta" href="${escapeHTML(hero.cta.target)}">${escapeHTML(hero.cta.label)}</a>
      <ul class="hero-highlights">
        ${hero.highlights.map((h) => `<li>${escapeHTML(h)}</li>`).join('')}
      </ul>
    </div>`;
};

export const initHero = () => {
  const el = document.getElementById('hero');
  if (el) render(el);
};