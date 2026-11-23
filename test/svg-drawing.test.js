'use strict';
const test=require('node:test');
const assert=require('node:assert/strict');
const {validateSvgPaths, pathsToSvg}=require('../svg-drawing');

const drawing=['M 10 10 L 80 90','M 20 30 Q 50 50 80 30','M 35 90 L 65 90'];
test('valid drawing paths create safe SVG',()=>{
  assert.deepEqual(validateSvgPaths({paths:drawing}),drawing);
  const svg=pathsToSvg(drawing);
  assert.match(svg,/<svg /);
  assert.match(svg,/viewBox="0 0 100 100"/);
  assert.match(svg,/<path d="M 10 10 L 80 90"\/>/);
  assert.doesNotMatch(svg,/<script|<image|onload=/);
});
test('rejects executable markup, invalid geometry, and non-strokes',()=>{
  const bad=[
    [],
    ['M 10 10 L 20 20'],
    ['M 10 10 L 20 20','M 20 20 L 30 30" onclick="alert(1)'],
    ['M 10 10 L 999 20','M 20 20 L 30 30'],
    ['M 10 10 C 15 15 20 20','M 20 20 L 30 30'],
    ['M 10 10','M 30 40']
  ];
  for(const value of bad) assert.throws(()=>validateSvgPaths(value));
});
test('accepts curves, closed paths and negative coordinates',()=>{
  const value=['M 10 10 L 40 10 L 40 40 Z','M 60 20 C 70 30 90 40 80 50','M -10 5 Q 50 50 70 80'];
  assert.deepEqual(validateSvgPaths(value),value);
});
