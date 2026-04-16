# CodeBoard

A collaborative coding platform built for DSA interview preparation. Create rooms, code with others in real time, and track your problem-solving progress.

&nbsp; **Stack:** MongoDB · Express · React · Node.js · Socket.io

---

## What it does

- Real-time collaborative code editor — changes sync instantly across all users in a room
- Monaco Editor (the same engine powering VS Code) with support for JavaScript, Python, Java, and C++
- In-room live chat so you can discuss approaches without switching tabs
- Curated DSA problem set with difficulty tags
- JWT authentication with protected routes
- User profiles with solved problem tracking

---

## Running locally

**Prerequisites:** Node.js v16+, MongoDB

```bash
git clone https://github.com/YOUR_USERNAME/codeboard.git
cd codeboard
npm run install-all
```

Create a `.env` file in the root:

```
MONGO_URI=your_mongodb_uri
JWT_SECRET=your_secret
CLIENT_URL=http://localhost:3000
PORT=5000
```

```bash
npm run dev
```

App runs on `http://localhost:3000`. Backend on port `5000`.

To seed sample problems:
```bash
node server/config/seed.js
```

---

## Project structure

```
├── server/
│   ├── index.js
│   ├── config/        # Socket.io handlers, DB seed
│   ├── controllers/   # Auth, problems, rooms, users
│   ├── middleware/    # JWT auth
│   ├── models/        # User, Room, Problem schemas
│   └── routes/
└── client/
    └── src/
        ├── components/
        ├── context/   # Auth context (JWT + user state)
        └── pages/     # Home, Problems, Room, Profile, Auth
```

---

## API

| Method | Route | Description |
|--------|-------|-------------|
| POST | `/api/auth/register` | Create account |
| POST | `/api/auth/login` | Login |
| GET | `/api/auth/me` | Current user |
| GET | `/api/problems` | All problems |
| GET | `/api/problems/:slug` | Single problem |
| POST | `/api/rooms` | Create room |
| GET | `/api/rooms/:roomId` | Room details |
| GET | `/api/users/:username` | User profile |

---

## Socket events

| Event | Description |
|-------|-------------|
| `join-room` | Join a session |
| `code-change` | Broadcast editor changes |
| `send-message` | Send chat message |
| `code-update` | Receive peer's code |
| `receive-message` | Receive chat message |
| `room-users` | Updated participants list |

---

## Tech

| | |
|--|--|
| Frontend | React 18, React Router v6 |
| Editor | Monaco Editor |
| Realtime | Socket.io |
| Backend | Express.js |
| Database | MongoDB, Mongoose |
| Auth | JWT, bcryptjs |

---

MIT License
