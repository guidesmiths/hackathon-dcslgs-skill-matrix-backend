const debug = require('debug')('skill-matrix:controller:catalog');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchEcosystems = async () => {
      logger.info('Fetching skills by ecosystems');
      debug('Fetching skills by ecosystems');
      return store.catalog.fetchEcosystems();
    };

    const insertEcosystem = async payload => {
      logger.info('Creating a new ecosystem');
      return store.catalog.insertEcosystem(payload);
    };

    const deleteEcosystem = async id => {
      logger.info('Deleting an ecosystem');
      return store.catalog.deleteEcosystem(id);
    };

    const fetchSkills = async () => {
      logger.info('Fetching skills');
      debug('Fetching skills');
      return store.catalog.fetchSkills();
    };

    const insertSkill = async payload => {
      logger.info('Creating a new skill');
      return store.catalog.insertSkill(payload);
    };

    const deleteSkill = async id => {
      logger.info('Deleting a skill');
      return store.catalog.deleteSkill(id);
    };

    const insertSkillLevel = async payload => {
      logger.info('Creating a new skill level');
      return store.catalog.insertSkillLevel(payload);
    };

    const deleteSkillLevel = async id => {
      logger.info('Deleting a skill level');
      return store.catalog.deleteSkillLevel(id);
    };

    return {
      fetchEcosystems,
      insertEcosystem,
      deleteEcosystem,
      fetchSkills,
      insertSkill,
      deleteSkill,
      insertSkillLevel,
      deleteSkillLevel,
    };
  };
  return { start };
};
