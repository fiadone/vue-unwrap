<script setup lang="ts">
import { onMounted, useTemplateRef } from 'vue'

import { Unwrap } from '../../src'

const ctx = useTemplateRef<typeof Unwrap>('ctx')

onMounted(() => console.log(ctx.value))
</script>

<template>
  <Unwrap ref="ctx">
    <p>Lorem ipsum</p>
  </Unwrap>
</template>
