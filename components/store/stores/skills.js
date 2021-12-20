module.exports = () => {
  const start = async ({ pg }) => ({
    fetchSkills: async () => {
      const { rows } = await pg.query('select-skills');
      return rows;
    },

    fetchSkillById: async id => {
      const { rows } = await pg.formattedQuery('select-skill-by-id', { id });
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

    deleteSkill: async id => pg.formattedQuery('delete-by-id', { tableName: 'skill_catalog', id }),

    insertRoleSkill: async payload => {
      const { rows } = await pg.upsert('skills.skill_role_catalog', payload);
      return rows[0];
    },

    deleteRolesBySkillId: async id => pg.formattedQuery(`DELETE FROM skills.skill_role_catalog WHERE skill_id = ${id}`),

  });
  return { start };
};
