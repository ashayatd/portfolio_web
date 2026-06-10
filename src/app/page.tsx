import Hero from "@/components/sections/Hero";
import Building from "@/components/sections/Building/index";
import StarrySkyLayout from "@/components/sections/Building/Background";
import Scalablility from "@/components/sections/Scalable";
import StatsSection from "@/components/sections/Profile";

export default function Home() {
  return (
    <main className="bg-[#0D0F10] text-white">
      <Hero />
      <StarrySkyLayout>
        <Building />
        <Scalablility />
      </StarrySkyLayout>
      <StatsSection />
    </main>
  );
}
