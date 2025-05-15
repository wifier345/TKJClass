// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Intersection Observer for scroll animations
    const animateElements = document.querySelectorAll('.animate-on-scroll');
    
    // Create the observer
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            // If element is in viewport
            if (entry.isIntersecting) {
                // Get animation type from class
                if (entry.target.classList.contains('fade-in')) {
                    entry.target.classList.add('animate', 'fade-in');
                } else if (entry.target.classList.contains('fade-in-up')) {
                    entry.target.classList.add('animate', 'fade-in');
                } else if (entry.target.classList.contains('slide-in-left')) {
                    entry.target.classList.add('animate', 'slide-left');
                } else if (entry.target.classList.contains('slide-in-right')) {
                    entry.target.classList.add('animate', 'slide-right');
                } else {
                    entry.target.classList.add('animate', 'fade-in');
                }
                
                // Add delay if specified
                const delay = entry.target.getAttribute('data-delay');
                if (delay) {
                    entry.target.style.animationDelay = `${parseInt(delay)}ms`;
                }
                
                // Unobserve after animation is triggered
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.1 }); // Trigger when at least 10% of the element is visible
    
    // Observe all elements with animation classes
    animateElements.forEach(element => {
        observer.observe(element);
    });
    
    // Page loading animation
    window.addEventListener('load', function() {
        // Create loader element if it doesn't exist
        let loader = document.querySelector('.loader');
        if (!loader) {
            loader = document.createElement('div');
            loader.className = 'loader';
            const spinner = document.createElement('div');
            spinner.className = 'loader-spinner';
            loader.appendChild(spinner);
            document.body.appendChild(loader);
        }
        
        // Hide loader after page is fully loaded
        setTimeout(() => {
            loader.classList.add('hidden');
            setTimeout(() => {
                loader.remove();
            }, 500);
        }, 1000);
    });
    
    // Animate numbers in stats section
    const statNumbers = document.querySelectorAll('.stat-number');
    const animateNumbers = (entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                const target = entry.target;
                const targetNumber = parseInt(target.textContent);
                let count = 0;
                const duration = 2000; // 2 seconds
                const interval = Math.floor(duration / targetNumber);
                
                const counter = setInterval(() => {
                    count++;
                    target.textContent = count;
                    if (count === targetNumber) {
                        clearInterval(counter);
                    }
                }, interval);
                
                // Unobserve after animation
                observer.unobserve(target);
            }
        });
    };
    
    const statsObserver = new IntersectionObserver(animateNumbers, { threshold: 0.5 });
    statNumbers.forEach(stat => {
        statsObserver.observe(stat);
    });
    
    // Parallax effect for header background
    const header = document.querySelector('header');
    if (header) {
        window.addEventListener('scroll', () => {
            const scrollPosition = window.scrollY;
            if (scrollPosition < window.innerHeight) {
                header.style.backgroundPositionY = `${scrollPosition * 0.5}px`;
            }
        });
    }
    
    // Animate service cards on hover
    const serviceCards = document.querySelectorAll('.service-card');
    serviceCards.forEach(card => {
        card.addEventListener('mouseenter', () => {
            card.style.transform = 'translateY(-15px)';
            card.style.boxShadow = '0 15px 30px rgba(0, 0, 0, 0.2)';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'translateY(0)';
            card.style.boxShadow = 'var(--box-shadow)';
        });
    });
});