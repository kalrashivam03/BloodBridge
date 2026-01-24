/* auth.js
   Handles signin & signup UI logic
*/

// --------------------
// Helpers
// --------------------
function getFormData(form) {
    const data = {};
    new FormData(form).forEach((value, key) => {
        data[key] = value.trim();
    });
    return data;
}

// --------------------
// Sign In
// --------------------
const signinForm = document.getElementById("signinForm");

if (signinForm) {
    signinForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = getFormData(signinForm);

        if (!data.email || !data.password) {
            alert("Please fill all required fields");
            return;
        }

        console.log("Signin Data:", data);

        // TEMP success simulation
        alert("Signin successful (UI only)");
        window.location.href = "Home.html";
    });
}

// --------------------
// Sign Up
// --------------------
const signupForm = document.getElementById("signupForm");

if (signupForm) {
    signupForm.addEventListener("submit", (e) => {
        e.preventDefault();

        const data = getFormData(signupForm);

        if (data.password !== data.confirmPassword) {
            alert("Passwords do not match");
            return;
        }

        console.log("Signup Data:", data);

        // TEMP success simulation
        alert("Account created successfully (UI only)");
        window.location.href = "signin.html";
    });
}
