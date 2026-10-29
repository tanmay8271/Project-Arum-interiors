/* =========================================================
   AURUM INTERIORS - MAIN JAVASCRIPT
   (loaded with `defer`, so the DOM is ready when this runs)
   ========================================================= */

const menuButton = document.querySelector(".menu-toggle");
const navigation = document.querySelector(".main-navigation");
const header = document.querySelector(".site-header");
const desktopQuery = window.matchMedia("(min-width: 901px)"); // matches the CSS breakpoint

/* 1. MOBILE NAVIGATION */
function setMenu(open) {
    navigation.classList.toggle("active", open);
    menuButton.classList.toggle("active", open);
    document.body.classList.toggle("menu-open", open); // locks page scroll
    menuButton.setAttribute("aria-expanded", String(open));
    menuButton.setAttribute(
        "aria-label",
        open ? "Close navigation menu" : "Open navigation menu"
    );
}

if (menuButton && navigation) {
    // Toggle on button click
    menuButton.addEventListener("click", () => {
        setMenu(!navigation.classList.contains("active"));
    });

    // Close when any link inside the menu is clicked
    navigation.addEventListener("click", (event) => {
        if (event.target.closest("a")) setMenu(false);
    });

    // Close with Escape and return focus to the button
    document.addEventListener("keydown", (event) => {
        if (event.key === "Escape" && navigation.classList.contains("active")) {
            setMenu(false);
            menuButton.focus();
        }
    });

    // Reset when the viewport becomes desktop-sized
    desktopQuery.addEventListener("change", (event) => {
        if (event.matches) setMenu(false);
    });
}

/* 2. HEADER SCROLL EFFECT */
if (header) {
    const updateHeader = () => {
        header.classList.toggle("scrolled", window.scrollY > 80);
    };
    window.addEventListener("scroll", updateHeader, { passive: true });
    updateHeader();
}

/* 3. SCROLL REVEAL */
const revealElements = document.querySelectorAll(
    ".service-card, .project-card, .process-item, .testimonial-slider, .faq-item"
);

if ("IntersectionObserver" in window) {
    const revealObserver = new IntersectionObserver(
        (entries) => {
            entries.forEach((entry) => {
                if (entry.isIntersecting) {
                    entry.target.classList.add("visible");
                    revealObserver.unobserve(entry.target);
                }
            });
        },
        { threshold: 0.15 }
    );

    revealElements.forEach((element) => {
        element.classList.add("reveal");
        revealObserver.observe(element);
    });
}
// No fallback needed: without IntersectionObserver the .reveal class is never
// added, so everything simply stays visible.

/* Smooth scrolling and the header offset are handled in CSS:
   html { scroll-behavior: smooth; scroll-padding-top: 90px; } */

/* 4. PROJECT FILTERS */
const filterButtons = document.querySelectorAll(".filter-btn");
const projectCards = document.querySelectorAll(".project-card");

filterButtons.forEach((button) => {
    button.addEventListener("click", () => {
        const filter = button.dataset.filter;
        filterButtons.forEach((b) => {
            const active = b === button;
            b.classList.toggle("is-active", active);
            b.setAttribute("aria-pressed", String(active));
        });
        projectCards.forEach((card) => {
            card.hidden = filter !== "all" && card.dataset.category !== filter;
        });
    });
});

/* 5. IMAGE LOADING STATE */
document.querySelectorAll(".project-image img").forEach((img) => {
    const markLoaded = () => img.classList.add("loaded");
    if (img.complete) markLoaded();
    else {
        img.addEventListener("load", markLoaded);
        img.addEventListener("error", markLoaded);
    }
});

/* 6. TESTIMONIAL CAROUSEL */
const slides = document.querySelectorAll(".testimonial");
const dotsBox = document.getElementById("t-dots");

if (slides.length > 1 && dotsBox) {
    let current = 0;
    const dots = [...slides].map((_, i) => {
        const dot = document.createElement("button");
        dot.type = "button";
        dot.className = "slider-dot";
        dot.setAttribute("aria-label", "Show testimonial " + (i + 1));
        dot.addEventListener("click", () => showSlide(i));
        dotsBox.appendChild(dot);
        return dot;
    });

    function showSlide(index) {
        current = (index + slides.length) % slides.length;
        slides.forEach((slide, i) => slide.classList.toggle("is-active", i === current));
        dots.forEach((dot, i) => dot.classList.toggle("is-active", i === current));
    }

    document.getElementById("t-prev").addEventListener("click", () => showSlide(current - 1));
    document.getElementById("t-next").addEventListener("click", () => showSlide(current + 1));
    showSlide(0);
}

/* 7. BACK-TO-TOP BUTTON */
const toTop = document.getElementById("to-top");
if (toTop) {
    window.addEventListener("scroll", () => { toTop.hidden = window.scrollY < 600; }, { passive: true });
    toTop.addEventListener("click", () => window.scrollTo({ top: 0, behavior: "smooth" }));
}

/* 8. CONTACT FORM */
const form = document.getElementById("contact-form");

if (form) {
    const status = document.getElementById("form-status");

    const rules = {
        name: (v) => (v.trim().length < 2 ? "Please enter your name." : ""),
        email: (v) => (/^[^\s@]+@[^\s@]+\.[^\s@]{2,}$/.test(v.trim()) ? "" : "Please enter a valid email address."),
        phone: (v) => (v.trim() === "" || /^[+\d][\d\s-]{7,14}$/.test(v.trim()) ? "" : "Please enter a valid phone number."),
        message: (v) => (v.trim().length < 10 ? "Please tell us a little more (at least 10 characters)." : "")
    };

    function validateField(id) {
        const input = form.elements[id];
        const error = rules[id](input.value);
        document.getElementById(id + "-error").textContent = error;
        input.setAttribute("aria-invalid", String(error !== ""));
        if (error) input.setAttribute("aria-describedby", id + "-error");
        return error === "";
    }

    Object.keys(rules).forEach((id) => form.elements[id].addEventListener("blur", () => validateField(id)));

    /* TEMPORARY: opens the visitor's email app with the details filled in.
       When your Spring Boot API is ready, replace the body of this function with:
       fetch("/api/contact", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify(data) }) */
    // Backend base URL. Use localhost while developing; change to your deployed API
    // (e.g. "https://api.yourdomain.com") before uploading the site.
    const API_URL = "http://localhost:8080";

    async function sendForm(data) {
        const response = await fetch(API_URL + "/api/contact", {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(data)
        });
        if (!response.ok) throw new Error("Request failed: " + response.status);
    }

    form.addEventListener("submit", async (event) => {
        event.preventDefault();
        const valid = Object.keys(rules).map(validateField).every(Boolean);
        if (!valid) {
            status.textContent = "Please fix the highlighted fields.";
            const firstInvalid = form.querySelector('[aria-invalid="true"]');
            if (firstInvalid) firstInvalid.focus();
            return;
        }
        try {
            await sendForm(Object.fromEntries(new FormData(form)));
            status.textContent = "Thank you! We'll be in touch shortly.";
            form.reset();
        } catch (error) {
            status.textContent = "Something went wrong. Please email us directly.";
        }
    });
}