# Supabase Authentication Setup Guide

## 1. Create a Supabase Project

1. Go to [supabase.com](https://supabase.com)
2. Sign up or log in
3. Create a new project
4. Choose a project name and database password
5. Wait for the project to be provisioned (takes a few minutes)

## 2. Get Your Credentials

Once your project is ready:
1. Go to **Settings** → **API** in your Supabase dashboard
2. Copy your **Project URL** and **Anon Public Key**
3. Paste them in `.env.local`:
   ```
   VITE_SUPABASE_URL=your_project_url
   VITE_SUPABASE_ANON_KEY=your_anon_key
   ```

## 3. Enable Google Authentication

1. In Supabase dashboard, go to **Authentication** → **Providers**
2. Find and click on **Google**
3. Enable the provider
4. You'll need to set up Google OAuth credentials:

### Setting up Google OAuth:
1. Go to [Google Cloud Console](https://console.cloud.google.com/)
2. Create a new project
3. Enable the "Google+ API"
4. Go to **Credentials** → **Create Credentials** → **OAuth 2.0 Client ID**
5. Choose **Web application**
6. Add authorized redirect URIs:
   ```
   https://[your-supabase-project].supabase.co/auth/v1/callback
   http://localhost:5173/auth/v1/callback (for local development)
   ```
7. Copy your **Client ID** and **Client Secret**
8. Go back to Supabase → Authentication → Google provider
9. Paste the Client ID and Client Secret

## 4. Configure Redirect URL (Important!)

In your Supabase project:
1. Go to **Authentication** → **URL Configuration**
2. Add your app URLs under "Redirect URLs":
   ```
   http://localhost:5173/dashboard
   http://localhost:5173/auth/v1/callback
   https://yourdomain.com/dashboard
   https://yourdomain.com/auth/v1/callback
   ```

## 5. Install Dependencies

All required packages are already installed, but if needed:
```bash
npm install @supabase/supabase-js
```

## 6. How It Works

### Authentication Context (`src/context/AuthContext.jsx`)
- Manages user state globally
- Provides methods: `signInWithGoogle`, `signUp`, `signIn`, `signOut`
- Automatically checks for existing sessions on app load

### Login Component (`src/pages/auth/Login.jsx`)
- Email/password login
- Google OAuth login
- Redirects to dashboard on success

### Signup Component (`src/pages/auth/SIgnup.jsx`)
- Email/password registration
- Google OAuth signup
- Stores user data with email/password

## 7. Using Auth in Components

```jsx
import { useAuth } from '../context/AuthContext'

function MyComponent() {
  const { user, loading, error, signOut } = useAuth()

  if (loading) return <div>Loading...</div>
  
  return (
    <div>
      {user && <p>Welcome, {user.email}</p>}
      <button onClick={signOut}>Sign Out</button>
    </div>
  )
}
```

## 8. Protecting Routes

You can add route protection to only allow authenticated users:

```jsx
import { useAuth } from '../context/AuthContext'
import { Navigate } from 'react-router-dom'

function ProtectedRoute({ children }) {
  const { user, loading } = useAuth()

  if (loading) return <div>Loading...</div>
  if (!user) return <Navigate to="/" replace />
  
  return children
}

// In AppRoutes.jsx:
// <Route path='/dashboard' element={<ProtectedRoute><Dashboard /></ProtectedRoute>} />
```

## Troubleshooting

**Issue: "Missing Supabase credentials"**
- Make sure `.env.local` has the correct URL and key

**Issue: Google redirect not working**
- Verify redirect URLs are configured in both Google Console and Supabase
- Check that the redirect URL in signInWithGoogle matches your configuration

**Issue: User session not persisting**
- Check browser console for errors
- Verify you're using AuthProvider at the app root

## Files Created

- `src/lib/supabase.js` - Supabase client configuration
- `src/context/AuthContext.jsx` - Authentication context and hooks
- `.env.local` - Environment variables (add your credentials here)
