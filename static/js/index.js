// Index Page JavaScript
document.addEventListener('DOMContentLoaded', function() {
    
    // Random name suggestions
    const tunisianNames = [
        'Ahmed', 'Mariam', 'Ismail', 'Layla', 'Omar', 
        'Fatima', 'Youssef', 'Noor', 'Malik', 'Zainab',
        'Samir', 'Amina', 'Karim', 'Rania', 'Tarek',
        'Salma', 'Hichem', 'Dorra', 'Sami', 'Leila'
    ];
    
    // Update placeholder with random name
    const nameInput = document.getElementById('player_name');
    if (nameInput) {
        const randomName = tunisianNames[Math.floor(Math.random() * tunisianNames.length)];
        nameInput.placeholder = `Enter your name (e.g., ${randomName})`;
        
        // Add subtle focus animation
        nameInput.addEventListener('focus', function() {
            this.parentElement.classList.add('focused');
        });
        
        nameInput.addEventListener('blur', function() {
            if (!this.value) {
                this.parentElement.classList.remove('focused');
            }
        });
    }

    // Enhance the start form
    const startForm = document.getElementById('startForm');
    if (startForm) {
        FARDI.enhanceForm('#startForm', {
            loadingText: 'Starting your journey...',
            showOverlay: true,
            loadingMessage: 'Preparing your assessment experience...',
            preventDefault: false // Let the form submit normally
        });
    }

    // Animate hero elements on scroll
    const observeElements = () => {
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.classList.add('animate-in');
                }
            });
        }, {
            threshold: 0.1,
            rootMargin: '0px 0px -50px 0px'
        });

        // Observe all animatable elements
        document.querySelectorAll('.feature-card, .committee-card, .cefr-level-card').forEach(el => {
            observer.observe(el);
        });
    };

    observeElements();

    // Add hover effects to CEFR cards
    const cefrCards = document.querySelectorAll('.cefr-level-card');
    cefrCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            const level = this.dataset.level;
            this.style.borderTopColor = getCefrColor(level);
            this.style.borderTopWidth = '4px';
            this.style.borderTopStyle = 'solid';
        });
        
        card.addEventListener('mouseleave', function() {
            this.style.borderTop = '1px solid rgba(0, 0, 0, 0.05)';
        });
    });

    // Committee card interactions
    const committeeCards = document.querySelectorAll('.committee-card');
    committeeCards.forEach(card => {
        card.addEventListener('click', function() {
            const name = this.querySelector('.committee-name').textContent;
            const role = this.querySelector('.committee-role').textContent;
            const description = this.querySelector('.committee-description').textContent;
            
            showMemberModal(name, role, description);
        });
    });

    // Parallax effect for hero background
    window.addEventListener('scroll', () => {
        const scrolled = window.pageYOffset;
        const rate = scrolled * -0.5;
        const heroBackground = document.querySelector('.hero-background');
        if (heroBackground) {
            heroBackground.style.transform = `translateY(${rate}px)`;
        }
    });

    // Stats counter animation
    const animateCounters = () => {
        const counters = document.querySelectorAll('.stat-number');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    animateCounter(entry.target);
                    observer.unobserve(entry.target);
                }
            });
        });

        counters.forEach(counter => observer.observe(counter));
    };

    const animateCounter = (element) => {
        const target = element.textContent;
        const isPercentage = target.includes('%');
        const isRating = target.includes('/');
        const isPlusSign = target.includes('+');
        
        let finalValue;
        if (isPercentage) {
            finalValue = parseInt(target.replace('%', ''));
        } else if (isRating) {
            finalValue = parseFloat(target.split('/')[0]);
        } else if (isPlusSign) {
            finalValue = parseInt(target.replace(/[k+]/g, '')) * (target.includes('k') ? 1000 : 1);
        } else {
            finalValue = parseInt(target);
        }

        let current = 0;
        const increment = finalValue / 50;
        const timer = setInterval(() => {
            current += increment;
            
            if (current >= finalValue) {
                current = finalValue;
                clearInterval(timer);
            }
            
            let displayValue;
            if (isPercentage) {
                displayValue = Math.round(current) + '%';
            } else if (isRating) {
                displayValue = current.toFixed(1) + '/5';
            } else if (isPlusSign && target.includes('k')) {
                displayValue = Math.round(current / 1000) + 'k+';
            } else {
                displayValue = Math.round(current);
            }
            
            element.textContent = displayValue;
        }, 40);
    };

    animateCounters();

    // Add interactive tooltips to feature icons
    const featureCards = document.querySelectorAll('.feature-card');
    featureCards.forEach(card => {
        const icon = card.querySelector('.feature-icon');
        const title = card.querySelector('h4').textContent;
        
        if (icon) {
            icon.setAttribute('data-bs-toggle', 'tooltip');
            icon.setAttribute('data-bs-placement', 'top');
            icon.setAttribute('title', `Learn more about ${title}`);
        }
    });

    // Initialize tooltips
    const tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
    tooltipTriggerList.map(function(tooltipTriggerEl) {
        return new bootstrap.Tooltip(tooltipTriggerEl);
    });

    // Smooth reveal animations for sections
    const revealSections = () => {
        const sections = document.querySelectorAll('.about-section, .committee-section, .cefr-section, .features-highlight');
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    entry.target.style.opacity = '1';
                    entry.target.style.transform = 'translateY(0)';
                }
            });
        }, { threshold: 0.1 });

        sections.forEach(section => {
            section.style.opacity = '0';
            section.style.transform = 'translateY(30px)';
            section.style.transition = 'opacity 0.6s ease, transform 0.6s ease';
            observer.observe(section);
        });
    };

    revealSections();

    // Add keyboard navigation for cards
    document.addEventListener('keydown', function(e) {
        if (e.key === 'Enter' || e.key === ' ') {
            const focused = document.activeElement;
            if (focused.classList.contains('committee-card')) {
                e.preventDefault();
                focused.click();
            }
        }
    });

    // Make cards focusable for accessibility
    committeeCards.forEach(card => {
        card.setAttribute('tabindex', '0');
        card.setAttribute('role', 'button');
        card.setAttribute('aria-label', `Learn more about ${card.querySelector('.committee-name').textContent}`);
    });

    console.log('🎭 Index page JavaScript initialized successfully!');
});

