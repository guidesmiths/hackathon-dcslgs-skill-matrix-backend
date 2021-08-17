const R = require('ramda');

const groupByProperty = (input, property) => Object.values(R.groupBy(R.prop(property), input));
const sortByProperty = (input, property) => Object.values(R.sort(R.ascend(R.prop(property)), input));

const getLevels = ({ level, levelDescription }) => (
  {
    level,
    levelDescription,
  }
);

const getSkills = skills => {
  const {
    skillId, skillName,
    typeId, typeName,
    roleId, roleName,
    skillDescription,
  } = skills[0];
  const sortedLevels = sortByProperty(skills, 'level');
  const levels = sortedLevels.map(getLevels);

  return {
    id: skillId,
    name: skillName,
    type: { id: typeId, name: typeName },
    role: { id: roleId, name: roleName },
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
      const { rows } = await pg.query('select-skills-by-ecosystems');
      const groupedByEcosystem = groupByProperty(rows, 'ecosystemId');
      return groupedByEcosystem.map(getSkillsByEcosystems);
    },

    fetchEcosystemById: async id => {
      const { rows } = await pg.query('select-skills-by-ecosystems');
      const groupedByEcosystem = groupByProperty(rows, 'ecosystemId');
      return groupedByEcosystem.map(getSkillsByEcosystems).find(ecosystem => ecosystem.id === id);
    },

    insertEcosystem: async payload => {
      const { rows } = await pg.upsert('skills.skill_ecosystem', payload);
      return rows[0];
    },

    updateEcosystem: async (id, payload) => {
      const { rows } = await pg.upsert('skills.skill_ecosystem', { id, ...payload });
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

    updateSkill: async (id, payload) => {
      const { rows } = await pg.upsert('skills.skill_catalog', { id, ...payload });
      return rows[0];
    },

    deleteSkill: async id => pg.formattedQuery(`DELETE FROM skills.skill_catalog WHERE id = ${id};`),

    insertSkillLevel: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', payload);
      return rows[0];
    },

    updateSkillLevel: async (id, payload) => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', { id, ...payload });
      return rows[0];
    },

    deleteSkillLevel: async id => pg.formattedQuery(`DELETE FROM skills.skill_catalog_level WHERE id = ${id};`),

  });
  return { start };
};
