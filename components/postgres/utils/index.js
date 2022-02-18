// Return all of the values included in a filter in an array
// (to pass it down to the `pg.query` method)
const spreadQueryArgs = (rowFilter = {}) => {
  let values = [];
  Object.keys(rowFilter).forEach(key => {
    const currentValue = rowFilter[key];
    if (Array.isArray(currentValue)) {
      values = values.concat(currentValue);
    } else {
      values.push(currentValue);
    }
  });

  return values;
};

module.exports = {
  spreadQueryArgs,
};
