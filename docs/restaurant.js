// RAN ZAN — compact 3D pixel-art storefront
// No images, fonts, or extra libraries are needed.

let snowflakes = [];
let sceneTime = 0;
let paused = false;

// 2 = detailed pixels, 3 = medium, 4 = chunky.
const PIXEL_SIZE = 4;

let mainCanvas;
let pixelCanvas;

function setup() {
	mainCanvas = createCanvas(960, 660);
	pixelDensity(1);
	noSmooth();
	textFont(window.cabinetFont || "monospace");

	pixelCanvas = createGraphics(
		width / PIXEL_SIZE,
		height / PIXEL_SIZE
	);

	pixelCanvas.pixelDensity(1);
	pixelCanvas.noSmooth();

	mainCanvas.elt.style.imageRendering = "pixelated";

	// Create 180 snowflakes.
	for (let i = 0; i < 180; i++) {
		let depth = random();

		snowflakes.push({
			x: random(width),
			y: random(height),

			// Close snow is larger.
			size: map(depth, 0, 1, 2, 9),

			// Close snow falls faster.
			speed: map(depth, 0, 1, 12, 48),

			// Controls sideways movement.
			drift: map(depth, 0, 1, 7, 19),

			depth: depth,
			wiggle: random(TWO_PI)
		});
	}
}

function draw() {
	let seconds = min(deltaTime / 1000, 0.05);

	if (!paused) {
		sceneTime += seconds;
	}

	drawSky();
	drawStreet();
	drawNeighboringShops();
	drawBuilding();

	drawLeftRoom();
	drawRightRoom();

	drawWindowFrame(104, 266, 292, 224);
	drawWindowFrame(566, 266, 290, 224);

	drawDoor();
	drawRoofAndSign();
	if (season === "winter") drawRoofSnowTexture();

	drawDecorations();
	if (season === "winter") {
		drawSnowbanks();
		drawFrontSnowTexture();
	} else drawSeasonGarden();

	if (season === "fall") drawSettledLeaves();
	drawDog();

	if (season === "winter") drawSnow(seconds);
	else drawSeasonParticles();

	// Always keep this as the last drawing command.
	makePixelArt();
}

// ========================================
// BACKGROUND
// ========================================

function drawSky() {
	noStroke();

	for (let y = 0; y < height; y += 4) {
		let amount = y / height;

		fill(
			lerpColor(
				color(seasonPalette().skyTop),
				color(seasonPalette().skyBottom),
				amount
			)
		);

		rect(0, y, width, 4);
	}

	if (season !== "winter") drawSeasonSun();

	// Distant buildings.
	fill("#3b303b");
	rect(0, 58, 61, 480);
	rect(908, 35, 52, 505);

	fill("#c39a6a");
	rect(12, 96, 20, 56);
	rect(930, 79, 17, 61);

	fill("#49383c");
	rect(21, 96, 3, 56);
	rect(12, 124, 20, 3);
	rect(938, 79, 3, 61);
	rect(930, 108, 17, 3);
}

function drawStreet() {
	noStroke();

	// Snowy sidewalk.
	fill(season === "winter" ? "#d8cdc0" : "#b7ac91");
	rect(0, 530, width, 88);

	fill(season === "winter" ? "#eee2d1" : "#c9bea1");
	rect(0, 535, width, 20);

	// Curb and road.
	fill("#a69aa0");
	rect(0, 608, width, 18);

	fill("#62555e");
	rect(0, 626, width, 34);

	fill("#8b7272");

	for (let x = 18; x < width; x += 76) {
		rect(x, 642 + (x % 3), 39, 3);
	}
}

function drawNeighboringShops() {
	noStroke();

	// Left laundromat.
	fill("#57474a");
	rect(0, 180, 52, 350);

	fill("#c7b78f");
	rect(0, 217, 48, 45);

	fill("#403b3d");
	rect(0, 270, 45, 232);

	fill("#ddcfa8");
	rect(3, 362, 36, 56);
	rect(3, 428, 36, 56);

	fill("#536264");
	ellipse(21, 392, 27, 27);
	ellipse(21, 458, 27, 27);

	fill("#91a8a0");
	ellipse(21, 392, 17, 17);
	ellipse(21, 458, 17, 17);

	// Right market.
	fill("#604649");
	rect(908, 180, 52, 350);

	fill("#c99e77");
	rect(912, 217, 48, 45);

	fill("#4a3739");
	rect(915, 270, 45, 232);

	for (let row = 0; row < 4; row++) {
		let shelfY = 328 + row * 42;

		fill("#725038");
		rect(917, shelfY, 43, 5);

		for (let column = 0; column < 3; column++) {
			if ((row + column) % 2 === 0) {
				fill("#7b8159");
			} else {
				fill("#a96549");
			}

			rect(
				921 + column * 14,
				shelfY - 23,
				8,
				22
			);
		}
	}
}

