import { nextTick, onBeforeUnmount, onMounted, ref, watch } from 'vue'

export function useActivityHeroAnimation(selectedActivity) {
  const detailVisualRef = ref(null)
  const detailIconRef = ref(null)
  let resizeObserver = null

  function updateDockStartPosition() {
    if (!detailVisualRef.value || !detailIconRef.value) return

    const visualRect = detailVisualRef.value.getBoundingClientRect()
    const iconRect = detailIconRef.value.getBoundingClientRect()
    const visualCenterX = visualRect.left + visualRect.width / 2
    const visualCenterY = visualRect.top + visualRect.height / 2
    const iconCenterX = iconRect.left + iconRect.width / 2
    const iconCenterY = iconRect.top + iconRect.height / 2

    detailVisualRef.value.style.setProperty('--dock-start-x', `${visualCenterX - iconCenterX}px`)
    detailVisualRef.value.style.setProperty('--dock-start-y', `${visualCenterY - iconCenterY}px`)
  }

  watch(
    () => selectedActivity.value?.id,
    async () => {
      await nextTick()
      updateDockStartPosition()
    },
  )

  onMounted(() => {
    updateDockStartPosition()

    if (typeof ResizeObserver !== 'undefined') {
      resizeObserver = new ResizeObserver(updateDockStartPosition)
      if (detailVisualRef.value) resizeObserver.observe(detailVisualRef.value)
    }
  })

  onBeforeUnmount(() => {
    resizeObserver?.disconnect()
  })

  return {
    detailVisualRef,
    detailIconRef,
  }
}
