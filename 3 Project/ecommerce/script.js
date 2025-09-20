// E-commerce Platform - Main Script
class EcommerceApp {
    constructor() {
        this.products = [];
        this.cart = [];
        this.currentCategory = 'all';
        this.init();
    }

    init() {
        this.loadProducts();
        this.setupEventListeners();
        this.updateCartCount();
    }

    // Load Products Data
    loadProducts() {
        this.products = [
            {
                id: 1,
                name: 'MacBook Pro 16"',
                description: 'Apple MacBook Pro with M2 chip, 16GB RAM, 512GB SSD',
                price: 1999,
                category: 'laptops',
                image: 'fas fa-laptop',
                rating: 4.8,
                inStock: true
            },
            {
                id: 2,
                name: 'iPhone 15 Pro',
                description: 'Latest iPhone with A17 Pro chip, 128GB storage',
                price: 999,
                category: 'phones',
                image: 'fas fa-mobile-alt',
                rating: 4.9,
                inStock: true
            },
            {
                id: 3,
                name: 'AirPods Pro 2nd Gen',
                description: 'Wireless earbuds with active noise cancellation',
                price: 249,
                category: 'accessories',
                image: 'fas fa-headphones',
                rating: 4.7,
                inStock: true
            },
            {
                id: 4,
                name: 'Dell XPS 13',
                description: 'Ultrabook with Intel i7, 16GB RAM, 512GB SSD',
                price: 1299,
                category: 'laptops',
                image: 'fas fa-laptop',
                rating: 4.6,
                inStock: true
            },
            {
                id: 5,
                name: 'Samsung Galaxy S24',
                description: 'Android flagship with Snapdragon 8 Gen 3',
                price: 899,
                category: 'phones',
                image: 'fas fa-mobile-alt',
                rating: 4.5,
                inStock: true
            },
            {
                id: 6,
                name: 'Magic Mouse',
                description: 'Apple Magic Mouse with multi-touch surface',
                price: 79,
                category: 'accessories',
                image: 'fas fa-mouse',
                rating: 4.3,
                inStock: true
            },
            {
                id: 7,
                name: 'iPad Pro 12.9"',
                description: 'Apple iPad Pro with M2 chip, 256GB storage',
                price: 1099,
                category: 'laptops',
                image: 'fas fa-tablet-alt',
                rating: 4.8,
                inStock: true
            },
            {
                id: 8,
                name: 'Sony WH-1000XM5',
                description: 'Premium noise-canceling headphones',
                price: 399,
                category: 'accessories',
                image: 'fas fa-headphones',
                rating: 4.9,
                inStock: true
            }
        ];

        this.renderProducts();
    }

