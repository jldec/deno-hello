deno --unstable compile --allow-net --lite --target x86_64-pc-windows-msvc --output scan-windows.exe scan.js
deno --unstable compile --allow-net --lite --target x86_64-unknown-linux-gnu --output scan-linux scan.js
deno --unstable compile --allow-net --lite --target x86_64-apple-darwin --output scan-macos scan.js
