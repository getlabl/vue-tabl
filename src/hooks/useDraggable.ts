import { computed, ref, Ref } from 'vue'

type DraggableHook = [
  Ref<number>,
  Ref<boolean>,
  (index: number) => void,
  () => void,
  (offset: number) => void,
  (index: number) => number
]

export default function useDraggable(
  elementSize: number,
  draggableCount: Ref<number>,
  moveElement: Ref<(index: number, offset: number) => void>,
  isFirstElementFixed: Ref<boolean>
): DraggableHook {
  const movingElementIndex = ref(-1)
  const movingElementOffsetInLines = ref(0)
  const movingElementOffsetInPixels = ref(0)
  const isMoving = computed(() => movingElementIndex.value !== -1)

  const onElementMoveStart = (index: number) => (movingElementIndex.value = index)
  const onElementMoveEnd = function() {
    moveElement.value(movingElementIndex.value, movingElementOffsetInLines.value)
    movingElementIndex.value = -1
    movingElementOffsetInLines.value = 0
    movingElementOffsetInPixels.value = 0
  }

  const onElementMove = function(offset: number) {
    const sign = offset / Math.abs(offset)
    let offsetInElements = Math.round(Math.abs(offset / elementSize)) * sign
    offsetInElements = Math.max(offsetInElements, -movingElementIndex.value + (isFirstElementFixed.value ? 1 : 0))
    offsetInElements = Math.min(offsetInElements, draggableCount.value - movingElementIndex.value - 1)

    if (!isNaN(offsetInElements)) movingElementOffsetInLines.value = offsetInElements

    movingElementOffsetInPixels.value = Math.min(
      Math.max((-movingElementIndex.value + (isFirstElementFixed.value ? 1 : 0)) * elementSize, offset),
      (draggableCount.value - movingElementIndex.value - 1) * elementSize
    )
  }

  const getElementOffset = function(index: number) {
    if (movingElementIndex.value === index) return movingElementOffsetInPixels.value
    if (movingElementIndex.value === -1) return 0

    if (movingElementOffsetInLines.value !== 0) {
      if (index >= movingElementIndex.value + movingElementOffsetInLines.value && index <= movingElementIndex.value)
        return elementSize

      if (index <= movingElementIndex.value + movingElementOffsetInLines.value && index > movingElementIndex.value)
        return -elementSize
    }

    return 0
  }

  return [movingElementIndex, isMoving, onElementMoveStart, onElementMoveEnd, onElementMove, getElementOffset]
}
