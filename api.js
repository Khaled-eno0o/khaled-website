// Eno E-commerce Platform - API Integration
// Created: May 2025
// Description: JavaScript file for integrating frontend with backend APIs

// API Base URL
const API_BASE_URL = '/api';

// Authentication token storage
const AUTH_TOKEN_KEY = 'eno_auth_token';
const USER_DATA_KEY = 'eno_user_data';

// API Service Object
const ApiService = {
    // Get stored authentication token
    getToken() {
        return localStorage.getItem(AUTH_TOKEN_KEY);
    },
    
    // Set authentication token
    setToken(token) {
        localStorage.setItem(AUTH_TOKEN_KEY, token);
    },
    
    // Clear authentication token (logout)
    clearToken() {
        localStorage.removeItem(AUTH_TOKEN_KEY);
        localStorage.removeItem(USER_DATA_KEY);
    },
    
    // Get stored user data
    getUserData() {
        const userData = localStorage.getItem(USER_DATA_KEY);
        return userData ? JSON.parse(userData) : null;
    },
    
    // Set user data
    setUserData(userData) {
        localStorage.setItem(USER_DATA_KEY, JSON.stringify(userData));
    },
    
    // Check if user is authenticated
    isAuthenticated() {
        return !!this.getToken();
    },
    
    // Create request headers
    getHeaders() {
        const headers = {
            'Content-Type': 'application/json'
        };
        
        const token = this.getToken();
        if (token) {
            headers['Authorization'] = `Bearer ${token}`;
        }
        
        return headers;
    },
    
    // Generic request method
    async request(endpoint, method = 'GET', data = null) {
        const url = `${API_BASE_URL}${endpoint}`;
        const options = {
            method,
            headers: this.getHeaders()
        };
        
        if (data && (method === 'POST' || method === 'PUT')) {
            options.body = JSON.stringify(data);
        }
        
        try {
            const response = await fetch(url, options);
            const responseData = await response.json();
            
            if (!response.ok) {
                throw new Error(responseData.message || 'حدث خطأ في الاتصال بالخادم');
            }
            
            return responseData;
        } catch (error) {
            console.error('API Error:', error);
            throw error;
        }
    },
    
    // Authentication APIs
    auth: {
        // Register new user
        async register(userData) {
            return ApiService.request('/register', 'POST', userData);
        },
        
        // Login user
        async login(credentials) {
            const response = await ApiService.request('/login', 'POST', credentials);
            if (response.token) {
                ApiService.setToken(response.token);
                ApiService.setUserData(response.user);
            }
            return response;
        },
        
        // Logout user
        logout() {
            ApiService.clearToken();
            window.location.href = '/';
        }
    },
    
    // User profile APIs
    user: {
        // Get user profile
        async getProfile() {
            return ApiService.request('/profile');
        },
        
        // Update user profile
        async updateProfile(profileData) {
            const response = await ApiService.request('/profile', 'PUT', profileData);
            if (response.user) {
                ApiService.setUserData(response.user);
            }
            return response;
        },
        
        // Get user addresses
        async getAddresses() {
            return ApiService.request('/addresses');
        },
        
        // Add new address
        async addAddress(addressData) {
            return ApiService.request('/addresses', 'POST', addressData);
        },
        
        // Update address
        async updateAddress(addressId, addressData) {
            return ApiService.request(`/addresses/${addressId}`, 'PUT', addressData);
        },
        
        // Delete address
        async deleteAddress(addressId) {
            return ApiService.request(`/addresses/${addressId}`, 'DELETE');
        }
    },
    
    // Products APIs (to be implemented)
    products: {
        // Get featured products
        async getFeaturedProducts() {
            // This would be implemented when product APIs are available
            // For now, return mock data
            return {
                products: [
                    // Mock product data
                ]
            };
        }
    }
};

// DOM Ready Event
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication state
    initAuthState();
    
    // Register form submission
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', handleRegister);
    }
    
    // Login form submission
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', handleLogin);
    }
    
    // Logout button
    const logoutBtn = document.getElementById('logout-btn');
    if (logoutBtn) {
        logoutBtn.addEventListener('click', handleLogout);
    }
});

