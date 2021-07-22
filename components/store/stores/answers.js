const R = require('ramda');

const groupByProperty = (input, property) => Object.values(R.groupBy(R.prop(property), input));

const getSkill = ({
  skillId, skillName, skillValue, skillSubvalue, interested, comments,
}) => (
  {
    id: skillId,
    name: skillName,
    level: skillValue,
    sublevel: skillSubvalue,
    interested,
    comments,
  }
);

const getEcosystem = ecosystem => {
  const { ecosystemId, ecosystemName } = ecosystem[0];
  const average = ecosystem.reduce((sum, value) => sum + value.skillValue, 0) / ecosystem.length;
  const skills = ecosystem.map(getSkill);

  return {
    id: ecosystemId,
    name: ecosystemName,
    average,
    skills,
  };
};

const getAnswerByUser = answerUser => {
  const { userId, email, userName } = answerUser[0];
  const groupedByEcosystem = groupByProperty(answerUser, 'ecosystemId');
  const ecosystems = groupedByEcosystem.map(getEcosystem);

  return {
    id: userId,
    email,
    name: userName,
    ecosystems,
  };
};

module.exports = () => {
  const start = async ({ pg }) => ({
    fetchAnswers: async filters => {
      const { rows } = await pg.fetchAnswers(filters);
      const groupedByUser = groupByProperty(rows, 'userId');
      return groupedByUser.map(getAnswerByUser);
    },

    fetchAnswersByUser: async userId => {
      const { rows } = await pg.query('select-answers-by-user', userId);
      return getAnswerByUser(rows);
    },

    insertAnswer: async payload => {
      const { rows } = await pg.upsert('skills.user_skill', payload, 'skill_id_per_user_uk');
      return rows[0];
    },
  });
  return { start };
};
