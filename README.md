# Blue Archive Music Frontend

React + Vite frontend for browsing Blue Archive music, albums, categories, and queue-based playback.

## Current Features

- Browse songs by category and album
- Play songs with queue controls
- Load public media assets from Cloudflare R2
- Connect to the Spring Boot backend through environment-based API config

## Local Development

```bash
cd client
npm install
npm run dev
```

See `client/README.md` for local and Cloudflare environment variables.

## Future Development

- Polish queue and player UI/UX
- Improve album ordering and browsing flows
- Add auth-related UI
- Support user-generated album and song uploads
- Improve production deployment and preview workflow
