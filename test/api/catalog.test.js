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
        expect(body).toHaveLength(5);
        const {
          levels, name, role, type,
        } = body[2];
        expect(name).toEqual('Redux');
        expect(role).toEqual('Frontend');
        expect(type).toEqual('Hard');
        expect(levels).toHaveLength(4);
        expect(levels[3].description).toEqual('I can use the library in combination of others to build complex solutions.');
        expect(levels[3].level).toEqual(4);
      }));
  });

  describe('POST /api/v1/skill', () => {
    it('should create a new skill', () => request
      .post('/api/v1/skill')
      .send({
        id: 6, name: 'ReactCssTransition', type: 2, ecosystem: 1, role: 1, description: '',
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          id, name, type, ecosystem, role, description,
        } = body;
        expect(id).toEqual(6);
        expect(name).toEqual('ReactCssTransition');
        expect(type).toEqual(2);
        expect(ecosystem).toEqual(1);
        expect(role).toEqual(1);
        expect(description).toEqual('');
      }));

    it('should update an existing skill', () => request
      .post('/api/v1/skill')
      .send({
        id: 6, name: 'ReactCssTransition', type: 2, ecosystem: 1, role: 1, description: 'New description',
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          id, name, type, ecosystem, role, description,
        } = body;
        expect(id).toEqual(6);
        expect(name).toEqual('ReactCssTransition');
        expect(type).toEqual(2);
        expect(ecosystem).toEqual(1);
        expect(role).toEqual(1);
        expect(description).toEqual('New description');
      }));
  });

  describe('POST /api/v1/skill/level', () => {
    it('should create a new skill level', () => request
      .post('/api/v1/skill/level')
      .send({
        id: 17, level: 1, description: 'I have a basic knowledge of the framework. I understand the framework principles and I can implement solutions defined at the documentation or tutorials', skill_id: 5,
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          id, level, description, skill_id: skillId,
        } = body;
        expect(id).toEqual(17);
        expect(level).toEqual(1);
        expect(description).toEqual('I have a basic knowledge of the framework. I understand the framework principles and I can implement solutions defined at the documentation or tutorials');
        expect(skillId).toEqual(5);
      }));

    it('should update an existing skill level', () => request
      .post('/api/v1/skill/level')
      .send({
        id: 17, level: 1, description: 'I can write a new description', skill_id: 5,
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          id, level, description, skill_id: skillId,
        } = body;
        expect(id).toEqual(17);
        expect(level).toEqual(1);
        expect(description).toEqual('I can write a new description');
        expect(skillId).toEqual(5);
      }));
  });

  describe('DELETE /api/v1/skill', () => {
    it('should delete a skill', () => request
      .delete('/api/v1/skill/5')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.rowCount).toEqual(1);
      }));
  });

  describe('DELETE /api/v1/skill/level', () => {
    it('should delete a skill level', () => request
      .delete('/api/v1/skill/level/16')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.rowCount).toEqual(1);
      }));
  });
});
