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
    id: userId || user.user_id,
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
    const fetchUsersFiltered = async filters => {
      logger.info('Fetching users filtered');
      debug('Fetching users filtered');

      return store.answers.fetchUsersFiltered(filters);
    };

    const fetchAnswersByUser = async id => {
      logger.info('Fetching answers by user');
      debug('Fetching answers by user');

      const answers = await store.answers.fetchAnswersByUser(id);

      const groupedByUser = groupByProperty(answers, 'userId');

      return groupedByUser.map(getAnswerByUser);
    };

    const fetchAnswersByUserAndEcosystem = async (userId, ecoId) => {
      logger.info('Fetching answers by user');
      debug('Fetching answers by user');

      const answersByUser = await store.answers.fetchAnswersByUserAndEcosystem(userId, ecoId);
      const userData = await store.users.fetchUserInfo(userId);

      if (answersByUser.length === 0) {
        const ecosystems = await store.ecosystems.fetchSkillsByEcosystemId(ecoId);
        return {
          id: userData.user_id,
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

    const insertAnswers = async (userId, answers, isMigration = false) => {
      logger.info('Creating new answers from an user');

      let ecosystemId;
      if (isMigration) {
        const ecosystems = await store.ecosystems.fetchEcosystems();
        ecosystemId = ecosystems[0].id;
      } else {
        const { id } = await store.ecosystems.fetchEcosystemBySkillId(answers[0].skill_id);
        ecosystemId = id;
      }

      const promises = answers.map(answer => {
        const { skill_value: skillValue, skill_id: skillId, interested: isInterested } = answer;
        if (skillValue === 0 && !isInterested) {
          debug('Deleting an answer');
          return store.answers.deleteAnswer(userId, skillId);
        }

        debug('Creating a new answer');
        return store.answers.insertAnswer({ user_id: userId, ...answer });
      });

      await Promise.allSettled(promises);

      return fetchAnswersByUserAndEcosystem(userId, ecosystemId);
    };

    const migrateAnswers = async (id, answers) => {
      logger.info('Preparing answers to insert');

      const skills = await store.skills.fetchSkillsWithEcosystem();

      const answersPrepared = answers.map(answer => {
        const skillFound = skills.find(skill => skill.skillName.match(answer.skill_name) && skill.ecosystemName.match(answer.ecosystem_name));

        if (skillFound) {
          return {
            skill_id: skillFound.skillId,
            skill_value: +answer.skill_value,
            skill_subvalue: 'neutral',
            interested: answer.interested,
            comments: answer.comments,
          };
        }
        return null;
      }).filter(answerPrepared => answerPrepared);

      insertAnswers(id, answersPrepared, true);
    };

    return {
      fetchUsersFiltered,
      fetchAnswersByUser,
      fetchAnswersByUserAndEcosystem,
      insertAnswers,
      migrateAnswers,
    };
  };
  return { start };
};
