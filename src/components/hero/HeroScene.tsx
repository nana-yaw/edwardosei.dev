"use client";

import { useCallback, useEffect, useLayoutEffect, useMemo, useRef, type RefObject } from "react";
import { useFrame, useThree } from "@react-three/fiber";
import { AdditiveBlending, Color, PMREMGenerator, Vector3, type Group, type Scene, type WebGLRenderer } from "three";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { IDEA_WALL_SHARE, VIEW, VIEW_CENTRE } from "./framing";
import { HALO_COUNT } from "./glows";
import { HeroModel, type Hold, type HoldIn } from "./HeroModel";
import { assetTextures, buildAssets, disposeAssets } from "./heroAssets";
import { lockLabels, moveTokens, type LockedLabel, type StageBox } from "./overlay";
import { type StylePreset } from "./presets/types";
import { clockFrame, publishProbe, type Stopwatch } from "./probe";
import { VIEW_RIGHT } from "./projection";
import { PART_COUNT, applyFrame, createRig, easeHighlights, type FrameContext } from "./sceneFrame";
import { PIVOT } from "./stage";
import { LONGEST_STEP, REST_AT, cameraLeft, ideaStage, labelGrip, lightsOn, litCount, type IdeaStage } from "./timeline";

export interface HeroSceneProps {
  /** False while the tab is hidden or the hero is off screen: the build's clock stops and the pointer is not followed, so nothing is drawn. */
  running: boolean;
  /** Called once, when the first frame is on screen. */
  onReady: () => void;
  /** Called when what the labels show changes: how many are lit, and what the idea's own label has to point at. */
  onStep: (count: number, idea: IdeaStage) => void;
  /** Called if the browser takes the WebGL context away. Nothing more can be drawn after that. */
  onLost: () => void;
  /** What the labels ask to be lit, 0 or 1 each: the house's shell, then each run. The labels write it. */
  targets: RefObject<Float32Array>;
  /** The scene leaves a function here that asks for one more frame. The labels call it after writing. */
  wakeRef: RefObject<(() => void) | null>;
  /** The labels to hold on their points of the model, and the words the pulses carry. */
  labels: RefObject<LockedLabel[]>;
  tokens: RefObject<(HTMLSpanElement | null)[]>;
  /** Where the stage sits inside the canvas. */
  box: RefObject<StageBox>;
  style: StylePreset;
  /** The page's own typeface, for the words on the screens. */
  family: string;
}

/** Tilt limits in radians, about 4 and 2.5 degrees. */
const TILT_YAW = 0.07;
const TILT_PITCH = 0.042;
/** Higher is snappier. */
const TILT_DAMPING = 5;
/** Closer to its target than this, the tilt is done and the scene can rest. */
const TILT_SETTLED = 0.0004;
// The camera's own move during the build: it starts turned a little away
// and a little further back, and settles. About four degrees and four
// per cent: enough to feel filmed, not enough to pull a label off its part.
const CAMERA_TURN = 0.07;
const CAMERA_PUSH = 0.04;
/** The key's shadow box: just large enough to hold the model and the floor its shadow reaches. */
const SHADOW_BOX = { half: 3.5, near: 4, far: 17 } as const;

const RIGHT_AXIS = new Vector3(...VIEW_RIGHT);
const UNLIT = new Color(0, 0, 0);

/** A ref whose first value is built once. `useRef(build())` would build it again on every render and throw it away. */
function useLazyRef<Value>(build: () => Value): RefObject<Value> {
  const ref = useRef<Value | null>(null);
  if (ref.current === null) ref.current = build();
  return ref as RefObject<Value>;
}

/**
 * The studio room: three's own generated room, blurred into soft fill and a
 * faint reflection, and set as the scene's environment. Nothing is
 * downloaded, and it is not one of the three lights. Returns what takes it
 * down again. The render target holds the room's memory, so that is what is
 * freed; freeing its texture alone would free nothing.
 */
function raiseRoom(gl: WebGLRenderer, scene: Scene, blur: number): () => void {
  const generator = new PMREMGenerator(gl);
  const source = new RoomEnvironment();
  const room = generator.fromScene(source, blur);
  source.dispose();
  // The generator's own working memory. What it returned is the caller's to free.
  generator.dispose();
  scene.environment = room.texture;
  return () => {
    scene.environment = null;
    room.dispose();
  };
}

