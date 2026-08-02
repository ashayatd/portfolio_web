# Resume — Projects Section (Deep Extract)

> **Source:** `src/components/sections/Projects/Projects.tsx` only.  
> Everything below is derived from portfolio copy. Metrics and claims are quoted as written.  
> **Employer context:** Cyber Infrastructure (CIS) · Full-Stack Developer · Oct 2023 – Present · Indore, India

---

## Portfolio Projects Summary Line

> Production systems across real-time billing, social feeds at the data layer, microservices and live video.

**Total production projects claimed:** 7+ (from `profile.ts`)

---

# PROJECT 1 — Squach (Featured / Primary)

## Resume Header Block

| Field | Value |
|-------|-------|
| **Project** | Squach |
| **Type** | Super app |
| **Your role** | Full-Stack · Core Modules |
| **Modules owned** | Accommodation, bus ticketing, delivery-partner stack |
| **Tags** | Primary Project, Microservices |
| **Status** | Production (implied by portfolio framing) |

## One-Line Summary (for resume)

Super app for accommodation, bus ticketing, mart and dine in/out — owned accommodation, ticketing and delivery-partner stack end to end.

## Product / Domain Details (from description)

- **Product category:** Super app (multi-vertical platform)
- **Verticals in product:** Accommodation, bus ticketing, mart, dine in/out
- **Your scope:** Accommodation module, ticketing module, delivery-partner stack
- **Architecture label:** Microservices (re-architected from monolith)

## Technical Stack

Node.js · MySQL · Redis · BullMQ · Microservices · API Gateway

**Implied from copy (not separate chips):** Email notifications, SMS notifications, In-App notifications, TTL indexes, distributed locks, refresh-ahead caching, field projection, pagination, API gateway routing

## Achievement Bullets — Raw (portfolio)

1. Cut the hotel search and filter API from **~90s to ~300ms** by replacing a **10+ table query** with field projection and pagination.
2. Prevented double bookings with a **Redis distributed lock** and a **20 minute TTL reservation**, so inventory releases automatically on an abandoned checkout.
3. Re-architected a monolith into **6 microservices** behind an API gateway. A refresh-ahead Redis cache on currency rates cut third-party calls by **~95%**.

## Achievement Bullets — Resume Format (same facts, action-led)

- Reduced hotel search/filter API latency from **~90s to ~300ms** by replacing a 10+ table SQL query with field projection and pagination (Node.js, MySQL).
- Prevented double bookings using **Redis distributed locks** and **20-minute TTL reservations** — inventory auto-releases on abandoned checkout.
- Re-architected monolith into **6 microservices** behind an **API gateway**; refresh-ahead **Redis cache** on currency rates reduced third-party API calls by **~95%**.
- Designed **7-step cross-service booking workflow**: search → hold inventory → payment → confirm → email/SMS notify → vendor dashboard update; TTL index releases inventory on payment failure.
- Built **notification campaign system** via **BullMQ + Redis** queues — category-targeted Email, SMS, and In-App delivery with per-recipient success/failure logs in admin.

## Systems & Patterns (extracted from details)

| System / Pattern | Description |
|------------------|-------------|
| Hotel search optimization | 10+ table query → field projection + pagination |
| Inventory locking | Redis distributed lock |
| Reservation TTL | 20 min; auto-release on abandoned checkout |
| Monolith → microservices | 6 services + API gateway |
| Currency rate caching | Refresh-ahead Redis cache |
| Booking orchestration | 7 cross-service steps |
| Payment failure handling | TTL index releases held inventory |
| Notification pipeline | BullMQ + Redis; Email, SMS, In-App |
| Admin observability | Per-recipient delivery success/failure logs |

## Admin Dashboard — Responsibilities / Features Built

- User analytics
- Graphs & charts
- Business metrics
- Calculated statistics
- Notification campaigns (queue-driven, multi-channel)
- User management
- Content moderation

## Metrics for Resume (Squach)

| Metric | Detail |
|--------|--------|
| API latency | ~90s → ~300ms (hotel search/filter) |
| Query complexity | 10+ table query eliminated |
| Microservices | 6 services |
| Third-party API reduction | ~95% (currency rates cache) |
| Reservation TTL | 20 minutes |
| Booking steps | 7 cross-service steps |
| Notification channels | Email, SMS, In-App |