// ========================================
// BUILDING AND BRICKS
// ========================================

function drawBuilding() {
	noStroke();

	// Shadow behind the building.
	fill(20, 15, 22, 140);
	rect(48, 104, 864, 445);

	// Building side planes.
	fill("#432936");
	quad(
		60, 110,
		80, 122,
		80, 517,
		60, 538
	);

	fill("#a05f51");
	quad(
		880, 122,
		900, 110,
		900, 538,
		880, 517
	);

	// Main wall.
	fill("#743b45");
	rect(60, 110, 840, 425);

	let brickColors = [
		"#743b45",
		"#8b4850",
		"#5c3340",
		"#965244"
	];

	for (let row = 0; row < 30; row++) {
		let y = 114 + row * 14;
		let offset = row % 2 === 0 ? 0 : 22;

		for (let column = -1; column < 20; column++) {
			let x = 61 + column * 44 + offset;

			fill(
				brickColors[
					(row + column + 20) %
					brickColors.length
				]
			);

			rect(x, y, 42, 12);
		}
	}

	// Stone ledge.
	fill("#c28b67");
	quad(
		68, 257,
		892, 257,
		900, 268,
		60, 268
	);

	fill("#39262f");
	quad(
		60, 268,
		900, 268,
		890, 280,
		70, 280
	);

	// Heavy building base.
	fill("#382630");
	quad(
		60, 506,
		900, 506,
		920, 540,
		40, 540
	);

	fill("#9b614d");
	quad(
		70, 501,
		890, 501,
		900, 513,
		60, 513
	);
}

// ========================================
// PERSPECTIVE ROOMS
// ========================================

function drawRoomBox(
	x,
	y,
	w,
	h,
	backColor,
	floorColor
) {
	let backLeft = x + 48;
	let backRight = x + w - 48;
	let backTop = y + 57;
	let backBottom = y + h - 68;
	let centerX = x + w / 2;

	noStroke();

	// Ceiling.
	fill("#29252a");
	quad(
		x, y,
		x + w, y,
		backRight, backTop,
		backLeft, backTop
	);

	// Left wall.
	fill("#4b503e");
	quad(
		x, y,
		backLeft, backTop,
		backLeft, backBottom,
		x, y + h
	);

	// Right wall.
	fill("#94835b");
	quad(
		backRight, backTop,
		x + w, y,
		x + w, y + h,
		backRight, backBottom
	);

	// Back wall.
	fill(backColor);
	rect(
		backLeft,
		backTop,
		backRight - backLeft,
		backBottom - backTop
	);

	// Floor.
	fill(floorColor);
	quad(
		backLeft, backBottom,
		backRight, backBottom,
		x + w, y + h,
		x, y + h
	);

	// Floorboards converge toward the center.
	stroke("#5d3f35");
	strokeWeight(2);

	for (let i = 0; i <= 7; i++) {
		let frontX = x + i * w / 7;
		let backX =
			centerX +
			(frontX - centerX) * 0.34;

		line(
			frontX,
			y + h,
			backX,
			backBottom
		);
	}

	for (let i = 1; i < 5; i++) {
		let amount = i / 5;

		let floorY = lerp(
			backBottom,
			y + h,
			amount * amount
		);

		let leftEdge = lerp(
			backLeft,
			x,
			amount
		);

		let rightEdge = lerp(
			backRight,
			x + w,
			amount
		);

		line(
			leftEdge,
			floorY,
			rightEdge,
			floorY
		);
	}

	// Ceiling beams.
	stroke("#17161b");
	strokeWeight(5);

	for (let i = 0; i <= 5; i++) {
		let frontX = x + i * w / 5;

		let backX =
			centerX +
			(frontX - centerX) * 0.34;

		line(
			frontX,
			y,
			backX,
			backTop
		);
	}

	noStroke();
}

