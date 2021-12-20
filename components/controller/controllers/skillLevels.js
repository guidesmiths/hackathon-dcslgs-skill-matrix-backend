/* eslint-disable no-restricted-syntax */

module.exports = () => {
  const start = async ({ store, logger }) => {
    const upsertSkillLevel = async payload => {
      logger.info('Creating a new skill level');
      return store.skillLevels.upsertSkillLevel(payload);
    };

    // const updateSkillLevel = async (id, payload) => { // the table skill_catalog_level hasn't anymore an id
    //   logger.info('Creating a new skill level');
    //   return store.skillLevels.updateSkillLevel(id, payload);
    // };

    // const deleteSkillLevel = async id => { // the table skill_catalog_level hasn't anymore an id
    //   logger.info('Deleting a skill level');
    //   return store.skillLevels.deleteSkillLevel(id);
    // };

    return {
      upsertSkillLevel,
      // updateSkillLevel,
      // deleteSkillLevel,
    };
  };
  return { start };
};
