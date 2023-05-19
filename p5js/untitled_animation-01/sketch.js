let aSpeed = 60;
let circleALen = aSpeed *1.5;
let pointsALen = aSpeed *1.5;
let fadeALen = aSpeed/2;
let polyALen = aSpeed *2;
let pointsFadeOutLen = aSpeed/3;
let selPtsFadeOutLen = aSpeed/3;
let polyHoldLen = aSpeed/3;
let currentFrame = 0;
let circleRad = 180;
let circleOpac = 102;
let phase = 0;
let numPts = 44;
let chosenPts = 22;
let pts = [];
let poly_pts = [];
let dotSize = 6;
let unselPts = [];

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  background(0,0,0,0);
  genPtsOnCircle(numPts, circleRad);
}

function draw() {
  background(0,0,0,0);

  switch (phase) {
    case 0: drawCircle(currentFrame, circleALen); break;
    case 1: drawPts(currentFrame, pointsALen); break;
    case 2: drawAllPts(); fadeCircle(currentFrame, fadeALen); break;
    case 3: drawAllPts(); chooseRandomPts(); phase++; break;
    case 4: drawSelPts(); fadeUnselPts(currentFrame, pointsFadeOutLen); break;
    case 5: drawSelPts(); drawPoly(currentFrame, polyALen); if (currentFrame >= polyALen) { currentFrame = 0; phase++; } break;
    case 6: drawPoly(polyALen, polyALen); drawSelPts(); if (currentFrame >= polyHoldLen) { currentFrame = 0; phase++; } break;
    case 7: drawPoly(polyALen, polyALen); drawSelPts(); fadeSelPts(currentFrame, fadeALen); if (currentFrame >= fadeALen) { currentFrame = 0; phase++; } break;
  }

  currentFrame++;
  if (phase > 7) {
    noLoop();
    setTimeout(resetAnimation, 5000);  // Call resetAnimation after 5 seconds.
  }
}

function drawAllPts() {
  strokeWeight(dotSize);
  for (let pt of pts) {
    stroke(255, 255, 255, pt.opacity);
    point(pt.x, pt.y);
  }
}

function fadeUnselPts(frame, aLen) {
  let prog = map(frame, 0, aLen, 0, 1);
  strokeWeight(dotSize);

  for (let i = 0; i < pts.length; i++) {
    let pt = pts[i];
    if (!poly_pts.includes(pt)) {
      pt.opacity = map(prog, 0, 1, 255, 0);
    }
    stroke(255, 255, 255, pt.opacity);
    point(pt.x, pt.y);
  }

  if (frame >= aLen) {
    currentFrame = 0;
    phase++;
  }
}

function drawSelPts() {
  strokeWeight(dotSize);
  for (let pt of poly_pts) {
    let opac = pt.opacity !== undefined ? pt.opacity : 255;
    stroke(255, 255, 255, opac);
    point(pt.x, pt.y);
  }
}

function fadeSelPts(frame, aLen) {
  let prog = map(frame, 0, aLen, 0, 1);
  for (let pt of poly_pts) {
    pt.opacity = map(prog, 0, 1, 255, 0);
  }

  if (frame >= aLen) {
    currentFrame = 0;
    phase++;
  }
}

function mousePressed() {
  resetAnimation();
}

function drawCircle(frame, aLen) {
  let centerX = width / 2;
  let centerY = height / 2;
  let prog = map(frame, 0, aLen, 0, 360);
  stroke(255, 255, 255, circleOpac);
  strokeWeight(4);
  noFill();
  arc(centerX, centerY, circleRad * 2, circleRad * 2, 0, prog);
  if (frame >= aLen) { currentFrame = 0; phase++; }
}

function drawPts(frame, aLen) {
  let centerX = width / 2;
  let centerY = height / 2;
  stroke(255, 255, 255, circleOpac);
  strokeWeight(4);
  noFill();
  ellipse(centerX, centerY, circleRad * 2, circleRad * 2);
  strokeWeight(dotSize);

  for (let i = 0; i < pts.length; i++) {
    let pt = pts[i];
    let prog = map(frame, 0, aLen, 0, 1);
    let thresh = map(i, 0, pts.length, 0, 1);

    if (prog > thresh) {
      stroke(255, 255, 255, pt.opacity);
      point(pt.x, pt.y);
    }
  }
  if (frame >= aLen) { currentFrame = 0; phase++; }
}

function fadeCircle(frame, aLen) {
  let centerX = width / 2;
  let centerY = height / 2;
  let prog = map(frame, 0, aLen, 0, 1);
  circleOpac = map(prog, 0, 1, 102, 0);
  stroke(255, 255, 255, circleOpac);
  strokeWeight(4);
  noFill();
  ellipse(centerX, centerY, circleRad * 2, circleRad * 2);
  if (frame >= aLen) { currentFrame = 0; phase++; }
}

function chooseRandomPts() {
  let tempPts = [...pts];
  for (let i = 0; i < chosenPts; i++) {
    let index = floor(random(tempPts.length));
    let pt = tempPts[index];
    poly_pts.push(pt);
    tempPts.splice(index, 1);
  }
  unselPts = tempPts;
}

function genPtsOnCircle(n, rad) {
  let centerX = width / 2;
  let centerY = height / 2;

  for (let i = 0; i < n; i++) {
    let angle = (360 / n) * i;
    let x = centerX + rad * cos(angle);
    let y = centerY + rad * sin(angle);
    pts.push({ x: x, y: y, opacity: 255 });
  }
}

function drawPoly(frame, aLen) {
  let prog = map(frame, 0, aLen, 0, poly_pts.length + 1);
  let fullSegs = floor(prog);
  let partProg = prog - fullSegs;

  stroke(255);
  strokeWeight(3);
  noFill();

  for (let i = 0; i < fullSegs; i++) {
    let prevPt = poly_pts[i % poly_pts.length];
    let currPt = poly_pts[(i + 1) % poly_pts.length];
    line(prevPt.x, prevPt.y, currPt.x, currPt.y);
  }

  if (fullSegs < poly_pts.length) {
    let prevPt = poly_pts[fullSegs % poly_pts.length];
    let currPt = poly_pts[(fullSegs + 1) % poly_pts.length];
    let partX = lerp(prevPt.x, currPt.x, partProg);
    let partY = lerp(prevPt.y, currPt.y, partProg);
    line(prevPt.x, prevPt.y, partX, partY);
  }
}

function resetAnimation() {
  pts = [];
  poly_pts = [];
  unselPts = [];
  currentFrame = 0;
  phase = 0;
  circleOpac = 102;
  genPtsOnCircle(numPts, circleRad);
  loop();
}
  
