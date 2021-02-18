import { MIDI } from "./types.js";

/**
 * Current midi file used
 *
 * @internal
 */
let _current_midi: MIDI | null = null;

/**
 * List of midi files
 *
 * @internal
 */
const _midis: MIDI[] = [];

// const player = new LibTimidity();

/**
 * Midi driver
 *
 * @remarks
 * Does nothing, only for compatibility
 */
export const midi_driver = {
  id: 0,
  name: "Browser MIDI",
  description: "Browser MIDI",
  ascii_name: "Browser MIDI",
};

/**
 * Load midi file
 *
 * @remarks
 *
 * @param filename - path to file to load
 *
 * @allegro 1.28.1
 */
export function load_midi(filename: string) {
  const midi: MIDI = {
    file: filename,
    ready: true,
    type: "midi",
  };
  _midis.push(midi);
  return midi;
}

/**
 * Destroy midi file
 *
 * @remarks
 *
 * @allegro 1.28.2
 */
export function destroy_midi(midi: MIDI) {
  void midi;
}

/**
 *
 *
 * @remarks
 *
 * @allegro 1.28.3
 */
export function lock_midi(midi: MIDI) {
  void midi;
}

/**
 * Play midi file
 *
 * @remarks
 *
 * @allegro 1.28.4
 */
export function play_midi(midi: MIDI | null, loop: boolean) {
  void loop;
  if (_current_midi) {
    // player.pause();
  }

  if (midi) {
    // player.load(midi.file);
    // player.play();
    _current_midi = midi;
  }
}

/**
 * Play looped midi
 *
 * @remarks
 *
 * @allegro 1.28.5
 */
export function play_looped_midi(
  midi: MIDI,
  loop_start: number,
  loop_end: number
) {
  void midi;
  midi_loop_start = loop_start;
  midi_loop_end = loop_end;
  return 0;
}

/**
 * Stop midi
 *
 * @remarks
 *
 * @allegro 1.28.6
 */
export function stop_midi() {
  play_midi(null, false);
}

/**
 * Pause midi
 *
 * @remarks
 *
 * @allegro 1.28.7
 */
export function midi_pause() {
  if (_current_midi) {
    // player.pause();
  }
}

/**
 * Resume midi
 *
 * @remarks
 *
 * @allegro 1.28.8
 */
export function midi_resume() {
  if (_current_midi) {
    // player.play();
  }
}

/**
 * Seek midi
 *
 * @remarks
 *
 * @allegro 1.28.9
 */
export function midi_seek(target: number) {
  if (_current_midi) {
    // player.seek(target / 1000);
    void target;
  }
}

/**
 * Get length of midi
 *
 * @remarks
 *
 * @allegro 1.28.10
 */
export function get_midi_length(midi: MIDI) {
  void midi;
  // player.duration;
  return 0;
}

/**
 * Midi out
 *
 * @remarks
 *
 * @allegro 1.28.11
 */
export function midi_out(data: string[], length: number) {
  void data;
  void length;
}

/**
 * Load midi patches
 *
 * @remarks
 *
 * @allegro 1.28.12
 */
export function load_midi_patches() {
  // hi
}

/**
 * Current midi position
 *
 * @remarks
 *
 * @allegro 1.28.13
 */
export const midi_pos = 0;

/**
 * Current midi time
 *
 * @remarks
 *
 * @allegro 1.28.14
 */
export const midi_time = 0;

/**
 * Midi loop markers
 *
 * @remarks
 *
 * @allegro 1.28.15
 */
export let midi_loop_start = 0;
export let midi_loop_end = 0;

/**
 * Callback on midi message
 *
 * @remarks
 *
 * @allegro 1.28.16
 */
export function midi_msg_callback(msg: number, byte1: number, byte2: number) {
  void msg;
  void byte1;
  void byte2;
}

/**
 * Load IBK file
 *
 * @remarks
 *
 * @allegro 1.28.17
 */
export function load_ibk(filename: string, drums: number) {
  void filename;
  void drums;
}