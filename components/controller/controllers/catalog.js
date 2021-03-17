const debug = require('debug')('skill-matrix:controller:catalog');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchSkillCatalog = async () => {
      logger.info('Fetching skill catalog');
      debug('Fetching skill catalog');
      return store.catalog.fetchSkillCatalog();
    };
    return {
      fetchSkillCatalog,
    };
  };
  return { start };
};
