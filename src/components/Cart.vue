<!-- 
  Cart.vue
  This component displays the shopping cart with all selected lessons.
  It handles displaying cart items, calculating totals, and removing items.
  
  Props:
    - cart: Array of cart items (each contains lesson and quantity)
    - show: Boolean to control cart visibility
    
  Events:
    - close: When user wants to close the cart
    - remove-item: When user removes an item from cart
    - proceed-to-checkout: When user wants to checkout
    - continue-shopping: When user wants to go back to lessons
-->
<template>
  <!-- Cart Container - Only shown when show prop is true -->
  <div v-if="show" class="cart-container">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <!-- Main Cart Card -->
        <div class="card shadow-lg">
          <!-- Card Header with Title -->
          <div class="card-header bg-primary text-white">
            <div class="d-flex justify-content-between align-items-center">
              <h3 class="mb-0">
                <i class="fas fa-shopping-cart me-2"></i>
                Shopping Cart
              </h3>
              <!-- Cart item count badge -->
              <span class="badge bg-light text-primary">
                {{ totalItems }} {{ totalItems === 1 ? 'item' : 'items' }}
              </span>
            </div>
          </div>
          
          <!-- Card Body -->
          <div class="card-body">
            <!-- Empty Cart State -->
            <div v-if="cart.length === 0" class="text-center py-5">
              <i class="fas fa-shopping-cart fa-4x text-muted mb-3"></i>
              <h4 class="text-muted">Your cart is empty</h4>
              <p class="text-muted">Add some lessons to get started!</p>
              <!-- Button to continue shopping -->
              <button 
                class="btn btn-primary"
                @click="continueShopping"
              >
                <i class="fas fa-arrow-left me-2"></i>
                Continue Shopping
              </button>
            </div>
            
            <!-- Cart Items List -->
            <div v-else>
              <!-- Header row for desktop view -->
              <div class="d-none d-md-block">
                <div class="row fw-bold border-bottom pb-2 mb-3">
                  <div class="col-md-5">Lesson</div>
                  <div class="col-md-2 text-center">Price</div>
                  <div class="col-md-2 text-center">Quantity</div>
                  <div class="col-md-2 text-center">Subtotal</div>
                  <div class="col-md-1"></div>
                </div>
              </div>
              
              <!-- Cart Items -->
              <div 
                v-for="item in cart" 
                :key="item.id"
                class="cart-item mb-3"
              >
                <div class="row align-items-center">
                  <!-- Lesson Information Column -->
                  <div class="col-md-5 mb-2 mb-md-0">
                    <h5 class="mb-1">
                      <i :class="item.lesson.icon || 'fas fa-book'" class="me-2 text-primary"></i>
                      {{ item.lesson.subject }}
                    </h5>
                    <p class="text-muted mb-1">
                      <i class="fas fa-map-marker-alt me-1"></i> 
                      {{ item.lesson.location }}
                    </p>
                    <!-- Mobile price display -->
                    <p class="d-md-none text-muted mb-0">
                      £{{ item.lesson.price }} × {{ item.quantity }} = 
                      <strong>£{{ calculateSubtotal(item) }}</strong>
                    </p>
                  </div>
                  
                  <!-- Price Column (Desktop) -->
                  <div class="col-md-2 text-center d-none d-md-block">
                    £{{ item.lesson.price }}
                  </div>
                  
                  <!-- Quantity Column (Desktop) -->
                  <div class="col-md-2 text-center d-none d-md-block">
                    <!-- Quantity Badge -->
                    <span class="badge bg-secondary fs-6">
                      {{ item.quantity }}
                    </span>
                  </div>
                  
                  <!-- Subtotal Column (Desktop) -->
                  <div class="col-md-2 text-center d-none d-md-block">
                    <strong>£{{ calculateSubtotal(item) }}</strong>
                  </div>
                  
                  <!-- Remove Button Column -->
                  <div class="col-md-1 text-end">
                    <button 
                      class="btn btn-sm btn-danger"
                      @click="removeItem(item.id)"
                      :title="`Remove ${item.lesson.subject} from cart`"
                    >
                      <i class="fas fa-trash"></i>
                    </button>
                  </div>
                </div>
                
                <!-- Divider between items -->
                <hr class="my-3">
              </div>
              
              <!-- Cart Summary Section -->
              <div class="cart-summary mt-4 p-3 bg-light rounded">
                <div class="row">
                  <!-- Summary Details -->
                  <div class="col-md-8">
                    <!-- Total Items -->
                    <div class="d-flex justify-content-between mb-2">
                      <span>Total Items:</span>
                      <span>{{ totalQuantity }} {{ totalQuantity === 1 ? 'lesson' : 'lessons' }}</span>
                    </div>
                    <!-- Subtotal -->
                    <div class="d-flex justify-content-between mb-2">
                      <span>Subtotal:</span>
                      <span>£{{ cartTotal }}</span>
                    </div>
                    <!-- Divider -->
                    <hr>
                    <!-- Grand Total -->
                    <div class="d-flex justify-content-between">
                      <h5>Total:</h5>
                      <h5 class="text-primary">£{{ cartTotal }}</h5>
                    </div>
                  </div>
                  
                  <!-- Action Buttons -->
                  <div class="col-md-4">
                    <div class="d-grid gap-2">
                      <!-- Checkout Button -->
                      <button 
                        class="btn btn-success"
                        @click="proceedToCheckout"
                        :disabled="cart.length === 0"
                      >
                        <i class="fas fa-credit-card me-2"></i>
                        Proceed to Checkout
                      </button>
                      <!-- Continue Shopping Button -->
                      <button 
                        class="btn btn-secondary"
                        @click="continueShopping"
                      >
                        <i class="fas fa-arrow-left me-2"></i>
                        Continue Shopping
                      </button>
                    </div>
                  </div>
                </div>
              </div>
              
              <!-- Additional Information -->
              <div class="alert alert-info mt-3">
                <i class="fas fa-info-circle me-2"></i>
                <small>
                  All prices are per lesson. You can remove items or continue shopping to add more lessons.
                </small>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { computed } from 'vue'

