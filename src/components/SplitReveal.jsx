import { useEffect, useRef, useState } from 'react'

/** Staggered character reveal, in the spirit of React Bits' Split Text — reimplemented
 *  in plain CSS transitions (no gsap) to keep the bundle light for mobile. */
export default function SplitReveal({ text, tag: Tag = 'span', delay = 18, className = '' }) {
  const ref = useRef(null)
  const [visible, setVisible] = useState(false)

  useEffect(() => {
    const el = ref.current
    if (!el) return
    const obs = new IntersectionObserver(
      entries => { if (entries[0].isIntersecting) { setVisible(true); obs.disconnect() } },
      { threshold: 0.2 }
    )
    obs.observe(el)
    return () => obs.disconnect()
  }, [])

  const words = text.split(' ')
  let charIndex = 0

  return (
    <Tag ref={ref} className={className} aria-label={text}>
      {words.map((word, wi) => (
        <span key={wi} style={{ display: 'inline-block', whiteSpace: 'nowrap' }} aria-hidden="true">
          {word.split('').map((ch, ci) => {
            const i = charIndex++
            return (
              <span
                key={ci}
                style={{
                  display: 'inline-block',
                  opacity: visible ? 1 : 0,
                  transform: visible ? 'translateY(0)' : 'translateY(0.4em)',
                  transition: `opacity 0.5s ease ${i * delay}ms, transform 0.5s cubic-bezier(.2,.8,.2,1) ${i * delay}ms`,
                }}
              >
                {ch}
              </span>
            )
          })}
          {wi < words.length - 1 ? ' ' : ''}
        </span>
      ))}
    </Tag>
  )
}
