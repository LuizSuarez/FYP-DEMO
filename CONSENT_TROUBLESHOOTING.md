# Consent 500 Error Troubleshooting Guide

## Issue
User encounters a 500 Internal Server Error when trying to sign consent via the `/api/consents/sign` endpoint.

## Recent Fixes Applied

### 1. Frontend Improvements
- ✅ Added better error handling in `consentService.js`
- ✅ Added proper loading states and error display in `Upload.jsx`
- ✅ Fixed `consentContext.jsx` to store correct `consentId` instead of MongoDB `_id`
- ✅ Added token validation before making requests

### 2. Backend Improvements
- ✅ Added detailed logging to consent route
- ✅ Added user ID validation and ObjectId format checking
- ✅ Added check for existing consents to prevent duplicates
- ✅ Enhanced error responses with development-friendly messages

## Debugging Steps

### Step 1: Check Backend Server
```bash
cd backend
npm start
```
Look for:
- "MongoDB Connected Successfully" message
- Server running on port 5000 message
- No initial connection errors

### Step 2: Verify Environment Variables
Check `backend/.env`:
```
MONGO_URI=mongodb://localhost:27017/your-db-name
JWT_SECRET=your-secret-key
NODE_ENV=development
PORT=5000
```

### Step 3: Test Database Connection
```bash
cd backend
node test-consent.js
```
This will test:
- MongoDB connection
- Consent model creation
- JWT token validation

### Step 4: Check Frontend Token
Open browser dev tools → Application → Local Storage:
- Verify `token` exists and is not expired
- Verify user is logged in properly

### Step 5: Monitor Backend Logs
When attempting to sign consent, check backend console for:
```
=== CONSENT SIGN REQUEST ===
Request user: { "id": "...", "role": "User" }
✅ User ID is valid ObjectId: ...
🔍 Checking for existing consent for userId: ...
```

## Common Issues and Solutions

### Issue: Invalid ObjectId
**Error**: `Invalid user ID format`
**Solution**: User ID in JWT token is not a valid MongoDB ObjectId
- Check how JWT is signed in `authController.js`
- Ensure `user._id` is properly converted

### Issue: Missing Token
**Error**: `No authentication token found`
**Solution**: 
- User needs to log in again
- Check if token is properly stored in localStorage

### Issue: Database Connection
**Error**: MongoDB connection failed
**Solution**:
- Ensure MongoDB is running locally or connection string is correct
- Check firewall/network settings

### Issue: Mongoose Validation
**Error**: Validation failed for Consent model
**Solution**:
- Check required fields in `Consent.js` model
- Ensure all required fields are provided

## Testing the Fix

1. **Start Backend**: `cd backend && npm start`
2. **Start Frontend**: `cd frontend && npm start`
3. **Test Flow**:
   - Log in as a user
   - Go to Upload page
   - Try to upload a file (should prompt for consent)
   - Click "Sign Consent"
   - Check browser network tab for response
   - Check backend console for detailed logs

## Expected Success Flow

### Frontend Console:
```
[consentService] Signing consent with token: present
[consentService] Consent signed successfully: { consent: { consentId: "uuid-..." } }
[consentService] Stored consentId: uuid-...
```

### Backend Console:
```
=== CONSENT SIGN REQUEST ===
✅ User ID is valid ObjectId: 507f1f77bcf86cd799439011
🔍 Checking for existing consent for userId: 507f1f77bcf86cd799439011
🆕 Creating new consent...
✅ Consent saved successfully with _id: 67f1f77bcf86cd799439012
```

## Still Having Issues?

1. Check MongoDB is running: `mongod --version`
2. Verify port 5000 is not in use: `lsof -i :5000` (Mac/Linux) or `netstat -an | find "5000"` (Windows)
3. Clear browser localStorage and log in fresh
4. Check for any CORS issues in browser console
5. Ensure all npm packages are installed: `npm install` in both directories

## Next Steps After Fix

Once consent signing works:
1. Test genome file upload flow
2. Verify consent persistence across sessions  
3. Test consent revocation (if implemented)
4. Add integration tests for consent flow
