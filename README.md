# Portfolio Project (Decoupled Architecture)

This project is divided into two main services:

## 1. Frontend (`/frontend`)
- **Framework**: Next.js 14+ (App Router)
- **Styling**: Tailwind CSS
- **3D**: Three.js & React Three Fiber
- **Animations**: Framer Motion
- **Auth**: NextAuth.js (configured for Admin login)

### To Run:
```bash
cd frontend
npm install
npm run dev
```

## 2. Backend (`/backend`)
- **Framework**: Express.js
- **Language**: TypeScript (ES Modules)
- **Database**: MongoDB (Mongoose)
- **APIs**: RESTful endpoints for Projects and Skills

### To Run:
```bash
cd backend
npm install
npm run dev
```

---

## Configuration
Both folders require a configuration file. Copy `.env.local` to both `frontend/` and `backend/` and ensure the values match your local/production environment.

- **Frontend**: Needs `NEXT_PUBLIC_BACKEND_URL=http://localhost:5000/api`
- **Backend**: Needs `MONGODB_URI` and `PORT=5000`
