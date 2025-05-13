# MindEase Google Authentication Integration

This project integrates Google Authentication between the MindEase frontend and backend.

## Setup Instructions

### Frontend Setup

1. The frontend is already configured with Firebase Authentication.
2. Google Authentication has been added to the login page.

### Backend Setup

1. Install the required dependencies:
   ```
   cd Backend/emotion-backend_new
   npm install
   ```

2. Set up Firebase Admin SDK:
   - Go to the Firebase Console: https://console.firebase.google.com/
   - Select your project (authentication-4e3bb)
   - Go to Project Settings > Service Accounts
   - Click "Generate new private key"
   - Save the JSON file and replace the content in `Backend/emotion-backend_new/config/serviceAccountKey.json`

3. Create a `.env` file in the `Backend/emotion-backend_new` directory with the following content:
   ```
   MONGO_URI=your_mongodb_connection_string
   PORT=5000
   ```

4. Start the backend server:
   ```
   npm run dev
   ```

### How It Works

1. **Frontend Authentication**:
   - Users can sign in with Google using the Google button on the login page
   - After successful authentication, the Firebase ID token is stored in localStorage
   - This token is sent with API requests to the backend

2. **Backend Authentication**:
   - The backend verifies the Firebase ID token using the Firebase Admin SDK
   - If valid, the user information is extracted and attached to the request object
   - Protected routes use the `verifyToken` middleware to ensure authentication

3. **API Communication**:
   - The `api.js` utility handles authenticated API requests
   - It automatically adds the authentication token to requests
   - Error handling is built in

## Testing the Integration

1. Start both the frontend and backend servers
2. Open the login page and click the Google sign-in button
3. After successful authentication, you should be redirected to the dashboard
4. The backend will now recognize your authenticated requests

## Troubleshooting

- If you encounter CORS issues, make sure the backend CORS configuration is correct
- If token verification fails, check that your Firebase Admin SDK is properly configured
- For Google sign-in issues, ensure your Firebase project has Google Authentication enabled
