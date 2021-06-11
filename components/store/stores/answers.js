const R = require('ramda');

const groupByProperty = (input, property) => Object.values(R.groupBy(R.prop(property), input));

const getAnswerByUser = (groupedByEcosystem, user) => {
  const currentUser = user;
  groupedByEcosystem.forEach((grouped, idx) => {
    const { ecosystemId, ecosystemName } = grouped[0];
    user.ecosystems.push({ id: ecosystemId, name: ecosystemName, skills: [] });

    const skillsArray = [];
    let sumValues = 0;
    grouped.forEach(skill => {
      const { skillId, skillName, skill_value: level } = skill;
      sumValues += level;
      skillsArray.push({ id: skillId, name: skillName, level });
      currentUser.ecosystems[idx].skills = skillsArray;
    });
    currentUser.ecosystems[idx].average = sumValues / grouped.length;
  });
  return currentUser;
};

module.exports = () => {
  const start = async ({ pg }) => ({
    fetchAnswers: async filters => {
      const { rows } = await pg.fetchAnswers(filters);
      const groupedByUser = groupByProperty(rows, 'userId');
      const results = [];

      groupedByUser.forEach(groupedUser => {
        const { userId, email, userName } = groupedUser[0];
        const user = {
          id: userId, email, name: userName, ecosystems: [],
        };

        const groupedByEcosystem = groupByProperty(groupedUser, 'ecosystemId');
        results.push(getAnswerByUser(groupedByEcosystem, user));
      });
      return results;
    },

    fetchAnswersByUser: async id => {
      const { rows } = await pg.query('select-answers-by-user', id);
      const { email, userName } = rows[0];
      const user = {
        id, email, name: userName, ecosystems: [],
      };

      const groupedByEcosystem = groupByProperty(rows, 'ecosystemId');
      return getAnswerByUser(groupedByEcosystem, user);
    },

    insertAnswer: async payload => {
      const { rows } = await pg.upsert('skills.user_skill', payload, 'skill_id_per_user_uk');
      return rows[0];
    },
  });
  return { start };
};
