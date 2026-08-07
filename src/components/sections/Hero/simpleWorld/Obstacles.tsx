"use client";

// Obstacles.tsx — collision derived from the scene itself.
//
// Hand-written boxes drift the moment anything moves, and they only ever
// covered the four buildings. Instead, anything tagged `solid` in its userData
// gets measured after mount and contributes its real footprint, so collision
// always matches what is actually on screen.

import { useEffect, useRef } from "react";
import * as THREE from "three";

export interface Bounds {
  min: [number, number, number];
  max: [number, number, number];
}

/**
 * How far the character's body is kept clear of a footprint. The old value was
 * 1.2, which had to be generous because the boxes were rough approximations;
 * measured footprints only need roughly a shoulder's width.
 */
export const COLLISION_RADIUS = 0.45;

/**
 * Ceiling of the band the character's body actually sweeps through. Meshes
 * sitting entirely above it can't be walked into and must not contribute to a
 * footprint — the monument's name banner is a 12-unit plane floating at y≈12,
 * and without this it blocked the whole plaza around the fountain.
 */
const WALK_BAND_TOP = 2;

/** Spread onto a group to make it solid: <group {...SOLID}>. */
export const SOLID = { userData: { solid: true } };

/**
 * For things whose silhouette is much wider than the part you'd actually bump
 * into — a tree is mostly canopy — measure a column of `r` around the origin
 * instead of the full bounding box.
 */
export const solidRadius = (r: number) => ({ userData: { solid: true, radius: r } });

/**
 * Measures every tagged descendant of its parent, in the parent's local space
 * (the same space the character moves in). Mounted as an empty group purely to
 * get a handle on that parent.
 */
export function ObstacleCollector({
  onCollect,
  rescanKey,
}: {
  onCollect: (bounds: Bounds[]) => void;
  /**
   * Change this whenever solid objects are added or removed — entering explore
   * mode mounts street clutter, and without a re-measure those pieces would be
   * rendered but not collidable.
   */
  rescanKey?: unknown;
}) {
  const anchor = useRef<THREE.Group>(null);

  useEffect(() => {
    const parent = anchor.current?.parent;
    if (!parent) return;

    parent.updateWorldMatrix(true, true);
    const toLocal = new THREE.Matrix4().copy(parent.matrixWorld).invert();
    const scratch = new THREE.Matrix4();
    const box = new THREE.Box3();
    const out: Bounds[] = [];

    parent.traverse((obj) => {
      const flag = obj.userData?.solid;
      if (!flag) return;

      const radius = obj.userData?.radius as number | undefined;
      if (radius) {
        // A column around the object's origin, in parent-local space.
        const p = new THREE.Vector3().setFromMatrixPosition(obj.matrixWorld);
        p.applyMatrix4(toLocal);
        out.push({
          min: [p.x - radius, p.y, p.z - radius],
          max: [p.x + radius, p.y + 4, p.z + radius],
        });
        return;
      }

      // Union of every mesh under this object, each transformed straight from
      // its own space into the parent's. Going via a world-space AABB would
      // inflate the result, because re-fitting a rotated box to axes grows it.
      box.makeEmpty();
      obj.traverse((child) => {
        const mesh = child as THREE.Mesh;
        if (!mesh.isMesh || !mesh.geometry) return;
        if (!mesh.geometry.boundingBox) mesh.geometry.computeBoundingBox();
        const bb = mesh.geometry.boundingBox;
        if (!bb) return;
        scratch.multiplyMatrices(toLocal, mesh.matrixWorld);
        const local = bb.clone().applyMatrix4(scratch);
        // Overhead geometry — signage, canopies, the tops of tall towers —
        // is something you walk under, not into.
        if (local.min.y > WALK_BAND_TOP) return;
        box.union(local);
      });

      if (box.isEmpty()) return;
      out.push({
        min: [box.min.x, box.min.y, box.min.z],
        max: [box.max.x, box.max.y, box.max.z],
      });
    });

    onCollect(out);
  }, [onCollect, rescanKey]);

  return <group ref={anchor} />;
}
