var fs = require('fs');
var path = require('path');
var exec = require('child_process').exec;

var slash = process.platform === "linux" ? "/" : "\\";

var walk = async function (dir, done) {

	var results = [];
	fs.readdir(dir, function (err, list) {
		if (err) return done(err);
		var pending = list.length;
		if (!pending) return done(null, results);
		list.forEach(function (file) {
			file = path.resolve(dir, file);
			file = file.replace(process.cwd() + `${slash}`, ``);
			fs.stat(file, function (err, stat) {
				if (stat && stat.isDirectory()) {
					walk(file, function (err, res) {
						results = results.concat(res);
						if (!--pending) {
							done(null, results);
						}
					});
				} else {
					results.push(file.replace());
					if (!--pending) {
						done(null, results);
					}
				}
			});
		});
	});

};

/**
 * run
 * @param {boolean} build
 */
function electronRun(build) {
	if (build) {
		buildFinal().then(_ => {
			var cmd = 'npm start ' + true;
			exec(cmd, function (error, stdout, stderr) {
				console.log(stdout);
				console.log(stderr);
				console.log(error);
			});
		});
	} else {
		var cmd = 'npm start ' + false;
		exec(cmd, function (error, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
			console.log(error);
		})
	}
}

/**
 * uses electron-packager to build for a specified OS
 * @param {string} package
 */
function electronBuild(package) {
	buildFinal().then(_ => {
		var cmd = 'npm run package-' + package;
		exec(cmd, function (error, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
			console.log(error);
		});
	});
}

async function test() { }

/**
 *
 */
async function buildFinal() {

	var cmd = `java -jar closure-compiler.jar`
		+ ` --compilation_level ADVANCED`
		//+ ` --compilation_level WHITESPACE_ONLY`
		//+ ` --formatting PRETTY_PRINT`
		+ ` --language_in=ECMASCRIPT6`
		+ ` --language_out=ECMASCRIPT6`
		+ ` --rewrite_polyfills=false`
		+ ` --use_types_for_optimization=true`
		+ ` --jscomp_warning=ambiguousFunctionDecl`
		+ ` --jscomp_warning=checkTypes`
		+ ` --jscomp_warning=checkVars`
		+ ` --jscomp_warning=conformanceViolations`
		+ ` --jscomp_warning=functionParams`
		+ ` --jscomp_warning=missingProperties`
		+ ` --jscomp_warning=newCheckTypes`
		//+ ` --jscomp_warning=reportUnknownTypes`
		//+ ` --jscomp_warning=strictCheckTypes`
		+ ` --summary_detail_level 3`
		+ ` --output_wrapper_file build_index.html`
		+ ` --js_output_file build${slash}bin${slash}index.html`
		//+ ` --create_source_map build${slash}bin${slash}debug.js.map`
		+ ` --assume_function_wrapper`
		+ ` --property_renaming_report build${slash}debug${slash}property_naming_report.txt`
		+ ` --variable_renaming_report build${slash}debug${slash}variable_naming_report.txt`
		+ ` --define='IS_DEV=false'`;

	 await walk(`src`, async function (e, results) {

		orderFiles(results)

		// Make sure /libs/ are included first.
		for (var n = 0; n < results.length; n++) {
			var res = results[n];
			if (res.includes(`${slash}libs${slash}`)) {
				results.splice(n, 1);
				results.unshift(res);
			}
		}

		// Execute command.
		cmd += ` ` + results.join(` `);
		await exec(cmd, function (error, stdout, stderr) {
			console.log(stdout);
			console.log(stderr);
			console.log(error);
		});

	});
}

/**
 *
 */
function buildTestHTML() {

	var html = `<!DOCTYPE html>
	<html>
		<head>
			<meta charset="utf-8"/>
			<style>
				body {
					margin:0px;
					overflow:hidden;
					user-select:none;
				}
			</style>
		</head>
		<body>
			<canvas id="c"></canvas>
			%output%
		</body>
	</html>`;

	walk(`src`, function (e, results) {

		// Wrap file names in script tags.
		var scripts = ``;
		orderFiles(results).forEach(function (script) {
			scripts += `<script src='` + script + `'></script>\n`;
		});

		// Replace output string with script tags.
		html = html.replace(`%output%`, scripts);

		// Save new file.
		fs.writeFileSync(`index.html`, html);

	});

}

/**
 *
 */
function getOrder() {

	walk(`src`, function (e, results) {

		// Wrap file names in script tags.
		orderFiles(results).forEach(function (script) {
			console.log(script);
		});

	});

}

/**
 *
 */
function orderFiles(files) {

	// Force index.js to end of list.
	var index = files.indexOf(`src${slash}index.js`);
	files.splice(index, 1);
	files.push(`src${slash}index.js`);

	// Move constants.js to front.
	var index = files.indexOf(`src${slash}constants.js`);
	files.splice(index, 1);
	files.unshift(`src${slash}constants.js`);

	// Make sure /libs/ are included first.
	for (var n = 0; n < files.length; n++) {
		var res = files[n];
		if (res.includes(`${slash}libs${slash}`)) {
			files.splice(n, 1);
			files.unshift(res);
		}
	}

	// Move native extensions to front.
	for (var n = 0; n < files.length; n++) {
		var res = files[n];
		if (res.includes(`${slash}polyfill${slash}`)) {
			files.splice(n, 1);
			files.unshift(res);
		}
	}

	return files;

}

module.exports.html = buildTestHTML;
module.exports.final = buildFinal;
module.exports.electron = electronBuild;
module.exports.run = electronRun;
module.exports.order = getOrder;
