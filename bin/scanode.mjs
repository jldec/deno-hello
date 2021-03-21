#!/usr/bin/env node

// scanode.mjs
// Node.js equivalent of Deno scan.js
//
// Crawls a website, validating that all the links on the site which
// point to the same orgin can be fetched.
//
// copyright 2021, Jürgen Leschner (github/jldec) - MIT license

import fetch from 'node-fetch';
import parse5 from 'parse5';
import scanurl from '../scanurl.mjs';

const usage = `scanode v2.0.0

Usage: node scanode URL [-R] [-q]

URL fully qualified URL to the start page
  -R  scan a single file and log the links in it.
  -q  suppress logging to stderr.
`



let rootURL;
try { rootURL = new URL(process.argv[2]); }
catch(err) { exit(1, err.message + '\n\n' + usage); }

const noRecurse = process.argv.includes('-R');
const quiet = process.argv.includes('-q');

const urlMap = await scanurl(rootURL, noRecurse, quiet, parse5, fetch);

const result = Object.values(urlMap)
  .filter( value => value.status !== 'OK');

if (result.length) {
  console.log(JSON.stringify(result, null, 2));
  exit(1, result.length + ' broken link(s) found.');
} else {
  exit(0, '🎉 no broken links found.');
}

function exit(code, msg) {
  console.error(msg);
  process.exit(code);
}
