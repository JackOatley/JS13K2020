import { mouse } from './input.js';
import {
	TAU, NODE_DISTANCE, NODE_GROWTH, NODE_SPLIT, TURN_COOLDOWN, BALANCE_EFFECT,
	CONNECTIONS_COLOR
} from './constants.js';
import { log } from './dev.js';
import {
	distanceBetweenPoints, angleBetweenPoints, linesIntersect, lerp
} from './math.js';
import { teamGetColorAsCss } from './teams.js';

const subway = false;			// subway mode
const connections = [];

let id = 0;
let turnTimer = 0;
let aiTurn = 0;

export class Node {

	/**
	 * @param {!number} type
	 * @param {!number} x
	 * @param {!number} y
	 */
	constructor(type, x, y) {
		this.id = id++;
		this.type = type;
		this.x = x * NODE_DISTANCE;
		this.y = y * NODE_DISTANCE;
		this.owner = 0;
		this.size = 10 + ~~(Math.random() * 10);
		this.capacity = this.size * 2 + 1;
		this.units = ~~(Math.random() * this.capacity);
		this.links = [];
		this.target = null;
		this.mouseOver = false;
		this.selected = false;
		Node.instances.push(this);
	}

	/**
	 * @param {!number} dt
	 */
	update(dt) {

		this.mouseOver = distanceBetweenPoints(this, mouse) < NODE_DISTANCE / 2;

		// selecte a node
		if (mouse.pressed[1])
			if (this.selected = this.mouseOver)
				Node.selected = this;

		// target another node
		if (mouse.pressed[3] && this.mouseOver)
			if (Node.selected && Node.selected.links.includes(this))
				Node.selected.target = this;
			else if (Node.selected === this)
				this.target = null;

	}

	/**
	 *
	 */
	takeTurn() {

		// ai
		if (this.owner > 1) {
			this.target = null;
			this.links.forEach(i => {

				// attack
				if (i.owner !== this.owner && i.units < this.units) {
					this.target = i;
				}

				if (this.target) return;

				// transfer
				if (i.owner === this.owner
				&& i.units < i.capacity
				&& i.target !== this) {
					this.target = i;
				}

			})
		}

		if (this.owner !== 0) {

			// grow units
			if (this.units < this.capacity)
				this.units += NODE_GROWTH;

			// transfer to target
			if (this.target) {

				// transfer to friendly
				if (this.target.owner === this.owner) {
					const max = this.target.capacity - this.target.units;
					const move = Math.min(max, ~~this.units / NODE_SPLIT);
					this.units -= move;
					this.target.units += move;
				}

				// attack
				else if (this.units > 2) {
					const force = ~~this.units / NODE_SPLIT;
					const balance = force / this.target.units;
					const adjusted = lerp(1, balance, BALANCE_EFFECT);
					this.units -= force;
					this.target.units -= force * adjusted;
					if (this.target.units < 0) {
						this.target.target = null;
						this.target.owner = this.owner;
						this.target.units = this.units / 2;
						this.units /= 2;
					}
				}

			}

		}

	}

