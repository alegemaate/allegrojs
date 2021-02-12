////////////////////////////////////////////
/// @name DRAWING PRIMITIVES
// @{

import { PI2, RAD } from "./math";
import { AllegroBitmap, AllegroCanvas } from "./types";

/// Helper for setting fill style
export function _fillstyle(
  bitmap: AllegroBitmap | AllegroCanvas,
  colour: number
) {
  bitmap.context.fillStyle =
    "rgba(" +
    getr(colour) +
    "," +
    getg(colour) +
    "," +
    getb(colour) +
    "," +
    getaf(colour) +
    ")";
}

/// Helper for setting stroke style
export function _strokestyle(
  bitmap: AllegroBitmap | AllegroCanvas,
  colour: number,
  width = 1
) {
  bitmap.context.lineWidth = width;
  bitmap.context.strokeStyle =
    "rgba(" +
    getr(colour) +
    "," +
    getg(colour) +
    "," +
    getb(colour) +
    "," +
    getaf(colour) +
    ")";
}

/// Creates a 0xAARRGGBB from values
/// Overdrive is not permitted, so values over 255 (0xff) will get clipped.
/// @param r red component in 0-255 range
/// @param g green component in 0-255 range
/// @param b blue  component in 0-255 range
/// @param a alpha component in 0-255 range, defaults to 255 (fully opaque)
/// @return colour in 0xAARRGGBB format
export function makecol(r: number, g: number, b: number, a = 255) {
  return (a << 24) | ((r & 0xff) << 16) | ((g & 0xff) << 8) | (b & 0xff);
}

/// Creates 0xAARRGGBB from values
/// This is a float version of makecol, where all components should be in 0.0-1.0 range.
/// @param r red component in 0.0-1.0 range
/// @param g green component in 0.0-1.0 range
/// @param b blue  component in 0.0-1.0 range
/// @param a alpha component in 0.0-1.0 range, defaults to 1.0 (fully opaque)
/// @return colour in 0xAARRGGBB format
export function makecolf(r: number, g: number, b: number, a = 1.0) {
  return makecol(r * 255, g * 255, b * 255, a * 255);
}

/// Gets red bits from 0xRRGGBB
/// This one does clip.
/// @param colour colour in 0xAARRGGBB format
/// @return red component in 0-255 range
export function getr(colour: number) {
  return (colour >> 16) & 0xff;
}

/// Gets red bits from 0xRRGGBB
/// This one too.
/// @param colour colour in 0xAARRGGBB format
/// @return green component in 0-255 range
export function getg(colour: number) {
  return (colour >> 8) & 0xff;
}

/// Gets red bits from 0xRRGGBB
/// This one clips as well.
/// @param colour colour in 0xAARRGGBB format
/// @return blue component in 0-255 range
export function getb(colour: number) {
  return colour & 0xff;
}

/// Gets alpha bits from 0xAARRGGBB
/// This one doesn't.
/// @param colour colour in 0xAARRGGBB format
/// @return alpha component in 0-255 range
export function geta(colour: number) {
  return colour >>> 24;
}

/// Float (0.0-1.0) version of getr()
/// @param colour colour in 0xAARRGGBB format
/// @return red component in 0.0-1.0 range
export function getrf(colour: number) {
  return (colour >> 16) & (0xff / 255.0);
}

/// Float (0.0-1.0) version of getg()
/// @param colour colour in 0xAARRGGBB format
/// @return green component in 0.0-1.0 range
export function getgf(colour: number) {
  return (colour >> 8) & (0xff / 255.0);
}

/// Float (0.0-1.0) version of getb()
/// @param colour colour in 0xAARRGGBB format
/// @return blue component in 0.0-1.0 range
export function getbf(colour: number) {
  return colour & (0xff / 255.0);
}

/// Float (0.0-1.0) version of geta()
/// @param colour colour in 0xAARRGGBB format
/// @return alpha component in 0.0-1.0 range
export function getaf(colour: number) {
  return (colour >>> 24) / 255.0;
}

