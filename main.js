// Services Section Scrolling
document.addEventListener('DOMContentLoaded', function() {
    // Initialize all scrollable sections
    initServicesScroller();
    initLogoScroller();
    initResourcesScroller();
    initTestimonialCarousel();
});

// Services Section
function initServicesScroller() {
    const scroller = document.getElementById('servicesScroller');
    if (!scroller) return;
    
    const cards = document.querySelectorAll('.service-card');
    const dotsContainer = document.getElementById('dotsContainer');
    const currentNumber = document.getElementById('currentNumber');
    const totalNumber = document.getElementById('totalNumber');
    
    // Set total number of services
    if (totalNumber && cards.length) {
        totalNumber.textContent = cards.length.toString().padStart(2, '0');
    }
    
    // Create dots based on number of cards
    if (dotsContainer && cards.length) {
        cards.forEach((_, index) => {
            const dot = document.createElement('div');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => {
                scrollToCard(index);
            });
            dotsContainer.appendChild(dot);
        });
    }
    
    // Enable drag scrolling for services
    enableDragScroll(scroller);
    
    // Update indicators on scroll
    scroller.addEventListener('scroll', updateServicesIndicators);
    
    // Handle window resize to recalculate card width
    window.addEventListener('resize', debounce(updateServicesIndicators, 250));
}

function scrollServices(direction) {
    const scroller = document.getElementById('servicesScroller');
    if (!scroller) return;
    
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length) return;
    
    const cardWidth = cards[0].offsetWidth + 24; // including margin
    
    // Calculate the current scroll position and visible cards
    const scrollPosition = scroller.scrollLeft;
    const visibleCards = Math.floor(scroller.offsetWidth / cardWidth);
    
    // Calculate the target scroll position
    let targetScroll;
    if (direction === 1) { // Right arrow
        targetScroll = scrollPosition + (visibleCards * cardWidth);
    } else { // Left arrow
        targetScroll = scrollPosition - (visibleCards * cardWidth);
    }
    
    // Ensure we don't scroll beyond the boundaries
    targetScroll = Math.max(0, Math.min(targetScroll, scroller.scrollWidth - scroller.offsetWidth));
    
    scroller.scrollTo({
        left: targetScroll,
        behavior: 'smooth'
    });
}

function scrollToCard(index) {
    const scroller = document.getElementById('servicesScroller');
    if (!scroller) return;
    
    const cards = document.querySelectorAll('.service-card');
    if (!cards.length || index >= cards.length) return;
    
    const cardWidth = cards[0].offsetWidth + 24; // including margin
    
    scroller.scrollTo({
        left: index * cardWidth,
        behavior: 'smooth'
    });
}

function updateServicesIndicators() {
    const scroller = document.getElementById('servicesScroller');
    if (!scroller) return;
    
    const cards = document.querySelectorAll('.service-card');
    const dots = document.querySelectorAll('.dot');
    const currentNumber = document.getElementById('currentNumber');
    
    if (!cards.length) return;
    
    const cardWidth = cards[0].offsetWidth + 24;
    const scrollPosition = scroller.scrollLeft;
    
    // Calculate active card index
    const activeIndex = Math.round(scrollPosition / cardWidth);
    
    // Update dots
    if (dots.length) {
        dots.forEach((dot, index) => {
            if (index === activeIndex) {
                dot.classList.add('active');
            } else {
                dot.classList.remove('active');
            }
        });
    }
    
    // Update current number
    if (currentNumber) {
        currentNumber.textContent = (activeIndex + 1).toString().padStart(2, '0');
    }
}

// Logo Scroller
function initLogoScroller() {
    const scroller = document.getElementById('logoScroller');
    if (!scroller) return;
    
    enableDragScroll(scroller);
}

// Resources Scroller
function initResourcesScroller() {
    const slider = document.getElementById('resourcesSlider');
    if (!slider) return;
    
    enableDragScroll(slider);
}

