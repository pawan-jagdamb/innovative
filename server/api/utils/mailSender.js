import nodemailer from "nodemailer";
import dotenv from "dotenv";

dotenv.config();

 const mailSender = async (email, title, body) => {
    try {
        // Configure the transporter
        const transporter = nodemailer.createTransport({
            host: process.env.MAIL_HOST,
            port: process.env.MAIL_PORT || 587, // Default to 587 if no port is set
            secure: process.env.MAIL_SECURE === "true", // Use secure if MAIL_SECURE is true
            auth: {
                user: process.env.MAIL_USER,
                pass: process.env.MAIL_PASS,
            },
        });

        // Sending email
        const info = await transporter.sendMail({
            from: '"Pawan Kumar || Collegiate Mart',
            to: email,
            subject: title,
            html: body,
        });

        console.log("Email sent successfully:", info.messageId);
        return info;
    } catch (error) {
        console.error("Error sending email:", error.message);
        throw new Error("Failed to send email. Please try again later.");
    }
};

export default mailSender;