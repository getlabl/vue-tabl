<template>
  <div ref="controlElement" class="my-table-move-control" @mousedown.prevent="onMouseDown">
    <svg width="8" height="8" viewBox="0 0 8 8" fill="none" xmlns="http://www.w3.org/2000/svg">
      <g opacity="0.5">
        <path d="M7 1H1" stroke="#999999" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7 4H1" stroke="#999999" stroke-linecap="round" stroke-linejoin="round" />
        <path d="M7 7H1" stroke="#999999" stroke-linecap="round" stroke-linejoin="round" />
      </g>
    </svg>
  </div>
</template>

<script lang="ts">
import { defineComponent, ref } from 'vue'

export default defineComponent({
  name: 'VueTablMoveControl',
  props: {
    axis: {
      type: String,
      default: () => 'x',
      validator: (value: string) => value === 'x' || value === 'y',
    },
  },
  setup(props, { emit }) {
    const controlElement = ref(null as HTMLElement | null)

    const onMouseDown = function(mouseDownEvent: MouseEvent) {
      emit('move-start')

      const onMouseMove = function(mouseMoveEvent: MouseEvent) {
        if (!controlElement.value) return

        // const elementClientRect = controlElement.value.getBoundingClientRect()
        // const elementX = elementClientRect.left + mouseDownEvent.offsetX
        // const elementY = elementClientRect.top + mouseDownEvent.offsetY

        // const offsetX = mouseMoveEvent.pageX - elementX
        // const offsetY = mouseMoveEvent.pageY - elementY

        const offsetX = mouseMoveEvent.pageX - mouseDownEvent.pageX
        const offsetY = mouseMoveEvent.pageY - mouseDownEvent.pageY

        if (props.axis === 'x') emit('move', offsetX)
        if (props.axis === 'y') emit('move', offsetY)
      }

      const onMouseUp = function(mouseUpEvent: MouseEvent) {
        document.removeEventListener('mouseup', onMouseUp)
        document.removeEventListener('mousemove', onMouseMove)
        emit('move-end')
      }

      document.addEventListener('mousemove', onMouseMove)
      document.addEventListener('mouseup', onMouseUp)
    }

    return { onMouseDown, controlElement }
  },
})
</script>

<style lang="scss" scoped>
.my-table-move-control {
  width: 16px;
  height: 16px;
  display: flex;
  align-items: center;
  justify-content: center;
}
</style>
