/* eslint-disable no-restricted-syntax */

module.exports = () => {
  const start = async ({ store, logger }) => {
    const insertSkillLevel = async payload => {
      logger.info('Creating a new skill level');
      return store.skillLevels.insertSkillLevel(payload);
    };

    const updateSkillLevel = async (id, payload) => {
      logger.info('Creating a new skill level');
      return store.skillLevels.updateSkillLevel(id, payload);
    };

    const deleteSkillLevel = async id => {
      logger.info('Deleting a skill level');
      return store.skillLevels.deleteSkillLevel(id);
    };

    return {
      insertSkillLevel,
      updateSkillLevel,
      deleteSkillLevel,
    };
  };
  return { start };
};
