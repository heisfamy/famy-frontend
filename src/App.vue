<!-- 
  App.vue - Main Application Component
  This is the root component that manages the entire application state.
  It coordinates between different views (lessons, cart, checkout) and handles
  all API communication with the backend.
  
  Component Structure:
  - Header: Always visible with cart button
  - Main Content: Switches between LessonsList, Cart, and Checkout components
  - Success Modal: Shows after successful order
-->
<template>
  <div id="app" class="app">
    <!-- Application Header - Always Visible -->
    <header class="bg-primary text-white shadow-lg">
      <div class="container-fluid py-3">
        <div class="row align-items-center">
          <!-- Logo and Title -->
          <div class="col-md-6">
            <h1 class="h3 mb-0">
              <i class="fas fa-graduation-cap me-2"></i>
              Course Management System
            </h1>
          </div>
          <!-- Cart Button -->
          <div class="col-md-6 text-end">
            <!-- Cart Button with Badge -->
            <button 
              class="btn btn-light position-relative"
              :disabled="cart.length === 0"
              @click="handleCartClick"
              title="View shopping cart"
            >
              <i class="fas fa-shopping-cart me-2"></i>
              Cart
              <!-- Badge showing cart item count -->
              <span 
                v-if="cart.length > 0" 
                class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger"
              >
                {{ totalCartItems }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content Area -->
    <main class="container-fluid py-4">
      <!-- Lessons List View (Default) -->
      <LessonsList 
        v-if="!showCart && !showCheckout"
        :lessons="lessons"
        :cart="cart"
        :loading="loading"
        :error="error"
        @add-to-cart="addToCart"
      />
      
      <!-- Cart View -->
      <Cart 
        v-if="showCart && !showCheckout"
        :cart="cart"
        :show="showCart"
        @continue-shopping="handleContinueShopping"
        @remove-item="removeFromCart"
        @proceed-to-checkout="handleProceedToCheckout"
      />
      
      <!-- Checkout View -->
      <Checkout 
        v-if="showCheckout"
        :cart="cart"
        :show="showCheckout"
        @back-to-cart="handleBackToCart"
        @order-success="handleOrderSuccess"
        @order-error="handleOrderError"
      />
      
      <!-- Success Modal -->
      <div 
        v-if="orderSuccess" 
        class="position-fixed top-50 start-50 translate-middle" 
        style="z-index: 1050;"
      >
        <div class="card shadow-lg">
          <div class="card-body text-center p-5">
            <i class="fas fa-check-circle text-success fa-4x mb-3"></i>
            <h3 class="text-success">Order Successful!</h3>
            <p class="mb-4">Your order has been placed successfully.</p>
            <button class="btn btn-primary" @click="resetApp">
              Continue Shopping
            </button>
          </div>
        </div>
      </div>
      
      <!-- Error Alert -->
      <div 
        v-if="globalError" 
        class="position-fixed top-0 start-50 translate-middle-x mt-3" 
        style="z-index: 1040;"
      >
        <div class="alert alert-danger alert-dismissible" role="alert">
          <i class="fas fa-exclamation-triangle me-2"></i>
          {{ globalError }}
          <button 
            type="button" 
            class="btn-close" 
            @click="globalError = ''"
            aria-label="Close"
          ></button>
        </div>
      </div>
    </main>
  </div>
</template>

<script>
// Import Vue composition API functions
import { ref, computed, onMounted } from 'vue'

// Import child components
import LessonsList from './components/LessonsList.vue'
import Cart from './components/Cart.vue'
import Checkout from './components/Checkout.vue'

/**
 * Main Application Component
 * Manages global state and coordinates between different views
 */
export default {
  name: 'App',
  
  // Register child components
  components: {
    LessonsList,
    Cart,
    Checkout
  },
  
  setup() {
    // ===== CONFIGURATION =====
    // Get API URL from environment variables with fallback to localhost
    const apiUrl = import.meta.env.VITE_RENDER_URL || 'http://localhost:3000'
    console.log('API URL configured:', apiUrl)
    
    
    // ===== STATE MANAGEMENT =====
    // Lesson data
    const lessons = ref([])           // All lessons from API
    const loading = ref(false)        // Loading state
    const error = ref('')             // Error messages for lessons
    const globalError = ref('')       // Global error messages
    
    // Cart data
    const cart = ref([])              // Cart items array
    
    // View control
    const showCart = ref(false)       // Show cart view
    const showCheckout = ref(false)   // Show checkout view
    const orderSuccess = ref(false)   // Show success modal
    
    // ===== COMPUTED PROPERTIES =====
    /**
     * Calculate total number of items in cart
     * Used for the cart badge in header
     */
    const totalCartItems = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.quantity, 0)
    })
    
    // ===== API METHODS =====
    /**
     * Fetch all lessons from the backend API
     * Called on component mount and after successful order
     */
    const fetchLessons = async () => {
      console.log('Fetching lessons from API...')
      loading.value = true
      error.value = ''
      
      try {
        // Make API call to get all lessons
        const response = await fetch(`${apiUrl}/lessons`)
        
        // Check if response is OK
        if (!response.ok) {
          throw new Error(`HTTP error! status: ${response.status}`)
        }
        
        // Parse JSON response
        const data = await response.json()
        console.log(`Fetched ${data.length} lessons successfully`)
        
        // Update state with fetched lessons
        lessons.value = data
      } catch (err) {
        // Handle errors
        error.value = 'Failed to load lessons. Please check your connection and try again.'
        console.error('Error fetching lessons:', err)
        globalError.value = err.message
      } finally {
        // Always stop loading
        loading.value = false
      }
    }
    
    // ===== CART MANAGEMENT =====
    /**
     * Add a lesson to the cart
     * If lesson already exists in cart, increment quantity
     * @param {Object} lesson - The lesson object to add
     */
    const addToCart = (lesson) => {
      console.log(`Adding lesson to cart: ${lesson.subject}`)
      
      // Check if lesson already exists in cart
      const existingItem = cart.value.find(item => item.lesson._id === lesson._id)
      
      if (existingItem) {
        // Increment quantity if already in cart
        existingItem.quantity++
        console.log(`Increased quantity for ${lesson.subject} to ${existingItem.quantity}`)
      } else {
        // Add new item to cart
        cart.value.push({
          id: Date.now(),  // Unique ID for cart item
          lesson: lesson,
          quantity: 1
        })
        console.log(`Added ${lesson.subject} to cart`)
      }
    }
    
    /**
     * Remove an item from the cart
     * @param {number} itemId - The unique ID of the cart item to remove
     */
    const removeFromCart = (itemId) => {
      const item = cart.value.find(i => i.id === itemId)
      if (item) {
        console.log(`Removing ${item.lesson.subject} from cart`)
        cart.value = cart.value.filter(item => item.id !== itemId)
      }
    }
    
    // ===== VIEW NAVIGATION =====
    /**
     * Handle cart button click
     */
    const handleCartClick = () => {
      console.log('Opening cart view')
      showCart.value = true
      showCheckout.value = false
    }
    
    /**
     * Handle continue shopping from cart
     */
    const handleContinueShopping = () => {
      console.log('Returning to lessons view')
      showCart.value = false
      showCheckout.value = false
    }
    
    /**
     * Handle proceed to checkout from cart
     */
    const handleProceedToCheckout = () => {
      console.log('Proceeding to checkout')
      showCart.value = false
      showCheckout.value = true
    }
    
    /**
     * Handle back to cart from checkout
     */
    const handleBackToCart = () => {
      console.log('Going back to cart')
      showCart.value = true
      showCheckout.value = false
    }
    
    /**
     * Handle successful order
     * @param {Object} orderData - Order details from checkout
     */
    const handleOrderSuccess = async (orderData) => {
      console.log('Order completed successfully!', orderData)
      
      // Update lesson spaces locally
      for (const item of cart.value) {
        const lesson = lessons.value.find(l => l._id === item.lesson._id)
        if (lesson) {
          lesson.spaces = lesson.spaces - item.quantity
        }
      }
      
      // Show success message
      orderSuccess.value = true
      showCheckout.value = false
      
      // Clear cart
      cart.value = []
    }
    
    /**
     * Handle order error
     * @param {string} errorMessage - Error message to display
     */
    const handleOrderError = (errorMessage) => {
      console.error('Order error:', errorMessage)
      globalError.value = errorMessage
    }
    
    /**
     * Reset app to initial state after successful order
     */
    const resetApp = () => {
      console.log('Resetting application state')
      
      // Reset all state
      showCart.value = false
      showCheckout.value = false
      orderSuccess.value = false
      globalError.value = ''
      
      // Fetch fresh lesson data
      fetchLessons()
    }
    
    // ===== LIFECYCLE =====
    /**
     * On component mount, fetch lessons from API
     */
    onMounted(() => {
      console.log('App component mounted')
      fetchLessons()
    })
    
    // ===== RETURN PUBLIC API =====
    // Return all reactive properties and methods for template use
    return {
      // State
      lessons,
      cart,
      loading,
      error,
      globalError,
      showCart,
      showCheckout,
      orderSuccess,
      
      // Computed
      totalCartItems,
      
      // Methods - Cart
      addToCart,
      removeFromCart,
      
      // Methods - Navigation
      handleCartClick,
      handleContinueShopping,
      handleProceedToCheckout,
      handleBackToCart,
      
      // Methods - Order
      handleOrderSuccess,
      handleOrderError,
      
      // Methods - App
      resetApp
    }
  }
}
</script>

<style>
.hover-shadow:hover {
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
  transition: box-shadow 0.3s ease-in-out;
}

.card {
  transition: transform 0.2s;
}

.card:hover {
  transform: translateY(-5px);
}
</style>
