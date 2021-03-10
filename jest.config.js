const { defaults } = require('jest-config');
require('./test/env');

module.exports = {
	testEnvironment: 'node',
	moduleFileExtensions: [...defaults.moduleFileExtensions, 'js'],
	testPathIgnorePatterns: ['dist', 'config'],
	collectCoverageFrom: [
		'components/**/*.js',
		'!test/**/*.*',
		'!**/node_modules/**',
		'!**/_templates/**',
		'!*.config.js',
	],
	coverageDirectory: './test-reports/coverage',
	reporters: [
		'default',
		['jest-junit',
			{
				outputDirectory: './test-reports',
			},
		],
	],
};
