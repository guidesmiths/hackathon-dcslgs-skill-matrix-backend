const initHandyPg = require('handy-postgres');

const { buildUpsertQuery } = require('./utils/queryBuilder');

const getFiltersSubquery = ({ skills }) => {
  let text = `us.user_id in (
    select u.user_id from skills."user" u
    left join skills.user_skill us on us.user_id = u.user_id
    where`;
  skills.forEach((skillLevel, index) => {
    text += ` (us.skill_id = ${skillLevel.skill} and us.skill_value >= ${skillLevel.level || 0}) ${index < skills.length - 1 ? 'or' : ''}`;
  });
  text += `group by u.user_id
    having count(*) = ${skills.length}
    ) and`;
  return text;
};

module.exports = ({ configPath }) => {
  let handyPg;

  const start = async ({ config, logger }) => {
    handyPg = initHandyPg({ logger, configPath });
    const pgAPI = await handyPg.start(config);
    return {
      ...pgAPI,
      schema: config.schema,

      /**
       *  Execute an upsert operation on the specified table. The data passed
       * down to this method may contain values for all of the columns in the
       * table or just a subset of them: it's not required to pass the whole
       * object if we only want to modify part of the row.
       *
       *  In these cases where some column names are missing from the `rowData`
       * object keys, the following logic will apply:
       *
       *  - When inserting a new row, the default values will be used.
       *
       *  - When updating an existing row, the current value in that column
       *    will be preserved.
       *
       * @param {string} tableName - Name of the table where the operation
       *  will take place.
       * @param {object} rowData - Object containing the values to insert.
       *  The keys of the object must match existing column names in the
       *  selected table.
       */
      upsert: (tableName, rowData, conflictConstraint) => {
        const columnsWithValue = Object.keys(rowData)
          .filter(key => rowData[key] !== undefined);

        return pgAPI.query(
          buildUpsertQuery(tableName, columnsWithValue, conflictConstraint),
          columnsWithValue.map(key => rowData[key]),
        );
      },

      fetchAnswers: filters => pgAPI.query(`
        select u."name" as "userName", u.user_id as "userId", u.email,
        us.skill_id as "skillId", sc."name" as "skillName", us.skill_value as "skillValue", us.interested, us.comments,
        se.id as "ecosystemId", se."name" as "ecosystemName"
        from skills."user" u
        left join skills.user_skill us on us.user_id = u.user_id
        left join skills.skill_catalog sc on sc.id = us.skill_id
        left join skills.skill_ecosystem se on se.id = sc.ecosystem
        where ${filters.skills ? getFiltersSubquery(filters) : ''}
        lower(u."name") like '%${filters.name || ''}%'
      `),
    };
  };

  const stop = () => handyPg.stop();

  return { start, stop };
};
