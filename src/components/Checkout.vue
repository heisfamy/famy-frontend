<!-- 
  Checkout.vue
  This component handles the checkout process including customer information,
  order validation, and submitting the order to the backend.
  
  Props:
    - cart: Array of cart items to be purchased
    - show: Boolean to control checkout visibility
    
  Events:
    - back-to-cart: When user wants to go back to cart
    - order-success: When order is successfully placed
    - order-error: When there's an error placing the order
-->
<template>
  <!-- Checkout Container - Only shown when show prop is true -->
  <div v-if="show" class="checkout-container">
    <div class="row">
      <div class="col-lg-8 mx-auto">
        <!-- Main Checkout Card -->
        <div class="card shadow-lg">
          <!-- Card Header -->
          <div class="card-header bg-success text-white">
            <h3 class="mb-0">
              <i class="fas fa-credit-card me-2"></i>
              Checkout
            </h3>
          </div>
          
          <!-- Card Body -->
          <div class="card-body">
            <!-- Checkout Form -->
            <form @submit.prevent="processCheckout" novalidate>
              <!-- Customer Information Section -->
              <div class="mb-4">
                <h5 class="mb-3">
                  <i class="fas fa-user me-2"></i>
                  Customer Information
                </h5>
                
                <!-- Name Field -->
                <div class="mb-3">
                  <label for="customerName" class="form-label">
                    Full Name <span class="text-danger">*</span>
                  </label>
                  <input 
                    id="customerName"
                    v-model="customerName"
                    type="text" 
                    class="form-control" 
                    :class="{
                      'is-invalid': nameError && nameTouched,
                      'is-valid': !nameError && nameTouched && customerName
                    }"
                    placeholder="Enter your full name (letters only)"
                    @blur="nameTouched = true; validateName()"
                    @input="validateName"
                    required
                    aria-describedby="nameHelp nameError"
                  >
                  <!-- Help text -->
                  <small id="nameHelp" class="form-text text-muted">
                    Name must contain only letters and spaces
                  </small>
                  <!-- Error message -->
                  <div v-if="nameError && nameTouched" id="nameError" class="invalid-feedback">
                    {{ nameError }}
                  </div>
                </div>
                
                <!-- Phone Field -->
                <div class="mb-3">
                  <label for="customerPhone" class="form-label">
                    Phone Number <span class="text-danger">*</span>
                  </label>
                  <input 
                    id="customerPhone"
                    v-model="customerPhone"
                    type="tel" 
                    class="form-control"
                    :class="{
                      'is-invalid': phoneError && phoneTouched,
                      'is-valid': !phoneError && phoneTouched && customerPhone
                    }"
                    placeholder="Enter your phone number (numbers only)"
                    @blur="phoneTouched = true; validatePhone()"
                    @input="validatePhone"
                    required
                    aria-describedby="phoneHelp phoneError"
                  >
                  <!-- Help text -->
                  <small id="phoneHelp" class="form-text text-muted">
                    Phone must contain only numbers (e.g., 1234567890)
                  </small>
                  <!-- Error message -->
                  <div v-if="phoneError && phoneTouched" id="phoneError" class="invalid-feedback">
                    {{ phoneError }}
                  </div>
                </div>
              </div>
              
              <hr>
              
              <!-- Order Summary Section -->
              <div class="mb-4">
                <h5 class="mb-3">
                  <i class="fas fa-list me-2"></i>
                  Order Summary
                </h5>
                
                <!-- Order Items Table -->
                <div class="table-responsive">
                  <table class="table table-sm">
                    <thead class="table-light">
                      <tr>
                        <th>Lesson</th>
                        <th class="text-center">Quantity</th>
                        <th class="text-end">Price</th>
                        <th class="text-end">Subtotal</th>
                      </tr>
                    </thead>
                    <tbody>
                      <!-- Loop through cart items -->
                      <tr v-for="item in cart" :key="item.id">
                        <td>
                          <i :class="item.lesson.icon || 'fas fa-book'" class="me-1 text-primary"></i>
                          {{ item.lesson.subject }}
                          <br>
                          <small class="text-muted">
                            <i class="fas fa-map-marker-alt me-1"></i>
                            {{ item.lesson.location }}
                          </small>
                        </td>
                        <td class="text-center">{{ item.quantity }}</td>
                        <td class="text-end">£{{ item.lesson.price }}</td>
                        <td class="text-end">£{{ (item.lesson.price * item.quantity).toFixed(2) }}</td>
                      </tr>
                    </tbody>
                    <tfoot class="table-light">
                      <tr>
                        <th colspan="3" class="text-end">Total:</th>
                        <th class="text-end text-primary">£{{ cartTotal }}</th>
                      </tr>
                    </tfoot>
                  </table>
                </div>
                
                <!-- Additional Order Information -->
                <div class="alert alert-info">
                  <i class="fas fa-info-circle me-2"></i>
                  <small>
                    By placing this order, you confirm your enrollment in the selected lessons.
                    Spaces will be reserved immediately upon order confirmation.
                  </small>
                </div>
              </div>
              
              <!-- Action Buttons -->
              <div class="d-grid gap-2 d-md-flex justify-content-md-between">
                <!-- Back to Cart Button -->
                <button 
                  type="button" 
                  class="btn btn-secondary"
                  @click="backToCart"
                  :disabled="processing"
                >
                  <i class="fas fa-arrow-left me-2"></i>
                  Back to Cart
                </button>
                
                <!-- Place Order Button -->
                <button 
                  type="submit" 
                  class="btn btn-success"
                  :disabled="!isFormValid || processing"
                >
                  <!-- Show spinner when processing -->
                  <span v-if="processing">
                    <span class="spinner-border spinner-border-sm me-2" role="status">
                      <span class="visually-hidden">Processing...</span>
                    </span>
                    Processing Order...
                  </span>
                  <!-- Normal state -->
                  <span v-else>
                    <i class="fas fa-check me-2"></i>
                    Place Order (£{{ cartTotal }})
                  </span>
                </button>
              </div>
            </form>
          </div>
        </div>
        
        <!-- Processing Overlay -->
        <div v-if="processing" class="processing-overlay">
          <div class="text-center">
            <div class="spinner-border text-light mb-3" style="width: 3rem; height: 3rem;" role="status">
              <span class="visually-hidden">Processing...</span>
            </div>
            <p class="text-light">Processing your order, please wait...</p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'Checkout',
  
  // Props from parent component
  props: {
    // Cart items to checkout
    cart: {
      type: Array,
      required: true,
      default: () => []
    },
    // Control checkout visibility
    show: {
      type: Boolean,
      default: false
    }
  },
  
  // Events emitted by this component
  emits: ['back-to-cart', 'order-success', 'order-error'],
  
  setup(props, { emit }) {
    // Form fields
    const customerName = ref('')      // Customer's name
    const customerPhone = ref('')     // Customer's phone
    
    // Form validation state
    const nameError = ref('')         // Name field error message
    const phoneError = ref('')        // Phone field error message
    const nameTouched = ref(false)    // Has name field been touched
    const phoneTouched = ref(false)   // Has phone field been touched
    
    // Processing state
    const processing = ref(false)      // Is order being processed
    
    // Get API URL from environment
    const apiUrl = import.meta.env.VITE_RENDER_URL || 'http://localhost:3000'
    
    // Computed: Calculate cart total
    const cartTotal = computed(() => {
      const total = props.cart.reduce((sum, item) => {
        return sum + (item.lesson.price * item.quantity)
      }, 0)
      return total.toFixed(2)
    })
    
    // Computed: Check if form is valid
    const isFormValid = computed(() => {
      // Form is valid if:
      // 1. Name is filled and has no errors
      // 2. Phone is filled and has no errors
      // 3. Cart has items
      return customerName.value && 
             customerPhone.value && 
             !nameError.value && 
             !phoneError.value && 
             props.cart.length > 0
    })
    
    // Validate name field
    const validateName = () => {
      const name = customerName.value.trim()
      
      // Check if empty
      if (!name) {
        nameError.value = 'Name is required'
        return false
      }
      
      // Check if contains only letters and spaces
      // Regex explanation: ^ = start, [a-zA-Z\s] = letters and spaces, + = one or more, $ = end
      const nameRegex = /^[a-zA-Z\s]+$/
      if (!nameRegex.test(name)) {
        nameError.value = 'Name must contain only letters and spaces'
        return false
      }
      
      // Check minimum length
      if (name.length < 2) {
        nameError.value = 'Name must be at least 2 characters long'
        return false
      }
      
      // Check maximum length
      if (name.length > 50) {
        nameError.value = 'Name must be less than 50 characters'
        return false
      }
      
      // Valid name
      nameError.value = ''
      console.log('Name validation passed')
      return true
    }
    
    // Validate phone field
    const validatePhone = () => {
      const phone = customerPhone.value.trim()
      
      // Check if empty
      if (!phone) {
        phoneError.value = 'Phone number is required'
        return false
      }
      
      // Check if contains only digits
      // Regex explanation: ^ = start, \d = digit, + = one or more, $ = end
      const phoneRegex = /^\d+$/
      if (!phoneRegex.test(phone)) {
        phoneError.value = 'Phone must contain only numbers'
        return false
      }
      
      // Check minimum length (assuming minimum 10 digits)
      if (phone.length < 10) {
        phoneError.value = 'Phone number must be at least 10 digits'
        return false
      }
      
      // Check maximum length
      if (phone.length > 15) {
        phoneError.value = 'Phone number must be less than 15 digits'
        return false
      }
      
      // Valid phone
      phoneError.value = ''
      console.log('Phone validation passed')
      return true
    }
    
    // Process checkout
    const processCheckout = async () => {
      console.log('Starting checkout process')
      
      // Final validation
      nameTouched.value = true
      phoneTouched.value = true
      
      if (!validateName() || !validatePhone()) {
        console.error('Form validation failed')
        return
      }
      
      // Set processing state
      processing.value = true
      
      try {
        // Prepare order data
        const orderData = {
          name: customerName.value.trim(),
          phone: customerPhone.value.trim(),
          lessonIDs: props.cart.map(item => item.lesson._id),
          numSpaces: props.cart.map(item => item.quantity)
        }
        
        console.log('Submitting order:', orderData)
        
        // Step 1: Create the order
        const orderResponse = await fetch(`${apiUrl}/orders`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json'
          },
          body: JSON.stringify(orderData)
        })
        
        if (!orderResponse.ok) {
          const errorData = await orderResponse.json()
          throw new Error(errorData.error || 'Failed to create order')
        }
        
        const orderResult = await orderResponse.json()
        console.log('Order created successfully:', orderResult)
        
        // Step 2: Update lesson spaces for each item in cart
        for (const item of props.cart) {
          console.log(`Updating spaces for ${item.lesson.subject}`)
          
          // Calculate new spaces (original spaces minus quantity ordered)
          const newSpaces = item.lesson.spaces - item.quantity
          
          // Update lesson spaces
          const updateResponse = await fetch(`${apiUrl}/lessons/${item.lesson._id}`, {
            method: 'PUT',
            headers: {
              'Content-Type': 'application/json'
            },
            body: JSON.stringify({ spaces: newSpaces })
          })
          
          if (!updateResponse.ok) {
            console.error(`Failed to update spaces for lesson ${item.lesson._id}`)
            // Continue with other updates even if one fails
          } else {
            console.log(`Successfully updated spaces for ${item.lesson.subject}`)
          }
        }
        
        // Success! Emit success event
        console.log('Order completed successfully!')
        emit('order-success', {
          orderId: orderResult.orderId,
          order: orderResult.order,
          customer: {
            name: customerName.value,
            phone: customerPhone.value
          }
        })
        
        // Reset form
        resetForm()
        
      } catch (error) {
        console.error('Checkout error:', error)
        // Emit error event for parent to handle
        emit('order-error', error.message || 'Failed to process order')
      } finally {
        // Reset processing state
        processing.value = false
      }
    }
    
    // Go back to cart
    const backToCart = () => {
      console.log('Going back to cart')
      emit('back-to-cart')
    }
    
    // Reset form
    const resetForm = () => {
      customerName.value = ''
      customerPhone.value = ''
      nameError.value = ''
      phoneError.value = ''
      nameTouched.value = false
      phoneTouched.value = false
    }
    
    // Return all reactive properties and methods
    return {
      customerName,
      customerPhone,
      nameError,
      phoneError,
      nameTouched,
      phoneTouched,
      processing,
      cartTotal,
      isFormValid,
      validateName,
      validatePhone,
      processCheckout,
      backToCart
    }
  }
}
</script>

