import algorithm
import basic2d
import dom
import math
import strutils

import HTML5_canvas as cvs


type
  Gear = ref GearObj
  GearObj = object
    m: float
    z: int
    alpha: float
    involutes: seq[seq[Point2d]]
    involutesCCW: seq[seq[Point2d]]
    centerx: float
    centery: float


type
  Gears = ref GearsObj
  GearsObj = object
    gear1: Gear
    gear2: Gear


type
  Rotation = enum
    CW,
    CCW

  Direction = enum
    drTop,
    drRight,
    drBottom,
    drLeft

  Show = enum
    Yes,
    No


proc getd(gear: Gear): float =
  ## 基準円直径 d
  return gear.m * gear.z.toFloat


proc getdb(gear: Gear): float =
  ## 基礎円直径 db
  return gear.getd * cos(gear.alpha)


proc getda(gear: Gear): float =
  ## 歯先円直径 da
  return gear.getd + 2.0 * gear.m


proc getdf(gear: Gear): float =
  ## 歯底円直径 df
  return gear.getd - 2.5 * gear.m


proc getha(gear: Gear): float =
  ## 歯末の丈 ha
  return gear.m


proc geth(gear: Gear): float =
  ## 歯丈 h
  return 2.25 * gear.m


proc geta(gears: Gears): float =
  ## 軸間距離 a
  return (gears.gear1.getd + gears.gear2.getd) / 2.0


proc getTheta(point: Point2d): float =
  ## x軸とのなす角度
  let r: float = sqrt(point.x ^ 2 + point.y ^ 2)
  if point.y >= 0.0: return arccos(point.x / r)
  else: return 2 * math.Pi - arccos(point.x / r)


proc getTheta(gear: Gear, r: float): float =
  ## 基礎円上の点、歯車の中心点、rを通る点のなす角度
  let rb: float = gear.getdb / 2.0
  return sqrt(r ^ 2 - rb ^ 2) / rb


proc isContained(x, y: float, threshold = 1.0): bool =
  ## 点の距離が閾値を超えているか否かを判別する
  let distance: float = math.sqrt(1.0 + (y ^ 2) / (x ^ 2)) * x
  return
    if distance <= threshold: true
    else: false


proc getIndex(involute: seq[Point2d], r: float): int =
  ## シーケンス内にある、rを初めて超える距離の点のインデックスを取得する
  ## シーケンスの要素は、距離順に昇順にソートされているものとする
  var i: int = involute.low
  while isContained(involute[i].x, involute[i].y, threshold=r): i += 1
  return i


proc rotate(points: var seq[Point2d], theta: float) =
  ## 原点を中心に点を回転させる
  let matrix: Matrix2d = rotate(theta)
  for i in points.low..points.high:
    points[i] &= matrix


proc rotate(gear: Gear, theta: float) =
  ## 歯車を回転させる
  for i in gear.involutes.low..gear.involutes.high:
    gear.involutes[i].rotate(theta)
    gear.involutesCCW[i].rotate(theta)


proc rotate(gears: Gears, theta1: float, rotation = CW) =
  ## 歯車のセットを回転させる
  let
    rot: float =
      case rotation
      of CW: 1.0
      else: -1.0
    theta2: float = -theta1 * gears.gear1.z.toFloat / gears.gear2.z.toFloat
  gears.gear1.rotate(rot * theta1)
  gears.gear2.rotate(rot * theta2)


proc getInvPoint(a, theta: float): Point2d =
  ## インボリュート曲線上の点を取得する
  let
    x: float = a * (cos(theta) + theta * sin(theta))
    y: float = a * (sin(theta) - theta * cos(theta))
  return Point2d(x: x, y: y)


proc getCCW(involute: seq[Point2d]): seq[Point2d] =
  ## 反時計回りのインボリュート曲線をインボリュート曲線から得る
  let
    first: int = involute.low
    last: int = involute.high
  var involuteCCW: seq[Point2d] = newSeq[Point2d](involute.len)
  for i in first..last:
    involuteCCW[i].x = involute[i].x
    involuteCCW[i].y = -involute[i].y
  return involuteCCW


proc getInvolute(gear: Gear, dtheta: float): seq[Point2d] =
  ## インボリュート曲線を取得する
  let
    ra: float = gear.getda / 2.0
    rb: float = gear.getdb / 2.0
    rf: float = gear.getdf / 2.0
    theta0: float =
      if gear.getdf < gear.getdb: gear.getTheta(rb)
      else: gear.getTheta(rf)
    n: int = ((gear.getTheta(ra) - theta0) / dtheta).toInt
    maxTheta: float = gear.getTheta(ra)
  var
    points: seq[Point2d]
    theta: float = theta0
  for i in 0..<n:
    points.safeAdd(getInvPoint(rb, theta))
    theta += dtheta
  points.safeAdd(getInvPoint(rb, maxTheta))

  # 歯底円が基礎円より小さい場合は、
  # 基礎円上から歯底円上までのインボリュート曲線を追加する
  if gear.getdf < gear.getdb:
    let
      rfrev: float = (2.0 * gear.getdb - gear.getdf) / 2.0
      idf: int = points.getIndex(rfrev)
    points = points.reversed(points.low + 1, idf) & points
    for i in points.low..<idf:
      let diff: float = points[i].x - rb
      points[i].x = rb - diff
  return points


