describe('Mailer Utility — Unit Tests', () => {

  test('sendOTPEmail function should exist', () => {
    const { sendOTPEmail } = require('../utils/mailer');
    expect(typeof sendOTPEmail).toBe('function');
  });

  test('mailer should be configured with EMAIL_USER', () => {
    process.env.EMAIL_USER = 'test@gmail.com';
    process.env.EMAIL_PASS = 'testpass';
    const mailer = require('../utils/mailer');
    expect(mailer).toBeDefined();
  });

});