import React, { useEffect, useRef } from 'react'

/**
 * Toast notification.
 * Props:
 *  message: string | null   – set to truthy string to show; null to hide
 */
export default function Toast({ message }) {
  const timerRef = useRef(null)
  const [visible, setVisible] = React.useState(false)

  useEffect(() => {
    if (message) {
      setVisible(true)
      clearTimeout(timerRef.current)
      timerRef.current = setTimeout(() => setVisible(false), 3000)
    }
  }, [message])

  if (!visible || !message) return null

  return (
    <div
      id="toast"
      className="absolute bottom-20 left-1/2 -translate-x-1/2 bg-black/75 text-white px-4 py-2 rounded-full text-[13px] z-40"
    >
      {message}
    </div>
  )
}
