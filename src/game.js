import { log } from './dev.js';
import { mapLoad, generateMap, placeStartLocations } from './map.js';
import { Node } from './Node.js';

let cx = 0, cy = 0;	// camera position
let cz = 1.0;		// camera zoom

/**
 *
 */
export function gameSetup() {
	//mapLoad(0);
	generateMap(30);
	[cx, cy] = Node.centerOfMass();
	Node.autoConnect();
	Node.cacheConnections();
	placeStartLocations(2);
}

/**
 * @param {!number} dt Delta time
 */
export function gameUpdate(dt) {

}

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {!number} dt Delta time
 */
export function gameDraw(ctx, dt) {
	const canvas = ctx.canvas;
	const x = -cx + canvas.width / cz / 2;
	const y = -cy + canvas.height / cz / 2;
	ctx.save();
	ctx.scale(cz, cz);
	ctx.translate(x, y);
	Node.drawConnections(ctx, dt);
	Node.drawNodes(ctx, dt);
	ctx.restore();
}
