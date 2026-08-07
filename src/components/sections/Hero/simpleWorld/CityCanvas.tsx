"use client";

import { Canvas } from "@react-three/fiber";
import { useThree } from "@react-three/fiber";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import * as THREE from "three";

import { RotatingCity, SceneControls } from "./CameraRig";
import { CityScene, CITY_ROTATION_Y } from "./MiniCityScene";
import { DEBUG_TOP_VIEW, GRID_SIZE } from "./DebugGrid";

/**
 * TEMPORARY: parks the camera straight above the city for grid screenshots.
 * Height is solved from the FOV so the whole grid just fits the frame, and the
 * up-vector is moved off +Y — looking straight down it would be parallel to
 * the view direction and lookAt would have no way to orient the camera.
 */
function TopDownCamera({ fov = 25 }: { fov?: number }) {
  const get = useThree((state) => state.get);

  useEffect(() => {
    const cam = get().camera;
    if (!(cam instanceof THREE.PerspectiveCamera)) return;

    const prev = {
      up: cam.up.clone(),
      position: cam.position.clone(),
      fov: cam.fov,
    };

    // Half the grid must fit in half the vertical FOV, plus a little margin.
    const height = (GRID_SIZE / 2 / Math.tan((fov / 2) * (Math.PI / 180))) * 1.1;
    // Orient the shot so cell 1 lands top-left, 400 bottom-right and the digits
    // read upright. This is the city's local +X: feeding lookAt the -Z axis
    // (the intuitive "north up") came out rotated a quarter turn on screen, so
    // this is the empirically correct axis, confirmed against a capture.
    cam.up.set(Math.cos(CITY_ROTATION_Y), 0, -Math.sin(CITY_ROTATION_Y));
    cam.position.set(0, height, 0);
    cam.fov = fov;
    cam.lookAt(0, 0, 0);
    cam.updateProjectionMatrix();

    return () => {
      cam.up.copy(prev.up);
      cam.position.copy(prev.position);
      cam.fov = prev.fov;
      cam.updateProjectionMatrix();
    };
  }, [get, fov]);

  return null;
}

/**
 * Dev helper: logs world-space coordinates of clicks on the ground plane.
 * Kept out of the Hero entry file so it stays free of THREE/raycaster deps.
 */
function ClickLogger() {
  const { camera, gl } = useThree();
  const raycaster = useMemo(() => new THREE.Raycaster(), []);
  const mouse = useMemo(() => new THREE.Vector2(), []);
  const plane = useMemo(
    () => new THREE.Plane(new THREE.Vector3(0, 1, 0), 0.5),
    [],
  );

  const handleClick = useCallback(
    (event: MouseEvent) => {
      const rect = gl.domElement.getBoundingClientRect();
      mouse.x = ((event.clientX - rect.left) / rect.width) * 2 - 1;
      mouse.y = -((event.clientY - rect.top) / rect.height) * 2 + 1;

      raycaster.setFromCamera(mouse, camera);

      // Intersect with a virtual ground plane at y = -0.5 (platform surface)
      const target = new THREE.Vector3();
      raycaster.ray.intersectPlane(plane, target);

      if (target) {
        console.log(
          `Clicked: [${target.x.toFixed(2)}, ${target.y.toFixed(2)}, ${target.z.toFixed(2)}]`,
        );
      }
    },
    [camera, gl, raycaster, mouse, plane],
  );

  useEffect(() => {
    gl.domElement.addEventListener("click", handleClick);
    return () => gl.domElement.removeEventListener("click", handleClick);
  }, [gl, handleClick]);

  return null;
}

interface CityCanvasProps {
  /** Scroll progress (0–1) driving the camera zoom-out. */
  progressRef: React.MutableRefObject<number>;
}

/**
 * The 3D city "modal" — the full R3F canvas with scene + controls.
 * All WebGL/THREE plumbing lives here so the Hero entry stays declarative.
 */
export function CityCanvas({
  explore = false,
  onNavigate,
}: {
  explore?: boolean;
  onNavigate?: (id: string) => void;
}) {
  const wrapRef = useRef<HTMLDivElement>(null);
  // Only run the WebGL render loop while the canvas is on screen — otherwise
  // the auto-rotating scene keeps re-rendering and competes with page scroll.
  const [active, setActive] = useState(true);

  useEffect(() => {
    const el = wrapRef.current;
    if (!el) return;
    const io = new IntersectionObserver(
      ([entry]) => setActive(entry.isIntersecting),
      { rootMargin: "150px" },
    );
    io.observe(el);
    return () => io.disconnect();
  }, []);

  return (
    <div ref={wrapRef} className="h-full w-full">
      <Canvas
        frameloop={active ? "always" : "never"}
        // Stay at 1x even fullscreen. The scene runs ~20 dynamic lights through
        // meshStandardMaterial, so cost scales with pixels × lights — and going
        // fullscreen already multiplies the pixel count several times over.
        dpr={1}
        camera={{ position: [78, 88, 98], fov: 25, near: 0.1, far: 500 }}
        className="h-full w-full !bg-transparent"
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        onCreated={({ camera, gl, scene }) => {
          camera.lookAt(-10, 0, 10);
          // Fully transparent backdrop so the 3D model sits directly on the UI.
          gl.setClearColor(0x000000, 0);
          scene.background = null;
        }}
      >
        {/* <ClickLogger /> */}

        <RotatingCity enabled={!explore && !DEBUG_TOP_VIEW}>
          <CityScene exploreMode={explore} onNavigate={onNavigate} />
        </RotatingCity>
        {/* Orbit preview only when NOT exploring; the follow camera takes over
            in explore mode. The debug top-down replaces the orbit controls
            outright — otherwise they'd fight over the camera every frame. */}
        {!explore && !DEBUG_TOP_VIEW && <SceneControls />}
        {!explore && DEBUG_TOP_VIEW && <TopDownCamera />}
      </Canvas>
    </div>
  );
}
