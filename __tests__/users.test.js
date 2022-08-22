const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');
const { CookieAccessInfo } = require('cookiejar');

describe('backend-express-template routes', () => {
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
});
