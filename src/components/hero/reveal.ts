/* ── The light spreading across the wall ──────────── */
// The lit screen is not wiped on: it is uncovered outward from one point,
// the point on the wall above the bulb, with a soft edge. Done in the
// screen's own material by fading its alpha with distance from that point,
// so it costs one comparison a pixel and no extra texture.

import { Vector2, type MeshStandardMaterial } from "three";

/** How far the light has spread, in wall widths. The frame loop writes `value`. */
export interface Spread {
  value: number;
}

/**
 * Makes `material` appear outward from `origin` (in the screen's own 0..1
 * coordinates). `aspect` is the screen's height over its width, so the
 * spread is round on the wall and not squashed. `edge` is how soft its rim
 * is, in wall widths.
 */
export function spreadFrom(material: MeshStandardMaterial, origin: readonly [number, number], aspect: number, edge: number): Spread {
  const spread: Spread = { value: 0 };
  material.transparent = true;
  // Its own program: the phone's screen shares this material's settings but must not share the spread.
  material.customProgramCacheKey = () => "hero-spread";
  material.onBeforeCompile = (shader) => {
    shader.uniforms.spreadRadius = spread;
    shader.uniforms.spreadOrigin = { value: new Vector2(origin[0], origin[1]) };
    shader.uniforms.spreadShape = { value: new Vector2(aspect, edge) };
    shader.fragmentShader = shader.fragmentShader
      .replace(
        "#include <common>",
        "#include <common>\nuniform float spreadRadius;\nuniform vec2 spreadOrigin;\nuniform vec2 spreadShape;",
      )
      .replace(
        "#include <map_fragment>",
        "#include <map_fragment>\nfloat spreadAway = length( ( vMapUv - spreadOrigin ) * vec2( 1.0, spreadShape.x ) );\ndiffuseColor.a *= 1.0 - smoothstep( spreadRadius - spreadShape.y, spreadRadius, spreadAway );",
      );
  };
  return spread;
}

/** The furthest any point of the screen is from `origin`, in wall widths: how far the light has to spread to cover it. */
export function farthest(origin: readonly [number, number], aspect: number): number {
  return Math.max(
    ...[0, 1].flatMap((u) => [0, 1].map((v) => Math.hypot(u - origin[0], (v - origin[1]) * aspect))),
  );
}
