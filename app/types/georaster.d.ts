declare module 'georaster' {
    export interface GeoRaster {
        [key: string]: any
    }

    export default function parseGeoraster(
        input: ArrayBuffer | Uint8Array | number[][][] | Blob,
        metadata?: Record<string, any>
    ): Promise<GeoRaster>
}
