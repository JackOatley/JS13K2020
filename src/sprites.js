import { TAU } from './math.js';

/**
 * @param {!number} w Width
 * @param {!number} h Height
 * @param {!number} x X origin
 * @param {!number} y Y origin
 * @param {!Function} draw Callback for drawing
 * @return {!Object} New sprite object
 */
function newSprite(w, h, x, y, draw) {
	const canvas = document.createElement('canvas');
	canvas.width = w;
	canvas.height = h;
	draw(canvas.getContext('2d'));
	return {
		canvas: canvas,
		w: w,
		h: h,
		x: x,
		y: y
	};
}

function newCircle(r, c) {
	return newSprite(r*2, r*2, r, r, ctx => {
		ctx.fillStyle = c;
		ctx.beginPath();
		ctx.arc(r, r, r, 0, TAU);
		ctx.fill();
	});
}

export function drawSprite(ctx, sprite, dx, dy, scale) {
	const {canvas, x, y, w, h} = sprite;
	ctx.drawImage(canvas, dx-x*scale, dy-y*scale, w*scale, h*scale);
}

export const ringSprite = newSprite(70, 70, 35, 35, ctx => {
	ctx.strokeStyle = '#FFF';
	ctx.lineWidth = 4;
	ctx.beginPath();
	ctx.arc(35, 35, 32, 0, TAU);
	ctx.stroke();
});

export const circles = [
	newCircle(16, 'rgb(50,50,50)'),
	newCircle(16, 'rgb(0,255,0)'),
	newCircle(16, 'rgb(255,0,0)'),
	newCircle(16, 'rgb(0,0,255)'),
	newCircle(16, 'rgb(255,255,0)')
];

export const unitSprite = [
	newCircle(2, 'rgb(50,50,50)'),
	newCircle(2, 'rgb(0,255,0)'),
	newCircle(2, 'rgb(255,0,0)'),
	newCircle(2, 'rgb(0,0,255)'),
	newCircle(2, 'rgb(255,255,0)')
];
