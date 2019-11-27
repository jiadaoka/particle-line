import Vec2D from './vec2d'
import Field from './Field'
class Particle {
  pos: Vec2D
  v: Vec2D
  r = 5
  color = '#3463B3'

  constructor(p: { pos: Vec2D; v: Vec2D; r?: number; color?: string }) {
    this.pos = p.pos
    this.v = p.v
    if (p.r) this.r = p.r
    if (p.color) this.color = p.color
  }

  update (a: Vec2D = new Vec2D(0, 0)): void {
    this.v = this.v.plus(a)
    this.pos = this.pos.plus(this.v)
  }

  calcAcceleration (center: Vec2D): Vec2D {
    const field = new Field(center)
    const f = field.calcForce(this.pos)
    const d = field.calcDrag(this.v)
    console.log(f)
    return f.plus(d)
  }

  draw (ctx: CanvasRenderingContext2D): void {
    ctx.beginPath()
    ctx.arc(this.pos.x, this.pos.y, this.r, 0, Math.PI * 2, true)
    ctx.closePath()
    ctx.fillStyle = this.color
    ctx.fill()
  }

  connection (ctx: CanvasRenderingContext2D, p: Vec2D, lineWidth: number): void {
    ctx.beginPath()
    ctx.moveTo(this.pos.x, this.pos.y)
    ctx.lineTo(p.x, p.y)
    ctx.lineWidth = lineWidth
    ctx.strokeStyle = this.color
    ctx.stroke()
  }
}

class ParticleLine {
  width = 300
  height = 300
  background: string
  color: string
  surplus = 0
  ctx: CanvasRenderingContext2D
  particleNum = 100
  particleArr: Particle[] = []
  particleMouse: Particle | null = null

  constructor(background = '#2D3553', color = '#3463B3', node: Node | null = null) {
    const body = document.querySelector('body') as HTMLBodyElement

    this.background = background
    this.color = color
    this.width = window.innerWidth
    this.height = window.innerHeight

    const canvas = document.createElement('canvas')
    canvas.innerText = '您的浏览器不支持 Canvas!'
    canvas.width = this.width
    canvas.height = this.height

    if (node === null) node = body.childNodes[0]
    body.insertBefore(canvas, node)
    this.ctx = canvas.getContext('2d') as CanvasRenderingContext2D

    this.particleNum = this.getParticleNum(this.width, this.height)
    // this.particleNum = 1

    this.mousemove(canvas)
    this.mouseover(canvas)
    this.mouseout(canvas)

    this.animation()
  }


  createParticle (): void {
    const len = this.particleArr.length
    if (len >= this.particleNum) return
    for (let i = len; i < this.particleNum; i++) {
      const _r = 5
      const _p: Particle = new Particle({ pos: new Vec2D(this.randomRange(_r, this.width - _r), this.randomRange(_r, this.height - _r)), v: new Vec2D(this.randomRange(-1, 1, true, false), this.randomRange(-1, 1, true, false)), r: _r, color: `rgb(${this.randomRange(0, 255, false)},${this.randomRange(0, 255, false)},${this.randomRange(0, 255, false)})` })
      this.particleArr.push(_p)
      this.surplus++
    }
  }

  draw (): void {
    const ctx = this.ctx
    this.createParticle()

    ctx.clearRect(0, 0, this.width, this.height)

    ctx.fillStyle = this.background
    ctx.fillRect(0, 0, this.width, this.height)

    for (let i = 0; i < this.surplus; i++) {
      const currP = this.particleArr[i]
      currP.draw(ctx)
      currP.update()

      if (currP.pos.x <= -5 || currP.pos.x >= this.width + 5 || currP.pos.y <= -5 || currP.pos.y >= this.height + 5) {
        [this.particleArr[i], this.particleArr[this.surplus - 1]] = [this.particleArr[this.surplus - 1], this.particleArr[i]]
        this.surplus--
        continue
      }

      for (let i2 = i + 1; i2 < this.surplus; i2++) {
        const p2 = this.particleArr[i2].pos
        const l = currP.pos.minus(p2).abs()

        if (l < 80) {
          currP.connection(ctx, p2, 2 * ((80 - l) / 80))
        }
      }
    }

    if (this.particleMouse !== null) {
      this.particleMouse.draw(ctx)
      const pMouse = this.particleMouse
      for (let i = 0; i < this.particleNum; i++) {
        const p = this.particleArr[i]
        const l = pMouse.pos.minus(p.pos).abs()
        if (l < 80) {
          this.particleMouse.connection(ctx, p.pos, 2 * ((80 - l) / 80))
        }
        if (l < 200) {
          const a = p.calcAcceleration(pMouse.pos)
          p.update(a)
        }

      }
    }

    this.particleArr.splice(this.surplus)

  }

  animation (): void {
    this.draw()
    requestAnimationFrame(() => this.animation() as unknown as FrameRequestCallback)
  }

  randomRange (min: number, max: number, allowDecimal = true, allowZero = true): number {
    if (max <= min) throw '范围出错。'
    let num = min + Math.random() * (max - min)
    if (allowDecimal) {
      num = Math.floor(num * 100) / 100
    } else {
      num = Math.floor(num)
    }

    if (!allowZero && num === 0) num = this.randomRange(min, max, allowDecimal, allowZero)

    return num
  }

  getParticleNum (width: number, height: number): number {
    const num = Math.floor(width / 50) * Math.floor(height / 100)
    return num
  }

  mouseover (el: HTMLElement): void {
    return el.addEventListener('mouseover', e => {
      this.particleMouse = new Particle({ pos: new Vec2D(e.clientX, e.clientY), v: new Vec2D(0, 0) })
    })
  }

  mousemove (el: HTMLElement): void {
    return el.addEventListener('mousemove', e => {
      if (this.particleMouse !== null) {
        this.particleMouse.pos.x = e.clientX
        this.particleMouse.pos.y = e.clientY
      }
    })
  }

  mouseout (el: HTMLElement): void {
    return el.addEventListener('mouseout', () => {
      this.particleMouse = null
    })
  }

}

export default ParticleLine
