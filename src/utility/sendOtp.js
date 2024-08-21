const twilio = require('twilio');
const dotenv = require('dotenv');

dotenv.config();

// Initialize Twilio Client
const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Function to send OTP
const sendOTP = async (phoneNumber) => {
  try {
    const otpCode = Math.floor(100000 + Math.random() * 900000).toString(); // Generate 6-digit OTP

    // Send OTP via SMS
    const message = await client.messages.create({
      body: `Your OTP from TRISERGE TECH is ${otpCode}`,
      from: process.env.TWILIO_PHONE_NUMBER,
      to: phoneNumber,
    });

    console.log('OTP sent successfully:', message.sid);
    return otpCode; // Return OTP code for validation (you should save this for comparison)
  } catch (err) {
    console.error('Error sending OTP:', err.message);
  }
};

sendOTP('917827295033')
module.exports = sendOTP