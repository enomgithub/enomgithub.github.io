import math
import random


proc isContained*(x, y: float, threshold = 1.0): bool =
  let distance: float = math.sqrt(1.0 + (y * y) / (x * x)) * x
  return
    if distance <= threshold: true
    else: false


proc getPoints*(n: int, max: float): seq[(float, float)] =
  randomize()
  var points: seq[(float, float)]
  for i in 0..<n:
    let
      x: float = random.random(max=max)
      y: float = random.random(max=max)
    points.safeAdd((x, y))
  return points


proc monteCarlo*(n: int): float =
  let points: seq[(float, float)] = getPoints(n, 1.0)
  var count: int = 0
  for i in 0..<n:
    if isContained(points[i][0], points[i][1]):
      count += 1
  return 4.0 * count.toFloat / n.toFloat


proc monteCarlo*(points: seq[(float, float)]): float =
  var count: int = 0
  for i in 0..<points.len:
    if isContained(points[i][0], points[i][1]):
      count += 1
  return 4.0 * count.toFloat / points.len.toFloat


proc main() =
  const N: int = 1_000_000
  echo "Pi = ", monteCarlo(N)


if isMainModule:
  main()
