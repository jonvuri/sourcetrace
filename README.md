# sourcetrace

Generate a "stacktrace" into JavaScript source code, finding the lines that start blocks and statements containing a given source pattern.

Returns an array of arrays of line numbers.

### Usage

Source file:
```
1: function tau() {
2:     return 6.283
3: }
4:
5: function color() {
6:     return "orange"
7: }
```

```js
var sourcetrace = require( 'sourcetrace' )

sourcetrace( '"orange"', source ) => [ [ 5, 6 ] ]
```
