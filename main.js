// js/main.js
document.addEventListener('DOMContentLoaded', () => {
  /* ====== Ajuste aqui se o seu CSS usa outros nomes ====== */
  const CLASSE_MENU = 'ativo';      // classe de estado aberto (botão, menu, overlay)
  const CLASSE_REVEAL = 'visivel';  // classe que faz o .reveal aparecer
  const CLASSE_SCROLL = 'scrolled'; // classe do header ao rolar a página
  const BREAKPOINT = 768;           // px: acima disto o menu volta ao modo desktop
  /* ======================================================= */

  const header = document.querySelector('.navegacao');
  const botao = document.getElementById('sidebar');
  const menu = document.getElementById('menu-principal');
  const overlay = document.getElementById('menu-overlay');

  /* ---------- Menu hamburguer ---------- */
  if (botao && menu) {
    const estaAberto = () => botao.getAttribute('aria-expanded') === 'true';

    const abrir = () => {
      botao.classList.add(CLASSE_MENU);
      menu.classList.add(CLASSE_MENU);
      if (overlay) overlay.classList.add(CLASSE_MENU);
      botao.setAttribute('aria-expanded', 'true');
      botao.setAttribute('aria-label', 'Fechar menu de navegação');
      document.body.style.overflow = 'hidden'; // bloqueia o scroll do fundo
    };

    const fechar = () => {
      botao.classList.remove(CLASSE_MENU);
      menu.classList.remove(CLASSE_MENU);
      if (overlay) overlay.classList.remove(CLASSE_MENU);
      botao.setAttribute('aria-expanded', 'false');
      botao.setAttribute('aria-label', 'Abrir menu de navegação');
      document.body.style.overflow = '';
    };

    botao.addEventListener('click', () => (estaAberto() ? fechar() : abrir()));

    if (overlay) overlay.addEventListener('click', fechar);

    menu.querySelectorAll('a').forEach(link => link.addEventListener('click', fechar));

    document.addEventListener('keydown', e => {
      if (e.key === 'Escape' && estaAberto()) {
        fechar();
        botao.focus();
      }
    });

    window.addEventListener('resize', () => {
      if (window.innerWidth > BREAKPOINT && estaAberto()) fechar();
    });
  }

  /* ---------- Header ao rolar ---------- */
  if (header) {
    const atualizarHeader = () => {
      header.classList.toggle(CLASSE_SCROLL, window.scrollY > 20);
    };
    atualizarHeader();
    window.addEventListener('scroll', atualizarHeader, { passive: true });
  }

  /* ---------- Animação .reveal ---------- */
  const itens = document.querySelectorAll('.reveal');

  if ('IntersectionObserver' in window && itens.length) {
    const observador = new IntersectionObserver(
      (entradas, obs) => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            entrada.target.classList.add(CLASSE_REVEAL);
            obs.unobserve(entrada.target);
          }
        });
      },
      { threshold: 0.15, rootMargin: '0px 0px -40px 0px' }
    );
    itens.forEach(el => observador.observe(el));
  } else {
    // Navegadores antigos: mostra tudo
    itens.forEach(el => el.classList.add(CLASSE_REVEAL));
  }

  /* ---------- Link ativo conforme a secção ---------- */
  const links = document.querySelectorAll('#menu-principal a[href^="#"]');
  const seccoes = [...links]
    .map(a => document.querySelector(a.getAttribute('href')))
    .filter(Boolean);

  if ('IntersectionObserver' in window && seccoes.length) {
    const observadorLinks = new IntersectionObserver(
      entradas => {
        entradas.forEach(entrada => {
          if (entrada.isIntersecting) {
            links.forEach(a => {
              const ativo = a.getAttribute('href') === `#${entrada.target.id}`;
              a.classList.toggle('ativo', ativo);
              if (ativo) a.setAttribute('aria-current', 'true');
              else a.removeAttribute('aria-current');
            });
          }
        });
      },
      { rootMargin: '-40% 0px -55% 0px' }
    );
    seccoes.forEach(s => observadorLinks.observe(s));
  }
});
