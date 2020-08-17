import { NODE } from './constants.js';
import { Node } from './Node.js';
import { levels } from './levels.js';

export function mapLoad(index) {
	const level = levels[index];
	level.forEach(n => new Node(...n))
}
