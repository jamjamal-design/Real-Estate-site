# Deployment Guide for ZAJHAB Estates

## Prerequisites
- Vercel account (https://vercel.com)
- MongoDB Atlas database (already set up)
- GitHub/GitLab repository (recommended)

## Step 1: Deploy Backend to Vercel

1. Navigate to the `backend` folder
2. Install Vercel CLI (if not installed):
   ```bash
   npm install -g vercel
   ```

3. Login to Vercel:
   ```bash
   vercel login
   ```.

4. Deploy backend:
   ```bash
   cd backend
   vercel
   ```

5. Set environment variables in Vercel dashboard:
   - Go to your project settings on Vercel
   - Navigate to "Environment Variables".
   - Add the following:
     - `MONGODB_URI`: Your MongoDB Atlas connection string
     - `ADMIN_TOKEN`: Adesinar12345.
     - `NODE_ENV`: production

6. Note your backend URL (e.g., https://your-backend.vercel.app)

## Step 2: Deploy Frontend to Vercel

1. Update `.env.production` in the client folder:
   ```
   NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
   ```

2. Deploy frontend:
   ```bash
   cd client
   vercel
   ```

3. Set environment variable in Vercel dashboard:
   - `NEXT_PUBLIC_API_URL`: https://your-backend-url.vercel.app/api

## Step 3: Configure CORS

The backend is already configured to accept requests from any origin with CORS enabled.
If you need to restrict it, update `backend/server.js`:

```javascript
app.use(cors({
  origin: ['https://your-frontend-url.vercel.app'],
  credentials: true
}));
```

## Step 4: Verify Deployment

1. Visit your frontend URL
2. Test the following:
   - Homepage loads with properties
   - Properties page displays listings
   - Contact form submission works
   - Admin login works (use token: Adesinar12345.)
   - Admin dashboard shows properties, bookings, projects

## Environment Variables Summary

### Backend (.env)
```
MONGODB_URI=your_mongodb_connection_string
ADMIN_TOKEN=Adesinar12345.
PORT=5000
NODE_ENV=production
```

### Frontend (.env.production)
```
NEXT_PUBLIC_API_URL=https://your-backend-url.vercel.app/api
```

## Alternative: Deploy via Vercel Dashboard

1. Push your code to GitHub/GitLab
2. Go to https://vercel.com/new
3. Import your repository
4. For backend:
   - Root directory: `backend`
   - Add environment variables
5. For frontend:
   - Root directory: `client`
   - Add environment variables
6. Click "Deploy"

## Troubleshooting

### Backend Issues
- Verify MongoDB connection string is correct
- Check Vercel function logs for errors
- Ensure all environment variables are set

### Frontend Issues
- Verify NEXT_PUBLIC_API_URL points to deployed backend
- Check browser console for CORS errors
- Ensure backend is deployed and running

### Admin Login Issues
- Verify ADMIN_TOKEN matches in both backend .env and frontend usage
- Check browser network tab for 401/403 errors

## Post-Deployment

1. Update admin token for security:
   - Generate a new secure token
   - Update ADMIN_TOKEN in backend environment variables
   - Redeploy backend

2. Configure custom domain (optional):
   - Go to Vercel project settings
   - Add custom domain
   - Update DNS records

3. Monitor usage:
   - Check Vercel dashboard for function invocations
   - Monitor MongoDB Atlas for database usage

## Support

For issues, check:
- Vercel logs: Project > Deployments > Click deployment > Logs
- MongoDB Atlas logs
- Browser console and network tab
