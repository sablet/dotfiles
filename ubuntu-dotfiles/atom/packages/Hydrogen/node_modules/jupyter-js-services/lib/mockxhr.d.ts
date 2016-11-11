/**
 * Mock XMLHttpRequest object.
 * Handles a global list of request, and adds the ability to respond()
 * to them.
 */
export declare class MockXMLHttpRequest {
    static UNSENT: number;
    static OPENED: number;
    static HEADERS_RECEIVED: number;
    static LOADING: number;
    static DONE: number;
    /**
     * Global list of XHRs.
     */
    static requests: MockXMLHttpRequest[];
    /**
     * Register a callback for the next request.
     *
     * It is automatically cleared after the request.
     */
    static onRequest: (request: MockXMLHttpRequest) => void;
    /**
     * Ready state of the request.
     */
    readyState: number;
    /**
     * Password of the request.
     */
    password: string;
    /**
     * Async status of the request.
     */
    async: boolean;
    /**
     * Response data for the request.
     */
    response: any;
    /**
     * Response data for the request as string.
     */
    responseText: string;
    /**
     * Enumerated value that represents the response type.
     */
    responseType: string;
    /**
     * Status code of the response of the request.
     */
    status: number;
    /**
     * The status string returned by the server.
     */
    statusText: string;
    /**
     * Get the number of milliseconds to wait before a request is
     * automatically canceled.
     */
    /**
     * Set the number of milliseconds to wait before a request is
     * automatically canceled.
     */
    timeout: number;
    /**
     * Set a callback for with the request is loaded.
     */
    onload: () => void;
    /**
     * Set a callback for when the request has an error.
     */
    onerror: (evt?: any) => void;
    /**
     * Set a callback for when the request is in progress.
     */
    onprogress: () => void;
    /**
     * Set a callback for when the ready state changes.
     */
    onreadystatechange: () => void;
    /**
     * Set a callback for when the ready state changes.
     */
    ontimeout: () => void;
    /**
     * Get the method of the request.
     */
    method: string;
    /**
     * Get the url of the request.
     */
    url: string;
    /**
     * Initialize a request.
     */
    open(method: string, url: string, async?: boolean, user?: string, password?: string): void;
    /**
     * Override the MIME type returned by the server.
     */
    overrideMimeType(mime: string): void;
    /**
     * Sends the request.
     */
    send(data?: any): void;
    /**
     * Get a copy of the HTTP request header.
     */
    requestHeaders: {
        [key: string]: any;
    };
    /**
     * Set the value of an HTTP request header.
     */
    setRequestHeader(header: string, value: string): void;
    /**
     * Returns the string containing the text of the specified header,
     * or null if either the response has not yet been received
     * or the header doesn't exist in the response.
     */
    getResponseHeader(header: string): string;
    /**
     * Respond to a Mock XHR.
     */
    respond(statusCode: number, response: any, header?: any): void;
    /**
     * Simulate a request error.
     */
    error(error: Error): void;
    private _readyState;
    private _response;
    private _responseType;
    private _status;
    private _statusText;
    private _timeout;
    private _mimetype;
    private _data;
    private _method;
    private _url;
    private _async;
    private _user;
    private _password;
    private _onLoad;
    private _onError;
    private _onProgress;
    private _requestHeader;
    private _responseHeader;
    private _onReadyState;
    private _onTimeout;
}
