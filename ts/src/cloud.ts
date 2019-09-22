namespace Cloud {
  let timer: number
  let simulator: Simulator

  function isCollided(x1: number, y1: number, size1: number, x2: number, y2: number, size2: number): boolean {
    const distance = Math.sqrt((x1 - x2) * (x1 - x2) + (y1 - y2) * (y1 - y2))
    if (distance <= (size1 + size2) / 2) {
      return true
    } else {
      return false
    }
  }
  function getAverage(array: Array<number>): number {
    return array.reduce((accumulator, currentValue) => accumulator + currentValue) / array.length
  }

  class Particle {
    x: number
    y: number
    size: number

    constructor(x: number, y: number, size: number) {
      this.x = x
      this.y = y
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

  class Cloud {
    particles: Array<Particle>
    vx: number
    vy: number
    colorTop: string
    colorBottom: string

    constructor(particles: Array<Particle>, vx: number, vy: number, colorTop: string, colorBottom: string) {
      this.particles = particles
      this.vx = vx
      this.vy = vy
      this.colorTop = colorTop
      this.colorBottom = colorBottom
    }
  }

  class Simulator {
    ms: number
    width: number
    height: number
    ctx: CanvasRenderingContext2D
    bgcolor: string
    clouds: Array<Cloud>

    constructor(width: number, height: number, id: string, bgcolor: string) {
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

      this.bgcolor = bgcolor
      this.clouds = []
    }
    isCollided(particle1: Particle, particle2: Particle): boolean {
      return isCollided(
        particle1.x, particle1.y, particle1.size,
        particle2.x, particle2.y, particle2.size
      )
    }
    getCounters(particles: Array<Particle>): Array<number> {
      let counters: Array<number> = []
      for (let i = 0; i < particles.length; i += 1) {
        let counter = 0
        for (let j = 0; j < particles.length; j+= 1) {
          if (this.isCollided(particles[i], particles[j])) {
            counter += 1
          }
        }
        counters.push(counter)
      }
      return counters
    }
    changeSize(particles: Array<Particle>): void {
      const counters = this.getCounters(particles)
      const counterAverage = getAverage(counters)
      for (let i = 0; i < particles.length; i += 1) {
        particles[i].size = particles[i].size * counters[i] / counterAverage
      }
    }
    makeCloud(n: number, size: number, colorTop: string, colorBottom: string): void {
      if (n <= 0) {
        return
      }

      let particles = []
      const x = Math.random() * this.width
      const y = Math.random() * this.height
      const v = size / 64
      particles.push(new Particle(x, y, size))

      // 雲のまとまり感を出すために、作成済みのParticleの近くに新しいParticleを作成する
      for (let i = 1; i < n; i += 1) {
        const choice: Particle = particles[Math.floor(Math.random() * particles.length)]
        const x = choice.x + Math.random() * 2 * size - size
        const y = choice.y + (Math.random() * 2 * size - size) / 2
        particles.push(new Particle(x, y, size))
      }

      // 雲の端部の不自然さの解消と、雲のボリューム感を出すために、
      // Particle同士の重なり具合によって、各Particleのsizeを調整する。
      this.changeSize(particles)

      this.clouds.push(new Cloud(particles, v, 0, colorTop, colorBottom))
    }
    moveCloud(cloud: Cloud): void {
      for (let particle of cloud.particles) {
        particle.move(cloud.vx, cloud.vy)

        if (particle.x >= this.width) {
          particle.moveAbs(particle.x % this.width, particle.y)
        }
        if (particle.y >= this.height) {
          particle.moveAbs(particle.x, particle.y % this.height)
        }
      }
    }
    drawCloud(cloud: Cloud): void {
      for (let particle of cloud.particles) {
        const grad = this.ctx.createLinearGradient(
          particle.x, particle.y - particle.size / 2,
          particle.x, particle.y + particle.size / 2
        )
        grad.addColorStop(0, cloud.colorTop)
        grad.addColorStop(1, cloud.colorBottom)
        this.ctx.fillStyle = grad

        this.ctx.beginPath()
        this.ctx.arc(
          particle.x, particle.y, particle.size / 2,
          0, Math.PI * 2, true
        )
        this.ctx.fill()
      }
    }
    draw(): void {
      this.ctx.fillStyle = this.bgcolor
      this.ctx.fillRect(0, 0, this.width, this.height)

      for (let cloud of this.clouds) {
        this.drawCloud(cloud)
      }
    }
    loop(): void {
      this.draw()
      for (let cloud of this.clouds) {
        this.moveCloud(cloud)
      }
    }
  }

  function run(): void {
    simulator.loop()
  }

  export function init(
    width: number, height: number,
    ratio: number = 1, layer: number = 4, n: number = 20, id: string
  ): void {
    const canvas = document.getElementById(id) as HTMLCanvasElement | null
    if (canvas !== null) {
      canvas.width = width
      canvas.height = height
    } else {
      throw new Error("Did not get Canvas element. Maybe, " + id + " is not Canvas element id.")
    }

    const bgcolor = "rgba(44, 169, 225, 1.0"
    const colorTop = "rgba(247, 252, 254, 0.1"
    const colorBottom = "rgba(133, 185, 203, 0.1"
    simulator = new Simulator(width, height, id, bgcolor)

    for (let i = 0; i < layer; i += 1) {
      const quantity = (i + 1) * n
      const size = (36 - (layer - i) * 6) * ratio
      for (let j = 0; j < layer - i; j += 1) {
        simulator.makeCloud(quantity, size, colorTop, colorBottom)
      }
    }
    timer = setInterval(run, simulator.ms)
  }

  export function stopTimer(): void {
    if (timer) {
      clearInterval(timer)
    }
  }
}