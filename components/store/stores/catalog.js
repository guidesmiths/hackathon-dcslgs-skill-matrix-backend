const R = require('ramda');

const groupByProperty = (input, property) => Object.values(R.groupBy(R.prop(property), input));
const sortByProperty = (input, property) => Object.values(R.sort(R.ascend(R.prop(property)), input));

const getLevels = ({ level, description }) => (
  {
    level,
    description,
  }
);

const getSkills = skills => {
  const {
    skillId, skillName,
    typeId, typeName,
    roleId, roleName,
    description,
  } = skills[0];
  const sortedLevels = sortByProperty(skills, 'level');
  const levels = sortedLevels.map(getLevels);

  return {
    id: skillId,
    name: skillName,
    type: { id: typeId, name: typeName },
    role: { id: roleId, name: roleName },
    description,
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
      const { rows } = await pg.query('select-skills-by-ecosystems');
      const groupedByEcosystem = groupByProperty(rows, 'ecosystemId');
      return groupedByEcosystem.map(getSkillsByEcosystems);
    },

    insertEcosystem: async payload => {
      const { rows } = await pg.upsert('skills.skill_ecosystem', payload);
      return rows[0];
    },

    deleteEcosystem: async id => pg.formattedQuery(`DELETE FROM skills.skill_ecosystem WHERE id = ${id};`),

    fetchSkills: async () => {
      const { rows } = await pg.query('select-skills');
      return rows;
    },

    insertSkill: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog', payload);
      return rows[0];
    },

    deleteSkill: async id => pg.formattedQuery(`DELETE FROM skills.skill_catalog WHERE id = ${id};`),

    insertSkillLevel: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', payload);
      return rows[0];
    },

    deleteSkillLevel: async id => pg.formattedQuery(`DELETE FROM skills.skill_catalog_level WHERE id = ${id};`),

  });
  return { start };
};
