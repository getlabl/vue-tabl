<template>
  <thead>
    <th></th>
    <th
      class="my-table-column-buttons__cell"
      v-for="(_, columnIndex) in columnRange"
      :key="columnIndex"
      @mouseenter="onCellHover(columnIndex)"
      @mouseleave="onCellUnhover(columnIndex)"
    >
      <Component
        tabindex="-1"
        :is="buttonComponent"
        :class="[
          'my-table-column-buttons__button',
          {
            'my-table-column-buttons__button--hidden': columnIndex !== hoveredColumnIndex,
          },
        ]"
        @click="onButtonClick(columnIndex)"
        @mouseenter="onButtonHover(columnIndex)"
        @mouseleave="onButtonUnhover(columnIndex)"
      />
    </th>
  </thead>
</template>

<script lang="ts">
import { defineComponent, computed, PropType, Component } from 'vue'
import range from '../util/range'

export default defineComponent({
  name: 'MyTableColumnAddButtons',
  props: {
    columnCount: {
      type: Number,
      required: true,
    },
    hoveredColumnIndex: Number,
    buttonComponent: {
      type: Object as PropType<Component>,
    },
  },
  setup(props, { emit }) {
    const columnRange = computed(() => range(props.columnCount))

    const onCellHover = (index: number) => emit('cell-hover', index)
    const onCellUnhover = (index: number) => emit('cell-unhover', index)

    const onButtonHover = (index: number) => emit('button-hover', index)
    const onButtonUnhover = (index: number) => emit('button-unhover', index)

    const onButtonClick = (index: number) => emit('button-click', index)

    return { columnRange, onCellHover, onCellUnhover, onButtonHover, onButtonUnhover, onButtonClick }
  },
})
</script>

<style lang="scss" scoped>
.my-table-column-buttons__cell {
  padding: 0;
  height: 38px;
}

.my-table-column-buttons__button--hidden {
  opacity: 0;
}
</style>
