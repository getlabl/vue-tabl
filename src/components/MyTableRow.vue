<template>
  <tr class="my-table-row">
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
      />
    </th>
    <td
      :class="[
        'my-table-row__cell',
        {
          'my-table-row__cell--row-highlighted': rowIndex === highlightedRow,
          'my-table-row__cell--column-highlighted': columnIndex === highlightedColumn,
          'my-table-row__cell--add-row-highlighted': rowIndex === highlightedRow && highlightedColumn === -1,
          'my-table-row__cell--add-column-highlighted': columnIndex === highlightedColumn && highlightedRow === -1,
          'my-table-row__cell--remove-highlighted': isRemoveHovered || columnIndex === removeHighlightedColumn,
        },
      ]"
      v-for="(cell, columnIndex) in data"
      :key="`cell-${columnIndex}`"
    >
      <input
        :class="['my-table-row__input']"
        type="text"
        :key="`input-${columnIndex}`"
        :value="cell"
        @input.stop="onInput(rowIndex, columnIndex, $event.target.value)"
        @mouseenter="onCellHover(rowIndex, columnIndex)"
        @mouseleave="onCellUnhover(rowIndex, columnIndex)"
      />
    </td>
    <th class="my-table-row__remove-cell" @mouseenter="onRemoveHover" @mouseleave="onRemoveUnhover">
      <MyTableRemoveButton
        :class="[
          'my-table-row__remove-button',
          {
            'my-table-row__remove-button--hidden': highlightedRow !== rowIndex,
          },
        ]"
        @click="onRemoveRowClick"
      ></MyTableRemoveButton>
    </th>
  </tr>
</template>

<script lang="ts">
import { defineComponent, ref, PropType } from 'vue'
import MyTableAddButton from './MyTableAddButton.vue'
import MyTableRemoveButton from './MyTableRemoveButton.vue'

export default defineComponent({
  name: 'MyTableRow',
  components: {
    MyTableAddButton,
    MyTableRemoveButton,
  },
  props: {
    rowIndex: {
      type: Number,
      required: true,
    },
    data: {
      type: Array as PropType<string[]>,
      required: true,
    },
    highlightedRow: Number,
    highlightedColumn: Number,
    removeHighlightedColumn: Number,
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
    const onRemoveHover = function() {
      onCellHover(props.rowIndex, -1)
      isRemoveHovered.value = true
    }

    const onRemoveUnhover = function() {
      onCellUnhover(props.rowIndex, -1)
      isRemoveHovered.value = false
    }

    const onRemoveRowClick = () => emit('row-remove', props.rowIndex)

    return {
      onInput,
      onCellHover,
      onCellUnhover,
      onAddRowClick,
      isRemoveHovered,
      onRemoveHover,
      onRemoveUnhover,
      onRemoveRowClick,
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
    .my-table-row__cell {
      border-bottom: 1px solid var(--my-table-border-color, var(--my-table-border-color-default));
    }

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

.my-table-row__cell--row-highlighted,
.my-table-row__cell--column-highlighted {
  background-color: var(--my-table-line-hover-color, var(--my-table-line-hover-color-default));
}

.my-table-row__cell {
  border-top: 1px solid var(--my-table-border-color, var(--my-table-border-color-default));
  border-left: 1px solid var(--my-table-border-color, var(--my-table-border-color-default));
  padding: 0;

  &:last-of-type {
    border-right: 1px solid var(--my-table-border-color, var(--my-table-border-color-default));
  }
}

.my-table-row__cell--add-row-highlighted {
  z-index: 1;
  position: relative;
  box-shadow: 0 4px 0 var(--my-table-accent-color, var(--my-table-accent-color-default));
}

.my-table-row__cell--add-column-highlighted {
  z-index: 1;
  position: relative;
  box-shadow: 4px 0 0 var(--my-table-accent-color, var(--my-table-accent-color-default));
}

.my-table-row__cell--remove-highlighted {
  background-color: var(--my-table-remove-hover-color, var(--my-table-remove-hover-color-default));
  box-shadow: none;
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
