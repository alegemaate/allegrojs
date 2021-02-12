////////////////////////////////////////////
/// @name MOUSE ROUTINES
//@{

import { log, _allog, _error } from "./debug";
import { canvas } from "./graphics";

/// Mouse button bitmask.
/// Each bit in the mask represents a separate mouse button state. If right mouse button is down, mouse_b value would be 4, 00100 in binary. Each bit represents one mouse button. use something like if (mouse_b&1) to check for separate buttons.
/// * Button 0 is LMB. (mouse_b&1)
/// * Button 1 is MMB / wheel. (mouse_b&2)
/// * Button 2 is RMB. (mouse_b&4)
export let mouse_b = 0;

/// Same as mouse_b but only checks if a button was pressed last frame
/// Note that this only works inside loop()
export let mouse_pressed = 0;

/// Same as mouse_b but only checks if a button was released last frame
/// Note that this only works inside loop()
export let mouse_released = 0;

/// Mouse X position within the canvas.
export let mouse_x = -1;

/// Mouse Y position within the canvas
export let mouse_y = -1;

/// Mouse wheel position.
/// This might not work consistently across all browsers!
export let mouse_z = -1;

/// Mouse mickey, X position since last loop().
/// Only works inside loop()
export let mouse_mx = 0;

/// Mouse mickey, Y position since last loop().
/// Only works inside loop()
export let mouse_my = 0;

/// Mouse mickey, wheel position since last loop().
/// Only works inside loop()
export let mouse_mz = 0;

/// Checks if mouse was installed
export let _mouse_installed = false;

/// last mouse x position
export let _last_mouse_x = -1;

/// last mouse y position
export let _last_mouse_y = -1;

/// last mouse wheel position
export let _last_mouse_z = -1;

/// is context menu enabled?
export const _menu = false;

/// is menu supressed?
export let _menu_supress = false;

/// Installs mouse handlers.
/// Must be called after set_gfx_mode() to be able to determine mouse position within the given canvas!
/// @param menu If true, context menu will be available on right click on canvas. Default is false.
export function install_mouse(menu: boolean) {
  if (_mouse_installed) {
    _allog("Mouse already installed");
    return -1;
  }
  canvas.canvas.addEventListener("mouseup", _mouseup);
  canvas.canvas.addEventListener("mousedown", _mousedown);
  canvas.canvas.addEventListener("mousemove", _mousemove);
  canvas.canvas.addEventListener("wheel", _mousewheel);
  if (menu) {
    _menu_supress = true;
  } else {
    canvas.canvas.addEventListener("contextmenu", _mousemenu);
    _menu_supress = false;
  }
  _mouse_installed = true;
  log("Mouse installed!");
  return 0;
}

/// Removes mouse handlers.
export function remove_mouse() {
  if (!_mouse_installed) {
    _error("You must call install_mouse before remove_mouse");
    return -1;
  }
  canvas.canvas.removeEventListener("mouseup", _mouseup);
  canvas.canvas.removeEventListener("mousedown", _mousedown);
  canvas.canvas.removeEventListener("mousemove", _mousemove);
  canvas.canvas.removeEventListener("wheel", _mousewheel);
  if (_menu_supress)
    canvas.canvas.removeEventListener("contextmenu", _mousemenu);
  _mouse_installed = false;
  log("Mouse removed!");
  return 0;
}

/// Simple internal mouse loop
export function _mouse_loop() {
  if (_mouse_installed) {
    mouse_mx = mouse_x - _last_mouse_x;
    mouse_my = mouse_y - _last_mouse_y;
    mouse_mz = mouse_z - _last_mouse_z;
  }
}

/// Mouse reset loop
export function _mouse_loop_reset() {
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
}

/// Enables showing system mouse cursor over canvas
export function show_mouse() {
  if (!_mouse_installed) {
    _error("You must call install_mouse before show_mouse");
    return -1;
  }
  canvas.canvas.style.cursor = "auto";
  return 0;
}

/// Disables system mouse cursor over canvas.
/// Use this if you would like to provide your own cursor bitmap
export function hide_mouse() {
  if (!_mouse_installed) {
    _error("You must call install_mouse before hide_mouse");
    return -1;
  }
  canvas.canvas.style.cursor = "none";
  return 0;
}

/// Mouse context menu suppressor
export function _mousemenu(e: MouseEvent) {
  e.preventDefault();
}

/// mouse up event handler
export function _mouseup(e: MouseEvent) {
  mouse_b &= ~(1 << (e.which - 1));
  mouse_released |= 1 << (e.which - 1);
  e.preventDefault();
}

/// mouse down event handler
export function _mousedown(e: MouseEvent) {
  mouse_b |= 1 << (e.which - 1);
  mouse_pressed |= 1 << (e.which - 1);
  e.preventDefault();
}

/// mouse move event handler
export function _mousemove(e: MouseEvent) {
  mouse_x = e.offsetX;
  mouse_y = e.offsetY;
  e.preventDefault();
}

/// mouse wheel event handler
export function _mousewheel(e: WheelEvent) {
  mouse_z += e.deltaY;
  e.preventDefault();
}

//@}
////////////////////////////////////////////
