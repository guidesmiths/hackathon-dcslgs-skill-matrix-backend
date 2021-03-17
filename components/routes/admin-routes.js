const express = require('express');
const helmet = require('helmet');

module.exports = () => {
  const start = async ({ manifest = {}, app }) => {
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(helmet());

    app.get('/__/manifest', (req, res) => res.json(manifest));

    return Promise.resolve();
  };

  return { start };
};
