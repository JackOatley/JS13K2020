import { Node } from './Node.js';

export function aiGetAllNodes(team) {
	return Node.instances.filter(i => i.owner === team);
}
