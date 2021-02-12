////////////////////////////////////////////
/// @name CONFIGURATION ROUTINES
//@{

import { log } from "./debug";

/// Installs allegro.
/// This function must be called before anything else.
export function install_allegro() {
  log("Allegro installed!");
}

/// Wrapper for install_allegro.
export function allegro_init() {
  install_allegro();
}

/// Macro to be placed after the end of main()
/// Calls main()
export function END_OF_MAIN(main: () => void) {
  window.addEventListener("load", main);
}

//@}
