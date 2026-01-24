/* main.js
   Global frontend logic for BloodBridge
*/

// --------------------
// App State (temporary)
// --------------------
const AppState = {
    isLoggedIn: false, // will come from backend/session later
    userRole: null    // donor | patient | admin
};

// --------------------
// Navbar Handling
// --------------------
function updateNavbar() {
    const authLinks = document.querySelectorAll(".auth-link");
    const logoutBtn = document.getElementById("logoutBtn");

    if (AppState.isLoggedIn) {
        authLinks.forEach(link => link.style.display = "none");
        if (logoutBtn) logoutBtn.style.display = "inline-block";
    } else {
        authLinks.forEach(link => link.style.display = "inline-block");
        if (logoutBtn) logoutBtn.style.display = "none";
    }
}

// --------------------
// Logout (UI only for now)
// --------------------
function logoutUser() {
    AppState.isLoggedIn = false;
    AppState.userRole = null;
    updateNavbar();
    alert("Logged out successfully");
}

// --------------------
// Init
// --------------------
document.addEventListener("DOMContentLoaded", () => {
    updateNavbar();
});


/* --------------------
   Back Button Logic
-------------------- */

function goBack() {
    if (window.history.length > 1) {
        window.history.back();
    } else {
        // fallback if no history exists
        window.location.href = "Home.html";
    }
}
