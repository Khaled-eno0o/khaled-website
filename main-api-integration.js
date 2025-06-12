// Include API integration script
document.write('<script src="js/api.js"></script>');

// Update main.js to use API integration
document.addEventListener('DOMContentLoaded', function() {
    // Initialize authentication state from API
    if (typeof ApiService !== 'undefined') {
        initAuthState();
    }
});
