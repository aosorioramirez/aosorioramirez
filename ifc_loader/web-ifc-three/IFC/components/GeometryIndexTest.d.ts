import { BufferGeometry } from 'three';
import { IfcModel } from '../BaseDefinitions';
export declare type GeometryIndicesMap = Map<number, {
    [materialIndex: number]: number[];
}>;
export declare function generateGeometryIndexMap(geometry: BufferGeometry): Map<number, {
    [materialIndex: number]: number[];
}>;
export declare function createGeomByExpressID(model: IfcModel, expressID: number): void;
