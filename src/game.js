import { log } from './dev.js';
import { mapLoad } from './map.js';
import { Node } from './Node.js';

/**
 *
 */
export function gameSetup() {
	mapLoad(0);
	log(Node.centerOfMass());
	Node.autoConnect();
}

/**
 *
 */
export function gameUpdate(dt) {

}

/**
 *
 */
export function gameDraw(ctx, dt) {
	Node.drawConnections(ctx, dt);
	Node.drawNodes(ctx, dt);
}