## Keywords (ATS)

Node.js, MySQL, Redis, BullMQ, Microservices, API Gateway, distributed lock, TTL, field projection, pagination, refresh-ahead cache, booking workflow, inventory management, notification campaigns, admin dashboard, content moderation

---

# PROJECT 2 — Billiards Studio ERP (Hotpocket)

## Resume Header Block

| Field | Value |
|-------|-------|
| **Project** | Billiards Studio ERP (Hotpocket) |
| **Type** | Operations & billing ERP |
| **Your role** | Frontend Owner |
| **Tags** | Live, Real Users, Real-time |
| **Live URL** | https://hot-pocket-47985.web.app/authentication/sign-in |
| **GitHub** | https://github.com/ashayatd/hotPocketFE |

## One-Line Summary (for resume)

Operations and billing ERP that fully automated a billiards gaming studio — games, canteen inventory and player billing in one system.

## Product / Domain Details

- **Industry:** Billiards / gaming studio operations
- **Problem solved:** Full automation of studio operations
- **Modules covered:** Games, canteen inventory, player billing
- **Scale:** 12 tables across 2 branches
- **Users:** Real users (live production)

## Technical Stack

React · WebSockets · Firebase · Real-time UI · State Management

**Backend (not built by you):** Python, Firestore — you integrated frontend against it

## Achievement Bullets — Raw (portfolio)

1. Built the complete React frontend and UI/UX: a real-time, animated interface for live table management across **12 tables in 2 branches**.
2. Implemented the billing engine on the frontend: live table billing, canteen billing and player-level billing, including splitting one game across **2 to 4 players** with dynamic payment distribution.
3. Modelled credit management with live credit reflection while assigning players, across complex operational workflows spanning **25+ production business features**.

## Achievement Bullets — Resume Format

- Built **entire React frontend and UI/UX** — real-time, animated live table management for **12 tables across 2 branches** (WebSockets, Firebase).
- Implemented **frontend billing engine**: live table billing, canteen billing, player-level billing; split billing for **2–4 players** with dynamic payment distribution.
- Modelled **credit management** with live credit reflection on player assignment across **25+ production business features**.
- Owned real-time frontend architecture, billing business logic, and state management; integrated against Python/Firestore backend built by another developer.

## Frontend Scope (full list from details)

- Real-time table management
- Canteen billing
- Table billing
- Individual player billing
- Split player billing (2 to 4 players)
- Credit management with live reflection on player assignment
- Dynamic payment distribution
- Richly interactive, animated UI

## Your Contribution vs Team

| Area | Owner |
|------|-------|
| React UI/UX | You |
| Real-time frontend architecture | You |
| Billing engine (frontend) | You |
| Business logic & state management | You |
| Backend (Python + Firestore) | Another developer — you integrated |

## Metrics for Resume (Hotpocket)

| Metric | Detail |
|--------|--------|
| Tables managed | 12 |
| Branches | 2 |
| Split billing | 2 to 4 players per game |
| Business features | 25+ production features |
| Status | Live, real users |

## Keywords (ATS)

React, WebSockets, Firebase, Firestore, real-time UI, state management, billing engine, ERP, table management, canteen inventory, credit management, payment distribution, Python integration

---

# PROJECT 3 — Tambez

## Resume Header Block

| Field | Value |
|-------|-------|
| **Project** | Tambez |
| **Type** | Instagram-style social platform for students |
| **Your role** | Backend + Admin Lead |
| **Tags** | Play Store · 100+ installs |
| **Distribution** | Android Play Store (100+ installs) |

## One-Line Summary (for resume)

Instagram-style social platform for students with posts, reels, reactions, reposts and a social graph.

## Product / Domain Details

- **Target users:** Students
- **Core features:** Posts, reels, reactions, reposts, social graph, infinite scroll feed
- **Data model:** Document model (MongoDB) — chosen for fast-changing feature set
- **Schema scale:** 23 collections
- **Feed architecture:** Redis-cached feeds

## Technical Stack

Node.js · MongoDB · Redis · React (admin)

