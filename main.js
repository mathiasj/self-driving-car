const carCanvas = document.getElementById('carCanvas')
carCanvas.width = 200

const networkCanvas = document.getElementById('networkCanvas')
networkCanvas.width = 300

const carCtx = carCanvas.getContext('2d')
const networkCtx = networkCanvas.getContext('2d')

const road = new Road(carCanvas.width / 2, carCanvas.width * 0.9)

const N = 500
const cars = generateCars(N)
let bestCar = cars[0]

if (localStorage.getItem('bestBrain')) {
  for (let i = 0; i < cars.length; i++) {
    cars[i].brain = JSON.parse(localStorage.getItem('bestBrain'))
    if (i != 0) {
      NeuralNetwork.mutate(cars[i].brain, 0.1)
    } else {
      // show the best car from last run in green
      cars[0].color = 'green'
    }
  }
}

let traffic = []

animate()

function save() {
  localStorage.setItem('bestBrain', JSON.stringify(bestCar.brain))
}

function discard() {
  localStorage.removeItem('bestBrain')
}

function generateCars(N) {
  const cars = []
  for (let i = 0; i < N; i++) {
    cars.push(new Car(road.getLaneCenter(1), 100, 30, 50, 'AI'))
  }
  return cars
}

function animate(time) {
  bestCar = cars.find((c) => c.y == Math.min(...cars.map((c) => c.y)))

  // remove traffic out of scope
  for (let i = traffic.length - 1; i >= 0; i--) {
    if (traffic[i].y - window.innerHeight * 2 > bestCar.y) {
      traffic.splice(i, 1)
    }
  }

  // insert traffic above the window screen
  if (Math.random() < 0.015) {
    const placeAtY = bestCar.y - window.innerHeight - Math.random() * 100
    const tooClose = traffic.find(
      (t) => t.y > placeAtY - t.height * 2 && t.y < placeAtY + t.height * 2
    )
    if (!tooClose) {
      traffic.push(
        new Car(
          road.getLaneCenter(Math.round(Math.random() * (road.laneCount - 1))),
          placeAtY,
          30,
          50,
          'DUMMY',
          2,
          getRandomColor()
        )
      )
    }
  }

  // kill off cars stuck behind traffic
  for (let i = cars.length - 1; i >= 0; i--) {
    if (cars[i].y - window.innerHeight * 2 > bestCar.y) {
      cars.splice(i, 1)
    }
  }

  for (let i = 0; i < traffic.length; i++) {
    traffic[i].update(road.borders, [])
  }
  for (let i = 0; i < cars.length; i++) {
    cars[i].update(road.borders, traffic)
  }

  carCanvas.height = window.innerHeight
  networkCanvas.height = window.innerHeight

  carCtx.save()
  carCtx.translate(0, -bestCar.y + carCanvas.height * 0.7)

  road.draw(carCtx)
  for (let i = 0; i < traffic.length; i++) {
    traffic[i].draw(carCtx, 'red')
  }

  carCtx.globalAlpha = 0.2
  for (let i = 0; i < cars.length; i++) {
    cars[i].draw(carCtx, 'blue')
  }
  carCtx.globalAlpha = 1
  bestCar.draw(carCtx, 'blue', true)

  carCtx.restore()

  networkCtx.lineDashOffset = -time / 50
  Visualizer.drawNetwork(networkCtx, bestCar.brain)
  requestAnimationFrame(animate)
}
