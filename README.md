# AssetFlow ERP

Enterprise physical asset & resource management system built for **Odoo Hackathon 2026**.

Most organizations track physical assets (laptops, tools, equipment, shared resources) across scattered spreadsheets, chat threads, and verbal handovers — so nobody has a reliable answer to "who has this right now," "is it under maintenance," or "when was it last audited." AssetFlow replaces that with one system of record: assets get a unique tag the moment they're registered, every allocation/transfer/booking/repair is logged against that tag, and department heads, auditors, and admins each get a role-scoped view instead of one flat spreadsheet everyone can edit.

Core capabilities:
- **Asset registry** — auto-tagged (`AF-0001`, `AF-0002`, ...), categorized, with condition, cost, location, and full history per asset
- **Allocation & transfers** — assign an asset to an employee/department, request/approve transfers between employees, track returns and condition-on-return
- **Resource booking** — shared, bookable assets exposed on a calendar with slot-level conflict prevention
- **Maintenance** — ticket lifecycle from report → approval → technician assignment → resolution
- **Audit cycles** — scheduled audits with assigned auditors and per-asset Verified/Missing/Damaged findings
- **RBAC** — five roles (`Employee`, `DeptHead`, `AssetManager`, `Admin`, plus auditor assignment) gate what each user can see and do, enforced on the backend, not just hidden in the UI
- **Notifications & activity log** — every state-changing action fires a notification and is recorded in a system-wide audit trail

Repo: `Monish0306/Odoo` — a two-folder monorepo (`backend/` + `frontend/`), no root-level orchestration (each app is run independently).

---

## Tech Stack

| Layer | Technology | Why |
|---|---|---|
| Frontend | Next.js 16 (App Router), React 19, TypeScript | Server-rendered pages per feature area, typed end to end |
| Styling/UI | Tailwind CSS 4, Framer Motion, lucide-react | Utility-first styling plus motion for calendar/timeline interactions |
| Backend | Node.js, Express 5 | Lightweight REST layer, one router file per domain |
| Auth | JWT (`jsonwebtoken`) + `bcryptjs` | Stateless auth; role and department embedded in the token |
| Validation | Zod (backend), custom validators in `utils/` | Request-body validation before hitting the DB |
| Database | PostgreSQL via Neon (serverless) | Prisma migrations + a raw `schema.sql` mirror for running directly in the Neon console |
| ORM | Prisma 7 (`@prisma/adapter-neon`) | Type-safe queries, 11-model relational schema |
| Realtime | `ws` | WebSocket dependency present for live updates |

---

## Architecture

```
Odoo/
├── backend/
│   ├── server.js            # Express app, CORS, route mounting, error handler
│   ├── index.js             # Entry point (requires server.js)
│   ├── routes/               # One file per domain (see below)
│   ├── controllers/
│   ├── middleware/
│   │   ├── auth.js           # JWT verification
│   │   └── requireRole.js    # Role-based route guard
│   ├── services/             # Prisma client wrapper
│   ├── utils/                # Shared validators
│   ├── prisma/
│   │   ├── schema.prisma     # Data model (11 models)
│   │   └── seed.js
│   └── schema.sql            # Raw SQL mirror of the Prisma schema (for Neon console)
│
└── frontend/
    ├── app/                   # Next.js App Router pages
    │   ├── login/  dashboard/  assets/  allocation/
    │   ├── booking/  maintenance/  audit/
    │   ├── organization/  reports/  notifications/
    ├── components/            # Feature-grouped UI (audit/, reports/, resource-booking/, notifications/, ui/)
    └── lib/
        ├── api.ts             # fetch wrapper — injects JWT, hits NEXT_PUBLIC_API_URL
        └── utils.ts
```

The frontend talks to the backend purely over REST via `lib/api.ts`, using a bearer token stored in `localStorage` after login.

---

## Data Model (Prisma)

| Model | Purpose |
|---|---|
| `Employee` | Users. Roles: `Employee`, `DeptHead`, `AssetManager`, `Admin` |
| `Department` | Supports a parent/child hierarchy and a head employee |
| `Category` | Asset categories with custom JSON fields |
| `Asset` | Core asset record — tag (`AF-0001` format), condition, status, location, bookable flag |
| `Allocation` | Asset ↔ employee assignment history, with return tracking |
| `TransferRequest` | Request/approve/reject flow for moving an asset between employees |
| `Booking` | Time-slot reservations for shared/bookable assets |
| `MaintenanceRequest` | Ticket lifecycle: Pending → Approved/Rejected → Assigned → In Progress → Resolved |
| `AuditCycle` / `AuditAssignment` / `AuditDiscrepancy` | Scheduled audits, assigned auditors, and Verified/Missing/Damaged findings |
| `Notification` | Per-employee, typed (e.g. `MaintenanceAssigned`, `BookingConfirmed`) |
| `ActivityLog` | System-wide audit trail of actions |

---

## Backend API Surface

All responses follow a consistent `{ data, error }` envelope. Protected routes require `Authorization: Bearer <token>`; several are additionally gated by role via `requireRole(...)`.

| Route prefix | Endpoints | Notes |
|---|---|---|
| `/auth` | `signup`, `login`, `forgot-password`, `me` | Signup always forces `role: Employee` server-side, regardless of request body |
| `/` (organization) | `departments`, `categories`, `employees`, `employees/:id/promote` | Admin-only writes |
| `/assets` | CRUD + `/assets/:id/history` | Auto-generates sequential `AF-XXXX` tags; create restricted to `AssetManager`/`Admin` |
| `/allocations` | create, `/:id/return`, `/overdue` | |
| `/transfers` | create, `/:id/approve`, `/:id/reject` | Approval restricted to `DeptHead`/`AssetManager`/`Admin` |
| `/bookings` | create, list, `/calendar`, `/:id/cancel` | |
| `/maintenance` | create, `/:id/approve`, `/:id/reject`, `/:id/start`, `/:id/resolve`, list | Approve/reject restricted to `Admin`/`AssetManager` |
| `/audits` | create, `/:id/assign-auditors`, `/:id/discrepancies`, `/discrepancies/:id`, `/:id/close`, `/:id/report`, list | Create/assign/close restricted to `Admin` |
| `/notifications` | list, `/:id/read` | |
| `/activity-logs` | list | `Admin`/`AssetManager` only |
| `/dashboard` | `/kpis` | |
| `/reports` | `/asset-utilization`, `/maintenance-summary` | |

---

## Frontend Pages

`login` · `dashboard` · `assets` · `allocation` · `booking` (with a dedicated calendar panel + timeline) · `maintenance` · `audit` · `organization` · `reports` (utilization/maintenance charts, idle-assets & retirement recommendations, export) · `notifications`

`AuthGuard.tsx` wraps protected routes; `Sidebar.tsx` / `Header.tsx` provide the shared shell.

---

## Getting Started

### Backend
```bash
cd backend
npm install
# create a .env with DATABASE_URL / DIRECT_URL (Neon Postgres), JWT_SECRET, CORS_ORIGIN
npx prisma generate
npm run dev        # nodemon, defaults to port 5000
```

### Frontend
```bash
cd frontend
npm install
# create a .env.local with NEXT_PUBLIC_API_URL=http://localhost:5000
npm run dev         # http://localhost:3000
```

---

## Contributors

Built for **Odoo Hackathon 2026** by:

1. [Tanushree Kalla](https://github.com/tanushreebackend-arch) 
2. [Monish0306](https://github.com/Monish0306) — Valiveti Monish
3. [GeethaMaduri](https://github.com/GeethaMaduri)
4. [Shreya-220906](https://github.com/Shreya-220906) — Shreya
