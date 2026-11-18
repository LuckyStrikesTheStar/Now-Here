// Seasonal controls for the Ran Zan sketch. Default: snowy winter.
let season = 'winter';
const seasons = ['spring', 'summer', 'fall', 'winter'];

function setSeason(next) {
  if (!seasons.includes(next)) return;
  season = next;
  paused = false;
  if (typeof describe === 'function') {
    describe(`Ran Zan restaurant in ${season}. Click to pause or resume.`);
  }
}

// The cabinet calls this directly; keys 1–4 also work in OpenProcessing.
window.setSeason = setSeason;
function keyPressed() {
  const next = seasons[Number(key) - 1];
  if (next) setSeason(next);
}

function seasonPalette() {
  return {
    spring: {skyTop: '#85c5d0', skyBottom: '#e6eed2'},
    summer: {skyTop: '#479bc9', skyBottom: '#cce9df'},
    fall: {skyTop: '#b5a4a0', skyBottom: '#f1cf9e'},
    winter: {skyTop: '#15131d', skyBottom: '#5a4050'}
  }[season];
}

function drawSeasonSun() {
  push();
  noStroke();
  const big = season === 'summer';
  const x = 790, y = big ? 40 : 27, r = big ? 37 : 16;
  fill(255, 224, 132, 35);
  circle(x, y, r * 2.9);
  fill(big ? '#ffda68' : '#fff1bb');
  circle(x, y, r * 2);
  if (big) {
    stroke('#ffdf85');
    strokeWeight(3);
    for (let i = 0; i < 12; i++) {
      const a = i * TWO_PI / 12 + sceneTime * 0.04;
      line(x + cos(a) * 42, y + sin(a) * 42,
           x + cos(a) * 49, y + sin(a) * 49);
    }
  }
  pop();
}

function drawSeasonGarden() {
  push();
  noStroke();
  const autumn = season === 'fall';
  for (let side = 0; side < 2; side++) {
    const x = side ? 565 : 25;
    fill(autumn ? '#80633d' : '#58794b');
    rect(x, 532, 370, 18, 6);
    for (let i = 0; i < 35; i++) {
      const gx = x + i * 10.5, gy = 533 + (i * 7 % 12);
      fill(autumn ? '#bf7a3f' : '#89a75a');
      ellipse(gx, gy, 18, 6);
      if (season === 'spring' && i % 3 === 0) {
        fill(i % 2 ? '#f1aac0' : '#f7e6aa');
        circle(gx, gy - 4, 7);
        fill('#dbab63');
        circle(gx, gy - 4, 3);
      }
    }
  }
  pop();
}

function drawSeasonParticles() {
  push();
  noStroke();
  if (season === 'spring') {
    for (let i = 0; i < 15; i++) {
      const t = sceneTime, phase = i * 2.399;
      const x = (i * 71 + t * (9 + i % 5)) % (width + 40) - 20;
      const y = 320 + sin(t * 0.55 + phase) * 120 + i % 4 * 40;
      const wing = 3 + abs(sin(t * 9 + phase)) * 7;
      push();
      translate(x, y);
      rotate(sin(t + phase) * 0.3);
      fill(['#ffe49a', '#e8b1cf', '#e4e5ed'][i % 3]);
      ellipse(-wing / 2, -2, wing, 12);
      ellipse(wing / 2, -2, wing, 12);
      fill('#665046');
      rect(-1, -5, 2, 11);
      pop();
    }
  } else if (season === 'summer') {
    drawSummerBreezes();
  } else if (season === 'fall') {
    for (let i = 0; i < 55; i++) {
      const t = sceneTime, phase = i * 2.399;
      const y = (i * 67 + t * (19 + i % 7)) % (height + 40) - 20;
      const x = ((i * 113 + t * 11 + sin(t + phase) * 25) % (width + 60) + width + 60) % (width + 60) - 30;
      push();
      translate(x, y);
      rotate(t * 0.8 + phase);
      fill(['#b95d39', '#e1ab48', '#99503e', '#ce783b'][i % 4]);
      ellipse(0, 0, 9, 17);
      stroke('#795039');
      strokeWeight(1);
      line(0, -5, 0, 11);
      pop();
    }
  }
  pop();
}

// Thin, curling gusts drift across the warm air, fading between passes.
function drawSummerBreezes() {
  push();
  noFill();
  strokeWeight(2.5);
  for (let i = 0; i < 7; i++) {
    const phase = (sceneTime * 0.075 + i / 7) % 1;
    const x = -200 + phase * (width + 400);
    const y = 35 + i * 89 + sin(sceneTime * 0.7 + i) * 11;
    stroke(255, 249, 216, sin(phase * PI) * 115);
    beginShape();
    for (let j = 0; j <= 24; j++) {
      const u = j / 24;
      vertex(x + u * 140, y + sin(u * TWO_PI + i) * 7);
    }
    endShape();
    // A shorter trailing ribbon gives each gust a light, layered shape.
    stroke(255, 249, 216, sin(phase * PI) * 65);
    beginShape();
    for (let j = 0; j <= 16; j++) {
      const u = j / 16;
      vertex(x + 35 + u * 85, y + 13 + sin(u * PI + i) * 6);
    }
    endShape();
  }
  pop();
}

// Deterministic positions keep the leaf piles still as the scene animates.
function drawSettledLeaves() {
  const colors = ['#b95d39', '#e1ab48', '#99503e', '#ce783b', '#e7bc66'];
  const leaf = (x, y, i, size, flattened) => {
    push();
    translate(x, y);
    scale(1, flattened);
    rotate(i * 2.399);
    noStroke();
    fill(71, 43, 30, 55);
    ellipse(2, 3, size + 3, size * 0.65);
    fill(colors[i % colors.length]);
    beginShape();
    vertex(-size * 0.7, 0);
    vertex(-size * 0.2, -size * 0.4);
    vertex(size * 0.25, -size * 0.3);
    vertex(size * 0.65, 0);
    vertex(size * 0.15, size * 0.35);
    vertex(-size * 0.3, size * 0.3);
    endShape(CLOSE);
    stroke('#795039');
    strokeWeight(1);
    line(-size * 0.6, 0, size * 0.8, 0);
    pop();
  };
  // Broad drifts on the roof's upper plane, plus leaves caught at its lip.
  for (let i = 0; i < 115; i++) {
    const x = 98 + (i * 137.3 % 765);
    const y = 65 + (i * 17.7 % 19);
    leaf(x, y, i, 10 + i % 7, 0.55);
  }
  for (let i = 0; i < 38; i++) {
    leaf(76 + i * 21.5, 91 + i % 3, i + 120, 9 + i % 5, 0.65);
  }
  // Dense piles beside the doorway; a lighter scatter across the pavement.
  for (let i = 0; i < 170; i++) {
    const side = i % 2;
    const x = (side ? 556 : 18) + (i * 79.3 % 386);
    const y = 540 + (i * 11.7 % 25);
    leaf(x, y, i + 180, 10 + i % 9, 0.65);
  }
  for (let i = 0; i < 65; i++) {
    leaf(15 + (i * 137.3 % 930), 570 + (i * 19.1 % 55), i + 360, 9 + i % 7, 0.55);
  }
}
