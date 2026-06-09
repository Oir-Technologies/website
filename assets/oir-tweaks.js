/* ============================================================
   OIR — Tweaks panel (vanilla, persists across pages)
   ============================================================ */
(function () {
  const KEY = 'oir-tweaks-v1';
  const defaults = {
    gold: '#C9A86A', navy: '#07111F', serif: 'dmserif',
    radius: 16, scale: 1.0, density: 1.0,
  };
  const SERIFS = {
    dmserif: '"DM Serif Display", "Cormorant Garamond", Georgia, serif',
    cormorant: '"Cormorant Garamond", Georgia, serif',
    newsreader: '"Newsreader", Georgia, serif',
  };
  const NAVY_VARIANTS = {
    '#07111F': { n2: '#10233F', n3: '#19304f' },
    '#050B14': { n2: '#0C1B30', n3: '#142944' },
    '#0A1A2E': { n2: '#16304f', n3: '#20406a' },
  };
  const GOLD_VARIANTS = {
    '#C9A86A': { soft: '#d9c096', deep: '#a8854a' },
    '#B8924E': { soft: '#d0ad74', deep: '#946f36' },
    '#D4B97E': { soft: '#e3cda0', deep: '#b3965c' },
  };

  function load() {
    try { return Object.assign({}, defaults, JSON.parse(localStorage.getItem(KEY) || '{}')); }
    catch (e) { return Object.assign({}, defaults); }
  }
  function save(s) { localStorage.setItem(KEY, JSON.stringify(s)); }

  function apply(s) {
    const r = document.documentElement.style;
    const g = GOLD_VARIANTS[s.gold] || GOLD_VARIANTS['#C9A86A'];
    const n = NAVY_VARIANTS[s.navy] || NAVY_VARIANTS['#07111F'];
    r.setProperty('--gold', s.gold);
    r.setProperty('--gold-soft', g.soft);
    r.setProperty('--gold-deep', g.deep);
    r.setProperty('--navy', s.navy);
    r.setProperty('--navy-2', n.n2);
    r.setProperty('--navy-3', n.n3);
    r.setProperty('--serif', SERIFS[s.serif] || SERIFS.dmserif);
    r.setProperty('--radius', s.radius + 'px');
    r.setProperty('--radius-sm', Math.max(4, s.radius - 6) + 'px');
    r.setProperty('--radius-lg', (s.radius + 8) + 'px');
    r.setProperty('--type-scale', s.scale);
    r.setProperty('--space-unit', s.density);
  }

  let state = load();
  apply(state);

  // Preload Newsreader option font
  const pre = document.createElement('link');
  pre.rel = 'stylesheet';
  pre.href = 'https://fonts.googleapis.com/css2?family=Newsreader:opsz,wght@6..72,400;6..72,500&display=swap';
  document.head.appendChild(pre);

  function buildPanel() {
    const fab = document.createElement('button');
    fab.id = 'oirTweakFab';
    fab.setAttribute('aria-label', 'Design controls');
    fab.innerHTML = `<svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="3"/><path d="M12 2v3M12 19v3M2 12h3M19 12h3M4.9 4.9l2.1 2.1M17 17l2.1 2.1M19.1 4.9L17 7M7 17l-2.1 2.1"/></svg>`;

    const panel = document.createElement('div');
    panel.id = 'oirTweakPanel';
    panel.innerHTML = `
      <div class="tw-head"><span>Design Controls</span>
        <button id="twClose" aria-label="Close"><svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M6 6l12 12M18 6L6 18"/></svg></button></div>
      <div class="tw-body">
        <div class="tw-group"><label>Accent</label><div class="tw-swatches" data-k="gold">
          ${Object.keys(GOLD_VARIANTS).map(c => `<button data-v="${c}" style="background:${c}" class="${state.gold===c?'on':''}"></button>`).join('')}
        </div></div>
        <div class="tw-group"><label>Background depth</label><div class="tw-swatches" data-k="navy">
          ${Object.keys(NAVY_VARIANTS).map(c => `<button data-v="${c}" style="background:${c}" class="${state.navy===c?'on':''}"></button>`).join('')}
        </div></div>
        <div class="tw-group"><label>Headline type</label><div class="tw-seg" data-k="serif">
          <button data-v="dmserif" class="${state.serif==='dmserif'?'on':''}">Editorial</button>
          <button data-v="cormorant" class="${state.serif==='cormorant'?'on':''}">Classic</button>
          <button data-v="newsreader" class="${state.serif==='newsreader'?'on':''}">Modern</button>
        </div></div>
        <div class="tw-group"><label>Type scale <em id="twScaleV">${state.scale.toFixed(2)}×</em></label>
          <input type="range" min="0.9" max="1.12" step="0.01" value="${state.scale}" data-k="scale"></div>
        <div class="tw-group"><label>Corner radius <em id="twRadV">${state.radius}px</em></label>
          <input type="range" min="0" max="24" step="2" value="${state.radius}" data-k="radius"></div>
        <div class="tw-group"><label>Section density</label><div class="tw-seg" data-k="density">
          <button data-v="0.78" class="${state.density==0.78?'on':''}">Compact</button>
          <button data-v="1" class="${state.density==1?'on':''}">Default</button>
          <button data-v="1.22" class="${state.density==1.22?'on':''}">Airy</button>
        </div></div>
        <button class="tw-reset" id="twReset">Reset to default</button>
      </div>`;

    document.body.appendChild(fab);
    document.body.appendChild(panel);

    fab.addEventListener('click', () => panel.classList.toggle('open'));
    panel.querySelector('#twClose').addEventListener('click', () => panel.classList.remove('open'));

    panel.querySelectorAll('.tw-swatches, .tw-seg').forEach(grp => {
      grp.addEventListener('click', e => {
        const b = e.target.closest('button'); if (!b) return;
        const k = grp.getAttribute('data-k');
        grp.querySelectorAll('button').forEach(x => x.classList.remove('on'));
        b.classList.add('on');
        let v = b.getAttribute('data-v');
        if (k === 'density') v = parseFloat(v);
        state[k] = v; apply(state); save(state);
      });
    });
    panel.querySelectorAll('input[type=range]').forEach(inp => {
      inp.addEventListener('input', e => {
        const k = inp.getAttribute('data-k');
        const v = parseFloat(inp.value); state[k] = v;
        if (k === 'scale') panel.querySelector('#twScaleV').textContent = v.toFixed(2) + '×';
        if (k === 'radius') panel.querySelector('#twRadV').textContent = v + 'px';
        apply(state); save(state);
      });
    });
    panel.querySelector('#twReset').addEventListener('click', () => {
      state = Object.assign({}, defaults); apply(state); save(state);
      panel.remove(); fab.remove(); buildPanel();
      document.getElementById('oirTweakPanel').classList.add('open');
    });
  }

  window.OirTweaks = { init: buildPanel, apply: () => apply(state) };
})();
