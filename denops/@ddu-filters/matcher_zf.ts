import { basename } from "https://deno.land/std@0.186.0/path/mod.ts";
import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "https://deno.land/x/ddu_vim@v2.8.4/types.ts";
import { rankToken } from "../../libzf.ts";

interface Params extends BaseFilterParams {
  caseSensitive: boolean;
  strictPath: boolean;
}

interface DduItemWithRank extends DduItem {
  rank: number;
}

export class Filter extends BaseFilter<Params> {
  // deno-lint-ignore require-await
  async filter(args: {
    filterParams: Params;
    input: string;
    items: DduItem[];
  }): Promise<DduItem[]> {
    if (!args.input) return args.items;

    const tokens = args.input.split(" ");

    return args.items
      .map((item) => rankItem(item, tokens, args.filterParams))
      .filter((item) => item.rank > 0)
      .sort((a, b) => a.rank - b.rank);
  }

  params() {
    return {
      caseSensitive: false,
      strictPath: false,
    };
  }
}

function rankItem(
  item: DduItem,
  tokens: string[],
  params: Params,
): DduItemWithRank {
  let total = 0;
  for (const token of tokens) {
    const filename = basename(item.word);
    const rank = rankToken(
      item.word,
      filename,
      token,
      params.caseSensitive,
      params.strictPath,
    );
    if (rank < 0) {
      return { ...item, rank };
    }
    total += rank;
  }
  return { ...item, rank: total };
}
