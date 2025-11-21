# 🎨 Course Management Frontend

A modern, responsive Vue.js frontend for the Course Management System. This application allows students to browse educational lessons, add them to a cart, and place orders for enrollment.

## 🌐 Live Demo

**Frontend (GitHub Pages):** https://heisfamy.github.io/famy-frontend/

**Backend API (Render):** https://famy-backend.onrender.com

## ✨ Features

- 📚 **Browse Lessons**: View available lessons with professional images
- 🔍 **Search**: Real-time search across subjects and locations
- 📊 **Sort**: Sort by subject, location, price, or available spaces
- 🛒 **Shopping Cart**: Add/remove lessons with quantity management
- ✅ **Checkout**: Secure order placement with validation
- 📱 **Responsive**: Works perfectly on desktop, tablet, and mobile
- 🎯 **User-Friendly**: Intuitive interface with smooth interactions

## 🛠️ Tech Stack

- **Vue 3** - Progressive JavaScript framework
- **Vite** - Fast build tool and dev server
- **Bootstrap 5** - CSS framework for responsive design
- **Font Awesome** - Icon library
- **Fetch API** - HTTP requests to backend
- **JavaScript ES6+** - Modern JavaScript features

## 📁 Project Structure

```
afam-frontend/
├── src/
│   ├── components/          # Vue components
│   │   ├── LessonCard.vue   # Individual lesson display
│   │   ├── LessonsList.vue  # Lessons grid with search/sort
│   │   ├── Cart.vue         # Shopping cart management
│   │   └── Checkout.vue     # Order form with validation
│   ├── App.vue              # Main application component
│   ├── main.js              # Application entry point
│   └── style.css            # Global styles
├── public/                  # Static assets
├── dist/                    # Built files (generated)
├── index.html               # Main HTML file
├── vite.config.js           # Vite configuration
├── package.json             # Dependencies and scripts
└── .env                     # Environment variables
```

## 🚀 Getting Started

### Prerequisites
- Node.js 16+ installed
- Git installed

### Installation

1. **Clone the repository**
   ```bash
   git clone https://github.com/heisfamy/famy-frontend.git
   cd famy-frontend
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   # Create .env file
   echo "VITE_RENDER_URL=https://famy-backend.onrender.com" > .env
   ```

4. **Start development server**
   ```bash
   npm run dev
   ```
   The app will open at http://localhost:5173

## 📜 Available Scripts

```bash
# Development
npm run dev          # Start dev server with hot reload
npm run preview      # Preview production build locally

# Production
npm run build        # Build for production
npm run deploy       # Deploy to GitHub Pages
npm run deploy:gh    # Deploy to gh-pages branch specifically
```

## 🎯 Component Architecture

### **App.vue** (Root Component)
- Manages global application state
- Handles API communication
- Coordinates between views
- Controls navigation flow

### **LessonCard.vue**
- **Props**: `lesson`, `availableSpaces`
- **Events**: `add-to-cart`
- Displays individual lesson information
- Shows image or fallback icon
- Handles add to cart functionality

### **LessonsList.vue**
- **Props**: `lessons`, `cart`, `loading`, `error`
- **Events**: `add-to-cart`, `search`, `sort`
- Manages lesson grid display
- Implements search and sort functionality
- Responsive grid layout

### **Cart.vue**
- **Props**: `cart`, `show`
- **Events**: `continue-shopping`, `remove-item`, `proceed-to-checkout`
- Displays cart items with quantities
- Calculates total price
- Handles item removal

### **Checkout.vue**
- **Props**: `cart`, `show`
- **Events**: `back-to-cart`, `order-success`, `order-error`
- Customer information form
- Input validation with regex
- Order submission handling

## 🔄 Data Flow

```
App.vue (Parent)
    ├── Manages API calls
    ├── Stores lessons and cart state
    ├── LessonsList.vue
    │   └── LessonCard.vue (multiple)
    ├── Cart.vue
    └── Checkout.vue
```

