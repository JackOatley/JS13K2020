import { log } from './dev.js';
import { gameSetup, gameUpdate, gameDraw } from './game.js';
import { canvasToWindowSize, canvasClear } from './canvas.js';
import { keyboard, mouse } from './input.js';

const canvas = document.getElementById('canvas');
const ctx = canvas.getContext('2d');

//
function setup() {
	keyboard.init();
	mouse.init();
	gameSetup();
}

//
function update(dt) {
	canvasToWindowSize(canvas);
	gameUpdate(dt);
	keyboard.update();
	mouse.update();
}

//
function draw(dt) {
	canvasClear(ctx, '#000');
	gameDraw(ctx, dt);
}

// game loop
setup();
let dt, lastTime = 0;
(function main(time) {
	dt = time - lastTime;
	lastTime = time;
	update(dt);
	draw(dt);
	requestAnimationFrame(main);
})();
