<template>
  <tr :class="['my-table-row', { 'my-table-row--add-row-highlighted': isAddButtonHovered }]" :style="rowStyle">
    <th
      class="my-table-row__add-cell"
      @mouseenter="onCellHover(rowIndex, -1)"
      @mouseleave="onCellUnhover(rowIndex, -1)"
    >
      <VueTablAddButton
        tabindex="-1"
        :class="[
          'my-table-row__add-button',
          {
            'my-table-row__add-button--hidden': hoveredRowIndex !== rowIndex,
          },
        ]"
        @click="onAddRowClick"
        @mouseenter="onAddButtonHover"
        @mouseleave="onAddButtonUnhover"
      />
    </th>
    <VueTablRowCell
      class="my-table-row__cell"
      v-for="(cell, columnIndex) in data"
      :key="`cell-${columnIndex}`"
      :value="cell"
      :row-index="rowIndex"
      :column-index="columnIndex"
      :column-offset="columnOffsets[columnIndex]"
      :moving-column-index="movingColumnIndex"
      :is-add-button-hovered="isAddButtonHovered"
      :is-remove-button-hovered="isRemoveButtonHovered"
      :is-remove-column-highlighted="isRemoveColumnHighlighted"
      :is-add-column-highlighted="isAddColumnHighlighted"
      :hovered-row-index="hoveredRowIndex"
      :hovered-column-index="hoveredColumnIndex"
      :is-any-moving="isAnyMoving"
      @hover="onCellHover"
      @unhover="onCellUnhover"
      @row-move="onRowMove"
      @row-move-start="onRowMoveStart"
      @row-move-end="onRowMoveEnd"
      @column-move="onColumnMove"
      @column-move-start="onColumnMoveStart"
      @column-move-end="onColumnMoveEnd"
      @input="onCellInput"
    />
    <th
      class="my-table-row__remove-cell"
      @mouseenter="onCellHover(rowIndex, -1)"
      @mouseleave="onCellUnhover(rowIndex, -1)"
    >
      <VueTablRemoveButton
        tabindex="-1"
        :class="[
          'my-table-row__remove-button',
          {
            'my-table-row__remove-button--hidden': hoveredRowIndex !== rowIndex,
          },
        ]"
        @click="onRemoveRowClick"
        @mouseenter="onRemoveButtonHover"
        @mouseleave="onRemoveButtonUnhover"
      />
    </th>
  </tr>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import VueTablAddButton from './VueTablAddButton.vue'
import VueTablRemoveButton from './VueTablRemoveButton.vue'
import VueTablRowCell from './VueTablRowCell.vue'
import useHoverStates from '../hooks/useHoverStates'

export default defineComponent({
  name: 'VueTablRow',
  components: {
    VueTablAddButton,
    VueTablRemoveButton,
    VueTablRowCell,
  },
  props: {
    rowIndex: {
      type: Number,
      required: true,
    },
    rowCount: {
      type: Number,
      required: true,
    },
    data: {
      type: Array as PropType<string[]>,
      required: true,
    },
    rowOffset: {
      type: Number,
      required: true,
    },
    columnOffsets: {
      type: Array as PropType<number[]>,
      required: true,
    },
    movingColumnIndex: {
      type: Number,
      required: true,
    },
    hoveredRowIndex: Number,
    hoveredColumnIndex: Number,
    isRemoveColumnHighlighted: Boolean,
    isAddColumnHighlighted: Boolean,
    isRowMoving: Boolean,
    isAnyMoving: Boolean,
  },
  setup(props, { emit }) {
    const onCellInput = function(rowIndex: number, columnIndex: number, value: string) {
      emit('cell-input', rowIndex, columnIndex, value)
    }

    const onCellHover = function(rowIndex: number, columnIndex: number) {
      emit('cell-hover', rowIndex, columnIndex)
    }

    const onCellUnhover = function(rowIndex: number, columnIndex: number) {
      emit('cell-unhover', rowIndex, columnIndex)
    }

    const onAddRowClick = () => emit('row-add', props.rowIndex)

    const [isRemoveButtonHovered, onRemoveButtonHover, onRemoveButtonUnhover] = useHoverStates()
    const [isAddButtonHovered, onAddButtonHover, onAddButtonUnhover] = useHoverStates()

    const onRemoveRowClick = () => emit('row-remove', props.rowIndex)

    const onRowMove = (offset: number) => emit('row-move', offset)
    const onRowMoveStart = () => emit('row-move-start')
    const onRowMoveEnd = () => emit('row-move-end')

    const onColumnMove = (offset: number) => emit('column-move', offset)
    const onColumnMoveStart = (columnIndex: number) => emit('column-move-start', columnIndex)
    const onColumnMoveEnd = () => emit('column-move-end')

    const rowStyle = computed(() => {
      const result: any = { transform: `translateY(${props.rowOffset}px)` }

      if (!props.isRowMoving && props.isAnyMoving) {
        result.transition = 'transform 0.2s'
      }
      if (props.isRowMoving) {
        result.position = 'relative'
        result.zIndex = 2
      }

      return result
    })

    return {
      onCellInput,
      onCellHover,
      onCellUnhover,
      onAddRowClick,
      isRemoveButtonHovered,
      onRemoveButtonHover,
      onRemoveButtonUnhover,
      onRemoveRowClick,
      isAddButtonHovered,
      onAddButtonHover,
      onAddButtonUnhover,
      onRowMove,
      onRowMoveEnd,
      onRowMoveStart,
      rowStyle,
      onColumnMove,
      onColumnMoveStart,
      onColumnMoveEnd,
    }
  },
})
</script>

<style lang="scss" scoped>
$radius: var(--tabl-radius, var(--tabl-radius-default));

.my-table-row {
  height: 40px;

  &:first-of-type {
    .my-table-row__cell:first-of-type {
      border-top-left-radius: $radius;
    }

    .my-table-row__cell:last-of-type {
      border-top-right-radius: $radius;
    }
  }

  &:last-of-type {
    .my-table-row__cell:first-of-type {
      border-bottom-left-radius: $radius;
    }

    .my-table-row__cell:last-of-type {
      border-bottom-right-radius: $radius;
    }
  }
}

.my-table-row--add-row-highlighted {
  position: relative;
  z-index: 1;
}

.my-table-row__add-cell,
.my-table-row__remove-cell {
  padding: 0;
  width: 30px;
}

.my-table-row__add-button--hidden,
.my-table-row__remove-button--hidden {
  opacity: 0;
}

.my-table-row__add-button {
  margin-right: 8px;
}

.my-table-row__remove-button {
  margin-left: 8px;
}
</style>
