export declare type ContextExtension = any;
export interface Time {
    now: number;
    dt: number;
}
export declare type Note = number[];
export declare type Ctrl = number[];
export interface Midi {
    note: Note[];
    ctrl: Ctrl[];
}
export interface Screen {
    width: number;
    height: number;
    top: number;
    bottom: number;
    left: number;
    right: number;
}
export interface MainContext {
    midi: Midi;
}
export declare type Cache = any;
export declare type Context = Readonly<MainContext & ContextExtension>;
export interface AllChildren {
    (): void;
}
export interface Children {
    [key: number]: Update;
    all?: AllChildren;
}
export interface Require {
    (libname: string): any;
}
export interface SourceCallback {
    (content: string): void;
}
export interface Asset {
    source(name: string, callback: SourceCallback): void;
}
export interface SliderCallback {
    (v: number): void;
}
export interface PadCallback {
    (x: number, y: number): void;
}
export interface Control {
    Slider(name: string, clbk: SliderCallback): any;
    Pad(namex: string, namey: string, clbk: PadCallback): any;
}
export interface Helpers {
    context: Context;
    children: Children;
    cache: Cache;
    detached: boolean;
    contextForChildren: Context;
}
export interface StringMap {
    [key: string]: string;
}
export interface Meta {
    description: string;
    tags: string[];
    author: string;
    origin: string;
    version: string;
    expect?: StringMap;
    provide?: StringMap;
    children?: string[] | 'all';
    update?: string;
}
export interface Init {
    (h: Helpers): ContextExtension | void;
}
export interface Update {
    (...any: any[]): any;
}
export interface Block {
    init?: Init;
    update?: Update;
    meta?: Meta;
}
