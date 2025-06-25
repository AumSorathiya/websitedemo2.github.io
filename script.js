// Mobile Navigation Toggle
document.addEventListener('DOMContentLoaded', function() {
    const mobileMenu = document.getElementById('mobile-menu');
    const navMenu = document.getElementById('nav-menu');
    
    mobileMenu.addEventListener('click', function() {
        navMenu.classList.toggle('active');
    });
    
    // Close mobile menu when clicking on a link
    const navLinks = document.querySelectorAll('.nav-link');
    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            navMenu.classList.remove('active');
        });
    });
});

// Smooth Scrolling for Navigation Links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        e.preventDefault();
        const target = document.querySelector(this.getAttribute('href'));
        if (target) {
            target.scrollIntoView({
                behavior: 'smooth',
                block: 'start'
            });
        }
    });
});

// Navbar Scroll Effect
window.addEventListener('scroll', function() {
    const navbar = document.getElementById('navbar');
    if (window.scrollY > 100) {
        navbar.style.backgroundColor = 'rgba(255, 255, 255, 0.95)';
        navbar.style.backdropFilter = 'blur(10px)';
    } else {
        navbar.style.backgroundColor = '#ffffff';
        navbar.style.backdropFilter = 'none';
    }
});

// Animated Counter for Hero Statistics
async function animateCounters() {
    // Fetch real statistics from the API
    let stats = { customers: 10000, products: 500, brands: 50 };
    
    try {
        const response = await fetch('/api/stats');
        if (response.ok) {
            const data = await response.json();
            stats = {
                customers: data.customers || 10000,
                products: data.products || 500,
                brands: data.brands || 50
            };
        }
    } catch (error) {
        console.log('Using default stats due to API error:', error);
    }
    
    const customersTarget = stats.customers;
    const productsTarget = stats.products;
    const brandsTarget = stats.brands;
    
    const customersElement = document.getElementById('customers-count');
    const productsElement = document.getElementById('products-count');
    const brandsElement = document.getElementById('brands-count');
    
    const duration = 2000; // 2 seconds
    const steps = 60;
    const stepDuration = duration / steps;
    
    let currentStep = 0;
    
    const timer = setInterval(() => {
        currentStep++;
        const progress = currentStep / steps;
        
        // Easing function for smooth animation
        const easeProgress = 1 - Math.pow(1 - progress, 3);
        
        const customersValue = Math.floor(customersTarget * easeProgress);
        const productsValue = Math.floor(productsTarget * easeProgress);
        const brandsValue = Math.floor(brandsTarget * easeProgress);
        
        customersElement.textContent = customersValue.toLocaleString() + '+';
        productsElement.textContent = productsValue + '+';
        brandsElement.textContent = brandsValue + '+';
        
        if (currentStep >= steps) {
            customersElement.textContent = customersTarget.toLocaleString() + '+';
            productsElement.textContent = productsTarget + '+';
            brandsElement.textContent = brandsTarget + '+';
            clearInterval(timer);
        }
    }, stepDuration);
}

// Intersection Observer for Hero Statistics Animation
const heroObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting && entry.target.id === 'home') {
            animateCounters();
            heroObserver.unobserve(entry.target); // Only animate once
        }
    });
}, {
    threshold: 0.5
});

// Start observing the hero section
const heroSection = document.getElementById('home');
if (heroSection) {
    heroObserver.observe(heroSection);
}

// Proceed to Checkout
function proceedToCheckout() {
    if (cart.length === 0) {
        showToast('Your cart is empty!', 'info');
        return;
    }
    
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    
    checkoutModal.classList.add('show');
    checkoutOverlay.classList.add('show');
    
    updateCheckoutSummary();
}

// Close Checkout
function closeCheckout() {
    const checkoutModal = document.getElementById('checkout-modal');
    const checkoutOverlay = document.getElementById('checkout-overlay');
    
    checkoutModal.classList.remove('show');
    checkoutOverlay.classList.remove('show');
}

