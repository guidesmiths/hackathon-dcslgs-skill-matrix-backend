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
    level: skillValue,
    levelDescription,
    sublevel: skillSubvalue,
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

const getAnswerByUser = answerUser => {
  const {
    userId, email, userName, userRole,
  } = answerUser[0];
  const groupedByEcosystem = groupByProperty(answerUser, 'ecosystemId');
  const ecosystems = groupedByEcosystem.map(getEcosystem);

  return {
    id: userId,
    email: email.toLowerCase(),
    name: userName,
    ecosystems,
    userRole,
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
      const answersByUser = await store.answers.fetchAnswersByUser(id);
      if (answersByUser.length === 0) {
        const userData = await store.users.fetchUserInfo(id);
        const ecosystems = await store.ecosystems.fetchEcosystems();
        return {
          id: userData.user_id,
          email: userData.email.toLowerCase(),
          name: userData.name,
          userRole: userData.role,
          ecosystems,
        };
      }
      return getAnswerByUser(answersByUser);
    };

    const insertAnswers = async (id, answers) => {
      logger.info('Creating new answers from an user');
      for await (const answer of answers) {
        const { skill_value: skillValue, skill_id: skillId } = answer;
        if (skillValue === 0) {
          debug('Deleting an answer');
          await store.answers.deleteAnswer(id, skillId);
        } else {
          debug('Creating a new answer');
          await store.answers.insertAnswer({ user_id: id, ...answer });
        }
      }
      return fetchAnswersByUser(id);
    };

    return {
      fetchAnswers,
      fetchAnswersByUser,
      insertAnswers,
    };
  };
  return { start };
};
