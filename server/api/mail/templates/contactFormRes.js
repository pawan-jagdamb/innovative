export const contactUsEmail = (email, firstname, lastname, message, phoneNo) => {
    return `<!DOCTYPE html>
    <html>
    <head>
        <meta charset="UTF-8">
        <title>Contact Form Confirmation</title>
        <style>
            body {
                background-color: #ffffff;
                font-family: Arial, sans-serif;
                font-size: 16px;
                line-height: 1.4;
                color: #333333;
                margin: 0;
                padding: 0;
            }
            .container {
                max-width: 600px;
                margin: 0 auto;
                padding: 20px;
                text-align: center;
            }
            .message {
                font-size: 18px;
                font-weight: bold;
                margin-bottom: 20px;
            }
            .body {
                font-size: 16px;
                margin-bottom: 20px;
            }
            .support {
                font-size: 14px;
                color: #999999;
                margin-top: 20px;
            }
            a {
                color: #FFD60A;
                text-decoration: none;
            }
            a:hover {
                text-decoration: underline;
            }
        </style>
    </head>
    <body>
        <div class="container">
            <div class="message">Contact Form Confirmation</div>
            <div class="body">
                <p>Dear ${firstname} ${lastname},</p>
                <p>Thank you for contacting us. We have received your message and will respond to you as soon as possible.</p>
                <p>Here are the details you provided:</p>
                <p><strong>Name:</strong> ${firstname} ${lastname}</p>
                <p><strong>Email:</strong> ${email}</p>
                <p><strong>Phone Number:</strong> ${phoneNo}</p>
                <p><strong>Message:</strong> ${message}</p>
                <p>We appreciate your interest and will get back to you shortly.</p>
            </div>
            <div class="support">
                If you have any further questions or need immediate assistance, please feel free to reach out to us at 
                <a href="mailto:pawankumar4ghd@gmail.com">pawankumar4ghd@gmail.com</a>. We are here to help!
            </div>
        </div>
    </body>
    </html>`;
};
