import Vec2D from './vec2d'

export default class Field {
  center: Vec2D
  constructor(center: Vec2D) {
    this.center = center
  }

  calcForce (p: Vec2D): Vec2D {
    let _p: Vec2D = p.minus(this.center)
    if (_p.abs() >= 0 && _p.abs() < 200) {
      _p = _p.times(-1 / 8000)
    } else {
      _p.x = 0
      _p.y = 0
    }
    return _p
  }

  calcDrag (v: Vec2D): Vec2D {
    const vabs = v.abs()
    let _v: Vec2D = new Vec2D(v.x, v.y)
    if (vabs > 0.5) {
      _v = _v.times(-0.001)
    } else {
      _v.x = 0
      _v.y = 0
    }
    return _v
  }
}
