---
title: Custom Components
description: Using custom components with docs.page
---

# Custom Components

The docs.page project is built on-top of [MDX](https://github.com/mdx-js/mdx). MDX allows
custom React components to be written within the Markdown content and rendered.

docs.page provides some useful components to help address common documentation trends.

> Please submit a PR or issue if you require a custom component.

## `<Tabs />`

The `Tabs` component allows you to specify content which can be rendered within tabs:

```
<Tabs
  defaultValue="apple"
  values={[
    {label: 'Apple', value: 'apple'},
    {label: 'Orange', value: 'orange'},
    {label: 'Banana', value: 'banana'},
  ]}>
  <TabItem value="apple">This is an apple 🍎</TabItem>
  <TabItem value="orange">This is an orange 🍊</TabItem>
  <TabItem value="banana">This is a banana 🍌</TabItem>
</Tabs>
```

<Tabs
defaultValue="apple"
values={[
{label: 'Apple', value: 'apple'},
{label: 'Orange', value: 'orange'},
{label: 'Banana', value: 'banana'},
]}>
<TabItem value="apple">This is an apple 🍎</TabItem>
<TabItem value="orange">This is an orange 🍊</TabItem>
<TabItem value="banana">This is a banana 🍌</TabItem>
</Tabs>

### Synchronization

The component also allows you to synchronize selected tab choices by providing a `groupId` property:

<Tabs
groupId="fruit"
defaultValue="apple"
values={[
{label: 'Apple', value: 'apple'},
{label: 'Orange', value: 'orange'},
{label: 'Banana', value: 'banana'},
]}>
<TabItem value="apple">This is an apple 🍎</TabItem>
<TabItem value="orange">This is an orange 🍊</TabItem>
<TabItem value="banana">This is a banana 🍌</TabItem>
</Tabs>

<Tabs
groupId="fruit"
defaultValue="apple"
values={[
{label: 'Apple', value: 'apple'},
{label: 'Orange', value: 'orange'},
{label: 'Banana', value: 'banana'},
]}>
<TabItem value="apple">This is an apple 🍎</TabItem>
<TabItem value="orange">This is an orange 🍊</TabItem>
<TabItem value="banana">This is a banana 🍌</TabItem>
</Tabs>

## `<Image />`

Basic Markdown syntax for images works out of the box (e.g. `![alt tag](src)), however using the `Image`
component directly allows for a bit more control on some of the properties.

### Zooming

By default, images are not zoomable (unless overrided via [configuration](/configuration)). Pass the `zoom` property to the component to enable image zooming:

```
<Image src="https://via.placeholder.com/350x150" zoom />
```

<Image src="https://via.placeholder.com/350x150" zoom />

### Captions

To add a caption to images, provide the cap`tion property:

```
<Image src="https://via.placeholder.com/350x150" caption="A pretty caption!" />
```

<Image src="https://via.placeholder.com/350x150" caption="A pretty caption!" />

## `<Heading />`

The `Heading` component renders a heading tag, by proving a `type` property:

```
<Heading type="h1">Heading 1</Heading>
<Heading type="h2">Heading 2</Heading>
<Heading type="h3">Heading 3</Heading>
<Heading type="h4">Heading 4</Heading>
<Heading type="h5">Heading 5</Heading>
<Heading type="h6">Heading 6</Heading>
```

<Heading type="h1">Heading 1</Heading>
<Heading type="h2">Heading 2</Heading>
<Heading type="h3">Heading 3</Heading>
<Heading type="h4">Heading 4</Heading>
<Heading type="h5">Heading 5</Heading>
<Heading type="h6">Heading 6</Heading>

In most cases, using this component is not required and raw Markdown can be used instead.

## `<YouTube />`

The `YouTube` component renders an embedded YouTube video by proving a video id:

```
<YouTube id="dQw4w9WgXcQ" />
```

<YouTube id="dQw4w9WgXcQ" />

## Admonitions

[Admonitions](https://github.com/elviswolcott/remark-admonitions) are supported out of the box. Simply add the following
Markdown content to generate unmissable call-out boxes:

```
:::note
Content within an admonition can include **Markdown**.
:::

:::tip Optional Title
This useful tip admonition has an option title.
:::

:::info
An information admonition.
:::

:::caution
An caution admonition.
:::

:::danger
An danger admonition.
:::
```

:::note
Content within an admonition can include **Markdown**.
:::

:::tip Optional Title
This useful tip admonition has an option title.
:::

:::info
An information admonition.
:::

:::caution
An caution admonition.
:::

:::danger
An danger admonition.
:::
