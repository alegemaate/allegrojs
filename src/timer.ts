/// @name TIMER ROUTINES
//@{

import { log } from "./debug.js";
import { AllegroTimer } from "./types.js";

/// holds all currently installed timers
let _installed_timers: AllegroTimer[] = [];

/// looks up a timer by it's function on the list
export function _timer_lookup(proc: () => void) {
  return _installed_timers.find((t) => t.timer === proc) ?? -1;
}

/// Converts seconds to install_int_ex interval units
/// @param secs number of seconds
/// @return value converted to milliseconds
export function SECS_TO_TIMER(secs: number) {
  return secs * 1000;
}

/// Converts milliseconds to install_int_ex interval units
/// @param msec number of milliseconds
/// @return value converted to milliseconds
export function MSEC_TO_TIMER(msec: number) {
  return msec;
}

/// Converts beats-per-second to install_int_ex interval units
/// @param bps number of beats per second
/// @return value converted to milliseconds
export function BPS_TO_TIMER(bps: number) {
  return 1000 / bps;
}

/// Converts beats-per-minute to install_int_ex interval units
/// @param bpm number of beats per minute
/// @return value converted to milliseconds
export function BPM_TO_TIMER(bpm: number) {
  return (60 * 1000) / bpm;
}

/// Does nothing.
export function install_timer() {
  // Does nothing
}

/// Unix time stamp!
/// Returns number of milliseconds since 1970 started.
export function time() {
  return Date.now();
}

/// Installs interrupt function.
/// Installs a user timer handler, with the speed given as the number of milliseconds between ticks. This is the same thing as install_int_ex(proc, MSEC_TO_TIMER(speed)). Calling again this routine with the same timer handler as parameter allows you to adjust its speed.
/// @param procedure function to be called
/// @param speed execution interval in msec
export function install_int(procedure: () => void, msec: number) {
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
export function install_int_ex(procedure: () => void, speed: number) {
  const timer_id = window.setInterval(procedure, speed);
  _installed_timers.push({ timer: procedure, id: timer_id });
  log("Added insterrupt #" + timer_id + " at " + speed + "msec isntervals!");
}

/// Removes interrupt
/// @param procedure interrupt procedure to be removed
export function remove_int(procedure: () => void) {
  _installed_timers.forEach((timer, index) => {
    if (timer.timer === procedure) {
      log("Removing interrupt " + timer.id + "!");
      window.clearInterval(timer.id);
      _installed_timers.splice(index, 1);
    }
  });
}

/// Removes all interrupts
export function remove_all_ints() {
  _installed_timers.forEach((timer) => {
    window.clearInterval(timer.id);
  });
  _installed_timers = [];
  log("Removed all interrupts!");
}

//@}
