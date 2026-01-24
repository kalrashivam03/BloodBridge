/* ======================================================
   BloodBridge - main.js (Popup-based errors)
====================================================== */

/* =========================
   POPUP ERROR SYSTEM
========================= */
function showPopup(type, message, callback) {
    let popup = document.querySelector(".popup-overlay");

    if (!popup) {
        popup = document.createElement("div");
        popup.className = "popup-overlay";
        popup.innerHTML = `
            <div class="popup-box">
                <h3 class="popup-title"></h3>
                <p class="popup-message"></p>
                <button class="popup-btn">OK</button>
            </div>
        `;
        document.body.appendChild(popup);
    }

    const title = popup.querySelector(".popup-title");
    const msg = popup.querySelector(".popup-message");
    const btn = popup.querySelector(".popup-btn");

    if (type === "success") {
        title.textContent = "Success";
        title.style.color = "#2e7d32";
    } else {
        title.textContent = "Error";
        title.style.color = "#d62828";
    }

    msg.textContent = message;
    popup.style.display = "flex";

    btn.onclick = () => {
        popup.style.display = "none";
        if (callback) callback();
    };
}


/* =========================
   HELPERS
========================= */
function getFormData(form) {
    const data = {};
    new FormData(form).forEach((value, key) => {
        data[key] = value.trim();
    });
    return data;
}

function showLoader(form) {
    const loader = form.querySelector(".loader");
    if (loader) loader.style.display = "block";
}

function hideLoader(form) {
    const loader = form.querySelector(".loader");
    if (loader) loader.style.display = "none";
}

/* =========================
   APP STATE
========================= */
const AppState = {
    isLoggedIn: false,
    userRole: null
};

/* =========================
   SIGN IN (CLASS BASED)
========================= */
const signinForm = document.querySelector(".signin-form");

if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = getFormData(signinForm);

        if (!data.email || !data.password) {
            showPopup("Please fill in all required fields.");
            return;
        }

        showLoader(signinForm);

        setTimeout(() => {
            hideLoader(signinForm);
            AppState.isLoggedIn = true;

            showPopup("success", "Sign in successful!", () => {
                window.location.href = "Home.html";
            });
        }, 1500);

    });
}

/* =========================
   SIGN UP (CLASS BASED)
========================= */
const signupForm = document.querySelector(".signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = getFormData(signupForm);

        if (!data.name || !data.email || !data.role || !data.password || !data.confirmPassword) {
            showPopup("All fields are mandatory. Please complete the form.");
            return;
        }

        if (data.password.length < 6) {
            showPopup("Password must be at least 6 characters long.");
            return;
        }

        if (data.password !== data.confirmPassword) {
            showPopup("Passwords do not match. Please try again.");
            return;
        }

        showLoader(signupForm);

        setTimeout(() => {
            hideLoader(signupForm);

            showPopup("success", "Account created successfully!", () => {
                window.location.href = "signin.html";
            });
        }, 1500);

    });
}

/* =========================
   NAVBAR
========================= */
function updateNavbar() {
    document.querySelectorAll(".auth-link").forEach(link => {
        link.style.display = AppState.isLoggedIn ? "none" : "inline-block";
    });

    const logoutBtn = document.querySelector(".logout-btn");
    if (logoutBtn) {
        logoutBtn.style.display = AppState.isLoggedIn ? "inline-block" : "none";
    }
}

function logoutUser() {
    AppState.isLoggedIn = false;
    AppState.userRole = null;
    updateNavbar();
    window.location.href = "signin.html";
}

/* =========================
   BACK BUTTON
========================= */
function goBack() {
    if (window.history.length >= 1) {
        window.history.back();
    } else {
        window.location.href = "Home.html";
    }
}

/* =========================
   NOTIFICATIONS
========================= */
const notifications = [
    {
        type: "urgent",
        title: "Urgent Blood Required",
        message: "O+ blood needed at City Hospital, Moradabad",
        time: "Just now"
    },
    {
        type: "match",
        title: "Donor Matched",
        message: "A donor has been matched for your request",
        time: "10 minutes ago"
    },
    {
        type: "info",
        title: "Request Fulfilled",
        message: "Your blood request has been completed",
        time: "1 hour ago"
    }
];

function renderNotifications() {
    const container = document.querySelector(".notification-container");
    const countEl = document.querySelector(".notification-count");

    if (!container || !countEl) return;

    container.innerHTML = "";
    countEl.textContent = notifications.length;

    notifications.forEach(n => {
        const div = document.createElement("div");
        div.className = `notification ${n.type}`;
        div.innerHTML = `
            <span class="tag">${n.type.toUpperCase()}</span>
            <h3>${n.title}</h3>
            <p>${n.message}</p>
            <span class="time">${n.time}</span>
        `;
        container.appendChild(div);
    });
}

/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
    renderNotifications();
});

/* =========================
   NOTIFICATIONS LOGIC
========================= */

// Temporary notification data (can come from backend later)
const Notifications = [
    {
        type: "urgent",
        tag: "Emergency",
        title: "Urgent Blood Required",
        message: `
            <strong>Blood Group:</strong> O+ <br>
            <strong>Location:</strong> City Hospital, Moradabad <br>
            <strong>Units:</strong> 2
        `,
        time: "Just now"
    },
    {
        type: "match",
        tag: "Matched",
        title: "Donor Matched",
        message: "A suitable donor has been matched for your A− blood request.",
        time: "5 minutes ago"
    },
    {
        type: "info",
        tag: "Update",
        title: "Request Fulfilled",
        message: "Your blood request has been successfully fulfilled.",
        time: "1 hour ago"
    }
];

// Render notifications
function renderNotifications() {
    const container = document.querySelector(".notification-container");
    const countEl = document.querySelector(".notification-count");

    if (!container || !countEl) return;

    container.innerHTML = "";

    // Update count
    countEl.textContent = notifications.length;

    // Empty state
    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="notification empty">
                <h3>No new notifications</h3>
                <p>You’re all caught up 🎉</p>
            </div>
        `;
        return;
    }

    // Render each notification
    notifications.forEach(notification => {
        const div = document.createElement("div");
        div.className = `notification ${notification.type}`;

        div.innerHTML = `
            <span class="tag">${notification.tag}</span>
            <h3>${notification.title}</h3>
            <p>${notification.message}</p>
            <span class="time">${notification.time}</span>
        `;

        container.appendChild(div);
    });
}
