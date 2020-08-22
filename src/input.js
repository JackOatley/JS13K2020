import { camera } from './camera.js';

const canvas = document.getElementById('canvas');
canvas.addEventListener('contextmenu', e => e.preventDefault());

export const keyboard = {
	pressed: {},
	released: {},
	down: {},
	init: () => {
		document.addEventListener('keydown', e => {
			const key = e.key.toLowerCase();
			if (!keyboard.down[key]) {
				keyboard.pressed[key] = true;
				keyboard.down[key] = true;
			}
		});
		document.addEventListener('keyup', e => {
			const key = e.key.toLowerCase();
			if (keyboard.down[key]) {
				keyboard.released[key] = true;
				keyboard.down[key] = false;
			}
		});
	},
	update: () => {
		for (const p in keyboard.down) {
			keyboard.pressed[p] = false;
			keyboard.released[p] = false;
		}
	}
}

export const mouse = {
	x: 0,
	y: 0,
	guix: 0,
	guiy: 0,
	pressed: [],
	released: [],
	down: [],
	init: () => {
		canvas.addEventListener('mousemove', e => {
			mouse.guix = e.offsetX;
			mouse.guiy = e.offsetY;
			mouse.x = e.offsetX + camera.x - canvas.width / 2;
			mouse.y = e.offsetY + camera.y - canvas.height / 2;
		});
		canvas.addEventListener("mousedown", e => {
			if (!mouse.down[e.which]) {
				mouse.pressed[e.which] = true;
				mouse.down[e.which] = true;
			}
		});
		canvas.addEventListener("mouseup", e => {
			if (mouse.down[e.which]) {
				mouse.released[e.which] = true;
				mouse.down[e.which] = false;
			}
		});
	},
	update: () => {
		for (let n = 0; n < mouse.pressed.length; n++) {
			mouse.pressed[n] = false;
			mouse.released[n] = false;
		}
	}
}
