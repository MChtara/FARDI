/**
 * Profile Page JavaScript functionality
 */

// Initialize FARDI namespace if it doesn't exist
if (typeof FARDI === 'undefined') {
    var FARDI = {};
}

FARDI.Profile = {
    
    init: function() {
        console.log('Profile page initialized');
        this.initEventListeners();
        this.initScrollToTop();
        this.initLoadMoreAssessments();
    },
    
    initEventListeners: function() {
        // Handle action button clicks with loading states
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                this.handleActionClick(e);
            });
        });
        
        // Handle settings dropdown
        document.querySelectorAll('.dropdown-toggle').forEach(toggle => {
            toggle.addEventListener('click', (e) => {
                this.handleDropdownToggle(e);
            });
        });
        
        // Handle smooth scrolling for timeline
        this.initSmoothScrolling();
        
        // Handle assessment entry hover effects
        this.initAssessmentHovers();
    },
    
    handleActionClick: function(e) {
        const button = e.target.closest('.action-btn');
        if (!button) return;
        
        const originalContent = button.innerHTML;
        const href = button.href;
        
        // Don't prevent default for external links
        if (href && (href.includes('start-game') || href.includes('certificate') || href.includes('dashboard'))) {
            // Show loading state briefly
            button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> <span>Loading...</span>';
            button.style.pointerEvents = 'none';
            
            // Small delay to show loading state
            setTimeout(() => {
                window.location.href = href;
            }, 300);
            
            e.preventDefault();
        }
    },
    
    handleDropdownToggle: function(e) {
        const toggle = e.target.closest('.dropdown-toggle');
        if (!toggle) return;
        
        // Add visual feedback
        toggle.style.transform = 'scale(0.98)';
        setTimeout(() => {
            toggle.style.transform = '';
        }, 150);
    },
    
    initSmoothScrolling: function() {
        const timeline = document.querySelector('.assessment-timeline');
        if (timeline) {
            timeline.style.scrollBehavior = 'smooth';
        }
    },
    
    initAssessmentHovers: function() {
        document.querySelectorAll('.assessment-entry').forEach(entry => {
            entry.addEventListener('mouseenter', () => {
                entry.style.transform = 'translateX(4px)';
            });
            
            entry.addEventListener('mouseleave', () => {
                entry.style.transform = '';
            });
        });
    },
    
    initLoadMoreAssessments: function() {
        const loadMoreBtn = document.getElementById('loadMoreAssessments');
        if (!loadMoreBtn) return;
        
        loadMoreBtn.addEventListener('click', (e) => {
            e.preventDefault();
            this.loadMoreAssessments();
        });
    },
    
    loadMoreAssessments: function() {
        const loadMoreBtn = document.getElementById('loadMoreAssessments');
        const originalText = loadMoreBtn.innerHTML;
        
        // Show loading state
        loadMoreBtn.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Loading...';
        loadMoreBtn.disabled = true;
        
        // Simulate loading (replace with actual API call)
        setTimeout(() => {
            // For now, just show a message that more assessments would be loaded
            const timeline = document.querySelector('.assessment-timeline');
            if (timeline) {
                const placeholder = document.createElement('div');
                placeholder.className = 'assessment-entry';
                placeholder.innerHTML = `
                    <div class="assessment-date">
                        <div class="date-circle">
                            <i class="fas fa-info"></i>
                        </div>
                        <div class="date-info">
                            <div class="date-primary">More assessments</div>
                            <div class="date-secondary">would load here</div>
                        </div>
                    </div>
                    <div class="assessment-content">
                        <div class="assessment-header">
                            <div class="assessment-level-info">
                                <h6>Load More Functionality</h6>
                            </div>
                        </div>
                        <p>In a real application, this would load additional assessment history from the server.</p>
                    </div>
                `;
                timeline.appendChild(placeholder);
            }
            
            // Hide the load more button
            loadMoreBtn.style.display = 'none';
        }, 1500);
    },
    
    initScrollToTop: function() {
        // Add scroll to top functionality
        const scrollToTopBtn = document.createElement('button');
        scrollToTopBtn.className = 'scroll-to-top-btn';
        scrollToTopBtn.innerHTML = '<i class="fas fa-chevron-up"></i>';
        scrollToTopBtn.style.cssText = `
            position: fixed;
            bottom: 20px;
            right: 20px;
            width: 50px;
            height: 50px;
            border-radius: 50%;
            background: var(--primary-blue);
            color: white;
            border: none;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            cursor: pointer;
            opacity: 0;
            visibility: hidden;
            transition: all 0.3s ease;
            z-index: 1000;
        `;
        
        document.body.appendChild(scrollToTopBtn);
        
        // Show/hide scroll to top button
        window.addEventListener('scroll', () => {
            if (window.pageYOffset > 300) {
                scrollToTopBtn.style.opacity = '1';
                scrollToTopBtn.style.visibility = 'visible';
            } else {
                scrollToTopBtn.style.opacity = '0';
                scrollToTopBtn.style.visibility = 'hidden';
            }
        });
        
        // Scroll to top when clicked
        scrollToTopBtn.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
    },
    
    // Utility function to show notifications
    showNotification: function(message, type = 'info') {
        const notification = document.createElement('div');
        notification.className = `notification notification-${type}`;
        notification.innerHTML = `
            <i class="fas fa-${type === 'success' ? 'check' : type === 'error' ? 'exclamation' : 'info'}-circle"></i>
            <span>${message}</span>
        `;
        notification.style.cssText = `
            position: fixed;
            top: 20px;
            right: 20px;
            padding: 1rem 1.5rem;
            background: ${type === 'success' ? '#10b981' : type === 'error' ? '#ef4444' : '#3b82f6'};
            color: white;
            border-radius: 8px;
            box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
            z-index: 1001;
            opacity: 0;
            transform: translateX(100%);
            transition: all 0.3s ease;
        `;
        
        document.body.appendChild(notification);
        
        // Show notification
        setTimeout(() => {
            notification.style.opacity = '1';
            notification.style.transform = 'translateX(0)';
        }, 100);
        
        // Hide notification after 3 seconds
        setTimeout(() => {
            notification.style.opacity = '0';
            notification.style.transform = 'translateX(100%)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 3000);
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.profile-container')) {
        FARDI.Profile.init();
    }
});