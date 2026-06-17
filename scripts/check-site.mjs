#!/usr/bin/env node
/**
 * Oir Technologies — static site checker (zero dependencies).
 *
 * Verifies, for a no-build static site deployed on Netlify:
 *   1. Internal links in *.html and the injected nav/footer (assets/oir.js) resolve.
 *   2. The AI Operations lead form is wired correctly for Netlify Forms.
 *   3. No obvious secrets are exposed in deployed assets.
 *   4. No leftover placeholder copy remains on the AI Operations pages.
 *
 * Run:  node scripts/check-site.mjs
 * Exits non-zero if any check fails (suitable for CI).
 */
import { readFileSync, readdirSync, existsSync, statSync } from 'node:fs';
import { fileURLToPath } from 'node:url';
import { dirname, join, resolve } from 'node:path';

const ROOT = resolve(dirname(fileURLToPath(import.meta.url)), '..');
const errors = [];
const warnings = [];
const ok = [];
const err = (m) => errors.push(m);
const warn = (m) => warnings.push(m);
const pass = (m) => ok.push(m);

const rootFiles = readdirSync(ROOT).filter((f) => statSync(join(ROOT, f)).isFile());
const htmlFiles = rootFiles.filter((f) => f.endsWith('.html'));

/* ---------- 1. Internal link resolution ---------- */
// Map a link target to an on-disk path (handles absolute, relative, clean URLs).
function resolveTarget(raw) {
  let t = raw.trim();
  if (!t) return null;
  if (/^(https?:|mailto:|tel:|data:|javascript:)/i.test(t)) return null; // external/non-file
  t = t.split('#')[0].split('?')[0]; // drop anchor + query
  if (!t) return null; // pure anchor like "#faq"
  if (t.includes('${')) return null; // JS template expression, not a literal
  // Clean URL served by a Netlify rewrite (netlify.toml): /ai-operations -> ai-operations.html
  if (t === '/ai-operations' || t === 'ai-operations' || t === '/ai-operations/') {
    return existsSync(join(ROOT, 'ai-operations.html')) ? 'ai-operations.html' : '__MISSING__';
  }
  let p = t.startsWith('/') ? t.slice(1) : t;
  if (p === '' ) p = 'index.html';
  if (p.endsWith('/')) p += 'index.html';
  return p;
}

function checkLinks(sourceFile, content, regexes) {
  for (const re of regexes) {
    let m;
    while ((m = re.exec(content)) !== null) {
      const target = resolveTarget(m[1]);
      if (target === null) continue;
      if (target === '__MISSING__' || !existsSync(join(ROOT, target))) {
        err(`Broken link in ${sourceFile}: "${m[1]}" -> ${target}`);
      }
    }
  }
}