proc getInvolutes(gear: Gear, dtheta: float, direction = drRight) =
  ## インボリュート曲線のセットを取得する
  let
    divrad: float = 2.0 * math.Pi / gear.z.toFloat
    thetaOffset: float =
      case direction
      of drTop: math.Pi / 2.0
      of drRight: 0.0
      of drBottom: -math.Pi / 2.0
      else: math.Pi
    theta: float = tan(gear.alpha) - gear.alpha
  var
    involute: seq[Point2d] = gear.getInvolute(dtheta)
    involuteCCW: seq[Point2d] = involute.getCCW
  involute.rotate(thetaOffset - theta)
  involuteCCW.rotate(divrad / 2.0 + theta * 2.0)
  involuteCCW.rotate(thetaOffset - theta)

  gear.involutes[0] = involute
  gear.involutesCCW[0] = involuteCCW
  for i in 1..<gear.z:
    involute.rotate(divrad)
    involuteCCW.rotate(divrad)
    gear.involutes[i] = involute
    gear.involutesCCW[i] = involuteCCW


proc drawPolygonalLine(ctx: CanvasRenderingContext2D, points: seq[Point2d],
                       xoffset, yoffset, lineWidth: float, color: cstring) =
  ## 折れ線を描画する
  assert points.len > 0
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth

  ctx.beginPath()
  ctx.moveTo(points[0].x + xoffset, points[0].y + yoffset)
  for point in points:
    ctx.lineTo(point.x + xoffset, point.y + yoffset)
  ctx.stroke()


proc drawCenter(ctx: CanvasRenderingContext2D, gear: Gear,
                lineLength, lineWidth: float, color: cstring) =
  ## 歯車の中心点を十字に描画する
  let
    x: float = gear.centerx
    y: float = gear.centery
    offset: float = lineLength / 2.0
  ctx.strokeStyle = color
  ctx.lineWidth = lineWidth

  ctx.beginPath()
  ctx.moveTo(x - offset, y)
  ctx.lineTo(x + offset, y)
  ctx.stroke()

  ctx.beginPath()
  ctx.moveTo(x, y - offset)
  ctx.lineTo(x, y + offset)
  ctx.stroke()


proc drawda(ctx: CanvasRenderingContext2D, involute, involuteCCW: seq[Point2d],
            xoffset, yoffset, lineWidth: float, color: cstring) =
  ## 歯先の弧を描画する
  assert involute.len > 0 and involuteCCW.len > 0
  let
    last: int = involute.high
    theta0: float = involute[last].getTheta
    theta1: float = involuteCCW[last].getTheta
    ra: float = sqrt(involute[last].x ^ 2 + involute[last].y ^ 2)
  ctx.beginPath()
  ctx.arc(xoffset, yoffset, ra, theta0, theta1, false)
  ctx.stroke()


proc drawdf(ctx: CanvasRenderingContext2D, involute0, involute1: seq[Point2d],
            xoffset, yoffset, lineWidth: float, color: cstring) =
  ## 歯底の弧を描画
  assert involute0.len > 0 and involute1.len > 0
  let
    first: int = involute0.low
    theta0: float = involute0[first].getTheta
    theta1: float = involute1[first].getTheta
    point: Point2d = involute0[first]
    rf: float = sqrt(point.x ^ 2 + point.y ^ 2)
  ctx.beginPath()
  ctx.arc(xoffset, yoffset, rf, theta0, theta1, false)
  ctx.stroke()


proc drawGear(ctx: CanvasRenderingContext2D, gear: Gear, color: cstring) =
  ## 歯車を描画する
  let
    first: int = gear.involutes.low
    last: int = gear.involutes.high
  for i in first..last:
    ctx.drawPolygonalLine(gear.involutes[i],
                          gear.centerx, gear.centery, 1.0, color)
    ctx.drawPolygonalLine(gear.involutesCCW[i],
                          gear.centerx, gear.centery, 1.0, color)
    ctx.drawda(gear.involutes[i], gear.involutesCCW[i],
               gear.centerx, gear.centery, 1.0, color)
  for i in first..<last:
    ctx.drawdf(gear.involutesCCW[i], gear.involutes[i + 1],
               gear.centerx, gear.centery, 1.0, color)
  ctx.drawdf(gear.involutesCCW[last], gear.involutes[first],
             gear.centerx, gear.centery, 1.0, color)


proc drawGears(ctx: CanvasRenderingContext2D, gears: Gears, color: cstring) =
  ## 歯車のセットを描画する
  ctx.drawGear(gears.gear1, color)
  ctx.drawGear(gears.gear2, color)


proc cls(ctx: CanvasRenderingContext2D, width, height: float, color: cstring) =
  ## 画面消去
  ctx.fillStyle = color
  ctx.fillRect(0.0, 0.0, width, height)


