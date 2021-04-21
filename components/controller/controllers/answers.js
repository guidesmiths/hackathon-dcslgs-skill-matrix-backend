const debug = require('debug')('skill-matrix:controller:answers');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchAnswers = async filters => {
      logger.info('Fetching all answers');
      debug('Fetching all answers');
      return store.answers.fetchAnswers(filters);
    };

    const insertAnswer = async payload => {
      logger.info('Creating new answer from an user');
      const answer = await store.answers.insertAnswer(payload);
      return answer;
    };

    return {
      fetchAnswers,
      insertAnswer,
    };
  };
  return { start };
};
