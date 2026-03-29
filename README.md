<div align="center">

# VideoMotion Agency

### Personalized video prospecting at scale, powered by Remotion.

**Browse any client's website. Generate a cinematic, branded video. Deliver it automatically.**

[![TypeScript](https://img.shields.io/badge/TypeScript-3178C6?logo=typescript&logoColor=white)](#)
[![Next.js](https://img.shields.io/badge/Next.js-000?logo=nextdotjs&logoColor=white)](#)
[![Fastify](https://img.shields.io/badge/Fastify-000?logo=fastify&logoColor=white)](#)
[![Remotion](https://img.shields.io/badge/Remotion-0B84F3?logo=react&logoColor=white)](#)
[![Prisma](https://img.shields.io/badge/Prisma-2D3748?logo=prisma&logoColor=white)](#)
[![Redis](https://img.shields.io/badge/BullMQ-DC382D?logo=redis&logoColor=white)](#)
[![Docker](https://img.shields.io/badge/Docker-2496ED?logo=docker&logoColor=white)](#)

---

</div>

## What is this?

VideoMotion is a full-stack platform that **automatically generates personalized prospecting videos** for each client. It scrapes a prospect's website, enriches the data, and renders a custom Remotion video — all without manual intervention.

Built for outbound sales teams that want to stand out in every inbox.

## How it works

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
                                     ready to send
```

1. **Input** a prospect's website URL or import from CSV / Sales Navigator
2. **Scrape & enrich** — Puppeteer crawls the site, extracts brand colors, key messaging, employee data
3. **Generate** — LLM writes a personalized video script based on the prospect's business
4. **Render** — Remotion compiles a branded, animated video with custom templates
5. **Deliver** — Video is uploaded to R2 and ready for outreach

## Features

| Feature | Description |
|---------|-------------|
| **Website scraping** | Automated crawling with Puppeteer + proxy support |
| **Data enrichment** | Email discovery, company profiling, employee lookup |
| **AI scriptwriting** | LLM-generated video scripts tailored to each prospect |
| **Remotion rendering** | Programmatic video generation with custom templates |
| **Job queue** | BullMQ + Redis for reliable async video processing |
| **CRM dashboard** | Manage companies, employees, and video status |
| **CSV / Sales Nav import** | Bulk import prospects from external sources |
| **S3 storage** | Cloudflare R2 for video hosting and delivery |

## Architecture

```
videomotion-agency/
├── apps/
│   ├── web/              # Next.js frontend — CRM dashboard & admin
│   │   ├── app/          # Pages (admin, prospect landing, privacy)
│   │   ├── components/   # UI components (shadcn/ui)
│   │   └── lib/          # API client & utilities
│   │
│   └── api/              # Fastify backend — scraping, rendering, queues
│       ├── api/           # Routes & schemas (companies, employees, video)
│       ├── core/
│       │   ├── database/  # Prisma schema & client
│       ��   ├── queues/    # BullMQ job definitions
│       │   ├── remotion/  # Video templates & composition
│       │   ├── services/  # Business logic (LLM, S3, enrichment, video)
│       │   └── workers/   # Queue workers (enrich, email, video render)
│       └── Dockerfile
│
├── .github/workflows/     # Path-scoped CI/CD (web + api deploy independently)
├── docker-compose.yml     # Run the full stack locally
└── README.md
```

## Quick start

```bash
# Clone
git clone git@github.com:Cesarioo/videomotion-agency.git
cd videomotion-agency

# Set up environment
cp apps/api/example.env apps/api/.env
# Edit apps/api/.env and apps/web/.env with your values

# Run everything
docker compose up -d --build
```

| Service | URL |
|---------|-----|
| Web dashboard | `http://localhost:5000` |
| API server | `http://localhost:3000` |
| API docs (Swagger) | `http://localhost:3000/docs` |

## Development

```bash
# Frontend
cd apps/web && pnpm install && pnpm dev

# Backend
cd apps/api && npm install && npm run dev

# Remotion Studio (preview video templates)
cd apps/api && npm run studio
```

## Tech stack

| Layer | Tech |
|-------|------|
| **Frontend** | Next.js 16, React 19, shadcn/ui, Tailwind CSS |
| **Backend** | Fastify, TypeScript, Prisma, BullMQ |
| **Video** | Remotion 4, custom scene templates |
| **AI** | OpenAI (script generation) |
| **Infra** | Docker, GitHub Actions, Cloudflare R2 |

## Deployment

Each app deploys independently via GitHub Actions with path-scoped triggers:

- Push to `apps/web/**` deploys the frontend
- Push to `apps/api/**` deploys the backend
- Both support manual dispatch via `workflow_dispatch`

---

<div align="center">

Built by [Oscar Mairey](https://oscarmairey.com)

</div>
