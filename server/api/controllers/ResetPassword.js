import User from "../model/useModel.js";
import mailSender from "../utils/mailSender.js";
import crypto from "crypto";
import bcrypt from "bcrypt";


export const resetPasswordToken = async (req, res) => {
    try {
        const email = req.body.email;

        // Validate email
        if (!email) {
            return res.status(401).json({
                success: false,
                message: "Email is required",
            });
        }

        const user = await User.findOne({ email });
        if (!user) {
            return res.status(401).json({
                success: false,
                message: "Your email is not registered with us",
            });
        }

        // Generate token and expiration time
        const token = crypto.randomBytes(32).toString("hex");
        const updatedDetails = await User.findOneAndUpdate(
            { email },
            {
                token: token,
                resetPasswordExpires: Date.now() + 5 * 60 * 1000, // 5 minutes
            },
            { new: true }
        );

        if (!updatedDetails) {
            return res.status(500).json({
                success: false,
                message: "Failed to update user with reset token.",
            });
        }

        const url = `http://localhost:5173/update-password/${token}`;

        // Send mail containing the reset URL
        try {
            await mailSender(email, "Password Reset Link", `Password Reset Link: ${url}`);
        } catch (mailError) {
            return res.status(500).json({
                success: false,
                message: "Failed to send email. Please try again later.",
            });
        }

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Email sent successfully. Please check your email to reset the password.",
        });
    } catch (error) {
        console.error("Error in Reset Password:", error);
        return res.status(500).json({
            success: false,
            message: "Something went wrong while resetting the password.",
        });
    }
};

//resetPassword

// actually reseting password
export const resetPassword = async (req, res) => {
    try {
        // Destructure data from request body
        const { password, confirmPassword, token } = req.body;

        // Validate required fields
        if (!password || !confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Password and confirm password are required for resetting the password.",
            });
        }

        // Validate password match
        if (password !== confirmPassword) {
            return res.status(401).json({
                success: false,
                message: "Passwords do not match.",
            });
        }

        // Get user details from the database using the token
        const userDetails = await User.findOne({ token });

        // Check if the token is valid
        if (!userDetails) {
            return res.status(400).json({
                success: false,
                message: "Invalid token. Unable to fetch user details.",
            });
        }

        // Check if the token has expired
        if (userDetails.resetPasswordExpires < Date.now()) {
            return res.status(400).json({
                success: false,
                message: "Reset link has expired. Please request a new one.",
            });
        }

        // Hash the new password
        const hashedPassword = await bcrypt.hash(password, 10);

        // Update the user's password in the database
        await User.findOneAndUpdate(
            { token },
            {
                password: hashedPassword,
                token: null, // Clear the token after successful reset
                resetPasswordExpires: null, // Clear the expiration time
            },
            { new: true }
        );

        // Respond with success
        return res.status(200).json({
            success: true,
            message: "Password reset successful.",
        });
    } catch (error) {
        console.error("Error in resetting password:", error);
        return res.status(500).json({
            success: false,
            message: "An error occurred while resetting the password.",
        });
    }
};