## Achievement Bullets — Raw (portfolio)

1. Replaced about **150 N+1 feed queries** with a single **8-stage MongoDB aggregation pipeline** (match, lookups, unwind, project, sort, limit).
2. Fixed infinite-scroll duplicates by tracking seen-post IDs and excluding them server-side with **`$nin`**, so the feed stays stable as new posts arrive mid-scroll.
3. **23 collections** with Redis-cached feeds for low scroll latency.

## Achievement Bullets — Resume Format

- Replaced **~150 N+1 feed queries** with one **8-stage MongoDB aggregation pipeline** (match, lookups, unwind, project, sort, limit) — stable feed latency as following-lists grow.
- Fixed infinite-scroll duplicate posts by tracking seen-post IDs and server-side **`$nin` exclusion** — feed stays consistent when new posts arrive mid-scroll.
- Designed **23-collection** document schema and **Redis-cached feeds** for low scroll latency on student social graph.
- Led **admin dashboard**: analytics, moderation, user/post bans, achievement approvals, Blue Tick badge management.

## Aggregation Pipeline Stages (explicit in copy)

1. match  
2. lookups  
3. unwind  
4. project  
5. sort  
6. limit  
*(Listed as 8-stage in portfolio — stages 7–8 implied by "8-stage" count)*

## Admin Dashboard — Full Feature List (16 items)

| Category | Features |
|----------|----------|
| Analytics | User analytics, User demographics, Active users, Location insights, Individual profiles, Session duration, Most liked content, Most commented content, Category analytics, Student uploads |
| Moderation | Issue ticket management, Ban/unban users, Ban/unban posts, Comment moderation |
| Governance | Achievement approvals, Badge management (Blue Tick) |

## Technical Decisions (from details)

| Decision | Rationale (from copy) |
|----------|----------------------|
| MongoDB aggregation over Node loops | Keeps feed latency stable as following-lists grow |
| Document model (MongoDB) | Fast-changing feature set client kept reshaping |
| Redis feed cache | Low scroll latency |
| `$nin` + seen-post tracking | Prevent infinite-scroll duplicates |

## Metrics for Resume (Tambez)

| Metric | Detail |
|--------|--------|
| N+1 queries eliminated | ~150 → 1 pipeline |
| Aggregation stages | 8 |
| Collections | 23 |
| Play Store installs | 100+ |
| Pipeline ops named | match, lookups, unwind, project, sort, limit |

## Keywords (ATS)

Node.js, MongoDB, Redis, React, aggregation pipeline, N+1, infinite scroll, social graph, posts, reels, reactions, reposts, feed optimization, admin dashboard, moderation, Blue Tick, Play Store

---

# PROJECT 4 — Eyeshare

## Resume Header Block

| Field | Value |
|-------|-------|
| **Project** | Eyeshare |
| **Type** | Job marketplace + on-demand expert video calls |
| **Your role** | Backend + Admin Owner |
| **Tags** | Real-time Video |

## One-Line Summary (for resume)

Connects job seekers with providers, plus on-demand expert video calls for how-to help and consultations.

## Product / Domain Details

- **User types:** Job seekers, providers, experts
- **Core flows:** Job postings, expert consultations, live video calls
- **Video provider:** Agora
- **Billing concern:** Paid-minute Agora billing — optimized to reduce burn
- **Network conditions:** Low-bandwidth users, ECONNRESET drops

## Technical Stack

Node.js · MongoDB · Agora · WebSockets · React (admin)

## Achievement Bullets — Raw (portfolio)

1. Socket-coordinated Agora calls: on peer-left, the stream auto-pauses and the call ends after **60s** of no reconnect to **stop paid-minute burn**.
2. Cut socket payloads **60 to 80%** with delta signaling (only changed fields), which directly lowered Agora billing.
3. Added a DB heartbeat to survive **ECONNRESET** drops from low-bandwidth users.

## Achievement Bullets — Resume Format

- Built **socket-coordinated Agora video calls** — auto-pause on peer-left, **60s reconnect timeout** then call ends to stop paid-minute burn.
- Reduced socket payloads **60–80%** via **delta signaling** (changed fields only) — directly lowered Agora billing costs.
- Added **DB heartbeat** to survive **ECONNRESET** connection drops for low-bandwidth users.
- Took over existing deployed system, extended features, re-deployed with **automated builds**.

