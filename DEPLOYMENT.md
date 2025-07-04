# 🚀 GitHub Repository Setup Instructions

## 📋 Ready for GitHub and Render Deployment!

Your fake news detection system is now ready to be pushed to GitHub and deployed to Render.

## 🔧 Steps to Create GitHub Repository:

### 1. Create Repository on GitHub
1. Go to [GitHub.com](https://github.com)
2. Click **"New Repository"** (green button)
3. Repository name: `fake-news-detection-system`
4. Description: `AI-powered fake news detection with React, Express.js, and Python Flask`
5. Set to **Public** (so Render can access it)
6. **DO NOT** initialize with README (we already have one)
7. Click **"Create Repository"**

### 2. Connect Local Repository to GitHub
Copy and paste these commands in your terminal:

```bash
# Add the GitHub repository as remote origin
git remote add origin https://github.com/Thejas027/fake-news-detection-system.git

# Push to GitHub
git branch -M main
git push -u origin main
```

## 🌐 Deploy ML Service to Render:

### 3. Deploy to Render
1. Go to [Render.com](https://render.com)
2. Sign up/Login with your GitHub account
3. Click **"New +"** → **"Web Service"**
4. Connect your GitHub repository: `fake-news-detection-system`
5. **Important Settings:**
   - **Root Directory**: `services`
   - **Runtime**: `Python 3`
   - **Build Command**: `pip install -r requirements.txt`
   - **Start Command**: `gunicorn app:app`
   - **Instance Type**: `Free` (for testing)

### 4. Update Backend to Use Render ML Service
Once deployed on Render, you'll get a URL like: `https://your-app-name.onrender.com`

Update the Express server's `.env` file:
```
ML_SERVICE_URL=https://your-app-name.onrender.com
```

## 📂 Current Repository Structure:
```
fake-news-detection-system/
├── 📱 client/          # React frontend
├── 🔧 server/          # Express.js backend
├── 🤖 services/        # Python ML service (for Render)
├── 📝 example.txt      # Test examples
├── 🧪 test-api.sh      # Testing script
├── 📋 README.md        # Documentation
├── ✅ STATUS.md        # System status
└── 🔒 .gitignore       # Git ignore rules
```

## 🎯 After Deployment:

1. **Frontend**: Deploy to Vercel/Netlify (optional)
2. **Backend**: Deploy to Heroku/Railway (optional)
3. **ML Service**: Already on Render ✅
4. **Test Everything**: Use the examples in `example.txt`

## 📊 Expected URLs:
- **Local Frontend**: http://localhost:3002
- **Local Backend**: http://localhost:5000
- **Render ML Service**: https://your-app-name.onrender.com
- **GitHub Repo**: https://github.com/Thejas027/fake-news-detection-system

---

🎉 **Your complete fake news detection system is ready for the world!**
