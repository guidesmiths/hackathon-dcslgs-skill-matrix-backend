module.exports = () => {
  const start = async ({ pg }) => ({
    insertSkillLevel: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', payload);
      return rows[0];
    },

    updateSkillLevel: async (id, payload) => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', { id, ...payload });
      return rows[0];
    },

    deleteSkillLevel: async id => pg.formattedQuery('delete-by-id', { tableName: 'skill_catalog_level', id }),

  });
  return { start };
};
