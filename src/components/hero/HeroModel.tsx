"use client";

import { AdditiveBlending, Color, type Mesh } from "three";
import { FLOOR_Y, type HeroAssets } from "./heroAssets";
import { type StylePreset } from "./presets/types";
import { type SceneRig } from "./sceneFrame";
import {
  CORE_SLAB,
  DECK,
  DOORSTEP_SLAB,
  FLOOR,
  FOUNDATION,
  GROUND,
  HOUSE,
  LEDGE_SLAB,
  PHONE_FOOT_POINT,
  PHONE_RAISED,
  PIPE_RUNS,
  RIDGE,
  ROOF,
  SIDE_WALL_SLAB,
  WALL_SLAB,
} from "./stage";

/** Hands a mounted part to the frame loop under its name in the rig. */
export type Hold = <Part extends Exclude<keyof SceneRig, "sheaths" | "notes">>(
  part: Part,
) => (node: SceneRig[Part]) => void;
/** The same for a part that comes in a row: one sleeve per run, one banner per notification. */
export type HoldIn = (row: "sheaths" | "notes", index: number) => (node: Mesh | null) => void;

interface HeroModelProps {
  assets: HeroAssets;
  style: StylePreset;
  hold: Hold;
  holdIn: HoldIn;
}

/** A screen's own colours at full strength: what its own light is multiplied by. */
const FULL = new Color(1, 1, 1);
/** The ridge cap stands this far proud of the roof's peak. */
const RIDGE_PROUD = 0.016;
/** A notification stands this far off the phone's screen. */
const NOTE_PROUD = 0.006;
/** The side wall is built facing forward and turned to face left. */
const FACING_LEFT = -Math.PI / 2;
/** The floor lies a little forward of the model's middle: that is where its shadow and its light fall. */
const FLOOR_FORWARD = 0.35;

