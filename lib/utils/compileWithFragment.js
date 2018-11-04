'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = compileWithFragment;

var _graphqlTag = _interopRequireDefault(require('graphql-tag'));

var _babelLiteralToAst = _interopRequireDefault(
  require('babel-literal-to-ast'),
);

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * ref: https://github.com/leoasis/graphql-tag.macro
 */
function compileWithFragment(referencePath, t) {
  const source = referencePath.parentPath.node.quasi.quasis
    .map(node => node.value.raw)
    .join('');
  const compiled = (0, _babelLiteralToAst.default)(
    (0, _graphqlTag.default)(source),
  );
  const expressions = referencePath.parentPath.get('quasi').get('expressions');

  if (expressions && expressions.length) {
    const definitionsProperty = compiled.properties.find(
      p => p.key.value === 'definitions',
    );
    const definitionsArray = definitionsProperty.value;
    const concatDefinitions = expressions.map(expression =>
      t.memberExpression(expression.node, t.identifier('definitions')),
    );
    definitionsProperty.value = t.callExpression(
      t.memberExpression(definitionsArray, t.identifier('concat')),
      concatDefinitions,
    );
  }

  return compiled;
}

module.exports = exports['default'];
