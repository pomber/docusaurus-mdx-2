# Docusaurus Theme MDX v2

This is a Docusaurus theme to add support for MDX v2 [until it is officialy supported](https://github.com/facebook/docusaurus/issues/4029).

## Installation

1. Upgrade Docusaurus to version `2.0.0-beta.18` or later
2. Upgrade your `@mdx-js/react` dependency to version `^2.0.0`
3. Install `docusaurus-theme-mdx-v2`

```
npm install docusaurus-theme-mdx-v2
```

4. Add `mdx-v2` theme to your `docusaurus.config.js`

```js
// ...
const config = {
  //...
  presets: [...],
  themes: ["mdx-v2"],
  themeConfig: ...
  //...
}
// ...
```

5. Migrate your .md and .mdx files to MDX v2 if you need. The most common breaking changes are:

- You cannot use comments like this `<!--comment-->` anymore. Now you should use something like `{/* prettier-ignore */}`
- You need to escape `{` in your prose like this `\{`
- If you are using components that aren't imported or part of the `MDXComponents`, MDX v2 will throw an error (v1 only showed a warning)

## Known Issues

### Admonitions syntax doesn't work with MDX v2

Instead of using the markdown syntax for admonitions, you should use the
`<Admonition />` component.

Instead of this:

```md
:::note Your Title

Some **content** with _markdown_ `syntax`.

:::
```

Use this:

```md
import Admonition from '@theme/Admonition'

<Admonition type="ntoe" title="Your Title">

Some **content** with _markdown_ `syntax`.

</Admonition>
```

## License

MIT
