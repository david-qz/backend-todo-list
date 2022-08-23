const pool = require('../lib/utils/pool');
const setup = require('../data/setup');
const request = require('supertest');
const app = require('../lib/app');

const existingUser = {
  email: 'dummy@example.com',
  password: '123456',
};

async function login(user) {
  const agent = request.agent(app);
  await agent.post('/api/v1/users/sessions').send(user);
  return agent;
}

describe('todos routes', () => {
  beforeEach(() => {
    return setup(pool);
  });

  afterAll(() => {
    pool.end();
  });

  it('GET /api/v1/todos', async () => {
    const agent = await login(existingUser);

    const response = await agent.get('/api/v1/todos');
    expect(response.status).toEqual(200);

    expect(response.body).toEqual([
      { task: 'do dishes', completed: true },
      { task: 'walk dog', completed: false }
    ]);
  });
});
