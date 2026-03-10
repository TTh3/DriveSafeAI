import React from 'react'

/**
 * Bottom progress bar.
 * Props:
 *  progress: number  0–1, or null to hide
 */
export default function ProgressBar({ progress }) {
  if (progress === null) return null
  return (
    <div
      id="prog"
      className="absolute bottom-0 left-0 right-0 h-1 bg-white/15 z-30"
    >
      <div id="prog-fill" style={{ width: `${(progress * 100).toFixed(2)}%` }} />
    </div>
  )
}
