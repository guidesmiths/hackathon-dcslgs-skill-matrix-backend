/* eslint-disable no-restricted-syntax */
const debug = require('debug')('skill-matrix:controller:ecosystems');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchEcosystems = async () => {
      logger.info('Fetching skills by ecosystems');
      debug('Fetching skills by ecosystems');
      return store.ecosystems.fetchEcosystems();
    };

    const upsertEcosystem = async payload => {
      logger.info('Creating a new ecosystem');
      debug('Creating a new ecosystem');

      const { id: ecoId, name: ecoName, skills } = payload;
      const { id: ecosystemId } = await store.ecosystems.upsertEcosystem({ id: ecoId, name: ecoName });
      for await (const skill of skills) {
        debug('Creating a new skill');
        skill.type = skill.type.id || skill.type;
        const {
          id: skillId, name: skillName, type: skillType, description: skillDescription, levels, // roles: skillRoles,
        } = skill;

        const newSkill = {
          name: skillName, type: skillType.id || skillType, description: skillDescription, ecosystem: ecosystemId,
        };

        if (skillId !== 0) {
          newSkill.id = skillId;
        }

        const { id: newSkillId } = await store.skills.upsertSkill(newSkill);

        // for await (const role of skillRoles) {
        //   debug('Create a new role for the skill');
        //   const roleSkill = { skill_id: newSkillId, role_id: role.id || role };
        //   await store.skills.insertRoleSkill(roleSkill);
        // }

        for await (const { level, levelDescription } of levels) {
          debug('Creating a new skill level');
          const newLevel = { level, description: levelDescription, skill_id: newSkillId };
          await store.skillLevels.upsertSkillLevel(newLevel);
        }
      }
      return store.ecosystems.fetchEcosystemById(ecosystemId);
    };

    const deleteEcosystem = async id => {
      logger.info('Deleting an ecosystem');
      return store.ecosystems.deleteEcosystem(id);
    };

    return {
      fetchEcosystems,
      upsertEcosystem,
      deleteEcosystem,
    };
  };
  return { start };
};
