# Ariel Batoon - Professional Portfolio

A premium, state-of-the-art web application engineered with a modern Next.js architecture, robust serverless database integration, and high-performance caching layers. This platform serves as a public portfolio, articles archive, client services scoping portal, and comprehensive administration hub.

---

## 🚀 Tech Stack

### Frontend & UI
* **Next.js 16+ (App Router)**: Hybrid Server & Client Component rendering with optimized layouts.
* **React 19**: Built with memoized UI components, callback stability (`useCallback`/`useMemo`), and React request-lifecycle memoization (`cache`).
* **TailwindCSS & Shadcn UI**: Curated theme styling, glassmorphism, responsive grids, and clean layout elements.
* **Framer Motion**: Smooth micro-animations, fade-in transitions, and active scroll indicators.
* **TanStack Form & Zod**: Schema-validated form state handling for secure, client-side input validations.
* **TanStack Query (React Query)**: Client-side state synchronization, query caching, and optimistic UI mutations.

### Backend, Database & Caching
* **Supabase Auth & PostgreSQL**: Complete User Authentication, Row Level Security (RLS), and Postgres database instance.
* **Drizzle ORM**: Type-safe query builder and database migration management.
* **Redis Cache Layer (ioredis)**: In-memory key-value cache wrapper ensuring listing speeds of `<15ms`.
* **Cloudflare R2**: Secure object storage for uploading and hosting portfolios, cover banners, and articles media.

### Integration Services
* **Resend**: Transactional email dispatch for client orders, purchase confirmations, and contact form messages.
* **Google reCAPTCHA v2**: Verification challenge protecting public endpoints from automated bot spam.
* **Vercel Analytics**: Native tracking for user insights, traffic overview, and visitor behavior.
* **Cal.com**: Booking scheduling for client discovery and scoping calls.

---

## ✨ Core Features

### 💻 Public Client Experience
* **Marketing Public Pages**: Sleek, animated home page featuring recent blog entries, testimonials slider, and custom section alignments.
* **Dynamic Content Hubs**:
  * **Works (Portfolio)**: Dynamic project showcase filterable by categories and tags with paginated listing grids and individual slug reference pages.
  * **Articles (Blog)**: Date-and-title sorted archive with live markdown reader pages.
  * **Services**: Package listings displaying technical parameters, dynamic pricing, and individual checkout pages.
* **Contact & Discovery Scoping**: Secure message submissions with integrated rate-limiting.
* **Services Portal & Ordering**: Client checkout flow for custom digital service packages.

### 🛡️ Security & Throttling
* **Redis Sliding Window Log & Composite Rate Limiter**: Millisecond-precise sliding window logs (using Redis Sorted Sets) to prevent boundary-burst attacks:
  * **Composite Throttling**: Throttles by both Client IP and Email Address (normalized) to mitigate rotated-IP botnet dictionary attacks.
  * **Login Endpoint**: Throttled to `5 attempts / min`.
  * **Checkout Endpoint**: Throttled to `3 checkouts / min`.
  * **Contact Submission**: Throttled to `3 submissions / min`.
* **Google reCAPTCHA v2 Verification**: Double-checks form tokens on the server-side for Login, Contact, and Checkout actions before processing, providing zero-spam endpoints.

### 📊 Admin Control Center
* **Consolidated Overview Dashboard**: Verifies authentication once and loads works, articles, customers, orders, and sales metrics in parallel using a single optimized Server Action.
* **Redis Cache Invalidation**: Automatic cache-purging routines whenever admin creates, updates, deletes, or toggles work items, articles, services, and categories, keeping lists fast yet always correct.
* **Custom CMS (Content Management System) for Articles & Works**: Seamless drafting, publishing, and content management for portfolio items and blog posts, including custom tags, categories linking, and search indexing metadata.
* **Asset Upload Manager**: Signed presigned URL delivery to upload high-definition images to Cloudflare R2 instantly without loading the Next.js server.
* **User & Permissions Directory**: Direct control over customer profiles, blocking status, and role privileges updates (e.g. promoting to Admin).

### 👥 Customer Dashboard
* **Order Progress Tracking**: Visually monitor the scope, roadmap milestones, and active state of your active projects.
* **Secure Deliverables Workspace**: Centralized hub to access your project requirements, files, and final delivery download references.
* **Interactive Scoping & Revision Chat**: Chat directly inside individual order panels to scope requirements and request revisions.
* **Personal Profile & Settings**: Update contact information and profile settings.

---

## Getting Started

### 1. Environment Configuration
Copy the template environment file and fill in the configurations:

```bash
cp .env.example .env
```


### 2. Development Setup

```bash
# Install dependencies
npm install

# Run database migrations
npm run db:push

# Launch development server
npm run dev
```
