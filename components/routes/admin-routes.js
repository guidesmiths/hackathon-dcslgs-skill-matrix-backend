const path = require('path');
const express = require('express');
const helmet = require('helmet');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const { init: initializeExpressValidator } = require('express-oas-validator');
const { validateToken } = require('../verification/token-verification');

module.exports = () => {
  const start = async ({ manifest = {}, app, config }) => {
    const {
      generatedDocs, swaggerOptions, publicKey, userTest,
    } = config;
    app.use(express.urlencoded());
    app.use(express.json());
    app.use(helmet());

    app.get('/__/manifest', (req, res) => res.json(manifest));

    expressJSDocSwagger(app)(swaggerOptions)
      .on('finish', data => initializeExpressValidator(data));
    app.use(helmet({ contentSecurityPolicy: false }));

    // Add middleware to serve generated documentation
    generatedDocs.forEach(documentation => {
      app.use(
        documentation.path,
        express.static(
          path.resolve(process.cwd(), 'docs', 'generated', documentation.srcFolder),
        ),
      );
    });
    app.use(validateToken(publicKey, userTest));
    return Promise.resolve();
  };

  return { start };
};
