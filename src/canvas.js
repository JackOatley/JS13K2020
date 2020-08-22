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

/**
 * Draw a rect with rounded corners.
 * @param {!CanvasRenderingContext2D} ctx
 */
export function roundRect(ctx, x, y, w, h, r) {
  if (w < 2 * r) r = w / 2;
  if (h < 2 * r) r = h / 2;
  ctx.beginPath();
  ctx.moveTo(x+r, y);
  ctx.arcTo(x+w, y,   x+w, y+h, r);
  ctx.arcTo(x+w, y+h, x,   y+h, r);
  ctx.arcTo(x,   y+h, x,   y,   r);
  ctx.arcTo(x,   y,   x+w, y,   r);
  ctx.closePath();
}
