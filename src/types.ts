////////////////////////////////////////////
/// @name TYPES
//@{
export type AllegroCanvas = {
  w: number;
  h: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  ready: boolean;
};

/// Touch object
/// This is not a function, it's the structure of touch object found in touch[] array and inside touch_pressed touch_released. You can retain the touch obect picked up from touch_pressed in your code, but remember to let go of the dead ones.
/// @param x,y current touch position
/// @param mx,my delta position (amount of pixels moved)
/// @param px,py previous touch position
/// @param sx,sy starting touch position
/// @param id touch id
/// @param age how many loops is the touch in
/// @param dead true when touch is released
export type AllegroTouchEvent = {
  sx: number;
  sy: number;
  mx: number;
  my: number;
  px: number;
  py: number;
  x: number;
  y: number;
  id: number;
  dead: boolean;
  age: number;
};

/// Sample object
/// This is not a function. This is a sample object structure returned by load_sample().
/// @param element HTML <audio> element containing the sound properties
/// @param file sample file name
/// @param volume sample volume, this is combined with global volume
/// @param ready loaded indicator flag
/// @param type object type, "snd" in this case
export type AllegroSample = {
  element: HTMLAudioElement;
  file: string;
  volume: number;
  ready: boolean;
  type: "snd";
};

/// Bitmap object
/// This is not a function, it's the structure of bitmap object returned from load_bitmap() and create_bitmap(). For every bitmap laoded or created, a canvas element is created. Loaded images are then drawn onto the canvas, so that you can easily manipulate images and everything is consistent. You can also load a single file two times and modify it differently for each instance.
/// @param w bitmap width
/// @param h bitmap height
/// @param canvas underlying canvas element, used to draw the bitmap onto stuff
/// @param context canvas' rendering context, used to draw stuff onto this bitmap
/// @param ready flags whether loading of the bitmap is complete
/// @param type object type, "bmp" in this case
export type AllegroBitmap = {
  w: number;
  h: number;
  canvas: HTMLCanvasElement;
  context: CanvasRenderingContext2D;
  ready: boolean;
  type: "bmp";
};

/// Font object
/// This is not a function but a reference entry for font object returned by load_font() and create_cont().
/// @param element <style> element containing the font-face declaration. Not available for create_font() fonts and default font object.
/// @param file font file name, empty string for default font and create_font() typefaces.
/// @param name font-family name
/// @param type object type, "fnt" in this case
export type AllegroFont = {
  element: HTMLStyleElement | null;
  file: string;
  name: string;
  type: "fnt";
};

/// Timer object
/// @param timer timer function
/// @param id timer id
export type AllegroTimer = {
  timer: () => void;
  id: number;
};

//@}