function drawLeftRoom() {
	drawRoomBox(
		104,
		266,
		292,
		224,
		"#73784f",
		"#80533b"
	);

	// Bottle shelf.
	fill("#754e37");
	rect(193, 314, 184, 7);

	for (let i = 0; i < 9; i++) {
		let bottleX = 201 + i * 19;
		let bottleHeight = 13 + (i % 3) * 4;

		if (i % 2 === 0) {
			fill("#667153");
		} else {
			fill("#8b5d42");
		}

		rect(
			bottleX,
			314 - bottleHeight,
			9,
			bottleHeight
		);

		rect(
			bottleX + 3,
			296 - (i % 3) * 4,
			3,
			5
		);

		fill("#dec89b");
		rect(bottleX + 1, 304, 7, 5);
	}

	// Menus.
	fill("#d9ba7f");
	rect(116, 356, 164, 37);

	for (let i = 0; i < 3; i++) {
		fill("#f0d8a5");
		rect(
			127 + i * 49,
			364,
			25,
			21
		);

		fill("#946744");
		rect(
			133 + i * 49,
			370,
			12,
			2
		);
	}

	drawChef(336, 365);

	// Sushi display.
	fill("#5a4034");
	rect(114, 393, 178, 25);

	fill("#adb6a5");
	rect(119, 398, 168, 14);

	for (let i = 0; i < 6; i++) {
		if (i % 2 === 0) {
			fill("#cb7b61");
		} else {
			fill("#e0b975");
		}

		rect(
			124 + i * 26,
			405,
			19,
			4
		);
	}

	// Counter top.
	fill("#583a30");
	quad(
		104, 415,
		396, 415,
		382, 436,
		118, 436
	);

	fill("#d4a66b");
	quad(
		111, 417,
		389, 417,
		377, 430,
		123, 430
	);

	// Counter front.
	fill("#774b36");
	quad(
		118, 436,
		382, 436,
		396, 490,
		104, 490
	);

	stroke("#ad744b");
	strokeWeight(2);

	for (let i = 0; i <= 10; i++) {
		line(
			118 + i * 26.4,
			436,
			104 + i * 29.2,
			490
		);
	}

	noStroke();

	drawSushi(247, 425);
	drawCup(220, 428);

	drawCustomer(164, 1, 0);
	drawCustomer(346, -1, 2.5);
}

function drawRightRoom() {
	drawRoomBox(
		566,
		266,
		290,
		224,
		"#777b51",
		"#76503b"
	);

	// Indigo curtains.
	fill("#584735");
	rect(566, 269, 290, 5);

	for (let i = 0; i < 6; i++) {
		if (i % 2 === 0) {
			fill("#354465");
		} else {
			fill("#424f73");
		}

		rect(
			573 + i * 47,
			274,
			40,
			43 + (i % 2) * 3
		);

		fill(132, 141, 167, 35);
		rect(
			579 + i * 47,
			277,
			3,
			35
		);
	}

	// Picture.
	fill("#563d2c");
	rect(681, 326, 60, 72);

	fill("#c4a36d");
	rect(685, 330, 52, 64);

	fill("#a7b09d");
	rect(690, 335, 42, 54);

	fill("#d8c597");
	ellipse(718, 349, 9, 9);

	fill("#68775f");
	triangle(
		690, 378,
		707, 352,
		729, 378
	);

	// Lower wooden wall.
	fill("#72503a");
	rect(566, 442, 290, 48);

	fill("#b58d58");
	rect(566, 438, 290, 5);

	drawTable(668, 448, 85);

	drawCustomer(638, 1, 1.4);
	drawCustomer(788, -1, 4);
}

function drawChef(x, y) {
	let handMove =
		sin(sceneTime * 2.1) * 4;

	noStroke();

	// Jacket.
	fill("#eadcbd");
	ellipse(x, y + 28, 42, 31);
	rect(x - 19, y + 24, 38, 32);

	// Head.
	fill("#d1aa80");
	ellipse(x, y - 3, 27, 34);

	// Hat.
	fill("#f3e5c5");
	rect(x - 15, y - 30, 30, 17);

	fill("#c7b799");
	rect(x - 15, y - 15, 30, 3);

	// Moving arms.
	stroke("#eadcbd");
	strokeWeight(8);

	line(
		x - 14,
		y + 25,
		x - 22,
		y + 46
	);

	line(
		x + 14,
		y + 25,
		x + 20,
		y + 44
	);

	line(
		x - 22,
		y + 46,
		x - 4 + handMove,
		y + 48
	);

	line(
		x + 20,
		y + 44,
		x + 4 + handMove,
		y + 48
	);

	noStroke();
}

