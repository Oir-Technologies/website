# Oir Technologies — Deployment Guide

A static, no-build site (HTML/CSS/JS). It deploys to **Netlify** with zero build configuration. Estimated time to live: **~15 minutes**.

- **Production domain:** `https://oirtechnologies.com`
- **Stack:** static HTML + CSS + vanilla JS. No framework, no bundler, no build command.
- **Config:** [`netlify.toml`](netlify.toml) (publish dir, caching, security headers).

---

## 0. Pre-flight checklist

- [ ] `analytics.js` providers configured (or intentionally left as inert placeholders) — see [Analytics](#analytics-configuration).
- [ ] Real contact details swapped in (`hello@oirtechnologies.com`, phone) — currently placeholders in `assets/oir.js` and `start-a-project.html`.
- [ ] The project-brief form is wired to a real backend (currently front-end only; see [Form](#form-handling)).
- [ ] `_design_extract/` is git-ignored (already in `.gitignore`) so the design bundle never deploys.

---

## 1. Push to GitHub

From the project root:

```bash
git init
git add .
git commit -m "Launch-ready Oir Technologies site"
git branch -M main

# Create the remote (GitHub CLI), or create an empty repo on github.com first
gh repo create oir-technologies --private --source=. --remote=origin
git push -u origin main
```

If you created the repo manually instead of with `gh`:

```bash
git remote add origin https://github.com/<your-org>/oir-technologies.git
git push -u origin main
```

> `.gitignore` already excludes `_design_extract/`, `design_response.txt`, `.DS_Store`, and `.claude/launch.json`.

---

## 2. Deploy to Netlify

### Option A — Git-connected (recommended; gives automatic deploys + rollbacks)

1. Log in at [app.netlify.com](https://app.netlify.com) → **Add new site → Import an existing project**.
2. Choose **GitHub** and authorize, then pick the `oir-technologies` repo.
3. Build settings (Netlify reads `netlify.toml`, so these should auto-fill):
   - **Build command:** *(empty)*
   - **Publish directory:** `.`
4. Click **Deploy site**. First deploy completes in well under a minute.
5. Every push to `main` now auto-deploys. Every pull request gets a **Deploy Preview** URL.

### Option B — Drag-and-drop (fastest one-off, no Git)

1. [app.netlify.com](https://app.netlify.com) → **Add new site → Deploy manually**.
2. Drag the **project folder** (excluding `_design_extract/`) onto the drop zone.
3. Done — a temporary `*.netlify.app` URL is live immediately.

### Option C — Netlify CLI

```bash
npm i -g netlify-cli
netlify login
netlify init        # link to the GitHub repo, or create a new site
netlify deploy --prod   # publishes the current directory
```

---

## 3. Custom domain setup (`oirtechnologies.com`)

1. In the site dashboard → **Domain management → Add a domain** → enter `oirtechnologies.com`.
2. Netlify will offer two paths:

   **A. Netlify DNS (simplest).** Point your registrar's nameservers to the four Netlify nameservers shown (e.g. `dns1.p0X.nsone.net`…). Netlify then manages records and certificates automatically.

   **B. External DNS.** At your registrar, add:
   | Type | Name | Value |
   |------|------|-------|
   | `A` | `@` (apex) | `75.2.60.5` *(use the IP Netlify shows you)* |
   | `CNAME` | `www` | `<your-site>.netlify.app` |

3. Set the **primary domain** to your preferred form (apex `oirtechnologies.com` or `www.`). Netlify auto-creates a 301 redirect from the other form, which keeps your `.html` canonicals authoritative.
4. DNS propagation is usually minutes, up to 24–48h worst case.

---

## 4. SSL / HTTPS verification

1. Once DNS resolves, Netlify auto-provisions a free **Let's Encrypt** certificate (Domain management → HTTPS).
2. Click **Verify DNS configuration**, then **Provision certificate** if it doesn't start automatically.
3. Enable **Force HTTPS** (redirects all HTTP → HTTPS).
4. Verify:
   ```bash
   curl -sI https://oirtechnologies.com | grep -i 'HTTP\|strict-transport\|content-type'
   ```
   Expect `HTTP/2 200`. Confirm the padlock in a browser and that `http://` redirects to `https://`.
5. Certificates auto-renew ~30 days before expiry — no action needed.

---

## 5. Rollback

**Git-connected sites** keep an immutable history of every deploy.

1. Dashboard → **Deploys**.
2. Find the last known-good deploy in the list.
3. Open it → **Publish deploy** (a.k.a. "Restore"). Production instantly serves that snapshot — no rebuild.

CLI equivalent:
```bash
netlify rollback        # reverts production to the previous deploy
```

To roll back via source control instead:
```bash
git revert <bad-commit-sha>
git push        # triggers a fresh, corrected deploy
```

> Because deploys are atomic snapshots, rollback is instant and safe; there is no half-deployed state.

---

## Analytics configuration

`assets/analytics.js` ships **inert** — no third-party requests until you provide a real credential. Configure either by editing the `CONFIG` defaults in that file, or by defining `window.OIR_ANALYTICS` before the script loads. Activate only what you need:

```html
<script>
  window.OIR_ANALYTICS = {
    ga4:       { measurementId: 'G-XXXXXXXXXX' },              // Google Analytics 4
    plausible: { enabled: true, domain: 'oirtechnologies.com' }, // cookieless
    posthog:   { key: 'phc_xxx', host: 'https://us.i.posthog.com' }
  };
</script>
```

CTA clicks (`data-analytics` attributes + a generic `.btn`/`.link-gold` fallback) and the project-brief submit fire automatically through the unified `track()` API. **No secrets are committed** — keep keys in Netlify environment/site settings or inject them at the edge.

---

## Form handling

The project-brief form in `start-a-project.html` currently validates and shows a success state **client-side only** — it does not deliver submissions yet. To make it live, either:

- Add `netlify` + `data-netlify="true"` to the `<form>` to use **Netlify Forms** (submissions appear in the dashboard; zero backend), **or**
- Point the form `action` at your CRM / inbox endpoint (e.g. Formspree, a serverless function).

---

## Notes

- **`og:image`** is `assets/og-image.svg`. Most platforms render it, but a few social scrapers don't parse SVG — export a 1200×630 **PNG** and update the four `og:image` / `twitter:image` tags for maximum compatibility.
- **Design controls** (the floating panel) persist via `localStorage` and require no server.
- **Pretty URLs** (`/products` instead of `/products.html`) can be toggled on in Netlify; canonicals already use `.html`, so no redirects are needed either way.
