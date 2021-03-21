// scanurl.mjs
// ESM module used by both scanode.mjs and Deno scan.js scripts
//
// Crawls a website, validating that all the links on the site which
// point to the same orgin can be fetched.
//
// copyright 2021, Jürgen Leschner (github/jldec) - MIT license

/**
 * @param {URL} rootURL
 * @param {boolean} noRecurse
 * @param {boolean} quiet
 * @param {function} parse5
 * @param {function} fetch - native or npm package
 * @param {Object} fetchOpts options passed to fetch - optional
 * @returns {Object} map of url -> { url, status, in, [error] }
 */
export default async function scanurl(rootURL, noRecurse, quiet, parse5, fetch, fetchOpts) {
  const rootOrigin = rootURL.origin;

  const urlMap = {}; // tracks visited urls
  let pageCount = 0; // counts scanned pages

  await checkURL(rootURL); // dum dum dum dum ...
  if (!quiet) console.error(pageCount, 'pages scanned.');
  return urlMap;

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
      try { res = await fetch(href, fetchOpts); }
      catch(err) {
        o.error = err.message;
        return;
      }
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
      scanDOM(document, 'a', node => {
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
  function scanDOM(node, tagName, fn) {
    if (node?.tagName === tagName) {
      fn(node);
    }
    if (!node.childNodes) return;
    for (const childNode of node.childNodes) {
      scanDOM(childNode, tagName, fn);
    }
  }
}

