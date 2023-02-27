/* eslint-disable no-undef */

const { formatDiagnosticsWithColorAndContext } = require('typescript');

/** @type {import('ts-jest').JestConfigWithTsJest} */
module.exports = {
  preset: 'ts-jest',
  testEnvironment: 'jsdom',
  verbose: true,
  resetMocks: false
};
