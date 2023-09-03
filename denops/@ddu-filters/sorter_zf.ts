import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.6.0/types.ts";
import { isLike } from "https://deno.land/x/unknownutil@v2.1.1/mod.ts";

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(args: {
    filterParams: BaseFilterParams;
    items: DduItem[];
  }): DduItem[] {
    return args.items.sort((a, b) => {
      const ra = isLike({ zfRank: 0 }, a.data) ? a.data.zfRank : 0;
      const rb = isLike({ zfRank: 0 }, b.data) ? b.data.zfRank : 0;
      return rb - ra;
    });
  }
  params() {
    return { highlightMatched: "" };
  }
}
