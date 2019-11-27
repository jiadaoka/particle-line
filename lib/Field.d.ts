import Vec2D from './vec2d';
export default class Field {
    center: Vec2D;
    constructor(center: Vec2D);
    calcForce(p: Vec2D): Vec2D;
    calcDrag(v: Vec2D): Vec2D;
}
