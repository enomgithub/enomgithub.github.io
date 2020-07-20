const path = require("path");
const rollup = require("rollup");
const typescript = require("@rollup/plugin-typescript");
const glob = require("glob");

const srcDir = "./src";
const distFile = "./dist/main.js";

const entries = glob.sync("**/*.ts", {cwd: srcDir});
for (const entry of entries) {
    const inputOptions = {
        input: path.resolve(srcDir, entry),
        plugins: [typescript()]
    };
    const outputOptions = {
        format: "iife",
        file: distFile
    };
    build(inputOptions, outputOptions);
}

async function build(inputOptions, outputOptions) {
    const bundle = await rollup.rollup(inputOptions);
    await bundle.write(outputOptions);
}