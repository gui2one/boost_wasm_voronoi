import { WasmMemory } from "../main";

export class MemoryReader {
  b_little_endian: boolean;
  data_view: DataView;

  constructor(module: WasmMemory, ptr: number, little_endian: boolean = true) {
    // console.log(module.HEAPU8);

    const data_view = new DataView(module.HEAPU8.buffer, ptr);
    this.data_view = data_view;
    this.b_little_endian = little_endian;
  }

  public readSizeT(offset: number): number {
    // TODO : change to getBigUint64 if available
    return this.data_view.getUint32(offset, this.b_little_endian);
  }
  public readUint32(offset: number): number {
    return this.data_view.getUint32(offset, this.b_little_endian);
  }

  public readFloat32(offset: number): number {
    return this.data_view.getFloat32(offset, this.b_little_endian);
  }

  public readFloat64(offset: number): number {
    return this.data_view.getFloat64(offset, this.b_little_endian);
  }
}
