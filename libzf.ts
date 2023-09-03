import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.201.0/path/mod.ts";

function filename(): string {
  switch (Deno.build.os) {
    case "windows":
      return "zf.dll";
    case "darwin":
      return "libzf.dylib";
    default:
      return "libzf.so";
  }
}

const path = join(dirname(fromFileUrl(import.meta.url)), "zf", filename());

const lib = Deno.dlopen(
  path,
  {
    "rankToken": {
      parameters: ["buffer", "buffer", "buffer", "bool", "bool"],
      result: "f64",
    },
    "highlightToken": {
      parameters: ["buffer", "buffer", "buffer", "bool", "bool"],
      result: "pointer",
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

export function highlightToken(
  str: string,
  filename: string | null,
  token: string,
  caseSensitive: boolean,
  strictPath: boolean,
): number[] {
  const pointer = lib.symbols.highlightToken(
    strToBuf(str),
    filename ? strToBuf(filename) : null,
    strToBuf(token),
    caseSensitive,
    strictPath,
  );
  console.debug(pointer);
  if (!pointer) {
    return [];
  }
  const view = new Deno.UnsafePointerView(pointer);
  const int = view.getUint8(0);
  return [int];
}
