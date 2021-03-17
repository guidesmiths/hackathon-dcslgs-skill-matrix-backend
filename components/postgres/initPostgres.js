const initHandyPg = require('handy-postgres');

const { buildUpsertQuery } = require('./utils/queryBuilder');

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
    };
  };

  const stop = () => handyPg.stop();

  return { start, stop };
};
