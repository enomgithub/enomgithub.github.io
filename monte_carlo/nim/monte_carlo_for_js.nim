import dom
import HTML5_canvas as cvs
import math
import strutils

import monte_carlo


var count: int = 0


proc draw(canvas: Canvas, point: (float, float)) =
  let
    ctx: CanvasRenderingContext2D = cvs.getContext2D(canvas)
    width: float = canvas.width.toFloat
    height: float = canvas.height.toFloat
    x = point[0] * width
    y = height - point[1] * height
  ctx.fillStyle =
    if isContained(point[0], point[1]): "#eb6101"
    else: "#38a1db"
  ctx.beginPath()
  ctx.arc(x, y, 2.0, 0.0, math.PI * 2.0, true)
  ctx.fill()


proc cls(canvas: Canvas) =
  let
    ctx: CanvasRenderingContext2D = cvs.getContext2D(canvas)
    width: float = canvas.width.toFloat
    height: float = canvas.height.toFloat
  ctx.fillStyle = "#302833"
  ctx.fillRect(0.0, 0.0, width, height)


proc loop(canvas: Canvas, points: seq[(float, float)]) =
  canvas.draw(points[count])
  if count >= points.len - 1:
    count = 0
    canvas.cls()
  else:
    count += 1

proc resize(canvas: Canvas, maxwidth: int, points: seq[(float, float)]) =
  canvas.width = min(maxwidth, window.innerWidth)
  canvas.height = min(maxwidth, window.innerWidth)
  canvas.cls()
  for i in 0..<count:
    canvas.draw(points[i])

proc init() =
  const
    CANVASID: cstring = "monte-carlo"
    PIID: cstring = "pi"
    MAXWIDTH: int = 600
    N: int = 10_000
    MS: int = 1
  let
    width: int = min(MAXWIDTH, window.innerWidth)
    height: int = min(MAXWIDTH, window.innerWidth)
    points: seq[(float, float)] = getPoints(N, 1.0)
    canvas: Canvas = Canvas(document.getElementById(CANVASID))
  canvas.width = width
  canvas.height = height
  document.getElementById(PIID).innerHTML = "Pi = " & $monteCarlo(points)
  canvas.cls()
  let timer: ref TInterval = setInterval(window,
                                         proc() = loop(canvas, points),
                                         MS)
  window.addEventListener("resize",
                          proc(e: Event) = resize(canvas, MAXWIDTH, points),
                          false)


if isMainModule:
  init()
