# Waitless — Digital Queue System

A real-time queue management system. 
Business owners manage waiting lines digitally — 
customers join via a link and track their position live.

## Stack
- **NestJS** — TypeScript backend
- **Bull Queue** — reliable job processing for email notifications
- **Socket.IO** — real-time position updates
- **PostgreSQL + Prisma v7** — database with pg adapter
- **Resend** — email notifications
- **Next.js** — admin dashboard + customer pages
- **Docker Compose** — local development

## Architecture
\`\`\`
Customer (browser)
     ↓ join via link
Next.js Client
     ↓ REST API calls
NestJS API (port 3001)
     ↓ Prisma
PostgreSQL (Docker)
     ↓ Bull Queue
Resend (email notifications)
     ↑ Socket.IO
Real-time position updates → all connected clients
\`\`\`

## How it works
1. Admin creates a queue and shares the join link
2. Customer opens the link, enters name + email
3. Customer sees their position in real-time via WebSocket
4. Admin calls next → current customer served, 
   next customer notified via email
5. All connected clients update instantly via Socket.IO

## Key Technical Decisions

**Bull Queue over setTimeout**
Email notifications are queued as Bull jobs — 
if the server restarts, jobs are not lost (stored in Redis).

**WebSocket over HTTP Polling**
100 customers polling every 5s = 1200 requests/min.
Socket.IO pushes updates only when something changes.

**UUID over auto-increment IDs**
Sequential IDs allow enumeration attacks. 
UUID makes IDs impossible to guess.

**Customer token**
No login required for customers — 
they get a unique UUID token as their tracking link.

## Local Development
\`\`\`bash
# Start database + Redis
docker compose up -d

# Backend
cd server && npm install
npm run start:dev

# Frontend
cd client && npm install
npm run dev
\`\`\`

## Environment Variables
\`\`\`env
DATABASE_URL=postgresql://postgres:password@localhost:5432/waitless
JWT_SECRET=your-secret-key
ADMIN_REGISTER_SECRET=your-register-secret
REDIS_URL=redis://localhost:6379
RESEND_API_KEY=re_xxxxx
MAIL_FROM=Waitless <onboarding@resend.dev>
\`\`\`