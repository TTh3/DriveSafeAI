import { RotateCcw, Play, FastForward } from "lucide-react";

/**
 * Bottom-centre simulation controls line.
 * Props:
 *  btnLabel: string
 *  btnDisabled: boolean
 *  simActive: boolean
 *  multiplier: number
 *  onStart: () => void
 *  onSetMultiplier: (m: number) => void
 *  onReset: () => void
 */
export default function Controls({ 
  btnLabel, 
  btnDisabled, 
  simActive, 
  multiplier, 
  onStart, 
  onSetMultiplier, 
  onReset 
}) {
  return (
    <div
      id="controls"
      className="absolute bottom-7 left-1/2 -translate-x-1/2 z-30 flex items-center gap-3 backdrop-blur-md bg-black/40 p-2 rounded-full border border-white/10"
    >
      {!simActive ? (
        <button
          id="startBtn"
          disabled={btnDisabled}
          onClick={onStart}
        className={[
          "text-white border-none rounded-full px-10 py-3 text-[14px] font-bold tracking-[0.5px] transition-all duration-200",
          btnDisabled
            ? "bg-[#333] shadow-none cursor-default"
            : "bg-gradient-to-br from-[#1565c0] to-[#0d47a1] shadow-[0_4px_18px_rgba(21,101,192,0.55)] cursor-pointer hover:-translate-y-0.5 hover:shadow-[0_8px_24px_rgba(21,101,192,0.7)]",
        ].join(" ")}
      >
          {btnLabel}
        </button>
      ) : (
        <>
          <button
            onClick={onReset}
            className="flex items-center gap-1.5 px-4 py-2 text-xs font-bold text-[#ef5350] bg-white/5 hover:bg-white/10 rounded-full transition-colors border border-transparent hover:border-[#ef5350]/30"
            title="Clear route & choose a new one"
          >
            <RotateCcw size={14} /> Reset Route
          </button>
          
          <div className="w-[1px] h-6 bg-white/20 mx-1" />
          
          <div className="flex bg-white/5 rounded-full p-1 border border-white/10">
            {[1, 5, 10].map(m => (
              <button
                key={m}
                onClick={() => onSetMultiplier(m)}
                className={`
                  flex items-center gap-1 px-3 py-1.5 text-xs font-bold rounded-full transition-all duration-200
                  ${multiplier === m 
                      ? "bg-[#64b5f6] text-[#0d1522] shadow-[0_0_10px_rgba(100,181,246,0.3)]" 
                      : "text-white/70 hover:text-white hover:bg-white/10"}
                `}
              >
                {m === 1 ? <Play size={12} fill="currentColor" /> : <FastForward size={12} fill="currentColor" />}
                {m}x
              </button>
            ))}
          </div>
        </>
      )}
    </div>
  );
}
