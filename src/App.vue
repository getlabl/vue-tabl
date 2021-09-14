<template>
  <h1>Sample table</h1>
  <MyTable :data="tableData" />
</template>

<script lang="ts" setup>
import { reactive } from 'vue'
import MyTable from './components/MyTable.vue'

const tableData = reactive([
  ['Apple', 'Banana', 'Strawberry'],
  ['Orange', 'Melon', ''],
])
</script>