const HREF_SRC = [/(?:href|src)\s*=\s*"([^"]+)"/gi];
for (const f of htmlFiles) {
  checkLinks(f, readFileSync(join(ROOT, f), 'utf8'), HREF_SRC);
}
// Nav + footer are injected by oir.js — validate every *.html literal it references.
const oirJsPath = join(ROOT, 'assets', 'oir.js');
if (existsSync(oirJsPath)) {
  const js = readFileSync(oirJsPath, 'utf8');
  checkLinks('assets/oir.js', js, [/['"]([A-Za-z0-9._\-]+\.html(?:#[A-Za-z0-9\-]+)?)['"]/g]);
}
if (errors.length === 0) pass(`Internal links resolve across ${htmlFiles.length} HTML files + nav/footer.`);

/* ---------- 2. Host-agnostic lead-form wiring (both forms) ---------- */
// Shared guarantees: real fetch submission, host-agnostic endpoint, honeypot,
// mailto fallback (no lead ever lost), and NO Netlify-only attributes.
const COMMON_FORM_CHECKS = [
  [/<form[^>]*\bmethod="POST"/i, 'method="POST"'],
  [/name="botcheck"/i, 'honeypot field present'],
  [/OIR_FORM_ENDPOINT/, 'configurable endpoint (host-agnostic)'],
  [/'mailto:'\s*\+\s*CONTACT/, 'mailto fallback so leads are never lost'],
  [/fetch\(\s*(cfg\.endpoint|ENDPOINT)/, 'real fetch submission (no fake success)'],
  [/data-netlify/i, 'no leftover Netlify-only attributes', true /* expectAbsent */],
];
function checkForm(file, label, extraChecks, fields) {
  if (!existsSync(join(ROOT, file))) { err(`${label}: page ${file} not found.`); return; }
  const c = readFileSync(join(ROOT, file), 'utf8');
  for (const [re, desc, expectAbsent] of [...COMMON_FORM_CHECKS, ...extraChecks]) {
    const present = re.test(c);
    if (expectAbsent ? !present : present) pass(`${label}: ${desc}.`);
    else err(`${label}: ${expectAbsent ? 'found unexpected' : 'missing'} — ${desc}.`);
  }
  for (const field of fields) {
    if (!new RegExp(`name="${field}"`).test(c)) err(`${label}: expected field "${field}" not found.`);
  }
}
checkForm('ai-operations-assessment.html', 'Assessment form', [
  [/name="consent"[^>]*required/i, 'consent checkbox is required'],
  [/ai-operations-thank-you\.html/i, 'thank-you redirect referenced'],
], ['name', 'organization', 'email', 'organization_type', 'staff_count', 'current_tools',
   'time_consuming_task', 'missed_followup', 'desired_outcome', 'budget', 'preferred_contact',
   'preferred_times', 'phone', 'consent']);
checkForm('start-a-project.html', 'Start-a-Project form', [
  [/project_form_start/, 'form-start analytics event'],
  [/project_form_error/, 'validation-error analytics event'],
  [/project_brief_delivered/, 'delivery-confirmed analytics event'],
  [/project_brief_fallback/, 'fallback analytics event'],
], ['name', 'email', 'org', 'type', 'stage', 'goals', 'timeline', 'budget', 'message']);

/* ---------- 3. Secret scan (deployed assets) ---------- */
const SECRET_PATTERNS = [
  [/sk_live_[0-9a-zA-Z]{16,}/, 'Stripe live secret key'],
  [/sk_test_[0-9a-zA-Z]{16,}/, 'Stripe test secret key'],
  [/rk_live_[0-9a-zA-Z]{16,}/, 'Stripe restricted key'],
  [/AKIA[0-9A-Z]{16}/, 'AWS access key id'],
  [/AIza[0-9A-Za-z_\-]{30,}/, 'Google API key'],
  [/-----BEGIN [A-Z ]*PRIVATE KEY-----/, 'private key block'],
  [/ghp_[0-9A-Za-z]{30,}/, 'GitHub token'],
];
function scanDir(dir, rel = '') {
  for (const entry of readdirSync(dir)) {
    if (entry === 'node_modules' || entry === '.git' || entry === '_sales' || entry.startsWith('.')) continue;
    const full = join(dir, entry);
    const relPath = rel ? `${rel}/${entry}` : entry;
    const st = statSync(full);
    if (st.isDirectory()) { scanDir(full, relPath); continue; }
    if (!/\.(html|css|js|mjs|json|txt|xml|toml)$/.test(entry)) continue;
    const c = readFileSync(full, 'utf8');
    for (const [re, label] of SECRET_PATTERNS) {
      const m = c.match(re);
      if (m && !m[0].includes('XXXX')) err(`Possible ${label} in ${relPath}: ${m[0].slice(0, 12)}…`);
    }
  }
}
scanDir(ROOT);
if (!errors.some((e) => e.includes('Possible'))) pass('No exposed secrets detected in deployed assets.');

/* ---------- 4. Placeholder copy on AI Operations pages ---------- */
const aiPages = htmlFiles.filter((f) => f.startsWith('ai-operations'));
// Note: the HTML `placeholder="…"` attribute is legitimate, so we don't flag the bare word.
const PLACEHOLDERS = [/lorem ipsum/i, /\bTODO\b/, /\bFIXME\b/, /\{\{[^}]+\}\}/, /\[PLACEHOLDER\]/i, /555-0198/];
for (const f of aiPages) {
  const c = readFileSync(join(ROOT, f), 'utf8');
  for (const re of PLACEHOLDERS) {
    if (re.test(c)) err(`Placeholder/fake content in ${f}: matches ${re}`);
  }
}
if (!errors.some((e) => e.includes('Placeholder'))) pass(`No placeholder copy on ${aiPages.length} AI Operations pages.`);

/* ---------- Report ---------- */
console.log('\nOir site check\n' + '='.repeat(40));
for (const m of ok) console.log('  ✓ ' + m);
for (const m of warnings) console.log('  ⚠ ' + m);
for (const m of errors) console.log('  ✗ ' + m);
console.log('='.repeat(40));
console.log(`${ok.length} passed · ${warnings.length} warnings · ${errors.length} errors\n`);
process.exit(errors.length ? 1 : 0);
