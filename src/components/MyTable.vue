<template>
  <table class="my-table">
    <MyTableColumnButtons
      :column-count="dataManager.columnCount"
      :hovered-column-index="hoveredColumnIndex"
      :button-component="MyTableAddButton"
      @cell-hover="onCellHover(-1, $event)"
      @cell-unhover="onCellUnhover(-1, $event)"
      @button-hover="onAddButtonHover"
      @button-unhover="onAddButtonUnhover"
      @button-click="onColumnAdd"
    />
    <tbody>
      <MyTableRow
        v-for="(rowData, rowIndex) in data"
        :data="rowData"
        :key="'row' + rowIndex"
        :row-index="rowIndex"
        :hovered-row-index="hoveredRowIndex"
        :hovered-column-index="hoveredColumnIndex"
        :is-remove-column-highlighted="isRemoveButtonHovered"
        :is-add-column-highlighted="isAddButtonHovered"
        :row-count="dataManager.rowCount"
        :row-offset="getRowOffset(rowIndex)"
        :column-offsets="columnOffsets"
        :is-row-moving="rowIndex === movingRowIndex"
        :is-any-moving="isRowMoving || isColumnMoving"
        :moving-column-index="movingColumnIndex"
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
      :column-count="dataManager.columnCount"
      :hovered-column-index="hoveredColumnIndex"
      :button-component="MyTableRemoveButton"
      @cell-hover="onCellHover(-1, $event)"
      @cell-unhover="onCellUnhover(-1, $event)"
      @button-hover="onRemoveButtonHover"
      @button-unhover="onRemoveButtonUnhover"
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

    const hoveredRowIndex = ref(-1)
    const hoveredColumnIndex = ref(-1)

    const onCellHover = function(rowIndex: number, columnIndex: number) {
      hoveredRowIndex.value = rowIndex
      hoveredColumnIndex.value = columnIndex
    }

    const onCellUnhover = function(rowIndex: number, columnIndex: number) {
      if (hoveredRowIndex.value === rowIndex) hoveredRowIndex.value = -1
      if (hoveredColumnIndex.value === columnIndex) hoveredColumnIndex.value = -1
    }

    const onRowAdd = (index: number) => dataManager.value.createRow(index)
    const onRowRemove = (index: number) => dataManager.value.removeRow(index)
    const onColumnAdd = (index: number) => dataManager.value.createColumn(index)
    const onColumnRemove = (index: number) => dataManager.value.removeColumn(index)

    const [isRemoveButtonHovered, onRemoveButtonHover, onRemoveButtonUnhover] = useHoverStates()
    const [isAddButtonHovered, onAddButtonHover, onAddButtonUnhover] = useHoverStates()

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
      hoveredRowIndex,
      hoveredColumnIndex,
      onRowAdd,
      onRowRemove,
      onColumnAdd,
      onColumnRemove,
      onRemoveButtonHover,
      onRemoveButtonUnhover,
      isRemoveButtonHovered,
      isAddButtonHovered,
      onAddButtonHover,
      onAddButtonUnhover,
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
