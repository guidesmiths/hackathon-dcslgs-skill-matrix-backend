/* eslint-disable no-restricted-syntax */
const debug = require('debug')('skill-matrix:controller:skills');

module.exports = () => {
  const start = async ({ store, logger }) => {
    const fetchSkills = async () => {
      logger.info('Fetching skills');
      debug('Fetching skills');
      return store.skills.fetchSkills();
    };

    const insertSkill = async payload => {
      logger.info('Creating a new skill');
      const skill = payload;
      const { roles } = payload;
      delete skill.roles;
      const { id: skillId } = await store.skills.insertSkill(skill);

      for await (const role of roles) {
        debug('Add a new role for the skill');
        const roleSkill = { skill_id: skillId, role_id: role };
        await store.skills.insertRoleSkill(roleSkill);
      }

      return store.skills.fetchSkillById(skillId);
    };

    const updateSkill = async (id, payload) => {
      logger.info('Update an existing skill');
      const skill = payload;
      const newRoles = payload.roles;
      delete skill.roles;
      await store.skills.updateSkill(id, payload);

      debug('Delete old roles for the skill');
      await store.skills.deleteRolesBySkillId(id);

      for await (const role of newRoles) {
        debug('Add new roles for the skill');
        const roleSkill = { skill_id: id, role_id: role };
        await store.skills.insertRoleSkill(roleSkill);
      }

      return store.skills.fetchSkillById(id);
    };

    const deleteSkill = async id => {
      logger.info('Deleting a skill');
      return store.skills.deleteSkill(id);
    };

    return {
      fetchSkills,
      insertSkill,
      updateSkill,
      deleteSkill,
    };
  };
  return { start };
};
