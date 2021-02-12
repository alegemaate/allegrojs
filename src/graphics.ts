////////////////////////////////////////////
/// @name GRAPHICS MODES
//@{

import { _error } from "./debug";
import { AllegroCanvas } from "./types";

/// Screen bitmap
/// This is the bitmap object representing the main drawing canvas. Drawing anything on the screen bitmap displays it.
let canvas: AllegroCanvas | null = null;

let _gfx_installed = false;

/// Screen bitmap width in pixels
let SCREEN_W = 0;

/// Screen bitmap height in pixels
let SCREEN_H = 0;

/// default font
let font;

/// Enables graphics.
/// This function should be before calling any other graphics routines. It selects the canvas element for rendering and sets the resolution. It also loads the default font.
/// @param canvas_id id attribute of canvas to be used for drawing.
/// @param width canvas width in pixels, 0 for don't care (will use actual canvas size)
/// @param height canvas height in pixels, 0 for don't care (will use actual canvas size)
/// @param smooth disable/enable pixel smoothing, deaults to true
/// @return 0 on success or -1 on error
function set_gfx_mode(
  canvas_id: string,
  width: number,
  height: number,
  smooth: boolean = true
) {
  const cv = document.getElementById(canvas_id) as HTMLCanvasElement;
  if (!cv) {
    _error("Can't find canvas with id " + canvas_id);
    return -1;
  }

  const rect = cv.getBoundingClientRect();
  if (!width) width = rect.width;
  if (!height) height = rect.height;

  cv.width = width;
  cv.height = height;

  const ctx = cv.getContext("2d");
  if (!ctx) {
    throw new Error("Context not defined");
  }

  // turn off image aliasing
  ctx.imageSmoothingEnabled = smooth;

  SCREEN_W = width;
  SCREEN_H = height;
  canvas = { w: width, h: height, canvas: cv, context: ctx, ready: true };
  font = load_base64_font(_cartoon_woff);
  _gfx_installed = true;
  log("Graphics mode set to " + width + " x " + height);
  return 0;
}

//@}
