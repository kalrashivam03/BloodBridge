/* =========================
   SMS UTILITY (MOCK)
========================= */
const sendSMS = async ({ to, message }) => {
    try {
        console.log("📱 SMS sent");
        console.log("To:", to);
        console.log("Message:", message);
    } catch (error) {
        console.error("SMS sending failed:", error.message);
    }
};

export default sendSMS;
