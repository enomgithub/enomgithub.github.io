import dom
import math
import random

import HTML5_canvas as cvs

var count: int = 0

type
  Point2D = ref Point2DObj
  Point2DObj = object
    x: float
    y: float

type
  Velocity2D = ref Velocity2DObj
  Velocity2DObj = object
    vx: float
    vy: float

type
  Hermite2D = ref Hermite2DObj
  Hermite2DObj = object
    pos1: Point2D
    pos2: Point2D
    v1: Velocity2D
    v2: Velocity2D

proc distance(hermiteCurve: Hermite2D): float =
  return sqrt((hermiteCurve.pos2.x - hermiteCurve.pos1.x) ^ 2 +
              (hermiteCurve.pos2.y - hermiteCurve.pos1.y) ^ 2)

proc getPoint(pos1, pos2: Point2D, v1, v2: Velocity2D, t: float): Point2D =
  let pt = Point2D(
    x:
      (2 * pos1.x - 2 * pos2.x + v1.vx + v2.vx) * t ^ 3 +
      (-3 * pos1.x + 3 * pos2.x - 2 * v1.vx - v2.vx) * t ^ 2 +
      v1.vx * t +
      pos1.x,
    y:
      (2 * pos1.y - 2 * pos2.y + v1.vy + v2.vy) * t ^ 3 +
      (-3 * pos1.y + 3 * pos2.y - 2 * v1.vy - v2.vy) * t ^ 2 +
      v1.vy * t +
      pos1.y
  )
  return pt

proc getPoints(hermiteCurve: Hermite2D): seq[Point2D] =
  const DR: float = 0.01
  var points: seq[Point2D]
  let divide: int = (hermiteCurve.distance() / DR).toInt
  for index in 0..divide:
    let
      t: float = index.toFloat / divide.toFloat
      pt: Point2D =
        getPoint(
          hermiteCurve.pos1,
          hermiteCurve.pos2,
          hermiteCurve.v1,
          hermiteCurve.v2,
          t
        )
    points.safeAdd(pt)
  return points

proc move(pos: var Point2D, x, y: float) =
  pos.x = x
  pos.y = y

proc change(v: var Velocity2D, vx, vy: float) =
  v.vx = vx
  v.vy = vy

proc change(v: var Velocity2D, vNew: Velocity2D) =
  v.vx = vNew.vx
  v.vy = vNew.vy

proc init(hermiteCurve: var Hermite2D,
          x1, y1, x2, y2, vx1, vy1, vx2, vy2: float) =
  hermiteCurve.new
  hermiteCurve.pos1.new
  hermiteCurve.pos2.new
  hermiteCurve.v1.new
  hermiteCurve.v2.new
  hermiteCurve.pos1.move(x1, y1)
  hermiteCurve.pos2.move(x2, y2)
  hermiteCurve.v1.change(vx1, vy1)
  hermiteCurve.v2.change(vx2, vy2)

proc draw(canvas: Canvas, ctx: CanvasRenderingContext2D,
          points: seq[Point2D], lineWidth: float, color: cstring) =
  let
    width: float = canvas.width.toFloat
    height: float = canvas.height.toFloat
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth

  ctx.beginPath()
  ctx.moveTo(points[0].x * width, points[0].y * height)
  for point in points:
    ctx.lineTo(point.x * width, point.y * height)
  ctx.stroke()

proc cls(canvas: Canvas,
         ctx: CanvasRenderingContext2D,
         color: cstring) =
  ctx.fillStyle = color
  ctx.fillRect(0.0, 0.0, canvas.width.toFloat, canvas.height.toFloat)

