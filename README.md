rework-expand
=============

A [Rework](https://github.com/reworkcss/rework) plugin.

### Basics

Input css

```css
:expand {
  expand-selector: .w25, .w50, .w75, .w100;
  expand-width: 25%, 50%, 75%, 100%
}
```

Call plugin

```js
var rework       = require('rework');
var reworkExpand = require('rework-expand');

var newCss = rework('some css here')
  .use(reworkExpand());
```

Makes

```css
.w25 {
  width: 25%;
}
.w50 {
  width: 50%;
}
.w75 {
  width: 75%;
}
.w100 {
  width: 100%;
}
```

### With rework-vars
```js
var rework       = require('rework');
var reworkVars   = require('rework-var');
var reworkExpand = require('rework-expand');

var newCss = rework('some css here')
  .use(reworkVars())
  .use(reworkExpand());
```

This
```css
:root {
  --colors: #001f3f, #001f3f, #7FDBFF;
  --color-names: .navy, .blue, .aqua;
}
:expand {
  expand-selector: var(--color-names);
  expand-background-color: var(--colors);
  color: #fff;
}
```
Makes
```css
.navy {
  background-color: #001f3f;
  color: #fff;
}
.blue {
  background-color: #001f3f;
  color: #fff;
}
.aqua {
  background-color: #7FDBFF;
  color: #fff;
}
```

### Using token replacement

The following tokens are available by default:

* `[i]` for the array index
* `[j]` for the array index + 1
* `[l]` for the array length
* `[v]` for the value, ie array[i]

Tokens are used before the comma separated list of values (array), and should be followed by a comma.

```css
:root {
  --widths: 25, 50, 75, 100;
}
:expand {
  expand-selector: .width--[v], var(--widths);
  expand-width:  [v]%, var(--widths);
}
:expand {
  expand-selector: .width--[j]of[l], var(--widths);
  expand-width:  [v]%, var(--widths);
}
:expand {
  expand-selector: .width--[i];
  expand-width:  [v]px, var(--widths);
}
```

Makes

```css
.width--25 {
  width: 25%;
}
.width--50 {
  width: 50%;
}
.width--75 {
  width: 75%;
}
.width--100 {
  width: 100%;
}

.width--1of4 {
  width: 25%;
}
.width--2of4 {
  width: 50%;
}
.width--3of4 {
  width: 75%;
}
.width--4of4 {
  width: 100%;
}

.width--0 {
  width: 25px;
}
.width--1 {
  width: 50px;
}
.width--2 {
  width: 75px;
}
.width--3 {
  width: 100px;
}
```

Different replacements for the same four tokens can be passed in using an `options` argument.

```js
var options = {
  i: '<index>',
  j: '<index1>',
  l: '<length>',
  v: '<value>'
}

var newCss = rework('some css here')
  .use(reworkExpand(options));
```


### License

MIT
