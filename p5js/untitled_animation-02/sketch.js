let animationLength = 1;
let currentFrame = 0;
let circleData = [];
let selectedPoints = [];

let numRows = 13;
let numCols = 9;

let canvas_w = 344;
let canvas_h = 480;

let circleDiameter = canvas_h/7.5;


function setup() {
  createCanvas(canvas_w*2, canvas_h* 2);
  background(0,0,0,0);
  angleMode(DEGREES);

  let offsetX = (width - (numCols * circleDiameter)) / 2;
  let offsetY = (height - (numRows * circleDiameter)) / 2;

  for (let row = 0; row < numRows; row++) {
    for (let col = 0; col < numCols; col++) {
      let centerX = offsetX + (col * circleDiameter) + (circleDiameter / 2);
      let centerY = offsetY + (row * circleDiameter) + (circleDiameter / 2);
      let points = generatePointsOnCircle((numRows*numCols)+3, circleDiameter / 2, centerX, centerY);
      let circleIndex = (row * numCols) + col;
      let numVertices = circleIndex + 3;
      circleData.push({ points, centerX, centerY, circleDiameter, numVertices, currentSegment: 0, animated: false });
      selectedPoints.push([]);
    }
  }

  for (let i = 0; i < circleData.length; i++) {
    generateRandomPoints(circleData[i].numVertices, i);
  }
}

function draw() {
  clear();
  background(0,0,0,0);

  for (let i = 0; i < circleData.length; i++) {
    drawPolyline(selectedPoints[i], i);
  }

  currentFrame++;

  if (currentFrame > animationLength) {
    currentFrame = 0;

    let allCirclesDone = true;
    for (let i = 0; i < circleData.length; i++) {
      if (circleData[i].currentSegment < selectedPoints[i].length - 1) {
        circleData[i].currentSegment++;
        allCirclesDone = false;
      } else if (!circleData[i].animated) {
        circleData[i].animated = true;
      }
    }

    if (allCirclesDone) {
      noLoop();
    }
  }
}

function drawPolyline(points, circleIndex) {
  strokeWeight(0.8);
  stroke(255);
  noFill();

  let progress = map(currentFrame, 0, animationLength, 0, 1);
  let currentSegmentIndex = circleData[circleIndex].currentSegment;

  //console.log("Circle Index:", circleIndex, "Current Segment Index:", currentSegmentIndex);

  beginShape();
  for (let i = 0; i < points.length; i++) {
    let startX = points[i].x;
    let startY = points[i].y;
    let endX = points[(i + 1) % points.length].x;
    let endY = points[(i + 1) % points.length].y;

    if (i < currentSegmentIndex) {
      vertex(startX, startY);
      vertex(endX, endY);
    } else if (i === currentSegmentIndex) {
      if (!circleData[circleIndex].animated) {
        let currentX = lerp(startX, endX, progress);
        let currentY = lerp(startY, endY, progress);

        vertex(startX, startY);
        vertex(currentX, currentY);
      } else {
        vertex(startX, startY);
        vertex(endX, endY);
      }
    }
  }
  endShape();
}

function mousePressed() {
  currentFrame = 0;
  for (let i = 0; i < circleData.length; i++) {
    generateRandomPoints(i + 3, i);
    circleData[i].currentSegment = 0;
  }
  loop();
}

function generatePointsOnCircle(numSegments, circleRadius, centerX, centerY) {
  let points = [];
  for (let i = 0; i < numSegments; i++) {
    let angle = 360 / numSegments * i;
    let x = centerX + circleRadius * cos(angle);
    let y = centerY + circleRadius * sin(angle);
    points.push({ x: x, y: y });
  }
  return points;
}

function generateRandomPoints(numPoints, circleIndex) {
  selectedPoints[circleIndex] = [];
  let tempPoints = [...circleData[circleIndex].points];

  for (let i = 0; i < numPoints; i++) {
    let index = floor(random(tempPoints.length));
    let pt = tempPoints[index];
    selectedPoints[circleIndex].push(pt);
    tempPoints.splice(index, 1);
  }
}






