declare const data_types: {
    readonly i8: Int8ArrayConstructor;
    readonly u8: Uint8ArrayConstructor;
    readonly i16: Int16ArrayConstructor;
    readonly u16: Uint16ArrayConstructor;
    readonly i32: Int32ArrayConstructor;
    readonly u32: Uint32ArrayConstructor;
    readonly i64: BigInt64ArrayConstructor;
    readonly u64: BigUint64ArrayConstructor;
    readonly f32: Float32ArrayConstructor;
    readonly f64: Float64ArrayConstructor;
};
type DataType = keyof typeof data_types;
export interface IMemoryLayout {
    types: DataType[];
}
export declare class MemoryReader {
    b_little_endian: boolean;
    data_view: DataView;
    constructor(buffer: ArrayBuffer, ptr: number, little_endian?: boolean);
    readLayout(layout: IMemoryLayout): any[];
    read(type: DataType, offset: number): any;
    readSizeT(offset: number): number;
    readUint32(offset: number): number;
    readFloat32(offset: number): number;
    readFloat64(offset: number): number;
}
export {};