/// Gets pixel colour from bitmap
/// Reads pixel from bitmap at given coordinates. This is probably super slow, and shouldn't be used inside loops.
/// @param bitmap bitmap object to poll
/// @param x x coordinate of pixel
/// @param y y coordinate of pixel
/// @return colour in 0xAARRGGBB format
export function getpixel(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y: number
) {
  const { data } = bitmap.context.getImageData(x, y, 1, 1);

  return (
    ((data[3] ?? 0) << 24) |
    (((data[0] ?? 0) & 0xff) << 16) |
    (((data[1] ?? 0) & 0xff) << 8) |
    ((data[2] ?? 0) & 0xff)
  );
}

/// Gets pixel colour from bitmap
/// Reads pixel from bitmap at given coordinates. This is probably super slow, and shouldn't be used inside loops.
/// @param bitmap bitmap object to update
/// @param x x coordinate of pixel
/// @param y y coordinate of pixel
/// @param colour colour in 0xAARRGGBB format
export function putpixel(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y: number,
  colour: number
) {
  _fillstyle(bitmap, colour);
  bitmap.context.fillRect(x, y, 1, 1);
}

/// Clears bitmap to transparent black.
/// Fills the entire bitmap with 0 value, which represents transparent black.
/// @param bitmap bitmap to be cleared
export function clear_bitmap(bitmap: AllegroBitmap) {
  bitmap.context.clearRect(0, 0, bitmap.w, bitmap.h);
}

/// Clears bitmap to specified colour.
/// Fills the entire bitmap with colour value.
/// @param bitmap bitmap to be cleared
/// @param colour colour in 0xAARRGGBB format
export function clear_to_color(
  bitmap: AllegroBitmap | AllegroCanvas,
  colour: number
) {
  bitmap.context.clearRect(0, 0, bitmap.w, bitmap.h);
  _fillstyle(bitmap, colour);
  bitmap.context.fillRect(0, 0, bitmap.w, bitmap.h);
}

/// Draws a line.
/// Draws a line from one point to another using given colour.
/// @param bitmap to be drawn to
/// @param x1,y1 start point coordinates
/// @param x2,y2 end point coordinates
/// @param colour colour in 0xAARRGGBB format
/// @param width line width
export function line(
  bitmap: AllegroBitmap | AllegroCanvas,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  colour: number,
  width: number
) {
  _strokestyle(bitmap, colour, width);
  bitmap.context.beginPath();
  bitmap.context.moveTo(x1, y1);
  bitmap.context.lineTo(x2, y2);
  bitmap.context.stroke();
}

/// Draws a vertical line.
/// Draws a vertical line from one point to another using given colour. Probably slightly faster than line() method, since this one uses rectfill() to draw the line.
/// @param bitmap to be drawn to
/// @param x column to draw the line to
/// @param y1,y2 line endpoints
/// @param colour colour in 0xAARRGGBB format
/// @param width line width (defaults to 1)
export function vline(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y1: number,
  y2: number,
  colour: number,
  width = 1
) {
  _fillstyle(bitmap, colour);
  bitmap.context.fillRect(x - width / 2, y1, width, y2 - y1);
}

/// Draws a horizontal line.
/// Draws a horizontal line from one point to another using given colour. Probably slightly faster than line() method, since this one uses rectfill() to draw the line.
/// @param bitmap to be drawn to
/// @param y row to draw the line to
/// @param x1,x2 line endpoints
/// @param colour colour in 0xAARRGGBB format
/// @param width line width (defaults to 1)
export function hline(
  bitmap: AllegroBitmap | AllegroCanvas,
  x1: number,
  y: number,
  x2: number,
  colour: number,
  width = 1
) {
  _fillstyle(bitmap, colour);
  bitmap.context.fillRect(x1, y - width / 2, x2 - x1, width);
}

/// Draws a triangle.
/// Draws a triangle using three coordinates. The triangle is not filled.
/// @param bitmap to be drawn to
/// @param x1,y1 first point coordinates
/// @param x2,y2 second point coordinates
/// @param x3,y3 third point coordinates
/// @param colour colour in 0xAARRGGBB format
/// @param width line width
export function triangle(
  bitmap: AllegroBitmap | AllegroCanvas,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  colour: number,
  width: number
) {
  _strokestyle(bitmap, colour, width);
  bitmap.context.beginPath();
  bitmap.context.moveTo(x1, y1);
  bitmap.context.lineTo(x2, y2);
  bitmap.context.lineTo(x3, y3);
  bitmap.context.closePath();
  bitmap.context.stroke();
}

