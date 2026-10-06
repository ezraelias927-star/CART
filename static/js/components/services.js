import { escapeHTML } from './dom.js';

// DATA
const services = [
  { icon: '🚚', title: 'Usafirishaji', text: 'Tunafikisha bidhaa popote ulipo.' },
  { icon: '💳', title: 'Malipo salama', text: 'Lipa kwa simu au pesa taslimu.' },
  { icon: '✅', title: 'Ubora uliohakikiwa', text: 'Kila bidhaa hukaguliwa kabla ya kutumwa.' },
  { icon: '💬', title: 'Msaada', text: 'Tupo tayari kukujibu kila siku.' },
];

const render = (el) => {
  el.innerHTML = `
    <h2 class="section-title">Huduma zetu</h2>
    <div class="services-grid">
      ${services.map((s) => `
        <article class="service-card">
          <span class="service-icon" aria-hidden="true">${s.icon}</span>
          <h3>${escapeHTML(s.title)}</h3>
          <p>${escapeHTML(s.text)}</p>
        </article>`).join('')}
    </div>`;
};

export const initServices = () => {
  const el = document.getElementById('services');
  if (el) render(el);
};