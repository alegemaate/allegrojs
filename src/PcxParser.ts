import { FileParser } from "./FileParser";

/**
 * PCX Parser
 */

interface PcxHeader {
  identifier: number;
  version: number;
  encoding: number;
  bitsPerPixel: number;
  xStart: number;
  yStart: number;
  xEnd: number;
  yEnd: number;
  hRes: number;
  vRes: number;
  palette16: Uint8Array;
  reserved1: number;
  numBitPlanes: number;
  bytesPerLine: number;
  paletteType: number;
  hSize: number;
  vSize: number;
  reserved2: number;
}

interface PcxColor {
  r: number;
  g: number;
  b: number;
  a: number;
}

const PALETTE_SIZE = 769;
export class PcxParser extends FileParser {
  public readonly header: PcxHeader;

  public readonly width: number;

  public readonly height: number;

  public readonly palette: Uint8Array;

  public readonly pixels: Uint8Array;

  public constructor(buffer: ArrayBuffer) {
    // Call parent constructor
    super(buffer);

    // Get header info
    this.header = this.readHeader();

    console.log(this.header);

    // Validate header
    this.validateHeader();

    // Set size
    this.width = this.header.xEnd - this.header.xStart;
    this.height = this.header.yEnd - this.header.yStart;

    // Read in the palette
    this.palette = this.readPalette();

    // Read pixel data
    this.pixels = this.readData();
  }

  public getPixels(): Uint8Array {
    return this.pixels;
  }

  private readHeader(): PcxHeader {
    return {
      identifier: this.readInt(1),
      version: this.readInt(1),
      encoding: this.readInt(1),
      bitsPerPixel: this.readInt(1),
      xStart: this.readInt(2, false),
      yStart: this.readInt(2, false),
      xEnd: this.readInt(2, false),
      yEnd: this.readInt(2, false),
      hRes: this.readInt(2, false),
      vRes: this.readInt(2, false),
      palette16: this.readArray(48),
      reserved1: this.readInt(1),
      numBitPlanes: this.readInt(1),
      bytesPerLine: this.readInt(2, false),
      paletteType: this.readInt(2, false),
      hSize: this.readInt(2, false),
      vSize: this.readInt(2, false),
      reserved2: this.readInt(54),
    };
  }

  private validateHeader(): void {
    if (this.header.identifier !== 0x0a) {
      throw new Error("Invalid pcx file");
    }
    if (![0, 2, 3, 4, 5].includes(this.header.version)) {
      throw new Error("Invalid version");
    }
    if (![0, 1].includes(this.header.encoding)) {
      throw new Error("Invalid encoding");
    }
    if (this.header.encoding === 0) {
      throw new Error("Does not support un-encoded files");
    }
    if (![1, 2, 4, 8].includes(this.header.bitsPerPixel)) {
      throw new Error("BitsPerPixel incorrect");
    }
    if (![1, 2].includes(this.header.paletteType)) {
      throw new Error("Invalid pallete mode");
    }
  }

  private readPalette(): Uint8Array {
    // Store old pointer location
    this.pushPointer();

    // Move to file length
    this.movePointer(this.getLength() - PALETTE_SIZE);
    const palleteId = this.readInt(1);

    if (palleteId !== 12) {
      this.popPointer();
      return this.header.palette16;
    }

    const arr = this.readArray(PALETTE_SIZE - 1);
    this.popPointer();

    return arr;
  }

  private readData(): Uint8Array {
    // Decode
    const scanLineLength = this.header.numBitPlanes * this.header.bytesPerLine;
    const buffer = new Uint8Array(scanLineLength * this.height);

    let index = 0;
    for (let t = 0; t < this.height; t += 1) {
      do {
        const byte = this.readInt(1);
        let runCount = 1;
        let runValue = byte;
        if ((byte & 0xc0) === 0xc0) {
          runCount = byte & 0x3f;
          runValue = this.readInt(1);
        }
        for (let i = 0; i < runCount; i += 1) {
          buffer[index] = runValue;
          index += 1;
        }
      } while (index < scanLineLength);
    }

    // Get color data
    const pixels = new Uint8Array(this.width * this.height * 4);

    // Pallete image
    if (this.header.numBitPlanes === 1) {
      for (let bufferPos = 0, x = 0; x < pixels.length; bufferPos += 1) {
        const bufVal = buffer[bufferPos];
        if (typeof bufVal === "undefined") {
          throw new Error("Buffer out of bounds");
        }

        if (this.header.bitsPerPixel === 1) {
          for (let binIndex = 0; binIndex < 8; binIndex += 1) {
            const color = ((bufVal >> binIndex) & 0b1) * 255;
            pixels[x] = color;
            pixels[x + 1] = color;
            pixels[x + 2] = color;
            pixels[x + 3] = 255;
            x += 4;
          }
        } else if (this.header.bitsPerPixel === 8) {
          console.log(bufVal);
          const color = this.getPalValues(bufVal);
          pixels[x] = color.r;
          pixels[x + 1] = color.g;
          pixels[x + 2] = color.b;
          pixels[x + 3] = color.a;
          x += 4;
        }
      }
    }

    return pixels;
  }

  private getPalValues(index: number): PcxColor {
    let r: number | undefined = 0;
    let g: number | undefined = 0;
    let b: number | undefined = 0;
    let a: number | undefined = 255;

    if (this.header.bitsPerPixel === 2) {
      r = this.palette[index * 3];
      g = this.palette[index * 3 + 1];
      b = this.palette[index * 3 + 2];
      a = 255;
    } else if (this.header.bitsPerPixel === 4) {
      r = this.palette[index * 3];
      g = this.palette[index * 3 + 1];
      b = this.palette[index * 3 + 2];
      a = 255;
    } else if (this.header.bitsPerPixel === 8) {
      r = this.palette[index * 3];
      g = this.palette[index * 3 + 1];
      b = this.palette[index * 3 + 2];
      a = 255;
    }

    if (
      typeof r === "undefined" ||
      typeof g === "undefined" ||
      typeof b === "undefined" ||
      typeof a === "undefined"
    ) {
      throw new Error("Palette index out of bounds");
    }
    return { r, g, b, a };
  }
}
