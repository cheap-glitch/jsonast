# jsonast

[![license][license-image]][license-url]
[![npm][npm-image]][npm-url]
[![coveralls][coveralls-image]][coveralls-url]

## Rationale

jsonast is a json to AST parser with some error correction.
Most json parsers do not do error correction or do not allow parsing to AST. jsonast combines both of this.

## Installation

Grab jsonast via [npm](https://www.npmjs.com/package/jsonast):

```shell
npm install @cheap-glitch/jsonast
```

## API documentation

```javascript
import parse from 'jsonast';

// Allows plain valid json
const ast = parse('{}');

// but also invalid json like this ones (note the missing commas)
const ast = parse(`
  {
    "key1": "value"
    "key2": "value"
  }
`);
const ast = parse(`
  [
    "entry1"
    "entry2"
  ]
`);
```

---
jsonast is built by [KnisterPeter](https://github.com/KnisterPeter) and
[contributors](https://github.com/jsonast/jsonast/graphs/contributors) and released under the
[MIT](./LICENSE) license.

[license-image]: https://img.shields.io/github/license/cheap-glitch/jsonast.svg
[license-url]: https://github.com/cheap-glitch/jsonast

[npm-image]: https://img.shields.io/npm/v/@cheap-glitch/jsonast.svg?maxAge=2592000
[npm-url]: https://www.npmjs.com/package/@cheap-glitch/jsonast

[coveralls-image]: https://img.shields.io/coveralls/cheap-glitch/jsonast/master.svg
[coveralls-url]: https://coveralls.io/github/cheap-glitch/jsonast
