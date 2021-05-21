module.exports = () => {
  const start = async ({ pg }) => ({
    fetchSkillCatalog: async () => {
      const { rows } = await pg.query('select-skills-catalog');
      return rows;
    },

    insertSkill: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog', payload);
      return rows[0];
    },

    deleteSkill: async id => {
      const skill = await pg.formattedQuery(`DELETE FROM skills.skill_catalog WHERE id = ${id};`);
      return skill;
    },

    insertSkillLevel: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', payload);
      return rows[0];
    },

    deleteSkillLevel: async id => {
      const skillLevel = await pg.formattedQuery(`DELETE FROM skills.skill_catalog_level WHERE id = ${id};`);
      return skillLevel;
    },

  });
  return { start };
};
