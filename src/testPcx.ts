import { PcxParser } from "./PcxParser";
import * as fs from "fs";

const buffer = fs.readFileSync("mysha.pcx");

const parser = new PcxParser(buffer);

console.log(parser.getPixels());
