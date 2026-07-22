# Deployment guide

## 1. Prepare services

- Frontend: deploy the client app to Vercel or Netlify
- Backend: deploy the server app to Render, Railway, or Fly.io
- Database: use MongoDB Atlas

## 2. Backend environment variables

Set these in your hosting dashboard:

- PORT=5000 (Render/others usually inject this automatically)
- MONGO_URI=your-mongodb-connection-string
- CLIENT_URL=https://your-frontend-domain
- JWT_SECRET=strong-random-secret
- NODE_ENV=production

Start command:

- npm start

## 3. Frontend environment variables

Set this in your hosting dashboard:

- VITE_API_URL=https://your-backend-domain/api

## 4. Deploy

- Vercel/Netlify: connect the client folder and set the build command to npm run build
- Render: create a web service from the server folder and use npm start

## 5. Final check

- Open the frontend URL
- Sign up/login
- Play a round and confirm scores save
