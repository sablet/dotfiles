import { ISignal } from 'phosphor/lib/core/signaling';
import { IKernel, KernelMessage } from './ikernel';
import { JSONObject } from './json';
/**
 * An implementation of a kernel manager.
 */
export declare class KernelManager implements IKernel.IManager {
    /**
     * Construct a new kernel manager.
     *
     * @param options - The default options for kernel.
     */
    constructor(options?: IKernel.IOptions);
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
    /**
     * Get the kernel specs.  See also [[getKernelSpecs]].
     *
     * @param options - Overrides for the default options.
     */
    getSpecs(options?: IKernel.IOptions): Promise<IKernel.ISpecModels>;
    /**
     * List the running kernels.  See also [[listRunningKernels]].
     *
     * @param options - Overrides for the default options.
     */
    listRunning(options?: IKernel.IOptions): Promise<IKernel.IModel[]>;
    /**
     * Start a new kernel.  See also [[startNewKernel]].
     *
     * @param options - Overrides for the default options.
     *
     * #### Notes
     * This will emit [[runningChanged]] if the running kernels list
     * changes.
     */
    startNew(options?: IKernel.IOptions): Promise<IKernel>;
    /**
     * Find a kernel by id.
     *
     * @param options - Overrides for the default options.
     */
    findById(id: string, options?: IKernel.IOptions): Promise<IKernel.IModel>;
    /**
     * Connect to a running kernel.  See also [[connectToKernel]].
     *
     * @param options - Overrides for the default options.
     */
    connectTo(id: string, options?: IKernel.IOptions): Promise<IKernel>;
    /**
     * Shut down a kernel by id.
     *
     * @param options - Overrides for the default options.
     *
     * #### Notes
     * This will emit [[runningChanged]] if the running kernels list
     * changes.
     */
    shutdown(id: string, options?: IKernel.IOptions): Promise<void>;
    /**
     * Get optionally overidden options.
     */
    private _getOptions(options);
    private _options;
    private _running;
    private _spec;
    private _isDisposed;
}
/**
 * Find a kernel by id.
 *
 * #### Notes
 * If the kernel was already started via `startNewKernel`, we return its
 * `IKernel.IModel`.
 *
 * Otherwise, if `options` are given, we attempt to find to the existing
 * kernel.
 * The promise is fulfilled when the kernel is found,
 * otherwise the promise is rejected.
 */
export declare function findKernelById(id: string, options?: IKernel.IOptions): Promise<IKernel.IModel>;
/**
 * Fetch the kernel specs.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernelspecs).
 */
export declare function getKernelSpecs(options?: IKernel.IOptions): Promise<IKernel.ISpecModels>;
/**
 * Fetch the running kernels.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
export declare function listRunningKernels(options?: IKernel.IOptions): Promise<IKernel.IModel[]>;
/**
 * Start a new kernel.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/kernels) and validates the response model.
 *
 * If no options are given or the kernel name is not given, the
 * default kernel will by started by the server.
 *
 * Wraps the result in a Kernel object. The promise is fulfilled
 * when the kernel is started by the server, otherwise the promise is rejected.
 */
export declare function startNewKernel(options?: IKernel.IOptions): Promise<IKernel>;
/**
 * Connect to a running kernel.
 *
 * #### Notes
 * If the kernel was already started via `startNewKernel`, the existing
 * Kernel object info is used to create another instance.
 *
 * Otherwise, if `options` are given, we attempt to connect to the existing
 * kernel found by calling `listRunningKernels`.
 * The promise is fulfilled when the kernel is running on the server,
 * otherwise the promise is rejected.
 *
 * If the kernel was not already started and no `options` are given,
 * the promise is rejected.
 */
export declare function connectToKernel(id: string, options?: IKernel.IOptions): Promise<IKernel>;
/**
 * Shut down a kernel by id.
 */
export declare function shutdownKernel(id: string, options?: IKernel.IOptions): Promise<void>;
/**
 * Create a well-formed kernel message.
 */
export declare function createKernelMessage(options: KernelMessage.IOptions, content?: JSONObject, metadata?: JSONObject, buffers?: (ArrayBuffer | ArrayBufferView)[]): KernelMessage.IMessage;
/**
 * Create a well-formed kernel shell message.
 */
export declare function createShellMessage(options: KernelMessage.IOptions, content?: JSONObject, metadata?: JSONObject, buffers?: (ArrayBuffer | ArrayBufferView)[]): KernelMessage.IShellMessage;
