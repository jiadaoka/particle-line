declare class Vec2D {
    x: number;
    y: number;
    constructor(x?: number, y?: number);
    plus(p: Vec2D): Vec2D;
    minus(p: Vec2D): Vec2D;
    times(p: number): Vec2D;
    abs(): number;
}
export default Vec2D;
