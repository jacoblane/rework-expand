
// Default values for replacement tokens
var index =     '[i]';  // the array index
var indexPlus = '[j]';  // the array index + 1
var length =    '[l]';  // the array length
var value =     '[v]';  // the value, ie array[i]

module.exports = expand;

function expand(options) {
  options   = options   || {};
  options.v = options.v || value;
  options.i = options.i || index;
  options.j = options.j || indexPlus;
  options.l = options.l || length;

  return function(ast) {
    var newRuleSet;
    var rules = [];

    ast.rules.forEach(function(rule) {
      if (!rule.declarations || rule.selectors[0] !== ':expand') {
        rules.push(rule);
      } else {
        newRuleSet = compileRuleSet(rule.declarations, options);
        rules = rules.concat(newRuleSet);
      }
    });

    ast.rules = rules;
  }
}

function compileRuleSet(decls, options) {
  var selector;
  var expander;
  var newRules;
  var expanders = [];
  var declarations = [];

  decls.forEach(function(decl) {
    if (decl.type !== 'declaration') {
      declarations.push(decl);
    } else if (decl.property === 'expand-selector') {
      selector = parseExpander(decl, options);
    } else if (decl.property.substr(0, 6) === 'expand') {
      expanders.push(parseExpander(decl, options));
    } else {
      declarations.push(decl);
    }
  });

  if (typeof selector == 'undefined' && expanders.length > 0) {
    throw new Error('Expand: missing an expand selector declaration.');
  }
  if (typeof selector != 'undefined' && expanders.length == 0) {
    throw new Error('Expand: missing an expandable property declaration.');
  }
  
  newRules = buildNewRules(selector, expanders, declarations, options);
  return newRules;
}

function buildNewRules(selector, expanders, declarations, options) {
  var rule;
  var values;
  var i = 0;
  var rules = [];
  var l = lengths(selector, expanders);

  if (!l) {
    throw new Error('Expand: no expander values or mismatched lengths.');
  }

  for (i; i < l; i++) {
    rule = {};
    rule.type = 'rule';
    values = {
      i: i
      , j: i + 1
      , l: l
      , v: selector.values[i]
    };

    rule.selectors = [
      interpolate(selector.pattern, values, options)
    ];

    rule.declarations = expanders.map(function(e) {
      values.v = e.values[i];
      return {
        type: "declaration"
        , property: e.property
        , value: interpolate(e.pattern, values, options)
      };
    });

    rule.declarations = rule.declarations.concat(declarations);
    rules.push(rule);
  }

  return rules;
}

// HELPERS

/*
  transforms input like:
    {value: '[v]px, 10, 20, 30'}
  into:
    {pattern: [v]px, values: [10, 20, 30]}

*/
function parseExpander(decl, options) {
  var parsed = {};
  var values = decl.value
    .split(',')
    .map(function(v) { return v.trim(); });

  if (hasTokens(values[0], options)) {
    parsed.pattern = values[0],
    parsed.values = values.splice(1);
  } else {
    parsed.pattern = options.v;
    parsed.values = values;
  }
  if (decl.property !== 'expand-selector') {
    parsed.property = decl.property.substr(7);
  }
  return parsed;
}

function lengths(selectors, expanders) {
  var l;
  var i = 0;
  var lengths = [];

  expanders.forEach(function(e) {
    if (e.values.length > 0) {
      lengths.push(e.values.length);
    }
  });

  if (selectors.values.length > 0) {
    lengths.push(selectors.values.length);
  }

  l = lengths.length;

  for (i; i < l - 1; i++) {
    if (lengths[0] != lengths[i + 1]) {
      return false;
    }
  }

  return lengths[0] || false;
}

function hasTokens(string, options) {
  return string.indexOf(options.i) !== -1
      || string.indexOf(options.j) !== -1
      || string.indexOf(options.l) !== -1
      || string.indexOf(options.v) !== -1;
}
function interpolate(string, data, options) {
  string = replaceAll(string, options.v, data['v']);
  string = replaceAll(string, options.i, data['i']);
  string = replaceAll(string, options.j, data['j']);
  string = replaceAll(string, options.l, data['l']);
  return string;
}

//http://stackoverflow.com/questions/1144783/replacing-all-occurrences-of-a-string-in-javascript
function escapeRegExp(string) {
    return string.replace(/([.*+?^=!:${}()|\[\]\/\\])/g, "\\$1");
}
function replaceAll(string, find, replace) {
  return string.replace(new RegExp(escapeRegExp(find), 'g'), replace);
}
