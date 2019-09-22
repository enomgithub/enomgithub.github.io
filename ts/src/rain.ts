import * as promise from "es6-promise" 

function range(start: number, end: number): Array<number> {
  return ([...Array(end - start)].map((_, i) => (start + i)))
}

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
  async makeRain(size: number, velocity: number): promise.Promise<Rain> {
      const x = Math.random() * this.width
      const y = Math.random() * this.height
      let xValiations: Array<number> = []
      range(0, this.valiation).map((_) =>
        xValiations.push(Math.random() * this.width)
      )
      return new Rain(x, y, size, velocity, xValiations)
  }
  makeRains(n: number, size: number, color: string): void {
    let rains: Array<Rain> = []
    const velocity = size / 8
    range(0, n).map((_) =>
      this.makeRain(size, velocity)
      .then((rain: Rain) => rains.push(rain), () => new Error("Did not make rain."))
    )
    this.rains.push({"rains": rains, "color": color})
  }
  async moveRain(rain: Rain): promise.Promise<string> {
    rain.move(0, rain.velocity)
    if (rain.yTop >= this.height) {
      rain.moveAbs(rain.xValiations[rain.counter], -rain.size / 2)
      rain.count(this.valiation)
    }
    return "Finished moveRain."
  }
  moveRains(rains: Array<Rain>): void {
    rains.map((rain) =>
      this.moveRain(rain)
      .then((message) => message, () => new Error("Did not move rain."))
    )
  }
  async drawRain(rain: Rain): promise.Promise<string> {
    const dx = (rain.size / 2) * Math.cos(Math.PI / 6)
    const dy = (rain.size / 2) * Math.sin(Math.PI / 6)
    this.ctx.beginPath()
    this.ctx.moveTo(rain.x, rain.yTop)
    this.ctx.lineTo(rain.x - dx, rain.yBottom - dy)
    this.ctx.arc(rain.x, rain.yBottom, rain.size / 2, Math.PI * 7 /6, -Math.PI / 6, true)
    this.ctx.moveTo(rain.x + dx, rain.yBottom - dy)
    this.ctx.lineTo(rain.x, rain.yTop)
    this.ctx.fill()

    return "Finished drawRain."
  }
  drawRains(rains: Array<Rain>, color: string): void {
    this.ctx.fillStyle = color
    rains.map((rain) =>
      this.drawRain(rain)
      .then((message: string) => message, () => new Error("Did not draw rain."))
    )
  }
  draw(): void {
    this.ctx.fillStyle = this.bgcolor
    this.ctx.fillRect(0, 0, this.width, this.height)

    this.rains.map((rains) => this.drawRains(rains["rains"], rains["color"]))
  }
  loop(): void {
    this.draw()
    this.rains.map((rains) => this.moveRains(rains["rains"]))
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