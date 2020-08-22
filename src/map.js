import { NODE, NODE_DISTANCE } from './constants.js';
import { Node } from './Node.js';
import { levels } from './levels.js';

/**
 * @param {!number} index
 */
export function mapLoad(index) {
	levels[index].forEach(n => new Node(...n))
}

/**
 * TODO Restrict to a certain shape/region (such as fixed screen area)
 * @param {!number} size How many Nodes should be present in the generated map.
 */
export function generateMap(size) {
	let x = 0, y = 0;
	while (Node.instances.length < size) {

		// create a new node if there isn't already one here
		if (Node.getNodeAtPosition(x, y) === null)
			new Node(NODE.BASIC, x, y);

		// move
		x += (~~(Math.random() * 3) - 1);
		y += (~~(Math.random() * 3) - 1);

	}
}

/**
 * TODO Select starting nodes as far apart as possible for X players.
 * @param {!number} p Number of players to place.
 */
export function placeStartLocations(p) {
	const instances = Node.instances;
	const length = instances.length;
	for (let pos, n = 1; n <= p; n++) {
		console.log(n);
		do pos = ~~(Math.random() * length);
		while (instances[pos].owner !== 0)
		instances[pos].owner = n;
		instances[pos].size = 20;
		instances[pos].units = 20;
		instances[pos].capacity = 20 * 2 + 1;
	}
}
