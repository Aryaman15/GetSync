# GetSync / TeamSync

A modern publishing production workflow system built on the existing GetSync workspace foundation. This update introduces employee + admin experiences for job assignment, live timers, review loops, and operational reporting.

## Quick Start

### Backend

```bash
cd backend
npm install
npm run dev
```

### Frontend

```bash
cd client
npm install
npm run dev
```

## Seed Data

Seed the production workflow data (task types, admin, employees, and sample jobs):

```bash
cd backend
npm run seed:production
```

### Seeded Credentials

| Role | Employee ID | Password |
| --- | --- | --- |
| Admin | ADMIN-001 | admin1234 |
| Employee | EMP-101 | employee1234 |
| Employee | EMP-202 | employee1234 |

## Production Workflow URLs

- Employee login: `http://localhost:5173/production/login`
- Admin dashboard: `http://localhost:5173/production/admin`
- Employee queue: `http://localhost:5173/production/employee`

## Environment Variables

Copy `.env.example` files and update values as needed.

- `backend/.env.example`
- `client/.env.example`

## Notes

- Timers enforce one active session per employee.
- Job status changes follow the submit/review/approve cycle.
- Presence updates every 15 seconds to support online status.
