////////////////////////////////////////////
/// @name TEXT OUTPUT
//@{

import { rectfill, _fillstyle, _strokestyle } from "./primitives.js";
import { BITMAP, ALLEGRO_CANVAS, FONT, RGB } from "./types.js";

export const _cartoon_woff =
  "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";

let _num_fonts = 0;

/// 1.18.1
export function register_font_file_type(
  ext: string,
  load: (filename: string, pal: RGB, param: string) => void
) {}

/// 1.18.2 Loads font from file.
/// This actually creates a style element, puts code inside and appends it to class. I heard it works all the time most of the time. Note that this function won't make ready() wait, as it's not possible to consistently tell if a font has been loaded in js, thus load your fonts first thing, and everything should be fine.
/// @param filename Font file URL
/// @return font object
export function load_font(filename: string, size: number = 12): FONT {
  const s = document.createElement("style");
  _num_fonts += 1;
  const fontname = "font" + _num_fonts;
  s.id = fontname;
  s.type = "text/css";
  document.head.appendChild(s);
  s.textContent =
    "@font-face { font-family: " + fontname + "; src:url('" + filename + "');}";
  return { element: s, file: filename, name: fontname, size, type: "fnt" };
}

/// 1.18.3
export function destroy_font(f: FONT) {}

/// 1.18.4
export function make_trans_font(f: FONT) {}

/// 1.18.5
export function is_color_font(f: FONT) {
  return true;
}

/// 1.18.6
export function is_mono_font(f: FONT) {
  return false;
}

/// 1.18.7
export function is_compatible_font(f: FONT) {
  return true;
}

/// 1.18.8
export function get_font_ranges(f: FONT) {
  return 1;
}

/// 1.18.9
export function get_font_range_begin(f: FONT, range: number) {
  return 1;
}

/// 1.18.10
export function get_font_range_end(f: FONT, range: number) {
  return 1;
}

/// 1.18.11
export function extract_font_range(f: FONT, begin: number, end: number) {
  return f;
}

/// 1.18.12
export function transpose_font(f: FONT, drange: number) {
  return f;
}

/// 1.18.13
export function merge_fonts(f1: FONT, f2: FONT) {
  return f1;
}

/// Loads font from file.
/// This actually creates a style element, puts code inside and appends it to class. I heard it works all the time most of the time. AS ready() won't wait for fonts to load, this will allow you to have a font straight away with base64 data. Data should be WOFF converted to base64 without line breaks.
/// @param data base64 string of a WOFF file
/// @return font object
export function load_base64_font(data: string, size: number = 12): FONT {
  const s = document.createElement("style");
  _num_fonts += 1;
  const fontname = "font" + _num_fonts;
  s.id = fontname;
  s.type = "text/css";
  s.textContent =
    "@font-face { font-family: " +
    fontname +
    "; src:url('data:application/font-woff;base64," +
    data +
    "') format('woff');}";
  document.head.appendChild(s);

  return { element: s, file: "", name: fontname, size, type: "fnt" };
}

/// Creates a font objects from font-family
/// This creates a font element using an existing font-family name.
/// @param family font-family property, can be 'serif', 'sans-serif' or anything else that works
/// @return font object
export function create_font(family: string, size: number = 12): FONT {
  return { element: null, file: "", name: family, size, type: "fnt" };
}

/// 1.19.2
export const allegro_404_char = "";

/// 1.19.3
export function text_length(f: FONT, str: string) {
  return str.length;
}

/// 1.19.4
export function text_height(f: FONT) {
  return 1;
}

/// 1.19.5
export function textout_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  s: string,
  x: number,
  y: number,
  colour: number,
  bg: number
) {
  if (!bitmap) {
    return;
  }
  if (bg !== -1) {
    rectfill(bitmap, x, y, 10, 10, bg);
  }
  bitmap.context.font = f.size + "px " + f.name;
  bitmap.context.textAlign = "left";
  _fillstyle(bitmap, colour);
  bitmap.context.fillText(s, x, y + f.size);
}

/// 1.19.6
export function textout_centre_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  s: string,
  x: number,
  y: number,
  colour: number,
  bg: number
) {
  return textout_ex(bitmap, f, s, x, y, colour, bg);
}

/// 1.19.7
export function textout_right_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  s: string,
  x: number,
  y: number,
  colour: number,
  bg: number
) {
  return textout_ex(bitmap, f, s, x, y, colour, bg);
}

/// 1.19.8
export function textout_justify_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  s: string,
  x: number,
  y: number,
  colour: number,
  bg: number
) {
  return textout_ex(bitmap, f, s, x, y, colour, bg);
}

/// 1.19.9
export function textprintf_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  x: number,
  y: number,
  colour: number,
  bg: number,
  s: string
) {
  return textout_ex(bitmap, f, s, x, y, colour, bg);
}

/// 1.19.10
export function textprintf_centre_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  x: number,
  y: number,
  colour: number,
  bg: number,
  s: string
) {
  return textout_ex(bitmap, f, s, x, y, colour, bg);
}

/// 1.19.11
export function textprintf_right_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  x: number,
  y: number,
  colour: number,
  bg: number,
  s: string
) {
  return textout_ex(bitmap, f, s, x, y, colour, bg);
}

/// 1.19.12
export function textprintf_justify_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  x: number,
  y: number,
  colour: number,
  bg: number,
  s: string
) {
  return textout_ex(bitmap, f, s, x, y, colour, bg);
}

//@}
