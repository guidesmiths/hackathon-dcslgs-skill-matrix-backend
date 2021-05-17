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
        const {
          levels, name, role, type,
        } = body[0];
        expect(name).toEqual('Redux');
        expect(role).toEqual('Frontend');
        expect(type).toEqual('Hard');
        expect(levels).toHaveLength(4);
        expect(levels[0].description).toEqual('I can use the library in combination of others to build complex solutions.');
        expect(levels[0].level).toEqual(4);
      }));
  });
});
