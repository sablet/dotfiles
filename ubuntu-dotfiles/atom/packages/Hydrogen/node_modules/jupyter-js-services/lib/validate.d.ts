import { IContents } from './contents';
import { IKernel, KernelMessage } from './ikernel';
import { ISession } from './isession';
/**
 * Validate a kernel message object.
 */
export declare function validateKernelMessage(msg: KernelMessage.IMessage): void;
/**
 * Validate an `IKernel.IModel` object.
 */
export declare function validateKernelModel(model: IKernel.IModel): void;
/**
 * Validate an `ISession.IModel` object.
 */
export declare function validateSessionModel(model: ISession.IModel): void;
/**
 * Validate an `IKernel.ISpecModel` object.
 */
export declare function validateKernelSpecModel(info: IKernel.ISpecModel): void;
/**
 * Validate an `IContents.IModel` object.
 */
export declare function validateContentsModel(model: IContents.IModel): void;
/**
 * Validate an `IContents.ICheckpointModel` object.
 */
export declare function validateCheckpointModel(model: IContents.ICheckpointModel): void;
