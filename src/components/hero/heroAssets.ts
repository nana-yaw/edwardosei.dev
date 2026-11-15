/* ── Canvas assets ────────────────────────────────── */
// Every geometry, colour, texture and shared material the canvas needs,
// built once from the stage's numbers and the style preset's look. All of
// it is created outside JSX, so the scene disposes it.

import {
  Color,
  MeshStandardMaterial,
  NoColorSpace,
  PlaneGeometry,
  RepeatWrapping,
  SphereGeometry,
  type BufferGeometry,
  type CanvasTexture,
} from "three";
import { notifications } from "@/data/heroPicture";
import { bulbBase, bulbFilament, bulbGlass } from "./bulb";
import { clayBox, merge, skin, tint } from "./clayParts";
import { createColorReader } from "./colorReader";
import { gable, phoneBody, plate, ridgeCap, roofSlab, wall } from "./houseParts";
import { buildPipes, buildSheaths, junctionBox, junctionLamp } from "./pipeParts";
import { type SolidRole, type StylePreset } from "./presets/types";
import { type Slab, type Vec3 } from "./projection";
import { farthest, spreadFrom, type Spread } from "./reveal";
import { NOTE_PIXELS, paintCheckout, paintDashboard, paintNote, toTexture } from "./screens";
import { paintFalloff, paintPane, paintTooth, toSoftTexture } from "./softTextures";
import {
  BULB,
  CORE_SLAB,
  DOORSTEP_SLAB,
  FAR_WALL_SLABS,
  GABLE,
  GROUND,
  LEDGE_SLAB,
  PHONE,
  PHONE_RAISED,
  PLOT,
  SIDE_WALL_SLAB,
  WALL,
  WALL_SLAB,
} from "./stage";
import { GABLE_PANE, SIDE_PANES, glass, spillSheet } from "./windows";

/** A solid body and the flat face that carries its screen. */
export interface DeviceGeometry {
  body: BufferGeometry;
  face: PlaneGeometry;
  /** Where the face sits along the body's own z axis. */
  faceZ: number;
}

export interface HeroAssets {
  /** The studio floor: it takes the shadows and fades into the page. */
  floor: PlaneGeometry;
  kerb: BufferGeometry;
  /** The foundation's two plates, each about its own middle. */
  lower: BufferGeometry;
  upper: BufferGeometry;
  /** Grows from the lower plate's top, so its foot sits at zero. */
  core: BufferGeometry;
  /** All three runs in one mesh, in the order they are laid: a draw range reveals them. */
  pipes: BufferGeometry;
  pipeTimes: Float32Array;
  pipeEnds: Uint32Array;
  /** One junction box and its lamp; the scene draws one of each per run. */
  junction: BufferGeometry;
  lamp: BufferGeometry;
  /** One per run: what glows when its label is hovered or focused. */
  sheaths: BufferGeometry[];
  /** A ball one unit across the pulses are scaled from, and the flat spot every glow is. */
  pulse: SphereGeometry;
  halo: PlaneGeometry;
  /** The idea: glass, filament and base, foot at the origin. */
  bulbGlass: BufferGeometry;
  bulbFilament: BufferGeometry;
  bulbBase: BufferGeometry;
  /** Walls and gable stand on y = 0 and grow from there; the roof grows from its eave, the ridge from its front end. */
  sideWall: BufferGeometry;
  farWalls: BufferGeometry;
  gable: BufferGeometry;
  roof: BufferGeometry;
  ridge: BufferGeometry;
  doorstep: BufferGeometry;
  ledge: BufferGeometry;
  /** The glass in each wall's openings, and the light a lit pane lays on the wall under it. */
  sidePanes: BufferGeometry;
  gablePane: BufferGeometry;
  sideSpill: BufferGeometry;
  gableSpill: BufferGeometry;
  wall: DeviceGeometry;
  phone: DeviceGeometry;
  /** One notification's banner; all of them are this shape, `noteHeight` tall in world units. */
  note: PlaneGeometry;
  noteHeight: number;
  floorMap: CanvasTexture;
  haloMap: CanvasTexture;
  paneMap: CanvasTexture;
  toothMap: CanvasTexture;
  wallScreen: CanvasTexture;
  phoneScreen: CanvasTexture;
  notes: CanvasTexture[];
  /** The clay itself, and a second copy for the house's shell so a hovered label can make all of it glow at once. */
  clay: MeshStandardMaterial;
  shell: MeshStandardMaterial;
  /** The lit wall's own material, how far its light has spread, and how far it has to go to cover the wall. */
  wallFace: MeshStandardMaterial;
  spread: Spread;
  spreadFull: number;
  keyColor: Color;
  rimColor: Color;
  pulseColor: Color;
  lampOffColor: Color;
  lampOnColor: Color;
  warmColor: Color;
  paneOffColor: Color;
  paneOnColor: Color;
  screenOffColor: Color;
  bulbGlassColor: Color;
  haloColor: Color;
  highlightColor: Color;
}

