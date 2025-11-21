<!-- 
  LessonsList.vue
  This component manages the display of all lessons in a grid layout.
  It handles searching, sorting, and displaying lesson cards.
  
  Props:
    - lessons: Array of lesson objects from the parent
    - cart: Array of cart items to calculate available spaces
    
  Events:
    - add-to-cart: Bubbled up from LessonCard when item is added to cart
-->
<template>
  <div class="lessons-container">
    <!-- Search and Sort Controls Section -->
    <div class="row mb-4">
      <!-- Search Input Column -->
      <div class="col-md-6 mb-3 mb-md-0">
        <div class="input-group">
          <!-- Search icon prefix -->
          <span class="input-group-text">
            <i class="fas fa-search"></i>
          </span>
          <!-- Search input field -->
          <input 
            v-model="searchQuery"
            type="text" 
            class="form-control" 
            placeholder="Search lessons by subject, location, or price..."
            @input="handleSearch"
            aria-label="Search lessons"
          >
          <!-- Clear button when there's text -->
          <button 
            v-if="searchQuery" 
            class="btn btn-outline-secondary"
            @click="clearSearch"
            type="button"
            aria-label="Clear search"
          >
            <i class="fas fa-times"></i>
          </button>
        </div>
      </div>
      
      <!-- Sort Controls Column -->
      <div class="col-md-6">
        <div class="d-flex gap-2">
          <!-- Sort By Dropdown -->
          <select 
            v-model="sortBy" 
            class="form-select" 
            @change="handleSort"
            aria-label="Sort lessons by"
          >
            <option value="">Sort by...</option>
            <option value="subject">Subject (A-Z)</option>
            <option value="location">Location (A-Z)</option>
            <option value="price">Price</option>
            <option value="spaces">Available Spaces</option>
          </select>
          
          <!-- Sort Order Toggle Button -->
          <button 
            class="btn btn-outline-secondary" 
            @click="toggleSortOrder"
            :disabled="!sortBy"
            :title="sortOrder === 'asc' ? 'Sort ascending' : 'Sort descending'"
            aria-label="Toggle sort order"
          >
            <i :class="sortOrder === 'asc' ? 'fas fa-sort-up' : 'fas fa-sort-down'"></i>
          </button>
          
          <!-- Reset Filters Button -->
          <button 
            v-if="searchQuery || sortBy"
            class="btn btn-outline-danger" 
            @click="resetFilters"
            title="Reset all filters"
            aria-label="Reset filters"
          >
            <i class="fas fa-redo"></i>
          </button>
        </div>
      </div>
    </div>
    
    <!-- Results Count Display -->
    <div v-if="searchQuery || sortBy" class="alert alert-info mb-3">
      <i class="fas fa-info-circle me-2"></i>
      Showing {{ displayedLessons.length }} of {{ lessons.length }} lessons
      <span v-if="searchQuery"> matching "{{ searchQuery }}"</span>
      <span v-if="sortBy"> sorted by {{ sortBy }}</span>
    </div>
    
    <!-- Loading State -->
    <div v-if="loading" class="text-center py-5">
      <div class="spinner-border text-primary" role="status">
        <span class="visually-hidden">Loading lessons...</span>
      </div>
      <p class="mt-2 text-muted">Loading lessons...</p>
    </div>
    
    <!-- Error State -->
    <div v-else-if="error" class="alert alert-danger">
      <i class="fas fa-exclamation-triangle me-2"></i>
      {{ error }}
    </div>
    
    <!-- Empty State (no lessons at all) -->
    <div v-else-if="lessons.length === 0" class="alert alert-warning">
      <i class="fas fa-exclamation-circle me-2"></i>
      No lessons available at the moment. Please check back later.
    </div>
    
    <!-- No Results State (after filtering) -->
    <div v-else-if="displayedLessons.length === 0" class="alert alert-info">
      <i class="fas fa-search me-2"></i>
      No lessons found matching your criteria. Try adjusting your search or filters.
    </div>
    
    <!-- Lessons Grid -->
    <div v-else class="row g-4">
      <!-- Loop through each lesson and create a card -->
      <div 
        v-for="lesson in displayedLessons" 
        :key="lesson._id"
        class="col-sm-6 col-md-4 col-lg-3"
      >
        <!-- LessonCard Component -->
        <LessonCard 
          :lesson="lesson"
          :available-spaces="getAvailableSpaces(lesson._id)"
          @add-to-cart="handleAddToCart"
        />
      </div>
    </div>
  </div>
</template>

<script>
import { ref, computed, watch } from 'vue'
import LessonCard from './LessonCard.vue'

