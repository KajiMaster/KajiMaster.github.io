document.addEventListener("DOMContentLoaded", () => {
    initHamburgerMenu();
    initSloganFading();
    loadTestimonials();
    initTestimonialSlider();
});

/* ========================
   Hamburger Menu Toggle
======================== */
function initHamburgerMenu() {
    const hamburger = document.getElementById("hamburger");
    const navDropdown = document.getElementById("navDropdown");

    hamburger.addEventListener("click", () => {
        navDropdown.classList.toggle("show");
    });

    document.addEventListener("click", (event) => {
        if (!hamburger.contains(event.target) && !navDropdown.contains(event.target)) {
            navDropdown.classList.remove("show");
        }
    });
}

/* ====================
   Slogan Fading Effect
==================== */
function initSloganFading() {
    const statements = [
        "Extend your voice... enrich our world!",
        "¡Extiende tu voz... \u00A1Enriquece nuestro mundo!"
    ];
    let currentIndex = 0;
    const textElement = document.getElementById("fadingText");

    setInterval(() => {
        textElement.style.opacity = 0;
        setTimeout(() => {
            currentIndex = (currentIndex + 1) % statements.length;
            textElement.textContent = statements[currentIndex];
            textElement.style.opacity = 1;
        }, 2000);
    }, 10000);
}

/* ===========================
   Testimonial Loading & Events
=========================== */
function loadTestimonials() {
    const testimonialContainer = document.getElementById("testimonialContainer");

    fetch("data/testimonials.json")
        .then(response => response.json())
        .then(testimonials => {
            renderTestimonials(testimonials);
            addTestimonialEvents();
        })
        .catch(err => console.error("Error loading testimonials:", err));
}

function renderTestimonials(testimonials) {
    const container = document.getElementById("testimonialContainer");
    container.innerHTML = ""; // Clear existing testimonials

    testimonials.forEach(({ id, name, image, videoPreview, videoUrl, snippet, details }) => {
        container.innerHTML += `
            <div class="testimonial" id="${id}">
                <!-- First Tier -->
                <img src="${image}" alt="${name}" class="testimonial-photo default-photo">
                <h3 class="student-name">${name}</h3>
                <p class="testimonial-snippet">
                    "${snippet}"
                    <span class="read-more" 
                          data-id="${id}" 
                          data-name="${name}" 
                          data-image="${image}" 
                          data-video-preview="${videoPreview}" 
                          data-video-url="${videoUrl}" 
                          data-details="${details}">
                          click for more
                    </span>
                </p>
                <!-- Second Tier -->
                <div class="testimonial-details hidden" id="${id}-details">
                    <div class="video-thumbnail" data-video-url="${videoUrl}">
                        <img src="${videoPreview}" alt="${name}">
                        <div class="play-overlay">&#9658;</div>
                    </div>
                    <h3>${name}</h3>
                    <p>${details}</p>
                    <button class="close-more">Less</button>
                </div>
            </div>
        `;
    });
}


function addTestimonialEvents() {
    const readMoreElements = document.querySelectorAll(".read-more");

    readMoreElements.forEach(el => {
        el.addEventListener("click", () => {
            const parentBox = el.closest(".testimonial");
            const details = parentBox.querySelector(".testimonial-details");
            const snippet = parentBox.querySelector(".testimonial-snippet");
            const defaultPhoto = parentBox.querySelector(".default-photo");
            const studentName = parentBox.querySelector(".student-name"); // Select the first-tier name

            // Correct attribute access
            const name = el.dataset.name;
            const videoPreview = el.dataset.videoPreview; // Correct access
            const videoUrl = el.dataset.videoUrl;         // Correct access
            const fullDetails = el.dataset.details;

            // Populate second-tier content
            const videoThumbnail = details.querySelector(".video-thumbnail img");
            videoThumbnail.src = videoPreview; // Set correct video preview image
            videoThumbnail.alt = name;

            const videoThumbnailDiv = details.querySelector(".video-thumbnail");
            videoThumbnailDiv.dataset.videoUrl = videoUrl; // Set correct YouTube URL

            details.querySelector("h3").textContent = name;
            details.querySelector("p").textContent = fullDetails;

            // Hide first tier
            snippet.classList.add("hidden");
            defaultPhoto.classList.add("hidden");
            studentName.classList.add("hidden"); // Hide the first-tier name

            // Show second tier
            details.classList.remove("hidden");
        });
    });

    // Close button logic for second-tier cards
    const closeButtons = document.querySelectorAll(".close-more");
    closeButtons.forEach(btn => {
        btn.addEventListener("click", () => {
            const parentBox = btn.closest(".testimonial");
            const details = parentBox.querySelector(".testimonial-details");
            const snippet = parentBox.querySelector(".testimonial-snippet");
            const defaultPhoto = parentBox.querySelector(".default-photo");
            const studentName = parentBox.querySelector(".student-name");

            // Restore first-tier elements
            snippet.classList.remove("hidden");
            defaultPhoto.classList.remove("hidden");
            studentName.classList.remove("hidden"); // Show the first-tier name

            // Hide the second tier
            details.classList.add("hidden");
        });
    });

    // Attach video modal open event
    const videoThumbnails = document.querySelectorAll(".video-thumbnail");
    videoThumbnails.forEach(thumb => {
        thumb.addEventListener("click", () => {
            const videoUrl = thumb.dataset.videoUrl; // Correct access
            openVideoModal(videoUrl);
        });
    });
}


function openVideoModal(videoUrl) {
    const modal = document.createElement("div");
    modal.classList.add("video-modal");
    modal.innerHTML = `
        <div class="modal-content">
            <span class="close-modal">&times;</span>
            <iframe 
                src="${videoUrl}?autoplay=1" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
            </iframe>
        </div>
    `;
    document.body.appendChild(modal);

    // Close modal
    modal.querySelector(".close-modal").addEventListener("click", () => modal.remove());
    modal.addEventListener("click", (e) => { if (e.target === modal) modal.remove(); });
}

/* ===========================
   Testimonial Slider
=========================== */
function initTestimonialSlider() {
    const sliderContainer = document.querySelector(".testimonial-container");
    const leftArrow = document.querySelector(".left-arrow");
    const rightArrow = document.querySelector(".right-arrow");

    let currentIndex = 0;
    const visibleCount = 3;

    function slide(direction) {
        const totalTestimonials = sliderContainer.childElementCount;
        if (direction === "left") currentIndex = Math.max(currentIndex - 1, 0);
        else if (direction === "right") currentIndex = Math.min(currentIndex + 1, totalTestimonials - visibleCount);
        sliderContainer.style.transform = `translateX(-${currentIndex * (100 / visibleCount)}%)`;
    }

    leftArrow.addEventListener("click", () => slide("left"));
    rightArrow.addEventListener("click", () => slide("right"));
}
