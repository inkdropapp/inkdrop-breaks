# inkdrop-breaks
Breaks support, without needing spaces, for Inkdrop.

## Install

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

