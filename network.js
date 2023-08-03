class NeuralNetwork {
  constructor(neuroCounts) {
    this.levels = []
    for (let i = 0; i < neuroCounts.length - 1; i++) {
      this.levels.push(new Level(neuroCounts[i], neuroCounts[i + 1]))
    }
  }

  static feedForward(givenInputs, network) {
    let outputs = Level.feedForward(givenInputs, network.levels[0])
    for (let i = 1; i < network.levels.length; i++) {
      outputs = Level.feedForward(outputs, network.levels[i])
    }
    return outputs
  }
}

class Level {
  constructor(inputCount, outputCount) {
    // values given by the cars sensors
    this.inputs = new Array(inputCount)
    // values how to use the cars controls
    this.outputs = new Array(outputCount)
    // a value above a output will fire
    this.biases = Array(outputCount)

    // each input has a weight for each output
    this.weights = []

    // prepare weights for each input
    for (let i = 0; i < inputCount; i++) {
      this.weights[i] = new Array(outputCount)
    }

    Level.#randomize(this)
  }

  // static so that we can serialize this
  static #randomize(level) {
    // random weights (between -1 and 1) for each inputs
    // outputs. each input has a weight for each output.
    for (let i = 0; i < level.inputs.length; i++) {
      for (let j = 0; j < level.outputs.length; j++) {
        level.weights[i][j] = Math.random() * 2 - 1
      }
    }

    // random biases (between -1 and 1) for each output
    for (let i = 0; i < level.biases.length; i++) {
      level.biases[i] = Math.random() * 2 - 1
    }
  }

  static feedForward(givenInputs, level) {
    for (let i = 0; i < level.inputs.length; i++) {
      level.inputs[i] = givenInputs[i]
    }

    for (let i = 0; i < level.outputs.length; i++) {
      let sumFromInputs = 0

      for (let j = 0; j < level.inputs.length; j++) {
        sumFromInputs += level.inputs[j] * level.weights[j][i]
      }

      if (sumFromInputs > level.biases[i]) {
        level.outputs[i] = 1
      } else {
        level.outputs[i] = 0
      }
    }

    return level.outputs
  }
}
