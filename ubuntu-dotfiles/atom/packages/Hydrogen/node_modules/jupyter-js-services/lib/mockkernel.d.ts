import { IDisposable } from 'phosphor/lib/core/disposable';
import { ISignal } from 'phosphor/lib/core/signaling';
import { IKernel, KernelMessage } from './ikernel';
import { JSONObject } from './json';
/**
 * The default kernel spec models.
 */
export declare const KERNELSPECS: IKernel.ISpecModels;
/**
 * The code input to trigger an error.
 */
export declare const ERROR_INPUT: string;
/**
 * A mock kernel object.
 */
export declare class MockKernel implements IKernel {
    id: string;
    name: string;
    username: string;
    clientId: string;
    /**
     * Construct a new mock kernel.
     */
    constructor(options?: IKernel.IModel);
    /**
     * A signal emitted when the kernel status changes.
     */
    statusChanged: ISignal<IKernel, IKernel.Status>;
    /**
     * A signal emitted for iopub kernel messages.
     */
    iopubMessage: ISignal<IKernel, KernelMessage.IIOPubMessage>;
    /**
     * A signal emitted for unhandled kernel message.
     */
    unhandledMessage: ISignal<IKernel, KernelMessage.IMessage>;
    /**
     * The current status of the kernel.
     */
    status: IKernel.Status;
    /**
     * The model associated with the kernel.
     *
     * #### Notes
     * This is a read-only property.
     */
    model: IKernel.IModel;
    info: KernelMessage.IInfoReply;
    spec: IKernel.ISpec;
    /**
     * Test whether the kernel has been disposed.
     */
    isDisposed: boolean;
    /**
     * Dispose of the resources held by the kernel.
     */
    dispose(): void;
    /**
     * Send a shell message to the kernel.
     */
    sendShellMessage(msg: KernelMessage.IShellMessage, expectReply?: boolean, disposeOnDone?: boolean): IKernel.IFuture;
    /**
     * Send a message to the kernel.
     */
    sendServerMessage(msgType: string, channel: KernelMessage.Channel, content: JSONObject, future: IKernel.IFuture): void;
    /**
     * Send a shell reply message to the kernel.
     */
    sendShellReply(content: JSONObject): void;
    /**
     * Interrupt a kernel.
     */
    interrupt(): Promise<void>;
    /**
     * Restart a kernel.
     */
    restart(): Promise<void>;
    /**
     * Reconnect to a disconnected kernel. This is not actually a
     * standard HTTP request, but useful function nonetheless for
     * reconnecting to the kernel if the connection is somehow lost.
     */
    reconnect(): Promise<void>;
    /**
     * Shutdown a kernel.
     */
    shutdown(): Promise<void>;
    /**
     * Get the kernel info.
     */
    kernelInfo(): Promise<KernelMessage.IInfoReplyMsg>;
    /**
     * Send a `complete_request` message.
     */
    complete(content: KernelMessage.ICompleteRequest): Promise<KernelMessage.ICompleteReplyMsg>;
    /**
     * Send a `history_request` message.
     */
    history(content: KernelMessage.IHistoryRequest): Promise<KernelMessage.IHistoryReplyMsg>;
    /**
     * Send an `inspect_request` message.
     */
    inspect(content: KernelMessage.IInspectRequest): Promise<KernelMessage.IInspectReplyMsg>;
    /**
     * Send an `execute_request` message.
     *
     * #### Notes
     * This simulates an actual exection on the server.
     * Use `ERROR_INPUT` to simulate an input error.
     */
    execute(content: KernelMessage.IExecuteRequest, disposeOnDone?: boolean): IKernel.IFuture;
    /**
     * Send an `is_complete_request` message.
     */
    isComplete(content: KernelMessage.IIsCompleteRequest): Promise<KernelMessage.IIsCompleteReplyMsg>;
    /**
     * Send a `comm_info_request` message.
     */
    commInfo(content: KernelMessage.ICommInfoRequest): Promise<KernelMessage.ICommInfoReplyMsg>;
    /**
     * Send an `input_reply` message.
     */
    sendInputReply(content: KernelMessage.IInputReply): void;
    /**
     * Register a comm target handler.
     */
    registerCommTarget(targetName: string, callback: (comm: IKernel.IComm, msg: KernelMessage.ICommOpenMsg) => void): IDisposable;
    /**
     * Connect to a comm, or create a new one.
     */
    connectToComm(targetName: string, commId?: string): IKernel.IComm;
    /**
     * Get the kernel spec associated with the kernel.
     */
    getKernelSpec(): Promise<IKernel.ISpec>;
    /**
     * Register a message hook
     */
    registerMessageHook(msg_id: string, hook: (msg: KernelMessage.IIOPubMessage) => boolean): IDisposable;
    /**
     * Send a messaage to the mock kernel.
     */
    private _sendKernelMessage(msgType, channel, content);
    /**
     * Handle a `stop_on_error` error event.
     */
    private _handleStop();
    /**
     * Change the status of the mock kernel.
     */
    private _changeStatus(status);
    private _status;
    private _isDisposed;
    private _futures;
    private _kernelspec;
    private _kernelInfo;
    private _executionCount;
}
/**
 * A mock kernel manager object.
 */
export declare class MockKernelManager implements IKernel.IManager {
    /**
     * A signal emitted when the specs change.
     */
    specsChanged: ISignal<IKernel.IManager, IKernel.ISpecModels>;
    /**
     * A signal emitted when the running kernels change.
     */
    runningChanged: ISignal<IKernel.IManager, IKernel.IModel[]>;
    /**
     * Test whether the terminal manager is disposed.
     *
     * #### Notes
     * This is a read-only property.
     */
    isDisposed: boolean;
    /**
     * Dispose of the resources used by the manager.
     */
    dispose(): void;
    getSpecs(options?: IKernel.IOptions): Promise<IKernel.ISpecModels>;
    listRunning(options?: IKernel.IOptions): Promise<IKernel.IModel[]>;
    startNew(options?: IKernel.IOptions, id?: string): Promise<MockKernel>;
    findById(id: string, options?: IKernel.IOptions): Promise<IKernel.IModel>;
    connectTo(id: string, options?: IKernel.IOptions): Promise<MockKernel>;
    shutdown(id: string, options?: IKernel.IOptions): Promise<void>;
    private _running;
    private _specs;
    private _isDisposed;
}
