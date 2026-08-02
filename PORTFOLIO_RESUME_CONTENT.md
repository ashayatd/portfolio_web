# Portfolio Content — Resume Reference

> Extracted from `src/app/page.tsx` and all section components it references.  
> Source of truth: codebase only. No added claims.

---

## Page Structure (`page.tsx`)

Single-page portfolio with these sections (in order):

| Nav Label | Section ID | Component |
|-----------|------------|-----------|
| Home | `home` | Hero |
| Projects | `projects` | SceneWithGlassFrame → Projects |
| Skills | `skills` | SceneWithGlassFrame → EngineeringCapabilities |
| Experience | `experience` | HorizontalTimeline (Experience.tsx) |
| Tools | `tech` | SceneWithGlassFrame → TechStackGrid |
| About | `about` | SceneWithGlassFrame → About |

**Commented out (not active on page):** Building, StarrySkyLayout, Scalablility, StatsSection

---

## Personal Information (across sections)

| Field | Value | Source |
|-------|-------|--------|
| Full Name | Ashay Tamrakar | Hero, About, CenterFountain |
| Role / Title | Full Stack Engineer, Full Stack Developer | Hero, About |
| Location | Indore, India | About, Experience |
| Join Date (CIS) | 5 October 2023 | `src/lib/profile.ts` |
| Production Projects | 7+ | `PROJECT_COUNT` in `profile.ts` |
| Technologies Used | 15+ | About.tsx (hardcoded stat) |
| Commitment | 100% To Quality | Hero |
| Learning | Always Learning / Always Building | Hero |
| Commitment To Learning | 100% | About |

### Contact

| Channel | Value | URL |
|---------|-------|-----|
| GitHub | github.com/ashayatd | https://github.com/ashayatd |
| LinkedIn | linkedin.com/in/ashay-tamrakar | https://www.linkedin.com/in/ashay-tamrakar-b7a993167 |
| Email | ashaytamrakar@gmail.com | mailto:ashay.tamrakar@gmail.com |

### 3D Monument Text (CenterFountain)

- Monogram: **AT**
- Name: **ASHAY TAMRAKAR**
- Title: **FULL STACK DEVELOPER**
- Banner eyebrow: **PORTFOLIO**

---

# 1. HOME — Hero Section

**File:** `src/components/sections/Hero/MainHeroPage.tsx`  
**Section ID:** `#home`

## Headline & Copy

| Element | Text |
|---------|------|
| Badge | Full Stack Engineer |
| H1 | Ashay Tamrakar |
| Gradient span | Full Stack Developer |
| Subtitle | I build end-to-end products with clean code, modern technologies and scalable architecture. From intuitive interfaces to robust backend systems. |
| CTA 1 | View My Projects |
| CTA 2 | Download Resume |
| Scroll indicator | Scroll to Explore |

## Stats (visible)

| Value | Label | Sub-label |
|-------|-------|-----------|
| 7+ | Production Projects | Built & Deployed |
| 100% | Commitment | To Quality |
| Always | Learning | Always Building |

## Stats (commented out in code)

| Value | Label | Sub-label |
|-------|-------|-----------|
| Dynamic (from `getExperience()`) | Experience | Since Oct 2023 |

## 3D Interactive City (Hero right panel)

Interactive 3D campus built with React Three Fiber. Clicking building billboards scrolls to matching sections.

### Building → Section Map

| Building | Billboard Title | Tags | Links To |
|----------|-----------------|------|----------|
| Building A (top) | Experience | 2+ Years, MERN Stack, Backend, REST APIs | `#experience` |
| Building B (top-right) | Technology | Frontend, Backend, DevOps | `#tech` |
| Building C (left) | Projects | 7+ Shipped, Production, Full-Stack, Web Apps | `#projects` |
| Building D (right) | Skills | React, Node.js, MongoDB, Express, Next.js, Docker | `#skills` |
| Center Fountain | — | — | `#about` |

