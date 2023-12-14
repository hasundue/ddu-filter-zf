import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.209.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.209.0/testing/bdd.ts";
import { Filter } from "../denops/@ddu-filters/matcher_zf.ts";

describe("matcher_zf", () => {
  const matcher = new Filter();

  describe("filter", () => {
    const items = [
      { word: "zf/" },
      { word: "zf/libzf.so" },
      // deno-lint-ignore no-explicit-any
    ] as any;

    const filterParams = { highlightMatched: "" };

    it("should match for a single word", () => {
      assertObjectMatch(
        matcher.filter({ filterParams, input: "zf", items }),
        items,
      );
    });

    it("should be case sensitive when input contains uppercase", () => {
      assertObjectMatch(
        matcher.filter({ filterParams, input: "ZF", items }),
        // deno-lint-ignore no-explicit-any
        [] as any,
      );
    });

    it("should ignore a trailing whitespace", () => {
      assertObjectMatch(
        matcher.filter({ filterParams, input: "zf ", items }),
        items,
      );
    });

    it("should match for multiple words", () => {
      assertObjectMatch(
        matcher.filter({ filterParams, input: "so zf", items }),
        // deno-lint-ignore no-explicit-any
        [{ word: "zf/libzf.so" }] as any,
      );
    });

    it("should match for words with a separator", () => {
      assertObjectMatch(
        matcher.filter({ filterParams, input: "f/f", items }),
        // deno-lint-ignore no-explicit-any
        [{ word: "zf/libzf.so" }] as any,
      );
    });

    it("should match for matcherKey", () => {
      const items = [
        { word: "zf/", matcherKey: "dir" },
        { word: "zf/libzf.so", matcherKey: "file" },
        // deno-lint-ignore no-explicit-any
      ] as any;

      assertObjectMatch(
        matcher.filter({ filterParams, input: "dir", items }),
        // deno-lint-ignore no-explicit-any
        [{ word: "zf/" }] as any,
      );
    });
  });

  describe("params", () => {
    it("should return default params", () => {
      assertEquals(matcher.params(), {
        highlightMatched: "",
      });
    });
  });
});
