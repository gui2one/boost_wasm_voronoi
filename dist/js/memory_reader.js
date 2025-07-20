export class MemoryReader {
    b_little_endian;
    data_view;
    constructor(module, ptr, little_endian = true) {
        // console.log(module.HEAPU8);
        const data_view = new DataView(module.HEAPU8.buffer, ptr);
        this.data_view = data_view;
        this.b_little_endian = little_endian;
    }
    readSizeT(offset) {
        // TODO : change to getBigUint64 if available
        return this.data_view.getUint32(offset, this.b_little_endian);
    }
    readUint32(offset) {
        return this.data_view.getUint32(offset, this.b_little_endian);
    }
    readFloat32(offset) {
        return this.data_view.getFloat32(offset, this.b_little_endian);
    }
    readFloat64(offset) {
        return this.data_view.getFloat64(offset, this.b_little_endian);
    }
}
