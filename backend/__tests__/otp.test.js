const { generateOTP, storeOTP, verifyOTP } = require('../utils/otp');

describe('OTP Utility — Unit Tests', () => {

  test('generateOTP should return a 6-digit string', () => {
    const otp = generateOTP();
    expect(otp).toHaveLength(6);
    expect(/^\d{6}$/.test(otp)).toBe(true);
  });

  test('storeOTP should store OTP for given email', () => {
    storeOTP('test@gmail.com', '123456');
    const result = verifyOTP('test@gmail.com', '123456');
    expect(result.valid).toBe(true);
  });

  test('verifyOTP should fail with wrong OTP', () => {
    storeOTP('test@gmail.com', '111111');
    const result = verifyOTP('test@gmail.com', '999999');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('Invalid OTP');
  });

  test('verifyOTP should fail if email not found', () => {
    const result = verifyOTP('notfound@gmail.com', '123456');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('OTP not found');
  });

  test('verifyOTP should fail if OTP is expired', () => {
    // Manually store expired OTP
    const { otpStore } = require('../utils/otp');
    otpStore.set('expired@gmail.com', {
      otp: '123456',
      expiresAt: Date.now() - 1000 // already expired
    });
    const result = verifyOTP('expired@gmail.com', '123456');
    expect(result.valid).toBe(false);
    expect(result.message).toBe('OTP expired');
  });

});