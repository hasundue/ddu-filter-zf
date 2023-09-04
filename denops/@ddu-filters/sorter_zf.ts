import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.6.0/types.ts";
import { is } from "https://deno.land/x/unknownutil@v3.6.0/mod.ts";

const type = { zfRank: is.Number };

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(args: {
    filterParams: BaseFilterParams;
    items: DduItem[];
  }): DduItem[] {
    return args.items.sort((a, b) => {
      const ra = is.ObjectOf(type)(a.data) ? a.data.zfRank : 0;
      const rb = is.ObjectOf(type)(b.data) ? b.data.zfRank : 0;
      return ra - rb;
    });
  }
  params() {
    return { highlightMatched: "" };
  }
}
