const debug = require('debug')('skill-matrix:controller:catalog');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchSkillCatalog = async () => {
      logger.info('Fetching skill catalog');
      debug('Fetching skill catalog');
      return store.catalog.fetchSkillCatalog();
    };

    const insertSkill = async payload => {
      logger.info('Creating new skill');
      const skill = await store.catalog.insertSkill(payload);
      return skill;
    };

    const deleteSkill = async id => {
      logger.info('Deleting a skill');
      const skill = await store.catalog.deleteSkill(id);
      return skill;
    };

    const insertSkillLevel = async payload => {
      logger.info('Creating new skill level');
      const skillLevel = await store.catalog.insertSkillLevel(payload);
      return skillLevel;
    };

    const deleteSkillLevel = async id => {
      logger.info('Deleting a skill level');
      const skillLevel = await store.catalog.deleteSkillLevel(id);
      return skillLevel;
    };

    return {
      fetchSkillCatalog,
      insertSkill,
      deleteSkill,
      insertSkillLevel,
      deleteSkillLevel,
    };
  };
  return { start };
};