// Testimonial Carousel
function initTestimonialCarousel() {
    const prevBtn = document.getElementById('prevTestimonial');
    const nextBtn = document.getElementById('nextTestimonial');
    const peopleContainer = document.getElementById('testimonialPeople');
    const quoteElement = document.getElementById('testimonialQuote');
    
    if (!prevBtn || !nextBtn || !peopleContainer || !quoteElement) return;
    
    const people = document.querySelectorAll('.testimonial-person');
    let currentIndex = 2; // Start with the active one (index 2)
    
    // Set up event listeners
    prevBtn.addEventListener('click', () => navigateTestimonials(-1));
    nextBtn.addEventListener('click', () => navigateTestimonials(1));
    
    // Enable swipe for mobile
    enableSwipe(peopleContainer, (direction) => {
        if (direction === 'left') {
            navigateTestimonials(1);
        } else if (direction === 'right') {
            navigateTestimonials(-1);
        }
    });
    
    function navigateTestimonials(direction) {
        // Remove active class from current person
        people[currentIndex].classList.remove('active');
        
        // Update index
        currentIndex += direction;
        
        // Handle boundaries
        if (currentIndex < 0) currentIndex = people.length - 1;
        if (currentIndex >= people.length) currentIndex = 0;
        
        // Add active class to new person
        people[currentIndex].classList.add('active');
        
        // Update quote
        const newQuote = people[currentIndex].getAttribute('data-quote');
        if (newQuote) {
            quoteElement.textContent = newQuote;
        }
        
        // Scroll to center the active person
        people[currentIndex].scrollIntoView({
            behavior: 'smooth',
            inline: 'center'
        });
    }
}

// Utility Functions
function enableDragScroll(element) {
    let isDown = false;
    let startX;
    let scrollLeft;
    
    // Mouse events
    element.addEventListener('mousedown', (e) => {
        isDown = true;
        element.style.cursor = 'grabbing';
        startX = e.pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
    });
    
    element.addEventListener('mouseleave', () => {
        isDown = false;
        element.style.cursor = 'grab';
    });
    
    element.addEventListener('mouseup', () => {
        isDown = false;
        element.style.cursor = 'grab';
    });
    
    element.addEventListener('mousemove', (e) => {
        if (!isDown) return;
        e.preventDefault();
        const x = e.pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walk;
    });
    
    // Touch events for mobile
    element.addEventListener('touchstart', (e) => {
        isDown = true;
        startX = e.touches[0].pageX - element.offsetLeft;
        scrollLeft = element.scrollLeft;
    });
    
    element.addEventListener('touchend', () => {
        isDown = false;
    });
    
    element.addEventListener('touchmove', (e) => {
        if (!isDown) return;
        const x = e.touches[0].pageX - element.offsetLeft;
        const walk = (x - startX) * 2;
        element.scrollLeft = scrollLeft - walk;
    });
}

function enableSwipe(element, callback) {
    let touchStartX = 0;
    let touchEndX = 0;
    
    element.addEventListener('touchstart', (e) => {
        touchStartX = e.changedTouches[0].screenX;
    });
    
    element.addEventListener('touchend', (e) => {
        touchEndX = e.changedTouches[0].screenX;
        handleSwipe();
    });
    
    function handleSwipe() {
        const minSwipeDistance = 50; // Minimum distance for a swipe to count
        
        if (touchEndX < touchStartX && touchStartX - touchEndX > minSwipeDistance) {
            callback('left'); // Swipe left
        }
        
        if (touchEndX > touchStartX && touchEndX - touchStartX > minSwipeDistance) {
            callback('right'); // Swipe right
        }
    }
}

function debounce(func, wait) {
    let timeout;
    return function executedFunction(...args) {
        const later = () => {
            clearTimeout(timeout);
            func(...args);
        };
        clearTimeout(timeout);
        timeout = setTimeout(later, wait);
    };
}

// Add CSS for grab cursor
const style = document.createElement('style');
style.textContent = `
    .services-scroller, .logo-scroller, .horizontal-scroll-wrapper, .testimonial-carousel {
        cursor: grab;
    }
    
    .services-scroller:active, .logo-scroller:active, .horizontal-scroll-wrapper:active, .testimonial-carousel:active {
        cursor: grabbing;
    }
`;
document.head.appendChild(style);