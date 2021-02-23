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