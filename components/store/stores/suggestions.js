module.exports = () => {
  const start = async ({ pg }) => ({
    fetchSuggestions: async () => {
      const { rows } = await pg.query('select-suggestions');
      return rows;
    },

    insertSuggestion: async payload => {
      const { rows } = await pg.upsert('skills.user_suggestion', payload);
      return rows[0];
    },

    updateSuggestion: async (id, payload) => {
      const { rows } = await pg.upsert('skills.user_suggestion', ({ id, ...payload }));
      return rows[0];
    },

    deleteSuggestion: async id => pg.delete(`${pg.schema}.user_suggestion`, { id }),

  });
  return { start };
};
