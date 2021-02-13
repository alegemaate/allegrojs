import {
  load_bmp,
  ready,
  canvas,
  END_OF_MAIN,
  SCREEN_W,
  SCREEN_H,
  play_sample,
  enable_debug,
  BPS_TO_TIMER,
  loop,
  makecol,
  load_sample,
  draw_sprite,
  AllegroBitmap,
  AllegroSample,
  textout,
  simple_blit,
  key,
  distance,
  rand,
  log,
  install_allegro,
  set_gfx_mode,
  install_mouse,
  install_sound,
  font,
} from "../src/allegro.js";
import {
  install_keyboard,
  KEY_DOWN,
  KEY_LEFT,
  KEY_RIGHT,
  KEY_UP,
} from "../src/keyboard.js";

//bitmap objects
let man!: AllegroBitmap;
let apple!: AllegroBitmap;
let bg!: AllegroBitmap;

// munching soudn evffect
let munch!: AllegroSample;

// apple position
let apple_x = 200,
  apple_y = 200;

// player position
let player_x = 100,
  player_y = 100;

// score
let score = 0;

// rendering function
function draw() {
  // draw background
  simple_blit(bg, canvas, 0, 0);

  // draw player
  draw_sprite(canvas, man, player_x, player_y);

  // draw the apple
  draw_sprite(canvas, apple, apple_x, apple_y);

  // print out current score
  textout(
    canvas,
    font,
    "Score: " + score,
    10,
    30,
    24,
    makecol(255, 255, 255),
    makecol(0, 0, 0),
    1
  );
}

// update gaem logic
function update() {
  // check for keypresses and move the player accordingly
  if (key[KEY_UP]) player_y -= 4;
  if (key[KEY_DOWN]) player_y += 4;
  if (key[KEY_LEFT]) player_x -= 4;
  if (key[KEY_RIGHT]) player_x += 4;

  // if player is touching the apple...
  if (distance(player_x, player_y, apple_x, apple_y) < 20) {
    // play muching sound
    play_sample(munch);

    // move apple to a new spot, making it look like it's
    // a breand new apple
    apple_x = rand() % (SCREEN_W - 32);
    apple_y = rand() % (SCREEN_H - 32);

    // increase score
    score++;

    // log success to console
    log("Apple eaten!");
  }
}

function main() {
  enable_debug("debug");

  install_allegro();
  set_gfx_mode("canvas_id", 640, 480);
  install_mouse();
  install_keyboard();
  install_sound();

  man = load_bmp("data/man.png");
  apple = load_bmp("data/apple.png");
  bg = load_bmp("data/grass.jpg");
  munch = load_sample("data/munch.mp3");

  ready(function () {
    loop(function () {
      update();
      draw();
    }, BPS_TO_TIMER(60));
  });
  return 0;
}
END_OF_MAIN(main);
