<template>
  <table class="my-table">
    <thead>
      <th></th>
      <th v-for="(_, columnIndex) in columnRange" :key="columnIndex">
        <MyTableAddButton></MyTableAddButton>
      </th>
    </thead>
    <tbody>
      <MyTableRow
        v-for="(row, rowIndex) in data"
        :data="row"
        :key="'row' + rowIndex"
        :row-index="rowIndex"
        :highlighted-row="highlightedRow"
        :highlighted-column="highlightedColumn"
        @cell-input="onCellInput"
        @cell-hover="onCellHover"
        @cell-unhover="onCellUnhover"
        @row-add="onRowAdd"
        @row-remove="onRowRemove"
      />
    </tbody>
    <thead>
      <th></th>
      <th v-for="(_, columnIndex) in columnRange" :key="columnIndex">
        <MyTableRemoveButton></MyTableRemoveButton>
      </th>
    </thead>
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue'
import TableDataManager from '../data/TableDataManager'
import range from '../util/range'
import MyTableRow from './MyTableRow.vue'
import MyTableAddButton from './MyTableAddButton.vue'
import MyTableRemoveButton from './MyTableRemoveButton.vue'

export default defineComponent({
  name: 'MyTable',
  components: {
    MyTableRow,
    MyTableAddButton,
    MyTableRemoveButton,
  },
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

    const onCellInput = function(rowIndex: number, columnIndex: number, value: string) {
      dataManager.value.setCellValue(rowIndex, columnIndex, value)
      emit('cell-input', rowIndex, columnIndex, value)
    }

    const highlightedRow = ref(-1)
    const highlightedColumn = ref(-1)

    const onCellHover = function(rowIndex: number, columnIndex: number) {
      highlightedRow.value = rowIndex
      highlightedColumn.value = columnIndex
    }

    const onCellUnhover = function(rowIndex: number, columnIndex: number) {
      if (highlightedRow.value === rowIndex) highlightedRow.value = -1
      if (highlightedColumn.value === columnIndex) highlightedColumn.value = -1
    }

    const onRowAdd = (index: number) => dataManager.value.createRow(index)

    const onRowRemove = (index: number) => dataManager.value.removeRow(index)

    return {
      onCellInput,
      rowRange,
      columnRange,
      dataManager,
      onCellHover,
      onCellUnhover,
      highlightedRow,
      highlightedColumn,
      onRowAdd,
      onRowRemove,
    }
  },
})
</script>

<style lang="scss" scoped>
.my-table {
  border-spacing: 0;
  border-radius: 4px;
}
</style>
