import { Point } from './geometry';
export interface Segment {
    key: string;
    data: number[];
    point?: Point;
}
export declare class RoughPath {
    private parsed;
    private _position;
    private _first;
    private _linearPoints?;
    bezierReflectionPoint: Point | null;
    quadReflectionPoint: Point | null;
    constructor(d: string);
    get segments(): Segment[];
    get closed(): boolean;
    get linearPoints(): Point[][];
    get first(): Point | null;
    set first(v: Point | null);
    setPosition(x: number, y: number): void;
    get position(): Point;
    get x(): number;
    get y(): number;
}
export interface RoughArcSegment {
    cp1: Point;
    cp2: Point;
    to: Point;
}
export declare class RoughArcConverter {
    private _segIndex;
    private _numSegs;
    private _rx;
    private _ry;
    private _sinPhi;
    private _cosPhi;
    private _C;
    private _theta;
    private _delta;
    private _T;
    private _from;
    constructor(from: Point, to: Point, radii: Point, angle: number, largeArcFlag: boolean, sweepFlag: boolean);
    getNextSegment(): RoughArcSegment | null;
    calculateVectorAngle(ux: number, uy: number, vx: number, vy: number): number;
}
export declare class PathFitter {
    sets: Point[][];
    closed: boolean;
    constructor(sets: Point[][], closed: boolean);
    fit(simplification: number): string;
    reduce(set: Point[], count: number): Point[];
}
