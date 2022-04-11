---
sidebar_position: 1
---

# MDX v2 Test

import Tabs from '@theme/Tabs';
import TabItem from '@theme/TabItem';

<Tabs>
<TabItem value="js" label="JavaScript">

```js
function helloWorld() {
  console.log("Hello, world!");
}
```

</TabItem>
<TabItem value="py" label="Python">

```py
def hello_world():
  print("Hello, world!")
```

</TabItem>
<TabItem value="java" label="Java">

```java
class HelloWorld {
  public static void main(String args[]) {
    System.out.println("Hello, World");
  }
}
```

</TabItem>
</Tabs>

`Math.PI` is {Math.PI}

```js title="/src/components/HelloCodeTitle.js" {1,4-6,11}
import React from "react";

function MyComponent(props) {
  if (props.isBar) {
    return <div>Bar</div>;
  }

  return <div>Foo</div>;
}

export default MyComponent;
```

Lorem ipsum.

### Explicit Id Heading \{#my-explicit-id}

Lorem ipsum.

## Admonitions

:::note

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::

## Start your site

Run the development server:

```bash
cd my-website
npm run start
```

The `cd` command changes the directory you're working with.

[Link to explicit heading](#my-explicit-id)

## Image test

![Example banner](./assets/banner.png)

## Files assets test

<a target="\_blank" href={require('./assets/banner.png').default}> Download this png </a>

or

[Download this png using Markdown](./assets/banner.png)

## Inline SVG test

import DocusaurusSvg from './assets/logo.svg';

<DocusaurusSvg />

import Admonition from '@theme/Admonition'

# MDX v2 Demo

## Admonitions

<Admonition type="danger" title="something">

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

</Admonition>

:::note

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::

:::note Your Title

Some **content** with _markdown_ `syntax`.

:::

:::info

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::

:::caution

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::

:::danger

Some **content** with _markdown_ `syntax`. Check [this `api`](#).

:::