/// Draws a triangle.
/// Draws a triangle using three coordinates. The triangle is filled.
/// @param bitmap to be drawn to
/// @param x1,y1 first point coordinates
/// @param x2,y2 second point coordinates
/// @param x3,y3 third point coordinates
/// @param colour colour in 0xAARRGGBB format
export function trianglefill(
  bitmap: AllegroBitmap | AllegroCanvas,
  x1: number,
  y1: number,
  x2: number,
  y2: number,
  x3: number,
  y3: number,
  colour: number
) {
  _fillstyle(bitmap, colour);
  bitmap.context.beginPath();
  bitmap.context.moveTo(x1, y1);
  bitmap.context.lineTo(x2, y2);
  bitmap.context.lineTo(x3, y3);
  bitmap.context.closePath();
  bitmap.context.fill();
}

/// Draws a polygon.
/// Draws a polygon using three coordinates. The polygon is not filled.
/// @param bitmap to be drawn to
/// @param vertices number of vertices to draw
/// @param points array containing vertices*2 elements of polygon coordinates in [x1,y1,x2,y2,x3...] format
/// @param colour colour in 0xAARRGGBB format
/// @param width line width
export function polygon(
  bitmap: AllegroBitmap | AllegroCanvas,
  vertices: number,
  points: number[],
  colour: number,
  width: number
) {
  _strokestyle(bitmap, colour, width);
  bitmap.context.beginPath();
  for (let c = 0; c < vertices; c += 1) {
    if (c) bitmap.context.lineTo(points[c * 2] ?? 0, points[c * 2 + 1] ?? 0);
    else bitmap.context.moveTo(points[c * 2] ?? 0, points[c * 2 + 1] ?? 0);
  }
  bitmap.context.closePath();
  bitmap.context.stroke();
}

/// Draws a polygon.
/// Draws a polygon using three coordinates. The polygon is filled.
/// @param bitmap to be drawn to
/// @param vertices number of vertices to draw
/// @param points array containing vertices*2 elements of polygon coordinates in [x1,y1,x2,y2,x3...] format
/// @param colour colour in 0xAARRGGBB format
export function polygonfill(
  bitmap: AllegroBitmap | AllegroCanvas,
  vertices: number,
  points: number[],
  colour: number
) {
  _fillstyle(bitmap, colour);
  bitmap.context.beginPath();
  for (let c = 0; c < vertices; c += 1) {
    if (c) bitmap.context.lineTo(points[c * 2] ?? 0, points[c * 2 + 1] ?? 0);
    else bitmap.context.moveTo(points[c * 2] ?? 0, points[c * 2 + 1] ?? 0);
  }
  bitmap.context.closePath();
  bitmap.context.fill();
}

/// Draws a rectangle.
/// Draws a rectangle from one point to another using given colour. The rectangle is not filled. Opposed to traditional allegro approach, width and height have to be provided, not an end point.
/// @param bitmap to be drawn to
/// @param x1,y1 start point coordinates
/// @param w,h width and height
/// @param colour colour in 0xAARRGGBB format
/// @param width line width
export function rect(
  bitmap: AllegroBitmap | AllegroCanvas,
  x1: number,
  y1: number,
  w: number,
  h: number,
  colour: number,
  width: number
) {
  _strokestyle(bitmap, colour, width);
  bitmap.context.strokeRect(x1, y1, w, h);
}

/// Draws a rectangle.
/// Draws a rectangle from one point to another using given colour. The rectangle is filled. Opposed to traditional allegro approach, width and height have to be provided, not an end point.
/// @param bitmap to be drawn to
/// @param x1,y1 start point coordinates
/// @param w,h width and height
/// @param colour colour in 0xAARRGGBB format
export function rectfill(
  bitmap: AllegroBitmap | AllegroCanvas,
  x1: number,
  y1: number,
  w: number,
  h: number,
  colour: number
) {
  _fillstyle(bitmap, colour);
  bitmap.context.fillRect(x1, y1, w, h);
}

