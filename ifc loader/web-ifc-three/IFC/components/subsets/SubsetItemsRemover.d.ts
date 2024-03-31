import { Material } from 'three';
import { Subsets } from './SubsetManager';
import { IfcState } from '../../BaseDefinitions';
import { ItemsMap } from './ItemsMap';
export declare class SubsetItemsRemover {
    private state;
    private items;
    private subsets;
    constructor(state: IfcState, items: ItemsMap, subsets: Subsets);
    removeFromSubset(modelID: number, ids: number[], subsetID: string, customID?: string, material?: Material): void;
    private getGeometry;
    private filterIndices;
    private subtractIndicesByMaterial;
    private removeIndices;
    private cleanUpResult;
    private updateGroups;
    private updateIndices;
    private updateIDs;
    private parseIndices;
}