// Update Checkout Summary
function updateCheckoutSummary() {
    const checkoutItemsContainer = document.getElementById('checkout-items');
    const subtotalElement = document.getElementById('subtotal');
    const taxElement = document.getElementById('tax');
    const finalTotalElement = document.getElementById('final-total');
    
    const itemsHTML = cart.map(item => `
        <div style="display: flex; justify-content: space-between; margin-bottom: 10px; padding: 10px; background: rgba(255, 255, 255, 0.05); border-radius: 5px;">
            <span>${item.title} x ${item.quantity}</span>
            <span>$${(item.price * item.quantity).toFixed(2)}</span>
        </div>
    `).join('');
    
    checkoutItemsContainer.innerHTML = itemsHTML;
    
    const subtotal = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    const shipping = 9.99;
    const tax = subtotal * 0.08; // 8% tax
    const total = subtotal + shipping + tax;
    
    subtotalElement.textContent = `$${subtotal.toFixed(2)}`;
    taxElement.textContent = `$${tax.toFixed(2)}`;
    finalTotalElement.textContent = `$${total.toFixed(2)}`;
}

// Handle Checkout Form Submission
document.addEventListener('DOMContentLoaded', function() {
    const checkoutForm = document.getElementById('checkout-form');
    
    checkoutForm.addEventListener('submit', async function(e) {
        e.preventDefault();
        
        const formData = new FormData(checkoutForm);
        const customerData = Object.fromEntries(formData);
        
        const orderData = {
            customer: customerData,
            items: cart,
            totals: {
                subtotal: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0),
                shipping: 9.99,
                tax: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08,
                total: cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) + 9.99 + (cart.reduce((sum, item) => sum + (item.price * item.quantity), 0) * 0.08)
            },
            orderDate: new Date().toISOString()
        };
        
        try {
            const response = await fetch('/api/checkout', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify(orderData),
            });
            
            if (response.ok) {
                showToast('Order placed successfully! Check your email for confirmation.', 'success');
                
                // Clear cart
                cart = [];
                localStorage.setItem('styleHubCart', JSON.stringify(cart));
                updateCartCount();
                updateCartDisplay();
                
                // Close modals
                closeCheckout();
                toggleCart();
                
                // Show success modal
                setTimeout(() => {
                    alert('🎉 Order Placed Successfully!\n\nYour order has been confirmed and will be processed shortly.\nA confirmation email has been sent to mdsorathiya56@gmail.com\n\nThank you for shopping with StyleHub!');
                }, 500);
                
            } else {
                throw new Error('Failed to place order');
            }
        } catch (error) {
            console.error('Checkout error:', error);
            showToast('Failed to place order. Please try again.', 'error');
        }
    });
});

// Load dynamic content when page loads
document.addEventListener('DOMContentLoaded', function() {
    loadProducts();
    updateCartCount();
    updateCartDisplay();
});

