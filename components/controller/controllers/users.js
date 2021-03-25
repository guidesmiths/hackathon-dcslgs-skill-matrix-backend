const debug = require('debug')('skill-matrix:controller:users');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchUsers = async () => {
      logger.info('Fetching all users');
      debug('Fetching all users');
      return store.users.fetchUsers();
    };
    return {
      fetchUsers,
    };
  };
  return { start };
};
