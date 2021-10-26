module.exports = () => {
  const start = async ({ pg }) => ({
    fetchUsers: async () => {
      const { rows } = await pg.query('select-users');
      return rows;
    },

    fetchUserById: async id => {
      const { rows } = await pg.query(`SELECT user_id, email, img_url, "name", "domain", "role" FROM skills."user" WHERE user_id='${id}'`);
      return rows[0];
    },
  });
  return { start };
};
