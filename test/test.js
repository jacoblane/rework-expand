// Needs work

var rework = require('rework');
var vars   = require('rework-vars');
var fs     = require('fs');
var assert = require('assert');
var expand = require('..');

var aBasic = fs.readFileSync('test/fixtures/basic.css', 'utf8');
var aVars  = fs.readFileSync('test/fixtures/vars.css', 'utf8');
var aToken = fs.readFileSync('test/fixtures/tokens.css', 'utf8');

var eBasic = fs.readFileSync('test/expected/basic.css', 'utf8');

describe('rework-expand', function() {
  it('should expand', function(){
    var actual   = rework(aBasic).use(expand()).toString();
    var expected = rework(eBasic).toString();
    assert.equal(actual, expected, '...')
  });
  it('should expand with rework-vars', function(){
    var actual   = rework(aVars).use(vars()).use(expand()).toString().trim();
    var expected = rework(eBasic).toString();
    assert.equal(actual, expected, '...')
  });
  it('should expand with user defined tokens', function(){
    var actual   = rework(aToken)
      .use(expand({
        i: '<index>',
        j: '<index1>',
        l: '<length>',
        v: '<value>'
      }))
      .toString();
    var expected = rework(eBasic).toString();
    assert.equal(actual, expected, '...')
  });
});
