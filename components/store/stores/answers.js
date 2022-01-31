module.exports = () => {
  const start = async ({ pg }) => ({
    fetchUsersFiltered: async (filters, query, totalItems) => {
      const { rows } = await pg.fetchUsersFiltered(filters, query, totalItems);
      return rows;
    },

    fetchAnswersByUser: async id => {
      const { rows } = await pg.fetchAnswersByUser(id);
      return rows;
    },

    fetchAnswersByUserAndEcosystem: async (userId, ecoId) => {
      const { rows } = await pg.formattedQuery('select-answers-by-user-and-ecosystem', { user_id: userId, eco_id: ecoId });
      return rows;
    },

    insertAnswer: async payload => {
      const { rows } = await pg.upsert('skills.user_skill', payload, 'skill_id_per_user_uk');
      return rows[0];
    },

    deleteAnswer: async (userId, skillId) => pg.formattedQuery('delete-answer-by-skill-and-user', { user_id: userId, skill_id: skillId }),

  });
  return { start };
};