## Reconnect Flow (from details)

1. Server broadcasts peer-left  
2. Clients show waiting-for-peer state  
3. Call closes at 60s if no reconnect → caps billing  

## Admin Dashboard — Full Feature List (8 items)

- User analytics
- Active users
- Call session logs
- Revenue tracking
- Job posting analytics
- Expert management
- User management
- Session monitoring

## Scope of Work (from details)

- Inherited existing deployed system
- Extended functionality
- Re-deployed with automated builds (CI/CD implied)

## Metrics for Resume (Eyeshare)

| Metric | Detail |
|--------|--------|
| Socket payload reduction | 60–80% |
| Reconnect timeout | 60 seconds |
| Video SDK | Agora |
| Connection issue handled | ECONNRESET |

## Keywords (ATS)

Node.js, MongoDB, Agora, WebSockets, React, real-time video, delta signaling, socket optimization, peer-left handling, billing optimization, job marketplace, expert consultations, admin dashboard, automated deployment

---

# PROJECTS 5–8 — Also Built (Smaller / Supporting)

## Messice

| Field | Value |
|-------|-------|
| **Type** | Fantasy football betting app |
| **Your work** | Backend modules (third-party data + betting calculations), admin analytics panel, deployment |
| **Users** | Real users |

**Resume bullet:** Built backend modules integrating third-party data and betting calculations, admin analytics panel, and production deployment for fantasy football betting app with real users.

---

## Barber Booking

| Field | Value |
|-------|-------|
| **Type** | Appointment / slot booking |
| **Your work** | Backend, React admin with analytics, deployment |
| **Features mentioned** | Slot booking, overlap prevention, ratings |

**Resume bullet:** Built backend with slot overlap prevention and ratings, React admin dashboard with analytics, and handled deployment.

---

## Catch That Truck

| Field | Value |
|-------|-------|
| **Type** | Ice-cream delivery locator |
| **Your work** | React analytics admin panel, deployment |

**Resume bullet:** Built React analytics admin panel and handled deployment for ice-cream delivery locator app.

---

## Ergzee

| Field | Value |
|-------|-------|
| **Type** | IoT fitness-band companion app |
| **Your work** | Frontend, backend device-data ingestion, admin analytics, deployment |

**Resume bullet:** Owned frontend, backend device-data ingestion pipeline, admin analytics, and deployment for IoT fitness-band companion app.

---

# CROSS-PROJECT THEMES (for resume summary / skills section)

## Recurring Responsibilities

| Theme | Projects |
|-------|----------|
| End-to-end product ownership | Squach, Tambez, Eyeshare, Ergzee |
| Admin dashboards & analytics | All 8 projects |
| Production deployment | Messice, Barber Booking, Catch That Truck, Ergzee, Eyeshare |
| Real-time systems | Hotpocket, Tambez, Eyeshare |
| Performance / cost optimization | Squach, Tambez, Eyeshare |
| Microservices architecture | Squach |
| Database query optimization | Squach (SQL), Tambez (MongoDB aggregation) |
| Queue / async processing | Squach (BullMQ) |
| Multi-channel notifications | Squach (Email, SMS, In-App) |
| Moderation & user management | Squach, Tambez, Eyeshare |

## Admin Dashboard Experience (combined)

Across projects you built admin panels covering:

- User analytics, demographics, active users, session duration
- Business metrics, revenue tracking, calculated statistics
- Graphs, charts, location insights
- User management, expert management
- Content moderation, ban/unban users and posts, comment moderation
- Notification campaigns with delivery logs
- Call session logs, session monitoring
- Issue tickets, achievement approvals, badge management

---

# SUGGESTED RESUME LAYOUT — Projects Section

Copy-paste blocks below. Pick 3–4 for a one-page resume; use all 4 main + 1–2 smaller for a two-page resume.

---

### Squach — Full-Stack Developer (Core Modules) | CIS

Super app: accommodation, bus ticketing, mart, dine in/out.

