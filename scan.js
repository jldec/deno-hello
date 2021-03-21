// scan.js
// deno script to accompany blogpost at
// https://jldec.me/getting-started-with-deno
//
// Crawls a website, validating that all the links on the site which
// point to the same orgin can be fetched.
//
// copyright 2021, Jürgen Leschner (github/jldec) - MIT license

import parse5 from 'https://cdn.skypack.dev/parse5?dts';
import scanurl from './scanurl.mjs';

const usage = `scan v2.0.1

Usage: deno --allow-net scan.js URL [-R] [-q]

URL fully qualified URL to the start page
  -R  scan a single file and log the links in it.
  -q  suppress logging to stderr.

Compiled usage: scan-<arch> URL [-R] [-q]
`

let rootURL;
try { rootURL = new URL(Deno.args[0]); }
catch(err) { exit(1, err.message + '\n\n' + usage); }

const noRecurse = Deno.args.includes('-R');
const quiet = Deno.args.includes('-q');

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
  Deno.exit(code);
}
