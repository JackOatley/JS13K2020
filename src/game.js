import { NODE_DISTANCE } from './constants.js';
import { log } from './dev.js';
import { mapLoad, generateMap, placeStartLocations } from './map.js';
import { Node, getFactionUnits, getFactionCapacity } from './Node.js';
import { camera } from './camera.js';
import { roundRect } from './canvas.js';
import { teamGetColorAsCss, teamGetName } from './teams.js';

let numberOfTeams = 4;

/**
 *
 */
export function gameSetup() {
	generateMap(100);
	camera.setPosition(...Node.centerOfPositions());
	Node.autoConnect();
	Node.cacheConnections();
	placeStartLocations(numberOfTeams);
}

/**
 * @param {!number} dt Delta time
 */
export function gameUpdate(dt) {
	camera.update();
	Node.updateNodes(dt);
}

/**
 * @param {!CanvasRenderingContext2D} ctx
 * @param {!number} dt Delta time
 */
export function gameDraw(ctx, dt) {
	const canvas = ctx.canvas;
	const x = -camera.x + canvas.width / camera.z / 2;
	const y = -camera.y + canvas.height / camera.z / 2;
	drawBackground(ctx);
	drawGrid(ctx);
	ctx.save();
	ctx.scale(camera.z, camera.z);
	ctx.translate(x, y);
	Node.drawConnections(ctx, dt);
	Node.drawNodes(ctx, dt);
	Node.drawTargets(ctx);
	ctx.restore();
	drawHUD(ctx);
}

/**
 * @param {!CanvasRenderingContext2D} ctx
 */
function drawBackground(ctx) {
	const { width, height } = ctx.canvas;
	const gradient = ctx.createLinearGradient(width/2, 0, width/2, height);
	gradient.addColorStop(0, '#010121');
	gradient.addColorStop(1, '#010111');
	ctx.fillStyle = gradient;
	ctx.fillRect(0, 0, width, height);
}

/**
 * TODO Try out an ellipse gradient to fade out the edges?
 * @param {!CanvasRenderingContext2D} ctx
 */
function drawGrid(ctx) {

	const { width, height } = ctx.canvas;
	let x = (-camera.x + width / camera.z / 2) % NODE_DISTANCE;
	let y = (-camera.y + height / camera.z / 2) % NODE_DISTANCE;

	ctx.strokeStyle = 'rgba(255,255,255,0.1)';
	ctx.lineWidth = 1;
	ctx.beginPath();

	for (; x < width; x += NODE_DISTANCE / 2) {
		ctx.moveTo(x, 0);
		ctx.lineTo(x, height);
	}

	for (; y < height; y += NODE_DISTANCE / 2) {
		ctx.moveTo(0, y);
		ctx.lineTo(width, y);
	}

	ctx.stroke();

}

/**
 *
 */
function drawHUD(ctx) {
	const { width, height } = ctx.canvas;
	let x = (width / 2) - (120 * numberOfTeams) / 2 - 60;
	for (let n = 1; n <= numberOfTeams; x += 240, n++) {
		drawUnitCounter(ctx, n, x, 80);
	}
}

/**
 *
 */
function drawUnitCounter(ctx, f, x, y) {

	// header
	ctx.textAlign = 'center';
	ctx.textBaseline = 'middle';
	ctx.font = '16px monospace';
	ctx.fillStyle = teamGetColorAsCss(f, 1);
	ctx.fillText(`${teamGetName(f)} team`, x, y-55);

	ctx.fillStyle = teamGetColorAsCss(f, 0.2);
	roundRect(ctx, x-80, y-40, 160, 80-5, 10);
	ctx.fill();

	ctx.fillStyle = '#FFF';
	ctx.strokeStyle = '#FFF';
	ctx.lineWidth = 4;
	ctx.font = '24px monospace';

	ctx.beginPath();
	ctx.moveTo(x - 7, y + 15);
	ctx.lineTo(x + 7, y - 15);
	ctx.stroke();

	ctx.textAlign = 'right';
	ctx.fillText(~~getFactionUnits(f), x - 15, y - 15);
	ctx.textAlign = 'left';
	ctx.fillText(~~getFactionCapacity(f), x + 15, y + 15);
}
