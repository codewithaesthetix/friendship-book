// Enhanced book flipping functionality
let currentPage = 0;
const totalPages = document.querySelectorAll('.page').length;
const pages = document.querySelectorAll('.page');

// Initialize pages with improved 3D effect
function initBook() {
    for (let i = 0; i < pages.length; i++) {
        if (i > 1) {
            pages[i].style.transform = 'rotateY(-180deg)';
            pages[i].style.zIndex = totalPages - i;
        } else {
            pages[i].style.zIndex = totalPages - i;
        }
        
        // Add shadow effect
        pages[i].style.boxShadow = '0 5px 20px rgba(0, 0, 0, 0.1)';
    }
    
    // Add page numbers to content pages
    document.querySelectorAll('.text-page').forEach((page, index) => {
        const pageNum = document.createElement('div');
        pageNum.className = 'page-number';
        pageNum.textContent = `Page ${index + 1}`;
        pageNum.style.position = 'absolute';
        pageNum.style.bottom = '15px';
        pageNum.style.right = '15px';
        pageNum.style.color = '#8a2387';
        pageNum.style.fontSize = '0.9rem';
        pageNum.style.opacity = '0.7';
        page.querySelector('.page-content').appendChild(pageNum);
    });
}

// Enhanced move page function with smooth animation
function movePage(element, pageNum) {
    if (pageNum <= currentPage) return;
    
    // Add sound effect
    playPageTurnSound();
    
    // Add page turn animation
    for (let i = 0; i < pageNum; i++) {
        pages[i].style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.2)';
        pages[i].style.transform = 'rotateY(-180deg)';
    }
    
    for (let i = pageNum; i < pages.length; i++) {
        pages[i].style.transition = 'transform 0.8s cubic-bezier(0.645, 0.045, 0.355, 1.2)';
        pages[i].style.transform = 'rotateY(0deg)';
    }
    
    // Update z-index for proper stacking
    for (let i = 0; i < pages.length; i++) {
        if (i < pageNum) {
            pages[i].style.zIndex = totalPages + pageNum - i;
        } else {
            pages[i].style.zIndex = totalPages - i;
        }
    }
    
    currentPage = pageNum;
    
    // Show page indicator
    showPageIndicator(pageNum);
}

// Play page turn sound
function playPageTurnSound() {
    try {
        // Create a subtle page turn sound using Web Audio API
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        const oscillator = audioContext.createOscillator();
        const gainNode = audioContext.createGain();
        
        oscillator.connect(gainNode);
        gainNode.connect(audioContext.destination);
        
        oscillator.frequency.setValueAtTime(100, audioContext.currentTime);
        oscillator.frequency.exponentialRampToValueAtTime(50, audioContext.currentTime + 0.1);
        
        gainNode.gain.setValueAtTime(0.1, audioContext.currentTime);
        gainNode.gain.exponentialRampToValueAtTime(0.01, audioContext.currentTime + 0.1);
        
        oscillator.start(audioContext.currentTime);
        oscillator.stop(audioContext.currentTime + 0.1);
    } catch (e) {
        // Fallback for browsers that don't support Web Audio API
        console.log("Page turned!");
    }
}

// Show current page indicator
function showPageIndicator(pageNum) {
    // Remove existing indicator
    const existingIndicator = document.querySelector('.current-page-indicator');
    if (existingIndicator) {
        existingIndicator.remove();
    }
    
    // Create new indicator
    const indicator = document.createElement('div');
    indicator.className = 'current-page-indicator';
    indicator.textContent = `${pageNum} / ${Math.floor(totalPages / 2)}`;
    indicator.style.position = 'fixed';
    indicator.style.bottom = '20px';
    indicator.style.right = '20px';
    indicator.style.background = 'rgba(138, 35, 135, 0.9)';
    indicator.style.color = 'white';
    indicator.style.padding = '8px 15px';
    indicator.style.borderRadius = '20px';
    indicator.style.fontSize = '1rem';
    indicator.style.fontWeight = '600';
    indicator.style.zIndex = '9999';
    indicator.style.boxShadow = '0 5px 15px rgba(0, 0, 0, 0.2)';
    
    document.body.appendChild(indicator);
    
    // Auto-hide after 2 seconds
    setTimeout(() => {
        indicator.style.opacity = '0';
        indicator.style.transition = 'opacity 0.5s';
        setTimeout(() => indicator.remove(), 500);
    }, 2000);
}

