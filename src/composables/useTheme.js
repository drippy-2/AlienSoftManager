import { ref, watch, onMounted } from 'vue'

const isDark = ref(false)

export function useTheme() {
  const initTheme = () => {
    // Check localStorage first
    const saved = localStorage.getItem('theme')
    
    if (saved) {
      isDark.value = saved === 'dark'
    } else {
      // Check system preference
      isDark.value = window.matchMedia('(prefers-color-scheme: dark)').matches
    }
    
    applyTheme()
  }

  const applyTheme = () => {
    if (isDark.value) {
      document.documentElement.classList.add('dark')
    } else {
      document.documentElement.classList.remove('dark')
    }
    localStorage.setItem('theme', isDark.value ? 'dark' : 'light')
  }

  const toggleTheme = () => {
    isDark.value = !isDark.value
  }

  watch(isDark, applyTheme)

  return {
    isDark,
    initTheme,
    toggleTheme
  }
}