// Helper functions
function getCefrColor(level) {
    const colors = {
        'a1': '#dc3545',
        'a2': '#fd7e14', 
        'b1': '#ffc107',
        'b2': '#28a745',
        'c1': '#17a2b8'
    };
    return colors[level] || '#6c757d';
}

function showMemberModal(name, role, description) {
    // Create modal dynamically
    const modalHTML = `
        <div class="modal fade" id="memberModal" tabindex="-1" aria-labelledby="memberModalLabel" aria-hidden="true">
            <div class="modal-dialog modal-dialog-centered">
                <div class="modal-content">
                    <div class="modal-header">
                        <h5 class="modal-title" id="memberModalLabel">
                            <i class="fas fa-user-circle me-2"></i>${name}
                        </h5>
                        <button type="button" class="btn-close" data-bs-dismiss="modal" aria-label="Close"></button>
                    </div>
                    <div class="modal-body">
                        <div class="text-center mb-3">
                            <div class="committee-avatar mx-auto mb-3" style="width: 80px; height: 80px; font-size: 2rem;">
                                ${name.charAt(0)}${name.charAt(1) || ''}
                            </div>
                            <h6 class="text-primary">${role}</h6>
                        </div>
                        <p class="text-muted">${description}</p>
                        <div class="alert alert-info">
                            <i class="fas fa-info-circle me-2"></i>
                            <strong>Coming Soon:</strong> You'll interact with ${name} during your assessment journey!
                        </div>
                    </div>
                    <div class="modal-footer">
                        <button type="button" class="btn btn-primary" data-bs-dismiss="modal">
                            <i class="fas fa-check me-2"></i>Got it!
                        </button>
                    </div>
                </div>
            </div>
        </div>
    `;

    // Remove existing modal if any
    const existingModal = document.getElementById('memberModal');
    if (existingModal) {
        existingModal.remove();
    }

    // Add modal to body
    document.body.insertAdjacentHTML('beforeend', modalHTML);

    // Show modal
    const modal = new bootstrap.Modal(document.getElementById('memberModal'));
    modal.show();

    // Clean up when modal is hidden
    document.getElementById('memberModal').addEventListener('hidden.bs.modal', function() {
        this.remove();
    });
}

// Add CSS classes for animations
const style = document.createElement('style');
style.textContent = `
    .animate-in {
        animation: slideInUp 0.6s ease forwards;
    }
    
    @keyframes slideInUp {
        from {
            opacity: 0;
            transform: translateY(30px);
        }
        to {
            opacity: 1;
            transform: translateY(0);
        }
    }
    
    .form-group.focused .form-label {
        color: var(--primary-blue);
        transform: translateY(-2px);
        transition: all 0.3s ease;
    }
    
    .committee-card:focus {
        outline: 2px solid var(--primary-blue);
        outline-offset: 2px;
    }
    
    .committee-card:focus:hover {
        outline-color: var(--primary-red);
    }
`;
document.head.appendChild(style);