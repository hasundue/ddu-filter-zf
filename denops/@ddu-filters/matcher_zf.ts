import { basename } from "https://deno.land/std@0.201.0/path/mod.ts";
import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.5.0/types.ts";
import { rankToken } from "../../libzf.ts";

const separator = Deno.build.os === "windows" ? "\\" : "/";

interface Params extends BaseFilterParams {
  plainText: boolean;
  caseSensitive: boolean;
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
    const tokens = args.input.trimEnd().split(" ");
    const strictPath = tokens.length == 1 && args.input.includes(separator);
    return args.items
      .map((item) =>
        rankItem(item, tokens, { ...args.filterParams, strictPath })
      )
      .filter((item) => item.rank > 0)
      .sort((a, b) => a.rank - b.rank)
      .map((item) => item.item);
  }
  params() {
    return {
      plainText: false,
      caseSensitive: false,
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
  params: Params & { strictPath: boolean },
): RankItemResult {
  let total = 0;
  for (const token of tokens) {
    const rank = rankToken(
      item.word,
      params.plainText ? null : basename(item.word),
      params.caseSensitive ? token : token.toLowerCase(),
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
