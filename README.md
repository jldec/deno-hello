# deno-hello

Companion repo for the blog post https://jldec.me/getting-started-with-deno

The scripts below are hosted by [Cloudflare Pages](https://jldec.me/first-steps-using-cloudflare-pages) at https://deno-hello.jldec.me

### Install deno

I configured my environment, and copied the latest binary from [GitHub](https://github.com/denoland/deno/releases/latest) to `~/deno/bin`.

```sh
export DENO_DIR=~/deno
export PATH=${PATH}:${DENO_DIR}/bin
```

See the [Manual](https://deno.land/manual/getting_started/installation) for additional options.

### hello.js

```
$ deno run https://deno-hello.jldec.me/hello.js world

Hello Deno Tue Feb 23 2021 09:55:54 GMT+0000 (GMT) hello [ "world" ]
-🦀-
┌───────┬────────┐
│ (idx) │ Values │
├───────┼────────┤
│   0   │   45   │
│   1   │  240   │
│   2   │  159   │
│   3   │  166   │
│   4   │  128   │
│   5   │   45   │
│   6   │   10   │
└───────┴────────┘
```

### scan.js

Crawls a website, validating that all the links on the site which point to the same orgin can be fetched.

Outputs JSON with broken links to stdout, logs to stderr. Exits with 1 if any broken links are found.

Options (passed after the URL):

- `-R`: scan single file and list the links in it.
- `-q`: suppress logging the list of parsed files or links to stderr.

To run the script, call `deno run --allow-net scan.js URL`. E.g.

```txt
$ deno run --allow-net https://deno-hello.jldec.me/scan.js https://jldec.me
parsing /
parsing /getting-started-with-deno
parsing /fun-with-vercel
parsing /spring-boot-101
parsing /forays-from-node-to-rust
parsing /why-the-web-needs-better-html-editing-components
parsing /about
parsing /first-steps-using-cloudflare-pages
parsing /why-serverless-at-the-edge
parsing /a-web-for-everyone
parsing /github-actions-101
parsing /calling-rust-from-a-cloudflare-worker
parsing /migrating-from-cjs-to-esm
13 pages scanned.
🎉 no broken links found.
```
