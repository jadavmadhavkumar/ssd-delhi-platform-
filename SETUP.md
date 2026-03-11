# Samta Sainik Dal Delhi Platform - Setup Guide

**समता सैनिक दल दिल्ली** - Complete Digital Platform Setup

## 🚀 Quick Start

### Step 1: Install Dependencies

```bash
cd ssd-delhi-platform
npm install
```

### Step 2: Set Up Convex (Required)

Convex is the backend database. You need to create a free account:

1. **Create Convex Account:**
   - Go to [https://convex.dev](https://convex.dev)
   - Sign up for free
   - Create a new project named "ssd-delhi-website"

2. **Link Your Project:**
   ```bash
   npx convex dev
   ```
   - This will open a browser window
   - Log in to your Convex account
   - Select or create your project
   - The `.env.local` file will be automatically updated

3. **Push Schema:**
   - The schema will be automatically pushed when you run `npx convex dev`
   - Wait for the message "Convex functions deployed"

### Step 3: Set Up Clerk (Required for Auth)

Clerk handles user authentication:

1. **Create Clerk Account:**
   - Go to [https://clerk.com](https://clerk.com)
   - Sign up for free
   - Create a new application

2. **Get API Keys:**
   - Go to API Keys in Clerk dashboard
   - Copy the **Publishable Key** and **Secret Key**

3. **Update .env.local:**
   ```env
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

4. **Configure Clerk:**
   - In Clerk dashboard, go to "User & Authentication"
   - Enable Email and Password sign-in
   - Optionally enable Google OAuth

### Step 4: Set Up Anthropic API (Optional - for AI features)

For AI content generation and chatbot:

1. **Get API Key:**
   - Go to [https://console.anthropic.com](https://console.anthropic.com)
   - Sign up and get your API key

2. **Update .env.local:**
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
   ```

### Step 5: Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## 📁 Project Structure

```
ssd-delhi-platform/
├── src/
│   ├── app/                    # Next.js pages
│   │   ├── page.tsx            # Homepage
│   │   ├── about/              # About page
│   │   ├── history/            # Timeline history
│   │   ├── articles/           # Articles (list + detail)
│   │   ├── events/             # Events (list + detail)
│   │   ├── join/               # Volunteer registration
│   │   ├── dashboard/          # Member portal
│   │   │   ├── page.tsx        # Dashboard home
│   │   │   ├── profile/        # Profile settings
│   │   │   └── membership-card/# Digital membership card
│   │   └── admin/              # Admin panel
│   │       ├── page.tsx        # Admin dashboard
│   │       ├── articles/       # Article management
│   │       └── members/        # Member approval
│   ├── components/
│   │   ├── ui/                 # shadcn/ui components
│   │   ├── header.tsx          # Navigation
│   │   ├── footer.tsx          # Footer
│   │   ├── ai-chatbot.tsx      # AI chatbot widget
│   │   └── providers.tsx       # Convex + Clerk providers
│   └── middleware.ts           # Auth middleware
├── convex/
│   ├── schema.ts               # Database schema
│   ├── articles.ts             # Article functions
│   ├── timeline.ts             # Timeline functions
│   ├── events.ts               # Event functions
│   ├── users.ts                # User functions
│   ├── aiConversations.ts      # AI chatbot functions
│   └── ...                     # Other Convex functions
└── .env.local                  # Environment variables
```

## 🔧 Available Commands

```bash
# Development
npm run dev              # Start development server

# Production
npm run build            # Build for production
npm run start            # Start production server

# Code Quality
npm run lint             # Run ESLint
npm run type-check       # TypeScript type checking

# Convex
npx convex dev           # Run Convex development
npx convex deploy        # Deploy to production
```

## 📊 Database Schema

The platform uses Convex with these tables:

| Table | Description |
|-------|-------------|
| `articles` | Repository articles with citations |
| `timelineEvents` | Historical timeline (1924-present) |
| `blogs` | Community blog posts |
| `news` | News and announcements |
| `events` | Upcoming and past events |
| `users` | Member profiles and roles |
| `eventRegistrations` | Event attendance tracking |
| `mediaGallery` | Photos, videos, documents |
| `aiConversations` | Chatbot conversation history |
| `comments` | Article/blog comments |
| `donations` | Contribution tracking |

## 👥 User Roles

| Role | Permissions |
|------|-------------|
| **Visitor** | Read-only access to public content |
| **Volunteer** | Member access, event registration |
| **Editor** | Create/edit content |
| **Admin** | Full content management, member approval |
| **Super Admin** | System configuration |

## 🌐 Pages Overview

### Public Pages
- `/` - Homepage with featured content
- `/about` - Organization info, ideology, structure
- `/history` - Interactive timeline with filters
- `/articles` - Article repository with search
- `/articles/[slug]` - Individual article view
- `/blog` - Community blog
- `/news` - Latest announcements
- `/events` - Event calendar
- `/events/[slug]` - Event details + registration
- `/gallery` - Media gallery
- `/join` - Volunteer registration form
- `/contact` - Contact information

### Member Pages (Auth Required)
- `/dashboard` - Member dashboard
- `/dashboard/profile` - Profile settings
- `/dashboard/membership-card` - Digital membership card with QR

### Admin Pages (Admin Only)
- `/admin` - Admin dashboard with stats
- `/admin/articles` - Article management
- `/admin/articles/new` - Create new article (with AI)
- `/admin/members` - Approve/reject members
- `/admin/events` - Event management
- `/admin/news` - News management

## 🤖 AI Features

### Content Generation
- Auto-generate articles from prompts
- Translate content (English ↔ Hindi)
- Auto-tagging and categorization

### Chatbot
- Answer questions about SSD history
- Provide event information
- Guide users through registration
- Available on all pages (bottom-right corner)

### Using AI
1. Go to `/admin/articles/new`
2. Enter a title
3. Click "AI Generate" button
4. Review and edit generated content
5. Publish when ready

## 🚢 Deployment to Production

### Vercel Deployment

1. **Push to GitHub:**
   ```bash
   git init
   git add .
   git commit -m "Initial commit"
   git remote add origin your-repo-url
   git push -u origin main
   ```

2. **Connect to Vercel:**
   - Go to [https://vercel.com](https://vercel.com)
   - Import your GitHub repository
   - Add environment variables from `.env.local`

3. **Deploy Convex to Production:**
   ```bash
   npx convex deploy --prod
   ```

4. **Update Environment Variables:**
   - Update `NEXT_PUBLIC_CONVEX_URL` with production URL
   - Update Clerk keys for production

### Environment Variables for Production

```env
# Convex (from production deployment)
NEXT_PUBLIC_CONVEX_URL=https://your-prod-deployment.convex.cloud
CONVEX_DEPLOYMENT=your-prod-deployment

# Clerk (production keys)
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_prod_...
CLERK_SECRET_KEY=sk_prod_...

# Anthropic API
ANTHROPIC_API_KEY=sk-ant-...
```

## 🔒 Security

- All routes are protected by Clerk authentication
- Admin routes require admin role
- API mutations verify user identity
- CORS configured for Convex
- Rate limiting via Clerk

## 📱 Mobile App (Coming Soon)

React Native mobile app with:
- Offline content access
- Push notifications
- QR code scanner for member verification
- Event check-in

## 🆘 Troubleshooting

### Convex Connection Error
```
Error: No address provided to ConvexReactClient
```
**Solution:** Run `npx convex dev` to set up Convex

### Clerk Invalid Key
```
Error: The publishableKey passed to Clerk is invalid
```
**Solution:** Get correct keys from [clerk.com](https://clerk.com) and update `.env.local`

### Build Fails
```
Module not found: Can't resolve 'convex/_generated/api'
```
**Solution:** Run `npx convex dev` to generate Convex types

### Auth Not Working
- Ensure Clerk middleware is configured
- Check that `.env.local` has correct Clerk keys
- Verify Clerk dashboard has correct redirect URLs

## 📞 Support

For technical issues:
- Convex: [docs.convex.dev](https://docs.convex.dev)
- Clerk: [clerk.com/docs](https://clerk.com/docs)
- Next.js: [nextjs.org/docs](https://nextjs.org/docs)

## 📄 License

Proprietary software for Samta Sainik Dal Delhi

---

**समता सैनिक दल** | Soldiers for Equality | Liberty • Equality • Fraternity
