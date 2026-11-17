(() => {
  'use strict';
  const $ = (s, c = document) => c.querySelector(s);
  const $$ = (s, c = document) => [...c.querySelectorAll(s)];
  const reduce = matchMedia('(prefers-reduced-motion: reduce)').matches;

  // Год в футере
  $('#year').textContent = new Date().getFullYear();

  // Шапка при скролле
  const header = $('#header');
  const onScroll = () => header.classList.toggle('is-scrolled', scrollY > 30);
  addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  // Мобильное меню
  const burger = $('#burger'), nav = $('#nav');
  const setMenu = open => {
    nav.classList.toggle('is-open', open);
    burger.setAttribute('aria-expanded', open);
    burger.setAttribute('aria-label', open ? 'Закрыть меню' : 'Открыть меню');
    document.body.style.overflow = open ? 'hidden' : '';
  };
  burger.addEventListener('click', () => setMenu(!nav.classList.contains('is-open')));
  $$('a', nav).forEach(a => a.addEventListener('click', () => setMenu(false)));
  addEventListener('keydown', e => e.key === 'Escape' && setMenu(false));

  // Разбиваем заголовки на слова для анимации
  $$('.split').forEach(el => {
    const words = el.textContent.trim().split(/\s+/);
    el.innerHTML = words
      .map((w, i) => `<span class="w"><span style="--i:${i}">${w}</span></span>`)
      .join(' ');
  });

  // Появление при прокрутке
  const io = new IntersectionObserver((entries, obs) => {
    entries.forEach(e => {
      if (e.isIntersecting) { e.target.classList.add('is-in'); obs.unobserve(e.target); }
    });
  }, { threshold: 0.15, rootMargin: '0px 0px -40px 0px' });
  $$('.reveal, .split').forEach(el => io.observe(el));

  // Параллакс
  if (!reduce) {
    const items = $$('[data-speed]');
    let ticking = false;
    const update = () => {
      items.forEach(el => {
        const r = el.getBoundingClientRect();
        const offset = (r.top + r.height / 2 - innerHeight / 2) * parseFloat(el.dataset.speed);
        el.style.translate = `0 ${offset.toFixed(1)}px`;
      });
      ticking = false;
    };
    addEventListener('scroll', () => { if (!ticking) { ticking = true; requestAnimationFrame(update); } }, { passive: true });
    addEventListener('resize', update);
    update();
  }

  // Выбор мяса
  const meatName = $('#meatName');
  meatName.style.transition = 'opacity .15s';
  $$('.chip').forEach(chip => chip.addEventListener('click', () => {
    $$('.chip').forEach(c => { c.classList.remove('is-active'); c.setAttribute('aria-checked', 'false'); });
    chip.classList.add('is-active');
    chip.setAttribute('aria-checked', 'true');
    meatName.style.opacity = 0;
    setTimeout(() => {
      meatName.textContent = chip.dataset.meat.toLowerCase();
      meatName.style.opacity = 1;
    }, 150);
  }));
})();
