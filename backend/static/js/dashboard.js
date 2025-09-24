/**
 * Dashboard JavaScript functionality
 */

// Initialize FARDI namespace if it doesn't exist
if (typeof FARDI === 'undefined') {
    var FARDI = {};
}

FARDI.Dashboard = {
    
    init: function() {
        console.log('Dashboard initialized');
        this.initEventListeners();
        this.initTooltips();
    },
    
    initEventListeners: function() {
        // Handle view details buttons
        document.querySelectorAll('.view-details-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                e.preventDefault();
                const assessmentId = e.target.closest('button').dataset.assessmentId;
                this.showAssessmentDetails(assessmentId);
            });
        });
        
        // Handle quick action buttons
        document.querySelectorAll('.action-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (button.classList.contains('logout')) {
                    e.preventDefault();
                    this.handleLogout();
                }
            });
        });
        
        // Handle start assessment buttons
        document.querySelectorAll('.start-assessment-btn, .continue-btn').forEach(button => {
            button.addEventListener('click', (e) => {
                if (!button.classList.contains('disabled')) {
                    this.handleStartAssessment(e);
                }
            });
        });
        
        // Animate progress rings on page load
        this.initProgressRings();
        
        // Animate step indicators
        this.initStepAnimations();
    },
    
    initTooltips: function() {
        // Initialize Bootstrap tooltips if available
        if (typeof bootstrap !== 'undefined' && bootstrap.Tooltip) {
            var tooltipTriggerList = [].slice.call(document.querySelectorAll('[data-bs-toggle="tooltip"]'));
            var tooltipList = tooltipTriggerList.map(function (tooltipTriggerEl) {
                return new bootstrap.Tooltip(tooltipTriggerEl);
            });
        }
    },
    
    showAssessmentDetails: function(assessmentId) {
        console.log('Showing details for assessment:', assessmentId);
        
        // Show loading in modal
        const modalBody = document.getElementById('assessmentDetails');
        if (modalBody) {
            modalBody.innerHTML = `
                <div class="text-center">
                    <div class="spinner-border text-primary" role="status">
                        <span class="visually-hidden">Loading...</span>
                    </div>
                    <p class="mt-2">Loading assessment details...</p>
                </div>
            `;
        }
        
        // Show modal
        const modal = new bootstrap.Modal(document.getElementById('assessmentModal'));
        modal.show();
        
        // Fetch assessment details (placeholder - would need API endpoint)
        setTimeout(() => {
            if (modalBody) {
                modalBody.innerHTML = `
                    <div class="alert alert-info">
                        <i class="fas fa-info-circle"></i>
                        Assessment details functionality will be implemented soon.
                        <br><small>Assessment ID: ${assessmentId}</small>
                    </div>
                `;
            }
        }, 1000);
    },
    
    handleLogout: function() {
        if (confirm('Are you sure you want to sign out?')) {
            window.location.href = '/auth/logout';
        }
    },
    
    handleStartAssessment: function(e) {
        const button = e.target.closest('button, a');
        const originalText = button.innerHTML;
        
        // Show loading state
        button.innerHTML = '<i class="fas fa-spinner fa-spin"></i> Starting...';
        button.disabled = true;
        
        // Simulate loading (remove this in production)
        setTimeout(() => {
            // Follow the link
            if (button.href) {
                window.location.href = button.href;
            } else {
                // For form submissions
                const form = button.closest('form');
                if (form) {
                    form.submit();
                }
            }
        }, 500);
    },
    
    initProgressChart: function(progressData) {
        const ctx = document.getElementById('progressChart');
        if (!ctx || !progressData || progressData.length === 0) {
            console.log('No chart context or data available');
            return;
        }
        
        // Convert CEFR levels to numbers for charting
        const levelValues = { 'A1': 1, 'A2': 2, 'B1': 3, 'B2': 4, 'C1': 5, 'C2': 6 };
        
        const chartData = progressData.map(item => ({
            x: item.date,
            y: levelValues[item.level] || 1,
            xp: item.xp
        }));
        
        new Chart(ctx, {
            type: 'line',
            data: {
                datasets: [{
                    label: 'CEFR Level Progress',
                    data: chartData,
                    borderColor: '#1e3a8a',
                    backgroundColor: 'rgba(30, 58, 138, 0.1)',
                    borderWidth: 2,
                    fill: true,
                    tension: 0.4
                }]
            },
            options: {
                responsive: true,
                maintainAspectRatio: false,
                plugins: {
                    legend: {
                        display: false
                    }
                },
                scales: {
                    x: {
                        type: 'category',
                        display: false
                    },
                    y: {
                        min: 0,
                        max: 6,
                        ticks: {
                            stepSize: 1,
                            callback: function(value) {
                                const levels = ['', 'A1', 'A2', 'B1', 'B2', 'C1', 'C2'];
                                return levels[value] || '';
                            }
                        }
                    }
                },
                interaction: {
                    intersect: false,
                    mode: 'index'
                }
            }
        });
    },
    
    initProgressRings: function() {
        // Animate progress rings
        document.querySelectorAll('.progress-ring .progress').forEach((ring, index) => {
            const dashoffset = ring.getAttribute('stroke-dashoffset');
            const circumference = 226; // 2 * π * r where r=36
            
            // Start with full circle
            ring.style.strokeDashoffset = circumference;
            
            // Animate to target after delay
            setTimeout(() => {
                ring.style.transition = 'stroke-dashoffset 2s ease-out';
                ring.style.strokeDashoffset = dashoffset;
            }, 500 + (index * 200));
        });
    },
    
    initStepAnimations: function() {
        // Animate step dots
        document.querySelectorAll('.step-dot').forEach((dot, index) => {
            dot.style.opacity = '0';
            dot.style.transform = 'scale(0.5)';
            
            setTimeout(() => {
                dot.style.transition = 'all 0.5s ease-out';
                dot.style.opacity = '1';
                dot.style.transform = 'scale(1)';
            }, 800 + (index * 100));
        });
    },
    
    showNotification: function(message, type = 'info') {
        const alertClass = type === 'success' ? 'alert-success' : 
                          type === 'error' ? 'alert-danger' : 'alert-info';
        
        const notification = document.createElement('div');
        notification.className = `alert ${alertClass} alert-dismissible fade show position-fixed`;
        notification.style.cssText = 'top: 20px; right: 20px; z-index: 9999; min-width: 300px;';
        notification.innerHTML = `
            ${message}
            <button type="button" class="btn-close" data-bs-dismiss="alert"></button>
        `;
        
        document.body.appendChild(notification);
        
        // Auto-dismiss after 5 seconds
        setTimeout(() => {
            notification.remove();
        }, 5000);
    }
};

// Auto-initialize when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (document.querySelector('.dashboard-container')) {
        FARDI.Dashboard.init();
    }
});