import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.182.0/path/mod.ts";

const dir = dirname(fromFileUrl(import.meta.url));

let name = "";

switch (Deno.build.os) {
  case "windows":
    name = "zf.dll";
    break;
  case "darwin":
    name = "libzf.dylib";
    break;
  default:
    name = "libzf.so";
    break;
}

const path = join(dir, "zf", name);

const lib = Deno.dlopen(
  path,
  {
    "rankToken": {
      parameters: ["buffer", "buffer", "buffer", "bool", "bool"],
      result: "f64",
    },
  } as const,
);

const encoder = new TextEncoder();

function strToBuf(str: string): Uint8Array {
  return new Uint8Array([...encoder.encode(str), 0]);
}

export function rankToken(
  str: string,
  filename: string | null,
  token: string,
  caseSensitive: boolean,
  strictPath: boolean,
): number {
  return lib.symbols.rankToken(
    strToBuf(str),
    filename ? strToBuf(filename) : null,
    strToBuf(token),
    caseSensitive,
    strictPath,
  );
}