/// Draws a circle.
/// Draws a circle at specified centre point and radius. The circle is not filled
/// @param bitmap to be drawn to
/// @param x,y centre point coordinates
/// @param r circle radius
/// @param colour colour in 0xAARRGGBB format
/// @param width line width
export function circle(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y: number,
  radius: number,
  colour: number,
  width: number
) {
  _strokestyle(bitmap, colour, width);
  bitmap.context.beginPath();
  bitmap.context.arc(x, y, radius, 0, PI2);
  bitmap.context.stroke();
}

/// Draws a circle.
/// Draws a circle at specified centre point and radius. The circle is filled
/// @param bitmap to be drawn to
/// @param x,y centre point coordinates
/// @param r circle radius
/// @param colour colour in 0xAARRGGBB format
export function circlefill(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y: number,
  radius: number,
  colour: number
) {
  _fillstyle(bitmap, colour);
  bitmap.context.beginPath();
  bitmap.context.arc(x, y, radius, 0, PI2);
  bitmap.context.fill();
}

/// Draws a arc.
/// Draws a circle at specified centre point and radius. The arc is not filled
/// @param bitmap to be drawn to
/// @param x,y centre point coordinates
/// @param ang1,ang2 angles to draw the arc between measured anticlockwise from the positive x axis in degrees
/// @param r radius
/// @param colour colour in 0xAARRGGBB format
/// @param width line width
export function arc(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y: number,
  ang1: number,
  ang2: number,
  r: number,
  colour: number,
  width: number
) {
  _strokestyle(bitmap, colour, width);
  bitmap.context.beginPath();
  if (ang1 > ang2) {
    bitmap.context.arc(x, y, r, RAD(ang1), RAD(ang2));
  } else {
    bitmap.context.arc(x, y, r, RAD(ang1), RAD(ang2));
  }
  bitmap.context.stroke();
}

/// Draws a arc.
/// Draws a circle at specified centre point and radius. The arc is filled
/// @param bitmap to be drawn to
/// @param x,y centre point coordinates
/// @param ang1,ang2 angles to draw the arc between measured anticlockwise from the positive x axis in degrees
/// @param r radius
/// @param colour colour in 0xAARRGGBB format
export function arcfill(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y: number,
  ang1: number,
  ang2: number,
  r: number,
  colour: number
) {
  _fillstyle(bitmap, colour);
  bitmap.context.beginPath();
  if (ang1 > ang2) {
    bitmap.context.arc(x, y, r, RAD(ang1), RAD(ang2));
  } else {
    bitmap.context.arc(x, y, r, RAD(ang1), RAD(ang2));
  }
  bitmap.context.fill();
}

/// Draws an ellipse.
/// Draws an ellipse at specified centre point and radius. The ellipse is not filled
/// @param bitmap to be drawn to
/// @param x,y centre point coordinates
/// @param rx,ry ellipse radius in x and y
/// @param colour colour in 0xAARRGGBB format
/// @param width line width
export function ellipse(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y: number,
  rx: number,
  ry: number,
  colour: number,
  width: number
) {
  _strokestyle(bitmap, colour, width);
  bitmap.context.save();
  bitmap.context.translate(x, y);
  bitmap.context.scale(rx, ry);
  bitmap.context.beginPath();
  bitmap.context.arc(0, 0, 1, 0, PI2);
  bitmap.context.restore();
  bitmap.context.stroke();
}

/// Draws an ellipse.
/// Draws an ellipse at specified centre point and radius. The ellipse is filled
/// @param bitmap to be drawn to
/// @param x,y centre point coordinates
/// @param rx,ry ellipse radius in x and y
/// @param colour colour in 0xAARRGGBB format
export function ellipsefill(
  bitmap: AllegroBitmap | AllegroCanvas,
  x: number,
  y: number,
  rx: number,
  ry: number,
  colour: number
) {
  _fillstyle(bitmap, colour);
  bitmap.context.save();
  bitmap.context.translate(x, y);
  bitmap.context.scale(rx, ry);
  bitmap.context.beginPath();
  bitmap.context.arc(0, 0, 1, 0, PI2);
  bitmap.context.restore();
  bitmap.context.fill();
}

//@}
