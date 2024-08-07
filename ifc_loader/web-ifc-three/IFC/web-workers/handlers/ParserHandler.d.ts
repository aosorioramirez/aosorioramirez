import { OptionalCategories, ParserAPI } from '../../components/IFCParser';
import { WorkerAPIs } from '../BaseDefinitions';
import { IFCWorkerHandler } from '../IFCWorkerHandler';
import { IFCModel } from '../../components/IFCModel';
import { Serializer } from '../serializer/Serializer';
import { BvhManager } from '../../components/BvhManager';
import { IndexedDatabase } from '../../indexedDB/IndexedDatabase';
export declare class ParserHandler implements ParserAPI {
    private handler;
    private serializer;
    private BVH;
    private IDB;
    optionalCategories: OptionalCategories;
    API: WorkerAPIs;
    constructor(handler: IFCWorkerHandler, serializer: Serializer, BVH: BvhManager, IDB: IndexedDatabase);
    setupOptionalCategories(config: OptionalCategories): Promise<any>;
    parse(buffer: any, coordinationMatrix?: number[]): Promise<IFCModel>;
    getAndClearErrors(_modelId: number): void;
    private updateState;
    private getModel;
}
