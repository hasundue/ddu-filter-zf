import { basename } from "https://deno.land/std@0.210.0/path/mod.ts";
import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
} from "https://deno.land/x/ddu_vim@v3.9.0/types.ts";
import { is } from "https://deno.land/x/unknownutil@v3.11.0/mod.ts";
import { rankToken } from "../../libzf.ts";

const SEPARATOR = Deno.build.os === "windows" ? "\\" : "/";

export class Filter extends BaseFilter<BaseFilterParams> {
  filter(args: {
    filterParams: BaseFilterParams;
    input: string;
    items: DduItem[];
  }): DduItem[] {
    if (!args.input) return args.items;

    const tokens = args.input.trimEnd().split(" ");
    const strictPath = tokens.length == 1 && args.input.includes(SEPARATOR);
    const caseSensitive = /[A-Z]/.test(args.input);

    return args.items
      .map((item) =>
        rankItem(item, tokens, {
          strictPath,
          caseSensitive,
          plainText: item.kind !== "file",
        })
      )
      .filter((item) =>
        is.ObjectOf({ zfRank: is.Number })(item.data) && item.data.zfRank >= 0
      );
  }
  params() {
    return { highlightMatched: "" };
  }
}

export interface RankTokenParams {
  plainText: boolean;
  caseSensitive: boolean;
  strictPath: boolean;
}

function rankItem(
  item: DduItem,
  tokens: string[],
  params: RankTokenParams,
): DduItem {
  let total = 0;
  for (const token of tokens) {
    const candidate = item.matcherKey ?? item.word;
    const rank = rankToken(
      candidate,
      params.plainText ? null : basename(candidate),
      token,
      params.caseSensitive,
      params.strictPath,
    );
    if (rank < 0) {
      return { ...item, data: { zfRank: rank } };
    }
    total += rank;
  }
  return { ...item, data: { zfRank: total } };
}
