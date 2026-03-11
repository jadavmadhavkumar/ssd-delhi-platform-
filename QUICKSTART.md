# SSD Delhi Platform - Quick Start Guide

## 🚀 Fix All Errors & Get Started

### Step 1: Install Dependencies
```bash
npm install
```

### Step 2: Set Up Convex Backend
```bash
npx convex dev
```
This will:
- Create/link your Convex project
- Deploy the database schema
- Generate TypeScript types
- Update `.env.local` with Convex URL

**If you get an error about `convex.config.ts`:**
The file has been fixed. Just run `npx convex dev` again.

### Step 3: Set Up Clerk Authentication

1. Go to [clerk.com](https://clerk.com)
2. Sign up for free
3. Create a new application
4. Go to API Keys
5. Copy the keys to `.env.local`:

```env
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_your_key_here
CLERK_SECRET_KEY=sk_test_your_key_here
```

### Step 4: Start Development Server
```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000)

## ✅ Fixed Issues

### 1. Convex Config Error
**Fixed:** Updated `convex/convex.config.ts` with proper export

### 2. Clerk SignedOut Error  
**Fixed:** 
- Created separate `AuthButtons` component
- Added proper mounting state with `useEffect`
- Re-exported Clerk components from providers

### 3. Nested `<a>` Tags
**Fixed:** Updated navigation menu to use `asChild` prop correctly

## 🆘 Still Having Issues?

### Clear Cache and Reinstall
```bash
rm -rf node_modules package-lock.json .next
npm install
npx convex dev
npm run dev
```

### Check Environment Variables
Make sure `.env.local` has:
```env
NEXT_PUBLIC_CONVEX_URL=https://your-deployment.convex.cloud
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_test_...
CLERK_SECRET_KEY=sk_test_...
```

### Convex Not Deploying
```bash
# Force redeploy
npx convex deploy --force
```

### Clerk Not Working
- Make sure you're using the **Publishable Key** (starts with `pk_test_`)
- Check that keys are in `.env.local` (not `.env`)
- Restart the dev server after adding keys

## 📞 Support

- **Convex:** [docs.convex.dev](https://docs.convex.dev)
- **Clerk:** [clerk.com/docs](https://clerk.com/docs)
- **Next.js:** [nextjs.org/docs](https://nextjs.org/docs)

---

**समता सैनिक दल** | Soldiers for Equality
