import { log } from './dev.js';

/**
 * @param {!HTMLCanvasElement} canvas
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
 * @param {!CanvasRenderingContext2D} ctx
 * @param {!string} color CSS Color, gradient, pattern, etc.
 */
export function canvasClear(ctx, color) {
	ctx.fillStyle = color;
	ctx.fillRect(0, 0, ctx.canvas.width, ctx.canvas.height);
}
