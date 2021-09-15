<template>
  <td
    :class="[
      'my-table-row-cell',
      {
        'my-table-row-cell--highlighted': rowIndex === hoveredRowIndex || columnIndex === hoveredColumnIndex,
        'my-table-row-cell--add-row-highlighted': isAddButtonHovered,
        'my-table-row-cell--add-column-highlighted': isAddColumnHighlighted,
        'my-table-row-cell--remove-highlighted': isRemoveButtonHovered || isRemoveColumnHighlighted,
      },
    ]"
    :style="cellStyle"
    @mouseenter="onHover"
    @mouseleave="onUnhover"
  >
    <input
      class="my-table-row-cell__input"
      type="text"
      :value="value"
      @input.stop="onInput(rowIndex, columnIndex, $event.target.value)"
    />
    <VueTablMoveControl
      class="my-table-row-cell__move-control-left"
      axis="y"
      v-if="isVerticalMoveControlShown"
      @move="onRowMove"
      @move-start="onRowMoveStart"
      @move-end="onRowMoveEnd"
    />
    <VueTablMoveControl
      class="my-table-row-cell__move-control-right"
      axis="x"
      v-if="isHorizontalMoveControlShown"
      @move="onColumnMove"
      @move-start="onColumnMoveStart"
      @move-end="onColumnMoveEnd"
    />
  </td>
</template>

<script lang="ts">
import { computed, defineComponent } from 'vue'
import VueTablMoveControl from './VueTablMoveControl.vue'

export default defineComponent({
  name: 'VueTablRowCell',
  components: {
    VueTablMoveControl,
  },
  props: {
    value: String,
    rowIndex: {
      type: Number,
      required: true,
    },
    columnIndex: {
      type: Number,
      required: true,
    },
    columnOffset: {
      type: Number,
      required: true,
    },
    movingColumnIndex: {
      type: Number,
      required: true,
    },
    isAddButtonHovered: Boolean,
    isRemoveButtonHovered: Boolean,
    isRemoveColumnHighlighted: Boolean,
    isAddColumnHighlighted: Boolean,
    hoveredRowIndex: Number,
    hoveredColumnIndex: Number,
    isAnyMoving: Boolean,
    isFirstRowFixed: Boolean,
    isFirstColumnFixed: Boolean,
  },
  setup(props, { emit }) {
    const cellStyle = computed(() => {
      const result: any = { transform: `translateX(${props.columnOffset}px)` }

      if (props.movingColumnIndex !== props.columnIndex && props.isAnyMoving) {
        result.transition = 'transform 0.2s'
      }
      if (props.movingColumnIndex === props.columnIndex) {
        result.position = 'relative'
        result.zIndex = 2
      }

      return result
    })

    const onHover = () => emit('hover', props.rowIndex, props.columnIndex)
    const onUnhover = () => emit('unhover', props.rowIndex, props.columnIndex)

    const onRowMove = (offset: number) => emit('row-move', offset)
    const onRowMoveStart = () => emit('row-move-start')
    const onRowMoveEnd = () => emit('row-move-end')

    const onColumnMove = (offset: number) => emit('column-move', offset)
    const onColumnMoveStart = () => emit('column-move-start', props.columnIndex)
    const onColumnMoveEnd = () => emit('column-move-end')

    const onInput = function(rowIndex: number, columnIndex: number, value: string) {
      emit('input', rowIndex, columnIndex, value)
    }

    const isVerticalMoveControlShown = computed(
      () => props.columnIndex === 0 && !(props.rowIndex === 0 && props.isFirstRowFixed)
    )
    const isHorizontalMoveControlShown = computed(
      () => props.rowIndex === 0 && !(props.columnIndex === 0 && props.isFirstColumnFixed)
    )

    return {
      cellStyle,
      onHover,
      onUnhover,
      onRowMove,
      onRowMoveEnd,
      onRowMoveStart,
      onColumnMove,
      onColumnMoveStart,
      onColumnMoveEnd,
      onInput,
      isVerticalMoveControlShown,
      isHorizontalMoveControlShown,
    }
  },
})
</script>

<style lang="scss" scoped>
$text-color: var(--tabl-text-color, var(--tabl-text-color-default));
$cell-hover-color: var(--tabl-cell-hover-color, var(--tabl-cell-hover-color-default));
$contrast-color: var(--tabl-contrast-color, var(--tabl-contrast-color-default));
$border-color: var(--tabl-border-color, var(--tabl-border-color-default));
$line-hover-color: var(--tabl-line-hover-color, var(--tabl-line-hover-color-default));
$accent-color: var(--tabl-accent-color, var(--tabl-accent-color-default));
$remove-hover-color: var(--tabl-remove-hover-color, var(--tabl-remove-hover-color-default));

.my-table-row-cell__input {
  border: none;
  height: 40px;
  width: 100px;
  text-align: center;
  background: transparent;
  padding: 0;
  transition: background-color 0.2s;
  color: $text-color;

  &:hover {
    background-color: $cell-hover-color;
  }
}

.my-table-row-cell {
  position: relative;
  background-color: $contrast-color;
  border-top: 1px solid $border-color;
  border-left: 1px solid $border-color;
  box-shadow: 0.5px 0.5px 0 0.5px $border-color;
  padding: 0;
}

.my-table-row-cell--highlighted {
  background-color: $line-hover-color;
}

.my-table-row-cell--highlighted.my-table-row-cell--add-row-highlighted {
  z-index: 1;
  box-shadow: 0.5px 0.5px 0 0.5px $border-color, 0 4px 0 $accent-color;
}

.my-table-row-cell--highlighted.my-table-row-cell--add-column-highlighted {
  z-index: 1;
  box-shadow: 0.5px 0.5px 0 0.5px $border-color, 4px 0 0 $accent-color;
}

.my-table-row-cell--highlighted.my-table-row-cell--remove-highlighted {
  background-color: $remove-hover-color;
}

.my-table-row-cell__move-control-left {
  position: absolute;
  top: 12px;
  cursor: ns-resize;
}

.my-table-row-cell__move-control-right {
  position: absolute;
  top: 12px;
  right: 0;
  cursor: ew-resize;
}
</style>
