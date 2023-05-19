let aLen = 1;
let cFrame = 0;
let pts = [];
let selPts = [];
let segIdx = 0;
let n_pts = 8;
let dotSize = 4; // Variable to control the size of the dots
let offsetPx = 12;
let slider; // Variable to hold the slider

function setup() {
  createCanvas(800, 800);
  angleMode(DEGREES);
  background(0,0,0,0);
  genPtsOnCircle(150, 180);
  genRandPts(n_pts);

  // Create the slider
  slider = createSlider(3, 150, 10); // Changed the range to 0-150
  setSliderStyle(slider); // Set the slider style
  slider.position(width / 2 - slider.width / 2, height - 50); // Center bottom of the canvas
  slider.input(restartAnimation); // Add an input event to restart the animation
}

function draw() {
  background(0, 0, 0,0);
  strokeWeight(4);
  stroke(255, 255, 255, 125);
  noFill();

  // Draw all points first
  fill(255, 255, 255, 51);
  for (let point of selPts) {
    ellipse(point.x, point.y, dotSize, dotSize); // Draw a dot at each point

    // Calculate the offset point
    let angle = atan2(point.y - height / 2, point.x - width / 2);
    let offsetX = cos(angle) * offsetPx;
    let offsetY = sin(angle) * offsetPx;

    // Draw the offset point
    //ellipse(point.x + offsetX, point.y + offsetY, dotSize, dotSize); // Draw a dot at the offset point
  }
  stroke(255);
  strokeWeight(2);
  noFill();

  let prog = map(cFrame, 0, aLen, 0, 1);

  beginShape();
  for (let i = 0; i < selPts.length; i++) {
    if (i <= segIdx) {
      let startX = selPts[i].x;
      let startY = selPts[i].y;
      let endX = selPts[(i + 1) % selPts.length].x;
      let endY = selPts[(i + 1) % selPts.length].y;

      let currX = lerp(startX, endX, prog);
      let currY = lerp(startY, endY, prog);

      vertex(startX, startY);
      vertex(currX, currY);
    } else {
      break;
    }
  }
  endShape();

  cFrame++;
  if (cFrame > aLen) {
    cFrame = 0;
    segIdx++;

    if (segIdx >= selPts.length) {
      segIdx = 0;
      noLoop();
    }
  }
}

function mousePressed() {
  restartAnimation();
}

function restartAnimation() {
  segIdx = 0;
  cFrame = 0;
  n_pts = slider.value(); // Use the slider's value
  genRandPts(n_pts);
  loop();
}

function genPtsOnCircle(n, rad) {
  let centerX = width / 2;
  let centerY = height / 2;

  for (let i = 0; i < n; i++) {
    let angle = (360 / n) * i;
    let x = centerX + rad * cos(angle);
    let y = centerY + rad * sin(angle);
    pts.push({ x: x, y: y });
  }
}

function genRandPts(n) {
  selPts = [];
  let tempPts = [...pts];

  for (let i = 0; i < n; i++) {
    let idx = floor(random(tempPts.length));
    let pt = tempPts[idx];
    selPts.push(pt);
    tempPts.splice(idx, 1);
  }
}

function setSliderStyle(slider) {
  let sliderId = 'slider' + Math.random().toString(36).substr(2, 9);
  slider.elt.setAttribute('id', sliderId);

  let style = document.createElement('style');
  style.innerHTML = `
    #${sliderId} {
      -webkit-appearance: none;
      height: 0px;
      background-color: transparent;
    }
    #${sliderId}::-webkit-slider-thumb {
      -webkit-appearance: none;
      border: none;
      width: 2px;
      height: 12px;
      background: #ffffff;
      cursor: pointer;
      margin-top: -4px;
    }
    #${sliderId}::-webkit-slider-runnable-track {
      width: 100%;
      height: 2px;
      cursor: pointer;
      background: #ffffff;
    }
  `;
  document.head.appendChild(style);
  slider.style('width', '100px');
}
