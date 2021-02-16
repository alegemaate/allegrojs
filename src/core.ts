/// @name CORE ROUTINES
//@{

import { log } from "./debug.js";
import { SCREEN_H, SCREEN_W } from "./graphics.js";
import { _keyboard_loop } from "./keyboard.js";
import { scaleclamp } from "./math.js";
import { _mouse_loop, _mouse_loop_reset } from "./mouse.js";
import { rectfill } from "./primitives.js";
import { time } from "./timer.js";
import { _touch_loop } from "./touch.js";
import { makecol } from "./color.js";
import { BITMAP, SAMPLE } from "./types.js";
import { screen } from "./bitmap.js";

/// All downloadable objects
export const _downloadables: (BITMAP | SAMPLE)[] = [];

/// registered loop procedure
let _loopproc = () => {
  // Do nothing
};

/// Performs some loop tasks, such as cleaning up pressed[] and released[]
export function _uberloop() {
  _mouse_loop();
  _loopproc();
  _keyboard_loop();
  _mouse_loop_reset();
  _touch_loop();
}

/// Game loop interrupt
/// Loop is the same as interrupt, except, it cannot be stopped once it's started. It's meant for game loop. remove_int() and remove_all_ints() have no effect on this. Since JS can't have blocking (continuously executing) code and realise on events and timers, you cannot have your game loop inside a while or for argument. Instead, you should use this to create your game loop to be called at given interval. There should only be one loop() function! Note that mouse mickeys (mouse_mx, etc.), and pressed indicators (pressed[] and mouse_pressed) will only work inside loop()
/// @param procedure function to be looped, preferably inline, but let's not talk coding styles here
/// @param speed speed in the same format as install_int_ex()
export function loop(procedure: () => void, speed: number) {
  _loopproc = procedure;
  window.setInterval(_uberloop, speed);
  log("Game loop initialised!");
}

/// time when ready() was called
let _loader_init_time = 0;

/// Holds the download complete handler function
let _ready_proc = () => {
  // Do nothing
};

/// Holds the download complete handler function
let _bar_proc = (progress: number) => {
  // Do nothing
  void progress;
};

/// checks if everything has downloaded in intervals
export function _progress_check() {
  let num_assets = 0;
  let num_loaded = 0;
  _downloadables.forEach((down) => {
    num_assets += 1;
    if (down.type === "snd") {
      if (down.element.readyState >= down.element.HAVE_FUTURE_DATA) {
        down.ready = true;
      }
    }
    if (down.ready) num_loaded += 1;
  });
  _bar_proc(num_assets / num_loaded);
  if (num_loaded < num_assets) {
    window.setTimeout(_progress_check, 100);
  } else {
    log(
      "Loading complete! Took " +
        ((time() - _loader_init_time) / 1000).toFixed(1) +
        " seconds!"
    );
    _ready_proc();
  }
}

/// Default loading bar rendering
/// This function is used by ready() to display a simple loading bar on screen. You need to manually specify a dummy function if you don't want loading screen.
/// @param progress loading progress in 0.0 - 1.0 range
export function loading_bar(progress: number) {
  rectfill(screen, 5, SCREEN_H - 55, SCREEN_W - 10, 50, makecol(0, 0, 0));
  rectfill(
    screen,
    10,
    SCREEN_H - 50,
    SCREEN_W - 20,
    40,
    makecol(255, 255, 255)
  );
  rectfill(screen, 15, SCREEN_H - 45, SCREEN_W - 30, 30, makecol(0, 0, 0));
  rectfill(
    screen,
    20,
    SCREEN_H - 40,
    scaleclamp(progress, 0, 1, 0, SCREEN_W - 40),
    20,
    makecol(255, 255, 255)
  );
}

/// Installs a handler to check if everything has downloaded.
/// You should always wrap your loop() function around it, unless there is nothing external you need. load_bitmap() and load_sample() all require some time to process and the execution cannot be stalled for that, so all code you wrap in this hander will only get executed after everything has loaded making sure you can access bitmap properties and data and play samples right away.  Note that load_font() does not affect ready(), so you should always load your fonts first.
/// @param procedure function to be called when everything has loaded.
/// @param bar loading bar callback function, if omitted, equals to loading_bar() and renders a simple loading bar. it must accept one parameter, that is loading progress in 0.0-1.0 range.
export function ready(procedure: () => void, bar?: () => void) {
  _loader_init_time = time();
  _ready_proc = procedure;
  log("Loader initialised!");
  if (bar) _bar_proc = bar;
  else _bar_proc = loading_bar;
  window.setTimeout(_progress_check, 100);
}

//@}
