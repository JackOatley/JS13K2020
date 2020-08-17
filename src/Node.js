import { TAU, NODE_DISTANCE } from './constants.js';
import { log } from './dev.js';
import {
	distanceBetweenPoints,
	angleBetweenPoints,
	linesIntersect
} from './math.js';

const connections = [];

const factionColors = [
	'#666',
	'#0F0',
	'#F00',
	'#00B'
]

export class Node {

	/**
	 * @param {!number} type
	 * @param {!number} x
	 * @param {!number} y
	 */
	constructor(type, x, y) {
		this.type = type;
		this.x = x * NODE_DISTANCE;
		this.y = y * NODE_DISTANCE;
		this.owner = 0;
		this.size = 10 + ~~(Math.random() * 10);
		this.units = ~~(Math.random() * this.size * 2 + 1);
		this.links = [];
		Node.instances.push(this);
	}

	/**
	 * @param {!number} dt
	 */
	update(dt) {

	}

	/**
	 * @param {!CanvasRenderingContext2D} ctx
	 * @param {!number} dt
	 */
	draw(ctx, dt) {
		const { x, y, size, units } = this;

		ctx.beginPath();
		ctx.arc(x, y, units/2, 0, TAU);

		ctx.fillStyle = factionColors[this.owner];
		ctx.fill();

		ctx.beginPath();
		ctx.arc(x, y, size, 0, TAU);
		ctx.strokeStyle = '#FFF';
		ctx.stroke();
	}

	/**
	 * Create links between all valid nodes.
	 * @return {void}
	 */
	static autoConnect() {
		Node.instances.forEach(a => {
			Node.instances.forEach(b => {
				if (a === b) return;
				if (distanceBetweenPoints(a, b) <= NODE_DISTANCE * 1.5) {

					let intersect = false;
					a.links.forEach(l => {
						l.links.forEach(m => {
							if (linesIntersect(a.x, a.y, b.x, b.y, l.x, l.y, m.x, m.y)) {
								console.log("intersect!");
								intersect = true;
							}
						});

					});

					//linesIntersect(a.x, a.y, b.x, b.y);
					if (!intersect)
						a.links.push(b);
				}
			});
			//log(a.links);
		});
	}

	/**
	 * @param {!CanvasRenderingContext2D} ctx
	 * @param {!number} dt
	 */
	static drawNodes(ctx, dt) {
		Node.instances.forEach(i => i.draw(ctx, dt));
	}

	/**
	 * Cache connections so we don't draw twice and they're quicker to access.
	 */
	static cacheConnections() {
		const done = [];
		Node.instances.forEach(a => {
			a.links.forEach(b => {
				const key1 = `${a.x},${a.y},${b.x},${b.y}`;
				const key2 = `${b.x},${b.y},${a.x},${a.y}`;
				if (!done.includes(key1) && !done.includes(key2)) {
					const angle = angleBetweenPoints(a, b);
					const x1 = a.x + Math.cos(angle) * a.size;
					const y1 = a.y + Math.sin(angle) * a.size;
					const x2 = b.x - Math.cos(angle) * b.size;
					const y2 = b.y - Math.sin(angle) * b.size;
					connections.push(x1, y1, x2, y2);
					done.push(key1, key2);
				}
			});
		});
	}

	/**
	 * @param {!CanvasRenderingContext2D} ctx
	 * @param {!number} dt
	 */
	static drawConnections(ctx, dt) {
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#FFF';
		ctx.setLineDash([4, 4]);
		const length = connections.length;
		for (let n = 0; n < length; n += 4) {
			ctx.beginPath();
			ctx.moveTo(connections[n], connections[n+1]);
			ctx.lineTo(connections[n+2], connections[n+3]);
			ctx.stroke();
		}
		ctx.setLineDash([]);
	}

	/**
	 * Returns the average position of all nodes.
	 * @return {!Array<number>}
	 */
	static centerOfMass() {
		let x = 0, y = 0;
		Node.instances.forEach(i => {
			x += i.x;
			y += i.y;
		});
		x /= Node.instances.length;
		y /= Node.instances.length;
		return [x, y];
	}

	/**
	 * @param {!number} x
	 * @param {!number} y
	 * @return {?Node}
	 */
	static getNodeAtPosition(x, y) {
		let length = Node.instances.length;
		for (let n = 0; n < length; n++) {
			const node = Node.instances[n];
			if (node.x === x * NODE_DISTANCE && node.y === y * NODE_DISTANCE) {
				return node;
			}
		}
		return null;
	}

}

Node.instances = [];
