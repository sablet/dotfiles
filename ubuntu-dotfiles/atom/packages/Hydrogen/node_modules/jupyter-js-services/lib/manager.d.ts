import { IDisposable } from 'phosphor/lib/core/disposable';
import { ISignal } from 'phosphor/lib/core/signaling';
import { IContents, ContentsManager } from './contents';
import { IKernel } from './ikernel';
import { ISession } from './isession';
import { KernelManager } from './kernel';
import { SessionManager } from './session';
import { ITerminalSession, TerminalManager } from './terminals';
import { IAjaxSettings } from './utils';
/**
 * A service manager interface.
 */
export interface IServiceManager extends IDisposable {
    /**
     * A signal emitted when the specs change on the service manager.
     */
    specsChanged: ISignal<IServiceManager, IKernel.ISpecModels>;
    /**
     * The kernel specs for the manager.
     *
     * #### Notes
     * This is a read-only property.
     */
    kernelspecs: IKernel.ISpecModels;
    /**
     * The kernel manager for the manager.
     *
     * #### Notes
     * This is a read-only property.
     */
    kernels: IKernel.IManager;
    /**
     * The session manager for the manager.
     *
     * #### Notes
     * This is a read-only property.
     */
    sessions: ISession.IManager;
    /**
     * The contents manager for the manager.
     *
     * #### Notes
     * This is a read-only property.
     */
    contents: IContents.IManager;
    /**
     * The terminals manager for the manager.
     *
     * #### Notes
     * This is a read-only property.
     */
    terminals: ITerminalSession.IManager;
}
/**
 * The namespace for `IServiceManager` statics.
 */
export declare namespace IServiceManager {
    /**
     * The options used to create a service manager.
     */
    interface IOptions {
        /**
         * The base url of the server.
         */
        baseUrl?: string;
        /**
         * The ajax settings for the manager.
         */
        ajaxSettings?: IAjaxSettings;
        /**
         * The kernelspecs for the manager.
         */
        kernelspecs?: IKernel.ISpecModels;
    }
}
/**
 * Create a new service manager.
 *
 * @param options - The service manager creation options.
 *
 * @returns A promise that resolves with a service manager.
 */
export declare function createServiceManager(options?: IServiceManager.IOptions): Promise<IServiceManager>;
/**
 * An implementation of a services manager.
 */
export declare class ServiceManager implements IServiceManager {
    /**
     * Construct a new services provider.
     */
    constructor(options: IServiceManager.IOptions);
    /**
     * A signal emitted when the specs change on the service manager.
     */
    specsChanged: ISignal<ServiceManager, IKernel.ISpecModels>;
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
     * Get kernel specs.
     */
    kernelspecs: IKernel.ISpecModels;
    /**
     * Get kernel manager instance.
     *
     * #### Notes
     * This is a read-only property.
     */
    kernels: KernelManager;
    /**
     * Get the session manager instance.
     *
     * #### Notes
     * This is a read-only property.
     */
    sessions: SessionManager;
    /**
     * Get the contents manager instance.
     *
     * #### Notes
     * This is a read-only property.
     */
    contents: ContentsManager;
    /**
     * Get the terminal manager instance.
     *
     * #### Notes
     * This is a read-only property.
     */
    terminals: TerminalManager;
    /**
     * Handle a change in kernel specs.
     */
    private _onSpecsChanged(sender, args);
    private _kernelManager;
    private _sessionManager;
    private _contentsManager;
    private _terminalManager;
    private _kernelspecs;
    private _isDisposed;
}
