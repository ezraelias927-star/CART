import { escapeHTML as e } from '../utils/dom.js';

const hero = {
  title: 'Bidhaa bora, bei nafuu,',
  accent: 'mlangoni kwako',
  text: 'Lipa kwa urahisi, pokea haraka.',
  cta: { label: 'Angalia bidhaa →', target: '#products' },
  image: { src: '/static/uploads/products/hero.jpg', alt: 'Bidhaa zetu' },
};

const render = (el) => {
  el.innerHTML = `
    <img class="hero-img" src="${e(hero.image.src)}" alt="${e(hero.image.alt)}" width="1200" height="480" fetchpriority="high">
    <div class="container-fluid px-3 px-lg-5 h-100">
      <div class="hero-copy d-flex flex-column justify-content-center h-100">
        <h1 class="hero-title">${e(hero.title)} <span>${e(hero.accent)}</span></h1>
        <p class="hero-text">${e(hero.text)}</p>
        <a class="btn btn-brand rounded-pill px-4 align-self-start" href="${e(hero.cta.target)}">${e(hero.cta.label)}</a>
      </div>
    </div>`;
};

export const initHero = () => {
  const el = document.getElementById('hero');
  if (el) render(el);
};