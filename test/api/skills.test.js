/* eslint-disable jest/no-disabled-tests */
const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

const initSystem = require('../test-system');

describe('Skills API routes', () => {
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

  describe('GET /api/v1/skills', () => {
    it('should return OK (200) with all the skills', () => request
      .get('/api/v1/skills')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(6);
        const {
          id, name,
        } = body[0];
        expect(id).toEqual(1);
        expect(name).toEqual('React');
      }));
  });

  describe('DELETE /api/v1/skill/:id', () => {
    it('should delete a skill', () => request
      .delete('/api/v1/skill/5')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.rowCount).toEqual(1);
      }));
  });
});
