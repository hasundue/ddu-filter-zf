import { assertObjectMatch } from "https://deno.land/std@0.202.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.202.0/testing/bdd.ts";
import { Filter } from "../denops/@ddu-filters/converter_zf.ts";

describe("converter_zf", () => {
  const converter = new Filter();

  describe("filter", () => {
    const items = [
      { word: "zf/libzf.so" },
      // deno-lint-ignore no-explicit-any
    ] as any;

    const filterParams = { highlight: "Search" };

    // TODO: fix the following tests
    // ref: https://github.com/denoland/deno_std/issues/3472

    // it("should not highlight when input is empty", () => {
    //   assertObjectMatch(
    //     converter.filter({ filterParams, items, input: "" }),
    //     [
    //       { word: "zf/libzf.so", highlights: [] },
    //       // deno-lint-ignore no-explicit-any
    //     ] as any,
    //   );
    // });

    // it("should not highlight when input is not matched", () => {
    //   assertObjectMatch(
    //     converter.filter({ filterParams, items, input: "a" }),
    //     [
    //       { word: "zf/libzf.so", highlights: [] },
    //       // deno-lint-ignore no-explicit-any
    //     ] as any,
    //   );
    // });

    it("should highlight when input is matched", () => {
      assertObjectMatch(
        converter.filter({ filterParams, items, input: "zf" }),
        [
          {
            word: "zf/libzf.so",
            highlights: [
              { col: 1, name: "zf" },
              { col: 2, name: "zf" },
            ],
          },
          // deno-lint-ignore no-explicit-any
        ] as any,
      );
    });

    it("should highlight for strict path", () => {
      assertObjectMatch(
        converter.filter({ filterParams, items, input: "z/l" }),
        [
          {
            word: "zf/libzf.so",
            highlights: [
              { col: 1, name: "zf" },
              { col: 3, name: "zf" },
              { col: 4, name: "zf" },
            ],
          },
          // deno-lint-ignore no-explicit-any
        ] as any,
      );
    });
  });
});
