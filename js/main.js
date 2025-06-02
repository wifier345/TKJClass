// Wait for the DOM to be fully loaded
document.addEventListener('DOMContentLoaded', function() {
    // Mobile Menu Toggle
    const menuToggle = document.querySelector('.menu-toggle');
    const navLinks = document.querySelector('.nav-links');
    
    const navPopup = document.getElementById('nav-popup');
    const closePopup = document.querySelector('.close-popup');
    let popupShown = false;

    if (!popupShown && navPopup) {
        setTimeout(() => {
            navPopup.classList.add('show');
        }, 3000); // Show after 2 seconds
        
        // Auto-hide popup after 10 seconds
        setTimeout(() => {
            if (navPopup.classList.contains('show')) {
                navPopup.classList.remove('show');
                localStorage.setItem('navPopupShown', 'true');
            }
        }, 5000);
    }

    // Initialize menu toggle
    if (menuToggle && navLinks) {
        menuToggle.addEventListener('click', function() {
            navLinks.classList.toggle('active');
            // Toggle icon between bars and times (x)
            const icon = this.querySelector('i');
            if (icon.classList.contains('fa-bars')) {
                icon.classList.remove('fa-bars');
                icon.classList.add('fa-times');
            } else {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        });
    }

    // Dropdown menu functionality for mobile
    const dropdownToggles = document.querySelectorAll('.dropdown-toggle');
    
    dropdownToggles.forEach(toggle => {
        toggle.addEventListener('click', function(e) {
            e.preventDefault();
            e.stopPropagation(); // Prevent event bubbling to parent elements
            
            // Check if we're on mobile view
            if (window.innerWidth <= 768) {
                const dropdownMenu = this.nextElementSibling;
                dropdownMenu.classList.toggle('show');
                
                // Toggle the caret icon
                const caret = this.querySelector('.fa-caret-down, .fa-caret-up');
                if (caret) {
                    caret.classList.toggle('fa-caret-down');
                    caret.classList.toggle('fa-caret-up');
                }
                
                // Close other open dropdowns
                dropdownToggles.forEach(otherToggle => {
                    if (otherToggle !== toggle) {
                        const otherMenu = otherToggle.nextElementSibling;
                        if (otherMenu && otherMenu.classList.contains('show')) {
                            otherMenu.classList.remove('show');
                            const otherCaret = otherToggle.querySelector('.fa-caret-up');
                            if (otherCaret) {
                                otherCaret.classList.add('fa-caret-down');
                                otherCaret.classList.remove('fa-caret-up');
                            }
                        }
                    }
                });
            }
        });
    });
    
    // Reset dropdown state when window is resized
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            document.querySelectorAll('.dropdown-menu').forEach(menu => {
                menu.classList.remove('show');
            });
            document.querySelectorAll('.dropdown-toggle .fa-caret-up').forEach(caret => {
                caret.classList.add('fa-caret-down');
                caret.classList.remove('fa-caret-up');
            });
        }
    });

    // Close popup when clicking the close button
    if (closePopup) {
        closePopup.addEventListener('click', function() {
            navPopup.classList.remove('show');
            localStorage.setItem('navPopupShown', 'true');
        });
    }
    
    // Close menu when clicking outside
    document.addEventListener('click', function(event) {
        if (menuToggle && navLinks && navLinks.classList.contains('active') && 
            !navLinks.contains(event.target) && 
            !menuToggle.contains(event.target)) {
            navLinks.classList.remove('active');
            // Reset icon to bars
            const icon = menuToggle.querySelector('i');
            if (icon && icon.classList.contains('fa-times')) {
                icon.classList.remove('fa-times');
                icon.classList.add('fa-bars');
            }
        }
    });
    
    // Close menu when clicking on a nav link (but not dropdown toggles)
    const navItems = document.querySelectorAll('.nav-links a:not(.dropdown-toggle)');
    navItems.forEach(item => {
        item.addEventListener('click', function() {
            if (navLinks.classList.contains('active')) {
                navLinks.classList.remove('active');
                // Reset icon to bars
                const icon = menuToggle.querySelector('i');
                if (icon && icon.classList.contains('fa-times')) {
                    icon.classList.remove('fa-times');
                    icon.classList.add('fa-bars');
                }
            }
        });
    });
    
    // Smooth scrolling for navigation links
    const navAnchors = document.querySelectorAll('a[href^="#"]');
    navAnchors.forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            if (this.getAttribute('href') !== '#') {
                e.preventDefault();
                const target = document.querySelector(this.getAttribute('href'));
                if (target) {
                    // Close mobile menu if open
                    if (navLinks && navLinks.classList.contains('active')) {
                        navLinks.classList.remove('active');
                        if (menuToggle) {
                            menuToggle.classList.remove('active');
                        }
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
            if (header) header.classList.add('scrolled');
        } else {
            if (header) header.classList.remove('scrolled');
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

    // Instagram Accounts Modal
    const showAccountsBtn = document.getElementById('show-accounts');
    const accountsModal = document.getElementById('accounts-modal');
    const accountsModalClose = document.querySelector('.account-modal-close');

    if (showAccountsBtn && accountsModal) {
        showAccountsBtn.addEventListener('click', function(e) {
            e.preventDefault();
            accountsModal.style.display = 'block';
        });
    }

    // Close accounts modal when clicking on X
    if (accountsModalClose) {
        accountsModalClose.addEventListener('click', function() {
            accountsModal.style.display = 'none';
        });
    }

    // Close accounts modal when clicking outside the content
    if (accountsModal) {
        accountsModal.addEventListener('click', function(event) {
            if (event.target === accountsModal) {
                accountsModal.style.display = 'none';
            }
        });
    }

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
        // Initialize EmailJS with your public key
        (function() {
            // Replace 'YOUR_PUBLIC_KEY' with your actual EmailJS public key
            emailjs.init('aoWiGaWit6olHe52J');
        })();

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
                // Show loading state
                const submitButton = contactForm.querySelector('button[type="submit"]');
                const originalButtonText = submitButton.textContent;
                submitButton.textContent = 'Sending...';
                submitButton.disabled = true;
                
                // Prepare template parameters
                const templateParams = {
                    from_name: document.getElementById('name').value,
                    from_email: document.getElementById('email').value,
                    message: document.getElementById('message').value,
                    time: new Date().toLocaleString()
                };
                
                // Replace 'YOUR_SERVICE_ID' and 'YOUR_TEMPLATE_ID' with your actual EmailJS service and template IDs
                emailjs.send('service_4v9m2fi', 'template_qkc55dv', templateParams)
                    .then(function(response) {
                        console.log('SUCCESS!', response.status, response.text);
                        alert('Pesan berhasil dikirim!');
                        contactForm.reset();
                    }, function(error) {
                        console.log('FAILED...', error);
                        alert('Gagal mengirim pesan. Silakan coba lagi.');
                    })
                    .finally(function() {
                        // Reset button state
                        submitButton.textContent = originalButtonText;
                        submitButton.disabled = false;
                    });
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

// Album gallery functionality
const albumCards = document.querySelectorAll('.album-card');
const albumModal = document.getElementById('album-modal');
const albumModalTitle = document.getElementById('album-modal-title');
const albumImages = document.getElementById('album-images');
const albumModalClose = document.querySelector('.album-modal-close');

// Password modal elements
const passwordModal = document.getElementById('password-modal');
const passwordInput = document.getElementById('album-password');
const submitPasswordBtn = document.getElementById('submit-password');
const passwordError = document.querySelector('.password-error');
const passwordModalClose = document.querySelector('.password-modal-close');

// Album data - you can expand this with more images for each album
const albumData = {
    album1: {
        title: "Bukber",
        date: "19 Maret, 2025",
        images: [
            { src: "images/album/a1/2.webp", caption: "Bukber - Image 2" },
            { src: "images/album/a1/1.webp", caption: "Bukber - Image 1" },
            { src: "images/album/a1/3.webp", caption: "Bukber - Image 3" },
            { src: "images/album/a1/4.webp", caption: "Bukber - Image 4" },
            { src: "images/album/a1/5.webp", caption: "Bukber - Image 5" },
            { src: "images/album/a1/6.webp", caption: "Bukber - Image 6" },
            { src: "images/album/a1/7.webp", caption: "Bukber - Image 7" },
            { src: "images/album/a1/8.webp", caption: "Bukber - Image 8" },
            { src: "images/album/a1/9.webp", caption: "Bukber - Image 9" }
        ]
    },
    album2: {
        title: "Hytam",
        date: "26 Mei, 2025",
        images: [
            { src: "images/album/a2/1.webp", caption: "Hytam - Image 1" },
            { src: "images/album/a2/2.webp", caption: "Hytam - Image 2" },
            { src: "images/album/a2/3.webp", caption: "Hytam - Image 3" },
            { src: "images/album/a2/4.webp", caption: "Hytam - Image 4" },
        ]
    },
    album3: {
        title: "Abis Renang",
        date: "10 Mei, 2025",
        images: [
            { src: "images/album/a3/1.webp", caption: "Abis Renang - Image 1" },
            { src: "images/album/a3/2.jpg", caption: "Abis Renang - Image 2" },
            { src: "images/album/a3/3.jpg", caption: "Abis Renang - Image 3" },
            { src: "images/album/a3/4.jpg", caption: "Abis Renang - Image 4" },
            { src: "images/album/a3/5.jpg", caption: "Abis Renang - Image 5" },
            { src: "images/album/a3/6.jpg", caption: "Abis Renang - Image 6" },
            { src: "images/album/a3/7.jpg", caption: "Abis Renang - Image 7" },
        ]
    },
    album4: {
        title: "Siak",
        date: "9 September, 2025",
        images: [
            { src: "images/album/a4/1.webp", caption: "Siak - Image 1" },
            { src: "images/album/a4/2.webp", caption: "Siak - Image 2" },
            { src: "images/album/a4/3.webp", caption: "Siak - Image 3" },
            { src: "images/album/a4/4.webp", caption: "Siak - Image 4" },
            { src: "images/album/a4/5.webp", caption: "Siak - Image 5" },
            { src: "images/album/a4/6.webp", caption: "Siak - Image 6" },
            { src: "images/album/a4/7.webp", caption: "Siak - Image 7" },
            { src: "images/album/a4/8.webp", caption: "Siak - Image 8" },
            { src: "images/album/a4/9.webp", caption: "Siak - Image 9" },
            { src: "images/album/a4/10.webp", caption: "Siak - Image 10" },
        ]
    },
    album5: {
        title: "Rendang Hunter",
        date: "akhir s1, 2024",
        images: [
            { src: "images/album/a5/1.webp", caption: "RH - Image 1" },
            { src: "images/album/a5/2.webp", caption: "RH - Image 2" },
            { src: "images/album/a5/3.webp", caption: "RH - Image 3" },
            { src: "images/album/a5/4.webp", caption: "RH - Image 4" },
            { src: "images/album/a5/5.webp", caption: "RH - Image 5" },
            { src: "images/album/a5/6.webp", caption: "RH - Image 6" },
            { src: "images/album/a5/7.webp", caption: "RH - Image 7" },
            { src: "images/album/a5/8.webp", caption: "RH - Image 8" }
        ]
    },
    album6: {
        title: "damn",
        date: "forget, 2024",
        images: [
            { src: "images/album/a6/1.webp", caption: "DAMN - Image 1" },
            { src: "images/album/a6/2.webp", caption: "DAMN - Image 2" },
            { src: "images/album/a6/3.webp", caption: "DAMN - Image 3" },
            { src: "images/album/a6/4.webp", caption: "DAMN - Image 4" },
            { src: "images/album/a6/5.webp", caption: "DAMN - Image 5" },
            { src: "images/album/a6/6.webp", caption: "DAMN - Image 6" }
        ]
    },
    album7: {
        title: "Kau Masih Pramuke?",
        date: "Forget, 2024",
        images: [
            { src: "images/album/a7/1.webp", caption: "Pramuk - Image 1" },
            { src: "images/album/a7/2.webp", caption: "Pramuk - Image 2" },
            { src: "images/album/a7/3.webp", caption: "Pramuk - Image 3" },
            { src: "images/album/a7/4.webp", caption: "Pramuk - Image 4" },
            { src: "images/album/a7/5.webp", caption: "Pramuk - Image 5" },
            { src: "images/album/a7/6.webp", caption: "Pramuk - Image 6" },
            { src: "images/album/a7/7.webp", caption: "Pramuk - Image 7" },
            { src: "images/album/a7/8.webp", caption: "Pramuk - Image 8" },
            { src: "images/album/a7/9.webp", caption: "Pramuk - Image 9" },
            { src: "images/album/a7/10.webp", caption: "Pramuk - Image 10" },
            { src: "images/album/a7/11.webp", caption: "Pramuk - Image 11" }
        ]
    },
    album8: {
        title: "RGT",
        date: "forget, 2024",
        images: [
            { src: "images/album/a8/1.webp", caption: "R - Image 1" },
            { src: "images/album/a8/2.webp", caption: "R - Image 2" },
            { src: "images/album/a8/3.webp", caption: "R - Image 3" },
            { src: "images/album/a8/4.webp", caption: "R - Image 4" }
        ]
    },
    albumAib: {
        title: "AIB TKJ",
        date: "akhir s1, 2024",
        password: "TKJAib",
        images: [
            { src: "images/album/aib/1.webp", caption: "aib - Image 1" },
            { src: "images/album/aib/2.webp", caption: "aib - Image 2" },
            { src: "images/album/aib/3.webp", caption: "aib - Image 3" },
            { src: "images/album/aib/4.webp", caption: "aib - Image 4" },
            { src: "images/album/aib/5.webp", caption: "aib - Image 5" },
            { src: "images/album/aib/6.webp", caption: "aib - Image 6" },
            { src: "images/album/aib/8.webp", caption: "aib - Image 8" },
            { src: "images/album/aib/9.webp", caption: "aib - Image 9" },
            { src: "images/album/aib/10.webp", caption: "aib - Image 10" },
            { src: "images/album/aib/11.webp", caption: "aib - Image 11" },
            { src: "images/album/aib/12.webp", caption: "aib - Image 12" },
            { src: "images/album/aib/13.webp", caption: "aib - Image 13" },
            { src: "images/album/aib/14.webp", caption: "aib - Image 14" },
            { src: "images/album/aib/15.jpg", caption: "aib - Image 15" },
            { src: "images/album/aib/16.jpg", caption: "aib - Image 16" },
            { src: "images/album/aib/17.jpg", caption: "aib - Image 17" },
            { src: "images/album/aib/18.jpg", caption: "aib - Image 18" },
            { src: "images/album/aib/19.jpg", caption: "aib - Image 19" },
            { src: "images/album/aib/20.jpg", caption: "aib - Image 20" },
            { src: "images/album/aib/21.jpg", caption: "aib - Image 21" },
            { src: "images/album/aib/22.jpg", caption: "aib - Image 22" },
            { src: "images/album/aib/23.jpg", caption: "aib - Image 23" },
            { src: "images/album/aib/24.jpg", caption: "aib - Image 24" },
            { src: "images/album/aib/25.jpg", caption: "aib - Image 25" },
            { src: "images/album/aib/26.jpg", caption: "aib - Image 26" },
            { src: "images/album/aib/27.jpg", caption: "aib - Image 27" },
            { src: "images/album/aib/28.jpg", caption: "aib - Image 28" },
            { src: "images/album/aib/29.jpg", caption: "aib - Image 29" },
            { src: "images/album/aib/30.jpg", caption: "aib - Image 30" },
            { src: "images/album/aib/31.jpg", caption: "aib - Image 31" },
            { src: "images/album/aib/32.jpg", caption: "aib - Image 32" },
            { src: "images/album/aib/33.jpg", caption: "aib - Image 33" },
            { src: "images/album/aib/34.jpg", caption: "aib - Image 34" },
            { src: "images/album/aib/35.jpg", caption: "aib - Image 35" },
            { src: "images/album/aib/36.jpg", caption: "aib - Image 36" },
            { src: "images/album/aib/37.jpg", caption: "aib - Image 37" },
            { src: "images/album/aib/38.jpg", caption: "aib - Image 38" },
            { src: "images/album/aib/39.jpg", caption: "aib - Image 39" },
            { src: "images/album/aib/40.jpg", caption: "aib - Image 40" },
            { src: "images/album/aib/41.jpg", caption: "aib - Image 41" },
            { src: "images/album/aib/42.jpg", caption: "aib - Image 42" },
            { src: "images/album/aib/43.jpg", caption: "aib - Image 43" },
            { src: "images/album/aib/44.jpg", caption: "aib - Image 44" },
            { src: "images/album/aib/45.jpg", caption: "aib - Image 45" },
            { src: "images/album/aib/46.jpg", caption: "aib - Image 46" },
            { src: "images/album/aib/47.jpg", caption: "aib - Image 47" },
            { src: "images/album/aib/48.jpg", caption: "aib - Image 48" },
            { src: "images/album/aib/49.jpg", caption: "aib - Image 49" },
            { src: "images/album/aib/50.jpg", caption: "aib - Image 50" },
            { src: "images/album/aib/51.jpg", caption: "aib - Image 51" }
        ]
    }
};

// Variable to store current album being accessed
let currentAlbumId = null;

// Function to open album modal and display images
function openAlbumModal(albumId) {
    const album = albumData[albumId];
    
    if (album) {
        // Set modal title
        albumModalTitle.textContent = album.title;
        
        // Clear previous images
        albumImages.innerHTML = '';
        
        // Add images to modal
        album.images.forEach(image => {
            const imageItem = document.createElement('div');
            imageItem.className = 'album-image-item';
            
            const img = document.createElement('img');
            img.src = image.src;
            img.alt = image.caption;
            
            const caption = document.createElement('div');
            caption.className = 'album-image-caption';
            caption.textContent = image.caption;
            
            imageItem.appendChild(img);
            imageItem.appendChild(caption);
            albumImages.appendChild(imageItem);
        });
        
        // Show modal
        albumModal.style.display = 'block';
        
        // Prevent body scrolling when modal is open
        document.body.style.overflow = 'hidden';
    }
}

// Open album modal when clicking on an album card
albumCards.forEach(card => {
    card.addEventListener('click', function() {
        const albumId = this.getAttribute('data-album-id');
        const isProtected = this.getAttribute('data-protected') === 'true';
        const album = albumData[albumId];
        
        if (album) {
            // Check if album is password protected
            if (isProtected && album.password) {
                // Store current album ID for later use
                currentAlbumId = albumId;
                
                // Reset password input and error message
                passwordInput.value = '';
                passwordError.style.display = 'none';
                
                // Show password modal
                passwordModal.style.display = 'block';
                
                // Focus on password input
                setTimeout(() => {
                    passwordInput.focus();
                }, 100);
                
                // Prevent body scrolling
                document.body.style.overflow = 'hidden';
            } else {
                // If not protected, open album directly
                openAlbumModal(albumId);
            }
        }
    });
});

// Handle password submission
if (submitPasswordBtn) {
    submitPasswordBtn.addEventListener('click', function() {
        validatePassword();
    });
}

// Allow Enter key to submit password
if (passwordInput) {
    passwordInput.addEventListener('keyup', function(e) {
        if (e.key === 'Enter') {
            validatePassword();
        }
    });
}

// Password validation function
function validatePassword() {
    const enteredPassword = passwordInput.value;
    const album = albumData[currentAlbumId];
    
    if (album && enteredPassword === album.password) {
        // Password correct, close password modal and open album
        passwordModal.style.display = 'none';
        openAlbumModal(currentAlbumId);
    } else {
        // Password incorrect, show error
        passwordError.style.display = 'block';
        passwordInput.focus();
    }
}

// Close password modal when clicking on X
if (passwordModalClose) {
    passwordModalClose.addEventListener('click', function() {
        passwordModal.style.display = 'none';
        // Re-enable body scrolling
        document.body.style.overflow = '';
    });
}

// Close password modal when clicking outside the content
window.addEventListener('click', function(e) {
    if (e.target === passwordModal) {
        passwordModal.style.display = 'none';
        // Re-enable body scrolling
        document.body.style.overflow = '';
    }
});

// Close album modal when clicking on X
if (albumModalClose) {
    albumModalClose.addEventListener('click', function() {
        albumModal.style.display = 'none';
        // Re-enable body scrolling
        document.body.style.overflow = '';
    }
)};

// Close album modal when clicking outside the content
window.addEventListener('click', function(e) {
    if (e.target === albumModal) {
        albumModal.style.display = 'none';
        // Re-enable body scrolling
        document.body.style.overflow = '';
    }
});

// Like/Dislike functionality
document.addEventListener('DOMContentLoaded', function() {
    // Initialize like/dislike system
    initLikeDislikeSystem();
});

function initLikeDislikeSystem() {
    // Get all like and dislike buttons
    const likeButtons = document.querySelectorAll('.like-btn');
    const dislikeButtons = document.querySelectorAll('.dislike-btn');
    
    // Load interaction data from localStorage
    const interactionData = loadInteractionData();
    
    // Initialize counters for each item
    initializeCounters(interactionData);
    
    // Add event listeners to like buttons
    likeButtons.forEach(button => {
        const itemType = button.getAttribute('data-type');
        const itemId = button.getAttribute('data-id');
        const itemKey = `${itemType}-${itemId}`;
        
        // Set active state if user has already liked this item
        if (interactionData[itemKey] === 'like') {
            button.classList.add('active');
        }
        
        button.addEventListener('click', function() {
            handleInteraction(this, 'like', itemType, itemId, interactionData);
        });
    });
    
    // Add event listeners to dislike buttons
    dislikeButtons.forEach(button => {
        const itemType = button.getAttribute('data-type');
        const itemId = button.getAttribute('data-id');
        const itemKey = `${itemType}-${itemId}`;
        
        // Set active state if user has already disliked this item
        if (interactionData[itemKey] === 'dislike') {
            button.classList.add('active');
        }
        
        button.addEventListener('click', function() {
            handleInteraction(this, 'dislike', itemType, itemId, interactionData);
        });
    });
}

function loadInteractionData() {
    // Load user interaction data from localStorage
    const savedData = localStorage.getItem('userInteractions');
    return savedData ? JSON.parse(savedData) : {};
}

function saveInteractionData(data) {
    // Save user interaction data to localStorage
    localStorage.setItem('userInteractions', JSON.stringify(data));
}

function loadCounterData() {
    // Load counter data from localStorage
    const savedData = localStorage.getItem('interactionCounters');
    return savedData ? JSON.parse(savedData) : {};
}

function saveCounterData(data) {
    // Save counter data to localStorage
    localStorage.setItem('interactionCounters', JSON.stringify(data));
}

function initializeCounters(interactionData) {
    // Load counter data
    const counterData = loadCounterData();
    
    // Initialize like counters
    document.querySelectorAll('.like-btn').forEach(button => {
        const itemType = button.getAttribute('data-type');
        const itemId = button.getAttribute('data-id');
        const itemKey = `${itemType}-${itemId}`;
        const countElement = button.querySelector('.like-count');
        
        // Set counter value from stored data or default to 0
        countElement.textContent = counterData[itemKey]?.likes || 0;
    });
    
    // Initialize dislike counters
    document.querySelectorAll('.dislike-btn').forEach(button => {
        const itemType = button.getAttribute('data-type');
        const itemId = button.getAttribute('data-id');
        const itemKey = `${itemType}-${itemId}`;
        const countElement = button.querySelector('.dislike-count');
        
        // Set counter value from stored data or default to 0
        countElement.textContent = counterData[itemKey]?.dislikes || 0;
    });
}

function handleInteraction(button, action, itemType, itemId, interactionData) {
    const itemKey = `${itemType}-${itemId}`;
    const counterData = loadCounterData();
    
    // Initialize counter data for this item if it doesn't exist
    if (!counterData[itemKey]) {
        counterData[itemKey] = { likes: 0, dislikes: 0 };
    }
    
    // Get the opposite action button
    const oppositeAction = action === 'like' ? 'dislike' : 'like';
    const oppositeButton = button.parentElement.querySelector(`.${oppositeAction}-btn`);
    
    // Check if user has already interacted with this item
    const previousAction = interactionData[itemKey];
    
    if (previousAction === action) {
        // User is clicking the same button again - remove their vote
        delete interactionData[itemKey];
        button.classList.remove('active');
        
        // Decrement counter
        counterData[itemKey][`${action}s`]--;
        button.querySelector(`.${action}-count`).textContent = counterData[itemKey][`${action}s`];
    } 
    else {
        // User is voting for the first time or changing their vote
        
        // If user previously voted the opposite, remove that vote
        if (previousAction === oppositeAction) {
            oppositeButton.classList.remove('active');
            counterData[itemKey][`${oppositeAction}s`]--;
            oppositeButton.querySelector(`.${oppositeAction}-count`).textContent = counterData[itemKey][`${oppositeAction}s`];
        }
        
        // Record new vote
        interactionData[itemKey] = action;
        button.classList.add('active');
        
        // Increment counter
        counterData[itemKey][`${action}s`]++;
        button.querySelector(`.${action}-count`).textContent = counterData[itemKey][`${action}s`];
    }
    
    // Save updated data
    saveInteractionData(interactionData);
    saveCounterData(counterData);
    
    // Show a small popup notification
    showNotification(`You ${action}d this ${itemType}!`);
}

function showNotification(message) {
    // Create notification element
    const notification = document.createElement('div');
    notification.className = 'popup-notification';
    notification.textContent = message;
    
    // Add to document
    document.body.appendChild(notification);
    
    // Remove after animation completes
    setTimeout(() => {
        notification.classList.add('closing');
        setTimeout(() => {
            notification.remove();
        }, 500);
    }, 2000);
}
