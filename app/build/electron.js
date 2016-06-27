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

	// FileStorageHelper runs on the window process.
	// This helper runs on the main process.
	"use strict";
	const { ipcMain, dialog } = __webpack_require__(1);
	const fs = __webpack_require__(3);
	const path = __webpack_require__(4);
	const sanitize = __webpack_require__(5);
	const FILE_STATUS = {};
	// Latest project and scene saved to fs
	let project;
	let scene;
	// User selected project and library paths
	// FIXME !!! "open project" and "select library" (where is default lib path ?)
	let projectPath = '/Users/gaspard/git/lucidity.project';
	let libraryPath = '/Users/gaspard/git/lucidity.library/components';
	exports.start = () => {
	    console.log('start FileStorageMain');
	    ipcMain.on('open-project', () => {
	        // TODO
	    });
	    ipcMain.on('project-changed', (event, doc) => {
	        const p = path.resolve(projectPath, `${sanitize(doc.name)}.lucy`);
	        fs.writeFile(p, JSON.stringify(doc, null, 2), 'utf8', (err) => {
	            if (err) {
	                console.log(err);
	            }
	        });
	        if (project) {
	            if (project.name !== doc.name) {
	                // remove old file
	                const p = path.resolve(projectPath, `${sanitize(project.name)}.lucy`);
	                const f = fs.statSync(p);
	                if (f && f.isFile()) {
	                    fs.unlink(p, (err) => {
	                        if (err) {
	                            console.log(err);
	                        }
	                    });
	                }
	            }
	        }
	        project = doc;
	    });
	    ipcMain.on('scene-changed', (event, doc) => {
	    });
	    ipcMain.on('save-component', (event, component) => {
	        // Save component to library
	    });
	    /* TODO: optimize with:
	    ipcMain.on ( 'source-changed', ( event, { blockId, source } ) => {
	  
	    })
	    */
	};


/***/ },
/* 3 */
/***/ function(module, exports) {

	module.exports = require("fs");

/***/ },
/* 4 */
/***/ function(module, exports) {

	module.exports = require("path");

/***/ },
/* 5 */
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
	
	var truncate = __webpack_require__(6);
	
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var truncate = __webpack_require__(7);
	var getLength = Buffer.byteLength.bind(Buffer);
	module.exports = truncate.bind(null, getLength);


/***/ },
/* 7 */
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