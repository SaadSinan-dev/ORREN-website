import { useSyncExternalStore } from 'react'

const subscribe = (callback: () => void) => {
  const query = window.matchMedia('(prefers-reduced-motion: reduce)')
  query.addEventListener('change', callback)
  return () => query.removeEventListener('change', callback)
}
const getSnapshot = () => window.matchMedia('(prefers-reduced-motion: reduce)').matches

export default function useReducedMotion() {
  return useSyncExternalStore(subscribe, getSnapshot, () => false)
}
