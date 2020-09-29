# Converting to media wiki

The markdown version of the docs can be converted to `mediawiki` format using [Pandoc](https://pandoc.org/#)

## Installation

Using chocolately:
```shell
choco install pandoc
```

## Converting to mediawiki

Use the command:
```shell
pandoc oslo-docs.md -o post.wiki -f gfm -t mediawiki
```
