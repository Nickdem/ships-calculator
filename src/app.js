import { Warships } from './ships'
import './style.css'

const url = 'https://nickdem.github.io/warships/'

const warships = new Warships(url)
warships.init()