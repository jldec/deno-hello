// scan.js
// deno script to accompany blogpost at
// https://jldec.me/getting-started-with-deno
//
// Crawls a website, validating that all the links on the site which
// point to the same orgin can be fetched.
//
// copyright 2021, Jürgen Leschner (github/jldec) - MIT license

import parse5 from 'https://cdn.skypack.dev/parse5?dts';

const usage = `scan v1.0.2

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

const rootOrigin = rootURL.origin;

const client = new Deno.createHttpClient({});

const urlMap = {}; // tracks visited urls
let pageCount = 0; // counts scanned pages
let waitCount = 0; // fetch queue depth
let maxWaitCount = 0;

await checkURL(rootURL); // dum dum dum dum ...
console.error(pageCount, 'pages scanned. Max wait:', maxWaitCount, waitCount);

const result = Object.values(urlMap)
  .filter( value => value.status !== 'OK');

if (result.length) {
  console.log(JSON.stringify(result, null, 2));
  exit(1, result.length + ' broken link(s) found.');
} else {
  exit(0, '🎉 no broken links found.');
}

// recursively checks url and same-origin urls inside
// resolves when done
async function checkURL(urlObj, base) {
  const origin = urlObj.origin;
  const path = urlObj.pathname;

  // ignore query params and hash
  const href = origin + path;

  // don't process the same href more than once
  if (!urlMap[href]) {
    const o = urlMap[href] = { url:href, status:'pending', in:base };

    // try to make the HTTP request
    let res;
    waitCount++;
    if (maxWaitCount < waitCount) { maxWaitCount = waitCount; }
    try { res = await fetch(href, { client }); }
    catch(err) {
      waitCount--;
      o.error = err.message;
      return;
    }
    waitCount--;
    // bail out if fetch was not ok
    if (!res.ok) {
      o.status = res.status;
      return;
    }
    o.status = 'OK';

    // check content type
    if (!res.headers.get('content-type').match(/text\/html/i)) {
      if (!quiet) console.error('not parsing', urlObj.pathname, 'in', base);
      return;
    }

    // parse response
    pageCount++;
    if (!quiet) console.error('parsing', urlObj.pathname);
    const html = await res.text();
    const document = parse5.parse(html);

    // scan for <a> tags and call checkURL for each link in same origin
    const promises = [];
    scan(document, 'a', node => {
      const link = attr(node, 'href');
      if (!link) return;

      if (!noRecurse) {
        let linkObj;
        try { linkObj = new URL(link, href); }
        catch (err) {
          urlMap[link] = { url:link, status:'bad link', in:href, error:err.message };
          return;
        }
        if (linkObj.origin === rootOrigin) {
          promises.push(checkURL(linkObj, href));
        }
      }
      else if(!quiet) console.error('link', link);
    });
    await Promise.all(promises);
  }
}

// return value of attr with name for a node
function attr(node, name) {
  return node.attrs.find( attr => attr.name === name )?.value;
}

// recursive DOM scan
// calls fn(node) on nodes matching tagName
function scan(node, tagName, fn) {
  if (node?.tagName === tagName) {
    fn(node);
  }
  if (!node.childNodes) return;
  for (const childNode of node.childNodes) {
    scan(childNode, tagName, fn);
  }
}

function exit(code, msg) {
  console.error(msg);
  Deno.exit(code);
}
