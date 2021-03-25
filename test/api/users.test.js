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

  describe('GET /api/v1/users', () => {
    it('should return OK (200) with the users', () => request
      .get('/api/v1/users')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        expect(body[0].email).toEqual('johndoe@guidesmiths.com');
        expect(body[0].name).toEqual('John Doe');
        expect(body[0].role).toEqual('user');
      }));
  });
});
