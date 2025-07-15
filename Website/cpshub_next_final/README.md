# CPSHub.ai - Construction AI Assistant

A specialized AI-powered platform designed specifically for the construction industry, providing expert guidance on project management, materials, building codes, and best practices.

## Features

### ✅ Implemented
- **Clean Next.js Architecture**: Optimized TypeScript setup with App Router
- **Authentication**: Supabase Auth with role-based access (admin/user)
- **AI Chat Interface**: Construction-specialized responses via Groq API
- **Professional UI**: Material-UI components with custom construction theme
- **File Uploads**: Support for images and documents in chat
- **User Management**: Profile settings, password changes, dark mode
- **Admin Dashboard**: User analytics and AI instruction management

### 🔄 Core Functionality
- **Chat History**: Persistent conversation storage
- **Responsive Design**: Optimized for desktop and mobile
- **Performance**: React.memo, optimized state management
- **Security**: Protected routes, input validation

## Tech Stack

- **Framework**: Next.js 15.3.4 with App Router
- **Language**: TypeScript
- **UI Library**: Material-UI + Tailwind CSS
- **Database**: Supabase (PostgreSQL)
- **Authentication**: Supabase Auth
- **AI Provider**: Groq API (Llama 3.1)
- **File Storage**: Supabase Storage

## Database Schema

### Tables
1. **profiles**: User profiles with role management
2. **chats**: Chat history with messages and metadata
3. **ai_instructions**: Admin-configurable AI behavior

## Setup Instructions

### 1. Environment Variables
Create `.env.local`:
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

### 3. Run Development Server
```bash
npm run dev
```

### 4. Build for Production
```bash
npm run build
npm start
```

## Project Structure

```
src/
├── app/                    # Next.js App Router pages
│   ├── api/               # API routes
│   ├── auth/              # Authentication pages
│   ├── dashboard/         # Main app pages
│   └── layout.tsx         # Root layout
├── components/            # React components
│   ├── Chat/              # Chat interface
│   └── Layout/            # Layout components
├── contexts/              # React contexts
├── lib/                   # Utilities and services
└── theme/                 # Material-UI theme
```

## Key Features

### Construction-Specialized AI
- Project management guidance
- Material selection advice
- Building code compliance
- Cost estimation help
- Safety protocol recommendations

### User Experience
- Intuitive chat interface
- File upload support
- Chat history organization
- Mobile-responsive design

### Admin Features
- User analytics dashboard
- AI instruction customization
- Usage monitoring
- Role management

## Performance Optimizations

- React.memo for component optimization
- Optimized Next.js configuration
- Efficient state management
- Compressed assets and images
- Fast build times with Turbopack

## Contributing

1. Follow TypeScript best practices
2. Use Material-UI components consistently
3. Maintain responsive design principles
4. Write clean, documented code
5. Test all features thoroughly

## License

Private - CPSHub Construction AI Platform