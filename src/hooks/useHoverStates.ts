import { ref, Ref } from 'vue'

export default function useHoverStates(): [Ref<boolean>, () => void, () => void] {
  const isHovered = ref(false)
  const onHover = () => (isHovered.value = true)
  const onUnhover = () => (isHovered.value = false)

  return [isHovered, onHover, onUnhover]
}
