#!/bin/bash

# SecurityDebt.ai Deployment Script
echo "🚀 Deploying SecurityDebt.ai Mock POC..."

# Build the project
echo "📦 Building project..."
npm run build

if [ $? -eq 0 ]; then
    echo "✅ Build successful!"
    
    # Check if dist directory exists
    if [ -d "dist" ]; then
        echo "📁 Build output found in dist/"
        echo "🌐 You can now deploy the contents of the 'dist' folder to any static hosting service"
        echo ""
        echo "Deployment options:"
        echo "1. GitHub Pages: Upload dist/ contents to gh-pages branch"
        echo "2. Vercel: Connect your GitHub repo at vercel.com"
        echo "3. Netlify: Drag and drop the dist/ folder at netlify.com"
        echo "4. Any static hosting: Upload dist/ contents"
        echo ""
        echo "Live demo should be available at: https://stein7734.github.io/securitydebt/"
    else
        echo "❌ Build output not found!"
        exit 1
    fi
else
    echo "❌ Build failed!"
    exit 1
fi
