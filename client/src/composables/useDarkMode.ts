import { useDark, useToggle } from '@vueuse/core'

export function useDarkMode() {
  const isDark = useDark({
    storageKey: 'theme',
    attribute: 'data-theme',
    valueDark: 'dark',
    valueLight: 'emerald',
  })

  const toggleDark = useToggle(isDark)

  return {
    isDark,
    toggleDark,
  }
}
