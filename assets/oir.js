/* ============================================================
   OIR — Site logic: nav, footer, interactions, tweaks
   ============================================================ */
(function () {
  const PAGES = [
    { id: 'work',     label: 'Work',     href: 'case-studies.html' },
    { id: 'products', label: 'Products', href: 'products.html' },
    { id: 'services', label: 'Services', href: 'services.html' },
    { id: 'approach', label: 'Approach', href: 'approach.html' },
    { id: 'about',    label: 'About',    href: 'about.html' },
  ];
  const current = document.body.getAttribute('data-page') || '';

  const arr = '<svg class="arr" width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.2"><path d="M5 12h14M13 6l6 6-6 6"/></svg>';
  const mark = `<svg class="mark" viewBox="0 0 40 40" fill="none" role="img" aria-label="Oir Technologies"><path d="M20 4 C 22.4 11, 27 14.4, 27 21.8 C 27 28.6 23.2 33.8 20 33.8 C 16.8 33.8 13 28.6 13 21.8 C 13 15 16.2 11.4 20 4 Z" fill="#C9A86A"/><path d="M20 17.5 C 21.1 20.4, 22.8 21.8, 22.8 25.2 C 22.8 28.4 21.5 30.8 20 30.8 C 18.5 30.8 17.2 28.4 17.2 25.2 C 17.2 22 18.9 19.2 20 17.5 Z" fill="#FBF4E2"/></svg>`;

  /* ---------- Header ---------- */
  const isActive = (id) => current === id || (id === 'products' && current.indexOf('product-') === 0);
  const navLinks = PAGES.map(p =>
    `<a href="${p.href}"${isActive(p.id) ? ' aria-current="page"' : ''} class="${isActive(p.id) ? 'active' : ''}">${p.label}</a>`).join('');

  const header = document.getElementById('site-header');
  if (header) {
    header.className = 'site-header' + (document.body.hasAttribute('data-light-header') ? ' light-page solid' : '');
    header.innerHTML = `
      <div class="wrap-wide"><div class="nav">
        <a class="brand" href="index.html">
          ${mark}
          <span><span class="brand-name">OIR</span><span class="brand-sub">Technologies</span></span>
        </a>
        <nav class="nav-links">${navLinks}</nav>
        <div class="nav-cta">
          <a class="btn btn-gold" href="start-a-project.html" data-analytics="cta_nav_build">Let's Build Together ${arr}</a>
          <button class="nav-toggle" aria-label="Menu" aria-expanded="false" aria-controls="oirMobileMenu" id="navToggle">
            <svg width="26" height="26" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M3 7h18M3 12h18M3 17h18"/></svg>
          </button>
        </div>
      </div></div>`;
  }

  /* ---------- Mobile menu ---------- */
  const mm = document.createElement('div');
  mm.className = 'mobile-menu';
  mm.id = 'oirMobileMenu';
  mm.innerHTML = `
    <div class="mm-top">
      <a class="brand" href="index.html">${mark}<span><span class="brand-name">OIR</span><span class="brand-sub">Technologies</span></span></a>
      <button id="mmClose" aria-label="Close" style="background:none;border:none;color:#fff;padding:8px">
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M6 6l12 12M18 6L6 18"/></svg>
      </button>
    </div>
    <nav>${PAGES.map(p => `<a href="${p.href}">${p.label}</a>`).join('')}</nav>
    <div class="mm-cta"><a class="btn btn-gold btn-lg" style="width:100%;justify-content:center" href="start-a-project.html" data-analytics="cta_mobilemenu_build">Let's Build Together ${arr}</a></div>`;
  document.body.appendChild(mm);
  function setMenu(open) {
    mm.classList.toggle('open', open);
    const t = document.getElementById('navToggle');
    if (t) t.setAttribute('aria-expanded', open ? 'true' : 'false');
    document.body.style.overflow = open ? 'hidden' : '';
  }
  document.addEventListener('click', e => {
    if (e.target.closest('#navToggle')) setMenu(true);
    if (e.target.closest('#mmClose')) setMenu(false);
    if (e.target.closest('#oirMobileMenu nav a')) setMenu(false);
  });
  document.addEventListener('keydown', e => { if (e.key === 'Escape' && mm.classList.contains('open')) setMenu(false); });

  /* ---------- Footer ---------- */
  const footer = document.getElementById('site-footer');
  if (footer) {
    footer.className = 'site-footer';
    footer.innerHTML = `
      <div class="wrap-wide">
        <div class="footer-grid">
          <div class="footer-brand">
            <div class="brand-name">OIR</div><div class="brand-sub">Technologies</div>
            <p>Building technology that moves communities and organizations forward.</p>
            <div class="footer-social">
              <a href="#" aria-label="LinkedIn"><svg width="16" height="16" viewBox="0 0 24 24" fill="currentColor"><path d="M4.98 3.5A2.5 2.5 0 002.5 6a2.5 2.5 0 005 0 2.5 2.5 0 00-2.52-2.5zM3 9h4v12H3zM9 9h3.8v1.7h.05c.53-1 1.83-2.05 3.77-2.05C20.6 8.65 22 10.9 22 14.3V21h-4v-5.9c0-1.4-.03-3.2-2-3.2-2 0-2.3 1.5-2.3 3.1V21H9z"/></svg></a>
              <a href="#" aria-label="X"><svg width="15" height="15" viewBox="0 0 24 24" fill="currentColor"><path d="M18.9 2H22l-7.4 8.5L23 22h-6.7l-5.2-6.8L5.1 22H2l7.9-9L1.5 2h6.8l4.7 6.2L18.9 2zm-2.4 18h1.9L7.6 4H5.6z"/></svg></a>
              <a href="#" aria-label="Email"><svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><rect x="3" y="5" width="18" height="14" rx="2"/><path d="M3 7l9 6 9-6"/></svg></a>
            </div>
          </div>
          <div class="footer-col"><h4>Company</h4>
            <a href="about.html">About</a><a href="case-studies.html">Case Studies</a>
            <a href="services.html">Services</a><a href="start-a-project.html">Careers</a></div>
          <div class="footer-col"><h4>Products</h4>
            <a href="product-shidduch.html">Shidduch App</a><a href="product-yad-parnasa.html">Yad Parnasa</a>
            <a href="product-gemach-network.html">Gemach Network</a><a href="products.html">All Products</a></div>
          <div class="footer-col"><h4>How We Build</h4>
            <a href="approach.html">Our Approach</a><a href="approach.html#principles">Our Principles</a>
            <a href="approach.html#engineering">Engineering & Security</a><a href="case-studies.html">Case Studies</a></div>
          <div class="footer-col"><h4>Contact</h4>
            <a href="start-a-project.html" data-analytics="cta_footer_start">Start a Project</a><a href="mailto:hello@oirtechnologies.com">hello@oirtechnologies.com</a>
            <a href="tel:+12125550198">(212) 555-0198</a></div>
        </div>
        <div class="footer-transparency">Some screenshots, workflows, and example data shown across this site are illustrative — intended to demonstrate product concepts, design, and functionality while products continue active development and testing. <a href="transparency.html">Read our transparency note</a>.</div>
        <div class="footer-bottom">
          <span>© 2026 Oir Technologies. All rights reserved.</span>
          <span style="display:flex;gap:24px"><a href="transparency.html">Transparency</a><a href="#">Privacy</a><a href="#">Terms</a><a href="#">Security</a></span>
        </div>
      </div>`;
  }

  /* ---------- Scroll: solid header ---------- */
  const hdr = document.getElementById('site-header');
  const isLight = document.body.hasAttribute('data-light-header');
  function onScroll() {
    if (!hdr || isLight) return;
    hdr.classList.toggle('solid', window.scrollY > 40);
  }
  window.addEventListener('scroll', onScroll, { passive: true });
  onScroll();

  /* ---------- Reveal on scroll (with robust fallbacks) ---------- */
  const reveals = Array.from(document.querySelectorAll('.reveal'));
  const allowMotion = window.matchMedia && window.matchMedia('(prefers-reduced-motion: no-preference)').matches;
  if (allowMotion) document.documentElement.classList.add('anim');
  function revealInView() {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    reveals.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.92 && r.bottom > 0) el.classList.add('in');
    });
  }
  if ('IntersectionObserver' in window) {
    const io = new IntersectionObserver(entries => {
      entries.forEach(en => { if (en.isIntersecting) { en.target.classList.add('in'); io.unobserve(en.target); } });
    }, { threshold: 0.08, rootMargin: '0px 0px -6% 0px' });
    reveals.forEach(el => io.observe(el));
  }
  window.addEventListener('scroll', revealInView, { passive: true });
  window.addEventListener('load', revealInView);
  revealInView();
  // Safety net: never leave content hidden
  setTimeout(() => reveals.forEach(el => el.classList.add('in')), 1200);

  /* ---------- Product filters ---------- */
  const filterBar = document.querySelector('[data-filters]');
  if (filterBar) {
    filterBar.addEventListener('click', e => {
      const chip = e.target.closest('.chip'); if (!chip) return;
      filterBar.querySelectorAll('.chip').forEach(c => c.classList.remove('active'));
      chip.classList.add('active');
      const cat = chip.getAttribute('data-cat');
      document.querySelectorAll('[data-product]').forEach(card => {
        const cats = (card.getAttribute('data-cat') || '').split(' ');
        const show = cat === 'all' || cats.includes(cat);
        card.style.display = show ? '' : 'none';
      });
    });
  }

  /* ---------- Render mockups + scale to fit ---------- */
  document.querySelectorAll('[data-mock]').forEach(el => {
    if (window.OirMock) el.innerHTML = OirMock.phone(el.getAttribute('data-mock'));
  });
  document.querySelectorAll('[data-laptop]').forEach(el => {
    if (window.OirMock) el.innerHTML = OirMock.laptopDash();
  });
  function scaleMocks() {
    document.querySelectorAll('.mock.is-phone').forEach(m => {
      const p = m.querySelector('.phone');
      if (p && m.clientWidth) p.style.transform = 'scale(' + (m.clientWidth / 230) + ')';
    });
    document.querySelectorAll('.lap-mock').forEach(m => {
      const l = m.querySelector('.laptop');
      if (l && m.clientWidth) l.style.transform = 'scale(' + (m.clientWidth / 460) + ')';
    });
  }
  scaleMocks();
  requestAnimationFrame(scaleMocks);
  window.addEventListener('load', scaleMocks);
  window.addEventListener('resize', scaleMocks);
  if (window.ResizeObserver) {
    const ro = new ResizeObserver(scaleMocks);
    document.querySelectorAll('.mock.is-phone, .lap-mock').forEach(m => ro.observe(m));
  }

  /* ---------- Tweaks ---------- */
  if (window.OirTweaks) window.OirTweaks.init();
})();
