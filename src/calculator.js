import { giveMeSum } from './templates'

export class Calculator {
  constructor() {
    this.maxLvl = 42
    this.limit = 7
    this.sum = 0
  }

  checkLimitForShips(length) {
    return length >= this.limit
  }

  sumOfLevels(levels) {
    this.sum = 0
    levels.map(level => this.sum += (+level))
    giveMeSum(this.sum)
  }

  checkLimitLevel(levels) {
    return this.sumOfLevels(levels) > this.maxLvl
  }
}