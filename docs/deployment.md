## Deployment guide (no mixed-content issues)

This repo has two workspace packages:

- **Library**: `packages/swipe-menu` → `@bdx/swipe-menu`
- **Website**: `apps/website` → docs + demos (static export)

### Key rule: `NEXT_PUBLIC_BASE_PATH` must be path-only

The website supports being hosted under a sub-path (GitHub Pages, nginx subfolder, etc).

- ✅ Good: `NEXT_PUBLIC_BASE_PATH=/static/swipemenu`
- ❌ Bad: `NEXT_PUBLIC_BASE_PATH=http://bdx.gatocube.com:8090/static/swipemenu`

If you pass a full URL, browsers can end up trying to fetch `http://...:8090/...` from an HTTPS page which triggers a **Mixed Content** console error.

The website has a build-time guard that fails fast if `NEXT_PUBLIC_BASE_PATH` contains a scheme or a port.

### Note: Next.js prefetch is disabled

This website disables `next/link` prefetch to avoid unexpected background `HEAD` requests (which can surface as mixed-content warnings if a misconfigured origin/port ever leaks into routing).

### Local static deploy with nginx (recommended)

1) Build the website export into `apps/website/out`:

```bash
NEXT_PUBLIC_BASE_PATH=/static/swipemenu pnpm build
```

2) Copy exported files into your nginx directory (example path from `.env.example`):

```bash
rsync -a --delete "apps/website/out/" "$HOME/www/bdx/static/swipemenu/"
```

3) nginx config example (HTTP-only local):

```nginx
server {
    listen 8090;
    server_name localhost;

    location /static/ {
        alias /Users/<you>/www/bdx/static/;
        try_files $uri $uri.html $uri/ =404;
    }
}
```

Then open `http://localhost:8090/static/swipemenu/demo`.

### GitHub Pages

GitHub Pages is deployed under `/BdxSwipeMenu`, so CI builds with:

- `NEXT_PUBLIC_BASE_PATH=/BdxSwipeMenu`

See `.github/workflows/ci.yml`.

