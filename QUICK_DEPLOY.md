# 🚀 Quick Deploy - Get Your Website Live in 15 Minutes

This guide will get your website deployed with minimal steps. Just follow the numbered steps!

---

## Step 1: Setup GitHub (2 minutes)

1. Go to https://github.com and sign up/login
2. Click the "+" icon → "New repository"
3. Name it: `futurescope-website`
4. Make it **Public** (free hosting requires public repo)
5. Click "Create repository"
6. Copy the repository URL (e.g., `https://github.com/yourusername/futurescope-website`)

**Run this in your project folder:**
```bash
git init
git add .
git commit -m "Initial commit - ready for deployment"
git branch -M main
git remote add origin YOUR_REPO_URL_HERE
git push -u origin main
```

---

## Step 2: Setup MongoDB Atlas (3 minutes)

1. Go to https://www.mongodb.com/cloud/atlas
2. Click "Try Free" and sign up
3. Choose "Build a Database" → Select **FREE** tier (M0)
4. Choose any cloud provider/region → Click "Create"
5. **Create Database User:**
   - Click "Database Access" → "Add New Database User"
   - Authentication: Password
   - Username: `futurescope_user`
   - Password: Generate secure password (SAVE IT!)
   - Database User Privileges: "Atlas admin"
   - Click "Add User"
6. **Whitelist IP:**
   - Click "Network Access" → "Add IP Address"
   - Click "Allow Access from Anywhere" (0.0.0.0/0)
   - Click "Confirm"
7. **Get Connection String:**
   - Go back to "Database" → Click "Connect" on your cluster
   - Choose "Connect your application"
   - Copy the connection string (looks like: `mongodb+srv://username:password@cluster0.xxxxx.mongodb.net/...`)
   - Replace `<password>` with your database user password
   - **SAVE THIS STRING!** You'll need it in Step 4

---

## Step 3: Deploy Frontend on Vercel (3 minutes)

1. Go to https://vercel.com
2. Click "Sign Up" → Choose "Continue with GitHub"
3. Authorize Vercel to access GitHub
4. Click "Add New" → "Project"
5. Import your repository: `futurescope-website`
6. Configure:
   - **Framework Preset:** Vite
   - **Root Directory:** `frontend` (IMPORTANT!)
   - **Build Command:** `npm run build` (should be auto-detected)
   - **Output Directory:** `dist` (should be auto-detected)
7. **Environment Variables:**
   - Click "Environment Variables"
   - Add:
     - Key: `VITE_API_BASE_URL`
     - Value: `https://placeholder.railway.app` (we'll update this later)
   - Click "Add"
8. Click "Deploy"
9. Wait 2-3 minutes for deployment
10. **COPY YOUR VERCEL URL** (e.g., `https://futurescope-website.vercel.app`)
    - You'll need this for Step 4!

---

## Step 4: Deploy Backend on Railway (4 minutes)

1. Go to https://railway.app
2. Click "Start a New Project" → "Login with GitHub"
3. Click "New Project" → "Deploy from GitHub repo"
4. Select your repository: `futurescope-website`
5. Railway will detect it's Node.js
6. Click on your project → Go to "Variables" tab
7. **Add ALL these environment variables:**

   ```
   MONGO_URI = your_mongodb_connection_string_from_step_2
   PORT = 8000
   SECRET_KEY = any_random_string_like_this_abc123xyz789_secret
   CLOUD_NAME = your_cloudinary_cloud_name
   API_KEY = your_cloudinary_api_key
   API_SECRET = your_cloudinary_api_secret
   FRONTEND_URL = your_vercel_url_from_step_3
   NODE_ENV = production
   ```

   > 💡 **Tips:**
   - `MONGO_URI`: Paste the string from Step 2
   - `SECRET_KEY`: Just type any random string (e.g., `my_super_secret_key_12345`)
   - `CLOUD_NAME`, `API_KEY`, `API_SECRET`: Get from https://console.cloudinary.com → Settings → API Keys
   - `FRONTEND_URL`: Your Vercel URL from Step 3 (with https://)

8. Go to "Settings" tab → Change "Root Directory" to: `backend`
9. Go to "Settings" tab → Change "Start Command" to: `npm start`
10. Railway will auto-deploy
11. Wait 2-3 minutes
12. Go to "Settings" → "Domains" → Click "Generate Domain"
13. **COPY YOUR RAILWAY URL** (e.g., `https://your-app.railway.app`)

---

## Step 5: Update Frontend API URL (2 minutes)

1. Go back to Vercel → Your project → "Settings" → "Environment Variables"
2. Find `VITE_API_BASE_URL`
3. Click "Edit"
4. Change value to your **Railway URL** from Step 4
5. Click "Save"
6. Go to "Deployments" tab → Click the 3 dots on latest deployment → "Redeploy"

---

## Step 6: Update Backend CORS (1 minute)

1. Go back to Railway → Your project → "Variables"
2. Make sure `FRONTEND_URL` is set to your Vercel URL (it should already be)
3. If you need to change it, Railway will auto-redeploy

---

## ✅ Done! Your Website is Live!

Visit your **Vercel URL** (from Step 3) - that's your live website!

---

## 🎯 Quick Checklist

- [ ] GitHub repository created and code pushed
- [ ] MongoDB Atlas database created and connection string copied
- [ ] Vercel frontend deployed
- [ ] Railway backend deployed with all environment variables
- [ ] Frontend `VITE_API_BASE_URL` updated to Railway URL
- [ ] Website tested and working!

---

## 🆘 Troubleshooting

**"Cannot connect to backend"**
- Check Railway URL is correct in Vercel environment variables
- Make sure Railway deployment is successful (green checkmark)

**"MongoDB connection failed"**
- Verify `MONGO_URI` in Railway has correct password
- Check MongoDB Atlas IP whitelist includes 0.0.0.0/0
- Make sure database user has correct privileges

**"CORS error"**
- Verify `FRONTEND_URL` in Railway matches your Vercel URL exactly
- Make sure there's no trailing slash

**Need help?**
- Check Railway logs: Project → Deployments → Click deployment → View logs
- Check Vercel logs: Project → Deployments → Click deployment → View logs

---

## 📝 Your Live URLs

- **Frontend (Main Website):** https://your-app.vercel.app
- **Backend API:** https://your-app.railway.app
- **GitHub Repo:** https://github.com/yourusername/futurescope-website

**Bookmark your Vercel URL - that's your live website!** 🎉

