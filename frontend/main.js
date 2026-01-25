/* ======================================================
   BloodBridge - main.js (Backend Connected)
====================================================== */

/* =========================
   API CONFIG
========================= */
const API_BASE_URL = "http://localhost:5000/api";

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
   SIGN IN
========================= */
const signinForm = document.querySelector(".signin-form");

if (signinForm) {
    signinForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = getFormData(signinForm);

        if (!data.email || !data.password) {
            showPopup("error", "Please fill in all required fields.");
            return;
        }

        showLoader(signinForm);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/signin`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify(data)
            });

            const result = await res.json();
            hideLoader(signinForm);

            if (!res.ok) {
                showPopup("error", result.message || "Login failed");
                return;
            }

            localStorage.setItem("token", result.token);
            AppState.isLoggedIn = true;
            AppState.userRole = result.user?.role || null;

            showPopup("success", "Sign in successful!", () => {
                window.location.href = "Home.html";
            });

        } catch (err) {
            hideLoader(signinForm);
            showPopup("error", "Server not reachable. Try again.");
        }
    });
}

/* =========================
   SIGN UP
========================= */
const signupForm = document.querySelector(".signup-form");

if (signupForm) {
    signupForm.addEventListener("submit", async (e) => {
        e.preventDefault();

        const data = getFormData(signupForm);

        if (!data.name || !data.email || !data.role || !data.password || !data.confirmpassword) {
            showPopup("error", "All fields are mandatory.");
            return;
        }

        if (data.password.length < 6) {
            showPopup("error", "Password must be at least 6 characters.");
            return;
        }

        if (data.password !== data.confirmpassword) {
            showPopup("error", "Passwords do not match.");
            return;
        }

        showLoader(signupForm);

        try {
            const res = await fetch(`${API_BASE_URL}/auth/signup`, {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({
                    name: data.name,
                    email: data.email,
                    role: data.role,
                    password: data.password
                })
            });

            const result = await res.json();
            hideLoader(signupForm);

            if (!res.ok) {
                showPopup("error", result.message || "Signup failed");
                return;
            }

            showPopup("success", "Account created successfully!", () => {
                window.location.href = "signin.html";
            });

        } catch (err) {
            hideLoader(signupForm);
            showPopup("error", "Server not reachable. Try again.");
        }
    });
}

/* =========================
   NAVBAR + LOGOUT
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
    localStorage.removeItem("token");
    AppState.isLoggedIn = false;
    AppState.userRole = null;
    updateNavbar();
    window.location.href = "signin.html";
}

/* =========================
   BACK BUTTON
========================= */
function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        window.location.href = "Home.html";
    }
}

/* =========================
   NOTIFICATIONS (STATIC FOR NOW)
========================= */

async function fetchNotifications() {
    const token = localStorage.getItem("token");
    if (!token) return;

    try {
        const res = await fetch("http://localhost:5000/api/notifications", {
            headers: {
                Authorization: `Bearer ${token}`
            }
        });

        const data = await res.json();

        if (!res.ok) {
            console.error("Failed to fetch notifications");
            return;
        }

        renderNotifications(data.notifications || []);

    } catch (error) {
        console.error("Notification fetch error:", error.message);
    }
}


function renderNotifications(notifications) {
    const container = document.querySelector(".notification-container");
    const countEl = document.querySelector(".notification-count");

    if (!container || !countEl) return;

    container.innerHTML = "";
    countEl.textContent = notifications.length;

    if (notifications.length === 0) {
        container.innerHTML = `
            <div class="notification empty">
                <h3>No new notifications</h3>
                <p>You’re all caught up 🎉</p>
            </div>
        `;
        return;
    }

    notifications.forEach(n => {
        const div = document.createElement("div");
        div.className = `notification ${n.type} ${n.isRead ? "read" : ""}`;

        div.innerHTML = `
            <span class="tag">${n.type.toUpperCase()}</span>
            <h3>${n.title}</h3>
            <p>${n.message}</p>
            <span class="time">${new Date(n.createdAt).toLocaleString()}</span>
        `;

        // Mark as read when clicked
        div.addEventListener("click", () => markAsRead(n._id));

        container.appendChild(div);
    });
}


/* =========================
   INIT
========================= */
document.addEventListener("DOMContentLoaded", () => {
    const token = localStorage.getItem("token");
    AppState.isLoggedIn = !!token;
    updateNavbar();
    renderNotifications();
    fetchNotifications();
});
