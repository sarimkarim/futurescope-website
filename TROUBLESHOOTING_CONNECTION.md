# 🔧 Troubleshooting: Backend Not Connecting to Frontend

## ✅ Check These Items:

### 1. **Railway Backend URL** (Most Important!)
   - Go to Railway → Your Project → Settings → Domains
   - Copy your Railway domain (e.g., `https://your-app.railway.app`)
   - ⚠️ Make sure it starts with `https://` (not `http://`)
   - Test it: Open the URL in browser, you should see an error or nothing (that's normal)
   - Test API: Try `https://your-app.railway.app/api/v1/job/get` - should return JSON or error

### 2. **Frontend Environment Variable (Vercel)**
   - Go to Vercel → Your Project → Settings → Environment Variables
   - Check `VITE_API_BASE_URL`
   - Should be: `https://your-railway-url.railway.app` (NO trailing slash!)
   - After updating, go to Deployments → Redeploy

### 3. **Backend CORS Configuration (Railway)**
   - Go to Railway → Your Project → Variables
   - Check `FRONTEND_URL`
   - Should be: `https://your-vercel-url.vercel.app` (NO trailing slash!)
   - Must match your Vercel URL exactly

### 4. **Backend Environment Variables (Railway)**
   Make sure ALL these are set in Railway → Variables:
   ```
   MONGO_URI=mongodb+srv://demouser04022003_db_user:TBT9A8dMFbmuEAE4@cluster0.wrtbj8l.mongodb.net/
   PORT=8000
   SECRET_KEY=PRD3wX1HV0K2WpmqhSzGgyadrLCYJMQA
   CLOUD_NAME=dkyz88h25
   API_KEY=487511911248298
   API_SECRET=75VbQFIREYENdLHZF2rJVHwR1aA
   FRONTEND_URL=https://your-vercel-url.vercel.app
   NODE_ENV=production
   ```

### 5. **Railway Deployment Status**
   - Go to Railway → Deployments
   - Check if latest deployment is ✅ successful
   - Click on deployment → View logs
   - Should see: "Server running at port 8000" or similar
   - Should see: "MongoDB connected successfully"

### 6. **Check Backend Logs**
   - Railway → Deployments → Click latest → View logs
   - Look for errors
   - Should NOT see: "MongoDB connection error"
   - Should NOT see: "Port already in use"
   - Should see: "Server running at port..."

---

## 🧪 Test Your Backend

### Test 1: Check if Backend is Running
Open in browser: `https://your-railway-url.railway.app/api/v1/job/get`

**Expected:**
- JSON response (even if empty)
- Or error message (not 404 or connection refused)

**If you get:**
- ❌ 404 Not Found → Check Railway domain is correct
- ❌ Connection refused → Backend not running (check logs)
- ❌ CORS error → CORS config issue
- ✅ JSON response → Backend is working! ✅

### Test 2: Check CORS
Open browser console (F12) on your Vercel site → Network tab → Try to login/signup

**Look for:**
- CORS errors in console
- Failed requests to Railway URL

---

## 🔍 Common Issues & Fixes

### Issue 1: "Network Error" or "Failed to fetch"
**Fix:**
- Check Railway URL is correct in `VITE_API_BASE_URL`
- Make sure Railway URL starts with `https://`
- No trailing slash: `https://app.railway.app` ✅ (NOT `https://app.railway.app/` ❌)

### Issue 2: CORS Error in Browser
**Fix:**
- Check `FRONTEND_URL` in Railway matches your Vercel URL exactly
- No trailing slashes
- Must be HTTPS (not HTTP)
- Redeploy Railway after changing `FRONTEND_URL`

### Issue 3: Backend Shows "Online" but Returns 404
**Fix:**
- Check Railway domain is correct
- Check Root Directory is set to `backend` in Railway Settings
- Check Start Command is `npm start`

### Issue 4: Backend Logs Show MongoDB Error
**Fix:**
- Check `MONGO_URI` in Railway Variables is correct
- Check MongoDB Atlas → Network Access → IP whitelist includes `0.0.0.0/0`

---

## 📋 Quick Checklist

- [ ] Railway backend is showing ✅ Online
- [ ] Railway domain URL copied correctly
- [ ] `VITE_API_BASE_URL` in Vercel = Railway URL (no trailing slash)
- [ ] `FRONTEND_URL` in Railway = Vercel URL (no trailing slash)
- [ ] All environment variables set in Railway
- [ ] Backend logs show "Server running at port..."
- [ ] Backend logs show "MongoDB connected successfully"
- [ ] Tested Railway URL in browser (shows response, not 404)
- [ ] Redeployed Vercel after updating `VITE_API_BASE_URL`
- [ ] Redeployed Railway after updating `FRONTEND_URL`

---

## 🆘 Still Not Working?

Share these details:
1. Your Railway URL: `https://...`
2. Your Vercel URL: `https://...`
3. What error you see in browser console (F12)
4. Backend logs from Railway (last 20 lines)
5. Screenshot of Railway Variables tab

