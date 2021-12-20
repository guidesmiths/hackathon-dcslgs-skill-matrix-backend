module.exports = () => {
  const start = async ({ pg }) => ({
    upsertSkillLevel: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', payload, 'level_per_skill_uk');
      return rows[0];
    },

    // updateSkillLevel: async (id, payload) => {
    //   const { rows } = await pg.upsert('skills.skill_catalog_level', { id, ...payload }); // the table skill_catalog_level hasn't anymore an id
    //   return rows[0];
    // },

    // deleteSkillLevel: async id => pg.formattedQuery('delete-by-id', { tableName: 'skill_catalog_level', id }), // the table skill_catalog_level hasn't anymore an id

  });
  return { start };
};
