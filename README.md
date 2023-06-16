<!-- panvimdoc-ignore-start -->

# ddu-filter-zf

<!-- deno-fmt-ignore-start -->

![CI](https://github.com/hasundue/ddu-filter-zf/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/hasundue/ddu-filter-zf/branch/main/graph/badge.svg?token=7BS432RAXB)](https://codecov.io/gh/hasundue/ddu-filter-zf)
![denoland/deno](https://img.shields.io/badge/Deno-v1.34.3-informational?logo=deno) <!-- @denopendabot denoland/deno -->
![ziglang/zig](https://img.shields.io/badge/Zig-master-informational?logo=zig)

<!-- deno-fmt-ignore-end -->

<!-- panvimdoc-ignore-end -->

## Introduction

`ddu-filter-zf` is a Vim/NeoVim plugin to use
[zf](https://github.com/natecraddock/zf) as a filter for
[ddu.vim](https://github.com/Shougo/ddu.vim). `zf` is a fuzzy-finder written in
Zig, which prioritizes matches on filepaths.

## Requirements

- [Deno](https://deno.land/)
- [denops.vim](https://github.com/vim-denops/denops.vim)
- [ddu.vim](https://github.com/Shougo/ddu.vim)
- [Zig](https://ziglang.org) (master or latest)

Latest versions are required unless explicitly mentioned.

## Installation

A build step is required to compile zf. In the case of
[dein](https://github.com/Shougo/dein.vim), for example,

```viml
call dein#add('hasundue/ddu-filter-zf', #{ build: 'deno task build' })
```

## Configuration

`ddu-filter-zf` is provided as a matcher for ddu.vim, technically, but it works
as a sorter at the same time. Here is an example configuration where
`ddu-filter-zf` is used as the filter for all the sources:

```viml
call ddu#custom#patch_global(#{
  \   sourceOptions: #{
  \     _: #{
  \       matchers: ['matcher_zf'],
  \     },
  \   },
  \   filterParams: #{
  \     matcher_zf: #{
  \       caseSensitive: v:false,
  \       strictPath: v:false,
  \     },
  \   },
  \ })
```

For the parameters `caseSensitive` and `strictPath`, please refer to the
documentation of [zf](https://github.com/natecraddock/zf).
