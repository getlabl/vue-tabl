<template>
  <tr class="my-table-row">
    <th
      class="my-table-row__add-cell"
      @mouseenter="onCellHover(rowIndex, -1)"
      @mouseleave="onCellUnhover(rowIndex, -1)"
    >
      <MyTableAddButton class="my-table-row__add-button" v-if="highlightedRow === rowIndex" @click="onAddRowClick" />
    </th>
    <td class="my-table-row__cell" v-for="(cell, columnIndex) in data" :key="`cell-${columnIndex}`">
      <input
        :class="[
          'my-table-row__input',
          {
            'my-table-row__input--line-highlighted': rowIndex === highlightedRow || columnIndex === highlightedColumn,
          },
        ]"
        type="text"
        :key="`input-${columnIndex}`"
        :value="cell"
        @input.stop="onInput(rowIndex, columnIndex, $event.target.value)"
        @mouseenter="onCellHover(rowIndex, columnIndex)"
        @mouseleave="onCellUnhover(rowIndex, columnIndex)"
      />
    </td>
    <th>
      {{ rowIndex }}
    </th>
  </tr>
</template>

<script lang="ts">
import { defineComponent, PropType } from 'vue'
import MyTableAddButton from './MyTableAddButton.vue'

export default defineComponent({
  name: 'MyTableRow',
  components: {
    MyTableAddButton,
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

    return { onInput, onCellHover, onCellUnhover, onAddRowClick }
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

.my-table-row__input--line-highlighted {
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

.my-table-row__add-cell {
  padding: 0;
  width: 30px;
}

.my-table-row__add-button {
  margin-right: 8px;
}
</style>
