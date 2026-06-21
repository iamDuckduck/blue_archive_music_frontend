# Blue Archive Music Client

## Environment Config

Vite exposes only variables prefixed with `VITE_` to browser code. Do not put secrets, passwords, private tokens, or access keys in frontend env files.

For local development, create `client/.env.local`:

```env
VITE_API_BASE_URL=http://localhost:8080
VITE_PUBLIC_MEDIA_BASE_URL=https://<public-r2-dev-url>/
```

For Cloudflare Pages production, set these environment variables in the Pages project settings:

```env
VITE_API_BASE_URL=https://<railway-backend-domain>
VITE_PUBLIC_MEDIA_BASE_URL=https://<r2-public-domain-or-r2-dev-url>/
```

`VITE_API_BASE_URL` should point to the Spring Boot backend.

`VITE_PUBLIC_MEDIA_BASE_URL` should point to the public media host used for song audio and images. It is safe for this value to be visible because the frontend needs it to load public assets.