### Explore Mode (implemented, trigger button commented out)

- Controls: **WASD** — Move, **Shift** — Run, **Mouse** — Look
- Character model: Soldier GLB at `/assets/CharcterAssets/Soldier.glb`
- Building collision detection enabled

## Skills listed in Hero constants (legacy, `constants.ts`)

React, Next.js, TypeScript, Node.js, MongoDB, MY-SQL, Docker, AWS

---

# 2. PROJECTS Section

**File:** `src/components/sections/Projects/Projects.tsx`  
**Section ID:** `#projects`

## Section Header

| Field | Content |
|-------|---------|
| Eyebrow | Selected work |
| Title | Projects |
| Note | Production systems across real-time billing, social feeds at the data layer, microservices and live video. |

---

## Featured Project: Squach

| Field | Content |
|-------|---------|
| Badge | Full-Stack · Core Modules |
| Pills | Primary Project, Microservices |
| Title | Squach |
| Description | Super app for accommodation, bus ticketing, mart and dine in/out. I owned the accommodation, ticketing and delivery-partner stack. |

### Key Achievements

1. Cut the hotel search and filter API from **~90s to ~300ms** by replacing a 10+ table query with field projection and pagination.
2. Prevented double bookings with a Redis distributed lock and a **20 minute TTL reservation**, so inventory releases automatically on an abandoned checkout.
3. Re-architected a monolith into **6 microservices** behind an API gateway. A refresh-ahead Redis cache on currency rates cut third-party calls by **~95%**.

### Tech Stack

Node.js, MySQL, Redis, BullMQ, Microservices, API Gateway

### Admin Dashboard Features

User analytics, Graphs & charts, Business metrics, Calculated statistics, Notification campaigns, User management, Content moderation

### Additional Details

**Booking workflow:** Seven cross-service steps run a booking: search, hold inventory, payment, confirm, notify over email and SMS, then update the vendor dashboard. A TTL index releases inventory automatically if payment fails.

**Notification campaigns:** A BullMQ and Redis queue targets vendors and customers by category across Email, SMS and In-App, with per-recipient success and failure logs surfaced in a dense admin view.

---

## Project: Billiards Studio ERP (Hotpocket)

| Field | Content |
|-------|---------|
| Badge | Frontend Owner |
| Pills | Live, Real Users, Real-time |
| Title | Billiards Studio ERP (Hotpocket) |
| Description | Operations and billing ERP that fully automated a billiards gaming studio, covering games, canteen inventory and player billing in one system. |

### Key Achievements

1. Built the complete React frontend and UI/UX: a real-time, animated interface for live table management across **12 tables in 2 branches**.
2. Implemented the billing engine on the frontend: live table billing, canteen billing and player-level billing, including splitting one game across **2 to 4 players** with dynamic payment distribution.
3. Modelled credit management with live credit reflection while assigning players, across complex operational workflows spanning **25+ production business features**.

### Tech Stack

React, WebSockets, Firebase, Real-time UI, State Management

### Links

| Label | URL |
|-------|-----|
| Live | https://hot-pocket-47985.web.app/authentication/sign-in |
| GitHub | https://github.com/ashayatd/hotPocketFE |

### Additional Details

**My contribution:** I built the entire frontend: the React UI and UX, the real-time frontend architecture, the billing engine, business logic and state management.

**Backend:** The backend was built by another developer using Python and Firestore. I integrated the frontend against it.

**Frontend scope:** Real-time table management, canteen and table billing, individual and split player billing for 2 to 4 players, credit management with live reflection on player assignment, and dynamic payment distribution, all in a richly interactive, animated UI.

---

## Project: Tambez

| Field | Content |
|-------|---------|
| Badge | Backend + Admin Lead |
| Pills | Play Store · 100+ installs |
| Title | Tambez |
| Description | Instagram-style social platform for students with posts, reels, reactions, reposts and a social graph. |

### Key Achievements

