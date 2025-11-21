<!-- 
  LessonCard.vue
  This component displays a single lesson card with all its details.
  It handles displaying lesson information and adding items to cart.
  
  Props:
    - lesson: Object containing lesson details (subject, location, price, spaces, etc.)
    - availableSpaces: Number of spaces available after accounting for cart items
    
  Events:
    - add-to-cart: Emitted when user clicks "Add to Cart" button
-->
<template>
  <!-- Main card container with hover effect -->
  <div class="card h-100 shadow-sm hover-shadow">
    <!-- 
      Image Section
      Displays lesson image or falls back to icon if image fails to load
    -->
    <div class="card-img-container" style="height: 200px; overflow: hidden; position: relative;">
      <!-- Try to load the actual image first -->
      <img 
        v-if="!imageError && lesson.image" 
        :src="imageUrl" 
        class="card-img-top" 
        :alt="`Image for ${lesson.subject} lesson`"
        style="height: 200px; width: 100%; object-fit: cover;"
        @error="handleImageError"
      >
      <!-- Fallback to icon if image fails or doesn't exist -->
      <div 
        v-else 
        class="card-img-top bg-light d-flex align-items-center justify-content-center" 
        style="height: 200px;"
      >
        <!-- Use lesson icon or default book icon -->
        <i :class="lesson.icon || 'fas fa-book'" class="fa-4x text-muted"></i>
      </div>
    </div>
    
    <!-- Card Body containing lesson details -->
    <div class="card-body">
      <!-- Lesson Subject/Title with icon -->
      <h5 class="card-title d-flex align-items-center">
        <i :class="lesson.icon || 'fas fa-book'" class="me-2 text-primary"></i>
        <span>{{ lesson.subject }}</span>
      </h5>
      
      <!-- Location Information -->
      <p class="card-text">
        <i class="fas fa-map-marker-alt text-danger me-2"></i>
        <span>{{ lesson.location }}</span>
      </p>
      
      <!-- Price Information -->
      <p class="card-text">
        <i class="fas fa-pound-sign text-success me-2"></i>
        <strong>£{{ lesson.price }}</strong> per lesson
      </p>
      
      <!-- Available Spaces with warning color if low -->
      <p class="card-text">
        <i class="fas fa-users text-info me-2"></i>
        <!-- Add danger text class if spaces are 2 or less -->
        <span :class="{'text-danger fw-bold': availableSpaces <= 2}">
          {{ availableSpaces }} {{ availableSpaces === 1 ? 'space' : 'spaces' }} available
        </span>
      </p>
      
      <!-- Add to Cart Button -->
      <button 
        class="btn btn-primary w-100"
        :disabled="availableSpaces === 0"
        @click="addToCart"
        :title="availableSpaces === 0 ? 'This lesson is fully booked' : 'Add this lesson to your cart'"
      >
        <!-- Icon changes based on availability -->
        <i :class="availableSpaces === 0 ? 'fas fa-ban' : 'fas fa-cart-plus'" class="me-2"></i>
        <!-- Button text changes based on availability -->
        {{ availableSpaces === 0 ? 'Fully Booked' : 'Add to Cart' }}
      </button>
    </div>
  </div>
</template>

<script>
import { ref, computed } from 'vue'

export default {
  name: 'LessonCard',
  
  // Props received from parent component
  props: {
    // Lesson object containing all lesson details
    lesson: {
      type: Object,
      required: true,
      validator: (value) => {
        // Validate that lesson has required properties
        return value.subject && value.location && 
               typeof value.price === 'number' && 
               typeof value.spaces === 'number'
      }
    },
    // Number of spaces available after accounting for cart items
    availableSpaces: {
      type: Number,
      required: true,
      default: 0
    }
  },
  
  // Events emitted by this component
  emits: ['add-to-cart'],
  
  setup(props, { emit }) {
    // Track if image has failed to load
    const imageError = ref(false)
    
    // Get API URL from environment variables with fallback to production URL
    const apiUrl = import.meta.env.VITE_RENDER_URL || 'https://famy-backend.onrender.com'
    
    // Computed property to build the full image URL
    const imageUrl = computed(() => {
      // If lesson has an image, build full URL, otherwise return empty
      return props.lesson.image 
        ? `${apiUrl}/images/${props.lesson.image}` 
        : ''
    })
    
    // Handle image loading errors
    const handleImageError = () => {
      console.log(`Failed to load image for ${props.lesson.subject}`)
      // Set error flag to true to trigger fallback icon display
      imageError.value = true
    }
    
    // Handle add to cart action
    const addToCart = () => {
      // Only emit event if spaces are available
      if (props.availableSpaces > 0) {
        console.log(`Adding ${props.lesson.subject} to cart`)
        // Emit event with lesson data for parent to handle
        emit('add-to-cart', props.lesson)
      } else {
        console.warn('Cannot add to cart: No spaces available')
      }
    }
    
    // Return reactive properties and methods to template
    return {
      imageError,
      imageUrl,
      handleImageError,
      addToCart
    }
  }
}
</script>

<style scoped>
/* Card hover effect - lifts card slightly on hover */
.hover-shadow {
  transition: all 0.3s ease-in-out;
  cursor: pointer;
}

.hover-shadow:hover {
  transform: translateY(-5px);
  box-shadow: 0 0.5rem 1rem rgba(0, 0, 0, 0.15) !important;
}

/* Smooth transition for card animations */
.card {
  transition: transform 0.2s;
}

/* Ensure card title doesn't overflow */
.card-title {
  overflow: hidden;
  text-overflow: ellipsis;
  white-space: nowrap;
}

/* Make button transitions smooth */
.btn {
  transition: all 0.2s ease-in-out;
}

/* Add disabled button styling */
.btn:disabled {
  cursor: not-allowed;
  opacity: 0.6;
}
</style>
