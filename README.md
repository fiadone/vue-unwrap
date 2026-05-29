# vue-unwrap

Less wrappers, more control!

## What/why

When building reusable Vue components, it is common to encapsulate logic that needs access to the rendered DOM of its children — whether to observe layout changes, measure elements, coordinate animations/interactions, or perform low-level DOM operations.

In many cases, this creates an awkward tradeoff: either manually coordinate refs across component boundaries, or introduce an extra wrapper element purely as an implementation detail.

Neither option is ideal.

__Unwrap__ is a conditional wrapper component for Vue 3 with child ref aggregation that removes that friction by making child DOM access predictable while keeping wrapper elements optional. Components can stay focused on behavior rather than structure, avoiding unnecessary DOM nodes unless they are actually required.

The result is cleaner markup, simpler reusable abstractions, and more control over how components render.

## Getting started

```bash
npm i vue-unwrap@latest
```

## Basic usage

### With Unwrap component

```vue
<script setup lang="ts">
import { computed, useTemplateRef } from 'vue'
import { getNodeElement, Unwrap } from 'vue-unwrap'

const ctx = useTemplateRef<typeof Unwrap>('ctx')

const childElements = computed(() => ctx.value?.children.map(getNodeElement))
const rootElement = computed(() => ctx.value?.root)
</script>

<template>
  <Unwrap ref="ctx" is="div">
    <p>Lorem ipsum</p>
  </Unwrap>
</template>

```

### With useUnwrap composable (for more control)

```vue
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { computed } from 'vue'
import { useUnwrap, type NodeRef } from 'vue-unwrap'

// your component props definition
type PropsType = { foo: string }

// your child nodes definition
type CustomNodeType = ComponentPublicInstance<{ bar: string }> | NodeRef

const props = defineProps<PropsType>()

const { root, children, Unwrap } = useUnwrap<CustomNodeType, PropsType>()

const bars = computed(() => (
  children
    .map(child => (
      (child && 'bar' in child)
        ? `${props.foo}-${child.bar}`
        : undefined
    ))
    .filter(Boolean)
))
</script>

<template>
  <Unwrap is="div" />
</template>

```

## API

### `Unwrap`

Conditional wrapper component. Pass **`is`** to render a wrapper element or component; omit it to render slot children directly with no extra DOM node.

When used with a template ref, the component instance exposes:

| Property | Type | Description |
| --- | --- | --- |
| `children` | `NodeRef[]` | Reactive refs to each unwrapped child node |
| `root` | `Element \| null` | The wrapper DOM element when `is` is set; otherwise `null` |

Remaining attributes (except `is`) are forwarded to the wrapper when one is rendered.

### `useUnwrap<N, P>(propTypes?)`

Composable for building custom wrapper components. Returns `{ children, root, Unwrap }` with the same semantics as the component above.

- **`N`** — type of each entry in `children` (defaults to `NodeRef`)
- **`P`** — props type passed to the default slot render function
- **`propTypes`** — optional Vue props definition merged onto the returned `Unwrap` render function, so declared props are forwarded to slot content

```vue
<script setup lang="ts">
import { useUnwrap, type NodeRef } from 'vue-unwrap'

const { Unwrap } = useUnwrap<NodeRef, { count: number }>({
  count: { type: Number, default: 0 },
})
</script>

<template>
  <Unwrap :count="3" v-slot="{ count }">
    <span>{{ count }} items</span>
  </Unwrap>
</template>
```

Use the returned **`Unwrap`** in your template as the render target (typically with `<Unwrap />` and a default slot).

### `NodeRef`

```ts
type NodeRef = Element | ComponentPublicInstance | null
```

Default type for entries in `children`.

### `getNodeElement(node)`

Resolves a child ref to its DOM `Element`. For component instances, returns `$el`; for plain elements, returns the element itself; otherwise returns `null`.

### `unwrapVNodes(vnodes)`

Utility that flattens slot VNodes into a flat array, unwrapping `Fragment` nodes and skipping comments and empty values. Used internally by `useUnwrap`; exported for advanced custom render logic.

## Development

- Install dependencies:

```bash
npm install
```

- Run the playground:

```bash
npm run play
```

- Run the unit tests:

```bash
npm run test
```

- Build the library:

```bash
npm run build
```
