import { existsSync } from "https://deno.land/std@0.185.0/fs/mod.ts";
import $ from "https://deno.land/x/dax@0.31.0/mod.ts";

// ensure we're in the root of the project
$.cd(import.meta);

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

console.log(`Building libzf...`);
await $`zig build-lib src/clib.zig -dynamic --name zf`;
