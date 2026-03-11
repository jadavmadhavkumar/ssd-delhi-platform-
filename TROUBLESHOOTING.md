# 🔧 Troubleshooting Guide - SSD Delhi Platform

## Common Errors & Solutions

### Error 1: Convex Config Error
```
The default export of convex.config.ts has an invalid value
```

**Solution:** Delete the config file (it's optional)
```bash
rm convex/convex.config.ts
npx convex dev
```

### Error 2: Convex Client Not Found
```
Could not find Convex client! useQuery must be used under ConvexProvider
```

**Cause:** Convex isn't properly connected yet

**Solution:**
1. Make sure you ran `npx convex dev`
2. Check `.env.local` has `NEXT_PUBLIC_CONVEX_URL`
3. The app now handles this gracefully - pages will show skeletons until Convex connects

### Error 3: Clerk SignedOut Error
```
SignedOut can only be used within the <ClerkProvider /> component
```

**Solution:** Already fixed in the code - AuthButtons component now uses proper useEffect mounting

### Error 4: Nested <a> Tags
```
In HTML, <a> cannot be a descendant of <a>
```

**Solution:** Already fixed - navigation menu now uses `asChild` prop correctly

## Complete Setup Flow

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Convex (REQUIRED)
```bash
npx convex dev
```

**What this does:**
- Creates Convex account (if you don't have one)
- Creates/links project "ssd-delhi-website"
- Deploys database schema
- Generates TypeScript types
- Updates `.env.local` with Convex URL

**Expected output:**
```
✔ Reinitialized project ssd-delhi-website
✔ Provisioned a dev deployment
✔ Saved to .env.local
```

**If you get errors:**
- `convex.config.ts error` → Delete the file: `rm convex/convex.config.ts`
- `Authentication error` → Visit the URL shown in terminal to log in
- `Project not found` → Choose "Create new project"

### Step 3: Set Up Clerk (REQUIRED for auth)

1. **Get Clerk Keys:**
   - Go to [clerk.com](https://clerk.com)
   - Sign up (free)
   - Create new application
   - Go to "API Keys"
   - Copy **Publishable Key** and **Secret Key**

2. **Update .env.local:**
   ```bash
   # Add these lines to .env.local
   NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
   CLERK_SECRET_KEY=sk_test_your_key_here
   ```

3. **Restart dev server:**
   ```bash
   npm run dev
   ```

### Step 4: Verify Setup

1. Open [http://localhost:3000](http://localhost:3000)
2. You should see:
   - Homepage with skeleton loaders (Convex is loading)
   - After a few seconds, content should appear
   - No console errors

3. Check Convex dashboard:
   - Visit the URL from `npx convex dev` output
   - You should see your database tables

### Step 5: (Optional) AI Features

For AI chatbot and content generation:

1. Get Anthropic API key from [console.anthropic.com](https://console.anthropic.com)
2. Add to `.env.local`:
   ```env
   ANTHROPIC_API_KEY=sk-ant-api03-your_key_here
   ```

## Quick Fixes

### Clear Everything and Start Fresh
```bash
# Remove node_modules and cache
rm -rf node_modules package-lock.json .next

# Reinstall
npm install

# Re-run Convex
npx convex dev

# Start dev server
npm run dev
```

### Check Environment Variables
```bash
# View your .env.local
cat .env.local

# Should have:
# NEXT_PUBLIC_CONVEX_URL=https://...
# NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
# CLERK_SECRET_KEY=sk_test_...
```

### Force Convex Redeploy
```bash
npx convex deploy --force
```

### Check Convex Status
```bash
npx convex logs
```

## Still Having Issues?

### 1. Check Node Version
```bash
node --version
# Should be 18.x or higher
```

If too old, update Node.js from [nodejs.org](https://nodejs.org)

### 2. Check Convex Connection
```bash
# Test Convex connection
npx convex run --list
```

### 3. Check Clerk Configuration
- Make sure you're using **Publishable Key** (starts with `pk_test_`)
- Keys are in `.env.local` (not `.env`)
- Restart dev server after adding keys

### 4. View Convex Dashboard
- The URL is shown when you run `npx convex dev`
- Or visit: https://dashboard.convex.dev
- Check if your deployment is active

### 5. Check Browser Console
- Open DevTools (F12)
- Look for errors in Console tab
- Common issues:
  - Missing env variables
  - CORS errors (normal during setup)
  - Convex connection errors (check Step 2)

## Contact Support

- **Convex:** [docs.convex.dev](https://docs.convex.dev) or Discord
- **Clerk:** [clerk.com/docs](https://clerk.com/docs)
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)

---

**समता सैनिक दल** | Soldiers for Equality
