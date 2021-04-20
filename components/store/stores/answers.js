module.exports = () => {
  const start = async ({ pg }) => ({
    fetchAnswers: async filters => {
      const { rows } = await pg.fetchAnswers(filters);
      return rows;
    },
  });
  return { start };
};