/* ── The model ── */
// Every part of the house, where it stands when the build is over. The
// frame loop hides, grows and slides them from there. Clay parts cast and
// take shadows; the screens, the glass and the glows do not cast.
export function HeroModel({ assets, style, hold, holdIn }: HeroModelProps) {
  const { clay, shell } = assets;
  // The two things here that are not clay: the phone's body, and glass.
  const { deviceRoughness, glassRoughness } = style.finish;

  return (
    <>
      {/* The studio floor: a tone just off the page that fades into it. It takes the model's shadow and the bulb's light. */}
      <mesh geometry={assets.floor} position={[0, FLOOR_Y, FLOOR_FORWARD]} receiveShadow renderOrder={-3}>
        <meshStandardMaterial map={assets.floorMap} transparent depthWrite={false} roughness={style.ground.floor.roughness} metalness={0} dithering />
      </mesh>
      <mesh geometry={assets.kerb} material={clay} castShadow receiveShadow />

      {/* The idea: a filament burning inside a glass globe, on a clay base. */}
      <group ref={hold("bulb")}>
        <mesh geometry={assets.bulbFilament}>
          <meshBasicMaterial ref={hold("bulbFilament")} color={assets.warmColor} toneMapped={false} />
        </mesh>
        <mesh geometry={assets.bulbGlass} renderOrder={4}>
          <meshStandardMaterial
            color={assets.bulbGlassColor}
            ref={hold("bulbGlass")}
            emissive={assets.warmColor}
            emissiveIntensity={style.bulb.emissive}
            roughness={style.bulb.glassRoughness}
            metalness={0}
            transparent
            opacity={style.bulb.glassOpacity}
            depthWrite={false}
          />
        </mesh>
        <mesh geometry={assets.bulbBase} material={clay} castShadow />
      </group>
      {/* The bulb's own light. The frame loop keeps it in the bulb and sets how strong it is. */}
      <pointLight ref={hold("glow")} color={assets.warmColor} intensity={0} decay={2} />

      {/* The lower plate grows up out of the ground, so it stands on its foot. */}
      <group ref={hold("lower")} position={[0, GROUND, 0]} visible={false}>
        <mesh geometry={assets.lower} material={clay} position={[0, FOUNDATION.thickness / 2, 0]} castShadow receiveShadow />
      </group>
      <mesh
        ref={hold("core")}
        geometry={assets.core}
        material={clay}
        position={[CORE_SLAB.position[0], DECK, CORE_SLAB.position[2]]}
        visible={false}
        castShadow
        receiveShadow
      />
      <mesh ref={hold("upper")} geometry={assets.upper} material={clay} visible={false} castShadow receiveShadow />

      <mesh ref={hold("pipes")} geometry={assets.pipes} material={clay} visible={false} castShadow receiveShadow />
      <instancedMesh ref={hold("junctions")} args={[assets.junction, clay, PIPE_RUNS.length]} frustumCulled={false} castShadow receiveShadow />
      <instancedMesh ref={hold("lamps")} args={[assets.lamp, undefined, PIPE_RUNS.length]} frustumCulled={false}>
        <meshBasicMaterial ref={hold("lampMaterial")} color={assets.lampOffColor} toneMapped={false} />
      </instancedMesh>
      {/* What a run's label lights: a loose sleeve of the highlight's tone, unseen at rest. */}
      {assets.sheaths.map((sheath, run) => (
        <mesh key={run} ref={holdIn("sheaths", run)} geometry={sheath} visible={false} renderOrder={5}>
          <meshBasicMaterial color={assets.highlightColor} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
      ))}
      <instancedMesh ref={hold("pulses")} args={[assets.pulse, undefined, PIPE_RUNS.length]} frustumCulled={false} visible={false}>
        <meshBasicMaterial color={assets.pulseColor} toneMapped={false} />
      </instancedMesh>

      {/* The shell shares one material, so the housing's label can light all of it at once. */}
      <mesh ref={hold("farWalls")} geometry={assets.farWalls} material={shell} position={[0, FLOOR, 0]} visible={false} castShadow receiveShadow />
      <mesh
        ref={hold("sideWall")}
        geometry={assets.sideWall}
        material={shell}
        position={[-HOUSE.halfWidth, FLOOR, SIDE_WALL_SLAB.position[2]]}
        rotation={[0, FACING_LEFT, 0]}
        visible={false}
        castShadow
        receiveShadow
      >
        {/* The glass sits back in the wall's openings and goes up with the wall. Dark until the light climbs in. */}
        <mesh geometry={assets.sidePanes} receiveShadow>
          <meshStandardMaterial
            ref={hold("sidePanes")}
            color={assets.paneOffColor}
            emissive={assets.paneOnColor}
            emissiveMap={assets.paneMap}
            emissiveIntensity={0}
            roughness={glassRoughness}
            metalness={0}
          />
        </mesh>
        <mesh geometry={assets.sideSpill}>
          <meshBasicMaterial ref={hold("sideSpill")} map={assets.haloMap} color={assets.paneOnColor} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
      </mesh>
      <mesh ref={hold("gable")} geometry={assets.gable} material={shell} position={[0, HOUSE.eave, HOUSE.front]} visible={false} castShadow receiveShadow>
        <mesh geometry={assets.gablePane} receiveShadow>
          <meshStandardMaterial
            ref={hold("gablePane")}
            color={assets.paneOffColor}
            emissive={assets.paneOnColor}
            emissiveMap={assets.paneMap}
            emissiveIntensity={0}
            roughness={glassRoughness}
            metalness={0}
          />
        </mesh>
        <mesh geometry={assets.gableSpill}>
          <meshBasicMaterial ref={hold("gableSpill")} map={assets.haloMap} color={assets.paneOnColor} transparent opacity={0} depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
        </mesh>
      </mesh>
      {/* Each slab is tilted about its eave. The right one is the left one turned about, so its far end comes forward. */}
      <group ref={hold("roofLeft")} position={[-HOUSE.halfWidth, HOUSE.eave, 0]} rotation={[0, 0, ROOF.slope]} visible={false}>
        <mesh geometry={assets.roof} material={shell} castShadow receiveShadow />
      </group>
      <group ref={hold("roofRight")} position={[HOUSE.halfWidth, HOUSE.eave, ROOF.centreZ * 2]} rotation={[0, Math.PI, ROOF.slope]} visible={false}>
        <mesh geometry={assets.roof} material={shell} castShadow receiveShadow />
      </group>
      <mesh
        ref={hold("ridge")}
        geometry={assets.ridge}
        material={shell}
        position={[0, HOUSE.apex + RIDGE_PROUD - RIDGE.height / 2, ROOF.front + (RIDGE.length - ROOF.depth) / 2]}
        visible={false}
        castShadow
      />

      {/* The front wall goes up with a dark screen in it. The lit screen is a second face over the first; its light spreads from the bulb. */}
      <group ref={hold("wall")} position={[0, FLOOR, WALL_SLAB.position[2]]} visible={false}>
        <mesh geometry={assets.wall.body} material={shell} castShadow receiveShadow />
        <mesh ref={hold("wallOff")} geometry={assets.wall.face} position={[0, 0, assets.wall.faceZ]} receiveShadow>
          <meshStandardMaterial color={assets.screenOffColor} roughness={glassRoughness} metalness={0} />
        </mesh>
      </group>
      <mesh
        ref={hold("wallLit")}
        geometry={assets.wall.face}
        material={assets.wallFace}
        position={[0, FLOOR, WALL_SLAB.position[2] + assets.wall.faceZ + 0.0015]}
        visible={false}
        receiveShadow
        renderOrder={2}
      />

      {/* The phone's ledge slides out from under the wall; the phone stands on it and leans back against the wall. */}
      <mesh
        ref={hold("ledge")}
        geometry={assets.ledge}
        material={clay}
        position={[LEDGE_SLAB.position[0], LEDGE_SLAB.position[1], LEDGE_SLAB.position[2]]}
        visible={false}
        castShadow
        receiveShadow
      />
      <group ref={hold("phone")} position={[PHONE_FOOT_POINT[0], PHONE_FOOT_POINT[1], PHONE_FOOT_POINT[2]]} visible={false}>
        <group
          position={[
            PHONE_RAISED.position[0] - PHONE_FOOT_POINT[0],
            PHONE_RAISED.position[1] - PHONE_FOOT_POINT[1],
            PHONE_RAISED.position[2] - PHONE_FOOT_POINT[2],
          ]}
          rotation={[PHONE_RAISED.pitch, 0, 0]}
        >
          <mesh geometry={assets.phone.body} castShadow receiveShadow>
            <meshStandardMaterial vertexColors roughness={deviceRoughness} metalness={0} />
          </mesh>
          <mesh geometry={assets.phone.face} position={[0, 0, assets.phone.faceZ]}>
            <meshStandardMaterial
              ref={hold("phoneFace")}
              map={assets.phoneScreen}
              emissive={FULL}
              emissiveMap={assets.phoneScreen}
              emissiveIntensity={style.screen.ownLight.phone}
              roughness={1}
              metalness={0}
            />
          </mesh>
          {/* The payments: small banners standing just off the screen, each with its own words. */}
          {assets.notes.map((note, index) => (
            <mesh
              key={index}
              ref={holdIn("notes", index)}
              geometry={assets.note}
              position={[0, 0, assets.phone.faceZ + NOTE_PROUD]}
              visible={false}
              renderOrder={3 + index}
            >
              <meshBasicMaterial map={note} transparent opacity={0} depthWrite={false} toneMapped={false} />
            </mesh>
          ))}
        </group>
      </group>
      <mesh
        ref={hold("doorstep")}
        geometry={assets.doorstep}
        material={clay}
        visible={false}
        position={[DOORSTEP_SLAB.position[0], DOORSTEP_SLAB.position[1], DOORSTEP_SLAB.position[2]]}
        castShadow
        receiveShadow
      />
    </>
  );
}
