import { TAU, NODE_DISTANCE } from './constants.js';
import { log } from './dev.js';
import { distanceBetweenPoints } from './math.js';

export class Node {

	/**
	 * @param {!number} type
	 * @param {!number} x
	 * @param {!number} y
	 */
	constructor(type, x, y) {
		log(type, x, y);
		this.type = type;
		this.x = x * NODE_DISTANCE;
		this.y = y * NODE_DISTANCE;
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
		const { x, y } = this;
		ctx.fillStyle = '#FFF';
		ctx.beginPath();
		ctx.arc(x, y, 16, 0, TAU);
		ctx.fill();
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
					a.links.push(b);
				}
			});
			log(a.links);
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
	 * @param {!CanvasRenderingContext2D} ctx
	 * @param {!number} dt
	 */
	static drawConnections(ctx, dt) {
		ctx.strokeStyle = '#FFF';
		Node.instances.forEach(i => {
			i.links.forEach(l => {
				ctx.beginPath();
				ctx.moveTo(i.x, i.y);
				ctx.lineTo(l.x, l.y);
				ctx.stroke();
			});
		});
	}

	/**
	 * Returns the average position of all nodes.
	 * @return {!number}
	 */
	static centerOfMass() {
		let x = 0, y = 0;
		Node.instances.forEach(i => {
			x += i.x;
			y += i.y;
		});
		x /= Node.instances.length;
		y /= Node.instances.length;
		return {x, y};
	}

}

Node.instances = [];
