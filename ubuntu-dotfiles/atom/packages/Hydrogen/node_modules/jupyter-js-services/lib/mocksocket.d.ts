export declare function overrideWebSocket(): void;
/**
 * Base class for a mock socket implementation.
 */
export declare class SocketBase {
    static CONNECTING: number;
    static OPEN: number;
    static CLOSING: number;
    static CLOSED: number;
    /**
     * Get the current ready state.
     */
    readyState: number;
    /**
     * Assign a callback for the websocket opening.
     */
    onopen: () => void;
    /**
     * Assign a callback for the websocket closing.
     */
    onclose: (evt: any) => void;
    /**
     * Assign a callback for the websocket error condition.
     */
    onerror: (evt: any) => void;
    /**
     * Assign a callback for the websocket incoming message.
     */
    onmessage: (evt: any) => void;
    /**
     * Trigger an open event on the next event loop run.
     */
    triggerOpen(): void;
    /**
     * Trigger a close event on the next event loop run.
     */
    triggerClose(evt: any): void;
    /**
     * Trigger an error event on the next event loop run.
     */
    triggerError(msg: string): void;
    /**
     * Trigger a message event on the next event loop run.
     */
    triggerMessage(msg: string | ArrayBuffer): void;
    private _readyState;
    private _onClose;
    private _onMessage;
    private _onError;
    private _onOpen;
}
/**
 * Mock Websocket class that talks to a mock server.
 */
export declare class MockSocket extends SocketBase {
    /**
     * Create a new Mock Websocket.
     * Look for an connect to a server on the same url.
     */
    constructor(url: string);
    /**
     * Get the current binary data type.
     */
    /**
     * Set the binary data type.
     */
    binaryType: string;
    /**
     * Send a message to the server.
     */
    send(msg: string | ArrayBuffer): void;
    /**
     * Close the connection to the server.
     */
    close(code?: number, reason?: string): void;
    private _binaryType;
    private _server;
}
/**
 * Mock Websocket server.
 */
export declare class MockSocketServer extends SocketBase {
    /**
     * Map of running servers by url.
     */
    static servers: {
        [key: string]: MockSocketServer;
    };
    /**
     * Callback for when a server is started.
     */
    static onConnect: (server: MockSocketServer) => void;
    /**
     * Create a new mock web socket server.
     */
    constructor(url: string);
    /**
     * Get the server url.
     *
     * Read-only.
     */
    url: string;
    /**
   * Assign a callback for the websocket closing.
   */
    onWSClose: (ws: MockSocket) => void;
    /**
     * Handle a connection from a mock websocket.
     */
    connect(ws: MockSocket): void;
    /**
     * Handle a closing websocket.
     */
    closeSocket(ws: MockSocket, evt: any): void;
    /**
     * Send a message to all connected web sockets.
     */
    send(msg: string | ArrayBuffer): void;
    /**
     * Trigger an error for all connected web sockets.
     */
    triggerError(msg: string): void;
    private _onWSClose;
    private _connections;
    private _url;
}
