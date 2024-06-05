import { SerializedMaterial } from './Material';
import { SerializedGeometry } from './Geometry';
export interface SerializedGeomsByMat {
    [materialID: string]: {
        material: SerializedMaterial;
        geometries: {
            [expressID: number]: SerializedGeometry;
        };
    };
}
export declare class SerializedGeomsByMaterials implements SerializedGeomsByMat {
    constructor(geoms: any);
    [materialID: string]: {
        material: SerializedMaterial;
        geometries: {
            [expressID: number]: SerializedGeometry;
        };
    };
}
export declare class GeomsByMaterialsReconstructor {
    static new(serialized: SerializedGeomsByMaterials): any;
}