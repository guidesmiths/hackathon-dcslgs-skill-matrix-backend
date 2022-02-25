/* eslint-disable jest/no-disabled-tests */
const supertest = require('supertest');
const { StatusCodes } = require('http-status-codes');

const initSystem = require('../test-system');

describe('Ecosystems API routes', () => {
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

  describe('GET /api/v1/ecosystems', () => {
    it('should return OK (200) with the skills by ecosystem', () => request
      .get('/api/v1/ecosystems')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(2);
        const { name } = body[1];
        expect(name).toEqual('React');
      }));
  });

  describe('GET /api/v1/ecosystem/:id', () => {
    it('should return OK (200) with the skills by ecosystem', () => request
      .get('/api/v1/ecosystem/1')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body).toHaveLength(1);
        const { name, skills } = body[0];
        expect(name).toEqual('React');
        expect(skills).toHaveLength(5);
        expect(skills[1].name).toEqual('Next.js');
        expect(skills[1].roles[0].name).toEqual('Frontend');
        expect(skills[1].type.name).toEqual('Hard');
        expect(skills[1].levels).toHaveLength(4);
        expect(skills[1].levels[0].levelDescription).toEqual('I understand the framework principles and I can implement solutions defined at the documentation or tutorials');
        expect(skills[1].levels[0].level).toEqual(1);
      }));
  });

  describe('POST /api/v1/ecosystem', () => {
    it('should create a new ecosystem with one skill', () => request
      .post('/api/v1/ecosystem')
      .send({
        name: 'Testingg',
        skills: [
          {
            name: 'Cypress',
            type: 1,
            roles: [1, 3],
            description: '',
            levels: [
              { level: 1, levelDescription: 'I work effectively modifying existing solutions implemented with it.' },
              { level: 2, levelDescription: 'I can develop new solutions that use it. I am able to implement a not so basic text suite with its related fixtures.' },
              { level: 3, levelDescription: 'I can design new solutions that use it, in order to optimize response time, processing cost, managing a huge amount test specs. I can handle the cy-data anchors in an efficient way. I can implement custom commands.' },
              { level: 4, levelDescription: 'I deeply understand the library in order to get the most out of it. I understand the API integration that cypress provides and I am able to work with it in CI/CD process' },
            ],
          },
        ],
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          name: ecosystemName, skills,
        } = body[0];
        expect(ecosystemName).toEqual('Testingg');
        expect(skills).toHaveLength(1);
        const {
          name: skillName, type: skillType, description: skillDescription, levels, // roles,
        } = skills[0];
        expect(skillName).toEqual('Cypress');
        expect(skillType.id).toEqual(1);
        // expect(roles).toHaveLength(2);
        expect(skillDescription).toEqual('');
        expect(levels).toHaveLength(4);
        const {
          level, levelDescription,
        } = levels[0];
        expect(level).toEqual(1);
        expect(levelDescription).toEqual('I work effectively modifying existing solutions implemented with it.');
      }));

    it('should create a new ecosystem with two skills', () => request
      .post('/api/v1/ecosystem')
      .send({
        name: 'Web Client',
        skills: [
          {
            name: 'CSS',
            type: 1,
            roles: [1],
            description: '',
            levels: [
              { level: 1, levelDescription: 'I have a basic knowledge of HTML. I know how to make a style rule. I understand the differences between a tag, ID, and class rule declaration. I understand how styles ‘cascade’ downward.' },
              { level: 2, levelDescription: 'I know what pseudo-classes are, and how to target rules on to them. I know  what web fonts and system fonts are. I know  what the rule !important does and why not to use it in most cases.' },
              { level: 3, levelDescription: 'I know most of the style rules. I know how to target rules based on HTML attributes. I understand the various ways of positioning and when to use them. I understand the box model, when to use position, margin, border, padding, height, and width.' },
              { level: 4, levelDescription: 'I have an advanced knowledge of HTML. I know all style rules and when they apply to specific tags. I know sibling selectors, like > and +. I know how to solve style issues caused by browser compatibility.' },
            ],
          },
          {
            name: 'SASS',
            type: 1,
            roles: [1, 3],
            description: '',
            levels: [
              { level: 1, levelDescription: 'I work effectively modifying existing solutions implemented with it' },
              { level: 2, levelDescription: 'I develop new solutions that use it. I can implement variables, nesting, and imports' },
              { level: 3, levelDescription: 'I can implement advanced concepts like mixins, extends, sass built-in function, and operators' },
              { level: 4, levelDescription: 'I deeply understands the library to get the most out of it. I can configure it and define style guidelines for all the team members' },
            ],
          },
        ],
      })
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        const {
          name: ecosystemName, skills,
        } = body[0];
        expect(ecosystemName).toEqual('Web Client');
        expect(skills).toHaveLength(2);
        const {
          name: skillName, type: skillType, description: skillDescription, levels, // roles,
        } = skills[1];
        expect(skillName).toEqual('SASS');
        expect(skillType.id).toEqual(1);
        // expect(roles).toHaveLength(2);
        expect(skillDescription).toEqual('');
        expect(levels).toHaveLength(4);
        const {
          level, levelDescription,
        } = levels[0];
        expect(level).toEqual(1);
        expect(levelDescription).toEqual('I work effectively modifying existing solutions implemented with it');
      }));
  });

  describe('DELETE /api/v1/ecosystem/:id', () => {
    it('should delete a ecosystem', () => request
      .delete('/api/v1/ecosystem/2')
      .expect(StatusCodes.OK)
      .then(({ body }) => {
        expect(body.rowCount).toEqual(1);
      }));
  });
});
