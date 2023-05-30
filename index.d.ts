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
declare const plugin: Plugin;
export default plugin;
