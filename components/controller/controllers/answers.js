const debug = require('debug')('skill-matrix:controller:answers');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchAnswers = async () => {
      logger.info('Fetching all answers');
      debug('Fetching all answers');
      return store.answers.fetchAnswers();
    };
    return {
      fetchAnswers,
    };
  };
  return { start };
};
