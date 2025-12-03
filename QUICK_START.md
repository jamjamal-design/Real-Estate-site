# ZAJHAB Estates - Quick Start Guide

## ✅ Current Status

### Backend (Port 5000)
- **Status**: Running ✓
- **Database**: MongoDB Atlas connected
- **Properties**: 5 sample properties loaded
- **Admin Token**: `Adesinar12345.`

### Frontend (Port 3000)
- **Status**: Should be running
- **Features**: All pages operational

## 🚀 Starting the Application

### Backend Server
```bash
cd "/home/jamal/Desktop/Real-Estate site/backend"
node server.js &
# Or with auto-restart:
npm run dev
```

### Frontend Client
```bash
cd "/home/jamal/Desktop/Real-Estate site/client"
npm run dev
```

## 🔐 Admin Access

### Login Credentials
- **URL**: http://localhost:3000/admin
- **Admin Token**: `Adesinar12345.`

### Security Features
✅ Token validation on login
✅ Token verification on page load
✅ Auto-logout on invalid token
✅ 401/403 error handling

## 📊 Sample Data

The database now contains 5 properties:
1. **Green Valley Estate** - Land, Epe (₦4.5M)
2. **Lekki Gardens Phase 3** - House, Lekki (₦8.5M)
3. **Ibeju-Lekki Commercial Hub** - Land, Ibeju-Lekki (₦12M)
4. **Sunrise Farmland** - Farm, Ikorodu (₦6.2M)
5. **Victoria Island Luxury Plot** - House, VI (₦25M) - SOLD

## 🧪 Testing

### Test Endpoints
```bash
# Health check
curl http://localhost:5000/

# Get properties (public)
curl http://localhost:5000/api/properties

# Get bookings (requires admin token)
curl -H "x-admin-token: Adesinar12345." http://localhost:5000/api/bookings

# Test wrong token (should return 403)
curl -H "x-admin-token: WRONG" http://localhost:5000/api/bookings
```

### Test Admin Login
1. Go to http://localhost:3000/admin
2. Try wrong token: `WRONG_TOKEN` → Should show "Invalid admin token"
3. Use correct token: `Adesinar12345.` → Should grant access
4. Refresh page → Should stay logged in
5. Clear localStorage → Should require login again

## 📱 Features Available

### Public Pages
- **Home** (`/`) - Hero, featured properties, services
- **Properties** (`/properties`) - Browse and filter listings
- **Projects** (`/projects`) - View completed projects
- **Contact** (`/contact`) - Book consultation/site inspection

### Admin Dashboard (`/admin`)
- **Dashboard** - Overview stats and recent activity
- **Properties** - Add, edit, delete properties
- **Bookings** - View, update status, delete bookings
- **Notifications** - Real-time SSE notifications

### Real-time Notifications
When logged in as admin, you'll receive instant notifications for:
- New bookings from contact form
- Booking status changes

## 🔄 Resetting Data

### Re-seed Properties
```bash
cd "/home/jamal/Desktop/Real-Estate site/backend"
node seed-properties.js
```

### Clear All Data
```bash
# Connect to MongoDB and drop collections
# (Use MongoDB Compass or Atlas web interface)
```

## 🐛 Troubleshooting

### "Network Error" on frontend
- **Cause**: Backend not running
- **Fix**: Start backend server (see above)

### "Invalid admin token"
- **Cause**: Wrong token or backend token changed
- **Fix**: Use token from `backend/.env` → `ADMIN_TOKEN`

### No properties showing
- **Cause**: Database empty
- **Fix**: Run `node seed-properties.js`

### Port already in use
```bash
# Kill process on port 5000
lsof -ti:5000 | xargs kill -9

# Kill process on port 3000
lsof -ti:3000 | xargs kill -9
```

## 📝 Important Notes

1. **Admin token must match** between:
   - `backend/.env` → `ADMIN_TOKEN`
   - Admin login form input

2. **Property types** must be one of:
   - `Land`
   - `Farm`
   - `House`

3. **Booking status** can be:
   - `Pending` (default)
   - `Completed`

4. **Backend must be running** before frontend for API calls to work

## 🎯 Next Steps

- Add more properties via admin dashboard
- Test booking submission from contact page
- Monitor real-time notifications
- Customize branding (already changed to "ZAJHAB Estates")
- Add your actual contact information in Footer/Contact page

---

**Current Date**: December 3, 2025
**Backend Status**: ✓ Running (PID: check with `ps aux | grep "node server.js"`)
**Database**: ✓ Connected to MongoDB Atlas
