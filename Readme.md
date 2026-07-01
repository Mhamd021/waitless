# Waitless — Real-Time Queue Management Platform

A production-grade queue management system built for small businesses.
Admins manage waiting lines digitally — customers join via a QR code or 
link and track their live position without creating an account.

## Stack

- **NestJS** — TypeScript backend, modular architecture
- **PostgreSQL + Prisma v7** — queue state, customers, admins (source of truth)
- **Redis + BullMQ** — reliable async email notifications, restart-safe job queue
- **MongoDB + Mongoose** — event log and queue analytics
- **Socket.IO** — real-time position updates pushed on state change only
- **Resend** — transactional email notifications
- **Next.js** — admin dashboard + customer tracking pages
- **Docker Compose** — PostgreSQL, Redis, and MongoDB in one command

## Architecture
Customer (browser)
↓ QR code / join link — no account needed
Next.js Client
↓ REST API
NestJS API (port 3001)
├── Prisma → PostgreSQL    (queue state, source of truth)
├── BullMQ → Redis         (async email jobs, restart-safe)
├── Mongoose → MongoDB     (event log, analytics aggregation)
└── Socket.IO              (real-time push to all clients)
## How It Works

1. Admin registers with a secret key, creates a queue, shares the join link or QR code
2. Customer opens the link, enters name and email — no account required
3. Customer receives a UUID token as their personal tracking link
4. Customer sees their live position via WebSocket — no polling, no refresh
5. Admin calls next → BullMQ queues the email notification via Resend
6. All connected clients update instantly via Socket.IO
7. Every queue action is recorded as an event in MongoDB for analytics

## Key Technical Decisions

**Three databases, three responsibilities**
PostgreSQL handles transactional queue state where consistency matters.
Redis backs BullMQ for job processing — jobs survive server restarts.
MongoDB stores the event log where document flexibility fits better than
relational rows — each event type carries different metadata fields.

**WebSocket over HTTP polling**
100 customers polling every 5s = 1,200 requests/min.
Socket.IO pushes updates only when queue state actually changes.

**BullMQ over setTimeout**
Email jobs are persisted in Redis. If the server restarts mid-queue,
no notifications are lost — BullMQ picks up where it left off.

**UUID token over account login**
Customers get a UUID token as their tracking link.
No registration friction, and sequential IDs that allow enumeration
attacks are avoided entirely.

**Secret-key admin registration**
Admin sign-up requires a server-side secret. No open registration,
no risk of unauthorized dashboard access.

**MongoDB aggregation for analytics**
Queue analytics (no-show rate, completion rate, drop-off rate) are
computed via MongoDB's aggregation pipeline — purpose-built for this
kind of event counting without touching the PostgreSQL connection pool.

## Analytics

Every queue action writes an event to MongoDB:
- `CUSTOMER_JOINED` — position recorded in metadata
- `CALLED_NEXT` — which entry was called
- `ARRIVED` — customer confirmed at the counter
- `NO_SHOW` — customer did not appear
- `CUSTOMER_LEFT` — customer left before being called
- `QUEUE_CLOSED` — admin closed the queue

The `/queues/:id/stats` endpoint returns live aggregated stats:

```json
{
  "totalJoined": 20,
  "totalArrived": 15,
  "totalNoShows": 3,
  "totalLeft": 2,
  "totalCalled": 18,
  "completionRate": 75,
  "noShowRate": 15,
  "dropOffRate": 10
}
```

## Local Development

```bash
# Start PostgreSQL, Redis, and MongoDB
docker compose up -d

# Backend
cd server && npm install
npm run start:dev

# Frontend
cd client && npm install
npm run dev
```

## Environment Variables

```env
# Database
DATABASE_URL=postgresql://postgres:password@localhost:5432/waitless
MONGODB_URI=mongodb://localhost:27017/waitless_events

# Auth
JWT_SECRET=your-jwt-secret
ADMIN_REGISTER_SECRET=your-register-secret

# Redis
REDIS_URL=redis://localhost:6379

# Email
RESEND_API_KEY=re_xxxxx
MAIL_FROM=Waitless <onboarding@resend.dev>

# Frontend
NEXT_PUBLIC_API_URL=http://localhost:3001
NEXT_PUBLIC_WS_URL=http://localhost:3001
```