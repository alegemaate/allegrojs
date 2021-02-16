////////////////////////////////////////////
/// @name CONFIGURATION ROUTINES
//@{

import { log } from "./debug.js";
import { vsprintf } from "./sprintf.js";

/// 1.1.1 Installs allegro.
/// This function must be called before anything else.
export function install_allegro(
  system_id: "SYSTEM_AUTODETECT" | "SYSTEM_NONE",
  errno_ptr: number,
  atexit_ptr: () => void
) {
  log("Allegro installed!");
}

/// 1.1.2 Wrapper for install_allegro.
export function allegro_init(): number {
  install_allegro("SYSTEM_AUTODETECT", 0, atexit);
  return 0;
}

/// 1.1.3
export function allegro_exit() {
  // exit here
}

/// 1.1.4 Macro to be placed after the end of main()
/// Calls main()
export function END_OF_MAIN(main: () => void) {
  window.addEventListener("load", main);
}

/// 1.1.5
export const allegro_id: string = "Allegro TS";

/// 1.1.6
export const allegro_error: string = "";

/// 1.1.7
export const ALLEGRO_VERSION = 4;

/// 1.1.8
export const ALLEGRO_SUB_VERSION = 1;

/// 1.1.9
export const ALLEGRO_WIP_VERSION = 16;

/// 1.1.10
export const ALLEGRO_VERSION_STR = "4.1.16";

/// 1.1.11
export const ALLEGRO_DATE_STR = "2021";

/// 1.1.12
export const ALLEGRO_DATE = 0;

/// 1.1.13
export function AL_ID(a: string, b: string, c: string, d: string) {
  return a + b + c + d;
}

/// 1.1.14
export function MAKE_VERSION(a: number, b: number, c: number) {
  return a + b + c;
}

/// 1.1.15
export const os_type = "OSTYPE_BROWSER";

/// 1.1.16
export const os_version = 0;

/// 1.1.17
export const os_multitasking = true;

/// 1.1.18
export function allegro_message(
  text_format: string,
  ...args: (string | number)[]
) {
  alert(vsprintf(text_format, args));
}

/// 1.1.19
export function set_window_title(name: string) {
  document.title = name;
}

/// 1.1.20
export function set_close_button_callback(proc: () => void) {
  window.onbeforeunload = proc;
}

/// 1.1.21
export function atexit(): void {
  log("Allegro destroyed");
}

/// 1.1.22
export function desktop_color_depth(): number {
  return 32;
}

/// 1.1.23
export function get_desktop_resolution(width: number, height: number) {
  return { width, height };
}

/// 1.1.24
export function check_cpu() {
  //
}

/// 1.1.25
export const cpu_vendor = "Browser";

/// 1.1.26
export const cpu_family = "Browser";

/// 1.1.27
export const cpu_model = "Browser";

/// 1.1.28
export const cpu_capabilities = 0;

//@}
