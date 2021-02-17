import example from './images/example.png'
import examplesvg from './images/example.svg'
import './styles/main.scss'

console.log('Interesting!')

class Game {
  name = 'Violin Charades'
}
const myGame = new Game()
const p = document.createElement('p')
p.textContent = `I like ${myGame.name}.`

const heading = document.createElement('h1')
heading.textContent = 'Super Interesting!'

const app = document.querySelector('#root')
app.append(heading)
