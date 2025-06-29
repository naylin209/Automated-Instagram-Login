# CPSHub.ai Setup Instructions

## Prerequisites
- Node.js 18+ installed
- Supabase account (free tier)
- Groq API key (optional, for AI features)

## Setup Steps

### 1. Environment Variables
Create a `.env.local` file in the root directory with the following variables:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq API Configuration (optional)
GROQ_API_KEY=your_groq_api_key
```

### 2. Supabase Setup

1. Go to [Supabase Dashboard](https://supabase.com/dashboard)
2. Create a new project called "cpshub.ai"
3. Once created, go to Settings > API
4. Copy the "Project URL" and "anon public" key
5. Paste them in your `.env.local` file

### 3. Groq API Setup (Optional)

1. Go to [Groq Console](https://console.groq.com/)
2. Create an account and get your API key
3. Add it to your `.env.local` file

### 4. Install Dependencies

```bash
npm install
```

### 5. Run the Development Server

```bash
npm run dev
```

The app will be available at `http://localhost:3000`

## Features Implemented

✅ **Authentication System**
- Supabase authentication
- Login/Signup pages
- Protected routes
- User context management

✅ **Chat Interface**
- AI-powered chat with Groq API
- Message history persistence
- Chat suggestions
- Real-time typing indicators

✅ **Navigation & Layout**
- Responsive sidebar navigation
- User menu with sign-out
- Chat history in sidebar
- Settings and admin pages

✅ **Pages Created**
- Welcome/Landing page
- Login page
- Signup page
- Dashboard page
- Chat page (with dynamic routing)
- Settings page
- Saved Chats page
- Admin Dashboard page

## Current Status

The app is now functional with:
- Complete authentication flow
- Working chat interface
- Proper routing between pages
- User session management
- Chat history persistence

## Next Steps

1. **Set up your environment variables** using the instructions above
2. **Test the authentication** by creating an account
3. **Test the chat functionality** (requires Groq API key)
4. **Customize the AI prompts** in `src/services/groqapi.js`
5. **Add more features** like file uploads, project management, etc.

## Troubleshooting

- If you get authentication errors, make sure your Supabase credentials are correct
- If chat doesn't work, check your Groq API key
- If pages don't load, check the browser console for errors

## File Structure

```
src/
├── app/                    # Next.js app router pages
│   ├── api/               # API routes
│   ├── chat/              # Chat pages
│   ├── dashboard/         # Dashboard page
│   ├── login/             # Login page
│   ├── signup/            # Signup page
│   └── settings/          # Settings page
├── components/            # React components
├── contexts/              # React contexts (Auth)
├── lib/                   # Utility libraries (Supabase)
├── services/              # API services (Groq)
└── theme/                 # Material-UI theme
``` 