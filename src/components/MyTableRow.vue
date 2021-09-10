<template>
  <tr
    class="my-table-row"
    :style="{
      transform: `translateY(${rowOffset}px)`,
    }"
  >
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
      v-for="(cell, columnIndex) in data"
      :key="`cell-${columnIndex}`"
      @mouseenter="onCellHover(rowIndex, columnIndex)"
      @mouseleave="onCellUnhover(rowIndex, columnIndex)"
    >
      <input
        :class="['my-table-row__input']"
        type="text"
        :key="`input-${columnIndex}`"
        :value="cell"
        @input.stop="onInput(rowIndex, columnIndex, $event.target.value)"
      />
      <MyTableMoveControl
        class="my-table-row__move-control"
        axis="y"
        v-if="columnIndex === 0"
        @move="onMove"
        @move-start="onMoveStart"
        @move-end="onMoveEnd"
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
import { defineComponent, ref, PropType } from 'vue'
import MyTableAddButton from './MyTableAddButton.vue'
import MyTableRemoveButton from './MyTableRemoveButton.vue'
import MyTableMoveControl from './MyTableMoveControl.vue'

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
    highlightedRow: Number,
    highlightedColumn: Number,
    isRemoveColumnHighlighted: Boolean,
    isAddColumnHighlighted: Boolean,
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

    const isRemoveHovered = ref(false)
    const onRemoveHover = () => (isRemoveHovered.value = true)
    const onRemoveUnhover = () => (isRemoveHovered.value = false)

    const isAddHovered = ref(false)
    const onAddHover = () => (isAddHovered.value = true)
    const onAddUnhover = () => (isAddHovered.value = false)

    const onRemoveRowClick = () => emit('row-remove', props.rowIndex)

    const rowOffset = ref(0)

    const onMove = function(offset: number) {
      const sign = offset / Math.abs(offset)
      let offsetInRows = Math.round(Math.abs(offset / 42)) * sign
      offsetInRows = Math.max(offsetInRows, -props.rowIndex)
      offsetInRows = Math.min(offsetInRows, props.rowCount - props.rowIndex - 1)

      if (!isNaN(offsetInRows)) emit('row-move', offsetInRows)

      rowOffset.value = Math.min(Math.max(props.rowIndex * -41, offset), (props.rowCount - props.rowIndex - 1) * 41)

      console.log('Row move: ' + offsetInRows)
    }

    const onMoveStart = () => emit('row-move-start')

    const onMoveEnd = function() {
      rowOffset.value = 0
      emit('row-move-end')
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
      onMove,
      rowOffset,
      onMoveEnd,
      onMoveStart,
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

.my-table-row__move-control {
  position: absolute;
  top: 12px;
}
</style>
