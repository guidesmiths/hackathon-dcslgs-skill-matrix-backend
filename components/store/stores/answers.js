module.exports = () => {
  const start = async ({ pg }) => ({
    fetchAnswers: async filters => {
      const { rows } = await pg.fetchAnswers(filters);
      return rows;
    },

    fetchAnswersByUser: async userId => {
      const { rows } = await pg.query('select-answers-by-user', userId);
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
