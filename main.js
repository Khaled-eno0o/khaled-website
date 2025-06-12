// Eno E-commerce Platform - Main JavaScript
// Created: May 2025
// Description: Main JavaScript file for Eno e-commerce platform

document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const mobileMenuToggle = document.getElementById('mobile-menu-toggle');
    const navMenu = document.getElementById('nav-menu');
    
    if (mobileMenuToggle && navMenu) {
        mobileMenuToggle.addEventListener('click', function() {
            navMenu.classList.toggle('active');
        });
    }
    
    // Modal Functionality
    const accountBtn = document.getElementById('account-btn');
    const loginModal = document.getElementById('login-modal');
    const registerModal = document.getElementById('register-modal');
    const loginModalClose = document.getElementById('login-modal-close');
    const registerModalClose = document.getElementById('register-modal-close');
    const registerLink = document.getElementById('register-link');
    const loginLink = document.getElementById('login-link');
    
    // Open login modal when account button is clicked
    if (accountBtn && loginModal) {
        accountBtn.addEventListener('click', function() {
            loginModal.classList.add('active');
        });
    }
    
    // Close login modal
    if (loginModalClose && loginModal) {
        loginModalClose.addEventListener('click', function() {
            loginModal.classList.remove('active');
        });
    }
    
    // Close register modal
    if (registerModalClose && registerModal) {
        registerModalClose.addEventListener('click', function() {
            registerModal.classList.remove('active');
        });
    }
    
    // Switch to register modal
    if (registerLink && loginModal && registerModal) {
        registerLink.addEventListener('click', function(e) {
            e.preventDefault();
            loginModal.classList.remove('active');
            registerModal.classList.add('active');
        });
    }
    
    // Switch to login modal
    if (loginLink && loginModal && registerModal) {
        loginLink.addEventListener('click', function(e) {
            e.preventDefault();
            registerModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }
    
    // Close modals when clicking outside
    window.addEventListener('click', function(e) {
        if (e.target === loginModal) {
            loginModal.classList.remove('active');
        }
        if (e.target === registerModal) {
            registerModal.classList.remove('active');
        }
    });
    
    // Form Validation
    const loginForm = document.getElementById('login-form');
    const registerForm = document.getElementById('register-form');
    
    if (loginForm) {
        loginForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = document.getElementById('login-email').value;
            const password = document.getElementById('login-password').value;
            
            // Basic validation
            if (!email || !password) {
                alert('الرجاء إدخال البريد الإلكتروني وكلمة المرور');
                return;
            }
            
            // Here you would normally send the data to the server
            // For now, we'll just simulate a successful login
            alert('تم تسجيل الدخول بنجاح!');
            loginModal.classList.remove('active');
            
            // Update UI to show logged in state
            if (accountBtn) {
                accountBtn.innerHTML = '<i class="fas fa-user-check"></i>';
            }
        });
    }
    
    if (registerForm) {
        registerForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = document.getElementById('register-name').value;
            const email = document.getElementById('register-email').value;
            const phone = document.getElementById('register-phone').value;
            const password = document.getElementById('register-password').value;
            const confirmPassword = document.getElementById('register-confirm-password').value;
            const terms = document.getElementById('terms').checked;
            
            // Basic validation
            if (!name || !email || !phone || !password || !confirmPassword) {
                alert('الرجاء إكمال جميع الحقول المطلوبة');
                return;
            }
            
            if (password !== confirmPassword) {
                alert('كلمات المرور غير متطابقة');
                return;
            }
            
            if (!terms) {
                alert('يجب الموافقة على الشروط والأحكام');
                return;
            }
            
            // Password strength validation
            const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
            if (!passwordRegex.test(password)) {
                alert('يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتتضمن أحرف كبيرة وصغيرة وأرقام');
                return;
            }
            
            // Here you would normally send the data to the server
            // For now, we'll just simulate a successful registration
            alert('تم إنشاء الحساب بنجاح!');
            registerModal.classList.remove('active');
            loginModal.classList.add('active');
        });
    }
    
    // Back to Top Button
    const backToTopBtn = document.getElementById('back-to-top');
    
    if (backToTopBtn) {
        window.addEventListener('scroll', function() {
            if (window.pageYOffset > 300) {
                backToTopBtn.classList.add('active');
            } else {
                backToTopBtn.classList.remove('active');
            }
        });
        
        backToTopBtn.addEventListener('click', function() {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    }
    
    // Product Quick View (for future implementation)
    const quickViewBtns = document.querySelectorAll('.quick-view-btn');
    
    quickViewBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            // Implementation for quick view functionality
            // This would typically fetch product details and show a modal
        });
    });
    
    // Add to Cart Functionality
    const addToCartBtns = document.querySelectorAll('.add-to-cart');
    let cartCount = 0;
    
    addToCartBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            cartCount++;
            updateCartCount(cartCount);
            
            // Get product info
            const productCard = this.closest('.product-card');
            const productTitle = productCard.querySelector('.product-title').textContent;
            const productPrice = productCard.querySelector('.current-price').textContent;
            
            // Show confirmation message
            showNotification(`تمت إضافة "${productTitle}" إلى سلة التسوق`);
        });
    });
    
    // Update cart count badge
    function updateCartCount(count) {
        const cartBadge = document.querySelector('#cart-btn .badge');
        if (cartBadge) {
            cartBadge.textContent = count;
        }
    }
    
    // Notification system
    function showNotification(message) {
        // Create notification element
        const notification = document.createElement('div');
        notification.className = 'notification';
        notification.innerHTML = `
            <div class="notification-content">
                <i class="fas fa-check-circle"></i>
                <span>${message}</span>
            </div>
            <button class="notification-close">&times;</button>
        `;
        
        // Add styles
        notification.style.position = 'fixed';
        notification.style.bottom = '20px';
        notification.style.right = '20px';
        notification.style.backgroundColor = 'var(--success)';
        notification.style.color = 'white';
        notification.style.padding = '15px';
        notification.style.borderRadius = '4px';
        notification.style.boxShadow = '0 4px 8px rgba(0,0,0,0.1)';
        notification.style.zIndex = '9999';
        notification.style.display = 'flex';
        notification.style.justifyContent = 'space-between';
        notification.style.alignItems = 'center';
        notification.style.minWidth = '300px';
        notification.style.transform = 'translateX(400px)';
        notification.style.transition = 'transform 0.3s ease';
        
        // Add to DOM
        document.body.appendChild(notification);
        
        // Animate in
        setTimeout(() => {
            notification.style.transform = 'translateX(0)';
        }, 10);
        
        // Close button functionality
        const closeBtn = notification.querySelector('.notification-close');
        closeBtn.addEventListener('click', () => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        });
        
        // Auto close after 5 seconds
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                if (document.body.contains(notification)) {
                    document.body.removeChild(notification);
                }
            }, 300);
        }, 5000);
    }
    
    // Wishlist Functionality
    const wishlistBtns = document.querySelectorAll('.wishlist-btn');
    let wishlistCount = 0;
    
    wishlistBtns.forEach(btn => {
        btn.addEventListener('click', function(e) {
            e.preventDefault();
            
            // Toggle wishlist state
            const icon = this.querySelector('i');
            if (icon.classList.contains('far')) {
                icon.classList.remove('far');
                icon.classList.add('fas');
                this.style.backgroundColor = 'var(--danger)';
                this.style.color = 'var(--white)';
                wishlistCount++;
                
                // Get product info
                const productCard = this.closest('.product-card');
                const productTitle = productCard.querySelector('.product-title').textContent;
                
                showNotification(`تمت إضافة "${productTitle}" إلى المفضلة`);
            } else {
                icon.classList.remove('fas');
                icon.classList.add('far');
                this.style.backgroundColor = 'var(--light-gray)';
                this.style.color = 'var(--dark-gray)';
                wishlistCount--;
            }
            
            updateWishlistCount(wishlistCount);
        });
    });
    
    // Update wishlist count badge
    function updateWishlistCount(count) {
        const wishlistBadge = document.querySelector('#wishlist-btn .badge');
        if (wishlistBadge) {
            wishlistBadge.textContent = count;
        }
    }
    
    // Newsletter Form
    const newsletterForm = document.querySelector('.newsletter-form');
    
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const email = this.querySelector('input[type="email"]').value;
            
            if (!email) {
                alert('الرجاء إدخال بريدك الإلكتروني');
                return;
            }
            
            // Here you would normally send the data to the server
            // For now, we'll just simulate a successful subscription
            showNotification('تم الاشتراك في النشرة الإخبارية بنجاح!');
            this.reset();
        });
    }
    
    // Initialize product image slider (for future implementation)
    function initProductSlider() {
        // This would be implemented with a slider library like Swiper
        // or custom slider functionality
    }
    
    // Search functionality
    const searchBar = document.querySelector('.search-bar input');
    const searchBtn = document.querySelector('.search-bar button');
    
    if (searchBar && searchBtn) {
        searchBtn.addEventListener('click', function() {
            performSearch(searchBar.value);
        });
        
        searchBar.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch(searchBar.value);
            }
        });
    }
    
    function performSearch(query) {
        if (!query.trim()) {
            alert('الرجاء إدخال كلمات البحث');
            return;
        }
        
        // Here you would normally send the search query to the server
        // For now, we'll just show an alert
        alert(`جاري البحث عن: ${query}`);
    }
    
    // Dropdown menu for mobile
    const navItems = document.querySelectorAll('.nav-item');
    
    navItems.forEach(item => {
        const link = item.querySelector('.nav-link');
        const dropdown = item.querySelector('.dropdown');
        
        if (link && dropdown) {
            link.addEventListener('click', function(e) {
                // Only for mobile view
                if (window.innerWidth <= 768) {
                    e.preventDefault();
                    dropdown.style.display = dropdown.style.display === 'block' ? 'none' : 'block';
                }
            });
        }
    });
    
    // Close mobile menu when clicking outside
    document.addEventListener('click', function(e) {
        if (navMenu && navMenu.classList.contains('active') && !e.target.closest('.nav') && !e.target.closest('#mobile-menu-toggle')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Resize handler
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768 && navMenu && navMenu.classList.contains('active')) {
            navMenu.classList.remove('active');
        }
    });
    
    // Cart item removal
    const cartItemRemoveBtns = document.querySelectorAll('.cart-item-remove');
    
    cartItemRemoveBtns.forEach(btn => {
        btn.addEventListener('click', function() {
            const cartItem = this.closest('.cart-item');
            cartItem.style.opacity = '0';
            setTimeout(() => {
                cartItem.remove();
                updateCartTotal();
                cartCount--;
                updateCartCount(cartCount);
            }, 300);
        });
    });
    
    // Update cart total
    function updateCartTotal() {
        // This would calculate the total based on cart items
        // For now, it's just a placeholder
    }
    
    // Initialize any sliders or carousels
    // This would typically use a library like Swiper or Glide.js
    
    // Lazy load images
    const lazyImages = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    img.src = img.dataset.src;
                    img.removeAttribute('data-src');
                    imageObserver.unobserve(img);
                }
            });
        });
        
        lazyImages.forEach(img => {
            imageObserver.observe(img);
        });
    } else {
        // Fallback for browsers that don't support IntersectionObserver
        lazyImages.forEach(img => {
            img.src = img.dataset.src;
            img.removeAttribute('data-src');
        });
    }
});
