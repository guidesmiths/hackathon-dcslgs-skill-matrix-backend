const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

const initSystem = require('../test-system');

describe('Users API routes', () => {
  let pgAPI;
  let request;
  const sys = initSystem();

  beforeAll(async () => {
    const { app, pg } = await sys.start();
    pgAPI = pg;
    request = supertest(app);
  });

  beforeEach(async () => {
    await pgAPI.query('truncate-all');
    await pgAPI.query('insert-mocked-data');
  });

  afterAll(async () => {
    await pgAPI.query('truncate-all');
    await sys.stop();
  });

  describe('GET /api/v1/answers', () => {
    it('should return OK (200) with the users', () => request
      .get('/api/v1/answers')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(3);
        expect(body[0].user_name).toEqual('John Doe');
        expect(body[0].skill_name).toEqual('React');
        expect(body[0].skill_value).toEqual(4);
      }));
  });
});
