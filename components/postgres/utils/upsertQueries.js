const uniqueIdUpsertQuery = (tableName, columnNames, updatableProps) => `
  INSERT INTO ${tableName} (${columnNames.join(', ')})
    VALUES (${columnNames.map((_, i) => `$${i + 1}`).join(', ')})
  ON CONFLICT (id) DO UPDATE SET
    ${updatableProps.map(key => `${key} = EXCLUDED.${key}`).join(', \n      ')}
  RETURNING *;
`;

const constraintUpsertQuery = (tableName, columnNames, updatableProps, conflictConstraint) => `
  INSERT INTO ${tableName} (${columnNames.join(', ')})
    VALUES (${columnNames.map((_, i) => `$${i + 1}`).join(', ')})
  ON CONFLICT ON CONSTRAINT ${conflictConstraint} DO UPDATE SET
    ${updatableProps.map(key => `${key} = EXCLUDED.${key}`).join(', \n      ')}
  RETURNING *;
`;

module.exports = { uniqueIdUpsertQuery, constraintUpsertQuery };
