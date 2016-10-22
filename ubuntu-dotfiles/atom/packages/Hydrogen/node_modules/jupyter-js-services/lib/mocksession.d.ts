import { IAjaxSettings } from './utils';
import { ISignal } from 'phosphor/lib/core/signaling';
import { ISession } from './isession';
import { IKernel, KernelMessage } from './ikernel';
import { MockKernel } from './mockkernel';
/**
 * A mock session object that uses a mock kernel by default.
 */
export declare class MockSession implements ISession {
    id: string;
    path: string;
    ajaxSettings: IAjaxSettings;
    constructor(model?: ISession.IModel);
    /**
     * A signal emitted when the session dies.
     */
    sessionDied: ISignal<MockSession, void>;
    /**
     * A signal emitted when the kernel changes.
     */
    kernelChanged: ISignal<MockSession, MockKernel>;
    /**
     * A signal emitted when the kernel status changes.
     */
    statusChanged: ISignal<MockSession, IKernel.Status>;
    /**
     * A signal emitted for a kernel messages.
     */
    iopubMessage: ISignal<MockSession, KernelMessage.IIOPubMessage>;
    /**
     * A signal emitted for an unhandled kernel message.
     */
    unhandledMessage: ISignal<MockSession, KernelMessage.IMessage>;
    /**
     * A signal emitted when the session path changes.
     */
    pathChanged: ISignal<MockSession, string>;
    /**
     * Get the session kernel object.
     */
    kernel: MockKernel;
    /**
     * Get the session model.
     */
    model: ISession.IModel;
    /**
     * The current status of the session.
     */
    status: IKernel.Status;
    /**
     * Test whether the session has been disposed.
     *
     * #### Notes
     * This is a read-only property which is always safe to access.
     */
    isDisposed: boolean;
    /**
     * Dispose of the resources held by the session.
     */
    dispose(): void;
    /**
     * Rename or move the session.
     */
    rename(path: string): Promise<void>;
    /**
     * Change the kernel.
     */
    changeKernel(options: IKernel.IModel): Promise<MockKernel>;
    /**
     * Kill the kernel and shutdown the session.
     */
    shutdown(): Promise<void>;
    /**
     * Handle to changes in the Kernel status.
     */
    protected onKernelStatus(sender: IKernel, state: IKernel.Status): void;
    /**
     * Handle unhandled kernel messages.
     */
    protected onUnhandledMessage(sender: IKernel, msg: KernelMessage.IMessage): void;
    private _isDisposed;
    private _kernel;
}
/**
 *  A mock session manager object.
 */
export declare class MockSessionManager implements ISession.IManager {
    /**
     * A signal emitted when the kernel specs change.
     */
    specsChanged: ISignal<MockSessionManager, IKernel.ISpecModels>;
    /**
     * A signal emitted when the running sessions change.
     */
    runningChanged: ISignal<MockSessionManager, ISession.IModel[]>;
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
    /**
     * Get the available kernel specs.
     */
    getSpecs(options?: ISession.IOptions): Promise<IKernel.ISpecModels>;
    listRunning(options?: ISession.IOptions): Promise<ISession.IModel[]>;
    /**
     * Start a new session.
     */
    startNew(options: ISession.IOptions, id?: string): Promise<MockSession>;
    /**
     * Find a session by id.
     */
    findById(id: string, options?: ISession.IOptions): Promise<ISession.IModel>;
    /**
     * Find a session by path.
     */
    findByPath(path: string, options?: ISession.IOptions): Promise<ISession.IModel>;
    /**
     * Connect to a running session.
     */
    connectTo(id: string, options?: ISession.IOptions): Promise<MockSession>;
    shutdown(id: string, options?: IKernel.IOptions): Promise<void>;
    private _isDisposed;
    private _running;
}
