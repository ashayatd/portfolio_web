import Hero from "@/components/sections/Hero";
import Building from "@/components/sections/Building/index";
import StarrySkyLayout from "@/components/sections/Building/Background";
import Scalablility from "@/components/sections/Scalable";
import StatsSection from "@/components/sections/Profile";
import SceneWithGlassFrame from "@/components/sections/CommonShocase/SceneWithGlassFrame";
import TechStackGrid from "@/components/sections/Hero/TechnologyUsed/TechStackGrid";
import { BuildingB } from "@/components/sections/Hero/simpleWorld/BuildingB";
import HorizontalTimeline from "@/components/sections/Hero/Experience/Experience";
import About from "@/components/sections/About/About";
import { BuildingD } from "@/components/sections/Hero/simpleWorld/BuildingD";
import { BuildingC } from "@/components/sections/Hero/simpleWorld/BuildingC";
import { BuildingA } from "@/components/sections/Hero/simpleWorld/BuildingA";
import { Fountain } from "@/components/sections/Hero/simpleWorld/CenterFountain";
import EngineeringCapabilities from "@/components/sections/Skills/EngineeringCapabilities";
import Projects from "@/components/sections/Projects/Projects";

export default function Home() {
  return (
    <main className="bg-[#0D0F10] text-white">
      <div id="home" className="scroll-mt-24">
        <Hero />
      </div>
      {/* Tolls page */}

      <div id="projects" className="scroll-mt-24">
        <SceneWithGlassFrame
          buildingModel={<Fountain />}
          foregroundContent={<Projects />}
        />
      </div>

      <div id="skills" className="scroll-mt-24">
        <SceneWithGlassFrame
          buildingModel={<Fountain />}
          foregroundContent={<EngineeringCapabilities />}
        />
      </div>

      <div id="experience" className="scroll-mt-24">
        <HorizontalTimeline />
      </div>

      <div id="tech" className="scroll-mt-24">
        <SceneWithGlassFrame
          buildingModel={<BuildingB />}
          foregroundContent={<TechStackGrid />}
        />
      </div>

      <div id="about" className="scroll-mt-24">
        <SceneWithGlassFrame
          buildingModel={<Fountain />}
          foregroundContent={<About />}
        />
      </div>


      {/* <StarrySkyLayout>
        <Building />
        <Scalablility />
      </StarrySkyLayout>
      <StatsSection /> */}
    </main>
  );
}
