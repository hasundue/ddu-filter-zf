import { assertEquals } from "https://deno.land/std@0.201.0/assert/mod.ts";
import { describe, it } from "https://deno.land/std@0.201.0/testing/bdd.ts";
import { rankToken } from "./libzf.ts";

describe("rankToken", () => {
  it("unmatched", () => {
    const res = rankToken("zf/libzf.so", "libzf.so", "dll", false, false);
    assertEquals(res, -1);
  });
  it("match with extname", () => {
    const res = rankToken("zf/libzf.so", "libzf.so", ".so", false, false);
    assertEquals(res, 1.25);
  });
  it("match with filename", () => {
    const res = rankToken("zf/libzf.so", "libzf.so", "lib", false, false);
    assertEquals(res, 0.625);
  });
  it("match with dirname", () => {
    const res = rankToken("zf/", null, "zf", false, false);
    assertEquals(res, 2);
  });
  it("match with dirname and filename", () => {
    const res = rankToken("zf/libzf.so", "libzf.so", "zf", false, false);
    assertEquals(res, 1.5);
  });
});
