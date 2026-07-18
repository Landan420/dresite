import { useEffect, useRef, useState } from 'react'

export default function CountUp({ to, duration = 1200, className = '', suffix = '' }) {
  const ref = useRef(null)
  const [value, setValue] = useState(0)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => {
        if (!entries[0].isIntersecting) return
        obs.disconnect()
        const start = performance.now()
        function tick(now) {
          const t = Math.min(1, (now - start) / duration)
          const eased = 1 - Math.pow(1 - t, 3)
          setValue(Math.round(eased * to))
          if (t < 1) requestAnimationFrame(tick)
        }
        requestAnimationFrame(tick)
      },
      { threshold: 0.3 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [to, duration])

  return (
    <span ref={ref} className={`mono ${className}`}>
      {value.toLocaleString()}{suffix}
    </span>
  )
}
