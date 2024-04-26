#!/usr/bin/env node

require("esbuild")
    .build({
        logLevel: "info",
        entryPoints: ["src/oracle-lite.ts"],
        bundle: true,
        outfile: "dist/oracle-lite.js",
        platform: 'browser', // Specify target platform
        target: ['es2020', 'chrome58', 'firefox57', 'safari11'], // Specify ECMAScript target and browsers
        sourcemap: true, // Optional: if you want source maps
        minify: false, // Optional: if you want to minify the output
    })
    .catch(() => process.exit(1));