import parse5 from "https://cdn.skypack.dev/parse5?dts";

const url = Deno.args[0];
const res = await fetch(url);
const html = await res.text();
const document = parse5.parse(html);

scan(document, 'a', node => {
  console.log(attr(node, 'href'));
});

scan(document, 'img', node => {
  console.log(attr(node, 'src'));
});

// return value of attr with name for a node
function attr(node, name) {
  return node.attrs.find( attr => attr.name === name )?.value;
}

// recursive scan
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
