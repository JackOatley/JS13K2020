// numbers
export const PI = Math.PI;
export const TAU = PI * 2;

export function lerp(a, b, t) {
	return (1 - t) * a + t * b;
}

export function angleBetweenPoints(a, b) {
	return Math.atan2(b.y - a.y, b.x - a.x);
}

export function distanceBetweenPoints(a, b) {
	return Math.sqrt(Math.pow(b.x - a.x, 2) + Math.pow(b.y - a.y, 2));
}

/**
 * @param {!number} a
 * @param {!number} b
 * @return {!number}
 */
export function angleDifference(a, b) {
	return mod((a - b) + PI, TAU) - PI;
}

/**
 * @param {!number} a
 * @param {!number} n
 * @return {!number}
 */
function mod(a, n) {
	return a - Math.floor(a / n) * n;
}

/**
 * Source: https://stackoverflow.com/questions/9043805/test-if-two-lines-intersect-javascript-function
 */
export function linesIntersect(x1, y1, x2, y2, x3, y3, x4, y4) {
	let det, gamma, lambda;
	det = (x2 - x1) * (y4 - y3) - (x4 - x3) * (y2 - y1);
	if (det === 0) {
		return false;
	} else {
		lambda = ((y4 - y3) * (x4 - x1) + (x3 - x4) * (y4 - y1)) / det;
		gamma = ((y1 - y2) * (x4 - x1) + (x2 - x1) * (y4 - y1)) / det;
		return (0 < lambda && lambda < 1) && (0 < gamma && gamma < 1);
	}
};