- Reduced hotel search API **~90s → ~300ms** by replacing 10+ table query with field projection and pagination.
- Prevented double bookings with **Redis distributed locks** and **20-min TTL reservations**.
- Re-architected monolith into **6 microservices** + API gateway; **~95%** fewer third-party currency API calls via refresh-ahead Redis cache.
- Built 7-step cross-service booking flow and BullMQ notification campaigns (Email, SMS, In-App).
- **Stack:** Node.js, MySQL, Redis, BullMQ, Microservices, API Gateway

---

### Hotpocket — Frontend Owner | CIS

Billiards studio ERP: games, canteen, player billing. **Live** · Real users.

- Built entire **React** frontend: real-time table management for **12 tables / 2 branches** (WebSockets, Firebase).
- Implemented frontend **billing engine**: table, canteen, and split player billing (**2–4 players**), credit management across **25+ features**.
- **Stack:** React, WebSockets, Firebase · [Live](https://hot-pocket-47985.web.app/authentication/sign-in) · [GitHub](https://github.com/ashayatd/hotPocketFE)

---

### Tambez — Backend + Admin Lead | CIS

Student social platform: posts, reels, reactions, reposts. **100+ Play Store installs**.

- Replaced **~150 N+1 queries** with **8-stage MongoDB aggregation pipeline**; Redis-cached feeds across **23 collections**.
- Fixed infinite-scroll duplicates with seen-post tracking and server-side `$nin` exclusion.
- Led admin: analytics, moderation, bans, Blue Tick badges, achievement approvals.
- **Stack:** Node.js, MongoDB, Redis, React

---

### Eyeshare — Backend + Admin Owner | CIS

Job marketplace + on-demand expert video consultations.

- Socket-coordinated **Agora** calls with **60s** reconnect cap to stop paid-minute burn; **60–80%** smaller socket payloads via delta signaling.
- DB heartbeat for **ECONNRESET** resilience on low-bandwidth users.
- Extended inherited system and re-deployed with automated builds.
- **Stack:** Node.js, MongoDB, Agora, WebSockets, React

---

### Additional Projects | CIS

- **Messice** — Fantasy football betting: backend modules, third-party data integration, admin analytics, deployment (real users).
- **Barber Booking** — Slot booking with overlap prevention; backend + React admin + deployment.
- **Catch That Truck** — Ice-cream delivery locator; React analytics admin + deployment.
- **Ergzee** — IoT fitness-band app; frontend, device-data ingestion, admin analytics, deployment.

---

# MASTER METRICS TABLE (all projects)

| Project | Metric | Value |
|---------|--------|-------|
| Squach | API latency improvement | ~90s → ~300ms |
| Squach | Table query replaced | 10+ tables |
| Squach | Microservices | 6 |
| Squach | Third-party API reduction | ~95% |
| Squach | Reservation TTL | 20 min |
| Squach | Booking workflow steps | 7 |
| Hotpocket | Tables / branches | 12 / 2 |
| Hotpocket | Split billing players | 2–4 |
| Hotpocket | Business features | 25+ |
| Tambez | N+1 queries replaced | ~150 → 1 |
| Tambez | Aggregation stages | 8 |
| Tambez | MongoDB collections | 23 |
| Tambez | Play Store installs | 100+ |
| Eyeshare | Socket payload reduction | 60–80% |
| Eyeshare | Reconnect timeout | 60s |
| Portfolio | Total production projects | 7+ |

---

# MASTER TECH STACK BY PROJECT

| Project | Technologies |
|---------|-------------|
| Squach | Node.js, MySQL, Redis, BullMQ, Microservices, API Gateway, Email, SMS, In-App |
| Hotpocket | React, WebSockets, Firebase, State Management · (backend: Python, Firestore) |
| Tambez | Node.js, MongoDB, Redis, React |
| Eyeshare | Node.js, MongoDB, Agora, WebSockets, React |
| Messice | Node.js (backend), admin panel, deployment |
| Barber Booking | Node.js, React, deployment |
| Catch That Truck | React, deployment |
| Ergzee | React, Node.js, IoT ingestion, deployment |

---

*Last extracted from `Projects.tsx`. Update when project copy changes.*
