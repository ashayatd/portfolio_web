import { useEffect } from "react";
import { useTransform, type MotionValue } from "framer-motion";
import { continueAnimationRanges } from "./animations";

export function useContinueAnimations(scrollProgress: MotionValue<number>) {
  const continueOpacity = useTransform(
    scrollProgress,
    continueAnimationRanges.sceneReveal.opacityInput,
    continueAnimationRanges.sceneReveal.opacityOutput,
  );

  const continueScale = useTransform(
    scrollProgress,
    continueAnimationRanges.sceneReveal.scaleInput,
    continueAnimationRanges.sceneReveal.scaleOutput,
  );

  const continueBlur = useTransform(
    scrollProgress,
    continueAnimationRanges.sceneReveal.blurInput,
    continueAnimationRanges.sceneReveal.blurOutput,
  );

  const bottomBarOpacity = useTransform(
    scrollProgress,
    continueAnimationRanges.bottomBar.opacityInput,
    continueAnimationRanges.bottomBar.opacityOutput,
  );

  useEffect(() => {
    return scrollProgress.on("change", (value) => {
      console.log(`[Continue] scroll progress: ${value.toFixed(3)}`);
    });
  }, [scrollProgress]);

  useEffect(() => {
    return continueOpacity.on("change", (value) => {
      if (value === 1) console.log("[Continue:Scene] fully visible");
      if (value === 0) console.log("[Continue:Scene] fully hidden");
      if (value > 0 && value < 1) {
        console.log(`[Continue:Scene] fading in opacity: ${value.toFixed(3)}`);
      }
    });
  }, [continueOpacity]);

  useEffect(() => {
    return continueScale.on("change", (value) => {
      console.log(`[Continue:Scene] scale: ${value.toFixed(3)}`);
    });
  }, [continueScale]);

  useEffect(() => {
    return continueBlur.on("change", (value) => {
      if (value > 0 && value < 1) {
        console.log(`[Continue:Scene] blur: ${value.toFixed(3)}px`);
      }
      if (value === 0) console.log("[Continue:Scene] blur fully clear");
    });
  }, [continueBlur]);

  useEffect(() => {
    return bottomBarOpacity.on("change", (value) => {
      if (value === 1) console.log("[Continue:BottomBar] fully visible");
      if (value === 0) console.log("[Continue:BottomBar] fully hidden");
      if (value > 0 && value < 1) {
        console.log(`[Continue:BottomBar] opacity: ${value.toFixed(3)}`);
      }
    });
  }, [bottomBarOpacity]);

  return {
    continueOpacity,
    continueScale,
    continueBlur,
    bottomBarOpacity,
  };
}
