import { TAU } from './constants.js';
import { angleBetweenPoints, angleDifference, distanceBetweenPoints } from './math.js';
import { drawSprite, unitSprite } from './sprites.js';

const unitInstancesByOwner = [[],[],[],[],[]];

/**
 *
 */
export function unitCreate(x1, y1, x2, y2, owner) {
	const angle = Math.random() * TAU;
	const unit = { x: x1, y: y1, to: {x: x2, y: y2}, angle: angle, owner: owner };
	unitInstancesByOwner[owner].push(unit);
	return unit;
}

/**
 *
 */
export function unitDestroy(unit) {
	const arr = unitInstancesByOwner[unit.owner];
	const length = arr.length;
	const last = arr[length-1];
	const i = arr.indexOf(unit);
	arr[i] = last;
	arr.length--;
}

/**
 *
 */
export function unitUpdateAll() {
	const length = unitInstancesByOwner.length;
	for (let n = 1; n < length; n++) {
		const sprite = unitSprite[n];
		const instances = unitInstancesByOwner[n];
		let il = instances.length;
		for (let n = 0; n < il; n++) {
			const i = instances[n];
			const a = angleBetweenPoints(i, i.to);
			i.angle -= angleDifference(i.angle, a) / 10;
			i.x += Math.cos(i.angle) * 2;
			i.y += Math.sin(i.angle) * 2;
			if (distanceBetweenPoints(i, i.to) < 2) {
				unitDestroy(i);
				n--;
				il = instances.length;
			}
		}
	}
}

/**
 *
 */
export function unitDrawAll(ctx) {
	const length = unitInstancesByOwner.length;
	for (let n = 1; n < length; n++) {
		const sprite = unitSprite[n].canvas;
		const instances = unitInstancesByOwner[n];
		const il = instances.length;
		for (let p = 0; p < il; p++) {
			const i = instances[p];
			ctx.drawImage(sprite, i.x, i.y);
		}
	}
}
