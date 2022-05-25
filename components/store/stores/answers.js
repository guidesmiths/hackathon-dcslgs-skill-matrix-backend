module.exports = () => {
  const start = async ({ pg }) => ({
    fetchUsersFiltered: async (filters, query) => {
      const { total, users } = await pg.fetchUsersFiltered(filters, query);
      return { total, users };
    },

    fetchAnswersByUser: async id => {
      const { rows } = await pg.query('fetch-answers-by-user', [id]);
      return rows;
    },

    fetchAnswersByUserAndEcosystem: async (userId, ecoId) => {
      const { rows } = await pg.query('select-answers-by-user-and-ecosystem', [userId, ecoId]);
      return rows;
    },

    fetchFilledSkillsCount: async userId => {
      const { rows } = await pg.query('select-filled-skills-count', [userId]);
      return rows;
    },

    insertAnswer: async payload => {
      const { rows } = await pg.upsert('skills.user_skill', payload, { conflictTarget: 'skill_id_per_user_uk', isTargetConstraint: true });
      return rows[0];
    },

    deleteAnswer: async (userId, skillId) => pg.query('delete-answer-by-skill-and-user', [userId, skillId]),

  });
  return { start };
};
