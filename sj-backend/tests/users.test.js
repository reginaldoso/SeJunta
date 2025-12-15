const request = require('supertest');
const app = require('../src/app');

describe('Users API contract', () => {
  describe('POST /users/register', () => {
    it('should register with valid @ufba.br email', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({ name: 'Fulano', email: 'fulano@ufba.br', password: 'senha123', cpf: '12345678901' });
      expect(res.statusCode).toBe(201);
      expect(res.body).toHaveProperty('email', 'fulano@ufba.br');
    });

    it('should reject non-ufba email', async () => {
      const res = await request(app)
        .post('/users/register')
        .send({ name: 'User', email: 'user@example.com', password: 'x', cpf: '1' });
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });
  });

  describe('POST /users/login', () => {
    it('should require email and password', async () => {
      const res = await request(app).post('/users/login').send({});
      expect(res.statusCode).toBe(400);
      expect(res.body).toHaveProperty('error');
    });

    it('should return token on mock login', async () => {
      const res = await request(app).post('/users/login').send({ email: 'fulano@ufba.br', password: 'senha123' });
      expect(res.statusCode).toBe(200);
      expect(res.body).toHaveProperty('token');
    });
  });
});
