<script setup lang="ts">
import { useUnwrap } from './useUnwrap'

const { $el, children, Unwrap } = useUnwrap()

defineExpose({ $el, children })
</script>

<template>
  <Unwrap />
</template>
