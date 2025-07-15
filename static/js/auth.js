// Authentication JavaScript functionality - FIXED VERSION
window.FARDI = window.FARDI || {};

FARDI.Auth = {
    // Initialize login form
    initLoginForm: function() {
        const form = document.getElementById('loginForm');
        if (!form) return;

        console.log('🔐 Initializing login form');

        // Enhance form submission if FARDI.enhanceForm exists
        if (typeof FARDI.enhanceForm === 'function') {
            FARDI.enhanceForm('#loginForm', {
                loadingText: 'Signing in...',
                showOverlay: true,
                loadingMessage: 'Authenticating your credentials...',
                preventDefault: false
            });
        }

        // Auto-save username/email for convenience (only if localStorage is available)
        const usernameInput = document.getElementById('username_or_email');
        if (usernameInput && typeof(Storage) !== "undefined") {
            try {
                // Load saved username
                const savedUsername = localStorage.getItem('fardi_saved_username');
                if (savedUsername) {
                    usernameInput.value = savedUsername;
                }

                // Save username on input
                usernameInput.addEventListener('blur', function() {
                    if (this.value) {
                        try {
                            localStorage.setItem('fardi_saved_username', this.value);
                        } catch(e) {
                            console.log('Cannot save username to localStorage');
                        }
                    }
                });
            } catch(e) {
                console.log('localStorage not available');
            }
        }

        // Add enter key support
        form.addEventListener('keydown', function(e) {
            if (e.key === 'Enter') {
                const submitBtn = form.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        });
    },

    // Initialize signup form
    initSignupForm: function() {
        const form = document.getElementById('signupForm');
        if (!form) {
            console.error('❌ Signup form not found');
            return;
        }

        console.log('📝 Initializing signup form');

        // Create validation state object
        this.validationState = {
            username: false,
            email: false,
            password: false,
            confirmPassword: false,
            terms: false
        };

        // Make validation state globally accessible for debugging
        window.validationState = this.validationState;

        // Store reference to this for callbacks
        const self = this;

        // Update submit button state
        this.updateSubmitButton = function() {
            const submitBtn = document.getElementById('submitBtn');
            if (!submitBtn) {
                console.error('❌ Submit button not found');
                return;
            }

            const allValid = Object.values(self.validationState).every(valid => valid === true);
            
            console.log('🔄 Updating button state:', {
                validation: self.validationState,
                allValid: allValid,
                buttonDisabled: submitBtn.disabled
            });

            submitBtn.disabled = !allValid;
            
            if (allValid) {
                submitBtn.classList.remove('btn-secondary');
                submitBtn.classList.add('btn-primary');
                console.log('✅ Submit button enabled');
            } else {
                submitBtn.classList.remove('btn-primary');
                submitBtn.classList.add('btn-secondary');
                console.log('❌ Submit button disabled');
            }
        };

        // Initialize real-time validation
        this.initUsernameValidation();
        this.initEmailValidation();
        this.initPasswordValidation();
        this.initConfirmPasswordValidation();
        this.initTermsValidation();

        // Enhance form submission if FARDI.enhanceForm exists
        if (typeof FARDI.enhanceForm === 'function') {
            FARDI.enhanceForm('#signupForm', {
                loadingText: 'Creating account...',
                showOverlay: true,
                loadingMessage: 'Setting up your FARDI account...',
                preventDefault: false
            });
        }

        // Initial button state
        this.updateSubmitButton();

        // Force enable button after 3 seconds as fallback
        setTimeout(() => {
            if (document.getElementById('submitBtn').disabled) {
                console.log('⚠️ Button still disabled after 3 seconds, this might indicate an issue');
            }
        }, 3000);
    },

    // Username validation
    initUsernameValidation: function() {
        const usernameInput = document.getElementById('username');
        const feedback = document.getElementById('username-feedback');
        if (!usernameInput || !feedback) {
            console.warn('⚠️ Username input or feedback element not found');
            return;
        }

        console.log('🔤 Initializing username validation');

        let checkTimeout;
        const self = this;

        usernameInput.addEventListener('input', function() {
            const username = this.value.trim();
            
            console.log('📝 Username input:', username);

            // Clear previous timeout
            clearTimeout(checkTimeout);
            
            // Reset validation state
            self.validationState.username = false;
            self.updateSubmitButton();
            feedback.className = 'input-feedback';
            feedback.textContent = '';

            if (!username) {
                feedback.textContent = 'Username is required';
                feedback.classList.add('invalid');
                return;
            }

            // Basic validation
            if (username.length < 3) {
                feedback.textContent = 'Username must be at least 3 characters long';
                feedback.classList.add('invalid');
                return;
            }

            if (username.length > 20) {
                feedback.textContent = 'Username must not exceed 20 characters';
                feedback.classList.add('invalid');
                return;
            }

            if (!/^[a-zA-Z0-9_]+$/.test(username)) {
                feedback.textContent = 'Username can only contain letters, numbers, and underscores';
                feedback.classList.add('invalid');
                return;
            }

            // Check availability after delay
            feedback.textContent = 'Checking availability...';
            feedback.className = 'input-feedback checking';

            checkTimeout = setTimeout(() => {
                self.checkUsernameAvailability(username, feedback);
            }, 500);
        });

        // Allow manual override for testing
        usernameInput.addEventListener('dblclick', function() {
            if (confirm('Force mark username as valid? (For testing only)')) {
                self.validationState.username = true;
                self.updateSubmitButton();
                feedback.textContent = 'Username marked as valid (testing)';
                feedback.className = 'input-feedback valid';
            }
        });
    },

    // Check username availability
    checkUsernameAvailability: function(username, feedback) {
        console.log('🔍 Checking username availability:', username);
        const self = this;

        fetch(`/auth/api/check-username?username=${encodeURIComponent(username)}`)
            .then(response => {
                console.log('📡 Username check response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('✅ Username check result:', data);
                if (data.available) {
                    feedback.textContent = 'Username is available';
                    feedback.className = 'input-feedback valid';
                    self.validationState.username = true;
                } else {
                    feedback.textContent = data.message || 'Username is not available';
                    feedback.className = 'input-feedback invalid';
                    self.validationState.username = false;
                }
                self.updateSubmitButton();
            })
            .catch(error => {
                console.error('❌ Error checking username:', error);
                feedback.textContent = 'Error checking username availability. Please try again.';
                feedback.className = 'input-feedback invalid';
                self.validationState.username = false;
                self.updateSubmitButton();
            });
    },

    // Email validation
    initEmailValidation: function() {
        const emailInput = document.getElementById('email');
        const feedback = document.getElementById('email-feedback');
        if (!emailInput || !feedback) {
            console.warn('⚠️ Email input or feedback element not found');
            return;
        }

        console.log('📧 Initializing email validation');

        let checkTimeout;
        const self = this;

        emailInput.addEventListener('input', function() {
            const email = this.value.trim().toLowerCase();
            
            console.log('📝 Email input:', email);

            clearTimeout(checkTimeout);
            self.validationState.email = false;
            self.updateSubmitButton();
            feedback.className = 'input-feedback';
            feedback.textContent = '';

            if (!email) {
                feedback.textContent = 'Email is required';
                feedback.classList.add('invalid');
                return;
            }

            // Email format validation
            const emailRegex = /^[a-zA-Z0-9._%+-]+@[a-zA-Z0-9.-]+\.[a-zA-Z]{2,}$/;
            if (!emailRegex.test(email)) {
                feedback.textContent = 'Please enter a valid email address';
                feedback.classList.add('invalid');
                return;
            }

            // Check availability
            feedback.textContent = 'Checking availability...';
            feedback.className = 'input-feedback checking';

            checkTimeout = setTimeout(() => {
                self.checkEmailAvailability(email, feedback);
            }, 500);
        });

        // Allow manual override for testing
        emailInput.addEventListener('dblclick', function() {
            if (confirm('Force mark email as valid? (For testing only)')) {
                self.validationState.email = true;
                self.updateSubmitButton();
                feedback.textContent = 'Email marked as valid (testing)';
                feedback.className = 'input-feedback valid';
            }
        });
    },

    // Check email availability
    checkEmailAvailability: function(email, feedback) {
        console.log('🔍 Checking email availability:', email);
        const self = this;

        fetch(`/auth/api/check-email?email=${encodeURIComponent(email)}`)
            .then(response => {
                console.log('📡 Email check response status:', response.status);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                return response.json();
            })
            .then(data => {
                console.log('✅ Email check result:', data);
                if (data.available) {
                    feedback.textContent = 'Email is available';
                    feedback.className = 'input-feedback valid';
                    self.validationState.email = true;
                } else {
                    feedback.textContent = data.message || 'Email is already registered';
                    feedback.className = 'input-feedback invalid';
                    self.validationState.email = false;
                }
                self.updateSubmitButton();
            })
            .catch(error => {
                console.error('❌ Error checking email:', error);
                feedback.textContent = 'Error checking email availability. Please try again.';
                feedback.className = 'input-feedback invalid';
                self.validationState.email = false;
                self.updateSubmitButton();
            });
    },

    // Password validation
    initPasswordValidation: function() {
        const passwordInput = document.getElementById('password');
        const strengthIndicator = document.getElementById('passwordStrength');
        if (!passwordInput) {
            console.warn('⚠️ Password input not found');
            return;
        }

        console.log('🔒 Initializing password validation');

        const strengthFill = strengthIndicator?.querySelector('.strength-fill');
        const strengthText = strengthIndicator?.querySelector('.strength-text span');
        const requirements = {
            length: document.getElementById('req-length'),
            uppercase: document.getElementById('req-uppercase'),
            lowercase: document.getElementById('req-lowercase'),
            number: document.getElementById('req-number')
        };

        const self = this;

        passwordInput.addEventListener('input', function() {
            const password = this.value;
            const strength = self.calculatePasswordStrength(password, requirements);
            
            console.log('🔒 Password strength:', strength);

            // Update strength indicator
            if (strengthFill) {
                strengthFill.className = `strength-fill ${strength.level}`;
            }
            if (strengthText) {
                strengthText.textContent = strength.text;
            }
            
            // Update validation
            self.validationState.password = strength.valid;
            self.updateSubmitButton();
            
            // Also check confirm password if it exists
            const confirmPasswordInput = document.getElementById('confirm_password');
            if (confirmPasswordInput && confirmPasswordInput.value) {
                self.validateConfirmPassword(confirmPasswordInput.value, password);
            }
        });

        // Password toggle
        const toggleBtn = document.getElementById('togglePassword');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const type = passwordInput.type === 'password' ? 'text' : 'password';
                passwordInput.type = type;
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            });
        }
    },

    // Calculate password strength
    calculatePasswordStrength: function(password, requirements) {
        const checks = {
            length: password.length >= 8,
            uppercase: /[A-Z]/.test(password),
            lowercase: /[a-z]/.test(password),
            number: /\d/.test(password)
        };

        // Update requirement indicators
        Object.keys(checks).forEach(req => {
            const element = requirements[req];
            if (element) {
                element.classList.toggle('valid', checks[req]);
            }
        });

        const validCount = Object.values(checks).filter(Boolean).length;
        const allValid = validCount === 4;

        let level, text;
        if (validCount === 0) {
            level = 'weak';
            text = 'Very Weak';
        } else if (validCount === 1) {
            level = 'weak';
            text = 'Weak';
        } else if (validCount === 2) {
            level = 'fair';
            text = 'Fair';
        } else if (validCount === 3) {
            level = 'good';
            text = 'Good';
        } else {
            level = 'strong';
            text = 'Strong';
        }

        return { level, text, valid: allValid };
    },

    // Confirm password validation
    initConfirmPasswordValidation: function() {
        const confirmPasswordInput = document.getElementById('confirm_password');
        const passwordInput = document.getElementById('password');
        const feedback = document.getElementById('confirm-password-feedback');
        
        if (!confirmPasswordInput || !passwordInput) {
            console.warn('⚠️ Confirm password or password input not found');
            return;
        }

        console.log('🔒 Initializing confirm password validation');

        const self = this;

        confirmPasswordInput.addEventListener('input', function() {
            const confirmPassword = this.value;
            const password = passwordInput.value;
            
            self.validateConfirmPassword(confirmPassword, password, feedback);
        });

        // Confirm password toggle
        const toggleBtn = document.getElementById('toggleConfirmPassword');
        if (toggleBtn) {
            toggleBtn.addEventListener('click', function() {
                const type = confirmPasswordInput.type === 'password' ? 'text' : 'password';
                confirmPasswordInput.type = type;
                
                const icon = this.querySelector('i');
                if (icon) {
                    icon.classList.toggle('fa-eye');
                    icon.classList.toggle('fa-eye-slash');
                }
            });
        }
    },

    // Validate confirm password
    validateConfirmPassword: function(confirmPassword, password, feedback = null) {
        if (!feedback) {
            feedback = document.getElementById('confirm-password-feedback');
        }

        console.log('🔒 Validating confirm password');

        if (!confirmPassword) {
            if (feedback) {
                feedback.textContent = '';
                feedback.className = 'input-feedback';
            }
            this.validationState.confirmPassword = false;
        } else if (confirmPassword !== password) {
            if (feedback) {
                feedback.textContent = 'Passwords do not match';
                feedback.className = 'input-feedback invalid';
            }
            this.validationState.confirmPassword = false;
        } else {
            if (feedback) {
                feedback.textContent = 'Passwords match';
                feedback.className = 'input-feedback valid';
            }
            this.validationState.confirmPassword = true;
        }
        
        this.updateSubmitButton();
    },

    // Terms validation
    initTermsValidation: function() {
        const termsCheckbox = document.getElementById('terms_accepted');
        if (!termsCheckbox) {
            console.warn('⚠️ Terms checkbox not found');
            return;
        }

        console.log('📋 Initializing terms validation');

        const self = this;

        termsCheckbox.addEventListener('change', function() {
            console.log('📋 Terms checkbox changed:', this.checked);
            self.validationState.terms = this.checked;
            self.updateSubmitButton();
        });

        // Set initial state
        this.validationState.terms = termsCheckbox.checked;
        this.updateSubmitButton();
    }
};

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    console.log('🚀 DOM loaded, initializing authentication...');

    // Auto-initialize based on page
    if (document.getElementById('loginForm')) {
        console.log('🔐 Found login form');
        FARDI.Auth.initLoginForm();
    }
    
    if (document.getElementById('signupForm')) {
        console.log('📝 Found signup form');
        FARDI.Auth.initSignupForm();
    }
    
    console.log('🔐 Authentication JavaScript initialized');

    // Add global test functions for debugging
    window.testValidation = function() {
        if (window.validationState) {
            console.log('🧪 Current validation state:', window.validationState);
            
            // Force enable button for testing
            const submitBtn = document.getElementById('submitBtn');
            if (submitBtn) {
                submitBtn.disabled = false;
                submitBtn.classList.remove('btn-secondary');
                submitBtn.classList.add('btn-primary');
                console.log('🔓 Button force-enabled for testing');
            }
        }
    };

    window.forceValidateAll = function() {
        if (window.validationState && FARDI.Auth.validationState) {
            console.log('🧪 Force validating all fields...');
            FARDI.Auth.validationState.username = true;
            FARDI.Auth.validationState.email = true;
            FARDI.Auth.validationState.password = true;
            FARDI.Auth.validationState.confirmPassword = true;
            FARDI.Auth.validationState.terms = true;
            
            // Update feedback displays
            const feedbacks = {
                'username-feedback': 'Username valid (forced)',
                'email-feedback': 'Email valid (forced)',
                'confirm-password-feedback': 'Passwords match (forced)'
            };
            
            Object.keys(feedbacks).forEach(id => {
                const element = document.getElementById(id);
                if (element) {
                    element.textContent = feedbacks[id];
                    element.className = 'input-feedback valid';
                }
            });
            
            // Check terms checkbox
            const termsCheckbox = document.getElementById('terms_accepted');
            if (termsCheckbox) {
                termsCheckbox.checked = true;
            }
            
            // Update button
            if (FARDI.Auth.updateSubmitButton) {
                FARDI.Auth.updateSubmitButton();
            }
            
            console.log('✅ All fields force-validated');
        }
    };

    // Add keyboard shortcuts for testing
    document.addEventListener('keydown', function(e) {
        if (e.ctrlKey && e.shiftKey) {
            switch(e.key) {
                case 'T': // Ctrl+Shift+T - Test validation state
                    e.preventDefault();
                    window.testValidation();
                    break;
                case 'F': // Ctrl+Shift+F - Force validate all
                    e.preventDefault();
                    window.forceValidateAll();
                    break;
                case 'R': // Ctrl+Shift+R - Reset form
                    e.preventDefault();
                    location.reload();
                    break;
            }
        }
    });

    console.log('🧪 Test functions available:');
    console.log('  - window.testValidation() - Check current validation state');
    console.log('  - window.forceValidateAll() - Force all fields to valid');
    console.log('  - Ctrl+Shift+T - Test validation');
    console.log('  - Ctrl+Shift+F - Force validate all');
    console.log('  - Ctrl+Shift+R - Reset form');
});