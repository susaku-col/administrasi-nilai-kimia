/**
 * Pernak-pernik3 Microsite
 * Main JavaScript file
 */

// Wait for DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    initSpoiler();
    initLinkTracking();
    addLoadingStates();
});

/**
 * Initialize Spoiler/Media toggle functionality
 */
function initSpoiler() {
    const spoilerBtn = document.getElementById('spoilerButton');
    const spoilerContent = document.getElementById('spoilerContent');
    const videoIframe = document.getElementById('youtubeVideo');
    
    if (!spoilerBtn || !spoilerContent) return;
    
    let isOpen = false;
    let videoAutoplayTriggered = false;
    
    spoilerBtn.addEventListener('click', function(e) {
        e.preventDefault();
        
        // Toggle class
        spoilerContent.classList.toggle('show');
        isOpen = spoilerContent.classList.contains('show');
        
        // Auto-play video when opened for first time
        if (isOpen && videoIframe && !videoAutoplayTriggered) {
            const currentSrc = videoIframe.src;
            if (currentSrc.indexOf('autoplay=1') === -1) {
                // Add autoplay parameter
                const separator = currentSrc.indexOf('?') === -1 ? '?' : '&';
                videoIframe.src = currentSrc + separator + 'autoplay=1';
                videoAutoplayTriggered = true;
            }
        }
        
        // Optional: Change button text/icon when open
        const buttonIcon = spoilerBtn.querySelector('.spoiler-icon');
        const buttonText = spoilerBtn.querySelector('span');
        
        if (isOpen) {
            // Optional: Change to "Tutup" or keep as is
            // buttonText.textContent = 'TUTUP';
        } else {
            // buttonText.textContent = 'RELAX SEJENAK';
            // Pause video when closed (optional)
            if (videoIframe) {
                // Note: Can't directly pause iframe, but we can reload without autoplay
                const cleanSrc = videoIframe.src.replace(/[&?]autoplay=1/, '');
                if (cleanSrc !== videoIframe.src) {
                    videoIframe.src = cleanSrc;
                }
            }
            videoAutoplayTriggered = false;
        }
    });
}

/**
 * Track link clicks for analytics (optional)
 */
function initLinkTracking() {
    const links = document.querySelectorAll('.link-button');
    
    links.forEach(link => {
        link.addEventListener('click', function(e) {
            const linkText = this.querySelector('.link-text')?.innerText || 'Unknown';
            const href = this.getAttribute('href');
            
            // Log to console for debugging (can be replaced with actual analytics)
            console.log(`[Link Click] ${linkText} -> ${href}`);
            
            // You can add Google Analytics or other tracking here
            // Example: gtag('event', 'click', { 'event_category': 'link', 'event_label': linkText });
        });
    });
}

/**
 * Add loading states to improve perceived performance
 */
function addLoadingStates() {
    // Add loading class to body
    document.body.classList.add('loaded');
    
    // Lazy load images that are below the fold
    const images = document.querySelectorAll('img[data-src]');
    
    if ('IntersectionObserver' in window) {
        const imageObserver = new IntersectionObserver((entries, observer) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    const img = entry.target;
                    const src = img.getAttribute('data-src');
                    if (src) {
                        img.src = src;
                        img.removeAttribute('data-src');
                    }
                    imageObserver.unobserve(img);
                }
            });
        });
        
        images.forEach(img => imageObserver.observe(img));
    } else {
        // Fallback for older browsers
        images.forEach(img => {
            const src = img.getAttribute('data-src');
            if (src) img.src = src;
        });
    }
}

/**
 * Smooth scroll to top (if needed)
 */
function scrollToTop() {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
}

/**
 * Add ripple effect to buttons (optional)
 */
function addRippleEffect() {
    const buttons = document.querySelectorAll('.link-button, .spoiler-trigger');
    
    buttons.forEach(button => {
        button.addEventListener('click', function(e) {
            const rect = button.getBoundingClientRect();
            const x = e.clientX - rect.left;
            const y = e.clientY - rect.top;
            
            const ripple = document.createElement('span');
            ripple.classList.add('ripple');
            ripple.style.left = `${x}px`;
            ripple.style.top = `${y}px`;
            
            button.style.position = 'relative';
            button.style.overflow = 'hidden';
            button.appendChild(ripple);
            
            setTimeout(() => {
                ripple.remove();
            }, 600);
        });
    });
}

// Export functions for debugging (if needed)
if (typeof module !== 'undefined' && module.exports) {
    module.exports = { initSpoiler, initLinkTracking };
}