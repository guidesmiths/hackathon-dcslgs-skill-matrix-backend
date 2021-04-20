const debug = require('debug')('skill-matrix:controller:answers');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchAnswers = async filters => {
      logger.info('Fetching all answers');
      debug('Fetching all answers');
      return store.answers.fetchAnswers(filters);
    };
    return {
      fetchAnswers,
    };
  };
  return { start };
};
