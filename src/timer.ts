/// @name TIMER ROUTINES
//@{

/// All downloadable objects
var _downloadables: (AllegroBitmap | AllegroSample)[] = [];

/// holds all currently installed timers
var _installed_timers: AllegroTimer[] = [];

/// looks up a timer by it's function on the list
function _timer_lookup(proc: () => void) {
  return _installed_timers.find((t) => (t.timer = proc)) ?? -1;
}

/// Converts seconds to install_int_ex interval units
/// @param secs number of seconds
/// @return value converted to milliseconds
function SECS_TO_TIMER(secs: number) {
  return secs * 1000;
}

/// Converts milliseconds to install_int_ex interval units
/// @param msec number of milliseconds
/// @return value converted to milliseconds
function MSEC_TO_TIMER(msec: number) {
  return msec;
}

/// Converts beats-per-second to install_int_ex interval units
/// @param bps number of beats per second
/// @return value converted to milliseconds
function BPS_TO_TIMER(bps: number) {
  return 1000 / bps;
}

/// Converts beats-per-minute to install_int_ex interval units
/// @param bpm number of beats per minute
/// @return value converted to milliseconds
function BPM_TO_TIMER(bpm: number) {
  return (60 * 1000) / bpm;
}

/// Does nothing.
function install_timer() {}

/// Unix time stamp!
/// Returns number of milliseconds since 1970 started.
function time() {
  return Date.now();
}

/// Installs interrupt function.
/// Installs a user timer handler, with the speed given as the number of milliseconds between ticks. This is the same thing as install_int_ex(proc, MSEC_TO_TIMER(speed)). Calling again this routine with the same timer handler as parameter allows you to adjust its speed.
/// @param procedure function to be called
/// @param speed execution interval in msec
function install_int(procedure: () => void, msec: number) {
  return install_int_ex(procedure, MSEC_TO_TIMER(msec));
}

/// Installs interrupt function.
/// With this one, you must use helper functions to set the interval in the second argument. The lowest interval is 1 msec, but you probably don't want to go below 17 msec. Suggested values are BPS_TO_TIMER(30) or BPS_TO_TIMER(60). It cannot be used to alter previously installed interrupt function as well.
/// * SECS_TO_TIMER(secs) - seconds
/// * MSEC_TO_TIMER(msec) - milliseconds (1/1000th)
/// * BPS_TO_TIMER(bps) - beats per second
/// * BPM_TO_TIMER(bpm) - beats per minute
/// @param procedure function to be called
/// @param speed execution interval
function install_int_ex(procedure: () => void, speed: number) {
  var timer_id = window.setInterval(procedure, speed);
  _installed_timers.push({ timer: procedure, id: timer_id });
  log("Added insterrupt #" + timer_id + " at " + speed + "msec isntervals!");
}

/// registered loop procedure
var _loopproc = () => {};

/// Performs some loop tasks, such as cleaning up pressed[] and released[]
function _uberloop() {
  if (_mouse_installed) {
    mouse_mx = mouse_x - _last_mouse_x;
    mouse_my = mouse_y - _last_mouse_y;
    mouse_mz = mouse_z - _last_mouse_z;
  }
  _loopproc();
  if (_keyboard_installed) {
    for (var c = 0; c < 0x80; c++) {
      pressed[c] = false;
      released[c] = false;
    }
  }
  if (_mouse_installed) {
    mouse_pressed = 0;
    mouse_released = 0;
    mouse_mx = 0;
    mouse_my = 0;
    mouse_mz = 0;
    _last_mouse_x = mouse_x;
    _last_mouse_y = mouse_y;
    _last_mouse_z = mouse_z;
  }
  if (_touch_installed) {
    touch_released = [];
    touch_pressed = [];
    touch.forEach((t) => {
      t.mx = 0;
      t.my = 0;
      t.px = t.x;
      t.py = t.y;
      t.age++;
    });
  }
}

/// Game loop interrupt
/// Loop is the same as interrupt, except, it cannot be stopped once it's started. It's meant for game loop. remove_int() and remove_all_ints() have no effect on this. Since JS can't have blocking (continuously executing) code and realise on events and timers, you cannot have your game loop inside a while or for argument. Instead, you should use this to create your game loop to be called at given interval. There should only be one loop() function! Note that mouse mickeys (mouse_mx, etc.), and pressed indicators (pressed[] and mouse_pressed) will only work inside loop()
/// @param procedure function to be looped, preferably inline, but let's not talk coding styles here
/// @param speed speed in the same format as install_int_ex()
function loop(procedure: () => void, speed: number) {
  _loopproc = procedure;
  var timer_id = window.setInterval(_uberloop, speed);
  log("Game loop initialised!");
  //_installed_timers.push({timer:procedure,id:timer_id});
}

/// time when ready() was called
var _loader_init_time: number;

/// Holds the download complete handler function
var _ready_proc: () => void | undefined;

/// Holds the download complete handler function
var _bar_proc: (progress: number) => void | undefined;

/// checks if everything has downloaded in intervals
function _progress_check() {
  var num_assets = 0;
  var num_loaded = 0;
  _downloadables.forEach((down) => {
    num_assets++;
    if (down.type == "snd") {
      if (down.element.readyState >= down.element.HAVE_FUTURE_DATA) {
        down.ready = true;
      }
    }
    if (down.ready) num_loaded++;
  });
  _bar_proc?.(num_assets / num_loaded);
  if (num_loaded < num_assets) {
    window.setTimeout(_progress_check, 100);
  } else {
    log(
      "Loading complete! Took " +
        ((time() - _loader_init_time) / 1000).toFixed(1) +
        " seconds!"
    );
    _ready_proc?.();
  }
}

/// Default loading bar rendering
/// This function is used by ready() to display a simple loading bar on screen. You need to manually specify a dummy function if you don't want loading screen.
/// @param progress loading progress in 0.0 - 1.0 range
function loading_bar(progress: number) {
  if (!canvas) {
    return;
  }

  rectfill(canvas, 5, SCREEN_H - 55, SCREEN_W - 10, 50, makecol(0, 0, 0));
  rectfill(
    canvas,
    10,
    SCREEN_H - 50,
    SCREEN_W - 20,
    40,
    makecol(255, 255, 255)
  );
  rectfill(canvas, 15, SCREEN_H - 45, SCREEN_W - 30, 30, makecol(0, 0, 0));
  rectfill(
    canvas,
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
function ready(procedure: () => void, bar: () => void) {
  _loader_init_time = time();
  _ready_proc = procedure;
  log("Loader initialised!");
  if (bar) _bar_proc = bar;
  else _bar_proc = loading_bar;
  window.setTimeout(_progress_check, 100);
}

/// Removes interrupt
/// @param procedure interrupt procedure to be removed
function remove_int(procedure: () => void) {
  _installed_timers.forEach((timer, index) => {
    if (timer.timer == procedure) {
      log("Removing interrupt " + timer.id + "!");
      window.clearInterval(timer.id);
      _installed_timers.splice(index, 1);
      return;
    }
  });
}

/// Removes all interrupts
function remove_all_ints() {
  _installed_timers.forEach((timer) => {
    window.clearInterval(timer.id);
  });
  _installed_timers = [];
  log("Removed all interrupts!");
}

//@}
