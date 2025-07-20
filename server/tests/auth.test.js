const request = require('supertest');
const mongoose = require('mongoose');
const app = require('../server');
const User = require('../models/User');

describe('Auth API', () => {
  beforeAll(async () => {
    // Connect to the test database
    await mongoose.connect(process.env.MONGODB_URI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
  });

  afterAll(async () => {
    await User.deleteMany({ email: /testuser/ });
    await mongoose.connection.close();
  });

  it('should register a new tenant', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test User',
        email: 'testuser_tenant@example.com',
        password: 'testpass123',
        phone: '+254700000003',
        role: 'tenant',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('tenant');
  });

  it('should register a new landlord', async () => {
    const res = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Landlord',
        email: 'testuser_landlord@example.com',
        password: 'testpass123',
        phone: '+254700000004',
        role: 'landlord',
      });
    expect(res.statusCode).toBe(201);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.role).toBe('landlord');
  });

  it('should login a registered user', async () => {
    // Register first
    await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Test Login',
        email: 'testuser_login@example.com',
        password: 'testpass123',
        phone: '+254700000005',
        role: 'tenant',
      });
    // Then login
    const res = await request(app)
      .post('/api/auth/login')
      .send({
        email: 'testuser_login@example.com',
        password: 'testpass123',
      });
    expect(res.statusCode).toBe(200);
    expect(res.body).toHaveProperty('token');
    expect(res.body.user.email).toBe('testuser_login@example.com');
  });
}); 