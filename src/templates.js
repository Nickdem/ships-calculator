const $ships = document.querySelector('.ships')
const $selected = document.querySelector('.calculatored__ships')
const $helper = document.querySelector('.helper')
const $sum = document.getElementById('sum')

export function giveMeSum(sum) {
  $sum.innerText = sum
}

export function helper(text) {
  $helper.innerText = ''
  $helper.insertAdjacentHTML('beforeend', text)
  $helper.style.display = "block"
  setTimeout(() => $helper.style.display = "none", 3000)
}

function templateForShips(item) {
  return `
    <div class="ship" data-name=${item.title.replace(/[\s.]/g, '')} data-level = ${item.level}>
        <div class="info">${item.nation} / ${item.type}</div>
        <div class="name">${item.level} ${item.title}</div>
        <div class="wrapper"></div>
    </div>
  `
}

export function templateSelect(arr, el) {
  const $select = document.querySelector(`#${el}`)
  $select.insertAdjacentHTML('beforeend', arr.map(n => `<option class="filter__option" value=${n}>${n}</option>`).join(''))
}

export function renderShips(arr) {
  $ships.insertAdjacentHTML('beforeend',
    arr.map((ship) => {
      return templateForShips(ship)
    }).join(''))
}

export function renderSelectedStarships(arr, x, y) {
  arr.style.position = 'absolute'
  arr.style.left = x.toString() + 'px'
  arr.style.top = y.toString() + 'px'
  $selected.appendChild(arr)
  arr.style.left = $selected.getBoundingClientRect().x + 'px'
  arr.style.top = $selected.getBoundingClientRect().bottom + 'px'

  setTimeout(() => {
    arr.style.transition = 'unset'
    arr.style.left = 0
    arr.style.top = 0
    arr.style.position = 'relative'
  }, 500)
}

