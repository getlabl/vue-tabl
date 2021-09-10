<template>
  <table class="my-table">
    <thead>
      <th></th>
      <th
        class="my-table__add-cell"
        v-for="(_, columnIndex) in columnRange"
        :key="columnIndex"
        @mouseenter="onCellHover(-1, columnIndex)"
        @mouseleave="onCellUnhover(-1, columnIndex)"
      >
        <MyTableAddButton
          :class="[
            'my-table__add-button',
            {
              'my-table__add-button--hidden': columnIndex !== highlightedColumn,
            },
          ]"
          @click="onColumnAdd(columnIndex)"
        ></MyTableAddButton>
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
        :remove-highlighted-column="removeHighlightedColumn"
        @cell-input="onCellInput"
        @cell-hover="onCellHover"
        @cell-unhover="onCellUnhover"
        @row-add="onRowAdd"
        @row-remove="onRowRemove"
      />
    </tbody>
    <thead>
      <th></th>
      <th
        class="my-table__remove-cell"
        v-for="(_, columnIndex) in columnRange"
        :key="columnIndex"
        @mouseenter="onRemoveHover(columnIndex)"
        @mouseleave="onRemoveUnhover(columnIndex)"
      >
        <MyTableRemoveButton
          v-if="columnIndex === highlightedColumn"
          :class="[
            'my-table__remove-button',
            {
              'my-table__remove-button--hidden': columnIndex !== highlightedColumn,
            },
          ]"
          @click="onColumnRemove(columnIndex)"
        ></MyTableRemoveButton>
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
    const removeHighlightedColumn = ref(-1)

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
    const onColumnAdd = (index: number) => dataManager.value.createColumn(index)
    const onColumnRemove = (index: number) => dataManager.value.removeColumn(index)

    const onRemoveHover = function(columnIndex: number) {
      removeHighlightedColumn.value = columnIndex
      onCellHover(-1, columnIndex)
    }

    const onRemoveUnhover = function(columnIndex: number) {
      if (removeHighlightedColumn.value === columnIndex) removeHighlightedColumn.value = -1
      onCellUnhover(-1, columnIndex)
    }

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
      onColumnAdd,
      onColumnRemove,
      onRemoveHover,
      onRemoveUnhover,
      removeHighlightedColumn,
    }
  },
})
</script>

<style lang="scss" scoped>
.my-table {
  border-spacing: 0;
  border-radius: 4px;
}

.my-table__add-cell,
.my-table__remove-cell {
  padding: 0;
  height: 30px;
}

.my-table__add-button--hidden,
.my-table__remove-button--hidden {
  opacity: 0;
}
</style>
