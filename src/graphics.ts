////////////////////////////////////////////
/// @name GRAPHICS MODES
//@{

import { makecol } from "./allegro.js";
import { log, _error } from "./debug.js";
import { load_base64_font, _cartoon_woff } from "./font.js";
import { clear_to_color } from "./primitives.js";
import { draw_sprite } from "./sprites.js";
import { BITMAP, FONT } from "./types.js";
import { screen } from "./bitmap.js";

/// 1.10.2
/// Screen bitmap width in pixels
export let SCREEN_W = 0;

/// 1.10.3
/// Screen bitmap height in pixels
export let SCREEN_H = 0;

/// 1.9.1
export function set_color_depth(depth: number) {
  return 0;
}

/// 1.9.2
export function get_color_depth() {
  return 32;
}

/// 1.9.3
export function request_refresh_rate(rate: number) {}

/// 1.9.4
export function get_refresh_rate() {
  return 60;
}

/// 1.9.5
export function get_gfx_mode_list(card: number) {
  return [[0, 0, 0]];
}

/// 1.9.6
export function destroy_gfx_mode_list(mode_list: number[]) {}

/// 1.9.7
/// Enables graphics.
/// This function should be before calling any other graphics routines. It selects the canvas element for rendering and sets the resolution. It also loads the default font.
/// @param width canvas width in pixels, 0 for don't care (will use actual canvas size)
/// @param height canvas height in pixels, 0 for don't care (will use actual canvas size)
/// @param smooth disable/enable pixel smoothing, deaults to true
/// @return 0 on success or -1 on error
export function set_gfx_mode(
  canvas_id: string,
  card: number,
  w: number,
  h: number,
  v_w = 0,
  v_h = 0
) {
  // NOOP
  void v_w;
  void v_h;
  void card;

  // Get context
  const cv = document.getElementById(canvas_id) as
    | HTMLCanvasElement
    | undefined;
  if (!cv) {
    _error("Can't find canvas with id " + canvas_id);
    return -1;
  }

  const rect = cv.getBoundingClientRect();
  const cmp_width = w ?? rect.width;
  const cmp_height = h ?? rect.height;

  cv.width = cmp_width;
  cv.height = cmp_height;

  const ctx = cv.getContext("2d");
  if (!ctx) {
    throw new Error("Context not defined");
  }

  // Turn off image aliasing
  ctx.imageSmoothingEnabled = true;

  SCREEN_W = cmp_width;
  SCREEN_H = cmp_height;

  screen.w = cmp_width;
  screen.h = cmp_height;
  screen.canvas = cv;
  screen.context = ctx;
  screen.ready = true;
  clear_to_color(screen, makecol(0, 0, 0));

  font = load_base64_font(_cartoon_woff);
  _gfx_installed = true;
  log("Graphics mode set to " + cmp_width + " x " + cmp_height);
  return 0;
}

export const GFX_TEXT = -1;
export const GFX_AUTODETECT = 0;
export const GFX_AUTODETECT_FULLSCREEN = 1;
export const GFX_AUTODETECT_WINDOWED = 2;
export const GFX_SAFE = 3;

/// 1.9.8
export function set_display_switch_mode(mode: number) {}

/// 1.9.9
export function set_display_switch_callback(dir: number, cb: () => void) {}

/// 1.9.10
export function remove_display_switch_callback(cb: () => void) {}

/// 1.9.11
export function get_dispaly_swittch_mode() {
  return 0;
}

/// 1.9.12
export function is_windowed_mode() {
  return true;
}

/// 1.9.13
export const gfx_capabilities = 0;

export const GFX_CAN_SCROLL = 0x00000001;
export const GFX_CAN_TRIPLE_BUFFER = 0x00000002;
export const GFX_HW_CURSOR = 0x00000004;
export const GFX_HW_HLINE = 0x00000008;
export const GFX_HW_HLINE_XOR = 0x00000010;
export const GFX_HW_HLINE_SOLID_PATTERN = 0x00000020;
export const GFX_HW_HLINE_COPY_PATTERN = 0x00000040;
export const GFX_HW_FILL = 0x00000080;
export const GFX_HW_FILL_XOR = 0x00000100;
export const GFX_HW_FILL_SOLID_PATTERN = 0x00000200;
export const GFX_HW_FILL_COPY_PATTERN = 0x00000400;
export const GFX_HW_LINE = 0x00000800;
export const GFX_HW_LINE_XOR = 0x00001000;
export const GFX_HW_TRIANGLE = 0x00002000;
export const GFX_HW_TRIANGLE_XOR = 0x00004000;
export const GFX_HW_GLYPH = 0x00008000;
export const GFX_HW_VRAM_BLIT = 0x00010000;
export const GFX_HW_VRAM_BLIT_MASKED = 0x00020000;
export const GFX_HW_MEM_BLIT = 0x00040000;
export const GFX_HW_MEM_BLIT_MASKED = 0x00080000;
export const GFX_HW_SYS_TO_VRAM_BLIT = 0x00100000;
export const GFX_HW_SYS_TO_VRAM_BLIT_MASKED = 0x00200000;
export const GFX_SYSTEM_CURSOR = 0x00400000;
export const GFX_HW_VRAM_STRETCH_BLIT = 0x00800000;
export const GFX_HW_VRAM_STRETCH_BLIT_MASKED = 0x01000000;
export const GFX_HW_SYS_STRETCH_BLIT = 0x02000000;
export const GFX_HW_SYS_STRETCH_BLIT_MASKED = 0x04000000;

/// 1.9.14
export function enable_triple_buffer(): number {
  return 0;
}

/// 1.9.15
export function scroll_screen(x: number, y: number) {}

/// 1.9.16
export function request_scroll(x: number, y: number) {}

/// 1.9.17
export function poll_scroll() {}

/// 1.9.18
export function show_video_bitmap(bmp: BITMAP | undefined) {
  if (!bmp || bmp.w != screen.w || bmp.h != screen.h) {
    return;
  }

  draw_sprite(screen, bmp, 0, 0);
}

/// 1.9.19
export function request_video_bitmap(bmp: BITMAP | undefined) {
  return 0;
}

/// 1.9.20
export function vsync() {}

export let _gfx_installed = false;

/// default font
// eslint-disable-next-line @typescript-eslint/init-declarations
export let font!: FONT;

//@}