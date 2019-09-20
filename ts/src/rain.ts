namespace Rain {
  class Rain {
    x: number
    yTop: number
    yBottom: number
    size: number
    velocity: number
    xValiations: Array<number>
    counter: number

    constructor(x: number, y: number, size: number, velocity: number, xValiations: Array<number>) {
      this.x = x
      this.size = size
      this.yBottom = y
      this.yTop = this.yBottom - this.size
      this.velocity = velocity
      this.xValiations = xValiations
      this.counter = 0
    }
    count(maxLength: number): void {
      if (this.counter >= maxLength) {
        this.counter = 0
      } else {
        this.counter += 1
      }
    }
    move(dx: number, dy: number): void {
      this.x += dx
      this.yBottom += dy
      this.yTop += dy
    }
    moveAbs(x: number, y: number): void {
      this.x = x
      this.yBottom = y
      this.yTop = this.yBottom - this.size
    }
  }

  class Simulator {
    ms: number
    valiation: number
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    rains: Array<{"rains": Array<Rain>, "color": string}>
    bgcolor: string

    constructor(width: number, height: number, id: string, bgcolor: string) {
      this.ms = 16
      this.valiation = 20

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
      this.rains = []
      this.bgcolor = bgcolor
    }
    makeRains(n: number, size: number, color: string): void {
      let rains = []
      const velocity = size / 8
      for (let i = 0; i < n; i += 1) {
        const x = Math.random() * this.width
        const y = Math.random() * this.height
        let xValiations = []
        for (let j = 0; j < this.valiation; j += 1) {
          xValiations.push(Math.random() * this.width)
        }
        rains.push(new Rain(x, y, size, velocity, xValiations))
      }
      this.rains.push({"rains": rains, "color": color})
    }
    moveRain(rains: Array<Rain>): void {
      for (let rain of rains) {
        rain.move(0, rain.velocity)
        if (rain.yTop >= this.height) {
          rain.moveAbs(rain.xValiations[rain.counter], 0)
          rain.count(this.valiation)
        }
      }
    }
    drawRains(rains: Array<Rain>, color: string): void {
      this.ctx.fillStyle = color
      for (let rain of rains) {
        this.ctx.beginPath()
        for (let i = 10; i >= 0; i -= 1) {
          const ratio = rain.size * i / 10
          this.ctx.arc(rain.x, rain.yTop + ratio, ratio / 2, 0, Math.PI * 2, true)
        }
        this.ctx.fill()
      }
    }
    draw(): void {
      this.ctx.fillStyle = this.bgcolor
      this.ctx.fillRect(0, 0, this.width, this.height)

      for (let rains of this.rains) {
        this.drawRains(rains["rains"], rains["color"])
      }
    }
    loop(): void {
      this.draw()
      for (let rains of this.rains) {
        this.moveRain(rains["rains"])
      }
    }
  }

  let simulator: Simulator
  let timer: number

  function run(): void {
    simulator.loop()
  }

  export function init(width: number, height: number, ratio: number, id: string) {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null
    if (canvas !== null) {
      canvas.width = width
      canvas.height = height
    } else {
      throw new Error("Something wrong")
    }
    simulator = new Simulator(width, height, id, "rgb(13, 0, 21")
    simulator.makeRains(40, 12 * ratio, "rgb(15, 35, 80")
    simulator.makeRains(30, 18 * ratio, "rgb(25, 68, 142")
    simulator.makeRains(20, 24 * ratio, "rgb(0, 123, 187")
    simulator.makeRains(10, 30 * ratio, "rgb(0, 149, 217")
    timer = setInterval(run, simulator.ms)
  }

  export function stopTimer(): void {
    if (timer) {
      clearInterval(timer)
    }
  }
}