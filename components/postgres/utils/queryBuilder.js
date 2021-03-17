/**
 *  This method builds a SQL statement to insert a new row in database and,
 * if a row with the same conflictConstraint already existed, then it updates its data instead.
 *
 * @param {string} tableName - Name of the table in database.
 * @param {object} columnNames - List of names for the columns that will be
 * @param {object} conflictConstraint - Name of the constraint created in case the conflict is not on the row id
 *  involved in the insert / update operation.
 */

const { uniqueIdUpsertQuery, constraintUpsertQuery } = require('./upsertQueries');

const buildUpsertQuery = (tableName, columnNames, conflictConstraint) => {
  const updatableProps = columnNames.filter(key => key !== 'id');

  if (updatableProps.length === 0) {
    throw Error('Cannot build an upsert operation without fields to update!');
  }
  if (!conflictConstraint) {
    return uniqueIdUpsertQuery(tableName, columnNames, updatableProps);
  }
  return constraintUpsertQuery(tableName, columnNames, updatableProps, conflictConstraint);
};

module.exports = {
  buildUpsertQuery,
};