function drawCustomer(
	x,
	direction,
	phase
) {
	let breathing =
		sin(sceneTime * 0.8 + phase);

	push();
	translate(x, 0);
	scale(direction, 1);

	noStroke();
	fill("#33282a");

	rect(
		-24,
		424 + breathing,
		47,
		62,
		7
	);

	ellipse(
		0,
		427 + breathing,
		52,
		39
	);

	rect(
		-7,
		397 + breathing,
		14,
		22
	);

	ellipse(
		0,
		384 + breathing,
		35,
		43
	);

	triangle(
		14,
		381 + breathing,
		22,
		388 + breathing,
		14,
		392 + breathing
	);

	stroke("#33282a");
	strokeWeight(12);

	line(
		13,
		425 + breathing,
		30,
		451
	);

	noStroke();
	pop();
}

function drawTable(x, y, w) {
	noStroke();

	// Legs.
	fill("#32252a");

	quad(
		x + 17, y + 6,
		x + 25, y + 6,
		x + 19, y + 43,
		x + 10, y + 43
	);

	quad(
		x + w - 25, y + 6,
		x + w - 17, y + 6,
		x + w - 10, y + 43,
		x + w - 19, y + 43
	);

	// Shadow.
	fill("#3b292b");
	quad(
		x - 11, y + 2,
		x + w + 11, y + 2,
		x + w + 4, y + 12,
		x - 4, y + 12
	);

	// Top plane.
	fill("#d19b61");
	quad(
		x - 7, y - 7,
		x + w + 7, y - 7,
		x + w + 13, y + 3,
		x - 13, y + 3
	);

	// Front edge.
	fill("#88533c");
	quad(
		x - 13, y + 3,
		x + w + 13, y + 3,
		x + w + 9, y + 10,
		x - 9, y + 10
	);

	drawSushi(
		x + w / 2,
		y - 7
	);

	drawCup(
		x + 8,
		y - 5
	);
}

function drawSushi(x, y) {
	noStroke();

	fill("#ead8b0");
	ellipse(x, y, 29, 6);

	fill("#f5e6c0");
	rect(x - 9, y - 6, 18, 5);

	fill("#de9271");
	rect(x - 9, y - 9, 18, 4);
}

function drawCup(x, y) {
	noStroke();

	fill("#eed7a7");
	rect(x - 4, y - 11, 8, 11);

	for (let i = 0; i < 3; i++) {
		let rise =
			(sceneTime * 8 + i * 9) % 27;

		fill(
			255,
			235,
			192,
			(1 - rise / 27) * 100
		);

		ellipse(
			x + sin(sceneTime + i) * 3,
			y - 14 - rise,
			3,
			7
		);
	}
}

// ========================================
// RECESSED WINDOWS
// ========================================

function drawWindowFrame(x, y, w, h) {
	noStroke();

	// Glass.
	fill(26, 31, 29, 58);
	rect(x, y, w, h);

	// Inner shadows.
	fill(18, 15, 20, 130);

	quad(
		x, y,
		x + 18, y + 17,
		x + 18, y + h - 35,
		x, y + h
	);

	quad(
		x + w, y,
		x + w - 18, y + 17,
		x + w - 18, y + h - 35,
		x + w, y + h
	);

	quad(
		x, y,
		x + w, y,
		x + w - 18, y + 17,
		x + 18, y + 17
	);

	// Reflection.
	fill(255, 227, 187, 18);

	quad(
		x + 34, y + 19,
		x + 51, y + 19,
		x + 110, y + h - 35,
		x + 91, y + h - 35
	);

	// Projecting top stone.
	fill("#c3906c");

	quad(
		x - 11, y - 12,
		x + w + 11, y - 12,
		x + w + 5, y - 5,
		x - 5, y - 5
	);

	fill("#75493f");
	rect(
		x - 5,
		y - 5,
		w + 10,
		8
	);

	fill("#30232b");
	rect(x, y + 3, w, 6);

	// Side frames.
	fill("#76503e");
	rect(
		x - 2,
		y + 3,
		8,
		h - 3
	);

	fill("#a66d50");
	rect(
		x + w - 6,
		y + 3,
		8,
		h - 3
	);

	// Center frame.
	let middle = x + w / 2;

	fill("#2a2026");
	rect(
		middle - 6,
		y + 3,
		13,
		h - 3
	);

	fill("#a36a4c");
	rect(
		middle - 4,
		y + 3,
		6,
		h - 3
	);

	// Lower bar.
	fill("#2b2027");
	rect(
		x + 5,
		y + h - 34,
		w - 10,
		10
	);

	fill("#956248");
	rect(
		x + 5,
		y + h - 34,
		w - 10,
		4
	);

	// Deep sill.
	fill("#ded0bb");

	quad(
		x - 12, y + h - 3,
		x + w + 12, y + h - 3,
		x + w + 20, y + h + 10,
		x - 20, y + h + 10
	);

	fill("#776b70");
	rect(
		x - 20,
		y + h + 10,
		w + 40,
		12
	);

	fill("#40333d");
	rect(
		x - 20,
		y + h + 19,
		w + 40,
		5
	);

	if (season === "winter") {
	// Snow on sill.
	fill("#f0e4d0");
	rect(
		x - 13,
		y + h - 8,
		w + 26,
		10
	);
	}
}