1. Replaced about **150 N+1 feed queries** with a single **8-stage MongoDB aggregation pipeline** (match, lookups, unwind, project, sort, limit).
2. Fixed infinite-scroll duplicates by tracking seen-post IDs and excluding them server-side with `$nin`, so the feed stays stable as new posts arrive mid-scroll.
3. **23 collections** with Redis-cached feeds for low scroll latency.

### Tech Stack

Node.js, MongoDB, Redis, React

### Admin Dashboard Features

User analytics, User demographics, Active users, Location insights, Individual profiles, Session duration, Most liked content, Most commented content, Category analytics, Student uploads, Issue ticket management, Ban / unban users, Ban / unban posts, Comment moderation, Achievement approvals, Badge management (Blue Tick)

### Additional Details

**Why aggregation:** Pushing joins, filtering and sorting into MongoDB's engine keeps feed latency stable as following-lists grow, instead of looping queries in Node.

**Schema:** A document model was chosen for a fast-changing feature set the client kept reshaping.

---

## Project: Eyeshare

| Field | Content |
|-------|---------|
| Badge | Backend + Admin Owner |
| Pills | Real-time Video |
| Title | Eyeshare |
| Description | Connects job seekers with providers, plus on-demand expert video calls for how-to help and consultations. |

### Key Achievements

1. Socket-coordinated Agora calls: on peer-left, the stream auto-pauses and the call ends after **60s** of no reconnect to stop paid-minute burn.
2. Cut socket payloads **60 to 80%** with delta signaling (only changed fields), which directly lowered Agora billing.
3. Added a DB heartbeat to survive ECONNRESET drops from low-bandwidth users.

### Tech Stack

Node.js, MongoDB, Agora, WebSockets, React

### Admin Dashboard Features

User analytics, Active users, Call session logs, Revenue tracking, Job posting analytics, Expert management, User management, Session monitoring

### Additional Details

**Reconnect:** The server broadcasts peer-left, clients show a waiting-for-peer state, and the call closes at 60s to cap billing.

**Scope:** I took over an existing deployed system, extended it, and re-deployed it with automated builds.

---

## Also Built (Smaller Projects)

| Name | Description |
|------|-------------|
| **Messice** | Fantasy football betting app. Built backend modules with third-party data and betting calculations, the admin analytics panel, and handled deployment. Real users. |
| **Barber Booking** | Slot booking with overlap prevention and ratings. Built the backend, a React admin with analytics, and handled deployment. |
| **Catch That Truck** | Ice-cream delivery locator. Built the React analytics admin panel and handled deployment. |
| **Ergzee** | IoT fitness-band companion app. Owned the frontend, backend device-data ingestion, admin analytics, and deployment. |

---

## Projects — Metrics Summary (for resume bullets)

| Metric | Project |
|--------|---------|
| ~90s → ~300ms API latency | Squach (hotel search) |
| ~95% reduction in third-party API calls | Squach (currency cache) |
| 6 microservices | Squach |
| 10+ table query replaced | Squach |
| 20 min TTL reservation | Squach |
| 12 tables in 2 branches | Hotpocket |
| 2–4 player split billing | Hotpocket |
| 25+ production business features | Hotpocket |
| ~150 N+1 → 1 aggregation pipeline | Tambez |
| 8-stage MongoDB aggregation | Tambez |
| 23 collections | Tambez |
| 100+ Play Store installs | Tambez |
| 60–80% socket payload reduction | Eyeshare |
| 60s reconnect timeout | Eyeshare |

---

# 3. SKILLS Section — Engineering Capabilities

**File:** `src/components/sections/Skills/EngineeringCapabilities.tsx`  
**Section ID:** `#skills`

## Section Header

| Field | Content |
|-------|---------|
| Eyebrow | Skills & Expertise |
| Title | Engineering Capabilities |
| Subtitle | Full-Stack Product Engineer — turning requirements into scalable, production-ready systems. |

