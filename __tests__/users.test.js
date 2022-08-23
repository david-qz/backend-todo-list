const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { CookieAccessInfo } = require('cookiejar');
const { UserService } = require('../lib/services/UserService');

describe('users routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('POST /api/v1/users should create and log in a new user', async () => {
    const agent = request.agent(app);

    const newUser = { email: 'test@test.com', password: '123456' };
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
    // Make a user to log in as first
    const mockUser = { email: 'test@test.com', password: '123456' };
    await UserService.create(mockUser);

    const agent = request.agent(app);
    const response = await agent.post('/api/v1/users/sessions').send(mockUser);
    expect(response.status).toEqual(204);

    const session = agent.jar.getCookie(process.env.COOKIE_NAME, CookieAccessInfo.All);
    expect(session).toBeTruthy();
  });
});
