# GetSync

## Prerequisites
- Node.js 18+ and npm
- MongoDB running locally (defaults to `mongodb://127.0.0.1:27017/ProjectManagement?replicaSet=rs0`)

## Install dependencies
```bash
cd backend
npm install
cd ../client
npm install
```

## Run the apps locally
```bash
cd backend
npm run dev
```

```bash
cd client
npm run dev
```

## Build for production
```bash
cd backend
npm run build
npm start
```

```bash
cd client
npm run build
npm run preview
```

## Environment variables
The backend has defaults for local development. To override them, create a `backend/.env` file and set values like `MONGO_URI`, `JWT_SECRET`, and `FRONTEND_ORIGIN`.
