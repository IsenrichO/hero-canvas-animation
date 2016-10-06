// Controller:
function init() {
  canvas.addEventListener('mousemove', MouseMove, false);
  window.addEventListener('resize', ResizeCanvas, false);
  setInterval(TimeUpdate, 20);
  ResizeCanvas();
}

const canvas = document.getElementById('canvas'),
      MAX_DIST_2 = Math.pow(100, 2);

let points = [],
    nodes = [],
    partiteDivision = Math.floor(window.innerWidth / 25),
    mouse = { x: 0, y: 0 };


// Callback function used in response to browser window dimension changes (i.e., resizing):
const ResizeCanvas = (evt) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight
};

const MouseMove = (evt) => {
  mouse.x = evt.layerX;
  mouse.y = evt.layerY
};

// Returns the Euclidean distance 
const DistanceBetween = (evt, t) => Math.sqrt(Math.pow(t.x - evt.x, 2) + Math.pow(t.y - evt.y, 2));


// 
function TimeUpdate(e) {
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  var t, r,
      n = 0,
      i = new Array(points.length);

  while (n < nodes.length) {
    i[n] = new Array(nodes.length);
    for (r = 0; r < nodes.length; r++) {
      i[n][r] = 0;
    }
    n++;
  }

  for (var n = 0; n < nodes.length; n++) {
    nodes[n].x += nodes[n].vx;
    nodes[n].y += nodes[n].vy;

    nodes[n].x > window.innerWidth ? nodes[n].vx = -1 - Math.random()
      : nodes[n].x < 0 ? nodes[n].vx = 1 + Math.random()
      : nodes[n].vx *= 1 + Math.random() * 0.005;

    nodes[n].y > window.innerHeight ? nodes[n].vy = -1 * (1 + Math.random())
      : nodes[n].y < 0 ? (nodes[n].y = window.innerHeight, nodes[n].vy = 1)
      : nodes[n].vy *= 1;

    // ctx.strokeStyle = nodes[n].color;
    ctx.beginPath();
    let s = MAX_DIST_2;

    nodes.forEach((evt, t) => {
      var radius = Math.pow(evt.x - nodes[n].x, 2) + Math.pow(evt.y - nodes[n].y, 2);
      if (radius < s && evt != nodes[n]) s = radius;
      if (evt == nodes[n] || radius > MAX_DIST_2 || i[n][t]) return;
      ctx.moveTo(nodes[n].x, nodes[n].y);
      var o = nodes[n].x > evt.x ? nodes[n].x : evt.x;
      var u = nodes[n].y < evt.y ? nodes[n].y : evt.y;
      ctx.quadraticCurveTo(o, u, evt.x, evt.y);
      ctx.strokeStyle = `rgba(249, 179, 121, ${1 - (radius / MAX_DIST_2)})`;
      i[n][t] = 1, i[t][n] = 1;
    });

    ctx.stroke();
    var o = DistanceBetween(mouse, nodes[n]);
    o = Math.max(Math.min(15 - o / 10, 10), 1);
    ctx.fillStyle = nodes[n].color;
    ctx.beginPath();
    ctx.arc(nodes[n].x, nodes[n].y, nodes[n].size * o, 0, Math.PI * 2, true);
    ctx.closePath();
    ctx.fill();
  }
}


for (var i = 0; i < partiteDivision; i++) {
  nodes.push({
    x: Math.random() * window.innerWidth,
    y: Math.random() * window.innerHeight,
    vx: 0,
    vy: Math.random() * -2 - 0.05,
    history: [],
    size: 2,
    color: '#F9B379'
  });
}


if (canvas && canvas.getContext) {
  var ctx = canvas.getContext('2d');
  ctx.globalCompositeOperation = 'destination-over';
  init();
}(function(e) {
  e.fn.vAlign = function() {
    return this.each(function(t) {
      var n = e(this).height();
      var r = e(this).parent().height();
      var i = Math.ceil((r - n) / 2);
      e(this).css('margin-top', i);
    });
  };
})(jQuery);

