"use client";

export default function QuoteSection() {
  return (
    <div className="mt-6 bg-zinc-900/40 border border-zinc-800/60 rounded-xl p-5">
      <div className="flex gap-3">
        <span className="text-green-500 text-2xl font-serif leading-none mt-[-2px]">"</span>
        <div>
          <p className="text-zinc-300 text-[13px] leading-[1.6]">
            I don't just ship features.<br />
            I build systems that create value.
          </p>
          <p className="text-green-500 text-[11px] font-medium mt-2">— Today</p>
        </div>
      </div>
    </div>
  );
}