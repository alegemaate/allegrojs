////////////////////////////////////////////
/// @name GRAPHICS MODES
//@{

import { log, _error } from "./debug.js";
import { load_base64_font, _cartoon_woff } from "./font.js";
import { AllegroCanvas, AllegroFont } from "./types.js";

const tmpCanvas = document.createElement("canvas");

/// Screen bitmap
/// This is the bitmap object representing the main drawing canvas. Drawing anything on the screen bitmap displays it.
export const canvas: AllegroCanvas = {
  w: 0,
  h: 0,
  canvas: tmpCanvas,
  context: (tmpCanvas.getContext("2d") as unknown) as CanvasRenderingContext2D,
  ready: false,
};

export let _gfx_installed = false;

/// Screen bitmap width in pixels
export let SCREEN_W = 0;

/// Screen bitmap height in pixels
export let SCREEN_H = 0;

/// default font
// eslint-disable-next-line @typescript-eslint/init-declarations
export let font!: AllegroFont;

/// Enables graphics.
/// This function should be before calling any other graphics routines. It selects the canvas element for rendering and sets the resolution. It also loads the default font.
/// @param canvas_id id attribute of canvas to be used for drawing.
/// @param width canvas width in pixels, 0 for don't care (will use actual canvas size)
/// @param height canvas height in pixels, 0 for don't care (will use actual canvas size)
/// @param smooth disable/enable pixel smoothing, deaults to true
/// @return 0 on success or -1 on error
export function set_gfx_mode(
  canvas_id: string,
  width?: number,
  height?: number,
  smooth = true
) {
  const cv = document.getElementById(canvas_id) as
    | HTMLCanvasElement
    | undefined;
  if (!cv) {
    _error("Can't find canvas with id " + canvas_id);
    return -1;
  }

  const rect = cv.getBoundingClientRect();
  const cmp_width = width ?? rect.width;
  const cmp_height = height ?? rect.height;

  cv.width = cmp_width;
  cv.height = cmp_height;

  const ctx = cv.getContext("2d");
  if (!ctx) {
    throw new Error("Context not defined");
  }

  // Turn off image aliasing
  ctx.imageSmoothingEnabled = smooth;

  SCREEN_W = cmp_width;
  SCREEN_H = cmp_height;

  canvas.w = cmp_width;
  canvas.h = cmp_height;
  canvas.canvas = cv;
  canvas.context = ctx;
  canvas.ready = true;

  font = load_base64_font(_cartoon_woff);
  _gfx_installed = true;
  log("Graphics mode set to " + cmp_width + " x " + cmp_height);
  return 0;
}

//@}
