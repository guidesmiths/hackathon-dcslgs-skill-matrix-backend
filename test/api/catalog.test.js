const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

const initSystem = require('../test-system');

describe('Catalog API routes', () => {
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

  describe('GET /api/v1/skills/catalog', () => {
    it('should return OK (200) with the skills catalog', () => request
      .get('/api/v1/skills/catalog')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        expect(body[0].name).toEqual('Redux-Sagas');
        expect(body[0].role).toEqual('Frontend');
        expect(body[0].type).toEqual('Hard');
      }));
  });
});
