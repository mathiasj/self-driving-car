class Sensor {
  constructor(car) {
    this.car = car
    this.rayCount = 4
    this.rayLength = 150
    this.raySpread = Math.PI / 2 // radian equivalent of 90 degrees.

    this.rays = []
    this.readings = []
  }

  update(roadBoarders) {
    this.#castRays()
    this.readings = []
    for (let i = 0; i < this.rays.length; i++) {
      this.readings.push(this.#getReading(this.rays[i], roadBoarders))
    }
  }

  #getReading(ray, roadBoarders) {
    let touches = []

    for (let i = 0; i < roadBoarders.length; i++) {
      const touch = getIntersection(
        ray[0], // start of ray
        ray[1], // end of ray
        roadBoarders[i][0], // start of border
        roadBoarders[i][1]
      )
      if (touch) {
        touches.push(touch)
      }
    }

    if (touches.length == 0) {
      return null
    }

    const offests = touches.map((e) => e.offset)
    const minOffset = Math.min(...offests)
    return touches.find((e) => e.offset == minOffset)
  }

  #castRays() {
    this.rays = []
    for (let i = 0; i < this.rayCount; i++) {
      const rayAngle =
        lerp(
          this.raySpread / 2,
          -this.raySpread / 2,
          this.rayCount == 1 ? 0.5 : i / (this.rayCount - 1)
        ) + this.car.angle

      const start = { x: this.car.x, y: this.car.y }
      const end = {
        x: this.car.x - Math.sin(rayAngle) * this.rayLength,
        y: this.car.y - Math.cos(rayAngle) * this.rayLength,
      }

      this.rays.push([start, end])
    }
  }

  draw(ctx) {
    for (let i = 0; i < this.rayCount; i++) {
      let end = this.rays[i][1]
      if (this.readings[i]) {
        end = this.readings[i]
      }

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'yellow'
      ctx.moveTo(this.rays[i][0].x, this.rays[i][0].y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()

      ctx.beginPath()
      ctx.lineWidth = 2
      ctx.strokeStyle = 'black'
      ctx.moveTo(this.rays[i][1].x, this.rays[i][1].y)
      ctx.lineTo(end.x, end.y)
      ctx.stroke()
    }
  }
}
