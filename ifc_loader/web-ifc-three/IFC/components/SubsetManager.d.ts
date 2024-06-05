import { BufferGeometry, Material, Mesh, Object3D } from 'three';
import { HighlightConfigOfModel, IfcState } from '../BaseDefinitions';
import { BvhManager } from './BvhManager';
export interface Indices {
    [materialID: number]: number[];
}
export declare type Subsets = {
    [subsetID: string]: {
        ids: Set<number>;
        mesh: Mesh;
    };
};
export interface ItemsMap {
    [modelID: number]: {
        indexCache: Uint32Array;
        map: Map<number, Indices>;
    };
}
export interface ExpressIDMap {
    [modelID: number]: Map<number, number>;
}
/**
 * Contains the logic to get, create and delete geometric subsets of an IFC model. For example,
 * this can extract all the items in a specific IfcBuildingStorey and create a new Mesh.
 */
export declare class SubsetManager {
    private state;
    private BVH;
    private subsets;
    private itemsMap;
    private tempIndex;
    constructor(state: IfcState, BVH: BvhManager);
    getSubset(modelID: number, material?: Material, customId?: string): Mesh<BufferGeometry, Material | Material[]>;
    removeSubset(modelID: number, parent?: Object3D, material?: Material, customId?: string): void;
    createSubset(config: HighlightConfigOfModel): Mesh<BufferGeometry, Material | Material[]>;
    removeFromSubset(modelID: number, ids: number[], customID?: string, material?: Material): void;
    generateGeometryIndexMap(modelID: number): void;
    private getSubsetID;
    private getMaterialStore;
}