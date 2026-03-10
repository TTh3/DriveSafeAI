import React from 'react'

/**
 * DrivingFeedbackPanel — left-side panel showing real-time driving tips based on the route.
 *
 * Props:
 *   feedback: { rawInstruction, title, icon, tip } | null
 *   country: { code, name, handbook } | null
 */
export default function DrivingFeedbackPanel({ feedback, country }) {
  if (!feedback) return null;

  return (
    <div
      className="absolute left-3 top-1/2 -translate-y-1/2 z-30 flex flex-col gap-2 pointer-events-none"
      style={{ width: 260 }}
    >
      <div className="bg-[rgba(6,6,20,0.95)] backdrop-blur-md border border-[#ffb74d]/40 rounded-xl px-4 py-4 shadow-[0_0_20px_rgba(255,183,77,0.15)] pointer-events-auto">
        <h4 className="text-[#ffb74d] text-[11px] uppercase tracking-widest font-bold mb-3 flex items-center gap-1.5">
          <span className="text-[14px]">🧭</span> AI Planning
        </h4>

        {/* Current Instruction from Map */}
        <div className="mb-3 pb-3 border-b border-white/10">
          <div className="text-[#a5d6a7] text-[13px] font-semibold mb-1 flex items-start gap-2">
            <span className="text-[14px] leading-tight">{feedback.icon}</span>
            <span className="leading-tight">{feedback.rawInstruction}</span>
          </div>
          <p className="text-[#78909c] text-[10px] uppercase tracking-wider pl-6">
            Active Maneuver
          </p>
        </div>

        {/* Safety tip mapping */}
        <div className="bg-[#ffb74d]/10 rounded-lg p-2.5 border border-[#ffb74d]/20 mb-3">
          <h5 className="text-[#ffecb3] text-[11px] font-bold mb-1">💡 Safety Driving Tip</h5>
          <p className="text-[#ffe082]/90 text-[11px] leading-relaxed">
            {feedback.tip}
          </p>
        </div>

        {/* Specific Rule / Handbook Link */}
        {((country && country.handbook) || feedback.ruleUrl) && (
          <div className="pt-3 border-t border-white/10 flex flex-col gap-2 pointer-events-auto">
            <span className="text-[#90caf9] text-[10px] uppercase tracking-wider">
              {country ? `${country.code} Road Rules` : 'Road Rules'}
            </span>
            {feedback.ruleDesc && (
              <p className="text-[#90caf9]/80 text-[10px] leading-relaxed italic mb-1">
                "{feedback.ruleDesc}"
              </p>
            )}
            <a 
              href={feedback.ruleUrl || country?.handbook} 
              target="_blank" 
              rel="noreferrer"
              className="text-[#64b5f6] hover:text-white bg-[#64b5f6]/10 hover:bg-[#64b5f6]/20 py-1.5 px-3 rounded text-[11px] font-semibold transition-colors flex items-center justify-between gap-2 border border-[#64b5f6]/20 hover:border-[#64b5f6]/50"
            >
              <span>Read {feedback.ruleName || "Driver's Handbook"}</span>
              <span>↗</span>
            </a>
          </div>
        )}
      </div>
    </div>
  )
}
