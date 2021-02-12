////////////////////////////////////////////
/// @name BITMAP OBJECTS
//@{

import { _downloadables } from "./core";
import { log } from "./debug";
import { blit } from "./sprites";
import { AllegroBitmap } from "./types";

/// Creates empty bitmap.
/// Creates a bitmap object of given dimensions and returns it.
/// @param width bitmap width
/// @param height bitmap height
/// @return bitmap object
export function create_bitmap(width: number, height: number): AllegroBitmap {
  log("Creating bitmap at " + width + " x " + height + "!");
  const cv = document.createElement("canvas");
  cv.width = width;
  cv.height = height;
  const ctx = cv.getContext("2d");

  if (!ctx) {
    throw new Error("Could not get context");
  }

  return {
    w: width,
    h: height,
    canvas: cv,
    context: ctx,
    ready: true,
    type: "bmp",
  };
}

/// Loads bitmap from file
/// Loads image from file asynchronously. This means that the execution won't stall for the image, and it's data won't be accessible right off the start. You can check for bitmap object's 'ready' member to see if it has loaded, but you probably should avoid stalling execution for that, as JS doesn't really like that.
/// @param filename URL of image
/// @return bitmap object, or -1 on error
export function load_bitmap(filename: string) {
  log("Loading bitmap " + filename + "...");
  const img = new Image();
  img.src = filename;
  const cv = document.createElement("canvas");
  const ctx = cv.getContext("2d");

  if (!ctx) {
    throw new Error("Context not defined");
  }

  const bmp: AllegroBitmap = {
    canvas: cv,
    context: ctx,
    w: -1,
    h: -1,
    ready: false,
    type: "bmp",
  };

  _downloadables.push(bmp);
  img.onload = () => {
    log(
      "Bitmap " +
        filename +
        " loaded, size: " +
        img.width +
        " x " +
        img.height +
        "!"
    );
    bmp.canvas.width = img.width;
    bmp.canvas.height = img.height;
    bmp.context.drawImage(img, 0, 0);
    bmp.w = img.width;
    bmp.h = img.height;
    bmp.ready = true;
  };
  return bmp;
}

/// Wrapper for load_bitmap
export function load_bmp(filename: string) {
  return load_bitmap(filename);
}

/// Loads sprite sheet
/// Loads image file containing animation frames, slices it up and returns array of frame bitmaps.
/// @param filename URL of image
/// @param w,h frame dimensions
/// @return bitmap object, or -1 on error
export function load_sheet(filename: string, w: number, h: number) {
  log("Loading spritesheet " + filename + "...");
  const img = new Image();
  img.src = filename;
  const cv = document.createElement("canvas");
  const ctx = cv.getContext("2d");

  if (!ctx) {
    throw new Error("Context not defined");
  }

  const bmp: AllegroBitmap = {
    canvas: cv,
    context: ctx,
    w: -1,
    h: -1,
    ready: false,
    type: "bmp",
  };

  const sheet: AllegroBitmap[] = [];

  _downloadables.push(bmp);

  img.onload = () => {
    log(
      "Sheet " +
        filename +
        " loaded, size: " +
        img.width +
        " x " +
        img.height +
        "!"
    );

    bmp.canvas.width = img.width;
    bmp.canvas.height = img.height;
    bmp.context.drawImage(img, 0, 0);
    bmp.w = img.width;
    bmp.h = img.height;
    bmp.ready = true;
    const nx = Math.floor(bmp.w / w),
      ny = Math.floor(bmp.h / h);

    for (let y = 0; y < ny; y += 1) {
      for (let x = 0; x < nx; x += 1) {
        const frame = create_bitmap(w, h);
        blit(bmp, frame, x * w, y * h, 0, 0, w, h);
        sheet.push(frame);
      }
    }
    log("Created " + sheet.length + " frames, each is " + w + "x" + h + "!");
  };
  return sheet;
}

//@}
