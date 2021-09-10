<template>
  <table class="my-table">
    <MyTableColumnButtons
      :columnCount="dataManager.columnCount"
      :highlightedColumn="highlightedColumn"
      :buttonComponent="MyTableAddButton"
      @cell-hover="onCellHover(-1, $event)"
      @cell-unhover="onCellUnhover(-1, $event)"
      @button-hover="onAddHover"
      @button-unhover="onAddUnhover"
    />
    <tbody>
      <MyTableRow
        v-for="(row, rowIndex) in data"
        :data="row"
        :key="'row' + rowIndex"
        :row-index="rowIndex"
        :highlighted-row="highlightedRow"
        :highlighted-column="highlightedColumn"
        :is-remove-column-highlighted="isRemoveButtonHovered"
        :is-add-column-highlighted="isAddButtonHovered"
        @cell-input="onCellInput"
        @cell-hover="onCellHover"
        @cell-unhover="onCellUnhover"
        @row-add="onRowAdd"
        @row-remove="onRowRemove"
      />
    </tbody>
    <MyTableColumnButtons
      :columnCount="dataManager.columnCount"
      :highlightedColumn="highlightedColumn"
      :buttonComponent="MyTableRemoveButton"
      @cell-hover="onCellHover(-1, $event)"
      @cell-unhover="onCellUnhover(-1, $event)"
      @button-hover="onRemoveHover"
      @button-unhover="onRemoveUnhover"
    />
  </table>
</template>

<script lang="ts">
import { computed, defineComponent, ref, PropType } from 'vue'
import TableDataManager from '../data/TableDataManager'
import MyTableRow from './MyTableRow.vue'
import MyTableRemoveButton from './MyTableRemoveButton.vue'
import MyTableColumnButtons from './MyTableColumnButtons.vue'
import MyTableAddButton from './MyTableAddButton.vue'

export default defineComponent({
  name: 'MyTable',
  components: {
    MyTableRow,
    MyTableColumnButtons,
  },
  props: {
    data: {
      type: Array as PropType<string[][]>,
      required: true,
    },
  },
  setup(props, { emit }) {
    const dataManager = computed(() => new TableDataManager(props.data))

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
    const onColumnAdd = (index: number) => dataManager.value.createColumn(index)
    const onColumnRemove = (index: number) => dataManager.value.removeColumn(index)

    const isRemoveButtonHovered = ref(false)
    const onRemoveHover = () => (isRemoveButtonHovered.value = true)
    const onRemoveUnhover = () => (isRemoveButtonHovered.value = false)

    const isAddButtonHovered = ref(false)
    const onAddHover = () => (isAddButtonHovered.value = true)
    const onAddUnhover = () => (isAddButtonHovered.value = false)

    return {
      onCellInput,
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
      isRemoveButtonHovered,
      isAddButtonHovered,
      onAddHover,
      onAddUnhover,
      MyTableAddButton,
      MyTableRemoveButton,
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
