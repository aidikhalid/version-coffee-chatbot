# Deployment Guide

This guide covers deploying the AI Chat Type application with:

- **Frontend:** Cloudflare Pages
- **Backend:** Render
- **Database:** MongoDB Atlas

## Prerequisites

- GitHub account
- Cloudflare account
- Render account
- MongoDB Atlas account (free tier)

---

## 1. Database Setup (MongoDB Atlas)

### Create MongoDB Cluster

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Create a free cluster
3. Create a database user with password
4. Whitelist all IPs: `0.0.0.0/0` (for Render access)
5. Get your connection string:
   ```
   mongodb+srv://<username>:<password>@cluster0.xxxxx.mongodb.net/ai-chat-type?retryWrites=true&w=majority
   ```

---

## 2. Backend Deployment (Render)

### Option A: Deploy via Dashboard

1. Go to [Render Dashboard](https://dashboard.render.com/)
2. Click **New +** → **Web Service**
3. Connect your GitHub repository
4. Configure:
   - **Name:** `ai-chat-type-backend`
   - **Region:** Choose closest to your users
   - **Branch:** `main`
   - **Root Directory:** `backend`
   - **Runtime:** `Node`
   - **Build Command:** `npm install && npm run build`
   - **Start Command:** `npm start`
   - **Plan:** Free

5. Add Environment Variables:

   ```
   NODE_ENV=production
   PORT=3000
   MONGODB_URL=<your-mongodb-connection-string>
   JWT_SECRET=<generate-random-string>
   COOKIE_SECRET=<generate-random-string>
   OPENAI_API_KEY=<your-openai-key>
   OPENAI_PROJECT_ID=<your-openai-project-id> (optional)
   ARCJET_KEY=<your-arcjet-key>
   CLIENT_URL=<your-cloudflare-pages-url>
   ```

6. Click **Deploy Web Service**

### Option B: Deploy via render.yaml

1. Push the `render.yaml` file (or edit region first if you wish) to your repository
2. In Render Dashboard, click **New +** → **Blueprint**
3. Connect your repository
4. Render will auto-detect the `render.yaml` and create the service
5. Add the environment variables manually in the dashboard

### Get Your Backend URL

After deployment, Render will provide a URL like:

```
https://ai-chat-type-backend.onrender.com
```

**Important:** Copy this URL for the frontend configuration.

---

## 3. Frontend Deployment (Cloudflare Pages)

### Deploy to Cloudflare Pages

1. Go to [Cloudflare Dashboard](https://dash.cloudflare.com/)
2. Navigate to **Workers & Pages** → **Create application** → **Looking to deploy Pages? Get started**
3. Connect your GitHub repository
4. Configure:
   - **Project name:** `ai-chat-type`
   - **Production branch:** `main`
   - **Framework preset:** `React (Vite)`
   - **Build command:** `npm run build`
   - **Build output directory:** `dist`
   - **Root directory:** `frontend`

5. Add Environment Variable:
   - **Variable name:** `VITE_API_URL`
   - **Value:** `https://ai-chat-type-backend.onrender.com/api/v1`
     (Replace with your actual Render backend URL)

6. Click **Save and Deploy**

### Get Your Frontend URL

Cloudflare will provide a URL like:

```
https://ai-chat-type.pages.dev
```

---

## 4. Update Backend CORS

After getting your Cloudflare Pages URL, update the backend environment variable:

1. Go to Render Dashboard → Your Web Service
2. Navigate to **Environment**
3. Update `CLIENT_URL`:
   ```
   CLIENT_URL=https://ai-chat-type.pages.dev
   ```
4. Click **Save Changes** (this will trigger a redeploy)

---

## 5. Testing

### Test the Deployment

1. Visit your Cloudflare Pages URL
2. Sign up for a new account
3. Send a chat message
4. Verify streaming works correctly

### Common Issues

**CORS Errors:**

- Ensure `CLIENT_URL` in backend matches your Cloudflare Pages URL exactly
- Check that credentials are enabled in CORS config

**Streaming Not Working:**

- Render free tier may have cold starts (first request takes ~30s)
- Check Render logs for errors

**Database Connection Issues:**

- Verify MongoDB Atlas allows connections from `0.0.0.0/0`
- Check connection string format

---

## 6. Custom Domain (Optional)

### Cloudflare Pages Custom Domain

1. In Cloudflare Pages project settings
2. Go to **Custom domains**
3. Add your domain (e.g., `chat.yourdomain.com`)
4. Follow DNS configuration instructions

### Update Backend CORS

After adding custom domain, update `CLIENT_URL`:

```
CLIENT_URL=https://chat.yourdomain.com
```

---

## 7. Environment Variables Reference

### Backend (Render)

| Variable            | Description                  | Example                          |
| ------------------- | ---------------------------- | -------------------------------- |
| `NODE_ENV`          | Environment mode             | `production`                     |
| `PORT`              | Server port                  | `3000`                           |
| `MONGODB_URL`       | MongoDB connection string    | `mongodb+srv://...`              |
| `JWT_SECRET`        | JWT signing secret           | Random 32+ char string           |
| `COOKIE_SECRET`     | Cookie signing secret        | Random 32+ char string           |
| `OPENAI_API_KEY`    | OpenAI API key               | `sk-proj-...`                    |
| `OPENAI_PROJECT_ID` | OpenAI project ID (optional) | `proj_...`                       |
| `ARCJET_KEY`        | Arcjet security key          | `ajkey_...`                      |
| `CLIENT_URL`        | Frontend URL                 | `https://ai-chat-type.pages.dev` |

### Frontend (Cloudflare Pages)

| Variable       | Description     | Example                                            |
| -------------- | --------------- | -------------------------------------------------- |
| `VITE_API_URL` | Backend API URL | `https://ai-chat-type-backend.onrender.com/api/v1` |

---

## 8. Monitoring & Maintenance

### Render

- **Logs:** Available in Render Dashboard → Your Service → Logs
- **Metrics:** CPU, Memory, Request count
- **Free Tier:** Service spins down after 15 min inactivity (cold starts)

### Cloudflare Pages

- **Analytics:** Available in Pages project dashboard
- **Build logs:** Check deployment history
- **Unlimited bandwidth** on free tier

### MongoDB Atlas

- **Monitoring:** Database metrics in Atlas dashboard
- **Free Tier:** 512MB storage limit

---

## 9. Costs

### Free Tier Limits

- **Cloudflare Pages:** Unlimited bandwidth, 500 builds/month
- **Render:** 750 hours/month (enough for 1 service 24/7)
- **MongoDB Atlas:** 512MB storage, shared cluster

### Paid Upgrades (Optional)

- **Render:** $7/month for always-on service (no cold starts)
- **MongoDB Atlas:** $9/month for dedicated cluster
- **Cloudflare Pages:** Free tier is usually sufficient

---

## 10. Security Checklist

- ✅ All environment variables are set correctly
- ✅ MongoDB allows only necessary IP ranges
- ✅ JWT and Cookie secrets are strong random strings
- ✅ CORS is configured to allow only your frontend domain
- ✅ Database reset endpoint is disabled in production (`NODE_ENV=production`)
- ✅ HTTPS is enabled (automatic on Cloudflare and Render)
- ✅ Arcjet rate limiting is active

---

## Support

For issues:

- **Backend logs:** Check Render Dashboard
- **Frontend logs:** Check browser console
- **Database:** Check MongoDB Atlas logs
- **GitHub Issues:** Report bugs in the repository

---

## Quick Deploy Commands

```bash
# Commit and push changes
git add .
git commit -m "Prepare for deployment"
git push origin main

# Both Cloudflare Pages and Render will auto-deploy from GitHub
```

That's it! Your app should now be live. 🚀
