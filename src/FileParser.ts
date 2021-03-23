/**
 * File Parser
 */
export class FileParser {
  // Data for parsing
  protected readonly data: DataView;

  // File pointer
  protected pointer: number;

  // Pointer stack
  private readonly pointerStack: number[];

  /**
   * Constructor
   *
   * @param arrayBuffer - Data to use for parsing
   */
  public constructor(buffer: ArrayBuffer) {
    const uint8Data = new Uint8Array(buffer);

    this.data = new DataView(
      uint8Data.buffer,
      uint8Data.byteOffset,
      uint8Data.byteLength
    );

    this.pointer = 0;

    this.pointerStack = [];
  }

  /**
   * Push pointer onto stack
   */
  public pushPointer(): void {
    this.pointerStack.push(this.pointer);
  }

  /**
   * Pop pointer from stack
   */
  public popPointer(): void {
    const popped = this.pointerStack.pop();
    if (typeof popped === "undefined") {
      throw new Error("Can not pop file pointer, no pointer on stack");
    }
    this.pointer = popped;
  }

  /**
   * Move Pointer
   *
   * @param bytes - How many bytes to move by
   */
  public movePointer(bytes: number): number {
    // Move the pointer negative and positive direction
    this.pointer += bytes;
    return this.pointer;
  }

  /**
   * Read an integer from buffer
   *
   * @param bytes - Number of bytes to read
   */
  public readInt(bytes: number, bigEndian = true): number {
    // Get integer from next bytes group
    const clampBytes = Math.min(bytes, this.data.byteLength - this.pointer);

    // EOF
    if (clampBytes < 1) {
      return -1;
    }

    // Endian-ness does not matter
    if (clampBytes === 1) {
      const value = this.data.getUint8(this.pointer);
      this.pointer += 1;
      return value;
    }

    let value = 0;
    for (let i = 0; i < clampBytes; i += 1) {
      if (bigEndian) {
        value += this.data.getUint8(this.pointer) << (8 * (clampBytes - i - 1));
      } else {
        value += this.data.getUint8(this.pointer) << (8 * i);
      }
      this.pointer += 1;
    }

    return value;
  }

  /**
   * Read an array of bytes from buffer
   *
   * @param length - Number of bytes to read
   */
  public readArray(length: number): Uint8Array {
    // Read uint8 array
    const arr = new Uint8Array(length);
    for (let i = 0; i < length; i += 1) {
      arr[i] = this.readInt(1);
    }

    return arr;
  }

  /**
   * Read a string from buffer
   *
   * @param bytes - Number of bytes to read
   */
  public readStr(bytes: number): string {
    // Read as ASCII chars, the followoing bytes
    let text = "";
    for (let char = 1; char <= bytes; char += 1)
      text += String.fromCharCode(this.readInt(1));
    return text;
  }

  /**
   * Read a variable length value
   *
   * @param bytes - Number of bytes to read
   */
  public readIntVLV(): number {
    // Read a variable length value
    let value = 0;
    if (this.pointer >= this.data.byteLength) {
      // EOF
      return -1;
    } else if (this.data.getUint8(this.pointer) < 128) {
      // ...value in a single byte
      value = this.readInt(1);
    } else {
      // ...value in multiple bytes
      const FirstBytes: number[] = [];
      while (this.data.getUint8(this.pointer) >= 128) {
        FirstBytes.push(this.readInt(1) - 128);
      }
      const lastByte = this.readInt(1);
      for (let dt = 1; dt <= FirstBytes.length; dt += 1) {
        const num = FirstBytes[FirstBytes.length - dt];
        if (typeof num === "number") {
          value += num * 128 ** dt;
        }
      }
      value += lastByte;
    }
    return value;
  }

  /**
   * Get total length of file
   *
   * @returns number of bytes long
   */
  public getLength(): number {
    return this.data.byteLength;
  }
}
