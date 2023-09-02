import { basename } from "https://deno.land/std@0.198.0/path/mod.ts";
import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.5.0/types.ts";
import { rankToken } from "../../libzf.ts";

interface Params extends BaseFilterParams {
  isFilePath: boolean;
  caseSensitive: boolean;
  strictPath: boolean;
}

export class Filter extends BaseFilter<Params> {
  filter(args: {
    filterParams: Params;
    input: string;
    items: DduItem[];
  }): DduItem[] {
    if (!args.input) {
      return args.items;
    }
    const tokens = args.input.split(" ").filter((token) => token !== "");
    return args.items
      .map((item) => rankItem(item, tokens, args.filterParams))
      .filter((item) => item.rank > 0)
      .sort((a, b) => a.rank - b.rank)
      .map((item) => item.item);
  }
  params() {
    return {
      isFilePath: true,
      caseSensitive: false,
      strictPath: false,
    };
  }
}

type RankItemResult = {
  item: DduItem;
  rank: number;
};

function rankItem(
  item: DduItem,
  tokens: string[],
  params: Params,
): RankItemResult {
  let total = 0;
  for (const token of tokens) {
    const filename = params.isFilePath ? basename(item.word) : null;
    const rank = rankToken(
      item.word,
      filename,
      token,
      params.caseSensitive,
      params.strictPath,
    );
    if (rank < 0) {
      return { item, rank };
    }
    total += rank;
  }
  return { item, rank: total };
}
