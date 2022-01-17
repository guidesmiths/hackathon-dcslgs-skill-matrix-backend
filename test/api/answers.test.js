const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

const initSystem = require('../test-system');

describe('Answers API routes', () => {
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

  describe('POST /api/v1/usersFiltered', () => {
    it('should return the users with one filter', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ skills: [{ skill: 1, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        const {
          id, email, name,
        } = body.users[1];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
      }));
    it('should return the users with two filters', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ skills: [{ skill: 1, level: 2 }, { skill: 2, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(2);
        const {
          id, email, name,
        } = body.users[1];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
      }));
    it('should return the users filtered by one skill and level', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: '', skills: [{ skill: 4, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        const {
          id, email, name,
        } = body.users[1];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
      }));
    it('should return the users filtered by one skill and name', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: 'j', skills: [{ skill: 4, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(2);
        const {
          id, email, name,
        } = body.users[0];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
      }));
    it('should return the users filtered by two skills and one letter for name', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: 'j', skills: [{ skill: 4, level: 2 }, { skill: 1, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(1);
        const {
          id, email, name,
        } = body.users[0];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
      }));
    it('should return no users filtered by two skills and two letters for name', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: 'ja', skills: [{ skill: 4, level: 2 }, { skill: 1, level: 2 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(0);
      }));
    it('should return the users filtered with name and skill, without level', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: 'e', skills: [{ skill: 4 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
        const {
          id, email, name,
        } = body.users[1];
        expect(name).toEqual('John Doe');
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
      }));
    it('should return all the users in the first load (without filters)', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: '', skills: [] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(7);
      }));
    it('should return the filtered users with one filter and one empty', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: '', skills: [{ skill: 1, level: 1 }, {}] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(5);
      }));
    it('should return the filtered users with two filter and one empty', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: '', skills: [{ skill: 1, level: 1 }, { skill: 2, level: 1 }, {}] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(4);
      }));
    it('should return the filtered users sorted A-Z', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: '', skills: [{ skill: 1, level: 1 }] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(5);
        const {
          id, email, name,
        } = body.users[0];
        expect(name).toEqual('Raquel Fernandez');
        expect(id).toEqual('asldka12311sdkasnd');
        expect(email).toEqual('rachelFern@guidesmiths.com');
      }));
    it('should return the filtered users without filters', () => request
      .post('/api/v1/usersFiltered?page=0')
      .send({ name: '', skills: [{}] })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.users).toHaveLength(7);
      }));
  });

  describe('POST /api/v1/answersByUser', () => {
    it('should return the answers by user', () => request
      .post('/api/v1/answersByUser/asldkan21ansdkasnd')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
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
        expect(skills[0].levelDescription).toEqual('I can define complex architectures and I can provide optimised solutions');
        expect(skills[0].sublevel).toEqual('minus');
        expect(skills[0].interested).toEqual(true);
        expect(skills[0].comments).toEqual('');
      }));
  });

  describe('GET /api/v1/user/:userId/ecosystem/:ecoId/answers', () => {
    it('should get the answers by user id & ecosystem id', () => request
      .get('/api/v1/user/asldkan21ansdkasnd/ecosystem/1/answers')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          id, name, email, ecosystems,
        } = body;
        expect(id).toEqual('asldkan21ansdkasnd');
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(name).toEqual('John Doe');
        expect(ecosystems).toHaveLength(1);
        const {
          skills, average,
        } = ecosystems[0];
        expect(average).toEqual(1.8);
        expect(skills).toHaveLength(5);
      }));
  });

  describe('POST /api/v1/user/:id/answers', () => {
    it('should create new answers', () => request
      .post('/api/v1/user/asldka12312sdkasnd/answers')
      .send([
        {
          skill_id: 2, skill_value: 2, interested: true, comments: 'This is my second comment', skill_subvalue: 'plus',
        },
        {
          skill_id: 3, skill_value: 4, interested: true, comments: 'This is my comment', skill_subvalue: 'minus',
        },
      ])
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.id).toEqual('asldka12312sdkasnd');
        const { skills } = body.ecosystems[0];
        expect(skills).toHaveLength(5);
        const {
          id: skillId, level, sublevel, interested, comments,
        } = skills[2];
        expect(skillId).toEqual(3);
        expect(level).toEqual(4);
        expect(sublevel).toEqual('minus');
        expect(interested).toEqual(true);
        expect(comments).toEqual('This is my comment');
      }));

    it('should update an answer', () => request
      .post('/api/v1/user/asldka12312sdkasnd/answers')
      .send([
        {
          skill_id: 1, skill_value: 3, interested: true, comments: 'This is my second comment', skill_subvalue: 'neutral',
        },
      ])
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.id).toEqual('asldka12312sdkasnd');
        const { skills } = body.ecosystems[0];
        expect(skills).toHaveLength(5);
        const {
          id: skillId, level, sublevel, interested, comments,
        } = skills[0];
        expect(skillId).toEqual(1);
        expect(level).toEqual(3);
        expect(sublevel).toEqual('neutral');
        expect(interested).toEqual(true);
        expect(comments).toEqual('This is my second comment');
      }));

    it('should delete an answer', () => request
      .post('/api/v1/user/asldka12312sdkasnd/answers')
      .send([
        {
          skill_id: 2, skill_value: 2, interested: true, comments: 'This is my second comment', skill_subvalue: 'plus',
        },
        {
          skill_id: 3, skill_value: 0, interested: true, comments: 'This is my comment', skill_subvalue: 'neutral',
        },
      ])
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.id).toEqual('asldka12312sdkasnd');
        const { skills } = body.ecosystems[0];
        expect(skills).not.toHaveLength(3);
      }));
  });
});
