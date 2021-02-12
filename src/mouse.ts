////////////////////////////////////////////
/// @name MOUSE ROUTINES
//@{

/// Mouse button bitmask.
/// Each bit in the mask represents a separate mouse button state. If right mouse button is down, mouse_b value would be 4, 00100 in binary. Each bit represents one mouse button. use something like if (mouse_b&1) to check for separate buttons.
/// * Button 0 is LMB. (mouse_b&1)
/// * Button 1 is MMB / wheel. (mouse_b&2)
/// * Button 2 is RMB. (mouse_b&4)
var mouse_b = 0;

/// Same as mouse_b but only checks if a button was pressed last frame
/// Note that this only works inside loop()
var mouse_pressed = 0;

/// Same as mouse_b but only checks if a button was released last frame
/// Note that this only works inside loop()
var mouse_released = 0;

/// Mouse X position within the canvas.
var mouse_x = -1;

/// Mouse Y position within the canvas
var mouse_y = -1;

/// Mouse wheel position.
/// This might not work consistently across all browsers!
var mouse_z = -1;

/// Mouse mickey, X position since last loop().
/// Only works inside loop()
var mouse_mx = 0;

/// Mouse mickey, Y position since last loop().
/// Only works inside loop()
var mouse_my = 0;

/// Mouse mickey, wheel position since last loop().
/// Only works inside loop()
var mouse_mz = 0;

/// Checks if mouse was installed
var _mouse_installed = false;

/// last mouse x position
var _last_mouse_x = -1;

/// last mouse y position
var _last_mouse_y = -1;

/// last mouse wheel position
var _last_mouse_z = -1;

/// is context menu enabled?
var _menu = false;

/// is menu supressed?
var _menu_supress = false;

/// Installs mouse handlers.
/// Must be called after set_gfx_mode() to be able to determine mouse position within the given canvas!
/// @param menu If true, context menu will be available on right click on canvas. Default is false.
function install_mouse(menu: boolean) {
  if (!canvas) {
    _error("You must call set_gfx_mode before install_mouse");
    return -1;
  }
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
function remove_mouse() {
  if (!_mouse_installed || !canvas) {
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

/// Enables showing system mouse cursor over canvas
function show_mouse() {
  if (!_mouse_installed || !canvas) {
    _error("You must call install_mouse before show_mouse");
    return -1;
  }
  canvas.canvas.style.cursor = "auto";
  return 0;
}

/// Disables system mouse cursor over canvas.
/// Use this if you would like to provide your own cursor bitmap
function hide_mouse() {
  if (!_mouse_installed || !canvas) {
    _error("You must call install_mouse before hide_mouse");
    return -1;
  }
  canvas.canvas.style.cursor = "none";
  return 0;
}

/// Mouse context menu suppressor
function _mousemenu(e: MouseEvent) {
  e.preventDefault();
}

/// mouse up event handler
function _mouseup(e: MouseEvent) {
  mouse_b = mouse_b & ~(1 << (e.which - 1));
  mouse_released = mouse_released | (1 << (e.which - 1));
  e.preventDefault();
}

/// mouse down event handler
function _mousedown(e: MouseEvent) {
  mouse_b = mouse_b | (1 << (e.which - 1));
  mouse_pressed = mouse_pressed | (1 << (e.which - 1));
  e.preventDefault();
}

/// mouse move event handler
function _mousemove(e: MouseEvent) {
  mouse_x = e.offsetX;
  mouse_y = e.offsetY;
  e.preventDefault();
}

/// mouse wheel event handler
function _mousewheel(e: WheelEvent) {
  mouse_z += e.deltaY;
  e.preventDefault();
}

//@}
////////////////////////////////////////////