1. **App.vue** fetches lessons from backend API
2. **LessonsList.vue** displays lessons with search/sort
3. **LessonCard.vue** handles individual lesson display
4. **Cart.vue** manages shopping cart state
5. **Checkout.vue** processes order submission

## 🎨 UI/UX Features

### **Design System**
- Bootstrap 5 for consistent styling
- Font Awesome icons for visual clarity
- Responsive grid layout
- Smooth transitions and hover effects

### **User Experience**
- Loading states during API calls
- Empty state messages
- Form validation with error messages
- Success confirmation after order
- Mobile-optimized navigation

### **Accessibility**
- Semantic HTML5 structure
- ARIA labels where appropriate
- Keyboard navigation support
- High contrast colors
- Readable font sizes

## 🔧 Configuration

### **Environment Variables**
```bash
# .env file
VITE_RENDER_URL=https://famy-backend.onrender.com
```

### **Vite Configuration** (vite.config.js)
```javascript
export default defineConfig({
  base: '/famy-frontend/',  // GitHub Pages subdirectory
  plugins: [vue()]
})
```

## 🌐 Deployment

### **GitHub Pages**
The frontend is automatically deployed to GitHub Pages using GitHub Actions:

1. **Manual Deployment**
   ```bash
   npm run deploy:gh
   ```

2. **Automatic Deployment**
   - Push to `main` branch
   - GitHub Actions builds and deploys
   - Available at: https://heisfamy.github.io/famy-frontend/

### **Build Process**
```bash
npm run build    # Creates dist/ folder
gh-pages -d dist # Deploys to gh-pages branch
```

## 🔗 API Integration

### **Backend Endpoints Used**
- `GET /lessons` - Fetch all lessons
- `GET /search?q=` - Search lessons
- `POST /orders` - Submit order
- `PUT /lessons/:id` - Update lesson spaces
- `GET /images/:filename` - Get lesson images

### **Error Handling**
- Network error detection
- API timeout handling
- User-friendly error messages
- Retry mechanisms for failed requests

## 🧪 Testing

### **Manual Testing Checklist**
- [ ] Browse all lessons
- [ ] Search functionality works
- [ ] Sort options work correctly
- [ ] Add to cart functionality
- [ ] Remove from cart
- [ ] Cart total calculation
- [ ] Form validation
- [ ] Order submission
- [ ] Success/error handling
- [ ] Mobile responsiveness

### **Browser Compatibility**
- ✅ Chrome 90+
- ✅ Firefox 88+
- ✅ Safari 14+
- ✅ Edge 90+

## 📱 Responsive Design

### **Breakpoints**
- Mobile: < 576px
- Tablet: 576px - 768px
- Desktop: 768px - 992px
- Large: > 992px

### **Mobile Optimizations**
- Touch-friendly buttons
- Collapsible navigation
- Optimized image sizes
- Simplified cart view

## 🐛 Troubleshooting

### **Common Issues**

1. **Images not loading**
   - Check backend API is running
   - Verify image URLs in browser console
   - Check CORS configuration

2. **API calls failing**
   - Verify VITE_RENDER_URL in .env
   - Check network connectivity
   - Verify backend is accessible

3. **Build errors**
   - Clear node_modules and reinstall
   - Check for syntax errors
   - Verify all imports are correct

## 🤝 Contributing

1. Fork the repository
2. Create feature branch (`git checkout -b feature/amazing-feature`)
3. Commit changes (`git commit -m 'Add amazing feature'`)
4. Push to branch (`git push origin feature/amazing-feature`)
5. Open Pull Request

## 📄 License

MIT License - feel free to use this project for learning and development.

## 👨‍💻 Author

**Junior Developer** - Course Management System
- Frontend: Vue.js + Bootstrap
- Backend: Express.js + MongoDB
- Deployment: GitHub Pages + Render

---

**Happy Learning! 🎓**
