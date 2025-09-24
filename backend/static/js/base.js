// Base JavaScript functionality
document.addEventListener('DOMContentLoaded', function() {
    
    // Smooth scrolling for anchor links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
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

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Initialize popovers
    const popoverTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="popover"]'));
    popoverTriggerList.map(function(popoverTriggerEl) {
        return new bootstrap.Popover(popoverTriggerEl);
    });

    // Auto-hide flash messages
    const flashMessages = document.querySelectorAll('.flash-messages .alert');
    flashMessages.forEach(function(alert) {
        setTimeout(function() {
            if (alert && alert.parentNode) {
                const bsAlert = new bootstrap.Alert(alert);
                bsAlert.close();
            }
        }, 5000);
    });

    // Loading overlay functions
    window.showLoading = function(message = 'Loading...') {
        const overlay = document.getElementById('loadingOverlay');
        const messageEl = overlay.querySelector('p');
        if (messageEl) {
            messageEl.textContent = message;
        }
        overlay.classList.remove('d-none');
    };

    window.hideLoading = function() {
        const overlay = document.getElementById('loadingOverlay');
        overlay.classList.add('d-none');
    };

    // Form validation enhancement
    const forms = document.querySelectorAll('.needs-validation');
    forms.forEach(function(form) {
        form.addEventListener('submit', function(event) {
            if (!form.checkValidity()) {
                event.preventDefault();
                event.stopPropagation();
            }
            form.classList.add('was-validated');
        });
    });

    // Word counter for textareas
    const textareas = document.querySelectorAll('textarea[data-word-counter]');
    textareas.forEach(function(textarea) {
        const counter = document.querySelector(textarea.getAttribute('data-word-counter'));
        if (counter) {
            function updateWordCount() {
                const words = textarea.value.trim().split(/\s+/).filter(word => word.length > 0).length;
                counter.textContent = words + ' words';
                
                // Add color coding based on word count
                counter.classList.remove('text-danger', 'text-warning', 'text-success');
                if (words < 10) {
                    counter.classList.add('text-danger');
                } else if (words < 20) {
                    counter.classList.add('text-warning');
                } else {
                    counter.classList.add('text-success');
                }
            }
            
            textarea.addEventListener('input', updateWordCount);
            updateWordCount(); // Initial count
        }
    });

    // Animate progress bars on scroll
    const progressBars = document.querySelectorAll('.progress-bar');
    const animateProgressBar = function(entries, observer) {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const progressBar = entry.target;
                const width = progressBar.getAttribute('aria-valuenow') + '%';
                progressBar.style.width = '0%';
                setTimeout(() => {
                    progressBar.style.transition = 'width 1s ease-in-out';
                    progressBar.style.width = width;
                }, 100);
                observer.unobserve(progressBar);
            }
        });
    };

    if (progressBars.length > 0) {
        const progressObserver = new IntersectionObserver(animateProgressBar, {
            threshold: 0.5
        });
        progressBars.forEach(bar => progressObserver.observe(bar));
    }

    // Copy to clipboard functionality
    window.copyToClipboard = function(text, successCallback) {
        if (navigator.clipboard && window.isSecureContext) {
            navigator.clipboard.writeText(text).then(function() {
                if (successCallback) successCallback();
            }).catch(function(err) {
                console.error('Failed to copy text: ', err);
            });
        } else {
            // Fallback for older browsers
            const textArea = document.createElement('textarea');
            textArea.value = text;
            textArea.style.position = 'fixed';
            textArea.style.left = '-999999px';
            textArea.style.top = '-999999px';
            document.body.appendChild(textArea);
            textArea.focus();
            textArea.select();
            
            try {
                document.execCommand('copy');
                if (successCallback) successCallback();
            } catch (err) {
                console.error('Failed to copy text: ', err);
            } finally {
                textArea.remove();
            }
        }
    };

    // Utility function to show toast notifications
    window.showToast = function(message, type = 'info', duration = 5000) {
        const toastContainer = document.querySelector('.toast-container') || createToastContainer();
        
        const toastId = 'toast-' + Date.now();
        const toast = document.createElement('div');
        toast.id = toastId;
        toast.className = `toast align-items-center text-white bg-${type}`;
        toast.setAttribute('role', 'alert');
        toast.setAttribute('aria-live', 'assertive');
        toast.setAttribute('aria-atomic', 'true');
        
        toast.innerHTML = `
            <div class="d-flex">
                <div class="toast-body">
                    <i class="fas fa-${getIconForType(type)} me-2"></i>
                    ${message}
                </div>
                <button type="button" class="btn-close btn-close-white me-2 m-auto" data-bs-dismiss="toast"></button>
            </div>
        `;
        
        toastContainer.appendChild(toast);
        
        const bsToast = new bootstrap.Toast(toast, {
            autohide: true,
            delay: duration
        });
        
        bsToast.show();
        
        // Remove toast element after it's hidden
        toast.addEventListener('hidden.bs.toast', function() {
            toast.remove();
        });
    };

    function createToastContainer() {
        const container = document.createElement('div');
        container.className = 'toast-container position-fixed top-0 end-0 p-3';
        container.style.zIndex = '1055';
        document.body.appendChild(container);
        return container;
    }

    function getIconForType(type) {
        const icons = {
            'success': 'check-circle',
            'danger': 'exclamation-triangle',
            'warning': 'exclamation-triangle',
            'info': 'info-circle',
            'primary': 'info-circle',
            'secondary': 'info-circle'
        };
        return icons[type] || 'info-circle';
    }

    // Enhanced form submission with loading states
    window.enhanceForm = function(formSelector, options = {}) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        const submitBtn = form.querySelector('button[type="submit"]');
        const originalText = submitBtn ? submitBtn.innerHTML : '';

        form.addEventListener('submit', function(e) {
            if (options.preventDefault !== false) {
                e.preventDefault();
            }

            if (submitBtn) {
                submitBtn.disabled = true;
                submitBtn.innerHTML = `
                    <span class="spinner-border spinner-border-sm me-2" role="status" aria-hidden="true"></span>
                    ${options.loadingText || 'Processing...'}
                `;
            }

            if (options.showOverlay) {
                showLoading(options.loadingMessage);
            }

            // Reset form state after delay or when specified
            const resetForm = () => {
                if (submitBtn) {
                    submitBtn.disabled = false;
                    submitBtn.innerHTML = originalText;
                }
                if (options.showOverlay) {
                    hideLoading();
                }
            };

            if (options.callback) {
                options.callback(form, resetForm);
            } else {
                setTimeout(resetForm, options.delay || 2000);
            }
        });
    };

    // Keyboard shortcuts
    document.addEventListener('keydown', function(e) {
        // Ctrl/Cmd + Enter to submit forms
        if ((e.ctrlKey || e.metaKey) && e.key === 'Enter') {
            const activeForm = document.activeElement.closest('form');
            if (activeForm) {
                const submitBtn = activeForm.querySelector('button[type="submit"]');
                if (submitBtn && !submitBtn.disabled) {
                    submitBtn.click();
                }
            }
        }
        
        // Escape key to close modals
        if (e.key === 'Escape') {
            const openModals = document.querySelectorAll('.modal.show');
            openModals.forEach(modal => {
                const bsModal = bootstrap.Modal.getInstance(modal);
                if (bsModal) bsModal.hide();
            });
        }
    });

    // Auto-save functionality for forms
    window.enableAutoSave = function(formSelector, key, interval = 30000) {
        const form = document.querySelector(formSelector);
        if (!form) return;

        // Load saved data
        const savedData = localStorage.getItem(`autosave_${key}`);
        if (savedData) {
            try {
                const data = JSON.parse(savedData);
                Object.keys(data).forEach(name => {
                    const field = form.querySelector(`[name="${name}"]`);
                    if (field) {
                        field.value = data[name];
                        // Trigger input event to update any dependent UI
                        field.dispatchEvent(new Event('input', { bubbles: true }));
                    }
                });
            } catch (e) {
                console.warn('Failed to load autosaved data:', e);
            }
        }

        // Auto-save function
        const saveFormData = () => {
            const formData = new FormData(form);
            const data = {};
            for (let [name, value] of formData.entries()) {
                data[name] = value;
            }
            localStorage.setItem(`autosave_${key}`, JSON.stringify(data));
        };

        // Save on input change
        form.addEventListener('input', saveFormData);

        // Periodic save
        const autoSaveInterval = setInterval(saveFormData, interval);

        // Clear autosave on successful submit
        form.addEventListener('submit', function() {
            localStorage.removeItem(`autosave_${key}`);
            clearInterval(autoSaveInterval);
        });

        return {
            save: saveFormData,
            clear: () => {
                localStorage.removeItem(`autosave_${key}`);
                clearInterval(autoSaveInterval);
            }
        };
    };

    // Initialize character counter for all textareas with maxlength
    const textareasWithMax = document.querySelectorAll('textarea[maxlength]');
    textareasWithMax.forEach(function(textarea) {
        const maxLength = parseInt(textarea.getAttribute('maxlength'));
        const counter = document.createElement('small');
        counter.className = 'form-text text-muted character-counter';
        textarea.parentNode.appendChild(counter);

        function updateCharacterCount() {
            const remaining = maxLength - textarea.value.length;
            counter.textContent = `${remaining} characters remaining`;
            
            if (remaining < 50) {
                counter.classList.add('text-warning');
                counter.classList.remove('text-muted');
            } else {
                counter.classList.add('text-muted');
                counter.classList.remove('text-warning');
            }
        }

        textarea.addEventListener('input', updateCharacterCount);
        updateCharacterCount();
    });

    // Enhanced accordion behavior
    const accordions = document.querySelectorAll('.accordion');
    accordions.forEach(function(accordion) {
        accordion.addEventListener('show.bs.collapse', function(e) {
            // Add smooth scroll to accordion item when opened
            setTimeout(() => {
                e.target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'nearest'
                });
            }, 350); // Wait for accordion animation
        });
    });

    console.log('🎉 FARDI Base JavaScript initialized successfully!');
});

// Global utility functions
window.FARDI = {
    showToast: window.showToast,
    showLoading: window.showLoading,
    hideLoading: window.hideLoading,
    copyToClipboard: window.copyToClipboard,
    enhanceForm: window.enhanceForm,
    enableAutoSave: window.enableAutoSave
};