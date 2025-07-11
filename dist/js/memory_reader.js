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
};
export class MemoryReader {
    b_little_endian;
    data_view;
    constructor(buffer, ptr, little_endian = true) {
        const data_view = new DataView(buffer, ptr);
        this.data_view = data_view;
        this.b_little_endian = little_endian;
    }
    readLayout(layout) {
        const values = [];
        for (let i = 0; i < layout.types.length; i++) {
            const type = layout.types[i];
            const value = this.read(type, i);
            values.push(value);
        }
        return values;
    }
    read(type, offset) {
        const data_type = data_types[type];
        return new data_type(this.data_view.buffer)[offset];
    }
    readSizeT(offset) {
        // TODO : change to getBigUint64 if available
        return this.data_view.getUint32(offset, this.b_little_endian);
    }
    readUint32(offset) {
        return this.data_view.getUint32(offset, true);
    }
    readFloat32(offset) {
        return this.data_view.getFloat32(offset, true);
    }
    readFloat64(offset) {
        return this.data_view.getFloat64(offset, true);
    }
}
