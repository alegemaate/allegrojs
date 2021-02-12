////////////////////////////////////////////
/// @name SOUND ROUTINES
//@[

var _volume = 1.0;

/// Loaded samples
var _samples: AllegroSample[] = [];

/// Install sound
/// @todo: stuff here? AudioContext? compatibility first!
function install_sound() {}

/// Sets global volume
function set_volume(volume: number) {
  _volume = volume;
  _samples.forEach(
    (sample) => (sample.element.volume = sample.volume * _volume)
  );
}

/// Gets global volume
function get_volume() {
  return _volume;
}

/// Loads a sample from file
/// Loads a sample from file and returns it. Doesn't stall for loading, use ready() to make sure your samples are loaded! Note that big files, such as music jingles, will most probably get streamed instead of being fully loaded into memory, meta data should be accessible tho.
/// @param filename name of the audio file
/// @return sample object
function load_sample(filename: string) {
  var audio = document.createElement("audio");
  audio.src = filename;
  var sample: AllegroSample = {
    element: audio,
    file: filename,
    volume: 1.0,
    ready: false,
    type: "snd",
  };
  _downloadables.push(sample);
  _samples.push(sample);
  log("Loading sample " + filename + "...");
  audio.onloadeddata = function () {
    if (!sample.ready) {
      sample.ready = true;
      log("Sample " + filename + " loaded!");
    }
  };
  return sample;
}

/// Does nothing.
/// @todo: something that happens here
function destroy_sample(filename: string) {}

/// Plays given sample.
/// Plays a sample object using given values. Note how pan is left out, as it doesn't seem to have a js counterpart. Freq will probably not work everywhere too!
/// @param sample sample to be played
/// @param vol playback volume
/// @param freq speed, 1.0 is normal
/// @param loop loop or not to loop
function play_sample(
  sample: AllegroSample,
  vol: number = 1.0,
  freq: number = 1.0,
  loop: boolean = false
) {
  adjust_sample(sample, vol, freq, loop);
  sample.element.currentTime = 0;
  sample.element.play();
}

/// Adjust sample during playback
/// Adjusts sample data Note how pan is left out, as it doesn't seem to have a js counterpart. freq will probably not work everywhere too!
/// @param sample sample
/// @param vol playback volume
/// @param freq speed, 1.0 is normal
/// @param loop loop or not to loop
function adjust_sample(
  sample: AllegroSample,
  vol: number,
  freq: number,
  loop: boolean
) {
  sample.volume = vol;
  sample.element.volume = sample.volume * _volume;
  sample.element.loop = loop;
  sample.element.playbackRate = freq;
}

/// Stops playing
/// Also resets position.
/// @param sample sample to be stopped
function stop_sample(sample: AllegroSample) {
  sample.element.pause();
  sample.element.currentTime = 0;
}

/// Pauses playing
/// Also doesn't reset position. Use play_sample() to resume.
/// @param sample sample to be stopped
function pause_sample(sample: AllegroSample) {
  sample.element.pause();
}

//@}
