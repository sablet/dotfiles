import { ISignal } from 'phosphor/lib/core/signaling';
import { ITerminalSession } from './terminals';
/**
 * A mock terminal session manager.
 */
export declare class MockTerminalManager implements ITerminalSession.IManager {
    /**
     * Construct a new mock terminal manager.
     */
    constructor();
    /**
     * A signal emitted when the running terminals change.
     */
    runningChanged: ISignal<MockTerminalManager, ITerminalSession.IModel[]>;
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
     * Create a new terminal session or connect to an existing session.
     */
    create(options?: ITerminalSession.IOptions): Promise<MockTerminalSession>;
    /**
     * Shut down a terminal session by name.
     */
    shutdown(name: string): Promise<void>;
    /**
     * Get the list of models for the terminals running on the server.
     */
    listRunning(): Promise<ITerminalSession.IModel[]>;
    private _running;
    private _isDisposed;
}
/**
 * A mock implementation of a terminal interface.
 */
export declare class MockTerminalSession implements ITerminalSession {
    /**
     * Construct a new terminal session.
     */
    constructor(name: string);
    /**
     * A signal emitted when a message is received from the server.
     */
    messageReceived: ISignal<ITerminalSession, ITerminalSession.IMessage>;
    /**
     * Get the name of the terminal session.
     *
     * #### Notes
     * This is a read-only property.
     */
    name: string;
    /**
     * Get the websocket url used by the terminal session.
     *
     * #### Notes
     * This is a read-only property.
     */
    url: string;
    /**
     * Test whether the session is disposed.
     *
     * #### Notes
     * This is a read-only property.
     */
    isDisposed: boolean;
    /**
     * Dispose of the resources held by the session.
     */
    dispose(): void;
    /**
     * Send a message to the terminal session.
     */
    send(message: ITerminalSession.IMessage): void;
    /**
     * Shut down the terminal session.
     */
    shutdown(): Promise<void>;
    private _name;
    private _url;
    private _isDisposed;
}
