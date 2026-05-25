# Troubleshooting: Companies Not Persisting

## Problem
When you add a company, it shows temporarily but disappears after page refresh.

## Root Cause
Companies are only stored in React state (memory). When page refreshes, data is lost unless it was saved to MongoDB.

## Solutions

### Step 1: Check Backend Server
Run the backend and look for these messages:

```bash
cd backend
npm start
```

**Expected Output:**
```
✅ Successfully connected to MongoDB Database
✅ Server is running on port 5000
✨ Ready to receive requests!
```

**If you see this instead:**
```
❌ ERROR: MONGO_URI environment variable is not set!
```

Then:
- Make sure `backend/.env` has the correct `MONGO_URI`
- Format: `mongodb+srv://username:password@cluster.mongodb.net/company_reviews`

### Step 2: Check MongoDB Atlas

1. Go to [MongoDB Atlas](https://www.mongodb.com/cloud/atlas)
2. Click your cluster
3. Go to **Network Access** tab
4. Make sure your current IP is whitelisted
   - Or add `0.0.0.0/0` to allow all IPs

### Step 3: Verify Database Connectivity

Test locally if data is actually being saved:

1. Start backend: `npm start` (from backend folder)
2. Open Postman or use `curl`
3. Make a POST request:

```bash
curl -X POST http://localhost:5000/api/companies \
  -H "Content-Type: application/json" \
  -d '{
    "name": "Test Company",
    "logoUrl": "https://example.com/logo.png",
    "description": "Test description for company",
    "location": "New York",
    "city": "New York",
    "foundedOn": 2020
  }'
```

Expected response:
```json
{
  "_id": "...",
  "name": "Test Company",
  "reviewCount": 0,
  "averageRating": 0
}
```

4. Then fetch all companies:

```bash
curl http://localhost:5000/api/companies
```

Should see the company in the list.

### Step 4: Check Console Logs

In browser console when adding company:
- ✅ Look for: `Company successfully registered!`
- ❌ Look for any error messages
- Check Network tab for API responses

### Common Issues

| Issue | Solution |
|-------|----------|
| 500 error when adding company | Check backend logs for validation errors |
| ECONNREFUSED on backend | MongoDB connection issue - check MONGO_URI |
| Empty response from POST | Backend might be rejecting the data - verify all fields are provided |
| Cannot read properties of undefined | Frontend not handling missing properties - fixed in latest update |

### Local Testing Checklist

- [ ] Backend `.env` has correct `MONGO_URI`
- [ ] Backend server starts without errors
- [ ] Can reach `http://localhost:5000/health` 
- [ ] Can POST a company and get response
- [ ] GET companies list shows the new company
- [ ] Page refresh shows company still there
- [ ] MongoDB Atlas cluster is running

### For Render Deployment

Make sure:
1. Backend MONGO_URI environment variable is set in Render dashboard
2. MongoDB Atlas IP whitelist includes Render's IPs
3. Backend is deployed successfully
4. Frontend has `VITE_API_BASE` pointing to Render backend URL

### Still Not Working?

1. Check backend logs on Render dashboard
2. Look for MongoDB connection errors
3. Verify Network tab in browser DevTools when adding company
4. Check if 201 status code is returned from POST request
