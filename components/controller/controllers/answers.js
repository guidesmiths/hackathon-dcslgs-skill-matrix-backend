/* eslint-disable no-restricted-syntax */
const debug = require('debug')('skill-matrix:controller:answers');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchAnswers = async filters => {
      logger.info('Fetching all answers');
      debug('Fetching all answers');
      return store.answers.fetchAnswers(filters);
    };

    const fetchAnswersByUser = async id => {
      logger.info('Fetching answers by user');
      debug('Fetching answers by user');
      return store.answers.fetchAnswersByUser(id);
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
      return store.answers.fetchAnswersByUser(id);
    };

    return {
      fetchAnswers,
      fetchAnswersByUser,
      insertAnswers,
    };
  };
  return { start };
};
