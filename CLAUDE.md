# Shared Agent Instructions (`CLAUDE.md` / `AGENTS.md`)

This repository (`Waddat-beverage` for **waddatdrinks.com**) is actively worked on across multiple coding agents (**Antigravity**, **Claude Code**, and **ChatGPT / Codex**). Follow these rules on every task so all agents stay in sync and never overwrite each other's work.

## 1. Sync Before Starting Work
- Always run `git status -sb` and `git pull --rebase origin main` before editing files.
- Note that pushing to `main` triggers `.github/workflows/build.yml`, which may push an automated `"Build dist"` commit to `origin/main` if `dist/` was not already built prior to pushing. Pulling first prevents non-fast-forward push rejections.

## 2. Source of Truth vs. `dist/` (Never Edit `dist/` First)
- **Never edit files inside `dist/` directly.** `npm run build` (`vite build`) overwrites `dist/` from the root/source files. Editing `dist/` without updating source files causes changes to be wiped out on the next build and triggers editor file-conflict errors.
- **Always edit the source files first:**
  - Homepage: `index.html`
  - Our Story page: `our-story/index.html`
  - 404 page: `404.html`
  - Active Product pages (5):
    - `product/ginger/index.html`
    - `product/sorrel-drink/index.html`
    - `product/Lemonade/index.html`
    - `product/Pineapple-Sea-Moss/index.html`
    - `product/Soursop-Sea-Moss/index.html`
  - Static assets & scripts (copied into `dist/` during build): `public/` (`public/js/forms.js`, `public/css/whatsapp.css`, `public/.htaccess`, `public/Waddat Drinks Trade Brochure 2026.pdf`, `public/llms.txt`, `public/llms-full.txt`, `public/fruits/`, etc.)
  - Root SEO/AI files: `sitemap.xml`, `robots.txt`, `llms.txt`, `llms-full.txt`
  - React components/data (keep in sync when applicable): `src/`
- **When updating shared site-wide elements** (navbar, footer, testimonials slider, floating WhatsApp button, wholesale/newsletter forms, brochure links), update `index.html`, `our-story/index.html` (where applicable), and all 5 active `product/*/index.html` files.
- **Always run `npm run build` after making source edits** and commit both the source files and the regenerated `dist/` files together. That way local files, `dist/`, and `origin/main` match immediately without needing an extra CI commit.

## 3. Hosting, Redirects & CI Checks
- **Production domain**: `https://waddatdrinks.com` (hosted on Krystal Apache/LiteSpeed via cPanel Git Version Control using `.cpanel.yml`).
- **Apache config**: `public/.htaccess` is the source of truth. `npm run build` copies `public/.htaccess` to `dist/.htaccess`.
- **CI checks (`.github/workflows/build.yml`)**:
  - Verifies `cmp public/.htaccess dist/.htaccess`
  - Verifies `test -s "dist/Waddat Drinks Trade Brochure 2026.pdf"`
- See `docs/brochure-redirect.md` and `scripts/check-brochure-redirect.py` for details on the trade brochure 301 redirect and live verification.

