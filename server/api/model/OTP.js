import mongoose from 'mongoose';
import mailSender from '../utils/mailSender.js';
import { otpTemplate } from '../mail/templates/emailVerificationTemplate.js';

const OTP_EXPIRATION_TIME = 5 * 60; // 5 minutes expiration time

const OTPSchema = new mongoose.Schema({
    email: {
        type: String,
        required: true,
    },
    otp: {
        type: String,
        required: true,
    },
    createdAt: {
        type: Date,
        default: Date.now,
        expires: OTP_EXPIRATION_TIME,
    }
});

// Function to send verification email
async function sendVerificationEmail(email, otp) {
    try {
        const mailResponse = await mailSender(email, "Verification Email", otpTemplate(otp));
        console.log("Email successfully sent:", mailResponse);
    } catch (error) {
        console.error("Error occurred while sending email:", error);
        throw error;
    }
}

// Pre-save hook to send email after the OTP is saved
OTPSchema.pre("save", async function (next) {
    console.log("New OTP document saved to database");

    if (this.isNew) {
        try {
            await sendVerificationEmail(this.email, this.otp);
            next(); // Proceed with saving the document after email is sent
        } catch (error) {
            next(error); // Stop the save operation and pass the error
        }
    } else {
        next();
    }
});

export default mongoose.model("OTP", OTPSchema);
