<template>
  <tr :class="['my-table-row', { 'my-table-row--add-row-highlighted': isAddHovered }]" :style="rootStyle">
    <th
      class="my-table-row__add-cell"
      @mouseenter="onCellHover(rowIndex, -1)"
      @mouseleave="onCellUnhover(rowIndex, -1)"
    >
      <MyTableAddButton
        :class="[
          'my-table-row__add-button',
          {
            'my-table-row__add-button--hidden': highlightedRow !== rowIndex,
          },
        ]"
        @click="onAddRowClick"
        @mouseenter="onAddHover"
        @mouseleave="onAddUnhover"
      />
    </th>
    <td
      :class="[
        'my-table-row__cell',
        {
          'my-table-row__cell--highlighted': rowIndex === highlightedRow || columnIndex === highlightedColumn,
          'my-table-row__cell--add-row-highlighted': isAddHovered,
          'my-table-row__cell--add-column-highlighted': isAddColumnHighlighted,
          'my-table-row__cell--remove-highlighted': isRemoveHovered || isRemoveColumnHighlighted,
        },
      ]"
      :style="getCellStyle(columnIndex)"
      v-for="(cell, columnIndex) in data"
      :key="`cell-${columnIndex}`"
      @mouseenter="onCellHover(rowIndex, columnIndex)"
      @mouseleave="onCellUnhover(rowIndex, columnIndex)"
    >
      <input
        class="my-table-row__input"
        type="text"
        :key="`input-${columnIndex}`"
        :value="cell"
        @input.stop="onInput(rowIndex, columnIndex, $event.target.value)"
      />
      <MyTableMoveControl
        class="my-table-row__move-control-left"
        axis="y"
        v-if="columnIndex === 0"
        @move="onRowMove"
        @move-start="onRowMoveStart"
        @move-end="onRowMoveEnd"
      />
      <MyTableMoveControl
        class="my-table-row__move-control-right"
        axis="x"
        v-if="rowIndex === 0"
        @move="onColumnMove"
        @move-start="onColumnMoveStart(columnIndex)"
        @move-end="onColumnMoveEnd"
      />
    </td>
    <th
      class="my-table-row__remove-cell"
      @mouseenter="onCellHover(rowIndex, -1)"
      @mouseleave="onCellUnhover(rowIndex, -1)"
    >
      <MyTableRemoveButton
        :class="[
          'my-table-row__remove-button',
          {
            'my-table-row__remove-button--hidden': highlightedRow !== rowIndex,
          },
        ]"
        @click="onRemoveRowClick"
        @mouseenter="onRemoveHover"
        @mouseleave="onRemoveUnhover"
      ></MyTableRemoveButton>
    </th>
  </tr>
</template>

<script lang="ts">
import { defineComponent, ref, PropType, computed } from 'vue'
import MyTableAddButton from './MyTableAddButton.vue'
import MyTableRemoveButton from './MyTableRemoveButton.vue'
import MyTableMoveControl from './MyTableMoveControl.vue'
import useHoverStates from '../hooks/useHoverStates'