// ========================================
// RECESSED DOOR
// ========================================

function drawDoor() {
	noStroke();

	// Back of doorway.
	fill("#211923");

	quad(
		404, 258,
		559, 258,
		537, 531,
		423, 531
	);

	// Recessed ceiling.
	fill("#31232a");

	quad(
		404, 258,
		559, 258,
		531, 280,
		431, 280
	);

	// Left wall.
	fill("#714937");

	quad(
		404, 258,
		431, 280,
		431, 516,
		404, 539
	);

	// Right wall.
	fill("#3d2b31");

	quad(
		531, 280,
		559, 258,
		559, 539,
		531, 516
	);

	// Door frame.
	fill("#3e2b2c");
	rect(427, 273, 108, 250);

	fill("#bc8155");
	rect(437, 282, 87, 224);

	// Warm interior.
	fill("#b98557");
	rect(445, 292, 71, 194);

	// Receding floor.
	fill("#654333");

	quad(
		458, 408,
		502, 408,
		516, 486,
		445, 486
	);

	stroke("#a97953");
	strokeWeight(2);

	line(467, 408, 459, 486);
	line(480, 408, 480, 486);
	line(493, 408, 502, 486);

	noStroke();

	// Glass.
	fill(27, 31, 29, 80);
	rect(445, 292, 71, 194);

	// Door bars.
	fill("#3d2b2b");
	rect(477, 283, 7, 218);
	rect(438, 412, 85, 8);

	// Handle.
	fill("#e4bc75");
	rect(504, 397, 5, 28);

	// OPEN sign.
	fill("#873f45");
	rect(458, 429, 38, 21);

	fill("#f4cc88");
	textAlign(CENTER, CENTER);
	textSize(10);
	text("OPEN", 477, 439);

	// Threshold.
	fill("#b17856");

	quad(
		426, 516,
		538, 516,
		550, 527,
		414, 527
	);

	fill("#49353b");
	rect(414, 527, 136, 12);

	fill("#786068");

	quad(
		414, 539,
		550, 539,
		561, 548,
		403, 548
	);
}

// ========================================
// LARGE 3D ROOF AND SIGN
// ========================================

function drawRoofAndSign() {
	noStroke();

	// Roof shadow.
	fill(17, 14, 20, 175);

	quad(
		72, 117,
		896, 117,
		919, 219,
		42, 219
	);

	// Upper roof plane.
	fill("#4c8179");

	quad(
		91, 69,
		869, 69,
		914, 119,
		46, 119
	);

	// Back ridge.
	fill("#172a31");

	quad(
		91, 69,
		869, 69,
		860, 78,
		100, 78
	);

	// Sloping roof front.
	fill("#28515a");

	quad(
		46, 119,
		914, 119,
		894, 204,
		66, 204
	);

	// Side faces.
	fill("#172830");

	quad(
		46, 119,
		66, 204,
		51, 215,
		35, 130
	);

	fill("#41716c");

	quad(
		914, 119,
		925, 130,
		909, 215,
		894, 204
	);

	// Tile rows.
	stroke("#15333d");
	strokeWeight(3);

	for (let row = 0; row < 4; row++) {
		line(
			51 + row * 4,
			137 + row * 18,
			909 - row * 4,
			137 + row * 18
		);
	}

	// Tile seams.
	for (let x = 76; x < 910; x += 42) {
		line(
			x,
			201,
			x + (480 - x) * 0.045,
			121
		);
	}

	noStroke();

	// Roof highlights.
	for (let x = 78; x < 896; x += 42) {
		fill("#4b7772");
		rect(x, 142, 24, 4);
	}

	// Underside.
	fill("#11171d");

	quad(
		66, 204,
		894, 204,
		913, 220,
		48, 220
	);

	// Wooden beam.
	fill("#704a38");
	rect(55, 210, 850, 8);

	for (let x = 75; x < 900; x += 68) {
		fill("#2a2025");

		quad(
			x, 204,
			x + 11, 204,
			x + 17, 220,
			x + 5, 220
		);
	}

	// Snow upper plane.
	fill(season === "winter" ? "#f0e7da" : "#66818a");

	quad(
		89, 61,
		871, 61,
		900, 85,
		62, 85
	);

	// Snow front edge.
	fill(season === "winter" ? "#b8b7b8" : "#364c59");

	quad(
		62, 85,
		900, 85,
		914, 99,
		47, 99
	);

	fill(season === "winter" ? "#f7eee0" : "#829aa0");
	rect(70, 78, 820, 12);

	// Sign shadow.
	fill("#211922");
	rect(45, 220, 870, 52);

	// Sign top plane.
	fill("#a47652");

	quad(
		51, 215,
		909, 215,
		900, 224,
		59, 224
	);

	// Sign front.
	fill("#dfc27f");
	rect(55, 224, 850, 39);

	// Sign side faces.
	fill("#694137");

	quad(
		45, 220,
		55, 224,
		55, 263,
		45, 270
	);

	fill("#936047");

	quad(
		905, 224,
		915, 220,
		915, 270,
		905, 263
	);

	// Sign text.
	fill("#282238");
	textAlign(CENTER, CENTER);
	textSize(25);

	text(
		"RAN ZAN JAPANESE RESTAURANT",
		480,
		243
	);

	// Lower molding.
	fill("#59382f");

	quad(
		45, 270,
		915, 270,
		905, 279,
		55, 279
	);

	fill("#251b21");
	rect(55, 279, 850, 6);
}

