import React from 'react'
import { LEG_COLORS } from '../lib/mapUtils.js'

/**
 * HUD — top-right overlay.
 * Props:
 *  legs:       [{ distance: { text }, duration: { text } }] | null
 *  live:       { kmh, distKm, totalDistKm, simT, remSec } | null
 *  fmtDur:     (sec) => string**/
export default function HUD({ legs, live, fmtDur, simActive, isPaused, onTogglePause }) {
  return (
    <div
      id="hud"
      className="absolute top-3.5 right-3.5 z-30 flex flex-col gap-2.5 pointer-events-none"
      style={{ maxWidth: 280 }}
    >
      {/* Route card */}
      <div className="card">
        {legs === null ? (
          <h4 className="text-[#64b5f6] text-[11px] uppercase tracking-widest mb-2">
            Loading route…
          </h4>
        ) : (
          <>
            <h4 className="text-[#64b5f6] text-[11px] uppercase tracking-widest mb-2">Route</h4>
            {legs.map((leg, i) => (
              <div key={i} className="flex items-center gap-2 my-0.5">
                <div
                  className="w-[22px] h-[5px] rounded-sm flex-shrink-0"
                  style={{ background: LEG_COLORS[i % LEG_COLORS.length] }}
                />
                <span className="text-white text-[13px]">
                  {leg.distance.text} · {leg.duration.text}
                </span>
              </div>
            ))}
          </>
        )}
      </div>

      {/* Live status card */}
      {live && (
        <div className="card">
          <div className="flex items-center justify-between mb-2">
            <h4 className="text-[#64b5f6] text-[11px] uppercase tracking-widest">
              Live Status
            </h4>
            {/* Controls */}
            {simActive && (
              <div className="flex items-center gap-2 pointer-events-auto">
                <button
                  onClick={onTogglePause}
                  className="text-[10px] font-bold px-2 py-0.5 rounded-md border border-white/20 text-white hover:bg-white/10 hover:border-white/40 transition-colors"
                  title={isPaused ? "Resume simulation" : "Pause simulation"}
                >
                  {isPaused ? "▶ Resume" : "⏸ Pause"}
                </button>
              </div>
            )}
          </div>
          <div className="grid grid-cols-2 gap-x-5 gap-y-1.5">
            <div>
              <div className="text-[#78909c] text-[11px] mb-[1px]">Speed</div>
              <div className="text-[15px] font-bold text-[#a5d6a7]">{live.kmh} km/h</div>
            </div>
            <div>
              <div className="text-[#78909c] text-[11px] mb-[1px]">ETA</div>
              <div className="text-[15px] font-bold text-[#ffe082]">{fmtDur(live.remSec)}</div>
            </div>
            <div>
              <div className="text-[#78909c] text-[11px] mb-[1px]">Distance</div>
              <div className="text-[15px] font-bold text-[#90caf9]">
                {live.distKm} / {live.totalDistKm} km
              </div>
            </div>
            <div>
              <div className="text-[#78909c] text-[11px] mb-[1px]">Sim time</div>
              <div className="text-[15px] font-bold text-[#ce93d8]">{fmtDur(live.simT)}</div>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
