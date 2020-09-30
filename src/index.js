import { log } from './dev.js';
import { gameSetup, gameUpdate, gameDraw } from './game.js';
import { canvasToWindowSize, canvasClear } from './canvas.js';
import { keyboard, mouse } from './input.js';
import { MAX_FPS } from './constants.js';

const canvas = /** @type {!HTMLCanvasElement} */ (document.getElementById('canvas'));
const ctx = /** @type {!CanvasRenderingContext2D}*/ (canvas.getContext('2d'));

//
function setup() {
	keyboard.init();
	mouse.init();
	gameSetup();
}

//
function update() {
	canvasToWindowSize(canvas);
	gameUpdate();
	keyboard.update();
	mouse.update();
}

//
function draw() {
	canvasClear(ctx, '#000');
	gameDraw(ctx);
}

// game loop
setup();
let pDelta = 0;
(function main(time) {

	const delta = time - pDelta;
	if (delta >= 1000 / MAX_FPS) {
		pDelta = delta;
		update();
		draw();
	}

	requestAnimationFrame(main);

})(0);
