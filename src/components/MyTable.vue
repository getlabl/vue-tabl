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
      @button-click="onColumnAdd"
    />
    <tbody>
      <MyTableRow
        v-for="(row, rowIndex) in data"
        :data="row"
        :key="'row' + rowIndex"
        :row-index="rowIndex"
        :highlighted-row="highlightedRow"
        :highlighted-column="highlightedColumn"
        :is-remove-column-highlighted="isRemoveHovered"
        :is-add-column-highlighted="isAddHovered"
        :row-count="dataManager.rowCount"
        :row-offset="getRowOffset(rowIndex)"
        :column-offsets="columnOffsets"
        :is-row-moving="rowIndex === movingRowIndex"
        :moving-column-index="movingColumnIndex"
        :is-any-moving="isRowMoving || isColumnMoving"
        @cell-input="onCellInput"
        @cell-hover="onCellHover"
        @cell-unhover="onCellUnhover"
        @row-add="onRowAdd"
        @row-remove="onRowRemove"
        @row-move-start="onRowMoveStart(rowIndex)"
        @row-move="onRowMove"
        @row-move-end="onRowMoveEnd"
        @column-move-start="onColumnMoveStart"
        @column-move="onColumnMove"
        @column-move-end="onColumnMoveEnd"
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
      @button-click="onColumnRemove"
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
import useHoverStates from '@/hooks/useHoverStates'
import useDraggable from '@/hooks/useDraggable'

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

    const [isRemoveHovered, onRemoveHover, onRemoveUnhover] = useHoverStates()
    const [isAddHovered, onAddHover, onAddUnhover] = useHoverStates()

    const rowCount = computed(() => dataManager.value.rowCount)
    const columnCount = computed(() => dataManager.value.columnCount)
    const moveRow = computed(() => dataManager.value.moveRow.bind(dataManager.value))
    const moveColumn = computed(() => dataManager.value.moveColumn.bind(dataManager.value))

    const [movingRowIndex, isRowMoving, onRowMoveStart, onRowMoveEnd, onRowMove, getRowOffset] = useDraggable(
      41,
      rowCount,
      moveRow
    )

    const [
      movingColumnIndex,
      isColumnMoving,
      onColumnMoveStart,
      onColumnMoveEnd,
      onColumnMove,
      getColumnOffset,
    ] = useDraggable(101, columnCount, moveColumn)

    const columnOffsets = computed(() => {
      const result: number[] = new Array(columnCount.value)
      for (let i = 0; i < columnCount.value; i++) {
        result[i] = getColumnOffset(i)
      }
      return result
    })

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
      isRemoveHovered,
      isAddHovered,
      onAddHover,
      onAddUnhover,
      MyTableAddButton,
      MyTableRemoveButton,
      onRowMoveStart,
      onRowMoveEnd,
      onRowMove,
      getRowOffset,
      movingRowIndex,
      isRowMoving,
      movingColumnIndex,
      isColumnMoving,
      onColumnMoveStart,
      onColumnMoveEnd,
      onColumnMove,
      columnOffsets,
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