    // Setup Event Listeners
    setupEventListeners() {
        // Navigation
        document.querySelectorAll('.nav-link').forEach(link => {
            link.addEventListener('click', (e) => {
                e.preventDefault();
                this.handleNavigation(link);
            });
        });

        // Filter buttons
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.addEventListener('click', (e) => {
                this.handleFilter(e.target.dataset.category);
            });
        });

        // Search
        document.getElementById('searchInput').addEventListener('input', (e) => {
            this.handleSearch(e.target.value);
        });

        // Checkout form
        document.getElementById('checkoutForm').addEventListener('submit', (e) => {
            e.preventDefault();
            this.handleCheckout();
        });

        // Close modals when clicking outside
        document.addEventListener('click', (e) => {
            if (e.target.classList.contains('modal')) {
                this.closeCheckout();
            }
            if (e.target.classList.contains('cart-sidebar')) {
                this.toggleCart();
            }
        });
    }

    // Navigation Handler
    handleNavigation(link) {
        // Update active nav link
        document.querySelectorAll('.nav-link').forEach(l => l.classList.remove('active'));
        link.classList.add('active');

        // Scroll to section
        const targetId = link.getAttribute('href').substring(1);
        if (targetId === 'products') {
            document.getElementById('products').scrollIntoView({ behavior: 'smooth' });
        }
    }

    // Filter Handler
    handleFilter(category) {
        this.currentCategory = category;
        
        // Update active filter button
        document.querySelectorAll('.filter-btn').forEach(btn => {
            btn.classList.remove('active');
        });
        document.querySelector(`[data-category="${category}"]`).classList.add('active');

        this.renderProducts();
    }

    // Search Handler
    handleSearch(query) {
        const filteredProducts = this.products.filter(product => {
            const matchesCategory = this.currentCategory === 'all' || product.category === this.currentCategory;
            const matchesSearch = product.name.toLowerCase().includes(query.toLowerCase()) ||
                                product.description.toLowerCase().includes(query.toLowerCase());
            return matchesCategory && matchesSearch;
        });

        this.renderProducts(filteredProducts);
    }

    // Render Products
    renderProducts(productsToRender = null) {
        const products = productsToRender || this.products.filter(product => {
            return this.currentCategory === 'all' || product.category === this.currentCategory;
        });

        const productsGrid = document.getElementById('productsGrid');
        productsGrid.innerHTML = '';

        products.forEach(product => {
            const productElement = this.createProductElement(product);
            productsGrid.appendChild(productElement);
        });
    }

    // Create Product Element
    createProductElement(product) {
        const productDiv = document.createElement('div');
        productDiv.className = 'product-item';
        productDiv.innerHTML = `
            <div class="product-image">
                <i class="${product.image}"></i>
            </div>
            <div class="product-info">
                <h3 class="product-name">${product.name}</h3>
                <p class="product-description">${product.description}</p>
                <div class="product-price">$${product.price}</div>
                <button class="add-to-cart" onclick="ecommerceApp.addToCart(${product.id})">
                    <i class="fas fa-cart-plus"></i>
                    Add to Cart
                </button>
            </div>
        `;

        return productDiv;
    }

    // Add to Cart
    addToCart(productId) {
        const product = this.products.find(p => p.id === productId);
        if (!product) return;

        const existingItem = this.cart.find(item => item.id === productId);
        if (existingItem) {
            existingItem.quantity += 1;
        } else {
            this.cart.push({
                ...product,
                quantity: 1
            });
        }

        this.updateCartCount();
        this.renderCartItems();
        this.showNotification(`${product.name} added to cart!`);
    }

    // Remove from Cart
    removeFromCart(productId) {
        this.cart = this.cart.filter(item => item.id !== productId);
        this.updateCartCount();
        this.renderCartItems();
    }

    // Update Quantity
    updateQuantity(productId, change) {
        const item = this.cart.find(item => item.id === productId);
        if (!item) return;

        item.quantity += change;
        if (item.quantity <= 0) {
            this.removeFromCart(productId);
        } else {
            this.updateCartCount();
            this.renderCartItems();
        }
    }

    // Update Cart Count
    updateCartCount() {
        const totalItems = this.cart.reduce((sum, item) => sum + item.quantity, 0);
        document.getElementById('cartCount').textContent = totalItems;
    }

    // Render Cart Items
    renderCartItems() {
        const cartItems = document.getElementById('cartItems');
        cartItems.innerHTML = '';

        if (this.cart.length === 0) {
            cartItems.innerHTML = '<p style="text-align: center; color: #666; padding: 2rem;">Your cart is empty</p>';
            return;
        }

        this.cart.forEach(item => {
            const cartItem = document.createElement('div');
            cartItem.className = 'cart-item';
            cartItem.innerHTML = `
                <div class="cart-item-image">
                    <i class="${item.image}"></i>
                </div>
                <div class="cart-item-info">
                    <div class="cart-item-name">${item.name}</div>
                    <div class="cart-item-price">$${item.price}</div>
                    <div class="quantity-controls">
                        <button class="quantity-btn" onclick="ecommerceApp.updateQuantity(${item.id}, -1)">
                            <i class="fas fa-minus"></i>
                        </button>
                        <span class="quantity">${item.quantity}</span>
                        <button class="quantity-btn" onclick="ecommerceApp.updateQuantity(${item.id}, 1)">
                            <i class="fas fa-plus"></i>
                        </button>
                    </div>
                </div>
                <button class="remove-item" onclick="ecommerceApp.removeFromCart(${item.id})">
                    <i class="fas fa-trash"></i>
                </button>
            `;
            cartItems.appendChild(cartItem);
        });

        // Update total
        const total = this.cart.reduce((sum, item) => sum + (item.price * item.quantity), 0);
        document.getElementById('cartTotal').textContent = total.toFixed(2);
    }

    // Toggle Cart
    toggleCart() {
        const cartSidebar = document.getElementById('cartSidebar');
        cartSidebar.classList.toggle('open');
        this.renderCartItems();
    }

    // Checkout
    checkout() {
        if (this.cart.length === 0) {
            this.showNotification('Your cart is empty!', 'error');
            return;
        }

        const modal = document.getElementById('checkoutModal');
        modal.classList.add('active');
    }

    // Handle Checkout Form
    handleCheckout() {
        const formData = {
            fullName: document.getElementById('fullName').value,
            email: document.getElementById('email').value,
            address: document.getElementById('address').value,
            payment: document.getElementById('payment').value
        };

        // Validate form
        if (!formData.fullName || !formData.email || !formData.address || !formData.payment) {
            this.showNotification('Please fill in all fields', 'error');
            return;
        }

        // Simulate order processing
        this.showNotification('Processing your order...', 'info');
        
        setTimeout(() => {
            this.showNotification('Order placed successfully!', 'success');
            this.cart = [];
            this.updateCartCount();
            this.renderCartItems();
            this.closeCheckout();
            this.toggleCart();
        }, 2000);
    }

    // Close Checkout
    closeCheckout() {
        const modal = document.getElementById('checkoutModal');
        modal.classList.remove('active');
        document.getElementById('checkoutForm').reset();
    }

    // Toggle User Menu
    toggleUserMenu() {
        const userMenu = document.getElementById('userMenu');
        userMenu.classList.toggle('active');
    }

    // Show Notification
    showNotification(message, type = 'success') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check-circle' : type === 'error' ? 'exclamation-circle' : 'info-circle'}"></i>
            <span>${message}</span>
        `;

        // Add styles
        notification.style.cssText = `
            position: fixed;
            top: 100px;
            right: 20px;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#2563eb'};
            color: white;
            padding: 1rem 1.5rem;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 4000;
            display: flex;
            align-items: center;
            gap: 0.5rem;
            animation: slideIn 0.3s ease;
        `;

        document.body.appendChild(notification);

        setTimeout(() => {
            notification.style.animation = 'slideOut 0.3s ease';
            setTimeout(() => notification.remove(), 300);
        }, 3000);
    }
}

// Global Functions
function toggleCart() {
    ecommerceApp.toggleCart();
}

function toggleUserMenu() {
    ecommerceApp.toggleUserMenu();
}

function checkout() {
    ecommerceApp.checkout();
}

function closeCheckout() {
    ecommerceApp.closeCheckout();
}

function scrollToSection(sectionId) {
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Initialize App
const ecommerceApp = new EcommerceApp();

// Add CSS for notifications
const notificationStyles = `
    @keyframes slideIn {
        from {
            transform: translateX(100%);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(100%);
            opacity: 0;
        }
    }
`;

const styleSheet = document.createElement('style');
styleSheet.textContent = notificationStyles;
document.head.appendChild(styleSheet);

// Close user menu when clicking outside
document.addEventListener('click', (e) => {
    const userMenu = document.getElementById('userMenu');
    const userIcon = document.querySelector('.user-icon');
    
    if (!userIcon.contains(e.target) && !userMenu.contains(e.target)) {
        userMenu.classList.remove('active');
    }
});
