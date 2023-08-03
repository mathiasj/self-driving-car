class Car {
  constructor(x, y, width, height) {
    this.x = x
    this.y = y
    this.width = width
    this.height = height

    this.speed = 0
    this.acceleration = 0.2
    this.maxSpeed = 3
    this.friction = 0.05
    this.angle = 0
    this.damaged = false

    this.sensor = new Sensor(this)
    this.controls = new Controls()
  }

  update(roadBoarders) {
    if (!this.damaged) {
      this.#move()
      this.poligon = this.#createPolygon()
      this.damaged = this.#assessDamage(roadBoarders)
    }
    this.sensor.update(roadBoarders)
  }

  #assessDamage(roadBoarders) {
    for (let i = 0; i < roadBoarders.length; i++) {
      if (polysIntersect(this.#createPolygon, roadBoarders[i])) {
        return true
      }
    }
    return false
  }

  #createPolygon() {
    const points = []
    const rad = Math.hypot(this.width, this.height) / 2
    const alpha = Math.atan2(this.width, this.height)
    points.push({
      // top right
      x: this.x - Math.sin(this.angle - alpha) * rad,
      y: this.y - Math.cos(this.angle - alpha) * rad,
    })
    points.push({
      // top left
      x: this.x - Math.sin(this.angle + alpha) * rad,
      y: this.y - Math.cos(this.angle + alpha) * rad,
    })
    points.push({
      // Bottom right
      x: this.x - Math.sin(Math.pi + this.angle - alpha) * rad,
      y: this.y - Math.cos(Math.pi + this.angle - alpha) * rad,
    })
    points.push({
      // Bottom left
      x: this.x - Math.sin(Math.pi + this.angle + alpha) * rad,
      y: this.y - Math.cos(Math.pi + this.angle + alpha) * rad,
    })

    return points
  }

  #move() {
    if (this.controls.forward) {
      this.speed += this.acceleration
    }
    if (this.controls.reverse) {
      this.speed -= this.acceleration
    }

    if (this.speed > this.maxSpeed) {
      this.speed = this.maxSpeed
    }
    if (this.speed < -this.maxSpeed / 2) {
      this.speed = -this.maxSpeed / 2
    }

    if (this.speed > 0) {
      this.speed -= this.friction
    }
    if (this.speed < 0) {
      this.speed += this.friction
    }
    if (Math.abs(this.speed) < this.friction) {
      this.speed = 0
    }

    if (this.speed != 0) {
      const flip = this.speed > 0 ? 1 : -1
      if (this.controls.left) {
        this.angle += 0.03 * flip
      }
      if (this.controls.right) {
        this.angle -= 0.03 * flip
      }
    }

    this.x -= Math.sin(this.angle) * this.speed
    this.y -= Math.cos(this.angle) * this.speed
  }

  draw(ctx) {
    ctx.fillStyle = 'black'
    if (this.damaged) {
      ctx.fillStyle = 'gray'
    }
    ctx.beginPath()
    ctx.moveTo(this.poligon[0].x, this.poligon[0].y)
    for (let i = 1; i < this.poligon.length; i++) {
      ctx.lineTo(this.poligon[i].x, this.poligon[i].y)
    }
    ctx.fill()
    this.sensor.draw(ctx)
  }
}
