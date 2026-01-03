# Vercel Deployment Guide

This guide will help you deploy the Anonymous Wall application to Vercel.

## Prerequisites

1. A Vercel account (sign up at [vercel.com](https://vercel.com))
2. MongoDB Atlas account (or any MongoDB instance)
3. Vercel CLI installed (optional): `npm i -g vercel`

## Step 1: Prepare Environment Variables

You'll need to set the following environment variables in Vercel:

### Required Environment Variables

- `MONGODB_URI` - Your MongoDB connection string (e.g., `mongodb+srv://user:password@cluster.mongodb.net/anonymous-wall`)
- `JWT_SECRET` - A secure random string for JWT token signing (generate a strong secret)
- `NODE_ENV` - Set to `production`

### Optional Environment Variables

- `VITE_API_URL` - If you want to override the default API URL (usually not needed as it will use the same domain)

## Step 2: Deploy via Vercel Dashboard

1. **Push your code to GitHub/GitLab/Bitbucket**
   - Make sure all changes are committed and pushed

2. **Import Project in Vercel**
   - Go to [vercel.com/dashboard](https://vercel.com/dashboard)
   - Click "Add New Project"
   - Import your repository

3. **Configure Project Settings**
   - **Framework Preset**: Other (or leave as default)
   - **Root Directory**: Leave as default (root)
   - **Build Command**: `cd frontend && npm install && npm run build`
   - **Output Directory**: `frontend/dist`
   - **Install Command**: `npm install` (Vercel will handle this automatically)

4. **Add Environment Variables**
   - Go to Project Settings → Environment Variables
   - Add all required variables listed above
   - Make sure to add them for Production, Preview, and Development environments

5. **Deploy**
   - Click "Deploy"
   - Wait for the build to complete

## Step 3: Deploy via Vercel CLI (Alternative)

```bash
# Install Vercel CLI globally (if not already installed)
npm i -g vercel

# Navigate to project root
cd /path/to/anonly

# Login to Vercel
vercel login

# Deploy
vercel

# For production deployment
vercel --prod
```

## Step 4: Verify Deployment

1. **Check API Health**
   - Visit `https://your-project.vercel.app/api/health`
   - Should return `{"status":"ok"}`

2. **Test Frontend**
   - Visit `https://your-project.vercel.app`
   - The frontend should load and connect to the API

3. **Test API Endpoints**
   - Try creating a post via the frontend
   - Check if posts are being saved to MongoDB

## Step 5: Create Admin User

After deployment, you need to create an admin user. You can do this by:

1. **Using MongoDB Atlas/Compass**
   - Connect to your MongoDB instance
   - Run the admin creation script locally (pointing to production DB) or manually create an admin user

2. **Manual Creation via MongoDB**
   ```javascript
   // In MongoDB shell or Compass
   use anonymous-wall
   db.admins.insertOne({
     username: "admin",
     password: "$2a$10$..." // hashed password using bcrypt
   })
   ```

3. **Using the createAdmin script locally**
   - Set `MONGODB_URI` in your local `.env` to point to production database
   - Run: `cd backend && node scripts/createAdmin.js`

## Project Structure for Vercel

```
anonly/
├── api/                    # Serverless API functions
│   ├── index.js           # Main API handler
│   ├── db.js              # MongoDB connection (serverless-optimized)
│   ├── models/            # Mongoose models
│   ├── middleware/        # Auth & rate limiting
│   ├── posts.js           # Posts routes
│   ├── tags.js            # Tags routes
│   ├── admin.js           # Admin routes
│   └── reactions.js       # Reactions routes
├── frontend/              # React frontend
│   ├── src/
│   ├── dist/              # Build output (generated)
│   └── package.json
├── backend/               # Original backend (for local dev)
├── vercel.json            # Vercel configuration
└── package.json           # Root package.json
```

## Important Notes

1. **MongoDB Connection**: The `api/db.js` file uses connection caching optimized for serverless functions. This prevents connection issues in Vercel's serverless environment.

2. **API Routes**: All API routes are accessible at `/api/*` and are handled by the serverless function in `api/index.js`.

3. **Frontend Build**: The frontend is built as a static site and served by Vercel. The API calls will automatically use the same domain.

4. **Rate Limiting**: Rate limiting uses in-memory storage, which works per serverless function instance. For production, consider using Redis or a database-backed rate limiter.

5. **CORS**: CORS is configured to allow requests from the same origin. If you need to allow other origins, update `api/index.js`.

## Troubleshooting

### API Returns 500 Errors
- Check MongoDB connection string in environment variables
- Verify MongoDB Atlas IP whitelist includes Vercel IPs (or use 0.0.0.0/0 for development)
- Check Vercel function logs in the dashboard

### Frontend Can't Connect to API
- Verify `VITE_API_URL` is not set (or set to `/api` for same-origin)
- Check browser console for CORS errors
- Ensure API routes are working via direct API calls

### Build Fails
- Check that all dependencies are in `package.json`
- Verify Node.js version compatibility
- Check build logs in Vercel dashboard

### MongoDB Connection Issues
- Ensure MongoDB Atlas cluster is running
- Check network access settings in MongoDB Atlas
- Verify connection string format

## Custom Domain

To use a custom domain:

1. Go to Project Settings → Domains
2. Add your custom domain
3. Follow DNS configuration instructions
4. SSL certificates are automatically provisioned by Vercel

## Monitoring

- **Function Logs**: Available in Vercel Dashboard → Project → Functions
- **Analytics**: Available in Vercel Dashboard → Project → Analytics
- **Real-time Logs**: Use `vercel logs` CLI command

## Updating Deployment

Simply push changes to your repository, and Vercel will automatically redeploy:

```bash
git add .
git commit -m "Update application"
git push
```

Vercel will create a preview deployment for each push and deploy to production when you merge to your main branch (if configured).