	/**
	 * @param {!CanvasRenderingContext2D} ctx
	 * @param {!number} dt
	 */
	draw(ctx, dt) {
		const { x, y, size, units } = this;

		ctx.lineWidth = 2;
		ctx.beginPath();
		ctx.arc(x, y, units/2, 0, TAU);

		ctx.fillStyle = teamGetColorAsCss(this.owner, 1);
		ctx.fill();

		const nsize = size + this.mouseOver * 2;
		ctx.beginPath();
		ctx.arc(x, y, nsize, 0, TAU);
		ctx.strokeStyle = '#FFF';
		ctx.stroke();

		if (this.selected) {
			const anim = 6 + Math.sin(performance.now() / 100);
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(x, y, size+anim, 0, TAU);
			ctx.strokeStyle = '#FFF';
			ctx.stroke();
		}

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
						intersect |= subway ^ l.links.some(m =>
							linesIntersect(a.x, a.y, b.x, b.y, l.x, l.y, m.x, m.y)
						);
					});

					if (!intersect) a.links.push(b);

				}
			});
		});
	}

	/**
	 * @param {!number} dt
	 */
	static updateNodes(dt) {
		if (mouse.pressed[1]) Node.selected = null;
		Node.instances.forEach(i => i.update(dt));
		if (turnTimer-- <= 0) {
			Node.instances.forEach(i => i.takeTurn());
			turnTimer += TURN_COOLDOWN;
		}
	}

	/**
	 * TODO: Create sprites for these things
	 * @param {!CanvasRenderingContext2D} ctx
	 * @param {!number} dt
	 */
	static drawNodes(ctx, dt) {

		// draw fills
		Node.instances.forEach(i => {
			const { x, y, size, units } = i;
			ctx.beginPath();
			ctx.arc(x, y, units/2, 0, TAU);
			ctx.fillStyle = teamGetColorAsCss(i.owner, 1);
			ctx.fill();
		});

		// draw outlines
		ctx.lineWidth = 2;
		ctx.strokeStyle = '#FFF';
		ctx.beginPath();
		Node.instances.forEach(i => {
			const { x, y, size, units } = i;
			const nsize = size + i.mouseOver * 2;
			ctx.moveTo(x + size, y);
			ctx.arc(x, y, nsize, 0, TAU);
		});
		ctx.stroke();

		// draw selected node
		if (Node.selected) {
			const { x, y, size, units } = Node.selected;
			const anim = 6 + Math.sin(performance.now() / 100);
			ctx.lineWidth = 4;
			ctx.beginPath();
			ctx.arc(x, y, size+anim, 0, TAU);
			ctx.stroke();
		}

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
					connections.push(
						a.x + Math.cos(angle) * a.size,
						a.y + Math.sin(angle) * a.size,
						b.x - Math.cos(angle) * b.size,
						b.y - Math.sin(angle) * b.size
					);
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
		ctx.strokeStyle = CONNECTIONS_COLOR;
		ctx.setLineDash([4, 4]);
		const length = connections.length;
		ctx.beginPath();
		for (let n = 0; n < length; n += 4) {
			ctx.moveTo(connections[n], connections[n+1]);
			ctx.lineTo(connections[n+2], connections[n+3]);
		}
		ctx.stroke();
		ctx.setLineDash([]);
	}

	/**
	 *
	 */
	static drawTargets(ctx) {
		ctx.lineWidth = 2;
		Node.instances.forEach(i => {
			if (i.target) {
				const angle = angleBetweenPoints(i, i.target);
				const x1 = i.x + Math.cos(angle) * (i.size+15);
				const y1 = i.y + Math.sin(angle) * (i.size+15);
				ctx.beginPath();
				ctx.arc(x1, y1, 5, 0, TAU);
				ctx.stroke();
			}
		});
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
	 * Returns the average position of all nodes.
	 * @return {!Array<number>}
	 */
	static centerOfPositions() {
		let minx = 1e6, maxx = 0;
		let miny = 1e6, maxy = 0;
		Node.instances.forEach(i => {
			minx = Math.min(minx, i.x);
			maxx = Math.max(maxx, i.x);
			miny = Math.min(miny, i.y);
			maxy = Math.max(maxy, i.y);
		});
		return [(minx + maxx) / 2, (miny + maxy) / 2];
	}

	/**
	 * @param {!number} x
	 * @param {!number} y
	 * @return {?Node}
	 */
	static getNodeAtPosition(x, y) {
		const d = NODE_DISTANCE;
		const r =  Node.instances.find(i => i.x === x * d && i.y === y * d);
		return r ? r : null;
	}

}

export function getFactionUnits(f) {
	let n = 0;
	Node.instances.forEach(i => n += (i.owner === f) * i.units);
	return n;
}

export function getFactionCapacity(f) {
	let n = 0;
	Node.instances.forEach(i => n += (i.owner === f) * i.capacity);
	return n;
}

Node.instances = [];