// Add to Cart Function
function addToCart(productTitle, productId, price, imageUrl) {
    const existingItem = cart.find(item => item.id === productId);
    
    if (existingItem) {
        existingItem.quantity += 1;
    } else {
        cart.push({
            id: productId,
            title: productTitle,
            price: parseFloat(price),
            imageUrl: imageUrl,
            quantity: 1
        });
    }
    
    localStorage.setItem('styleHubCart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    
    // Show success animation
    showToast(`Added "${productTitle}" to cart!`, 'success');
}

// Remove from Cart
function removeFromCart(productId) {
    cart = cart.filter(item => item.id !== productId);
    localStorage.setItem('styleHubCart', JSON.stringify(cart));
    updateCartCount();
    updateCartDisplay();
    showToast('Item removed from cart', 'info');
}

// Update Cart Count
function updateCartCount() {
    const totalItems = cart.reduce((sum, item) => sum + item.quantity, 0);
    const cartCountElements = document.querySelectorAll('.cart-count');
    cartCountElements.forEach(element => {
        element.textContent = totalItems;
    });
}

// Update Cart Display
function updateCartDisplay() {
    const cartItemsContainer = document.getElementById('cart-items');
    const cartTotalElement = document.getElementById('cart-total');
    
    if (cart.length === 0) {
        cartItemsContainer.innerHTML = `
            <div style="text-align: center; padding: 40px; color: var(--gray-400);">
                <i class="fas fa-shopping-cart" style="font-size: 3rem; margin-bottom: 15px;"></i>
                <p>Your cart is empty</p>
                <p style="font-size: 0.9rem;">Add some stylish items to get started!</p>
            </div>
        `;
        cartTotalElement.textContent = '0.00';
        return;
    }
    
    const cartHTML = cart.map(item => `
        <div class="cart-item">
            <img src="${item.imageUrl || 'https://via.placeholder.com/60x60'}" alt="${item.title}">
            <div class="cart-item-info">
                <div class="cart-item-name">${item.title}</div>
                <div class="cart-item-price">$${item.price.toFixed(2)} x ${item.quantity}</div>
            </div>
            <button class="cart-item-remove" onclick="removeFromCart(${item.id})">
                <i class="fas fa-times"></i>
            </button>
        </div>
    `).join('');
    
    cartItemsContainer.innerHTML = cartHTML;
    
    const total = cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
    cartTotalElement.textContent = total.toFixed(2);
}

// Toggle Cart Sidebar
function toggleCart() {
    const cartSidebar = document.getElementById('cart-sidebar');
    const cartOverlay = document.getElementById('cart-overlay');
    
    cartSidebar.classList.toggle('open');
    cartOverlay.classList.toggle('show');
}

// Show Toast Notification
function showToast(message, type = 'info') {
    const toast = document.createElement('div');
    toast.className = `toast toast-${type}`;
    toast.innerHTML = `
        <i class="fas ${type === 'success' ? 'fa-check' : 'fa-info-circle'}"></i>
        <span>${message}</span>
    `;
    
    toast.style.cssText = `
        position: fixed;
        top: 100px;
        right: 20px;
        background: rgba(10, 10, 10, 0.95);
        backdrop-filter: blur(20px);
        border: 1px solid var(--glass-border);
        color: var(--white);
        padding: 15px 20px;
        border-radius: 10px;
        z-index: 4000;
        transform: translateX(400px);
        transition: transform 0.3s ease;
        box-shadow: 0 10px 30px rgba(0, 0, 0, 0.3);
        font-family: 'Orbitron', monospace;
        display: flex;
        align-items: center;
        gap: 10px;
    `;
    
    if (type === 'success') {
        toast.style.borderColor = 'var(--cyber-green)';
        toast.style.boxShadow = '0 0 20px rgba(0, 255, 127, 0.3)';
    }
    
    document.body.appendChild(toast);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(0)';
    }, 100);
    
    setTimeout(() => {
        toast.style.transform = 'translateX(400px)';
        setTimeout(() => {
            document.body.removeChild(toast);
        }, 300);
    }, 3000);
}

// Shopping Cart Management
let cart = JSON.parse(localStorage.getItem('styleHubCart')) || [];

// Load products dynamically from database
async function loadProducts() {
    try {
        const response = await fetch('/api/products');
        if (!response.ok) {
            throw new Error('Failed to fetch products');
        }
        
        const products = await response.json();
        const productsContainer = document.querySelector('.products-grid');
        
        if (productsContainer && products.length > 0) {
            productsContainer.innerHTML = products.map(product => `
                <div class="product-card">
                    <img src="${product.imageUrl || 'https://via.placeholder.com/800x400'}" 
                         alt="Product image for ${product.title}">
                    <div class="product-content">
                        <div class="product-header">
                            <span class="product-category ${getCategoryClass(product.category)}">${product.category}</span>
                            <div class="product-rating">
                                <i class="fas fa-star"></i>
                                <span>${product.rating}</span>
                            </div>
                        </div>
                        <h3>${product.title}</h3>
                        <p>${product.description}</p>
                        <div class="product-footer">
                            <span class="product-price">$${product.price}</span>
                            <button class="btn-add-to-cart" onclick="addToCart('${product.title}', ${product.id}, '${product.price}', '${product.imageUrl}')">
                                <i class="fas fa-cart-plus"></i> Add to Cart
                            </button>
                        </div>
                    </div>
                </div>
            `).join('');
            
            // Add smooth fade-in effect
            const cards = document.querySelectorAll('.product-card');
            cards.forEach((card, index) => {
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                setTimeout(() => {
                    card.style.transition = 'all 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, index * 100);
            });
        }
    } catch (error) {
        console.error('Error loading products:', error);
    }
}

function getCategoryClass(category) {
    const categoryMap = {
        'Men': 'brown',
        'Women': 'gold', 
        'Accessories': 'forest',
        'Footwear': 'brown',
        'Casual': 'gold',
        'Formal': 'brown'
    };
    return categoryMap[category] || 'brown';
}

// Newsletter Subscription
document.getElementById('newsletter-form').addEventListener('submit', async function(e) {
    e.preventDefault();
    
    const emailInput = document.getElementById('email-input');
    const submitBtn = document.getElementById('subscribe-btn');
    const email = emailInput.value.trim();
    
    if (!email) {
        alert('Please enter a valid email address.');
        return;
    }
    
    // Email validation
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(email)) {
        alert('Please enter a valid email format.');
        return;
    }
    
    // Show loading state
    submitBtn.textContent = 'Subscribing...';
    submitBtn.disabled = true;
    emailInput.disabled = true;
    
    try {
        const response = await fetch('/api/newsletter/subscribe', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email }),
        });
        
        const data = await response.json();
        
        if (response.ok) {
            alert(`Thank you for subscribing with ${email}! You'll receive our latest updates and course announcements.`);
            emailInput.value = '';
        } else if (response.status === 409) {
            alert('This email is already subscribed to our newsletter.');
        } else {
            alert('Failed to subscribe. Please try again.');
        }
    } catch (error) {
        console.error('Newsletter subscription error:', error);
        alert('Failed to subscribe. Please check your connection and try again.');
    } finally {
        // Reset form state
        submitBtn.textContent = 'Subscribe';
        submitBtn.disabled = false;
        emailInput.disabled = false;
    }
});