proc showParameter(gear: Gear, name: string) =
  ## 歯車のパラメータを表示する
  document.getElementById("m-" & name).innerHTML = $gear.m
  document.getElementById("alpha-" & name).innerHTML = $gear.alpha.radToDeg
  document.getElementById("z-" & name).innerHTML = $gear.z
  document.getElementById("d-" & name).innerHTML = $gear.getd.round(2)
  document.getElementById("db-" & name).innerHTML = $gear.getdb.round(2)
  document.getElementById("ha-" & name).innerHTML = $gear.getha.round(2)
  document.getElementById("h-" & name).innerHTML = $gear.geth.round(2)
  document.getElementById("da-" & name).innerHTML = $gear.getda.round(2)
  document.getElementById("df-" & name).innerHTML = $gear.getdf.round(2)


proc showParameter(gears: Gears) =
  ## 歯車のセットのパラメータを表示する
  gears.gear1.showParameter("gear1")
  gears.gear2.showParameter("gear2")
  document.getElementById("a").innerHTML = $gears.geta.round(2)


proc loop(canvas: Canvas, gears: Gears) =
  ## アニメーションのメインループ
  const
    COLOR: cstring = "#FBFAF5"
    THETA: float = math.Pi / 900.0
  let
    ctx: CanvasRenderingContext2D = cvs.getContext2D(canvas)
    width: float = canvas.width.toFloat
    height: float = canvas.height.toFloat
  ctx.cls(width, height, canvas.style.backgroundColor)
  ctx.drawCenter(gears.gear1, 8.0, 1.0, COLOR)
  ctx.drawCenter(gears.gear2, 8.0, 1.0, COLOR)
  ctx.drawGears(gears, COLOR)
  gears.rotate(THETA)


proc init(gear: var Gear, m: float, z: int, alpha, dtheta,
          width, height: float, direction=drTop) =
  ## Gearオブジェクトのコンストラクタ
  gear.new
  gear.m = m
  gear.z = z
  gear.alpha = alpha
  gear.involutes = newSeq[seq[Point2d]](z)
  gear.involutesCCW = newSeq[seq[Point2d]](z)
  gear.centerx =
    case direction
    of drLeft: (width - gear.getd) / 2.0
    of drRight: (width + gear.getd) / 2.0
    else: height / 2.0
  gear.centery =
    case direction
    of drTop: (height - gear.getd) / 2.0
    of drBottom: (height + gear.getd) / 2.0
    else: height / 2.0
  gear.getInvolutes(dtheta, direction)


proc init(gears: var Gears, m: float, z1, z2: int,
          alpha, dtheta, width, height: float) =
  ## Gearsオブジェクトのコンストラクタ
  gears.new
  gears.gear1.init(m, z1, alpha, dtheta, width, height)
  gears.gear2.init(m, z2, alpha, dtheta, width, height, drBottom)


proc resize(canvas: Canvas, maxwidth: int, gears: Gears) =
  let
    width: int =
      if 1.6 * maxwidth.toFloat <= window.innerWidth.toFloat:
        (1.6 * maxwidth.toFloat / 2.0).toInt
      elif maxwidth <= window.innerWidth: maxwidth div 2
      else: window.innerWidth
  canvas.width = width
  gears.gear1.centerx = width.toFloat / 2.0
  gears.gear2.centerx = width.toFloat / 2.0


proc init(maxwidth, maxheight: int, canvasid, bgcolor: cstring, ms: int,
          m: float, z1, z2: int, alpha, dtheta, zoom: float, show=Yes) =
  let
    width: int = min(maxwidth, window.innerWidth)
    height: int = maxheight
    canvas: Canvas = Canvas(document.getElementById(canvasid))
  var gears: Gears
  gears.init(m * zoom, z1, z2, alpha, dtheta, width.toFloat, height.toFloat)
  case show
  of Yes: gears.showParameter
  else: discard
  canvas.width = width
  canvas.height = height
  canvas.style.backgroundColor = bgcolor
  canvas.resize(maxwidth, gears)
  let timer: ref TInterval =
    window.setInterval(proc() = loop(canvas, gears), ms)
  window.addEventListener("resize",
                          proc(e: Event) = canvas.resize(maxwidth, gears),
                          false)


proc main() =
  const
    MAXWIDTH: int = 600
    MAXHEIGHT: int = 600
    CANVASID: cstring = "involute"
    BGCOLOR: cstring = "#302833"
    MS: int = 16
    M: float = 4.0
    Z1: int = 67
    Z2: int = 47
    ALPHA: float = 20.0 * math.Pi / 180.0
    DTHETA: float = math.Pi / 45.0
  init(MAXWIDTH, MAXHEIGHT, CANVASID, BGCOLOR, MS,
       M, Z1, Z2, ALPHA, DTHETA, 1.0)

  const
    CANVASIDZOOM: cstring = "involute-zoom"
    ZOOM: float = 5.0
  init(MAXWIDTH, MAXHEIGHT, CANVASIDZOOM, BGCOLOR, MS,
       M, Z1, Z2, ALPHA, DTHETA, ZOOM, No)


if isMainModule:
  main()