// ========================================
// DECORATIONS
// ========================================

function drawDecorations() {
	drawTileStrip(82, 284, 14);
	drawTileStrip(401, 284, 14);
	drawTileStrip(542, 284, 14);
	drawTileStrip(863, 284, 14);

	drawPlanter(93, 527, 1);
	drawPlanter(405, 537, -1);
	drawPlanter(555, 537, 1);
	drawPlanter(869, 527, -1);
}

function drawTileStrip(
	x,
	y,
	numberOfTiles
) {
	let colors = [
		"#bd4756",
		"#3f8768",
		"#385f78",
		"#d58b54"
	];

	noStroke();

	for (let i = 0; i < numberOfTiles; i++) {
		let tileY = y + i * 15;

		fill("#211a25");
		rect(x, tileY, 15, 15);

		fill(colors[i % colors.length]);
		rect(x + 2, tileY + 2, 11, 11);

		fill("#e7bf6b");

		quad(
			x + 7, tileY + 3,
			x + 12, tileY + 7,
			x + 7, tileY + 12,
			x + 3, tileY + 7
		);
	}
}

function drawPlanter(
	x,
	y,
	direction
) {
	push();
	translate(x, y);
	scale(direction, 1);

	noStroke();

	fill("#1d1820");
	rect(-18, -19, 36, 27);

	fill("#984550");
	rect(-14, -15, 28, 17);

	stroke("#315d39");
	strokeWeight(6);

	line(0, -18, 0, -66);
	line(-2, -43, -24, -70);
	line(2, -39, 24, -64);
	line(0, -57, 15, -85);

	noStroke();

	let leaves = [
		[-25, -72],
		[-16, -59],
		[-7, -49],
		[13, -87],
		[21, -66],
		[12, -53],
		[29, -61],
		[3, -70],
		[-3, -82]
	];

	for (let i = 0; i < leaves.length; i++) {
		let leafX = leaves[i][0];
		let leafY = leaves[i][1];

		if (i % 3 === 0) {
			fill("#75a94e");
		} else {
			fill("#447b48");
		}

		quad(
			leafX - 9, leafY,
			leafX, leafY - 7,
			leafX + 11, leafY,
			leafX, leafY + 7
		);
	}

	if (season === "winter") {
		fill("#eee3cf");
		rect(5, -92, 18, 5);
	}

	pop();
}

// ========================================
// FOREGROUND SNOW
// ========================================

function drawSnowbanks() {
	noStroke();

	fill("#b6aaaa");

	beginShape();
	vertex(0, 532);
	vertex(80, 516);
	vertex(160, 526);
	vertex(245, 514);
	vertex(335, 527);
	vertex(414, 519);
	vertex(422, 557);
	vertex(0, 557);
	endShape(CLOSE);

	fill("#f1e4d1");

	beginShape();
	vertex(0, 524);
	vertex(80, 510);
	vertex(160, 519);
	vertex(245, 508);
	vertex(335, 520);
	vertex(414, 514);
	vertex(420, 548);
	vertex(0, 550);
	endShape(CLOSE);

	fill("#f1e4d1");

	beginShape();
	vertex(542, 543);
	vertex(560, 521);
	vertex(650, 514);
	vertex(734, 522);
	vertex(818, 510);
	vertex(900, 520);
	vertex(960, 511);
	vertex(960, 552);
	vertex(542, 552);
	endShape(CLOSE);
}

