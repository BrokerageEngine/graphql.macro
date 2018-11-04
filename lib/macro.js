'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = void 0;

var _path = _interopRequireDefault(require('path'));

var _fs = _interopRequireDefault(require('fs'));

var _babelPluginMacros = require('babel-plugin-macros');

var _graphqlTag = _interopRequireDefault(require('graphql-tag'));

var _babelLiteralToAst = _interopRequireDefault(
  require('babel-literal-to-ast'),
);

var _expandImports = _interopRequireDefault(require('./utils/expandImports'));

var _compileWithFragment = _interopRequireDefault(
  require('./utils/compileWithFragment'),
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

// import printAST from 'ast-pretty-print';
// console.log(printAST(referencePath.parentPath))
const cwd = _fs.default.realpathSync(process.cwd());

const resolvePathFromCwd = relativePath =>
  _path.default.resolve(cwd, process.env.NODE_PATH || '.', relativePath);

function graphqlMacro({
  references,
  state: { file: { opts: { filename } } },
  babel: { types: t },
}) {
  const { gql = [], loader = [] } = references; // Case 1: import { gql } from 'graphql.macro'.

  gql.forEach(referencePath => {
    const compiled = (0, _compileWithFragment.default)(referencePath, t);
    referencePath.parentPath.replaceWith(compiled);
  }); // Case 2: import { loader } from 'graphql.macro'

  loader.forEach(referencePath => {
    referencePath.parentPath.node.arguments.forEach(({ value }) => {
      const queryPath = value.startsWith('./')
        ? _path.default.join(filename, '..', value)
        : resolvePathFromCwd(value);
      const expanded = (0, _expandImports.default)(queryPath); // Note: #import feature

      referencePath.parentPath.replaceWith(
        (0, _babelLiteralToAst.default)((0, _graphqlTag.default)(expanded)),
      );
    });
  });
}

var _default = (0, _babelPluginMacros.createMacro)(graphqlMacro);

exports.default = _default;
module.exports = exports['default'];
