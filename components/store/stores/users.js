module.exports = () => {
  const start = async ({ pg }) => ({
    fetchUsers: async () => {
      const { rows } = await pg.query('select-users');
      return rows;
    },
  });
  return { start };
};
