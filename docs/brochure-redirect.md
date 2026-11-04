# Legacy trade brochure redirect

The exact root URL `/Waddat%20Beverage%20Trade%20Brochure%202.pdf` must return
HTTP 301 directly to
`https://waddatdrinks.com/Waddat%20Drinks%20Trade%20Brochure%202026.pdf`.
The old PDF can remain on disk.

## Configuration and deployment

`public/.htaccess` is the source of truth. Immediately after `RewriteBase /`,
before hostname/HTTPS redirects, existing-file checks, and fallback rules, it has:

```apache
RewriteRule "^Waddat Beverage Trade Brochure 2\.pdf$" "https://waddatdrinks.com/Waddat Drinks Trade Brochure 2026.pdf" [R=301,L]
```

The anchored pattern matches only that decoded filename. Apache/LiteSpeed
decodes `%20` to spaces before matching the rule. The destination is quoted to
allow literal spaces, which the redirect encodes as `%20` exactly once. Do not
add `NE` or substitute bare `%20` sequences into the replacement string. The
destination does not match the source pattern,
so it cannot loop. Query strings are retained by the existing rewrite behavior.
The absolute destination also avoids a second hostname or HTTPS redirect.

Vite copies `public/.htaccess` into `dist/.htaccess` during `npm run build`.
The GitHub workflow checks that these files match and that the destination PDF
exists before committing `dist`. Both `.htaccess` files are tracked.
The workflow only builds and commits files to GitHub; it does not deploy to
Krystal. A cPanel pull/deployment (or a separate configured hosting automation)
is still required. The existing `.cpanel.yml` copies `dist/.` (including hidden files) into
`/home/corners6/public_html/waddatbeverageltd.com`, then explicitly copies
`dist/.htaccess` there. Do not change this path merely because it uses the legacy
domain name; confirm the actual document root under cPanel **Domains**.

## cPanel deployment

1. Commit and push the prepared changes to GitHub `main`. Wait for **Build and
   Push** to finish, including any generated **Build dist** commit.
2. Open cPanel **Domains** and confirm the document root for `waddatdrinks.com`.
   The current repository deployment target is
   `/home/corners6/public_html/waddatbeverageltd.com`. If cPanel shows a different
   root, change only the `export DEPLOYPATH=...` task in `.cpanel.yml` to that
   confirmed absolute path, commit/push it, and then pull/deploy. Before deployment,
   back up the live `.htaccess` privately and compare it with the tracked version;
   retain any hosting-managed directives that exist only on the server.
3. In cPanel **Git Version Control**, manage the `Waddat-beverage` repository,
   open **Pull or Deploy**, choose **Update from Remote**, then **Deploy HEAD
   Commit**. Confirm the deployed commit includes the updated `dist/.htaccess`.
4. In **File Manager**, enable **Settings > Show Hidden Files (dotfiles)** and
   open `.htaccess` in the confirmed document root. Verify the exact rule appears
   after `RewriteBase /` and before the other rewrite rules.
5. Run the HTTP checks below. If a LiteSpeed cache is configured and an old
   response persists, purge the affected URL using the available LiteSpeed cache
   controls, then repeat the checks.

If Git deployment is unavailable, back up the live `.htaccess` in a private
directory outside the document root, then add only the rule above immediately
after the existing `RewriteBase /` inside its `<IfModule mod_rewrite.c>` block.
If no rewrite block exists, add one with `RewriteEngine On` and this rule before
any application routing. Preserve all hosting-managed directives. Keep the same
change in `public/.htaccess` and rebuild/commit `dist/.htaccess` so a later Git
deployment retains it. Confirm the new PDF exists in that document root.

## Post-deployment validation

Run these from a terminal; Vite dev/preview servers do not execute `.htaccess`.

`python3 scripts/check-brochure-redirect.py` makes real GET requests to the
exact old URL and repeats with a fresh UUID query string and `Cache-Control:
no-cache`. It checks the first status and encoded `Location`, follows the
redirect, verifies the final PDF signature/content type, and checks all five
product pages. It exits nonzero until the live redirect passes both variants.
The query string should be preserved on the destination. The JSON report is
written to `/tmp/waddat-live-brochure-check.json`.

```sh
curl -sS -I 'https://waddatdrinks.com/Waddat%20Beverage%20Trade%20Brochure%202.pdf'
curl -sS -I 'https://waddatdrinks.com/Waddat%20Drinks%20Trade%20Brochure%202026.pdf'
curl -sS -I -L --max-redirs 3 'https://waddatdrinks.com/Waddat%20Beverage%20Trade%20Brochure%202.pdf'
curl -sS -I 'https://waddatdrinks.com/product/ginger/'
curl -sS -I 'https://waddatdrinks.com/product/sorrel-drink/'
curl -sS -I 'https://waddatdrinks.com/product/Lemonade/'
curl -sS -I 'https://waddatdrinks.com/product/Pineapple-Sea-Moss/'
curl -sS -I 'https://waddatdrinks.com/product/Soursop-Sea-Moss/'
```

Expected: old URL returns **301** with exactly the new encoded URL in `Location`;
the new URL returns **200**, `Content-Type: application/pdf`, and no `Location`;
following the old URL makes one redirect and ends at the new PDF; product pages
return **200** with HTML. Open a product page and its brochure link as a final
browser check. Test a normal GET as well if HEAD and browser behavior differ.

Only successful post-deployment HTTP checks establish that the live redirect is
fixed. Local Apache checks establish configuration behavior, not live deployment.

References: [Apache rewrite matching](https://httpd.apache.org/docs/2.4/mod/mod_rewrite.html#rewriterule),
[redirect escaping](https://httpd.apache.org/docs/2.4/rewrite/flags.html#flag_ne),
[Vite public assets](https://vite.dev/guide/assets.html#the-public-directory),
[cPanel Pull or Deploy](https://docs.cpanel.net/cpanel/files/git-version-control/).
