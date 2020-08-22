
/**
 * Returns array of 3 numbers; R, G, B.
 * @param {!number} f Faction
 * @return {!Array<number, number, number>}
 */
export function teamGetColor(f) {
	switch (f) {
		case 0: return [100, 100, 100];
		case 1: return [0, 255, 0];
		case 2: return [255, 0, 0];
		case 3: return [0, 0, 255];
		case 4: return [255, 255, 0];
		default: return [0, 0, 0];
	}
}

/**
 * Returns a CSS color string.
 * @param {!number} f Faction
 * @param {!number} a Alpha
 * @return {!string}
 */
export function teamGetColorAsCss(f, a) {
	return `rgba(${teamGetColor(f).toString()},${a})`;
}

/**
 * @param {!number} f Faction
 * @return {!string}
 */
export function teamGetName(f) {
	switch (f) {
		case 0: return 'neutral';
		case 1: return 'green';
		case 2: return 'red';
		case 3: return 'blue';
		case 4: return 'yellow';
		default: return 'UNKNOWN';
	}
}
