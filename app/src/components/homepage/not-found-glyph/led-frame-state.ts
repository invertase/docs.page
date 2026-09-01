/**
 * Hover brightness lift from triangle-led-front hero-frame-state.ts
 * (rev 90b65bf4…). No RGB deploy / line-mode hero settings.
 */

import {
  BRIGHTNESS_MIN_HOVER_MULTIPLIER,
  BRIGHTNESS_MIN_HOVER_SMOOTHING,
  type BrushState,
  type SceneTunables,
  TUNABLE_DEFAULTS,
} from "./led-buffer";

export type UpdateLedsContext = {
  time: number;
  tunables: SceneTunables;
  brush: BrushState;
};

type ResolveFrameArgs = {
  time: number;
  brush: BrushState;
  updateLedsFor: (ctx: UpdateLedsContext) => void;
};

type Smoother = {
  initialized: boolean;
  lastTime: number;
  value: number;
};

export function createLedFrameState() {
  const brightness: Smoother = { initialized: false, lastTime: 0, value: 0 };
  const tunables: SceneTunables = { ...TUNABLE_DEFAULTS };

  return {
    resolveFrame(args: ResolveFrameArgs) {
      const { time, brush } = args;
      Object.assign(tunables, TUNABLE_DEFAULTS);
      const baseBrightness = tunables.brightnessMinDark;
      tunables.brightnessMin = smooth(
        brightness,
        brush.active && brush.inside === true
          ? baseBrightness * BRIGHTNESS_MIN_HOVER_MULTIPLIER
          : baseBrightness,
        time,
        BRIGHTNESS_MIN_HOVER_SMOOTHING,
      );
      args.updateLedsFor({ time, tunables, brush });
      return { tunables };
    },
  };
}

function smooth(
  state: Smoother,
  target: number,
  time: number,
  smoothing: number,
) {
  if (!state.initialized) {
    state.initialized = true;
    state.lastTime = time;
    state.value = target;
    return state.value;
  }
  const rawDt = time - state.lastTime;
  state.lastTime = time;
  if (smoothing <= 0 || !Number.isFinite(smoothing)) {
    state.value = target;
    return state.value;
  }
  const dt = Math.min(0.25, Math.max(0, Number.isFinite(rawDt) ? rawDt : 0));
  const alpha = 1 - Math.exp(-dt / smoothing);
  state.value = state.value + (target - state.value) * alpha;
  if (Math.abs(state.value - target) < 0.0001) state.value = target;
  return state.value;
}
