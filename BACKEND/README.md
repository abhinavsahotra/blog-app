```txt
npm install
npm run dev
```

```txt
npm run deploy
```

[For generating/synchronizing types based on your Worker configuration run](https://developers.cloudflare.com/workers/wrangler/commands/#types):

```txt
npm run cf-typegen
```

Pass the `CloudflareBindings` as generics when instantiation `Hono`:

```ts
// src/index.ts
const app = new Hono<{ Bindings: CloudflareBindings }>()
```



# medium-clone

- Install hono
- Initialise handlers
- POST /api/v1/signup
- POST /api/v1/signin
- POST /api/v1/blog
- PUT /api/v1/blog
- DELETE /api/v1/blog
- GET /api/v1/blog/bulk
- GET /api/v1/blog/:id
- Get the connection url's and put in wrangler.jsonc and .env files
- Initialise Schema, migrate schema, generate prisma client, Add accelerate extension
- Create routes
- Add Zod Validation
- Deploy app on Cloudfare