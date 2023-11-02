import { assertObjectMatch } from "https://deno.land/std@0.205.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.205.0/testing/bdd.ts";
import { Filter } from "../denops/@ddu-filters/sorter_zf.ts";

describe("sorter", () => {
  const sorter = new Filter();

  describe("filter", () => {
    const items = [
      { word: "zf/", data: { zfRank: 0 } },
      { word: "zf/libzf.so", data: { zfRank: 1 } },
      // deno-lint-ignore no-explicit-any
    ] as any;

    const filterParams = sorter.params();

    it("should sort items by rank", () => {
      assertObjectMatch(
        sorter.filter({ items, filterParams }),
        [
          { word: "zf/", data: { zfRank: 0 } },
          { word: "zf/libzf.so", data: { zfRank: 1 } },
          // deno-lint-ignore no-explicit-any
        ] as any,
      );
    });
  });
});
