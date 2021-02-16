import {
  set_gfx_mode,
  load_bmp,
  ready,
  screen,
  END_OF_MAIN,
  SCREEN_W,
  SCREEN_H,
  enable_debug,
  makecol,
  clear_to_color,
  draw_sprite,
  BITMAP,
  abs,
  rand,
  frand,
  textout_ex,
  MSEC_TO_TIMER,
  font,
  rest,
} from "../src/allegro.js";

var num = 0;
var x: any[] = [],
  y: any[] = [],
  vx: any[] = [],
  vy: any[] = [];
var last_time = 0;
var bmp!: BITMAP;

async function main() {
  enable_debug("debug");
  set_gfx_mode("stress", 1, 640, 480, 0, 0);
  bmp = load_bmp("data/planet.png");

  await ready();

  while (true) {
    clear_to_color(screen, makecol(255, 255, 255));

    for (var c = 0; c < num; c++) {
      draw_sprite(screen, bmp, x[c], y[c]);
      if (x[c] + vx[c] > SCREEN_W) {
        vx[c] = -abs(vx[c]);
      }
      if (y[c] + vy[c] > SCREEN_H) {
        vy[c] = -abs(vy[c]);
      }
      if (x[c] + vx[c] < -64) {
        vx[c] = abs(vx[c]);
      }
      if (y[c] + vy[c] < -64) {
        vy[c] = abs(vy[c]);
      }
      x[c] += vx[c];
      y[c] += vy[c];
    }

    x.push(rand() % SCREEN_W);
    y.push(rand() % SCREEN_H);
    vx.push(frand() * 2 - 1);
    vy.push(frand() * 2 - 1);
    num++;
    var msec = Date.now() - last_time - 1;
    textout_ex(
      screen,
      font,
      "Sprites: " +
        num +
        " took " +
        msec +
        " msec ( " +
        (1000 / msec).toFixed() +
        " fps)",
      20,
      30,
      makecol(255, 255, 255),
      makecol(0, 0, 0)
    );
    last_time = Date.now();
    await rest(16);
  }
  return 0;
}
END_OF_MAIN(main);
