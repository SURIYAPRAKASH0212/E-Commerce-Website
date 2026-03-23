// auth.js - Frontend Authentication & Registration
const isLoggedIn = localStorage.getItem('threadora_auth') === 'true';
const currentPath = window.location.pathname;

const isLoginPage = currentPath === '/' || currentPath === '/index.html';

// If not logged in and not on login page, redirect to login (index.html)
if (!isLoggedIn && !isLoginPage) {
    window.location.href = '/';
}

// If logged in and on login page, redirect to home.html
if (isLoggedIn && isLoginPage) {
    window.location.href = '/home.html';
}

// Auth State Logic for index.html
let users = JSON.parse(localStorage.getItem('threadora_users')) || [];
let isLoginMode = true;

window.toggleAuthMode = function(e) {
    if(e) e.preventDefault();
    isLoginMode = !isLoginMode;
    const title = document.getElementById('auth-title');
    const subtitle = document.getElementById('auth-subtitle');
    const nameGroup = document.getElementById('name-group');
    const authOptions = document.getElementById('auth-options');
    const authBtn = document.getElementById('auth-btn');
    const footerText = document.getElementById('auth-footer-text');
    const errorMsg = document.getElementById('auth-error');
    
    if (errorMsg) errorMsg.classList.add('hide');

    if (isLoginMode) {
        title.textContent = "Welcome Back";
        subtitle.textContent = "Sign in to elevate your style.";
        if (nameGroup) nameGroup.classList.add('hide');
        if (authOptions) authOptions.classList.remove('hide');
        if (authBtn) authBtn.textContent = "SIGN IN";
        if (footerText) footerText.innerHTML = `Don't have an account? <a href="#" onclick="toggleAuthMode(event)">Create one</a>`;
    } else {
        title.textContent = "Create Account";
        subtitle.textContent = "Join Threadora for premium fashion.";
        if (nameGroup) nameGroup.classList.remove('hide');
        if (authOptions) authOptions.classList.add('hide');
        if (authBtn) authBtn.textContent = "SIGN UP";
        if (footerText) footerText.innerHTML = `Already have an account? <a href="#" onclick="toggleAuthMode(event)">Sign in here</a>`;
    }
};

window.handleAuthSubmit = function(e) {
    e.preventDefault();
    const emailEl = document.getElementById('email');
    const passwordEl = document.getElementById('password');
    const errorMsg = document.getElementById('auth-error');
    const authBtn = document.getElementById('auth-btn');
    
    if(!emailEl || !passwordEl) return;

    const email = emailEl.value.trim();
    const password = passwordEl.value.trim();

    if(!email || !password) {
        errorMsg.textContent = "Please fill in all required fields.";
        errorMsg.classList.remove('hide');
        return;
    }

    if (isLoginMode) {
        // Login Flow
        const user = users.find(u => u.email === email && u.password === password);
        if (user) {
            errorMsg.classList.add('hide');
            authBtn.textContent = "Signing In...";
            localStorage.setItem('threadora_auth', 'true');
            localStorage.setItem('threadora_current_user', email);
            setTimeout(() => {
                window.location.href = '/home.html';
            }, 800);
        } else {
            errorMsg.textContent = "Invalid email or password.";
            errorMsg.classList.remove('hide');
        }
    } else {
        // Signup Flow
        const nameEl = document.getElementById('name');
        const name = nameEl ? nameEl.value.trim() : '';

        if(!name) {
            errorMsg.textContent = "Please enter your full name.";
            errorMsg.classList.remove('hide');
            return;
        }

        const existing = users.find(u => u.email === email);
        if (existing) {
            errorMsg.textContent = "An account with this email already exists.";
            errorMsg.classList.remove('hide');
            return;
        }

        users.push({ name, email, password });
        localStorage.setItem('threadora_users', JSON.stringify(users));
        
        // Auto sign in after signup
        errorMsg.classList.add('hide');
        authBtn.textContent = "Creating Account...";
        localStorage.setItem('threadora_auth', 'true');
        localStorage.setItem('threadora_current_user', email);
        setTimeout(() => {
            window.location.href = '/home.html';
        }, 800);
    }
};

window.logoutUser = function() {
    localStorage.removeItem('threadora_auth');
    localStorage.removeItem('threadora_current_user');
    window.location.href = '/';
};
