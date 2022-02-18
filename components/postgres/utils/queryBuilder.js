/**
 *  This method builds a SQL statement to insert a new row in database and,
 * if a row with the same id already existed, then it updates its data instead.
 *
 * @param {string} tableName - Name of the table in database.
 * @param {object} columnNames - List of names for the columns that will be
 *  involved in the insert / update operation.
 * @param {string} [conflictTarget] - Name of the column or constraint that
 *  will be used to identify if the row already exists.
 * @param {boolean} [isTargetConstraint] - Indicates if the conflict target
 *  represents the name of a column or a database constraint. It will be
 *  assumed that 'conflictTarget' is a column name by default.
 */
const buildUpsertQuery = (tableName, columnNames, conflictTarget = 'id', isTargetConstraint = false) => {
  const updatableProps = columnNames
    .filter(key => key !== 'id' && key !== conflictTarget);
  if (updatableProps.length === 0) {
    throw Error('Cannot build an upsert operation without fields to update!');
  }

  // Conflict args will vary depending on if the specified target is a constraint or column
  const conflictArgs = !isTargetConstraint
    ? `(${conflictTarget})`
    : `ON CONSTRAINT ${conflictTarget}`;

  return `
    INSERT INTO ${tableName} (${columnNames.join(', ')})
      VALUES (${columnNames.map((_, i) => `$${i + 1}`).join(', ')})
    ON CONFLICT ${conflictArgs} DO UPDATE SET
      ${updatableProps.map(key => `${key} = EXCLUDED.${key}`).join(', \n      ')}
    RETURNING *;
  `;
};

/**
 *  This method builds a string with a list of parametrized arguments that can
 * be passed down to the `WHERE` clause of an SQL statement.
 *
 *  This can only be used for basic filters in the `WHERE` clause: if
 * using subqueries or other more complex operations were needed, you
 * must build the query yourself.
 *
 * @param {object} filters - List of values that will be used to filter
 *  rows in a given query. The object keys will represent column names,
 *  whereas the value will be the value(s) we want our rows to match.
 *  It's possible for these values to be either a single raw value or an array.
 */
const buildWhereClauseArgs = (filters = {}, offset = 1) => {
  let argIndex = offset;
  return Object.keys(filters)
    .filter(Boolean)
    .map(columnName => {
      const columnValue = filters[columnName];

      let output;
      if (!Array.isArray(columnValue)) {
        output = `${columnName} = $${argIndex}`;
        argIndex += 1;
      } else {
        const indexList = Array.from(Array(columnValue.length).keys()).map(i => `$${argIndex + i}`);
        output = `${columnName} IN (${indexList.join(', ')})`;
        argIndex += columnValue.length;
      }

      return output;
    })
    .join(' AND ');
};

/**
 *  This method builds a SQL statement to delete one or more rows into
 * database, allowing us to filter the rows to remove by defining a set
 * of (columnName, value) pairs.
 *
 * @param {string} tableName - Name of the table in database.
 * @param {object} filters - List of values that will be used to filter
 *  the rows to remove.
 */
const buildDeleteQuery = (tableName, filters = {}) => {
  const whereArgs = buildWhereClauseArgs(filters);

  return `
    DELETE FROM ${tableName}
    ${whereArgs && `WHERE ${whereArgs}`};
  `;
};

/**
 *  This method builds a SQL statement to select one or more rows into
 * database, allowing us to filter the rows to return by defining a set
 * of (columnName, value) pairs.
 *
 * @param {string} tableName - Name of the table in database.
 * @param {object} [filters] - List of values that will be used to filter
 *  the rows to remove.
 * @param {array} [projection] - List of columns that will be returned.
 */
const buildSelectQuery = (tableName, filters = {}, projection = []) => {
  const whereArgs = buildWhereClauseArgs(filters);
  const projectionArgs = (Array.isArray(projection) && projection.length > 0)
    ? projection.join(', ') : null;

  return `
    SELECT ${projectionArgs || '*'}
    FROM ${tableName}
    ${whereArgs && `WHERE ${whereArgs}`};
  `;
};

/**
 *  This method builds a SQL statement to update an existing row in database.
 *
 * @param {string} tableName - Name of the table in database.
 * @param {object} columnNames - List of names for the columns that will be
 *  involved in the update operation.
 * @param {object} [filters] - List of values that will be used to filter
 *  the rows to remove.
 */
const buildUpdateQuery = (tableName, columnNames, filters = {}) => {
  const whereArgs = buildWhereClauseArgs(filters, columnNames.length + 1);

  if (columnNames.length === 0) {
    throw Error('Cannot build an update operation without fields to update!');
  }

  return `
    UPDATE ${tableName}
      SET ${columnNames.map((key, argIndex) => `${key} = $${argIndex + 1}`).join(', \n      ')}
    ${whereArgs && `WHERE ${whereArgs}`}
    RETURNING *;
  `;
};

module.exports = {
  buildUpsertQuery,
  buildDeleteQuery,
  buildSelectQuery,
  buildUpdateQuery,
};
