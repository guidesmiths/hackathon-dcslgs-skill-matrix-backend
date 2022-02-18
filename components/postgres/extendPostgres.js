const { spreadQueryArgs } = require('./utils');

const {
  buildUpsertQuery,
  buildDeleteQuery,
  buildSelectQuery,
  buildUpdateQuery,
} = require('./utils/queryBuilder');

module.exports = pgAPI => ({
  ...pgAPI,

  /**
   *  Execute a basic query on the specified table. This method does not
   * support queries with left join or other more complex operations.
   *
   * @param {string} tableName - Name of the table where the operation
   *  will take place.
   * @param {object} [rowFilter] - Filters to apply when determining which
   *  rows will be returned. If omitted, all of the rows will be returned.
   * @param {array} [projection] - List of columns that will be returned for
   *  each row. If omitted, all columns will be returned.
   */
  find: (tableName, rowFilter = {}, projection = []) => pgAPI.query(
    buildSelectQuery(tableName, rowFilter, projection),
    spreadQueryArgs(rowFilter),
  ),

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
   * @param {string} [conflictTarget] - Name of the database column or
   *  constraint that will be used to determine if the row already exists.
   *  If omitted, we'll just check if another with the same id exists.
   * @param {boolean} [isTargetConstraint] - Determines if the value of
   *  'conflictTarget' corresponds to a column name or a database constraint.
   */
  upsert: (tableName, rowData, { conflictTarget, isTargetConstraint } = {}, client = pgAPI) => {
    const columnsWithValue = Object.keys(rowData)
      .filter(key => rowData[key] !== undefined);

    return client.query(
      buildUpsertQuery(tableName, columnsWithValue, conflictTarget, isTargetConstraint),
      columnsWithValue.map(key => rowData[key]),
    );
  },

  /**
   *  Execute a delete operation on the specified table.
   *
   * @param {string} tableName - Name of the table where the operation
   *  will take place.
   * @param {object} [rowFilter] - Filters to apply when determining which
   *  rows will be deleted. If omitted, all of the rows will be removed.
   */
  delete: (tableName, rowFilter = {}, client = pgAPI) => client.query(
    buildDeleteQuery(tableName, rowFilter),
    spreadQueryArgs(rowFilter),
  ),

  /**
   *  Execute a basic query on the specified table. This method does not
   * support queries with left join or other more complex operations.
   *
   * @param {string} tableName - Name of the table where the operation
   *  will take place.
   * @param {object} rowData - Values to update, which will be represented
   *  in an object for which the keys match column names and the values are the
   *  values to be stored on each one.
   * @param {object} [rowFilter] - List of values that will be used to filter
   *  the rows to update. If not specified, changes will be applied to all rows.
   */
  update: (tableName, rowData, rowFilter = {}, client = pgAPI) => {
    const columnsWithValue = Object.keys(rowData)
      .filter(key => rowData[key] !== undefined);

    return client.query(
      buildUpdateQuery(tableName, columnsWithValue, rowFilter),
      [
        ...columnsWithValue.map(key => rowData[key]),
        ...spreadQueryArgs(rowFilter),
      ],
    );
  },
});
