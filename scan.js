// scan.js
// deno script to accompany blogpost at
// https://jldec.me/getting-started-with-deno
//
// Crawls a website, validating that all the links on the site which
// point to the same orgin can be fetched.
//
// copyright 2021, Jürgen Leschner (github/jldec) - MIT license

import parse5 from 'https://cdn.skypack.dev/parse5?dts';

const usage = `scan v1.0.0
Usage: deno --allow-net scan.js URL [-R] [-q]
  URL fully qualified URL to the start page
  -R  scan a single file and log the links in it.
  -q  suppress logging to stderr.
Compiled usage: scan-arch URL [-R] [-q]
`

const rootUrl = Deno.args[0];
if (!rootUrl) exit(1, usage);

const recurse = !Deno.args.includes('-R');
const quiet = Deno.args.includes('-q');

const rootOrigin = (new URL(rootUrl)).origin;

const urlMap = {}; // tracks visited urls

await checkUrl(rootUrl); // dum dum dum dum ...
console.error(Object.keys(urlMap).length, 'pages scanned.');

const result = Object.entries(urlMap)
  .filter( kv => kv[1] !== 'OK')
  .map( kv => {
    const o = kv[1];
    o.url = kv[0];
    return o;
  });

if (result.length) {
  console.log(JSON.stringify(result, null, 2));
  exit(1, result.length + ' broken link(s) found.');
} else {
  exit(0, '🎉 no broken links found.');
}

// recursively checks url and same-origin urls inside
// resolves when done
async function checkUrl(url, base) {
  base = base || url;
  try {
    // parse the url relative to base
    const urlObj = new URL(url, base);

    // ignore query params and hash
    const href = urlObj.origin + urlObj.pathname;

    // only process same-origin urls
    if (!urlMap[href] && urlObj.origin === rootOrigin) {

      // fetch from href
      urlMap[href] = 'pending';
      const res = await fetch(href);

      // bail out if fetch was not ok
      if (!res.ok) {
        urlMap[href] = { status: res.status, in: base };
        return;
      }

      urlMap[href] = 'OK';

      // check content type
      if (!res.headers.get('content-type').match(/text\/html/i)) return;

      // parse response
      if (!quiet) console.error('parsing', urlObj.pathname);
      const html = await res.text();
      const document = parse5.parse(html);

      // scan for <a> tags and call checkURL for each, with base = href
      const promises = [];
      scan(document, 'a', node => {
        const link = attr(node, 'href');
        if (!recurse && !quiet) {
          console.error('link', link);
        }
        if (recurse && link) {
          promises.push(checkUrl(link, href));
        }
      });
      await Promise.all(promises);
    }
  }
  catch(err) {
    urlMap[url] =  { error: err.message, in: base };
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
