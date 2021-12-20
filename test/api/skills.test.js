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

  // TODO: add expect levels.toHaveLength(4)
  describe.skip('POST /api/v1/skill', () => {
    it('should create a new skill with one role', () => request
      .post('/api/v1/skill')
      .send({
        name: 'ReactCssTransition',
        type: 2,
        ecosystem: 1,
        roles: [1],
        description: '',
        levels: [
          { level: 1, levelDescription: 'levelDescription 1' },
          { level: 2, levelDescription: 'levelDescription 2' },
          { level: 3, levelDescription: 'levelDescription 3' },
          { level: 4, levelDescription: 'levelDescription 4' },
        ],
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          name, type, ecosystem, roles, description,
        } = body;
        expect(name).toEqual('ReactCssTransition');
        expect(type).toEqual(2);
        expect(ecosystem).toEqual(1);
        expect(roles[0]).toEqual(1);
        expect(description).toEqual('');
      }));

    it('should create a new skill with 2 roles', () => request
      .post('/api/v1/skill')
      .send({
        name: 'ReactCssTransition',
        type: 2,
        ecosystem: 1,
        roles: [1, 3],
        description: '',
        levels: [
          { level: 1, levelDescription: 'levelDescription 1' },
          { level: 2, levelDescription: 'levelDescription 2' },
          { level: 3, levelDescription: 'levelDescription 3' },
          { level: 4, levelDescription: 'levelDescription 4' },
        ],
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          name, type, ecosystem, roles, description,
        } = body;
        expect(name).toEqual('ReactCssTransition');
        expect(type).toEqual(2);
        expect(ecosystem).toEqual(1);
        expect(roles).toHaveLength(2);
        expect(roles[0]).toEqual(1);
        expect(roles[1]).toEqual(3);
        expect(description).toEqual('');
      }));
  });

  describe.skip('PUT /api/v1/skill/:id', () => {
    it('should update an existing skill', () => request
      .put('/api/v1/skill/2')
      .send({
        name: 'NodeJS', type: 2, ecosystem: 1, roles: [1], description: 'New description',
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          name, type, ecosystem, roles, description,
        } = body;
        expect(name).toEqual('NodeJS');
        expect(type).toEqual(2);
        expect(ecosystem).toEqual(1);
        expect(roles).toHaveLength(1);
        expect(roles[0]).toEqual(1);
        expect(description).toEqual('New description');
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
