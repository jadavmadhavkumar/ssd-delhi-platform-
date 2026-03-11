#!/bin/bash

# SSD Delhi Platform - Setup Script
# This script helps you set up the complete platform

echo "🚀 Samta Sainik Dal Delhi Platform - Setup"
echo "=========================================="
echo ""

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is not installed. Please install Node.js 18+ first."
    echo "   Visit: https://nodejs.org/"
    exit 1
fi

echo "✅ Node.js found: $(node --version)"

# Check if npm is installed
if ! command -v npm &> /dev/null; then
    echo "❌ npm is not installed."
    exit 1
fi

echo "✅ npm found: $(npm --version)"

# Install dependencies
echo ""
echo "📦 Installing dependencies..."
npm install

if [ $? -ne 0 ]; then
    echo "❌ Failed to install dependencies"
    exit 1
fi

echo "✅ Dependencies installed"

# Check for .env.local
if [ ! -f .env.local ]; then
    echo ""
    echo "⚠️  .env.local file not found!"
    echo ""
    echo "📝 You need to set up environment variables:"
    echo ""
    echo "1. Run: npx convex dev"
    echo "   - This will create your Convex account and backend"
    echo "   - Follow the prompts to log in/create account"
    echo ""
    echo "2. Set up Clerk authentication:"
    echo "   - Visit: https://clerk.com"
    echo "   - Create an account and new application"
    echo "   - Copy your API keys to .env.local"
    echo ""
    echo "3. (Optional) Set up Anthropic API for AI features:"
    echo "   - Visit: https://console.anthropic.com"
    echo "   - Get your API key"
    echo ""
    echo "📄 See SETUP.md for detailed instructions"
    echo ""
else
    echo "✅ .env.local found"
fi

echo ""
echo "=========================================="
echo "✨ Setup Complete!"
echo ""
echo "Next steps:"
echo "1. If you haven't set up Convex yet, run: npx convex dev"
echo "2. Add your Clerk API keys to .env.local"
echo "3. Start the development server: npm run dev"
echo ""
echo "📖 Full documentation: SETUP.md"
echo "=========================================="
