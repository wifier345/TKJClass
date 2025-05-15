// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Navigation menu toggle for mobile
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');

    if (menuToggle) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            menuToggle.classList.toggle('active');
        });
    }

    // Smooth scrolling for navigation links
    const navAnchors = document.querySelectorAll('a[href^="#"]');
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    if (navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        menuToggle.classList.remove('active');
                    }
                    
                    window.scrollTo({
                        top: target.offsetTop,
                        behavior: 'smooth'
                    });
                }
            }
        });
    });

    // Header scroll effect
    const header = document.querySelector('.header-container');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    });

    // Back to top button
    const backToTopBtn = document.querySelector('.back-to-top');
    window.addEventListener('scroll', function() {
        if (window.scrollY > 300) {
            backToTopBtn.classList.add('visible');
        } else {
            backToTopBtn.classList.remove('visible');
        }
    });

    // Initialize the photos slider
    const photoSlides = document.querySelectorAll('.photo-slide');
    const photoPrevBtn = document.querySelector('.photos-prev-btn');
    const photoNextBtn = document.querySelector('.photos-next-btn');
    const photoDotsContainer = document.querySelector('.photos-dots');
    let currentPhotoSlide = 0;

    // Create dots based on number of slides
    if (photoSlides.length > 0 && photoDotsContainer) {
        photoSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('photos-dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToPhotoSlide(index));
            photoDotsContainer.appendChild(dot);
        });
    }

    // Initialize the slider
    function showPhotoSlide(n) {
        // Hide all slides
        photoSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Update dots
        const dots = document.querySelectorAll('.photos-dot');
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide and activate current dot
        if (photoSlides[n]) {
            photoSlides[n].style.display = 'block';
            if (dots[n]) dots[n].classList.add('active');
        }
    }

    function goToPhotoSlide(n) {
        currentPhotoSlide = n;
        if (currentPhotoSlide >= photoSlides.length) currentPhotoSlide = 0;
        if (currentPhotoSlide < 0) currentPhotoSlide = photoSlides.length - 1;
        showPhotoSlide(currentPhotoSlide);
    }

    // Next/previous controls
    if (photoPrevBtn) {
        photoPrevBtn.addEventListener('click', () => {
            goToPhotoSlide(currentPhotoSlide - 1);
        });
    }

    if (photoNextBtn) {
        photoNextBtn.addEventListener('click', () => {
            goToPhotoSlide(currentPhotoSlide + 1);
        });
    }

    // Auto slide every 5 seconds
    let photoSlideInterval = setInterval(() => {
        goToPhotoSlide(currentPhotoSlide + 1);
    }, 5000);

    // Pause auto slide on hover
    const photosSlider = document.querySelector('.photos-slider');
    if (photosSlider) {
        photosSlider.addEventListener('mouseenter', () => {
            clearInterval(photoSlideInterval);
        });
        
        photosSlider.addEventListener('mouseleave', () => {
            photoSlideInterval = setInterval(() => {
                goToPhotoSlide(currentPhotoSlide + 1);
            }, 5000);
        });
    }

    // Initialize the slider
    if (photoSlides.length > 0) {
        showPhotoSlide(currentPhotoSlide);
    }

    // Gallery modal functionality
    const galleryItems = document.querySelectorAll('.gallery-item');
    const modal = document.getElementById('gallery-modal');
    const modalImg = document.getElementById('modal-img');
    const modalCaption = document.getElementById('modal-caption');
    const modalClose = document.querySelector('.modal-close');

    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = 'block';
            modalImg.src = this.querySelector('img').src;
            modalCaption.textContent = this.querySelector('img').alt;
        });
    });

    if (modalClose) {
        modalClose.addEventListener('click', function() {
            modal.style.display = 'none';
        });
    }

    // Close modal when clicking outside the image
    window.addEventListener('click', function(e) {
        if (e.target === modal) {
            modal.style.display = 'none';
        }
    });

    // Testimonial slider
    const testimonialSlides = document.querySelectorAll('.testimonial-slide');
    const prevBtn = document.querySelector('.prev-btn');
    const nextBtn = document.querySelector('.next-btn');
    const dotsContainer = document.querySelector('.testimonial-dots');
    let currentSlide = 0;

    // Create dots based on number of slides
    if (testimonialSlides.length > 0 && dotsContainer) {
        testimonialSlides.forEach((_, index) => {
            const dot = document.createElement('span');
            dot.classList.add('dot');
            if (index === 0) dot.classList.add('active');
            dot.addEventListener('click', () => goToSlide(index));
            dotsContainer.appendChild(dot);
        });
    }

    // Initialize the slider
    function showSlide(n) {
        // Hide all slides
        testimonialSlides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Update dots
        const dots = document.querySelectorAll('.dot');
        dots.forEach(dot => dot.classList.remove('active'));
        
        // Show current slide and activate current dot
        if (testimonialSlides[n]) {
            testimonialSlides[n].style.display = 'block';
            if (dots[n]) dots[n].classList.add('active');
        }
    }

    function goToSlide(n) {
        currentSlide = n;
        if (currentSlide >= testimonialSlides.length) currentSlide = 0;
        if (currentSlide < 0) currentSlide = testimonialSlides.length - 1;
        showSlide(currentSlide);
    }

    // Next/previous controls
    if (prevBtn) {
        prevBtn.addEventListener('click', () => {
            goToSlide(currentSlide - 1);
        });
    }

    if (nextBtn) {
        nextBtn.addEventListener('click', () => {
            goToSlide(currentSlide + 1);
        });
    }

    // Initialize the slider
    if (testimonialSlides.length > 0) {
        showSlide(currentSlide);
    }

    // Form validation
    const contactForm = document.getElementById('contactForm');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            let isValid = true;
            
            // Simple validation
            const inputs = this.querySelectorAll('input, textarea');
            inputs.forEach(input => {
                const errorMessage = input.nextElementSibling;
                if (!input.value.trim()) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorMessage) errorMessage.textContent = 'This field is required';
                    errorMessage.style.display = 'block';
                } else if (input.type === 'email' && !/^\S+@\S+\.\S+$/.test(input.value)) {
                    isValid = false;
                    input.classList.add('error');
                    if (errorMessage) errorMessage.textContent = 'Please enter a valid email';
                    errorMessage.style.display = 'block';
                } else {
                    input.classList.remove('error');
                    if (errorMessage) errorMessage.style.display = 'none';
                }
            });
            
            if (isValid) {
                // In a real application, you would send the form data to a server here
                alert('Form submitted successfully!');
                contactForm.reset();
            }
        });
    }

    // Newsletter form
    const newsletterForm = document.getElementById('newsletterForm');
    if (newsletterForm) {
        newsletterForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const emailInput = this.querySelector('input[type="email"]');
            if (emailInput && emailInput.value.trim() && /^\S+@\S+\.\S+$/.test(emailInput.value)) {
                alert('Thank you for subscribing to our newsletter!');
                newsletterForm.reset();
            } else {
                alert('Please enter a valid email address.');
            }
        });
    }

    // Blog search functionality
    const blogSearchForm = document.querySelector('.blog-search form');
    if (blogSearchForm) {
        blogSearchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const searchInput = this.querySelector('input[type="text"]');
            const searchTerm = searchInput.value.trim().toLowerCase();
            
            if (searchTerm === '') {
                alert('Please enter a search term');
                return;
            }
            
            // Get all blog cards
            const blogCards = document.querySelectorAll('.blog-card');
            let matchFound = false;
            
            // Hide all blog cards initially
            blogCards.forEach(card => {
                card.style.display = 'none';
            });
            
            // Show only cards that match the search term
            blogCards.forEach(card => {
                const title = card.querySelector('.blog-title').textContent.toLowerCase();
                const excerpt = card.querySelector('.blog-excerpt').textContent.toLowerCase();
                const category = card.querySelector('.blog-category').textContent.toLowerCase();
                
                if (title.includes(searchTerm) || excerpt.includes(searchTerm) || category.includes(searchTerm)) {
                    card.style.display = 'block';
                    matchFound = true;
                }
            });
            
            // Show message if no matches found
            const blogsGrid = document.querySelector('.blogs-grid');
            const noResultsMsg = document.getElementById('no-search-results');
            
            if (!matchFound) {
                if (!noResultsMsg) {
                    const message = document.createElement('div');
                    message.id = 'no-search-results';
                    message.className = 'no-results-message';
                    message.innerHTML = `<p>No results found for "${searchTerm}". <a href="#" id="clear-search">Clear search</a></p>`;
                    blogsGrid.parentNode.insertBefore(message, blogsGrid.nextSibling);
                    
                    document.getElementById('clear-search').addEventListener('click', function(e) {
                        e.preventDefault();
                        clearSearch();
                    });
                }
            } else if (noResultsMsg) {
                noResultsMsg.remove();
            }
            
            // Hide pagination when searching
            const pagination = document.querySelector('.blogs-pagination');
            if (pagination) {
                pagination.style.display = matchFound ? 'none' : 'flex';
            }
        });
        
        // Add clear search button
        const searchInput = blogSearchForm.querySelector('input[type="text"]');
        const clearButton = document.createElement('button');
        clearButton.type = 'button';
        clearButton.className = 'clear-search-btn';
        clearButton.innerHTML = '<i class="fas fa-times"></i>';
        clearButton.style.display = 'none';
        searchInput.parentNode.insertBefore(clearButton, searchInput.nextSibling);
        
        searchInput.addEventListener('input', function() {
            clearButton.style.display = this.value ? 'block' : 'none';
        });
        
        clearButton.addEventListener('click', function() {
            clearSearch();
        });
        
        function clearSearch() {
            searchInput.value = '';
            clearButton.style.display = 'none';
            
            // Show all blog cards
            const blogCards = document.querySelectorAll('.blog-card');
            blogCards.forEach(card => {
                card.style.display = 'block';
            });
            
            // Remove no results message if it exists
            const noResultsMsg = document.getElementById('no-search-results');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
            
            // Show pagination again
            const pagination = document.querySelector('.blogs-pagination');
            if (pagination) {
                pagination.style.display = 'flex';
            }
        }
    }

    // Blog categories functionality
    const categoryLinks = document.querySelectorAll('.blog-category-item');
    if (categoryLinks.length > 0) {
        categoryLinks.forEach(link => {
            link.addEventListener('click', function(e) {
                e.preventDefault();
                
                // Remove active class from all category links
                categoryLinks.forEach(cat => cat.classList.remove('active'));
                
                // Add active class to clicked category
                this.classList.add('active');
                
                // Get category name (remove the count in parentheses)
                const categoryName = this.textContent.split('(')[0].trim().toLowerCase();
                
                // Get all blog grid containers
                const page1Grid = document.querySelector('.blogs-grid:not([id])');
                const page2Grid = document.getElementById('page-2');
                const page3Grid = document.getElementById('page-3');
                
                // Get all blog cards from all pages
                const allBlogCards = document.querySelectorAll('.blog-card');
                let matchFound = false;
                
                // If "All" category is selected
                if (this === showAllLink) {
                    clearCategoryFilter();
                    return;
                }
                
                // Create a filtered container if it doesn't exist
                let filteredContainer = document.getElementById('filtered-results');
                if (!filteredContainer) {
                    filteredContainer = document.createElement('div');
                    filteredContainer.id = 'filtered-results';
                    filteredContainer.className = 'blogs-grid';
                    const firstGrid = document.querySelector('.blogs-grid');
                    if (firstGrid) {
                        firstGrid.parentNode.insertBefore(filteredContainer, firstGrid);
                    }
                }
                
                // Clear the filtered container
                filteredContainer.innerHTML = '';
                
                // Add matching cards to filtered container
                allBlogCards.forEach(card => {
                    const category = card.querySelector('.blog-category').textContent.toLowerCase();
                    
                    if (category === categoryName) {
                        // Clone the card and add it to the filtered container
                        const clonedCard = card.cloneNode(true);
                        filteredContainer.appendChild(clonedCard);
                        matchFound = true;
                    }
                });
                
                // Hide all original grid containers
                if (page1Grid) page1Grid.style.display = 'none';
                if (page2Grid) page2Grid.style.display = 'none';
                if (page3Grid) page3Grid.style.display = 'none';
                
                // Show filtered container
                filteredContainer.style.display = 'grid';
                
                // Show message if no matches found
                const noResultsMsg = document.getElementById('no-category-results');
                
                if (!matchFound) {
                    if (!noResultsMsg) {
                        const message = document.createElement('div');
                        message.id = 'no-category-results';
                        message.className = 'no-results-message';
                        message.innerHTML = `<p>No posts found in category "${categoryName}". <a href="#" id="clear-category">Show all</a></p>`;
                        filteredContainer.parentNode.insertBefore(message, filteredContainer.nextSibling);
                        
                        document.getElementById('clear-category').addEventListener('click', function(e) {
                            e.preventDefault();
                            clearCategoryFilter();
                        });
                    }
                } else if (noResultsMsg) {
                    noResultsMsg.remove();
                }
                
                // Hide pagination when filtering by category
                const pagination = document.querySelector('.blogs-pagination');
                if (pagination) {
                    pagination.style.display = 'none';
                }
            });
        });
        
        // Add a "Show All" category at the beginning
        const categoriesContainer = document.querySelector('.blog-categories');
        const showAllLink = document.createElement('a');
        showAllLink.href = '#';
        showAllLink.className = 'blog-category-item active';
        showAllLink.textContent = 'All';
        categoriesContainer.insertBefore(showAllLink, categoriesContainer.firstChild);
        
        showAllLink.addEventListener('click', function(e) {
            e.preventDefault();
            clearCategoryFilter();
        });
        
        function clearCategoryFilter() {
            // Remove active class from all category links
            categoryLinks.forEach(cat => cat.classList.remove('active'));
            
            // Add active class to "Show All" link
            showAllLink.classList.add('active');
            
            // Hide filtered container if it exists
            const filteredContainer = document.getElementById('filtered-results');
            if (filteredContainer) {
                filteredContainer.style.display = 'none';
            }
            
            // Show page 1 grid and hide others
            const page1Grid = document.querySelector('.blogs-grid:not([id])');
            const page2Grid = document.getElementById('page-2');
            const page3Grid = document.getElementById('page-3');
            
            if (page1Grid) page1Grid.style.display = 'grid';
            if (page2Grid) page2Grid.style.display = 'none';
            if (page3Grid) page3Grid.style.display = 'none';
            
            // Remove no results message if it exists
            const noResultsMsg = document.getElementById('no-category-results');
            if (noResultsMsg) {
                noResultsMsg.remove();
            }
            
            // Show pagination again
            const pagination = document.querySelector('.blogs-pagination');
            if (pagination) {
                pagination.style.display = 'flex';
            }
            
            // Reset active page to 1
            const paginationLinks = document.querySelectorAll('.blogs-pagination .page-number');
            paginationLinks.forEach(link => {
                link.classList.remove('active');
                if (link.textContent == '1') {
                    link.classList.add('active');
                }
            });
        }
    }

    // Blog pagination functionality
    const paginationLinks = document.querySelectorAll('.blogs-pagination .page-number');
    const blogsPerPage = 6; // Number of blogs to show per page
    
    if (paginationLinks.length > 0) {
        // Get all blog grid containers
        const page1Grid = document.querySelector('.blogs-grid:not([id])');
        const page2Grid = document.getElementById('page-2');
        const page3Grid = document.getElementById('page-3');
        
        // Add click event to pagination links
        document.querySelector('.blogs-pagination').addEventListener('click', function(e) {
            e.preventDefault(); // Prevent default link behavior
            
            let target = e.target;
            
            // If clicked on the icon inside the link
            if (target.tagName === 'I') {
                target = target.parentElement;
            }
            
            // Only proceed if we clicked on a page number link
            if (target.classList.contains('page-number')) {
                // Handle next button
                if (target.querySelector('.fa-chevron-right')) {
                    const activePage = document.querySelector('.page-number.active');
                    const currentPage = parseInt(activePage.textContent);
                    if (currentPage < 3) { // We have 3 pages total
                        showPage(currentPage + 1);
                    }
                    return;
                }
                
                const pageNum = parseInt(target.textContent);
                if (!isNaN(pageNum)) {
                    showPage(pageNum);
                }
            }
        });
        
        function showPage(pageNum) {
            // Hide all blog grid containers
            if (page1Grid) page1Grid.style.display = 'none';
            if (page2Grid) page2Grid.style.display = 'none';
            if (page3Grid) page3Grid.style.display = 'none';
            
            // Show the selected page grid
            if (pageNum === 1 && page1Grid) {
                page1Grid.style.display = 'grid';
            } else if (pageNum === 2 && page2Grid) {
                page2Grid.style.display = 'grid';
            } else if (pageNum === 3 && page3Grid) {
                page3Grid.style.display = 'grid';
            }
            
            // Update active page link
            paginationLinks.forEach(link => {
                link.classList.remove('active');
                if (link.textContent == pageNum) {
                    link.classList.add('active');
                }
            });
            
            // Scroll to top of blogs section
            const blogsSection = document.querySelector('.blogs-header');
            if (blogsSection) {
                window.scrollTo({
                    top: blogsSection.offsetTop - 100,
                    behavior: 'smooth'
                });
            }
        }
        
        function updatePaginationLinks(totalPages) {
            const paginationContainer = document.querySelector('.blogs-pagination');
            
            // Clear existing pagination links
            paginationContainer.innerHTML = '';
            
            // Add page numbers
            for (let i = 1; i <= totalPages; i++) {
                const pageLink = document.createElement('a');
                pageLink.href = '#';
                pageLink.className = 'page-number' + (i === 1 ? ' active' : '');
                pageLink.textContent = i;
                paginationContainer.appendChild(pageLink);
            }
            
            // Add next button
            if (totalPages > 1) {
                const nextLink = document.createElement('a');
                nextLink.href = '#';
                nextLink.className = 'page-number';
                nextLink.innerHTML = '<i class="fas fa-chevron-right"></i>';
                paginationContainer.appendChild(nextLink);
            }
        }
    }
});