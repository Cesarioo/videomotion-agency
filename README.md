<div align="center">

# VideoMotion Agency

### Personalized video prospecting at scale, powered by Remotion.

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)](#)
[![Fastify](https://img.shields.io/badge/Fastify-000?logo=fastify&logoColor=white)](#)
[![Remotion](https://img.shields.io/badge/Remotion-0B84F3?logo=react&logoColor=white)](#)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](#)
[![Redis](https://img.shields.io/badge/BullMQ-DC382D?logo=redis&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](#)

---

</div>

## The problem

Cold outreach is broken. Every sales team sends the same templated emails, the same LinkedIn messages, the same pitch decks. Prospects ignore them because they look like what they are — mass-produced noise.

Video outreach changes that. A personalized video where you mention the prospect's company by name, reference their product, show their own website on screen — that gets opened. That gets replied to. But recording a custom video for every single prospect? That doesn't scale. One video takes 10 minutes. A hundred takes a full work week. A thousand is simply not happening.

That's why we built VideoMotion.

## What VideoMotion does

VideoMotion takes a prospect's website URL and turns it into a fully personalized, branded video — automatically. No recording. No editing. No manual work.

Here's what happens when you drop in a URL:

1. **We crawl their website.** Puppeteer visits the site through a proxy, extracts the company name, what they do, key messaging, visual identity — everything we need to understand the business in 30 seconds.

2. **We enrich the data.** The system pulls employee information, verifies email addresses through DNS and SMTP checks, and builds a complete profile of who we're reaching out to. This isn't just scraping — it's assembling context.

3. **An LLM writes the script.** Based on everything we've gathered, OpenAI generates a video script that speaks directly to this specific company. Not a template with `{company_name}` swapped in — an actual narrative that references their product, their market, their pain points.

4. **Remotion renders the video.** The script feeds into our Remotion pipeline, which composites animated scenes from a library of templates — Google search animations, feature breakdowns, store fronts, data visualizations, outros. Each scene is parameterized. Each video is unique. The output is a polished MP4 with music, branding, and motion graphics.

5. **The video lands in R2, ready to send.** Uploaded to Cloudflare R2, accessible via a unique URL. Drop it in an email, a LinkedIn message, a landing page — wherever the prospect will see it.

The whole process runs asynchronously through a BullMQ job queue backed by Redis. You can queue up hundreds of videos and walk away. The workers handle scraping, enrichment, and rendering in parallel.

## Why we built it this way

We needed something that could handle real volume without babysitting. That meant:

- **Job queues, not request-response.** Video rendering takes time. You can't hold an HTTP connection open for 2 minutes waiting for Remotion to finish. BullMQ lets us fire-and-forget from the API, retry on failure, and process jobs concurrently across workers.

- **Remotion for video.** We considered FFmpeg pipelines, but Remotion lets us build video scenes in React. That means designers and developers work in the same language. Templates are components. Data flows in as props. It's wildly productive once you get the hang of it.

- **Puppeteer with proxy support.** Some sites block scrapers. Some need JavaScript to render. Puppeteer through a SOCKS5 proxy handles both. We get the real, rendered page — not a stripped-down HTML skeleton.

- **Prisma + Postgres for the CRM layer.** Every company, every employee, every video status, every enrichment result is tracked in the database. The admin dashboard gives full visibility into the pipeline.

- **Monorepo because it's one product.** The frontend and backend were separate repos for a while. That made deployments annoying and PRs harder to review. Now it's one repo, one `docker compose up`, and path-scoped CI that only deploys what changed.

## The pipeline, visually

```
  Website URL
      |
      v
 +-----------+      +------------+      +-----------+
 |  Scraper   | ---> |  LLM       | ---> |  Remotion  |
 |  Enricher  |      |  Script    |      |  Renderer  |
 +-----------+      +------------+      +-----------+
                                              |
                                              v
                                     Personalized MP4
                                     uploaded to R2
```

## What's inside

### CRM & Dashboard (`apps/web`)

The frontend is a Next.js app that serves as both the admin interface and the prospect-facing landing page.

From the dashboard, you can:
- Add companies manually or bulk import from CSV / LinkedIn Sales Navigator
- View and manage employees per company
- Track video generation status (queued, rendering, done, failed)
- Retry failed jobs
- Preview generated videos
- Send prospects to personalized landing pages with their video embedded

Built with React 19, shadcn/ui, and Tailwind. Clean, fast, no bloat.

### Rendering Engine & API (`apps/api`)

The backend is where the heavy lifting happens. A Fastify server exposes RESTful endpoints for the frontend and orchestrates the entire pipeline behind the scenes.

**Core services:**
- `parser.ts` — Puppeteer-based website scraper with proxy rotation
- `enrich.ts` — Company and employee data enrichment, email verification via DNS/SMTP
- `llm.ts` — OpenAI integration for video script generation
- `video.ts` — Remotion bundling, rendering, and S3 upload
- `s3.ts` — Cloudflare R2 storage client
- `redis.ts` — Redis connection for BullMQ

**Queue workers:**
- `enrichWorker.ts` — Processes company enrichment jobs
- `emailEnrichWorker.ts` — Handles email discovery and verification
- `videoWorker.ts` — Renders videos via Remotion and uploads to R2

**Video templates** live in `core/remotion/templates/` — each one is a React component that Remotion composes into a scene. We have templates for Google search animations, feature showcases, circle diagrams, delivery sequences, store fronts, SEO visualizations, and more. Adding a new template is just writing a new component.

## Architecture

```
videomotion-agency/
├── apps/
│   ├── web/                  # Next.js 16 — dashboard & landing pages
│   │   ├── app/              # Routes (admin, prospect pages, legal)
│   │   ├── components/       # UI layer (shadcn/ui + custom)
│   │   └── lib/              # API client, types, utilities
│   │
│   └── api/                  # Fastify — API, workers, rendering
│       ├── api/
│       │   ├── routes/       # REST endpoints (companies, employees, video)
│       │   ├── schemas/      # Zod request/response schemas
│       │   └── hooks/        # Auth middleware
│       ├── core/
│       │   ├── database/     # Prisma schema & client (Postgres)
│       │   ├── queues/       # BullMQ job definitions
│       │   ├── remotion/     # Video compositions & templates
│       │   ├── services/     # Business logic layer
│       │   └── workers/      # Async job processors
│       └── Dockerfile
│
├── .github/workflows/        # CI/CD — path-scoped, deploys independently
├── docker-compose.yml        # Full stack in one command
└── README.md
```

## Tech stack

| Layer | What we use | Why |
|-------|-------------|-----|
| **Frontend** | Next.js 16, React 19, shadcn/ui, Tailwind | Fast to build, great DX, looks professional out of the box |
| **Backend** | Fastify, TypeScript, Prisma, BullMQ | Fastify is fast and schema-first. BullMQ handles async work reliably |
| **Video** | Remotion 4, custom React templates | Build video scenes like React components. Incredibly productive |
| **AI** | OpenAI | Script generation that actually sounds human |
| **Scraping** | Puppeteer, SOCKS5 proxy | Full browser rendering, bypasses JS-only sites |
| **Storage** | Cloudflare R2 | S3-compatible, no egress fees |
| **Database** | PostgreSQL + Prisma | Relational data with great TypeScript integration |
| **Queue** | Redis + BullMQ | Battle-tested job processing with retry, concurrency, priority |
| **Infra** | Docker, GitHub Actions | Containerized deploys, path-scoped CI |

## Getting started

```bash
# Clone the repo
git clone git@github.com:Cesarioo/videomotion-agency.git
cd videomotion-agency

# Set up your environment
cp apps/api/example.env apps/api/.env
# Fill in your API keys, database credentials, R2 config, etc.

# Spin everything up
docker compose up -d --build
```

| Service | URL |
|---------|-----|
| Dashboard | `http://localhost:5000` |
| API | `http://localhost:3000` |
| Swagger docs | `http://localhost:3000/docs` |

### Local development

```bash
# Frontend (hot reload)
cd apps/web && pnpm install && pnpm dev

# Backend (hot reload)
cd apps/api && npm install && npm run dev

# Preview video templates in Remotion Studio
cd apps/api && npm run studio
```

### Database

```bash
cd apps/api

# Push schema to database
npm run db:push

# Run migrations
npm run db:migrate

# Open Prisma Studio (visual DB explorer)
npm run db:studio
```

## Deployment

Both apps deploy independently through GitHub Actions. Each workflow is scoped to its own directory — pushing changes to `apps/web/` only redeploys the frontend, and vice versa.

Both workflows:
1. SCP the relevant directory to the production server
2. Build a Docker image
3. Stop the old container and start the new one
4. Support manual trigger via `workflow_dispatch` for on-demand deploys

No downtime deployment, no orchestrator needed. Simple and reliable.

## What's next

This is an active project. Things we're working on:
- More video templates and scene types
- Multi-language support for scripts and voiceover
- Analytics on video views and engagement
- Direct email sending integration
- A/B testing different video styles per prospect

---

<div align="center">

Built by [Oscar Mairey](https://oscarmairey.com)

</div>
