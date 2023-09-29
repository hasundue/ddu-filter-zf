import {
  assertEquals,
  assertObjectMatch,
} from "https://deno.land/std@0.203.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.203.0/testing/bdd.ts";
import { Filter } from "../denops/@ddu-filters/converter_zf.ts";

describe("converter_zf", () => {
  const converter = new Filter();

  describe("filter", () => {
    const items = [
      { word: "zf/libzf.so" },
      // deno-lint-ignore no-explicit-any
    ] as any;

    const filterParams = { highlight: "Search" };

    it("should not highlight when input is empty", () => {
      const actual = converter.filter({ filterParams, items, input: "" });
      assertEquals(actual.length, 1);
      assertObjectMatch(
        actual[0],
        { word: "zf/libzf.so" },
      );
    });

    it("should not highlight when input is not matched", () => {
      const actual = converter.filter({ filterParams, items, input: "a" });
      assertEquals(actual.length, 1);
      assertObjectMatch(
        actual[0],
        { word: "zf/libzf.so", highlights: [] },
      );
    });

    it("should highlight when input is matched", () => {
      const actual = converter.filter({ filterParams, items, input: "zf" });
      assertEquals(actual.length, 1);
      assertObjectMatch(
        actual[0],
        {
          word: "zf/libzf.so",
          highlights: [
            { col: 1, name: "zf" },
            { col: 2, name: "zf" },
          ],
        },
      );
    });

    it("should highlight for strict path", () => {
      const actual = converter.filter({ filterParams, items, input: "z/l" });
      assertObjectMatch(
        actual[0],
        {
          word: "zf/libzf.so",
          highlights: [
            { col: 1, name: "zf" },
            { col: 3, name: "zf" },
            { col: 4, name: "zf" },
          ],
        },
      );
    });
  });
});
