# Deployment Guide for FutureScope

This guide will help you deploy your full-stack application (React + Node.js + MongoDB) to production.

## 🎯 Overview

- **Frontend**: Deploy to Vercel (free, easy setup)
- **Backend**: Deploy to Railway or Render (both have free tiers)
- **Database**: MongoDB Atlas (free tier available)
- **File Storage**: Cloudinary (already configured, free tier available)

---

## 📋 Prerequisites

1. **GitHub Account** - For version control and easy deployments
2. **MongoDB Atlas Account** - Free database hosting
3. **Cloudinary Account** - For image/file storage (you already have this)
4. **Vercel Account** - For frontend deployment
5. **Railway/Render Account** - For backend deployment

---

## 🗄️ Step 1: Setup MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Sign up/Login
3. Create a new cluster (Free tier M0)
4. Create a database user:
   - Database Access → Add New User
   - Create username and password (save these!)
5. Whitelist IP addresses:
   - Network Access → Add IP Address
   - Click "Allow Access from Anywhere" (0.0.0.0/0) for now
6. Get connection string:
   - Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string
   - Replace `<password>` with your database user password
   - Example: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/futurescope?retryWrites=true&w=majority`

---

## 🔧 Step 2: Prepare Your Code

Your code has been updated with environment variable support. Make sure you commit these changes:

```bash
git add .
git commit -m "Add deployment configuration and environment variables"
git push origin main
```

### Create Environment Variable Files (Optional for Local Development)

**Backend** (`backend/.env`):
```env
MONGO_URI=your_mongodb_connection_string_here
PORT=8000
SECRET_KEY=your_random_secret_key_here
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=http://localhost:5173
NODE_ENV=development
```

**Frontend** (`frontend/.env.local`):
```env
VITE_API_BASE_URL=http://localhost:8000
```

> ⚠️ **Important**: Never commit `.env` files to Git. They should be in `.gitignore`.

---

## 🚀 Step 3: Deploy Backend (Railway - Recommended)

### Option A: Railway (Easier, Free tier available)

1. Go to [Railway](https://railway.app)
2. Sign up with GitHub
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository
5. Railway will auto-detect Node.js
6. Set Environment Variables in Railway:
   - Go to your project → Variables tab
   - Add these variables:

   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=8000
   SECRET_KEY=your_jwt_secret_key (generate a random string)
   CLOUD_NAME=your_cloudinary_cloud_name
   API_KEY=your_cloudinary_api_key
   API_SECRET=your_cloudinary_api_secret
   FRONTEND_URL=https://your-frontend-url.vercel.app
   NODE_ENV=production
   ```

7. Railway will automatically deploy your backend
8. Copy your backend URL (e.g., `https://your-app.railway.app`)

### Option B: Render (Alternative)

1. Go to [Render](https://render.com)
2. Sign up with GitHub
3. Click "New +" → "Web Service"
4. Connect your GitHub repository
5. Configure:
   - **Name**: `fyp-backend`
   - **Environment**: `Node`
   - **Build Command**: `npm install`
   - **Start Command**: `npm start`
   - **Plan**: Free

6. Add Environment Variables (same as Railway)
7. Click "Create Web Service"
8. Copy your backend URL (e.g., `https://your-app.onrender.com`)

---

## 🎨 Step 4: Deploy Frontend (Vercel)

1. Go to [Vercel](https://vercel.com)
2. Sign up with GitHub
3. Click "Add New" → "Project"
4. Import your GitHub repository
5. Configure:
   - **Framework Preset**: Vite
   - **Root Directory**: `frontend`
   - **Build Command**: `npm run build`
   - **Output Directory**: `dist`

6. Add Environment Variable:
   - **Key**: `VITE_API_BASE_URL`
   - **Value**: Your backend URL (from Step 3)

7. Click "Deploy"
8. Wait for deployment to complete
9. Copy your frontend URL (e.g., `https://your-app.vercel.app`)

---

## 🔄 Step 5: Update Backend CORS

After getting your frontend URL, update the backend environment variable:

1. Go back to Railway/Render
2. Update the `FRONTEND_URL` environment variable with your Vercel URL
3. Redeploy the backend (should auto-redeploy)

---

## ✅ Step 6: Verify Deployment

1. **Frontend**: Visit your Vercel URL
2. **Backend**: Test API endpoint: `https://your-backend-url/api/v1/job/get`
3. **Test Features**:
   - Sign up a new user
   - Login
   - Browse jobs
   - Apply for a job

---

## 🔒 Step 7: Security Checklist

- [ ] MongoDB Atlas IP whitelist configured
- [ ] All environment variables are set
- [ ] SECRET_KEY is a strong random string
- [ ] CORS is configured with your frontend URL
- [ ] Cloudinary credentials are secure

---

## 📝 Environment Variables Summary

### Backend (.env on Railway/Render)
```
MONGO_URI=mongodb+srv://...
PORT=8000
SECRET_KEY=your_random_secret_key
CLOUD_NAME=your_cloudinary_cloud_name
API_KEY=your_cloudinary_api_key
API_SECRET=your_cloudinary_api_secret
FRONTEND_URL=https://your-frontend.vercel.app
NODE_ENV=production
```

### Frontend (on Vercel)
```
VITE_API_BASE_URL=https://your-backend.railway.app
```

---

## 🐛 Troubleshooting

### Backend not connecting to database
- Check MONGO_URI is correct
- Verify IP whitelist in MongoDB Atlas
- Check backend logs for connection errors

### CORS errors
- Verify FRONTEND_URL matches your Vercel URL exactly
- Check backend logs for CORS errors
- Ensure credentials are enabled in requests

### Frontend can't reach backend
- Verify VITE_API_BASE_URL is set correctly
- Check if backend URL is accessible (visit it in browser)
- Ensure backend is deployed and running

### Cookie issues
- Verify CORS credentials are enabled
- Check if domains match (no trailing slashes)
- Test with different browsers

---

## 🎉 You're Done!

Your application should now be live and accessible. Share your Vercel URL with others!

---

## 📞 Need Help?

- Railway Docs: https://docs.railway.app
- Vercel Docs: https://vercel.com/docs
- Render Docs: https://render.com/docs
- MongoDB Atlas Docs: https://docs.atlas.mongodb.com