// ========================================
// DOG
// ========================================

function drawDog() {
	let tail =
		sin(sceneTime * 4) * 6;

	push();
	translate(830, 587);

	noStroke();

	// Shadow.
	fill(49, 36, 42, 40);
	ellipse(0, 3, 105, 13);

	// Body.
	fill("#30282f");
	ellipse(0, -37, 70, 35);
	ellipse(-25, -43, 31, 36);

	// Head.
	ellipse(-34, -61, 31, 29);

	// Nose.
	rect(-60, -65, 29, 12, 4);

	// Ears.
	triangle(
		-45, -72,
		-39, -92,
		-29, -69
	);

	triangle(
		-31, -73,
		-19, -87,
		-18, -62
	);

	// Legs.
	rect(-27, -32, 9, 31);
	rect(-7, -30, 9, 29);
	rect(18, -29, 9, 28);
	rect(31, -29, 9, 28);

	// Wagging tail.
	stroke("#30282f");
	strokeWeight(8);
	noFill();

	beginShape();
	vertex(29, -43);
	vertex(43, -50);
	vertex(50 + tail, -68);
	endShape();

	pop();
}

// ========================================
// WALKING PERSON
// ========================================

function drawWalker() {
	let progress =
		(sceneTime % 35) / 35;

	let x = -150 +
		progress * (width + 350);

	let walking = sceneTime * 4;

	let bob =
		cos(walking * 2) * 1.5;

	let leftFoot =
		sin(walking) * 15;

	let rightFoot = -sin(walking) * 15;

	push();
	translate(x, 590);

	stroke("#30282f");
	strokeWeight(12);

	line(
		-9,
		-42 + bob,
		leftFoot - 9,
		-4
	);

	line(
		10,
		-42 + bob,
		rightFoot + 9,
		-4
	);

	noStroke();
	fill("#30282f");

	// Coat.
	quad(
		-20, -113 + bob,
		19, -113 + bob,
		29, -39 + bob,
		-27, -39 + bob
	);

	// Shoulders.
	ellipse(
		0,
		-108 + bob,
		42,
		31
	);

	// Neck and head.
	rect(
		-6,
		-130 + bob,
		14,
		20
	);

	ellipse(
		1,
		-146 + bob,
		31,
		38
	);

	// Hat.
	rect(
		-16,
		-164 + bob,
		34,
		15,
		8
	);

	pop();
}

// ========================================
// FALLING SNOW
// ========================================

function drawSnow(seconds) {
	noStroke();

	for (let flake of snowflakes) {
		if (!paused) {
			flake.y +=
				flake.speed * seconds;

			flake.x +=
				(
					5 +
					sin(
						sceneTime +
						flake.wiggle
					) * 8
				) * seconds;

			if (flake.y > height + 10) {
				flake.y = -10;
			}

			if (flake.x > width + 10) {
				flake.x = -10;
			}
		}

		fill(249, 237, 219, 210);

		ellipse(
			flake.x,
			flake.y,
			flake.size,
			flake.size * 0.85
		);
	}
}

// ========================================
// PIXEL-ART FILTER
// ========================================

function makePixelArt() {
	pixelCanvas.clear();

	pixelCanvas.drawingContext
		.imageSmoothingEnabled = false;

	pixelCanvas.drawingContext.drawImage(
		mainCanvas.elt,
		0,
		0,
		width,
		height,
		0,
		0,
		pixelCanvas.width,
		pixelCanvas.height
	);

	drawingContext.imageSmoothingEnabled = false;

	image(
		pixelCanvas,
		0,
		0,
		width,
		height
	);
}

// Click the canvas to pause or continue.
function mousePressed() {
	if (
		mouseX >= 0 &&
		mouseX <= width &&
		mouseY >= 0 &&
		mouseY <= height
	) {
		paused = !paused;
	}
}

