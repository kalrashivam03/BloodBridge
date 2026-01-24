/* notifications.js
   UI logic for notifications page
*/

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

// --------------------
// Render Notifications
// --------------------
function renderNotifications() {
    const container = document.getElementById("notificationContainer");
    const countEl = document.getElementById("count");

    if (!container) return;

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

// --------------------
// Init
// --------------------
document.addEventListener("DOMContentLoaded", renderNotifications);
