import parse5 from 'https://cdn.skypack.dev/parse5?dts';

const rootUrl = Deno.args[0];
if (!rootUrl) exit(1, 'Please provide a URL');

const rootOrigin = (new URL(rootUrl)).origin;

const urlMap = {}; // tracks visited urls

await checkUrl(rootUrl);
const result = Object.entries(urlMap).filter( kv => kv[1] !== 'OK');

if (result.length) {
  exit(1, result);
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
      if (!res.ok) return urlMap[href] = { status: res.status, in: base }
      urlMap[href] = 'OK';

      // parse response
      console.log('parsing', urlObj.pathname);
      const html = await res.text();
      const document = parse5.parse(html);

      // scan for <a> tags and call checkURL for each href
      const promises = [];
      scan(document, 'a', node => {
        promises.push(checkUrl(attr(node, 'href'), href));
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
  console.log(msg);
  Deno.exit(code);
}
