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
        expect(body).toHaveLength(7);
        const {
          email, name, role,
        } = body[0];
        expect(email).toEqual('johndoe@guidesmiths.com');
        expect(name).toEqual('John Doe');
        expect(role).toEqual('user');
      }));
  });

  describe('POST /api/v1/user', () => {
    it('should return OK (200)', () => request
      .post('/api/v1/user').send(
        {
          user_id: '12345678910',
          email: 'Jorge.Adame@dcsl.com',
          name: 'Jorge Adame',
          role: 'user',
          seniority: 'Intern',
        },
      )
      .expect(StatusCodes.OK)
      .then(() => {
        request
          .get('/api/v1/users')
          .expect(StatusCodes.OK)
          .then(({ body }) => {
            expect(body).toHaveLength(8);
            const {
              email, name, role,
            } = body[7];
            expect(name).toEqual('Jorge Adame');
            expect(email).toEqual('Jorge.Adame@dcsl.com');
            expect(role).toEqual('user');
          });
      }));
  });

  describe('GET /api/v1/user/me', () => {
    it('should return OK (200) with the user', () => request
      .get('/api/v1/user/me')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          email, name, role,
        } = body;
        expect(email).toEqual('Jorge.Adame@dcsl.com');
        expect(name).toEqual('Jorge Adame');
        expect(role).toEqual('user');
      }));
  });

  describe('PUT /api/v1/user/role', () => {
    it('should return OK (200)', () => request
      .put('/api/v1/user/role')
      .send({
        id: 'asldkan21ansdkasnd',
        role: 'admin',
      })
      .expect(StatusCodes.OK)
      .then(() => {
        request
          .get('/api/v1/users')
          .expect(StatusCodes.OK)
          .then(({ body }) => {
            const {
              email, name, role,
            } = body[7];
            expect(email).toEqual('johndoe@guidesmiths.com');
            expect(name).toEqual('John Doe');
            expect(role).toEqual('admin');
          });
      }));
  });
  describe('PATCH /api/v1/user/country', () => {
    it('should return OK (200)', () => request
      .patch('/api/v1/user/country')
      .send({
        id: 'asldkan21ansdkasnd',
        country: 'UK',
      })
      .expect(StatusCodes.OK)
      .then(() => {
        request
          .get('/api/v1/users')
          .expect(StatusCodes.OK)
          .then(({ body }) => {
            const {
              email, name, country,
            } = body[7];
            expect(email).toEqual('johndoe@guidesmiths.com');
            expect(name).toEqual('John Doe');
            expect(country).toEqual('UK');
          });
      }));
  });
});
