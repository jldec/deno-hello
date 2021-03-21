---- / ----
name: README
template: custom

## Deno script hosting

Scripts for [github.com/jldec/deno-hello](https://github.com/jldec/deno-hello/) hosted on [Cloudflare Pages](https://pages.cloudflare.com).

For details see [jldec.me/getting-started-with-deno](https://jldec.me/getting-started-with-deno) and [jldec.me/first-steps-using-cloudflare-pages](https://jldec.me/first-steps-using-cloudflare-pages).

## Scripts

- [hello.js](hello.js) - Hello world.
- [scan.js](scan.js) - Deno crawler to check internal links.
- [bin/scanode.mjs](scanode.mjs) - Node.js crawler - requires `npm install -g scanode`.
- [scanurl.mjs](scanurl.mjs) - ESM module used by scan.js and scanode.mjs and in browser example below.

## Example
Enter a URL below - browser will fetch pages from site and scan recursively. _CORS header required._

---- #form ----

[URL ??]() [Go ?submit?]() 
