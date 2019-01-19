import React from 'react'
import ReactDOM from 'react-dom'
import './snake.css'

const GridItem = () => {
  return <div className="segment" />
}

const Food = () => {
  return <div className="segment food" />
}

const initialGameState = function() {
  return {
    snakeDivs: [this.generateFood()],
    foodPosition: 48,
    moveDirection: {
      direction: 'Horizontal',
      increment: 1
    },
    currentSnakeWidth: 20,
    gameOver: false,
    velocity: 200
  }
}

class PlayArea extends React.Component {
  constructor(props) {
    super(props)
    this.state = initialGameState.call(this)
    this.gridSize = 21
    this.handleKeyPress = this.handleKeyPress.bind(this)
    this.updateSnake = this.updateSnake.bind(this)
    this.tick = this.tick.bind(this)
    this.startGame = this.startGame.bind(this)
  }

  componentWillUnmount() {
    clearInterval(this.timer)
  }

  startGame = () => {
    if (this.state.gameOver) {
      this.setState(initialGameState.call(this))
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
        this.state.snakeDivs[0] % 20 === 19 ||
        this.state.snakeDivs[0] % 20 === 0
      ) {
        this.endGame()
      } else {
        this.setState(prevState => ({
          snakeDivs: prevState.snakeDivs.map((position, idx) => {
            if (idx === 0) {
              return position + this.state.moveDirection.increment
            } else {
              console.log(prevState.snakeDivs[idx - 1])
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
      foodPosition: this.generateFood()
    }))
  }

  generateFood = () => {
    const min = 20
    const max = 380
    return Math.floor(Math.random() * (max - min + 1)) + min
  }

  render() {
    const grid = []
    let snakeStyle = {
      backgroundColor: 'blue',
      width: `${this.state.currentSnakeWidth}px`
    }
    for (let i = 0; i < this.gridSize * this.gridSize - 1; i++) {
      if (this.state.snakeDivs.indexOf(i) !== -1) {
        grid.push(<div className="segment snake" key={i} style={snakeStyle} />)
      } else if (i === this.state.foodPosition) {
        grid.push(<Food key={i} />)
      } else {
        grid.push(<GridItem key={i} />)
      }
    }
    return (
      <div onKeyDown={this.handleKeyPress} tabIndex="0">
        <div className="play-info">
          <h2>score: {this.state.snakeDivs.length - 1}</h2>
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

class Grid extends React.Component {
  constructor(props) {
    super(props)
  }
}

ReactDOM.render(<PlayArea />, document.querySelector('#root'))
