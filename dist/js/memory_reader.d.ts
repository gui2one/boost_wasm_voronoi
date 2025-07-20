import { WasmMemory } from "../main";
export declare class MemoryReader {
    b_little_endian: boolean;
    data_view: DataView;
    constructor(module: WasmMemory, ptr: number, little_endian?: boolean);
    readSizeT(offset: number): number;
    readUint32(offset: number): number;
    readFloat32(offset: number): number;
    readFloat64(offset: number): number;
}
