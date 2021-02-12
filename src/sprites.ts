////////////////////////////////////////////
/// @name BLITTING AND SPRITES
//@{

import { RAD } from "./math";
import { AllegroBitmap } from "./types";

/// Draws a sprite
/// This is probably the fastest method to get images on screen. The image will be centered. Opposed to traditional allegro approach, sprite is drawn centered.
/// @param bmp target bitmap
/// @param sprite sprite bitmap
/// @param x,y coordinates of the top left corder of the image center
export function draw_sprite(
  bmp: AllegroBitmap,
  sprite: AllegroBitmap,
  x: number,
  y: number
) {
  bmp.context.drawImage(sprite.canvas, x - sprite.w / 2, y - sprite.h / 2);
}

/// Draws a stretched sprite
/// Draws a sprite stretching it to given width and height. The sprite will be centered. You can omit sy value for uniform scaling. YOu can use negative scale for flipping. Scaling is around the center.
/// @param bmp target bitmap
/// @param sprite sprite bitmap
/// @param x,y coordinates of the top left corder of the image
/// @param sx horizontal scale , 1.0 is unscaled
/// @param sy vertical scale (defaults to sx)
export function scaled_sprite(
  bmp: AllegroBitmap,
  sprite: AllegroBitmap,
  x: number,
  y: number,
  sx: number,
  sy: number
) {
  sy = typeof sy !== "undefined" ? sy : sx;
  const u = (sx * sprite.w) / 2;
  const v = (sy * sprite.h) / 2;
  bmp.context.save();
  bmp.context.translate(x - u, y - v);
  bmp.context.scale(sx, sy);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}

/// Draws a rotated sprite
/// Draws a sprite rotating it around its centre point. The sprite will be centred and rotated around its centre.
/// @param bmp target bitmap
/// @param sprite sprite bitmap
/// @param x,y coordinates of the centre of the image
/// @param angle angle of rotation in degrees
export function rotate_sprite(
  bmp: AllegroBitmap,
  sprite: AllegroBitmap,
  x: number,
  y: number,
  angle: number
) {
  const u = sprite.w / 2;
  const v = sprite.h / 2;
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.rotate(RAD(angle));
  bmp.context.translate(-u, -v);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}

/// Draws a sprite rotated around an arbitrary point
/// Draws a sprite rotating it around a given point. Sprite is drawn centered to the pivot point. The pivot point is relative to top-left corner of the image.
/// @param bmp target bitmap
/// @param sprite sprite bitmap
/// @param x,y target coordinates of the pivot point
/// @param cx,cy pivot point coordinates
/// @param angle angle of rotation in degrees
export function pivot_sprite(
  bmp: AllegroBitmap,
  sprite: AllegroBitmap,
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number
) {
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.rotate(RAD(angle));
  bmp.context.translate(-cx, -cy);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}

/// Draws a rotated sprite and scales it
/// Draws a sprite rotating it around its centre point. The sprite is also scaled. You can omit sy value for uniform scaling. YOu can use negative scale for flipping. Scaling is around the center. The sprite will be centred and rotated around its centre.
/// @param bmp target bitmap
/// @param sprite sprite bitmap
/// @param x,y coordinates of the centre of the image
/// @param angle angle of rotation in degrees
/// @param sx horizontal scale, 1.0 is unscaled
/// @param sy vertical scale (defaults to sx)
export function rotate_scaled_sprite(
  bmp: AllegroBitmap,
  sprite: AllegroBitmap,
  x: number,
  y: number,
  angle: number,
  sx: number,
  sy: number
) {
  sy = typeof sy !== "undefined" ? sy : sx;
  var u = (sx * sprite.w) / 2;
  var v = (sy * sprite.h) / 2;
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.rotate(RAD(angle));
  bmp.context.translate(-u, -v);
  bmp.context.scale(sx, sy);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}

/// Draws a sprite rotated around an arbitrary point and scaled
/// Draws a sprite rotating it around a given point. The sprite is also scaled. Sprite is drawn centered to the pivot point. The pivot point is relative to top-left corner of the image  before scaling. You can omit sy value for uniform scaling. You can use negative scale for flipping.
/// @param bmp target bitmap
/// @param sprite sprite bitmap
/// @param x,y target coordinates of the pivot point
/// @param cx,cy pivot point coordinates
/// @param angle angle of rotation in degrees
/// @param sx horizontal scale , 1.0 is unscaled
/// @param sy vertical scale (defaults to sx)
export function pivot_scaled_sprite(
  bmp: AllegroBitmap,
  sprite: AllegroBitmap,
  x: number,
  y: number,
  cx: number,
  cy: number,
  angle: number,
  sx: number,
  sy: number
) {
  sy = typeof sy !== "undefined" ? sy : sx;
  var u = sx * cx;
  var v = sy * cy;
  bmp.context.save();
  bmp.context.translate(x, y);
  bmp.context.rotate(RAD(angle));
  bmp.context.translate(-u, -v);
  bmp.context.scale(sx, sy);
  bmp.context.drawImage(sprite.canvas, 0, 0);
  bmp.context.restore();
}

/// Blit
/// This is how you draw backgrounds and stuff. masked_ versions are omitted, since everything is 32-bit RGBA anyways. The source and dest parameters are swapped compared to draw_sprite for historical, 20 year old reasons that must stay the same no matter what.
/// @param source source bitmap
/// @param dest destination bitmap
/// @param sx,sy source origin
/// @param dx,dy top-left bitmap corner coordinates in target bitmap
/// @param w,h blit size
/// @todo make rotated versions of this
/// @todo tell everyone that blitting to itself is slower than the other thing (requires copy?)
export function blit(
  source: AllegroBitmap,
  dest: AllegroBitmap,
  sx: number,
  sy: number,
  dx: number,
  dy: number,
  w: number,
  h: number
) {
  dest.context.drawImage(source.canvas, sx, sy, w, h, dx, dy, w, h);
}

/// Simple Blit
/// Simplified version of blit, works pretty much like draw_sprite but draws from the corner
/// @param source source bitmap
/// @param dest destination bitmap
/// @param x,y top-left bitmap corner coordinates in target bitmap
/// @todo make rotated versions of this
/// @todo tell everyone that blitting to itself is slower than the other thing (requires copy?)
export function simple_blit(
  source: AllegroBitmap,
  dest: AllegroBitmap,
  x: number,
  y: number
) {
  dest.context.drawImage(source.canvas, x, y);
}

/// Scaled blit
/// Draws a scaled chunk of an image on a bitmap. It's not slower.
/// @param source source bitmap
/// @param dest destination bitmap
/// @param sx,sy source origin
/// @param sw,sh source dimensions
/// @param dx,dy top-left bitmap corner coordinates in target bitmap
/// @param dw,dh destination dimensions
export function stretch_blit(
  source: AllegroBitmap,
  dest: AllegroBitmap,
  sx: number,
  sy: number,
  sw: number,
  sh: number,
  dx: number,
  dy: number,
  dw: number,
  dh: number
) {
  dest.context.drawImage(source.canvas, sx, sy, sw, sh, dx, dy, dw, dh);
}

//@}
