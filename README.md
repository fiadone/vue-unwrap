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

const $children = computed(() => ctx.value?.children.map(getNodeElement))
</script>

<template>
  <Unwrap ref="ctx" />
</template>

```

### With useUnwrap composable (for more control)

```vue
<script setup lang="ts">
import type { ComponentPublicInstance } from 'vue'
import { useUnwrap } from 'vue-unwrap'

// your component props definition
type PropsType = { foo: string } 

// your child nodes definition
type CustomNodeType = (
  | ComponentPublicInstance<{ bar: string }>
  | ComponentPublicInstance
  | Element
  | null
)

const props = defineProps<PropsType>()

const { $el, children, Unwrap } = useUnwrap<CustomNodeType, PropsType>()

const bars = computed(() => (
  children?
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

## Development

- Install dependencies:

```bash
npm install
```

- Run the playground:

```bash
npm run playground
```

- Run the unit tests:

```bash
npm run test
```

- Build the library:

```bash
npm run build
```
