<template>
  <MyTable :data="tableData" @cell-input="onCellInput"></MyTable>
  <div>Last input: [{{ lastInput.row }},{{ lastInput.column }}]: {{ lastInput.value }}</div>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import MyTable from './components/MyTable.vue'
import TableData from './structures/TableData'

export default defineComponent({
  name: 'App',
  components: {
    MyTable,
  },
  setup() {
    const tableData = TableData.createEmpty(5, 5)

    const lastInput = reactive({ row: 0, column: 0, value: '' })

    const onCellInput = function(row: number, column: number, value: string) {
      lastInput.row = row
      lastInput.column = column
      lastInput.value = value
    }

    return { tableData, lastInput, onCellInput }
  },
})
</script>

<style lang="scss">
#app {
  font-family: Avenir, Helvetica, Arial, sans-serif;
  -webkit-font-smoothing: antialiased;
  -moz-osx-font-smoothing: grayscale;
  text-align: center;
  color: #2c3e50;
  margin-top: 60px;
}
</style>
