const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { CookieAccessInfo } = require('cookiejar');

const newUser = {
  email: 'test@test.com',
  password: '123456',
};

const existingUser = {
  email: 'dummy@example.com',
  password: '123456',
};

describe('users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('POST /api/v1/users should create and log in a new user', async () => {
    const agent = request.agent(app);

    const response = await agent.post('/api/v1/users').send(newUser);
    expect(response.status).toEqual(200);

    expect(response.body).toEqual({
      id: expect.any(String),
      email: 'test@test.com'
    });

    const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
    expect(session).toBeTruthy();
  });

  it('POST /api/v1/users/session should log in an existing user', async () => {
    const agent = request.agent(app);
    const response = await agent.post('/api/v1/users/sessions').send(existingUser);
    expect(response.status).toEqual(204);

    const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
    expect(session).toBeTruthy();
  });

  it('GET /api/v1/users/me should return the currently logged in user', async () => {
    const agent = request.agent(app);
    await agent.post('/api/v1/users/sessions').send(existingUser);

    const response = await agent.get('/api/v1/users/me');
    expect(response.status).toEqual(200);

    expect(response.body).toEqual({
      id: expect.any(String),
      email: existingUser.email,
      exp: expect.any(Number),
      iat: expect.any(Number),
    });
  });
});
