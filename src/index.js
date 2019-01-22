import React from 'react'
import ReactDOM from 'react-dom'
import './snake.css'

const GridItem = () => {
  return <div className="segment" />
}

const Food = () => {
  return <div className="segment food" />
}

const Snake = () => {
  return <div className="segment snake" />
}

const Wall = () => {
  return <div className="segment wall" />
}

const initialGameState = function(startPoint, snakeWidth, velocity) {
  return {
    snakeDivs: [startPoint],
    foodPosition: this.createSegment(),
    moveDirection: {
      direction: 'Horizontal',
      increment: 1
    },
    currentSnakeWidth: snakeWidth,
    gameOver: false,
    velocity: velocity
  }
}

class PlayArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialGameState.call(this, 250, 20, 200)
    this.gridSize = 20
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.updateSnake = this.updateSnake.bind(this)
    this.tick = this.tick.bind(this)
    this.startGame = this.startGame.bind(this)
    this.createFood = this.createFood.bind(this)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  startGame = () => {
    if (this.state.gameOver) {
      this.setState(initialGameState.call(this, 250, 20, 200))
    }
    this.tick()
  }
  endGame = () => {
    this.setState({
      gameOver: true
    })
    clearInterval(this.timer)
  }

  tick = () => {
    this.timer = setInterval(() => {
      if (this.state.foodPosition === this.state.snakeDivs[0]) {
        this.updateSnake()
      } else if (
        this.state.snakeDivs.slice(1).indexOf(this.state.snakeDivs[0]) !== -1
      ) {
        this.endGame()
      } else if (
        this.state.snakeDivs[0] < 0 ||
        this.state.snakeDivs[0] >= 400 ||
        this.state.snakeDivs[0] % 20 === 0 ||
        this.state.snakeDivs[0] % 20 === 19
      ) {
        this.endGame()
      } else {
        this.setState(prevState => ({
          snakeDivs: prevState.snakeDivs.map((position, idx) => {
            if (idx === 0) {
              return position + this.state.moveDirection.increment
            } else {
              return prevState.snakeDivs[idx - 1]
            }
          })
        }))
      }
    }, this.state.velocity)
  }

  handleKeyPress = e => {
    let move = this.state.moveDirection
    switch (e.keyCode) {
      case 39:
        if (move.direction !== 'Horizontal') {
          move.increment = 1
          move.direction = 'Horizontal'
          break
        } else {
          break
        }
      case 37:
        if (move.direction !== 'Horizontal') {
          move.increment = -1
          move.direction = 'Horizontal'
          break
        } else {
          break
        }
      case 38:
        if (move.direction !== 'Vertical') {
          move.increment = -20
          move.direction = 'Vertical'
          break
        } else {
          break
        }

      case 40:
        if (move.direction !== 'Vertical') {
          move.increment = +20
          move.direction = 'Vertical'
          break
        } else {
          break
        }

      default:
        break
    }
    if (this.state.snakeDivs[0] === this.state.foodPosition) {
      this.updateSnake()
    } else {
      this.setState({
        moveDirection: {
          direction: move.direction,
          increment: move.increment
        }
      })
    }
  }

  updateSnake = () => {
    this.setState(prevState => ({
      snakeDivs: prevState.snakeDivs.concat([prevState.snakeDivs[0] + 1]),
      foodPosition: this.createFood()
    }))
  }

  createSegment = () => {
    const min = 20
    const max = 400
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  createFood = () => {
    let foodPosition = this.createSegment()
    //food should not be created on snake body or on the walls
    while (
      this.state.snakeDivs.indexOf(foodPosition) !== -1 ||
      foodPosition % 20 === 0 ||
      foodPosition % 20 === 19
    ) {
      foodPosition = this.createSegment()
    }
    return foodPosition
  }

  render() {
    const grid = []
    for (let i = 0; i < this.gridSize * this.gridSize; i++) {
      if (this.state.snakeDivs.indexOf(i) !== -1) {
        grid.push(<Snake key={i} />)
      } else if (i === this.state.foodPosition) {
        grid.push(<Food key={i} />)
      } else if (i % 20 === 19 || i % 20 === 0) {
        grid.push(<Wall key={i} />)
      } else {
        grid.push(<GridItem key={i} />)
      }
    }
    return (
      <div onKeyDown={this.handleKeyPress} tabIndex="0">
        <div className="player info">
          <h2>score: {this.state.snakeDivs.length - 1}</h2>
        </div>
        <div className="player controls">
          <button onClick={this.startGame}>Start</button>
          <button onClick={this.endGame}>End Game</button>
        </div>
        <div className="play-area">
          {!this.state.gameOver
            ? grid
            : `Game over! your score is ${this.state.snakeDivs.length - 1}`}
        </div>
      </div>
    )
  }
}

ReactDOM.render(<PlayArea />, document.querySelector('#root'))
