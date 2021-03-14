deno --unstable compile --allow-net --lite --target x86_64-unknown-linux-gnu --output scan-linux-x86 scan.js
deno --unstable compile --allow-net --lite --target x86_64-apple-darwin --output scan-macos-x86 scan.js
deno --unstable compile --allow-net --lite --target aarch64-apple-darwin --output scan-macos-arm scan.js
deno --unstable compile --allow-net --lite --target x86_64-pc-windows-msvc --output scan-windows-x86 scan.js
