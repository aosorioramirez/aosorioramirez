import { IfcState } from '../BaseDefinitions';
export declare class IFCUtils {
    state: IfcState;
    map: {
        [key: string]: number;
    };
    constructor(state: IfcState);
    getMapping(): void;
    releaseMapping(): void;
    reverseElementMapping(obj: {}): {};
    isA(entity: any, entity_class: string): string | boolean;
    byId(modelID: number, id: number): Promise<any>;
    idsByType(modelID: number, entity_class: string): Promise<import("web-ifc").Vector<number>>;
    byType(modelID: number, entity_class: string): Promise<number[] | undefined>;
}