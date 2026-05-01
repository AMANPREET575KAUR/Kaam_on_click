const nodemailer = require('nodemailer');

const transporter = nodemailer.createTransport({
  service: 'gmail',
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});

async function sendOTPEmail(toEmail, otp, providerName) {
  const mailOptions = {
    from: `"Kaam on Click" <${process.env.EMAIL_USER}>`,
    to: toEmail,
    subject: '🔐 Verify Your Provider Account – OTP Inside',
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 500px; margin: auto; padding: 30px; border: 1px solid #e0e0e0; border-radius: 10px;">
        <h2 style="color: #2563EB;">Welcome to Kaam on Click, ${providerName}!</h2>
        <p>Use the OTP below to verify your provider account. It expires in <strong>10 minutes</strong>.</p>
        <div style="font-size: 36px; font-weight: bold; letter-spacing: 10px; color: #1D4ED8; text-align: center; padding: 20px; background: #EFF6FF; border-radius: 8px; margin: 20px 0;">
          ${otp}
        </div>
        <p style="color: #6B7280; font-size: 13px;">If you did not register, please ignore this email.</p>
      </div>
    `,
  };
  return transporter.sendMail(mailOptions);
}

module.exports = { sendOTPEmail };