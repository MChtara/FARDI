/**
 * FARDI Game.js - Game functionality and interactions
 * This file handles game-specific functionality for the CEFR assessment game
 */

// Extend the FARDI namespace for game functionality
FARDI.Game = {
    /**
     * Initialize game functionality
     */
    init: function() {
        console.log('FARDI Game initialized');
        this.initAudioPlayer();
        this.initResponseForm();
        this.initWordCounter();
        this.initFeedbackSystem();
    },

    /**
     * Initialize audio player for listening comprehension
     */
    initAudioPlayer: function() {
        const audioPlayer = document.getElementById('audio-player');
        const playButton = document.getElementById('play-audio-btn');
        const replayButton = document.getElementById('replay-audio-btn');
        const progressBar = document.getElementById('audio-progress-bar');
        
        if (!audioPlayer || !playButton) return;
        
        // Update progress bar during playback
        audioPlayer.addEventListener('timeupdate', function() {
            if (audioPlayer.duration) {
                const progress = (audioPlayer.currentTime / audioPlayer.duration) * 100;
                if (progressBar) {
                    progressBar.style.width = progress + '%';
                }
            }
        });
        
        // Play/pause functionality
        playButton.addEventListener('click', function() {
            if (audioPlayer.paused) {
                audioPlayer.play().catch(console.error);
                this.innerHTML = '<i class="fas fa-pause"></i>';
            } else {
                audioPlayer.pause();
                this.innerHTML = '<i class="fas fa-play"></i>';
            }
        });
        
        // Replay functionality
        if (replayButton) {
            replayButton.addEventListener('click', function() {
                audioPlayer.currentTime = 0;
                audioPlayer.play().catch(console.error);
                playButton.innerHTML = '<i class="fas fa-pause"></i>';
            });
        }
        
        // Reset play button when audio ends
        audioPlayer.addEventListener('ended', function() {
            playButton.innerHTML = '<i class="fas fa-play"></i>';
            if (progressBar) {
                progressBar.style.width = '0%';
            }
        });
    },

    /**
     * Initialize response form validation and submission
     */
    initResponseForm: function() {
        const form = document.getElementById('responseForm');
        if (!form) return;

        form.addEventListener('submit', function(e) {
            const responseInput = document.getElementById('responseInput');
            const response = responseInput ? responseInput.value.trim() : '';
            
            if (!response) {
                e.preventDefault();
                FARDI.showToast('Please type a response before submitting.', 'warning');
                if (responseInput) responseInput.focus();
                return false;
            }
        });
    },

    /**
     * Initialize word counter for response textarea
     */
    initWordCounter: function() {
        const responseInput = document.getElementById('responseInput');
        const wordCounter = document.getElementById('word-counter');
        
        if (!responseInput || !wordCounter) return;
        
        responseInput.addEventListener('input', function() {
            const words = this.value.split(/\s+/).filter(word => word.length > 0).length;
            wordCounter.textContent = words + ' words';
            
            // Update styling based on word count
            if (words >= 20 && words <= 30) {
                wordCounter.className = 'word-counter text-success';
            } else if (words > 30) {
                wordCounter.className = 'word-counter text-warning';
            } else {
                wordCounter.className = 'word-counter';
            }
        });
    },

    /**
     * Initialize AI feedback system
     */
    initFeedbackSystem: function() {
        const getFeedbackBtn = document.getElementById('get-feedback');
        if (!getFeedbackBtn) return;

        getFeedbackBtn.addEventListener('click', function() {
            FARDI.Game.requestAIFeedback();
        });
    },

    /**
     * Request AI feedback for user response
     */
    requestAIFeedback: function() {
        const responseInput = document.getElementById('responseInput');
        const response = responseInput ? responseInput.value.trim() : '';
        
        if (!response) {
            FARDI.showToast('Please type a response first.', 'warning');
            return;
        }

        // Show feedback section and loading state
        this.showFeedbackLoading();
        
        // Note: API endpoints should be properly configured in the template
        // This is a placeholder for the actual AJAX implementation
        console.log('Requesting AI feedback for response:', response);
    },

    /**
     * Show feedback loading state
     */
    showFeedbackLoading: function() {
        const feedbackSection = document.getElementById('feedback-section');
        const typingIndicator = document.getElementById('typing-indicator');
        const feedbackBubble = document.getElementById('ai-feedback-bubble');
        
        if (feedbackSection) {
            feedbackSection.classList.remove('d-none');
        }
        if (typingIndicator) {
            typingIndicator.classList.remove('d-none');
        }
        if (feedbackBubble) {
            feedbackBubble.classList.add('d-none');
        }
    },

    /**
     * Display AI feedback response
     */
    showFeedback: function(feedbackData) {
        const typingIndicator = document.getElementById('typing-indicator');
        const feedbackBubble = document.getElementById('ai-feedback-bubble');
        const feedbackText = document.getElementById('ai-feedback-text');
        
        // Hide loading, show feedback
        setTimeout(() => {
            if (typingIndicator) {
                typingIndicator.classList.add('d-none');
            }
            if (feedbackBubble) {
                feedbackBubble.classList.remove('d-none');
            }
            if (feedbackText && feedbackData.response) {
                feedbackText.innerHTML = feedbackData.response;
            }
            
            // Show assessment details if available
            if (feedbackData.assessment) {
                this.showAssessmentDetails(feedbackData.assessment);
            }
        }, 1500);
    },

    /**
     * Display assessment details
     */
    showAssessmentDetails: function(assessment) {
        const detailsSection = document.getElementById('assessment-details');
        const levelElement = document.getElementById('assessment-level');
        const levelIndicator = document.getElementById('assessment-level-indicator');
        
        if (detailsSection) {
            detailsSection.classList.remove('d-none');
        }
        
        if (levelElement && assessment.level) {
            levelElement.textContent = assessment.level;
        }
        
        // Set level indicator styling
        if (levelIndicator && assessment.level) {
            const levelColors = {
                'A1': 'assessment-a1',
                'A2': 'assessment-a2',
                'B1': 'assessment-b1',
                'B2': 'assessment-b2',
                'C1': 'assessment-c1'
            };
            
            levelIndicator.className = 'level-indicator ' + (levelColors[assessment.level] || 'assessment-b1');
        }
        
        // Show strengths and improvements if available
        this.displayAssessmentList('assessment-strengths', assessment.strengths, 'assessment-strengths-section');
        this.displayAssessmentList('assessment-improvements', assessment.improvements, 'assessment-improvements-section');
    },

    /**
     * Display assessment list items
     */
    displayAssessmentList: function(listId, items, sectionId) {
        const section = document.getElementById(sectionId);
        const list = document.getElementById(listId);
        
        if (!items || !Array.isArray(items) || items.length === 0) {
            if (section) section.classList.add('d-none');
            return;
        }
        
        if (section) section.classList.remove('d-none');
        if (list) {
            list.innerHTML = '';
            items.forEach(item => {
                const li = document.createElement('li');
                li.textContent = item;
                list.appendChild(li);
            });
        }
    },

    /**
     * Utility method to get form data
     */
    getFormData: function() {
        const responseInput = document.getElementById('responseInput');
        return {
            response: responseInput ? responseInput.value.trim() : '',
            question_type: document.querySelector('input[name="question_type"]')?.value || ''
        };
    }
};

// Initialize game functionality when DOM is ready
document.addEventListener('DOMContentLoaded', function() {
    if (typeof FARDI !== 'undefined') {
        FARDI.Game.init();
    }
});