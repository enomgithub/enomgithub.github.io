namespace Snow {
  class Snow {
    x: number
    y: number
    vx: number
    vy: number
    size: number

    constructor(x: number, y: number, vx: number, vy: number, size: number) {
      this.x = x
      this.y = y
      this.vx = vx
      this.vy = vy
      this.size = size
    }
    move(dx: number, dy: number): void {
      this.x += dx
      this.y += dy
    }
    moveAbs(x: number, y: number): void {
      this.x = x
      this.y = y
    }
  }

  class Simulator {
    ms: number
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    snows: Array<{"snows": Array<Snow>, "color": string}>

    constructor(width: number, height: number, id: string) {
      this.ms = 16
      this.width = width
      this.height = height
      const canvas = document.getElementById(id) as HTMLCanvasElement | null
      if (canvas !== null) {
        const ctx = canvas.getContext("2d")
        if (ctx !== null) {
          this.ctx = ctx
        } else {
          throw new Error("Something wrong")
        }
      } else {
        throw new Error("Something wrong")
      }
      this.snows = []
    }
    makeSnows(n: number, size: number, vx: number, vy: number, color: string): void {
      let snows: Array<Snow> = []
      for (let i = 0; i < n; i += 1) {
        const x = (Math.random() * this.width) | 0
        const y = (Math.random() * this.height) | 0
        snows.push(new Snow(x, y, vx, vy, size))
      }
      this.snows.push({"snows": snows, "color": color})
    }
    moveSnows(snows: Array<Snow>): void {
      for (let snow of snows) {
        const x = ((Math.random() * snow.vx) + 1) | 0
        const y = ((Math.random() * snow.vy) + 1) | 0
        snow.move(x, y)
        if (snow.x >= this.width) {
          snow.moveAbs(0, snow.y)
        }
        if (snow.y >= this.height) {
          snow.moveAbs(snow.x, 0)
        }
      }
    }
    drawSnows(snows: Array<Snow>, color: string): void {
      this.ctx.fillStyle = color
      for (let snow of snows) {
        this.ctx.beginPath()
        this.ctx.arc(snow.x, snow.y, snow.size / 2, 0, Math.PI * 2, true)
        this.ctx.fill()
      }
    }
    draw(): void {
      this.ctx.fillStyle = "rgb(13, 0, 21)"
      this.ctx.fillRect(0, 0, this.width, this.height)

      for (let snows of this.snows) {
        this.drawSnows(snows["snows"], snows["color"])
      }
    }
    loop(): void {
      this.draw()
      for (let snows of this.snows) {
        this.moveSnows(snows["snows"])
      }
    }
  }

  let simulator: Simulator
  let timer: number

  function run(): void {
    simulator.loop()
  }

  export function init(width: number, height: number, ratio: number, id: string): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null
    if (canvas !== null) {
      canvas.width = width
      canvas.height = height
    } else {
      throw new Error("Something wrong")
    }
    const vx = 3 * ratio
    const vy = 5 * ratio
    simulator = new Simulator(width, height, id)
    simulator.makeSnows(40, 4 * ratio, vx, vy, "rgb(160, 160, 160")
    simulator.makeSnows(30, 10 * ratio, vx, vy, "rgb(192, 192, 192")
    simulator.makeSnows(20, 16 * ratio, vx, vy, "rgb(224, 224, 224")
    simulator.makeSnows(10, 22 * ratio, vx, vy, "rgb(255, 255, 255")
    timer = setInterval(run, simulator.ms)
  }

  export function stopTimer(): void {
    if (timer) {
      clearInterval(timer)
    }
  }
}