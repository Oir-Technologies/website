/* ============================================================
   OIR — Mockup markup helpers (clean product screenshots)
   Usage: el.innerHTML = OirMock.phone('shidduch')
   ============================================================ */
(function () {
  const I = {
    check: '<svg width="13" height="13" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="3"><path d="M5 13l4 4L19 7"/></svg>',
    car: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><path d="M5 16l1.5-5h11L19 16M3 16h18v3H3z"/><circle cx="7" cy="19" r="1.3"/><circle cx="17" cy="19" r="1.3"/></svg>',
    meal: '<svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="1.8"><circle cx="12" cy="12" r="8"/><circle cx="12" cy="12" r="3"/></svg>',
  };

  function statusInline(color) {
    return `<div class="status" style="color:${color}"><span>9:41</span><span class="dots"><i></i><i></i><i></i> &nbsp;5G</span></div>`;
  }
  function floral() {
    return `<svg viewBox="0 0 48 48" fill="none" stroke="currentColor" stroke-width="1.3"><circle cx="24" cy="24" r="5"/><g><ellipse cx="24" cy="11" rx="4" ry="8"/><ellipse cx="24" cy="37" rx="4" ry="8"/><ellipse cx="11" cy="24" rx="8" ry="4"/><ellipse cx="37" cy="24" rx="8" ry="4"/><ellipse cx="14" cy="14" rx="7" ry="3.5" transform="rotate(45 14 14)"/><ellipse cx="34" cy="34" rx="7" ry="3.5" transform="rotate(45 34 34)"/><ellipse cx="34" cy="14" rx="7" ry="3.5" transform="rotate(-45 34 14)"/><ellipse cx="14" cy="34" rx="7" ry="3.5" transform="rotate(-45 14 34)"/></g></svg>`;
  }

  const screens = {
    shidduch: () => `
      <div class="sg m-shidduch-in">
        ${statusInline('rgba(243,241,234,.85)')}
        <div class="body">
          <div class="ey">A match for you</div>
          <div class="ava"></div>
          <div class="nm">Tovi Cohen</div>
          <div class="mt">28 · Educator · Lakewood, NJ</div>
          <div class="al">98% aligned</div>
        </div>
        <div class="cta-bar">Request introduction</div>
      </div>`,

    parnasa: () => `
      <div class="sg">
        ${statusInline('#9fb0c8')}
        <div class="hdr">
          <div class="hello">Good morning, Shimon</div>
          <div class="big"><b>3</b> new opportunities</div>
        </div>
        <div class="body">
          <div class="card">
            <div class="logo">M</div>
            <div class="t">Operations Manager</div>
            <div class="c">Maor Group · Brooklyn, NY</div>
            <div class="tags"><span class="g">Full-time</span><span>$85k+</span></div>
          </div>
        </div>
      </div>`,

    chesed: () => `
      <div class="sg">
        ${statusInline('rgba(255,255,255,.85)')}
        <div class="hdr">
          <div class="lbl">This month</div>
          <div class="big">128</div>
          <div class="cap">acts of chesed coordinated</div>
        </div>
        <div class="body">
          <div class="req"><span class="ic">${I.car}</span><div class="tx"><b>Medical transport</b><span>Monsey · Today, 3:00pm</span></div></div>
          <div class="req"><span class="ic">${I.meal}</span><div class="tx"><b>Shabbos meals ×4</b><span>Lakewood · Friday</span></div></div>
        </div>
      </div>`,

    kallah: () => `
      <div class="sg"><div class="scene">
        <div class="cardp">
          <div class="floral">${floral()}</div>
          <div class="mz">Mazel Tov!</div>
          <div class="sub">The community came together for you</div>
          <div class="rule"></div>
          <div class="date-l">Wedding date</div>
          <div class="date">15 Sivan · June 15, 2025</div>
          <div class="steps">
            <div class="st done"><div class="dot">${I.check}</div><span>Planning</span></div>
            <div class="st done"><div class="dot">${I.check}</div><span>Vendors</span></div>
            <div class="st done"><div class="dot">${I.check}</div><span>Funded</span></div>
            <div class="st"><div class="dot">4</div><span>Simcha</span></div>
          </div>
        </div>
      </div></div>`,

    gemach: () => `
      <div class="sg">
        <div class="map">
          <div class="road r1"></div><div class="road r2"></div><div class="road r3"></div>
          <div class="pin p1"><i></i></div><div class="pin navy p2"><i></i></div><div class="pin p3"><i></i></div>
        </div>
        <div class="sheet">
          <div class="grab"></div>
          <div class="item"><div class="th"></div><div class="tx"><b>Folding tables</b><span>Available · 0.4 mi away</span></div><span class="pill">Free</span></div>
          <div class="cap">240+ items shared across 18 gemachs nearby</div>
        </div>
      </div>`,

    neshamah: () => `
      <div class="sg">
        <div class="nshead"><div class="hb">In loving memory</div></div>
        <div class="candle-wrap">
          <div class="flame"></div>
          <div class="candle"></div>
          <div class="hb-name"><div class="he">לזכר נשמת</div><div class="en">Yahrzeit · 14 Adar</div></div>
        </div>
        <div class="ns-actions"><div class="b">Light a candle</div></div>
      </div>`,

    mitzvah: () => `
      <div class="sg">
        ${statusInline('#b09a72')}
        <div class="hdr"><div class="dt">Today · 12 Iyar</div></div>
        <div class="ringwrap">
          <div class="ring2"><span>2<i>/3</i></span></div>
          <div class="cap">Two of three mitzvos done</div>
        </div>
        <div class="body">
          <div class="ck on"><span class="bx">${I.check}</span><b>Give tzedakah</b></div>
          <div class="ck"><span class="bx"></span><b>Say Modeh Ani</b></div>
        </div>
      </div>`,
  };

  function phone(id) {
    return `<div class="mock is-phone m-${id}"><div class="psizer"><div class="phone"><div class="notch"></div><div class="screen">${(screens[id]||screens.shidduch)()}</div></div></div></div>`;
  }

  function laptopDash() {
    let bars = '';
    const h = [42,56,50,64,60,74,70,82,78,92];
    h.forEach(v => bars += `<b style="height:${v}%"></b>`);
    return `<div class="lap-mock"><div class="psizer"><div class="laptop"><div class="lid"><div class="lscreen"><div class="dash">
      <div class="side"><div class="lg"></div><i></i><i class="on"></i><i></i><i></i><i></i></div>
      <div class="main">
        <div class="dh">Overview</div>
        <div class="kpis">
          <div class="kpi"><div class="l">Active users</div><div class="v">24.8K</div><div class="c">↑ 10%</div></div>
          <div class="kpi"><div class="l">Connections</div><div class="v">8.3K</div><div class="c">↑ 22%</div></div>
          <div class="kpi"><div class="l">Impact</div><div class="v">118K+</div><div class="c">↑ 31%</div></div>
        </div>
        <div class="panel"><div class="pt">People positively impacted</div><div class="spark">${bars}</div></div>
      </div>
    </div></div></div><div class="base"></div></div></div></div>`;
  }

  window.OirMock = { phone, laptopDash };
})();
