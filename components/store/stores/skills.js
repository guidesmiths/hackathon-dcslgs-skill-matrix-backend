module.exports = () => {
  const start = async ({ pg }) => ({
    fetchSkills: async () => {
      const { rows } = await pg.query('select-skills');
      return rows;
    },

    fetchSkillsWithEcosystem: async () => {
      const { rows } = await pg.query('select-skills-with-ecosystem');
      return rows;
    },

    fetchSkillById: async id => {
      const { rows } = await pg.query('select-skill-by-id', [id]);
      const roles = rows.map(row => row.roleId);

      const {
        skillId, name, type, ecosystem, description,
      } = rows[0];

      return {
        skillId, name, type, ecosystem, roles, description,
      };
    },

    upsertSkill: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog', payload);
      return rows[0];
    },

    updateSkill: async (id, payload) => {
      const { rows } = await pg.upsert('skills.skill_catalog', { id, ...payload });
      return rows[0];
    },

    deleteSkill: async id => pg.delete(`${pg.schema}.skill_catalog`, { id }),

    insertRoleSkill: async payload => {
      const { rows } = await pg.upsert('skills.skill_role_catalog', payload);
      return rows[0];
    },

    deleteRolesBySkillId: async id => pg.delete(`${pg.schema}.skill_role_catalog`, { id }),

  });
  return { start };
};
