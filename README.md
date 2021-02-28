# deno-hello

### Install deno

I configured my environment, and copied the latest binary from [GitHub](https://github.com/denoland/deno/releases/latest) to `~/deno/bin`.

```sh
export DENO_DIR=~/deno
export PATH=${PATH}:${DENO_DIR}/bin
```

See the [Manual](https://deno.land/manual/getting_started/installation) for additional options.

### Run hello.js

```
$ deno run hello.js world

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

To run the script, call `deno run --allow-net scan.js URL`. E.g.

```txt
$ deno run --allow-net scan.js https://jldec.me
parsing https://jldec.me/
parsing https://jldec.me/a-web-for-everyone
parsing https://jldec.me/forays-from-node-to-rust
parsing https://jldec.me/why-serverless-at-the-edge
parsing https://jldec.me/fun-with-vercel
parsing https://jldec.me/spring-boot-101
parsing https://jldec.me/why-the-web-needs-better-html-editing-components
parsing https://jldec.me/first-steps-using-cloudflare-pages
parsing https://jldec.me/calling-rust-from-a-cloudflare-worker
parsing https://jldec.me/about
parsing https://jldec.me/github-actions-101
parsing https://jldec.me/migrating-from-cjs-to-esm
🎉 no broken links found.
```
