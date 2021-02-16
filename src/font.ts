////////////////////////////////////////////
/// @name TEXT OUTPUT
//@{

import { rectfill, _fillstyle, _strokestyle } from "./primitives.js";
import { BITMAP, ALLEGRO_CANVAS, FONT, RGB } from "./types.js";
import { vsprintf } from "./sprintf.js";

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

/// 1.19.2
export const allegro_404_char = "^";

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
  if (!bitmap) {
    return;
  }
  textout_ex(bitmap, f, s, x, y, colour, bg);
  bitmap.context.textAlign = "center";
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
  if (!bitmap) {
    return;
  }
  textout_ex(bitmap, f, s, x, y, colour, bg);
  bitmap.context.textAlign = "right";
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
  if (!bitmap) {
    return;
  }
  textout_ex(bitmap, f, s, x, y, colour, bg);
  bitmap.context.textAlign = "center";
}

/// 1.19.9
export function textprintf_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  x: number,
  y: number,
  colour: number,
  bg: number,
  s: string,
  ...args: (string | number)[]
) {
  textout_ex(bitmap, f, vsprintf(s, args), x, y, colour, bg);
}

/// 1.19.10
export function textprintf_centre_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  x: number,
  y: number,
  colour: number,
  bg: number,
  s: string,
  ...args: (string | number)[]
) {
  if (!bitmap) {
    return;
  }
  textout_ex(bitmap, f, vsprintf(s, args), x, y, colour, bg);
  bitmap.context.textAlign = "center";
}

/// 1.19.11
export function textprintf_right_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  x: number,
  y: number,
  colour: number,
  bg: number,
  s: string,
  ...args: (string | number)[]
) {
  if (!bitmap) {
    return;
  }
  textout_ex(bitmap, f, vsprintf(s, args), x, y, colour, bg);
  bitmap.context.textAlign = "right";
}

/// 1.19.12
export function textprintf_justify_ex(
  bitmap: BITMAP | ALLEGRO_CANVAS | undefined,
  f: FONT,
  x: number,
  y: number,
  colour: number,
  bg: number,
  s: string,
  ...args: (string | number)[]
) {
  if (!bitmap) {
    return;
  }
  textout_ex(bitmap, f, vsprintf(s, args), x, y, colour, bg);
  bitmap.context.textAlign = "center";
}

//@}
