import { existsSync } from "https://deno.land/std@0.210.0/fs/mod.ts";
import $ from "https://deno.land/x/dax@0.36.0/mod.ts";

// ensure we're in the root of the project
$.cd(import.meta);

// check for zig and decide which branch to use
let branch: string;
try {
  const result = await $`zig version`.text();
  branch = result.includes("dev") ? "unstable" : "master";
} catch {
  console.error("Zig not found. Please install Zig.");
  Deno.exit(1);
}

if (!existsSync("./zf")) {
  console.log(`Cloning natecraddock/zf (${branch})...`);
  await $`git clone -q -b ${branch} https://github.com/natecraddock/zf.git`;
}

$.cd("./zf");

console.log(`Updating zf...`);
await $`git checkout -q ${branch}`;
await $`git pull -q`;

const buildTargetMap = {
  "linux": "x86_64-linux",
  "windows": "x86_64-windows",
  "darwin": "x86_64-macos",
};

const targets = Deno.args.length > 0
  ? Deno.args
  : [buildTargetMap[Deno.build.os as keyof typeof buildTargetMap]];

for (const target of targets) {
  console.log(`Building libzf for ${target}...`);
  await $`zig build-lib src/clib.zig -dynamic -target ${target} --name zf`;
}
