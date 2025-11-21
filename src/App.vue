<template>
  <div class="app">
    <!-- Header -->
    <header class="bg-primary text-white shadow-lg">
      <div class="container-fluid py-3">
        <div class="row align-items-center">
          <div class="col-md-6">
            <h1 class="h3 mb-0">
              <i class="fas fa-graduation-cap me-2"></i>
              Course Management System
            </h1>
          </div>
          <div class="col-md-6 text-end">
            <button 
              class="btn btn-light position-relative"
              :disabled="cart.length === 0"
              @click="showCart = true"
            >
              <i class="fas fa-shopping-cart me-2"></i>
              Cart
              <span v-if="cart.length > 0" class="position-absolute top-0 start-100 translate-middle badge rounded-pill bg-danger">
                {{ totalCartItems }}
              </span>
            </button>
          </div>
        </div>
      </div>
    </header>

    <!-- Main Content -->
    <main class="container-fluid py-4">
      <div v-if="!showCart && !showCheckout">
        <!-- Search and Sort Controls -->
        <div class="row mb-4">
          <div class="col-md-6">
            <div class="input-group">
              <span class="input-group-text"><i class="fas fa-search"></i></span>
              <input 
                v-model="searchQuery"
                type="text" 
                class="form-control" 
                placeholder="Search lessons..."
                @input="searchLessons"
              >
            </div>
          </div>
          <div class="col-md-6">
            <div class="d-flex gap-2">
              <select v-model="sortBy" class="form-select" @change="sortLessons">
                <option value="">Sort by...</option>
                <option value="subject">Subject</option>
                <option value="location">Location</option>
                <option value="price">Price</option>
                <option value="spaces">Available Spaces</option>
              </select>
              <button 
                class="btn btn-outline-secondary" 
                @click="sortOrder = sortOrder === 'asc' ? 'desc' : 'asc'; sortLessons()"
                :disabled="!sortBy"
              >
                <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
              </button>
            </div>
          </div>
        </div>

        <!-- Lessons Grid -->
        <div v-if="loading" class="text-center py-5">
          <div class="spinner-border text-primary" role="status">
            <span class="visually-hidden">Loading...</span>
          </div>
        </div>
        
        <div v-else-if="error" class="alert alert-danger">
          {{ error }}
        </div>
        
        <div v-else class="row g-4">
          <div 
            v-for="lesson in displayedLessons" 
            :key="lesson._id"
            class="col-md-6 col-lg-4 col-xl-3"
          >
            <div class="card h-100 shadow-sm hover-shadow">
              <img 
                v-if="lesson.image" 
                :src="`${apiUrl}/images/${lesson.image}`" 
                class="card-img-top" 
                :alt="lesson.subject"
                style="height: 200px; object-fit: cover;"
                @error="handleImageError($event, lesson)"
              >
              <div v-else class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
                <i :class="lesson.icon || 'fas fa-book'" class="fa-4x text-muted"></i>
              </div>
              
              <div class="card-body">
                <h5 class="card-title">
                  <i :class="lesson.icon || 'fas fa-book'" class="me-2 text-primary"></i>
                  {{ lesson.subject }}
                </h5>
                <p class="card-text">
                  <i class="fas fa-map-marker-alt text-danger me-2"></i>
                  {{ lesson.location }}
                </p>
                <p class="card-text">
                  <i class="fas fa-pound-sign text-success me-2"></i>
                  <strong>£{{ lesson.price }}</strong> per lesson
                </p>
                <p class="card-text">
                  <i class="fas fa-users text-info me-2"></i>
                  <span :class="{'text-danger': getAvailableSpaces(lesson._id) <= 2}">
                    {{ getAvailableSpaces(lesson._id) }} spaces available
                  </span>
                </p>
                
                <button 
                  class="btn btn-primary w-100"
                  :disabled="getAvailableSpaces(lesson._id) === 0"
                  @click="addToCart(lesson)"
                >
                  <i class="fas fa-cart-plus me-2"></i>
                  {{ getAvailableSpaces(lesson._id) === 0 ? 'Fully Booked' : 'Add to Cart' }}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Cart View -->
      <div v-else-if="showCart && !showCheckout" class="row">
        <div class="col-lg-8 mx-auto">
          <div class="card shadow">
            <div class="card-header bg-primary text-white">
              <h3 class="mb-0">
                <i class="fas fa-shopping-cart me-2"></i>
                Shopping Cart
              </h3>
            </div>
            <div class="card-body">
              <div v-if="cart.length === 0" class="text-center py-5">
                <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
                <p class="text-muted">Your cart is empty</p>
                <button class="btn btn-primary" @click="showCart = false">
                  Continue Shopping
                </button>
              </div>
              
              <div v-else>
                <div v-for="item in cart" :key="item.id" class="mb-3">
                  <div class="row align-items-center">
                    <div class="col-md-6">
                      <h5 class="mb-1">{{ item.lesson.subject }}</h5>
                      <p class="text-muted mb-0">
                        <i class="fas fa-map-marker-alt me-1"></i> {{ item.lesson.location }}
                      </p>
                    </div>
                    <div class="col-md-3">
                      <p class="mb-0">£{{ item.lesson.price }} x {{ item.quantity }}</p>
                      <p class="fw-bold mb-0">£{{ item.lesson.price * item.quantity }}</p>
                    </div>
                    <div class="col-md-3 text-end">
                      <button 
                        class="btn btn-sm btn-danger"
                        @click="removeFromCart(item.id)"
                      >
                        <i class="fas fa-trash"></i>
                      </button>
                    </div>
                  </div>
                  <hr>
                </div>
                
                <div class="row mt-4">
                  <div class="col-md-6">
                    <button class="btn btn-secondary" @click="showCart = false">
                      <i class="fas fa-arrow-left me-2"></i>
                      Continue Shopping
                    </button>
                  </div>
                  <div class="col-md-6 text-end">
                    <h4 class="mb-3">Total: £{{ cartTotal }}</h4>
                    <button class="btn btn-success" @click="showCheckout = true; showCart = false">
                      <i class="fas fa-credit-card me-2"></i>
                      Checkout
                    </button>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Checkout View -->
      <div v-else-if="showCheckout" class="row">
        <div class="col-lg-6 mx-auto">
          <div class="card shadow">
            <div class="card-header bg-success text-white">
              <h3 class="mb-0">
                <i class="fas fa-credit-card me-2"></i>
                Checkout
              </h3>
            </div>
            <div class="card-body">
              <form @submit.prevent="processCheckout">
                <div class="mb-3">
                  <label class="form-label">Name</label>
                  <input 
                    v-model="customerName"
                    type="text" 
                    class="form-control" 
                    :class="{'is-invalid': nameError}"
                    placeholder="Enter your full name"
                    @input="validateName"
                    required
                  >
                  <div v-if="nameError" class="invalid-feedback">
                    {{ nameError }}
                  </div>
                </div>
                
                <div class="mb-3">
                  <label class="form-label">Phone</label>
                  <input 
                    v-model="customerPhone"
                    type="tel" 
                    class="form-control"
                    :class="{'is-invalid': phoneError}" 
                    placeholder="Enter your phone number"
                    @input="validatePhone"
                    required
                  >
                  <div v-if="phoneError" class="invalid-feedback">
                    {{ phoneError }}
                  </div>
                </div>
                
                <hr>
                
                <h5 class="mb-3">Order Summary</h5>
                <div v-for="item in cart" :key="item.id" class="mb-2">
                  <div class="d-flex justify-content-between">
                    <span>{{ item.lesson.subject }} (x{{ item.quantity }})</span>
                    <span>£{{ item.lesson.price * item.quantity }}</span>
                  </div>
                </div>
                
                <hr>
                
                <div class="d-flex justify-content-between mb-4">
                  <strong>Total:</strong>
                  <strong>£{{ cartTotal }}</strong>
                </div>
                
                <div class="d-grid gap-2">
                  <button 
                    type="submit" 
                    class="btn btn-success"
                    :disabled="!isCheckoutValid || processing"
                  >
                    <span v-if="processing">
                      <span class="spinner-border spinner-border-sm me-2" role="status"></span>
                      Processing...
                    </span>
                    <span v-else>
                      <i class="fas fa-check me-2"></i>
                      Place Order
                    </span>
                  </button>
                  <button 
                    type="button" 
                    class="btn btn-secondary"
                    @click="showCheckout = false; showCart = true"
                    :disabled="processing"
                  >
                    Back to Cart
                  </button>
                </div>
              </form>
            </div>
          </div>
        </div>
      </div>

      <!-- Success Message -->
      <div v-if="orderSuccess" class="position-fixed top-50 start-50 translate-middle" style="z-index: 1050;">
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
    </main>
  </div>
