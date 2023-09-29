import {
  dirname,
  fromFileUrl,
  join,
} from "https://deno.land/std@0.203.0/path/mod.ts";

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

// ref: zig/src/clib.zig
const { symbols: libzf } = Deno.dlopen(
  path,
  {
    "rankToken": {
      parameters: [
        "buffer", // str
        "buffer", // filename
        "buffer", // token
        "bool", // case_sensitive
        "bool", // strict_path
      ],
      result: "f64",
    },
    "highlightToken": {
      parameters: [
        "buffer", // str
        "buffer", // filename
        "buffer", // token
        "bool", // case_sensitive
        "bool", // strict_path
        "buffer", // matches
        "usize", // matches_len
      ],
      result: "usize",
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
  return libzf.rankToken(
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
  const matched_buf = new BigInt64Array(token.length);
  const matched_len = libzf.highlightToken(
    strToBuf(str),
    filename ? strToBuf(filename) : null,
    strToBuf(token),
    caseSensitive,
    strictPath,
    matched_buf,
    matched_buf.length,
  );
  const matched = matched_buf.slice(0, Number(matched_len));
  return Array.from(matched).map((i) => Number(i));
}
