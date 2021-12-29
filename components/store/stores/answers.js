module.exports = () => {
  const start = async ({ pg }) => ({
    fetchAnswers: async filters => {
      const { rows } = await pg.fetchAnswers(filters);
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

    getSkillId: async (skillName, ecosystemName) => {
      const { rows } = await pg.formattedQuery('select-skill-id', { skill_name: skillName, ecosystem_name: ecosystemName });
      return rows[0];
    },
  });
  return { start };
};
