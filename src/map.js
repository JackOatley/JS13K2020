import { NODE, NODE_DISTANCE } from './constants.js';
import { Node } from './Node.js';
import { levels } from './levels.js';

/**
 * @param {!number} index
 * @return {void}
 */
export function mapLoad(index) {
	const level = levels[index];
	level.forEach(n => new Node(...n))
}

/**
 * TODO Restrict to a certain shape/region (such as fixed screen area)
 * @param {!number} size How many Nodes should be present in the generated map.
 */
export function generateMap(size) {
	let x = 0, y = 0;
	while (Node.instances.length < size) {

		// create a new node if there isn't already one here
		if (Node.getNodeAtPosition(x, y) === null) {
			new Node(NODE.BASIC, x, y);
		}

		// move
		if (Math.random() < 0.5)
			x += (~~(Math.random() * 3) - 1);
		else
			y += (~~(Math.random() * 3) - 1);

	}
}

/**
 * TODO Select starting nodes as far apart as possible for X players.
 * @param {!number} p Number of players to place.
 */
export function placeStartLocations(p) {
	const length = Node.instances.length;
	const pos1 = ~~(Math.random() * length);
	const pos2 = ~~(Math.random() * length);
	Node.instances[pos1].owner = 1;
	Node.instances[pos2].owner = 2;
}
