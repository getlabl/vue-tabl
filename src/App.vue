<template>
  <h1>Sample table</h1>
  <MyTable :data="tableData" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import MyTable from './components/MyTable.vue'

const tableData = reactive([
  ['', 'Height', 'Burst'],
  ['S', '156-160', '74-90'],
  ['М', '159-164', '88-96'],
])
</script>
