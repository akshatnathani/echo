// Auto-hide flash messages after 5 seconds
document.addEventListener('DOMContentLoaded', function() {
    const flashMessages = document.querySelectorAll('.flash');
    flashMessages.forEach(function(message) {
        setTimeout(function() {
            message.style.opacity = '0';
            setTimeout(function() {
                message.style.display = 'none';
            }, 300);
        }, 5000);
    });
});

// Form validation helpers
function validateLoginForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return false;
    }
    return true;
}

function validateRegisterForm() {
    const username = document.getElementById('username').value;
    const password = document.getElementById('password').value;
    
    if (!username || !password) {
        alert('Please fill in all fields');
        return false;
    }
    
    if (password.length < 8) {
        alert('Password must be at least 8 characters long');
        return false;
    }
    
    return true;
}

// Add event listeners to forms
document.addEventListener('DOMContentLoaded', function() {
    const loginForm = document.getElementById('login-form');
    if (loginForm) {
        loginForm.addEventListener('submit', validateLoginForm);
    }
    
    const registerForm = document.getElementById('register-form');
    if (registerForm) {
        registerForm.addEventListener('submit', validateRegisterForm);
    }
});
