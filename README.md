# Rob Walsh — Portfolio

Personal portfolio site built with Next.js (App Router), React, and the Vercel AI SDK. Features an AI-powered chat widget ("Ask Rob") backed by Claude via a server-side API route.

## Local development

```bash
# 1. Install dependencies
npm install

# 2. Set up environment variables
cp .env.local.example .env.local
# Open .env.local and paste your Anthropic API key

# 3. Run the dev server
npm run dev
```

Open [http://localhost:3000](http://localhost:3000).

## Environment variables

| Variable | Required | Description |
|---|---|---|
| `ANTHROPIC_API_KEY` | Yes | Anthropic API key — server-side only, never sent to the browser |

Get a key at [console.anthropic.com](https://console.anthropic.com/).

## Deploying to Vercel

1. **Push to GitHub** — make sure the repo is on GitHub (or GitLab/Bitbucket).

2. **Import the project** — go to [vercel.com/new](https://vercel.com/new), click "Import Git Repository", and select this repo. Vercel auto-detects Next.js; no framework config needed.

3. **Add the environment variable** — before deploying, open "Environment Variables" in the project settings and add:
   - Name: `ANTHROPIC_API_KEY`
   - Value: your key from console.anthropic.com
   - Environment: Production (and Preview if you want the chat to work on preview deployments)

4. **Deploy** — click Deploy. Vercel builds and publishes the site. Subsequent pushes to `main` redeploy automatically.

> The API key is only ever read inside `app/api/chat/route.ts` on the server. It is never included in the client bundle.
