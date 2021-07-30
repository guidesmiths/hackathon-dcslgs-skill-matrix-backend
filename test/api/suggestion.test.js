const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

const initSystem = require('../test-system');

describe('Suggestion API routes', () => {
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

  describe('GET /api/v1/suggestions', () => {
    it('should return OK (200) with the suggestions', () => request
      .get('/api/v1/suggestions')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(4);
        const {
          id, description, subject, userId,
        } = body[0];
        expect(id).toEqual(1);
        expect(description).toEqual('This is a suggestion related to the skill Next.js.');
        expect(subject).toEqual('Skills');
        expect(userId).toEqual('asldkan21ansdkasnd');
      }));
  });

  describe('POST /api/v1/suggestion', () => {
    it('should create a new suggestion', () => request
      .post('/api/v1/suggestion')
      .send({
        id: 5, description: 'This is a new suggestionnn.', subject: 'Others', user_id: 'asldka12367sdkasnd',
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          id, description, subject, user_id: userId,
        } = body;
        expect(id).toEqual(5);
        expect(description).toEqual('This is a new suggestionnn.');
        expect(subject).toEqual('Others');
        expect(userId).toEqual('asldka12367sdkasnd');
      }));

    it('should update an existing skill', () => request
      .post('/api/v1/suggestion')
      .send({
        id: 5, description: 'This is a new suggestion.', subject: 'Others', user_id: 'asldka12367sdkasnd',
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          id, description, subject, user_id: userId,
        } = body;
        expect(id).toEqual(5);
        expect(description).toEqual('This is a new suggestion.');
        expect(subject).toEqual('Others');
        expect(userId).toEqual('asldka12367sdkasnd');
      }));
  });

  describe('DELETE /api/v1/suggestion/:id', () => {
    it('should delete a suggestion', () => request
      .delete('/api/v1/suggestion/2')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.rowCount).toEqual(1);
      }));
  });
});
