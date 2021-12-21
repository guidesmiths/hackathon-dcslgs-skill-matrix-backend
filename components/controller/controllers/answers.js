/* eslint-disable no-restricted-syntax */
const debug = require('debug')('skill-matrix:controller:answers');
const R = require('ramda');

const groupByProperty = (input, property) => Object.values(R.groupBy(R.prop(property), input));

const getSkill = ({
  skillId, skillName, skillValue, levelDescription, skillSubvalue, interested, comments,
}) => (
  {
    id: skillId,
    name: skillName,
    level: skillValue || 0,
    levelDescription,
    sublevel: skillSubvalue || 'neutral',
    interested,
    comments,
  }
);

const sumSubValue = subvalue => {
  if (subvalue === 'plus') return 0.33;
  if (subvalue === 'minus') return -0.33;
  return 0;
};

const getEcosystem = ecosystem => {
  const { ecosystemId, ecosystemName } = ecosystem[0];
  const sumReducer = (sum, curr) => sum + curr.skillValue + sumSubValue(curr.skillSubvalue);
  const average = ecosystem.reduce(sumReducer, 0) / ecosystem.length;
  const skills = ecosystem.map(getSkill);

  return {
    id: ecosystemId,
    name: ecosystemName,
    average,
    skills,
  };
};

const getAnswerByUser = (answerUser, user) => {
  const {
    userId, email, userName, userRole, country, seniority,
  } = answerUser[0];

  const groupedByEcosystem = groupByProperty(answerUser, 'ecosystemId');
  const ecosystems = groupedByEcosystem.map(getEcosystem);

  return {
    id: userId || user.id,
    email: email || user.email,
    name: userName || user.name,
    ecosystems,
    userRole: userRole || user.role,
    country: country || user.country,
    seniority: seniority || user.seniority,
  };
};

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchAnswers = async filters => {
      logger.info('Fetching all answers');
      debug('Fetching all answers');
      const answers = await store.answers.fetchAnswers(filters);
      const groupedByUser = groupByProperty(answers, 'userId');
      return groupedByUser.map(getAnswerByUser);
    };

    const fetchAnswersByUser = async id => {
      logger.info('Fetching answers by user');
      debug('Fetching answers by user');
      const userData = await store.users.fetchUserInfo(id);
      const answersByUser = await store.answers.fetchAnswersByUser(userData.id);
      if (answersByUser.length === 0) {
        const ecosystems = await store.ecosystems.fetchEcosystems();
        return {
          id: userData.id,
          email: userData.email,
          name: userData.name,
          userRole: userData.role,
          ecosystems,
          country: userData.country,
          seniority: userData.seniority,
        };
      }
      return getAnswerByUser(answersByUser, userData);
    };

    const insertAnswers = async (id, answers) => {
      logger.info('Creating new answers from an user');
      for await (const answer of answers) {
        const { skill_value: skillValue, skill_id: skillId, interested: isInterested } = answer;
        if (skillValue === 0 && !isInterested) {
          debug('Deleting an answer');
          await store.answers.deleteAnswer(id, skillId);
        } else {
          debug('Creating a new answer');
          await store.answers.insertAnswer({ user_id: id, ...answer });
        }
      }
      return fetchAnswersByUser(id);
    };

    const migrateAnswers = async (id, answers) => {
      logger.info('Preparing answers to insert');
      const answersPrepared = [];
      for await (const answer of answers) {
        const skillId = await store.answers.getSkillId(answer.skill_name, answer.ecosystem_name);
        if (skillId) {
          const answerToInsert = {
            skill_id: skillId.id,
            skill_value: answer.skill_value,
            skill_subvalue: 'neutral',
            interested: answer.interested,
            comments: answer.comments,
          };
          answersPrepared.push(answerToInsert);
        }
      }
      insertAnswers(id, answersPrepared);
    };

    return {
      fetchAnswers,
      fetchAnswersByUser,
      insertAnswers,
      migrateAnswers,
    };
  };
  return { start };
};
