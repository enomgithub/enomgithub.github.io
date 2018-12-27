class Vector {
  constructor(x, y) {
    this.x = x
    this.y = y
  }
}

const init_vector = (r, theta) => {
  const x = r * Math.cos(theta)
  const y = r * Math.sin(theta)
  return new Vector(x, y)
}

const unit_vector = (v) => {
  const n = norm(v)
  return new Vector(v.x / n, v.y / n)
}

const rand_vec = () => {
  const x = Math.random() - 0.5
  const y = Math.random() - 0.5
  return unit_vector(new Vector(x, y))
}

const dot = (v1, v2) => {
  return v1.x * v2.x + v1.y * v2.y
}

const length = (r, v1, v2) => {
  return 2 * r * dot(v1, v2)
}

const times = (n, v) => {
  return new Vector(n * v.x, n * v.y)
}

const plus = (v1, v2) => {
  return new Vector(v1.x + v2.x, v1.y + v2.y)
}

const next = (r, v1, v2) => {
  return plus(times(r, v1), times(length(r, v1, v2), v2))
}

const norm = (v) => {
  return Math.sqrt(v.x * v.x + v.y * v.y)
}

const get_v_list = (r, v, n) => {
  if (n === 0) {
    return [v]
  } else {
    const v1 = unit_vector(v)
    let v2 = rand_vec()
    while (Math.abs(dot(v1, v2)) > 0.3) {
      v2 = rand_vec()
    }
    const result = get_v_list(r, next(r, v1, v2), n - 1)
    result.push(v)
    return result
  }
}

const move = (x, y, v_list) => {
  let trans_v_list = []
  const trans = new Vector(x, y)
  for (let v of v_list) {
    const trans_v = plus(v, trans)
    trans_v_list.push(trans_v)
  }
  return trans_v_list
}

const draw = (ctx, height, width, v_lists) => {
  // 背景色で塗りつぶす
  ctx.fillStyle = "rgb(48, 40, 51)"
  ctx.fillRect(0, 0, width, height)

  ctx.strokeStyle = "rgb(251, 250, 245)"
  ctx.lineWidth = 1
  for (let v_list of v_lists) {
    // 折れ線の描画
    ctx.beginPath()
    ctx.moveTo(v_list[0].x, v_list[0].y)
    for (let v of v_list) {
      ctx.lineTo(v.x, v.y)
    }
    ctx.stroke()
  }
}

const loop = (ctx, height, width, r, n) => {
  const theta = Math.PI * 180 * Math.random()
  const v = init_vector(r, theta)
  const v_list = get_v_list(r, v, n)
  const trans_v_list = move(height / 2, width / 2, v_list)

  const theta2 = Math.PI * 180 * Math.random()
  const v2 = init_vector(r / 2, theta2)
  const v_list2 = get_v_list(r / 2, v2, Math.round(n / 2))
  const trans_v_list2 = move(height / 2, width / 2, v_list2)

  const trans_v_lists = [trans_v_list, trans_v_list2]
  draw(ctx, height, width, trans_v_lists)
}

const init = (canvas_id, height, width, r, n_id, n) => {
  document.getElementById(canvas_id).width = width
  document.getElementById(canvas_id).height = height
  document.getElementById(n_id).textContent = "N = " + n
  const ctx = document.getElementById(canvas_id).getContext("2d")

  let timer = setInterval(() => {loop(ctx, height, width, r, n)}, 16)
}

init("circle", 600, 600, 200, "repeat", 1000)
