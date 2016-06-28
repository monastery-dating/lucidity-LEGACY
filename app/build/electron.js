/******/ (function(modules) { // webpackBootstrap
/******/ 	// The module cache
/******/ 	var installedModules = {};
/******/
/******/ 	// The require function
/******/ 	function __webpack_require__(moduleId) {
/******/
/******/ 		// Check if module is in cache
/******/ 		if(installedModules[moduleId])
/******/ 			return installedModules[moduleId].exports;
/******/
/******/ 		// Create a new module (and put it into the cache)
/******/ 		var module = installedModules[moduleId] = {
/******/ 			exports: {},
/******/ 			id: moduleId,
/******/ 			loaded: false
/******/ 		};
/******/
/******/ 		// Execute the module function
/******/ 		modules[moduleId].call(module.exports, module, module.exports, __webpack_require__);
/******/
/******/ 		// Flag the module as loaded
/******/ 		module.loaded = true;
/******/
/******/ 		// Return the exports of the module
/******/ 		return module.exports;
/******/ 	}
/******/
/******/
/******/ 	// expose the modules object (__webpack_modules__)
/******/ 	__webpack_require__.m = modules;
/******/
/******/ 	// expose the module cache
/******/ 	__webpack_require__.c = installedModules;
/******/
/******/ 	// __webpack_public_path__
/******/ 	__webpack_require__.p = "";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const { app, BrowserWindow } = __webpack_require__(1);
	const FileStorageMain_1 = __webpack_require__(2);
	// Keep a global reference of the window object, if you don't, the window will
	// be closed automatically when the JavaScript object is garbage collected.
	let win;
	function createWindow() {
	    // Create the browser window.
	    win = new BrowserWindow({ width: 800, height: 600 });
	    // Here __dirname will be app/build/electron.js
	    win.loadURL(`file://${__dirname}/../electron.dev.html`);
	    // Open the DevTools.
	    win.webContents.openDevTools();
	    // Emitted when the window is closed.
	    win.on('closed', () => {
	        // Dereference the window object, usually you would store windows
	        // in an array if your app supports multi windows, this is the time
	        // when you should delete the corresponding element.
	        win = null;
	    });
	    FileStorageMain_1.start();
	}
	// This method will be called when Electron has finished
	// initialization and is ready to create browser windows.
	// Some APIs can only be used after this event occurs.
	app.on('ready', createWindow);
	// Quit when all windows are closed.
	app.on('window-all-closed', () => {
	    // On macOS it is common for applications and their menu bar
	    // to stay active until the user quits explicitly with Cmd + Q
	    if (process.platform !== 'darwin') {
	        app.quit();
	    }
	});
	app.on('activate', () => {
	    // On macOS it's common to re-create a window in the app when the
	    // dock icon is clicked and there are no other windows open.
	    if (win === null) {
	        createWindow();
	    }
	});


/***/ },
/* 1 */
/***/ function(module, exports) {

	module.exports = require("electron");

/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const GraphParser_1 = __webpack_require__(3);
	const { ipcMain, dialog } = __webpack_require__(1);
	const fs = __webpack_require__(6);
	const path = __webpack_require__(7);
	const sanitize = __webpack_require__(8);
	const sceneCacheById = {};
	let readCache;
	let writeCache;
	// Latest project and scene saved to fs
	const projectCache = { json: '', name: '' };
	// User selected project and library paths
	// FIXME !!! "open project" and "select library" (where is default lib path ?)
	let projectPath = '/Users/gaspard/git/lucidity.project';
	let libraryPath = '/Users/gaspard/git/lucidity.library/components';
	exports.start = () => {
	    ipcMain.on('open-project', () => {
	        // TODO
	    });
	    ipcMain.on('project-changed', (event, project) => {
	        // scenes
	        const err = updateGraph([projectPath], project, sceneCacheById[project._id]);
	        if (err) {
	            event.sender.send('error', err);
	            return;
	        }
	        const p = path.resolve(projectPath, `${sanitize(project.name)}.lucy`);
	        const doc = Object.assign({}, project);
	        delete doc.graph;
	        delete doc.scenes;
	        const json = JSON.stringify(doc, null, 2);
	        if (json === projectCache.json) {
	        }
	        else {
	            fs.writeFile(p, json, 'utf8', (err) => {
	                if (err) {
	                    console.log(err);
	                }
	            });
	            projectCache.json = json;
	        }
	        if (projectCache.name !== project.name) {
	            // remove old file
	            const p = path.resolve(projectPath, `${sanitize(projectCache.name)}.lucy`);
	            const f = stat(p);
	            if (f && f.isFile()) {
	                fs.unlink(p, (err) => {
	                    if (err) {
	                        console.log(err);
	                    }
	                });
	            }
	        }
	        projectCache.name = doc.name;
	    });
	    ipcMain.on('scene-changed', (event, scene) => {
	        // scenes
	        const err = updateGraph([projectPath, 'scenes'], scene, sceneCacheById[scene._id]);
	        if (err) {
	            event.sender.send('error', err);
	        }
	    });
	    ipcMain.on('save-component', (event, component) => {
	        // Save component to library
	    });
	    /* TODO: optimize with:
	    ipcMain.on ( 'source-changed', ( event, { blockId, source } ) => {
	  
	    })
	    */
	};
	const stat = (path) => {
	    try {
	        return fs.statSync(path);
	    }
	    catch (err) {
	        return null;
	    }
	};
	const updateGraph = (paths, scene, cache) => {
	    // prepare path
	    writeCache = {};
	    let basepath = paths[0];
	    for (let i = 1; i < paths.length; ++i) {
	        basepath = makeFolder(basepath, paths[i]);
	    }
	    if (!cache) {
	        const cache = { scene, files: {} };
	        readCache = cache.files;
	        writeCache = cache.files;
	        const err = createGraph(basepath, scene);
	        if (!err) {
	            sceneCacheById[scene._id] = cache;
	        }
	        return err;
	    }
	    else {
	        const oscene = cache.scene;
	        if (oscene.name !== scene.name) {
	            // rename: move folder
	            const from = path.resolve(basepath, sanitize(oscene.name));
	            const to = path.resolve(basepath, sanitize(scene.name));
	            const sfrom = stat(from);
	            const sto = stat(to);
	            if (sfrom && sfrom.isDirectory() && !sto) {
	                // move
	                fs.renameSync(from, to);
	                console.log('[rename] ' + from + ' --> ' + to);
	                // update cache
	                const oldCache = cache.files;
	                const newCache = {};
	                const froml = from.length;
	                for (const p in oldCache) {
	                    const np = path.resolve(to, p.substr(froml));
	                    newCache[np] = oldCache[p];
	                }
	                cache.files = newCache;
	            }
	        }
	        readCache = cache.files;
	        writeCache = {};
	        const err = createGraph(basepath, scene);
	        if (err) {
	        }
	        else {
	            // we must remove unused files.
	            // longest paths first
	            const keys = Object.keys(readCache).sort((a, b) => a < b ? 1 : -1);
	            for (const p of keys) {
	                if (!writeCache[p]) {
	                    // remove old file
	                    const s = stat(p);
	                    if (!s) {
	                    }
	                    else if (s.isFile()) {
	                        fs.unlinkSync(p);
	                        console.log('[remove] ' + p);
	                    }
	                    else if (s.isDirectory()) {
	                        // only remove empty folders that we created
	                        const files = fs.readdirSync(p);
	                        if (files.length === 0) {
	                            fs.rmdirSync(p);
	                        }
	                    }
	                    else {
	                    }
	                }
	            }
	            cache.scene = scene;
	            cache.files = writeCache;
	        }
	    }
	};
	const saveFile = (base, name, source /*, uuid */) => {
	    const p = path.resolve(base, sanitize(name));
	    const c = readCache[p];
	    // TODO: optimize to use small uuid as third argument to detect block change
	    if (c === source) {
	        // not changed
	        writeCache[p] = source;
	        return;
	    }
	    const s = stat(p);
	    if (!s || s.isFile()) {
	        // changed file
	        fs.writeFileSync(p, source, 'utf8');
	        console.log('[write ] ' + p);
	    }
	    else {
	        // not a file
	        throw `Cannot save graph source to '${p}' (not a file).`;
	    }
	    writeCache[p] = source;
	};
	const makeFolder = (base, name) => {
	    const p = path.resolve(base, sanitize(name));
	    const s = stat(p);
	    if (!s) {
	        fs.mkdirSync(p);
	        console.log('[mkdir ] ' + p);
	    }
	    else if (!s.isDirectory()) {
	        // error
	        throw `Cannot save graph to '${p}' (not a folder).`;
	    }
	    writeCache[p] = true;
	    return p;
	};
	const createGraph = (basepath, scene) => {
	    try {
	        const base = makeFolder(basepath, scene.name);
	        GraphParser_1.exportGraph(scene.graph, base, saveFile, makeFolder);
	        return null;
	    }
	    catch (err) {
	        return err.message;
	    }
	};


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const types_1 = __webpack_require__(4);
	const exportOne = (graph, context, file, folder, nodeId, slotref) => {
	    const node = graph.nodesById[nodeId];
	    const block = graph.blocksById[node.blockId];
	    const name = slotref ? `${slotref} ${block.name}` : block.name;
	    file(context, `${name}.ts`, block.source);
	    let sub;
	    const children = node.children;
	    for (let i = 0; i < children.length; ++i) {
	        const slotref = i < 10 ? `0${i}` : String(i);
	        const childId = children[i];
	        if (childId) {
	            if (!sub) {
	                // create folder for children
	                sub = folder(context, name);
	            }
	            exportOne(graph, sub, file, folder, childId, slotref);
	        }
	    }
	};
	exports.exportGraph = (graph, context // this is the context passed for root element
	    , file, folder) => {
	    exportOne(graph, context, file, folder, types_1.rootNodeId);
	};


/***/ },
/* 4 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(5));


/***/ },
/* 5 */
/***/ function(module, exports) {

	"use strict";
	exports.nextNodeId = (nodesById) => {
	    let n = 0;
	    while (nodesById[`n${n}`]) {
	        n += 1;
	    }
	    return `n${n}`;
	};
	exports.rootNodeId = exports.nextNodeId({});


/***/ },
/* 6 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 7 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	/*jshint node:true*/
	'use strict';
	
	/**
	 * Replaces characters in strings that are illegal/unsafe for filenames.
	 * Unsafe characters are either removed or replaced by a substitute set
	 * in the optional `options` object.
	 *
	 * Illegal Characters on Various Operating Systems
	 * / ? < > \ : * | "
	 * https://kb.acronis.com/content/39790
	 *
	 * Unicode Control codes
	 * C0 0x00-0x1f & C1 (0x80-0x9f)
	 * http://en.wikipedia.org/wiki/C0_and_C1_control_codes
	 *
	 * Reserved filenames on Unix-based systems (".", "..")
	 * Reserved filenames in Windows ("CON", "PRN", "AUX", "NUL", "COM1",
	 * "COM2", "COM3", "COM4", "COM5", "COM6", "COM7", "COM8", "COM9",
	 * "LPT1", "LPT2", "LPT3", "LPT4", "LPT5", "LPT6", "LPT7", "LPT8", and
	 * "LPT9") case-insesitively and with or without filename extensions.
	 *
	 * Capped at 255 characters in length.
	 * http://unix.stackexchange.com/questions/32795/what-is-the-maximum-allowed-filename-and-folder-size-with-ecryptfs
	 *
	 * @param  {String} input   Original filename
	 * @param  {Object} options {replacement: String}
	 * @return {String}         Sanitized filename
	 */
	
	var truncate = __webpack_require__(9);
	
	var illegalRe = /[\/\?<>\\:\*\|":]/g;
	var controlRe = /[\x00-\x1f\x80-\x9f]/g;
	var reservedRe = /^\.+$/;
	var windowsReservedRe = /^(con|prn|aux|nul|com[0-9]|lpt[0-9])(\..*)?$/i;
	var windowsTrailingRe = /[\. ]+$/;
	
	function sanitize(input, replacement) {
	  var sanitized = input
	    .replace(illegalRe, replacement)
	    .replace(controlRe, replacement)
	    .replace(reservedRe, replacement)
	    .replace(windowsReservedRe, replacement)
	    .replace(windowsTrailingRe, replacement);
	  return truncate(sanitized, 255);
	}
	
	module.exports = function (input, options) {
	  var replacement = (options && options.replacement) || '';
	  var output = sanitize(input, replacement);
	  if (replacement === '') {
	    return output;
	  }
	  return sanitize(output, '');
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var truncate = __webpack_require__(10);
	var getLength = Buffer.byteLength.bind(Buffer);
	module.exports = truncate.bind(null, getLength);


/***/ },
/* 10 */
/***/ function(module, exports) {

	'use strict';
	
	function isHighSurrogate(codePoint) {
	  return codePoint >= 0xd800 && codePoint <= 0xdbff;
	}
	
	function isLowSurrogate(codePoint) {
	  return codePoint >= 0xdc00 && codePoint <= 0xdfff;
	}
	
	// Truncate string by size in bytes
	module.exports = function truncate(getLength, string, byteLength) {
	  if (typeof string !== "string") {
	    throw new Error("Input must be string");
	  }
	
	  var charLength = string.length;
	  var curByteLength = 0;
	  var codePoint;
	  var segment;
	
	  for (var i = 0; i < charLength; i += 1) {
	    codePoint = string.charCodeAt(i);
	    segment = string[i];
	
	    if (isHighSurrogate(codePoint) && isLowSurrogate(string.charCodeAt(i + 1))) {
	      i += 1;
	      segment += string[i];
	    }
	
	    curByteLength += getLength(segment);
	
	    if (curByteLength === byteLength) {
	      return string.slice(0, i + 1);
	    }
	    else if (curByteLength > byteLength) {
	      return string.slice(0, i - segment.length + 1);
	    }
	  }
	
	  return string;
	};
	


/***/ }
/******/ ]);
//# sourceMappingURL=electron.js.map