import 'virtual:uno.css';
import type { Plugin } from 'vue';
export declare const FSvgTree: import("vue").DefineComponent<{
    data: {
        type: import("vue").PropType<any>;
        required: true;
    };
    nodeSize: {
        type: import("vue").PropType<number>;
        default: number;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, "node-mouseover"[], "node-mouseover", import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    data: {
        type: import("vue").PropType<any>;
        required: true;
    };
    nodeSize: {
        type: import("vue").PropType<number>;
        default: number;
    };
}>> & {
    "onNode-mouseover"?: (...args: any[]) => any;
}, {
    nodeSize: number;
}, {}>;
export declare const FLogViewer: import("vue").DefineComponent<{
    loadLogs: {
        type: import("vue").PropType<() => Promise<string[]>>;
        required: true;
    };
    logCount: {
        type: import("vue").PropType<number>;
        required: true;
    };
}, {}, unknown, {}, {}, import("vue").ComponentOptionsMixin, import("vue").ComponentOptionsMixin, {}, string, import("vue").VNodeProps & import("vue").AllowedComponentProps & import("vue").ComponentCustomProps, Readonly<import("vue").ExtractPropTypes<{
    loadLogs: {
        type: import("vue").PropType<() => Promise<string[]>>;
        required: true;
    };
    logCount: {
        type: import("vue").PropType<number>;
        required: true;
    };
}>>, {}, {}>;
declare const plugin: Plugin;
export default plugin;
