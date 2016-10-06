// Controller:
function init() {

  window.addEventListener("resize", ResizeCanvas, false);
  ResizeCanvas();
}

// Callback function used in response to browser window dimension changes (i.e., resizing):
const ResizeCanvas = (evt) => {
  canvas.width = window.innerWidth;
  canvas.height = window.innerHeight
};



let ctx = document.getElementById("canvas").getContext("2d");
ctx.globalCompositeOperation = "destination-over";
// ctx.save();

// 
const generateRandFloat = (dimension = window.innerWidth) => Math.random() * dimension;
  console.log(`Randomly Generated Float:\t${generateRandFloat(window.innerWidth)}`);

//
const generateRandFloatFromBottom = (dimension = window.innerWidth) => Math.random() * dimension;

// 
const getRandVal = () => ({
  x: generateRandFloat(window.innerWidth),
  y: generateRandFloat(window.innerHeight)
});
  console.log(`Random Generated Value:\t`, getRandVal());

// 
const getConstrainedVal = (refNode) => ({
  x: (Math.random() * 150) + refNode.x,
  y: (Math.random() * 100) + refNode.y
});

// 
const getRandValFromBottom = () => ({
  x: generateRandFloat(window.innerWidth),
  y: window.innerHeight
});

// Produces a small circle as positioned at node connection vertices:
const drawNode = (coordPair) => {
  ctx.beginPath();
  // ctx.arc(...coordPair, 10, 0, 2 * Math.PI);
  ctx.arc(...Object.values(coordPair), 4, 0, 2 * Math.PI);
  ctx.fill();
};

// Returns the Euclidean distance spanning two particular nodes:
const getEuclideanDist = (coordPair1, coordPair2) => {
  // let [xCoords, yCoords] = [[node1.coords[0], node2.coords[0]], [node1.coords[1], node2.coords[1]]];
  let [xCoords, yCoords] = [[coordPair1.x, coordPair2.x], [coordPair1.y, coordPair2.y]];
    console.log("xCoords:", xCoords, "yCoords:", yCoords, "CP1:", coordPair1);
  return Math.sqrt(Math.pow(xCoords[1] - xCoords[0], 2) + Math.pow(yCoords[1] - yCoords[0], 2));
};

// Produces the inter-vertex edge as a quadratic Bézier curve connecting the two:
const drawNodeAxis = (coordPair1, coordPair2) => {
  ctx.lineWidth = "1.25";
  let dist = getEuclideanDist(coordPair1, coordPair2);
    console.log("Euclidean:", dist);

  ctx.moveTo(coordPair1.x + 0.625, coordPair1.y + 0.625);
  // ctx.lineTo(coordPair2[0], coordPair2[1]);

  coordPair1[0] <= coordPair2[0]
    ? ctx.quadraticCurveTo(coordPair1.x + (dist / 2), coordPair1.y - (dist / 2), ...Object.values(coordPair2).map(val => val - 0.625))
    : ctx.quadraticCurveTo(coordPair2.x + (dist / 2), coordPair2.y - (dist / 2), ...Object.values(coordPair2).map(val => val - 0.625));
  ctx.stroke();
};

// 
const createFloatConnection = (coordPair1 = getRandVal(), coordPair2 = getConstrainedVal(coordPair1)) => {
  // drawNode(coordPair1) && drawNode(coordPair2);
  drawNode(coordPair1), drawNode(coordPair2);
  drawNodeAxis(coordPair1, coordPair2);
  return [coordPair1, coordPair2];
};

const floatUp = (node1, node2) => {
// const floatUp = (cxn) => {
  // ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
  let currTimeSeconds = new Date().getSeconds();
    console.log("Node 1 Coordinates: ", node1.coords);
  let bottomYCoord = Math.max.call(null, node1.coords.x, node2.coords.x);
    console.log("MIN:", bottomYCoord);

  createFloatConnection({x: node1.coords.x, y: --node1.coords.x}, {x: node2.coords.x, y: --node2.coords.y});
  // createFloatConnection(node1.coords, node2.coords);
};



var Node = function() {
  this.coords = getRandVal();
};
let newNode = new Node();
  console.log(`Node constructor:\n`, newNode, `\nPos: `, newNode.coords);

var ConstrainedNode = function(refNode) {
  this.coords = getConstrainedVal(refNode.coords);
};

var NodeSet = function() {
  let initNode = new Node(),
      constrainedNode = new ConstrainedNode(initNode);
  return [initNode, constrainedNode];
};
  console.log('Node Set:', new NodeSet());

var NodeFromBottom = function() {
  this.coords = getRandValFromBottom();
};

var Conexion = function(...nodes) {
  this.nodes = nodes;
  // createFloatConnection(this.nodes[0].coords, this.nodes[1].coords);
  createFloatConnection(this.nodes[0].coords, this.nodes[1].coords);
};
// let newConexion = new Conexion(new Node(), new Node(), new Node());
  // console.log(`Node Conexion:\n`, newConexion, `\nNodes: `, newConexion.nodes);



// let nodeConnections = [new Conexion(new Node(), new Node())];
// let nodeConnections = [...Array(8).keys()].map(i => new Conexion(...NodeSet()));
let nodeConnections = [...Array(5).keys()].map(i => new Conexion(...NodeSet()));
  console.log(`Node Connections Array:\n`, nodeConnections);

let pushNewConexions = setInterval(function() {
  let newBottomNode = new NodeFromBottom(),
      newConstrainedBottomNode = new ConstrainedNode(newBottomNode);
  // nodeConnections.push(new Conexion(newBottomNode, newConstrainedBottomNode));
  nodeConnections.push(new Conexion(...NodeSet()));
}, 2500);
// clearInterval(pushNewConexions);


function draw() {
  ctx.strokeStyle = "rgba(249, 179, 121, 0.55)";     // "#F9B379";      // "rgba(249, 179, 121, 1.0)";
  ctx.fillStyle = "rgba(249, 179, 121, 0.55)";       // "#F9B379";        // "rgba(249, 179, 121, 1.0)";

  ctx.save();
  ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);



  nodeConnections.forEach(cxn => {
    floatUp(cxn.nodes[0], cxn.nodes[1]);
  });

  window.requestAnimationFrame(draw);


  ctx.restore();
    console.log("Drawing...");
}
draw();





init();