module.exports = () => {
  const start = async ({ pg }) => ({
    fetchAnswers: async () => {
      const { rows } = await pg.query('select-answers');
      return rows;
    },
  });
  return { start };
};
