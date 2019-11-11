class ParticleLine {
  constructor(node: Node | null) {
    const body = document.querySelector('body') as HTMLBodyElement
    const width = window.innerWidth
    const height = window.innerHeight

    const canvas = document.createElement('canvas')
    canvas.style.width = width + 'px'
    canvas.style.height = height + 'px'

    this.insertBefore()
  }

  insertBefore (node: node | null) {
    return this.body.insertBefore(canvas, node)
  }
}

export default ParticleLine
