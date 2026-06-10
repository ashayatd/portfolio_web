"use client";

import { SlotText } from "@/components/effects/SlotText";
import { MAGIC_SCRAMBLE, MAGIC_TITLE_WORDS } from "./constants";

type BuildingProps = {
  trigger?: boolean;
  collapseTitles?: boolean;
};

export default function Building({
  trigger = false,
  collapseTitles = false,
}: BuildingProps) {
  return (
    <div
      className={`sticky top-24 z-0 flex justify-center transition-all duration-700 ${
        collapseTitles ? "scale-110" : "scale-100"
      }`}
    >
      <h1 className="text-center text-[clamp(3rem,10vw,8rem)] font-black leading-[0.9] tracking-tight text-white">
        <SlotText
          text={MAGIC_TITLE_WORDS.building}
          trigger={trigger}
          speed={MAGIC_SCRAMBLE.buildingSpeed}
          stagger={MAGIC_SCRAMBLE.stagger}
          className="inline-block"
        />
      </h1>
    </div>
  );
}
