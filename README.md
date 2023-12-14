<!-- panvimdoc-ignore-start -->

# ddu-filter-zf

<!-- deno-fmt-ignore-start -->

![CI](https://github.com/hasundue/ddu-filter-zf/actions/workflows/ci.yml/badge.svg)
[![codecov](https://codecov.io/gh/hasundue/ddu-filter-zf/branch/main/graph/badge.svg?token=7BS432RAXB)](https://codecov.io/gh/hasundue/ddu-filter-zf)
![denoland/deno](https://img.shields.io/badge/Deno-v1.39.0-informational?logo=deno) <!-- @denopendabot denoland/deno -->
![ziglang/zig](https://img.shields.io/badge/Zig-0.11.0-informational?logo=zig) <!-- @denopendabot ziglang/zig -->

<!-- deno-fmt-ignore-end -->

<!-- panvimdoc-ignore-end -->

## Introduction

`ddu-filter-zf` is a fuzzy-filter for
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
archives (available for Linux x86_64, Windows x86_64, and macOS x86_64). In this
case, you need to specify the download command as follows:

```viml
call dein#add('hasundue/ddu-filter-zf', #{ build: 'deno task fetch' })
```

## Configuration

`ddu-filter-zf` provides `matcher_zf`, `sorter_zf`, and `converter_zf`
(highlighter) for `ddu.vim`. Here is an example configuration where
`ddu-filter-zf` is used as the default filter for all the sources:

```viml
call ddu#custom#patch_global(#{
  \   sourceOptions: #{
  \     _: #{
  \       matchers: ['matcher_zf'],
  \       sorters: ['sorter_zf'],
  \       converters: ['converter_zf'],
  \     },
  \   },
  \   filterParams: #{
  \     converter_zf: #{
  \       highlight: 'Search',
  \     },
  \   },
  \ })
```

## Parameters

### `converter_zf`

#### `highlight`

- Type: `string` (highlight group name)
- Default: `Search`

The highlight group used to highlight the matched characters.

## Features

Please refer to the
[original documentation of `zf`](https://github.com/natecraddock/zf#why-use-zf)
for the details of the `zf`-specific features.

Here are some non-trivial features of `ddu-filter-zf`:

- It enables the file-path-specific features only for items with
  `kind = 'file'`. For other kind of items, it treats them as plain strings and
  behaves like a conventional filter.
