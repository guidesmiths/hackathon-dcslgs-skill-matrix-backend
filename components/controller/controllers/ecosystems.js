/* eslint-disable no-restricted-syntax */
const debug = require('debug')('skill-matrix:controller:ecosystems');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchEcosystems = async () => {
      logger.info('Fetching skills by ecosystems');
      debug('Fetching skills by ecosystems');
      return store.ecosystems.fetchEcosystems();
    };

    const insertEcosystem = async payload => {
      logger.info('Creating a new ecosystem');
      debug('Creating a new ecosystem');

      const { name: ecosystemName, skills } = payload;
      const { id: ecosystemId } = await store.ecosystems.insertEcosystem({ name: ecosystemName });

      for await (const skill of skills) {
        debug('Creating a new skill');
        const {
          name: skillName, type: skillType, roles: skillRoles, description: skillDescription, levels,
        } = skill;
        const newSkill = {
          name: skillName, type: skillType, description: skillDescription, ecosystem: ecosystemId,
        };
        const { id: skillId } = await store.skills.insertSkill(newSkill);

        for await (const role of skillRoles) {
          debug('Create a new role for the skill');
          const roleSkill = { skill_id: skillId, role_id: role };
          await store.skills.insertRoleSkill(roleSkill);
        }

        for await (const level of levels) {
          debug('Creating a new skill level');
          level.skill_id = skillId;
          await store.skillLevels.insertSkillLevel(level);
        }
      }
      return store.ecosystems.fetchEcosystemById(ecosystemId);
    };

    const updateEcosystem = async (id, payload) => {
      logger.info('Update an existing ecosystem');
      return store.ecosystems.updateEcosystem(id, payload);
    };

    const deleteEcosystem = async id => {
      logger.info('Deleting an ecosystem');
      return store.ecosystems.deleteEcosystem(id);
    };

    return {
      fetchEcosystems,
      insertEcosystem,
      updateEcosystem,
      deleteEcosystem,
    };
  };
  return { start };
};