</template>

<script>
import { ref, computed, onMounted } from 'vue'

export default {
  name: 'App',
  setup() {
    // API Configuration
    const apiUrl = import.meta.env.VITE_RENDER_URL || 'http://localhost:3000'
    
    // State
    const lessons = ref([])
    const displayedLessons = ref([])
    const cart = ref([])
    const loading = ref(false)
    const error = ref('')
    const showCart = ref(false)
    const showCheckout = ref(false)
    const orderSuccess = ref(false)
    const processing = ref(false)
    
    // Search and Sort
    const searchQuery = ref('')
    const sortBy = ref('')
    const sortOrder = ref('asc')
    
    // Customer Info
    const customerName = ref('')
    const customerPhone = ref('')
    const nameError = ref('')
    const phoneError = ref('')
    
    // Computed
    const totalCartItems = computed(() => {
      return cart.value.reduce((sum, item) => sum + item.quantity, 0)
    })
    
    const cartTotal = computed(() => {
      return cart.value.reduce((sum, item) => sum + (item.lesson.price * item.quantity), 0)
    })
    
    const isCheckoutValid = computed(() => {
      return customerName.value && customerPhone.value && 
             !nameError.value && !phoneError.value && cart.value.length > 0
    })
    
    // Methods
    const fetchLessons = async () => {
      loading.value = true
      error.value = ''
      
      try {
        const response = await fetch(`${apiUrl}/lessons`)
        if (!response.ok) throw new Error('Failed to fetch lessons')
        
        const data = await response.json()
        lessons.value = data
        displayedLessons.value = data
      } catch (err) {
        error.value = 'Failed to load lessons. Please try again later.'
        console.error('Error fetching lessons:', err)
      } finally {
        loading.value = false
      }
    }
    
    const searchLessons = async () => {
      if (!searchQuery.value) {
        displayedLessons.value = lessons.value
        return
      }
      
      try {
        const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(searchQuery.value)}`)
        if (!response.ok) throw new Error('Search failed')
        
        const data = await response.json()
        displayedLessons.value = data.results || []
      } catch (err) {
        console.error('Search error:', err)
        displayedLessons.value = lessons.value
      }
    }
    
    const sortLessons = () => {
      if (!sortBy.value) {
        displayedLessons.value = [...lessons.value]
        return
      }
      
      const sorted = [...displayedLessons.value].sort((a, b) => {
        let aVal = a[sortBy.value]
        let bVal = b[sortBy.value]
        
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        
        if (sortOrder.value === 'asc') {
          return aVal > bVal ? 1 : -1
        } else {
          return aVal < bVal ? 1 : -1
        }
      })
      
      displayedLessons.value = sorted
    }
    
    const getAvailableSpaces = (lessonId) => {
      const lesson = lessons.value.find(l => l._id === lessonId)
      const cartItem = cart.value.find(item => item.lesson._id === lessonId)
      const spacesInCart = cartItem ? cartItem.quantity : 0
      return lesson ? lesson.spaces - spacesInCart : 0
    }
    
    const addToCart = (lesson) => {
      const availableSpaces = getAvailableSpaces(lesson._id)
      if (availableSpaces === 0) return
      
      const existingItem = cart.value.find(item => item.lesson._id === lesson._id)
      
      if (existingItem) {
        existingItem.quantity++
      } else {
        cart.value.push({
          id: Date.now(),
          lesson: lesson,
          quantity: 1
        })
      }
    }
    
    const removeFromCart = (itemId) => {
      cart.value = cart.value.filter(item => item.id !== itemId)
    }
    
    const validateName = () => {
      if (!/^[a-zA-Z\s]+$/.test(customerName.value)) {
        nameError.value = 'Name must contain only letters and spaces'
      } else {
        nameError.value = ''
      }
    }
    
    const validatePhone = () => {
      if (!/^\d+$/.test(customerPhone.value)) {
        phoneError.value = 'Phone must contain only numbers'
      } else {
        phoneError.value = ''
      }
    }
    
    const processCheckout = async () => {
      if (!isCheckoutValid.value) return
      
      processing.value = true
      
      try {
        // Prepare order data
        const lessonIDs = cart.value.map(item => item.lesson._id)
        const numSpaces = cart.value.map(item => item.quantity)
        
        // Create order
        const orderResponse = await fetch(`${apiUrl}/orders`, {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            name: customerName.value,
            phone: customerPhone.value,
            lessonIDs,
            numSpaces
          })
        })
        
        if (!orderResponse.ok) throw new Error('Failed to create order')
        
        // Update spaces for each lesson
        for (const item of cart.value) {
          const lesson = lessons.value.find(l => l._id === item.lesson._id)
          if (lesson) {
            const newSpaces = lesson.spaces - item.quantity
            
            await fetch(`${apiUrl}/lessons/${item.lesson._id}`, {
              method: 'PUT',
              headers: { 'Content-Type': 'application/json' },
              body: JSON.stringify({ spaces: newSpaces })
            })
            
            // Update local state
            lesson.spaces = newSpaces
          }
        }
        
        orderSuccess.value = true
        showCheckout.value = false
      } catch (err) {
        error.value = 'Failed to process order. Please try again.'
        console.error('Checkout error:', err)
      } finally {
        processing.value = false
      }
    }
    
    const resetApp = () => {
      cart.value = []
      customerName.value = ''
      customerPhone.value = ''
      nameError.value = ''
      phoneError.value = ''
      showCart.value = false
      showCheckout.value = false
      orderSuccess.value = false
      searchQuery.value = ''
      sortBy.value = ''
      sortOrder.value = 'asc'
      fetchLessons()
    }
    
    const handleImageError = (event, lesson) => {
      // Fallback to icon on image error
      event.target.style.display = 'none'
      event.target.parentElement.innerHTML = `
        <div class="card-img-top bg-light d-flex align-items-center justify-content-center" style="height: 200px;">
          <i class="${lesson.icon || 'fas fa-book'} fa-4x text-muted"></i>
        </div>
      `
    }
    
    // Lifecycle
    onMounted(() => {
      fetchLessons()
    })
    
    return {
      // State
      apiUrl,
      lessons,
      displayedLessons,
      cart,
      loading,
      error,
      showCart,
      showCheckout,
      orderSuccess,
      processing,
      searchQuery,
      sortBy,
      sortOrder,
      customerName,
      customerPhone,
      nameError,
      phoneError,
      
      // Computed
      totalCartItems,
      cartTotal,
      isCheckoutValid,
      
      // Methods
      fetchLessons,
      searchLessons,
      sortLessons,
      getAvailableSpaces,
      addToCart,
      removeFromCart,
      validateName,
      validatePhone,
      processCheckout,
      resetApp,
      handleImageError
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
