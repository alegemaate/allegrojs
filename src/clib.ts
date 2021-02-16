export function atoi(str: string | undefined) {
  if (typeof str === "undefined") {
    return -1;
  }
  return parseInt(str);
}

export function free(val: any) {
  void val;
}

export function exit(code: number) {
  void code;
}
