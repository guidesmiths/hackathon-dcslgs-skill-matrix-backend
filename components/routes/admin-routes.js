const path = require('path');
const express = require('express');
const helmet = require('helmet');
const bodyParser = require('body-parser');
const expressJSDocSwagger = require('express-jsdoc-swagger');
const { init: initializeExpressValidator } = require('express-oas-validator');

module.exports = () => {
  const start = async ({ manifest = {}, app, config }) => {
    const {
      generatedDocs, swaggerOptions,
    } = config;
    app.use(bodyParser.urlencoded({ extended: false }));
    app.use(bodyParser.json());
    app.use(helmet({
      // This is neccesary because of helmet v4
      contentSecurityPolicy: false,
    }));

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
    return Promise.resolve();
  };

  return { start };
};
