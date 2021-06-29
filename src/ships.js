import { Calculator } from './calculator'
import { helper, renderSelectedStarships, renderShips, templateSelect } from './templates'

const calc = new Calculator()

export class CalculatedShips {
  constructor() {
    this.ships = []
    this.$selectedShip = null
    this.$selectedShips = null
  }

  levelsOfShips() {
    return this.ships.map(ship => ship.dataset.level)
  }

  listersForShips() {
    this.$selectedShips = document.querySelectorAll('.calculatored .ship')
    for (let curShip of this.$selectedShips) {
      curShip.addEventListener("click", (e) => {
        this.ships = this.ships.filter((item) => item.dataset.name != e.target.parentNode.dataset.name)
        calc.sumOfLevels(this.levelsOfShips())
        this.$selectedShip = document.querySelector(`div[data-name=${e.target.parentNode.dataset.name}]`)
        this.$selectedShip.classList.remove('select')
        e.target.parentNode.remove()
      })
    }
  }

  render(x, y) {
    if (calc.checkLimitForShips(this.ships.length)) {
      console.log('максимум 7 корабликов')
      return
    }
    this.ships.push(this.$selectedShip)
    if (calc.checkLimitLevel(this.levelsOfShips())) {
      console.log('максимум 42 уровня')
      return
    }
    renderSelectedStarships(this.$selectedShip, x, y)
    this.listersForShips()
  }
}

const calculatedShips = new CalculatedShips()

export class Warships {
  constructor(url) {
    this.url = url
    this.ships = []
    this.$input = document.querySelector('.filter__input')
    this.selects = {}
    this.$allSelects = document.querySelectorAll('.filter__select')
    this.filters = {
      nation: 'all-nations',
      type: 'all-types',
      level: 'all-levels'
    }
    this.toggle = false
  }

  async fetchWSH() {
    try {
      const res = await fetch(this.url)
      const json = await res.json()
      this.ships = await json
      this.render()
    } catch (e) { console.log(e) }
  }

  giveMeSelects() {
    this.selects.nation = [...new Set(this.ships.map(s => s.nation))]
    this.selects.type = [...new Set(this.ships.map(s => s.type))]
    this.selects.level = [...new Set(this.ships.map(s => s.level))].sort((a, b) => a - b)
    let keys = Object.keys(this.selects)
    for (let key of keys) {
      templateSelect(this.selects[key], key)
    }
  }

  selectListeners() {
    for (let curSelect of this.$allSelects) {
      curSelect.addEventListener('change', (e) => {
        const $allShips = document.querySelectorAll('.ships .ship')
        this.filters[e.target.id] = e.target.value
        this.$input.value = ''
        this.search('')
        this.toggle = true
        for (let element of $allShips) {
          this.checkFilters(element)
        }
      });
    }
  }

  clickHandler(e) {
    e.preventDefault()
    if (this.className === 'ship select') {
      helper('Корабль уже выбран')
      return
    }
    if (calc.checkLimitForShips(calculatedShips.ships.length)) {
      helper(`Достигнут лимит количества кораблей (максимум ${calc.limit})`)
      return
    }
    if (calc.checkLimitLevel(calculatedShips.levelsOfShips()) || calc.sum + (+this.dataset.level) > calc.maxLvl) {
      helper(`Достигнут лимит уровней (максимум ${calc.maxLvl})`)
      return
    }

    const clone = this.cloneNode(true)
    const { x } = this.getBoundingClientRect()
    calculatedShips.$selectedShip = clone
    calculatedShips.render(x, e.pageY)

    this.className = this.className + ' select'
  }

  search(title) {
    const shipsOnTable = this.toggle ? document.querySelectorAll('.ships .ship:not(.none)') : document.querySelectorAll('.ships .ship')
    for (let curShip of shipsOnTable) {
      if (!curShip.dataset.name.toLowerCase().includes(title.toLowerCase())) {
        curShip.classList.add('none')
      } else {
        curShip.classList.remove('none')
      }
    }
  }

  checkFilters(tableElement) {
    if (
      (this.filters.nation == 'all-nations') && (this.filters.type == 'all-types') && (this.filters.level == 'all-levels')) {
      tableElement.classList.remove('none')
      this.toggle = false
      return
    } else {
      if ((this.filters.level != 'all-levels') && (!(+tableElement.dataset.level == +this.filters.level))) {
        tableElement.classList.add('none')
        return
      } else if ((this.filters.nation != 'all-nations') && (!(tableElement.innerText.includes(this.filters.nation)))) {
        tableElement.classList.add('none')
        return
      } else if ((this.filters.type != 'all-types') && (!(tableElement.innerText.includes(this.filters.type)))) {
        tableElement.classList.add('none')
        return
      } else {
        tableElement.classList.remove('none')
      }
    }
  }

  render() {
    renderShips(this.ships)
    this.giveMeSelects()

    const allShips = document.querySelectorAll('.ship')
    for (let curShip of allShips) {
      curShip.addEventListener("click", this.clickHandler);
    }
  }

  init() {
    this.fetchWSH()

    this.$input.addEventListener('input', (e) => {
      this.search(e.target.value)
    })

    this.selectListeners()
  }
}
