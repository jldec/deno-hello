const hello = 'Hello Deno';
console.log(`${hello} %s hello %o`, new Date(), Deno.args);

const buf = new TextEncoder().encode('-🦀-\n');
await Deno.stdout.write(buf);
console.table(buf);