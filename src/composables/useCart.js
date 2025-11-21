/**
 * Cart Management Composable
 * 
 * This composable provides cart functionality that can be reused across components.
 * It handles cart state, local storage persistence, and cart operations.
 * 
 * Author: Junior Developer
 * Date: 2024
 */

import { ref, computed, watch } from 'vue';
import { STORAGE_KEYS, CART_CONFIG } from '@/constants';
import { handleApiError } from '@/utils/api';

/**
 * Cart composable that provides cart management functionality
 * @returns {Object} - Cart state and methods
 */
export function useCart() {
  // Reactive cart state
  const cart = ref([]);
  
  // Load cart from local storage on initialization
  const loadCartFromStorage = () => {
    try {
      const storedCart = localStorage.getItem(STORAGE_KEYS.CART);
      if (storedCart) {
        cart.value = JSON.parse(storedCart);
      }
    } catch (error) {
      console.warn('Failed to load cart from local storage:', error);
      cart.value = [];
    }
  };
  
  // Save cart to local storage
  const saveCartToStorage = () => {
    try {
      localStorage.setItem(STORAGE_KEYS.CART, JSON.stringify(cart.value));
    } catch (error) {
      console.warn('Failed to save cart to local storage:', error);
    }
  };
  
  // Watch for cart changes and save to local storage
  watch(cart, saveCartToStorage, { deep: true });
  
  // Initialize cart from local storage
  loadCartFromStorage();
  
  // Computed properties
  const cartItemCount = computed(() => {
    return cart.value.reduce((total, item) => total + item.quantity, 0);
  });
  
  const cartTotal = computed(() => {
    return cart.value.reduce((total, item) => {
      return total + (item.price * item.quantity);
    }, 0);
  });
  
  const isCartEmpty = computed(() => {
    return cart.value.length === 0;
  });
  
  const cartItems = computed(() => {
    return cart.value.map(item => ({
      ...item,
      subtotal: item.price * item.quantity,
    }));
  });
  
  /**
   * Add a lesson to the cart
   * @param {Object} lesson - The lesson to add
   * @param {number} quantity - The quantity to add (default: 1)
   * @returns {boolean} - True if added successfully
   */
  const addToCart = (lesson, quantity = 1) => {
    try {
      // Validate inputs
      if (!lesson || !lesson._id) {
        throw new Error('Invalid lesson data');
      }
      
      if (quantity < CART_CONFIG.MIN_QUANTITY_PER_LESSON || 
          quantity > CART_CONFIG.MAX_QUANTITY_PER_LESSON) {
        throw new Error(`Quantity must be between ${CART_CONFIG.MIN_QUANTITY_PER_LESSON} and ${CART_CONFIG.MAX_QUANTITY_PER_LESSON}`);
      }
      
      // Check if lesson is already in cart
      const existingItem = cart.value.find(item => item._id === lesson._id);
      
      if (existingItem) {
        // Update quantity if item exists
        const newQuantity = existingItem.quantity + quantity;
        if (newQuantity > CART_CONFIG.MAX_QUANTITY_PER_LESSON) {
          throw new Error(`Maximum quantity per lesson is ${CART_CONFIG.MAX_QUANTITY_PER_LESSON}`);
        }
        existingItem.quantity = newQuantity;
      } else {
        // Add new item to cart
        cart.value.push({
          _id: lesson._id,
          subject: lesson.subject,
          location: lesson.location,
          price: lesson.price,
          image: lesson.image,
          icon: lesson.icon,
          quantity: quantity,
          addedAt: new Date().toISOString(),
        });
      }
      
      return true;
    } catch (error) {
      console.error('Failed to add to cart:', error);
      throw error;
    }
  };
  
  /**
   * Remove a lesson from the cart
   * @param {string} lessonId - The ID of the lesson to remove
   * @returns {boolean} - True if removed successfully
   */
  const removeFromCart = (lessonId) => {
    try {
      const index = cart.value.findIndex(item => item._id === lessonId);
      if (index !== -1) {
        cart.value.splice(index, 1);
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to remove from cart:', error);
      throw error;
    }
  };
  
  /**
   * Update the quantity of a lesson in the cart
   * @param {string} lessonId - The ID of the lesson to update
   * @param {number} newQuantity - The new quantity
   * @returns {boolean} - True if updated successfully
   */
  const updateQuantity = (lessonId, newQuantity) => {
    try {
      // Validate quantity
      if (newQuantity < CART_CONFIG.MIN_QUANTITY_PER_LESSON || 
          newQuantity > CART_CONFIG.MAX_QUANTITY_PER_LESSON) {
        throw new Error(`Quantity must be between ${CART_CONFIG.MIN_QUANTITY_PER_LESSON} and ${CART_CONFIG.MAX_QUANTITY_PER_LESSON}`);
      }
      
      const item = cart.value.find(item => item._id === lessonId);
      if (item) {
        item.quantity = newQuantity;
        return true;
      }
      return false;
    } catch (error) {
      console.error('Failed to update quantity:', error);
      throw error;
    }
  };
  
  /**
   * Clear the entire cart
   */
  const clearCart = () => {
    try {
      cart.value = [];
    } catch (error) {
      console.error('Failed to clear cart:', error);
      throw error;
    }
  };
  
  /**
   * Get the quantity of a specific lesson in the cart
   * @param {string} lessonId - The ID of the lesson
   * @returns {number} - The quantity in cart (0 if not in cart)
   */
  const getQuantityInCart = (lessonId) => {
    const item = cart.value.find(item => item._id === lessonId);
    return item ? item.quantity : 0;
  };
  
  /**
   * Check if a lesson is in the cart
   * @param {string} lessonId - The ID of the lesson
   * @returns {boolean} - True if lesson is in cart
   */
  const isInCart = (lessonId) => {
    return cart.value.some(item => item._id === lessonId);
  };
  
  /**
   * Prepare cart data for order submission
   * @returns {Object} - Order data ready for API submission
   */
  const prepareOrderData = (customerInfo) => {
    if (isCartEmpty.value) {
      throw new Error('Cannot place order with empty cart');
    }
    
    return {
      name: customerInfo.name,
      phone: customerInfo.phone,
      lessonIDs: cart.value.map(item => item._id),
      numSpaces: cart.value.map(item => item.quantity),
    };
  };
  
  /**
   * Get cart summary for display
   * @returns {Object} - Cart summary information
   */
  const getCartSummary = () => {
    return {
      itemCount: cartItemCount.value,
      total: cartTotal.value,
      isEmpty: isCartEmpty.value,
      items: cartItems.value,
    };
  };
  
  return {
    // State
    cart,
    
    // Computed properties
    cartItemCount,
    cartTotal,
    isCartEmpty,
    cartItems,
    
    // Methods
    addToCart,
    removeFromCart,
    updateQuantity,
    clearCart,
    getQuantityInCart,
    isInCart,
    prepareOrderData,
    getCartSummary,
    loadCartFromStorage,
    saveCartToStorage,
  };
}