export default {
  name: 'Cart',
  
  // Props from parent component
  props: {
    // Array of cart items
    cart: {
      type: Array,
      required: true,
      default: () => []
    },
    // Control cart visibility
    show: {
      type: Boolean,
      default: false
    }
  },
  
  // Events emitted by this component
  emits: ['close', 'remove-item', 'proceed-to-checkout', 'continue-shopping'],
  
  setup(props, { emit }) {
    // Computed: Total number of unique items in cart
    const totalItems = computed(() => {
      return props.cart.length
    })
    
    // Computed: Total quantity of all items
    const totalQuantity = computed(() => {
      return props.cart.reduce((sum, item) => {
        return sum + item.quantity
      }, 0)
    })
    
    // Computed: Total price of all items in cart
    const cartTotal = computed(() => {
      const total = props.cart.reduce((sum, item) => {
        // Calculate price * quantity for each item
        return sum + (item.lesson.price * item.quantity)
      }, 0)
      
      // Return formatted to 2 decimal places
      return total.toFixed(2)
    })
    
    // Calculate subtotal for a single cart item
    const calculateSubtotal = (item) => {
      const subtotal = item.lesson.price * item.quantity
      return subtotal.toFixed(2)
    }
    
    // Remove item from cart
    const removeItem = (itemId) => {
      console.log(`Removing item with ID: ${itemId}`)
      // Find the item to log details
      const item = props.cart.find(i => i.id === itemId)
      if (item) {
        console.log(`Removing ${item.lesson.subject} from cart`)
      }
      // Emit event for parent to handle
      emit('remove-item', itemId)
    }
    
    // Proceed to checkout
    const proceedToCheckout = () => {
      console.log('Proceeding to checkout')
      console.log(`Cart has ${props.cart.length} items totaling £${cartTotal.value}`)
      // Emit event for parent to handle
      emit('proceed-to-checkout')
    }
    
    // Continue shopping (close cart)
    const continueShopping = () => {
      console.log('Continuing shopping')
      // Emit event for parent to handle
      emit('continue-shopping')
    }
    
    // Return all reactive properties and methods
    return {
      totalItems,
      totalQuantity,
      cartTotal,
      calculateSubtotal,
      removeItem,
      proceedToCheckout,
      continueShopping
    }
  }
}
</script>

<style scoped>
/* Cart container styles */
.cart-container {
  min-height: 400px;
  padding: 2rem 0;
}

/* Cart item hover effect */
.cart-item {
  transition: background-color 0.2s;
  padding: 0.5rem;
  border-radius: 0.25rem;
}

.cart-item:hover {
  background-color: rgba(0, 0, 0, 0.02);
}

/* Cart summary styling */
.cart-summary {
  border: 2px solid #e9ecef;
}

/* Button hover effects */
.btn {
  transition: all 0.2s ease-in-out;
}

.btn:hover {
  transform: translateY(-2px);
}

/* Remove button special hover */
.btn-danger:hover {
  background-color: #dc3545;
  border-color: #dc3545;
  box-shadow: 0 0.125rem 0.25rem rgba(220, 53, 69, 0.4);
}

/* Badge styling */
.badge {
  padding: 0.5em 0.75em;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .cart-container {
    padding: 1rem;
  }
  
  .card {
    margin: 0;
  }
}

/* Empty cart icon animation */
@keyframes cartBounce {
  0%, 100% {
    transform: translateY(0);
  }
  50% {
    transform: translateY(-10px);
  }
}

.fa-shopping-cart.fa-4x {
  animation: cartBounce 2s infinite;
}
</style>
