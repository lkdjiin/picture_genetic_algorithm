var canvasImgOrigin = document.getElementById('canvas1');
var canvasGenetic = document.getElementById('canvas2');
var ctxOrigin = canvas1.getContext('2d');
var ctx = canvas2.getContext('2d');
var TOTAL_SQUARES = 500;
var IMAGE_WIDTH = 400;
var IMAGE_HEIGHT = 400;
var SQUARE_MAX_SIZE = 40;
var img = new Image();
var generation = 0;
var htmlGeneration = document.getElementById("generation");
var htmlQuality = document.getElementById("quality");
var solution = [];
var canvasBuffer = document.createElement('canvas');
canvasBuffer.width = IMAGE_WIDTH;
canvasBuffer.height = IMAGE_HEIGHT;
var ctxBuffer = canvasBuffer.getContext('2d');

img.onload = function() { ctxOrigin.drawImage(img, 0, 0); };
img.src = '../test.jpg';
solution = makeIndividual();

var interval = setInterval(hillClimb, 150);

function makeIndividual() {
  var individual = [];
  for (var i = 0; i < TOTAL_SQUARES; i++) {
    individual.push({
      x: Math.floor(Math.random() * IMAGE_WIDTH),
      y: Math.floor(Math.random() * IMAGE_HEIGHT),
      size: Math.floor(Math.random() * SQUARE_MAX_SIZE),
      red: Math.floor(Math.random() * 256),
      green: Math.floor(Math.random() * 256),
      blue: Math.floor(Math.random() * 256),
      alpha: Math.random()
    });
  }
  return individual;
}

function renderIndividual(individual, ctx) {
  ctx.fillStyle = "white";
  ctx.fillRect(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  for (var i = 0; i < TOTAL_SQUARES; i++) {
    ctx.globalAlpha = individual[i].alpha;
    ctx.fillStyle = 'rgb(' + individual[i].red + ',' +
      individual[i].green + ',' + individual[i].blue + ')';
    ctx.fillRect(individual[i].x, individual[i].y,
      individual[i].size, individual[i].size);
  }
}

function quality(individual) {
  var imgOrigin = ctxOrigin.getImageData(0, 0, IMAGE_WIDTH, IMAGE_HEIGHT);
  var pixelArrayOrigin = imgOrigin.data;
  var score = 0;
  renderIndividual(individual, ctxBuffer);
  var imgBuffer = ctxBuffer.getImageData(0, 0, 400, 400);
  var pixelArrayCandidate = imgBuffer.data;
  for (var i = 0, n = pixelArrayOrigin.length; i < n; i += 4) {
    score += Math.abs(pixelArrayOrigin[i] - pixelArrayCandidate[i]);
    score += Math.abs(pixelArrayOrigin[i+1] - pixelArrayCandidate[i+1]);
    score += Math.abs(pixelArrayOrigin[i+2] - pixelArrayCandidate[i+2]);
  }
  return 1 / score;
}

function hillClimb() {
  var opponent = mutate(copy(solution));
  var score_opponent = quality(opponent);
  var score_solution = quality(solution);
  if (score_opponent > score_solution) {
    solution = opponent;
  }
  generation++;
  if (generation % 100 == 0) renderIndividual(solution, ctx);
  htmlGeneration.innerHTML = generation;
  htmlQuality.innerHTML = score_solution;
  if (generation >= 2000000) {
    clearInterval(interval);
  }
}

function copy(individual) {
  var indiCopy = [];
  for(var i = 0; i < TOTAL_SQUARES; i++) {
    var objectCopy = {},
        prop;
    for(prop in individual[i]) {
      objectCopy[prop] = individual[i][prop];
    }
    indiCopy.push(objectCopy);
  }
  return indiCopy;
}

function mutate(individual) {
  var gene = Math.floor(Math.random() * TOTAL_SQUARES),
      squareProperty = Math.floor(Math.random() * 7);
  switch (squareProperty) {
    case 0:
      individual[gene].x = Math.floor(Math.random() * IMAGE_WIDTH);
      break;
    case 1:
      individual[gene].y = Math.floor(Math.random() * IMAGE_HEIGHT);
      break;
    case 2:
      individual[gene].size = Math.floor(Math.random() * SQUARE_MAX_SIZE);
      break;
    case 3:
      individual[gene].red = Math.floor(Math.random() * 256);
      break;
    case 4:
      individual[gene].green = Math.floor(Math.random() * 256);
      break;
    case 5:
      individual[gene].blue = Math.floor(Math.random() * 256);
      break;
    case 6:
      individual[gene].alpha = Math.random();
      break;
  }
  return individual;
}
