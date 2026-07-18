import { useRef } from 'react'

/** Cursor-tracked glare, in the spirit of React Bits' Glare Hover — plain CSS custom
 *  properties driven by pointermove, no WebGL, cheap enough for a scrolling grid. */
export default function GlareCard({ children, className = '', style, as: Tag = 'div', ...rest }) {
  const ref = useRef(null)

  function handleMove(e) {
    const el = ref.current
    if (!el) return
    const rect = el.getBoundingClientRect()
    el.style.setProperty('--glare-x', `${((e.clientX - rect.left) / rect.width) * 100}%`)
    el.style.setProperty('--glare-y', `${((e.clientY - rect.top) / rect.height) * 100}%`)
    el.style.setProperty('--glare-o', '1')
  }

  function handleLeave() {
    ref.current?.style.setProperty('--glare-o', '0')
  }

  return (
    <Tag
      ref={ref}
      className={`glare-card ${className}`}
      style={style}
      onPointerMove={handleMove}
      onPointerLeave={handleLeave}
      {...rest}
    >
      {children}
    </Tag>
  )
}