<style scoped>
/* Checkout container styles */
.checkout-container {
  min-height: 400px;
  padding: 2rem 0;
}

/* Form validation styles */
.form-control.is-valid {
  border-color: #28a745;
  background-image: url("data:image/svg+xml,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 8 8'%3e%3cpath fill='%2328a745' d='M2.3 6.73L.6 4.53c-.4-1.04.46-1.4 1.1-.8l1.1 1.4 3.4-3.8c.6-.63 1.6-.27 1.2.7l-4 4.6c-.43.5-.8.4-1.1.1z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right calc(0.375em + 0.1875rem) center;
  background-size: calc(0.75em + 0.375rem) calc(0.75em + 0.375rem);
}

/* Processing overlay */
.processing-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background: rgba(0, 0, 0, 0.7);
  display: flex;
  align-items: center;
  justify-content: center;
  z-index: 9999;
}

/* Table styles */
.table-responsive {
  margin: 1rem 0;
}

/* Button styles */
.btn {
  transition: all 0.2s ease-in-out;
}

.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}

/* Responsive adjustments */
@media (max-width: 768px) {
  .checkout-container {
    padding: 1rem;
  }
  
  .table {
    font-size: 0.875rem;
  }
}

/* Form help text styling */
.form-text {
  font-size: 0.875rem;
  margin-top: 0.25rem;
}

/* Alert styling */
.alert {
  font-size: 0.9rem;
}
</style>