proc loop(canvas: Canvas,
          ctx: CanvasRenderingContext2D,
          hermiteCurves: var seq[Hermite2D]) =
  const
    BGCOLOR: cstring = "#302833"
    LINECOLOR: cstring = "#FBFAF5"
    LINEWIDTH: float = 1.0
    R: float = 2.0
    VELOCITY: array[18, Velocity2D] = [
      Velocity2D(vx: R * cos(0.0), vy: R * sin(0.0)),
      Velocity2D(vx: R * cos(degToRad(20.0)), vy: R * sin(degToRad(20.0))),
      Velocity2D(vx: R * cos(degToRad(40.0)), vy: R * sin(degToRad(40.0))),
      Velocity2D(vx: R * cos(degToRad(60.0)), vy: R * sin(degToRad(60.0))),
      Velocity2D(vx: R * cos(degToRad(80.0)), vy: R * sin(degToRad(80.0))),
      Velocity2D(vx: R * cos(degToRad(100.0)), vy: R * sin(degToRad(100.0))),
      Velocity2D(vx: R * cos(degToRad(120.0)), vy: R * sin(degToRad(120.0))),
      Velocity2D(vx: R * cos(degToRad(140.0)), vy: R * sin(degToRad(140.0))),
      Velocity2D(vx: R * cos(degToRad(160.0)), vy: R * sin(degToRad(160.0))),
      Velocity2D(vx: R * cos(degToRad(180.0)), vy: R * sin(degToRad(180.0))),
      Velocity2D(vx: R * cos(degToRad(200.0)), vy: R * sin(degToRad(200.0))),
      Velocity2D(vx: R * cos(degToRad(220.0)), vy: R * sin(degToRad(220.0))),
      Velocity2D(vx: R * cos(degToRad(240.0)), vy: R * sin(degToRad(240.0))),
      Velocity2D(vx: R * cos(degToRad(260.0)), vy: R * sin(degToRad(260.0))),
      Velocity2D(vx: R * cos(degToRad(280.0)), vy: R * sin(degToRad(280.0))),
      Velocity2D(vx: R * cos(degToRad(300.0)), vy: R * sin(degToRad(300.0))),
      Velocity2D(vx: R * cos(degToRad(320.0)), vy: R * sin(degToRad(320.0))),
      Velocity2D(vx: R * cos(degToRad(340.0)), vy: R * sin(degToRad(340.0)))
    ]
  if count >= 18:
    count = 0
  canvas.cls(ctx, BGCOLOR)
  for index, hermiteCurve in hermiteCurves:
    hermiteCurve.v1.change(VELOCITY[(count + index) mod 18])
    hermiteCurve.v2.change(VELOCITY[(count + index + 2) mod 18])
    let
      points: seq[Point2D] = hermiteCurve.getPoints()
    canvas.draw(ctx, points, LINEWIDTH, LINECOLOR)
  count += 1

proc resize(canvas: Canvas, maxwidth: int) =
  canvas.width = min(maxwidth, window.innerWidth)
  canvas.height = min(maxwidth, window.innerWidth)

proc main() =
  const
    MAXWIDTH: int = 600
    CANVASID: cstring = "hermite"
    BGCOLOR: cstring = "#302833"
    R: float = 0.25
    OFFSET: float = 0.5
    N: int = 30
    DEG: float = 360.0 / N.toFloat
    MS: int = 16
  document.getElementById("lines").innerHTML = "N = " & $N
  random.randomize()
  let
    width: int = min(MAXWIDTH, window.innerWidth)
    height: int = min(MAXWIDTH, window.innerWidth)
    canvas = Canvas(document.getElementById(CANVASID))
    ctx: CanvasRenderingContext2D = cvs.getContext2D(canvas)
  canvas.width = width
  canvas.height = height
  canvas.style.backgroundcolor = BGCOLOR
  var hermiteCurves: seq[Hermite2D]
  for index in 0..<N:
    hermiteCurves.safeAdd(
      Hermite2D(
        pos1: Point2D(x: -R * cos(degToRad(DEG * index.toFloat)) + OFFSET,
                      y: -R * sin(degToRad(DEG * index.toFloat)) + OFFSET),
        pos2: Point2D(x: R * cos(degToRad(DEG * index.toFloat)) + OFFSET,
                      y: R * sin(degToRad(DEG * index.toFloat)) + OFFSET),
        v1: Velocity2D(vx: 0, vy: 0),
        v2: Velocity2D(vx: 0, vy: 0)
      )
    )
  let timer: ref TInterval =
    window.setInterval(proc() = loop(canvas, ctx, hermiteCurves), MS)
  window.addEventListener("resize",
                          proc(e: Event) = resize(canvas, MAXWIDTH),
                          false)

if isMainModule:
  main()
