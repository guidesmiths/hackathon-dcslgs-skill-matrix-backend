const debug = require('debug')('skill-matrix:controller:users');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchUsers = async () => {
      logger.info('Fetching all users');
      debug('Fetching all users');
      return store.users.fetchUsers();
    };
    const fetchUserInfo = async id => {
      logger.info('Fetching user by id');
      debug('Fetching users by id');
      return store.users.fetchUserInfo(id);
    };
    const insertUser = async payload => {
      logger.info('Creating user');
      debug('User creation');
      return store.users.insertUser(payload);
    };
    const changeUserRole = async payload => {
      logger.info('Changing user role');
      debug('User role change');
      return store.users.changeUserRole(payload);
    };
    return {
      fetchUsers, fetchUserInfo, insertUser, changeUserRole,
    };
  };
  return { start };
};
