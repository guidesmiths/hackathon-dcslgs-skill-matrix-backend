module.exports = () => {
  const start = async ({ pg }) => ({
    fetchUsers: async () => {
      const { rows } = await pg.query('select-users');
      return rows;
    },
    fetchUserInfo: async id => {
      const { rows } = await pg.formattedQuery('select-user-by-id', { id });
      return rows[0];
    },
    insertUser: async payload => {
      const { rows } = await pg.upsert('skills.user', payload, 'user_pkey');
      return rows[0];
    },
    changeUserRole: async payload => {
      const { rows } = await pg.formattedQuery('update-user-role', { id: payload.id, newRole: payload.role });
      return rows[0];
    },
    changeUserCountry: async payload => {
      const { rows } = await pg.formattedQuery('update-user-country', { id: payload.id, newCountry: payload.country });
      return rows[0];
    },
    fetchLevelUserSkill: async (id, userId) => {
      const { rows } = await pg.formattedQuery('select-level-user-skill', { id, userId });
      return rows[0];
    },
  });
  return { start };
};
