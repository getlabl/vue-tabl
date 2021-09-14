<template>
  <h1>Sample table</h1>
  <VueTabl :data="tableData" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import VueTabl from './components/VueTabl.vue'

const tableData = reactive([
  ['Apple', 'Banana', 'Strawberry'],
  ['Orange', 'Melon', ''],
])
</script>
