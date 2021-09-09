<template>
  <table>
    <tbody>
      <tr v-for="(row, rowIndex) in data.asReadonlyArray()" :key="'row-' + rowIndex">
        <td v-for="(cell, columnIndex) in row" :key="`cell-${row}-${columnIndex}`">
          <input type="text" :value="cell" @input="onInput(rowIndex, columnIndex, $event.target.value)" />
        </td>
      </tr>
    </tbody>
  </table>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import TableData from '../structures/TableData'

export default defineComponent({
  name: 'MyTable',
  props: {
    data: {
      type: Object as PropType<TableData>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const onInput = function(rowIndex: number, columnIndex: number, value: string) {
      props.data.setCellValue(rowIndex, columnIndex, value)
      emit('cell-input', rowIndex, columnIndex, value)
    }

    return { onInput }
  },
})
</script>