function drawRoofSnowTexture() {
	noStroke();

	// Cool shadow beneath the snow cap.
	fill("#9da7ad");
	quad(
		48, 92,
		913, 92,
		905, 101,
		57, 101
	);

	// Uneven snow hanging over the roof.
	fill("#d8d7d3");
	rect(75, 87, 95, 9);
	rect(198, 87, 72, 6);
	rect(315, 87, 112, 10);
	rect(471, 87, 71, 7);
	rect(585, 87, 129, 9);
	rect(754, 87, 106, 7);

	// Bright rounded snow clumps.
	fill("#fff8e9");
	ellipse(112, 77, 91, 17);
	ellipse(215, 75, 118, 20);
	ellipse(356, 77, 136, 18);
	ellipse(511, 75, 119, 21);
	ellipse(657, 77, 143, 18);
	ellipse(808, 76, 125, 20);

	// Blue-gray shadow pockets.
	fill("#c4cbd0");
	ellipse(151, 86, 45, 7);
	ellipse(292, 87, 66, 8);
	ellipse(455, 86, 48, 7);
	ellipse(604, 87, 72, 8);
	ellipse(767, 86, 53, 7);

	// Wind-carved marks.
	fill("#d4dde0");
	rect(103, 68, 72, 3);
	rect(252, 72, 49, 3);
	rect(394, 66, 95, 3);
	rect(556, 71, 62, 3);
	rect(704, 67, 91, 3);

	// Fixed pixel texture.
	// These positions do not change, so they will not flicker.
	for (let i = 0; i < 75; i++) {
		let x = 75 + (i * 97) % 810;
		let y = 64 + (i * 31) % 24;

		if (i % 3 === 0) {
			fill("#ffffff");
		} else {
			fill("#c9d0d3");
		}

		rect(
			x,
			y,
			3 + (i % 2) * 3,
			3
		);
	}

	// Blocky icicles.
	fill("#cbd4d8");
	rect(132, 94, 7, 14);
	rect(404, 95, 6, 10);
	rect(725, 94, 8, 15);
	rect(834, 95, 6, 11);

	fill("#eef4f2");

	triangle(
		132, 108,
		139, 108,
		135, 117
	);

	triangle(
		725, 109,
		733, 109,
		729, 120
	);
}

function drawFrontSnowTexture() {
	noStroke();

	// Broad shadows underneath the raised snowbanks.
	fill(145, 149, 159, 115);
	ellipse(82, 541, 145, 22);
	ellipse(247, 540, 176, 20);
	ellipse(646, 540, 174, 22);
	ellipse(845, 539, 205, 24);

	// Smaller shadow pockets.
	fill("#c2c4ca");
	ellipse(47, 527, 72, 12);
	ellipse(178, 528, 87, 11);
	ellipse(326, 529, 80, 12);
	ellipse(600, 529, 83, 11);
	ellipse(748, 528, 96, 13);
	ellipse(905, 527, 83, 12);

	// Bright upper lumps.
	fill("#fff8e9");
	ellipse(48, 518, 96, 19);
	ellipse(157, 517, 104, 18);
	ellipse(280, 520, 112, 19);
	ellipse(628, 518, 118, 18);
	ellipse(765, 517, 124, 21);
	ellipse(900, 517, 121, 19);

	// Long wind-swept ridges.
	fill("#ece5dc");
	rect(18, 568, 173, 5);
	rect(222, 581, 139, 4);
	rect(421, 563, 102, 4);
	rect(572, 577, 164, 5);
	rect(777, 566, 153, 4);

	// Cool shadows below the ridges.
	fill("#b9bac2");
	rect(31, 573, 132, 3);
	rect(245, 585, 91, 3);
	rect(594, 582, 118, 3);
	rect(799, 570, 103, 3);

	// Grainy pixel texture.
	for (let i = 0; i < 135; i++) {
		let x = 12 + (i * 83) % 936;
		let y = 520 + (i * 47) % 83;

		if (i % 4 === 0) {
			fill(255, 250, 239, 190);
		} else if (i % 4 === 1) {
			fill(177, 184, 192, 120);
		} else {
			fill(218, 214, 211, 135);
		}

		rect(
			x,
			y,
			3 + (i % 3),
			3
		);
	}

	// Footprints near the entrance.
	for (let i = 0; i < 5; i++) {
		let footprintX;

		if (i % 2 === 0) {
			footprintX = 479 - 8;
		} else {
			footprintX = 479 + 8;
		}

		let footprintY = 553 + i * 10;

		// Dark compressed part.
		fill(119, 111, 122, 65);
		ellipse(
			footprintX,
			footprintY,
			9,
			14
		);

		// Light snow inside the footprint.
		fill(235, 226, 216, 120);
		ellipse(
			footprintX + 1,
			footprintY - 2,
			5,
			8
		);
	}
}
