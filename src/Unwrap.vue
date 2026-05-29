<script setup lang="ts">
import { useUnwrap } from './useUnwrap'

const { children, root, Unwrap } = useUnwrap()

defineExpose({ children, root })
</script>

<template>
  <Unwrap />
</template>
