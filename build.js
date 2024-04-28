#!/usr/bin/env node

require("esbuild")
    .build({
        logLevel: "info",
        entryPoints: ["src/input.*.ts"],
        bundle: true,
        outdir: "dist",
        platform: 'esm', // Specify target platform
        minify: false, // Optional: if you want to minify the output
        sourcemap: false, // Optional: if you want to generate sourcemaps
    })
    .catch(() => process.exit(1));