## Product Engineering

**Description:** Not just features — I own products end to end: requirements, architecture, services, data, and deployment.

**Capability chips:** Requirements → Solution, Feature Planning, End-to-End Ownership

**Pipeline:** Idea → Architecture → Implementation → Deployment → Scaling

---

## Domain Capabilities

### Frontend Engineering

**Capabilities:** Component Architecture, State Management, Responsive UX, Performance

**Technologies:** React, Next.js, TypeScript, Tailwind

---

### Backend Engineering

**Capabilities:** REST APIs, Auth & RBAC, Business Logic, Integrations

**Technologies:** Node.js, Express

---

### Data & Persistence

**Capabilities:** Schema Design, Relationships, Query Optimization, Aggregations

**Technologies:** PostgreSQL, SQL Server, MongoDB, Firestore, Redis, BullMQ, Firebase Storage

---

### Realtime Systems

**Capabilities:** Sockets, Event-Driven, Live Updates, Multi-User Sync

**Technologies:** Socket.IO

---

### Cloud & Deployment

**Capabilities:** CI/CD, Env Management, Monitoring, Production Deploys

**Technologies:** Docker, Vercel, Netlify, DigitalOcean, Firebase, GCP

---

### System Design

**Capabilities:** Caching, Load Balancing, Partitioning, Replication, Rate Limiting, Queues

*(No specific tech icons listed)*

---

### Performance Engineering

**Capabilities:** API Optimization, Code Splitting, Lazy Loading, React Memoization, Virtualization, Bundle Optimization

*(No specific tech icons listed)*

---

### UI / UX Engineering

**Capabilities:** Workflow → Interface, Interactive Design, Motion, Micro-interactions, Responsive Design, Visual Storytelling

**Technologies:** Framer Motion, Chart.js, Lottie

---

### Developer Workflow

**Capabilities:** Version Control, Debugging, Env Config, Production Fixes

**Technologies:** Git, GitHub Actions

---

## What I Build

Full-Stack Apps, SaaS Products, Admin Dashboards, Realtime Systems, Business Platforms, Data-Driven Apps

---

# 4. EXPERIENCE Section

**File:** `src/components/sections/Hero/Experience/Experience.tsx`  
**Section ID:** `#experience`

## Section Header

| Field | Content |
|-------|---------|
| Eyebrow | Experience |

## Company

| Field | Content |
|-------|---------|
| Company | Cyber Infrastructure (CIS) |
| Role | Full-Stack Developer |
| Dates | Oct 2023 to Present |
| Location | Indore, India |
| Employment Type | Full-time · On-site |
| Logo | https://www.cisin.com/images/logo_black.png |

---

## Career Milestones (8 Stages)

### Stage 01 — Frontend Development

**Description:** Started by shipping responsive, production UIs for client products with React and Next.js.

**Technologies:** React, Next.js, TypeScript, Tailwind

---

### Stage 02 — Building Complete Features

**Description:** Owned features from UI to data, delivering complete flows instead of isolated screens.

**Technologies:** React, Node.js, MongoDB

---

### Stage 03 — Backend Development

**Description:** Moved into backend work with REST APIs, auth and data models on Node.js, Express and MongoDB.

**Technologies:** Node.js, Express, MongoDB

---

### Stage 04 — System Design

**Description:** Designed for scale with caching, rate limiting, replication and partitioning across services.

**Technologies:** Redis, Distributed, Partitioning

---

### Stage 05 — Architecture Design

**Description:** Designed service architectures and data flows, mapping systems in draw.io before building them.

**Technologies:** draw.io, Architecture, Data Flow

---

### Stage 06 — Scalable Systems

**Description:** Built real-time, high-throughput systems with Redis, BullMQ, Socket.IO, caching and queues.

**Technologies:** Redis, BullMQ, Socket.IO

---

### Stage 07 — Production Deployments

