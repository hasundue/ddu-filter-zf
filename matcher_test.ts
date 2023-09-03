import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.201.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.201.0/testing/bdd.ts";
import { Filter } from "./denops/@ddu-filters/matcher_zf.ts";

describe("matcher_zf", () => {
  const matcher = new Filter();

  describe("filter", () => {
    const items = [
      { word: "zf/" },
      { word: "zf/libzf.so" },
      // deno-lint-ignore no-explicit-any
    ] as any;

    it("should match for a single word", () => {
      assertObjectMatch(
        matcher.filter({
          filterParams: { plainText: false, caseSensitive: false },
          input: "zf",
          items,
        }),
        items,
      );
    });

    it("should ignore a trailing whitespace", () => {
      assertObjectMatch(
        matcher.filter({
          filterParams: { plainText: false, caseSensitive: false },
          input: "zf ",
          items,
        }),
        items,
      );
    });

    it("should match for multiple words", () => {
      assertObjectMatch(
        matcher.filter({
          filterParams: { plainText: false, caseSensitive: false },
          input: "so zf",
          items,
        }),
        // deno-lint-ignore no-explicit-any
        [{ word: "zf/libzf.so" }] as any,
      );
    });

    it("should match for words with a separator", () => {
      assertObjectMatch(
        matcher.filter({
          filterParams: { plainText: false, caseSensitive: false },
          input: "f/f",
          items,
        }),
        // deno-lint-ignore no-explicit-any
        [{ word: "zf/libzf.so" }] as any,
      );
    });
  });

  describe("params", () => {
    it("should return default params", () => {
      assertEquals(matcher.params(), {
        plainText: false,
        caseSensitive: false,
      });
    });
  });
});
