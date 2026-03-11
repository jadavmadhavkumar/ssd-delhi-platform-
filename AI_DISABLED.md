# ✅ AI Features Temporarily Disabled

## What's Disabled

1. **AI Chatbot** (bottom-right corner widget)
2. **AI Content Generation** (in Admin > Articles > New)

## Why?

These features require Convex backend functions to be deployed. You need to run:

```bash
npx convex dev
```

This will:
- Deploy the Convex backend
- Create the database schema
- Enable AI functions

## What's Still Working ✅

All other features are fully functional:

### Public Pages
- ✅ Homepage
- ✅ About page
- ✅ History timeline
- ✅ Articles repository
- ✅ Events calendar
- ✅ Join registration
- ✅ Gallery
- ✅ News

### Member Portal (requires Clerk setup)
- ✅ Dashboard
- ✅ Profile settings
- ✅ Membership card

### Admin Panel (requires Clerk admin role)
- ✅ Admin dashboard
- ✅ Articles management
- ✅ Members management
- ✅ Manual article creation (without AI)

## How to Enable AI Features

### Step 1: Deploy Convex
```bash
cd ssd-delhi-platform
npx convex dev
```

### Step 2: Add Anthropic API Key (for AI)
```bash
# Get key from: https://console.anthropic.com
# Add to .env.local:
ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
```

### Step 3: Re-enable AI in Code

**1. Enable Chatbot** (`src/app/layout.tsx`):
```tsx
// Uncomment these lines:
import { AIChatbot } from "@/components/ai-chatbot";

// And in the body:
<AIChatbot />
```

**2. Enable AI Generation** (`src/app/admin/articles/new/page.tsx`):
```tsx
// Uncomment this line:
const generateContent = useAction(api.articles?.generateContent as any);

// And update handleAIGenerate function (remove the early return)
```

## Current Status

**Without AI:**
- ✅ All pages work
- ✅ Content management works
- ✅ Authentication works (with Clerk)
- ✅ Database works (with Convex)

**After enabling AI:**
- ✅ All above + AI chatbot
- ✅ Auto-generate articles
- ✅ Translate content

---

**समता सैनिक दल** | Soldiers for Equality
