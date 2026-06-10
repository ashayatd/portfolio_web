import Image from "next/image";
import Timeline from "./Timeline";
import QuoteSection from "./QuoteSection";
import SkillsSection from "./SkillsSection";
import ProblemSolving from "./ProblemSolving";
import StatsSection from "./StatsSection";


export default function ProfileSection() {
  return (
    <main className="min-h-screen bg-[#0a0a0a] text-white">
      <div className="max-w-[1280px] mx-auto px-6 py-10">
        
        {/* Main Grid - 3 columns */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 lg:gap-8">
          
          {/* LEFT COLUMN - Timeline (5 cols) */}
          <div className="lg:col-span-5">
            {/* Header */}
            <div className="mb-6">
              <p className="text-green-500 text-[11px] font-semibold tracking-[0.15em] uppercase mb-3">
                THE ENGINEER
              </p>
              <h1 className="text-[42px] font-bold leading-[1.1] tracking-tight">
                My Journey.<br />
                <span className="text-green-500">My Evolution.</span>
              </h1>
            </div>
            
            <Timeline />
            <QuoteSection />
          </div>

          {/* CENTER COLUMN - Hero Image (4 cols) */}
          <div className="lg:col-span-4 flex flex-col items-center relative">
            {/* Green glow behind image */}
            <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
              <div className="w-[280px] h-[400px] bg-green-500/10 rounded-full blur-[100px]"></div>
            </div>
            
            <div className="relative w-full aspect-[3/4] max-w-[320px] z-10">
              <Image
                src="/assets/image123.png"
                alt="Product Engineer"
                fill
                className="object-contain"
                priority
              />
            </div>
            
            {/* Text below image */}
            <div className="text-center mt-2 z-10">
              <p className="text-green-500 text-[11px] font-semibold tracking-[0.15em] uppercase mb-2">
                PRODUCT ENGINEER
              </p>
              <h2 className="text-[28px] font-bold leading-[1.15]">
                Building systems that<br />
                solve <span className="text-green-500">real problems.</span>
              </h2>
              <div className="flex items-center justify-center gap-2 mt-3 text-[13px] text-zinc-500">
                <span>Business Value</span>
                <span className="w-1 h-1 rounded-full bg-green-500"></span>
                <span>Performance</span>
                <span className="w-1 h-1 rounded-full bg-green-500"></span>
                <span>Reliability</span>
                <span className="w-1 h-1 rounded-full bg-green-500"></span>
                <span>Scalability</span>
              </div>
            </div>
          </div>

          {/* RIGHT COLUMN - Skills (3 cols) */}
          <div className="lg:col-span-3">
            <SkillsSection />
            <ProblemSolving />
          </div>
        </div>

        {/* Bottom Stats Section */}
        <div className="mt-10">
          <StatsSection />
        </div>

      </div>
    </main>
  );
}