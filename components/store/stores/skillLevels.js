module.exports = () => {
  const start = async ({ pg }) => ({
    upsertSkillLevel: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', payload, { conflictTarget: 'level_per_skill_uk', isTargetConstraint: true });
      return rows[0];
    },
  });
  return { start };
};
