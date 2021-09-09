<template>
  <div>
    <table>
      <tbody>
        <tr v-for="(row, rowIndex) in rowRange" :key="'row-' + rowIndex">
          <td v-for="(cell, columnIndex) in columnRange" :key="`cell-${row}-${columnIndex}`">
            <input
              type="text"
              :key="`input-${row}-${columnIndex}`"
              :value="dataManager.getCellValue(rowIndex, columnIndex)"
              @input.stop="onInput(rowIndex, columnIndex, $event.target.value)"
            />
          </td>
        </tr>
      </tbody>
    </table>
  </div>
</template>

<script lang="ts">
import { computed, defineComponent, PropType } from 'vue'
import TableDataProvider from '../data/TableDataManager'

function range(size: number) {
  return new Array(size).fill(0)
}

export default defineComponent({
  name: 'MyTable',
  props: {
    dataManager: {
      type: Object as PropType<TableDataProvider>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const onInput = function(rowIndex: number, columnIndex: number, value: string) {
      props.dataManager.setCellValue(rowIndex, columnIndex, value)
      emit('cell-input', rowIndex, columnIndex, value)
    }

    const rowRange = computed(() => range(props.dataManager.rowCount))
    const columnRange = computed(() => range(props.dataManager.columnCount))

    return { onInput, rowRange, columnRange }
  },
})
</script>
