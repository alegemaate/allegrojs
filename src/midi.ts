import { MIDI } from "./types.js";
import "./libs/midi.js";

declare global {
  interface Window {
    MIDIjs: {
      play: (url: string) => void;
      stop: () => void;
      pause: () => void;
      resume: () => void;
      get_duration: (url: string, callback: (seconds: number) => void) => void;
    };
  }
}

let _current_midi: MIDI | null = null;
const _midis: MIDI[] = [];

export const midi_driver = {
  id: 0,
  name: "Browser MIDI",
  description: "Browser MIDI",
  ascii_name: "Browser MIDI",
};

/// 1.28.1
export function load_midi(filename: string) {
  const midi: MIDI = {
    file: filename,
    ready: true,
    type: "midi",
  };
  _midis.push(midi);
  return midi;
}

/// 1.28.2
export function destroy_midi(midi: MIDI) {
  void midi;
}

/// 1.28.3
export function lock_midi(midi: MIDI) {
  void midi;
}

/// 1.28.4
export function play_midi(midi: MIDI | null, loop: boolean) {
  if (_current_midi) {
    window.MIDIjs.pause();
  }

  if (midi) {
    window.MIDIjs.play(midi.file);
    _current_midi = midi;
  }
}

///  1.28.5
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

/// 1.28.6
export function stop_midi() {
  play_midi(null, false);
}

/// 1.28.7
export function midi_pause() {
  if (_current_midi) {
    window.MIDIjs.pause();
  }
}

/// 1.28.8
export function midi_resume() {
  if (_current_midi) {
    void window.MIDIjs.resume();
  }
}

/// 1.28.9
export function midi_seek(target: number) {
  if (_current_midi) {
    //window.MIDIjs.seek(target / 1000);
  }
}

/// 1.28.10
export function get_midi_length(midi: MIDI) {
  return -1; //window.MIDIjs.get_duration(midi.file, (dur) => console.log(dur));
}

/// 1.28.11
export function midi_out(data: string[], length: number) {
  void data;
  void length;
}

/// 1.28.12
export function load_midi_patches() {
  // hi
}

/// 1.28.13
export const midi_pos = 0;

/// 1.28.14
export const midi_time = 0;

/// 1.28.15
export let midi_loop_start = 0;

export let midi_loop_end = 0;

/// 1.28.16
export function midi_msg_callback(msg: number, byte1: number, byte2: number) {
  void msg;
  void byte1;
  void byte2;
}

/// 1.28.17
export function load_ibk(filename: string, drums: number) {
  void filename;
  void drums;
}
