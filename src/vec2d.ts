class Vec2D {
  x: number;
  y: number;

  constructor(x = 0, y = 0) {
    this.x = x
    this.y = y
  }

  plus (p: Vec2D): Vec2D {
    return new Vec2D(this.x + p.x, this.y + p.y)
  }

  minus (p: Vec2D): Vec2D {
    return new Vec2D(this.x - p.x, this.y - p.y)
  }

  times (p: number): Vec2D {
    return new Vec2D(this.x * p, this.y * p)
  }

  abs (): number {
    return Math.sqrt(this.x * this.x + this.y * this.y)
  }
}

export default Vec2D
