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
import TableDataManager from '../data/TableDataManager'

function range(size: number) {
  return new Array(size).fill(0)
}

export default defineComponent({
  name: 'MyTable',
  props: {
    data: {
      type: Array as PropType<string[][]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const dataManager = computed(() => new TableDataManager(props.data))

    const rowRange = computed(() => range(dataManager.value.rowCount))
    const columnRange = computed(() => range(dataManager.value.columnCount))

    const onInput = function(rowIndex: number, columnIndex: number, value: string) {
      dataManager.value.setCellValue(rowIndex, columnIndex, value)
      emit('cell-input', rowIndex, columnIndex, value)
    }

    return { onInput, rowRange, columnRange, dataManager }
  },
})
</script>
