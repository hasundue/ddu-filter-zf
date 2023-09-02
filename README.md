<!-- panvimdoc-ignore-start -->

# ddu-filter-zf

<!-- deno-fmt-ignore-start -->

![CI](https://github.com/hasundue/ddu-filter-zf/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/hasundue/ddu-filter-zf/branch/main/graph/badge.svg?token=7BS432RAXB)](https://codecov.io/gh/hasundue/ddu-filter-zf)
![denoland/deno](https://img.shields.io/badge/Deno-v1.36.1-informational?logo=deno) <!-- @denopendabot denoland/deno -->
![ziglang/zig](https://img.shields.io/badge/Zig-0.11.0-informational?logo=zig) <!-- @denopendabot ziglang/zig -->

<!-- deno-fmt-ignore-end -->

<!-- panvimdoc-ignore-end -->

## Introduction

`ddu-filter-zf` is a fuzzy-matcher for
[ddu.vim](https://github.com/Shougo/ddu.vim), featuring
[zf](https://github.com/natecraddock/zf), a fuzzy-finder designed for
fuzzy-matching file paths.

## Requirements

- [Deno](https://deno.land/)
- [denops.vim](https://github.com/vim-denops/denops.vim)
- [ddu.vim](https://github.com/Shougo/ddu.vim)
- [Zig](https://ziglang.org) (optional, if you want to build `libzf` yourself)

Latest stable versions are only supported unless explicitly mentioned.

## Installation

A build step is required to compile `libzf`. In the case of
[dein](https://github.com/Shougo/dein.vim), for example, you can specify the
build command as follows:

```viml
call dein#add('hasundue/ddu-filter-zf', #{ build: 'deno task build' })
```

Alternatively, you can use the pre-built `libzf` provided in the release
archives. In this case, you need to specify the download command as follows:

```viml
call dein#add('hasundue/ddu-filter-zf', #{ build: 'deno task download' })
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
  \       isFilePath: v:true,
  \       caseSensitive: v:false,
  \       strictPath: v:false,
  \     },
  \   },
  \ })
```

## Parameters

### `isFilePath`

- Type: `boolean`
- Default: `true`

If `true`, the filter will treat the input as a file path and enable zf-specific
features.

### `caseSensitive`

- Type: `boolean`
- Default: `false`

If `true`, the filter will perform case-sensitive matching.

### `strictPath`

- Type: `boolean`
- Default: `false`

If `true`, the filter will perform strict path matching. Please refer to the
[original documentation](https://github.com/natecraddock/zf#strict-path-matching)
for details.
