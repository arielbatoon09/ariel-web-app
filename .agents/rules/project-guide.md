# Ariel Web App - Developer & Agent Guide

Welcome, Agent! This document outlines the project architecture, file structure, naming conventions, core technology stack, and design guidelines for the **Ariel Web App**. Refer to this guide to understand exactly where to write code and how to align with the project's philosophy.

---

## 1. Architectural Philosophy

We adhere to a clean, decoupled, layered architecture:
*   **KISS (Keep It Simple, Stupid)**: Write clear, readable code. Avoid over-engineering patterns before they are actually needed.
*   **DRY (Don't Repeat Yourself)**: If a query or logic block is used in more than one layout, server action, or page, extract it to its dedicated architectural layer.
*   **Decoupled State**: Separate low-level database operations from server actions, and separate client caching hooks from UI rendering code.
*   **Componentization**: Break large UI files into small, single-responsibility components (e.g., separating tables, headers, and dialog wrappers).

---

## 2. Directory Structure & File Placement

Always place new code in its respective architectural layer:

```
├── .agents/
│   └── rules/
│       └── project-guide.md       # This file
├── app/
│   ├── (auth)/                    # Public auth pages (login, signup)
│   ├── (dashboard)/
│   │   ├── admin/                 # Admin control panel pages & layouts
│   │   └── customer/              # Client portal pages & layouts
│   └── (public)/                  # Home page and public portfolio content
├── components/
│   ├── ui/                        # Low-level atomic components (Button, Dialog, Input, Skeleton)
│   ├── common/                    # App-wide reusable feature systems (DataTable, ConfirmDialog)
│   ├── context/                   # Context wrappers & Providers (ThemeProvider, QueryProvider)
│   └── features/                  # Feature-specific client assets
│       ├── auth/                  # LoginForm, etc.
│       └── dashboard/             # DashboardSidebar, AdminHeader, features (e.g., /customers)
├── constants/                     # Static configurations, copy, and static list datasets
├── data/                          # Low-level DB Query Layer (Pure server helpers, no business rules)
│   ├── users.ts                   # User table select/insert/delete queries
│   ├── roles.ts                   # Role verification queries
│   └── auth.ts                    # Supabase session / Admin client init
├── drizzle/                       # Database schema and migration tracking files
│   └── schema.ts                  # Drizzle ORM pgTable schemas
├── hooks/                         # Client-side hooks & State managers
│   ├── use-customers.ts           # TanStack React Query queries and mutations
│   ├── use-auth-store.ts          # Zustand authentication store
│   └── use-dashboard-store.ts     # Zustand local UI state store
├── services/                      # Service Layer / Next.js Server Actions ("use server")
│   ├── auth.ts                    # Session-verifying server action endpoints
│   └── customers.ts               # Administrative client management endpoints
└── lib/                           # Global configuration clients & validation schemas (zod)
```

---

## 3. Core Packages & Dependencies

Below is the list of core packages utilized in this project (as defined in `package.json`). Do not add redundant or overlapping packages; utilize the existing library primitives.

| Package | Version | Purpose |
| :--- | :--- | :--- |
| `next` | `16.2.6` | Next.js framework (App Router) |
| `react` / `react-dom` | `19.2.4` | React framework library |
| `@tanstack/react-query` | `5.101.2` | Server state fetching, caching, and cache invalidation hooks |
| `@tanstack/react-form` | `1.33.0` | Form validation and submission handlers |
| `drizzle-orm` / `drizzle-kit` | `0.45.2` / `0.31.10` | Database ORM and schema migration tools |
| `@supabase/supabase-js` / `@supabase/ssr` | `2.110.0` / `0.12.0` | Authentication provider client and middleware/helpers |
| `zustand` | `5.0.14` | Client-side lightweight global UI state management |
| `motion` | `12.42.2` | Fluid animation library |
| `lucide-react` | `1.23.0` | SVG Icon library |
| `sonner` | `2.0.7` | Toast notification provider |
| `zod` | `4.4.3` | Type-safe schema validation |

---

## 4. Naming Conventions

### File Naming
*   **Components & Hooks**: `kebab-case`.
    *   Examples: `customer-table.tsx`, `confirm-dialog.tsx`, `use-customers.ts`.
*   **Query & Service Files**: Singular/Plural `kebab-case`.
    *   Examples: `data/users.ts`, `services/customers.ts`.

### Code Naming
*   **React Components**: `PascalCase`.
    *   Examples: `CustomerTable`, `ConfirmDialog`.
*   **Functions & Methods**: `camelCase`.
    *   Examples: `getUserByAuthId()`, `toggleCustomerBlockStatusAction()`.
*   **Server Actions**: Append `Action` suffix.
    *   Examples: `createCustomerAction()`, `getUserRoleAction()`.
*   **React Query Keys**: Monospace UPPERCASE arrays.
    *   Example: `export const CUSTOMERS_QUERY_KEY = ["customers"];`

---

## 5. Layer Responsibilities

### Low-level Query Layer (`data/`)
*   **Rules**: Run pure database calls (Drizzle selects, inserts, deletes, updates). No React hooks, no Next.js routing redirect side-effects, no toast notifications.
*   **Usage**: Imported by layouts, pages, and `services/` endpoints.

### Service Layer (`services/`)
*   **Rules**: Write Next.js Server Actions with `"use server"` at the top. Perform session verification, permission guards (e.g., verifying `admin` role), and orchestrate database modifications.
*   **Usage**: Imported by client components or hooks.

### Hooks Layer (`hooks/`)
*   **Rules**: Leverage `@tanstack/react-query` to manage asynchronous server state (caching, query keys, invalidating tables on mutation success). Keep components fully declarative by delegating fetch side-effects here.

### UI Components (`components/`)
*   Keep `components/ui/` clean and generic.
*   Put reusable patterns like table displays, grid structures, or confirmation modals in `components/common/`.
*   Write layouts and specific page components inside `components/features/`.

---

## 6. Design Concept & Aesthetic Guidelines

Our application utilizes a **Cebu cyber-console / premium developer terminal** aesthetic. We prioritize sharp structures, high-contrast typography, and intentional color systems for both Light and Dark modes.

### 5.1 Color Systems & Mode Guidelines

To maintain visual depth and premium design, we follow distinct token systems:

| Variable | Light Mode Value | Dark Mode Value | Design Role |
| :--- | :--- | :--- | :--- |
| `--background` | `oklch(0.985 0.002 240)` | `oklch(0.13 0.004 240)` | Main body background. Stark but soft. |
| `--card` | `oklch(0.985 0.002 240)` | `oklch(0.16 0.004 240)` | Grid card backdrops. |
| `--border` | `oklch(0.85 0.004 240)` | `oklch(0.25 0.004 240)` | Solid framing borders and boundaries. |
| `--secondary` | `oklch(0.95 0.003 240)` | `oklch(0.19 0.004 240)` | Inner containers and control triggers. |

#### Card Background Depth:
*   **Light Mode**: Cards match the main background (`--card` = `--background`) to prevent busy layers. Depth is created purely using thin solid borders (`border border-neutral-300`) and simple shadows or offsets.
*   **Dark Mode**: Cards are elevated and slightly lighter than the main background (`--card` is `oklch(0.16 ...)` vs background `oklch(0.13 ...)`). This creates clear physical segments and depth across panel components.

---

### 5.2 Layout & Border Accents

*   **Sharp Brackets**: Never use rounded corners (`rounded-none` or `rounded-xs`) for console-related cards, inputs, check toggles, or data grids.
*   **Corner Bracket Indicators**: Add small absolute-positioned corner indicators (`+` markers, or size-2.5 borders like `border-t-2 border-l-2`) on container grids to represent target terminal frames.
*   **Dynamic Left Indicators**: Add left borders (`border-l-2 border-l-transparent`) on tables or sidebar lists that transition colors to show focus/selection (active states light up in solid foreground/contrast colors).

---

### 5.3 Control Toggles & Interactive Accents

*   **Interactive Toggles**: Hide native checkboxes (`sr-only`) and construct custom animated boxes (e.g., custom checkboxes with scaling square dot indicators).
*   **Typography Hierarchy**:
  *   Use Monospace (`font-mono`) in uppercase for labels, columns headers, statistics, and metadata.
  *   Use Title Case with Sans font (`font-sans`) for primary text, status indicators (e.g. `Active` or `Blocked`), and role tags (`Admin` / `Customer`).
*   **Inline Micro-Actions**: Actions on tables or details should be rendered inline with subtle borders and clear tooltips. On hover, increase opacity and highlight boundaries.

