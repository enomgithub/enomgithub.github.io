const WIDTH = 960
const CANVAS_ID = "weather"
const SNOW_ID = "snow"
const RAIN_ID = "rain"
const CLOUD_ID = "cloud"
const LAYER = 3
const N = 50

let width: number = document.body.clientWidth
let height: number = Math.floor(width / 6)
let ratio: number = width / WIDTH
const n = Math.floor(Math.random() * 3)

function getCanvasSize(): void {
  width = document.body.clientWidth
  height = Math.floor(width / 6)
  ratio = width / WIDTH
}

function getHTMLInputElementById(id: string): HTMLInputElement {
  const _element = document.getElementById(id) as HTMLInputElement | null
  if (_element === null) {
    throw new Error("Did not get the HTMLInputElement. " + id + " is not a HTMLInputElement id.")
  } else {
    return _element
  }
}

const snow_element = getHTMLInputElementById(SNOW_ID)
const rain_element = getHTMLInputElementById(RAIN_ID)
const cloud_element = getHTMLInputElementById(CLOUD_ID)

snow_element.addEventListener("change", function() {
  if (snow_element.checked) {
    Cloud.stopTimer()
    Rain.stopTimer()
    Snow.init(width, height, ratio, CANVAS_ID)
  }
}, false)

rain_element.addEventListener("change", function() {
  if (rain_element.checked) {
    Cloud.stopTimer()
    Snow.stopTimer()
    Rain.init(width, height, ratio, CANVAS_ID)
  }
}, false)

cloud_element.addEventListener("change", function() {
  if (cloud_element.checked) {
    Snow.stopTimer()
    Rain.stopTimer()
    Cloud.init(width, height, ratio, LAYER, N, CANVAS_ID)
  }
}, false)

window.addEventListener("resize", function() {
  getCanvasSize()
  if (snow_element.checked) {
    Snow.stopTimer()
    Snow.init(width, height, ratio, CANVAS_ID)
  } else if (rain_element.checked) {
    Rain.stopTimer()
    Rain.init(width, height, ratio, CANVAS_ID)
  } else {
    Cloud.stopTimer()
    Cloud.init(width, height, ratio, LAYER, N, CANVAS_ID)
  }
}, false)

if (n === 0) {
  snow_element.checked = true
  Snow.init(width, height, ratio, CANVAS_ID)
} else if (n === 1) {
  rain_element.checked = true
  Rain.init(width, height, ratio, CANVAS_ID)
} else {
  cloud_element.checked = true
  Cloud.init(width, height, ratio, LAYER, N, CANVAS_ID)
}