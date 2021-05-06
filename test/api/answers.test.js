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

  describe('POST /api/v1/answers', () => {
    it('should return the users with filters', () => request
      .post('/api/v1/answers')
      .send([{ skill: 1, level: 2 }, { skill: 2, level: 2 }])
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(1);
        expect(body[0].name).toEqual('John Doe');
        expect(body[0].user_id).toEqual('asldkan21ansdkasnd');
        expect(body[0].email).toEqual('johndoe@guidesmiths.com');
        expect(body[0].skills).toHaveLength(3);
        expect(body[0].skills[0].id).toEqual(1);
        expect(body[0].skills[0].skillName).toEqual('React');
        expect(body[0].skills[0].level).toEqual(4);
      }));
    it('should return the users without filters', () => request
      .post('/api/v1/answers')
      .send([])
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        expect(body[0].name).toEqual('Jane Doe');
        expect(body[0].user_id).toEqual('asldka12312sdkasnd');
        expect(body[0].email).toEqual('janedoe@guidesmiths.com');
        expect(body[0].skills).toHaveLength(1);
        expect(body[0].skills[0].id).toEqual(1);
        expect(body[0].skills[0].skillName).toEqual('React');
        expect(body[0].skills[0].level).toEqual(3);
      }));
  });

  describe('POST /api/v1/answer', () => {
    it('should create a new answer', () => request
      .post('/api/v1/answer')
      .send({ skill_id: 3, user_id: 'asldka12312sdkasnd', skill_value: 4 })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.skill_id).toEqual(3);
        expect(body.user_id).toEqual('asldka12312sdkasnd');
        expect(body.skill_value).toEqual(4);
      }));
  });

  describe('GET /api/v1/users/:userId/answers', () => {
    it('should get the answers by userId', () => request
      .get(`/api/v1/users/${'asldkan21ansdkasnd'}/answers`)
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.name).toEqual('John Doe');
        expect(body.user_id).toEqual('asldkan21ansdkasnd');
        expect(body.email).toEqual('johndoe@guidesmiths.com');
        expect(body.skills).toHaveLength(3);
        expect(body.skills[1].id).toEqual(2);
        expect(body.skills[1].skillName).toEqual('Next.js');
        expect(body.skills[1].level).toEqual(2);
      }));
  });
});
