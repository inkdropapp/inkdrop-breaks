> [!IMPORTANT]
> This repository has moved to [inkdropapp/plugins](https://github.com/inkdropapp/plugins): [`packages/breaks`](https://github.com/inkdropapp/plugins/tree/main/packages/breaks). It is archived and read-only; please open issues and pull requests there.

You can insert line breaks without needing spaces.

## Usage

Say we have the following Markdown (note: there’s no spaces after `a`):

```
This is a
paragraph.
```

With `breaks` enabled, it yields:

```
<p>This is a<br>
paragraph.</p>
```

Without `breaks` enabled, you'd get:

```
<p>This is a
paragraph.</p>
```