// Initialize the book with enhanced features
window.onload = function() {
    initBook();
    
    // Add click event to the friendship button
    const friendshipBtn = document.getElementById('friendshipBtn');
    if (friendshipBtn) {
        friendshipBtn.addEventListener('click', function() {
            alert("You're always in my heart, Samia ❤️, our friendship means the world to me! Can't wait to create more memories together!");
            
            // Add celebration effect
            this.innerHTML = "Friendship Accepted! 💖";
            this.style.background = "linear-gradient(90deg, #4CAF50, #2E7D32)";
            
            // Create floating hearts
            for (let i = 0; i < 20; i++) {
                createFloatingHeart();
            }
            
            // Play celebration sound
            playCelebrationSound();
        });
    }
    
    // Add keyboard navigation with improved controls
    document.addEventListener('keydown', function(e) {
        if (e.key === 'ArrowRight' && currentPage < 6) {
            movePage(pages[currentPage + 1], currentPage + 1);
        } else if (e.key === 'ArrowLeft' && currentPage > 0) {
            movePage(pages[currentPage], currentPage - 1);
        } else if (e.key === 'Home') {
            movePage(pages[0], 0);
        } else if (e.key === 'End') {
            movePage(pages[6], 6);
        }
    });
    
    // Add swipe support for mobile devices
    let touchStartX = 0;
    let touchEndX = 0;
    
    document.querySelector('.book').addEventListener('touchstart', function(e) {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    document.querySelector('.book').addEventListener('touchend', function(e) {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const swipeThreshold = 50;
        
        if (touchEndX < touchStartX - swipeThreshold && currentPage < 6) {
            // Swipe left - next page
            movePage(pages[currentPage + 1], currentPage + 1);
        }
        
        if (touchEndX > touchStartX + swipeThreshold && currentPage > 0) {
            // Swipe right - previous page
            movePage(pages[currentPage], currentPage - 1);
        }
    }
    
    // Show welcome message
    setTimeout(() => {
        showPageIndicator(1);
    }, 1000);
};

// Enhanced floating hearts function
function createFloatingHeart() {
    const heart = document.createElement('div');
    const heartTypes = ['💖', '💕', '💗', '💓', '💞'];
    heart.innerHTML = heartTypes[Math.floor(Math.random() * heartTypes.length)];
    
    heart.style.position = 'fixed';
    heart.style.fontSize = Math.random() * 25 + 20 + 'px';
    heart.style.left = Math.random() * window.innerWidth + 'px';
    heart.style.top = window.innerHeight + 10 + 'px';
    heart.style.zIndex = '9999';
    heart.style.opacity = '0.9';
    heart.style.pointerEvents = 'none';
    heart.style.textShadow = '0 0 10px rgba(255, 255, 255, 0.8)';
    heart.style.filter = `hue-rotate(${Math.random() * 360}deg)`;
    
    document.body.appendChild(heart);
    
    // Animate heart with random path
    const animation = heart.animate([
        { 
            transform: 'translateY(0px) rotate(0deg) scale(1)', 
            opacity: 0.9 
        },
        { 
            transform: `translateY(-${Math.random() * 300 + 150}px) translateX(${Math.random() * 100 - 50}px) rotate(${Math.random() * 720 - 360}deg) scale(${Math.random() * 0.5 + 0.5})`, 
            opacity: 0.5 
        },
        { 
            transform: `translateY(-${Math.random() * 600 + 300}px) translateX(${Math.random() * 200 - 100}px) rotate(${Math.random() * 1440 - 720}deg) scale(0.2)`, 
            opacity: 0 
        }
    ], {
        duration: Math.random() * 3000 + 2000,
        easing: 'cubic-bezier(0.215, 0.61, 0.355, 1)'
    });
    
    animation.onfinish = () => heart.remove();
}

// Celebration sound effect
function playCelebrationSound() {
    try {
        const audioContext = new (window.AudioContext || window.webkitAudioContext)();
        
        // Create multiple oscillators for a celebratory sound
        for (let i = 0; i < 5; i++) {
            setTimeout(() => {
                const oscillator = audioContext.createOscillator();
                const gainNode = audioContext.createGain();
                
                oscillator.connect(gainNode);
                gainNode.connect(audioContext.destination);
                
                oscillator.type = 'sine';
                oscillator.frequency.setValueAtTime(440 + (i * 100), audioContext.currentTime);
                
                gainNode.gain.setValueAtTime(0.05, audioContext.currentTime);
                gainNode.gain.exponentialRampToValueAtTime(0.001, audioContext.currentTime + 0.5);
                
                oscillator.start(audioContext.currentTime);
                oscillator.stop(audioContext.currentTime + 0.5);
            }, i * 100);
        }
    } catch (e) {
        // Fallback
        console.log("Celebration!");
    }
}

// Export functions for use in HTML
window.movePage = movePage;
window.createFloatingHeart = createFloatingHeart;