/** A screen sits this far proud of its body, so the two never z-fight. */
const FACE_GAP = 0.003;
const FLOOR_PIXELS = 512;
const HALO_PIXELS = 128;
const TOOTH_PIXELS = 256;
/** The floor lies just under the model's foot, so nothing standing on the ground shares its plane. */
export const FLOOR_Y = GROUND - 0.002;

function buildDevice(device: { imageWidth: number; imageHeight: number }, body: BufferGeometry, faceZ: number, lift = 0): DeviceGeometry {
  const face = new PlaneGeometry(device.imageWidth, device.imageHeight);
  face.translate(0, lift, 0);
  return { body, face, faceZ };
}

/** `family` is the page's own typeface, read once its fonts have loaded: the screens are set in it. */
export function buildAssets(style: StylePreset, family: string, anisotropy: number): HeroAssets {
  const read = createColorReader();
  const { edges, finish, ground, home, lights, plumbing, pulse } = style;
  const look = { edges, finish };
  const painter = { resolve: read.css, family };
  const clay = (role: SolidRole) => read.color(style.surfaces[role]);
  const walls = { wall: clay("walls"), trim: clay("trim") };
  /** A slab as tinted, mapped clay. `lift` moves it up, for a part that grows from its foot. */
  const box = (role: SolidRole, { size }: Slab, bevel: number, steps: number, lift = 0) =>
    skin(clayBox(size, [0, lift, 0], bevel, clay(role), steps), finish.tooth.tile);
  const pipes = buildPipes(plumbing, clay("pipes"), clay("collars"));

  /** A light's colour: its tint at full strength, eased toward white. */
  const lightColor = ({ tint: tone, whiten }: { tint: string; whiten: number }) => {
    const color = read.color(tone);
    return color.multiplyScalar(1 / Math.max(color.r, color.g, color.b)).lerp(new Color(1, 1, 1), whiten);
  };

  const toothMap = toSoftTexture(paintTooth(TOOTH_PIXELS, finish.tooth.roughness));
  toothMap.wrapS = RepeatWrapping;
  toothMap.wrapT = RepeatWrapping;
  // Height and roughness, not colour: it must not be read as sRGB.
  toothMap.colorSpace = NoColorSpace;
  const clayMaterial = () =>
    new MeshStandardMaterial({
      vertexColors: true,
      roughness: finish.roughness,
      metalness: 0,
      bumpMap: toothMap,
      bumpScale: finish.tooth.depth,
      roughnessMap: toothMap,
      dithering: true,
    });

  const wallScreen = toTexture(paintDashboard(WALL.layout, painter, style.screen), anisotropy);
  const phoneScreen = toTexture(paintCheckout(PHONE.layout, painter, style.screen), anisotropy);
  const notes = notifications.map((note) => toTexture(paintNote(note, painter, style.notifications), anisotropy));
  // Lit by the studio and its room like the clay round it, plus light of its own: a screen that is on.
  const wallFace = new MeshStandardMaterial({
    map: wallScreen,
    emissive: new Color(1, 1, 1),
    emissiveMap: wallScreen,
    emissiveIntensity: style.screen.ownLight.wall,
    roughness: 1,
    metalness: 0,
  });
  // The light spreads from the point on the wall directly above the bulb's seat.
  const origin = [BULB.seat[0] / WALL.imageWidth + 0.5, 0] as const;
  const aspect = WALL.imageHeight / WALL.imageWidth;
  const spread = spreadFrom(wallFace, origin, aspect, style.screen.revealEdge);

  const { halfWidth, halfDepth } = PLOT;
  const kerbY = GROUND + ground.kerb.height / 2;
  const kerbAcross: Vec3 = [halfWidth * 2 + ground.kerb.width, ground.kerb.height, ground.kerb.width];
  const kerbAlong: Vec3 = [ground.kerb.width, ground.kerb.height, halfDepth * 2 - ground.kerb.width];
  const kerb = clay("kerb");
  const farTone = clay("walls");
  const noteWidth = PHONE.imageWidth * style.notifications.width;
  const noteHeight = (noteWidth * NOTE_PIXELS.height) / NOTE_PIXELS.width;
  const diameter = ground.floor.radius * 2;

  return {
    floor: new PlaneGeometry(diameter, diameter).rotateX(-Math.PI / 2),
    kerb: skin(
      merge([
        clayBox(kerbAcross, [0, kerbY, halfDepth], edges.small, kerb, 1),
        clayBox(kerbAcross, [0, kerbY, -halfDepth], edges.small, kerb, 1),
        clayBox(kerbAlong, [-halfWidth, kerbY, 0], edges.small, kerb, 1),
        clayBox(kerbAlong, [halfWidth, kerbY, 0], edges.small, kerb, 1),
      ]),
      finish.tooth.tile,
    ),
    lower: plate(clay("lowerPlate"), look),
    upper: plate(clay("upperPlate"), look),
    core: box("core", CORE_SLAB, edges.small, 1, CORE_SLAB.size[1] / 2),
    pipes: pipes.geometry,
    pipeTimes: pipes.times,
    pipeEnds: pipes.ends,
    junction: skin(tint(junctionBox(plumbing, edges.junction, finish.bevelSteps), clay("junctions")), finish.tooth.tile),
    lamp: junctionLamp(plumbing),
    sheaths: buildSheaths(plumbing, style.highlight.pipe.scale),
    pulse: new SphereGeometry(0.5, 24, 16),
    halo: new PlaneGeometry(1, 1),
    bulbGlass: bulbGlass(BULB.height),
    bulbFilament: bulbFilament(BULB.height),
    bulbBase: tint(bulbBase(BULB.height), clay("bulbBase")),
    sideWall: wall(SIDE_WALL_SLAB.size[2], SIDE_WALL_SLAB.size[1], SIDE_PANES, walls, look, ground.footShade),
    // Only seen while the house is open, before the roof goes on: plain boxes will do.
    farWalls: skin(
      merge(
        FAR_WALL_SLABS.map(({ size, position }) =>
          clayBox(size, [position[0], size[1] / 2, position[2]], edges.wall, farTone, 1, ground.footShade),
        ),
      ),
      finish.tooth.tile,
    ),
    gable: gable(GABLE, GABLE_PANE, walls, look),
    roof: roofSlab({ roof: clay("roof"), trim: clay("trim") }, look),
    ridge: ridgeCap(clay("trim"), look),
    doorstep: box("steps", DOORSTEP_SLAB, edges.small, 2),
    ledge: box("steps", LEDGE_SLAB, edges.small, 2),
    sidePanes: merge(SIDE_PANES.map(glass)),
    gablePane: glass(GABLE_PANE),
    sideSpill: merge(SIDE_PANES.map((pane) => spillSheet(pane, home.windows.spill.reach))),
    gableSpill: spillSheet(GABLE_PANE, home.windows.spill.reach),
    // The front wall grows from the floor, so its foot sits at zero.
    wall: buildDevice(
      WALL,
      skin(clayBox(WALL_SLAB.size, [0, WALL_SLAB.size[1] / 2, 0], edges.wall, walls.wall, 2), finish.tooth.tile),
      WALL_SLAB.size[2] / 2 + FACE_GAP,
      WALL_SLAB.size[1] / 2,
    ),
    phone: buildDevice(
      PHONE,
      phoneBody(PHONE_RAISED.size[0], PHONE_RAISED.size[1], PHONE_RAISED.size[2], clay("device"), look),
      PHONE_RAISED.size[2] / 2 + 0.0015,
    ),
    note: new PlaneGeometry(noteWidth, noteHeight),
    noteHeight,
    // The tone fades to nothing at the plane's edge, `ground.floor.radius` from its middle.
    floorMap: toSoftTexture(
      paintFalloff({ pixels: FLOOR_PIXELS, peak: ground.floor.peak, tightness: ground.floor.tightness }, read.color(ground.floor.tone)),
    ),
    haloMap: toSoftTexture(
      // White: each glow takes its tone from its own material, so one map serves them all.
      paintFalloff({ pixels: HALO_PIXELS, peak: 1, tightness: pulse.halo.tightness }, new Color(1, 1, 1)),
    ),
    paneMap: toSoftTexture(paintPane(home.windows.falloff)),
    toothMap,
    wallScreen,
    phoneScreen,
    notes,
    clay: clayMaterial(),
    shell: clayMaterial(),
    wallFace,
    spread,
    spreadFull: farthest(origin, aspect),
    keyColor: lightColor(lights.key),
    rimColor: lightColor(lights.rim),
    pulseColor: read.color(pulse.tone),
    lampOffColor: read.color(style.lamps.off),
    lampOnColor: read.color(style.lamps.on),
    warmColor: read.color(style.bulb.light),
    paneOffColor: read.color(home.windows.off),
    paneOnColor: read.color(home.windows.on),
    screenOffColor: read.color(style.screen.off),
    bulbGlassColor: read.color(style.bulb.glass),
    haloColor: read.color(pulse.halo.tone),
    highlightColor: read.color(style.highlight.tone),
  };
}

