/* ============================================================
   OIR — Analytics loader
   ------------------------------------------------------------
   Privacy-conscious, vendor-agnostic. NO SECRETS in this file.

   Each provider stays OFF until you give it a real credential.
   Configure in ONE of two ways:

   1) Inline, before this script loads:
      <script>
        window.OIR_ANALYTICS = {
          ga4:       { measurementId: 'G-ABC123XYZ' },
          plausible: { enabled: true, domain: 'oirtechnologies.com' },
          posthog:   { key: 'phc_realkeyhere', host: 'https://us.i.posthog.com' }
        };
      </script>
      <script src="assets/analytics.js" defer></script>

   2) Or edit the CONFIG defaults below at deploy time.

   The placeholder values below are inert: anything containing
   "XXXX" (or Plausible without enabled:true) is treated as "not
   configured" and skipped, so an unconfigured deploy makes zero
   third-party requests.
   ============================================================ */
(function () {
  'use strict';

  var CONFIG = Object.assign({
    // Google Analytics 4 — replace with your Measurement ID (G-XXXXXXXXXX)
    ga4:       { measurementId: 'G-XXXXXXXXXX', anonymizeIp: true },
    // Plausible (cookieless) — set enabled:true and your verified domain
    plausible: { enabled: false, domain: 'oirtechnologies.com', src: 'https://plausible.io/js/script.js' },
    // PostHog (product analytics) — replace key with your project key (phc_...)
    posthog:   { key: 'phc_XXXXXXXXXXXXXXXXXXXXXXXXXXXX', host: 'https://us.i.posthog.com' }
  }, window.OIR_ANALYTICS || {});

  function configured(v) {
    return typeof v === 'string' && v.length > 0 && v.indexOf('XXXX') === -1;
  }

  var active = { ga4: false, plausible: false, posthog: false };

  /* ---------------- Google Analytics 4 ---------------- */
  function initGA4(cfg) {
    if (!cfg || !configured(cfg.measurementId)) return;
    var s = document.createElement('script');
    s.async = true;
    s.src = 'https://www.googletagmanager.com/gtag/js?id=' + encodeURIComponent(cfg.measurementId);
    document.head.appendChild(s);
    window.dataLayer = window.dataLayer || [];
    window.gtag = function () { window.dataLayer.push(arguments); };
    window.gtag('js', new Date());
    window.gtag('config', cfg.measurementId, { anonymize_ip: cfg.anonymizeIp !== false });
    active.ga4 = true;
  }

  /* ---------------- Plausible (cookieless) ---------------- */
  function initPlausible(cfg) {
    if (!cfg || cfg.enabled !== true || !configured(cfg.domain)) return;
    var s = document.createElement('script');
    s.defer = true;
    s.setAttribute('data-domain', cfg.domain);
    s.src = cfg.src || 'https://plausible.io/js/script.js';
    document.head.appendChild(s);
    window.plausible = window.plausible || function () { (window.plausible.q = window.plausible.q || []).push(arguments); };
    active.plausible = true;
  }

  /* ---------------- PostHog ---------------- */
  function initPostHog(cfg) {
    if (!cfg || !configured(cfg.key)) return;
    // Minimal official snippet
    !function (t, e) { var o, n, p, r; e.__SV || (window.posthog = e, e._i = [], e.init = function (i, s, a) { function g(t, e) { var o = e.split('.'); 2 == o.length && (t = t[o[0]], e = o[1]), t[e] = function () { t.push([e].concat(Array.prototype.slice.call(arguments, 0))); }; } (p = t.createElement('script')).type = 'text/javascript', p.async = !0, p.src = s.api_host + '/static/array.js', (r = t.getElementsByTagName('script')[0]).parentNode.insertBefore(p, r); var u = e; for (void 0 !== a ? u = e[a] = [] : a = 'posthog', u.people = u.people || [], u.toString = function (t) { var e = 'posthog'; return 'posthog' !== a && (e += '.' + a), t || (e += ' (stub)'), e; }, u.people.toString = function () { return u.toString(1) + '.people (stub)'; }, o = 'capture identify alias people.set people.set_once set_config register register_once unregister opt_out_capturing has_opted_out_capturing opt_in_capturing reset isFeatureEnabled onFeatureFlags getFeatureFlag getFeatureFlagPayload reloadFeatureFlags group updateEarlyAccessFeatureEnrollment getEarlyAccessFeatures getActiveMatchingSurveys getSurveys'.split(' '), n = 0; n < o.length; n++) g(u, o[n]); e._i.push([i, s, a]); }, e.__SV = 1); }(document, window.posthog || []);
    window.posthog.init(cfg.key, { api_host: cfg.host || 'https://us.i.posthog.com', capture_pageview: true });
    active.posthog = true;
  }

  /* ---------------- Unified event API ---------------- */
  function track(name, props) {
    props = props || {};
    try {
      if (active.ga4 && window.gtag) window.gtag('event', name, props);
      if (active.plausible && window.plausible) window.plausible(name, { props: props });
      if (active.posthog && window.posthog && window.posthog.capture) window.posthog.capture(name, props);
    } catch (e) { /* never let analytics break the page */ }
    if (!active.ga4 && !active.plausible && !active.posthog && window.console && CONFIG.debug) {
      console.debug('[oir-analytics] (no provider configured) event:', name, props);
    }
  }

  /* ---------------- Auto-wiring ---------------- */
  function wire() {
    // CTA tracking: prefer an explicit data-analytics name; otherwise fall back
    // to a generic cta_click for any button / gold link so nothing is missed.
    document.addEventListener('click', function (e) {
      var tagged = e.target.closest('[data-analytics]');
      if (tagged) { track(tagged.getAttribute('data-analytics'), { label: (tagged.textContent || '').trim().slice(0, 60), href: tagged.getAttribute('href') || '' }); return; }
      var cta = e.target.closest('.btn, .link-gold');
      if (cta) track('cta_click', { label: (cta.textContent || '').trim().slice(0, 60), href: cta.getAttribute('href') || '' });
    });
    // Project brief submission
    var form = document.getElementById('projectForm');
    if (form) form.addEventListener('submit', function () { track('project_brief_submitted', { page: document.body.getAttribute('data-page') || '' }); });
  }

  initGA4(CONFIG.ga4);
  initPlausible(CONFIG.plausible);
  initPostHog(CONFIG.posthog);
  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', wire);
  else wire();

  // Public API for custom events elsewhere: window.oirAnalytics.track('name', {..})
  window.oirAnalytics = { track: track, active: active };
})();
