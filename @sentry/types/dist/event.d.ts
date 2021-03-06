import { Breadcrumb } from './breadcrumb';
import { Exception } from './exception';
import { Request } from './request';
import { SdkInfo } from './sdkinfo';
import { Severity } from './severity';
import { Span } from './span';
import { Stacktrace } from './stacktrace';
import { User } from './user';
/** JSDoc */
export interface Event {
    event_id?: string;
    message?: string;
    timestamp?: number;
    start_timestamp?: number;
    level?: Severity;
    platform?: string;
    logger?: string;
    server_name?: string;
    release?: string;
    dist?: string;
    environment?: string;
    sdk?: SdkInfo;
    request?: Request;
    transaction?: string;
    modules?: {
        [key: string]: string;
    };
    fingerprint?: string[];
    exception?: {
        values?: Exception[];
    };
    stacktrace?: Stacktrace;
    breadcrumbs?: Breadcrumb[];
    contexts?: {
        [key: string]: object;
    };
    tags?: {
        [key: string]: string;
    };
    extra?: {
        [key: string]: any;
    };
    user?: User;
    type?: EventType;
    spans?: Span[];
}
/** JSDoc */
export declare type EventType = 'transaction';
/** JSDoc */
export interface EventHint {
    event_id?: string;
    syntheticException?: Error | null;
    originalException?: Error | string | null;
    data?: any;
}
//# sourceMappingURL=event.d.ts.map