// Initialize authentication state
function initAuthState() {
    const isAuthenticated = ApiService.isAuthenticated();
    const userData = ApiService.getUserData();
    
    // Update UI based on authentication state
    const accountBtn = document.getElementById('account-btn');
    
    if (isAuthenticated && accountBtn) {
        // User is logged in
        accountBtn.innerHTML = '<i class="fas fa-user-check"></i>';
        accountBtn.setAttribute('title', `مرحباً ${userData.name}`);
        
        // Change account button behavior to show profile instead of login modal
        accountBtn.removeEventListener('click', showLoginModal);
        accountBtn.addEventListener('click', showProfilePage);
    } else if (accountBtn) {
        // User is not logged in
        accountBtn.innerHTML = '<i class="fas fa-user"></i>';
        accountBtn.setAttribute('title', 'تسجيل الدخول');
        
        // Set account button to show login modal
        accountBtn.removeEventListener('click', showProfilePage);
        accountBtn.addEventListener('click', showLoginModal);
    }
}

// Show login modal
function showLoginModal() {
    const loginModal = document.getElementById('login-modal');
    if (loginModal) {
        loginModal.classList.add('active');
    }
}

// Show profile page
function showProfilePage() {
    // This would navigate to the profile page
    // For now, just show a notification
    showNotification('سيتم تنفيذ صفحة الملف الشخصي قريباً');
}

// Handle register form submission
async function handleRegister(e) {
    e.preventDefault();
    
    try {
        const name = document.getElementById('register-name').value;
        const email = document.getElementById('register-email').value;
        const phone = document.getElementById('register-phone').value;
        const password = document.getElementById('register-password').value;
        const confirmPassword = document.getElementById('register-confirm-password').value;
        const terms = document.getElementById('terms').checked;
        
        // Basic validation
        if (!name || !email || !phone || !password || !confirmPassword) {
            showNotification('الرجاء إكمال جميع الحقول المطلوبة', 'error');
            return;
        }
        
        if (password !== confirmPassword) {
            showNotification('كلمات المرور غير متطابقة', 'error');
            return;
        }
        
        if (!terms) {
            showNotification('يجب الموافقة على الشروط والأحكام', 'error');
            return;
        }
        
        // Password strength validation
        const passwordRegex = /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)[a-zA-Z\d]{8,}$/;
        if (!passwordRegex.test(password)) {
            showNotification('يجب أن تحتوي كلمة المرور على 8 أحرف على الأقل وتتضمن أحرف كبيرة وصغيرة وأرقام', 'error');
            return;
        }
        
        // Register user
        const response = await ApiService.auth.register({
            name,
            email,
            phone,
            password
        });
        
        showNotification(response.message || 'تم إنشاء الحساب بنجاح!');
        
        // Close register modal and open login modal
        const registerModal = document.getElementById('register-modal');
        const loginModal = document.getElementById('login-modal');
        
        if (registerModal) {
            registerModal.classList.remove('active');
        }
        
        if (loginModal) {
            loginModal.classList.add('active');
        }
        
        // Clear form
        e.target.reset();
    } catch (error) {
        showNotification(error.message || 'حدث خطأ أثناء إنشاء الحساب', 'error');
    }
}

// Handle login form submission
async function handleLogin(e) {
    e.preventDefault();
    
    try {
        const email = document.getElementById('login-email').value;
        const password = document.getElementById('login-password').value;
        
        // Basic validation
        if (!email || !password) {
            showNotification('الرجاء إدخال البريد الإلكتروني وكلمة المرور', 'error');
            return;
        }
        
        // Login user
        const response = await ApiService.auth.login({
            email,
            password
        });
        
        showNotification(response.message || 'تم تسجيل الدخول بنجاح!');
        
        // Close login modal
        const loginModal = document.getElementById('login-modal');
        if (loginModal) {
            loginModal.classList.remove('active');
        }
        
        // Update UI
        initAuthState();
        
        // Clear form
        e.target.reset();
    } catch (error) {
        showNotification(error.message || 'حدث خطأ أثناء تسجيل الدخول', 'error');
    }
}

// Handle logout
function handleLogout(e) {
    e.preventDefault();
    
    ApiService.auth.logout();
    showNotification('تم تسجيل الخروج بنجاح!');
    
    // Update UI
    initAuthState();
}

// Show notification
function showNotification(message, type = 'success') {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'notification';
    
    const iconClass = type === 'success' ? 'fa-check-circle' : 'fa-exclamation-circle';
    const bgColor = type === 'success' ? 'var(--success)' : 'var(--danger)';
    
    notification.innerHTML = `
        <div class="notification-content">
            <i class="fas ${iconClass}"></i>
            <span>${message}</span>
        </div>
        <button class="notification-close">&times;</button>
    `;
    
    // Add styles
    notification.style.position = 'fixed';
    notification.style.bottom = '20px';
    notification.style.right = '20px';
    notification.style.backgroundColor = bgColor;
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
