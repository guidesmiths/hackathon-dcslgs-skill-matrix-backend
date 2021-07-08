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
    it('should return the users with one filter', () => request
      .post('/api/v1/answers')
      .send({ skills: [{ skill: 1, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        const {
          id, email, name, ecosystems,
        } = body[3];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills).toHaveLength(3);
        expect(skills[0].id).toEqual(1);
        expect(skills[0].name).toEqual('React');
        expect(skills[0].level).toEqual(4);
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
    it('should return the users with two filters', () => request
      .post('/api/v1/answers')
      .send({ skills: [{ skill: 1, level: 2 }, { skill: 2, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        const {
          id, email, name, ecosystems,
        } = body[0];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills).toHaveLength(3);
        expect(skills[0].id).toEqual(1);
        expect(skills[0].name).toEqual('React');
        expect(skills[0].level).toEqual(4);
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
    it('should return the users without filters', () => request
      .post('/api/v1/answers')
      .send([])
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(7);
        const {
          id, email, name, ecosystems,
        } = body[1];
        expect(name).toEqual('Jane Doe');
        expect(id).toEqual('asldka12312sdkasnd');
        expect(email).toEqual('janedoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills[0].id).toEqual(1);
        expect(skills[0].name).toEqual('React');
        expect(skills[0].level).toEqual(3);
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
    it('should return the users filtered by one skill', () => request
      .post('/api/v1/answers')
      .send({ name: '', skills: [{ skill: 4, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        const {
          id, email, name, ecosystems,
        } = body[3];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills).toHaveLength(3);
        expect(skills[0].id).toEqual(1);
        expect(skills[0].name).toEqual('React');
        expect(skills[0].level).toEqual(4);
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
    it('should return the users filtered by one skill and name', () => request
      .post('/api/v1/answers')
      .send({ name: 'j', skills: [{ skill: 4, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        const {
          id, email, name, ecosystems,
        } = body[1];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills).toHaveLength(3);
        expect(skills[0].id).toEqual(1);
        expect(skills[0].name).toEqual('React');
        expect(skills[0].level).toEqual(4);
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
    it('should return the users filtered by two skills and one letter for name', () => request
      .post('/api/v1/answers')
      .send({ name: 'j', skills: [{ skill: 4, level: 2 }, { skill: 1, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(1);
        const {
          id, email, name, ecosystems,
        } = body[0];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills).toHaveLength(3);
        expect(skills[0].id).toEqual(1);
        expect(skills[0].name).toEqual('React');
        expect(skills[0].level).toEqual(4);
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
    it('should return no users filtered by two skills and two letters for name', () => request
      .post('/api/v1/answers')
      .send({ name: 'ja', skills: [{ skill: 4, level: 2 }, { skill: 1, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(0);
      }));
    it('should return users filtered only by name', () => request
      .post('/api/v1/answers')
      .send({ name: 'j' })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(3);
        const {
          id, email, name, ecosystems,
        } = body[0];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills).toHaveLength(3);
        expect(skills[0].id).toEqual(1);
        expect(skills[0].name).toEqual('React');
        expect(skills[0].level).toEqual(4);
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
    it('should return the users filtered with name and skill, without level', () => request
      .post('/api/v1/answers')
      .send({ name: 'e', skills: [{ skill: 4 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        const {
          id, email, name, ecosystems,
        } = body[3];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills).toHaveLength(3);
        expect(skills[0].id).toEqual(1);
        expect(skills[0].name).toEqual('React');
        expect(skills[0].level).toEqual(4);
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
    it('refactor', () => request
      .post('/api/v1/answers')
      .send({ name: 'doe' })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        const {
          name, id, email, ecosystems,
        } = body[0];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        expect(ecosystems[0].id).toEqual(1);
        expect(ecosystems[0].name).toEqual('React');
        expect(ecosystems[0].average).toEqual(3);
        expect(ecosystems[0].skills).toHaveLength(3);
        expect(ecosystems[0].skills[0].id).toEqual(1);
        expect(ecosystems[0].skills[0].name).toEqual('React');
        expect(ecosystems[0].skills[0].level).toEqual(4);
        expect(ecosystems[0].skills[0].interested).toEqual(true);
        expect(ecosystems[0].skills[0].comments).toEqual('');
        expect(ecosystems[0].skills[1].id).toEqual(4);
        expect(ecosystems[0].skills[1].name).toEqual('Redux-Sagas');
        expect(ecosystems[0].skills[1].level).toEqual(3);
        expect(ecosystems[0].skills[1].interested).toEqual(true);
        expect(ecosystems[0].skills[1].comments).toEqual('');
        expect(ecosystems[0].skills[2].id).toEqual(2);
        expect(ecosystems[0].skills[2].name).toEqual('Next.js');
        expect(ecosystems[0].skills[2].level).toEqual(2);
        expect(ecosystems[0].skills[2].interested).toEqual(false);
        expect(ecosystems[0].skills[2].comments).toEqual('');
        expect(ecosystems[1].id).toEqual(2);
        expect(ecosystems[1].name).toEqual('NodeJS');
        expect(ecosystems[1].skills).toHaveLength(1);
        expect(ecosystems[1].average).toEqual(1);
        expect(ecosystems[1].skills[0].id).toEqual(6);
        expect(ecosystems[1].skills[0].name).toEqual('Express');
        expect(ecosystems[1].skills[0].level).toEqual(1);
        expect(ecosystems[1].skills[0].interested).toEqual(true);
        expect(ecosystems[1].skills[0].comments).toEqual('');
      }));
  });

  describe('POST /api/v1/answer', () => {
    it('should create a new answer', () => request
      .post('/api/v1/answer')
      .send({
        skill_id: 3, user_id: 'asldka12312sdkasnd', skill_value: 4, interested: true, comments: 'This is my comment',
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.skill_id).toEqual(3);
        expect(body.user_id).toEqual('asldka12312sdkasnd');
        expect(body.skill_value).toEqual(4);
        expect(body.interested).toEqual(true);
        expect(body.comments).toEqual('This is my comment');
      }));
  });

  describe('GET /api/v1/users/:id/answers', () => {
    it('should get the answers by id', () => request
      .get('/api/v1/users/asldkan21ansdkasnd/answers')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          name, id, email, ecosystems,
        } = body;
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(ecosystems).toHaveLength(2);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(3);
        expect(skills).toHaveLength(3);
        expect(skills[1].id).toEqual(2);
        expect(skills[1].name).toEqual('Next.js');
        expect(skills[1].level).toEqual(2);
        expect(skills[1].interested).toEqual(false);
        expect(skills[1].comments).toEqual('');
      }));
  });
});
