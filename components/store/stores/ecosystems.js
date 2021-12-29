const R = require('ramda');

const groupByProperty = (input, property) => Object.values(R.groupBy(R.prop(property), input));
const sortByProperty = (input, property) => Object.values(R.sort(R.ascend(R.prop(property)), input));

const getLevels = skills => {
  const levels = [];
  skills.forEach(skill => {
    if (!levels.find(level => level.level === skill.level)) {
      levels.push({ level: skill.level, levelDescription: skill.levelDescription });
    }
  });
  return levels;
};

const getRoles = skills => {
  const roles = [];
  skills.forEach(skill => {
    if (!roles.find(role => role.id === skill.roleId)) {
      roles.push({ id: skill.roleId, name: skill.roleName });
    }
  });
  return roles;
};

const getSkills = skills => {
  const {
    skillId, skillName,
    typeId, typeName,
    skillDescription,
  } = skills[0];
  const roles = getRoles(skills);
  const sortedLevels = sortByProperty(skills, 'level');
  const levels = getLevels(sortedLevels);

  return {
    id: skillId,
    name: skillName,
    type: { id: typeId, name: typeName },
    roles,
    description: skillDescription,
    levels,
  };
};

const getSkillsByEcosystems = ecosystem => {
  const { ecosystemId, ecosystemName } = ecosystem[0];
  const groupedBySkill = groupByProperty(ecosystem, 'skillId');
  const skills = groupedBySkill.map(getSkills);

  return {
    id: ecosystemId,
    name: ecosystemName,
    skills,
  };
};

module.exports = () => {
  const start = async ({ pg }) => ({
    fetchEcosystems: async () => {
      const { rows } = await pg.query('select-ecosystems-list');
      return rows;
    },

    fetchSkillsByEcosystemId: async id => {
      const { rows } = await pg.query('select-skills-by-ecosystems', id);
      return [rows].map(getSkillsByEcosystems);
    },

    fetchEcosystemBySkillId: async skillId => {
      const { rows } = await pg.query('select-ecosystem-by-skill', skillId);
      return rows[0];
    },

    upsertEcosystem: async payload => {
      const { rows } = await pg.upsert('skills.skill_ecosystem', payload);
      return rows[0];
    },

    deleteEcosystem: async id => pg.formattedQuery('delete-by-id', { tableName: 'skill_ecosystem', id }),

  });
  return { start };
};
