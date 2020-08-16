
/** @define {boolean} */
const SHOW_LOGS = true;

/**
 * Turn off SHOW_LOGS from command line to remove all console logs.
 * @type {function(*, *, ...*):void}
 */
export function log(...args) {
	if (SHOW_LOGS) console.log(...args);
}
