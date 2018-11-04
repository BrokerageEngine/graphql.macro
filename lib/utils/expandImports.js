'use strict';

Object.defineProperty(exports, '__esModule', {
  value: true,
});
exports.default = expandImports;

var _path = _interopRequireDefault(require('path'));

var _fs = _interopRequireDefault(require('fs'));

function _interopRequireDefault(obj) {
  return obj && obj.__esModule ? obj : { default: obj };
}

/**
 * import .graphql file directly
 * ref: https://github.com/apollographql/graphql-tag/blob/master/loader.js
 */
function expandImports(queryPath) {
  const source = _fs.default.readFileSync(queryPath, 'utf8');

  const lines = source.split(/\r\n|\r|\n/);
  const importContent = lines
    .filter(line => line[0] === '#' && line.slice(1).split(' ')[0] === 'import')
    .map(line => {
      const value = line
        .slice(1)
        .split(' ')[1]
        .replace(/('|")/g, '');

      const relativeQueryPath = _path.default.join(queryPath, '..', value);

      const raw = _fs.default.readFileSync(relativeQueryPath, 'utf8');

      return raw;
    })
    .join('');
  return importContent + source;
}

module.exports = exports['default'];
