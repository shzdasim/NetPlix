# NetPlix (Netflix-style UI) — Project Plan

> Goal: Build **NetPlix**, a personal Netflix-like web app that lets you **browse** movies + TV series and **play** via the free source API provided by **vidsrc.ru**.

## 1) Important Notes (Before Coding)
1. **Licensing / Legality**: Ensure you have the rights to stream/play content. This project is for personal use, but legality still matters.
2. **vidsrc.ru Terms & Stability**: Free streaming/proxy APIs can change or rate-limit. We will isolate all API logic behind a small service layer so we can swap providers if needed.
3. **Security**: Don’t expose sensitive keys (if any). If vidsrc requires tokens, we’ll keep them server-side.

## 2) Tech Stack
We’ll use a front-end Netflix-like SPA:
- **Framework**: choose one for implementation (see section 4). You requested “Vue + React”, but a single app must pick one UI framework.
- **Recommended**: Start with **Vue 3 (Vite)** for UI + routing.
- **Optional**: Add a “React islands” approach later if you truly need both.

**API**:
- vidsrc.ru docs: https://vidsrc.ru/docs

## 3) High-Level Architecture
### 3.1 Frontend (SPA)
- Pages:
  - Home (hero + rows)
  - Browse (filters)
  - Movie detail
  - TV series detail
  - Search
  - Player page
- Components:
  - Navbar
  - HeroBanner
  - ContentRow
  - Card
  - Modal / Loading states
- State management:
  - Simple stores (Pinia for Vue) or lightweight context for React

### 3.2 Backend (Optional but recommended)
To keep API usage stable and safe:
- `/api/*` endpoints on a small backend (Node/Express, or Vercel/Netlify functions)
- Frontend calls backend, backend calls vidsrc.ru

If vidsrc.ru is fully public with no secrets, backend may be optional—but recommended for stability + caching + CORS.

## 4) Decision: Vue + React Requirement
A single project typically can’t be “both Vue and React” cleanly without extra tooling.

**Plan**:
- Phase 1: Build the full app in **one framework** (recommended: Vue 3).
- Phase 2 (optional): If you still want React, convert only the player UI to React or add React components via a separate entry.

## 5) Milestone Plan (What we’ll build)
### Milestone A — Project Bootstrap (Day 1)
1. Create repository structure.
2. Initialize frontend app.
3. Add routing.
4. Add base styling (Netflix dark theme).

### Milestone B — API Integration Layer (Day 1-2)
1. Create a dedicated API client module:
   - `src/services/vidsrcClient.js`
2. Implement functions (examples; exact endpoints depend on vidsrc docs):
   - fetch trending
   - search
   - list popular by type (movie/tv)
   - get details by id
   - resolve playable stream / playback sources
3. Add a single proxy layer if needed (backend optional).

### Milestone C — Browse UI (Day 2-3)
1. Home page with rows:
   - Trending Movies
   - Trending TV
   - Popular Movies
   - Popular TV
2. Card grid / horizontal scroll rows.
3. Movie/TV detail pages.
4. Loading skeletons + error boundaries.

### Milestone D — Player Page (Day 3-4)
1. Player route:
   - `/watch/:type/:id`
2. On load:
   - Fetch stream sources
   - Render video player
3. Handle:
   - buffering
   - fallback error message

### Milestone E — Quality & Polish (Day 4-5)
1. Improve UX:
   - keyboard navigation
   - better skeletons
2. Add caching:
   - in-memory caching or localStorage for lists
3. Add basic analytics (optional).

## 6) Repo / Folder Structure
Proposed structure:

```
NetPlix/
  README.md
  package.json (optional monorepo root)
  apps/
    web/                  # Vue or React app
      src/
        assets/
        components/
        pages/
        router/
        services/
        stores/ (if Vue)
        styles/
  packages/
    api/                  # shared API client/types (optional)
  server/                 # optional backend proxy
    src/
```

Since this is a personal project, we can keep it simple:
- `web/` only for now
- add `server/` later if CORS/token issues arise.

## 7) Implementation Steps (Executable Checklist)
### Step 1 — Setup
- [ ] Create project folder (already: NetPlix)
- [ ] Initialize frontend with Vite + Vue 3 (or React)
- [ ] Configure routing

### Step 2 — Styling
- [ ] Add global dark theme
- [ ] Implement Navbar + HeroBanner styles

### Step 3 — API Client
- [ ] Read vidsrc.ru docs carefully
- [ ] Implement API functions per docs
- [ ] Add retry + timeout handling

### Step 4 — Pages
- [ ] Home page with multiple rows
- [ ] Browse/Search page
- [ ] Detail pages for movie and tv
- [ ] Player page

### Step 5 — Playbacks
- [ ] Confirm player works end-to-end
- [ ] Handle errors gracefully

### Step 6 — Polish
- [ ] Skeletons
- [ ] Caching for list rows
- [ ] Production build check

## 8) What I Need From the API Docs
When we start implementing, we will extract from https://vidsrc.ru/docs:
- base URL / required headers
- available endpoints for:
  - trending / popular / latest
  - search
  - details
  - stream/source resolution
- required request parameters (IDs, language, country, etc.)

## 9) Commands We’ll Run (Typical)
From repo root:
- Install deps (frontend)
- Run dev server
- Build for production

(Exact commands will depend on whether we choose Vue or React and the folder structure.)

## 10) Next Action
We will start by creating:
1. `TODO.md` to track milestone progress
2. Frontend bootstrapping (Vue 3 recommended)
3. API client scaffolding

---
End of plan.

