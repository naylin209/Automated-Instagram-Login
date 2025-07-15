# CPSHub.ai Setup Instructions

## 🚀 Quick Start

### 1. Environment Variables
Copy your existing environment variables to `.env.local`:

```bash
# Supabase Configuration
NEXT_PUBLIC_SUPABASE_URL=your_supabase_project_url
NEXT_PUBLIC_SUPABASE_ANON_KEY=your_supabase_anon_key

# Groq API Configuration  
GROQ_API_KEY=your_groq_api_key

# App Configuration
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

### 2. Install Dependencies
```bash
npm install
```

### 3. Set Up Supabase Storage (Optional - for file uploads)
In your Supabase dashboard:
1. Go to Storage
2. Create buckets:
   - `avatars` (for profile pictures)
   - `chat-files` (for chat attachments)
3. Set appropriate RLS policies

### 4. Run SQL Functions (Optional - for admin analytics)
Execute the SQL in `sql/analytics_functions.sql` in your Supabase SQL editor for:
- Analytics functions
- Performance indexes
- Row Level Security policies

### 5. Start Development
```bash
npm run dev
```

Visit `http://localhost:3000` to see your construction AI platform!

## ✅ What's Included

### Core Features
- **Landing Page**: Professional construction-focused homepage
- **Authentication**: Secure login/signup with Supabase Auth
- **AI Chat**: Construction-specialized responses via Groq API
- **File Uploads**: Support for images and documents in chat
- **Chat History**: Persistent conversation storage and search
- **User Settings**: Profile management, password changes, dark mode toggle
- **Admin Dashboard**: User analytics and AI instruction management

### Technical Features
- **TypeScript**: Full type safety
- **Responsive Design**: Works on desktop and mobile
- **Performance Optimized**: React.memo, optimized builds
- **Error Handling**: Comprehensive error states
- **Loading States**: Smooth user experience
- **Security**: Protected routes, input validation

## 🎯 Ready to Use

### For Users:
1. Sign up/login
2. Start chatting with the construction AI
3. Upload files for AI analysis
4. View chat history
5. Customize profile settings

### For Admins:
1. View user analytics and platform usage
2. Customize AI response behavior
3. Monitor chat activity
4. Manage user roles

## 🛠 Customization

### AI Instructions
Admins can customize how the AI responds by:
1. Going to Admin Dashboard → AI Instructions
2. Editing the system prompt
3. Saving changes (affects new conversations)

### Branding
- Colors: Defined in `src/theme/theme.ts`
- Logo: Update in components
- Company name: Search and replace "CPSHub"

### Features
- Add new chat features in `src/components/Chat/`
- Add new admin features in `src/app/dashboard/admin/`
- Add new settings in `src/app/dashboard/settings/`

## 📊 Database Schema

Your existing Supabase tables work perfectly:

### `profiles`
- `id` (uuid, primary key)
- `first_name` (text)
- `last_name` (text)
- `profile_picture_url` (text)
- `role` (text: 'user' | 'admin')
- `created_at` (timestamp)
- `bio` (text)

### `chats`
- `id` (uuid, primary key)
- `user_id` (uuid, foreign key)
- `messages` (jsonb)
- `created_at` (timestamp)
- `updated_at` (timestamp)
- `excerpt` (text)
- `title` (text)

### `ai_instructions`
- `id` (uuid, primary key)
- `instructions` (text)
- `created_at` (timestamp)

## 🚦 Next Steps

1. **Test the application** with your environment variables
2. **Create your first admin user** by manually setting role = 'admin' in Supabase
3. **Customize AI instructions** in the admin dashboard
4. **Upload your company logo** and branding
5. **Deploy to production** when ready

## 🆘 Support

The application is production-ready with:
- Error boundaries
- Loading states
- Input validation
- Security best practices
- Optimized performance

Happy building! 🏗️