// pub-config for the deno-hello script hosting site at jldec.de
// uses pub-theme-doc

var opts = module.exports = {

  appUrl: 'https://deno-hello.jldec.me',
  docTitle: 'deno-hello.jldec.me',
  github: 'https://github.com/jldec/deno-hello',
  copyright: 'Copyright (c) 2021 Jürgen Leschner - github.com/jldec - MIT license',
  noRobots: true, // not ok to crawl

  pkgs: [
    'pub-theme-doc',
    'pub-pkg-seo'
  ],

  sources: [
  { path: './markdown',
    writable: true }
  ],

  outputs: [
  { path: './out',
    relPaths: true }
  ],

  staticPaths: [
    { path:'.', depth:1, glob:'**/*.{js,ts}'},
  ],

};