/* ── Scene ── */
export function HeroScene({ running, onReady, onStep, onLost, targets, wakeRef, labels, tokens, box, style, family }: HeroSceneProps) {
  const gl = useThree((state) => state.gl);
  const scene = useThree((state) => state.scene);
  const camera = useThree((state) => state.camera);
  const invalidate = useThree((state) => state.invalidate);

  const pitchRig = useRef<Group>(null);
  const yawRig = useRef<Group>(null);
  const rigRef = useLazyRef(createRig);
  const hold = useCallback<Hold>(
    (part) => (node) => {
      rigRef.current[part] = node;
    },
    [rigRef],
  );
  const holdIn = useCallback<HoldIn>(
    (row, index) => (node) => {
      rigRef.current[row][index] = node;
    },
    [rigRef],
  );
  const time = useRef(0);
  const frames = useRef(0);
  /** Set by the capture script to pin the build to one moment. */
  const held = useRef<number | null>(null);
  const awake = useRef(running);
  /** How many labels are lit and what the idea's label has to point at, as last reported. */
  const lit = useRef(0);
  const idea = useRef<IdeaStage | null>(null);
  const reported = useRef(false);
  const tilt = useRef({ targetYaw: 0, targetPitch: 0, yaw: 0, pitch: 0 });
  /** How far each highlight has eased toward what the labels ask for. */
  const levelsRef = useLazyRef(() => new Float32Array(PART_COUNT));
  /** The dev probe's stopwatch. Production builds have none, so they time nothing. */
  const stopwatch = useRef<Stopwatch | null>(null);

  // The room is raised and taken down in one effect, so an effect that is
  // replayed never leaves a freed room on the scene. A layout effect, and
  // the first one here: the room must be on the scene before the programs
  // are compiled below, because whether there is one is part of each program.
  const { roomBlur } = style.finish;
  useLayoutEffect(() => raiseRoom(gl, scene, roomBlur), [gl, scene, roomBlur]);

  // Nothing is fetched: the screens are painted here, so the build can start at once.
  const assets = useMemo(() => buildAssets(style, family, gl.capabilities.getMaxAnisotropy()), [gl, style, family]);
  useEffect(() => {
    // Upload now, not on the frame each is first shown.
    assetTextures(assets).forEach(([, texture]) => gl.initTexture(texture));
    // Every glow starts dark; the frame loop gives each its tone.
    const halos = rigRef.current.halos;
    if (halos) for (let index = 0; index < HALO_COUNT; index += 1) halos.setColorAt(index, UNLIT);
    // Build every material's program now, hidden parts included, so none is
    // built in the middle of the animation and costs it a frame.
    gl.compile(scene, camera);
    return () => disposeAssets(assets);
  }, [assets, camera, gl, rigRef, scene]);

  // A lost context draws nothing, and the room's map cannot be rebuilt into a
  // restored one. So no restore is tried: the layer is told, and the still
  // takes over for the rest of the visit.
  useEffect(() => {
    const canvas = gl.domElement;
    canvas.addEventListener("webglcontextlost", onLost);
    return () => canvas.removeEventListener("webglcontextlost", onLost);
  }, [gl, onLost]);

  const context = useMemo<FrameContext>(
    () => ({
      style,
      pipeTimes: assets.pipeTimes,
      pipeEnds: assets.pipeEnds,
      lampOff: assets.lampOffColor,
      lampOn: assets.lampOnColor,
      highlight: assets.highlightColor,
      glowTones: { pulse: assets.haloColor, warm: assets.warmColor },
      shell: assets.shell,
      wallFace: assets.wallFace,
      spread: assets.spread,
      spreadFull: assets.spreadFull,
      noteHeight: assets.noteHeight,
      facing: camera.quaternion,
    }),
    [assets, camera, style],
  );

  // Nothing is drawn unless something asks. These are the askers: the tab
  // or the hero coming back into view, the pointer while the hero is in
  // view, and the labels.
  useEffect(() => {
    awake.current = running;
    if (running) invalidate();
  }, [running, invalidate]);
  useEffect(() => {
    wakeRef.current = () => invalidate();
    return () => {
      wakeRef.current = null;
    };
  }, [invalidate, wakeRef]);

  // Pointer tilt, only where there is a real pointer to follow.
  useEffect(() => {
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const onMove = (event: PointerEvent) => {
      // Off screen there is nobody to tilt for, and a frame asked for is a frame drawn.
      if (!awake.current) return;
      tilt.current.targetYaw = (event.clientX / window.innerWidth - 0.5) * 2 * TILT_YAW;
      tilt.current.targetPitch = (event.clientY / window.innerHeight - 0.5) * 2 * TILT_PITCH;
      invalidate();
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [invalidate]);

  // Dev builds publish the renderer's counters for the capture script, and
  // time the build's frames for it.
  useEffect(() => {
    if (process.env.NODE_ENV === "production") return;
    const { watch, withdraw } = publishProbe({
      gl,
      scene,
      assets,
      key: () => rigRef.current.key,
      time: () => time.current,
      frames: () => frames.current,
      hold: (seconds) => {
        held.current = seconds;
        invalidate();
      },
    });
    stopwatch.current = watch;
    return () => {
      stopwatch.current = null;
      withdraw();
    };
  }, [assets, gl, rigRef, scene, invalidate]);

  useFrame((state, delta) => {
    frames.current += 1;
    // After a rest the first frame reports the whole rest as its delta. Cap it.
    const step = Math.min(delta, LONGEST_STEP);
    const pinned = held.current;
    if (pinned !== null) time.current = pinned;
    else if (awake.current) time.current = Math.min(time.current + step, REST_AT);
    const now = time.current;

    // The dev probe's stopwatch: real time between the frames of the build.
    if (stopwatch.current) clockFrame(stopwatch.current, now, pinned === null && now < REST_AT);

    // World units to pixels, so the canvas frames the stage exactly. Done as
    // the camera's zoom, which leaves lights and distances in world units.
    // During the build the camera stands a touch further back and pushes in.
    const still = cameraLeft(now);
    const zoom = (box.current.width / VIEW.width) * (1 - CAMERA_PUSH * still);
    if (state.camera.zoom !== zoom) {
      state.camera.zoom = zoom;
      state.camera.updateProjectionMatrix();
    }
    const duskLevel = lightsOn(now);
    state.scene.environmentIntensity = style.finish.environment * (1 - (1 - style.home.dusk.environment) * duskLevel);

    const turn = tilt.current;
    const ease = 1 - Math.exp(-step * TILT_DAMPING);
    const tilting =
      Math.abs(turn.targetYaw - turn.yaw) > TILT_SETTLED || Math.abs(turn.targetPitch - turn.pitch) > TILT_SETTLED;
    turn.yaw = tilting ? turn.yaw + (turn.targetYaw - turn.yaw) * ease : turn.targetYaw;
    turn.pitch = tilting ? turn.pitch + (turn.targetPitch - turn.pitch) * ease : turn.targetPitch;
    if (yawRig.current) yawRig.current.rotation.y = turn.yaw + still * CAMERA_TURN;
    pitchRig.current?.quaternion.setFromAxisAngle(RIGHT_AXIS, turn.pitch);
    // After the rigs have turned: the glows are placed through them.
    const rig = rigRef.current;
    applyFrame(rig, context, now);
    const glowing = easeHighlights(rig, context, levelsRef.current, targets.current, step);
    if (rig.model) {
      const { width, height } = state.size;
      moveTokens(tokens.current, rig.model, state.camera, width, height, box.current.pixelRatio, now);
      lockLabels(labels.current, rig.model, state.camera, width, height, box.current, labelGrip(now));
    }

    const count = litCount(now);
    const stage = ideaStage(now, IDEA_WALL_SHARE);
    if (count !== lit.current || stage !== idea.current) {
      lit.current = count;
      idea.current = stage;
      onStep(count, stage);
    }
    if (!reported.current) {
      reported.current = true;
      onReady();
    }
    // Ask for the next frame only while something is still moving. At rest, nothing is drawn at all.
    if (pinned === null && awake.current && (now < REST_AT || tilting || glowing)) state.invalidate();
  });

  const { key, rim, shadow } = style.lights;
  return (
    <>
      {/* Three lights and no more. The key: warm, from the upper left front, and the only one that casts shadows. */}
      <directionalLight
        ref={hold("key")}
        color={assets.keyColor}
        intensity={key.intensity}
        position={[...key.from]}
        castShadow
        shadow-mapSize={[shadow.mapSize, shadow.mapSize]}
        shadow-radius={shadow.radius}
        shadow-bias={shadow.bias}
        shadow-normalBias={shadow.normalBias}
        shadow-intensity={shadow.strength}
      >
        <orthographicCamera
          attach="shadow-camera"
          args={[-SHADOW_BOX.half, SHADOW_BOX.half, SHADOW_BOX.half, -SHADOW_BOX.half, SHADOW_BOX.near, SHADOW_BOX.far]}
        />
      </directionalLight>
      {/* The rim: neutral, from the upper right rear, to draw the roof's edge and the corners. */}
      <directionalLight ref={hold("rim")} color={assets.rimColor} intensity={rim.intensity} position={[...rim.from]} />
      <group position={[-VIEW_CENTRE[0], -VIEW_CENTRE[1], -VIEW_CENTRE[2]]}>
        {/* Two rigs turning about one pivot: pitch about the screen's own horizontal, then yaw. */}
        <group ref={pitchRig} position={[PIVOT[0], PIVOT[1], PIVOT[2]]}>
          <group ref={yawRig}>
            <group ref={hold("model")} position={[-PIVOT[0], -PIVOT[1], -PIVOT[2]]}>
              <HeroModel assets={assets} style={style} hold={hold} holdIn={holdIn} />
            </group>
          </group>
        </group>
      </group>
      {/* Every glow: one tight spot per pulse, two for the bulb, one for its light on the way up. Outside the rigs, so each faces the camera squarely. */}
      <instancedMesh ref={hold("halos")} args={[assets.halo, undefined, HALO_COUNT]} frustumCulled={false} renderOrder={6}>
        <meshBasicMaterial map={assets.haloMap} transparent depthWrite={false} blending={AdditiveBlending} toneMapped={false} />
      </instancedMesh>
    </>
  );
}
