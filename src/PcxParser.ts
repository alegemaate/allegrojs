import { FileParser } from "./FileParser";

/**
 * PCX Parser
 */
export class PcxParser extends FileParser {
  public header!: number;

  public version!: number;

  public encoding!: number;

  public bitsPerPixel!: number;

  public minX!: number;

  public minY!: number;

  public maxX!: number;

  public maxY!: number;

  public horizontalDpi!: number;

  public verticalDpi!: number;

  public palette16!: number;

  public numPlanes!: number;

  public bytesPerLine!: number;

  public paletteMode!: number;

  public horizontalResolution!: number;

  public verticalResolution!: number;

  public data!: number;

  public parse(): void {
    this.readHeader();
    this.readData();
  }

  private readHeader(): void {
    this.header = this.readInt(1);
    if (this.header !== 0x0a) {
      throw new Error("Invalid pcx file");
    }

    this.version = this.readInt(1);
    if (this.version < 0 || this.version > 5) {
      throw new Error("Invalid pcx version");
    }

    this.encoding = this.readInt(1);
    if (this.encoding < 0 || this.encoding > 2) {
      throw new Error("Invalid pcx encoding");
    }
    if (this.encoding === 0) {
      throw new Error("Does not support un-encoded pcx files");
    }

    this.bitsPerPixel = this.readInt(1);
    if (![1, 2, 4, 8].includes(this.bitsPerPixel)) {
      throw new Error("PCX bitsPerPixel incorrect");
    }

    this.minX = this.readInt(2);
    this.minY = this.readInt(2);
    this.maxX = this.readInt(2);
    this.maxY = this.readInt(2);
    this.horizontalDpi = this.readInt(2);
    this.verticalDpi = this.readInt(2);
    this.palette16 = this.readInt(48);

    // Skip first reserved field
    this.readInt(1);

    this.numPlanes = this.readInt(1);
    this.bytesPerLine = this.readInt(2);
    this.paletteMode = this.readInt(2);
    if (this.paletteMode < 1 || this.paletteMode > 2) {
      throw new Error("Invalid pcx pallete mode");
    }

    this.horizontalResolution = this.readInt(2);
    this.verticalResolution = this.readInt(2);

    // Skip second reserved field
    this.readInt(54);
  }

  private readData(): void {
    const width = this.maxX - this.minX;
    const height = this.maxY - this.minY;
    const scanLineLength = this.numPlanes * this.bytesPerLine;
    const linePaddingSize =
      this.bytesPerLine * this.numPlanes * (8 / this.bitsPerPixel) -
      (this.maxX - this.minX + 1);

    let index = 0;
    const lineData = new Uint8Array(scanLineLength);
    do {
      const byte = this.readInt(1);
      let runCount = 1;
      let runValue = byte;
      if ((byte & 0xc0) === 0xc0) {
        runCount = byte & 0x3f;
        runValue = this.readInt(1);
      }
      for (let i = 0; i < runCount; i += 1) {
        lineData[index] = runValue;
        index += 1;
      }
    } while (index < lineData.length);
  }
}
