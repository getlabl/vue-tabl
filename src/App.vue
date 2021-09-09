<template>
  <h2>
    Table 1
  </h2>
  <MyTable :data-manager="dataManager1"></MyTable>

  <h3>
    Entered data:
  </h3>
  <table>
    <tbody>
      <tr v-for="(row, rowIndex) in tableData1" :key="'row-' + rowIndex">
        <td v-for="(cell, columnIndex) in row" :key="`cell-${row}-${columnIndex}`">
          <div>
            {{ cell }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>

  <h2>
    Table 2
  </h2>
  <MyTable :data-manager="dataManager2" @cell-input="onInput"></MyTable>

  <button @click="tableData2[0][0] = 'abcd'">dnakd</button>

  <h3>
    Entered data:
  </h3>
  <table>
    <tbody>
      <tr v-for="(row, rowIndex) in tableData2" :key="'row-' + rowIndex">
        <td v-for="(cell, columnIndex) in row" :key="`cell-${row}-${columnIndex}`">
          <div>
            {{ cell }}
          </div>
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, reactive } from 'vue'
import MyTable from './components/MyTable.vue'
import TableDataManager from './data/TableDataManager'

export default defineComponent({
  name: 'App',
  components: {
    MyTable,
  },
  setup() {
    // use case 1
    const tableData1 = reactive([
      ['', 'Height', 'Burst'],
      ['S', '156-160', '74-90'],
      ['М', '159-164', '88-96'],
    ])

    const dataManager1 = reactive(new TableDataManager(tableData1))

    // use case 2
    const tableData2 = reactive([
      ['', 'Height', 'Burst'],
      ['S', '156-160', '74-90'],
      ['М', '159-164', '88-96'],
    ])

    const dataManager2 = reactive(new TableDataManager(tableData2, true))

    const onInput = function(rowIndex: number, columnIndex: number, value: string) {
      tableData2[rowIndex][columnIndex] = value.replaceAll(' ', '')
    }

    return { tableData1, dataManager1, tableData2, dataManager2, onInput }
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
