document.addEventListener('DOMContentLoaded', () => {
    // Calendar Functionality
    const checkInInput = document.getElementById('checkInInput');
    const checkOutInput = document.getElementById('checkOutInput');
    const calendarOverlay = document.getElementById('calendarOverlay');
    const closeBtn = document.getElementById('closeBtn');
    const modalTitle = document.getElementById('modalTitle');
    const prevBtn = document.getElementById('prevBtn');
    const nextBtn = document.getElementById('nextBtn');
    const currentMonthGrid = document.getElementById('currentMonthGrid');
    const nextMonthGrid = document.getElementById('nextMonthGrid');
    const currentMonthHeader = document.getElementById('currentMonthHeader');
    const nextMonthHeader = document.getElementById('nextMonthHeader');
    const selectedCheckIn = document.getElementById('selectedCheckIn');
    const selectedCheckOut = document.getElementById('selectedCheckOut');
    const confirmBtn = document.getElementById('confirmBtn');

    let currentDate = new Date();
    let selectedCheckInDate = null;
    let selectedCheckOutDate = null;
    let selectingCheckIn = true;
    let displayedMonth = new Date(currentDate.getFullYear(), currentDate.getMonth());

    function formatDate(date) {
        return date.toISOString().split('T')[0];
    }

    function generateCalendar(month, year, container) {
        container.innerHTML = '';
        const firstDay = new Date(year, month).getDay();
        const daysInMonth = new Date(year, month + 1, 0).getDate();
        const prevMonthDays = firstDay === 0 ? 6 : firstDay - 1;
        const prevMonthLastDay = new Date(year, month, 0).getDate();

        for (let i = prevMonthDays; i > 0; i--) {
            const day = document.createElement('div');
            day.classList.add('calendar-day', 'other-month');
            day.textContent = prevMonthLastDay - i + 1;
            container.appendChild(day);
        }

        for (let i = 1; i <= daysInMonth; i++) {
            const day = document.createElement('div');
            day.classList.add('calendar-day');
            day.textContent = i;
            const date = new Date(year, month, i);
            if (date.toDateString() === new Date().toDateString()) {
                day.classList.add('today');
            }
            if (selectedCheckInDate && date.toDateString() === selectedCheckInDate.toDateString()) {
                day.classList.add('selected');
            }
            if (selectedCheckOutDate && date.toDateString() === selectedCheckOutDate.toDateString()) {
                day.classList.add('selected');
            }
            if (selectedCheckInDate && selectedCheckOutDate && date > selectedCheckInDate && date < selectedCheckOutDate) {
                day.classList.add('in-range');
            }
            day.addEventListener('click', () => selectDate(date));
            container.appendChild(day);
        }

        const totalCells = prevMonthDays + daysInMonth;
        const nextMonthDays = (7 - (totalCells % 7)) % 7;
        for (let i = 1; i <= nextMonthDays; i++) {
            const day = document.createElement('div');
            day.classList.add('calendar-day', 'other-month');
            day.textContent = i;
            container.appendChild(day);
        }
    }

    function updateCalendars() {
        const nextMonth = new Date(displayedMonth.getFullYear(), displayedMonth.getMonth() + 1);
        currentMonthHeader.textContent = displayedMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
        nextMonthHeader.textContent = nextMonth.toLocaleString('default', { month: 'long', year: 'numeric' });
        generateCalendar(displayedMonth.getMonth(), displayedMonth.getFullYear(), currentMonthGrid);
        generateCalendar(nextMonth.getMonth(), nextMonth.getFullYear(), nextMonthGrid);
    }

    function selectDate(date) {
        if (selectingCheckIn) {
            selectedCheckInDate = date;
            selectedCheckOutDate = null;
            selectingCheckIn = false;
            modalTitle.textContent = 'Select Check-out Date';
        } else {
            if (date <= selectedCheckInDate) {
                selectedCheckInDate = date;
                selectedCheckOutDate = null;
                selectingCheckIn = false;
                modalTitle.textContent = 'Select Check-out Date';
            } else {
                selectedCheckOutDate = date;
                selectingCheckIn = true;
                modalTitle.textContent = 'Select Check-in Date';
            }
        }
        updateCalendars();
        selectedCheckIn.textContent = selectedCheckInDate ? formatDate(selectedCheckInDate) : 'Not selected';
        selectedCheckOut.textContent = selectedCheckOutDate ? formatDate(selectedCheckOutDate) : 'Not selected';
    }

    checkInInput.addEventListener('click', () => {
        selectingCheckIn = true;
        modalTitle.textContent = 'Select Check-in Date';
        calendarOverlay.style.display = 'block';
        updateCalendars();
    });

    checkOutInput.addEventListener('click', () => {
        selectingCheckIn = false;
        modalTitle.textContent = 'Select Check-out Date';
        calendarOverlay.style.display = 'block';
        updateCalendars();
    });

    closeBtn.addEventListener('click', () => {
        calendarOverlay.style.display = 'none';
    });

    prevBtn.addEventListener('click', () => {
        displayedMonth.setMonth(displayedMonth.getMonth() - 1);
        updateCalendars();
    });

    nextBtn.addEventListener('click', () => {
        displayedMonth.setMonth(displayedMonth.getMonth() + 1);
        updateCalendars();
    });

    confirmBtn.addEventListener('click', () => {
        if (selectedCheckInDate) checkInInput.value = formatDate(selectedCheckInDate);
        if (selectedCheckOutDate) checkOutInput.value = formatDate(selectedCheckOutDate);
        calendarOverlay.style.display = 'none';
    });

    // Guest Counter Functionality
    const guestsInput = document.getElementById('guestsInput');
    const guestsDropdown = document.getElementById('guestsDropdown');
    const roomsMinus = document.getElementById('roomsMinus');
    const roomsPlus = document.getElementById('roomsPlus');
    const roomsCount = document.getElementById('roomsCount');
    const adultsMinus = document.getElementById('adultsMinus');
    const adultsPlus = document.getElementById('adultsPlus');
    const adultsCount = document.getElementById('adultsCount');
    const childrenMinus = document.getElementById('childrenMinus');
    const childrenPlus = document.getElementById('childrenPlus');
    const childrenCount = document.getElementById('childrenCount');

    let rooms = 1;
    let adults = 1;
    let children = 0;

    function updateGuestsInput() {
        guestsInput.value = `${rooms} Room${rooms > 1 ? 's' : ''}, ${adults} Adult${adults > 1 ? 's' : ''}, ${children} Child${children !== 1 ? 'ren' : ''}`;
        roomsMinus.disabled = rooms <= 1;
        adultsMinus.disabled = adults <= 1;
        childrenMinus.disabled = children <= 0;
    }

    guestsInput.addEventListener('click', () => {
        guestsDropdown.classList.toggle('show');
    });

    roomsMinus.addEventListener('click', () => {
        if (rooms > 1) rooms--;
        roomsCount.textContent = rooms;
        updateGuestsInput();
    });

    roomsPlus.addEventListener('click', () => {
        rooms++;
        roomsCount.textContent = rooms;
        updateGuestsInput();
    });

    adultsMinus.addEventListener('click', () => {
        if (adults > 1) adults--;
        adultsCount.textContent = adults;
        updateGuestsInput();
    });

    adultsPlus.addEventListener('click', () => {
        adults++;
        adultsCount.textContent = adults;
        updateGuestsInput();
    });

    childrenMinus.addEventListener('click', () => {
        if (children > 0) children--;
        childrenCount.textContent = children;
        updateGuestsInput();
    });

    childrenPlus.addEventListener('click', () => {
        children++;
        childrenCount.textContent = children;
        updateGuestsInput();
    });

    document.addEventListener('click', (e) => {
        if (!guestsInput.contains(e.target) && !guestsDropdown.contains(e.target)) {
            guestsDropdown.classList.remove('show');
        }
    });

    updateGuestsInput();
});
    // Scroll effect for navigation bar
        window.addEventListener('scroll', function() {
            const navbar = document.getElementById('navbar');
            const topBar = document.getElementById('topBar');
            const scrollPosition = window.scrollY;
            
            if (scrollPosition > 50) {
                navbar.classList.remove('transparent');
                navbar.classList.add('scrolled');
                topBar.classList.add('hidden');
            } else {
                navbar.classList.remove('scrolled');
                navbar.classList.add('transparent');
                topBar.classList.remove('hidden');
            }
        });
        
    document.addEventListener('DOMContentLoaded', () => {
        const bookingContainer = document.querySelector('.booking-container');
        setTimeout(() => bookingContainer.classList.add('visible'), 100);
    });


        // Search Modal Functionality
        const searchIcon = document.getElementById('searchIcon');
        const searchModal = document.getElementById('searchModal');
        const searchClose = document.getElementById('searchClose');
        const searchInput = document.getElementById('searchInput');

        // Open search modal
        searchIcon.addEventListener('click', function() {
            searchModal.classList.add('active');
            document.body.style.overflow = 'hidden';
            setTimeout(() => {
                searchInput.focus();
            }, 400);
        });

        // Close search modal
        searchClose.addEventListener('click', function() {
            searchModal.classList.remove('active');
            document.body.style.overflow = 'auto';
        });

        // Close modal on escape key
        document.addEventListener('keydown', function(e) {
            if (e.key === 'Escape' && searchModal.classList.contains('active')) {
                searchModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Close modal when clicking outside
        searchModal.addEventListener('click', function(e) {
            if (e.target === searchModal) {
                searchModal.classList.remove('active');
                document.body.style.overflow = 'auto';
            }
        });

        // Add smooth scrolling behavior
        document.documentElement.style.scrollBehavior = 'smooth';

    const offerCards = document.querySelectorAll('.offer-card');


document.addEventListener('DOMContentLoaded', () => {
  const offerCards = document.querySelectorAll('.offer-card');

  function revealOnScroll() {
    const triggerBottom = window.innerHeight * 0.92;
    offerCards.forEach(card => {
      const cardTop = card.getBoundingClientRect().top;
      if (cardTop < triggerBottom) {
        card.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealOnScroll);
  revealOnScroll(); // Initial check
});
document.addEventListener('DOMContentLoaded', () => {
  // ...existing code for offer cards...

  const luxuryImages = document.querySelectorAll('.image-large, .image-small-top, .image-small-bottom');

  function revealLuxuryImagesOnScroll() {
    const triggerBottom = window.innerHeight * 0.92;
    luxuryImages.forEach(img => {
      const imgTop = img.getBoundingClientRect().top;
      if (imgTop < triggerBottom) {
        img.classList.add('visible');
      }
    });
  }

  window.addEventListener('scroll', revealLuxuryImagesOnScroll);
  revealLuxuryImagesOnScroll(); // Initial check
});
document.addEventListener('DOMContentLoaded', () => {
    const titles = document.querySelectorAll(
        '.modal-title, .subtitle, .text-title, .header-title, .room-title, .main-title'
    );
    titles.forEach(title => title.classList.add('animated-title'));
    const observer = new IntersectionObserver(entries => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, { threshold: 0.2 });
    titles.forEach(title => observer.observe(title));
    
});

document.addEventListener('DOMContentLoaded', () => {
    // Existing code (calendar, guest counter, etc.) remains unchanged

    // Menu header slideshow
    const menuHeader = document.querySelector('.menu-header');
    if (menuHeader) {
        const images = [
            'https://images.pexels.com/photos/842571/pexels-photo-842571.jpeg?cs=srgb&dl=pexels-valeriya-842571.jpg&fm=jpg',
            'https://images.unsplash.com/photo-1517248135467-4c7edcad34c4?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1559329007-40df8a9345d8?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
            'https://images.unsplash.com/photo-1506748686214-e9df14d4d9d0?ixlib=rb-4.0.3&auto=format&fit=crop&w=1350&q=80',
        ];

        // Create slideshow container
        const slideshow = document.createElement('div');
        slideshow.classList.add('menu-slideshow');
        images.forEach((img, index) => {
            const slide = document.createElement('div');
            slide.classList.add('menu-slide');
            slide.style.backgroundImage = `url(${img})`;
            if (index === 0) slide.classList.add('active');
            slideshow.appendChild(slide);
        });
        menuHeader.insertBefore(slideshow, menuHeader.firstChild);

        // Slideshow logic
        let currentSlide = 0;
        function nextSlide() {
            const slides = slideshow.querySelectorAll('.menu-slide');
            slides[currentSlide].classList.remove('active');
            currentSlide = (currentSlide + 1) % images.length;
            slides[currentSlide].classList.add('active');
        }
        setInterval(nextSlide, 3000);
    }

        // Video content here.....//
 const videoThumbnail = document.getElementById('videoThumbnail');
        const mainVideo = document.getElementById('mainVideo');
        const loadingOverlay = document.getElementById('loadingOverlay');

        // Handle thumbnail click
        videoThumbnail.addEventListener('click', function() {
            // Show loading overlay
            loadingOverlay.style.display = 'flex';
            
            // Hide thumbnail
            videoThumbnail.style.display = 'none';
            
            // Show and play video
            mainVideo.style.display = 'block';
            
            // Simulate loading time (remove this in production)
            setTimeout(() => {
                loadingOverlay.style.display = 'none';
                mainVideo.play().catch(e => {
                    console.log('Video play failed:', e);
                    // Fallback: just hide loading overlay
                    loadingOverlay.style.display = 'none';
                });
            }, 1000);
        });

        // Handle video end - show thumbnail again
        mainVideo.addEventListener('ended', function() {
            mainVideo.style.display = 'none';
            videoThumbnail.style.display = 'flex';
        });

        // Handle video error
        mainVideo.addEventListener('error', function() {
            loadingOverlay.style.display = 'none';
            videoThumbnail.style.display = 'flex';
            alert('Video could not be loaded. Please check the video URL.');
        });

});
// Team Grid Animation
document.addEventListener('DOMContentLoaded', () => {
    const teamGrid = document.querySelector('.team-grid');
    const teamGridOuter = document.querySelector('.team-grid-outer');
    if (!teamGrid || !teamGridOuter) return;

    let scrollAmount = 0;
    const speed = 1.5;

    // Clone the team members for infinite scroll
    const teamMembers = teamGrid.querySelectorAll('.team-member');
    teamMembers.forEach(member => {
        const clone = member.cloneNode(true);
        teamGrid.appendChild(clone);
    });

    // Set initial styles
    teamGrid.style.display = 'flex';
    teamGrid.style.gap = '2rem';
    teamGrid.style.width = 'max-content';
    teamGridOuter.style.overflow = 'hidden';

    function autoScroll() {
        scrollAmount += speed;
        if (scrollAmount >= teamGrid.scrollWidth / 2) {
            scrollAmount = 0;
            teamGrid.style.transition = 'none';
            teamGridOuter.scrollLeft = 0;
            teamGrid.offsetHeight; // Force reflow
            teamGrid.style.transition = '';
        }
        teamGridOuter.scrollLeft = scrollAmount;
        requestAnimationFrame(autoScroll);
    }

    // Start the animation
    autoScroll();
});
// experice section animation
 document.addEventListener('DOMContentLoaded', () => {
            const statsSection = document.querySelector('.stats-section');
            const statItems = document.querySelectorAll('.stat-item');
            const statNumbers = document.querySelectorAll('.stat-number');

            // Function to animate number counting
            function animateCount(element, target, duration) {
                let start = 0;
                const increment = target / (duration / 16); // ~60fps
                let current = 0;
                const interval = setInterval(() => {
                    current += increment;
                    if (current >= target) {
                        current = target;
                        clearInterval(interval);
                    }
                    element.textContent = Math.round(current);
                }, 16);
            }

            // Intersection Observer to trigger animations on scroll
            const observer = new IntersectionObserver((entries) => {
                entries.forEach(entry => {
                    if (entry.isIntersecting) {
                        statItems.forEach(item => item.classList.add('visible'));

                        statNumbers.forEach(number => {
                            const target = parseInt(number.getAttribute('data-target'));
                            animateCount(number, target, 2000); // 2s duration
                        });

                        observer.unobserve(entry.target);
                    }
                });
            }, { threshold: 0.3 });

            observer.observe(statsSection);
        });
          window.addEventListener('load', () => {
            const contactWrapper = document.getElementById('contactWrapper');
            setTimeout(() => {
                contactWrapper.classList.add('visible');
            }, 100);
        });

        // Form submission
        document.getElementById('contactForm').addEventListener('submit', function(e) {
            e.preventDefault();
            
            const btn = document.querySelector('.submit-btn');
            const originalText = btn.textContent;
            
            btn.textContent = 'Sending...';
            btn.style.opacity = '0.7';
            
            setTimeout(() => {
                btn.textContent = 'Message Sent!';
                btn.style.background = 'linear-gradient(45deg, #4CAF50, #45a049)';
                
                setTimeout(() => {
                    btn.textContent = originalText;
                    btn.style.background = 'linear-gradient(45deg, #d4b896, #c9a876)';
                    btn.style.opacity = '1';
                    document.getElementById('contactForm').reset();
                }, 2000);
            }, 1000);
        });


        
