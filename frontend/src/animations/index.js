/**
 * Animation Utilities
 * JavaScript helpers for triggering and managing animations
 */

/**
 * Trigger confetti animation
 * @param {Object} options - Configuration options
 * @param {number} options.particleCount - Number of confetti pieces
 * @param {number} options.spread - Spread angle in degrees
 * @param {number} options.origin - Origin point {x, y}
 * @param {Array} options.colors - Array of color strings
 */
export const triggerConfetti = (options = {}) => {
    const {
        particleCount = 100,
        spread = 70,
        origin = { x: 0.5, y: 0.5 },
        colors = ['#8B5CF6', '#10B981', '#F59E0B', '#3B82F6', '#EF4444']
    } = options;

    // Dispatch custom event that ConfettiCannon component will listen for
    window.dispatchEvent(new CustomEvent('triggerConfetti', {
        detail: { particleCount, spread, origin, colors }
    }));
};

/**
 * Trigger floating XP animation
 * @param {number} xp - Amount of XP gained
 * @param {HTMLElement} element - Element to animate from
 */
export const triggerXPFloat = (xp, element) => {
    if (!element) return;

    const floatingXP = document.createElement('div');
    floatingXP.className = 'floating-xp';
    floatingXP.textContent = `+${xp} XP`;
    floatingXP.style.cssText = `
    position: fixed;
    left: ${element.getBoundingClientRect().left + element.offsetWidth / 2}px;
    top: ${element.getBoundingClientRect().top}px;
    font-size: 1.5rem;
    font-weight: bold;
    color: #8B5CF6;
    pointer-events: none;
    z-index: 9999;
    animation: floatUp 1s ease-out forwards;
  `;

    document.body.appendChild(floatingXP);

    setTimeout(() => {
        floatingXP.remove();
    }, 1000);
};

/**
 * Animate number counting
 * @param {HTMLElement} element - Element containing the number
 * @param {number} start - Starting number
 * @param {number} end - Ending number
 * @param {number} duration - Animation duration in ms
 */
export const animateNumber = (element, start, end, duration = 1000) => {
    if (!element) return;

    const range = end - start;
    const increment = range / (duration / 16); // 60fps
    let current = start;

    const timer = setInterval(() => {
        current += increment;
        if ((increment > 0 && current >= end) || (increment < 0 && current <= end)) {
            current = end;
            clearInterval(timer);
        }
        element.textContent = Math.round(current);
    }, 16);
};

/**
 * Add shake animation to element
 * @param {HTMLElement} element - Element to shake
 */
export const shake = (element) => {
    if (!element) return;

    element.classList.add('animate-shake');
    setTimeout(() => {
        element.classList.remove('animate-shake');
    }, 500);
};

/**
 * Add pulse animation to element
 * @param {HTMLElement} element - Element to pulse
 * @param {number} duration - Duration in ms
 */
export const pulse = (element, duration = 2000) => {
    if (!element) return;

    element.classList.add('animate-pulse');
    setTimeout(() => {
        element.classList.remove('animate-pulse');
    }, duration);
};

/**
 * Add bounce animation to element
 * @param {HTMLElement} element - Element to bounce
 */
export const bounce = (element) => {
    if (!element) return;

    element.classList.add('animate-bounce');
    setTimeout(() => {
        element.classList.remove('animate-bounce');
    }, 1000);
};

/**
 * Stagger animation for multiple elements
 * @param {NodeList|Array} elements - Elements to animate
 * @param {string} animationClass - Animation class to add
 * @param {number} delay - Delay between each element in ms
 */
export const staggerAnimation = (elements, animationClass, delay = 100) => {
    elements.forEach((element, index) => {
        setTimeout(() => {
            element.classList.add(animationClass);
        }, index * delay);
    });
};

/**
 * Create ripple effect on click
 * @param {MouseEvent} event - Click event
 * @param {HTMLElement} element - Element to create ripple on
 */
export const createRipple = (event, element) => {
    const ripple = document.createElement('span');
    const rect = element.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = event.clientX - rect.left - size / 2;
    const y = event.clientY - rect.top - size / 2;

    ripple.style.cssText = `
    position: absolute;
    width: ${size}px;
    height: ${size}px;
    border-radius: 50%;
    background: rgba(255, 255, 255, 0.6);
    left: ${x}px;
    top: ${y}px;
    pointer-events: none;
    animation: ripple 0.6s ease-out;
  `;

    element.style.position = 'relative';
    element.style.overflow = 'hidden';
    element.appendChild(ripple);

    setTimeout(() => ripple.remove(), 600);
};

/**
 * Scroll to element with smooth animation
 * @param {HTMLElement} element - Element to scroll to
 * @param {Object} options - Scroll options
 */
export const smoothScrollTo = (element, options = {}) => {
    if (!element) return;

    const {
        behavior = 'smooth',
        block = 'start',
        inline = 'nearest'
    } = options;

    element.scrollIntoView({ behavior, block, inline });
};

/**
 * Check if element is in viewport
 * @param {HTMLElement} element - Element to check
 * @returns {boolean}
 */
export const isInViewport = (element) => {
    if (!element) return false;

    const rect = element.getBoundingClientRect();
    return (
        rect.top >= 0 &&
        rect.left >= 0 &&
        rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
        rect.right <= (window.innerWidth || document.documentElement.clientWidth)
    );
};

/**
 * Observe element for viewport intersection
 * @param {HTMLElement} element - Element to observe
 * @param {Function} callback - Callback when element enters viewport
 * @param {Object} options - Intersection observer options
 */
export const observeIntersection = (element, callback, options = {}) => {
    if (!element || !('IntersectionObserver' in window)) return;

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                callback(entry);
            }
        });
    }, options);

    observer.observe(element);
    return observer;
};

/**
 * Debounce function for performance
 * @param {Function} func - Function to debounce
 * @param {number} wait - Wait time in ms
 * @returns {Function}
 */
export const debounce = (func, wait = 300) => {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
};

/**
 * Throttle function for performance
 * @param {Function} func - Function to throttle
 * @param {number} limit - Time limit in ms
 * @returns {Function}
 */
export const throttle = (func, limit = 300) => {
    let inThrottle;
    return function executedFunction(...args) {
        if (!inThrottle) {
            func(...args);
            inThrottle = true;
            setTimeout(() => (inThrottle = false), limit);
        }
    };
};

// Add ripple keyframe if not exists
if (typeof document !== 'undefined') {
    const style = document.createElement('style');
    style.textContent = `
    @keyframes ripple {
      to {
        transform: scale(4);
        opacity: 0;
      }
    }
  `;
    document.head.appendChild(style);
}

export default {
    triggerConfetti,
    triggerXPFloat,
    animateNumber,
    shake,
    pulse,
    bounce,
    staggerAnimation,
    createRipple,
    smoothScrollTo,
    isInViewport,
    observeIntersection,
    debounce,
    throttle
};
