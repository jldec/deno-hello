
import fetch from 'node-fetch';
import parse5 from 'parse5';
import scanode from 'scanode';

const result = await scanode(
  new URL('https://jldec.me'),
  false, // noRecurse
  false, // quiet
  parse5,
  fetch
);

console.log(Object.values(result));
