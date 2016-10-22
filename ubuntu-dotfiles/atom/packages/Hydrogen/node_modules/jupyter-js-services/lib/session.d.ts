import { ISignal } from 'phosphor/lib/core/signaling';
import { IKernel } from './ikernel';
import { ISession } from './isession';
/**
 * An implementation of a session manager.
 */
export declare class SessionManager implements ISession.IManager {
    /**
     * Construct a new session manager.
     *
     * @param options - The default options for each session.
     */
    constructor(options?: ISession.IOptions);
    /**
     * A signal emitted when the kernel specs change.
     */
    specsChanged: ISignal<SessionManager, IKernel.ISpecModels>;
    /**
     * A signal emitted when the running sessions change.
     */
    runningChanged: ISignal<SessionManager, ISession.IModel[]>;
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
     * Get the available kernel specs. See also [[getKernelSpecs]].
     *
     * @param options - Overrides for the default options.
     */
    getSpecs(options?: ISession.IOptions): Promise<IKernel.ISpecModels>;
    /**
     * List the running sessions.  See also [[listRunningSessions]].
     *
     * @param options - Overrides for the default options.
     */
    listRunning(options?: ISession.IOptions): Promise<ISession.IModel[]>;
    /**
     * Start a new session.  See also [[startNewSession]].
     *
     * @param options - Overrides for the default options, must include a
     *   `'path'`.
     *
     * #### Notes
     * This will emit [[runningChanged]] if the running kernels list
     * changes.
     */
    startNew(options: ISession.IOptions): Promise<ISession>;
    /**
     * Find a session by id.
     */
    findById(id: string, options?: ISession.IOptions): Promise<ISession.IModel>;
    /**
     * Find a session by path.
     */
    findByPath(path: string, options?: ISession.IOptions): Promise<ISession.IModel>;
    connectTo(id: string, options?: ISession.IOptions): Promise<ISession>;
    /**
     * Shut down a session by id.
     *
     * #### Notes
     * This will emit [[runningChanged]] if the running kernels list
     * changes.
     */
    shutdown(id: string, options?: ISession.IOptions): Promise<void>;
    /**
     * Get optionally overidden options.
     */
    private _getOptions(options);
    private _options;
    private _isDisposed;
    private _running;
    private _specs;
}
/**
 * List the running sessions.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/sessions), and validates the response.
 *
 * All client-side sessions are updated with current information.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 */
export declare function listRunningSessions(options?: ISession.IOptions): Promise<ISession.IModel[]>;
/**
 * Start a new session.
 *
 * #### Notes
 * Uses the [Jupyter Notebook API](http://petstore.swagger.io/?url=https://raw.githubusercontent.com/jupyter/notebook/master/notebook/services/api/api.yaml#!/sessions), and validates the response.
 *
 * A path must be provided.  If a kernel id is given, it will
 * connect to an existing kernel.  If no kernel id or name is given,
 * the server will start the default kernel type.
 *
 * The promise is fulfilled on a valid response and rejected otherwise.
 *
 * Wrap the result in an Session object. The promise is fulfilled
 * when the session is created on the server, otherwise the promise is
 * rejected.
 */
export declare function startNewSession(options: ISession.IOptions): Promise<ISession>;
/**
 * Find a session by id.
 *
 * #### Notes
 * If the session was already started via `startNewSession`, the existing
 * Session object's information is used in the fulfillment value.
 *
 * Otherwise, if `options` are given, we attempt to find to the existing
 * session.
 * The promise is fulfilled when the session is found,
 * otherwise the promise is rejected.
 */
export declare function findSessionById(id: string, options?: ISession.IOptions): Promise<ISession.IModel>;
/**
 * Find a session by path.
 *
 * #### Notes
 * If the session was already started via `startNewSession`, the existing
 * Session object's info is used in the fulfillment value.
 *
 * Otherwise, if `options` are given, we attempt to find to the existing
 * session using [listRunningSessions].
 * The promise is fulfilled when the session is found,
 * otherwise the promise is rejected.
 *
 * If the session was not already started and no `options` are given,
 * the promise is rejected.
 */
export declare function findSessionByPath(path: string, options?: ISession.IOptions): Promise<ISession.IModel>;
/**
 * Connect to a running session.
 *
 * #### Notes
 * If the session was already started via `startNewSession`, the existing
 * Session object is used as the fulfillment value.
 *
 * Otherwise, if `options` are given, we attempt to connect to the existing
 * session.
 * The promise is fulfilled when the session is ready on the server,
 * otherwise the promise is rejected.
 *
 * If the session was not already started and no `options` are given,
 * the promise is rejected.
 */
export declare function connectToSession(id: string, options?: ISession.IOptions): Promise<ISession>;
/**
 * Shut down a session by id.
 */
export declare function shutdownSession(id: string, options?: ISession.IOptions): Promise<void>;
