/* =========================
   EMAIL UTILITY (MOCK)
========================= */
const sendEmail = async ({ to, subject, message }) => {
    try {
        console.log("📧 Email sent");
        console.log("To:", to);
        console.log("Subject:", subject);
        console.log("Message:", message);
    } catch (error) {
        console.error("Email sending failed:", error.message);
    }
};

export default sendEmail;