/** Every texture the canvas uses, by name: the scene uploads them, the dev probe reads their sizes, and `disposeAssets` frees them. */
export function assetTextures(assets: HeroAssets): (readonly [name: string, texture: CanvasTexture])[] {
  return [
    ["wall", assets.wallScreen],
    ["phone", assets.phoneScreen],
    ...assets.notes.map((note, index) => [`banner ${index + 1}`, note] as const),
    ["floor", assets.floorMap],
    ["clay tooth", assets.toothMap],
    ["glow", assets.haloMap],
    ["window pane", assets.paneMap],
  ];
}

export function disposeAssets(assets: HeroAssets): void {
  const geometries: BufferGeometry[] = [
    assets.floor,
    assets.kerb,
    assets.lower,
    assets.upper,
    assets.core,
    assets.pipes,
    assets.junction,
    assets.lamp,
    ...assets.sheaths,
    assets.pulse,
    assets.halo,
    assets.bulbGlass,
    assets.bulbFilament,
    assets.bulbBase,
    assets.sideWall,
    assets.farWalls,
    assets.gable,
    assets.roof,
    assets.ridge,
    assets.doorstep,
    assets.ledge,
    assets.sidePanes,
    assets.gablePane,
    assets.sideSpill,
    assets.gableSpill,
    assets.wall.body,
    assets.wall.face,
    assets.phone.body,
    assets.phone.face,
    assets.note,
  ];
  geometries.forEach((geometry) => geometry.dispose());
  assetTextures(assets).forEach(([, texture]) => texture.dispose());
  assets.clay.dispose();
  assets.shell.dispose();
  assets.wallFace.dispose();
}