// Scroll-triggered animations for elements
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const elementsToAnimate = document.querySelectorAll('.feature-card, .course-card, .testimonial-card, .about-stat');

const scrollObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.classList.add('animate-fadeIn');
            scrollObserver.unobserve(entry.target);
        }
    });
}, observerOptions);

elementsToAnimate.forEach(element => {
    scrollObserver.observe(element);
});

// Parallax effect for hero background circles
window.addEventListener('scroll', function() {
    const scrolled = window.pageYOffset;
    const circles = document.querySelectorAll('.hero-circle');
    
    circles.forEach((circle, index) => {
        const speed = 0.5 + (index * 0.2);
        const yPos = -(scrolled * speed);
        circle.style.transform = `translateY(${yPos}px)`;
    });
});

// Dynamic text typing effect for hero title (optional enhancement)
function typeWriter(element, text, speed = 100) {
    let i = 0;
    element.innerHTML = '';
    
    function type() {
        if (i < text.length) {
            element.innerHTML += text.charAt(i);
            i++;
            setTimeout(type, speed);
        }
    }
    
    type();
}

// Add hover effects for interactive elements
document.querySelectorAll('.course-card').forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transform = 'scale(1.02) translateY(-5px)';
    });
    
    card.addEventListener('mouseleave', function() {
        this.style.transform = 'scale(1) translateY(0)';
    });
});

// Add click effects for buttons
document.querySelectorAll('button').forEach(button => {
    button.addEventListener('click', function() {
        this.style.transform = 'scale(0.95)';
        setTimeout(() => {
            this.style.transform = 'scale(1)';
        }, 150);
    });
});

// Lazy loading for images (performance optimization)
const images = document.querySelectorAll('img');
const imageObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            const img = entry.target;
            img.classList.add('loaded');
            imageObserver.unobserve(img);
        }
    });
});

images.forEach(img => {
    imageObserver.observe(img);
});

// Add loading states and error handling for images
images.forEach(img => {
    img.addEventListener('load', function() {
        this.style.opacity = '1';
    });
    
    img.addEventListener('error', function() {
        this.alt = 'Image could not be loaded';
        this.style.backgroundColor = '#f0f0f0';
        this.style.border = '1px solid #ddd';
    });
});

// Console welcome message
console.log(`
👕 Welcome to StyleHub Fashion Platform!
━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━━

This is a demo website showcasing:
✓ Responsive design
✓ Smooth animations
✓ Interactive elements
✓ Modern e-commerce features

Built with HTML, CSS, and JavaScript
`);

// Performance monitoring (basic)
window.addEventListener('load', function() {
    const loadTime = performance.now();
    console.log(`Page loaded in ${Math.round(loadTime)}ms`);
});

// Error handling for the entire application
window.addEventListener('error', function(e) {
    console.error('Application error:', e.error);
    // In production, you might want to send this to an error tracking service
});

// Service worker registration (for PWA capabilities)
if ('serviceWorker' in navigator) {
    window.addEventListener('load', function() {
        // Service worker would be registered here in a production app
        console.log('Service Worker support detected');
    });
}