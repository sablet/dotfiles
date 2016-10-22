import { ISignal } from 'phosphor/lib/core/signaling';
import { IKernel } from './ikernel';
import { IServiceManager } from './manager';
import { MockContentsManager } from './mockcontents';
import { MockKernelManager } from './mockkernel';
import { MockSessionManager } from './mocksession';
import { MockTerminalManager } from './mockterminals';
/**
 * A mock implementation of a services manager.
 */
export declare class MockServiceManager implements IServiceManager {
    /**
     * Construct a new services provider.
     */
    constructor();
    /**
     * A signal emitted when the specs change on the service manager.
     */
    specsChanged: ISignal<MockServiceManager, IKernel.ISpecModels>;
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
    kernels: MockKernelManager;
    /**
     * Get the session manager instance.
     *
     * #### Notes
     * This is a read-only property.
     */
    sessions: MockSessionManager;
    /**
     * Get the contents manager instance.
     *
     * #### Notes
     * This is a read-only property.
     */
    contents: MockContentsManager;
    /**
     * Get the terminal manager instance.
     *
     * #### Notes
     * This is a read-only property.
     */
    terminals: MockTerminalManager;
    private _kernelManager;
    private _sessionManager;
    private _contentsManager;
    private _terminalManager;
    private _kernelspecs;
    private _isDisposed;
}
