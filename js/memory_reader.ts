const data_types = {
  i8: Int8Array,
  u8: Uint8Array,
  i16: Int16Array,
  u16: Uint16Array,
  i32: Int32Array,
  u32: Uint32Array,
  i64: BigInt64Array,
  u64: BigUint64Array,
  f32: Float32Array,
  f64: Float64Array,
} as const;

type DataType = keyof typeof data_types;
export interface IMemoryLayout {
  types: DataType[];
}

export class MemoryReader {
  b_little_endian: boolean;
  data_view: DataView;

  constructor(buffer: ArrayBuffer, ptr: number, little_endian: boolean = true) {
    const data_view = new DataView(buffer, ptr);
    this.data_view = data_view;
    this.b_little_endian = little_endian;
  }

  public readLayout(layout: IMemoryLayout): any[] {
    const values = [];
    for (let i = 0; i < layout.types.length; i++) {
      const type = layout.types[i];
      const value = this.read(type, i);
      values.push(value);
    }
    return values;
  }

  public read(type: DataType, offset: number): any {
    const data_type = data_types[type];
    return new data_type(this.data_view.buffer)[offset];
  }
  public readSizeT(offset: number): number {
    // TODO : change to getBigUint64 if available
    return this.data_view.getUint32(offset, this.b_little_endian);
  }
  public readUint32(offset: number): number {
    return this.data_view.getUint32(offset, true);
  }

  public readFloat32(offset: number): number {
    return this.data_view.getFloat32(offset, true);
  }

  public readFloat64(offset: number): number {
    return this.data_view.getFloat64(offset, true);
  }
}
