import {
  dirname,
  fromFileUrl,
} from "https://deno.land/std@0.223.0/path/mod.ts";
import { existsSync } from "https://deno.land/std@0.223.0/fs/mod.ts";
import { Octokit } from "npm:@octokit/rest@20.1.0";

const dir = dirname(fromFileUrl(import.meta.url));

let filename = "";

switch (Deno.build.os) {
  case "windows":
    filename = "zf.dll";
    break;
  case "darwin":
    filename = "libzf.dylib";
    break;
  default:
    filename = "libzf.so";
    break;
}

const github = new Octokit().rest.repos;

const release = await github.getLatestRelease({
  owner: "hasundue",
  repo: "ddu-filter-zf",
});

const asset = release.data.assets.find((asset) => asset.name === filename);

if (!asset) {
  console.error(`Failed to find ${filename} in release.`);
  Deno.exit(1);
}

console.log(`Downloading ${asset.browser_download_url}...`);
const data = await fetch(asset.browser_download_url).then((res) =>
  res.arrayBuffer()
);

if (!existsSync(`${dir}/zf`)) {
  Deno.mkdirSync(`${dir}/zf`);
}

Deno.writeFileSync(`${dir}/zf/${filename}`, new Uint8Array(data), {
  mode: 0o755,
});

console.log(`Downloaded ${filename} successfully.`);