export default {
  name: 'LessonsList',
  
  // Register child components
  components: {
    LessonCard
  },
  
  // Props from parent component
  props: {
    // Array of lesson objects
    lessons: {
      type: Array,
      required: true,
      default: () => []
    },
    // Cart items to calculate available spaces
    cart: {
      type: Array,
      required: true,
      default: () => []
    },
    // Loading state
    loading: {
      type: Boolean,
      default: false
    },
    // Error message
    error: {
      type: String,
      default: ''
    }
  },
  
  // Events emitted by this component
  emits: ['add-to-cart', 'search', 'sort'],
  
  setup(props, { emit }) {
    // Local state for search and sort
    const searchQuery = ref('')          // Current search text
    const sortBy = ref('')               // Current sort field
    const sortOrder = ref('asc')         // Sort order: 'asc' or 'desc'
    const displayedLessons = ref([...props.lessons]) // Lessons to display after filtering
    
    // Get API URL for searching
    const apiUrl = import.meta.env.VITE_RENDER_URL || 'http://localhost:3000'
    
    // Calculate available spaces for a lesson
    // Subtracts cart quantity from total spaces
    const getAvailableSpaces = (lessonId) => {
      // Find the lesson in the original array
      const lesson = props.lessons.find(l => l._id === lessonId)
      if (!lesson) return 0
      
      // Find if this lesson is in the cart
      const cartItem = props.cart.find(item => item.lesson._id === lessonId)
      
      // Calculate remaining spaces
      const spacesInCart = cartItem ? cartItem.quantity : 0
      const available = lesson.spaces - spacesInCart
      
      // Return available spaces (minimum 0)
      return Math.max(0, available)
    }
    
    // Handle search functionality
    const handleSearch = async () => {
      const query = searchQuery.value.trim()
      
      // If search is empty, show all lessons
      if (!query) {
        displayedLessons.value = [...props.lessons]
        return
      }
      
      console.log(`Searching for: ${query}`)
      
      try {
        // Make API call to search endpoint
        const response = await fetch(`${apiUrl}/search?q=${encodeURIComponent(query)}`)
        
        if (!response.ok) {
          throw new Error('Search failed')
        }
        
        const data = await response.json()
        console.log(`Found ${data.results.length} results`)
        
        // Update displayed lessons with search results
        displayedLessons.value = data.results || []
        
        // Emit search event for parent tracking
        emit('search', query, data.results)
      } catch (error) {
        console.error('Search error:', error)
        // On error, fall back to client-side filtering
        performClientSideSearch(query)
      }
    }
    
    // Client-side search fallback
    const performClientSideSearch = (query) => {
      const lowerQuery = query.toLowerCase()
      
      // Filter lessons that match the query
      displayedLessons.value = props.lessons.filter(lesson => {
        return (
          // Check if subject contains query
          lesson.subject.toLowerCase().includes(lowerQuery) ||
          // Check if location contains query
          lesson.location.toLowerCase().includes(lowerQuery) ||
          // Check if price matches (for numeric queries)
          lesson.price.toString().includes(query) ||
          // Check if spaces matches (for numeric queries)
          lesson.spaces.toString().includes(query)
        )
      })
    }
    
    // Clear search and show all lessons
    const clearSearch = () => {
      searchQuery.value = ''
      displayedLessons.value = [...props.lessons]
      console.log('Search cleared')
    }
    
    // Handle sorting
    const handleSort = () => {
      if (!sortBy.value) {
        // If no sort selected, show original order
        displayedLessons.value = [...props.lessons]
        return
      }
      
      console.log(`Sorting by ${sortBy.value} in ${sortOrder.value} order`)
      
      // Create a copy and sort it
      const sorted = [...displayedLessons.value].sort((a, b) => {
        let aVal = a[sortBy.value]
        let bVal = b[sortBy.value]
        
        // Handle string comparison (case-insensitive)
        if (typeof aVal === 'string') {
          aVal = aVal.toLowerCase()
          bVal = bVal.toLowerCase()
        }
        
        // Determine sort direction
        if (sortOrder.value === 'asc') {
          return aVal > bVal ? 1 : aVal < bVal ? -1 : 0
        } else {
          return aVal < bVal ? 1 : aVal > bVal ? -1 : 0
        }
      })
      
      displayedLessons.value = sorted
      
      // Emit sort event for parent tracking
      emit('sort', sortBy.value, sortOrder.value)
    }
    
    // Toggle between ascending and descending order
    const toggleSortOrder = () => {
      sortOrder.value = sortOrder.value === 'asc' ? 'desc' : 'asc'
      console.log(`Sort order changed to ${sortOrder.value}`)
      
      // Re-apply sort with new order
      if (sortBy.value) {
        handleSort()
      }
    }
    
    // Reset all filters and sorting
    const resetFilters = () => {
      console.log('Resetting all filters')
      searchQuery.value = ''
      sortBy.value = ''
      sortOrder.value = 'asc'
      displayedLessons.value = [...props.lessons]
    }
    
    // Handle add to cart event from child
    const handleAddToCart = (lesson) => {
      console.log(`Adding ${lesson.subject} to cart from LessonsList`)
      // Bubble event up to parent
      emit('add-to-cart', lesson)
    }
    
    // Watch for changes in lessons prop and update displayed lessons
    watch(() => props.lessons, (newLessons) => {
      console.log('Lessons updated, refreshing display')
      displayedLessons.value = [...newLessons]
      
      // Re-apply search/sort if active
      if (searchQuery.value) {
        handleSearch()
      } else if (sortBy.value) {
        handleSort()
      }
    }, { deep: true })
    
    // Return all reactive properties and methods
    return {
      searchQuery,
      sortBy,
      sortOrder,
      displayedLessons,
      getAvailableSpaces,
      handleSearch,
      clearSearch,
      handleSort,
      toggleSortOrder,
      resetFilters,
      handleAddToCart
    }
  }
}
</script>

<style scoped>
/* Container styles */
.lessons-container {
  padding: 1rem 0;
}

/* Responsive grid adjustments */
@media (max-width: 576px) {
  .col-sm-6 {
    padding: 0 0.5rem;
  }
}

/* Alert styling improvements */
.alert {
  display: flex;
  align-items: center;
}

/* Button group styling */
.btn-group {
  white-space: nowrap;
}

/* Search input focus state */
.form-control:focus {
  border-color: #0d6efd;
  box-shadow: 0 0 0 0.25rem rgba(13, 110, 253, 0.25);
}

/* Loading spinner centering */
.spinner-border {
  width: 3rem;
  height: 3rem;
}
</style>
