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

    deleteEcosystem: async id => pg.formattedQuery('delete-by-id', { tableName: 'skill_ecosystem', id }),

    fetchSkills: async () => {
      const { rows } = await pg.query('select-skills');
      return rows;
    },

    fetchSkillById: async id => {
      const { rows } = await pg.formattedQuery('select-skill-by-id', { id });
      const roles = [];
      rows.map(row => roles.push(row.roleId));

      const {
        skillId, name, type, ecosystem, description,
      } = rows[0];
      const skill = {
        skillId, name, type, ecosystem, roles, description,
      };

      return skill;
    },

    insertSkill: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog', payload);
      return rows[0];
    },

    updateSkill: async (id, payload) => {
      const { rows } = await pg.upsert('skills.skill_catalog', { id, ...payload });
      return rows[0];
    },

    deleteSkill: async id => pg.formattedQuery('delete-by-id', { tableName: 'skill_catalog', id }),

    insertRoleSkill: async payload => {
      const { rows } = await pg.upsert('skills.skill_role_catalog', payload);
      return rows[0];
    },

    deleteRolesBySkillId: async id => pg.formattedQuery(`DELETE FROM skills.skill_role_catalog WHERE skill_id = ${id}`),

    insertSkillLevel: async payload => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', payload);
      return rows[0];
    },

    updateSkillLevel: async (id, payload) => {
      const { rows } = await pg.upsert('skills.skill_catalog_level', { id, ...payload });
      return rows[0];
    },

    deleteSkillLevel: async id => pg.formattedQuery('delete-by-id', { tableName: 'skill_catalog_level', id }),

  });
  return { start };
};
