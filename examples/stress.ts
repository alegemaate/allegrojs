import {
  set_gfx_mode,
  load_bmp,
  ready,
  canvas,
  END_OF_MAIN,
  SCREEN_W,
  SCREEN_H,
  enable_debug,
  loop,
  makecol,
  clear_to_color,
  draw_sprite,
  AllegroBitmap,
  abs,
  rand,
  frand,
  time,
  textout,
  MSEC_TO_TIMER,
  font,
} from "../src/allegro.js";

var num = 0;
var x: any[] = [],
  y: any[] = [],
  vx: any[] = [],
  vy: any[] = [];
var last_time = 0;
var bmp!: AllegroBitmap;

function main() {
  enable_debug("debug");
  set_gfx_mode("stress", 640, 480);
  bmp = load_bmp("data/planet.png");
  ready(function () {
    loop(function () {
      clear_to_color(canvas, makecol(255, 255, 255));

      for (var c = 0; c < num; c++) {
        draw_sprite(canvas, bmp, x[c], y[c]);
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
      var msec = time() - last_time - 1;
      textout(
        canvas,
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
        24,
        makecol(255, 255, 255),
        makecol(0, 0, 0),
        1
      );
      last_time = time();
    }, MSEC_TO_TIMER(1));
  });
  return 0;
}
END_OF_MAIN(main);
