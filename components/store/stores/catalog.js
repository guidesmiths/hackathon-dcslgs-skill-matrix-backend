module.exports = () => {
  const start = async ({ pg }) => ({
    fetchSkillCatalog: async () => {
      const { rows } = await pg.query('select-skills-catalog');
      return rows;
    },
  });
  return { start };
};
