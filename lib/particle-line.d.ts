import Vec2D from './vec2d';
declare class Particle {
    pos: Vec2D;
    v: Vec2D;
    r: number;
    color: string;
    constructor(p: {
        pos: Vec2D;
        v: Vec2D;
        r?: number;
        color?: string;
    });
    update(a?: Vec2D): void;
    calcAcceleration(center: Vec2D): Vec2D;
    draw(ctx: CanvasRenderingContext2D): void;
    connection(ctx: CanvasRenderingContext2D, p: Vec2D, lineWidth: number): void;
}
declare class ParticleLine {
    width: number;
    height: number;
    background: string;
    color: string;
    surplus: number;
    ctx: CanvasRenderingContext2D;
    particleNum: number;
    particleArr: Particle[];
    particleMouse: Particle | null;
    constructor(background?: string, color?: string, node?: Node | null);
    createParticle(): void;
    draw(): void;
    animation(): void;
    randomRange(min: number, max: number, allowDecimal?: boolean, allowZero?: boolean): number;
    getParticleNum(width: number, height: number): number;
    mouseover(el: HTMLElement): void;
    mousemove(el: HTMLElement): void;
    mouseout(el: HTMLElement): void;
}
export default ParticleLine;