**Description:** Set up deployments, CI/CD, Docker and monitoring for reliable production releases.

**Technologies:** Docker, CI/CD, Cloud

---

### Stage 08 — Engineering Ownership

**Description:** Now own products end to end: reliable, maintainable, business-driven software shipped in a fast-paced team.

**Technologies:** Reliability, Maintainable, Impact

---

# 5. TOOLS Section — Tech Stack Grid

**File:** `src/components/sections/Hero/TechnologyUsed/TechStackGrid.tsx`  
**Section ID:** `#tech`

## Section Header

| Field | Content |
|-------|---------|
| Eyebrow | Tech Stack |
| Title | Tools I build with |
| Subtitle | A Modern, Full-Stack Toolkit I Trust |

## Tech Stack (29 tools)

Next.js, React, TypeScript, Redux, Tailwind, Framer, Three.js, Node.js, Express, MongoDB, Redis, Socket.IO, Agora, BullMQ, Chart.js, Lottie, Vercel, Netlify, DigitalOcean, Git, GitHub Actions, MySQL, Postgres, GCP, Firebase, Stripe, Docker, draw.io, JWT

---

## AI Tools Section

| Field | Content |
|-------|---------|
| Eyebrow | AI Tools |
| Title | AI I work with daily |

| Tool | Role |
|------|------|
| Claude Code | Engineering assistant |
| ChatGPT | Conversation & analysis |
| ChatGPT Codex | Code generation |
| Gemini | Multimodal research |
| GitHub Copilot | In-editor completion |
| Cursor | AI-powered editor |
| KIMI | Long-context reading |
| QWEN | Model comparison |

---

# 6. ABOUT Section

**File:** `src/components/sections/About/About.tsx`  
**Section ID:** `#about`

## Section Header

| Field | Content |
|-------|---------|
| Eyebrow | About |
| Headline | Building Software Beyond The Interface. |

## Body Copy

**Paragraph 1:** Full-stack developer building modern web applications using React, Node.js, and scalable backend architectures.

**Paragraph 2:** My focus is not just writing code. I enjoy solving business problems through clean architecture, thoughtful user experiences, and scalable engineering practices.

## Philosophy

- I don't just build features.
- I build solutions people can rely on.

## Stats

| Value | Label |
|-------|-------|
| 7+ | Production Projects |
| 15+ | Technologies Used |
| 100% | Commitment To Learning |

---

# Complete Technology List (all sections combined)

## Frontend
React, Next.js, TypeScript, Tailwind, Redux, Framer Motion, Three.js, Chart.js, Lottie

## Backend
Node.js, Express, Python (Hotpocket backend — integrated, not built)

## Databases & Storage
MongoDB, MySQL, PostgreSQL, SQL Server, Firestore, Redis, Firebase Storage

## Realtime & Messaging
Socket.IO, WebSockets, BullMQ, Agora

## Cloud & DevOps
Docker, Vercel, Netlify, DigitalOcean, Firebase, GCP, GitHub Actions, CI/CD

## Other
Git, Stripe, JWT, draw.io, Email, SMS, In-App notifications, Microservices, API Gateway

## AI Tools
Claude Code, ChatGPT, ChatGPT Codex, Gemini, GitHub Copilot, Cursor, KIMI, QWEN

---

# Role Ownership Summary (from Projects)

| Project | Your Role |
|---------|-----------|
| Squach | Full-Stack · Core Modules (accommodation, ticketing, delivery-partner stack) |
| Hotpocket | Frontend Owner (entire React UI/UX, billing engine, state management) |
| Tambez | Backend + Admin Lead |
| Eyeshare | Backend + Admin Owner |
| Messice | Backend modules, admin analytics, deployment |
| Barber Booking | Backend, React admin, deployment |
| Catch That Truck | React analytics admin, deployment |
| Ergzee | Frontend, backend device-data ingestion, admin analytics, deployment |

---

*Generated from portfolio source code. Update this file when section content changes.*
