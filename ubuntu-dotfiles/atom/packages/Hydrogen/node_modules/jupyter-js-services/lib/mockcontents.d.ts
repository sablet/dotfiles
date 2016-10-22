import { IAjaxSettings } from './utils';
import { IContents } from './contents';
export declare class MockContentsManager implements IContents.IManager {
    methods: string[];
    DEFAULT_TEXT: string;
    /**
     * Create a file with default content.
     */
    createFile(path: string): void;
    /**
     * Get a path in the format it was saved or created in.
     */
    get(path: string, options?: IContents.IFetchOptions): Promise<IContents.IModel>;
    /**
     * Get a download url given an absolute file path.
     */
    getDownloadUrl(path: string): string;
    newUntitled(options?: IContents.ICreateOptions): Promise<IContents.IModel>;
    delete(path: string): Promise<void>;
    rename(path: string, newPath: string): Promise<IContents.IModel>;
    save(path: string, options?: IContents.IModel): Promise<IContents.IModel>;
    copy(path: string, toDir: string): Promise<IContents.IModel>;
    createCheckpoint(path: string): Promise<IContents.ICheckpointModel>;
    listCheckpoints(path: string): Promise<IContents.ICheckpointModel[]>;
    restoreCheckpoint(path: string, checkpointID: string): Promise<void>;
    deleteCheckpoint(path: string, checkpointID: string): Promise<void>;
    private _copyModel(model);
    ajaxSettings: IAjaxSettings;
    private _files;
    private _checkpoints;
    private _fileSnaps;
    private _id;
}
