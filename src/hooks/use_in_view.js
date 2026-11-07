import { useEffect, useRef, useState } from 'react'

// tiny wrapper around IntersectionObserver
// used so the replay only ticks while someone can actually see it
export function use_in_view(margin_str = '0px') {
  const box_ref = useRef(null)
  const [is_visible, set_is_visible] = useState(false)

  useEffect(() => {
    const el = box_ref.current
    if (!el) return
    // old browsers: just pretend its visible
    if (!('IntersectionObserver' in window)) {
      set_is_visible(true)
      return
    }
    const obs = new IntersectionObserver(
      (entries) => set_is_visible(entries[0].isIntersecting),
      { rootMargin: margin_str }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [margin_str])

  return [box_ref, is_visible]
}

// true if the person asked their OS for less motion
export function wants_less_motion() {
  if (typeof window === 'undefined' || !window.matchMedia) return false
  return window.matchMedia('(prefers-reduced-motion: reduce)').matches
}
