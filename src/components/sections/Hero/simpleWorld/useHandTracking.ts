"use client";

import { useEffect, useRef, useCallback, useState } from "react";

// ============================================================
// useHandTracking — Index Finger (X-Only) + Pinch + Safe API
// ============================================================
// FIX: Waits for CameraRig to mount before calling window.__sceneControls
// Uses a retry loop to handle timing issues
// ============================================================

interface HandTrackingResult {
  isTracking: boolean;
  hasPermission: boolean;
}

export function useHandTracking(): HandTrackingResult {
  const [hasPermission, setHasPermission] = useState(true);
  const isTrackingRef = useRef(false);
  const videoRef = useRef<HTMLVideoElement | null>(null);
  const handsRef = useRef<any>(null);
  const rafRef = useRef<number>(0);

  // Smooth X position
  const smoothedX = useRef(0.5);
  const smoothingFactor = 0.3;

  // Pinch state
  const lastPinchDistance = useRef(0.5);
  const pinchSmoothing = 0.2;

  // Safe API caller — retries if CameraRig not ready
  const safeCall = useCallback((method: string, ...args: any[]) => {
    // @ts-ignore
    const controls = window.__sceneControls;
    if (controls && typeof controls[method] === "function") {
      controls[method](...args);
      return true;
    }
    return false;
  }, []);

  const sendToCamera = useCallback((
    fingerX: number,
    hasOneHand: boolean,
    pinchDistance: number | null,
    hasTwoHands: boolean
  ) => {
    if (hasTwoHands && pinchDistance !== null) {
      safeCall("setGestureActive", false);
      safeCall("setPinchActive", true);
      safeCall("setPinchDistance", pinchDistance);
    } else if (hasOneHand) {
      safeCall("setPinchActive", false);
      safeCall("setGestureActive", true);
      console.log("SEND TO CAMERA:", fingerX);

      safeCall("setFingerX", fingerX);
    } else {
      safeCall("setGestureActive", false);
      safeCall("setPinchActive", false);
    }
  }, [safeCall]);

  useEffect(() => {
    let isMounted = true;

    const init = async () => {
      try {
        if (!navigator.mediaDevices || !navigator.mediaDevices.getUserMedia) {
          console.log("Camera not supported — using scroll-only mode");
          setHasPermission(false);
          return;
        }

        await loadMediaPipeScripts();
        if (!isMounted) return;

        let stream: MediaStream;
        try {
          stream = await navigator.mediaDevices.getUserMedia({
            video: { width: 640, height: 480, facingMode: "user" },
          });
        } catch (permErr: any) {
          console.log("Camera permission denied — using scroll-only mode");
          setHasPermission(false);
          return;
        }

        if (!isMounted) {
          stream.getTracks().forEach((t) => t.stop());
          return;
        }

        const video = document.createElement("video");
        video.srcObject = stream;
        video.autoplay = true;
        video.playsInline = true;
        video.muted = true;
        videoRef.current = video;

        await video.play();

        const hands = new (window as any).Hands({
          locateFile: (file: string) =>
            `https://cdn.jsdelivr.net/npm/@mediapipe/hands/${file}`,
        });

        hands.setOptions({
          maxNumHands: 2,
          modelComplexity: 1,
          minDetectionConfidence: 0.5,
          minTrackingConfidence: 0.5,
        });

        hands.onResults((results: any) => {
          if (!isMounted) return;

          const handCount = results.multiHandLandmarks?.length ?? 0;


          if (handCount === 0) {
            isTrackingRef.current = false;

            sendToCamera(0, false, null, false);
            return;
          }

          isTrackingRef.current = true;

          if (handCount >= 2) {
            const hand1 = results.multiHandLandmarks[0];
            const hand2 = results.multiHandLandmarks[1];
            const idx1 = hand1[8];
            const idx2 = hand2[8];

            const dx = idx1.x - idx2.x;
            const dy = idx1.y - idx2.y;
            const rawDistance = Math.sqrt(dx * dx + dy * dy);
            const normalizedDistance = Math.max(0, Math.min(1, rawDistance / 0.5));

            lastPinchDistance.current += (normalizedDistance - lastPinchDistance.current) * pinchSmoothing;

            sendToCamera(0, false, lastPinchDistance.current, true);

          } else if (handCount === 1) {
            const landmarks = results.multiHandLandmarks[0];
            const indexTip = landmarks[8];

            console.log("INDEX RAW:", indexTip.x);

            smoothedX.current +=
              (indexTip.x - smoothedX.current) * smoothingFactor;

            console.log("INDEX SMOOTH:", smoothedX.current);

            sendToCamera(smoothedX.current, true, null, false);
          }
        });

        handsRef.current = hands;

        const detect = async () => {
          if (!isMounted || !videoRef.current) return;
          await hands.send({ image: videoRef.current });
          rafRef.current = requestAnimationFrame(detect);
        };

        detect();

      } catch (err: any) {
        if (!isMounted) return;
        console.log("Hand tracking unavailable — using scroll-only mode", err);
        setHasPermission(false);
      }
    };

    init();

    return () => {
      isMounted = false;
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (videoRef.current?.srcObject) {
        (videoRef.current.srcObject as MediaStream)
          .getTracks()
          .forEach((t) => t.stop());
      }
      safeCall("setGestureActive", false);
      safeCall("setPinchActive", false);
    };
  }, [sendToCamera, safeCall]);

  return {
    isTracking: isTrackingRef.current,
    hasPermission,
  };
}

function loadMediaPipeScripts(): Promise<void> {
  return new Promise((resolve, reject) => {
    if ((window as any).Hands) {
      resolve();
      return;
    }

    const scripts = [
      "https://cdn.jsdelivr.net/npm/@mediapipe/camera_utils/camera_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/control_utils/control_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/drawing_utils/drawing_utils.js",
      "https://cdn.jsdelivr.net/npm/@mediapipe/hands/hands.js",
    ];

    let loaded = 0;
    const total = scripts.length;

    scripts.forEach((src) => {
      const script = document.createElement("script");
      script.src = src;
      script.crossOrigin = "anonymous";
      script.onload = () => {
        loaded++;
        if (loaded === total) resolve();
      };
      script.onerror = () => reject(new Error(`Failed to load ${src}`));
      document.head.appendChild(script);
    });
  });
}