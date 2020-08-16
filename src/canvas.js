import { log } from './dev.js';

/**
 *
 */
export function canvasToWindowSize(canvas) {
	if (canvas.width !== window.innerWidth
	||  canvas.height !== window.innerHeight) {
		log('resizing', window.innerWidth, window.innerHeight);
		canvas.width = window.innerWidth;
		canvas.height = window.innerHeight;
	}
}

/**
 *
 */
export function canvasClear(ctx, color) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
