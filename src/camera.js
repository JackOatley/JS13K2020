import { keyboard } from './input.js';

export const camera = {

	x: 0,
	y: 0,
	w: 0,
	h: 0,
	z: 1,
	speed: 8,

	/**
	 * @param {!number} x
	 * @param {!number} y
	 */
	setPosition(x, y) {
		camera.x = x;
		camera.y = y;
	},

	/**
	 *
	 */
	update() {
		if (keyboard.down['w']) camera.y -= camera.speed;
		if (keyboard.down['a']) camera.x -= camera.speed;
		if (keyboard.down['s']) camera.y += camera.speed;
		if (keyboard.down['d']) camera.x += camera.speed;
	}

}
