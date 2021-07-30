const debug = require('debug')('skill-matrix:controller:suggestion');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchSuggestions = async () => {
      logger.info('Fetching suggestions');
      debug('Fetching skills by suggestions');
      return store.suggestions.fetchSuggestions();
    };

    const insertSuggestion = async payload => {
      logger.info('Creating a new suggestion');
      return store.suggestions.insertSuggestion(payload);
    };

    const deleteSuggestion = async id => {
      logger.info('Deleting a suggestion');
      return store.suggestions.deleteSuggestion(id);
    };

    return {
      fetchSuggestions,
      insertSuggestion,
      deleteSuggestion,
    };
  };
  return { start };
};
