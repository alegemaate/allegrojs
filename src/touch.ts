/// @name TOUCH ROUTINES
//@{

/// is touch installed
var _touch_installed = false;

/// Array of AllegroTouchEvent holding the currently held touches
var touch: AllegroTouchEvent[] = [];

/// Array of AllegroTouchEvent holding the just started touches
var touch_pressed: AllegroTouchEvent[] = [];

/// Array of AllegroTouchEvent holding the just finished touches
var touch_released: AllegroTouchEvent[] = [];

/// Installs touch support
/// Installs handlers for touch events. After calling this, touch* arrays will get populated with multitouch data maximum touch points depend on the device. Four is usually a safe option.
function install_touch() {
  if (!canvas) {
    _error("You must call set_gfx_mode before install_touch");
    return -1;
  }
  if (_touch_installed) {
    _allog("Touch already installed");
    return -1;
  }
  canvas.canvas.addEventListener("touchstart", _touchstart);
  canvas.canvas.addEventListener("touchend", _touchend);
  canvas.canvas.addEventListener("touchcancel", _touchend);
  canvas.canvas.addEventListener("touchmove", _touchmove);
  _touch_installed = true;
  log("Touch installed!");
}

/// Removes touch support
/// Uninstalls handlers for touch events.
function remove_touch() {
  if (!canvas) {
    _error("You must call set_gfx_mode before install_touch");
    return -1;
  }
  if (!_touch_installed) {
    _allog("Touch not installed");
    return -1;
  }
  canvas.canvas.removeEventListener("touchstart", _touchstart);
  canvas.canvas.removeEventListener("touchend", _touchend);
  canvas.canvas.removeEventListener("touchcancel", _touchend);
  canvas.canvas.removeEventListener("touchmove", _touchmove);
  _touch_installed = false;
  log("Touch removed!");
}

function _get_touch(id?: number) {
  if (typeof id !== "number") {
    return null;
  }
  return touch.find((t) => t.id === id) ?? null;
}

function _touchstart(e: TouchEvent) {
  if (!e.target) {
    return;
  }
  var rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
  for (var c = 0; c < e.changedTouches.length; c++) {
    var point = e.changedTouches.item(c);

    if (point) {
      var t: AllegroTouchEvent = {
        sx: point.clientX - rect.left,
        sy: point.clientY - rect.top,
        mx: 0,
        my: 0,
        px: point.clientX - rect.left,
        py: point.clientY - rect.top,
        x: point.clientX - rect.left,
        y: point.clientY - rect.top,
        id: point.identifier,
        dead: false,
        age: 0,
      };
      touch.push(t);
      touch_pressed.push(t);
    }
  }
  e.preventDefault();
}

function _touchend(e: TouchEvent) {
  for (var c = 0; c < e.changedTouches.length; c++) {
    var point = e.changedTouches.item(c);
    var t = _get_touch(point?.identifier);
    if (t) {
      touch.splice(touch.indexOf(t), 1);
      touch_released.push(t);
      t.dead = true;
    }
  }
  e.preventDefault();
}

function _touchmove(e: TouchEvent) {
  if (!e.target) {
    return;
  }
  var rect = (e.target as HTMLCanvasElement).getBoundingClientRect();
  for (var c = 0; c < e.changedTouches.length; c++) {
    var point = e.changedTouches.item(c);
    var t = _get_touch(point?.identifier);
    if (t && point) {
      var x = point.clientX - rect.left;
      var y = point.clientY - rect.top;
      t.mx += t.x - x;
      t.my += t.y - y;
      t.x = x;
      t.y = y;
    }
  }
  e.preventDefault();
}

//@}
////////////////////////////////////////////
