import { basename } from "https://deno.land/std@0.208.0/path/mod.ts";
import {
  BaseFilter,
  BaseFilterParams,
  DduItem,
  ItemHighlight,
} from "https://deno.land/x/ddu_vim@v3.8.1/types.ts";
import { highlightToken } from "../../libzf.ts";
import { RankTokenParams } from "./matcher_zf.ts";

const SEPARATOR = Deno.build.os === "windows" ? "\\" : "/";
const HIGHLIGHT_NAME = "zf";

interface Params extends BaseFilterParams {
  highlight: string;
}

export class Filter extends BaseFilter<Params> {
  filter(args: {
    filterParams: Params;
    input: string;
    items: DduItem[];
  }): DduItem[] {
    if (!args.input) return args.items;

    const tokens = args.input.trimEnd().split(" ");
    const strictPath = tokens.length == 1 && args.input.includes(SEPARATOR);
    const caseSensitive = /[A-Z]/.test(args.input);

    return args.items.map((item) => ({
      ...item,
      highlights: highlightItem(item, tokens, {
        strictPath,
        caseSensitive,
        plainText: item.kind !== "file",
        highlight: args.filterParams.highlight,
      }),
    }));
  }
  params() {
    return { highlight: "Search" };
  }
}

function highlightItem(
  item: DduItem,
  tokens: string[],
  params: RankTokenParams & { highlight: string },
): ItemHighlight[] {
  const highlights: ItemHighlight[] = [];
  for (const token of tokens) {
    const str = item.matcherKey ?? item.word;
    const indices = highlightToken(
      str,
      params.plainText ? null : basename(str),
      token,
      params.caseSensitive,
      params.strictPath,
    );
    // TODO: probably better to merge sequential highlights
    indices.forEach((i) => {
      highlights.push({
        name: HIGHLIGHT_NAME,
        hl_group: params.highlight,
        col: i + 1,
        width: 1,
      });
    });
  }
  return highlights;
}
