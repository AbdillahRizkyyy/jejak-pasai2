import { ref, watch } from 'vue'

export function useModal(modalId?: string) {
  const isOpen = ref(false)

  // Auto show/hide dialog element
  watch(isOpen, (newVal) => {
    if (modalId) {
      const dialog = document.getElementById(modalId) as HTMLDialogElement
      if (dialog) {
        if (newVal) {
          dialog.showModal()
        } else {
          dialog.close()
        }
      }
    }
  })

  function open() {
    isOpen.value = true
  }

  function close() {
    isOpen.value = false
  }

  function toggle() {
    isOpen.value = !isOpen.value
  }

  return { isOpen, open, close, toggle }
}
