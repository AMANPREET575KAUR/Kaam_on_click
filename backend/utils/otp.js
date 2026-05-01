const otpStore = new Map(); // In production, use Redis

function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

function storeOTP(email, otp) {
  otpStore.set(email, { otp, expiresAt: Date.now() + 10 * 60 * 1000 }); // 10 min
}

function verifyOTP(email, otp) {
  const record = otpStore.get(email);
  if (!record) return { valid: false, message: 'OTP not found' };
  if (Date.now() > record.expiresAt) {
    otpStore.delete(email);
    return { valid: false, message: 'OTP expired' };
  }
  if (record.otp !== otp) return { valid: false, message: 'Invalid OTP' };
  otpStore.delete(email);
  return { valid: true };
}

module.exports = { generateOTP, storeOTP, verifyOTP ,otpStore };