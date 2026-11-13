> [!IMPORTANT]
> This repository has moved to [inkdropapp/plugins](https://github.com/inkdropapp/plugins): [`packages/breaks`](https://github.com/inkdropapp/plugins/tree/main/packages/breaks). It is archived and read-only; please open issues and pull requests there.

# inkdrop-breaks

Breaks support, without needing spaces, for Inkdrop.

## Install

Check out [the docs](https://docs.inkdrop.app/manual/extend-inkdrop-with-plugins) on how to install plugins.

### Command-line

```sh
ipm install breaks
```

## Usage

Say we have the following Markdown (note: there’s no spaces after `a`):

```
This is a
paragraph.
```

With this plugin, it yields:

```
<p>This is a<br>
paragraph.</p>
```

Without `breaks` plugin, you'd get:

```
<p>This is a
paragraph.</p>
```
