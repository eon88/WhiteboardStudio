'use strict';

// AI returns path data, not executable SVG markup. Only a tiny subset of SVG
// path commands is accepted. Markup, scripts and attributes are never trusted.
const MAX_PATHS = 16;
const MAX_PATH_LENGTH = 1000;
const PARAMS = {M: 2, L: 2, H: 1, V: 1, C: 6, Q: 4, Z: 0};
const TOKEN_RE = /[MLHVCQZmlhvcqz]|[-+]?(?:\d+(?:\.\d*)?|\.\d+)/g;

function validateSvgPaths(raw) {
  const paths = Array.isArray(raw) ? raw : raw && raw.paths;
  if (!Array.isArray(paths) || paths.length < 2 || paths.length > MAX_PATHS) {
    throw new Error('Expected 2–16 SVG drawing paths.');
  }
  return paths.map((value, index) => {
    if (typeof value !== 'string' || value.length < 4 || value.length > MAX_PATH_LENGTH) {
      throw new Error('Invalid path '+(index+1)+': size');
    }
    const d = value.trim();
    const tokens = d.match(TOKEN_RE) || [];
    const leftover = d.replace(TOKEN_RE, '').replace(/[\s,]+/g, '');
    if (leftover || !tokens.length || !/^[Mm]$/.test(tokens[0])) {
      throw new Error('Invalid path '+(index+1)+': syntax');
    }
    let i = 0;
    let drawn = false;
    while (i < tokens.length) {
      const command = tokens[i++];
      const arity = PARAMS[command.toUpperCase()];
      if (arity === undefined) throw new Error('Invalid path '+(index+1)+': command');
      let count = 0;
      while (i < tokens.length && !/^[a-z]$/i.test(tokens[i])) {
        const value = Number(tokens[i++]);
        if (!Number.isFinite(value) || Math.abs(value) > 150) {
          throw new Error('Invalid path '+(index+1)+': coordinate out of bounds');
        }
        count++;
      }
      if (arity === 0 ? count !== 0 : count === 0 || count % arity !== 0) {
        throw new Error('Invalid path '+(index+1)+': command parameters');
      }
      if (command.toUpperCase() !== 'M' && command.toUpperCase() !== 'Z') drawn = true;
    }
    if (!drawn) throw new Error('Invalid path '+(index+1)+': no visible stroke');
    return d;
  });
}

function pathsToSvg(paths) {
  const clean = validateSvgPaths(paths);
  return '<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 100 100" fill="none" stroke="#222" stroke-width="2.8" stroke-linecap="round" stroke-linejoin="round">' +
    clean.map(d => '<path d="'+d+'"/>').join('') + '</svg>';
}

module.exports = {validateSvgPaths, pathsToSvg};
