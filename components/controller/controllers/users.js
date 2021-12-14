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
    const changeUserCountry = async payload => {
      logger.info('Changing user country');
      debug('User country change');
      return store.users.changeUserCountry(payload);
    };
    const fetchLevelUserSkill = async (id, userId) => {
      logger.info('Fetch user level at skill');
      debug('Fetch user level at skill');
      return store.users.fetchLevelUserSkill(id, userId);
    };
    return {
      fetchUsers, fetchUserInfo, insertUser, changeUserRole, changeUserCountry, fetchLevelUserSkill,
    };
  };
  return { start };
};
