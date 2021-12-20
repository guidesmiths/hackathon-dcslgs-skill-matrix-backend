/* eslint-disable jest/no-disabled-tests */
const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

const initSystem = require('../test-system');

describe('Skill levels API routes', () => {
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

  describe.skip('POST /api/v1/skill/level', () => {
    it('should create a new skill level', () => request
      .post('/api/v1/skill/level')
      .send({
        level: 1, description: 'I have a basic knowledge of the framework. I understand the framework principles and I can implement solutions defined at the documentation or tutorials', skill_id: 5,
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          level, description, skill_id: skillId,
        } = body;
        expect(level).toEqual(1);
        expect(description).toEqual('I have a basic knowledge of the framework. I understand the framework principles and I can implement solutions defined at the documentation or tutorials');
        expect(skillId).toEqual(5);
      }));
  });

  describe.skip('PUT /api/v1/skill/level/:id', () => {
    it('should update an existing skill level', () => request
      .put('/api/v1/skill/level/5')
      .send({
        level: 1, description: 'I understand the framework principles and I can implement solutions defined at the documentation or tutorials.', skill_id: 5,
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          level, description, skill_id: skillId,
        } = body;
        expect(level).toEqual(1);
        expect(description).toEqual('I understand the framework principles and I can implement solutions defined at the documentation or tutorials.');
        expect(skillId).toEqual(5);
      }));
  });

  describe.skip('DELETE /api/v1/skill/level/:id', () => {
    it('should delete a skill level', () => request
      .delete('/api/v1/skill/level/16')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.rowCount).toEqual(1);
      }));
  });
});
