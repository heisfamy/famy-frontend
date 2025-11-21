#!/bin/bash

# Frontend Deployment Script
# This script handles the deployment process for the frontend to GitHub Pages
# It includes build validation, error checking, and deployment steps

set -e  # Exit on any error

echo "🚀 Starting Frontend Deployment to GitHub Pages"
echo "================================================"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Function to print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Check if we're in the right directory
if [ ! -f "package.json" ]; then
    print_error "package.json not found. Please run this script from the frontend directory."
    exit 1
fi

# Check if node_modules exists
if [ ! -d "node_modules" ]; then
    print_status "Installing dependencies..."
    npm install
    print_success "Dependencies installed"
fi

# Check if environment file exists
if [ ! -f ".env" ]; then
    print_warning ".env file not found. Creating with default values..."
    echo "VITE_RENDER_URL=https://famy-backend.onrender.com" > .env
    print_warning "Please update .env file with your actual API URL"
fi

# Check if gh-pages is installed
if ! npm list gh-pages &>/dev/null; then
    print_status "Installing gh-pages package..."
    npm install --save-dev gh-pages
    print_success "gh-pages package installed"
fi

# Clean previous build
print_status "Cleaning previous build..."
rm -rf dist
print_success "Previous build cleaned"

# Run tests if they exist
if [ -f "package.json" ] && grep -q "test" package.json; then
    print_status "Running tests..."
    npm test
    print_success "All tests passed"
else
    print_warning "No tests found, skipping test step"
fi

# Build the project
print_status "Building project for production..."
# Ensure environment variables are available during build
export VITE_RENDER_URL=https://famy-backend.onrender.com
npm run build

# Check if build was successful
if [ ! -d "dist" ]; then
    print_error "Build failed - dist directory not created"
    exit 1
fi

# Check if index.html exists in dist
if [ ! -f "dist/index.html" ]; then
    print_error "Build failed - index.html not found in dist"
    exit 1
fi

# Check build size
BUILD_SIZE=$(du -sh dist | cut -f1)
print_success "Build completed successfully (Size: $BUILD_SIZE)"

# Verify build contents
print_status "Verifying build contents..."
HTML_SIZE=$(du -sh dist/index.html | cut -f1)
JS_SIZE=$(du -sh dist/assets/*.js | cut -f1)
CSS_SIZE=$(du -sh dist/assets/*.css | cut -f1)

print_status "Build file sizes:"
echo "  - HTML: $HTML_SIZE"
echo "  - JS: $JS_SIZE"
echo "  - CSS: $CSS_SIZE"

# Check if git repository is clean
if [ -n "$(git status --porcelain)" ]; then
    print_warning "You have uncommitted changes. Consider committing them before deployment."
    read -p "Do you want to continue anyway? (y/N): " -n 1 -r
    echo
    if [[ ! $REPLY =~ ^[Yy]$ ]]; then
        print_status "Deployment cancelled."
        exit 0
    fi
fi

# Deploy to GitHub Pages
print_status "Deploying to GitHub Pages..."
npm run deploy:gh

# Check if deployment was successful
if [ $? -eq 0 ]; then
    print_success "Deployment completed successfully!"
    echo ""
    echo "🌐 Your site is now live at: https://heisfamy.github.io/famy-frontend/"
    echo ""
    echo "📊 Deployment Summary:"
    echo "  - Build Size: $BUILD_SIZE"
    echo "  - Branch: gh-pages"
    echo "  - URL: https://heisfamy.github.io/famy-frontend/"
    echo ""
    print_success "Deployment complete! 🎉"
else
    print_error "Deployment failed!"
    exit 1
fi

# Optional: Open the deployed site
read -p "Do you want to open the deployed site in your browser? (y/N): " -n 1 -r
echo
if [[ $REPLY =~ ^[Yy]$ ]]; then
    if command -v xdg-open > /dev/null; then
        xdg-open "https://heisfamy.github.io/famy-frontend/"
    elif command -v open > /dev/null; then
        open "https://heisfamy.github.io/famy-frontend/"
    elif command -v start > /dev/null; then
        start "https://heisfamy.github.io/famy-frontend/"
    else
        print_status "Please manually open: https://heisfamy.github.io/famy-frontend/"
    fi
fi

echo ""
print_status "Deployment script completed successfully!"
