import { IDisposable } from 'phosphor/lib/core/disposable';
import { ISignal } from 'phosphor/lib/core/signaling';
import { JSONPrimitive, JSONObject } from './json';
import * as utils from './utils';
/**
 * An interface for a terminal session.
 */
export interface ITerminalSession extends IDisposable {
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
     * Send a message to the terminal session.
     */
    send(message: ITerminalSession.IMessage): void;
    /**
     * Shut down the terminal session.
     */
    shutdown(): Promise<void>;
}
/**
 * The namespace for ITerminalSession statics.
 */
export declare namespace ITerminalSession {
    /**
     * The options for intializing a terminal session object.
     */
    interface IOptions extends JSONObject {
        /**
         * The name of the terminal.
         */
        name?: string;
        /**
         * The base url.
         */
        baseUrl?: string;
        /**
         * The base websocket url.
         */
        wsUrl?: string;
        /**
         * The Ajax settings used for server requests.
         */
        ajaxSettings?: utils.IAjaxSettings;
    }
    /**
     * The server model for a terminal session.
     */
    interface IModel extends JSONObject {
        /**
         * The name of the terminal session.
         */
        name: string;
    }
    /**
     * A message from the terminal session.
     */
    interface IMessage extends JSONObject {
        /**
         * The type of the message.
         */
        type: MessageType;
        /**
         * The content of the message.
         */
        content?: JSONPrimitive[];
    }
    /**
     * Valid message types for the terminal.
     */
    type MessageType = 'stdout' | 'disconnect' | 'set_size' | 'stdin';
    /**
     * The interface for a terminal manager.
     */
    interface IManager extends IDisposable {
        /**
         * A signal emitted when the running terminals change.
         */
        runningChanged: ISignal<IManager, IModel[]>;
        /**
         * Create a new terminal session or connect to an existing session.
         *
         * #### Notes
         * This will emit [[runningChanged]] if the running terminals list
         * changes.
         */
        create(options?: ITerminalSession.IOptions): Promise<ITerminalSession>;
        /**
         * Shut down a terminal session by name.
         *
         * #### Notes
         * This will emit [[runningChanged]] if the running terminals list
         * changes.
         */
        shutdown(name: string): Promise<void>;
        /**
         * Get the list of models for the terminals running on the server.
         */
        listRunning(): Promise<IModel[]>;
    }
}
/**
 * Create a terminal session or connect to an existing session.
 *
 * #### Notes
 * If the session is already running on the client, the existing
 * instance will be returned.
 */
export declare function createTerminalSession(options?: ITerminalSession.IOptions): Promise<ITerminalSession>;
/**
 * A terminal session manager.
 */
export declare class TerminalManager implements ITerminalSession.IManager {
    /**
     * Construct a new terminal manager.
     */
    constructor(options?: TerminalManager.IOptions);
    /**
     * A signal emitted when the running terminals change.
     */
    runningChanged: ISignal<TerminalManager, ITerminalSession.IModel[]>;
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
    create(options?: ITerminalSession.IOptions): Promise<ITerminalSession>;
    /**
     * Shut down a terminal session by name.
     */
    shutdown(name: string): Promise<void>;
    /**
     * Get the list of models for the terminals running on the server.
     */
    listRunning(): Promise<ITerminalSession.IModel[]>;
    private _baseUrl;
    private _wsUrl;
    private _ajaxSettings;
    private _running;
    private _isDisposed;
}
/**
 * The namespace for TerminalManager statics.
 */
export declare namespace TerminalManager {
    /**
     * The options used to initialize a terminal manager.
     */
    interface IOptions {
        /**
         * The base url.
         */
        baseUrl?: string;
        /**
         * The base websocket url.
         */
        wsUrl?: string;
        /**
         * The Ajax settings used for server requests.
         */
        ajaxSettings?: utils.IAjaxSettings;
    }
}