export default defineComponent({
  name: 'MyTableRow',
  components: {
    MyTableAddButton,
    MyTableRemoveButton,
    MyTableMoveControl,
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
    highlightedRow: Number,
    highlightedColumn: Number,
    isRemoveColumnHighlighted: Boolean,
    isAddColumnHighlighted: Boolean,
    isRowMoving: Boolean,
    isAnyMoving: Boolean,
  },
  setup(props, { emit }) {
    const onInput = function(rowIndex: number, columnIndex: number, value: string) {
      emit('cell-input', rowIndex, columnIndex, value)
    }

    const onCellHover = function(rowIndex: number, columnIndex: number) {
      emit('cell-hover', rowIndex, columnIndex)
    }

    const onCellUnhover = function(rowIndex: number, columnIndex: number) {
      emit('cell-unhover', rowIndex, columnIndex)
    }

    const onAddRowClick = () => emit('row-add', props.rowIndex)

    const [isRemoveHovered, onRemoveHover, onRemoveUnhover] = useHoverStates()
    const [isAddHovered, onAddHover, onAddUnhover] = useHoverStates()

    const onRemoveRowClick = () => emit('row-remove', props.rowIndex)

    const onRowMove = (offset: number) => emit('row-move', offset)
    const onRowMoveStart = () => emit('row-move-start')
    const onRowMoveEnd = () => emit('row-move-end')

    const onColumnMove = (offset: number) => emit('column-move', offset)
    const onColumnMoveStart = (columnIndex: number) => emit('column-move-start', columnIndex)
    const onColumnMoveEnd = () => emit('column-move-end')

    const rootStyle = computed(() => {
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

    const getCellStyle = function(index: number) {
      const result: any = { transform: `translateX(${props.columnOffsets[index]}px)` }

      if (props.movingColumnIndex !== index && props.isAnyMoving) {
        result.transition = 'transform 0.2s'
      }
      if (props.isRowMoving) {
        result.position = 'relative'
        result.zIndex = 2
      }

      return result
    }

    return {
      onInput,
      onCellHover,
      onCellUnhover,
      onAddRowClick,
      isRemoveHovered,
      onRemoveHover,
      onRemoveUnhover,
      onRemoveRowClick,
      isAddHovered,
      onAddHover,
      onAddUnhover,
      onRowMove,
      onRowMoveEnd,
      onRowMoveStart,
      rootStyle,
      onColumnMove,
      onColumnMoveStart,
      onColumnMoveEnd,
      getCellStyle,
    }
  },
})
</script>

<style lang="scss" scoped>
.my-table-row {
  height: 40px;

  &:first-of-type {
    .my-table-row__cell:first-of-type {
      border-top-left-radius: var(--my-table-radius, var(--my-table-radius-default));
    }

    .my-table-row__cell:last-of-type {
      border-top-right-radius: var(--my-table-radius, var(--my-table-radius-default));
    }
  }

  &:last-of-type {
    .my-table-row__cell:first-of-type {
      border-bottom-left-radius: var(--my-table-radius, var(--my-table-radius-default));
    }

    .my-table-row__cell:last-of-type {
      border-bottom-right-radius: var(--my-table-radius, var(--my-table-radius-default));
    }
  }
}

.my-table-row--add-row-highlighted {
  position: relative;
  z-index: 1;
}

.my-table-row__input {
  border: none;
  height: 40px;
  width: 100px;
  text-align: center;
  background: transparent;
  padding: 0;
  transition: background-color 0.2s;

  &:hover {
    background-color: var(--my-table-cell-hover-color, var(--my-table-cell-hover-color-default));
  }
}

.my-table-row__cell {
  position: relative;
  background-color: var(--my-table-contrast-color, var(--my-table-contrast-color-default));
  border-top: 1px solid var(--my-table-border-color, var(--my-table-border-color-default));
  border-left: 1px solid var(--my-table-border-color, var(--my-table-border-color-default));
  box-shadow: 0.5px 0.5px 0 0.5px var(--my-table-border-color, var(--my-table-border-color-default));
  padding: 0;
}

.my-table-row__cell--highlighted {
  background-color: var(--my-table-line-hover-color, var(--my-table-line-hover-color-default));
}

.my-table-row__cell--highlighted.my-table-row__cell--add-row-highlighted {
  z-index: 1;
  box-shadow: 0.5px 0.5px 0 0.5px var(--my-table-border-color, var(--my-table-border-color-default)),
    0 4px 0 var(--my-table-accent-color, var(--my-table-accent-color-default));
}

.my-table-row__cell--highlighted.my-table-row__cell--add-column-highlighted {
  z-index: 1;
  box-shadow: 0.5px 0.5px 0 0.5px var(--my-table-border-color, var(--my-table-border-color-default)),
    4px 0 0 var(--my-table-accent-color, var(--my-table-accent-color-default));
}

.my-table-row__cell--highlighted.my-table-row__cell--remove-highlighted {
  background-color: var(--my-table-remove-hover-color, var(--my-table-remove-hover-color-default));
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

.my-table-row__move-control-left {
  position: absolute;
  top: 12px;
  cursor: ns-resize;
}

.my-table-row__move-control-right {
  position: absolute;
  top: 12px;
  right: 0;
  cursor: ew-resize;
}
</style>
