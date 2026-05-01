const jwt = require('jsonwebtoken');
process.env.ADMIN_JWT_SECRET = 'test_admin_secret';

const adminAuth = require('../middleware/adminAuth');

describe('Admin Auth Middleware — Unit Tests', () => {

  test('should return 401 if no token provided', () => {
    const req = { headers: {} };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(401);
    expect(res.json).toHaveBeenCalledWith({ message: 'No token provided' });
    expect(next).not.toHaveBeenCalled();
  });

  test('should return 403 if invalid token provided', () => {
    const req = { headers: { 'admin-token': 'invalidtoken' } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(res.status).toHaveBeenCalledWith(403);
    expect(next).not.toHaveBeenCalled();
  });

  test('should call next() if valid token provided', () => {
    const token = jwt.sign(
      { role: 'admin', email: 'admin@test.com' },
      'test_admin_secret'
    );
    const req = { headers: { 'admin-token': token } };
    const res = {
      status: jest.fn().mockReturnThis(),
      json: jest.fn()
    };
    const next = jest.fn();

    adminAuth(req, res, next);

    expect(next).toHaveBeenCalled();
  });

});