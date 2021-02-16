/// 1.4

/// 1.4.1
export function set_config_file(filename: string) {}

/// 1.4.2
export function set_config_data(data: string, length: number) {}

/// 1.4.3, 1.4.4
export function override_config_data(filename: string) {}

/// 1.4.5
export function push_config_state() {}

/// 1.4.6
export function pop_config_state() {}

/// 1.4.7
export function flush_config_state() {}

/// 1.4.8
export function reload_config_texts(new_language: string) {}

/// 1.4.9
export function hook_config_section(
  section: string,
  intgetter: (name: string, def: number) => void,
  stringgetter: (name: string, def: string) => void,
  stringsetter: (name: string, value: string) => void
) {}

/// 1.4.10
export function config_is_hooked(section: number) {
  return false;
}

/// 1.4.11
export function get_config_string(section: string, name: string, def: string) {
  return "";
}

/// 1.4.12
export function get_config_int(section: string, name: string, def: number) {
  return 0;
}

/// 1.4.13
export function get_config_hex(section: string, name: string, def: number) {
  return 0;
}

/// 1.4.14
export function get_config_float(section: string, name: string, def: number) {
  return 0.0;
}

/// 1.4.15
export function get_config_id(section: string, name: string, def: number) {
  return "hi";
}

/// 1.4.16
export function get_config_argv(section: string, name: string) {
  return [];
}

/// 1.4.17
export function get_config_text(msg: string) {
  return "hi";
}

/// 1.4.18
export function set_config_string(section: string, name: string, val: string) {}

/// 1.4.19
export function set_config_int(section: string, name: string, val: number) {}

/// 1.4.20
export function set_config_hex(section: string, name: string, val: number) {}

/// 1.4.21
export function set_config_float(section: string, name: string, val: number) {}

/// 1.4.22
export function set_config_id(section: string, name: string, val: number) {}

/// 1.4.23
export function list_config_entries(
  section: string,
  name: string,
  names: string[]
) {}

/// 1.4.24
export function list_config_sections(names: string[]) {}

/// 1.4.25
export function free_config_entires(names: string[]) {}
