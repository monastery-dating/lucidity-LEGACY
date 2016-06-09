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
/******/ 	__webpack_require__.p = "/live-reload/";
/******/
/******/ 	// Load entry module and return exports
/******/ 	return __webpack_require__(0);
/******/ })
/************************************************************************/
/******/ ([
/* 0 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// modules
	const App_1 = __webpack_require__(1);
	const Block_1 = __webpack_require__(27);
	const Data_1 = __webpack_require__(112);
	const DragDrop_1 = __webpack_require__(123);
	const Factory_1 = __webpack_require__(10);
	const Graph_1 = __webpack_require__(34);
	const Library_1 = __webpack_require__(129);
	const Playback_1 = __webpack_require__(32);
	const Project_1 = __webpack_require__(8);
	const Scene_1 = __webpack_require__(225);
	const Status_1 = __webpack_require__(120);
	const User_1 = __webpack_require__(232);
	const Sync_1 = __webpack_require__(238);
	const Router = __webpack_require__(244);
	const Controller = __webpack_require__(104);
	const Devtools = __webpack_require__(260);
	const Http = __webpack_require__(261);
	const Model = __webpack_require__(50);
	const Component_1 = __webpack_require__(12); // Component for jsx on this page
	const App_2 = __webpack_require__(262);
	//import { TestView as AppView } from './TestView'
	const model = Model({});
	const controller = Controller(model);
	const router = Router({ '/': 'app.homeUrl',
	    '/project': 'app.projectsUrl',
	    '/project/:_id': 'app.projectUrl',
	    '/user': 'app.userUrl'
	}, { onlyHash: true,
	    mapper: { query: true }
	});
	controller.addModules({ app: App_1.App(),
	    block: Block_1.Block(),
	    data: Data_1.Data(),
	    $dragdrop: DragDrop_1.DragDrop(),
	    $factory: Factory_1.Factory(),
	    graph: Graph_1.Graph(),
	    devtools: Devtools(),
	    http: Http(),
	    library: Library_1.Library(),
	    playback: Playback_1.Playback(),
	    project: Project_1.Project(),
	    router,
	    scene: Scene_1.Scene(),
	    $status: Status_1.Status(),
	    user: User_1.User(),
	    $sync: Sync_1.Sync()
	});
	Component_1.render(() => Component_1.Component.createElement(App_2.App, null), document.getElementById('app'), controller);
	const warn = console.warn;
	console.warn = (msg) => {
	    console.trace();
	    warn.call(console, msg);
	};
	controller.getSignals().app.mounted();


/***/ },
/* 1 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const mounted_1 = __webpack_require__(2);
	const homeUrl_1 = __webpack_require__(108);
	const projectUrl_1 = __webpack_require__(109);
	const projectsUrl_1 = __webpack_require__(110);
	const userUrl_1 = __webpack_require__(111);
	exports.App = (options = {}) => {
	    return (module, controller) => {
	        // no state added
	        module.addSignals({ mounted: mounted_1.mounted,
	            homeUrl: homeUrl_1.homeUrl,
	            projectUrl: projectUrl_1.projectUrl,
	            projectsUrl: projectsUrl_1.projectsUrl,
	            userUrl: userUrl_1.userUrl
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const status_1 = __webpack_require__(3);
	const reload_1 = __webpack_require__(5);
	const runtests_1 = __webpack_require__(82);
	const output = (a) => {
	    return ({ output }) => {
	        output(a);
	    };
	};
	exports.mounted = [status_1.setStatus({ type: 'info', message: 'Lucidity started' }),
	    [...reload_1.reload] // async
	    ,
	    ...runtests_1.runtests // sync
	];


/***/ },
/* 3 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const toggleDetail_1 = __webpack_require__(4);
	// History will never grow beyond this
	exports.MAX_STATUS_HISTORY = 250;
	// When history gets to MAX, we shrink to MIN
	exports.MIN_STATUS_HISTORY = 200;
	exports.HISTORY_PATH = ['$status', 'list'];
	let ref = 0;
	// Used during testing only
	exports.resetRef = () => { ref = 0; };
	const addStatus = (state, status) => {
	    const curr = state.get(exports.HISTORY_PATH) || [];
	    ref += 1;
	    const s = Object.assign({}, status, { ref });
	    let list = [s, ...curr];
	    if (list.length > exports.MAX_STATUS_HISTORY) {
	        list = list.slice(0, exports.MIN_STATUS_HISTORY);
	    }
	    state.set(exports.HISTORY_PATH, list);
	    return s;
	};
	exports.status = ({ state, input, output }) => {
	    if (input.status) {
	        const s = addStatus(state, input.status);
	        if (s.type === 'error') {
	            // Automatically open on error
	            toggleDetail_1.setDetail(state, s);
	        }
	    }
	};
	// Cerebral type checking
	//status [ 'input' ] =
	//{ status:
	//  { type: String
	//  , message: String
	//  }
	//}
	// FIXME do we need this ?
	exports.setStatus = (status) => {
	    return ({ state }) => {
	        addStatus(state, status);
	    };
	};


/***/ },
/* 4 */
/***/ function(module, exports) {

	"use strict";
	exports.setDetail = (state, status) => {
	    const visible = state.get(['$status', 'detail', 'visible']);
	    const curr = state.get(['$status', 'detail']);
	    if (curr.ref === status.ref) {
	        // toggle
	        state.set(['$status', 'showDetail'], !state.get(['$status', 'showDetail']));
	    }
	    else {
	        // display
	        state.set(['$status', 'detail'], status);
	        state.set(['$status', 'showDetail'], true);
	    }
	};
	exports.toggleDetail = ({ state, input }) => {
	    exports.setDetail(state, input.detail);
	};


/***/ },
/* 5 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const reload_1 = __webpack_require__(6);
	const dataToState_1 = __webpack_require__(7);
	const Project_1 = __webpack_require__(8);
	const copy = __webpack_require__(76);
	const when = __webpack_require__(80);
	exports.reload = [reload_1.reload,
	    { success: [dataToState_1.dataToState,
	            when('state:/$projectId'),
	            { true: [copy('state:/$projectId', 'output:/_id'),
	                    Project_1.selectAction
	                ],
	                false: []
	            }
	        ],
	        error: []
	    }
	];


/***/ },
/* 6 */
/***/ function(module, exports) {

	"use strict";
	exports.reload = ({ services, output }) => {
	    const db = services.data.db;
	    const data = {};
	    db.allDocs({ include_docs: true, descending: true }, (err, docs) => {
	        if (err) {
	            output.error({ type: 'error', message: err });
	        }
	        else {
	            for (const mdoc of docs.rows) {
	                const doc = mdoc.doc;
	                let branch = data[doc.type];
	                if (!branch) {
	                    branch = {};
	                    data[doc.type] = branch;
	                }
	                branch[doc._id] = doc;
	            }
	            output.success({ data: data, path: 'data' });
	        }
	    });
	};
	exports.reload['async'] = true;


/***/ },
/* 7 */
/***/ function(module, exports) {

	"use strict";
	exports.dataToState = ({ state, input }) => {
	    state.set(input.path, input.data);
	};


/***/ },
/* 8 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(9));
	__export(__webpack_require__(58));
	const Model = __webpack_require__(50);
	const add_1 = __webpack_require__(59);
	const name_1 = __webpack_require__(61);
	const select_1 = __webpack_require__(75);
	const CurrentProject = Model.monkey({ cursors: { projectById: ['data', 'project'],
	        id: ['$projectId']
	    },
	    get(data) {
	        const projectById = data.projectById || {};
	        return projectById[data.id];
	    }
	});
	exports.Project = (options = {}) => {
	    return (module, controller) => {
	        module.addState(CurrentProject);
	        module.addSignals({ add: add_1.add,
	            name: name_1.name,
	            select: select_1.select
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Factory_1 = __webpack_require__(10);
	const GraphHelper_1 = __webpack_require__(25);
	const SceneHelper_1 = __webpack_require__(57);
	var ProjectHelper;
	(function (ProjectHelper) {
	    ProjectHelper.create = () => {
	        const _id = Factory_1.makeId();
	        const graph = GraphHelper_1.GraphHelper.create();
	        const scene = SceneHelper_1.SceneHelper.create();
	        const project = Object.freeze({ _id,
	            type: 'project',
	            name: 'New project',
	            graph,
	            scenes: [scene._id]
	        });
	        return { scene, project };
	    };
	    ProjectHelper.select = (state, user, project) => {
	        const nuser = Object.assign({}, user, { projectId: project._id,
	            sceneId: null
	        });
	        const scenes = project.scenes || [];
	        const sceneId = scenes[0]; // can be null
	        if (sceneId) {
	            const scene = state.get['data', 'scene', sceneId];
	            if (scene) {
	                return SceneHelper_1.SceneHelper.select(state, nuser, scene);
	            }
	        }
	        return nuser;
	    };
	})(ProjectHelper = exports.ProjectHelper || (exports.ProjectHelper = {}));


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(11));
	__export(__webpack_require__(15));
	__export(__webpack_require__(17));
	__export(__webpack_require__(18));
	__export(__webpack_require__(19));
	const common_1 = __webpack_require__(21);
	exports.Factory = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ editing: false // would contain the path of edited element
	        });
	        // FIXME: none of these should exist.
	        module.addSignals({ set: common_1.set
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(12);
	// Add new element
	exports.add = (type, path) => {
	    const comp = Component_1.Component({}, ({ props, children, signals }) => {
	        const klass = props.class || {};
	        klass.add = true;
	        const addElement = () => {
	            signals.$factory.add({ path, type });
	        };
	        return Component_1.Component.createElement("div", {class: klass, "on-click": addElement}, children);
	    });
	    return comp;
	};


/***/ },
/* 12 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const cerebral_view_snabbdom_1 = __webpack_require__(13);
	const SVGNS = 'http://www.w3.org/2000/svg';
	const modulesNS = ['hook', 'on', 'style', 'class', 'props', 'attrs'];
	const slice = Array.prototype.slice;
	const hasData = /^data\-/;
	const mapData = function (adata, noprops) {
	    const data = {};
	    const props = noprops ? data : {};
	    let hasProps = false;
	    for (const k in adata) {
	        if (k === 'class') {
	            const aclass = adata[k];
	            let klass = data[k];
	            if (!klass) {
	                klass = {};
	                data[k] = klass;
	            }
	            if (typeof aclass === 'string') {
	                const klasses = aclass.split(/\s+/);
	                for (const k of klasses) {
	                    klass[k] = true;
	                }
	            }
	            else {
	                Object.assign(klass, aclass);
	            }
	        }
	        else if (k === 'style') {
	            const astyle = adata[k];
	            let style = data[k];
	            if (!style) {
	                style = {};
	                data[k] = style;
	            }
	            if (typeof astyle === 'string') {
	                const styles = astyle.split(/\s*;\s*/);
	                for (const s of styles) {
	                    const [key, value] = s.split(/\s*:\s*/);
	                    style[key] = value;
	                }
	            }
	            else {
	                Object.assign(style, astyle);
	            }
	        }
	        else {
	            const dash = k.indexOf('-');
	            if (dash > 0) {
	                if (hasData.test(k)) {
	                    const attrs = data.attrs = data.attrs || {};
	                    attrs[k] = adata[k];
	                }
	                else {
	                    const nkey = k.split('-');
	                    const fkey = nkey.pop();
	                    let base = data;
	                    for (const l of nkey) {
	                        if (!base[l]) {
	                            base = base[l] = {};
	                        }
	                        else {
	                            base = base[l];
	                        }
	                    }
	                    base[fkey] = adata[k];
	                }
	            }
	            else {
	                if (modulesNS.indexOf(k) >= 0) {
	                    if (data[k]) {
	                        Object.assign(data[k], adata[k]);
	                    }
	                    else {
	                        data[k] = adata[k];
	                    }
	                }
	                else {
	                    hasProps = true;
	                    props[k] = adata[k];
	                }
	            }
	        }
	    }
	    if (!noprops && hasProps) {
	        data.props = props;
	    }
	    return data;
	};
	const mapChildren = (c) => {
	    if (typeof c === 'object') {
	        return c;
	    }
	    else {
	        return { text: c };
	    }
	};
	const remapSVGData = (adata) => {
	    const props = adata.props || {};
	    adata.attrs = Object.assign(props.attrs || {}, adata.attrs, props);
	    delete adata.props;
	    delete adata.attrs.attrs;
	    adata.ns = SVGNS;
	    return adata;
	};
	const setSVGChildren = (children) => {
	    for (const c of children) {
	        if (c.data) {
	            c.data = remapSVGData(c.data);
	            if (c.children) {
	                setSVGChildren(c.children);
	            }
	        }
	    }
	};
	const createElement = function (sel, adata, achildren) {
	    let children = [];
	    if (arguments.length > 2) {
	        for (const c of slice.call(arguments, 2)) {
	            if (Array.isArray(c)) {
	                children = [...children, ...c];
	            }
	            else {
	                children.push(c);
	            }
	        }
	    }
	    if (children) {
	        children = children.map((c) => typeof c === 'object' ? c : { text: c });
	    }
	    if (typeof sel === 'string') {
	        const vnode = { sel };
	        if (adata) {
	            if (adata.key) {
	                vnode.key = adata.key;
	            }
	            const data = mapData(adata);
	            vnode.data = data;
	        }
	        else {
	            vnode.data = {};
	        }
	        if (children) {
	            vnode.children = children;
	        }
	        if (sel === 'svg') {
	            setSVGChildren([vnode]);
	        }
	        return vnode;
	    }
	    else {
	        return sel(mapData(adata, true), children);
	    }
	};
	// HACK. Should be able to change this without or should
	// rewrite cerebral-view-snabbdom entirely.
	cerebral_view_snabbdom_1.Component['createElement'] = createElement; // CComp.DOM
	exports.Component = cerebral_view_snabbdom_1.Component;
	exports.render = cerebral_view_snabbdom_1.render;


/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(127);

/***/ },
/* 14 */
/***/ function(module, exports) {

	module.exports = vendor_lib;

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(12);
	const EditableText_1 = __webpack_require__(16);
	const EditingPath = ['$factory', 'editing'];
	// We use a switch case instead of signals[ key ] to force type check.
	const getSignal = (signals, type, attr) => {
	    switch (type) {
	        case 'block':
	            switch (attr) {
	                case 'name':
	                    return signals.block.name;
	            }
	            break;
	        case 'project':
	            switch (attr) {
	                case 'name':
	                    return signals.project.name;
	            }
	        case 'scene':
	            switch (attr) {
	                case 'name':
	                    return signals.scene.name;
	            }
	        case 'user':
	            switch (attr) {
	                case 'name':
	                    return signals.user.name;
	                case 'libraryGithubPath':
	                    return signals.user.libraryGithubPath;
	                case 'libraryGithubToken':
	                    return signals.user.libraryGithubToken;
	            }
	            break;
	    }
	};
	// Editable Component factory
	exports.editable = (path, idscope = '') => {
	    const spath = path.join('-') + idscope;
	    const fpath = ['$factory', ...path];
	    const comp = Component_1.Component({ text: path,
	        stext: [...fpath, 'value'],
	        saving: [...fpath, 'saving'],
	        editing: fpath // EditingPath
	    }, ({ state, signals, props }) => {
	        const edit = () => signals.$factory.set({ path: fpath, value: true });
	        const signal = getSignal(signals, path[0], path[1]);
	        const changed = (value) => signal({ value });
	        const isediting = state.editing === true;
	        return Component_1.Component.createElement(EditableText_1.EditableText, {class: props.class, text: state.text || props.default || '-empty-', stext: state.stext, editing: isediting, saving: state.saving, "on-edit": edit, "on-change": changed});
	    });
	    comp.path = fpath;
	    return comp;
	};


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(12);
	// FIXME: how can I move this to Factory ?
	const focus = (_, { elm }) => {
	    setTimeout(() => {
	        elm.focus();
	        elm.select();
	    }, 0);
	};
	const makeKeyup = function ({ on, text }) {
	    return (e) => {
	        if (e.keyCode === 27) {
	            // ESC = abort
	            e.preventDefault();
	            e.target.setAttribute('data-done', true);
	            on.change(text);
	        }
	        else if (e.keyCode === 13) {
	            // enter = save
	            e.preventDefault();
	            e.target.setAttribute('data-done', true);
	            on.change(e.target.value);
	        }
	    };
	};
	const makeChange = function ({ on }) {
	    return (e) => {
	        if (!e.target.getAttribute('data-done')) {
	            e.target.setAttribute('data-done', true);
	            on.change(e.target.value);
	        }
	    };
	};
	exports.EditableText = Component_1.Component({}, ({ props }) => {
	    if (props.editing) {
	        const klass = Object.assign({ EditableText: true, active: true }, props.class || {});
	        const keyup = makeKeyup(props);
	        const change = makeChange(props);
	        return Component_1.Component.createElement("div", {class: klass}, 
	            Component_1.Component.createElement("input", {class: 'fld', value: props.text, "hook-create": focus, "on-keyup": keyup, "on-blur": change, "on-change": change})
	        );
	    }
	    else {
	        const text = props.saving ? props.stext : props.text;
	        const klass = Object.assign({ EditableText: true, saving: props.saving }, props.class || {});
	        return Component_1.Component.createElement("div", {class: klass, "on-click": (e) => props.on.edit({})}, text || props.text || ' ');
	    }
	});


/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(12);
	// We use a switch case instead of signals[ key ] to force type check.
	const getSignal = (signals, opts) => {
	    switch (opts.type) {
	        case 'scene':
	            switch (opts.operation) {
	                case 'remove':
	                    return signals.scene.remove;
	            }
	            break;
	    }
	};
	const ModalPath = ['$factory', 'modal'];
	exports.openModal = (opts, signals) => {
	    return (e) => {
	        signals.$factory.set({ path: ModalPath,
	            value: Object.assign({}, opts, { active: true })
	        });
	    };
	};
	exports.Modal = Component_1.Component({ modalOpts: ModalPath // State of the pane.
	}, ({ state, children, signals }) => {
	    const opts = state.modalOpts || {};
	    const cancel = () => {
	        signals.$factory.set({ path: [...ModalPath, 'active'], value: false });
	    };
	    const continueOp = () => {
	        const signal = getSignal(signals, opts);
	        if (signal) {
	            signal({ _id: opts._id });
	        }
	        else {
	            console.error('Invalid signal for modal:', opts);
	        }
	    };
	    return Component_1.Component.createElement("div", {class: { Modal: true, active: opts.active }}, 
	        Component_1.Component.createElement("div", {class: 'wrap', "on-click": cancel}, 
	            Component_1.Component.createElement("p", {class: 'message'}, opts.message), 
	            Component_1.Component.createElement("div", {class: 'bwrap'}, 
	                Component_1.Component.createElement("div", {class: 'button cancel', "on-click": cancel}, "Cancel"), 
	                Component_1.Component.createElement("div", {class: 'button continue', "on-click": continueOp}, opts.confirm || 'Continue')))
	    );
	});


/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(12);
	// Open/closeable pane
	exports.pane = (name) => {
	    const panePath = ['$factory', 'pane', name];
	    const comp = Component_1.Component({ active: panePath // State of the pane.
	    }, ({ state, props, children, signals }) => {
	        const active = state.active;
	        const klass = Object.assign({}, props.class || {}, { Pane: true, active });
	        return Component_1.Component.createElement("div", {class: klass}, 
	            Component_1.Component.createElement("div", {class: 'wrap'}, children)
	        );
	    });
	    comp.path = panePath;
	    comp.toggle = Component_1.Component({ active: panePath
	    }, ({ state, props, children, signals }) => {
	        const active = state.active;
	        const toggle = (e) => {
	            signals.$factory.set({ path: panePath, value: !state.active });
	        };
	        const klass = Object.assign({}, props.class || {}, { active });
	        return Component_1.Component.createElement("div", {class: klass, "on-click": toggle}, children);
	    });
	    return comp;
	};


/***/ },
/* 19 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const uuid = __webpack_require__(20);
	// make sure we do not pass parameters to uuid
	exports.makeId = () => uuid();


/***/ },
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(63);

/***/ },
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(22));


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set_action_1 = __webpack_require__(23);
	exports.set = [set_action_1.setAction
	];


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(24);
	exports.setAction = ({ state, input: { path, value }, output }) => {
	    if (path[0] === 'data') {
	        throw ("SHOULD NOT USE set with data");
	    }
	    else {
	        // we could write this even during a save for faster UI ops
	        state.set(path, value);
	    }
	};
	exports.setAction['input'] =
	    { path: check.array.of.string,
	        value: check.assigned
	    };


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(163);

/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const NodeHelper_1 = __webpack_require__(26);
	const Block_1 = __webpack_require__(27);
	const Playback_1 = __webpack_require__(32);
	const Immutable_1 = __webpack_require__(31);
	const rootNodeId = NodeHelper_1.NodeHelper.rootNodeId;
	const defaultMeta = Playback_1.PlaybackHelper.defaultMeta;
	var GraphHelper;
	(function (GraphHelper) {
	    const createNode = NodeHelper_1.NodeHelper.create;
	    const nextNodeId = NodeHelper_1.NodeHelper.nextNodeId;
	    const nextBlockId = Block_1.BlockHelper.nextBlockId;
	    const checkFreeze = (graph) => {
	        graph.blocksById = Object.freeze(graph.blocksById);
	        check(graph); // this will freeze nodes
	        graph.nodesById = Object.freeze(graph.nodesById);
	        return Object.freeze(graph);
	    };
	    const check = (graph, context = Playback_1.PlaybackHelper.mainContext, nodeId = rootNodeId) => {
	        const node = graph.nodesById[nodeId];
	        const meta = graph.blocksById[node.blockId].meta || defaultMeta;
	        const expect = meta.expect || {};
	        const errors = [];
	        for (const k in meta.expect) {
	            const e = expect[k];
	            const c = context[k];
	            if (!c) {
	                errors.push(`missing '${k}' (${e})`);
	            }
	            else if (e !== c) {
	                errors.push(`invalid '${k}' (${c} instead of ${e})`);
	            }
	        }
	        if (errors.length > 0) {
	            node.invalid = errors;
	        }
	        else {
	            delete node.invalid;
	        }
	        graph.nodesById[nodeId] = Object.freeze(node);
	        const sub = context.set(meta.provide || {});
	        for (const childId of node.children) {
	            if (childId) {
	                check(graph, sub, childId);
	            }
	        }
	    };
	    GraphHelper.create = (name = 'main', source = Block_1.BlockHelper.MAIN_SOURCE) => {
	        const block = Block_1.BlockHelper.create(name, source);
	        const nid = rootNodeId;
	        return Object.freeze({ nodesById: Object.freeze({ [nid]: createNode(block.id, nid, null) }),
	            blocksById: Object.freeze({ [block.id]: block }),
	            blockId: block.id
	        });
	    };
	    const insertInGraph = (newgraph, oldgraph, oldid, parentId, tail, dropId) => {
	        const oldnode = oldgraph.nodesById[oldid];
	        let block = oldgraph.blocksById[oldnode.blockId];
	        if (!block['_copyblock']) {
	            const bid = nextBlockId(newgraph.blocksById);
	            block = Object.assign({}, block, { id: bid });
	            newgraph.blocksById[bid] = Object.freeze(block);
	            // make sure we do not add it twice (in case it's an alias)
	            oldgraph.blocksById[oldnode.blockId] =
	                Object.assign({}, block, { _copyblock: true });
	        }
	        // our new node id
	        const nid = nextNodeId(newgraph.nodesById);
	        // lock this id
	        const node = { id: nid,
	            blockId: block.id,
	            parent: parentId,
	            children: []
	        };
	        newgraph.nodesById[nid] = node;
	        if (!tail.nid && !oldnode.children[0]) {
	            // found tail
	            tail.nid = nid;
	        }
	        // map our children with new nodes and ids
	        let nochild = true;
	        node.children = oldnode.children.map((oid) => {
	            if (oid === null || oid === dropId) {
	                return null;
	            }
	            else {
	                nochild = false;
	                return insertInGraph(newgraph, oldgraph, oid, nid, tail, dropId);
	            }
	        });
	        if (nochild) {
	            node.children = [];
	        }
	        newgraph.nodesById[nid] = node;
	        return nid;
	    };
	    const copyNodes = (nodesById) => {
	        const r = {};
	        for (const k in nodesById) {
	            r[k] = Object.assign({}, nodesById[k]);
	        }
	        return r;
	    };
	    GraphHelper.insert = (graph, parentId, pos, achild) => {
	        // add nodes
	        let g = { nodesById: copyNodes(graph.nodesById),
	            blocksById: Object.assign({}, graph.blocksById),
	            blockId: graph.blockId
	        };
	        const oldgraph = { nodesById: achild.nodesById,
	            blocksById: Object.assign({}, achild.blocksById)
	        };
	        const tail = { nid: null };
	        // copy nodes and rename ids
	        const nid = insertInGraph(g, oldgraph, rootNodeId, parentId, tail);
	        g.blockId = g.nodesById[nid].blockId;
	        // link in parent
	        const parent = g.nodesById[parentId];
	        parent.children = Immutable_1.Immutable.insert(parent.children, pos, nid);
	        return checkFreeze(g);
	    };
	    GraphHelper.append = function (graph, parentId, child) {
	        return GraphHelper.insert(graph, parentId, -1, child);
	    };
	    // slip a new graph between parent and child
	    // FIXME: need to detect deepest child on first slot in graph
	    GraphHelper.slip = (graph, parentId, pos, achild) => {
	        let g = { nodesById: copyNodes(graph.nodesById),
	            blocksById: Object.assign({}, graph.blocksById),
	            blockId: graph.blockId
	        };
	        const oldgraph = { nodesById: achild.nodesById,
	            blocksById: Object.assign({}, achild.blocksById)
	        };
	        const tail = { nid: null };
	        // copy nodes and rename ids
	        const nid = insertInGraph(g, oldgraph, rootNodeId, parentId, tail);
	        g.blockId = g.nodesById[nid].blockId;
	        // get previous child at this position
	        const parent = g.nodesById[parentId];
	        const previd = parent.children[pos];
	        const prevnode = g.nodesById[previd];
	        // This is where the previous child will go
	        const tailnode = g.nodesById[tail.nid];
	        // tail.children [ 0 ] = previd
	        tailnode.children = Immutable_1.Immutable.aset(tailnode.children, 0, previd);
	        prevnode.parent = tail.nid;
	        // parent.children [ pos ] = nid
	        parent.children = Immutable_1.Immutable.aset(parent.children, pos, nid);
	        return checkFreeze(g);
	    };
	    // Cut a branch a return the branch as a new graph.
	    GraphHelper.cut = (graph, nodeId) => {
	        let g = { nodesById: {},
	            blocksById: {},
	            blockId: Block_1.BlockHelper.rootBlockId
	        };
	        const oldgraph = { nodesById: graph.nodesById,
	            blocksById: Object.assign({}, graph.blocksById)
	        };
	        const tail = { nid: null };
	        insertInGraph(g, oldgraph, nodeId, null, tail);
	        return checkFreeze(g);
	    };
	    // Remove a branch and return the smaller tree.
	    GraphHelper.drop = (graph, nodeId) => {
	        let g = { nodesById: {},
	            blocksById: {},
	            blockId: Block_1.BlockHelper.rootBlockId
	        };
	        const oldgraph = { nodesById: graph.nodesById,
	            blocksById: Object.assign({}, graph.blocksById)
	        };
	        const tail = { nid: null };
	        insertInGraph(g, oldgraph, rootNodeId, null, tail, nodeId);
	        return checkFreeze(g);
	    };
	    const exportOne = (graph, context, file, folder, nodeId, slotref) => {
	        const node = graph.nodesById[nodeId];
	        const block = graph.blocksById[node.blockId];
	        const name = slotref ? `${slotref}.${block.name}` : block.name;
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
	    GraphHelper.exportGraph = (graph, context // this is the context passed for root element
	        , file, folder) => {
	        exportOne(graph, context, file, folder, rootNodeId);
	    };
	})(GraphHelper = exports.GraphHelper || (exports.GraphHelper = {}));


/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";
	var NodeHelper;
	(function (NodeHelper) {
	    NodeHelper.nextNodeId = (nodesById) => {
	        let n = 0;
	        while (nodesById[`n${n}`]) {
	            n += 1;
	        }
	        return `n${n}`;
	    };
	    NodeHelper.rootNodeId = NodeHelper.nextNodeId({});
	    NodeHelper.create = (blockId, id, parent, children) => {
	        return Object.freeze({ id,
	            blockId,
	            parent,
	            children: Object.freeze(children || [])
	        });
	    };
	})(NodeHelper = exports.NodeHelper || (exports.NodeHelper = {}));


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(28));
	__export(__webpack_require__(45));
	__export(__webpack_require__(49));
	const Model = __webpack_require__(50);
	const add_2 = __webpack_require__(45);
	const name_1 = __webpack_require__(51);
	const select_1 = __webpack_require__(53);
	const source_1 = __webpack_require__(55);
	const CurrentBlock = Model.monkey({ cursors: { sceneById: ['data', 'scene'],
	        sceneId: ['$sceneId'],
	        projectById: ['data', 'project'],
	        projectId: ['$projectId'],
	        select: ['$block']
	    },
	    get(state) {
	        const project = (state.projectById || {})[state.projectId];
	        const scene = (state.sceneById || {})[state.sceneId];
	        const choice = { project, scene };
	        const select = state.select || {};
	        let graph;
	        if (project && select.ownerType === 'project') {
	            graph = project.graph;
	        }
	        else if (scene && select.ownerType === 'scene') {
	            graph = scene.graph;
	        }
	        if (graph) {
	            return graph.blocksById[select.id];
	        }
	        else {
	            return undefined;
	        }
	    }
	});
	exports.Block = (options = {}) => {
	    return (module, controller) => {
	        // This state is where we read and write to
	        // the database
	        module.addState(CurrentBlock);
	        module.addSignals({ add: add_2.add,
	            name: name_1.name,
	            select: select_1.select,
	            source: source_1.source
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(29));


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const ts = __webpack_require__(30);
	const Immutable_1 = __webpack_require__(31);
	const Playback_1 = __webpack_require__(32);
	const DEFAULT_SOURCE = __webpack_require__(43);
	const defaultMeta = Playback_1.PlaybackHelper.defaultMeta;
	var BlockHelper;
	(function (BlockHelper) {
	    BlockHelper.MAIN_SOURCE = __webpack_require__(44);
	    BlockHelper.nextBlockId = (blocksById) => {
	        let n = 0;
	        while (blocksById[`b${n}`]) {
	            n += 1;
	        }
	        return `b${n}`;
	    };
	    BlockHelper.rootBlockId = BlockHelper.nextBlockId({});
	    BlockHelper.main = () => {
	        return BlockHelper.create('main', BlockHelper.MAIN_SOURCE);
	    };
	    BlockHelper.create = (name, source = DEFAULT_SOURCE) => {
	        const info = processSource(source);
	        return Immutable_1.Immutable.merge({ id: BlockHelper.rootBlockId,
	            name,
	            source
	        }, info);
	    };
	    BlockHelper.update = (block, changes) => {
	        const newobj = Immutable_1.Immutable.merge(block, changes);
	        if (changes.source) {
	            const info = processSource(changes.source);
	            return Immutable_1.Immutable.merge(newobj, info);
	        }
	        else {
	            return newobj;
	        }
	    };
	    const processSource = (source) => {
	        let js = '';
	        try {
	            js = ts.transpile(source);
	            const codefunc = new Function('exports', js);
	            // We now run the code.
	            const exports = {};
	            codefunc(exports);
	            const input = [];
	            let output = null;
	            const render = exports.render;
	            let meta = Object.assign({}, defaultMeta, exports.meta || {});
	            if (meta.main) {
	                meta.provide = Playback_1.PlaybackHelper.mainContext;
	            }
	            if (render) {
	                const ins = meta.input || [];
	                for (let i = 0; i < render.length - 1; ++i) {
	                    input.push(ins[i] || 'any');
	                }
	                output = meta.output || 'any';
	            }
	            return { input,
	                js,
	                output,
	                meta
	            };
	        }
	        catch (err) {
	            console.log(err);
	            return { input: [],
	                js,
	                output: null,
	                meta: defaultMeta
	            };
	        }
	    };
	})(BlockHelper = exports.BlockHelper || (exports.BlockHelper = {}));


/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(73);

/***/ },
/* 31 */
/***/ function(module, exports) {

	// Object.assign polyfill
	// https://developer.mozilla.org/en/docs/Web/JavaScript/Reference/Global_Objects/Object/assign
	"use strict";
	var Immutable;
	(function (Immutable) {
	    Immutable.merge = function (t, s) {
	        return Object.freeze(Object.assign({}, t, s));
	    };
	    Immutable.remove = function (t, k) {
	        // copy
	        const res = Object.assign({}, t);
	        delete res[k];
	        return Object.freeze(res);
	    };
	    Immutable.append = function (t, s, f) {
	        const res = [...t, s];
	        if (f) {
	            res.sort(f);
	        }
	        return Object.freeze(res);
	    };
	    Immutable.insert = function (t, pos, s) {
	        const res = [];
	        const len = t.length;
	        let p = pos < 0 ? len + pos + 1 : pos;
	        if (p > len) {
	            const r = [...t];
	            let i = len;
	            while (i < p) {
	                r.push(null);
	                i += 1;
	            }
	            r.push(s);
	            return Object.freeze(r);
	        }
	        else if (p < 0) {
	            p = 0;
	        }
	        let di = 0;
	        for (let i = 0; i < len + 1; i += 1) {
	            if (i === p) {
	                res[i] = s;
	                if (t[i] === null) {
	                    continue;
	                }
	                else {
	                    di = 1;
	                }
	            }
	            if (i < len) {
	                res[i + di] = t[i];
	            }
	        }
	        return Object.freeze(res);
	    };
	    Immutable.aset = function (t, p, s) {
	        const res = [];
	        const len = Math.max(t.length, p + 1);
	        if (p < 0) {
	            throw `Cannot set indice ${p} in array of length ${len}.`;
	        }
	        for (let i = 0; i < len; i += 1) {
	            if (i === p) {
	                res[i] = s;
	            }
	            else {
	                // fill with null values if t [ i ] does not exist
	                res[i] = t[i] || null;
	            }
	        }
	        return Object.freeze(res);
	    };
	    const doUpdate = function (t, keys, pos, s) {
	        const k = keys[pos];
	        if (pos === keys.length - 1) {
	            // last
	            if (typeof s === 'function') {
	                const v = s(t[k]);
	                return Immutable.merge(t, { [k]: v });
	            }
	            else {
	                return Immutable.merge(t, { [k]: s });
	            }
	        }
	        let tv = t[k];
	        if (tv === undefined) {
	            tv = {};
	        }
	        return Immutable.merge(t, { [k]: doUpdate(tv, keys, pos + 1, s) });
	    };
	    Immutable.update = function (t, ...args) {
	        const value = args.pop();
	        const keys = args;
	        return doUpdate(t, keys, 0, value);
	    };
	    Immutable.sort = function (t, f) {
	        const res = [...t];
	        res.sort(f);
	        return Object.freeze(res);
	    };
	})(Immutable = exports.Immutable || (exports.Immutable = {}));


/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(33));
	exports.Playback = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ $main: function () { },
	            $visible: true
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Graph_1 = __webpack_require__(34);
	// This is the context defined before calling main.
	exports.MAIN_CONTEXT = {};
	const rootNodeId = Graph_1.NodeHelper.rootNodeId;
	const DUMMY = { 'text:string': 'dummy.emptyText'
	};
	const DUMMY_INPUT = () => null;
	var PlaybackHelper;
	(function (PlaybackHelper) {
	    const clearCurry = (cache) => {
	        for (const k in cache) {
	            delete cache[k].curry;
	        }
	    };
	    const updateRender = (graph, cache) => {
	        let shouldClear = false;
	        for (const nodeId in graph.nodesById) {
	            const node = graph.nodesById[nodeId];
	            if (!node) {
	                throw (`Error in graph: missing '${nodeId}'.`);
	            }
	            const block = graph.blocksById[node.blockId];
	            // main
	            let n = cache[nodeId];
	            if (!n || n.js !== block.js) {
	                // clear curry cache
	                shouldClear = true;
	                if (!n) {
	                    n = cache[nodeId] = { exports: {} };
	                }
	                else {
	                    // clear
	                    n.exports = {};
	                }
	                const exports = n.exports;
	                try {
	                    const codefunc = new Function('exports', block.js);
	                    // We now run the code. The exports is the cache.
	                    codefunc(exports);
	                    n.js = block.js;
	                }
	                catch (err) {
	                    // TODO: proper error handling
	                    console.log(`${block.name} error: ${err}`);
	                }
	                if (!exports.render) {
	                    exports.render = () => { console.log(`${block.name} error`); };
	                }
	            }
	        }
	        // Now every node has a render function
	        return shouldClear;
	    };
	    const updateCurry = (graph, cache, key) => {
	        const nc = cache.nodecache[key];
	        if (!nc) {
	            console.log(graph, cache);
	            throw `Corrupt graph. Child '${key}' not in 'nodesById'.`;
	        }
	        if (nc.curry) {
	            return nc.curry;
	        }
	        const render = nc.exports.render;
	        const e = graph.nodesById[key];
	        if (!e) {
	            // corrupt graph
	            console.log(`Invalid child ${key} in graph (node not found).`);
	            return () => { };
	        }
	        const b = graph.blocksById[e.blockId];
	        // Depth-first processing.
	        const args = [];
	        const len = Math.max(e.children.length, b.input.length);
	        for (let i = 0; i < len; ++i) {
	            const child = e.children[i];
	            if (!child) {
	                // FIXME: use a dummy input
	                args.push(DUMMY_INPUT);
	            }
	            else {
	                const f = updateCurry(graph, cache, child);
	                args.push(f);
	            }
	        }
	        // depth-first
	        if (nc.exports.init) {
	            cache.init.push(key);
	            if (!nc.cache) {
	                // cache passed in init call
	                nc.cache = {};
	            }
	        }
	        else {
	            // clear init cache
	            nc.cache = {};
	        }
	        // Create the curry function
	        const curry = (ctx) => {
	            return render(ctx, ...args);
	        };
	        nc.curry = curry;
	        return curry;
	    };
	    PlaybackHelper.compile = (graph, cache) => {
	        const output = [];
	        if (!cache.nodecache) {
	            cache.nodecache = {};
	        }
	        // update render functions for each node
	        const shouldClear = updateRender(graph, cache.nodecache);
	        // TODO: we could probably find a way to not rebuild the
	        // full graph but we might not gain any performance.
	        // Rebuild all curry functions.
	        // Clear init functions
	        cache.init = [];
	        clearCurry(cache.nodecache);
	        cache.main = updateCurry(graph, cache, rootNodeId);
	    };
	    PlaybackHelper.init = (cache, context, op) => {
	        // call in reverse depth-first order
	        // (call parent before child)
	        const init = cache.init;
	        const ncache = cache.nodecache;
	        const c = Object.assign({}, context);
	        for (let i = init.length - 1; i >= 0; --i) {
	            const node = ncache[init[i]];
	            const f = node.exports.init;
	            if (!op || (node.initOpts && node.initOpts[op])) {
	                try {
	                    c.cache = node.cache;
	                    // call init
	                    const opts = f(c);
	                    if (opts && typeof opts !== 'object') {
	                        // TODO: ERROR handling
	                        console.log(`Init return value must be an object`);
	                    }
	                    else {
	                        // save init options
	                        node.initOpts = opts;
	                    }
	                }
	                catch (err) {
	                    // TODO: capture missing required assets and libraries
	                    // and do proper error handling for init code.
	                    console.log(err);
	                }
	            }
	        }
	    };
	    class Context {
	        constructor(b, n) {
	            Object.assign(this, b, n);
	            Object.freeze(this);
	        }
	        set(n) {
	            return new Context(this, n);
	        }
	    }
	    PlaybackHelper.context = (base) => {
	        return new Context({}, base);
	    };
	    PlaybackHelper.mainContext = PlaybackHelper.context(exports.MAIN_CONTEXT);
	    PlaybackHelper.defaultMeta = Object.freeze({ provide: Object.freeze({}),
	        expect: Object.freeze({})
	    });
	})(PlaybackHelper = exports.PlaybackHelper || (exports.PlaybackHelper = {}));


/***/ },
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(35));
	__export(__webpack_require__(37));
	exports.Graph = (options = {}) => {
	    return (module, controller) => {
	        return {}; // meta information
	    };
	};


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(36));


/***/ },
/* 36 */
/***/ function(module, exports) {

	"use strict";
	exports.initUIGraph = function () {
	    return {
	        nodes: [],
	        grabpos: { x: 0, y: 0 },
	        uiNodeById: {}
	    };
	};


/***/ },
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(38));
	__export(__webpack_require__(39));
	__export(__webpack_require__(25));
	__export(__webpack_require__(26));
	// FIXME: Immutable should be in 'utils'
	__export(__webpack_require__(31));


/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const uilayout_1 = __webpack_require__(39);
	const NodeHelper_1 = __webpack_require__(26);
	const nextNodeId = NodeHelper_1.NodeHelper.nextNodeId;
	const rootNodeId = NodeHelper_1.NodeHelper.rootNodeId;
	const minSize_1 = __webpack_require__(41);
	const stringhash = __webpack_require__(42);
	/** Compute svg path of a box with up and down slots.
	 * The sizes have to be computed first in the 'info' field.
	 */
	const path = function (boxdef, layout) {
	    const { size, sextra } = boxdef;
	    const { us, ds, w, wd, wde, wu, h } = size;
	    const r = layout.RADIUS;
	    // path starts at top-left corner + RADIUS in x direction.
	    // top-left is (0,0) because we translate with a <g> tag.
	    const res = [`M${r} 0`];
	    for (let i = 0; i < us; i += 1) {
	        res.push(`h${layout.SPAD}`);
	        res.push(`l${layout.SLOT} ${-layout.SLOT}`);
	        res.push(`l${layout.SLOT} ${layout.SLOT}`);
	    }
	    // SPAD   /\  SPAD  /\
	    // +-----+  +------+  +-----------+
	    // |--------- wu ----------|
	    // |--------- w  -----------------|
	    const rpadu = w - wu;
	    if (rpadu > 0) {
	        res.push(`h${rpadu + layout.SPAD}`);
	    }
	    else {
	        res.push(`h${layout.SPAD}`);
	    }
	    res.push(`a${r} ${r} 0 0 1 ${r} ${r}`);
	    res.push(`v${h - 2 * r}`);
	    res.push(`a${r} ${r} 0 0 1 ${-r} ${r}`);
	    const rpadd = w - wd - wde + (sextra[ds] || 0);
	    if (rpadd > 0) {
	        res.push(`h${-rpadd - layout.SPAD}`);
	    }
	    else {
	        res.push(`h${-layout.SPAD}`);
	    }
	    for (let i = ds - 1; i >= 0; i -= 1) {
	        res.push(`l${-layout.SLOT} ${-layout.SLOT}`);
	        res.push(`l${-layout.SLOT} ${layout.SLOT}`);
	        res.push(`h${-layout.SPAD - (sextra[i] || 0)}`);
	    }
	    res.push(`a${r} ${r} 0 0 1 ${-r} ${-r}`);
	    res.push(`v${-h + 2 * r}`);
	    res.push(`a${r} ${r} 0 0 1 ${r} ${-r}`);
	    // res.push ( `a50 50 0 0 1 50 50` )
	    // res.push ( `l50 50` )
	    return res.join(' ');
	};
	const className = (objName, layout) => {
	    const name = objName.split('.')[0];
	    let num = 2 + stringhash(name);
	    return `box${1 + num % layout.PCOUNT}`;
	};
	/** Compute box position.
	 */
	const boxPosition = function (graph, id, layout, uigraph, ctx) {
	    const link = graph.nodesById[id];
	    const obj = graph.blocksById[link.blockId];
	    // store our position given by ctx
	    uigraph.uiNodeById[id].pos = ctx;
	    let dy = layout.HEIGHT;
	    /*
	      if ( graph.type === 'files' ) {
	        dy += layout.SUBPADY
	      }
	      else {
	      */
	    dy += layout.VPAD;
	    /*
	  }
	  */
	    let x = ctx.x;
	    const len = Math.max(link.children.length, (obj.input || []).length);
	    const sextra = uigraph.uiNodeById[id].sextra;
	    // get children
	    for (let i = 0; i < len + 1; i += 1) {
	        const childId = link.children[i];
	        const wtonext = (sextra[i] || 0) + layout.SPAD + 2 * layout.SLOT;
	        if (childId) {
	            boxPosition(graph, childId, layout, uigraph, { x, y: ctx.y + dy });
	            x += layout.BPAD + uigraph.uiNodeById[childId].size.w;
	        }
	        else if (childId === null) {
	            // empty slot, add padding and click width
	            x += layout.SCLICKW / 2 + layout.SPAD + 2 * layout.SLOT;
	        }
	    }
	    return dy;
	};
	const uimapOne = function (graph, id, ghostId, nodeId, layout, uigraph, cachebox) {
	    uigraph.uiNodeById[id] = { id };
	    const uibox = uigraph.uiNodeById[id];
	    const cache = cachebox[id] || {};
	    const link = graph.nodesById[id];
	    const obj = graph.blocksById[link.blockId];
	    uibox.name = obj.name;
	    if (ghostId === id) {
	        uibox.isghost = ghostId;
	        ghostId = 'ghost';
	    }
	    else if (nodeId === id) {
	        ghostId = null;
	    }
	    else if (ghostId === 'ghost') {
	        // for children of starting ghost, we set nodeId so that
	        // hovering with mouse during drag operation triggers a new
	        // drop preview.
	        uibox.isghost = ghostId;
	    }
	    if (obj.name === 'main') {
	        uibox.className = 'main';
	    }
	    else {
	        uibox.className = className(obj.name, layout);
	    }
	    // FIXME: only store text size in cache
	    const ds = Math.max((obj.input || []).length, (link.children || []).length);
	    let size = cache.size;
	    if (!size ||
	        size.cacheName !== obj.name ||
	        size.us !== (obj.output ? 1 : 0) ||
	        size.ds !== ds) {
	        size = minSize_1.minSize(obj, link, layout);
	    }
	    else {
	        // cache.size is immutable
	        size = Object.assign({}, size);
	    }
	    size.wde = 0;
	    const input = obj.input;
	    const slots = [];
	    const sl = layout.SLOT;
	    const sextra = [0]; // extra spacing before slots
	    // first has 0 extra spacing
	    // second has spacing dependent on first child, etc
	    if (input) {
	        let x = layout.RADIUS + layout.SPAD;
	        const y = layout.HEIGHT;
	        const len = Math.max(link.children.length, input.length);
	        // Compute sizes for all children
	        const sline = `M${-sl} ${0} h${2 * sl}`;
	        const spath = `M${-sl} ${0} l${sl} ${-sl} l${sl} ${sl}`;
	        const plus = `M${-sl} ${2 * sl} h${2 * sl} M${0} ${sl} v${2 * sl}`;
	        const r = layout.RADIUS;
	        const cw = layout.SCLICKW;
	        const ch = layout.SCLICKH;
	        // start top left below rounded corner
	        const clickp = [`M${-cw / 2} ${-sl + r}`];
	        clickp.push(`a${r} ${r} 0 0 1 ${r} ${-r}`);
	        clickp.push(`h${cw - 2 * r}`);
	        clickp.push(`a${r} ${r} 0 0 1 ${r} ${r}`);
	        clickp.push(`v${ch - 2 * r}`);
	        clickp.push(`a${r} ${r} 0 0 1 ${-r} ${r}`);
	        clickp.push(`h${-cw + 2 * r}`);
	        clickp.push(`a${r} ${r} 0 0 1 ${-r} ${-r}`);
	        clickp.push(`v${-ch + 2 * r} z`);
	        const click = clickp.join('');
	        const slotpad = layout.SPAD + 2 * layout.SLOT;
	        for (let i = 0; i < len; i += 1) {
	            const childId = link.children[i];
	            const pos = { x: x + sl, y };
	            const free = !childId;
	            if (!input[i]) {
	                // extra links outside of inputs...
	                slots.push({ path: sline,
	                    idx: i,
	                    pos,
	                    plus,
	                    click,
	                    flags: { detached: true, free }
	                });
	            }
	            else {
	                slots.push({ path: spath,
	                    idx: i,
	                    pos,
	                    plus,
	                    click,
	                    flags: { free }
	                });
	            }
	            if (childId) {
	                const nodes = uigraph.nodes;
	                // We push in sextra the delta for slot i
	                const w = uimapOne(graph, childId, ghostId, nodeId, layout, uigraph, cachebox);
	                if (i === len - 1) {
	                    // last
	                    sextra.push(w + layout.BPAD - 2 * slotpad);
	                }
	                else {
	                    sextra.push(w + layout.BPAD - slotpad);
	                }
	                x += w;
	            }
	            else {
	                // empty slot
	                if (i === len - 1) {
	                    sextra.push(0);
	                }
	                else {
	                    // empty slot adds extra padding for click
	                    const w = layout.SCLICKW / 2 + slotpad;
	                    x += w; // layout.SPAD + 2 * layout.SLOT
	                    sextra.push(w + layout.BPAD - slotpad);
	                }
	            }
	        }
	        // Compute extra size for this box depending on i-1 children ( last child
	        // does not change slot position )
	        if (sextra.length > 0) {
	            size.wde = sextra.reduce((sum, e) => sum + e);
	        }
	        // sextra.pop ()
	        size.w = Math.max(size.w, size.wd + size.wde);
	    }
	    uibox.sextra = sextra;
	    uibox.size = size;
	    uibox.path = path(uibox, layout);
	    uibox.slots = slots;
	    // draw nodes from child to parent
	    uigraph.nodes.push(id);
	    return uibox.size.w;
	};
	/** Compute the layout of a graph.
	 */
	exports.uimap = (graph, ghostId // start considering as ghost from here
	    , nodeId // stop considering as ghost from here
	    , alayout, cache) => {
	    const layout = alayout || uilayout_1.defaultUILayout;
	    const cachebox = cache ? cache.uiNodeById : {};
	    const startpos = { x: 0.5,
	        y: 0.5 + layout.SLOT + layout.RADIUS
	    };
	    const uigraph = { nodes: [],
	        grabpos: { x: startpos.x + layout.RADIUS + layout.SPAD + layout.SLOT,
	            y: startpos.y - layout.RADIUS + 6 // why do we need this 6 ?
	        },
	        uiNodeById: {}
	    };
	    uimapOne(graph, rootNodeId, ghostId, nodeId, layout, uigraph, cachebox);
	    boxPosition(graph, rootNodeId, layout, uigraph, startpos);
	    return uigraph;
	};


/***/ },
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const getTextSizeCanvas_1 = __webpack_require__(40);
	/** Some constants for graph layout.
	 * These could live in a settings object when
	 * calling boxLayout and path.
	 */
	const DEFAULT_LAYOUT = { GRIDH: 6,
	    HEIGHT: 26,
	    THEIGHT: 20,
	    RADIUS: 5,
	    SLOT: 5,
	    SPAD: 16 // slot pad
	    ,
	    SCLICKW: 0 // (computed from SLOT and SPAD ) slot click rect width
	    ,
	    SCLICKH: 0 // (computed from HEIGHT) slot click rect height
	    ,
	    TPAD: 8,
	    BPAD: 0 // pad between siblings
	    ,
	    PCOUNT: 12 // palette color count must be the same as _palettee.scss
	    ,
	    SUBPADX: 0 // (computed  = 2 * GRIDH) pad in sub assets
	    ,
	    SUBPADY: 4 // (computed  = 2 * GRIDH) pad in sub assets
	    ,
	    VPAD: 0 // vertical padding between boxes
	    ,
	    tsizer: null
	};
	exports.UILayout = (o) => {
	    const res = Object.assign({}, DEFAULT_LAYOUT, o || {});
	    res.SUBPADX = 2 * res.GRIDH;
	    res.SCLICKW = res.SPAD + 2 * res.SLOT;
	    res.SCLICKH = 1.2 * res.HEIGHT;
	    if (!res.tsizer) {
	        res.tsizer = getTextSizeCanvas_1.getTextSizeCanvas('10pt Avenir Next');
	    }
	    return res;
	};
	exports.defaultUILayout = exports.UILayout();


/***/ },
/* 40 */
/***/ function(module, exports) {

	"use strict";
	exports.getTextSizeCanvas = (font) => {
	    const canvas = document.createElement('canvas');
	    const context = canvas.getContext('2d');
	    context.font = font;
	    return (text) => {
	        const w = context.measureText(text);
	        return { width: Math.ceil(w.width) };
	    };
	};


/***/ },
/* 41 */
/***/ function(module, exports) {

	"use strict";
	/** Compute the minimum size to display the element.
	 */
	exports.minSize = (obj, link, layout) => {
	    const ds = Math.max(obj.input.length, link.children.length);
	    const us = obj.output ? 1 : 0;
	    const tb = layout.tsizer(obj.name);
	    let w = tb.width + 2 * layout.TPAD;
	    // width down (taken by inlets)
	    const wd = layout.RADIUS +
	        ds * (layout.SPAD + 2 * layout.SLOT) +
	        layout.SPAD + layout.RADIUS;
	    // width up (taken by outlets)
	    const wu = layout.RADIUS +
	        us * (layout.SPAD + 2 * layout.SLOT) +
	        layout.SPAD + layout.RADIUS;
	    w = Math.ceil(Math.max(w, wd, wu) / layout.GRIDH) * layout.GRIDH;
	    return { cacheName: obj.name // cache reference
	        ,
	        w,
	        h: layout.HEIGHT,
	        tx: layout.TPAD,
	        ty: layout.HEIGHT / 2 + layout.THEIGHT / 4,
	        wd,
	        wu,
	        ds,
	        us,
	        wde: 0
	    };
	};


/***/ },
/* 42 */
/***/ function(module, exports) {

	module.exports = function(str) {
	  var hash = 5381,
	      i    = str.length
	
	  while(i)
	    hash = (hash * 33) ^ str.charCodeAt(--i)
	
	  /* JavaScript does bitwise operations (like XOR, above) on 32-bit signed
	   * integers. Since we want the results to be always positive, if the high bit
	   * is set, unset it and add it back in through (64-bit IEEE) addition. */
	  return hash >= 0 ? hash : (hash & 0x7FFFFFFF) + 0x80000000
	}


/***/ },
/* 43 */
/***/ function(module, exports) {

	module.exports = "/**\n */\n\nexport const render =\n( ctx ) => {\n\n}\n\nexport const meta =\n{ author: ''\n, description: ''\n, tags: []\n, expect: {}\n, provide: {}\n, input: []\n, output: 'any'\n}\n"

/***/ },
/* 44 */
/***/ function(module, exports) {

	module.exports = "export const render =\n( ctx, child ) => {\n  child ( ctx )\n}\n\nexport const meta =\n{ main: true\n}\n"

/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(46);
	const save_1 = __webpack_require__(47);
	exports.add = [addAction_1.addAction,
	    ...save_1.save
	];


/***/ },
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Immutable_1 = __webpack_require__(31);
	// FIXME: why is this 'undefined' if imported from 'Graph' above ?
	const GraphHelper_1 = __webpack_require__(25);
	const BlockHelper_1 = __webpack_require__(29);
	const rootBlockId = BlockHelper_1.BlockHelper.rootBlockId;
	exports.addAction = ({ state, input, output }) => {
	    const { pos, parentId, ownerType, componentId } = input;
	    const owner = state.get([ownerType]);
	    let child;
	    if (componentId) {
	        child = state.get(['data', 'component', componentId]).graph;
	    }
	    else {
	        // if we have a block named 'default' in library, we use this
	        const library = state.get(['data', 'component']);
	        for (const k in library) {
	            if (library[k].name === 'default') {
	                child = Immutable_1.Immutable.update(library[k].graph, 'blocksById', rootBlockId, 'name', 'new block');
	                break;
	            }
	        }
	        if (!child) {
	            child = GraphHelper_1.GraphHelper.create('new block');
	        }
	    }
	    const graph = GraphHelper_1.GraphHelper.insert(owner.graph, parentId, pos, child);
	    const ownerupdate = Object.assign({}, owner, { graph });
	    // triger name edit after object save
	    // FIXME
	    // state.set ( [ '$factory', 'editing' ], child._id )
	    output({ doc: ownerupdate });
	};


/***/ },
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const saveAction_1 = __webpack_require__(48);
	const status_1 = __webpack_require__(3);
	exports.save = [saveAction_1.saveAction,
	    { success: [],
	        error: [status_1.status]
	    }
	];


/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(24);
	exports.saveAction = ({ state, input: { doc, docs }, services: { data: { db } }, output }) => {
	    if (docs) {
	        db.bulkDocs(docs, (err) => {
	            if (err) {
	                output.error({ status: { type: 'error', message: err } });
	            }
	            else {
	                output.success({ status: { type: 'success',
	                        message: `Saved ${docs[0].type}`
	                    }
	                });
	            }
	        });
	    }
	    else if (doc) {
	        // setTimeout ( () => {
	        db.put(doc, (err) => {
	            if (err) {
	                output.error({ status: { type: 'error', message: err.message } });
	            }
	            else {
	                output.success({ status: { type: 'success', message: `Saved ${doc.type}` } });
	            }
	        });
	    }
	    else {
	        throw 'Missing "docs" or "doc" in Data.save';
	    }
	};
	exports.saveAction['async'] = true;
	// Cerebral type checking
	const mdoc = { _id: 'string', type: 'string' };
	exports.saveAction['input'] = (v) => {
	    return check.maybe.like(v.doc, mdoc)
	        && check.maybe.array.of.like(v.docs, mdoc);
	};


/***/ },
/* 49 */
/***/ function(module, exports) {

	"use strict";
	exports.AnySlot = 'any';


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(118);

/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const nameAction_1 = __webpack_require__(52);
	const save_1 = __webpack_require__(47);
	exports.name = [nameAction_1.nameAction,
	    ...save_1.save
	];


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(27);
	const Graph_1 = __webpack_require__(34);
	exports.nameAction = ({ state, input: { value }, output }) => {
	    const path = ['block', 'name'];
	    // close editable
	    state.set(['$factory', 'editing'], false);
	    // mark element as 'saving'
	    state.set(['$factory', ...path, 'saving'], true);
	    // temporary value during save
	    state.set(['$factory', ...path, 'value'], value);
	    // prepare doc
	    const select = state.get(['$block']);
	    if (!select) {
	        return;
	    }
	    const doc = Graph_1.Immutable.update(state.get([select.ownerType]), 'graph', 'blocksById', select.id, (block) => _1.BlockHelper.update(block, { name: value }));
	    output({ doc });
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const selectAction_1 = __webpack_require__(54);
	exports.select = 
	// prepare things to add
	[selectAction_1.selectAction
	];


/***/ },
/* 54 */
/***/ function(module, exports) {

	"use strict";
	exports.selectAction = ({ state, input: { doc, docs, id, ownerType }, output }) => {
	    const sel = state.get(['$block']);
	    if (doc) {
	        const graph = doc.graph;
	        if (sel) {
	            // do not select if block is hidden
	            state.set(['$block'], { id: graph.blockId, ownerType });
	        }
	    }
	    else {
	        // simple select
	        if (sel && id == sel.id && ownerType == sel.ownerType) {
	            // toggle
	            state.unset(['$block']);
	        }
	        else {
	            // make sure we 'blur' to save edited content...
	            document.body.click();
	            state.set(['$block'], { id, ownerType });
	        }
	    }
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const sourceAction_1 = __webpack_require__(56);
	const save_1 = __webpack_require__(47);
	exports.source = [sourceAction_1.sourceAction,
	    ...save_1.save
	];


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(27);
	const Graph_1 = __webpack_require__(34);
	exports.sourceAction = ({ state, input: { value }, output }) => {
	    // prepare doc
	    const select = state.get(['$block']);
	    if (!select) {
	        return;
	    }
	    const doc = Graph_1.Immutable.update(state.get([select.ownerType]), 'graph', 'blocksById', select.id, (block) => _1.BlockHelper.update(block, { source: value }));
	    output({ doc });
	};


/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Block_1 = __webpack_require__(27);
	const Factory_1 = __webpack_require__(10);
	const GraphHelper_1 = __webpack_require__(25);
	const rootBlockId = Block_1.BlockHelper.rootBlockId;
	var SceneHelper;
	(function (SceneHelper) {
	    SceneHelper.create = () => {
	        const _id = Factory_1.makeId();
	        const graph = GraphHelper_1.GraphHelper.create();
	        return Object.freeze({ _id,
	            type: 'scene',
	            name: 'New scene',
	            graph,
	            blockId: rootBlockId
	        });
	    };
	    SceneHelper.select = (state, user, scene) => {
	        if (!scene) {
	            return Object.assign({}, user, { sceneId: null
	            });
	        }
	        return Object.assign({}, user, { sceneId: scene._id
	        });
	    };
	})(SceneHelper = exports.SceneHelper || (exports.SceneHelper = {}));


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(24);
	exports.selectAction = ({ state, input: { _id }, output, services }) => {
	    const project = state.get(['data', 'project', _id]);
	    state.set(['$projectId'], _id);
	    if (!project) {
	        // FIXME: redirect is bad. We should find another way of showing
	        // that the project is not available.
	        return;
	    }
	    const sceneId = state.get(['$sceneId']);
	    if (project.scenes.indexOf(sceneId) >= 0) {
	    }
	    else {
	        state.set(['$sceneId'], project.scenes[0]);
	    }
	};
	exports.selectAction['input'] =
	    { _id: check.string
	    };


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(60);
	const save_1 = __webpack_require__(47);
	exports.add = [addAction_1.addAction,
	    ...save_1.save
	];


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Project_1 = __webpack_require__(8);
	exports.addAction = ({ state, input: {  }, output }) => {
	    const { project, scene } = Project_1.ProjectHelper.create();
	    const docs = [scene, project];
	    // This is a flag that will set name editing after db object
	    // is selected.
	    state.set(['$factory', 'editing'], project._id);
	    // add to user's projects
	    const user = state.get(['user']);
	    const projects = [project._id, ...(user.projects || [])];
	    docs.push(Object.assign({}, user, { projectId: project._id, sceneId: scene._id }));
	    output({ docs });
	};


/***/ },
/* 61 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const saveDoc_1 = __webpack_require__(62);
	const set = __webpack_require__(64);
	exports.name = [set('output:/type', 'project'),
	    set('output:/key', 'name'),
	    ...saveDoc_1.saveDoc
	];


/***/ },
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const docAction_1 = __webpack_require__(63);
	const save_1 = __webpack_require__(47);
	exports.saveDoc = [docAction_1.docAction,
	    ...save_1.save
	];


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(24);
	exports.docAction = ({ state, input: { key, type, value }, output }) => {
	    // prepare doc
	    const doc = Object.assign({}, state.get([type]), { [key]: value });
	    const path = [type, key];
	    // mark element as 'saving'
	    state.set(['$factory', ...path, 'saving'], true);
	    // temporary value during save
	    state.set(['$factory', ...path, 'value'], value);
	    output({ doc });
	};
	exports.docAction['input'] =
	    { type: check.string,
	        key: check.string,
	        value: check.string
	    };


/***/ },
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(65).default


/***/ },
/* 65 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (path, value) {
	  var setValue = (0, _set2.default)(path);
	
	  var set = function set(args) {
	    var response = setValue(args, value);
	    if (response && typeof response.then === 'function') {
	      response.then(args.output.success).catch(args.output.error);
	    }
	  };
	
	  set.displayName = 'addons.set(' + (0, _toDisplayName2.default)(path, setValue) + ', ' + JSON.stringify(value) + ')';
	
	  return set;
	};
	
	var _set = __webpack_require__(66);
	
	var _set2 = _interopRequireDefault(_set);
	
	var _toDisplayName = __webpack_require__(74);
	
	var _toDisplayName2 = _interopRequireDefault(_toDisplayName);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 66 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(67).default


/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = compile;
	
	var _compiler = __webpack_require__(68);
	
	var _compiler2 = _interopRequireDefault(_compiler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function compile(path) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? 'set' : arguments[1];
	
	  return (0, _compiler2.default)(path, fn, false);
	}

/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = compile;
	
	var _input = __webpack_require__(69);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _output = __webpack_require__(71);
	
	var _output2 = _interopRequireDefault(_output);
	
	var _state = __webpack_require__(72);
	
	var _state2 = _interopRequireDefault(_state);
	
	var _parseUrl = __webpack_require__(73);
	
	var _parseUrl2 = _interopRequireDefault(_parseUrl);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function compile(path, fn, isGetter) {
	  if (typeof path === 'string') {
	    // check if the string is a url
	    var url = (0, _parseUrl2.default)(path);
	    if (url) {
	      var urlPath = url.path && url.path.split('.') || [];
	      if (url.scheme === 'input' && fn === 'get') {
	        return (0, _input2.default)(path, url, urlPath);
	      } else if (url.scheme === 'output' && fn === 'set') {
	        return (0, _output2.default)(path, url, urlPath);
	      } else if (url.scheme === 'state') {
	        return (0, _state2.default)(path, url, urlPath, fn, isGetter);
	      } else {
	        return console.error(path + ' : not supported by input, output or state.' + fn);
	      }
	    }
	  } else if (typeof path === 'function') {
	    // for functions simply return them
	    return path;
	  }
	  // other values (probably an array or non-url string) are passed through to state.fn
	  var stateFn = function state(_ref) {
	    var state = _ref.state;
	
	    for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	      values[_key - 1] = arguments[_key];
	    }
	
	    if (isGetter) {
	      return path ? state[fn].apply(state, [path].concat(values)) : state[fn].apply(state, values);
	    } else {
	      if (path) {
	        state[fn].apply(state, [path].concat(values));
	      } else {
	        state[fn].apply(state, values);
	      }
	      return values.length === 1 ? values[0] : values;
	    }
	  };
	  stateFn.displayName = 'state.' + fn;
	  return stateFn;
	}

/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _objectPath = __webpack_require__(70);
	
	exports.default = function (path, url, urlPath) {
	  // get the value from the input object
	  return function input(_ref) {
	    var input = _ref.input;
	
	    return urlPath ? (0, _objectPath.getPathValue)(input, urlPath) : input;
	  };
	};

/***/ },
/* 70 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.getPathValue = getPathValue;
	exports.setPathValue = setPathValue;
	function getPathValue(obj, path) {
	  var value = undefined;
	  if (obj && path) {
	    if (Array.isArray(path)) {
	      value = obj;
	      path.forEach(function (key) {
	        if (value) {
	          value = value[key];
	        }
	      });
	    } else {
	      value = obj[path];
	    }
	  }
	  return value;
	}
	
	function setPathValue(obj, path, value) {
	  if (obj && path) {
	    if (Array.isArray(path)) {
	      (function () {
	        var node = obj;
	        path.forEach(function (key, index) {
	          node = node[key] = index + 1 < path.length ? node[key] || {} : value;
	        });
	      })();
	    } else {
	      obj[path] = value;
	    }
	  }
	}

/***/ },
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _objectPath = __webpack_require__(70);
	
	exports.default = function (path, url, urlPath) {
	  // add the value to the input object and pass it to output
	  return function output(_ref, value) {
	    var input = _ref.input;
	    var output = _ref.output;
	
	    var outputValue = value && typeof value.toJS === 'function' ? value.toJS() : value && value.constructor === Object && Object.isFrozen(value) ? JSON.parse(JSON.stringify(value)) : value;
	    if (urlPath) {
	      (0, _objectPath.setPathValue)(input, urlPath, outputValue);
	      output(input);
	    } else {
	      output(outputValue);
	    }
	    return value;
	  };
	};

/***/ },
/* 72 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	function _toConsumableArray(arr) { if (Array.isArray(arr)) { for (var i = 0, arr2 = Array(arr.length); i < arr.length; i++) { arr2[i] = arr[i]; } return arr2; } else { return Array.from(arr); } }
	
	var execute = function execute(state, values, urlPath, fn, isGetter) {
	  if (isGetter) {
	    return urlPath ? state[fn].apply(state, [urlPath].concat(_toConsumableArray(values))) : state[fn].apply(state, _toConsumableArray(values));
	  } else {
	    if (urlPath) {
	      state[fn].apply(state, [urlPath].concat(_toConsumableArray(values)));
	    } else {
	      state[fn].apply(state, _toConsumableArray(values));
	    }
	    return values.length === 1 ? values[0] : values;
	  }
	};
	
	exports.default = function (path, url, urlPath, fn, isGetter) {
	  if (url.host) {
	    // process on the named module
	    var moduleFn = function moduleState(_ref) {
	      var modules = _ref.modules;
	      var state = _ref.state;
	
	      var module = modules[url.host];
	      if (!module) {
	        return console.error(path + " : module was not found.");
	      }
	
	      for (var _len = arguments.length, values = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	        values[_key - 1] = arguments[_key];
	      }
	
	      return execute(state, values, [].concat(_toConsumableArray(module.path), _toConsumableArray(urlPath)), fn, isGetter);
	    };
	    moduleFn.displayName = "module.state." + fn;
	    return moduleFn;
	  } else {
	    // process on the global state
	    var stateFn = function state(_ref2) {
	      var state = _ref2.state;
	
	      for (var _len2 = arguments.length, values = Array(_len2 > 1 ? _len2 - 1 : 0), _key2 = 1; _key2 < _len2; _key2++) {
	        values[_key2 - 1] = arguments[_key2];
	      }
	
	      return execute(state, values, urlPath, fn, isGetter);
	    };
	    stateFn.displayName = "state." + fn;
	    return stateFn;
	  }
	};

/***/ },
/* 73 */
/***/ function(module, exports) {

	"use strict";
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = parseUrl;
	var regex = /^(\w+):(\/\/([^\/]+))?\/([^\/][^\?]*)?(\?(.*))?$/;
	
	function parseUrl(url) {
	  var match = regex.exec(url);
	  return !match ? null : {
	    scheme: match[1],
	    host: match[3],
	    path: match[4]
	  };
	}

/***/ },
/* 74 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (path, getter) {
	  return typeof path === 'function' ? getter.displayName || getter.name : JSON.stringify(path);
	};

/***/ },
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const selectAction_1 = __webpack_require__(58);
	const save_1 = __webpack_require__(47);
	exports.select = 
	// prepare things to add
	[selectAction_1.selectAction,
	    ...save_1.save
	];
	// FIXME: remove (has been replaced by selectProject in app)


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(77).default


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (fromPath) {
	  var getValue = (0, _get2.default)(fromPath);
	
	  for (var _len = arguments.length, toPaths = Array(_len > 1 ? _len - 1 : 0), _key = 1; _key < _len; _key++) {
	    toPaths[_key - 1] = arguments[_key];
	  }
	
	  var setValues = toPaths.map(function (toPath) {
	    return (0, _set2.default)(toPath);
	  });
	
	  var copyTo = function copyTo(setters, args, value, async) {
	    if (setters.length === 0) {
	      if (async) {
	        args.output.success(value);
	      }
	    } else {
	      var response = setters[0](args, value);
	      if (response && typeof response.then === 'function') {
	        response.then(function (val) {
	          return copyTo(setters.slice(1), args, val, true);
	        }).catch(args.output.error);
	      } else {
	        copyTo(setters.slice(1), args, response, async);
	      }
	    }
	  };
	
	  var copy = function copyFrom(args) {
	    var value = getValue(args);
	    if (value && typeof value.then === 'function') {
	      value.then(function (val) {
	        return copyTo(setValues, args, val, true);
	      }).catch(args.output.error);
	    } else {
	      copyTo(setValues, args, value);
	    }
	  };
	
	  copy.displayName = 'addons.copy(' + (0, _toDisplayName2.default)(fromPath, getValue) + ', ' + toPaths.map(function (path, index) {
	    return (0, _toDisplayName2.default)(path, setValues[index]);
	  }).join(', ') + ')';
	
	  return copy;
	};
	
	var _get = __webpack_require__(78);
	
	var _get2 = _interopRequireDefault(_get);
	
	var _set = __webpack_require__(66);
	
	var _set2 = _interopRequireDefault(_set);
	
	var _toDisplayName = __webpack_require__(74);
	
	var _toDisplayName2 = _interopRequireDefault(_toDisplayName);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(79).default


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = compile;
	
	var _compiler = __webpack_require__(68);
	
	var _compiler2 = _interopRequireDefault(_compiler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function compile(path) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? 'get' : arguments[1];
	
	  return (0, _compiler2.default)(path, fn, true);
	}

/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(81).default


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _typeof = typeof Symbol === "function" && typeof Symbol.iterator === "symbol" ? function (obj) { return typeof obj; } : function (obj) { return obj && typeof Symbol === "function" && obj.constructor === Symbol ? "symbol" : typeof obj; };
	
	var _get = __webpack_require__(78);
	
	var _get2 = _interopRequireDefault(_get);
	
	var _toDisplayName = __webpack_require__(74);
	
	var _toDisplayName2 = _interopRequireDefault(_toDisplayName);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	var truthy = Symbol('truthy');
	var falsy = Symbol('falsy');
	var otherwise = Symbol('otherwise');
	
	function when(path) {
	  var conditions = arguments.length <= 1 || arguments[1] === undefined ? { 'true': truthy, 'false': otherwise } : arguments[1];
	
	  var getValue = (0, _get2.default)(path);
	
	  // prepare the output conditions
	  var otherwisePath = null;
	  var outputConditions = {};
	  if (Array.isArray(conditions)) {
	    conditions.forEach(function (condition) {
	      outputConditions[condition] = condition;
	    });
	  } else {
	    for (var _path in conditions) {
	      outputConditions[_path] = conditions[_path];
	      otherwisePath = otherwisePath || conditions[_path] === otherwise && _path;
	    }
	  }
	  if (!otherwisePath) {
	    outputConditions['otherwise'] = otherwise;
	    otherwisePath = 'otherwise';
	  }
	
	  // test the getter returned value
	  var whenTest = function whenTest(args, value) {
	    // treat objects with no keys as falsy
	    if (value && (typeof value === 'undefined' ? 'undefined' : _typeof(value)) === 'object' && Object.keys(value).length === 0) {
	      value = false;
	    }
	
	    var outputPath = void 0;
	
	    for (var _path2 in outputConditions) {
	      var test = outputConditions[_path2];
	      if (test !== otherwise && (test === value || test === truthy && value || test === falsy && !value)) {
	        outputPath = _path2;
	        break;
	      }
	    }
	
	    args.output[outputPath || otherwisePath]();
	  };
	
	  // define the action
	  var action = function whenRead(args) {
	    var value = getValue(args);
	    if (value && typeof value.then === 'function') {
	      value.then(function (val) {
	        return whenTest(args, val);
	      }).catch(function (error) {
	        console.error(action.displayName + ' caught an error whilst getting a value to test', error);
	      });
	    } else {
	      whenTest(args, value);
	    }
	  };
	
	  action.outputs = Object.keys(outputConditions);
	
	  action.displayName = 'addons.when(' + (0, _toDisplayName2.default)(path, getValue) + ')';
	
	  return action;
	}
	
	when.truthy = truthy;
	when.falsy = falsy;
	when.otherwise = otherwise;
	
	exports.default = when;

/***/ },
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const testing_1 = __webpack_require__(83);
	const runall_1 = __webpack_require__(84);
	const stats_1 = __webpack_require__(107);
	const status_1 = __webpack_require__(3);
	exports.runtests = [testing_1.testing,
	    status_1.status,
	    [runall_1.runall, { success: [stats_1.stats, { success: [status_1.status] }] }] // async
	];


/***/ },
/* 83 */
/***/ function(module, exports) {

	"use strict";
	exports.testing = ({ state, output }) => {
	    output({ status: { type: 'info', message: 'Started testing' } });
	};


/***/ },
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(85);
	const runner_1 = __webpack_require__(87);
	exports.runall = ({ state, output }) => {
	    runner_1.run((stats) => {
	        output.success({ stats });
	    });
	};
	exports.runall['async'] = true;


/***/ },
/* 85 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(86);
	__webpack_require__(91);
	__webpack_require__(93);
	__webpack_require__(95);
	__webpack_require__(96);
	__webpack_require__(97);
	__webpack_require__(98);
	__webpack_require__(99);
	__webpack_require__(100);
	__webpack_require__(101);
	__webpack_require__(106);


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(12);
	const runner_1 = __webpack_require__(87);
	const e = (sel, klass, obj) => {
	    const o = Object.assign({ sel, data: {}, children: [] }, obj || {});
	    if (klass) {
	        o.data.class = { [klass]: true };
	    }
	    return o;
	};
	runner_1.describe('Component.createElement', (it) => {
	    it('should be a function', (assert) => {
	        assert.equal(typeof Component_1.Component.createElement, 'function');
	    });
	    it('should create simple object', (assert) => {
	        assert.equal(Component_1.Component.createElement("foo", null), e('foo'));
	    });
	    it('should accept class string', (assert) => {
	        assert.equal(Component_1.Component.createElement("div", {class: 'foo bar'}), { sel: 'div',
	            data: { class: { foo: true, bar: true }
	            },
	            children: []
	        });
	    });
	    it('should accept style string', (assert) => {
	        assert.equal(Component_1.Component.createElement("div", {style: 'color:#555'}), { sel: 'div',
	            data: { style: { color: '#555' }
	            },
	            children: []
	        });
	    });
	    it('should accept mixed children', (assert) => {
	        assert.equal(Component_1.Component.createElement("ol", null, 
	            [Component_1.Component.createElement("li", {class: 'one'}), Component_1.Component.createElement("li", {class: 'two'})], 
	            Component_1.Component.createElement("li", {class: 'three'}), 
	            [Component_1.Component.createElement("li", {class: 'four'})]), { sel: 'ol',
	            data: {},
	            children: [e('li', 'one'),
	                e('li', 'two'),
	                e('li', 'three'),
	                e('li', 'four')
	            ]
	        });
	    });
	    it('should move data-xx in attrs', (assert) => {
	        assert.equal(Component_1.Component.createElement("foo", {"data-bing": 'top'}), { sel: 'foo',
	            data: { attrs: { ['data-bing']: 'top' } },
	            children: []
	        });
	    });
	    it('should move data-xx in attrs for svg', (assert) => {
	        const r = Component_1.Component.createElement("svg", null, 
	            Component_1.Component.createElement("path", {"data-bing": 'top'})
	        );
	        assert.equal(r.children[0].data.attrs, { ['data-bing']: 'top'
	        });
	    });
	    it('should optimize through key', (assert) => {
	        const Foo = Component_1.Component({}, ({  }) => Component_1.Component.createElement("div", null));
	        const a = Component_1.Component.createElement(Foo, {key: 'bar'});
	        const b = Component_1.Component.createElement(Foo, {key: 'bar'});
	        const c = Component_1.Component.createElement(Foo, {key: 'bing'});
	        const d = Component_1.Component.createElement(Foo, null);
	        assert.same(a, b);
	        assert.notSame(a, c);
	        assert.notSame(a, d);
	    });
	    it('should wrap props', (assert) => {
	        assert.equal(Component_1.Component.createElement("foo", {bing: 'top'}), { sel: 'foo',
	            data: { props: { bing: 'top' } },
	            children: []
	        });
	    });
	    it('should parse hooks in sub components', (assert) => {
	        const SubComp = (opts) => opts;
	        assert.equal(Component_1.Component.createElement("foo", null, 
	            Component_1.Component.createElement(SubComp, {foo: 'hop', "on-change": 'bang'})
	        ), { sel: 'foo',
	            data: {},
	            children: [{ on: { change: 'bang' },
	                    foo: 'hop'
	                }
	            ]
	        });
	    });
	    it('should wrap svg without attrs', (assert) => {
	        const ns = 'http://www.w3.org/2000/svg';
	        assert.equal(Component_1.Component.createElement("svg", null, 
	            Component_1.Component.createElement("foo", {bing: 'top'})
	        ), { sel: 'svg',
	            data: { ns, attrs: {} },
	            children: [{ sel: 'foo',
	                    data: { ns, attrs: { bing: 'top' } },
	                    children: []
	                }
	            ]
	        });
	    });
	    it('should wrap svg with attrs', (assert) => {
	        const ns = 'http://www.w3.org/2000/svg';
	        assert.equal(Component_1.Component.createElement("svg", {width: '10'}, 
	            Component_1.Component.createElement("foo", {bing: 'top'})
	        ), { sel: 'svg',
	            data: { ns, attrs: { width: '10' } },
	            children: [{ sel: 'foo',
	                    data: { ns, attrs: { bing: 'top' } },
	                    children: []
	                }
	            ]
	        });
	    });
	    it('should allow rows.map', (assert) => {
	        const rows = ['a', 'b'];
	        const rmap = (r) => Component_1.Component.createElement("li", null, r);
	        assert.equal((Component_1.Component.createElement("ul", null, rows.map(rmap))).children, [e('li', null, { children: [{ text: 'a' }] }),
	            e('li', null, { children: [{ text: 'b' }] })
	        ]);
	    });
	    it('should allow rows.map with mixed', (assert) => {
	        const rows = ['a', 'b'];
	        const rmap = (r) => Component_1.Component.createElement("li", null, r);
	        assert.equal((Component_1.Component.createElement("ul", null, 
	            Component_1.Component.createElement("li", null, "foo"), 
	            rows.map(rmap))).children, [e('li', null, { children: [{ text: 'foo' }] }),
	            e('li', null, { children: [{ text: 'a' }] }),
	            e('li', null, { children: [{ text: 'b' }] })
	        ]);
	    });
	});


/***/ },
/* 87 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const deepEqual = __webpack_require__(88);
	const DEFAULT_TIMEOUT = 3000;
	const NO_ERR = { message: 'did not throw' };
	const suites = [];
	exports.describe = function (name, clbk) {
	    const suite = { name, tests: [] };
	    suites.push(suite);
	    const it = (testname, test) => {
	        suite.tests.push({ suiteName: name,
	            testName: testname,
	            test,
	            async: test.length === 2
	        });
	    };
	    clbk(it);
	};
	const defaultSuccess = ({ suiteName, testName }) => {
	    // console.log ( `PASS: ${ suiteName } ${ testName }` )
	};
	const defaultPending = ({ suiteName, testName, actual }) => {
	    console.log(`PEND: ${suiteName} ${testName}`);
	    console.log(actual);
	    return true;
	};
	exports.failureMessage = (f) => {
	    const m = [];
	    m.push(`FAIL: ${f.suiteName} ${f.testName}`);
	    switch (f.assertion) {
	        case 'timeout':
	            m.push('timeout exceeded', f.actual);
	            break;
	        case 'notSame':
	            m.push('expected', f.actual);
	            m.push('to not be', f.expected);
	            break;
	        case 'same':
	            m.push('expected', f.actual);
	            m.push('to be', f.expected);
	            break;
	        case 'equal':
	            m.push('expected');
	            m.push(JSON.stringify(f.actual, null, 2));
	            m.push('to equal');
	            m.push(JSON.stringify(f.expected, null, 2));
	            break;
	        default:
	        case 'throws':
	            m.push(f.assertion);
	    }
	    m.push(f.error);
	    return m.join('\n'); // continue
	};
	const defaultFail = (f) => {
	    console.log(exports.failureMessage(f));
	    return true; // continue
	};
	const makeAssert = function (f, stats) {
	    return {
	        same(a, b) {
	            stats.assertCount += 1;
	            f.assertion = 'same';
	            f.actual = a;
	            f.expected = b;
	            if (a !== b) {
	                f.error = new Error(`${a} !== ${b}`);
	                if (f.async) {
	                }
	                else {
	                    throw f.error;
	                }
	            }
	        },
	        notSame(a, b) {
	            stats.assertCount += 1;
	            f.assertion = 'notSame';
	            f.actual = a;
	            f.expected = b;
	            if (a === b) {
	                f.error = new Error(`${a} === ${b}`);
	                if (f.async) {
	                }
	                else {
	                    throw f.error;
	                }
	            }
	        },
	        equal(a, b) {
	            stats.assertCount += 1;
	            f.assertion = 'equal';
	            f.actual = a;
	            f.expected = b;
	            if (!deepEqual(a, b, { strict: true })) {
	                f.error = new Error(`!deepEqual ( ${a}, ${b} )`);
	                if (f.async) {
	                }
	                else {
	                    throw f.error;
	                }
	            }
	        },
	        throws(func, regex) {
	            f.assertion = 'throws';
	            f.expected = regex;
	            let err = NO_ERR;
	            try {
	                func();
	            }
	            catch (e) {
	                err = e;
	            }
	            if (err === NO_ERR || (regex && !regex.test(err.message))) {
	                if (regex) {
	                    f.error = new Error(`${err.message} does not match ${regex}`);
	                }
	                else {
	                    f.error = new Error(`${err.message}`);
	                }
	                if (f.async) {
	                }
	                else {
	                    throw f.error;
	                }
	            }
	        },
	        pending(m) {
	            f.assertion = 'pending';
	            f.actual = m;
	            f.error = new Error(m);
	            if (f.async) {
	            }
	            else {
	                throw f.error;
	            }
	        }
	    };
	};
	const runNext = function (gen, f) {
	    const tim = gen.next().value;
	    if (tim) {
	        // async yield
	        setTimeout(() => tim.next ? f() : null, tim.timeout);
	    }
	    // done ( onfinish called from generator )
	};
	exports.run = function (onfinish, opts) {
	    let gen;
	    const f = () => runNext(gen, f);
	    gen = testGen(onfinish, opts || {}, f);
	    f();
	};
	const testGen = function* (onfinish, { onsuccess = defaultSuccess, onfail = defaultFail, onpending = defaultPending, onsuite, ontest }, forward) {
	    let failures = [];
	    const stats = { testCount: 0, failCount: 0, passCount: 0, pendingCount: 0,
	        assertCount: 0,
	        failures
	    };
	    let failure = {};
	    let assert = makeAssert(failure, stats);
	    const pass = (test) => {
	        // PASS
	        stats.passCount += 1;
	        onsuccess(test);
	    };
	    const fail = (test, error) => {
	        Object.assign(failure, { error }, test);
	        failures.push(failure);
	        if (failure.assertion === 'pending') {
	            stats.pendingCount += 1;
	            onpending(failure);
	        }
	        else {
	            stats.failCount += 1;
	            if (!onfail(failure)) {
	                // abort
	                onfinish(stats);
	                return true;
	            }
	        }
	        failure = {};
	        assert = makeAssert(failure, stats);
	        return false;
	    };
	    const done = () => {
	        // clear
	        failure.async = false;
	        forward();
	    };
	    for (const suite of suites) {
	        if (onsuite) {
	            onsuite(suite);
	        }
	        for (const test of suite.tests) {
	            stats.testCount += 1;
	            if (ontest) {
	                ontest(test);
	            }
	            try {
	                if (test.async) {
	                    test.test(assert, done);
	                    // continue with async
	                    failure.async = true;
	                    const tim = { timeout: DEFAULT_TIMEOUT,
	                        next: true // call next on timeout
	                    };
	                    yield tim;
	                    if (failure.async) {
	                        // timed out
	                        failure.assertion = 'timeout';
	                        failure.actual = DEFAULT_TIMEOUT;
	                        if (fail(test, 'timeout')) {
	                            yield; // abort
	                        }
	                    }
	                    else if (failure.error) {
	                        tim.next = false; // on timeout do nothing
	                        // assertion failure
	                        if (fail(test, failure.error)) {
	                            yield; // abort
	                        }
	                    }
	                    else {
	                        tim.next = false;
	                        // pass
	                        pass(test);
	                    }
	                }
	                else {
	                    test.test(assert);
	                    pass(test);
	                }
	            }
	            catch (error) {
	                // FAIL
	                if (!failure.error) {
	                    // exception in user code
	                    failure.assertion = 'exception';
	                }
	                if (fail(test, error)) {
	                    yield; // abort
	                }
	            }
	        }
	    }
	    // all done
	    onfinish(stats);
	};


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(89);
	var isArguments = __webpack_require__(90);
	
	var deepEqual = module.exports = function (actual, expected, opts) {
	  if (!opts) opts = {};
	  // 7.1. All identical values are equivalent, as determined by ===.
	  if (actual === expected) {
	    return true;
	
	  } else if (actual instanceof Date && expected instanceof Date) {
	    return actual.getTime() === expected.getTime();
	
	  // 7.3. Other pairs that do not both pass typeof value == 'object',
	  // equivalence is determined by ==.
	  } else if (!actual || !expected || typeof actual != 'object' && typeof expected != 'object') {
	    return opts.strict ? actual === expected : actual == expected;
	
	  // 7.4. For all other Object pairs, including Array objects, equivalence is
	  // determined by having the same number of owned properties (as verified
	  // with Object.prototype.hasOwnProperty.call), the same set of keys
	  // (although not necessarily the same order), equivalent values for every
	  // corresponding key, and an identical 'prototype' property. Note: this
	  // accounts for both named and indexed properties on Arrays.
	  } else {
	    return objEquiv(actual, expected, opts);
	  }
	}
	
	function isUndefinedOrNull(value) {
	  return value === null || value === undefined;
	}
	
	function isBuffer (x) {
	  if (!x || typeof x !== 'object' || typeof x.length !== 'number') return false;
	  if (typeof x.copy !== 'function' || typeof x.slice !== 'function') {
	    return false;
	  }
	  if (x.length > 0 && typeof x[0] !== 'number') return false;
	  return true;
	}
	
	function objEquiv(a, b, opts) {
	  var i, key;
	  if (isUndefinedOrNull(a) || isUndefinedOrNull(b))
	    return false;
	  // an identical 'prototype' property.
	  if (a.prototype !== b.prototype) return false;
	  //~~~I've managed to break Object.keys through screwy arguments passing.
	  //   Converting to array solves the problem.
	  if (isArguments(a)) {
	    if (!isArguments(b)) {
	      return false;
	    }
	    a = pSlice.call(a);
	    b = pSlice.call(b);
	    return deepEqual(a, b, opts);
	  }
	  if (isBuffer(a)) {
	    if (!isBuffer(b)) {
	      return false;
	    }
	    if (a.length !== b.length) return false;
	    for (i = 0; i < a.length; i++) {
	      if (a[i] !== b[i]) return false;
	    }
	    return true;
	  }
	  try {
	    var ka = objectKeys(a),
	        kb = objectKeys(b);
	  } catch (e) {//happens when one is a string literal and the other isn't
	    return false;
	  }
	  // having the same number of owned properties (keys incorporates
	  // hasOwnProperty)
	  if (ka.length != kb.length)
	    return false;
	  //the same set of keys (although not necessarily the same order),
	  ka.sort();
	  kb.sort();
	  //~~~cheap key test
	  for (i = ka.length - 1; i >= 0; i--) {
	    if (ka[i] != kb[i])
	      return false;
	  }
	  //equivalent values for every corresponding key, and
	  //~~~possibly expensive deep test
	  for (i = ka.length - 1; i >= 0; i--) {
	    key = ka[i];
	    if (!deepEqual(a[key], b[key], opts)) return false;
	  }
	  return typeof a === typeof b;
	}


/***/ },
/* 89 */
/***/ function(module, exports) {

	exports = module.exports = typeof Object.keys === 'function'
	  ? Object.keys : shim;
	
	exports.shim = shim;
	function shim (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}


/***/ },
/* 90 */
/***/ function(module, exports) {

	var supportsArgumentsClass = (function(){
	  return Object.prototype.toString.call(arguments)
	})() == '[object Arguments]';
	
	exports = module.exports = supportsArgumentsClass ? supported : unsupported;
	
	exports.supported = supported;
	function supported(object) {
	  return Object.prototype.toString.call(object) == '[object Arguments]';
	};
	
	exports.unsupported = unsupported;
	function unsupported(object){
	  return object &&
	    typeof object == 'object' &&
	    typeof object.length == 'number' &&
	    Object.prototype.hasOwnProperty.call(object, 'callee') &&
	    !Object.prototype.propertyIsEnumerable.call(object, 'callee') ||
	    false;
	};


/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	const saveAction_1 = __webpack_require__(48);
	const Baobab = __webpack_require__(92);
	runner_1.describe('Data save action', (it) => {
	    it('should save to db', (assert) => {
	        const state = new Baobab({ project: { _id: 'foobar' }
	        });
	        let res;
	        const output = { success(args) { res = args; }
	        };
	        const put = (doc, clbk) => clbk();
	        const data = { db: { put } };
	        const services = { data };
	        saveAction_1.saveAction({ state,
	            output,
	            services,
	            input: { doc: { type: 'foobar', name: 'newname' } }
	        });
	        assert.equal(res, { status: { type: 'success', message: 'Saved foobar' } });
	    });
	    it('should send error out', (assert) => {
	        const state = new Baobab({ project: { _id: 'foobar' }
	        });
	        let res;
	        const output = { error(args) { res = args; }
	        };
	        const put = (doc, clbk) => clbk({ message: 'no good' });
	        const services = { data: { db: { put } } };
	        saveAction_1.saveAction({ state, output, services, input: { doc: { name: 'newname' } } });
	        assert.equal(res, { status: { type: 'error', message: 'no good' } });
	    });
	});


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(119);

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	const makeDoc_action_1 = __webpack_require__(94);
	const Baobab = __webpack_require__(92);
	runner_1.describe('Factory makeDoc action', (it) => {
	    it('should prepare for db', (assert) => {
	        const state = new Baobab({ data: { main: { foo: { value: 'bong', _rev: '1-x' } } } });
	        let res;
	        const output = (arg) => { res = arg.doc; };
	        makeDoc_action_1.makeDoc({ state,
	            input: { path: ['data', 'main', 'foo', 'value'], value: 'bing' },
	            output
	        });
	        assert.equal(res, { _id: 'foo',
	            type: 'main',
	            _rev: '1-x',
	            value: 'bing'
	        });
	    });
	});


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(24);
	exports.makeDoc = ({ state, input: { path, value }, output }) => {
	    // prepare doc
	    const base = path.slice(0, path.length - 1);
	    const key = path[path.length - 1];
	    const doc = Object.assign({}, state.get(base), { [key]: value, type: path[1], _id: path[2] });
	    output({ doc });
	};
	exports.makeDoc['input'] =
	    { path: check.array.of.string,
	        value: check.assigned
	    };


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	const set_action_1 = __webpack_require__(23);
	const Baobab = __webpack_require__(92);
	runner_1.describe('Factory set action', (it) => {
	    it('should set state', (assert) => {
	        const state = new Baobab({ foo: { bar: true, bing: 'bong' } });
	        let res;
	        const output = { save(arg) { res = arg; } };
	        set_action_1.setAction({ state,
	            input: { path: ['foo', 'bar'], value: 'baz' },
	            output
	        });
	        assert.equal(state.get(), { foo: { bar: 'baz',
	                bing: 'bong'
	            }
	        });
	    });
	});


/***/ },
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	const BlockHelper_1 = __webpack_require__(29);
	const SOURCE_A = `
	/** Comment, show main context change { foo }
	 */
	export const render =
	( ctx, child ) => {
	
	}
	
	export const meta =
	{ author: 'John Difool'
	, description: 'Do something'
	, tags: [ '3D', 'three.js' ]
	// If we use context changes
	// we set this:
	, expect: { bar: 'some.BarType' }
	, provide: { foo: 'some.FooType' }
	// If we use input/output return values,
	// we set this:
	, input: [ 'some.Type' ]
	, output: 'some.OtherType'
	}
	`;
	const SOURCE_B = `
	/** Comment, show main context change { foo }
	 */
	export const render =
	( ctx, child, child2 ) => {
	
	}
	`;
	// Any or all 'meta' fields can be left blank.
	exports.meta = { author: 'John Difool',
	    description: 'Do something',
	    tags: ['3D', 'three.js'],
	    expect: { bar: 'some.BarType' },
	    provide: { foo: 'some.FooType' },
	    input: ['some.Type'],
	    output: 'some.OtherType'
	};
	runner_1.describe('BlockHelper.create', (it) => {
	    it('should set new _id', (assert) => {
	        const node = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	        assert.equal(typeof node.id, 'string');
	    });
	    it('should set name', (assert) => {
	        const node = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	        assert.equal(node.name, 'hello');
	    });
	    it('should set source', (assert) => {
	        const node = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	        assert.equal(node.source, SOURCE_A);
	    });
	    it('should compile js', (assert) => {
	        const node = BlockHelper_1.BlockHelper.create('hello', `export const render = () => 'hop'`);
	        assert.equal(node.js, "\"use strict\";\r\nexports.render = function () { return 'hop'; };\r\n");
	    });
	    it('should be immutable', (assert) => {
	        const node = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	        assert.throws(() => { node.name = 'foobar'; });
	    });
	    it('should parse source', (assert) => {
	        const node = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	        assert.equal(node.input, ['some.Type']);
	        assert.equal(node.output, 'some.OtherType');
	        assert.equal(node.meta, exports.meta);
	    });
	});
	runner_1.describe('BlockHelper.update', (it) => {
	    const n = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	    const node = BlockHelper_1.BlockHelper.update(n, { name: 'new name', source: SOURCE_B });
	    it('should set name', (assert) => {
	        assert.equal(node.name, 'new name');
	    });
	    it('should set source', (assert) => {
	        assert.equal(node.source, SOURCE_B);
	    });
	    it('should parse source', (assert) => {
	        assert.equal(node.input, ['any', 'any']);
	        assert.equal(node.output, 'any');
	        assert.equal(node.meta, { provide: {}, expect: {} });
	    });
	});


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	const GraphHelper_1 = __webpack_require__(25);
	const NodeHelper_1 = __webpack_require__(26);
	const Block_1 = __webpack_require__(27);
	const rootNodeId = NodeHelper_1.NodeHelper.rootNodeId;
	const rootBlockId = Block_1.BlockHelper.rootBlockId;
	const SOURCE_A = ``;
	const SOURCE_bar = `export const render = ( ctx, child, child2 ) => {}
	export const meta =
	{ provide: { bar: 'bar.type' }
	}`;
	const SOURCE_baz = `export const render = ( ctx, child, child2 ) => {}
	export const meta =
	{ provide: { baz: 'baz.type' }
	, expect: { bar: 'bar.type' }
	}`;
	const SOURCE_bong = `export const render = ( ctx, child, child2 ) => {}
	`;
	const SOURCE_main = `export const render = ( ctx, child ) => {
	  child ( ctx.set ( { bar: 'bad' } ) )
	}
	export const meta =
	{ provide: { bar: 'bar.bad' }
	}`;
	const SOURCE_foo = `export const render = ( ctx, child, child2 ) => {}
	export const meta =
	{ expect: { bar: 'bar.type', baz: 'baz.type' }
	}`;
	const traverse = (graph) => {
	    const res = [];
	    const op = (nid, s = '') => {
	        if (nid) {
	            const node = graph.nodesById[nid];
	            const block = graph.blocksById[node.blockId];
	            res.push(`${s}${nid}:${node.blockId}:${block.name}`);
	            for (const k of node.children) {
	                op(k, s + ' ');
	            }
	        }
	        else {
	            res.push(`${s}${nid}`);
	        }
	    };
	    op(rootNodeId);
	    return res;
	};
	runner_1.describe('GraphHelper.create', (it) => {
	    const graph = GraphHelper_1.GraphHelper.create();
	    it('create node for block', (assert) => {
	        assert.equal(graph.nodesById[rootNodeId], { id: rootNodeId,
	            blockId: rootBlockId,
	            parent: null,
	            children: []
	        });
	    });
	    it('should select block', (assert) => {
	        assert.equal(graph.blockId, rootBlockId);
	    });
	    it('should save block', (assert) => {
	        assert.equal(graph.blocksById[rootBlockId].name, 'main');
	        assert.equal(graph.blocksById[rootBlockId].id, rootBlockId);
	    });
	    it('should be immutable', (assert) => {
	        assert.throws(function () {
	            graph.nodesById['foo'] =
	                NodeHelper_1.NodeHelper.create('abc', 'idid', null);
	        });
	    });
	    it('should set meta', (assert) => {
	        const graph = GraphHelper_1.GraphHelper.create('foo', SOURCE_foo);
	        assert.equal(graph.blocksById[rootBlockId].meta, { provide: {},
	            expect: { bar: 'bar.type', baz: 'baz.type' }
	        });
	    });
	});
	runner_1.describe('GraphHelper.append', (it) => {
	    let graph = GraphHelper_1.GraphHelper.create();
	    const graph2 = GraphHelper_1.GraphHelper.create('foo', SOURCE_A);
	    graph = GraphHelper_1.GraphHelper.append(graph, rootNodeId, graph2);
	    it('should append child in parent', (assert) => {
	        assert.equal(graph.nodesById[rootNodeId].children, ['n1']);
	    });
	    it('should select block', (assert) => {
	        assert.equal(graph.blockId, 'b1' // graph2 blockId
	        );
	    });
	    it('should add block', (assert) => {
	        assert.equal(graph.blocksById['b1'].name, 'foo');
	    });
	    it('add new node in nodesById', (assert) => {
	        assert.equal(graph.nodesById['n1'], { id: 'n1',
	            blockId: 'b1',
	            parent: rootNodeId,
	            children: []
	        });
	    });
	});
	runner_1.describe('GraphHelper.insert', (it) => {
	    let graph = GraphHelper_1.GraphHelper.create();
	    const g1 = GraphHelper_1.GraphHelper.create('foo', SOURCE_A);
	    const g2 = GraphHelper_1.GraphHelper.create('bar', SOURCE_A);
	    graph = GraphHelper_1.GraphHelper.insert(graph, rootNodeId, 0, g1);
	    graph = GraphHelper_1.GraphHelper.insert(graph, rootNodeId, 0, g2);
	    it('insert child in parent', (assert) => {
	        assert.equal(graph.nodesById[rootNodeId].children, ['n2', 'n1']);
	    });
	    it('should select block', (assert) => {
	        assert.equal(graph.blockId, 'b2' // g2 block id
	        );
	    });
	    it('should insert null', (assert) => {
	        let graph = GraphHelper_1.GraphHelper.create();
	        graph = GraphHelper_1.GraphHelper.insert(graph, rootNodeId, 1, g1);
	        assert.equal(graph.nodesById[rootNodeId].children, [null, 'n1']);
	    });
	    it('should replace null', (assert) => {
	        let graph = GraphHelper_1.GraphHelper.create();
	        graph = GraphHelper_1.GraphHelper.insert(graph, rootNodeId, 1, g1);
	        graph = GraphHelper_1.GraphHelper.insert(graph, rootNodeId, 0, g2);
	        assert.equal(graph.nodesById[rootNodeId].children, ['n2', 'n1']);
	    });
	    it('should add blocks', (assert) => {
	        assert.equal(Object.keys(graph.blocksById).sort(), ['b0', 'b1', 'b2']);
	    });
	    it('should set child nodesById', (assert) => {
	        assert.equal(graph.nodesById['n1'], { blockId: 'b1', id: 'n1', parent: rootNodeId, children: [] });
	    });
	});
	runner_1.describe('GraphHelper.slip', (it) => {
	    // This graph has two objects and will be inserted in graph
	    // between root and 'foo'
	    // [ bar ]
	    // [ baz ] [ bong ]
	    const baz = GraphHelper_1.GraphHelper.create('baz', SOURCE_A);
	    const bong = GraphHelper_1.GraphHelper.create('bong', SOURCE_A);
	    let bar = GraphHelper_1.GraphHelper.create('bar', SOURCE_A);
	    bar = GraphHelper_1.GraphHelper.insert(bar, rootNodeId, 0, baz);
	    bar = GraphHelper_1.GraphHelper.insert(bar, rootNodeId, 1, bong);
	    // [ main ]
	    // [ foo ]
	    let graph = GraphHelper_1.GraphHelper.create();
	    const foo = GraphHelper_1.GraphHelper.create('foo', SOURCE_A);
	    graph = GraphHelper_1.GraphHelper.insert(graph, rootNodeId, 0, foo);
	    graph = GraphHelper_1.GraphHelper.slip(graph, rootNodeId, 0, bar);
	    const nid = {};
	    for (const k in graph.nodesById) {
	        const node = graph.nodesById[k];
	        const name = graph.blocksById[node.blockId].name;
	        nid[name] = k;
	    }
	    // [ main ]
	    // [ bar ]
	    // [ baz ] [ bong ]
	    // [ foo ]
	    it('should select block', (assert) => {
	        assert.equal(graph.blockId, graph.nodesById[nid.bar].blockId);
	    });
	    it('should set blocks', (assert) => {
	        assert.equal(traverse(graph), ['n0:b0:main',
	            ' n2:b2:bar',
	            '  n3:b3:baz',
	            '   n1:b1:foo',
	            '  n4:b4:bong'
	        ]);
	    });
	    it('should set child in parent', (assert) => {
	        assert.equal(graph.nodesById[rootNodeId].children, [nid.bar]);
	    });
	    it('should set previous child in new child', (assert) => {
	        assert.equal(graph.nodesById[nid.baz].children, [nid.foo]);
	    });
	    it('should set parent', (assert) => {
	        assert.equal(graph.nodesById[nid.foo].parent, nid.baz);
	        assert.equal(graph.nodesById[nid.baz].parent, nid.bar);
	        assert.equal(graph.nodesById[nid.bong].parent, nid.bar);
	        assert.equal(graph.nodesById[nid.bar].parent, rootNodeId);
	    });
	});
	runner_1.describe('GraphHelper.cut', (it) => {
	    let graph = GraphHelper_1.GraphHelper.create();
	    let g1 = GraphHelper_1.GraphHelper.create('foo', SOURCE_A);
	    let g2 = GraphHelper_1.GraphHelper.create('bar', SOURCE_A);
	    g1 = GraphHelper_1.GraphHelper.insert(g1, rootNodeId, 0, g2);
	    graph = GraphHelper_1.GraphHelper.insert(graph, rootNodeId, 1, g1);
	    // [ graph ] 'n0'
	    //   null  [ foo ] 'n1'
	    //         [ bar ] 'n2'
	    graph = GraphHelper_1.GraphHelper.cut(graph, 'n1');
	    // [ foo ]
	    // [ bar ]
	    it('create smaller graph', (assert) => {
	        assert.equal(Object.keys(graph.nodesById).sort(), ['n0', 'n1']);
	        assert.equal(traverse(graph), ['n0:b0:foo',
	            ' n1:b1:bar'
	        ]);
	    });
	    it('should select block', (assert) => {
	        assert.equal(graph.blockId, rootBlockId);
	    });
	});
	runner_1.describe('GraphHelper.drop', (it) => {
	    let graph = GraphHelper_1.GraphHelper.create();
	    let g1 = GraphHelper_1.GraphHelper.create('foo', SOURCE_A);
	    let g2 = GraphHelper_1.GraphHelper.create('bar', SOURCE_A);
	    g1 = GraphHelper_1.GraphHelper.insert(g1, rootNodeId, 0, g2);
	    graph = GraphHelper_1.GraphHelper.insert(graph, rootNodeId, 1, g1);
	    // [ graph ] 'n0'
	    //   null  [ foo ] 'n1'
	    //         [ bar ] 'n2'
	    graph = GraphHelper_1.GraphHelper.drop(graph, 'n1');
	    // [ graph ] 'n0'
	    it('create smaller graph', (assert) => {
	        assert.equal(traverse(graph), ['n0:b0:main']);
	    });
	    it('should select block', (assert) => {
	        assert.equal(graph.blockId, rootBlockId);
	    });
	});
	runner_1.describe('GraphHelper.check', (it) => {
	    // This graph has two objects and will be inserted in graph
	    // between root and 'foo'
	    // [ bar ]
	    // [ baz ] [ bong ]
	    const baz = GraphHelper_1.GraphHelper.create('baz', SOURCE_baz);
	    const bong = GraphHelper_1.GraphHelper.create('bong', SOURCE_bong);
	    let bar = GraphHelper_1.GraphHelper.create('bar', SOURCE_bar);
	    bar = GraphHelper_1.GraphHelper.insert(bar, rootNodeId, 0, baz);
	    bar = GraphHelper_1.GraphHelper.insert(bar, rootNodeId, 1, bong);
	    // [ main ]
	    // [ foo ]
	    let graph1 = GraphHelper_1.GraphHelper.create('main', SOURCE_main);
	    const foo = GraphHelper_1.GraphHelper.create('foo', SOURCE_foo);
	    graph1 = GraphHelper_1.GraphHelper.insert(graph1, rootNodeId, 0, foo);
	    it('should disable invalid node', (assert) => {
	        const node = graph1.nodesById['n1'];
	        const block = graph1.blocksById[node.blockId];
	        assert.equal(block.name, 'foo');
	        assert.equal(node.invalid, ["invalid 'bar' (bar.bad instead of bar.type)",
	            "missing 'baz' (baz.type)"
	        ]);
	    });
	    const graph2 = GraphHelper_1.GraphHelper.slip(graph1, rootNodeId, 0, bar);
	    // [ main ]
	    // [ bar ]
	    // [ baz ] [ bong ]
	    // [ foo ]
	    const nid = {};
	    for (const k in graph2.nodesById) {
	        const node = graph2.nodesById[k];
	        const name = graph2.blocksById[node.blockId].name;
	        nid[name] = k;
	    }
	    it('should update node check', (assert) => {
	        const node = graph2.nodesById[nid.foo];
	        assert.same(node.invalid, undefined);
	    });
	});


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	const Immutable_1 = __webpack_require__(31);
	runner_1.describe('IM.merge', (it) => {
	    it('should create new object', (assert) => {
	        const a = {};
	        const b = {};
	        assert.notSame(Immutable_1.Immutable.merge(a, b), a);
	        assert.notSame(Immutable_1.Immutable.merge(a, b), b);
	    });
	    it('should create frozen object', (assert) => {
	        const a = Immutable_1.Immutable.merge({ name: 'hello' }, {});
	        assert.throws(function () {
	            a.name = 'hop';
	        });
	    });
	    it('should merge new values', (assert) => {
	        const a = { a: 3 };
	        const b = { x: 1 };
	        assert.equal(Immutable_1.Immutable.merge(a, b), { a: 3, x: 1 });
	    });
	    it('should replace values', (assert) => {
	        const a = { a: 3, x: 3 };
	        const b = { x: 1 };
	        assert.equal(Immutable_1.Immutable.merge(a, b), { a: 3, x: 1 });
	    });
	});
	runner_1.describe('IM.remove', (it) => {
	    const a = { a: 3, b: { c: 4, d: 5 }, e: 6 };
	    it('should create new object', (assert) => {
	        assert.notSame(Immutable_1.Immutable.remove(a, 'b'), a);
	    });
	    it('should create frozen object', (assert) => {
	        const b = Immutable_1.Immutable.remove(a, 'b');
	        assert.throws(function () {
	            b.a = 34;
	        });
	    });
	    it('should delete value', (assert) => {
	        assert.equal(Immutable_1.Immutable.remove(a, 'b'), { a: 3, e: 6 });
	    });
	});
	runner_1.describe('IM.append', (it) => {
	    it('should create new object', (assert) => {
	        const a = [10];
	        const b = 20;
	        assert.notSame(Immutable_1.Immutable.append(a, b), a);
	    });
	    it('should create frozen object', (assert) => {
	        const a = Immutable_1.Immutable.append([], 1);
	        assert.throws(function () {
	            a[0] = 100;
	        });
	    });
	    it('should append new values', (assert) => {
	        const a = [10, 20];
	        const b = 30;
	        assert.equal(Immutable_1.Immutable.append(a, b), [10, 20, 30]);
	    });
	    it('should append and sort', (assert) => {
	        const a = [10, 20];
	        const b = 15;
	        assert.equal(Immutable_1.Immutable.append(a, b, (a, b) => a < b ? -1 : 1), [10, 15, 20]);
	    });
	});
	runner_1.describe('IM.insert', (it) => {
	    it('should create new object', (assert) => {
	        const a = [10];
	        const b = 20;
	        assert.notSame(Immutable_1.Immutable.insert(a, 0, b), a);
	    });
	    it('should create frozen object', (assert) => {
	        const a = Immutable_1.Immutable.insert([], 0, 1);
	        assert.throws(function () {
	            a[0] = 100;
	        });
	    });
	    it('should insert new value', (assert) => {
	        const a = [10, 20];
	        const b = 30;
	        assert.equal(Immutable_1.Immutable.insert(a, 1, b), [10, 30, 20]);
	    });
	    it('should insert null if value out of array', (assert) => {
	        const a = [10, 20];
	        const b = 30;
	        assert.equal(Immutable_1.Immutable.insert(a, 3, b), [10, 20, null, 30]);
	    });
	    it('should replace null', (assert) => {
	        const a = [10, null, 20];
	        const b = 30;
	        assert.equal(Immutable_1.Immutable.insert(a, 1, b), [10, 30, 20]);
	    });
	});
	runner_1.describe('IM.aset', (it) => {
	    it('should create new object', (assert) => {
	        const a = [10];
	        const b = 20;
	        assert.notSame(Immutable_1.Immutable.aset(a, 0, b), a);
	    });
	    it('should create frozen object', (assert) => {
	        const a = Immutable_1.Immutable.aset([0], 0, 1);
	        assert.throws(function () {
	            a[0] = 100;
	        });
	    });
	    it('should set new value', (assert) => {
	        const a = [10, 20];
	        const b = 30;
	        assert.equal(Immutable_1.Immutable.aset(a, 1, b), [10, 30]);
	    });
	    it('should set outside array', (assert) => {
	        const a = [10, 20];
	        const b = 30;
	        assert.equal(Immutable_1.Immutable.aset(a, 3, b), [10, 20, null, 30]);
	    });
	    it('should not set with neg indice', (assert) => {
	        assert.throws(function () {
	            const a = [10, 20];
	            const b = 30;
	            Immutable_1.Immutable.aset(a, -1, b);
	        });
	    });
	});
	runner_1.describe('IM.update', (it) => {
	    const a = { x: { y: 1 }, z: 2 };
	    const b = { b: 'b' };
	    it('should create new object', (assert) => {
	        assert.notSame(Immutable_1.Immutable.update(a, 'x', 'y', 3), a);
	    });
	    it('should create frozen object', (assert) => {
	        const c = Immutable_1.Immutable.update(a, 'x', 'y', 3);
	        assert.throws(function () {
	            c.x.y = 4;
	        });
	    });
	    it('should set new value', (assert) => {
	        assert.equal(Immutable_1.Immutable.update(a, 'x', 'y', 3), { x: { y: 3 }, z: 2 });
	    });
	    it('should set new value with function', (assert) => {
	        const a = { x: { y: { z: [1, 2] } }, w: 3 };
	        const r = Immutable_1.Immutable.update(a, 'x', 'y', 'z', (z) => {
	            return Immutable_1.Immutable.insert(z, 1, 33);
	        });
	        assert.equal(r, { x: { y: { z: [1, 33, 2] } }, w: 3 });
	    });
	    it('should create required objects', (assert) => {
	        const a = { x: { y: 1 }, z: 2 };
	        assert.equal(Immutable_1.Immutable.update(a, 'x', 'z', 'w', 3), { x: { y: 1, z: { w: 3 } }, z: 2 });
	    });
	});
	runner_1.describe('IM.sort', (it) => {
	    const comp = (a, b) => a < b ? -1 : 1;
	    const a = [3, 4, 2];
	    it('should create new object', (assert) => {
	        assert.notSame(Immutable_1.Immutable.sort(a, comp), a);
	    });
	    it('should create frozen object', (assert) => {
	        const o = Immutable_1.Immutable.sort(a, comp);
	        assert.throws(function () {
	            o[0] = 12;
	        });
	    });
	    it('should sort', (assert) => {
	        assert.equal(Immutable_1.Immutable.sort(a, comp), [2, 3, 4]);
	    });
	});


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	const NodeHelper_1 = __webpack_require__(26);
	runner_1.describe('NodeHelper.create', (it) => {
	    it('should set defaults', (assert) => {
	        const node = NodeHelper_1.NodeHelper.create('blockxx', 'n0', 'pa');
	        assert.equal(node, { id: 'n0',
	            blockId: 'blockxx',
	            parent: 'pa',
	            children: []
	        });
	    });
	    it('should set values', (assert) => {
	        const node = NodeHelper_1.NodeHelper.create('blockxx', 'id99', 'n0', ['id7', 'id8']);
	        assert.equal(node, { id: 'id99',
	            blockId: 'blockxx',
	            parent: 'n0',
	            children: ['id7', 'id8']
	        });
	    });
	});
	runner_1.describe('NodeHelper.nextNodeId', (it) => {
	    it('should return id0 on empty map', (assert) => {
	        assert.equal(NodeHelper_1.NodeHelper.nextNodeId({}), 'n0');
	    });
	    it('should return first free in graph', (assert) => {
	        const n = NodeHelper_1.NodeHelper.create('foo', '', '');
	        assert.equal(NodeHelper_1.NodeHelper.nextNodeId({ n0: n, n3: n }), 'n1');
	    });
	});


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	runner_1.describe('uimap cache', (it) => {
	    // When and what can be reused ?
	    // Can reuse what does not depend on children:
	    //   * minSize (depends on #children)
	    //   * className (depends on ghost ?)
	    it('should reuse uibox if same box type', (assert) => {
	    });
	    it('should reuse text size cache with same text', (assert) => {
	    });
	});


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Test_1 = __webpack_require__(102);
	const PlaybackHelper_1 = __webpack_require__(33);
	const GRAPH = __webpack_require__(105);
	/** GRAPH structure
	[ main        ]
	[ join        ]
	[ a     ] [ b ] 'b' ==> calls child with an empty slot
	[ cache ]       ==> calls init
	*/
	Test_1.describe('PlaybackHelper.compile', (it) => {
	    let counter = 0;
	    // simulate preloaded libraries
	    const PRELOADED = { counter() { return ++counter; } };
	    // mock playback require for now
	    const require = (name) => {
	        return PRELOADED[name];
	    };
	    const graph = JSON.parse(GRAPH);
	    console.log(graph);
	    const cache = {};
	    PlaybackHelper_1.PlaybackHelper.compile(graph, cache);
	    // node cache
	    const nca = {};
	    for (const k in graph.nodesById) {
	        const node = graph.nodesById[k];
	        const block = graph.blocksById[node.blockId];
	        nca[block.name] = cache.nodecache[k];
	    }
	    it('should run init', (assert) => {
	        PlaybackHelper_1.PlaybackHelper.init(cache, { require });
	        assert.equal(nca.cache.cache, { foo: 1 });
	    });
	    it('should reuse cache in init', (assert) => {
	        PlaybackHelper_1.PlaybackHelper.init(cache, { require });
	        PlaybackHelper_1.PlaybackHelper.init(cache, { require });
	        assert.equal(nca.cache.cache, { foo: 1 });
	        assert.equal(1, counter);
	    });
	    it('should compile graph into a function', (assert) => {
	        assert.equal('function', typeof cache.main);
	    });
	    it('should run main', (assert) => {
	        const res = cache.main();
	        assert.equal('1bnull', res);
	    });
	});
	Test_1.describe('PlaybackHelper.context', (it) => {
	    const context = PlaybackHelper_1.PlaybackHelper.context({ foo: 'bar' });
	    it('should be immutable', (assert) => {
	        assert.throws(() => { context.foo = 'baz'; });
	    });
	    it('should create new object on set', (assert) => {
	        const c = context.set({ camera: 'hello' });
	        assert.notSame(c, context);
	        assert.equal({ camera: 'hello', foo: 'bar' }, c);
	    });
	});


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(103));
	__export(__webpack_require__(87));
	exports.Test = (options = {}) => {
	    return (module, controller) => {
	        /*
	        module.addState
	        ( { type: 'info'
	          , message: ''
	          }
	        )
	    
	        module.addSignals
	        ( {
	          }
	        )
	        */
	        return {}; // meta information
	    };
	};


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	// modules
	"use strict";
	const Controller = __webpack_require__(104);
	const Model = __webpack_require__(50);
	const testModule = (signal) => (module, controller) => {
	    module.addSignals({ signal });
	};
	exports.signalTest = (state, asignal, services) => {
	    const model = Model(state || {});
	    const controller = Controller(model);
	    const mod = testModule(asignal);
	    controller.addModules({ mod
	    });
	    if (services) {
	        controller.addServices(services);
	    }
	    const signal = controller.getSignals().mod.signal;
	    const send = (input, clbk) => {
	        controller.on('signalEnd', () => clbk(controller));
	        signal(input);
	    };
	    return send;
	};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(1);

/***/ },
/* 105 */
/***/ function(module, exports) {

	module.exports = "{\n  \"nodesById\": {\n    \"n0\": {\n      \"id\": \"n0\",\n      \"blockId\": \"b0\",\n      \"parent\": null,\n      \"children\": [\n        \"n1\"\n      ]\n    },\n    \"n1\": {\n      \"id\": \"n1\",\n      \"blockId\": \"b1\",\n      \"parent\": \"n0\",\n      \"children\": [\n        \"n2\",\n        \"n3\"\n      ]\n    },\n    \"n2\": {\n      \"id\": \"n2\",\n      \"blockId\": \"b2\",\n      \"parent\": \"n1\",\n      \"children\": [\n        \"n4\"\n      ]\n    },\n    \"n3\": {\n      \"id\": \"n3\",\n      \"blockId\": \"b3\",\n      \"parent\": \"n1\",\n      \"children\": []\n    },\n    \"n4\": {\n      \"id\": \"n4\",\n      \"blockId\": \"b4\",\n      \"parent\": \"n2\",\n      \"children\": []\n    }\n  },\n  \"blocksById\": {\n    \"b0\": {\n      \"id\": \"b0\",\n      \"name\": \"main\",\n      \"source\": \"export const render =\\n( ctx, child ) => {\\n  return child ()\\n}\\n\",\n      \"input\": [\n        \"string\"\n      ],\n      \"js\": \"\\\"use strict\\\";\\nexports.render = function (ctx, child) {\\n return child();\\n};\\n\",\n      \"output\": \"string\",\n      \"init\": false\n    },\n    \"b1\": {\n      \"id\": \"b1\",\n      \"name\": \"join\",\n      \"source\": \"export const render =\\n( ctx, child, child2 ) => {\\n  return `${child()}${child2()}`\\n}\\n\",\n      \"input\": [\n        \"string\",\n        \"string\"\n      ],\n      \"js\": \"\\\"use strict\\\";\\nexports.render = function (ctx, child, child2) {\\n    return \\\"\\\" + child() + child2();\\n};\\n\",\n      \"output\": \"string\",\n      \"init\": false\n    },\n    \"b2\": {\n      \"id\": \"b2\",\n      \"name\": \"a\",\n      \"source\": \"export const render =\\n( ctx, child ) => {\\n  return child ( ctx )\\n}\\n\",\n      \"input\": [\n        \"string\"\n      ],\n      \"js\": \"\\\"use strict\\\";\\nexports.render = function (ctx, child) {\\n    return child(ctx);\\n};\\n\",\n      \"output\": \"string\",\n      \"init\": false\n    },\n    \"b3\": {\n      \"id\": \"b3\",\n      \"name\": \"b\",\n      \"source\": \"export const render =\\n( ctx, child ) => {\\n  return 'b' + child ()\\n}\\n\",\n      \"input\": [ \"string\" ],\n      \"js\": \"\\\"use strict\\\";\\nexports.render = function (ctx,child) {\\n    return 'b' + child ();\\n};\\n\",\n      \"output\": \"string\",\n      \"init\": false\n    },\n    \"b4\": {\n      \"id\": \"b4\",\n      \"name\": \"cache\",\n      \"source\": \"// Test that init is called with\\n// cache and require.\\n\\nlet foo\\n\\nexport const init =\\n( { cache, require } ) => {\\n  const counter = require ( 'counter' )\\n  if ( !cache.foo ) {\\n    cache.foo = counter ()\\n  }\\n  foo = cache.foo\\n}\\n\\nexport const render =\\n( ctx ) => {\\n  return foo\\n}\\n\\n\",\n      \"input\": [],\n      \"js\": \"// Test that init is called with\\n// cache and require.\\n\\\"use strict\\\";\\nvar foo;\\nexports.init = function (_a) {\\n    var cache = _a.cache, require = _a.require;\\n    var counter = require('counter');\\n    if (!cache.foo) {\\n        cache.foo = counter();\\n    }\\n    foo = cache.foo;\\n};\\nexports.render = function (ctx) {\\n    return foo;\\n};\\n\",\n      \"output\": \"string\",\n      \"init\": true\n    }\n  },\n  \"blockId\": \"b4\"\n}\n"

/***/ },
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	const status_1 = __webpack_require__(3);
	const Baobab = __webpack_require__(92);
	runner_1.describe('Status set action', (it) => {
	    it('should set status in state', (assert) => {
	        status_1.resetRef();
	        const state = new Baobab({ $status: { list: [] } });
	        status_1.status({ state,
	            input: { status: { type: 'success', message: 'Good' } }
	        });
	        assert.equal(state.get(status_1.HISTORY_PATH), [{ type: 'success', message: 'Good', ref: 1 }
	        ]);
	    });
	    it('should not grow history beyond max', (assert) => {
	        status_1.resetRef();
	        const list = [];
	        for (let i = 0; i < status_1.MAX_STATUS_HISTORY; ++i) {
	            list.push({ type: 'success', message: `${i}-message` });
	        }
	        const state = new Baobab({ $status: { list } });
	        status_1.status({ state,
	            input: { status: { type: 'success', message: 'Good' } }
	        });
	        const hist = state.get();
	        assert.equal(state.get(status_1.HISTORY_PATH).length, status_1.MIN_STATUS_HISTORY);
	    });
	});


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(87);
	exports.stats = ({ state, input, output }) => {
	    const stats = input.stats;
	    const m = [`${stats.passCount}/${stats.testCount} tests pass`];
	    if (stats.failCount) {
	        m.push(`${stats.failCount} fail`);
	    }
	    if (stats.pendingCount) {
	        m.push(`${stats.pendingCount} pending`);
	    }
	    const s = { type: 'success', message: m.join(',') };
	    if (stats.passCount !== stats.testCount) {
	        s.detail = stats.failures.map(runner_1.failureMessage);
	        if (stats.failCount) {
	            s.type = 'error';
	        }
	        else {
	            s.type = 'warn';
	        }
	    }
	    output.success({ status: s });
	};


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set = __webpack_require__(64);
	exports.homeUrl = [set('state:/$route', 'home')
	];


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Project_1 = __webpack_require__(8);
	const set = __webpack_require__(64);
	exports.projectUrl = [set('state:/$route', 'project'),
	    Project_1.selectAction
	];


/***/ },
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set = __webpack_require__(64);
	exports.projectsUrl = [set('state:/$route', 'projects'),
	    set('state:/$projectId', '')
	];


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set = __webpack_require__(64);
	exports.userUrl = [set('state:/$route', 'user')
	];


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const db_1 = __webpack_require__(113);
	const dbChanged_1 = __webpack_require__(116);
	const reload_1 = __webpack_require__(5);
	const save_1 = __webpack_require__(47);
	exports.Data = (options = {}) => {
	    return (module, controller) => {
	        // This state is where we read and write to
	        // the database
	        module.addState({ project: {}
	        });
	        // This service is only used in Data actions.
	        module.addServices({ db: db_1.db
	        });
	        module.addSignals({ dbChanged: dbChanged_1.dbChanged,
	            reload: reload_1.reload,
	            save: save_1.save
	        });
	        const changed = controller.getSignals().data.dbChanged;
	        const r = db_1.db.changes({ live: true,
	            include_docs: true,
	            since: 'now'
	        }).on('change', (change) => changed({ change }));
	        // FIXME: could use r.cancel to stop listening to
	        // changes
	        return {}; // meta information
	    };
	};


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const PouchDB = __webpack_require__(114);
	const PouchDBAuthentication = __webpack_require__(115);
	// https://github.com/nolanlawson/pouchdb-authentication
	PouchDB.plugin(PouchDBAuthentication);
	exports.db = new PouchDB('lucidity');


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(140);

/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(154);

/***/ },
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const update_1 = __webpack_require__(117);
	const saved_1 = __webpack_require__(118);
	const edit_1 = __webpack_require__(119);
	const Status_1 = __webpack_require__(120);
	exports.dbChanged = [update_1.update,
	    Status_1.status,
	    saved_1.saved,
	    edit_1.edit // open name for editing (depends on a flag in $factory)
	];


/***/ },
/* 117 */
/***/ function(module, exports) {

	"use strict";
	const getVerb = (doc) => (doc._deleted ?
	    'Deleted'
	    : (doc._rev.split('-')[0] === '1' ?
	        'New'
	        : 'Updated'));
	// Could be removed: no need for so much operation noise or have something
	// more interesting...
	const getStatus = (doc) => ({ type: 'info', message: `${getVerb(doc)} ${doc.type} '${doc.name || ''}'` });
	exports.update = ({ state, input: { change }, output }) => {
	    const doc = change.doc;
	    const { _id, type } = doc;
	    const status = type === 'main' ? undefined : getStatus(doc);
	    let saved;
	    const cid = state.get([type, '_id']);
	    if (doc._deleted) {
	        state.unset(['data', type, _id]);
	        if (_id === cid) {
	            state.unset([type]);
	        }
	    }
	    else {
	        state.set(['data', type, _id], doc);
	        if (_id === cid || cid === undefined) {
	            saved = type;
	        }
	    }
	    output({ saved, status, doc });
	};


/***/ },
/* 118 */
/***/ function(module, exports) {

	"use strict";
	exports.saved = ({ state, input: { saved } }) => {
	    if (saved) {
	        // clear all 'saving' flags on props if main object is saved
	        state.unset(['$factory', saved]);
	        if (saved === 'project' || saved === 'scene') {
	            // also clear block operation
	            state.unset(['$factory', 'block']);
	        }
	        // end of drop operation: clear
	        state.unset(['$dragdrop', 'drop']);
	    }
	};


/***/ },
/* 119 */
/***/ function(module, exports) {

	"use strict";
	const editables = ['project', 'scene', 'block'];
	exports.edit = ({ state, input: { doc } }) => {
	    if (doc && doc.type == 'user') {
	        const editing = state.get(['$factory', 'editing']);
	        for (const k of editables) {
	            // sceneId, blockId, projectId
	            if (doc[`${k}Id`] === editing) {
	                // trigger name edit
	                state.set(['$factory', 'editing'], `${k}-name`);
	                return;
	            }
	        }
	    }
	};


/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(3));
	const changed_1 = __webpack_require__(121);
	const toggledDetail_1 = __webpack_require__(122);
	exports.Status = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ list: [],
	            detail: {},
	            showDetail: false
	        });
	        module.addSignals({ changed: changed_1.changed,
	            toggledDetail: toggledDetail_1.toggledDetail
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const status_1 = __webpack_require__(3);
	exports.changed = [status_1.status
	];


/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const toggleDetail_1 = __webpack_require__(4);
	exports.toggledDetail = [toggleDetail_1.toggleDetail
	];


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(124));
	const drag_1 = __webpack_require__(125);
	const drop_1 = __webpack_require__(127);
	const move_1 = __webpack_require__(223);
	exports.DragDrop = (options = {}) => {
	    return (module, controller) => {
	        // $dragdrop:
	        module.addState({});
	        module.addSignals({ drag: drag_1.drag,
	            drop: drop_1.drop,
	            move: move_1.move
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 124 */
/***/ function(module, exports) {

	"use strict";
	const MIN_DRAG_DIST = 4; // manhattan distance to trigger a drag
	const startDrag = (signals) => {
	    const doc = document.documentElement;
	    const dragel = document.getElementById('drag');
	    let getElementUnderMouse;
	    if (dragel.tagName === 'svg') {
	        getElementUnderMouse = (e) => {
	            const baseclass = dragel.getAttribute('class');
	            dragel.setAttribute('class', baseclass + ' drag-hide');
	            const el = document.elementFromPoint(e.clientX, e.clientY);
	            dragel.setAttribute('class', baseclass);
	            return el;
	        };
	    }
	    else {
	        getElementUnderMouse = (e) => {
	            const baseclass = dragel.className;
	            dragel.className = baseclass + ' drag-hide';
	            const el = document.elementFromPoint(e.clientX, e.clientY);
	            dragel.className = baseclass;
	            return el;
	        };
	    }
	    // mouse move detected document wide
	    const mousemove = (e) => {
	        e.preventDefault();
	        const el = getElementUnderMouse(e);
	        const target = el.getAttribute('data-drop');
	        const clientPos = { x: e.clientX, y: e.clientY };
	        signals.$dragdrop.move({ move: { target, clientPos } });
	    };
	    const mouseup = (e) => {
	        e.stopPropagation();
	        e.preventDefault();
	        doc.removeEventListener('mousemove', mousemove);
	        doc.removeEventListener('mouseup', mouseup);
	        signals.$dragdrop.drop();
	    };
	    doc.addEventListener('mousemove', mousemove);
	    doc.addEventListener('mouseup', mouseup);
	};
	var DragDropHelper;
	(function (DragDropHelper) {
	    DragDropHelper.drag = (signals, dragclbk, clickClbk) => {
	        let evstate = 'up';
	        let clickpos, nodePos;
	        const mouseup = (e) => {
	            e.preventDefault();
	            // Do not stopPropagation here or we miss drag release.
	            if (evstate === 'down') {
	                // Only handle simple click here. The drop operation happens in
	                // docup.
	                clickClbk(e);
	            }
	            evstate = 'up';
	        };
	        const mousedown = (e) => {
	            e.stopPropagation();
	            e.preventDefault();
	            const target = e.target;
	            const rect = target.getBoundingClientRect();
	            clickpos = { x: e.clientX, y: e.clientY };
	            nodePos = { x: e.pageX - rect.left,
	                y: e.pageY - rect.top
	            };
	            evstate = 'down';
	        };
	        // mouse move on element (just used to trigger drag)
	        const mousemove = (e) => {
	            e.preventDefault();
	            const clientPos = { x: e.clientX, y: e.clientY };
	            if (evstate === 'down') {
	                if (Math.abs(clientPos.x - clickpos.x)
	                    + Math.abs(clientPos.y - clickpos.y) < MIN_DRAG_DIST) {
	                    return;
	                }
	                evstate = 'dragging';
	                dragclbk(nodePos);
	                startDrag(signals);
	            }
	        };
	        const click = (e) => {
	            e.preventDefault();
	            e.stopPropagation();
	        };
	        return { click, mousedown, mousemove, mouseup };
	    };
	})(DragDropHelper = exports.DragDropHelper || (exports.DragDropHelper = {}));


/***/ },
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const dragAction_1 = __webpack_require__(126);
	exports.drag = [dragAction_1.dragAction
	];


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const NodeHelper_1 = __webpack_require__(26);
	const GraphHelper_1 = __webpack_require__(25);
	const uimap_1 = __webpack_require__(38);
	const dragp = ['$dragdrop', 'drag'];
	const rootNodeId = NodeHelper_1.NodeHelper.rootNodeId;
	exports.dragAction = ({ state, input, output }) => {
	    const drag = Object.assign({}, input.drag);
	    if (drag.ownerType === 'library') {
	        drag.dgraph = state.get(['data', 'component', drag.componentId, 'graph']);
	    }
	    else {
	        let graph = state.get([drag.ownerType, 'graph']);
	        const otype = drag.ownerType === 'project' ? 'scene' : 'project';
	        drag.dgraph = GraphHelper_1.GraphHelper.cut(graph, drag.nodeId);
	        drag.rgraph = GraphHelper_1.GraphHelper.drop(graph, drag.nodeId);
	    }
	    drag.uigraph = uimap_1.uimap(drag.dgraph);
	    state.set(dragp, drag);
	};


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const dropAction_1 = __webpack_require__(128);
	const save_1 = __webpack_require__(47);
	exports.drop = [dropAction_1.dropAction,
	    { success: [...save_1.save]
	    }
	];


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Graph_1 = __webpack_require__(34);
	const Library_1 = __webpack_require__(129);
	const dragp = ['$dragdrop', 'drag'];
	const movep = ['$dragdrop', 'move'];
	const dropp = ['$dragdrop', 'drop'];
	const rootNodeId = Graph_1.NodeHelper.rootNodeId;
	exports.dropAction = ({ state, input, output }) => {
	    const drag = state.get(dragp);
	    const drop = state.get(dropp);
	    state.unset(dragp);
	    state.unset(movep);
	    let odoc;
	    if (drag.ownerType !== 'library') {
	        odoc = Graph_1.Immutable.update(state.get([drag.ownerType]), 'graph', drag.rgraph);
	    }
	    if (!drop) {
	        // Not dropping on a valid zone.
	        if (drag.ownerType === 'library') {
	        }
	        else {
	            // Remove
	            output.success({ doc: odoc });
	        }
	        return;
	    }
	    if (drop.ownerType === 'library') {
	        // Do we have a block with same name in the library ?
	        const node = drag.dgraph.nodesById[rootNodeId];
	        const name = drag.dgraph.blocksById[node.blockId].name;
	        const library = state.get(['data', 'component']);
	        let doc;
	        for (const k in library) {
	            const b = library[k];
	            if (b.name === name) {
	                // replace
	                doc = Object.assign({}, b, { graph: drag.dgraph });
	                break;
	            }
	        }
	        if (!doc) {
	            // new component
	            doc = Library_1.ComponentHelper.create(drag.dgraph);
	        }
	        output.success({ doc });
	    }
	    else {
	        let doc = state.get([drop.ownerType]);
	        doc = Graph_1.Immutable.update(doc, 'graph', drop.graph);
	        const docs = [doc];
	        if (drop.ownerType !== drag.ownerType && odoc) {
	            // transfer from one graph to another
	            // also change origin
	            docs.push(odoc);
	        }
	        output.success({ docs });
	    }
	};


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(130));
	const Model = __webpack_require__(50);
	const zip_1 = __webpack_require__(132);
	const sortByName = (a, b) => a.name > b.name ? 1 : -1;
	const LibraryRows = Model.monkey({ cursors: { components: ['data', 'component']
	    },
	    get(state) {
	        const components = state.components || {};
	        const list = [];
	        for (const k in components) {
	            list.push(components[k]);
	        }
	        list.sort(sortByName);
	        return list;
	    }
	});
	exports.Library = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ $rows: LibraryRows
	        });
	        module.addSignals({ zip: zip_1.zip
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(131));


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Factory_1 = __webpack_require__(10);
	const Graph_1 = __webpack_require__(34);
	const rootNodeId = Graph_1.NodeHelper.rootNodeId;
	var ComponentHelper;
	(function (ComponentHelper) {
	    ComponentHelper.create = (graph) => {
	        const node = graph.nodesById[rootNodeId];
	        const block = graph.blocksById[node.blockId];
	        return { _id: Factory_1.makeId(),
	            name: block.name,
	            type: 'component',
	            graph
	        };
	    };
	})(ComponentHelper = exports.ComponentHelper || (exports.ComponentHelper = {}));


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const zipAction_1 = __webpack_require__(133);
	const downloadAction_1 = __webpack_require__(222);
	exports.zip = [zipAction_1.zipAction,
	    { success: [downloadAction_1.downloadAction] }
	];


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const LibraryHelper_1 = __webpack_require__(134);
	exports.zipAction = ({ state, output }) => {
	    const library = state.get(['data', 'component']);
	    LibraryHelper_1.LibraryHelper.zip(library, (source) => {
	        output.success({ filename: 'library.zip', mime: 'application/zip', content: source });
	    });
	};
	exports.zipAction['async'] = true;


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const GraphHelper_1 = __webpack_require__(25);
	const JSZip = __webpack_require__(135);
	/*
	var zip = new JSZip ()
	zip.file("Hello.txt", "Hello World\n");
	var img = zip.folder("images");
	img.file("smile.gif", imgData, {base64: true});
	zip.generateAsync({type:"blob"})
	.then(function(content) {
	    // see FileSaver.js
	    saveAs(content, "example.zip");
	});
	*/
	const zipfile = (zip, name, source) => {
	    zip.file(name, source);
	};
	const zipfolder = (zip, name) => {
	    return zip.folder(name);
	};
	var LibraryHelper;
	(function (LibraryHelper) {
	    LibraryHelper.zip = (components, doneClbk) => {
	        const jszip = new JSZip();
	        for (const k in components) {
	            const comp = components[k];
	            GraphHelper_1.GraphHelper.exportGraph(comp.graph, jszip, zipfile, zipfolder);
	        }
	        const p = jszip.generateAsync({ compression: 'DEFLATE', type: 'base64' });
	        if (doneClbk) {
	            p.then(doneClbk);
	        }
	        else {
	            return p;
	        }
	    };
	})(LibraryHelper = exports.LibraryHelper || (exports.LibraryHelper = {}));


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	/**
	 * Representation a of zip file in js
	 * @constructor
	 */
	function JSZip() {
	    // if this constructor is used without `new`, it adds `new` before itself:
	    if(!(this instanceof JSZip)) {
	        return new JSZip();
	    }
	
	    if(arguments.length) {
	        throw new Error("The constructor with parameters has been removed in JSZip 3.0, please check the upgrade guide.");
	    }
	
	    // object containing the files :
	    // {
	    //   "folder/" : {...},
	    //   "folder/data.txt" : {...}
	    // }
	    this.files = {};
	
	    this.comment = null;
	
	    // Where we are in the hierarchy
	    this.root = "";
	    this.clone = function() {
	        var newObj = new JSZip();
	        for (var i in this) {
	            if (typeof this[i] !== "function") {
	                newObj[i] = this[i];
	            }
	        }
	        return newObj;
	    };
	}
	JSZip.prototype = __webpack_require__(136);
	JSZip.prototype.loadAsync = __webpack_require__(213);
	JSZip.support = __webpack_require__(139);
	JSZip.defaults = __webpack_require__(184);
	
	JSZip.loadAsync = function (content, options) {
	    return new JSZip().loadAsync(content, options);
	};
	
	JSZip.external = __webpack_require__(176);
	module.exports = JSZip;


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var utf8 = __webpack_require__(137);
	var utils = __webpack_require__(138);
	var GenericWorker = __webpack_require__(181);
	var StreamHelper = __webpack_require__(182);
	var defaults = __webpack_require__(184);
	var CompressedObject = __webpack_require__(185);
	var ZipObject = __webpack_require__(190);
	var generate = __webpack_require__(191);
	var nodejsUtils = __webpack_require__(173);
	var NodejsStreamInputAdapter = __webpack_require__(212);
	
	
	/**
	 * Add a file in the current folder.
	 * @private
	 * @param {string} name the name of the file
	 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data of the file
	 * @param {Object} o the options of the file
	 * @return {Object} the new file.
	 */
	var fileAdd = function(name, data, o) {
	    // be sure sub folders exist
	    var dataType = utils.getTypeOf(data),
	        parent;
	
	
	    /*
	     * Correct options.
	     */
	
	    o = utils.extend(o || {}, defaults);
	    o.date = o.date || new Date();
	    if (o.compression !== null) {
	        o.compression = o.compression.toUpperCase();
	    }
	
	    if (typeof o.unixPermissions === "string") {
	        o.unixPermissions = parseInt(o.unixPermissions, 8);
	    }
	
	    // UNX_IFDIR  0040000 see zipinfo.c
	    if (o.unixPermissions && (o.unixPermissions & 0x4000)) {
	        o.dir = true;
	    }
	    // Bit 4    Directory
	    if (o.dosPermissions && (o.dosPermissions & 0x0010)) {
	        o.dir = true;
	    }
	
	    if (o.dir) {
	        name = forceTrailingSlash(name);
	    }
	    if (o.createFolders && (parent = parentFolder(name))) {
	        folderAdd.call(this, parent, true);
	    }
	
	    var isUnicodeString = dataType === "string" && o.binary === false && o.base64 === false;
	    o.binary = !isUnicodeString;
	
	
	    var isCompressedEmpty = (data instanceof CompressedObject) && data.uncompressedSize === 0;
	
	    if (isCompressedEmpty || o.dir || !data || data.length === 0) {
	        o.base64 = false;
	        o.binary = true;
	        data = "";
	        o.compression = "STORE";
	        dataType = "string";
	    }
	
	    /*
	     * Convert content to fit.
	     */
	
	    var zipObjectContent = null;
	    if (data instanceof CompressedObject || data instanceof GenericWorker) {
	        zipObjectContent = data;
	    } else if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
	        zipObjectContent = new NodejsStreamInputAdapter(name, data);
	    } else {
	        zipObjectContent = utils.prepareContent(name, data, o.binary, o.optimizedBinaryString, o.base64);
	    }
	
	    var object = new ZipObject(name, zipObjectContent, o);
	    this.files[name] = object;
	    /*
	    TODO: we can't throw an exception because we have async promises
	    (we can have a promise of a Date() for example) but returning a
	    promise is useless because file(name, data) returns the JSZip
	    object for chaining. Should we break that to allow the user
	    to catch the error ?
	
	    return external.Promise.resolve(zipObjectContent)
	    .then(function () {
	        return object;
	    });
	    */
	};
	
	/**
	 * Find the parent folder of the path.
	 * @private
	 * @param {string} path the path to use
	 * @return {string} the parent folder, or ""
	 */
	var parentFolder = function (path) {
	    if (path.slice(-1) === '/') {
	        path = path.substring(0, path.length - 1);
	    }
	    var lastSlash = path.lastIndexOf('/');
	    return (lastSlash > 0) ? path.substring(0, lastSlash) : "";
	};
	
	/**
	 * Returns the path with a slash at the end.
	 * @private
	 * @param {String} path the path to check.
	 * @return {String} the path with a trailing slash.
	 */
	var forceTrailingSlash = function(path) {
	    // Check the name ends with a /
	    if (path.slice(-1) !== "/") {
	        path += "/"; // IE doesn't like substr(-1)
	    }
	    return path;
	};
	
	/**
	 * Add a (sub) folder in the current folder.
	 * @private
	 * @param {string} name the folder's name
	 * @param {boolean=} [createFolders] If true, automatically create sub
	 *  folders. Defaults to false.
	 * @return {Object} the new folder.
	 */
	var folderAdd = function(name, createFolders) {
	    createFolders = (typeof createFolders !== 'undefined') ? createFolders : defaults.createFolders;
	
	    name = forceTrailingSlash(name);
	
	    // Does this folder already exist?
	    if (!this.files[name]) {
	        fileAdd.call(this, name, null, {
	            dir: true,
	            createFolders: createFolders
	        });
	    }
	    return this.files[name];
	};
	
	/**
	* Cross-window, cross-Node-context regular expression detection
	* @param  {Object}  object Anything
	* @return {Boolean}        true if the object is a regular expression,
	* false otherwise
	*/
	function isRegExp(object) {
	    return Object.prototype.toString.call(object) === "[object RegExp]";
	}
	
	// return the actual prototype of JSZip
	var out = {
	    /**
	     * @see loadAsync
	     */
	    load: function() {
	        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
	    },
	
	
	    /**
	     * Call a callback function for each entry at this folder level.
	     * @param {Function} cb the callback function:
	     * function (relativePath, file) {...}
	     * It takes 2 arguments : the relative path and the file.
	     */
	    forEach: function(cb) {
	        var filename, relativePath, file;
	        for (filename in this.files) {
	            if (!this.files.hasOwnProperty(filename)) {
	                continue;
	            }
	            file = this.files[filename];
	            relativePath = filename.slice(this.root.length, filename.length);
	            if (relativePath && filename.slice(0, this.root.length) === this.root) { // the file is in the current root
	                cb(relativePath, file); // TODO reverse the parameters ? need to be clean AND consistent with the filter search fn...
	            }
	        }
	    },
	
	    /**
	     * Filter nested files/folders with the specified function.
	     * @param {Function} search the predicate to use :
	     * function (relativePath, file) {...}
	     * It takes 2 arguments : the relative path and the file.
	     * @return {Array} An array of matching elements.
	     */
	    filter: function(search) {
	        var result = [];
	        this.forEach(function (relativePath, entry) {
	            if (search(relativePath, entry)) { // the file matches the function
	                result.push(entry);
	            }
	
	        });
	        return result;
	    },
	
	    /**
	     * Add a file to the zip file, or search a file.
	     * @param   {string|RegExp} name The name of the file to add (if data is defined),
	     * the name of the file to find (if no data) or a regex to match files.
	     * @param   {String|ArrayBuffer|Uint8Array|Buffer} data  The file data, either raw or base64 encoded
	     * @param   {Object} o     File options
	     * @return  {JSZip|Object|Array} this JSZip object (when adding a file),
	     * a file (when searching by string) or an array of files (when searching by regex).
	     */
	    file: function(name, data, o) {
	        if (arguments.length === 1) {
	            if (isRegExp(name)) {
	                var regexp = name;
	                return this.filter(function(relativePath, file) {
	                    return !file.dir && regexp.test(relativePath);
	                });
	            }
	            else { // text
	                var obj = this.files[this.root + name];
	                if (obj && !obj.dir) {
	                    return obj;
	                } else {
	                    return null;
	                }
	            }
	        }
	        else { // more than one argument : we have data !
	            name = this.root + name;
	            fileAdd.call(this, name, data, o);
	        }
	        return this;
	    },
	
	    /**
	     * Add a directory to the zip file, or search.
	     * @param   {String|RegExp} arg The name of the directory to add, or a regex to search folders.
	     * @return  {JSZip} an object with the new directory as the root, or an array containing matching folders.
	     */
	    folder: function(arg) {
	        if (!arg) {
	            return this;
	        }
	
	        if (isRegExp(arg)) {
	            return this.filter(function(relativePath, file) {
	                return file.dir && arg.test(relativePath);
	            });
	        }
	
	        // else, name is a new folder
	        var name = this.root + arg;
	        var newFolder = folderAdd.call(this, name);
	
	        // Allow chaining by returning a new object with this folder as the root
	        var ret = this.clone();
	        ret.root = newFolder.name;
	        return ret;
	    },
	
	    /**
	     * Delete a file, or a directory and all sub-files, from the zip
	     * @param {string} name the name of the file to delete
	     * @return {JSZip} this JSZip object
	     */
	    remove: function(name) {
	        name = this.root + name;
	        var file = this.files[name];
	        if (!file) {
	            // Look for any folders
	            if (name.slice(-1) !== "/") {
	                name += "/";
	            }
	            file = this.files[name];
	        }
	
	        if (file && !file.dir) {
	            // file
	            delete this.files[name];
	        } else {
	            // maybe a folder, delete recursively
	            var kids = this.filter(function(relativePath, file) {
	                return file.name.slice(0, name.length) === name;
	            });
	            for (var i = 0; i < kids.length; i++) {
	                delete this.files[kids[i].name];
	            }
	        }
	
	        return this;
	    },
	
	    /**
	     * Generate the complete zip file
	     * @param {Object} options the options to generate the zip file :
	     * - compression, "STORE" by default.
	     * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
	     * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the zip file
	     */
	    generate: function(options) {
	        throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
	    },
	
	    /**
	     * Generate the complete zip file as an internal stream.
	     * @param {Object} options the options to generate the zip file :
	     * - compression, "STORE" by default.
	     * - type, "base64" by default. Values are : string, base64, uint8array, arraybuffer, blob.
	     * @return {StreamHelper} the streamed zip file.
	     */
	    generateInternalStream: function(options) {
	      var worker, opts = {};
	      try {
	          opts = utils.extend(options || {}, {
	              streamFiles: false,
	              compression: "STORE",
	              compressionOptions : null,
	              type: "",
	              platform: "DOS",
	              comment: null,
	              mimeType: 'application/zip',
	              encodeFileName: utf8.utf8encode
	          });
	
	          opts.type = opts.type.toLowerCase();
	          opts.compression = opts.compression.toUpperCase();
	
	          // "binarystring" is prefered but the internals use "string".
	          if(opts.type === "binarystring") {
	            opts.type = "string";
	          }
	
	          if (!opts.type) {
	            throw new Error("No output type specified.");
	          }
	
	          utils.checkSupport(opts.type);
	
	          // accept nodejs `process.platform`
	          if(
	              options.platform === 'darwin' ||
	              options.platform === 'freebsd' ||
	              options.platform === 'linux' ||
	              options.platform === 'sunos'
	          ) {
	              options.platform = "UNIX";
	          }
	          if (options.platform === 'win32') {
	              options.platform = "DOS";
	          }
	
	          var comment = opts.comment || this.comment || "";
	          worker = generate.generateWorker(this, opts, comment);
	      } catch (e) {
	        worker = new GenericWorker("error");
	        worker.error(e);
	      }
	      return new StreamHelper(worker, opts.type || "string", opts.mimeType);
	    },
	    /**
	     * Generate the complete zip file asynchronously.
	     * @see generateInternalStream
	     */
	    generateAsync: function(options, onUpdate) {
	        return this.generateInternalStream(options).accumulate(onUpdate);
	    },
	    /**
	     * Generate the complete zip file asynchronously.
	     * @see generateInternalStream
	     */
	    generateNodeStream: function(options, onUpdate) {
	        options = options || {};
	        if (!options.type) {
	            options.type = "nodebuffer";
	        }
	        return this.generateInternalStream(options).toNodejsStream(onUpdate);
	    }
	};
	module.exports = out;


/***/ },
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(138);
	var support = __webpack_require__(139);
	var nodejsUtils = __webpack_require__(173);
	var GenericWorker = __webpack_require__(181);
	
	/**
	 * The following functions come from pako, from pako/lib/utils/strings
	 * released under the MIT license, see pako https://github.com/nodeca/pako/
	 */
	
	// Table with utf8 lengths (calculated by first byte of sequence)
	// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
	// because max possible codepoint is 0x10ffff
	var _utf8len = new Array(256);
	for (var i=0; i<256; i++) {
	  _utf8len[i] = (i >= 252 ? 6 : i >= 248 ? 5 : i >= 240 ? 4 : i >= 224 ? 3 : i >= 192 ? 2 : 1);
	}
	_utf8len[254]=_utf8len[254]=1; // Invalid sequence start
	
	// convert string to array (typed, when possible)
	var string2buf = function (str) {
	    var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
	
	    // count binary size
	    for (m_pos = 0; m_pos < str_len; m_pos++) {
	        c = str.charCodeAt(m_pos);
	        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
	            c2 = str.charCodeAt(m_pos+1);
	            if ((c2 & 0xfc00) === 0xdc00) {
	                c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	                m_pos++;
	            }
	        }
	        buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
	    }
	
	    // allocate buffer
	    if (support.uint8array) {
	        buf = new Uint8Array(buf_len);
	    } else {
	        buf = new Array(buf_len);
	    }
	
	    // convert
	    for (i=0, m_pos = 0; i < buf_len; m_pos++) {
	        c = str.charCodeAt(m_pos);
	        if ((c & 0xfc00) === 0xd800 && (m_pos+1 < str_len)) {
	            c2 = str.charCodeAt(m_pos+1);
	            if ((c2 & 0xfc00) === 0xdc00) {
	                c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	                m_pos++;
	            }
	        }
	        if (c < 0x80) {
	            /* one byte */
	            buf[i++] = c;
	        } else if (c < 0x800) {
	            /* two bytes */
	            buf[i++] = 0xC0 | (c >>> 6);
	            buf[i++] = 0x80 | (c & 0x3f);
	        } else if (c < 0x10000) {
	            /* three bytes */
	            buf[i++] = 0xE0 | (c >>> 12);
	            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	            buf[i++] = 0x80 | (c & 0x3f);
	        } else {
	            /* four bytes */
	            buf[i++] = 0xf0 | (c >>> 18);
	            buf[i++] = 0x80 | (c >>> 12 & 0x3f);
	            buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	            buf[i++] = 0x80 | (c & 0x3f);
	        }
	    }
	
	    return buf;
	};
	
	// Calculate max possible position in utf8 buffer,
	// that will not break sequence. If that's not possible
	// - (very small limits) return max size as is.
	//
	// buf[] - utf8 bytes array
	// max   - length limit (mandatory);
	var utf8border = function(buf, max) {
	    var pos;
	
	    max = max || buf.length;
	    if (max > buf.length) { max = buf.length; }
	
	    // go back from last position, until start of sequence found
	    pos = max-1;
	    while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }
	
	    // Fuckup - very small and broken sequence,
	    // return max, because we should return something anyway.
	    if (pos < 0) { return max; }
	
	    // If we came to start of buffer - that means vuffer is too small,
	    // return max too.
	    if (pos === 0) { return max; }
	
	    return (pos + _utf8len[buf[pos]] > max) ? pos : max;
	};
	
	// convert array to string
	var buf2string = function (buf) {
	    var str, i, out, c, c_len;
	    var len = buf.length;
	
	    // Reserve max possible length (2 words per char)
	    // NB: by unknown reasons, Array is significantly faster for
	    //     String.fromCharCode.apply than Uint16Array.
	    var utf16buf = new Array(len*2);
	
	    for (out=0, i=0; i<len;) {
	        c = buf[i++];
	        // quick process ascii
	        if (c < 0x80) { utf16buf[out++] = c; continue; }
	
	        c_len = _utf8len[c];
	        // skip 5 & 6 byte codes
	        if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len-1; continue; }
	
	        // apply mask on first byte
	        c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
	        // join the rest
	        while (c_len > 1 && i < len) {
	            c = (c << 6) | (buf[i++] & 0x3f);
	            c_len--;
	        }
	
	        // terminated by end of string?
	        if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }
	
	        if (c < 0x10000) {
	            utf16buf[out++] = c;
	        } else {
	            c -= 0x10000;
	            utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
	            utf16buf[out++] = 0xdc00 | (c & 0x3ff);
	        }
	    }
	
	    // shrinkBuf(utf16buf, out)
	    if (utf16buf.length !== out) {
	        if(utf16buf.subarray) {
	            utf16buf = utf16buf.subarray(0, out);
	        } else {
	            utf16buf.length = out;
	        }
	    }
	
	    // return String.fromCharCode.apply(null, utf16buf);
	    return utils.applyFromCharCode(utf16buf);
	};
	
	
	// That's all for the pako functions.
	
	
	/**
	 * Transform a javascript string into an array (typed if possible) of bytes,
	 * UTF-8 encoded.
	 * @param {String} str the string to encode
	 * @return {Array|Uint8Array|Buffer} the UTF-8 encoded string.
	 */
	exports.utf8encode = function utf8encode(str) {
	    if (support.nodebuffer) {
	        return nodejsUtils.newBuffer(str, "utf-8");
	    }
	
	    return string2buf(str);
	};
	
	
	/**
	 * Transform a bytes array (or a representation) representing an UTF-8 encoded
	 * string into a javascript string.
	 * @param {Array|Uint8Array|Buffer} buf the data de decode
	 * @return {String} the decoded string.
	 */
	exports.utf8decode = function utf8decode(buf) {
	    if (support.nodebuffer) {
	        return utils.transformTo("nodebuffer", buf).toString("utf-8");
	    }
	
	    buf = utils.transformTo(support.uint8array ? "uint8array" : "array", buf);
	
	    return buf2string(buf);
	};
	
	/**
	 * A worker to decode utf8 encoded binary chunks into string chunks.
	 * @constructor
	 */
	function Utf8DecodeWorker() {
	    GenericWorker.call(this, "utf-8 decode");
	    // the last bytes if a chunk didn't end with a complete codepoint.
	    this.leftOver = null;
	}
	utils.inherits(Utf8DecodeWorker, GenericWorker);
	
	/**
	 * @see GenericWorker.processChunk
	 */
	Utf8DecodeWorker.prototype.processChunk = function (chunk) {
	
	    var data = utils.transformTo(support.uint8array ? "uint8array" : "array", chunk.data);
	
	    // 1st step, re-use what's left of the previous chunk
	    if (this.leftOver && this.leftOver.length) {
	        if(support.uint8array) {
	            var previousData = data;
	            data = new Uint8Array(previousData.length + this.leftOver.length);
	            data.set(this.leftOver, 0);
	            data.set(previousData, this.leftOver.length);
	        } else {
	            data = this.leftOver.concat(data);
	        }
	        this.leftOver = null;
	    }
	
	    var nextBoundary = utf8border(data);
	    var usableData = data;
	    if (nextBoundary !== data.length) {
	        if (support.uint8array) {
	            usableData = data.subarray(0, nextBoundary);
	            this.leftOver = data.subarray(nextBoundary, data.length);
	        } else {
	            usableData = data.slice(0, nextBoundary);
	            this.leftOver = data.slice(nextBoundary, data.length);
	        }
	    }
	
	    this.push({
	        data : exports.utf8decode(usableData),
	        meta : chunk.meta
	    });
	};
	
	/**
	 * @see GenericWorker.flush
	 */
	Utf8DecodeWorker.prototype.flush = function () {
	    if(this.leftOver && this.leftOver.length) {
	        this.push({
	            data : exports.utf8decode(this.leftOver),
	            meta : {}
	        });
	        this.leftOver = null;
	    }
	};
	exports.Utf8DecodeWorker = Utf8DecodeWorker;
	
	/**
	 * A worker to endcode string chunks into utf8 encoded binary chunks.
	 * @constructor
	 */
	function Utf8EncodeWorker() {
	    GenericWorker.call(this, "utf-8 encode");
	}
	utils.inherits(Utf8EncodeWorker, GenericWorker);
	
	/**
	 * @see GenericWorker.processChunk
	 */
	Utf8EncodeWorker.prototype.processChunk = function (chunk) {
	    this.push({
	        data : exports.utf8encode(chunk.data),
	        meta : chunk.meta
	    });
	};
	exports.Utf8EncodeWorker = Utf8EncodeWorker;


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var support = __webpack_require__(139);
	var base64 = __webpack_require__(172);
	var nodejsUtils = __webpack_require__(173);
	var asap = __webpack_require__(174);
	var external = __webpack_require__(176);
	
	
	/**
	 * Convert a string that pass as a "binary string": it should represent a byte
	 * array but may have > 255 char codes. Be sure to take only the first byte
	 * and returns the byte array.
	 * @param {String} str the string to transform.
	 * @return {Array|Uint8Array} the string in a binary format.
	 */
	function string2binary(str) {
	    var result = null;
	    if (support.uint8array) {
	      result = new Uint8Array(str.length);
	    } else {
	      result = new Array(str.length);
	    }
	    return stringToArrayLike(str, result);
	}
	
	/**
	 * Create a new blob with the given content and the given type.
	 * @param {String|ArrayBuffer} part the content to put in the blob. DO NOT use
	 * an Uint8Array because the stock browser of android 4 won't accept it (it
	 * will be silently converted to a string, "[object Uint8Array]").
	 * @param {String} type the mime type of the blob.
	 * @return {Blob} the created blob.
	 */
	exports.newBlob = function(part, type) {
	    exports.checkSupport("blob");
	
	    try {
	        // Blob constructor
	        return new Blob([part], {
	            type: type
	        });
	    }
	    catch (e) {
	
	        try {
	            // deprecated, browser only, old way
	            var Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
	            var builder = new Builder();
	            builder.append(part);
	            return builder.getBlob(type);
	        }
	        catch (e) {
	
	            // well, fuck ?!
	            throw new Error("Bug : can't construct the Blob.");
	        }
	    }
	
	
	};
	/**
	 * The identity function.
	 * @param {Object} input the input.
	 * @return {Object} the same input.
	 */
	function identity(input) {
	    return input;
	}
	
	/**
	 * Fill in an array with a string.
	 * @param {String} str the string to use.
	 * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to fill in (will be mutated).
	 * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated array.
	 */
	function stringToArrayLike(str, array) {
	    for (var i = 0; i < str.length; ++i) {
	        array[i] = str.charCodeAt(i) & 0xFF;
	    }
	    return array;
	}
	
	/**
	 * An helper for the function arrayLikeToString.
	 * This contains static informations and functions that
	 * can be optimized by the browser JIT compiler.
	 */
	var arrayToStringHelper = {
	    /**
	     * Transform an array of int into a string, chunk by chunk.
	     * See the performances notes on arrayLikeToString.
	     * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
	     * @param {String} type the type of the array.
	     * @param {Integer} chunk the chunk size.
	     * @return {String} the resulting string.
	     * @throws Error if the chunk is too big for the stack.
	     */
	    stringifyByChunk: function(array, type, chunk) {
	        var result = [], k = 0, len = array.length;
	        // shortcut
	        if (len <= chunk) {
	            return String.fromCharCode.apply(null, array);
	        }
	        while (k < len) {
	            if (type === "array" || type === "nodebuffer") {
	                result.push(String.fromCharCode.apply(null, array.slice(k, Math.min(k + chunk, len))));
	            }
	            else {
	                result.push(String.fromCharCode.apply(null, array.subarray(k, Math.min(k + chunk, len))));
	            }
	            k += chunk;
	        }
	        return result.join("");
	    },
	    /**
	     * Call String.fromCharCode on every item in the array.
	     * This is the naive implementation, which generate A LOT of intermediate string.
	     * This should be used when everything else fail.
	     * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
	     * @return {String} the result.
	     */
	    stringifyByChar: function(array){
	        var resultStr = "";
	        for(var i = 0; i < array.length; i++) {
	            resultStr += String.fromCharCode(array[i]);
	        }
	        return resultStr;
	    },
	    applyCanBeUsed : {
	        /**
	         * true if the browser accepts to use String.fromCharCode on Uint8Array
	         */
	        uint8array : (function () {
	            try {
	                return support.uint8array && String.fromCharCode.apply(null, new Uint8Array(1)).length === 1;
	            } catch (e) {
	                return false;
	            }
	        })(),
	        /**
	         * true if the browser accepts to use String.fromCharCode on nodejs Buffer.
	         */
	        nodebuffer : (function () {
	            try {
	                return support.nodebuffer && String.fromCharCode.apply(null, nodejsUtils.newBuffer(1)).length === 1;
	            } catch (e) {
	                return false;
	            }
	        })()
	    }
	};
	
	/**
	 * Transform an array-like object to a string.
	 * @param {Array|ArrayBuffer|Uint8Array|Buffer} array the array to transform.
	 * @return {String} the result.
	 */
	function arrayLikeToString(array) {
	    // Performances notes :
	    // --------------------
	    // String.fromCharCode.apply(null, array) is the fastest, see
	    // see http://jsperf.com/converting-a-uint8array-to-a-string/2
	    // but the stack is limited (and we can get huge arrays !).
	    //
	    // result += String.fromCharCode(array[i]); generate too many strings !
	    //
	    // This code is inspired by http://jsperf.com/arraybuffer-to-string-apply-performance/2
	    // TODO : we now have workers that split the work. Do we still need that ?
	    var chunk = 65536,
	        type = exports.getTypeOf(array),
	        canUseApply = true;
	    if (type === "uint8array") {
	        canUseApply = arrayToStringHelper.applyCanBeUsed.uint8array;
	    } else if (type === "nodebuffer") {
	        canUseApply = arrayToStringHelper.applyCanBeUsed.nodebuffer;
	    }
	
	    if (canUseApply) {
	        while (chunk > 1) {
	            try {
	                return arrayToStringHelper.stringifyByChunk(array, type, chunk);
	            } catch (e) {
	                chunk = Math.floor(chunk / 2);
	            }
	        }
	    }
	
	    // no apply or chunk error : slow and painful algorithm
	    // default browser on android 4.*
	    return arrayToStringHelper.stringifyByChar(array);
	}
	
	exports.applyFromCharCode = arrayLikeToString;
	
	
	/**
	 * Copy the data from an array-like to an other array-like.
	 * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayFrom the origin array.
	 * @param {Array|ArrayBuffer|Uint8Array|Buffer} arrayTo the destination array which will be mutated.
	 * @return {Array|ArrayBuffer|Uint8Array|Buffer} the updated destination array.
	 */
	function arrayLikeToArrayLike(arrayFrom, arrayTo) {
	    for (var i = 0; i < arrayFrom.length; i++) {
	        arrayTo[i] = arrayFrom[i];
	    }
	    return arrayTo;
	}
	
	// a matrix containing functions to transform everything into everything.
	var transform = {};
	
	// string to ?
	transform["string"] = {
	    "string": identity,
	    "array": function(input) {
	        return stringToArrayLike(input, new Array(input.length));
	    },
	    "arraybuffer": function(input) {
	        return transform["string"]["uint8array"](input).buffer;
	    },
	    "uint8array": function(input) {
	        return stringToArrayLike(input, new Uint8Array(input.length));
	    },
	    "nodebuffer": function(input) {
	        return stringToArrayLike(input, nodejsUtils.newBuffer(input.length));
	    }
	};
	
	// array to ?
	transform["array"] = {
	    "string": arrayLikeToString,
	    "array": identity,
	    "arraybuffer": function(input) {
	        return (new Uint8Array(input)).buffer;
	    },
	    "uint8array": function(input) {
	        return new Uint8Array(input);
	    },
	    "nodebuffer": function(input) {
	        return nodejsUtils.newBuffer(input);
	    }
	};
	
	// arraybuffer to ?
	transform["arraybuffer"] = {
	    "string": function(input) {
	        return arrayLikeToString(new Uint8Array(input));
	    },
	    "array": function(input) {
	        return arrayLikeToArrayLike(new Uint8Array(input), new Array(input.byteLength));
	    },
	    "arraybuffer": identity,
	    "uint8array": function(input) {
	        return new Uint8Array(input);
	    },
	    "nodebuffer": function(input) {
	        return nodejsUtils.newBuffer(new Uint8Array(input));
	    }
	};
	
	// uint8array to ?
	transform["uint8array"] = {
	    "string": arrayLikeToString,
	    "array": function(input) {
	        return arrayLikeToArrayLike(input, new Array(input.length));
	    },
	    "arraybuffer": function(input) {
	        return input.buffer;
	    },
	    "uint8array": identity,
	    "nodebuffer": function(input) {
	        return nodejsUtils.newBuffer(input);
	    }
	};
	
	// nodebuffer to ?
	transform["nodebuffer"] = {
	    "string": arrayLikeToString,
	    "array": function(input) {
	        return arrayLikeToArrayLike(input, new Array(input.length));
	    },
	    "arraybuffer": function(input) {
	        return transform["nodebuffer"]["uint8array"](input).buffer;
	    },
	    "uint8array": function(input) {
	        return arrayLikeToArrayLike(input, new Uint8Array(input.length));
	    },
	    "nodebuffer": identity
	};
	
	/**
	 * Transform an input into any type.
	 * The supported output type are : string, array, uint8array, arraybuffer, nodebuffer.
	 * If no output type is specified, the unmodified input will be returned.
	 * @param {String} outputType the output type.
	 * @param {String|Array|ArrayBuffer|Uint8Array|Buffer} input the input to convert.
	 * @throws {Error} an Error if the browser doesn't support the requested output type.
	 */
	exports.transformTo = function(outputType, input) {
	    if (!input) {
	        // undefined, null, etc
	        // an empty string won't harm.
	        input = "";
	    }
	    if (!outputType) {
	        return input;
	    }
	    exports.checkSupport(outputType);
	    var inputType = exports.getTypeOf(input);
	    var result = transform[inputType][outputType](input);
	    return result;
	};
	
	/**
	 * Return the type of the input.
	 * The type will be in a format valid for JSZip.utils.transformTo : string, array, uint8array, arraybuffer.
	 * @param {Object} input the input to identify.
	 * @return {String} the (lowercase) type of the input.
	 */
	exports.getTypeOf = function(input) {
	    if (typeof input === "string") {
	        return "string";
	    }
	    if (Object.prototype.toString.call(input) === "[object Array]") {
	        return "array";
	    }
	    if (support.nodebuffer && nodejsUtils.isBuffer(input)) {
	        return "nodebuffer";
	    }
	    if (support.uint8array && input instanceof Uint8Array) {
	        return "uint8array";
	    }
	    if (support.arraybuffer && input instanceof ArrayBuffer) {
	        return "arraybuffer";
	    }
	};
	
	/**
	 * Throw an exception if the type is not supported.
	 * @param {String} type the type to check.
	 * @throws {Error} an Error if the browser doesn't support the requested type.
	 */
	exports.checkSupport = function(type) {
	    var supported = support[type.toLowerCase()];
	    if (!supported) {
	        throw new Error(type + " is not supported by this platform");
	    }
	};
	
	exports.MAX_VALUE_16BITS = 65535;
	exports.MAX_VALUE_32BITS = -1; // well, "\xFF\xFF\xFF\xFF\xFF\xFF\xFF\xFF" is parsed as -1
	
	/**
	 * Prettify a string read as binary.
	 * @param {string} str the string to prettify.
	 * @return {string} a pretty string.
	 */
	exports.pretty = function(str) {
	    var res = '',
	        code, i;
	    for (i = 0; i < (str || "").length; i++) {
	        code = str.charCodeAt(i);
	        res += '\\x' + (code < 16 ? "0" : "") + code.toString(16).toUpperCase();
	    }
	    return res;
	};
	
	/**
	 * Defer the call of a function.
	 * @param {Function} callback the function to call asynchronously.
	 * @param {Array} args the arguments to give to the callback.
	 */
	exports.delay = function(callback, args, self) {
	    asap(function () {
	        callback.apply(self || null, args || []);
	    });
	};
	
	/**
	 * Extends a prototype with an other, without calling a constructor with
	 * side effects. Inspired by nodejs' `utils.inherits`
	 * @param {Function} ctor the constructor to augment
	 * @param {Function} superCtor the parent constructor to use
	 */
	exports.inherits = function (ctor, superCtor) {
	    var Obj = function() {};
	    Obj.prototype = superCtor.prototype;
	    ctor.prototype = new Obj();
	};
	
	/**
	 * Merge the objects passed as parameters into a new one.
	 * @private
	 * @param {...Object} var_args All objects to merge.
	 * @return {Object} a new object with the data of the others.
	 */
	exports.extend = function() {
	    var result = {}, i, attr;
	    for (i = 0; i < arguments.length; i++) { // arguments is not enumerable in some browsers
	        for (attr in arguments[i]) {
	            if (arguments[i].hasOwnProperty(attr) && typeof result[attr] === "undefined") {
	                result[attr] = arguments[i][attr];
	            }
	        }
	    }
	    return result;
	};
	
	/**
	 * Transform arbitrary content into a Promise.
	 * @param {String} name a name for the content being processed.
	 * @param {Object} inputData the content to process.
	 * @param {Boolean} isBinary true if the content is not an unicode string
	 * @param {Boolean} isOptimizedBinaryString true if the string content only has one byte per character.
	 * @param {Boolean} isBase64 true if the string content is encoded with base64.
	 * @return {Promise} a promise in a format usable by JSZip.
	 */
	exports.prepareContent = function(name, inputData, isBinary, isOptimizedBinaryString, isBase64) {
	
	    var promise = null;
	    if (support.blob && inputData instanceof Blob && typeof FileReader !== "undefined") {
	        promise = new external.Promise(function (resolve, reject) {
	            var reader = new FileReader();
	
	            reader.onload = function(e) {
	                resolve(e.target.result);
	            };
	            reader.onerror = function(e) {
	                reject(e.target.error);
	            };
	            reader.readAsArrayBuffer(inputData);
	        });
	    } else {
	        // if data is already a promise, this flatten it.
	        promise = external.Promise.resolve(inputData);
	    }
	
	    return promise.then(function(data) {
	        var dataType = exports.getTypeOf(data);
	
	        if (!dataType) {
	            return external.Promise.reject(
	                new Error("The data of '" + name + "' is in an unsupported format !")
	            );
	        }
	        // special case : it's way easier to work with Uint8Array than with ArrayBuffer
	        if (dataType === "arraybuffer") {
	            data = exports.transformTo("uint8array", data);
	        } else if (dataType === "string") {
	            if (isBase64) {
	                data = base64.decode(data);
	            }
	            else if (isBinary) {
	                // optimizedBinaryString === true means that the file has already been filtered with a 0xFF mask
	                if (isOptimizedBinaryString !== true) {
	                    // this is a string, not in a base64 format.
	                    // Be sure that this is a correct "binary string"
	                    data = string2binary(data);
	                }
	            }
	        }
	        return data;
	    });
	};


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	exports.base64 = true;
	exports.array = true;
	exports.string = true;
	exports.arraybuffer = typeof ArrayBuffer !== "undefined" && typeof Uint8Array !== "undefined";
	exports.nodebuffer = typeof Buffer !== "undefined";
	// contains true if JSZip can read/generate Uint8Array, false otherwise.
	exports.uint8array = typeof Uint8Array !== "undefined";
	
	if (typeof ArrayBuffer === "undefined") {
	    exports.blob = false;
	}
	else {
	    var buffer = new ArrayBuffer(0);
	    try {
	        exports.blob = new Blob([buffer], {
	            type: "application/zip"
	        }).size === 0;
	    }
	    catch (e) {
	        try {
	            var Builder = window.BlobBuilder || window.WebKitBlobBuilder || window.MozBlobBuilder || window.MSBlobBuilder;
	            var builder = new Builder();
	            builder.append(buffer);
	            exports.blob = builder.getBlob('application/zip').size === 0;
	        }
	        catch (e) {
	            exports.blob = false;
	        }
	    }
	}
	
	exports.nodestream = !!__webpack_require__(141).prototype;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(140).Buffer))

/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(78);

/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var Readable = __webpack_require__(142).Readable;
	
	var util = __webpack_require__(171);
	util.inherits(NodejsStreamOutputAdapter, Readable);
	
	/**
	* A nodejs stream using a worker as source.
	* @see the SourceWrapper in http://nodejs.org/api/stream.html
	* @constructor
	* @param {StreamHelper} helper the helper wrapping the worker
	* @param {Object} options the nodejs stream options
	* @param {Function} updateCb the update callback.
	*/
	function NodejsStreamOutputAdapter(helper, options, updateCb) {
	    Readable.call(this, options);
	    this._helper = helper;
	
	    var self = this;
	    helper.on("data", function (data, meta) {
	        if (!self.push(data)) {
	            self._helper.pause();
	        }
	        if(updateCb) {
	            updateCb(meta);
	        }
	    })
	    .on("error", function(e) {
	        self.emit('error', e);
	    })
	    .on("end", function () {
	        self.push(null);
	    });
	}
	
	
	NodejsStreamOutputAdapter.prototype._read = function() {
	    this._helper.resume();
	};
	
	module.exports = NodejsStreamOutputAdapter;


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	var Stream = (function (){
	  try {
	    return __webpack_require__(143); // hack to fix a circular dependency issue when used with browserify
	  } catch(_){}
	}());
	exports = module.exports = __webpack_require__(161);
	exports.Stream = Stream || exports;
	exports.Readable = exports;
	exports.Writable = __webpack_require__(166);
	exports.Duplex = __webpack_require__(165);
	exports.Transform = __webpack_require__(169);
	exports.PassThrough = __webpack_require__(170);


/***/ },
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	module.exports = Stream;
	
	var EE = __webpack_require__(144).EventEmitter;
	var inherits = __webpack_require__(145);
	
	inherits(Stream, EE);
	Stream.Readable = __webpack_require__(146);
	Stream.Writable = __webpack_require__(157);
	Stream.Duplex = __webpack_require__(158);
	Stream.Transform = __webpack_require__(159);
	Stream.PassThrough = __webpack_require__(160);
	
	// Backwards-compat with node 0.4.x
	Stream.Stream = Stream;
	
	
	
	// old-style streams.  Note that the pipe method (the only relevant
	// part of this class) is overridden in the Readable class.
	
	function Stream() {
	  EE.call(this);
	}
	
	Stream.prototype.pipe = function(dest, options) {
	  var source = this;
	
	  function ondata(chunk) {
	    if (dest.writable) {
	      if (false === dest.write(chunk) && source.pause) {
	        source.pause();
	      }
	    }
	  }
	
	  source.on('data', ondata);
	
	  function ondrain() {
	    if (source.readable && source.resume) {
	      source.resume();
	    }
	  }
	
	  dest.on('drain', ondrain);
	
	  // If the 'end' option is not supplied, dest.end() will be called when
	  // source gets the 'end' or 'close' events.  Only dest.end() once.
	  if (!dest._isStdio && (!options || options.end !== false)) {
	    source.on('end', onend);
	    source.on('close', onclose);
	  }
	
	  var didOnEnd = false;
	  function onend() {
	    if (didOnEnd) return;
	    didOnEnd = true;
	
	    dest.end();
	  }
	
	
	  function onclose() {
	    if (didOnEnd) return;
	    didOnEnd = true;
	
	    if (typeof dest.destroy === 'function') dest.destroy();
	  }
	
	  // don't leave dangling pipes when there are errors.
	  function onerror(er) {
	    cleanup();
	    if (EE.listenerCount(this, 'error') === 0) {
	      throw er; // Unhandled stream error in pipe.
	    }
	  }
	
	  source.on('error', onerror);
	  dest.on('error', onerror);
	
	  // remove all the event listeners that were added.
	  function cleanup() {
	    source.removeListener('data', ondata);
	    dest.removeListener('drain', ondrain);
	
	    source.removeListener('end', onend);
	    source.removeListener('close', onclose);
	
	    source.removeListener('error', onerror);
	    dest.removeListener('error', onerror);
	
	    source.removeListener('end', cleanup);
	    source.removeListener('close', cleanup);
	
	    dest.removeListener('close', cleanup);
	  }
	
	  source.on('end', cleanup);
	  source.on('close', cleanup);
	
	  dest.on('close', cleanup);
	
	  dest.emit('pipe', source);
	
	  // Allow for unix-like usage: A.pipe(B).pipe(C)
	  return dest;
	};


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(59);

/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(90);

/***/ },
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {exports = module.exports = __webpack_require__(148);
	exports.Stream = __webpack_require__(143);
	exports.Readable = exports;
	exports.Writable = __webpack_require__(153);
	exports.Duplex = __webpack_require__(152);
	exports.Transform = __webpack_require__(155);
	exports.PassThrough = __webpack_require__(156);
	if (!process.browser && process.env.READABLE_STREAM === 'disable') {
	  module.exports = __webpack_require__(143);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147)))

/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(50);

/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	module.exports = Readable;
	
	/*<replacement>*/
	var isArray = __webpack_require__(149);
	/*</replacement>*/
	
	
	/*<replacement>*/
	var Buffer = __webpack_require__(140).Buffer;
	/*</replacement>*/
	
	Readable.ReadableState = ReadableState;
	
	var EE = __webpack_require__(144).EventEmitter;
	
	/*<replacement>*/
	if (!EE.listenerCount) EE.listenerCount = function(emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/
	
	var Stream = __webpack_require__(143);
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	var StringDecoder;
	
	
	/*<replacement>*/
	var debug = __webpack_require__(151);
	if (debug && debug.debuglog) {
	  debug = debug.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/
	
	
	util.inherits(Readable, Stream);
	
	function ReadableState(options, stream) {
	  var Duplex = __webpack_require__(152);
	
	  options = options || {};
	
	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;
	
	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;
	
	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;
	
	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;
	
	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	
	
	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;
	
	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.readableObjectMode;
	
	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';
	
	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;
	
	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;
	
	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;
	
	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder)
	      StringDecoder = __webpack_require__(154).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}
	
	function Readable(options) {
	  var Duplex = __webpack_require__(152);
	
	  if (!(this instanceof Readable))
	    return new Readable(options);
	
	  this._readableState = new ReadableState(options, this);
	
	  // legacy
	  this.readable = true;
	
	  Stream.call(this);
	}
	
	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function(chunk, encoding) {
	  var state = this._readableState;
	
	  if (util.isString(chunk) && !state.objectMode) {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer(chunk, encoding);
	      encoding = '';
	    }
	  }
	
	  return readableAddChunk(this, state, chunk, encoding, false);
	};
	
	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function(chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};
	
	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (util.isNullOrUndefined(chunk)) {
	    state.reading = false;
	    if (!state.ended)
	      onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      if (state.decoder && !addToFront && !encoding)
	        chunk = state.decoder.write(chunk);
	
	      if (!addToFront)
	        state.reading = false;
	
	      // if we want the data now, just emit it.
	      if (state.flowing && state.length === 0 && !state.sync) {
	        stream.emit('data', chunk);
	        stream.read(0);
	      } else {
	        // update the buffer info.
	        state.length += state.objectMode ? 1 : chunk.length;
	        if (addToFront)
	          state.buffer.unshift(chunk);
	        else
	          state.buffer.push(chunk);
	
	        if (state.needReadable)
	          emitReadable(stream);
	      }
	
	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }
	
	  return needMoreData(state);
	}
	
	
	
	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended &&
	         (state.needReadable ||
	          state.length < state.highWaterMark ||
	          state.length === 0);
	}
	
	// backwards compatibility.
	Readable.prototype.setEncoding = function(enc) {
	  if (!StringDecoder)
	    StringDecoder = __webpack_require__(154).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};
	
	// Don't raise the hwm > 128MB
	var MAX_HWM = 0x800000;
	function roundUpToNextPowerOf2(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    for (var p = 1; p < 32; p <<= 1) n |= n >> p;
	    n++;
	  }
	  return n;
	}
	
	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended)
	    return 0;
	
	  if (state.objectMode)
	    return n === 0 ? 0 : 1;
	
	  if (isNaN(n) || util.isNull(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length)
	      return state.buffer[0].length;
	    else
	      return state.length;
	  }
	
	  if (n <= 0)
	    return 0;
	
	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark)
	    state.highWaterMark = roundUpToNextPowerOf2(n);
	
	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else
	      return state.length;
	  }
	
	  return n;
	}
	
	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function(n) {
	  debug('read', n);
	  var state = this._readableState;
	  var nOrig = n;
	
	  if (!util.isNumber(n) || n > 0)
	    state.emittedReadable = false;
	
	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 &&
	      state.needReadable &&
	      (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended)
	      endReadable(this);
	    else
	      emitReadable(this);
	    return null;
	  }
	
	  n = howMuchToRead(n, state);
	
	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0)
	      endReadable(this);
	    return null;
	  }
	
	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.
	
	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);
	
	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }
	
	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  }
	
	  if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0)
	      state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }
	
	  // If _read pushed data synchronously, then `reading` will be false,
	  // and we need to re-evaluate how much data we can return to the user.
	  if (doRead && !state.reading)
	    n = howMuchToRead(nOrig, state);
	
	  var ret;
	  if (n > 0)
	    ret = fromList(n, state);
	  else
	    ret = null;
	
	  if (util.isNull(ret)) {
	    state.needReadable = true;
	    n = 0;
	  }
	
	  state.length -= n;
	
	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended)
	    state.needReadable = true;
	
	  // If we tried to read() past the EOF, then emit end on the next tick.
	  if (nOrig !== n && state.ended && state.length === 0)
	    endReadable(this);
	
	  if (!util.isNull(ret))
	    this.emit('data', ret);
	
	  return ret;
	};
	
	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}
	
	
	function onEofChunk(stream, state) {
	  if (state.decoder && !state.ended) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;
	
	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}
	
	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync)
	      process.nextTick(function() {
	        emitReadable_(stream);
	      });
	    else
	      emitReadable_(stream);
	  }
	}
	
	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}
	
	
	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    process.nextTick(function() {
	      maybeReadMore_(stream, state);
	    });
	  }
	}
	
	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended &&
	         state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;
	    else
	      len = state.length;
	  }
	  state.readingMore = false;
	}
	
	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function(n) {
	  this.emit('error', new Error('not implemented'));
	};
	
	Readable.prototype.pipe = function(dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;
	
	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
	
	  var doEnd = (!pipeOpts || pipeOpts.end !== false) &&
	              dest !== process.stdout &&
	              dest !== process.stderr;
	
	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted)
	    process.nextTick(endFn);
	  else
	    src.once('end', endFn);
	
	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }
	
	  function onend() {
	    debug('onend');
	    dest.end();
	  }
	
	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);
	
	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);
	
	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain &&
	        (!dest._writableState || dest._writableState.needDrain))
	      ondrain();
	  }
	
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    var ret = dest.write(chunk);
	    if (false === ret) {
	      debug('false write response, pause',
	            src._readableState.awaitDrain);
	      src._readableState.awaitDrain++;
	      src.pause();
	    }
	  }
	
	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EE.listenerCount(dest, 'error') === 0)
	      dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error)
	    dest.on('error', onerror);
	  else if (isArray(dest._events.error))
	    dest._events.error.unshift(onerror);
	  else
	    dest._events.error = [onerror, dest._events.error];
	
	
	
	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);
	
	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }
	
	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);
	
	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }
	
	  return dest;
	};
	
	function pipeOnDrain(src) {
	  return function() {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain)
	      state.awaitDrain--;
	    if (state.awaitDrain === 0 && EE.listenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}
	
	
	Readable.prototype.unpipe = function(dest) {
	  var state = this._readableState;
	
	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0)
	    return this;
	
	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes)
	      return this;
	
	    if (!dest)
	      dest = state.pipes;
	
	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest)
	      dest.emit('unpipe', this);
	    return this;
	  }
	
	  // slow case. multiple pipe destinations.
	
	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	
	    for (var i = 0; i < len; i++)
	      dests[i].emit('unpipe', this);
	    return this;
	  }
	
	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1)
	    return this;
	
	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1)
	    state.pipes = state.pipes[0];
	
	  dest.emit('unpipe', this);
	
	  return this;
	};
	
	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function(ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);
	
	  // If listening to data, and it has not explicitly been paused,
	  // then call resume to start the flow of data on the next tick.
	  if (ev === 'data' && false !== this._readableState.flowing) {
	    this.resume();
	  }
	
	  if (ev === 'readable' && this.readable) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        var self = this;
	        process.nextTick(function() {
	          debug('readable nexttick read 0');
	          self.read(0);
	        });
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }
	
	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;
	
	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function() {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    if (!state.reading) {
	      debug('resume read 0');
	      this.read(0);
	    }
	    resume(this, state);
	  }
	  return this;
	};
	
	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    process.nextTick(function() {
	      resume_(stream, state);
	    });
	  }
	}
	
	function resume_(stream, state) {
	  state.resumeScheduled = false;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading)
	    stream.read(0);
	}
	
	Readable.prototype.pause = function() {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};
	
	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  if (state.flowing) {
	    do {
	      var chunk = stream.read();
	    } while (null !== chunk && state.flowing);
	  }
	}
	
	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function(stream) {
	  var state = this._readableState;
	  var paused = false;
	
	  var self = this;
	  stream.on('end', function() {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length)
	        self.push(chunk);
	    }
	
	    self.push(null);
	  });
	
	  stream.on('data', function(chunk) {
	    debug('wrapped data');
	    if (state.decoder)
	      chunk = state.decoder.write(chunk);
	    if (!chunk || !state.objectMode && !chunk.length)
	      return;
	
	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });
	
	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (util.isFunction(stream[i]) && util.isUndefined(this[i])) {
	      this[i] = function(method) { return function() {
	        return stream[method].apply(stream, arguments);
	      }}(i);
	    }
	  }
	
	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function(ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });
	
	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function(n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };
	
	  return self;
	};
	
	
	
	// exposed for testing purposes only.
	Readable._fromList = fromList;
	
	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;
	
	  // nothing in the list, definitely empty.
	  if (list.length === 0)
	    return null;
	
	  if (length === 0)
	    ret = null;
	  else if (objectMode)
	    ret = list.shift();
	  else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode)
	      ret = list.join('');
	    else
	      ret = Buffer.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode)
	        ret = '';
	      else
	        ret = new Buffer(n);
	
	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);
	
	        if (stringMode)
	          ret += buf.slice(0, cpy);
	        else
	          buf.copy(ret, c, 0, cpy);
	
	        if (cpy < buf.length)
	          list[0] = buf.slice(cpy);
	        else
	          list.shift();
	
	        c += cpy;
	      }
	    }
	  }
	
	  return ret;
	}
	
	function endReadable(stream) {
	  var state = stream._readableState;
	
	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0)
	    throw new Error('endReadable called on non-empty stream');
	
	  if (!state.endEmitted) {
	    state.ended = true;
	    process.nextTick(function() {
	      // Check that we didn't get one last unshift.
	      if (!state.endEmitted && state.length === 0) {
	        state.endEmitted = true;
	        stream.readable = false;
	        stream.emit('end');
	      }
	    });
	  }
	}
	
	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}
	
	function indexOf (xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147)))

/***/ },
/* 149 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// NOTE: These type checking functions intentionally don't use `instanceof`
	// because it is fragile and can be easily faked with `Object.create()`.
	
	function isArray(arg) {
	  if (Array.isArray) {
	    return Array.isArray(arg);
	  }
	  return objectToString(arg) === '[object Array]';
	}
	exports.isArray = isArray;
	
	function isBoolean(arg) {
	  return typeof arg === 'boolean';
	}
	exports.isBoolean = isBoolean;
	
	function isNull(arg) {
	  return arg === null;
	}
	exports.isNull = isNull;
	
	function isNullOrUndefined(arg) {
	  return arg == null;
	}
	exports.isNullOrUndefined = isNullOrUndefined;
	
	function isNumber(arg) {
	  return typeof arg === 'number';
	}
	exports.isNumber = isNumber;
	
	function isString(arg) {
	  return typeof arg === 'string';
	}
	exports.isString = isString;
	
	function isSymbol(arg) {
	  return typeof arg === 'symbol';
	}
	exports.isSymbol = isSymbol;
	
	function isUndefined(arg) {
	  return arg === void 0;
	}
	exports.isUndefined = isUndefined;
	
	function isRegExp(re) {
	  return objectToString(re) === '[object RegExp]';
	}
	exports.isRegExp = isRegExp;
	
	function isObject(arg) {
	  return typeof arg === 'object' && arg !== null;
	}
	exports.isObject = isObject;
	
	function isDate(d) {
	  return objectToString(d) === '[object Date]';
	}
	exports.isDate = isDate;
	
	function isError(e) {
	  return (objectToString(e) === '[object Error]' || e instanceof Error);
	}
	exports.isError = isError;
	
	function isFunction(arg) {
	  return typeof arg === 'function';
	}
	exports.isFunction = isFunction;
	
	function isPrimitive(arg) {
	  return arg === null ||
	         typeof arg === 'boolean' ||
	         typeof arg === 'number' ||
	         typeof arg === 'string' ||
	         typeof arg === 'symbol' ||  // ES6 symbol
	         typeof arg === 'undefined';
	}
	exports.isPrimitive = isPrimitive;
	
	exports.isBuffer = Buffer.isBuffer;
	
	function objectToString(o) {
	  return Object.prototype.toString.call(o);
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(140).Buffer))

/***/ },
/* 151 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.
	
	module.exports = Duplex;
	
	/*<replacement>*/
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) keys.push(key);
	  return keys;
	}
	/*</replacement>*/
	
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	var Readable = __webpack_require__(148);
	var Writable = __webpack_require__(153);
	
	util.inherits(Duplex, Readable);
	
	forEach(objectKeys(Writable.prototype), function(method) {
	  if (!Duplex.prototype[method])
	    Duplex.prototype[method] = Writable.prototype[method];
	});
	
	function Duplex(options) {
	  if (!(this instanceof Duplex))
	    return new Duplex(options);
	
	  Readable.call(this, options);
	  Writable.call(this, options);
	
	  if (options && options.readable === false)
	    this.readable = false;
	
	  if (options && options.writable === false)
	    this.writable = false;
	
	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false)
	    this.allowHalfOpen = false;
	
	  this.once('end', onend);
	}
	
	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended)
	    return;
	
	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  process.nextTick(this.end.bind(this));
	}
	
	function forEach (xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147)))

/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// A bit simpler than readable streams.
	// Implement an async ._write(chunk, cb), and it'll handle all
	// the drain event emission and buffering.
	
	module.exports = Writable;
	
	/*<replacement>*/
	var Buffer = __webpack_require__(140).Buffer;
	/*</replacement>*/
	
	Writable.WritableState = WritableState;
	
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	var Stream = __webpack_require__(143);
	
	util.inherits(Writable, Stream);
	
	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	}
	
	function WritableState(options, stream) {
	  var Duplex = __webpack_require__(152);
	
	  options = options || {};
	
	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = options.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = (hwm || hwm === 0) ? hwm : defaultHwm;
	
	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;
	
	  if (stream instanceof Duplex)
	    this.objectMode = this.objectMode || !!options.writableObjectMode;
	
	  // cast to ints.
	  this.highWaterMark = ~~this.highWaterMark;
	
	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;
	
	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;
	
	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';
	
	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;
	
	  // a flag to see when we're in the middle of a write.
	  this.writing = false;
	
	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;
	
	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;
	
	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;
	
	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function(er) {
	    onwrite(stream, er);
	  };
	
	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;
	
	  // the amount that is being written when _write is called.
	  this.writelen = 0;
	
	  this.buffer = [];
	
	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;
	
	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;
	
	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	}
	
	function Writable(options) {
	  var Duplex = __webpack_require__(152);
	
	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex))
	    return new Writable(options);
	
	  this._writableState = new WritableState(options, this);
	
	  // legacy.
	  this.writable = true;
	
	  Stream.call(this);
	}
	
	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function() {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};
	
	
	function writeAfterEnd(stream, state, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  process.nextTick(function() {
	    cb(er);
	  });
	}
	
	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	  if (!util.isBuffer(chunk) &&
	      !util.isString(chunk) &&
	      !util.isNullOrUndefined(chunk) &&
	      !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    process.nextTick(function() {
	      cb(er);
	    });
	    valid = false;
	  }
	  return valid;
	}
	
	Writable.prototype.write = function(chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;
	
	  if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }
	
	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  else if (!encoding)
	    encoding = state.defaultEncoding;
	
	  if (!util.isFunction(cb))
	    cb = function() {};
	
	  if (state.ended)
	    writeAfterEnd(this, state, cb);
	  else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }
	
	  return ret;
	};
	
	Writable.prototype.cork = function() {
	  var state = this._writableState;
	
	  state.corked++;
	};
	
	Writable.prototype.uncork = function() {
	  var state = this._writableState;
	
	  if (state.corked) {
	    state.corked--;
	
	    if (!state.writing &&
	        !state.corked &&
	        !state.finished &&
	        !state.bufferProcessing &&
	        state.buffer.length)
	      clearBuffer(this, state);
	  }
	};
	
	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode &&
	      state.decodeStrings !== false &&
	      util.isString(chunk)) {
	    chunk = new Buffer(chunk, encoding);
	  }
	  return chunk;
	}
	
	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	  if (util.isBuffer(chunk))
	    encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;
	
	  state.length += len;
	
	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret)
	    state.needDrain = true;
	
	  if (state.writing || state.corked)
	    state.buffer.push(new WriteReq(chunk, encoding, cb));
	  else
	    doWrite(stream, state, false, len, chunk, encoding, cb);
	
	  return ret;
	}
	
	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev)
	    stream._writev(chunk, state.onwrite);
	  else
	    stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}
	
	function onwriteError(stream, state, sync, er, cb) {
	  if (sync)
	    process.nextTick(function() {
	      state.pendingcb--;
	      cb(er);
	    });
	  else {
	    state.pendingcb--;
	    cb(er);
	  }
	
	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}
	
	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}
	
	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;
	
	  onwriteStateUpdate(state);
	
	  if (er)
	    onwriteError(stream, state, sync, er, cb);
	  else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(stream, state);
	
	    if (!finished &&
	        !state.corked &&
	        !state.bufferProcessing &&
	        state.buffer.length) {
	      clearBuffer(stream, state);
	    }
	
	    if (sync) {
	      process.nextTick(function() {
	        afterWrite(stream, state, finished, cb);
	      });
	    } else {
	      afterWrite(stream, state, finished, cb);
	    }
	  }
	}
	
	function afterWrite(stream, state, finished, cb) {
	  if (!finished)
	    onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}
	
	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}
	
	
	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	
	  if (stream._writev && state.buffer.length > 1) {
	    // Fast case, write everything using _writev()
	    var cbs = [];
	    for (var c = 0; c < state.buffer.length; c++)
	      cbs.push(state.buffer[c].callback);
	
	    // count the one we are adding, as well.
	    // TODO(isaacs) clean this up
	    state.pendingcb++;
	    doWrite(stream, state, true, state.length, state.buffer, '', function(err) {
	      for (var i = 0; i < cbs.length; i++) {
	        state.pendingcb--;
	        cbs[i](err);
	      }
	    });
	
	    // Clear buffer
	    state.buffer = [];
	  } else {
	    // Slow case, write chunks one-by-one
	    for (var c = 0; c < state.buffer.length; c++) {
	      var entry = state.buffer[c];
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;
	
	      doWrite(stream, state, false, len, chunk, encoding, cb);
	
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        c++;
	        break;
	      }
	    }
	
	    if (c < state.buffer.length)
	      state.buffer = state.buffer.slice(c);
	    else
	      state.buffer.length = 0;
	  }
	
	  state.bufferProcessing = false;
	}
	
	Writable.prototype._write = function(chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	
	};
	
	Writable.prototype._writev = null;
	
	Writable.prototype.end = function(chunk, encoding, cb) {
	  var state = this._writableState;
	
	  if (util.isFunction(chunk)) {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (util.isFunction(encoding)) {
	    cb = encoding;
	    encoding = null;
	  }
	
	  if (!util.isNullOrUndefined(chunk))
	    this.write(chunk, encoding);
	
	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }
	
	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished)
	    endWritable(this, state, cb);
	};
	
	
	function needFinish(stream, state) {
	  return (state.ending &&
	          state.length === 0 &&
	          !state.finished &&
	          !state.writing);
	}
	
	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}
	
	function finishMaybe(stream, state) {
	  var need = needFinish(stream, state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else
	      prefinish(stream, state);
	  }
	  return need;
	}
	
	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished)
	      process.nextTick(cb);
	    else
	      stream.once('finish', cb);
	  }
	  state.ended = true;
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147)))

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	var Buffer = __webpack_require__(140).Buffer;
	
	var isBufferEncoding = Buffer.isEncoding
	  || function(encoding) {
	       switch (encoding && encoding.toLowerCase()) {
	         case 'hex': case 'utf8': case 'utf-8': case 'ascii': case 'binary': case 'base64': case 'ucs2': case 'ucs-2': case 'utf16le': case 'utf-16le': case 'raw': return true;
	         default: return false;
	       }
	     }
	
	
	function assertEncoding(encoding) {
	  if (encoding && !isBufferEncoding(encoding)) {
	    throw new Error('Unknown encoding: ' + encoding);
	  }
	}
	
	// StringDecoder provides an interface for efficiently splitting a series of
	// buffers into a series of JS strings without breaking apart multi-byte
	// characters. CESU-8 is handled as part of the UTF-8 encoding.
	//
	// @TODO Handling all encodings inside a single object makes it very difficult
	// to reason about this code, so it should be split up in the future.
	// @TODO There should be a utf8-strict encoding that rejects invalid UTF-8 code
	// points as used by CESU-8.
	var StringDecoder = exports.StringDecoder = function(encoding) {
	  this.encoding = (encoding || 'utf8').toLowerCase().replace(/[-_]/, '');
	  assertEncoding(encoding);
	  switch (this.encoding) {
	    case 'utf8':
	      // CESU-8 represents each of Surrogate Pair by 3-bytes
	      this.surrogateSize = 3;
	      break;
	    case 'ucs2':
	    case 'utf16le':
	      // UTF-16 represents each of Surrogate Pair by 2-bytes
	      this.surrogateSize = 2;
	      this.detectIncompleteChar = utf16DetectIncompleteChar;
	      break;
	    case 'base64':
	      // Base-64 stores 3 bytes in 4 chars, and pads the remainder.
	      this.surrogateSize = 3;
	      this.detectIncompleteChar = base64DetectIncompleteChar;
	      break;
	    default:
	      this.write = passThroughWrite;
	      return;
	  }
	
	  // Enough space to store all bytes of a single character. UTF-8 needs 4
	  // bytes, but CESU-8 may require up to 6 (3 bytes per surrogate).
	  this.charBuffer = new Buffer(6);
	  // Number of bytes received for the current incomplete multi-byte character.
	  this.charReceived = 0;
	  // Number of bytes expected for the current incomplete multi-byte character.
	  this.charLength = 0;
	};
	
	
	// write decodes the given buffer and returns it as JS string that is
	// guaranteed to not contain any partial multi-byte characters. Any partial
	// character found at the end of the buffer is buffered up, and will be
	// returned when calling write again with the remaining bytes.
	//
	// Note: Converting a Buffer containing an orphan surrogate to a String
	// currently works, but converting a String to a Buffer (via `new Buffer`, or
	// Buffer#write) will replace incomplete surrogates with the unicode
	// replacement character. See https://codereview.chromium.org/121173009/ .
	StringDecoder.prototype.write = function(buffer) {
	  var charStr = '';
	  // if our last write ended with an incomplete multibyte character
	  while (this.charLength) {
	    // determine how many remaining bytes this buffer has to offer for this char
	    var available = (buffer.length >= this.charLength - this.charReceived) ?
	        this.charLength - this.charReceived :
	        buffer.length;
	
	    // add the new bytes to the char buffer
	    buffer.copy(this.charBuffer, this.charReceived, 0, available);
	    this.charReceived += available;
	
	    if (this.charReceived < this.charLength) {
	      // still not enough chars in this buffer? wait for more ...
	      return '';
	    }
	
	    // remove bytes belonging to the current character from the buffer
	    buffer = buffer.slice(available, buffer.length);
	
	    // get the character that was split
	    charStr = this.charBuffer.slice(0, this.charLength).toString(this.encoding);
	
	    // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	    var charCode = charStr.charCodeAt(charStr.length - 1);
	    if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	      this.charLength += this.surrogateSize;
	      charStr = '';
	      continue;
	    }
	    this.charReceived = this.charLength = 0;
	
	    // if there are no more bytes in this buffer, just emit our char
	    if (buffer.length === 0) {
	      return charStr;
	    }
	    break;
	  }
	
	  // determine and set charLength / charReceived
	  this.detectIncompleteChar(buffer);
	
	  var end = buffer.length;
	  if (this.charLength) {
	    // buffer the incomplete character bytes we got
	    buffer.copy(this.charBuffer, 0, buffer.length - this.charReceived, end);
	    end -= this.charReceived;
	  }
	
	  charStr += buffer.toString(this.encoding, 0, end);
	
	  var end = charStr.length - 1;
	  var charCode = charStr.charCodeAt(end);
	  // CESU-8: lead surrogate (D800-DBFF) is also the incomplete character
	  if (charCode >= 0xD800 && charCode <= 0xDBFF) {
	    var size = this.surrogateSize;
	    this.charLength += size;
	    this.charReceived += size;
	    this.charBuffer.copy(this.charBuffer, size, 0, size);
	    buffer.copy(this.charBuffer, 0, 0, size);
	    return charStr.substring(0, end);
	  }
	
	  // or just emit the charStr
	  return charStr;
	};
	
	// detectIncompleteChar determines if there is an incomplete UTF-8 character at
	// the end of the given buffer. If so, it sets this.charLength to the byte
	// length that character, and sets this.charReceived to the number of bytes
	// that are available for this character.
	StringDecoder.prototype.detectIncompleteChar = function(buffer) {
	  // determine how many bytes we have to check at the end of this buffer
	  var i = (buffer.length >= 3) ? 3 : buffer.length;
	
	  // Figure out if one of the last i bytes of our buffer announces an
	  // incomplete char.
	  for (; i > 0; i--) {
	    var c = buffer[buffer.length - i];
	
	    // See http://en.wikipedia.org/wiki/UTF-8#Description
	
	    // 110XXXXX
	    if (i == 1 && c >> 5 == 0x06) {
	      this.charLength = 2;
	      break;
	    }
	
	    // 1110XXXX
	    if (i <= 2 && c >> 4 == 0x0E) {
	      this.charLength = 3;
	      break;
	    }
	
	    // 11110XXX
	    if (i <= 3 && c >> 3 == 0x1E) {
	      this.charLength = 4;
	      break;
	    }
	  }
	  this.charReceived = i;
	};
	
	StringDecoder.prototype.end = function(buffer) {
	  var res = '';
	  if (buffer && buffer.length)
	    res = this.write(buffer);
	
	  if (this.charReceived) {
	    var cr = this.charReceived;
	    var buf = this.charBuffer;
	    var enc = this.encoding;
	    res += buf.slice(0, cr).toString(enc);
	  }
	
	  return res;
	};
	
	function passThroughWrite(buffer) {
	  return buffer.toString(this.encoding);
	}
	
	function utf16DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 2;
	  this.charLength = this.charReceived ? 2 : 0;
	}
	
	function base64DetectIncompleteChar(buffer) {
	  this.charReceived = buffer.length % 3;
	  this.charLength = this.charReceived ? 3 : 0;
	}


/***/ },
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	
	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.
	
	module.exports = Transform;
	
	var Duplex = __webpack_require__(152);
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	util.inherits(Transform, Duplex);
	
	
	function TransformState(options, stream) {
	  this.afterTransform = function(er, data) {
	    return afterTransform(stream, er, data);
	  };
	
	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	}
	
	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;
	
	  var cb = ts.writecb;
	
	  if (!cb)
	    return stream.emit('error', new Error('no writecb in Transform class'));
	
	  ts.writechunk = null;
	  ts.writecb = null;
	
	  if (!util.isNullOrUndefined(data))
	    stream.push(data);
	
	  if (cb)
	    cb(er);
	
	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}
	
	
	function Transform(options) {
	  if (!(this instanceof Transform))
	    return new Transform(options);
	
	  Duplex.call(this, options);
	
	  this._transformState = new TransformState(options, this);
	
	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;
	
	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;
	
	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;
	
	  this.once('prefinish', function() {
	    if (util.isFunction(this._flush))
	      this._flush(function(er) {
	        done(stream, er);
	      });
	    else
	      done(stream);
	  });
	}
	
	Transform.prototype.push = function(chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};
	
	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function(chunk, encoding, cb) {
	  throw new Error('not implemented');
	};
	
	Transform.prototype._write = function(chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform ||
	        rs.needReadable ||
	        rs.length < rs.highWaterMark)
	      this._read(rs.highWaterMark);
	  }
	};
	
	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function(n) {
	  var ts = this._transformState;
	
	  if (!util.isNull(ts.writechunk) && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};
	
	
	function done(stream, er) {
	  if (er)
	    return stream.emit('error', er);
	
	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;
	
	  if (ws.length)
	    throw new Error('calling transform done when ws.length != 0');
	
	  if (ts.transforming)
	    throw new Error('calling transform done when still transforming');
	
	  return stream.push(null);
	}


/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	// Copyright Joyent, Inc. and other Node contributors.
	//
	// Permission is hereby granted, free of charge, to any person obtaining a
	// copy of this software and associated documentation files (the
	// "Software"), to deal in the Software without restriction, including
	// without limitation the rights to use, copy, modify, merge, publish,
	// distribute, sublicense, and/or sell copies of the Software, and to permit
	// persons to whom the Software is furnished to do so, subject to the
	// following conditions:
	//
	// The above copyright notice and this permission notice shall be included
	// in all copies or substantial portions of the Software.
	//
	// THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS
	// OR IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF
	// MERCHANTABILITY, FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN
	// NO EVENT SHALL THE AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM,
	// DAMAGES OR OTHER LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR
	// OTHERWISE, ARISING FROM, OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE
	// USE OR OTHER DEALINGS IN THE SOFTWARE.
	
	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.
	
	module.exports = PassThrough;
	
	var Transform = __webpack_require__(155);
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	util.inherits(PassThrough, Transform);
	
	function PassThrough(options) {
	  if (!(this instanceof PassThrough))
	    return new PassThrough(options);
	
	  Transform.call(this, options);
	}
	
	PassThrough.prototype._transform = function(chunk, encoding, cb) {
	  cb(null, chunk);
	};


/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(153)


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(152)


/***/ },
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(155)


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(156)


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	module.exports = Readable;
	
	/*<replacement>*/
	var processNextTick = __webpack_require__(162);
	/*</replacement>*/
	
	/*<replacement>*/
	var isArray = __webpack_require__(163);
	/*</replacement>*/
	
	/*<replacement>*/
	var Buffer = __webpack_require__(140).Buffer;
	/*</replacement>*/
	
	Readable.ReadableState = ReadableState;
	
	var EE = __webpack_require__(144);
	
	/*<replacement>*/
	var EElistenerCount = function (emitter, type) {
	  return emitter.listeners(type).length;
	};
	/*</replacement>*/
	
	/*<replacement>*/
	var Stream;
	(function () {
	  try {
	    Stream = __webpack_require__(143);
	  } catch (_) {} finally {
	    if (!Stream) Stream = __webpack_require__(144).EventEmitter;
	  }
	})();
	/*</replacement>*/
	
	var Buffer = __webpack_require__(140).Buffer;
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	/*<replacement>*/
	var debugUtil = __webpack_require__(164);
	var debug = undefined;
	if (debugUtil && debugUtil.debuglog) {
	  debug = debugUtil.debuglog('stream');
	} else {
	  debug = function () {};
	}
	/*</replacement>*/
	
	var StringDecoder;
	
	util.inherits(Readable, Stream);
	
	var Duplex;
	function ReadableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(165);
	
	  options = options || {};
	
	  // object stream flag. Used to make read(n) ignore n and to
	  // make all the buffer merging and length checks go away
	  this.objectMode = !!options.objectMode;
	
	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.readableObjectMode;
	
	  // the point at which it stops calling _read() to fill the buffer
	  // Note: 0 is a valid value, means "don't call _read preemptively ever"
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
	
	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;
	
	  this.buffer = [];
	  this.length = 0;
	  this.pipes = null;
	  this.pipesCount = 0;
	  this.flowing = null;
	  this.ended = false;
	  this.endEmitted = false;
	  this.reading = false;
	
	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;
	
	  // whenever we return null, then we set a flag to say
	  // that we're awaiting a 'readable' event emission.
	  this.needReadable = false;
	  this.emittedReadable = false;
	  this.readableListening = false;
	  this.resumeScheduled = false;
	
	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';
	
	  // when piping, we only care about 'readable' events that happen
	  // after read()ing all the bytes and not getting any pushback.
	  this.ranOut = false;
	
	  // the number of writers that are awaiting a drain event in .pipe()s
	  this.awaitDrain = 0;
	
	  // if true, a maybeReadMore has been scheduled
	  this.readingMore = false;
	
	  this.decoder = null;
	  this.encoding = null;
	  if (options.encoding) {
	    if (!StringDecoder) StringDecoder = __webpack_require__(154).StringDecoder;
	    this.decoder = new StringDecoder(options.encoding);
	    this.encoding = options.encoding;
	  }
	}
	
	var Duplex;
	function Readable(options) {
	  Duplex = Duplex || __webpack_require__(165);
	
	  if (!(this instanceof Readable)) return new Readable(options);
	
	  this._readableState = new ReadableState(options, this);
	
	  // legacy
	  this.readable = true;
	
	  if (options && typeof options.read === 'function') this._read = options.read;
	
	  Stream.call(this);
	}
	
	// Manually shove something into the read() buffer.
	// This returns true if the highWaterMark has not been hit yet,
	// similar to how Writable.write() returns true if you should
	// write() some more.
	Readable.prototype.push = function (chunk, encoding) {
	  var state = this._readableState;
	
	  if (!state.objectMode && typeof chunk === 'string') {
	    encoding = encoding || state.defaultEncoding;
	    if (encoding !== state.encoding) {
	      chunk = new Buffer(chunk, encoding);
	      encoding = '';
	    }
	  }
	
	  return readableAddChunk(this, state, chunk, encoding, false);
	};
	
	// Unshift should *always* be something directly out of read()
	Readable.prototype.unshift = function (chunk) {
	  var state = this._readableState;
	  return readableAddChunk(this, state, chunk, '', true);
	};
	
	Readable.prototype.isPaused = function () {
	  return this._readableState.flowing === false;
	};
	
	function readableAddChunk(stream, state, chunk, encoding, addToFront) {
	  var er = chunkInvalid(state, chunk);
	  if (er) {
	    stream.emit('error', er);
	  } else if (chunk === null) {
	    state.reading = false;
	    onEofChunk(stream, state);
	  } else if (state.objectMode || chunk && chunk.length > 0) {
	    if (state.ended && !addToFront) {
	      var e = new Error('stream.push() after EOF');
	      stream.emit('error', e);
	    } else if (state.endEmitted && addToFront) {
	      var e = new Error('stream.unshift() after end event');
	      stream.emit('error', e);
	    } else {
	      var skipAdd;
	      if (state.decoder && !addToFront && !encoding) {
	        chunk = state.decoder.write(chunk);
	        skipAdd = !state.objectMode && chunk.length === 0;
	      }
	
	      if (!addToFront) state.reading = false;
	
	      // Don't add to the buffer if we've decoded to an empty string chunk and
	      // we're not in object mode
	      if (!skipAdd) {
	        // if we want the data now, just emit it.
	        if (state.flowing && state.length === 0 && !state.sync) {
	          stream.emit('data', chunk);
	          stream.read(0);
	        } else {
	          // update the buffer info.
	          state.length += state.objectMode ? 1 : chunk.length;
	          if (addToFront) state.buffer.unshift(chunk);else state.buffer.push(chunk);
	
	          if (state.needReadable) emitReadable(stream);
	        }
	      }
	
	      maybeReadMore(stream, state);
	    }
	  } else if (!addToFront) {
	    state.reading = false;
	  }
	
	  return needMoreData(state);
	}
	
	// if it's past the high water mark, we can push in some more.
	// Also, if we have no data yet, we can stand some
	// more bytes.  This is to work around cases where hwm=0,
	// such as the repl.  Also, if the push() triggered a
	// readable event, and the user called read(largeNumber) such that
	// needReadable was set, then we ought to push more, so that another
	// 'readable' event will be triggered.
	function needMoreData(state) {
	  return !state.ended && (state.needReadable || state.length < state.highWaterMark || state.length === 0);
	}
	
	// backwards compatibility.
	Readable.prototype.setEncoding = function (enc) {
	  if (!StringDecoder) StringDecoder = __webpack_require__(154).StringDecoder;
	  this._readableState.decoder = new StringDecoder(enc);
	  this._readableState.encoding = enc;
	  return this;
	};
	
	// Don't raise the hwm > 8MB
	var MAX_HWM = 0x800000;
	function computeNewHighWaterMark(n) {
	  if (n >= MAX_HWM) {
	    n = MAX_HWM;
	  } else {
	    // Get the next highest power of 2
	    n--;
	    n |= n >>> 1;
	    n |= n >>> 2;
	    n |= n >>> 4;
	    n |= n >>> 8;
	    n |= n >>> 16;
	    n++;
	  }
	  return n;
	}
	
	function howMuchToRead(n, state) {
	  if (state.length === 0 && state.ended) return 0;
	
	  if (state.objectMode) return n === 0 ? 0 : 1;
	
	  if (n === null || isNaN(n)) {
	    // only flow one buffer at a time
	    if (state.flowing && state.buffer.length) return state.buffer[0].length;else return state.length;
	  }
	
	  if (n <= 0) return 0;
	
	  // If we're asking for more than the target buffer level,
	  // then raise the water mark.  Bump up to the next highest
	  // power of 2, to prevent increasing it excessively in tiny
	  // amounts.
	  if (n > state.highWaterMark) state.highWaterMark = computeNewHighWaterMark(n);
	
	  // don't have that much.  return null, unless we've ended.
	  if (n > state.length) {
	    if (!state.ended) {
	      state.needReadable = true;
	      return 0;
	    } else {
	      return state.length;
	    }
	  }
	
	  return n;
	}
	
	// you can override either this method, or the async _read(n) below.
	Readable.prototype.read = function (n) {
	  debug('read', n);
	  var state = this._readableState;
	  var nOrig = n;
	
	  if (typeof n !== 'number' || n > 0) state.emittedReadable = false;
	
	  // if we're doing read(0) to trigger a readable event, but we
	  // already have a bunch of data in the buffer, then just trigger
	  // the 'readable' event and move on.
	  if (n === 0 && state.needReadable && (state.length >= state.highWaterMark || state.ended)) {
	    debug('read: emitReadable', state.length, state.ended);
	    if (state.length === 0 && state.ended) endReadable(this);else emitReadable(this);
	    return null;
	  }
	
	  n = howMuchToRead(n, state);
	
	  // if we've ended, and we're now clear, then finish it up.
	  if (n === 0 && state.ended) {
	    if (state.length === 0) endReadable(this);
	    return null;
	  }
	
	  // All the actual chunk generation logic needs to be
	  // *below* the call to _read.  The reason is that in certain
	  // synthetic stream cases, such as passthrough streams, _read
	  // may be a completely synchronous operation which may change
	  // the state of the read buffer, providing enough data when
	  // before there was *not* enough.
	  //
	  // So, the steps are:
	  // 1. Figure out what the state of things will be after we do
	  // a read from the buffer.
	  //
	  // 2. If that resulting state will trigger a _read, then call _read.
	  // Note that this may be asynchronous, or synchronous.  Yes, it is
	  // deeply ugly to write APIs this way, but that still doesn't mean
	  // that the Readable class should behave improperly, as streams are
	  // designed to be sync/async agnostic.
	  // Take note if the _read call is sync or async (ie, if the read call
	  // has returned yet), so that we know whether or not it's safe to emit
	  // 'readable' etc.
	  //
	  // 3. Actually pull the requested chunks out of the buffer and return.
	
	  // if we need a readable event, then we need to do some reading.
	  var doRead = state.needReadable;
	  debug('need readable', doRead);
	
	  // if we currently have less than the highWaterMark, then also read some
	  if (state.length === 0 || state.length - n < state.highWaterMark) {
	    doRead = true;
	    debug('length less than watermark', doRead);
	  }
	
	  // however, if we've ended, then there's no point, and if we're already
	  // reading, then it's unnecessary.
	  if (state.ended || state.reading) {
	    doRead = false;
	    debug('reading or ended', doRead);
	  }
	
	  if (doRead) {
	    debug('do read');
	    state.reading = true;
	    state.sync = true;
	    // if the length is currently zero, then we *need* a readable event.
	    if (state.length === 0) state.needReadable = true;
	    // call internal read method
	    this._read(state.highWaterMark);
	    state.sync = false;
	  }
	
	  // If _read pushed data synchronously, then `reading` will be false,
	  // and we need to re-evaluate how much data we can return to the user.
	  if (doRead && !state.reading) n = howMuchToRead(nOrig, state);
	
	  var ret;
	  if (n > 0) ret = fromList(n, state);else ret = null;
	
	  if (ret === null) {
	    state.needReadable = true;
	    n = 0;
	  }
	
	  state.length -= n;
	
	  // If we have nothing in the buffer, then we want to know
	  // as soon as we *do* get something into the buffer.
	  if (state.length === 0 && !state.ended) state.needReadable = true;
	
	  // If we tried to read() past the EOF, then emit end on the next tick.
	  if (nOrig !== n && state.ended && state.length === 0) endReadable(this);
	
	  if (ret !== null) this.emit('data', ret);
	
	  return ret;
	};
	
	function chunkInvalid(state, chunk) {
	  var er = null;
	  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
	    er = new TypeError('Invalid non-string/buffer chunk');
	  }
	  return er;
	}
	
	function onEofChunk(stream, state) {
	  if (state.ended) return;
	  if (state.decoder) {
	    var chunk = state.decoder.end();
	    if (chunk && chunk.length) {
	      state.buffer.push(chunk);
	      state.length += state.objectMode ? 1 : chunk.length;
	    }
	  }
	  state.ended = true;
	
	  // emit 'readable' now to make sure it gets picked up.
	  emitReadable(stream);
	}
	
	// Don't emit readable right away in sync mode, because this can trigger
	// another read() call => stack overflow.  This way, it might trigger
	// a nextTick recursion warning, but that's not so bad.
	function emitReadable(stream) {
	  var state = stream._readableState;
	  state.needReadable = false;
	  if (!state.emittedReadable) {
	    debug('emitReadable', state.flowing);
	    state.emittedReadable = true;
	    if (state.sync) processNextTick(emitReadable_, stream);else emitReadable_(stream);
	  }
	}
	
	function emitReadable_(stream) {
	  debug('emit readable');
	  stream.emit('readable');
	  flow(stream);
	}
	
	// at this point, the user has presumably seen the 'readable' event,
	// and called read() to consume some data.  that may have triggered
	// in turn another _read(n) call, in which case reading = true if
	// it's in progress.
	// However, if we're not ended, or reading, and the length < hwm,
	// then go ahead and try to read some more preemptively.
	function maybeReadMore(stream, state) {
	  if (!state.readingMore) {
	    state.readingMore = true;
	    processNextTick(maybeReadMore_, stream, state);
	  }
	}
	
	function maybeReadMore_(stream, state) {
	  var len = state.length;
	  while (!state.reading && !state.flowing && !state.ended && state.length < state.highWaterMark) {
	    debug('maybeReadMore read 0');
	    stream.read(0);
	    if (len === state.length)
	      // didn't get any data, stop spinning.
	      break;else len = state.length;
	  }
	  state.readingMore = false;
	}
	
	// abstract method.  to be overridden in specific implementation classes.
	// call cb(er, data) where data is <= n in length.
	// for virtual (non-string, non-buffer) streams, "length" is somewhat
	// arbitrary, and perhaps not very meaningful.
	Readable.prototype._read = function (n) {
	  this.emit('error', new Error('not implemented'));
	};
	
	Readable.prototype.pipe = function (dest, pipeOpts) {
	  var src = this;
	  var state = this._readableState;
	
	  switch (state.pipesCount) {
	    case 0:
	      state.pipes = dest;
	      break;
	    case 1:
	      state.pipes = [state.pipes, dest];
	      break;
	    default:
	      state.pipes.push(dest);
	      break;
	  }
	  state.pipesCount += 1;
	  debug('pipe count=%d opts=%j', state.pipesCount, pipeOpts);
	
	  var doEnd = (!pipeOpts || pipeOpts.end !== false) && dest !== process.stdout && dest !== process.stderr;
	
	  var endFn = doEnd ? onend : cleanup;
	  if (state.endEmitted) processNextTick(endFn);else src.once('end', endFn);
	
	  dest.on('unpipe', onunpipe);
	  function onunpipe(readable) {
	    debug('onunpipe');
	    if (readable === src) {
	      cleanup();
	    }
	  }
	
	  function onend() {
	    debug('onend');
	    dest.end();
	  }
	
	  // when the dest drains, it reduces the awaitDrain counter
	  // on the source.  This would be more elegant with a .once()
	  // handler in flow(), but adding and removing repeatedly is
	  // too slow.
	  var ondrain = pipeOnDrain(src);
	  dest.on('drain', ondrain);
	
	  var cleanedUp = false;
	  function cleanup() {
	    debug('cleanup');
	    // cleanup event handlers once the pipe is broken
	    dest.removeListener('close', onclose);
	    dest.removeListener('finish', onfinish);
	    dest.removeListener('drain', ondrain);
	    dest.removeListener('error', onerror);
	    dest.removeListener('unpipe', onunpipe);
	    src.removeListener('end', onend);
	    src.removeListener('end', cleanup);
	    src.removeListener('data', ondata);
	
	    cleanedUp = true;
	
	    // if the reader is waiting for a drain event from this
	    // specific writer, then it would cause it to never start
	    // flowing again.
	    // So, if this is awaiting a drain, then we just call it now.
	    // If we don't know, then assume that we are waiting for one.
	    if (state.awaitDrain && (!dest._writableState || dest._writableState.needDrain)) ondrain();
	  }
	
	  src.on('data', ondata);
	  function ondata(chunk) {
	    debug('ondata');
	    var ret = dest.write(chunk);
	    if (false === ret) {
	      // If the user unpiped during `dest.write()`, it is possible
	      // to get stuck in a permanently paused state if that write
	      // also returned false.
	      if (state.pipesCount === 1 && state.pipes[0] === dest && src.listenerCount('data') === 1 && !cleanedUp) {
	        debug('false write response, pause', src._readableState.awaitDrain);
	        src._readableState.awaitDrain++;
	      }
	      src.pause();
	    }
	  }
	
	  // if the dest has an error, then stop piping into it.
	  // however, don't suppress the throwing behavior for this.
	  function onerror(er) {
	    debug('onerror', er);
	    unpipe();
	    dest.removeListener('error', onerror);
	    if (EElistenerCount(dest, 'error') === 0) dest.emit('error', er);
	  }
	  // This is a brutally ugly hack to make sure that our error handler
	  // is attached before any userland ones.  NEVER DO THIS.
	  if (!dest._events || !dest._events.error) dest.on('error', onerror);else if (isArray(dest._events.error)) dest._events.error.unshift(onerror);else dest._events.error = [onerror, dest._events.error];
	
	  // Both close and finish should trigger unpipe, but only once.
	  function onclose() {
	    dest.removeListener('finish', onfinish);
	    unpipe();
	  }
	  dest.once('close', onclose);
	  function onfinish() {
	    debug('onfinish');
	    dest.removeListener('close', onclose);
	    unpipe();
	  }
	  dest.once('finish', onfinish);
	
	  function unpipe() {
	    debug('unpipe');
	    src.unpipe(dest);
	  }
	
	  // tell the dest that it's being piped to
	  dest.emit('pipe', src);
	
	  // start the flow if it hasn't been started already.
	  if (!state.flowing) {
	    debug('pipe resume');
	    src.resume();
	  }
	
	  return dest;
	};
	
	function pipeOnDrain(src) {
	  return function () {
	    var state = src._readableState;
	    debug('pipeOnDrain', state.awaitDrain);
	    if (state.awaitDrain) state.awaitDrain--;
	    if (state.awaitDrain === 0 && EElistenerCount(src, 'data')) {
	      state.flowing = true;
	      flow(src);
	    }
	  };
	}
	
	Readable.prototype.unpipe = function (dest) {
	  var state = this._readableState;
	
	  // if we're not piping anywhere, then do nothing.
	  if (state.pipesCount === 0) return this;
	
	  // just one destination.  most common case.
	  if (state.pipesCount === 1) {
	    // passed in one, but it's not the right one.
	    if (dest && dest !== state.pipes) return this;
	
	    if (!dest) dest = state.pipes;
	
	    // got a match.
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	    if (dest) dest.emit('unpipe', this);
	    return this;
	  }
	
	  // slow case. multiple pipe destinations.
	
	  if (!dest) {
	    // remove all.
	    var dests = state.pipes;
	    var len = state.pipesCount;
	    state.pipes = null;
	    state.pipesCount = 0;
	    state.flowing = false;
	
	    for (var _i = 0; _i < len; _i++) {
	      dests[_i].emit('unpipe', this);
	    }return this;
	  }
	
	  // try to find the right one.
	  var i = indexOf(state.pipes, dest);
	  if (i === -1) return this;
	
	  state.pipes.splice(i, 1);
	  state.pipesCount -= 1;
	  if (state.pipesCount === 1) state.pipes = state.pipes[0];
	
	  dest.emit('unpipe', this);
	
	  return this;
	};
	
	// set up data events if they are asked for
	// Ensure readable listeners eventually get something
	Readable.prototype.on = function (ev, fn) {
	  var res = Stream.prototype.on.call(this, ev, fn);
	
	  // If listening to data, and it has not explicitly been paused,
	  // then call resume to start the flow of data on the next tick.
	  if (ev === 'data' && false !== this._readableState.flowing) {
	    this.resume();
	  }
	
	  if (ev === 'readable' && !this._readableState.endEmitted) {
	    var state = this._readableState;
	    if (!state.readableListening) {
	      state.readableListening = true;
	      state.emittedReadable = false;
	      state.needReadable = true;
	      if (!state.reading) {
	        processNextTick(nReadingNextTick, this);
	      } else if (state.length) {
	        emitReadable(this, state);
	      }
	    }
	  }
	
	  return res;
	};
	Readable.prototype.addListener = Readable.prototype.on;
	
	function nReadingNextTick(self) {
	  debug('readable nexttick read 0');
	  self.read(0);
	}
	
	// pause() and resume() are remnants of the legacy readable stream API
	// If the user uses them, then switch into old mode.
	Readable.prototype.resume = function () {
	  var state = this._readableState;
	  if (!state.flowing) {
	    debug('resume');
	    state.flowing = true;
	    resume(this, state);
	  }
	  return this;
	};
	
	function resume(stream, state) {
	  if (!state.resumeScheduled) {
	    state.resumeScheduled = true;
	    processNextTick(resume_, stream, state);
	  }
	}
	
	function resume_(stream, state) {
	  if (!state.reading) {
	    debug('resume read 0');
	    stream.read(0);
	  }
	
	  state.resumeScheduled = false;
	  stream.emit('resume');
	  flow(stream);
	  if (state.flowing && !state.reading) stream.read(0);
	}
	
	Readable.prototype.pause = function () {
	  debug('call pause flowing=%j', this._readableState.flowing);
	  if (false !== this._readableState.flowing) {
	    debug('pause');
	    this._readableState.flowing = false;
	    this.emit('pause');
	  }
	  return this;
	};
	
	function flow(stream) {
	  var state = stream._readableState;
	  debug('flow', state.flowing);
	  if (state.flowing) {
	    do {
	      var chunk = stream.read();
	    } while (null !== chunk && state.flowing);
	  }
	}
	
	// wrap an old-style stream as the async data source.
	// This is *not* part of the readable stream interface.
	// It is an ugly unfortunate mess of history.
	Readable.prototype.wrap = function (stream) {
	  var state = this._readableState;
	  var paused = false;
	
	  var self = this;
	  stream.on('end', function () {
	    debug('wrapped end');
	    if (state.decoder && !state.ended) {
	      var chunk = state.decoder.end();
	      if (chunk && chunk.length) self.push(chunk);
	    }
	
	    self.push(null);
	  });
	
	  stream.on('data', function (chunk) {
	    debug('wrapped data');
	    if (state.decoder) chunk = state.decoder.write(chunk);
	
	    // don't skip over falsy values in objectMode
	    if (state.objectMode && (chunk === null || chunk === undefined)) return;else if (!state.objectMode && (!chunk || !chunk.length)) return;
	
	    var ret = self.push(chunk);
	    if (!ret) {
	      paused = true;
	      stream.pause();
	    }
	  });
	
	  // proxy all the other methods.
	  // important when wrapping filters and duplexes.
	  for (var i in stream) {
	    if (this[i] === undefined && typeof stream[i] === 'function') {
	      this[i] = function (method) {
	        return function () {
	          return stream[method].apply(stream, arguments);
	        };
	      }(i);
	    }
	  }
	
	  // proxy certain important events.
	  var events = ['error', 'close', 'destroy', 'pause', 'resume'];
	  forEach(events, function (ev) {
	    stream.on(ev, self.emit.bind(self, ev));
	  });
	
	  // when we try to consume some more bytes, simply unpause the
	  // underlying stream.
	  self._read = function (n) {
	    debug('wrapped _read', n);
	    if (paused) {
	      paused = false;
	      stream.resume();
	    }
	  };
	
	  return self;
	};
	
	// exposed for testing purposes only.
	Readable._fromList = fromList;
	
	// Pluck off n bytes from an array of buffers.
	// Length is the combined lengths of all the buffers in the list.
	function fromList(n, state) {
	  var list = state.buffer;
	  var length = state.length;
	  var stringMode = !!state.decoder;
	  var objectMode = !!state.objectMode;
	  var ret;
	
	  // nothing in the list, definitely empty.
	  if (list.length === 0) return null;
	
	  if (length === 0) ret = null;else if (objectMode) ret = list.shift();else if (!n || n >= length) {
	    // read it all, truncate the array.
	    if (stringMode) ret = list.join('');else if (list.length === 1) ret = list[0];else ret = Buffer.concat(list, length);
	    list.length = 0;
	  } else {
	    // read just some of it.
	    if (n < list[0].length) {
	      // just take a part of the first list item.
	      // slice is the same for buffers and strings.
	      var buf = list[0];
	      ret = buf.slice(0, n);
	      list[0] = buf.slice(n);
	    } else if (n === list[0].length) {
	      // first list is a perfect match
	      ret = list.shift();
	    } else {
	      // complex case.
	      // we have enough to cover it, but it spans past the first buffer.
	      if (stringMode) ret = '';else ret = new Buffer(n);
	
	      var c = 0;
	      for (var i = 0, l = list.length; i < l && c < n; i++) {
	        var buf = list[0];
	        var cpy = Math.min(n - c, buf.length);
	
	        if (stringMode) ret += buf.slice(0, cpy);else buf.copy(ret, c, 0, cpy);
	
	        if (cpy < buf.length) list[0] = buf.slice(cpy);else list.shift();
	
	        c += cpy;
	      }
	    }
	  }
	
	  return ret;
	}
	
	function endReadable(stream) {
	  var state = stream._readableState;
	
	  // If we get here before consuming all the bytes, then that is a
	  // bug in node.  Should never happen.
	  if (state.length > 0) throw new Error('endReadable called on non-empty stream');
	
	  if (!state.endEmitted) {
	    state.ended = true;
	    processNextTick(endReadableNT, state, stream);
	  }
	}
	
	function endReadableNT(state, stream) {
	  // Check that we didn't get one last unshift.
	  if (!state.endEmitted && state.length === 0) {
	    state.endEmitted = true;
	    stream.readable = false;
	    stream.emit('end');
	  }
	}
	
	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}
	
	function indexOf(xs, x) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    if (xs[i] === x) return i;
	  }
	  return -1;
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147)))

/***/ },
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process) {'use strict';
	
	if (!process.version ||
	    process.version.indexOf('v0.') === 0 ||
	    process.version.indexOf('v1.') === 0 && process.version.indexOf('v1.8.') !== 0) {
	  module.exports = nextTick;
	} else {
	  module.exports = process.nextTick;
	}
	
	function nextTick(fn, arg1, arg2, arg3) {
	  if (typeof fn !== 'function') {
	    throw new TypeError('"callback" argument must be a function');
	  }
	  var len = arguments.length;
	  var args, i;
	  switch (len) {
	  case 0:
	  case 1:
	    return process.nextTick(fn);
	  case 2:
	    return process.nextTick(function afterTickOne() {
	      fn.call(null, arg1);
	    });
	  case 3:
	    return process.nextTick(function afterTickTwo() {
	      fn.call(null, arg1, arg2);
	    });
	  case 4:
	    return process.nextTick(function afterTickThree() {
	      fn.call(null, arg1, arg2, arg3);
	    });
	  default:
	    args = new Array(len - 1);
	    i = 0;
	    while (i < args.length) {
	      args[i++] = arguments[i];
	    }
	    return process.nextTick(function afterTick() {
	      fn.apply(null, args);
	    });
	  }
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147)))

/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(81);

/***/ },
/* 164 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	// a duplex stream is just a stream that is both readable and writable.
	// Since JS doesn't have multiple prototypal inheritance, this class
	// prototypally inherits from Readable, and then parasitically from
	// Writable.
	
	'use strict';
	
	/*<replacement>*/
	
	var objectKeys = Object.keys || function (obj) {
	  var keys = [];
	  for (var key in obj) {
	    keys.push(key);
	  }return keys;
	};
	/*</replacement>*/
	
	module.exports = Duplex;
	
	/*<replacement>*/
	var processNextTick = __webpack_require__(162);
	/*</replacement>*/
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	var Readable = __webpack_require__(161);
	var Writable = __webpack_require__(166);
	
	util.inherits(Duplex, Readable);
	
	var keys = objectKeys(Writable.prototype);
	for (var v = 0; v < keys.length; v++) {
	  var method = keys[v];
	  if (!Duplex.prototype[method]) Duplex.prototype[method] = Writable.prototype[method];
	}
	
	function Duplex(options) {
	  if (!(this instanceof Duplex)) return new Duplex(options);
	
	  Readable.call(this, options);
	  Writable.call(this, options);
	
	  if (options && options.readable === false) this.readable = false;
	
	  if (options && options.writable === false) this.writable = false;
	
	  this.allowHalfOpen = true;
	  if (options && options.allowHalfOpen === false) this.allowHalfOpen = false;
	
	  this.once('end', onend);
	}
	
	// the no-half-open enforcer
	function onend() {
	  // if we allow half-open state, or if the writable side ended,
	  // then we're ok.
	  if (this.allowHalfOpen || this._writableState.ended) return;
	
	  // no more data can be written.
	  // But allow more writes to happen in this tick.
	  processNextTick(onEndNT, this);
	}
	
	function onEndNT(self) {
	  self.end();
	}
	
	function forEach(xs, f) {
	  for (var i = 0, l = xs.length; i < l; i++) {
	    f(xs[i], i);
	  }
	}

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(process, setImmediate) {// A bit simpler than readable streams.
	// Implement an async ._write(chunk, encoding, cb), and it'll handle all
	// the drain event emission and buffering.
	
	'use strict';
	
	module.exports = Writable;
	
	/*<replacement>*/
	var processNextTick = __webpack_require__(162);
	/*</replacement>*/
	
	/*<replacement>*/
	var asyncWrite = !process.browser && ['v0.10', 'v0.9.'].indexOf(process.version.slice(0, 5)) > -1 ? setImmediate : processNextTick;
	/*</replacement>*/
	
	/*<replacement>*/
	var Buffer = __webpack_require__(140).Buffer;
	/*</replacement>*/
	
	Writable.WritableState = WritableState;
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	/*<replacement>*/
	var internalUtil = {
	  deprecate: __webpack_require__(168)
	};
	/*</replacement>*/
	
	/*<replacement>*/
	var Stream;
	(function () {
	  try {
	    Stream = __webpack_require__(143);
	  } catch (_) {} finally {
	    if (!Stream) Stream = __webpack_require__(144).EventEmitter;
	  }
	})();
	/*</replacement>*/
	
	var Buffer = __webpack_require__(140).Buffer;
	
	util.inherits(Writable, Stream);
	
	function nop() {}
	
	function WriteReq(chunk, encoding, cb) {
	  this.chunk = chunk;
	  this.encoding = encoding;
	  this.callback = cb;
	  this.next = null;
	}
	
	var Duplex;
	function WritableState(options, stream) {
	  Duplex = Duplex || __webpack_require__(165);
	
	  options = options || {};
	
	  // object stream flag to indicate whether or not this stream
	  // contains buffers or objects.
	  this.objectMode = !!options.objectMode;
	
	  if (stream instanceof Duplex) this.objectMode = this.objectMode || !!options.writableObjectMode;
	
	  // the point at which write() starts returning false
	  // Note: 0 is a valid value, means that we always return false if
	  // the entire buffer is not flushed immediately on write()
	  var hwm = options.highWaterMark;
	  var defaultHwm = this.objectMode ? 16 : 16 * 1024;
	  this.highWaterMark = hwm || hwm === 0 ? hwm : defaultHwm;
	
	  // cast to ints.
	  this.highWaterMark = ~ ~this.highWaterMark;
	
	  this.needDrain = false;
	  // at the start of calling end()
	  this.ending = false;
	  // when end() has been called, and returned
	  this.ended = false;
	  // when 'finish' is emitted
	  this.finished = false;
	
	  // should we decode strings into buffers before passing to _write?
	  // this is here so that some node-core streams can optimize string
	  // handling at a lower level.
	  var noDecode = options.decodeStrings === false;
	  this.decodeStrings = !noDecode;
	
	  // Crypto is kind of old and crusty.  Historically, its default string
	  // encoding is 'binary' so we have to make this configurable.
	  // Everything else in the universe uses 'utf8', though.
	  this.defaultEncoding = options.defaultEncoding || 'utf8';
	
	  // not an actual buffer we keep track of, but a measurement
	  // of how much we're waiting to get pushed to some underlying
	  // socket or file.
	  this.length = 0;
	
	  // a flag to see when we're in the middle of a write.
	  this.writing = false;
	
	  // when true all writes will be buffered until .uncork() call
	  this.corked = 0;
	
	  // a flag to be able to tell if the onwrite cb is called immediately,
	  // or on a later tick.  We set this to true at first, because any
	  // actions that shouldn't happen until "later" should generally also
	  // not happen before the first write call.
	  this.sync = true;
	
	  // a flag to know if we're processing previously buffered items, which
	  // may call the _write() callback in the same tick, so that we don't
	  // end up in an overlapped onwrite situation.
	  this.bufferProcessing = false;
	
	  // the callback that's passed to _write(chunk,cb)
	  this.onwrite = function (er) {
	    onwrite(stream, er);
	  };
	
	  // the callback that the user supplies to write(chunk,encoding,cb)
	  this.writecb = null;
	
	  // the amount that is being written when _write is called.
	  this.writelen = 0;
	
	  this.bufferedRequest = null;
	  this.lastBufferedRequest = null;
	
	  // number of pending user-supplied write callbacks
	  // this must be 0 before 'finish' can be emitted
	  this.pendingcb = 0;
	
	  // emit prefinish if the only thing we're waiting for is _write cbs
	  // This is relevant for synchronous Transform streams
	  this.prefinished = false;
	
	  // True if the error was already emitted and should not be thrown again
	  this.errorEmitted = false;
	
	  // count buffered requests
	  this.bufferedRequestCount = 0;
	
	  // create the two objects needed to store the corked requests
	  // they are not a linked list, as no new elements are inserted in there
	  this.corkedRequestsFree = new CorkedRequest(this);
	  this.corkedRequestsFree.next = new CorkedRequest(this);
	}
	
	WritableState.prototype.getBuffer = function writableStateGetBuffer() {
	  var current = this.bufferedRequest;
	  var out = [];
	  while (current) {
	    out.push(current);
	    current = current.next;
	  }
	  return out;
	};
	
	(function () {
	  try {
	    Object.defineProperty(WritableState.prototype, 'buffer', {
	      get: internalUtil.deprecate(function () {
	        return this.getBuffer();
	      }, '_writableState.buffer is deprecated. Use _writableState.getBuffer ' + 'instead.')
	    });
	  } catch (_) {}
	})();
	
	var Duplex;
	function Writable(options) {
	  Duplex = Duplex || __webpack_require__(165);
	
	  // Writable ctor is applied to Duplexes, though they're not
	  // instanceof Writable, they're instanceof Readable.
	  if (!(this instanceof Writable) && !(this instanceof Duplex)) return new Writable(options);
	
	  this._writableState = new WritableState(options, this);
	
	  // legacy.
	  this.writable = true;
	
	  if (options) {
	    if (typeof options.write === 'function') this._write = options.write;
	
	    if (typeof options.writev === 'function') this._writev = options.writev;
	  }
	
	  Stream.call(this);
	}
	
	// Otherwise people can pipe Writable streams, which is just wrong.
	Writable.prototype.pipe = function () {
	  this.emit('error', new Error('Cannot pipe. Not readable.'));
	};
	
	function writeAfterEnd(stream, cb) {
	  var er = new Error('write after end');
	  // TODO: defer error events consistently everywhere, not just the cb
	  stream.emit('error', er);
	  processNextTick(cb, er);
	}
	
	// If we get something that is not a buffer, string, null, or undefined,
	// and we're not in objectMode, then that's an error.
	// Otherwise stream chunks are all considered to be of length=1, and the
	// watermarks determine how many objects to keep in the buffer, rather than
	// how many bytes or characters.
	function validChunk(stream, state, chunk, cb) {
	  var valid = true;
	
	  if (!Buffer.isBuffer(chunk) && typeof chunk !== 'string' && chunk !== null && chunk !== undefined && !state.objectMode) {
	    var er = new TypeError('Invalid non-string/buffer chunk');
	    stream.emit('error', er);
	    processNextTick(cb, er);
	    valid = false;
	  }
	  return valid;
	}
	
	Writable.prototype.write = function (chunk, encoding, cb) {
	  var state = this._writableState;
	  var ret = false;
	
	  if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }
	
	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';else if (!encoding) encoding = state.defaultEncoding;
	
	  if (typeof cb !== 'function') cb = nop;
	
	  if (state.ended) writeAfterEnd(this, cb);else if (validChunk(this, state, chunk, cb)) {
	    state.pendingcb++;
	    ret = writeOrBuffer(this, state, chunk, encoding, cb);
	  }
	
	  return ret;
	};
	
	Writable.prototype.cork = function () {
	  var state = this._writableState;
	
	  state.corked++;
	};
	
	Writable.prototype.uncork = function () {
	  var state = this._writableState;
	
	  if (state.corked) {
	    state.corked--;
	
	    if (!state.writing && !state.corked && !state.finished && !state.bufferProcessing && state.bufferedRequest) clearBuffer(this, state);
	  }
	};
	
	Writable.prototype.setDefaultEncoding = function setDefaultEncoding(encoding) {
	  // node::ParseEncoding() requires lower case.
	  if (typeof encoding === 'string') encoding = encoding.toLowerCase();
	  if (!(['hex', 'utf8', 'utf-8', 'ascii', 'binary', 'base64', 'ucs2', 'ucs-2', 'utf16le', 'utf-16le', 'raw'].indexOf((encoding + '').toLowerCase()) > -1)) throw new TypeError('Unknown encoding: ' + encoding);
	  this._writableState.defaultEncoding = encoding;
	};
	
	function decodeChunk(state, chunk, encoding) {
	  if (!state.objectMode && state.decodeStrings !== false && typeof chunk === 'string') {
	    chunk = new Buffer(chunk, encoding);
	  }
	  return chunk;
	}
	
	// if we're already writing something, then just put this
	// in the queue, and wait our turn.  Otherwise, call _write
	// If we return false, then we need a drain event, so set that flag.
	function writeOrBuffer(stream, state, chunk, encoding, cb) {
	  chunk = decodeChunk(state, chunk, encoding);
	
	  if (Buffer.isBuffer(chunk)) encoding = 'buffer';
	  var len = state.objectMode ? 1 : chunk.length;
	
	  state.length += len;
	
	  var ret = state.length < state.highWaterMark;
	  // we must ensure that previous needDrain will not be reset to false.
	  if (!ret) state.needDrain = true;
	
	  if (state.writing || state.corked) {
	    var last = state.lastBufferedRequest;
	    state.lastBufferedRequest = new WriteReq(chunk, encoding, cb);
	    if (last) {
	      last.next = state.lastBufferedRequest;
	    } else {
	      state.bufferedRequest = state.lastBufferedRequest;
	    }
	    state.bufferedRequestCount += 1;
	  } else {
	    doWrite(stream, state, false, len, chunk, encoding, cb);
	  }
	
	  return ret;
	}
	
	function doWrite(stream, state, writev, len, chunk, encoding, cb) {
	  state.writelen = len;
	  state.writecb = cb;
	  state.writing = true;
	  state.sync = true;
	  if (writev) stream._writev(chunk, state.onwrite);else stream._write(chunk, encoding, state.onwrite);
	  state.sync = false;
	}
	
	function onwriteError(stream, state, sync, er, cb) {
	  --state.pendingcb;
	  if (sync) processNextTick(cb, er);else cb(er);
	
	  stream._writableState.errorEmitted = true;
	  stream.emit('error', er);
	}
	
	function onwriteStateUpdate(state) {
	  state.writing = false;
	  state.writecb = null;
	  state.length -= state.writelen;
	  state.writelen = 0;
	}
	
	function onwrite(stream, er) {
	  var state = stream._writableState;
	  var sync = state.sync;
	  var cb = state.writecb;
	
	  onwriteStateUpdate(state);
	
	  if (er) onwriteError(stream, state, sync, er, cb);else {
	    // Check if we're actually ready to finish, but don't emit yet
	    var finished = needFinish(state);
	
	    if (!finished && !state.corked && !state.bufferProcessing && state.bufferedRequest) {
	      clearBuffer(stream, state);
	    }
	
	    if (sync) {
	      /*<replacement>*/
	      asyncWrite(afterWrite, stream, state, finished, cb);
	      /*</replacement>*/
	    } else {
	        afterWrite(stream, state, finished, cb);
	      }
	  }
	}
	
	function afterWrite(stream, state, finished, cb) {
	  if (!finished) onwriteDrain(stream, state);
	  state.pendingcb--;
	  cb();
	  finishMaybe(stream, state);
	}
	
	// Must force callback to be called on nextTick, so that we don't
	// emit 'drain' before the write() consumer gets the 'false' return
	// value, and has a chance to attach a 'drain' listener.
	function onwriteDrain(stream, state) {
	  if (state.length === 0 && state.needDrain) {
	    state.needDrain = false;
	    stream.emit('drain');
	  }
	}
	
	// if there's something in the buffer waiting, then process it
	function clearBuffer(stream, state) {
	  state.bufferProcessing = true;
	  var entry = state.bufferedRequest;
	
	  if (stream._writev && entry && entry.next) {
	    // Fast case, write everything using _writev()
	    var l = state.bufferedRequestCount;
	    var buffer = new Array(l);
	    var holder = state.corkedRequestsFree;
	    holder.entry = entry;
	
	    var count = 0;
	    while (entry) {
	      buffer[count] = entry;
	      entry = entry.next;
	      count += 1;
	    }
	
	    doWrite(stream, state, true, state.length, buffer, '', holder.finish);
	
	    // doWrite is always async, defer these to save a bit of time
	    // as the hot path ends with doWrite
	    state.pendingcb++;
	    state.lastBufferedRequest = null;
	    state.corkedRequestsFree = holder.next;
	    holder.next = null;
	  } else {
	    // Slow case, write chunks one-by-one
	    while (entry) {
	      var chunk = entry.chunk;
	      var encoding = entry.encoding;
	      var cb = entry.callback;
	      var len = state.objectMode ? 1 : chunk.length;
	
	      doWrite(stream, state, false, len, chunk, encoding, cb);
	      entry = entry.next;
	      // if we didn't call the onwrite immediately, then
	      // it means that we need to wait until it does.
	      // also, that means that the chunk and cb are currently
	      // being processed, so move the buffer counter past them.
	      if (state.writing) {
	        break;
	      }
	    }
	
	    if (entry === null) state.lastBufferedRequest = null;
	  }
	
	  state.bufferedRequestCount = 0;
	  state.bufferedRequest = entry;
	  state.bufferProcessing = false;
	}
	
	Writable.prototype._write = function (chunk, encoding, cb) {
	  cb(new Error('not implemented'));
	};
	
	Writable.prototype._writev = null;
	
	Writable.prototype.end = function (chunk, encoding, cb) {
	  var state = this._writableState;
	
	  if (typeof chunk === 'function') {
	    cb = chunk;
	    chunk = null;
	    encoding = null;
	  } else if (typeof encoding === 'function') {
	    cb = encoding;
	    encoding = null;
	  }
	
	  if (chunk !== null && chunk !== undefined) this.write(chunk, encoding);
	
	  // .end() fully uncorks
	  if (state.corked) {
	    state.corked = 1;
	    this.uncork();
	  }
	
	  // ignore unnecessary end() calls.
	  if (!state.ending && !state.finished) endWritable(this, state, cb);
	};
	
	function needFinish(state) {
	  return state.ending && state.length === 0 && state.bufferedRequest === null && !state.finished && !state.writing;
	}
	
	function prefinish(stream, state) {
	  if (!state.prefinished) {
	    state.prefinished = true;
	    stream.emit('prefinish');
	  }
	}
	
	function finishMaybe(stream, state) {
	  var need = needFinish(state);
	  if (need) {
	    if (state.pendingcb === 0) {
	      prefinish(stream, state);
	      state.finished = true;
	      stream.emit('finish');
	    } else {
	      prefinish(stream, state);
	    }
	  }
	  return need;
	}
	
	function endWritable(stream, state, cb) {
	  state.ending = true;
	  finishMaybe(stream, state);
	  if (cb) {
	    if (state.finished) processNextTick(cb);else stream.once('finish', cb);
	  }
	  state.ended = true;
	  stream.writable = false;
	}
	
	// It seems a linked list but it is not
	// there will be only 2 of these for each stream
	function CorkedRequest(state) {
	  var _this = this;
	
	  this.next = null;
	  this.entry = null;
	
	  this.finish = function (err) {
	    var entry = _this.entry;
	    _this.entry = null;
	    while (entry) {
	      var cb = entry.callback;
	      state.pendingcb--;
	      cb(err);
	      entry = entry.next;
	    }
	    if (state.corkedRequestsFree) {
	      state.corkedRequestsFree.next = _this;
	    } else {
	      state.corkedRequestsFree = _this;
	    }
	  };
	}
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147), __webpack_require__(167).setImmediate))

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(setImmediate, clearImmediate) {var nextTick = __webpack_require__(147).nextTick;
	var apply = Function.prototype.apply;
	var slice = Array.prototype.slice;
	var immediateIds = {};
	var nextImmediateId = 0;
	
	// DOM APIs, for completeness
	
	exports.setTimeout = function() {
	  return new Timeout(apply.call(setTimeout, window, arguments), clearTimeout);
	};
	exports.setInterval = function() {
	  return new Timeout(apply.call(setInterval, window, arguments), clearInterval);
	};
	exports.clearTimeout =
	exports.clearInterval = function(timeout) { timeout.close(); };
	
	function Timeout(id, clearFn) {
	  this._id = id;
	  this._clearFn = clearFn;
	}
	Timeout.prototype.unref = Timeout.prototype.ref = function() {};
	Timeout.prototype.close = function() {
	  this._clearFn.call(window, this._id);
	};
	
	// Does not start the time, just sets up the members needed.
	exports.enroll = function(item, msecs) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = msecs;
	};
	
	exports.unenroll = function(item) {
	  clearTimeout(item._idleTimeoutId);
	  item._idleTimeout = -1;
	};
	
	exports._unrefActive = exports.active = function(item) {
	  clearTimeout(item._idleTimeoutId);
	
	  var msecs = item._idleTimeout;
	  if (msecs >= 0) {
	    item._idleTimeoutId = setTimeout(function onTimeout() {
	      if (item._onTimeout)
	        item._onTimeout();
	    }, msecs);
	  }
	};
	
	// That's not how node.js implements it but the exposed api is the same.
	exports.setImmediate = typeof setImmediate === "function" ? setImmediate : function(fn) {
	  var id = nextImmediateId++;
	  var args = arguments.length < 2 ? false : slice.call(arguments, 1);
	
	  immediateIds[id] = true;
	
	  nextTick(function onNextTick() {
	    if (immediateIds[id]) {
	      // fn.call() is faster so we optimize for the common use-case
	      // @see http://jsperf.com/call-apply-segu
	      if (args) {
	        fn.apply(null, args);
	      } else {
	        fn.call(null);
	      }
	      // Prevent ids from leaking
	      exports.clearImmediate(id);
	    }
	  });
	
	  return id;
	};
	
	exports.clearImmediate = typeof clearImmediate === "function" ? clearImmediate : function(id) {
	  delete immediateIds[id];
	};
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(167).setImmediate, __webpack_require__(167).clearImmediate))

/***/ },
/* 168 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {
	/**
	 * Module exports.
	 */
	
	module.exports = deprecate;
	
	/**
	 * Mark that a method should not be used.
	 * Returns a modified function which warns once by default.
	 *
	 * If `localStorage.noDeprecation = true` is set, then it is a no-op.
	 *
	 * If `localStorage.throwDeprecation = true` is set, then deprecated functions
	 * will throw an Error when invoked.
	 *
	 * If `localStorage.traceDeprecation = true` is set, then deprecated functions
	 * will invoke `console.trace()` instead of `console.error()`.
	 *
	 * @param {Function} fn - the function to deprecate
	 * @param {String} msg - the string to print to the console when `fn` is invoked
	 * @returns {Function} a new "deprecated" version of `fn`
	 * @api public
	 */
	
	function deprecate (fn, msg) {
	  if (config('noDeprecation')) {
	    return fn;
	  }
	
	  var warned = false;
	  function deprecated() {
	    if (!warned) {
	      if (config('throwDeprecation')) {
	        throw new Error(msg);
	      } else if (config('traceDeprecation')) {
	        console.trace(msg);
	      } else {
	        console.warn(msg);
	      }
	      warned = true;
	    }
	    return fn.apply(this, arguments);
	  }
	
	  return deprecated;
	}
	
	/**
	 * Checks `localStorage` for boolean values for the given `name`.
	 *
	 * @param {String} name
	 * @returns {Boolean}
	 * @api private
	 */
	
	function config (name) {
	  // accessing global.localStorage can trigger a DOMException in sandboxed iframes
	  try {
	    if (!global.localStorage) return false;
	  } catch (_) {
	    return false;
	  }
	  var val = global.localStorage[name];
	  if (null == val) return false;
	  return String(val).toLowerCase() === 'true';
	}
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	// a transform stream is a readable/writable stream where you do
	// something with the data.  Sometimes it's called a "filter",
	// but that's not a great name for it, since that implies a thing where
	// some bits pass through, and others are simply ignored.  (That would
	// be a valid example of a transform, of course.)
	//
	// While the output is causally related to the input, it's not a
	// necessarily symmetric or synchronous transformation.  For example,
	// a zlib stream might take multiple plain-text writes(), and then
	// emit a single compressed chunk some time in the future.
	//
	// Here's how this works:
	//
	// The Transform stream has all the aspects of the readable and writable
	// stream classes.  When you write(chunk), that calls _write(chunk,cb)
	// internally, and returns false if there's a lot of pending writes
	// buffered up.  When you call read(), that calls _read(n) until
	// there's enough pending readable data buffered up.
	//
	// In a transform stream, the written data is placed in a buffer.  When
	// _read(n) is called, it transforms the queued up data, calling the
	// buffered _write cb's as it consumes chunks.  If consuming a single
	// written chunk would result in multiple output chunks, then the first
	// outputted bit calls the readcb, and subsequent chunks just go into
	// the read buffer, and will cause it to emit 'readable' if necessary.
	//
	// This way, back-pressure is actually determined by the reading side,
	// since _read has to be called to start processing a new chunk.  However,
	// a pathological inflate type of transform can cause excessive buffering
	// here.  For example, imagine a stream where every byte of input is
	// interpreted as an integer from 0-255, and then results in that many
	// bytes of output.  Writing the 4 bytes {ff,ff,ff,ff} would result in
	// 1kb of data being output.  In this case, you could write a very small
	// amount of input, and end up with a very large amount of output.  In
	// such a pathological inflating mechanism, there'd be no way to tell
	// the system to stop doing the transform.  A single 4MB write could
	// cause the system to run out of memory.
	//
	// However, even in such a pathological case, only a single written chunk
	// would be consumed, and then the rest would wait (un-transformed) until
	// the results of the previous transformed chunk were consumed.
	
	'use strict';
	
	module.exports = Transform;
	
	var Duplex = __webpack_require__(165);
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	util.inherits(Transform, Duplex);
	
	function TransformState(stream) {
	  this.afterTransform = function (er, data) {
	    return afterTransform(stream, er, data);
	  };
	
	  this.needTransform = false;
	  this.transforming = false;
	  this.writecb = null;
	  this.writechunk = null;
	  this.writeencoding = null;
	}
	
	function afterTransform(stream, er, data) {
	  var ts = stream._transformState;
	  ts.transforming = false;
	
	  var cb = ts.writecb;
	
	  if (!cb) return stream.emit('error', new Error('no writecb in Transform class'));
	
	  ts.writechunk = null;
	  ts.writecb = null;
	
	  if (data !== null && data !== undefined) stream.push(data);
	
	  cb(er);
	
	  var rs = stream._readableState;
	  rs.reading = false;
	  if (rs.needReadable || rs.length < rs.highWaterMark) {
	    stream._read(rs.highWaterMark);
	  }
	}
	
	function Transform(options) {
	  if (!(this instanceof Transform)) return new Transform(options);
	
	  Duplex.call(this, options);
	
	  this._transformState = new TransformState(this);
	
	  // when the writable side finishes, then flush out anything remaining.
	  var stream = this;
	
	  // start out asking for a readable event once data is transformed.
	  this._readableState.needReadable = true;
	
	  // we have implemented the _read method, and done the other things
	  // that Readable wants before the first _read call, so unset the
	  // sync guard flag.
	  this._readableState.sync = false;
	
	  if (options) {
	    if (typeof options.transform === 'function') this._transform = options.transform;
	
	    if (typeof options.flush === 'function') this._flush = options.flush;
	  }
	
	  this.once('prefinish', function () {
	    if (typeof this._flush === 'function') this._flush(function (er) {
	      done(stream, er);
	    });else done(stream);
	  });
	}
	
	Transform.prototype.push = function (chunk, encoding) {
	  this._transformState.needTransform = false;
	  return Duplex.prototype.push.call(this, chunk, encoding);
	};
	
	// This is the part where you do stuff!
	// override this function in implementation classes.
	// 'chunk' is an input chunk.
	//
	// Call `push(newChunk)` to pass along transformed output
	// to the readable side.  You may call 'push' zero or more times.
	//
	// Call `cb(err)` when you are done with this chunk.  If you pass
	// an error, then that'll put the hurt on the whole operation.  If you
	// never call cb(), then you'll never get another chunk.
	Transform.prototype._transform = function (chunk, encoding, cb) {
	  throw new Error('not implemented');
	};
	
	Transform.prototype._write = function (chunk, encoding, cb) {
	  var ts = this._transformState;
	  ts.writecb = cb;
	  ts.writechunk = chunk;
	  ts.writeencoding = encoding;
	  if (!ts.transforming) {
	    var rs = this._readableState;
	    if (ts.needTransform || rs.needReadable || rs.length < rs.highWaterMark) this._read(rs.highWaterMark);
	  }
	};
	
	// Doesn't matter what the args are here.
	// _transform does all the work.
	// That we got here means that the readable side wants more data.
	Transform.prototype._read = function (n) {
	  var ts = this._transformState;
	
	  if (ts.writechunk !== null && ts.writecb && !ts.transforming) {
	    ts.transforming = true;
	    this._transform(ts.writechunk, ts.writeencoding, ts.afterTransform);
	  } else {
	    // mark that we need a transform, so that any data that comes in
	    // will get processed, now that we've asked for it.
	    ts.needTransform = true;
	  }
	};
	
	function done(stream, er) {
	  if (er) return stream.emit('error', er);
	
	  // if there's nothing in the write buffer, then that means
	  // that nothing more will ever be provided
	  var ws = stream._writableState;
	  var ts = stream._transformState;
	
	  if (ws.length) throw new Error('calling transform done when ws.length != 0');
	
	  if (ts.transforming) throw new Error('calling transform done when still transforming');
	
	  return stream.push(null);
	}

/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	// a passthrough stream.
	// basically just the most minimal sort of Transform stream.
	// Every written chunk gets output as-is.
	
	'use strict';
	
	module.exports = PassThrough;
	
	var Transform = __webpack_require__(169);
	
	/*<replacement>*/
	var util = __webpack_require__(150);
	util.inherits = __webpack_require__(145);
	/*</replacement>*/
	
	util.inherits(PassThrough, Transform);
	
	function PassThrough(options) {
	  if (!(this instanceof PassThrough)) return new PassThrough(options);
	
	  Transform.call(this, options);
	}
	
	PassThrough.prototype._transform = function (chunk, encoding, cb) {
	  cb(null, chunk);
	};

/***/ },
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(88);

/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var utils = __webpack_require__(138);
	var support = __webpack_require__(139);
	// private property
	var _keyStr = "ABCDEFGHIJKLMNOPQRSTUVWXYZabcdefghijklmnopqrstuvwxyz0123456789+/=";
	
	
	// public method for encoding
	exports.encode = function(input) {
	    var output = [];
	    var chr1, chr2, chr3, enc1, enc2, enc3, enc4;
	    var i = 0, len = input.length, remainingBytes = len;
	
	    var isArray = utils.getTypeOf(input) !== "string";
	    while (i < input.length) {
	        remainingBytes = len - i;
	
	        if (!isArray) {
	            chr1 = input.charCodeAt(i++);
	            chr2 = i < len ? input.charCodeAt(i++) : 0;
	            chr3 = i < len ? input.charCodeAt(i++) : 0;
	        } else {
	            chr1 = input[i++];
	            chr2 = i < len ? input[i++] : 0;
	            chr3 = i < len ? input[i++] : 0;
	        }
	
	        enc1 = chr1 >> 2;
	        enc2 = ((chr1 & 3) << 4) | (chr2 >> 4);
	        enc3 = remainingBytes > 1 ? (((chr2 & 15) << 2) | (chr3 >> 6)) : 64;
	        enc4 = remainingBytes > 2 ? (chr3 & 63) : 64;
	
	        output.push(_keyStr.charAt(enc1) + _keyStr.charAt(enc2) + _keyStr.charAt(enc3) + _keyStr.charAt(enc4));
	
	    }
	
	    return output.join("");
	};
	
	// public method for decoding
	exports.decode = function(input) {
	    var chr1, chr2, chr3;
	    var enc1, enc2, enc3, enc4;
	    var i = 0, resultIndex = 0;
	
	    input = input.replace(/[^A-Za-z0-9\+\/\=]/g, "");
	
	    var totalLength = input.length * 3 / 4;
	    if(input.charAt(input.length - 1) === _keyStr.charAt(64)) {
	        totalLength--;
	    }
	    if(input.charAt(input.length - 2) === _keyStr.charAt(64)) {
	        totalLength--;
	    }
	    var output;
	    if (support.uint8array) {
	        output = new Uint8Array(totalLength);
	    } else {
	        output = new Array(totalLength);
	    }
	
	    while (i < input.length) {
	
	        enc1 = _keyStr.indexOf(input.charAt(i++));
	        enc2 = _keyStr.indexOf(input.charAt(i++));
	        enc3 = _keyStr.indexOf(input.charAt(i++));
	        enc4 = _keyStr.indexOf(input.charAt(i++));
	
	        chr1 = (enc1 << 2) | (enc2 >> 4);
	        chr2 = ((enc2 & 15) << 4) | (enc3 >> 2);
	        chr3 = ((enc3 & 3) << 6) | enc4;
	
	        output[resultIndex++] = chr1;
	
	        if (enc3 !== 64) {
	            output[resultIndex++] = chr2;
	        }
	        if (enc4 !== 64) {
	            output[resultIndex++] = chr3;
	        }
	
	    }
	
	    return output;
	};


/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	module.exports = {
	    /**
	     * True if this is running in Nodejs, will be undefined in a browser.
	     * In a browser, browserify won't include this file and the whole module
	     * will be resolved an empty object.
	     */
	    isNode : typeof Buffer !== "undefined",
	    /**
	     * Create a new nodejs Buffer.
	     * @param {Object} data the data to pass to the constructor.
	     * @param {String} encoding the encoding to use.
	     * @return {Buffer} a new Buffer.
	     */
	    newBuffer : function(data, encoding){
	        return new Buffer(data, encoding);
	    },
	    /**
	     * Find out if an object is a Buffer.
	     * @param {Object} b the object to test.
	     * @return {Boolean} true if the object is a Buffer, false otherwise.
	     */
	    isBuffer : function(b){
	        return Buffer.isBuffer(b);
	    },
	
	    isStream : function (obj) {
	        return obj &&
	            typeof obj.on === "function" &&
	            typeof obj.pause === "function" &&
	            typeof obj.resume === "function";
	    }
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(140).Buffer))

/***/ },
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	// rawAsap provides everything we need except exception management.
	var rawAsap = __webpack_require__(175);
	// RawTasks are recycled to reduce GC churn.
	var freeTasks = [];
	// We queue errors to ensure they are thrown in right order (FIFO).
	// Array-as-queue is good enough here, since we are just dealing with exceptions.
	var pendingErrors = [];
	var requestErrorThrow = rawAsap.makeRequestCallFromTimer(throwFirstError);
	
	function throwFirstError() {
	    if (pendingErrors.length) {
	        throw pendingErrors.shift();
	    }
	}
	
	/**
	 * Calls a task as soon as possible after returning, in its own event, with priority
	 * over other events like animation, reflow, and repaint. An error thrown from an
	 * event will not interrupt, nor even substantially slow down the processing of
	 * other events, but will be rather postponed to a lower priority event.
	 * @param {{call}} task A callable object, typically a function that takes no
	 * arguments.
	 */
	module.exports = asap;
	function asap(task) {
	    var rawTask;
	    if (freeTasks.length) {
	        rawTask = freeTasks.pop();
	    } else {
	        rawTask = new RawTask();
	    }
	    rawTask.task = task;
	    rawAsap(rawTask);
	}
	
	// We wrap tasks with recyclable task objects.  A task object implements
	// `call`, just like a function.
	function RawTask() {
	    this.task = null;
	}
	
	// The sole purpose of wrapping the task is to catch the exception and recycle
	// the task object after its single use.
	RawTask.prototype.call = function () {
	    try {
	        this.task.call();
	    } catch (error) {
	        if (asap.onerror) {
	            // This hook exists purely for testing purposes.
	            // Its name will be periodically randomized to break any code that
	            // depends on its existence.
	            asap.onerror(error);
	        } else {
	            // In a web browser, exceptions are not fatal. However, to avoid
	            // slowing down the queue of pending tasks, we rethrow the error in a
	            // lower priority turn.
	            pendingErrors.push(error);
	            requestErrorThrow();
	        }
	    } finally {
	        this.task = null;
	        freeTasks[freeTasks.length] = this;
	    }
	};


/***/ },
/* 175 */
/***/ function(module, exports) {

	/* WEBPACK VAR INJECTION */(function(global) {"use strict";
	
	// Use the fastest means possible to execute a task in its own turn, with
	// priority over other events including IO, animation, reflow, and redraw
	// events in browsers.
	//
	// An exception thrown by a task will permanently interrupt the processing of
	// subsequent tasks. The higher level `asap` function ensures that if an
	// exception is thrown by a task, that the task queue will continue flushing as
	// soon as possible, but if you use `rawAsap` directly, you are responsible to
	// either ensure that no exceptions are thrown from your task, or to manually
	// call `rawAsap.requestFlush` if an exception is thrown.
	module.exports = rawAsap;
	function rawAsap(task) {
	    if (!queue.length) {
	        requestFlush();
	        flushing = true;
	    }
	    // Equivalent to push, but avoids a function call.
	    queue[queue.length] = task;
	}
	
	var queue = [];
	// Once a flush has been requested, no further calls to `requestFlush` are
	// necessary until the next `flush` completes.
	var flushing = false;
	// `requestFlush` is an implementation-specific method that attempts to kick
	// off a `flush` event as quickly as possible. `flush` will attempt to exhaust
	// the event queue before yielding to the browser's own event loop.
	var requestFlush;
	// The position of the next task to execute in the task queue. This is
	// preserved between calls to `flush` so that it can be resumed if
	// a task throws an exception.
	var index = 0;
	// If a task schedules additional tasks recursively, the task queue can grow
	// unbounded. To prevent memory exhaustion, the task queue will periodically
	// truncate already-completed tasks.
	var capacity = 1024;
	
	// The flush function processes all tasks that have been scheduled with
	// `rawAsap` unless and until one of those tasks throws an exception.
	// If a task throws an exception, `flush` ensures that its state will remain
	// consistent and will resume where it left off when called again.
	// However, `flush` does not make any arrangements to be called again if an
	// exception is thrown.
	function flush() {
	    while (index < queue.length) {
	        var currentIndex = index;
	        // Advance the index before calling the task. This ensures that we will
	        // begin flushing on the next task the task throws an error.
	        index = index + 1;
	        queue[currentIndex].call();
	        // Prevent leaking memory for long chains of recursive calls to `asap`.
	        // If we call `asap` within tasks scheduled by `asap`, the queue will
	        // grow, but to avoid an O(n) walk for every task we execute, we don't
	        // shift tasks off the queue after they have been executed.
	        // Instead, we periodically shift 1024 tasks off the queue.
	        if (index > capacity) {
	            // Manually shift all values starting at the index back to the
	            // beginning of the queue.
	            for (var scan = 0, newLength = queue.length - index; scan < newLength; scan++) {
	                queue[scan] = queue[scan + index];
	            }
	            queue.length -= index;
	            index = 0;
	        }
	    }
	    queue.length = 0;
	    index = 0;
	    flushing = false;
	}
	
	// `requestFlush` is implemented using a strategy based on data collected from
	// every available SauceLabs Selenium web driver worker at time of writing.
	// https://docs.google.com/spreadsheets/d/1mG-5UYGup5qxGdEMWkhP6BWCz053NUb2E1QoUTU16uA/edit#gid=783724593
	
	// Safari 6 and 6.1 for desktop, iPad, and iPhone are the only browsers that
	// have WebKitMutationObserver but not un-prefixed MutationObserver.
	// Must use `global` instead of `window` to work in both frames and web
	// workers. `global` is a provision of Browserify, Mr, Mrs, or Mop.
	var BrowserMutationObserver = global.MutationObserver || global.WebKitMutationObserver;
	
	// MutationObservers are desirable because they have high priority and work
	// reliably everywhere they are implemented.
	// They are implemented in all modern browsers.
	//
	// - Android 4-4.3
	// - Chrome 26-34
	// - Firefox 14-29
	// - Internet Explorer 11
	// - iPad Safari 6-7.1
	// - iPhone Safari 7-7.1
	// - Safari 6-7
	if (typeof BrowserMutationObserver === "function") {
	    requestFlush = makeRequestCallFromMutationObserver(flush);
	
	// MessageChannels are desirable because they give direct access to the HTML
	// task queue, are implemented in Internet Explorer 10, Safari 5.0-1, and Opera
	// 11-12, and in web workers in many engines.
	// Although message channels yield to any queued rendering and IO tasks, they
	// would be better than imposing the 4ms delay of timers.
	// However, they do not work reliably in Internet Explorer or Safari.
	
	// Internet Explorer 10 is the only browser that has setImmediate but does
	// not have MutationObservers.
	// Although setImmediate yields to the browser's renderer, it would be
	// preferrable to falling back to setTimeout since it does not have
	// the minimum 4ms penalty.
	// Unfortunately there appears to be a bug in Internet Explorer 10 Mobile (and
	// Desktop to a lesser extent) that renders both setImmediate and
	// MessageChannel useless for the purposes of ASAP.
	// https://github.com/kriskowal/q/issues/396
	
	// Timers are implemented universally.
	// We fall back to timers in workers in most engines, and in foreground
	// contexts in the following browsers.
	// However, note that even this simple case requires nuances to operate in a
	// broad spectrum of browsers.
	//
	// - Firefox 3-13
	// - Internet Explorer 6-9
	// - iPad Safari 4.3
	// - Lynx 2.8.7
	} else {
	    requestFlush = makeRequestCallFromTimer(flush);
	}
	
	// `requestFlush` requests that the high priority event queue be flushed as
	// soon as possible.
	// This is useful to prevent an error thrown in a task from stalling the event
	// queue if the exception handled by Node.js’s
	// `process.on("uncaughtException")` or by a domain.
	rawAsap.requestFlush = requestFlush;
	
	// To request a high priority event, we induce a mutation observer by toggling
	// the text of a text node between "1" and "-1".
	function makeRequestCallFromMutationObserver(callback) {
	    var toggle = 1;
	    var observer = new BrowserMutationObserver(callback);
	    var node = document.createTextNode("");
	    observer.observe(node, {characterData: true});
	    return function requestCall() {
	        toggle = -toggle;
	        node.data = toggle;
	    };
	}
	
	// The message channel technique was discovered by Malte Ubl and was the
	// original foundation for this library.
	// http://www.nonblocking.io/2011/06/windownexttick.html
	
	// Safari 6.0.5 (at least) intermittently fails to create message ports on a
	// page's first load. Thankfully, this version of Safari supports
	// MutationObservers, so we don't need to fall back in that case.
	
	// function makeRequestCallFromMessageChannel(callback) {
	//     var channel = new MessageChannel();
	//     channel.port1.onmessage = callback;
	//     return function requestCall() {
	//         channel.port2.postMessage(0);
	//     };
	// }
	
	// For reasons explained above, we are also unable to use `setImmediate`
	// under any circumstances.
	// Even if we were, there is another bug in Internet Explorer 10.
	// It is not sufficient to assign `setImmediate` to `requestFlush` because
	// `setImmediate` must be called *by name* and therefore must be wrapped in a
	// closure.
	// Never forget.
	
	// function makeRequestCallFromSetImmediate(callback) {
	//     return function requestCall() {
	//         setImmediate(callback);
	//     };
	// }
	
	// Safari 6.0 has a problem where timers will get lost while the user is
	// scrolling. This problem does not impact ASAP because Safari 6.0 supports
	// mutation observers, so that implementation is used instead.
	// However, if we ever elect to use timers in Safari, the prevalent work-around
	// is to add a scroll event listener that calls for a flush.
	
	// `setTimeout` does not call the passed callback if the delay is less than
	// approximately 7 in web workers in Firefox 8 through 18, and sometimes not
	// even then.
	
	function makeRequestCallFromTimer(callback) {
	    return function requestCall() {
	        // We dispatch a timeout with a specified delay of 0 for engines that
	        // can reliably accommodate that request. This will usually be snapped
	        // to a 4 milisecond delay, but once we're flushing, there's no delay
	        // between events.
	        var timeoutHandle = setTimeout(handleTimer, 0);
	        // However, since this timer gets frequently dropped in Firefox
	        // workers, we enlist an interval handle that will try to fire
	        // an event 20 times per second until it succeeds.
	        var intervalHandle = setInterval(handleTimer, 50);
	
	        function handleTimer() {
	            // Whichever timer succeeds will cancel both timers and
	            // execute the callback.
	            clearTimeout(timeoutHandle);
	            clearInterval(intervalHandle);
	            callback();
	        }
	    };
	}
	
	// This is for `asap.js` only.
	// Its name will be periodically randomized to break any code that depends on
	// its existence.
	rawAsap.makeRequestCallFromTimer = makeRequestCallFromTimer;
	
	// ASAP was originally a nextTick shim included in Q. This was factored out
	// into this ASAP package. It was later adapted to RSVP which made further
	// amendments. These decisions, particularly to marginalize MessageChannel and
	// to capture the MutationObserver implementation in a closure, were integrated
	// back into ASAP proper.
	// https://github.com/tildeio/rsvp.js/blob/cddf7232546a9cf858524b75cde6f9edf72620a7/lib/rsvp/asap.js
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var ES6Promise = __webpack_require__(177).Promise;
	
	/**
	 * Let the user use/change some implementations.
	 */
	module.exports = {
	    Promise: ES6Promise
	};


/***/ },
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	var require;var __WEBPACK_AMD_DEFINE_RESULT__;/* WEBPACK VAR INJECTION */(function(process, global, module) {/*!
	 * @overview es6-promise - a tiny implementation of Promises/A+.
	 * @copyright Copyright (c) 2014 Yehuda Katz, Tom Dale, Stefan Penner and contributors (Conversion to ES6 API by Jake Archibald)
	 * @license   Licensed under MIT license
	 *            See https://raw.githubusercontent.com/jakearchibald/es6-promise/master/LICENSE
	 * @version   3.0.2
	 */
	
	(function() {
	    "use strict";
	    function lib$es6$promise$utils$$objectOrFunction(x) {
	      return typeof x === 'function' || (typeof x === 'object' && x !== null);
	    }
	
	    function lib$es6$promise$utils$$isFunction(x) {
	      return typeof x === 'function';
	    }
	
	    function lib$es6$promise$utils$$isMaybeThenable(x) {
	      return typeof x === 'object' && x !== null;
	    }
	
	    var lib$es6$promise$utils$$_isArray;
	    if (!Array.isArray) {
	      lib$es6$promise$utils$$_isArray = function (x) {
	        return Object.prototype.toString.call(x) === '[object Array]';
	      };
	    } else {
	      lib$es6$promise$utils$$_isArray = Array.isArray;
	    }
	
	    var lib$es6$promise$utils$$isArray = lib$es6$promise$utils$$_isArray;
	    var lib$es6$promise$asap$$len = 0;
	    var lib$es6$promise$asap$$toString = {}.toString;
	    var lib$es6$promise$asap$$vertxNext;
	    var lib$es6$promise$asap$$customSchedulerFn;
	
	    var lib$es6$promise$asap$$asap = function asap(callback, arg) {
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len] = callback;
	      lib$es6$promise$asap$$queue[lib$es6$promise$asap$$len + 1] = arg;
	      lib$es6$promise$asap$$len += 2;
	      if (lib$es6$promise$asap$$len === 2) {
	        // If len is 2, that means that we need to schedule an async flush.
	        // If additional callbacks are queued before the queue is flushed, they
	        // will be processed by this flush that we are scheduling.
	        if (lib$es6$promise$asap$$customSchedulerFn) {
	          lib$es6$promise$asap$$customSchedulerFn(lib$es6$promise$asap$$flush);
	        } else {
	          lib$es6$promise$asap$$scheduleFlush();
	        }
	      }
	    }
	
	    function lib$es6$promise$asap$$setScheduler(scheduleFn) {
	      lib$es6$promise$asap$$customSchedulerFn = scheduleFn;
	    }
	
	    function lib$es6$promise$asap$$setAsap(asapFn) {
	      lib$es6$promise$asap$$asap = asapFn;
	    }
	
	    var lib$es6$promise$asap$$browserWindow = (typeof window !== 'undefined') ? window : undefined;
	    var lib$es6$promise$asap$$browserGlobal = lib$es6$promise$asap$$browserWindow || {};
	    var lib$es6$promise$asap$$BrowserMutationObserver = lib$es6$promise$asap$$browserGlobal.MutationObserver || lib$es6$promise$asap$$browserGlobal.WebKitMutationObserver;
	    var lib$es6$promise$asap$$isNode = typeof process !== 'undefined' && {}.toString.call(process) === '[object process]';
	
	    // test for web worker but not in IE10
	    var lib$es6$promise$asap$$isWorker = typeof Uint8ClampedArray !== 'undefined' &&
	      typeof importScripts !== 'undefined' &&
	      typeof MessageChannel !== 'undefined';
	
	    // node
	    function lib$es6$promise$asap$$useNextTick() {
	      // node version 0.10.x displays a deprecation warning when nextTick is used recursively
	      // see https://github.com/cujojs/when/issues/410 for details
	      return function() {
	        process.nextTick(lib$es6$promise$asap$$flush);
	      };
	    }
	
	    // vertx
	    function lib$es6$promise$asap$$useVertxTimer() {
	      return function() {
	        lib$es6$promise$asap$$vertxNext(lib$es6$promise$asap$$flush);
	      };
	    }
	
	    function lib$es6$promise$asap$$useMutationObserver() {
	      var iterations = 0;
	      var observer = new lib$es6$promise$asap$$BrowserMutationObserver(lib$es6$promise$asap$$flush);
	      var node = document.createTextNode('');
	      observer.observe(node, { characterData: true });
	
	      return function() {
	        node.data = (iterations = ++iterations % 2);
	      };
	    }
	
	    // web worker
	    function lib$es6$promise$asap$$useMessageChannel() {
	      var channel = new MessageChannel();
	      channel.port1.onmessage = lib$es6$promise$asap$$flush;
	      return function () {
	        channel.port2.postMessage(0);
	      };
	    }
	
	    function lib$es6$promise$asap$$useSetTimeout() {
	      return function() {
	        setTimeout(lib$es6$promise$asap$$flush, 1);
	      };
	    }
	
	    var lib$es6$promise$asap$$queue = new Array(1000);
	    function lib$es6$promise$asap$$flush() {
	      for (var i = 0; i < lib$es6$promise$asap$$len; i+=2) {
	        var callback = lib$es6$promise$asap$$queue[i];
	        var arg = lib$es6$promise$asap$$queue[i+1];
	
	        callback(arg);
	
	        lib$es6$promise$asap$$queue[i] = undefined;
	        lib$es6$promise$asap$$queue[i+1] = undefined;
	      }
	
	      lib$es6$promise$asap$$len = 0;
	    }
	
	    function lib$es6$promise$asap$$attemptVertx() {
	      try {
	        var r = require;
	        var vertx = __webpack_require__(179);
	        lib$es6$promise$asap$$vertxNext = vertx.runOnLoop || vertx.runOnContext;
	        return lib$es6$promise$asap$$useVertxTimer();
	      } catch(e) {
	        return lib$es6$promise$asap$$useSetTimeout();
	      }
	    }
	
	    var lib$es6$promise$asap$$scheduleFlush;
	    // Decide what async method to use to triggering processing of queued callbacks:
	    if (lib$es6$promise$asap$$isNode) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useNextTick();
	    } else if (lib$es6$promise$asap$$BrowserMutationObserver) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMutationObserver();
	    } else if (lib$es6$promise$asap$$isWorker) {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useMessageChannel();
	    } else if (lib$es6$promise$asap$$browserWindow === undefined && "function" === 'function') {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$attemptVertx();
	    } else {
	      lib$es6$promise$asap$$scheduleFlush = lib$es6$promise$asap$$useSetTimeout();
	    }
	
	    function lib$es6$promise$$internal$$noop() {}
	
	    var lib$es6$promise$$internal$$PENDING   = void 0;
	    var lib$es6$promise$$internal$$FULFILLED = 1;
	    var lib$es6$promise$$internal$$REJECTED  = 2;
	
	    var lib$es6$promise$$internal$$GET_THEN_ERROR = new lib$es6$promise$$internal$$ErrorObject();
	
	    function lib$es6$promise$$internal$$selfFulfillment() {
	      return new TypeError("You cannot resolve a promise with itself");
	    }
	
	    function lib$es6$promise$$internal$$cannotReturnOwn() {
	      return new TypeError('A promises callback cannot return that same promise.');
	    }
	
	    function lib$es6$promise$$internal$$getThen(promise) {
	      try {
	        return promise.then;
	      } catch(error) {
	        lib$es6$promise$$internal$$GET_THEN_ERROR.error = error;
	        return lib$es6$promise$$internal$$GET_THEN_ERROR;
	      }
	    }
	
	    function lib$es6$promise$$internal$$tryThen(then, value, fulfillmentHandler, rejectionHandler) {
	      try {
	        then.call(value, fulfillmentHandler, rejectionHandler);
	      } catch(e) {
	        return e;
	      }
	    }
	
	    function lib$es6$promise$$internal$$handleForeignThenable(promise, thenable, then) {
	       lib$es6$promise$asap$$asap(function(promise) {
	        var sealed = false;
	        var error = lib$es6$promise$$internal$$tryThen(then, thenable, function(value) {
	          if (sealed) { return; }
	          sealed = true;
	          if (thenable !== value) {
	            lib$es6$promise$$internal$$resolve(promise, value);
	          } else {
	            lib$es6$promise$$internal$$fulfill(promise, value);
	          }
	        }, function(reason) {
	          if (sealed) { return; }
	          sealed = true;
	
	          lib$es6$promise$$internal$$reject(promise, reason);
	        }, 'Settle: ' + (promise._label || ' unknown promise'));
	
	        if (!sealed && error) {
	          sealed = true;
	          lib$es6$promise$$internal$$reject(promise, error);
	        }
	      }, promise);
	    }
	
	    function lib$es6$promise$$internal$$handleOwnThenable(promise, thenable) {
	      if (thenable._state === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, thenable._result);
	      } else if (thenable._state === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, thenable._result);
	      } else {
	        lib$es6$promise$$internal$$subscribe(thenable, undefined, function(value) {
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      }
	    }
	
	    function lib$es6$promise$$internal$$handleMaybeThenable(promise, maybeThenable) {
	      if (maybeThenable.constructor === promise.constructor) {
	        lib$es6$promise$$internal$$handleOwnThenable(promise, maybeThenable);
	      } else {
	        var then = lib$es6$promise$$internal$$getThen(maybeThenable);
	
	        if (then === lib$es6$promise$$internal$$GET_THEN_ERROR) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$GET_THEN_ERROR.error);
	        } else if (then === undefined) {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        } else if (lib$es6$promise$utils$$isFunction(then)) {
	          lib$es6$promise$$internal$$handleForeignThenable(promise, maybeThenable, then);
	        } else {
	          lib$es6$promise$$internal$$fulfill(promise, maybeThenable);
	        }
	      }
	    }
	
	    function lib$es6$promise$$internal$$resolve(promise, value) {
	      if (promise === value) {
	        lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$selfFulfillment());
	      } else if (lib$es6$promise$utils$$objectOrFunction(value)) {
	        lib$es6$promise$$internal$$handleMaybeThenable(promise, value);
	      } else {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      }
	    }
	
	    function lib$es6$promise$$internal$$publishRejection(promise) {
	      if (promise._onerror) {
	        promise._onerror(promise._result);
	      }
	
	      lib$es6$promise$$internal$$publish(promise);
	    }
	
	    function lib$es6$promise$$internal$$fulfill(promise, value) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	
	      promise._result = value;
	      promise._state = lib$es6$promise$$internal$$FULFILLED;
	
	      if (promise._subscribers.length !== 0) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, promise);
	      }
	    }
	
	    function lib$es6$promise$$internal$$reject(promise, reason) {
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) { return; }
	      promise._state = lib$es6$promise$$internal$$REJECTED;
	      promise._result = reason;
	
	      lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publishRejection, promise);
	    }
	
	    function lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection) {
	      var subscribers = parent._subscribers;
	      var length = subscribers.length;
	
	      parent._onerror = null;
	
	      subscribers[length] = child;
	      subscribers[length + lib$es6$promise$$internal$$FULFILLED] = onFulfillment;
	      subscribers[length + lib$es6$promise$$internal$$REJECTED]  = onRejection;
	
	      if (length === 0 && parent._state) {
	        lib$es6$promise$asap$$asap(lib$es6$promise$$internal$$publish, parent);
	      }
	    }
	
	    function lib$es6$promise$$internal$$publish(promise) {
	      var subscribers = promise._subscribers;
	      var settled = promise._state;
	
	      if (subscribers.length === 0) { return; }
	
	      var child, callback, detail = promise._result;
	
	      for (var i = 0; i < subscribers.length; i += 3) {
	        child = subscribers[i];
	        callback = subscribers[i + settled];
	
	        if (child) {
	          lib$es6$promise$$internal$$invokeCallback(settled, child, callback, detail);
	        } else {
	          callback(detail);
	        }
	      }
	
	      promise._subscribers.length = 0;
	    }
	
	    function lib$es6$promise$$internal$$ErrorObject() {
	      this.error = null;
	    }
	
	    var lib$es6$promise$$internal$$TRY_CATCH_ERROR = new lib$es6$promise$$internal$$ErrorObject();
	
	    function lib$es6$promise$$internal$$tryCatch(callback, detail) {
	      try {
	        return callback(detail);
	      } catch(e) {
	        lib$es6$promise$$internal$$TRY_CATCH_ERROR.error = e;
	        return lib$es6$promise$$internal$$TRY_CATCH_ERROR;
	      }
	    }
	
	    function lib$es6$promise$$internal$$invokeCallback(settled, promise, callback, detail) {
	      var hasCallback = lib$es6$promise$utils$$isFunction(callback),
	          value, error, succeeded, failed;
	
	      if (hasCallback) {
	        value = lib$es6$promise$$internal$$tryCatch(callback, detail);
	
	        if (value === lib$es6$promise$$internal$$TRY_CATCH_ERROR) {
	          failed = true;
	          error = value.error;
	          value = null;
	        } else {
	          succeeded = true;
	        }
	
	        if (promise === value) {
	          lib$es6$promise$$internal$$reject(promise, lib$es6$promise$$internal$$cannotReturnOwn());
	          return;
	        }
	
	      } else {
	        value = detail;
	        succeeded = true;
	      }
	
	      if (promise._state !== lib$es6$promise$$internal$$PENDING) {
	        // noop
	      } else if (hasCallback && succeeded) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      } else if (failed) {
	        lib$es6$promise$$internal$$reject(promise, error);
	      } else if (settled === lib$es6$promise$$internal$$FULFILLED) {
	        lib$es6$promise$$internal$$fulfill(promise, value);
	      } else if (settled === lib$es6$promise$$internal$$REJECTED) {
	        lib$es6$promise$$internal$$reject(promise, value);
	      }
	    }
	
	    function lib$es6$promise$$internal$$initializePromise(promise, resolver) {
	      try {
	        resolver(function resolvePromise(value){
	          lib$es6$promise$$internal$$resolve(promise, value);
	        }, function rejectPromise(reason) {
	          lib$es6$promise$$internal$$reject(promise, reason);
	        });
	      } catch(e) {
	        lib$es6$promise$$internal$$reject(promise, e);
	      }
	    }
	
	    function lib$es6$promise$enumerator$$Enumerator(Constructor, input) {
	      var enumerator = this;
	
	      enumerator._instanceConstructor = Constructor;
	      enumerator.promise = new Constructor(lib$es6$promise$$internal$$noop);
	
	      if (enumerator._validateInput(input)) {
	        enumerator._input     = input;
	        enumerator.length     = input.length;
	        enumerator._remaining = input.length;
	
	        enumerator._init();
	
	        if (enumerator.length === 0) {
	          lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
	        } else {
	          enumerator.length = enumerator.length || 0;
	          enumerator._enumerate();
	          if (enumerator._remaining === 0) {
	            lib$es6$promise$$internal$$fulfill(enumerator.promise, enumerator._result);
	          }
	        }
	      } else {
	        lib$es6$promise$$internal$$reject(enumerator.promise, enumerator._validationError());
	      }
	    }
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._validateInput = function(input) {
	      return lib$es6$promise$utils$$isArray(input);
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._validationError = function() {
	      return new Error('Array Methods must be provided an Array');
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._init = function() {
	      this._result = new Array(this.length);
	    };
	
	    var lib$es6$promise$enumerator$$default = lib$es6$promise$enumerator$$Enumerator;
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._enumerate = function() {
	      var enumerator = this;
	
	      var length  = enumerator.length;
	      var promise = enumerator.promise;
	      var input   = enumerator._input;
	
	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        enumerator._eachEntry(input[i], i);
	      }
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._eachEntry = function(entry, i) {
	      var enumerator = this;
	      var c = enumerator._instanceConstructor;
	
	      if (lib$es6$promise$utils$$isMaybeThenable(entry)) {
	        if (entry.constructor === c && entry._state !== lib$es6$promise$$internal$$PENDING) {
	          entry._onerror = null;
	          enumerator._settledAt(entry._state, i, entry._result);
	        } else {
	          enumerator._willSettleAt(c.resolve(entry), i);
	        }
	      } else {
	        enumerator._remaining--;
	        enumerator._result[i] = entry;
	      }
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._settledAt = function(state, i, value) {
	      var enumerator = this;
	      var promise = enumerator.promise;
	
	      if (promise._state === lib$es6$promise$$internal$$PENDING) {
	        enumerator._remaining--;
	
	        if (state === lib$es6$promise$$internal$$REJECTED) {
	          lib$es6$promise$$internal$$reject(promise, value);
	        } else {
	          enumerator._result[i] = value;
	        }
	      }
	
	      if (enumerator._remaining === 0) {
	        lib$es6$promise$$internal$$fulfill(promise, enumerator._result);
	      }
	    };
	
	    lib$es6$promise$enumerator$$Enumerator.prototype._willSettleAt = function(promise, i) {
	      var enumerator = this;
	
	      lib$es6$promise$$internal$$subscribe(promise, undefined, function(value) {
	        enumerator._settledAt(lib$es6$promise$$internal$$FULFILLED, i, value);
	      }, function(reason) {
	        enumerator._settledAt(lib$es6$promise$$internal$$REJECTED, i, reason);
	      });
	    };
	    function lib$es6$promise$promise$all$$all(entries) {
	      return new lib$es6$promise$enumerator$$default(this, entries).promise;
	    }
	    var lib$es6$promise$promise$all$$default = lib$es6$promise$promise$all$$all;
	    function lib$es6$promise$promise$race$$race(entries) {
	      /*jshint validthis:true */
	      var Constructor = this;
	
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	
	      if (!lib$es6$promise$utils$$isArray(entries)) {
	        lib$es6$promise$$internal$$reject(promise, new TypeError('You must pass an array to race.'));
	        return promise;
	      }
	
	      var length = entries.length;
	
	      function onFulfillment(value) {
	        lib$es6$promise$$internal$$resolve(promise, value);
	      }
	
	      function onRejection(reason) {
	        lib$es6$promise$$internal$$reject(promise, reason);
	      }
	
	      for (var i = 0; promise._state === lib$es6$promise$$internal$$PENDING && i < length; i++) {
	        lib$es6$promise$$internal$$subscribe(Constructor.resolve(entries[i]), undefined, onFulfillment, onRejection);
	      }
	
	      return promise;
	    }
	    var lib$es6$promise$promise$race$$default = lib$es6$promise$promise$race$$race;
	    function lib$es6$promise$promise$resolve$$resolve(object) {
	      /*jshint validthis:true */
	      var Constructor = this;
	
	      if (object && typeof object === 'object' && object.constructor === Constructor) {
	        return object;
	      }
	
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$resolve(promise, object);
	      return promise;
	    }
	    var lib$es6$promise$promise$resolve$$default = lib$es6$promise$promise$resolve$$resolve;
	    function lib$es6$promise$promise$reject$$reject(reason) {
	      /*jshint validthis:true */
	      var Constructor = this;
	      var promise = new Constructor(lib$es6$promise$$internal$$noop);
	      lib$es6$promise$$internal$$reject(promise, reason);
	      return promise;
	    }
	    var lib$es6$promise$promise$reject$$default = lib$es6$promise$promise$reject$$reject;
	
	    var lib$es6$promise$promise$$counter = 0;
	
	    function lib$es6$promise$promise$$needsResolver() {
	      throw new TypeError('You must pass a resolver function as the first argument to the promise constructor');
	    }
	
	    function lib$es6$promise$promise$$needsNew() {
	      throw new TypeError("Failed to construct 'Promise': Please use the 'new' operator, this object constructor cannot be called as a function.");
	    }
	
	    var lib$es6$promise$promise$$default = lib$es6$promise$promise$$Promise;
	    /**
	      Promise objects represent the eventual result of an asynchronous operation. The
	      primary way of interacting with a promise is through its `then` method, which
	      registers callbacks to receive either a promise's eventual value or the reason
	      why the promise cannot be fulfilled.
	
	      Terminology
	      -----------
	
	      - `promise` is an object or function with a `then` method whose behavior conforms to this specification.
	      - `thenable` is an object or function that defines a `then` method.
	      - `value` is any legal JavaScript value (including undefined, a thenable, or a promise).
	      - `exception` is a value that is thrown using the throw statement.
	      - `reason` is a value that indicates why a promise was rejected.
	      - `settled` the final resting state of a promise, fulfilled or rejected.
	
	      A promise can be in one of three states: pending, fulfilled, or rejected.
	
	      Promises that are fulfilled have a fulfillment value and are in the fulfilled
	      state.  Promises that are rejected have a rejection reason and are in the
	      rejected state.  A fulfillment value is never a thenable.
	
	      Promises can also be said to *resolve* a value.  If this value is also a
	      promise, then the original promise's settled state will match the value's
	      settled state.  So a promise that *resolves* a promise that rejects will
	      itself reject, and a promise that *resolves* a promise that fulfills will
	      itself fulfill.
	
	
	      Basic Usage:
	      ------------
	
	      ```js
	      var promise = new Promise(function(resolve, reject) {
	        // on success
	        resolve(value);
	
	        // on failure
	        reject(reason);
	      });
	
	      promise.then(function(value) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```
	
	      Advanced Usage:
	      ---------------
	
	      Promises shine when abstracting away asynchronous interactions such as
	      `XMLHttpRequest`s.
	
	      ```js
	      function getJSON(url) {
	        return new Promise(function(resolve, reject){
	          var xhr = new XMLHttpRequest();
	
	          xhr.open('GET', url);
	          xhr.onreadystatechange = handler;
	          xhr.responseType = 'json';
	          xhr.setRequestHeader('Accept', 'application/json');
	          xhr.send();
	
	          function handler() {
	            if (this.readyState === this.DONE) {
	              if (this.status === 200) {
	                resolve(this.response);
	              } else {
	                reject(new Error('getJSON: `' + url + '` failed with status: [' + this.status + ']'));
	              }
	            }
	          };
	        });
	      }
	
	      getJSON('/posts.json').then(function(json) {
	        // on fulfillment
	      }, function(reason) {
	        // on rejection
	      });
	      ```
	
	      Unlike callbacks, promises are great composable primitives.
	
	      ```js
	      Promise.all([
	        getJSON('/posts'),
	        getJSON('/comments')
	      ]).then(function(values){
	        values[0] // => postsJSON
	        values[1] // => commentsJSON
	
	        return values;
	      });
	      ```
	
	      @class Promise
	      @param {function} resolver
	      Useful for tooling.
	      @constructor
	    */
	    function lib$es6$promise$promise$$Promise(resolver) {
	      this._id = lib$es6$promise$promise$$counter++;
	      this._state = undefined;
	      this._result = undefined;
	      this._subscribers = [];
	
	      if (lib$es6$promise$$internal$$noop !== resolver) {
	        if (!lib$es6$promise$utils$$isFunction(resolver)) {
	          lib$es6$promise$promise$$needsResolver();
	        }
	
	        if (!(this instanceof lib$es6$promise$promise$$Promise)) {
	          lib$es6$promise$promise$$needsNew();
	        }
	
	        lib$es6$promise$$internal$$initializePromise(this, resolver);
	      }
	    }
	
	    lib$es6$promise$promise$$Promise.all = lib$es6$promise$promise$all$$default;
	    lib$es6$promise$promise$$Promise.race = lib$es6$promise$promise$race$$default;
	    lib$es6$promise$promise$$Promise.resolve = lib$es6$promise$promise$resolve$$default;
	    lib$es6$promise$promise$$Promise.reject = lib$es6$promise$promise$reject$$default;
	    lib$es6$promise$promise$$Promise._setScheduler = lib$es6$promise$asap$$setScheduler;
	    lib$es6$promise$promise$$Promise._setAsap = lib$es6$promise$asap$$setAsap;
	    lib$es6$promise$promise$$Promise._asap = lib$es6$promise$asap$$asap;
	
	    lib$es6$promise$promise$$Promise.prototype = {
	      constructor: lib$es6$promise$promise$$Promise,
	
	    /**
	      The primary way of interacting with a promise is through its `then` method,
	      which registers callbacks to receive either a promise's eventual value or the
	      reason why the promise cannot be fulfilled.
	
	      ```js
	      findUser().then(function(user){
	        // user is available
	      }, function(reason){
	        // user is unavailable, and you are given the reason why
	      });
	      ```
	
	      Chaining
	      --------
	
	      The return value of `then` is itself a promise.  This second, 'downstream'
	      promise is resolved with the return value of the first promise's fulfillment
	      or rejection handler, or rejected if the handler throws an exception.
	
	      ```js
	      findUser().then(function (user) {
	        return user.name;
	      }, function (reason) {
	        return 'default name';
	      }).then(function (userName) {
	        // If `findUser` fulfilled, `userName` will be the user's name, otherwise it
	        // will be `'default name'`
	      });
	
	      findUser().then(function (user) {
	        throw new Error('Found user, but still unhappy');
	      }, function (reason) {
	        throw new Error('`findUser` rejected and we're unhappy');
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // if `findUser` fulfilled, `reason` will be 'Found user, but still unhappy'.
	        // If `findUser` rejected, `reason` will be '`findUser` rejected and we're unhappy'.
	      });
	      ```
	      If the downstream promise does not specify a rejection handler, rejection reasons will be propagated further downstream.
	
	      ```js
	      findUser().then(function (user) {
	        throw new PedagogicalException('Upstream error');
	      }).then(function (value) {
	        // never reached
	      }).then(function (value) {
	        // never reached
	      }, function (reason) {
	        // The `PedgagocialException` is propagated all the way down to here
	      });
	      ```
	
	      Assimilation
	      ------------
	
	      Sometimes the value you want to propagate to a downstream promise can only be
	      retrieved asynchronously. This can be achieved by returning a promise in the
	      fulfillment or rejection handler. The downstream promise will then be pending
	      until the returned promise is settled. This is called *assimilation*.
	
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // The user's comments are now available
	      });
	      ```
	
	      If the assimliated promise rejects, then the downstream promise will also reject.
	
	      ```js
	      findUser().then(function (user) {
	        return findCommentsByAuthor(user);
	      }).then(function (comments) {
	        // If `findCommentsByAuthor` fulfills, we'll have the value here
	      }, function (reason) {
	        // If `findCommentsByAuthor` rejects, we'll have the reason here
	      });
	      ```
	
	      Simple Example
	      --------------
	
	      Synchronous Example
	
	      ```javascript
	      var result;
	
	      try {
	        result = findResult();
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	
	      Errback Example
	
	      ```js
	      findResult(function(result, err){
	        if (err) {
	          // failure
	        } else {
	          // success
	        }
	      });
	      ```
	
	      Promise Example;
	
	      ```javascript
	      findResult().then(function(result){
	        // success
	      }, function(reason){
	        // failure
	      });
	      ```
	
	      Advanced Example
	      --------------
	
	      Synchronous Example
	
	      ```javascript
	      var author, books;
	
	      try {
	        author = findAuthor();
	        books  = findBooksByAuthor(author);
	        // success
	      } catch(reason) {
	        // failure
	      }
	      ```
	
	      Errback Example
	
	      ```js
	
	      function foundBooks(books) {
	
	      }
	
	      function failure(reason) {
	
	      }
	
	      findAuthor(function(author, err){
	        if (err) {
	          failure(err);
	          // failure
	        } else {
	          try {
	            findBoooksByAuthor(author, function(books, err) {
	              if (err) {
	                failure(err);
	              } else {
	                try {
	                  foundBooks(books);
	                } catch(reason) {
	                  failure(reason);
	                }
	              }
	            });
	          } catch(error) {
	            failure(err);
	          }
	          // success
	        }
	      });
	      ```
	
	      Promise Example;
	
	      ```javascript
	      findAuthor().
	        then(findBooksByAuthor).
	        then(function(books){
	          // found books
	      }).catch(function(reason){
	        // something went wrong
	      });
	      ```
	
	      @method then
	      @param {Function} onFulfilled
	      @param {Function} onRejected
	      Useful for tooling.
	      @return {Promise}
	    */
	      then: function(onFulfillment, onRejection) {
	        var parent = this;
	        var state = parent._state;
	
	        if (state === lib$es6$promise$$internal$$FULFILLED && !onFulfillment || state === lib$es6$promise$$internal$$REJECTED && !onRejection) {
	          return this;
	        }
	
	        var child = new this.constructor(lib$es6$promise$$internal$$noop);
	        var result = parent._result;
	
	        if (state) {
	          var callback = arguments[state - 1];
	          lib$es6$promise$asap$$asap(function(){
	            lib$es6$promise$$internal$$invokeCallback(state, child, callback, result);
	          });
	        } else {
	          lib$es6$promise$$internal$$subscribe(parent, child, onFulfillment, onRejection);
	        }
	
	        return child;
	      },
	
	    /**
	      `catch` is simply sugar for `then(undefined, onRejection)` which makes it the same
	      as the catch block of a try/catch statement.
	
	      ```js
	      function findAuthor(){
	        throw new Error('couldn't find that author');
	      }
	
	      // synchronous
	      try {
	        findAuthor();
	      } catch(reason) {
	        // something went wrong
	      }
	
	      // async with promises
	      findAuthor().catch(function(reason){
	        // something went wrong
	      });
	      ```
	
	      @method catch
	      @param {Function} onRejection
	      Useful for tooling.
	      @return {Promise}
	    */
	      'catch': function(onRejection) {
	        return this.then(null, onRejection);
	      }
	    };
	    function lib$es6$promise$polyfill$$polyfill() {
	      var local;
	
	      if (typeof global !== 'undefined') {
	          local = global;
	      } else if (typeof self !== 'undefined') {
	          local = self;
	      } else {
	          try {
	              local = Function('return this')();
	          } catch (e) {
	              throw new Error('polyfill failed because global object is unavailable in this environment');
	          }
	      }
	
	      var P = local.Promise;
	
	      if (P && Object.prototype.toString.call(P.resolve()) === '[object Promise]' && !P.cast) {
	        return;
	      }
	
	      local.Promise = lib$es6$promise$promise$$default;
	    }
	    var lib$es6$promise$polyfill$$default = lib$es6$promise$polyfill$$polyfill;
	
	    var lib$es6$promise$umd$$ES6Promise = {
	      'Promise': lib$es6$promise$promise$$default,
	      'polyfill': lib$es6$promise$polyfill$$default
	    };
	
	    /* global define:true module:true window: true */
	    if ("function" === 'function' && __webpack_require__(180)['amd']) {
	      !(__WEBPACK_AMD_DEFINE_RESULT__ = function() { return lib$es6$promise$umd$$ES6Promise; }.call(exports, __webpack_require__, exports, module), __WEBPACK_AMD_DEFINE_RESULT__ !== undefined && (module.exports = __WEBPACK_AMD_DEFINE_RESULT__));
	    } else if (typeof module !== 'undefined' && module['exports']) {
	      module['exports'] = lib$es6$promise$umd$$ES6Promise;
	    } else if (typeof this !== 'undefined') {
	      this['ES6Promise'] = lib$es6$promise$umd$$ES6Promise;
	    }
	
	    lib$es6$promise$polyfill$$default();
	}).call(this);
	
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(147), (function() { return this; }()), __webpack_require__(178)(module)))

/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(33);

/***/ },
/* 179 */
/***/ function(module, exports) {

	/* (ignored) */

/***/ },
/* 180 */
/***/ function(module, exports) {

	module.exports = function() { throw new Error("define cannot be used indirect"); };


/***/ },
/* 181 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * A worker that does nothing but passing chunks to the next one. This is like
	 * a nodejs stream but with some differences. On the good side :
	 * - it works on IE 6-9 without any issue / polyfill
	 * - it weights less than the full dependencies bundled with browserify
	 * - it forwards errors (no need to declare an error handler EVERYWHERE)
	 *
	 * A chunk is an object with 2 attributes : `meta` and `data`. The former is an
	 * object containing anything (`percent` for example), see each worker for more
	 * details. The latter is the real data (String, Uint8Array, etc).
	 *
	 * @constructor
	 * @param {String} name the name of the stream (mainly used for debugging purposes)
	 */
	function GenericWorker(name) {
	    // the name of the worker
	    this.name = name || "default";
	    // an object containing metadata about the workers chain
	    this.streamInfo = {};
	    // an error which happened when the worker was paused
	    this.generatedError = null;
	    // an object containing metadata to be merged by this worker into the general metadata
	    this.extraStreamInfo = {};
	    // true if the stream is paused (and should not do anything), false otherwise
	    this.isPaused = true;
	    // true if the stream is finished (and should not do anything), false otherwise
	    this.isFinished = false;
	    // true if the stream is locked to prevent further structure updates (pipe), false otherwise
	    this.isLocked = false;
	    // the event listeners
	    this._listeners = {
	        'data':[],
	        'end':[],
	        'error':[]
	    };
	    // the previous worker, if any
	    this.previous = null;
	}
	
	GenericWorker.prototype = {
	    /**
	     * Push a chunk to the next workers.
	     * @param {Object} chunk the chunk to push
	     */
	    push : function (chunk) {
	        this.emit("data", chunk);
	    },
	    /**
	     * End the stream.
	     * @return {Boolean} true if this call ended the worker, false otherwise.
	     */
	    end : function () {
	        if (this.isFinished) {
	            return false;
	        }
	
	        this.flush();
	        try {
	            this.emit("end");
	            this.cleanUp();
	            this.isFinished = true;
	        } catch (e) {
	            this.emit("error", e);
	        }
	        return true;
	    },
	    /**
	     * End the stream with an error.
	     * @param {Error} e the error which caused the premature end.
	     * @return {Boolean} true if this call ended the worker with an error, false otherwise.
	     */
	    error : function (e) {
	        if (this.isFinished) {
	            return false;
	        }
	
	        if(this.isPaused) {
	            this.generatedError = e;
	        } else {
	            this.isFinished = true;
	
	            this.emit("error", e);
	
	            // in the workers chain exploded in the middle of the chain,
	            // the error event will go downward but we also need to notify
	            // workers upward that there has been an error.
	            if(this.previous) {
	                this.previous.error(e);
	            }
	
	            this.cleanUp();
	        }
	        return true;
	    },
	    /**
	     * Add a callback on an event.
	     * @param {String} name the name of the event (data, end, error)
	     * @param {Function} listener the function to call when the event is triggered
	     * @return {GenericWorker} the current object for chainability
	     */
	    on : function (name, listener) {
	        this._listeners[name].push(listener);
	        return this;
	    },
	    /**
	     * Clean any references when a worker is ending.
	     */
	    cleanUp : function () {
	        this.streamInfo = this.generatedError = this.extraStreamInfo = null;
	        this._listeners = [];
	    },
	    /**
	     * Trigger an event. This will call registered callback with the provided arg.
	     * @param {String} name the name of the event (data, end, error)
	     * @param {Object} arg the argument to call the callback with.
	     */
	    emit : function (name, arg) {
	        if (this._listeners[name]) {
	            for(var i = 0; i < this._listeners[name].length; i++) {
	                this._listeners[name][i].call(this, arg);
	            }
	        }
	    },
	    /**
	     * Chain a worker with an other.
	     * @param {Worker} next the worker receiving events from the current one.
	     * @return {worker} the next worker for chainability
	     */
	    pipe : function (next) {
	        return next.registerPrevious(this);
	    },
	    /**
	     * Same as `pipe` in the other direction.
	     * Using an API with `pipe(next)` is very easy.
	     * Implementing the API with the point of view of the next one registering
	     * a source is easier, see the ZipFileWorker.
	     * @param {Worker} previous the previous worker, sending events to this one
	     * @return {Worker} the current worker for chainability
	     */
	    registerPrevious : function (previous) {
	        if (this.isLocked) {
	            throw new Error("The stream '" + this + "' has already been used.");
	        }
	
	        // sharing the streamInfo...
	        this.streamInfo = previous.streamInfo;
	        // ... and adding our own bits
	        this.mergeStreamInfo();
	        this.previous =  previous;
	        var self = this;
	        previous.on('data', function (chunk) {
	            self.processChunk(chunk);
	        });
	        previous.on('end', function () {
	            self.end();
	        });
	        previous.on('error', function (e) {
	            self.error(e);
	        });
	        return this;
	    },
	    /**
	     * Pause the stream so it doesn't send events anymore.
	     * @return {Boolean} true if this call paused the worker, false otherwise.
	     */
	    pause : function () {
	        if(this.isPaused || this.isFinished) {
	            return false;
	        }
	        this.isPaused = true;
	
	        if(this.previous) {
	            this.previous.pause();
	        }
	        return true;
	    },
	    /**
	     * Resume a paused stream.
	     * @return {Boolean} true if this call resumed the worker, false otherwise.
	     */
	    resume : function () {
	        if(!this.isPaused || this.isFinished) {
	            return false;
	        }
	        this.isPaused = false;
	
	        // if true, the worker tried to resume but failed
	        var withError = false;
	        if(this.generatedError) {
	            this.error(this.generatedError);
	            withError = true;
	        }
	        if(this.previous) {
	            this.previous.resume();
	        }
	
	        return !withError;
	    },
	    /**
	     * Flush any remaining bytes as the stream is ending.
	     */
	    flush : function () {},
	    /**
	     * Process a chunk. This is usually the method overridden.
	     * @param {Object} chunk the chunk to process.
	     */
	    processChunk : function(chunk) {
	        this.push(chunk);
	    },
	    /**
	     * Add a key/value to be added in the workers chain streamInfo once activated.
	     * @param {String} key the key to use
	     * @param {Object} value the associated value
	     * @return {Worker} the current worker for chainability
	     */
	    withStreamInfo : function (key, value) {
	        this.extraStreamInfo[key] = value;
	        this.mergeStreamInfo();
	        return this;
	    },
	    /**
	     * Merge this worker's streamInfo into the chain's streamInfo.
	     */
	    mergeStreamInfo : function () {
	        for(var key in this.extraStreamInfo) {
	            if (!this.extraStreamInfo.hasOwnProperty(key)) {
	                continue;
	            }
	            this.streamInfo[key] = this.extraStreamInfo[key];
	        }
	    },
	
	    /**
	     * Lock the stream to prevent further updates on the workers chain.
	     * After calling this method, all calls to pipe will fail.
	     */
	    lock: function () {
	        if (this.isLocked) {
	            throw new Error("The stream '" + this + "' has already been used.");
	        }
	        this.isLocked = true;
	        if (this.previous) {
	            this.previous.lock();
	        }
	    },
	
	    /**
	     *
	     * Pretty print the workers chain.
	     */
	    toString : function () {
	        var me = "Worker " + this.name;
	        if (this.previous) {
	            return this.previous + " -> " + me;
	        } else {
	            return me;
	        }
	    }
	};
	
	module.exports = GenericWorker;


/***/ },
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(Buffer) {'use strict';
	
	var utils = __webpack_require__(138);
	var ConvertWorker = __webpack_require__(183);
	var GenericWorker = __webpack_require__(181);
	var base64 = __webpack_require__(172);
	var NodejsStreamOutputAdapter = __webpack_require__(141);
	var external = __webpack_require__(176);
	
	/**
	 * Apply the final transformation of the data. If the user wants a Blob for
	 * example, it's easier to work with an U8intArray and finally do the
	 * ArrayBuffer/Blob conversion.
	 * @param {String} type the name of the final type
	 * @param {String|Uint8Array|Buffer} content the content to transform
	 * @param {String} mimeType the mime type of the content, if applicable.
	 * @return {String|Uint8Array|ArrayBuffer|Buffer|Blob} the content in the right format.
	 */
	function transformZipOutput(type, content, mimeType) {
	    switch(type) {
	        case "blob" :
	            return utils.newBlob(utils.transformTo("arraybuffer", content), mimeType);
	        case "base64" :
	            return base64.encode(content);
	        default :
	            return utils.transformTo(type, content);
	    }
	}
	
	/**
	 * Concatenate an array of data of the given type.
	 * @param {String} type the type of the data in the given array.
	 * @param {Array} dataArray the array containing the data chunks to concatenate
	 * @return {String|Uint8Array|Buffer} the concatenated data
	 * @throws Error if the asked type is unsupported
	 */
	function concat (type, dataArray) {
	    var i, index = 0, res = null, totalLength = 0;
	    for(i = 0; i < dataArray.length; i++) {
	        totalLength += dataArray[i].length;
	    }
	    switch(type) {
	        case "string":
	            return dataArray.join("");
	          case "array":
	            return Array.prototype.concat.apply([], dataArray);
	        case "uint8array":
	            res = new Uint8Array(totalLength);
	            for(i = 0; i < dataArray.length; i++) {
	                res.set(dataArray[i], index);
	                index += dataArray[i].length;
	            }
	            return res;
	        case "nodebuffer":
	            return Buffer.concat(dataArray);
	        default:
	            throw new Error("concat : unsupported type '"  + type + "'");
	    }
	}
	
	/**
	 * Listen a StreamHelper, accumulate its content and concatenate it into a
	 * complete block.
	 * @param {StreamHelper} helper the helper to use.
	 * @param {Function} updateCallback a callback called on each update. Called
	 * with one arg :
	 * - the metadata linked to the update received.
	 * @return Promise the promise for the accumulation.
	 */
	function accumulate(helper, updateCallback) {
	    return new external.Promise(function (resolve, reject){
	        var dataArray = [];
	        var chunkType = helper._internalType,
	            resultType = helper._outputType,
	            mimeType = helper._mimeType;
	        helper
	        .on('data', function (data, meta) {
	            dataArray.push(data);
	            if(updateCallback) {
	                updateCallback(meta);
	            }
	        })
	        .on('error', function(err) {
	            dataArray = [];
	            reject(err);
	        })
	        .on('end', function (){
	            try {
	                var result = transformZipOutput(resultType, concat(chunkType, dataArray), mimeType);
	                resolve(result);
	            } catch (e) {
	                reject(e);
	            }
	            dataArray = [];
	        })
	        .resume();
	    });
	}
	
	/**
	 * An helper to easily use workers outside of JSZip.
	 * @constructor
	 * @param {Worker} worker the worker to wrap
	 * @param {String} outputType the type of data expected by the use
	 * @param {String} mimeType the mime type of the content, if applicable.
	 */
	function StreamHelper(worker, outputType, mimeType) {
	    var internalType = outputType;
	    switch(outputType) {
	        case "blob":
	        case "arraybuffer":
	            internalType = "uint8array";
	        break;
	        case "base64":
	            internalType = "string";
	        break;
	    }
	
	    try {
	        // the type used internally
	        this._internalType = internalType;
	        // the type used to output results
	        this._outputType = outputType;
	        // the mime type
	        this._mimeType = mimeType;
	        utils.checkSupport(internalType);
	        this._worker = worker.pipe(new ConvertWorker(internalType));
	        // the last workers can be rewired without issues but we need to
	        // prevent any updates on previous workers.
	        worker.lock();
	    } catch(e) {
	        this._worker = new GenericWorker("error");
	        this._worker.error(e);
	    }
	}
	
	StreamHelper.prototype = {
	    /**
	     * Listen a StreamHelper, accumulate its content and concatenate it into a
	     * complete block.
	     * @param {Function} updateCb the update callback.
	     * @return Promise the promise for the accumulation.
	     */
	    accumulate : function (updateCb) {
	        return accumulate(this, updateCb);
	    },
	    /**
	     * Add a listener on an event triggered on a stream.
	     * @param {String} evt the name of the event
	     * @param {Function} fn the listener
	     * @return {StreamHelper} the current helper.
	     */
	    on : function (evt, fn) {
	        var self = this;
	
	        if(evt === "data") {
	            this._worker.on(evt, function (chunk) {
	                fn.call(self, chunk.data, chunk.meta);
	            });
	        } else {
	            this._worker.on(evt, function () {
	                utils.delay(fn, arguments, self);
	            });
	        }
	        return this;
	    },
	    /**
	     * Resume the flow of chunks.
	     * @return {StreamHelper} the current helper.
	     */
	    resume : function () {
	        utils.delay(this._worker.resume, [], this._worker);
	        return this;
	    },
	    /**
	     * Pause the flow of chunks.
	     * @return {StreamHelper} the current helper.
	     */
	    pause : function () {
	        this._worker.pause();
	        return this;
	    },
	    /**
	     * Return a nodejs stream for this helper.
	     * @param {Function} updateCb the update callback.
	     * @return {NodejsStreamOutputAdapter} the nodejs stream.
	     */
	    toNodejsStream : function (updateCb) {
	        utils.checkSupport("nodestream");
	        if (this._outputType !== "nodebuffer") {
	            // an object stream containing blob/arraybuffer/uint8array/string
	            // is strange and I don't know if it would be useful.
	            // I you find this comment and have a good usecase, please open a
	            // bug report !
	            throw new Error(this._outputType + " is not supported by this method");
	        }
	
	        return new NodejsStreamOutputAdapter(this, {
	            objectMode : this._outputType !== "nodebuffer"
	        }, updateCb);
	    }
	};
	
	
	module.exports = StreamHelper;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(140).Buffer))

/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var GenericWorker = __webpack_require__(181);
	var utils = __webpack_require__(138);
	
	/**
	 * A worker which convert chunks to a specified type.
	 * @constructor
	 * @param {String} destType the destination type.
	 */
	function ConvertWorker(destType) {
	    GenericWorker.call(this, "ConvertWorker to " + destType);
	    this.destType = destType;
	}
	utils.inherits(ConvertWorker, GenericWorker);
	
	/**
	 * @see GenericWorker.processChunk
	 */
	ConvertWorker.prototype.processChunk = function (chunk) {
	    this.push({
	        data : utils.transformTo(this.destType, chunk.data),
	        meta : chunk.meta
	    });
	};
	module.exports = ConvertWorker;


/***/ },
/* 184 */
/***/ function(module, exports) {

	'use strict';
	exports.base64 = false;
	exports.binary = false;
	exports.dir = false;
	exports.createFolders = true;
	exports.date = null;
	exports.compression = null;
	exports.compressionOptions = null;
	exports.comment = null;
	exports.unixPermissions = null;
	exports.dosPermissions = null;


/***/ },
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var external = __webpack_require__(176);
	var DataWorker = __webpack_require__(186);
	var DataLengthProbe = __webpack_require__(187);
	var Crc32Probe = __webpack_require__(188);
	var DataLengthProbe = __webpack_require__(187);
	
	/**
	 * Represent a compressed object, with everything needed to decompress it.
	 * @constructor
	 * @param {number} compressedSize the size of the data compressed.
	 * @param {number} uncompressedSize the size of the data after decompression.
	 * @param {number} crc32 the crc32 of the decompressed file.
	 * @param {object} compression the type of compression, see lib/compressions.js.
	 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the compressed data.
	 */
	function CompressedObject(compressedSize, uncompressedSize, crc32, compression, data) {
	    this.compressedSize = compressedSize;
	    this.uncompressedSize = uncompressedSize;
	    this.crc32 = crc32;
	    this.compression = compression;
	    this.compressedContent = data;
	}
	
	CompressedObject.prototype = {
	    /**
	     * Create a worker to get the uncompressed content.
	     * @return {GenericWorker} the worker.
	     */
	    getContentWorker : function () {
	        var worker = new DataWorker(external.Promise.resolve(this.compressedContent))
	        .pipe(this.compression.uncompressWorker())
	        .pipe(new DataLengthProbe("data_length"));
	
	        var that = this;
	        worker.on("end", function () {
	            if(this.streamInfo['data_length'] !== that.uncompressedSize) {
	                throw new Error("Bug : uncompressed data size mismatch");
	            }
	        });
	        return worker;
	    },
	    /**
	     * Create a worker to get the compressed content.
	     * @return {GenericWorker} the worker.
	     */
	    getCompressedWorker : function () {
	        return new DataWorker(external.Promise.resolve(this.compressedContent))
	        .withStreamInfo("compressedSize", this.compressedSize)
	        .withStreamInfo("uncompressedSize", this.uncompressedSize)
	        .withStreamInfo("crc32", this.crc32)
	        .withStreamInfo("compression", this.compression)
	        ;
	    }
	};
	
	/**
	 * Chain the given worker with other workers to compress the content with the
	 * given compresion.
	 * @param {GenericWorker} uncompressedWorker the worker to pipe.
	 * @param {Object} compression the compression object.
	 * @param {Object} compressionOptions the options to use when compressing.
	 * @return {GenericWorker} the new worker compressing the content.
	 */
	CompressedObject.createWorkerFrom = function (uncompressedWorker, compression, compressionOptions) {
	    return uncompressedWorker
	    .pipe(new Crc32Probe())
	    .pipe(new DataLengthProbe("uncompressedSize"))
	    .pipe(compression.compressWorker(compressionOptions))
	    .pipe(new DataLengthProbe("compressedSize"))
	    .withStreamInfo("compression", compression);
	};
	
	module.exports = CompressedObject;


/***/ },
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(138);
	var GenericWorker = __webpack_require__(181);
	
	// the size of the generated chunks
	// TODO expose this as a public variable
	var DEFAULT_BLOCK_SIZE = 16 * 1024;
	
	/**
	 * A worker that reads a content and emits chunks.
	 * @constructor
	 * @param {Promise} dataP the promise of the data to split
	 */
	function DataWorker(dataP) {
	    GenericWorker.call(this, "DataWorker");
	    var self = this;
	    this.dataIsReady = false;
	    this.index = 0;
	    this.max = 0;
	    this.data = null;
	    this.type = "";
	
	    this._tickScheduled = false;
	
	    dataP.then(function (data) {
	        self.dataIsReady = true;
	        self.data = data;
	        self.max = data && data.length || 0;
	        self.type = utils.getTypeOf(data);
	        if(!self.isPaused) {
	            self._tickAndRepeat();
	        }
	    }, function (e) {
	        self.error(e);
	    });
	}
	
	utils.inherits(DataWorker, GenericWorker);
	
	/**
	 * @see GenericWorker.cleanUp
	 */
	DataWorker.prototype.cleanUp = function () {
	    GenericWorker.prototype.cleanUp.call(this);
	    this.data = null;
	};
	
	/**
	 * @see GenericWorker.resume
	 */
	DataWorker.prototype.resume = function () {
	    if(!GenericWorker.prototype.resume.call(this)) {
	        return false;
	    }
	
	    if (!this._tickScheduled && this.dataIsReady) {
	        this._tickScheduled = true;
	        utils.delay(this._tickAndRepeat, [], this);
	    }
	    return true;
	};
	
	/**
	 * Trigger a tick a schedule an other call to this function.
	 */
	DataWorker.prototype._tickAndRepeat = function() {
	    this._tickScheduled = false;
	    if(this.isPaused || this.isFinished) {
	        return;
	    }
	    this._tick();
	    if(!this.isFinished) {
	        utils.delay(this._tickAndRepeat, [], this);
	        this._tickScheduled = true;
	    }
	};
	
	/**
	 * Read and push a chunk.
	 */
	DataWorker.prototype._tick = function() {
	
	    if(this.isPaused || this.isFinished) {
	        return false;
	    }
	
	    var size = DEFAULT_BLOCK_SIZE;
	    var data = null, nextIndex = Math.min(this.max, this.index + size);
	    if (this.index >= this.max) {
	        // EOF
	        return this.end();
	    } else {
	        switch(this.type) {
	            case "string":
	                data = this.data.substring(this.index, nextIndex);
	            break;
	            case "uint8array":
	                data = this.data.subarray(this.index, nextIndex);
	            break;
	            case "array":
	            case "nodebuffer":
	                data = this.data.slice(this.index, nextIndex);
	            break;
	        }
	        this.index = nextIndex;
	        return this.push({
	            data : data,
	            meta : {
	                percent : this.max ? this.index / this.max * 100 : 0
	            }
	        });
	    }
	};
	
	module.exports = DataWorker;


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(138);
	var GenericWorker = __webpack_require__(181);
	
	/**
	 * A worker which calculate the total length of the data flowing through.
	 * @constructor
	 * @param {String} propName the name used to expose the length
	 */
	function DataLengthProbe(propName) {
	    GenericWorker.call(this, "DataLengthProbe for " + propName);
	    this.propName = propName;
	    this.withStreamInfo(propName, 0);
	}
	utils.inherits(DataLengthProbe, GenericWorker);
	
	/**
	 * @see GenericWorker.processChunk
	 */
	DataLengthProbe.prototype.processChunk = function (chunk) {
	    if(chunk) {
	        var length = this.streamInfo[this.propName] || 0;
	        this.streamInfo[this.propName] = length + chunk.data.length;
	    }
	    GenericWorker.prototype.processChunk.call(this, chunk);
	};
	module.exports = DataLengthProbe;
	


/***/ },
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var GenericWorker = __webpack_require__(181);
	var crc32 = __webpack_require__(189);
	var utils = __webpack_require__(138);
	
	/**
	 * A worker which calculate the crc32 of the data flowing through.
	 * @constructor
	 */
	function Crc32Probe() {
	    GenericWorker.call(this, "Crc32Probe");
	}
	utils.inherits(Crc32Probe, GenericWorker);
	
	/**
	 * @see GenericWorker.processChunk
	 */
	Crc32Probe.prototype.processChunk = function (chunk) {
	    this.streamInfo.crc32 = crc32(chunk.data, this.streamInfo.crc32 || 0);
	    this.push(chunk);
	};
	module.exports = Crc32Probe;


/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(138);
	
	/**
	 * The following functions come from pako, from pako/lib/zlib/crc32.js
	 * released under the MIT license, see pako https://github.com/nodeca/pako/
	 */
	
	// Use ordinary array, since untyped makes no boost here
	function makeTable() {
	    var c, table = [];
	
	    for(var n =0; n < 256; n++){
	        c = n;
	        for(var k =0; k < 8; k++){
	            c = ((c&1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
	        }
	        table[n] = c;
	    }
	
	    return table;
	}
	
	// Create table on load. Just 255 signed longs. Not a problem.
	var crcTable = makeTable();
	
	
	function crc32(crc, buf, len, pos) {
	    var t = crcTable, end = pos + len;
	
	    crc = crc ^ (-1);
	
	    for (var i = pos; i < end; i++ ) {
	        crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
	    }
	
	    return (crc ^ (-1)); // >>> 0;
	}
	
	// That's all for the pako functions.
	
	/**
	 * Compute the crc32 of a string.
	 * This is almost the same as the function crc32, but for strings. Using the
	 * same function for the two use cases leads to horrible performances.
	 * @param {Number} crc the starting value of the crc.
	 * @param {String} str the string to use.
	 * @param {Number} len the length of the string.
	 * @param {Number} pos the starting position for the crc32 computation.
	 * @return {Number} the computed crc32.
	 */
	function crc32str(crc, str, len, pos) {
	    var t = crcTable, end = pos + len;
	
	    crc = crc ^ (-1);
	
	    for (var i = pos; i < end; i++ ) {
	        crc = (crc >>> 8) ^ t[(crc ^ str.charCodeAt(i)) & 0xFF];
	    }
	
	    return (crc ^ (-1)); // >>> 0;
	}
	
	module.exports = function crc32wrapper(input, crc) {
	    if (typeof input === "undefined" || !input.length) {
	        return 0;
	    }
	
	    var isArray = utils.getTypeOf(input) !== "string";
	
	    if(isArray) {
	        return crc32(crc|0, input, input.length, 0);
	    } else {
	        return crc32str(crc|0, input, input.length, 0);
	    }
	};
	// vim: set shiftwidth=4 softtabstop=4:


/***/ },
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var StreamHelper = __webpack_require__(182);
	var DataWorker = __webpack_require__(186);
	var utf8 = __webpack_require__(137);
	var CompressedObject = __webpack_require__(185);
	var GenericWorker = __webpack_require__(181);
	
	/**
	 * A simple object representing a file in the zip file.
	 * @constructor
	 * @param {string} name the name of the file
	 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data
	 * @param {Object} options the options of the file
	 */
	var ZipObject = function(name, data, options) {
	    this.name = name;
	    this.dir = options.dir;
	    this.date = options.date;
	    this.comment = options.comment;
	    this.unixPermissions = options.unixPermissions;
	    this.dosPermissions = options.dosPermissions;
	
	    this._data = data;
	    this._dataBinary = options.binary;
	    // keep only the compression
	    this.options = {
	        compression : options.compression,
	        compressionOptions : options.compressionOptions
	    };
	};
	
	ZipObject.prototype = {
	    /**
	     * Create an internal stream for the content of this object.
	     * @param {String} type the type of each chunk.
	     * @return StreamHelper the stream.
	     */
	    internalStream: function (type) {
	        var outputType = type.toLowerCase();
	        var askUnicodeString = outputType === "string" || outputType === "text";
	        if (outputType === "binarystring" || outputType === "text") {
	            outputType = "string";
	        }
	        var result = this._decompressWorker();
	
	        var isUnicodeString = !this._dataBinary;
	
	        if (isUnicodeString && !askUnicodeString) {
	            result = result.pipe(new utf8.Utf8EncodeWorker());
	        }
	        if (!isUnicodeString && askUnicodeString) {
	            result = result.pipe(new utf8.Utf8DecodeWorker());
	        }
	
	        return new StreamHelper(result, outputType, "");
	    },
	
	    /**
	     * Prepare the content in the asked type.
	     * @param {String} type the type of the result.
	     * @param {Function} onUpdate a function to call on each internal update.
	     * @return Promise the promise of the result.
	     */
	    async: function (type, onUpdate) {
	        return this.internalStream(type).accumulate(onUpdate);
	    },
	
	    /**
	     * Prepare the content as a nodejs stream.
	     * @param {String} type the type of each chunk.
	     * @param {Function} onUpdate a function to call on each internal update.
	     * @return Stream the stream.
	     */
	    nodeStream: function (type, onUpdate) {
	        return this.internalStream(type || "nodebuffer").toNodejsStream(onUpdate);
	    },
	
	    /**
	     * Return a worker for the compressed content.
	     * @private
	     * @param {Object} compression the compression object to use.
	     * @param {Object} compressionOptions the options to use when compressing.
	     * @return Worker the worker.
	     */
	    _compressWorker: function (compression, compressionOptions) {
	        if (
	            this._data instanceof CompressedObject &&
	            this._data.compression.magic === compression.magic
	        ) {
	            return this._data.getCompressedWorker();
	        } else {
	            var result = this._decompressWorker();
	            if(!this._dataBinary) {
	                result = result.pipe(new utf8.Utf8EncodeWorker());
	            }
	            return CompressedObject.createWorkerFrom(result, compression, compressionOptions);
	        }
	    },
	    /**
	     * Return a worker for the decompressed content.
	     * @private
	     * @return Worker the worker.
	     */
	    _decompressWorker : function () {
	        if (this._data instanceof CompressedObject) {
	            return this._data.getContentWorker();
	        } else if (this._data instanceof GenericWorker) {
	            return this._data;
	        } else {
	            return new DataWorker(this._data);
	        }
	    }
	};
	
	var removedMethods = ["asText", "asBinary", "asNodeBuffer", "asUint8Array", "asArrayBuffer"];
	var removedFn = function () {
	    throw new Error("This method has been removed in JSZip 3.0, please check the upgrade guide.");
	};
	
	for(var i = 0; i < removedMethods.length; i++) {
	    ZipObject.prototype[removedMethods[i]] = removedFn;
	}
	module.exports = ZipObject;


/***/ },
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var compressions = __webpack_require__(192);
	var ZipFileWorker = __webpack_require__(210);
	
	/**
	 * Find the compression to use.
	 * @param {String} fileCompression the compression defined at the file level, if any.
	 * @param {String} zipCompression the compression defined at the load() level.
	 * @return {Object} the compression object to use.
	 */
	var getCompression = function (fileCompression, zipCompression) {
	
	    var compressionName = fileCompression || zipCompression;
	    var compression = compressions[compressionName];
	    if (!compression) {
	        throw new Error(compressionName + " is not a valid compression method !");
	    }
	    return compression;
	};
	
	/**
	 * Create a worker to generate a zip file.
	 * @param {JSZip} zip the JSZip instance at the right root level.
	 * @param {Object} options to generate the zip file.
	 * @param {String} comment the comment to use.
	 */
	exports.generateWorker = function (zip, options, comment) {
	
	    var zipFileWorker = new ZipFileWorker(options.streamFiles, comment, options.platform, options.encodeFileName);
	    var entriesCount = 0;
	    try {
	
	        zip.forEach(function (relativePath, file) {
	            entriesCount++;
	            var compression = getCompression(file.options.compression, options.compression);
	            var compressionOptions = file.options.compressionOptions || options.compressionOptions || {};
	            var dir = file.dir, date = file.date;
	
	            file._compressWorker(compression, compressionOptions)
	            .withStreamInfo("file", {
	                name : relativePath,
	                dir : dir,
	                date : date,
	                comment : file.comment || "",
	                unixPermissions : file.unixPermissions,
	                dosPermissions : file.dosPermissions
	            })
	            .pipe(zipFileWorker);
	        });
	        zipFileWorker.entriesCount = entriesCount;
	    } catch (e) {
	        zipFileWorker.error(e);
	    }
	
	    return zipFileWorker;
	};


/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var GenericWorker = __webpack_require__(181);
	
	exports.STORE = {
	    magic: "\x00\x00",
	    compressWorker : function (compressionOptions) {
	        return new GenericWorker("STORE compression");
	    },
	    uncompressWorker : function () {
	        return new GenericWorker("STORE decompression");
	    }
	};
	exports.DEFLATE = __webpack_require__(193);


/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var USE_TYPEDARRAY = (typeof Uint8Array !== 'undefined') && (typeof Uint16Array !== 'undefined') && (typeof Uint32Array !== 'undefined');
	
	var pako = __webpack_require__(194);
	var utils = __webpack_require__(138);
	var GenericWorker = __webpack_require__(181);
	
	var ARRAY_TYPE = USE_TYPEDARRAY ? "uint8array" : "array";
	
	exports.magic = "\x08\x00";
	
	/**
	 * Create a worker that uses pako to inflate/deflate.
	 * @constructor
	 * @param {String} action the name of the pako function to call : either "Deflate" or "Inflate".
	 * @param {Object} options the options to use when (de)compressing.
	 */
	function FlateWorker(action, options) {
	    GenericWorker.call(this, "FlateWorker/" + action);
	
	    this._pako = new pako[action]({
	        raw:true,
	        level : options.level || -1 // default compression
	    });
	    // the `meta` object from the last chunk received
	    // this allow this worker to pass around metadata
	    this.meta = {};
	
	    var self = this;
	    this._pako.onData = function(data) {
	        self.push({
	            data : data,
	            meta : self.meta
	        });
	    };
	}
	
	utils.inherits(FlateWorker, GenericWorker);
	
	/**
	 * @see GenericWorker.processChunk
	 */
	FlateWorker.prototype.processChunk = function (chunk) {
	    this.meta = chunk.meta;
	    this._pako.push(utils.transformTo(ARRAY_TYPE, chunk.data), false);
	};
	
	/**
	 * @see GenericWorker.flush
	 */
	FlateWorker.prototype.flush = function () {
	    GenericWorker.prototype.flush.call(this);
	    this._pako.push([], true);
	};
	/**
	 * @see GenericWorker.cleanUp
	 */
	FlateWorker.prototype.cleanUp = function () {
	    GenericWorker.prototype.cleanUp.call(this);
	    this._pako = null;
	};
	
	exports.compressWorker = function (compressionOptions) {
	    return new FlateWorker("Deflate", compressionOptions);
	};
	exports.uncompressWorker = function () {
	    return new FlateWorker("Inflate", {});
	};


/***/ },
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	// Top level file is just a mixin of submodules & constants
	'use strict';
	
	var assign    = __webpack_require__(195).assign;
	
	var deflate   = __webpack_require__(196);
	var inflate   = __webpack_require__(204);
	var constants = __webpack_require__(208);
	
	var pako = {};
	
	assign(pako, deflate, inflate, constants);
	
	module.exports = pako;


/***/ },
/* 195 */
/***/ function(module, exports) {

	'use strict';
	
	
	var TYPED_OK =  (typeof Uint8Array !== 'undefined') &&
	                (typeof Uint16Array !== 'undefined') &&
	                (typeof Int32Array !== 'undefined');
	
	
	exports.assign = function (obj /*from1, from2, from3, ...*/) {
	  var sources = Array.prototype.slice.call(arguments, 1);
	  while (sources.length) {
	    var source = sources.shift();
	    if (!source) { continue; }
	
	    if (typeof source !== 'object') {
	      throw new TypeError(source + 'must be non-object');
	    }
	
	    for (var p in source) {
	      if (source.hasOwnProperty(p)) {
	        obj[p] = source[p];
	      }
	    }
	  }
	
	  return obj;
	};
	
	
	// reduce buffer size, avoiding mem copy
	exports.shrinkBuf = function (buf, size) {
	  if (buf.length === size) { return buf; }
	  if (buf.subarray) { return buf.subarray(0, size); }
	  buf.length = size;
	  return buf;
	};
	
	
	var fnTyped = {
	  arraySet: function (dest, src, src_offs, len, dest_offs) {
	    if (src.subarray && dest.subarray) {
	      dest.set(src.subarray(src_offs, src_offs + len), dest_offs);
	      return;
	    }
	    // Fallback to ordinary array
	    for (var i = 0; i < len; i++) {
	      dest[dest_offs + i] = src[src_offs + i];
	    }
	  },
	  // Join array of chunks to single array.
	  flattenChunks: function (chunks) {
	    var i, l, len, pos, chunk, result;
	
	    // calculate data length
	    len = 0;
	    for (i = 0, l = chunks.length; i < l; i++) {
	      len += chunks[i].length;
	    }
	
	    // join chunks
	    result = new Uint8Array(len);
	    pos = 0;
	    for (i = 0, l = chunks.length; i < l; i++) {
	      chunk = chunks[i];
	      result.set(chunk, pos);
	      pos += chunk.length;
	    }
	
	    return result;
	  }
	};
	
	var fnUntyped = {
	  arraySet: function (dest, src, src_offs, len, dest_offs) {
	    for (var i = 0; i < len; i++) {
	      dest[dest_offs + i] = src[src_offs + i];
	    }
	  },
	  // Join array of chunks to single array.
	  flattenChunks: function (chunks) {
	    return [].concat.apply([], chunks);
	  }
	};
	
	
	// Enable/Disable typed arrays use, for testing
	//
	exports.setTyped = function (on) {
	  if (on) {
	    exports.Buf8  = Uint8Array;
	    exports.Buf16 = Uint16Array;
	    exports.Buf32 = Int32Array;
	    exports.assign(exports, fnTyped);
	  } else {
	    exports.Buf8  = Array;
	    exports.Buf16 = Array;
	    exports.Buf32 = Array;
	    exports.assign(exports, fnUntyped);
	  }
	};
	
	exports.setTyped(TYPED_OK);


/***/ },
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	var zlib_deflate = __webpack_require__(197);
	var utils        = __webpack_require__(195);
	var strings      = __webpack_require__(202);
	var msg          = __webpack_require__(201);
	var ZStream      = __webpack_require__(203);
	
	var toString = Object.prototype.toString;
	
	/* Public constants ==========================================================*/
	/* ===========================================================================*/
	
	var Z_NO_FLUSH      = 0;
	var Z_FINISH        = 4;
	
	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	var Z_SYNC_FLUSH    = 2;
	
	var Z_DEFAULT_COMPRESSION = -1;
	
	var Z_DEFAULT_STRATEGY    = 0;
	
	var Z_DEFLATED  = 8;
	
	/* ===========================================================================*/
	
	
	/**
	 * class Deflate
	 *
	 * Generic JS-style wrapper for zlib calls. If you don't need
	 * streaming behaviour - use more simple functions: [[deflate]],
	 * [[deflateRaw]] and [[gzip]].
	 **/
	
	/* internal
	 * Deflate.chunks -> Array
	 *
	 * Chunks of output data, if [[Deflate#onData]] not overriden.
	 **/
	
	/**
	 * Deflate.result -> Uint8Array|Array
	 *
	 * Compressed result, generated by default [[Deflate#onData]]
	 * and [[Deflate#onEnd]] handlers. Filled after you push last chunk
	 * (call [[Deflate#push]] with `Z_FINISH` / `true` param)  or if you
	 * push a chunk with explicit flush (call [[Deflate#push]] with
	 * `Z_SYNC_FLUSH` param).
	 **/
	
	/**
	 * Deflate.err -> Number
	 *
	 * Error code after deflate finished. 0 (Z_OK) on success.
	 * You will not need it in real life, because deflate errors
	 * are possible only on wrong options or bad `onData` / `onEnd`
	 * custom handlers.
	 **/
	
	/**
	 * Deflate.msg -> String
	 *
	 * Error message, if [[Deflate.err]] != 0
	 **/
	
	
	/**
	 * new Deflate(options)
	 * - options (Object): zlib deflate options.
	 *
	 * Creates new deflator instance with specified params. Throws exception
	 * on bad params. Supported options:
	 *
	 * - `level`
	 * - `windowBits`
	 * - `memLevel`
	 * - `strategy`
	 * - `dictionary`
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Additional options, for internal needs:
	 *
	 * - `chunkSize` - size of generated data chunks (16K by default)
	 * - `raw` (Boolean) - do raw deflate
	 * - `gzip` (Boolean) - create gzip wrapper
	 * - `to` (String) - if equal to 'string', then result will be "binary string"
	 *    (each char code [0..255])
	 * - `header` (Object) - custom header for gzip
	 *   - `text` (Boolean) - true if compressed data believed to be text
	 *   - `time` (Number) - modification time, unix timestamp
	 *   - `os` (Number) - operation system code
	 *   - `extra` (Array) - array of bytes with extra data (max 65536)
	 *   - `name` (String) - file name (binary string)
	 *   - `comment` (String) - comment (binary string)
	 *   - `hcrc` (Boolean) - true if header crc should be added
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
	 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	 *
	 * var deflate = new pako.Deflate({ level: 3});
	 *
	 * deflate.push(chunk1, false);
	 * deflate.push(chunk2, true);  // true -> last chunk
	 *
	 * if (deflate.err) { throw new Error(deflate.err); }
	 *
	 * console.log(deflate.result);
	 * ```
	 **/
	function Deflate(options) {
	  if (!(this instanceof Deflate)) return new Deflate(options);
	
	  this.options = utils.assign({
	    level: Z_DEFAULT_COMPRESSION,
	    method: Z_DEFLATED,
	    chunkSize: 16384,
	    windowBits: 15,
	    memLevel: 8,
	    strategy: Z_DEFAULT_STRATEGY,
	    to: ''
	  }, options || {});
	
	  var opt = this.options;
	
	  if (opt.raw && (opt.windowBits > 0)) {
	    opt.windowBits = -opt.windowBits;
	  }
	
	  else if (opt.gzip && (opt.windowBits > 0) && (opt.windowBits < 16)) {
	    opt.windowBits += 16;
	  }
	
	  this.err    = 0;      // error code, if happens (0 = Z_OK)
	  this.msg    = '';     // error message
	  this.ended  = false;  // used to avoid multiple onEnd() calls
	  this.chunks = [];     // chunks of compressed data
	
	  this.strm = new ZStream();
	  this.strm.avail_out = 0;
	
	  var status = zlib_deflate.deflateInit2(
	    this.strm,
	    opt.level,
	    opt.method,
	    opt.windowBits,
	    opt.memLevel,
	    opt.strategy
	  );
	
	  if (status !== Z_OK) {
	    throw new Error(msg[status]);
	  }
	
	  if (opt.header) {
	    zlib_deflate.deflateSetHeader(this.strm, opt.header);
	  }
	
	  if (opt.dictionary) {
	    var dict;
	    // Convert data if needed
	    if (typeof opt.dictionary === 'string') {
	      // If we need to compress text, change encoding to utf8.
	      dict = strings.string2buf(opt.dictionary);
	    } else if (toString.call(opt.dictionary) === '[object ArrayBuffer]') {
	      dict = new Uint8Array(opt.dictionary);
	    } else {
	      dict = opt.dictionary;
	    }
	
	    status = zlib_deflate.deflateSetDictionary(this.strm, dict);
	
	    if (status !== Z_OK) {
	      throw new Error(msg[status]);
	    }
	
	    this._dict_set = true;
	  }
	}
	
	/**
	 * Deflate#push(data[, mode]) -> Boolean
	 * - data (Uint8Array|Array|ArrayBuffer|String): input data. Strings will be
	 *   converted to utf8 byte sequence.
	 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
	 *
	 * Sends input data to deflate pipe, generating [[Deflate#onData]] calls with
	 * new compressed chunks. Returns `true` on success. The last data block must have
	 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
	 * [[Deflate#onEnd]]. For interim explicit flushes (without ending the stream) you
	 * can use mode Z_SYNC_FLUSH, keeping the compression context.
	 *
	 * On fail call [[Deflate#onEnd]] with error code and return false.
	 *
	 * We strongly recommend to use `Uint8Array` on input for best speed (output
	 * array format is detected automatically). Also, don't skip last param and always
	 * use the same type in your code (boolean or number). That will improve JS speed.
	 *
	 * For regular `Array`-s make sure all elements are [0..255].
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * push(chunk, false); // push one of data chunks
	 * ...
	 * push(chunk, true);  // push last chunk
	 * ```
	 **/
	Deflate.prototype.push = function (data, mode) {
	  var strm = this.strm;
	  var chunkSize = this.options.chunkSize;
	  var status, _mode;
	
	  if (this.ended) { return false; }
	
	  _mode = (mode === ~~mode) ? mode : ((mode === true) ? Z_FINISH : Z_NO_FLUSH);
	
	  // Convert data if needed
	  if (typeof data === 'string') {
	    // If we need to compress text, change encoding to utf8.
	    strm.input = strings.string2buf(data);
	  } else if (toString.call(data) === '[object ArrayBuffer]') {
	    strm.input = new Uint8Array(data);
	  } else {
	    strm.input = data;
	  }
	
	  strm.next_in = 0;
	  strm.avail_in = strm.input.length;
	
	  do {
	    if (strm.avail_out === 0) {
	      strm.output = new utils.Buf8(chunkSize);
	      strm.next_out = 0;
	      strm.avail_out = chunkSize;
	    }
	    status = zlib_deflate.deflate(strm, _mode);    /* no bad return value */
	
	    if (status !== Z_STREAM_END && status !== Z_OK) {
	      this.onEnd(status);
	      this.ended = true;
	      return false;
	    }
	    if (strm.avail_out === 0 || (strm.avail_in === 0 && (_mode === Z_FINISH || _mode === Z_SYNC_FLUSH))) {
	      if (this.options.to === 'string') {
	        this.onData(strings.buf2binstring(utils.shrinkBuf(strm.output, strm.next_out)));
	      } else {
	        this.onData(utils.shrinkBuf(strm.output, strm.next_out));
	      }
	    }
	  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== Z_STREAM_END);
	
	  // Finalize on the last chunk.
	  if (_mode === Z_FINISH) {
	    status = zlib_deflate.deflateEnd(this.strm);
	    this.onEnd(status);
	    this.ended = true;
	    return status === Z_OK;
	  }
	
	  // callback interim results if Z_SYNC_FLUSH.
	  if (_mode === Z_SYNC_FLUSH) {
	    this.onEnd(Z_OK);
	    strm.avail_out = 0;
	    return true;
	  }
	
	  return true;
	};
	
	
	/**
	 * Deflate#onData(chunk) -> Void
	 * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
	 *   on js engine support. When string output requested, each chunk
	 *   will be string.
	 *
	 * By default, stores data blocks in `chunks[]` property and glue
	 * those in `onEnd`. Override this handler, if you need another behaviour.
	 **/
	Deflate.prototype.onData = function (chunk) {
	  this.chunks.push(chunk);
	};
	
	
	/**
	 * Deflate#onEnd(status) -> Void
	 * - status (Number): deflate status. 0 (Z_OK) on success,
	 *   other if not.
	 *
	 * Called once after you tell deflate that the input stream is
	 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
	 * or if an error happened. By default - join collected chunks,
	 * free memory and fill `results` / `err` properties.
	 **/
	Deflate.prototype.onEnd = function (status) {
	  // On success - join
	  if (status === Z_OK) {
	    if (this.options.to === 'string') {
	      this.result = this.chunks.join('');
	    } else {
	      this.result = utils.flattenChunks(this.chunks);
	    }
	  }
	  this.chunks = [];
	  this.err = status;
	  this.msg = this.strm.msg;
	};
	
	
	/**
	 * deflate(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * Compress `data` with deflate algorithm and `options`.
	 *
	 * Supported options are:
	 *
	 * - level
	 * - windowBits
	 * - memLevel
	 * - strategy
	 * - dictionary
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Sugar (options):
	 *
	 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	 *   negative windowBits implicitly.
	 * - `to` (String) - if equal to 'string', then result will be "binary string"
	 *    (each char code [0..255])
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , data = Uint8Array([1,2,3,4,5,6,7,8,9]);
	 *
	 * console.log(pako.deflate(data));
	 * ```
	 **/
	function deflate(input, options) {
	  var deflator = new Deflate(options);
	
	  deflator.push(input, true);
	
	  // That will never happens, if you don't cheat with options :)
	  if (deflator.err) { throw deflator.msg; }
	
	  return deflator.result;
	}
	
	
	/**
	 * deflateRaw(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * The same as [[deflate]], but creates raw data, without wrapper
	 * (header and adler32 crc).
	 **/
	function deflateRaw(input, options) {
	  options = options || {};
	  options.raw = true;
	  return deflate(input, options);
	}
	
	
	/**
	 * gzip(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to compress.
	 * - options (Object): zlib deflate options.
	 *
	 * The same as [[deflate]], but create gzip wrapper instead of
	 * deflate one.
	 **/
	function gzip(input, options) {
	  options = options || {};
	  options.gzip = true;
	  return deflate(input, options);
	}
	
	
	exports.Deflate = Deflate;
	exports.deflate = deflate;
	exports.deflateRaw = deflateRaw;
	exports.gzip = gzip;


/***/ },
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils   = __webpack_require__(195);
	var trees   = __webpack_require__(198);
	var adler32 = __webpack_require__(199);
	var crc32   = __webpack_require__(200);
	var msg     = __webpack_require__(201);
	
	/* Public constants ==========================================================*/
	/* ===========================================================================*/
	
	
	/* Allowed flush values; see deflate() and inflate() below for details */
	var Z_NO_FLUSH      = 0;
	var Z_PARTIAL_FLUSH = 1;
	//var Z_SYNC_FLUSH    = 2;
	var Z_FULL_FLUSH    = 3;
	var Z_FINISH        = 4;
	var Z_BLOCK         = 5;
	//var Z_TREES         = 6;
	
	
	/* Return codes for the compression/decompression functions. Negative values
	 * are errors, positive values are used for special but normal events.
	 */
	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	//var Z_NEED_DICT     = 2;
	//var Z_ERRNO         = -1;
	var Z_STREAM_ERROR  = -2;
	var Z_DATA_ERROR    = -3;
	//var Z_MEM_ERROR     = -4;
	var Z_BUF_ERROR     = -5;
	//var Z_VERSION_ERROR = -6;
	
	
	/* compression levels */
	//var Z_NO_COMPRESSION      = 0;
	//var Z_BEST_SPEED          = 1;
	//var Z_BEST_COMPRESSION    = 9;
	var Z_DEFAULT_COMPRESSION = -1;
	
	
	var Z_FILTERED            = 1;
	var Z_HUFFMAN_ONLY        = 2;
	var Z_RLE                 = 3;
	var Z_FIXED               = 4;
	var Z_DEFAULT_STRATEGY    = 0;
	
	/* Possible values of the data_type field (though see inflate()) */
	//var Z_BINARY              = 0;
	//var Z_TEXT                = 1;
	//var Z_ASCII               = 1; // = Z_TEXT
	var Z_UNKNOWN             = 2;
	
	
	/* The deflate compression method */
	var Z_DEFLATED  = 8;
	
	/*============================================================================*/
	
	
	var MAX_MEM_LEVEL = 9;
	/* Maximum value for memLevel in deflateInit2 */
	var MAX_WBITS = 15;
	/* 32K LZ77 window */
	var DEF_MEM_LEVEL = 8;
	
	
	var LENGTH_CODES  = 29;
	/* number of length codes, not counting the special END_BLOCK code */
	var LITERALS      = 256;
	/* number of literal bytes 0..255 */
	var L_CODES       = LITERALS + 1 + LENGTH_CODES;
	/* number of Literal or Length codes, including the END_BLOCK code */
	var D_CODES       = 30;
	/* number of distance codes */
	var BL_CODES      = 19;
	/* number of codes used to transfer the bit lengths */
	var HEAP_SIZE     = 2 * L_CODES + 1;
	/* maximum heap size */
	var MAX_BITS  = 15;
	/* All codes must not exceed MAX_BITS bits */
	
	var MIN_MATCH = 3;
	var MAX_MATCH = 258;
	var MIN_LOOKAHEAD = (MAX_MATCH + MIN_MATCH + 1);
	
	var PRESET_DICT = 0x20;
	
	var INIT_STATE = 42;
	var EXTRA_STATE = 69;
	var NAME_STATE = 73;
	var COMMENT_STATE = 91;
	var HCRC_STATE = 103;
	var BUSY_STATE = 113;
	var FINISH_STATE = 666;
	
	var BS_NEED_MORE      = 1; /* block not completed, need more input or more output */
	var BS_BLOCK_DONE     = 2; /* block flush performed */
	var BS_FINISH_STARTED = 3; /* finish started, need only more output at next deflate */
	var BS_FINISH_DONE    = 4; /* finish done, accept no more input or output */
	
	var OS_CODE = 0x03; // Unix :) . Don't detect, use this default.
	
	function err(strm, errorCode) {
	  strm.msg = msg[errorCode];
	  return errorCode;
	}
	
	function rank(f) {
	  return ((f) << 1) - ((f) > 4 ? 9 : 0);
	}
	
	function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }
	
	
	/* =========================================================================
	 * Flush as much pending output as possible. All deflate() output goes
	 * through this function so some applications may wish to modify it
	 * to avoid allocating a large strm->output buffer and copying into it.
	 * (See also read_buf()).
	 */
	function flush_pending(strm) {
	  var s = strm.state;
	
	  //_tr_flush_bits(s);
	  var len = s.pending;
	  if (len > strm.avail_out) {
	    len = strm.avail_out;
	  }
	  if (len === 0) { return; }
	
	  utils.arraySet(strm.output, s.pending_buf, s.pending_out, len, strm.next_out);
	  strm.next_out += len;
	  s.pending_out += len;
	  strm.total_out += len;
	  strm.avail_out -= len;
	  s.pending -= len;
	  if (s.pending === 0) {
	    s.pending_out = 0;
	  }
	}
	
	
	function flush_block_only(s, last) {
	  trees._tr_flush_block(s, (s.block_start >= 0 ? s.block_start : -1), s.strstart - s.block_start, last);
	  s.block_start = s.strstart;
	  flush_pending(s.strm);
	}
	
	
	function put_byte(s, b) {
	  s.pending_buf[s.pending++] = b;
	}
	
	
	/* =========================================================================
	 * Put a short in the pending buffer. The 16-bit value is put in MSB order.
	 * IN assertion: the stream state is correct and there is enough room in
	 * pending_buf.
	 */
	function putShortMSB(s, b) {
	//  put_byte(s, (Byte)(b >> 8));
	//  put_byte(s, (Byte)(b & 0xff));
	  s.pending_buf[s.pending++] = (b >>> 8) & 0xff;
	  s.pending_buf[s.pending++] = b & 0xff;
	}
	
	
	/* ===========================================================================
	 * Read a new buffer from the current input stream, update the adler32
	 * and total number of bytes read.  All deflate() input goes through
	 * this function so some applications may wish to modify it to avoid
	 * allocating a large strm->input buffer and copying from it.
	 * (See also flush_pending()).
	 */
	function read_buf(strm, buf, start, size) {
	  var len = strm.avail_in;
	
	  if (len > size) { len = size; }
	  if (len === 0) { return 0; }
	
	  strm.avail_in -= len;
	
	  // zmemcpy(buf, strm->next_in, len);
	  utils.arraySet(buf, strm.input, strm.next_in, len, start);
	  if (strm.state.wrap === 1) {
	    strm.adler = adler32(strm.adler, buf, len, start);
	  }
	
	  else if (strm.state.wrap === 2) {
	    strm.adler = crc32(strm.adler, buf, len, start);
	  }
	
	  strm.next_in += len;
	  strm.total_in += len;
	
	  return len;
	}
	
	
	/* ===========================================================================
	 * Set match_start to the longest match starting at the given string and
	 * return its length. Matches shorter or equal to prev_length are discarded,
	 * in which case the result is equal to prev_length and match_start is
	 * garbage.
	 * IN assertions: cur_match is the head of the hash chain for the current
	 *   string (strstart) and its distance is <= MAX_DIST, and prev_length >= 1
	 * OUT assertion: the match length is not greater than s->lookahead.
	 */
	function longest_match(s, cur_match) {
	  var chain_length = s.max_chain_length;      /* max hash chain length */
	  var scan = s.strstart; /* current string */
	  var match;                       /* matched string */
	  var len;                           /* length of current match */
	  var best_len = s.prev_length;              /* best match length so far */
	  var nice_match = s.nice_match;             /* stop if match long enough */
	  var limit = (s.strstart > (s.w_size - MIN_LOOKAHEAD)) ?
	      s.strstart - (s.w_size - MIN_LOOKAHEAD) : 0/*NIL*/;
	
	  var _win = s.window; // shortcut
	
	  var wmask = s.w_mask;
	  var prev  = s.prev;
	
	  /* Stop when cur_match becomes <= limit. To simplify the code,
	   * we prevent matches with the string of window index 0.
	   */
	
	  var strend = s.strstart + MAX_MATCH;
	  var scan_end1  = _win[scan + best_len - 1];
	  var scan_end   = _win[scan + best_len];
	
	  /* The code is optimized for HASH_BITS >= 8 and MAX_MATCH-2 multiple of 16.
	   * It is easy to get rid of this optimization if necessary.
	   */
	  // Assert(s->hash_bits >= 8 && MAX_MATCH == 258, "Code too clever");
	
	  /* Do not waste too much time if we already have a good match: */
	  if (s.prev_length >= s.good_match) {
	    chain_length >>= 2;
	  }
	  /* Do not look for matches beyond the end of the input. This is necessary
	   * to make deflate deterministic.
	   */
	  if (nice_match > s.lookahead) { nice_match = s.lookahead; }
	
	  // Assert((ulg)s->strstart <= s->window_size-MIN_LOOKAHEAD, "need lookahead");
	
	  do {
	    // Assert(cur_match < s->strstart, "no future");
	    match = cur_match;
	
	    /* Skip to next match if the match length cannot increase
	     * or if the match length is less than 2.  Note that the checks below
	     * for insufficient lookahead only occur occasionally for performance
	     * reasons.  Therefore uninitialized memory will be accessed, and
	     * conditional jumps will be made that depend on those values.
	     * However the length of the match is limited to the lookahead, so
	     * the output of deflate is not affected by the uninitialized values.
	     */
	
	    if (_win[match + best_len]     !== scan_end  ||
	        _win[match + best_len - 1] !== scan_end1 ||
	        _win[match]                !== _win[scan] ||
	        _win[++match]              !== _win[scan + 1]) {
	      continue;
	    }
	
	    /* The check at best_len-1 can be removed because it will be made
	     * again later. (This heuristic is not always a win.)
	     * It is not necessary to compare scan[2] and match[2] since they
	     * are always equal when the other bytes match, given that
	     * the hash keys are equal and that HASH_BITS >= 8.
	     */
	    scan += 2;
	    match++;
	    // Assert(*scan == *match, "match[2]?");
	
	    /* We check for insufficient lookahead only every 8th comparison;
	     * the 256th check will be made at strstart+258.
	     */
	    do {
	      /*jshint noempty:false*/
	    } while (_win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             _win[++scan] === _win[++match] && _win[++scan] === _win[++match] &&
	             scan < strend);
	
	    // Assert(scan <= s->window+(unsigned)(s->window_size-1), "wild scan");
	
	    len = MAX_MATCH - (strend - scan);
	    scan = strend - MAX_MATCH;
	
	    if (len > best_len) {
	      s.match_start = cur_match;
	      best_len = len;
	      if (len >= nice_match) {
	        break;
	      }
	      scan_end1  = _win[scan + best_len - 1];
	      scan_end   = _win[scan + best_len];
	    }
	  } while ((cur_match = prev[cur_match & wmask]) > limit && --chain_length !== 0);
	
	  if (best_len <= s.lookahead) {
	    return best_len;
	  }
	  return s.lookahead;
	}
	
	
	/* ===========================================================================
	 * Fill the window when the lookahead becomes insufficient.
	 * Updates strstart and lookahead.
	 *
	 * IN assertion: lookahead < MIN_LOOKAHEAD
	 * OUT assertions: strstart <= window_size-MIN_LOOKAHEAD
	 *    At least one byte has been read, or avail_in == 0; reads are
	 *    performed for at least two bytes (required for the zip translate_eol
	 *    option -- not supported here).
	 */
	function fill_window(s) {
	  var _w_size = s.w_size;
	  var p, n, m, more, str;
	
	  //Assert(s->lookahead < MIN_LOOKAHEAD, "already enough lookahead");
	
	  do {
	    more = s.window_size - s.lookahead - s.strstart;
	
	    // JS ints have 32 bit, block below not needed
	    /* Deal with !@#$% 64K limit: */
	    //if (sizeof(int) <= 2) {
	    //    if (more == 0 && s->strstart == 0 && s->lookahead == 0) {
	    //        more = wsize;
	    //
	    //  } else if (more == (unsigned)(-1)) {
	    //        /* Very unlikely, but possible on 16 bit machine if
	    //         * strstart == 0 && lookahead == 1 (input done a byte at time)
	    //         */
	    //        more--;
	    //    }
	    //}
	
	
	    /* If the window is almost full and there is insufficient lookahead,
	     * move the upper half to the lower one to make room in the upper half.
	     */
	    if (s.strstart >= _w_size + (_w_size - MIN_LOOKAHEAD)) {
	
	      utils.arraySet(s.window, s.window, _w_size, _w_size, 0);
	      s.match_start -= _w_size;
	      s.strstart -= _w_size;
	      /* we now have strstart >= MAX_DIST */
	      s.block_start -= _w_size;
	
	      /* Slide the hash table (could be avoided with 32 bit values
	       at the expense of memory usage). We slide even when level == 0
	       to keep the hash table consistent if we switch back to level > 0
	       later. (Using level 0 permanently is not an optimal usage of
	       zlib, so we don't care about this pathological case.)
	       */
	
	      n = s.hash_size;
	      p = n;
	      do {
	        m = s.head[--p];
	        s.head[p] = (m >= _w_size ? m - _w_size : 0);
	      } while (--n);
	
	      n = _w_size;
	      p = n;
	      do {
	        m = s.prev[--p];
	        s.prev[p] = (m >= _w_size ? m - _w_size : 0);
	        /* If n is not on any hash chain, prev[n] is garbage but
	         * its value will never be used.
	         */
	      } while (--n);
	
	      more += _w_size;
	    }
	    if (s.strm.avail_in === 0) {
	      break;
	    }
	
	    /* If there was no sliding:
	     *    strstart <= WSIZE+MAX_DIST-1 && lookahead <= MIN_LOOKAHEAD - 1 &&
	     *    more == window_size - lookahead - strstart
	     * => more >= window_size - (MIN_LOOKAHEAD-1 + WSIZE + MAX_DIST-1)
	     * => more >= window_size - 2*WSIZE + 2
	     * In the BIG_MEM or MMAP case (not yet supported),
	     *   window_size == input_size + MIN_LOOKAHEAD  &&
	     *   strstart + s->lookahead <= input_size => more >= MIN_LOOKAHEAD.
	     * Otherwise, window_size == 2*WSIZE so more >= 2.
	     * If there was sliding, more >= WSIZE. So in all cases, more >= 2.
	     */
	    //Assert(more >= 2, "more < 2");
	    n = read_buf(s.strm, s.window, s.strstart + s.lookahead, more);
	    s.lookahead += n;
	
	    /* Initialize the hash value now that we have some input: */
	    if (s.lookahead + s.insert >= MIN_MATCH) {
	      str = s.strstart - s.insert;
	      s.ins_h = s.window[str];
	
	      /* UPDATE_HASH(s, s->ins_h, s->window[str + 1]); */
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + 1]) & s.hash_mask;
	//#if MIN_MATCH != 3
	//        Call update_hash() MIN_MATCH-3 more times
	//#endif
	      while (s.insert) {
	        /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
	        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
	
	        s.prev[str & s.w_mask] = s.head[s.ins_h];
	        s.head[s.ins_h] = str;
	        str++;
	        s.insert--;
	        if (s.lookahead + s.insert < MIN_MATCH) {
	          break;
	        }
	      }
	    }
	    /* If the whole input has less than MIN_MATCH bytes, ins_h is garbage,
	     * but this is not important since only literal bytes will be emitted.
	     */
	
	  } while (s.lookahead < MIN_LOOKAHEAD && s.strm.avail_in !== 0);
	
	  /* If the WIN_INIT bytes after the end of the current data have never been
	   * written, then zero those bytes in order to avoid memory check reports of
	   * the use of uninitialized (or uninitialised as Julian writes) bytes by
	   * the longest match routines.  Update the high water mark for the next
	   * time through here.  WIN_INIT is set to MAX_MATCH since the longest match
	   * routines allow scanning to strstart + MAX_MATCH, ignoring lookahead.
	   */
	//  if (s.high_water < s.window_size) {
	//    var curr = s.strstart + s.lookahead;
	//    var init = 0;
	//
	//    if (s.high_water < curr) {
	//      /* Previous high water mark below current data -- zero WIN_INIT
	//       * bytes or up to end of window, whichever is less.
	//       */
	//      init = s.window_size - curr;
	//      if (init > WIN_INIT)
	//        init = WIN_INIT;
	//      zmemzero(s->window + curr, (unsigned)init);
	//      s->high_water = curr + init;
	//    }
	//    else if (s->high_water < (ulg)curr + WIN_INIT) {
	//      /* High water mark at or above current data, but below current data
	//       * plus WIN_INIT -- zero out to current data plus WIN_INIT, or up
	//       * to end of window, whichever is less.
	//       */
	//      init = (ulg)curr + WIN_INIT - s->high_water;
	//      if (init > s->window_size - s->high_water)
	//        init = s->window_size - s->high_water;
	//      zmemzero(s->window + s->high_water, (unsigned)init);
	//      s->high_water += init;
	//    }
	//  }
	//
	//  Assert((ulg)s->strstart <= s->window_size - MIN_LOOKAHEAD,
	//    "not enough room for search");
	}
	
	/* ===========================================================================
	 * Copy without compression as much as possible from the input stream, return
	 * the current block state.
	 * This function does not insert new strings in the dictionary since
	 * uncompressible data is probably not useful. This function is used
	 * only for the level=0 compression option.
	 * NOTE: this function should be optimized to avoid extra copying from
	 * window to pending_buf.
	 */
	function deflate_stored(s, flush) {
	  /* Stored blocks are limited to 0xffff bytes, pending_buf is limited
	   * to pending_buf_size, and each stored block has a 5 byte header:
	   */
	  var max_block_size = 0xffff;
	
	  if (max_block_size > s.pending_buf_size - 5) {
	    max_block_size = s.pending_buf_size - 5;
	  }
	
	  /* Copy as much as possible from input to output: */
	  for (;;) {
	    /* Fill the window as much as possible: */
	    if (s.lookahead <= 1) {
	
	      //Assert(s->strstart < s->w_size+MAX_DIST(s) ||
	      //  s->block_start >= (long)s->w_size, "slide too late");
	//      if (!(s.strstart < s.w_size + (s.w_size - MIN_LOOKAHEAD) ||
	//        s.block_start >= s.w_size)) {
	//        throw  new Error("slide too late");
	//      }
	
	      fill_window(s);
	      if (s.lookahead === 0 && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	
	      if (s.lookahead === 0) {
	        break;
	      }
	      /* flush the current block */
	    }
	    //Assert(s->block_start >= 0L, "block gone");
	//    if (s.block_start < 0) throw new Error("block gone");
	
	    s.strstart += s.lookahead;
	    s.lookahead = 0;
	
	    /* Emit a stored block if pending_buf will be full: */
	    var max_start = s.block_start + max_block_size;
	
	    if (s.strstart === 0 || s.strstart >= max_start) {
	      /* strstart == 0 is possible when wraparound on 16-bit machine */
	      s.lookahead = s.strstart - max_start;
	      s.strstart = max_start;
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	
	
	    }
	    /* Flush if we may have to slide, otherwise block_start may become
	     * negative and the data will be gone:
	     */
	    if (s.strstart - s.block_start >= (s.w_size - MIN_LOOKAHEAD)) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	
	  s.insert = 0;
	
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	
	  if (s.strstart > s.block_start) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	
	  return BS_NEED_MORE;
	}
	
	/* ===========================================================================
	 * Compress as much as possible from the input stream, return the current
	 * block state.
	 * This function does not perform lazy evaluation of matches and inserts
	 * new strings in the dictionary only for unmatched strings or for short
	 * matches. It is used only for the fast compression options.
	 */
	function deflate_fast(s, flush) {
	  var hash_head;        /* head of the hash chain */
	  var bflush;           /* set if current block must be flushed */
	
	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the next match, plus MIN_MATCH bytes to insert the
	     * string following the next match.
	     */
	    if (s.lookahead < MIN_LOOKAHEAD) {
	      fill_window(s);
	      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) {
	        break; /* flush the current block */
	      }
	    }
	
	    /* Insert the string window[strstart .. strstart+2] in the
	     * dictionary, and set hash_head to the head of the hash chain:
	     */
	    hash_head = 0/*NIL*/;
	    if (s.lookahead >= MIN_MATCH) {
	      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	      s.head[s.ins_h] = s.strstart;
	      /***/
	    }
	
	    /* Find the longest match, discarding those <= prev_length.
	     * At this point we have always match_length < MIN_MATCH
	     */
	    if (hash_head !== 0/*NIL*/ && ((s.strstart - hash_head) <= (s.w_size - MIN_LOOKAHEAD))) {
	      /* To simplify the code, we prevent matches with the string
	       * of window index 0 (in particular we have to avoid a match
	       * of the string with itself at the start of the input file).
	       */
	      s.match_length = longest_match(s, hash_head);
	      /* longest_match() sets match_start */
	    }
	    if (s.match_length >= MIN_MATCH) {
	      // check_match(s, s.strstart, s.match_start, s.match_length); // for debug only
	
	      /*** _tr_tally_dist(s, s.strstart - s.match_start,
	                     s.match_length - MIN_MATCH, bflush); ***/
	      bflush = trees._tr_tally(s, s.strstart - s.match_start, s.match_length - MIN_MATCH);
	
	      s.lookahead -= s.match_length;
	
	      /* Insert new strings in the hash table only if the match length
	       * is not too large. This saves time but degrades compression.
	       */
	      if (s.match_length <= s.max_lazy_match/*max_insert_length*/ && s.lookahead >= MIN_MATCH) {
	        s.match_length--; /* string at strstart already in table */
	        do {
	          s.strstart++;
	          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	          s.head[s.ins_h] = s.strstart;
	          /***/
	          /* strstart never exceeds WSIZE-MAX_MATCH, so there are
	           * always MIN_MATCH bytes ahead.
	           */
	        } while (--s.match_length !== 0);
	        s.strstart++;
	      } else
	      {
	        s.strstart += s.match_length;
	        s.match_length = 0;
	        s.ins_h = s.window[s.strstart];
	        /* UPDATE_HASH(s, s.ins_h, s.window[s.strstart+1]); */
	        s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + 1]) & s.hash_mask;
	
	//#if MIN_MATCH != 3
	//                Call UPDATE_HASH() MIN_MATCH-3 more times
	//#endif
	        /* If lookahead < MIN_MATCH, ins_h is garbage, but it does not
	         * matter since it will be recomputed at next deflate call.
	         */
	      }
	    } else {
	      /* No match, output a literal byte */
	      //Tracevv((stderr,"%c", s.window[s.strstart]));
	      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
	
	      s.lookahead--;
	      s.strstart++;
	    }
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = ((s.strstart < (MIN_MATCH - 1)) ? s.strstart : MIN_MATCH - 1);
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}
	
	/* ===========================================================================
	 * Same as above, but achieves better compression. We use a lazy
	 * evaluation for matches: a match is finally adopted only if there is
	 * no better match at the next window position.
	 */
	function deflate_slow(s, flush) {
	  var hash_head;          /* head of hash chain */
	  var bflush;              /* set if current block must be flushed */
	
	  var max_insert;
	
	  /* Process the input block. */
	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the next match, plus MIN_MATCH bytes to insert the
	     * string following the next match.
	     */
	    if (s.lookahead < MIN_LOOKAHEAD) {
	      fill_window(s);
	      if (s.lookahead < MIN_LOOKAHEAD && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) { break; } /* flush the current block */
	    }
	
	    /* Insert the string window[strstart .. strstart+2] in the
	     * dictionary, and set hash_head to the head of the hash chain:
	     */
	    hash_head = 0/*NIL*/;
	    if (s.lookahead >= MIN_MATCH) {
	      /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	      hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	      s.head[s.ins_h] = s.strstart;
	      /***/
	    }
	
	    /* Find the longest match, discarding those <= prev_length.
	     */
	    s.prev_length = s.match_length;
	    s.prev_match = s.match_start;
	    s.match_length = MIN_MATCH - 1;
	
	    if (hash_head !== 0/*NIL*/ && s.prev_length < s.max_lazy_match &&
	        s.strstart - hash_head <= (s.w_size - MIN_LOOKAHEAD)/*MAX_DIST(s)*/) {
	      /* To simplify the code, we prevent matches with the string
	       * of window index 0 (in particular we have to avoid a match
	       * of the string with itself at the start of the input file).
	       */
	      s.match_length = longest_match(s, hash_head);
	      /* longest_match() sets match_start */
	
	      if (s.match_length <= 5 &&
	         (s.strategy === Z_FILTERED || (s.match_length === MIN_MATCH && s.strstart - s.match_start > 4096/*TOO_FAR*/))) {
	
	        /* If prev_match is also MIN_MATCH, match_start is garbage
	         * but we will ignore the current match anyway.
	         */
	        s.match_length = MIN_MATCH - 1;
	      }
	    }
	    /* If there was a match at the previous step and the current
	     * match is not better, output the previous match:
	     */
	    if (s.prev_length >= MIN_MATCH && s.match_length <= s.prev_length) {
	      max_insert = s.strstart + s.lookahead - MIN_MATCH;
	      /* Do not insert strings in hash table beyond this. */
	
	      //check_match(s, s.strstart-1, s.prev_match, s.prev_length);
	
	      /***_tr_tally_dist(s, s.strstart - 1 - s.prev_match,
	                     s.prev_length - MIN_MATCH, bflush);***/
	      bflush = trees._tr_tally(s, s.strstart - 1 - s.prev_match, s.prev_length - MIN_MATCH);
	      /* Insert in hash table all strings up to the end of the match.
	       * strstart-1 and strstart are already inserted. If there is not
	       * enough lookahead, the last two strings are not inserted in
	       * the hash table.
	       */
	      s.lookahead -= s.prev_length - 1;
	      s.prev_length -= 2;
	      do {
	        if (++s.strstart <= max_insert) {
	          /*** INSERT_STRING(s, s.strstart, hash_head); ***/
	          s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[s.strstart + MIN_MATCH - 1]) & s.hash_mask;
	          hash_head = s.prev[s.strstart & s.w_mask] = s.head[s.ins_h];
	          s.head[s.ins_h] = s.strstart;
	          /***/
	        }
	      } while (--s.prev_length !== 0);
	      s.match_available = 0;
	      s.match_length = MIN_MATCH - 1;
	      s.strstart++;
	
	      if (bflush) {
	        /*** FLUSH_BLOCK(s, 0); ***/
	        flush_block_only(s, false);
	        if (s.strm.avail_out === 0) {
	          return BS_NEED_MORE;
	        }
	        /***/
	      }
	
	    } else if (s.match_available) {
	      /* If there was no match at the previous position, output a
	       * single literal. If there was a match but the current match
	       * is longer, truncate the previous match to a single literal.
	       */
	      //Tracevv((stderr,"%c", s->window[s->strstart-1]));
	      /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
	
	      if (bflush) {
	        /*** FLUSH_BLOCK_ONLY(s, 0) ***/
	        flush_block_only(s, false);
	        /***/
	      }
	      s.strstart++;
	      s.lookahead--;
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	    } else {
	      /* There is no previous match to compare with, wait for
	       * the next step to decide.
	       */
	      s.match_available = 1;
	      s.strstart++;
	      s.lookahead--;
	    }
	  }
	  //Assert (flush != Z_NO_FLUSH, "no flush?");
	  if (s.match_available) {
	    //Tracevv((stderr,"%c", s->window[s->strstart-1]));
	    /*** _tr_tally_lit(s, s.window[s.strstart-1], bflush); ***/
	    bflush = trees._tr_tally(s, 0, s.window[s.strstart - 1]);
	
	    s.match_available = 0;
	  }
	  s.insert = s.strstart < MIN_MATCH - 1 ? s.strstart : MIN_MATCH - 1;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	
	  return BS_BLOCK_DONE;
	}
	
	
	/* ===========================================================================
	 * For Z_RLE, simply look for runs of bytes, generate matches only of distance
	 * one.  Do not maintain a hash table.  (It will be regenerated if this run of
	 * deflate switches away from Z_RLE.)
	 */
	function deflate_rle(s, flush) {
	  var bflush;            /* set if current block must be flushed */
	  var prev;              /* byte at distance one to match */
	  var scan, strend;      /* scan goes up to strend for length of run */
	
	  var _win = s.window;
	
	  for (;;) {
	    /* Make sure that we always have enough lookahead, except
	     * at the end of the input file. We need MAX_MATCH bytes
	     * for the longest run, plus one for the unrolled loop.
	     */
	    if (s.lookahead <= MAX_MATCH) {
	      fill_window(s);
	      if (s.lookahead <= MAX_MATCH && flush === Z_NO_FLUSH) {
	        return BS_NEED_MORE;
	      }
	      if (s.lookahead === 0) { break; } /* flush the current block */
	    }
	
	    /* See how many times the previous byte repeats */
	    s.match_length = 0;
	    if (s.lookahead >= MIN_MATCH && s.strstart > 0) {
	      scan = s.strstart - 1;
	      prev = _win[scan];
	      if (prev === _win[++scan] && prev === _win[++scan] && prev === _win[++scan]) {
	        strend = s.strstart + MAX_MATCH;
	        do {
	          /*jshint noempty:false*/
	        } while (prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 prev === _win[++scan] && prev === _win[++scan] &&
	                 scan < strend);
	        s.match_length = MAX_MATCH - (strend - scan);
	        if (s.match_length > s.lookahead) {
	          s.match_length = s.lookahead;
	        }
	      }
	      //Assert(scan <= s->window+(uInt)(s->window_size-1), "wild scan");
	    }
	
	    /* Emit match if have run of MIN_MATCH or longer, else emit literal */
	    if (s.match_length >= MIN_MATCH) {
	      //check_match(s, s.strstart, s.strstart - 1, s.match_length);
	
	      /*** _tr_tally_dist(s, 1, s.match_length - MIN_MATCH, bflush); ***/
	      bflush = trees._tr_tally(s, 1, s.match_length - MIN_MATCH);
	
	      s.lookahead -= s.match_length;
	      s.strstart += s.match_length;
	      s.match_length = 0;
	    } else {
	      /* No match, output a literal byte */
	      //Tracevv((stderr,"%c", s->window[s->strstart]));
	      /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	      bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
	
	      s.lookahead--;
	      s.strstart++;
	    }
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = 0;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}
	
	/* ===========================================================================
	 * For Z_HUFFMAN_ONLY, do not look for matches.  Do not maintain a hash table.
	 * (It will be regenerated if this run of deflate switches away from Huffman.)
	 */
	function deflate_huff(s, flush) {
	  var bflush;             /* set if current block must be flushed */
	
	  for (;;) {
	    /* Make sure that we have a literal to write. */
	    if (s.lookahead === 0) {
	      fill_window(s);
	      if (s.lookahead === 0) {
	        if (flush === Z_NO_FLUSH) {
	          return BS_NEED_MORE;
	        }
	        break;      /* flush the current block */
	      }
	    }
	
	    /* Output a literal byte */
	    s.match_length = 0;
	    //Tracevv((stderr,"%c", s->window[s->strstart]));
	    /*** _tr_tally_lit(s, s.window[s.strstart], bflush); ***/
	    bflush = trees._tr_tally(s, 0, s.window[s.strstart]);
	    s.lookahead--;
	    s.strstart++;
	    if (bflush) {
	      /*** FLUSH_BLOCK(s, 0); ***/
	      flush_block_only(s, false);
	      if (s.strm.avail_out === 0) {
	        return BS_NEED_MORE;
	      }
	      /***/
	    }
	  }
	  s.insert = 0;
	  if (flush === Z_FINISH) {
	    /*** FLUSH_BLOCK(s, 1); ***/
	    flush_block_only(s, true);
	    if (s.strm.avail_out === 0) {
	      return BS_FINISH_STARTED;
	    }
	    /***/
	    return BS_FINISH_DONE;
	  }
	  if (s.last_lit) {
	    /*** FLUSH_BLOCK(s, 0); ***/
	    flush_block_only(s, false);
	    if (s.strm.avail_out === 0) {
	      return BS_NEED_MORE;
	    }
	    /***/
	  }
	  return BS_BLOCK_DONE;
	}
	
	/* Values for max_lazy_match, good_match and max_chain_length, depending on
	 * the desired pack level (0..9). The values given below have been tuned to
	 * exclude worst case performance for pathological files. Better values may be
	 * found for specific files.
	 */
	function Config(good_length, max_lazy, nice_length, max_chain, func) {
	  this.good_length = good_length;
	  this.max_lazy = max_lazy;
	  this.nice_length = nice_length;
	  this.max_chain = max_chain;
	  this.func = func;
	}
	
	var configuration_table;
	
	configuration_table = [
	  /*      good lazy nice chain */
	  new Config(0, 0, 0, 0, deflate_stored),          /* 0 store only */
	  new Config(4, 4, 8, 4, deflate_fast),            /* 1 max speed, no lazy matches */
	  new Config(4, 5, 16, 8, deflate_fast),           /* 2 */
	  new Config(4, 6, 32, 32, deflate_fast),          /* 3 */
	
	  new Config(4, 4, 16, 16, deflate_slow),          /* 4 lazy matches */
	  new Config(8, 16, 32, 32, deflate_slow),         /* 5 */
	  new Config(8, 16, 128, 128, deflate_slow),       /* 6 */
	  new Config(8, 32, 128, 256, deflate_slow),       /* 7 */
	  new Config(32, 128, 258, 1024, deflate_slow),    /* 8 */
	  new Config(32, 258, 258, 4096, deflate_slow)     /* 9 max compression */
	];
	
	
	/* ===========================================================================
	 * Initialize the "longest match" routines for a new zlib stream
	 */
	function lm_init(s) {
	  s.window_size = 2 * s.w_size;
	
	  /*** CLEAR_HASH(s); ***/
	  zero(s.head); // Fill with NIL (= 0);
	
	  /* Set the default configuration parameters:
	   */
	  s.max_lazy_match = configuration_table[s.level].max_lazy;
	  s.good_match = configuration_table[s.level].good_length;
	  s.nice_match = configuration_table[s.level].nice_length;
	  s.max_chain_length = configuration_table[s.level].max_chain;
	
	  s.strstart = 0;
	  s.block_start = 0;
	  s.lookahead = 0;
	  s.insert = 0;
	  s.match_length = s.prev_length = MIN_MATCH - 1;
	  s.match_available = 0;
	  s.ins_h = 0;
	}
	
	
	function DeflateState() {
	  this.strm = null;            /* pointer back to this zlib stream */
	  this.status = 0;            /* as the name implies */
	  this.pending_buf = null;      /* output still pending */
	  this.pending_buf_size = 0;  /* size of pending_buf */
	  this.pending_out = 0;       /* next pending byte to output to the stream */
	  this.pending = 0;           /* nb of bytes in the pending buffer */
	  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
	  this.gzhead = null;         /* gzip header information to write */
	  this.gzindex = 0;           /* where in extra, name, or comment */
	  this.method = Z_DEFLATED; /* can only be DEFLATED */
	  this.last_flush = -1;   /* value of flush param for previous deflate call */
	
	  this.w_size = 0;  /* LZ77 window size (32K by default) */
	  this.w_bits = 0;  /* log2(w_size)  (8..16) */
	  this.w_mask = 0;  /* w_size - 1 */
	
	  this.window = null;
	  /* Sliding window. Input bytes are read into the second half of the window,
	   * and move to the first half later to keep a dictionary of at least wSize
	   * bytes. With this organization, matches are limited to a distance of
	   * wSize-MAX_MATCH bytes, but this ensures that IO is always
	   * performed with a length multiple of the block size.
	   */
	
	  this.window_size = 0;
	  /* Actual size of window: 2*wSize, except when the user input buffer
	   * is directly used as sliding window.
	   */
	
	  this.prev = null;
	  /* Link to older string with same hash index. To limit the size of this
	   * array to 64K, this link is maintained only for the last 32K strings.
	   * An index in this array is thus a window index modulo 32K.
	   */
	
	  this.head = null;   /* Heads of the hash chains or NIL. */
	
	  this.ins_h = 0;       /* hash index of string to be inserted */
	  this.hash_size = 0;   /* number of elements in hash table */
	  this.hash_bits = 0;   /* log2(hash_size) */
	  this.hash_mask = 0;   /* hash_size-1 */
	
	  this.hash_shift = 0;
	  /* Number of bits by which ins_h must be shifted at each input
	   * step. It must be such that after MIN_MATCH steps, the oldest
	   * byte no longer takes part in the hash key, that is:
	   *   hash_shift * MIN_MATCH >= hash_bits
	   */
	
	  this.block_start = 0;
	  /* Window position at the beginning of the current output block. Gets
	   * negative when the window is moved backwards.
	   */
	
	  this.match_length = 0;      /* length of best match */
	  this.prev_match = 0;        /* previous match */
	  this.match_available = 0;   /* set if previous match exists */
	  this.strstart = 0;          /* start of string to insert */
	  this.match_start = 0;       /* start of matching string */
	  this.lookahead = 0;         /* number of valid bytes ahead in window */
	
	  this.prev_length = 0;
	  /* Length of the best match at previous step. Matches not greater than this
	   * are discarded. This is used in the lazy match evaluation.
	   */
	
	  this.max_chain_length = 0;
	  /* To speed up deflation, hash chains are never searched beyond this
	   * length.  A higher limit improves compression ratio but degrades the
	   * speed.
	   */
	
	  this.max_lazy_match = 0;
	  /* Attempt to find a better match only when the current match is strictly
	   * smaller than this value. This mechanism is used only for compression
	   * levels >= 4.
	   */
	  // That's alias to max_lazy_match, don't use directly
	  //this.max_insert_length = 0;
	  /* Insert new strings in the hash table only if the match length is not
	   * greater than this length. This saves time but degrades compression.
	   * max_insert_length is used only for compression levels <= 3.
	   */
	
	  this.level = 0;     /* compression level (1..9) */
	  this.strategy = 0;  /* favor or force Huffman coding*/
	
	  this.good_match = 0;
	  /* Use a faster search when the previous match is longer than this */
	
	  this.nice_match = 0; /* Stop searching when current match exceeds this */
	
	              /* used by trees.c: */
	
	  /* Didn't use ct_data typedef below to suppress compiler warning */
	
	  // struct ct_data_s dyn_ltree[HEAP_SIZE];   /* literal and length tree */
	  // struct ct_data_s dyn_dtree[2*D_CODES+1]; /* distance tree */
	  // struct ct_data_s bl_tree[2*BL_CODES+1];  /* Huffman tree for bit lengths */
	
	  // Use flat array of DOUBLE size, with interleaved fata,
	  // because JS does not support effective
	  this.dyn_ltree  = new utils.Buf16(HEAP_SIZE * 2);
	  this.dyn_dtree  = new utils.Buf16((2 * D_CODES + 1) * 2);
	  this.bl_tree    = new utils.Buf16((2 * BL_CODES + 1) * 2);
	  zero(this.dyn_ltree);
	  zero(this.dyn_dtree);
	  zero(this.bl_tree);
	
	  this.l_desc   = null;         /* desc. for literal tree */
	  this.d_desc   = null;         /* desc. for distance tree */
	  this.bl_desc  = null;         /* desc. for bit length tree */
	
	  //ush bl_count[MAX_BITS+1];
	  this.bl_count = new utils.Buf16(MAX_BITS + 1);
	  /* number of codes at each bit length for an optimal tree */
	
	  //int heap[2*L_CODES+1];      /* heap used to build the Huffman trees */
	  this.heap = new utils.Buf16(2 * L_CODES + 1);  /* heap used to build the Huffman trees */
	  zero(this.heap);
	
	  this.heap_len = 0;               /* number of elements in the heap */
	  this.heap_max = 0;               /* element of largest frequency */
	  /* The sons of heap[n] are heap[2*n] and heap[2*n+1]. heap[0] is not used.
	   * The same heap array is used to build all trees.
	   */
	
	  this.depth = new utils.Buf16(2 * L_CODES + 1); //uch depth[2*L_CODES+1];
	  zero(this.depth);
	  /* Depth of each subtree used as tie breaker for trees of equal frequency
	   */
	
	  this.l_buf = 0;          /* buffer index for literals or lengths */
	
	  this.lit_bufsize = 0;
	  /* Size of match buffer for literals/lengths.  There are 4 reasons for
	   * limiting lit_bufsize to 64K:
	   *   - frequencies can be kept in 16 bit counters
	   *   - if compression is not successful for the first block, all input
	   *     data is still in the window so we can still emit a stored block even
	   *     when input comes from standard input.  (This can also be done for
	   *     all blocks if lit_bufsize is not greater than 32K.)
	   *   - if compression is not successful for a file smaller than 64K, we can
	   *     even emit a stored file instead of a stored block (saving 5 bytes).
	   *     This is applicable only for zip (not gzip or zlib).
	   *   - creating new Huffman trees less frequently may not provide fast
	   *     adaptation to changes in the input data statistics. (Take for
	   *     example a binary file with poorly compressible code followed by
	   *     a highly compressible string table.) Smaller buffer sizes give
	   *     fast adaptation but have of course the overhead of transmitting
	   *     trees more frequently.
	   *   - I can't count above 4
	   */
	
	  this.last_lit = 0;      /* running index in l_buf */
	
	  this.d_buf = 0;
	  /* Buffer index for distances. To simplify the code, d_buf and l_buf have
	   * the same number of elements. To use different lengths, an extra flag
	   * array would be necessary.
	   */
	
	  this.opt_len = 0;       /* bit length of current block with optimal trees */
	  this.static_len = 0;    /* bit length of current block with static trees */
	  this.matches = 0;       /* number of string matches in current block */
	  this.insert = 0;        /* bytes at end of window left to insert */
	
	
	  this.bi_buf = 0;
	  /* Output buffer. bits are inserted starting at the bottom (least
	   * significant bits).
	   */
	  this.bi_valid = 0;
	  /* Number of valid bits in bi_buf.  All bits above the last valid bit
	   * are always zero.
	   */
	
	  // Used for window memory init. We safely ignore it for JS. That makes
	  // sense only for pointers and memory check tools.
	  //this.high_water = 0;
	  /* High water mark offset in window for initialized bytes -- bytes above
	   * this are set to zero in order to avoid memory check warnings when
	   * longest match routines access bytes past the input.  This is then
	   * updated to the new high water mark.
	   */
	}
	
	
	function deflateResetKeep(strm) {
	  var s;
	
	  if (!strm || !strm.state) {
	    return err(strm, Z_STREAM_ERROR);
	  }
	
	  strm.total_in = strm.total_out = 0;
	  strm.data_type = Z_UNKNOWN;
	
	  s = strm.state;
	  s.pending = 0;
	  s.pending_out = 0;
	
	  if (s.wrap < 0) {
	    s.wrap = -s.wrap;
	    /* was made negative by deflate(..., Z_FINISH); */
	  }
	  s.status = (s.wrap ? INIT_STATE : BUSY_STATE);
	  strm.adler = (s.wrap === 2) ?
	    0  // crc32(0, Z_NULL, 0)
	  :
	    1; // adler32(0, Z_NULL, 0)
	  s.last_flush = Z_NO_FLUSH;
	  trees._tr_init(s);
	  return Z_OK;
	}
	
	
	function deflateReset(strm) {
	  var ret = deflateResetKeep(strm);
	  if (ret === Z_OK) {
	    lm_init(strm.state);
	  }
	  return ret;
	}
	
	
	function deflateSetHeader(strm, head) {
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  if (strm.state.wrap !== 2) { return Z_STREAM_ERROR; }
	  strm.state.gzhead = head;
	  return Z_OK;
	}
	
	
	function deflateInit2(strm, level, method, windowBits, memLevel, strategy) {
	  if (!strm) { // === Z_NULL
	    return Z_STREAM_ERROR;
	  }
	  var wrap = 1;
	
	  if (level === Z_DEFAULT_COMPRESSION) {
	    level = 6;
	  }
	
	  if (windowBits < 0) { /* suppress zlib wrapper */
	    wrap = 0;
	    windowBits = -windowBits;
	  }
	
	  else if (windowBits > 15) {
	    wrap = 2;           /* write gzip wrapper instead */
	    windowBits -= 16;
	  }
	
	
	  if (memLevel < 1 || memLevel > MAX_MEM_LEVEL || method !== Z_DEFLATED ||
	    windowBits < 8 || windowBits > 15 || level < 0 || level > 9 ||
	    strategy < 0 || strategy > Z_FIXED) {
	    return err(strm, Z_STREAM_ERROR);
	  }
	
	
	  if (windowBits === 8) {
	    windowBits = 9;
	  }
	  /* until 256-byte window bug fixed */
	
	  var s = new DeflateState();
	
	  strm.state = s;
	  s.strm = strm;
	
	  s.wrap = wrap;
	  s.gzhead = null;
	  s.w_bits = windowBits;
	  s.w_size = 1 << s.w_bits;
	  s.w_mask = s.w_size - 1;
	
	  s.hash_bits = memLevel + 7;
	  s.hash_size = 1 << s.hash_bits;
	  s.hash_mask = s.hash_size - 1;
	  s.hash_shift = ~~((s.hash_bits + MIN_MATCH - 1) / MIN_MATCH);
	
	  s.window = new utils.Buf8(s.w_size * 2);
	  s.head = new utils.Buf16(s.hash_size);
	  s.prev = new utils.Buf16(s.w_size);
	
	  // Don't need mem init magic for JS.
	  //s.high_water = 0;  /* nothing written to s->window yet */
	
	  s.lit_bufsize = 1 << (memLevel + 6); /* 16K elements by default */
	
	  s.pending_buf_size = s.lit_bufsize * 4;
	  s.pending_buf = new utils.Buf8(s.pending_buf_size);
	
	  s.d_buf = s.lit_bufsize >> 1;
	  s.l_buf = (1 + 2) * s.lit_bufsize;
	
	  s.level = level;
	  s.strategy = strategy;
	  s.method = method;
	
	  return deflateReset(strm);
	}
	
	function deflateInit(strm, level) {
	  return deflateInit2(strm, level, Z_DEFLATED, MAX_WBITS, DEF_MEM_LEVEL, Z_DEFAULT_STRATEGY);
	}
	
	
	function deflate(strm, flush) {
	  var old_flush, s;
	  var beg, val; // for gzip header write only
	
	  if (!strm || !strm.state ||
	    flush > Z_BLOCK || flush < 0) {
	    return strm ? err(strm, Z_STREAM_ERROR) : Z_STREAM_ERROR;
	  }
	
	  s = strm.state;
	
	  if (!strm.output ||
	      (!strm.input && strm.avail_in !== 0) ||
	      (s.status === FINISH_STATE && flush !== Z_FINISH)) {
	    return err(strm, (strm.avail_out === 0) ? Z_BUF_ERROR : Z_STREAM_ERROR);
	  }
	
	  s.strm = strm; /* just in case */
	  old_flush = s.last_flush;
	  s.last_flush = flush;
	
	  /* Write the header */
	  if (s.status === INIT_STATE) {
	
	    if (s.wrap === 2) { // GZIP header
	      strm.adler = 0;  //crc32(0L, Z_NULL, 0);
	      put_byte(s, 31);
	      put_byte(s, 139);
	      put_byte(s, 8);
	      if (!s.gzhead) { // s->gzhead == Z_NULL
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, 0);
	        put_byte(s, s.level === 9 ? 2 :
	                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
	                     4 : 0));
	        put_byte(s, OS_CODE);
	        s.status = BUSY_STATE;
	      }
	      else {
	        put_byte(s, (s.gzhead.text ? 1 : 0) +
	                    (s.gzhead.hcrc ? 2 : 0) +
	                    (!s.gzhead.extra ? 0 : 4) +
	                    (!s.gzhead.name ? 0 : 8) +
	                    (!s.gzhead.comment ? 0 : 16)
	                );
	        put_byte(s, s.gzhead.time & 0xff);
	        put_byte(s, (s.gzhead.time >> 8) & 0xff);
	        put_byte(s, (s.gzhead.time >> 16) & 0xff);
	        put_byte(s, (s.gzhead.time >> 24) & 0xff);
	        put_byte(s, s.level === 9 ? 2 :
	                    (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2 ?
	                     4 : 0));
	        put_byte(s, s.gzhead.os & 0xff);
	        if (s.gzhead.extra && s.gzhead.extra.length) {
	          put_byte(s, s.gzhead.extra.length & 0xff);
	          put_byte(s, (s.gzhead.extra.length >> 8) & 0xff);
	        }
	        if (s.gzhead.hcrc) {
	          strm.adler = crc32(strm.adler, s.pending_buf, s.pending, 0);
	        }
	        s.gzindex = 0;
	        s.status = EXTRA_STATE;
	      }
	    }
	    else // DEFLATE header
	    {
	      var header = (Z_DEFLATED + ((s.w_bits - 8) << 4)) << 8;
	      var level_flags = -1;
	
	      if (s.strategy >= Z_HUFFMAN_ONLY || s.level < 2) {
	        level_flags = 0;
	      } else if (s.level < 6) {
	        level_flags = 1;
	      } else if (s.level === 6) {
	        level_flags = 2;
	      } else {
	        level_flags = 3;
	      }
	      header |= (level_flags << 6);
	      if (s.strstart !== 0) { header |= PRESET_DICT; }
	      header += 31 - (header % 31);
	
	      s.status = BUSY_STATE;
	      putShortMSB(s, header);
	
	      /* Save the adler32 of the preset dictionary: */
	      if (s.strstart !== 0) {
	        putShortMSB(s, strm.adler >>> 16);
	        putShortMSB(s, strm.adler & 0xffff);
	      }
	      strm.adler = 1; // adler32(0L, Z_NULL, 0);
	    }
	  }
	
	//#ifdef GZIP
	  if (s.status === EXTRA_STATE) {
	    if (s.gzhead.extra/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */
	
	      while (s.gzindex < (s.gzhead.extra.length & 0xffff)) {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            break;
	          }
	        }
	        put_byte(s, s.gzhead.extra[s.gzindex] & 0xff);
	        s.gzindex++;
	      }
	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (s.gzindex === s.gzhead.extra.length) {
	        s.gzindex = 0;
	        s.status = NAME_STATE;
	      }
	    }
	    else {
	      s.status = NAME_STATE;
	    }
	  }
	  if (s.status === NAME_STATE) {
	    if (s.gzhead.name/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */
	      //int val;
	
	      do {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            val = 1;
	            break;
	          }
	        }
	        // JS specific: little magic to add zero terminator to end of string
	        if (s.gzindex < s.gzhead.name.length) {
	          val = s.gzhead.name.charCodeAt(s.gzindex++) & 0xff;
	        } else {
	          val = 0;
	        }
	        put_byte(s, val);
	      } while (val !== 0);
	
	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (val === 0) {
	        s.gzindex = 0;
	        s.status = COMMENT_STATE;
	      }
	    }
	    else {
	      s.status = COMMENT_STATE;
	    }
	  }
	  if (s.status === COMMENT_STATE) {
	    if (s.gzhead.comment/* != Z_NULL*/) {
	      beg = s.pending;  /* start of bytes to update crc */
	      //int val;
	
	      do {
	        if (s.pending === s.pending_buf_size) {
	          if (s.gzhead.hcrc && s.pending > beg) {
	            strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	          }
	          flush_pending(strm);
	          beg = s.pending;
	          if (s.pending === s.pending_buf_size) {
	            val = 1;
	            break;
	          }
	        }
	        // JS specific: little magic to add zero terminator to end of string
	        if (s.gzindex < s.gzhead.comment.length) {
	          val = s.gzhead.comment.charCodeAt(s.gzindex++) & 0xff;
	        } else {
	          val = 0;
	        }
	        put_byte(s, val);
	      } while (val !== 0);
	
	      if (s.gzhead.hcrc && s.pending > beg) {
	        strm.adler = crc32(strm.adler, s.pending_buf, s.pending - beg, beg);
	      }
	      if (val === 0) {
	        s.status = HCRC_STATE;
	      }
	    }
	    else {
	      s.status = HCRC_STATE;
	    }
	  }
	  if (s.status === HCRC_STATE) {
	    if (s.gzhead.hcrc) {
	      if (s.pending + 2 > s.pending_buf_size) {
	        flush_pending(strm);
	      }
	      if (s.pending + 2 <= s.pending_buf_size) {
	        put_byte(s, strm.adler & 0xff);
	        put_byte(s, (strm.adler >> 8) & 0xff);
	        strm.adler = 0; //crc32(0L, Z_NULL, 0);
	        s.status = BUSY_STATE;
	      }
	    }
	    else {
	      s.status = BUSY_STATE;
	    }
	  }
	//#endif
	
	  /* Flush as much pending output as possible */
	  if (s.pending !== 0) {
	    flush_pending(strm);
	    if (strm.avail_out === 0) {
	      /* Since avail_out is 0, deflate will be called again with
	       * more output space, but possibly with both pending and
	       * avail_in equal to zero. There won't be anything to do,
	       * but this is not an error situation so make sure we
	       * return OK instead of BUF_ERROR at next call of deflate:
	       */
	      s.last_flush = -1;
	      return Z_OK;
	    }
	
	    /* Make sure there is something to do and avoid duplicate consecutive
	     * flushes. For repeated and useless calls with Z_FINISH, we keep
	     * returning Z_STREAM_END instead of Z_BUF_ERROR.
	     */
	  } else if (strm.avail_in === 0 && rank(flush) <= rank(old_flush) &&
	    flush !== Z_FINISH) {
	    return err(strm, Z_BUF_ERROR);
	  }
	
	  /* User must not provide more input after the first FINISH: */
	  if (s.status === FINISH_STATE && strm.avail_in !== 0) {
	    return err(strm, Z_BUF_ERROR);
	  }
	
	  /* Start a new block or continue the current one.
	   */
	  if (strm.avail_in !== 0 || s.lookahead !== 0 ||
	    (flush !== Z_NO_FLUSH && s.status !== FINISH_STATE)) {
	    var bstate = (s.strategy === Z_HUFFMAN_ONLY) ? deflate_huff(s, flush) :
	      (s.strategy === Z_RLE ? deflate_rle(s, flush) :
	        configuration_table[s.level].func(s, flush));
	
	    if (bstate === BS_FINISH_STARTED || bstate === BS_FINISH_DONE) {
	      s.status = FINISH_STATE;
	    }
	    if (bstate === BS_NEED_MORE || bstate === BS_FINISH_STARTED) {
	      if (strm.avail_out === 0) {
	        s.last_flush = -1;
	        /* avoid BUF_ERROR next call, see above */
	      }
	      return Z_OK;
	      /* If flush != Z_NO_FLUSH && avail_out == 0, the next call
	       * of deflate should use the same flush parameter to make sure
	       * that the flush is complete. So we don't have to output an
	       * empty block here, this will be done at next call. This also
	       * ensures that for a very small output buffer, we emit at most
	       * one empty block.
	       */
	    }
	    if (bstate === BS_BLOCK_DONE) {
	      if (flush === Z_PARTIAL_FLUSH) {
	        trees._tr_align(s);
	      }
	      else if (flush !== Z_BLOCK) { /* FULL_FLUSH or SYNC_FLUSH */
	
	        trees._tr_stored_block(s, 0, 0, false);
	        /* For a full flush, this empty block will be recognized
	         * as a special marker by inflate_sync().
	         */
	        if (flush === Z_FULL_FLUSH) {
	          /*** CLEAR_HASH(s); ***/             /* forget history */
	          zero(s.head); // Fill with NIL (= 0);
	
	          if (s.lookahead === 0) {
	            s.strstart = 0;
	            s.block_start = 0;
	            s.insert = 0;
	          }
	        }
	      }
	      flush_pending(strm);
	      if (strm.avail_out === 0) {
	        s.last_flush = -1; /* avoid BUF_ERROR at next call, see above */
	        return Z_OK;
	      }
	    }
	  }
	  //Assert(strm->avail_out > 0, "bug2");
	  //if (strm.avail_out <= 0) { throw new Error("bug2");}
	
	  if (flush !== Z_FINISH) { return Z_OK; }
	  if (s.wrap <= 0) { return Z_STREAM_END; }
	
	  /* Write the trailer */
	  if (s.wrap === 2) {
	    put_byte(s, strm.adler & 0xff);
	    put_byte(s, (strm.adler >> 8) & 0xff);
	    put_byte(s, (strm.adler >> 16) & 0xff);
	    put_byte(s, (strm.adler >> 24) & 0xff);
	    put_byte(s, strm.total_in & 0xff);
	    put_byte(s, (strm.total_in >> 8) & 0xff);
	    put_byte(s, (strm.total_in >> 16) & 0xff);
	    put_byte(s, (strm.total_in >> 24) & 0xff);
	  }
	  else
	  {
	    putShortMSB(s, strm.adler >>> 16);
	    putShortMSB(s, strm.adler & 0xffff);
	  }
	
	  flush_pending(strm);
	  /* If avail_out is zero, the application will call deflate again
	   * to flush the rest.
	   */
	  if (s.wrap > 0) { s.wrap = -s.wrap; }
	  /* write the trailer only once! */
	  return s.pending !== 0 ? Z_OK : Z_STREAM_END;
	}
	
	function deflateEnd(strm) {
	  var status;
	
	  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
	    return Z_STREAM_ERROR;
	  }
	
	  status = strm.state.status;
	  if (status !== INIT_STATE &&
	    status !== EXTRA_STATE &&
	    status !== NAME_STATE &&
	    status !== COMMENT_STATE &&
	    status !== HCRC_STATE &&
	    status !== BUSY_STATE &&
	    status !== FINISH_STATE
	  ) {
	    return err(strm, Z_STREAM_ERROR);
	  }
	
	  strm.state = null;
	
	  return status === BUSY_STATE ? err(strm, Z_DATA_ERROR) : Z_OK;
	}
	
	
	/* =========================================================================
	 * Initializes the compression dictionary from the given byte
	 * sequence without producing any compressed output.
	 */
	function deflateSetDictionary(strm, dictionary) {
	  var dictLength = dictionary.length;
	
	  var s;
	  var str, n;
	  var wrap;
	  var avail;
	  var next;
	  var input;
	  var tmpDict;
	
	  if (!strm/*== Z_NULL*/ || !strm.state/*== Z_NULL*/) {
	    return Z_STREAM_ERROR;
	  }
	
	  s = strm.state;
	  wrap = s.wrap;
	
	  if (wrap === 2 || (wrap === 1 && s.status !== INIT_STATE) || s.lookahead) {
	    return Z_STREAM_ERROR;
	  }
	
	  /* when using zlib wrappers, compute Adler-32 for provided dictionary */
	  if (wrap === 1) {
	    /* adler32(strm->adler, dictionary, dictLength); */
	    strm.adler = adler32(strm.adler, dictionary, dictLength, 0);
	  }
	
	  s.wrap = 0;   /* avoid computing Adler-32 in read_buf */
	
	  /* if dictionary would fill window, just replace the history */
	  if (dictLength >= s.w_size) {
	    if (wrap === 0) {            /* already empty otherwise */
	      /*** CLEAR_HASH(s); ***/
	      zero(s.head); // Fill with NIL (= 0);
	      s.strstart = 0;
	      s.block_start = 0;
	      s.insert = 0;
	    }
	    /* use the tail */
	    // dictionary = dictionary.slice(dictLength - s.w_size);
	    tmpDict = new utils.Buf8(s.w_size);
	    utils.arraySet(tmpDict, dictionary, dictLength - s.w_size, s.w_size, 0);
	    dictionary = tmpDict;
	    dictLength = s.w_size;
	  }
	  /* insert dictionary into window and hash */
	  avail = strm.avail_in;
	  next = strm.next_in;
	  input = strm.input;
	  strm.avail_in = dictLength;
	  strm.next_in = 0;
	  strm.input = dictionary;
	  fill_window(s);
	  while (s.lookahead >= MIN_MATCH) {
	    str = s.strstart;
	    n = s.lookahead - (MIN_MATCH - 1);
	    do {
	      /* UPDATE_HASH(s, s->ins_h, s->window[str + MIN_MATCH-1]); */
	      s.ins_h = ((s.ins_h << s.hash_shift) ^ s.window[str + MIN_MATCH - 1]) & s.hash_mask;
	
	      s.prev[str & s.w_mask] = s.head[s.ins_h];
	
	      s.head[s.ins_h] = str;
	      str++;
	    } while (--n);
	    s.strstart = str;
	    s.lookahead = MIN_MATCH - 1;
	    fill_window(s);
	  }
	  s.strstart += s.lookahead;
	  s.block_start = s.strstart;
	  s.insert = s.lookahead;
	  s.lookahead = 0;
	  s.match_length = s.prev_length = MIN_MATCH - 1;
	  s.match_available = 0;
	  strm.next_in = next;
	  strm.input = input;
	  strm.avail_in = avail;
	  s.wrap = wrap;
	  return Z_OK;
	}
	
	
	exports.deflateInit = deflateInit;
	exports.deflateInit2 = deflateInit2;
	exports.deflateReset = deflateReset;
	exports.deflateResetKeep = deflateResetKeep;
	exports.deflateSetHeader = deflateSetHeader;
	exports.deflate = deflate;
	exports.deflateEnd = deflateEnd;
	exports.deflateSetDictionary = deflateSetDictionary;
	exports.deflateInfo = 'pako deflate (from Nodeca project)';
	
	/* Not implemented
	exports.deflateBound = deflateBound;
	exports.deflateCopy = deflateCopy;
	exports.deflateParams = deflateParams;
	exports.deflatePending = deflatePending;
	exports.deflatePrime = deflatePrime;
	exports.deflateTune = deflateTune;
	*/


/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	var utils = __webpack_require__(195);
	
	/* Public constants ==========================================================*/
	/* ===========================================================================*/
	
	
	//var Z_FILTERED          = 1;
	//var Z_HUFFMAN_ONLY      = 2;
	//var Z_RLE               = 3;
	var Z_FIXED               = 4;
	//var Z_DEFAULT_STRATEGY  = 0;
	
	/* Possible values of the data_type field (though see inflate()) */
	var Z_BINARY              = 0;
	var Z_TEXT                = 1;
	//var Z_ASCII             = 1; // = Z_TEXT
	var Z_UNKNOWN             = 2;
	
	/*============================================================================*/
	
	
	function zero(buf) { var len = buf.length; while (--len >= 0) { buf[len] = 0; } }
	
	// From zutil.h
	
	var STORED_BLOCK = 0;
	var STATIC_TREES = 1;
	var DYN_TREES    = 2;
	/* The three kinds of block type */
	
	var MIN_MATCH    = 3;
	var MAX_MATCH    = 258;
	/* The minimum and maximum match lengths */
	
	// From deflate.h
	/* ===========================================================================
	 * Internal compression state.
	 */
	
	var LENGTH_CODES  = 29;
	/* number of length codes, not counting the special END_BLOCK code */
	
	var LITERALS      = 256;
	/* number of literal bytes 0..255 */
	
	var L_CODES       = LITERALS + 1 + LENGTH_CODES;
	/* number of Literal or Length codes, including the END_BLOCK code */
	
	var D_CODES       = 30;
	/* number of distance codes */
	
	var BL_CODES      = 19;
	/* number of codes used to transfer the bit lengths */
	
	var HEAP_SIZE     = 2 * L_CODES + 1;
	/* maximum heap size */
	
	var MAX_BITS      = 15;
	/* All codes must not exceed MAX_BITS bits */
	
	var Buf_size      = 16;
	/* size of bit buffer in bi_buf */
	
	
	/* ===========================================================================
	 * Constants
	 */
	
	var MAX_BL_BITS = 7;
	/* Bit length codes must not exceed MAX_BL_BITS bits */
	
	var END_BLOCK   = 256;
	/* end of block literal code */
	
	var REP_3_6     = 16;
	/* repeat previous bit length 3-6 times (2 bits of repeat count) */
	
	var REPZ_3_10   = 17;
	/* repeat a zero length 3-10 times  (3 bits of repeat count) */
	
	var REPZ_11_138 = 18;
	/* repeat a zero length 11-138 times  (7 bits of repeat count) */
	
	/* eslint-disable comma-spacing,array-bracket-spacing */
	var extra_lbits =   /* extra bits for each length code */
	  [0,0,0,0,0,0,0,0,1,1,1,1,2,2,2,2,3,3,3,3,4,4,4,4,5,5,5,5,0];
	
	var extra_dbits =   /* extra bits for each distance code */
	  [0,0,0,0,1,1,2,2,3,3,4,4,5,5,6,6,7,7,8,8,9,9,10,10,11,11,12,12,13,13];
	
	var extra_blbits =  /* extra bits for each bit length code */
	  [0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,0,2,3,7];
	
	var bl_order =
	  [16,17,18,0,8,7,9,6,10,5,11,4,12,3,13,2,14,1,15];
	/* eslint-enable comma-spacing,array-bracket-spacing */
	
	/* The lengths of the bit length codes are sent in order of decreasing
	 * probability, to avoid transmitting the lengths for unused bit length codes.
	 */
	
	/* ===========================================================================
	 * Local data. These are initialized only once.
	 */
	
	// We pre-fill arrays with 0 to avoid uninitialized gaps
	
	var DIST_CODE_LEN = 512; /* see definition of array dist_code below */
	
	// !!!! Use flat array insdead of structure, Freq = i*2, Len = i*2+1
	var static_ltree  = new Array((L_CODES + 2) * 2);
	zero(static_ltree);
	/* The static literal tree. Since the bit lengths are imposed, there is no
	 * need for the L_CODES extra codes used during heap construction. However
	 * The codes 286 and 287 are needed to build a canonical tree (see _tr_init
	 * below).
	 */
	
	var static_dtree  = new Array(D_CODES * 2);
	zero(static_dtree);
	/* The static distance tree. (Actually a trivial tree since all codes use
	 * 5 bits.)
	 */
	
	var _dist_code    = new Array(DIST_CODE_LEN);
	zero(_dist_code);
	/* Distance codes. The first 256 values correspond to the distances
	 * 3 .. 258, the last 256 values correspond to the top 8 bits of
	 * the 15 bit distances.
	 */
	
	var _length_code  = new Array(MAX_MATCH - MIN_MATCH + 1);
	zero(_length_code);
	/* length code for each normalized match length (0 == MIN_MATCH) */
	
	var base_length   = new Array(LENGTH_CODES);
	zero(base_length);
	/* First normalized length for each code (0 = MIN_MATCH) */
	
	var base_dist     = new Array(D_CODES);
	zero(base_dist);
	/* First normalized distance for each code (0 = distance of 1) */
	
	
	function StaticTreeDesc(static_tree, extra_bits, extra_base, elems, max_length) {
	
	  this.static_tree  = static_tree;  /* static tree or NULL */
	  this.extra_bits   = extra_bits;   /* extra bits for each code or NULL */
	  this.extra_base   = extra_base;   /* base index for extra_bits */
	  this.elems        = elems;        /* max number of elements in the tree */
	  this.max_length   = max_length;   /* max bit length for the codes */
	
	  // show if `static_tree` has data or dummy - needed for monomorphic objects
	  this.has_stree    = static_tree && static_tree.length;
	}
	
	
	var static_l_desc;
	var static_d_desc;
	var static_bl_desc;
	
	
	function TreeDesc(dyn_tree, stat_desc) {
	  this.dyn_tree = dyn_tree;     /* the dynamic tree */
	  this.max_code = 0;            /* largest code with non zero frequency */
	  this.stat_desc = stat_desc;   /* the corresponding static tree */
	}
	
	
	
	function d_code(dist) {
	  return dist < 256 ? _dist_code[dist] : _dist_code[256 + (dist >>> 7)];
	}
	
	
	/* ===========================================================================
	 * Output a short LSB first on the stream.
	 * IN assertion: there is enough room in pendingBuf.
	 */
	function put_short(s, w) {
	//    put_byte(s, (uch)((w) & 0xff));
	//    put_byte(s, (uch)((ush)(w) >> 8));
	  s.pending_buf[s.pending++] = (w) & 0xff;
	  s.pending_buf[s.pending++] = (w >>> 8) & 0xff;
	}
	
	
	/* ===========================================================================
	 * Send a value on a given number of bits.
	 * IN assertion: length <= 16 and value fits in length bits.
	 */
	function send_bits(s, value, length) {
	  if (s.bi_valid > (Buf_size - length)) {
	    s.bi_buf |= (value << s.bi_valid) & 0xffff;
	    put_short(s, s.bi_buf);
	    s.bi_buf = value >> (Buf_size - s.bi_valid);
	    s.bi_valid += length - Buf_size;
	  } else {
	    s.bi_buf |= (value << s.bi_valid) & 0xffff;
	    s.bi_valid += length;
	  }
	}
	
	
	function send_code(s, c, tree) {
	  send_bits(s, tree[c * 2]/*.Code*/, tree[c * 2 + 1]/*.Len*/);
	}
	
	
	/* ===========================================================================
	 * Reverse the first len bits of a code, using straightforward code (a faster
	 * method would use a table)
	 * IN assertion: 1 <= len <= 15
	 */
	function bi_reverse(code, len) {
	  var res = 0;
	  do {
	    res |= code & 1;
	    code >>>= 1;
	    res <<= 1;
	  } while (--len > 0);
	  return res >>> 1;
	}
	
	
	/* ===========================================================================
	 * Flush the bit buffer, keeping at most 7 bits in it.
	 */
	function bi_flush(s) {
	  if (s.bi_valid === 16) {
	    put_short(s, s.bi_buf);
	    s.bi_buf = 0;
	    s.bi_valid = 0;
	
	  } else if (s.bi_valid >= 8) {
	    s.pending_buf[s.pending++] = s.bi_buf & 0xff;
	    s.bi_buf >>= 8;
	    s.bi_valid -= 8;
	  }
	}
	
	
	/* ===========================================================================
	 * Compute the optimal bit lengths for a tree and update the total bit length
	 * for the current block.
	 * IN assertion: the fields freq and dad are set, heap[heap_max] and
	 *    above are the tree nodes sorted by increasing frequency.
	 * OUT assertions: the field len is set to the optimal bit length, the
	 *     array bl_count contains the frequencies for each bit length.
	 *     The length opt_len is updated; static_len is also updated if stree is
	 *     not null.
	 */
	function gen_bitlen(s, desc)
	//    deflate_state *s;
	//    tree_desc *desc;    /* the tree descriptor */
	{
	  var tree            = desc.dyn_tree;
	  var max_code        = desc.max_code;
	  var stree           = desc.stat_desc.static_tree;
	  var has_stree       = desc.stat_desc.has_stree;
	  var extra           = desc.stat_desc.extra_bits;
	  var base            = desc.stat_desc.extra_base;
	  var max_length      = desc.stat_desc.max_length;
	  var h;              /* heap index */
	  var n, m;           /* iterate over the tree elements */
	  var bits;           /* bit length */
	  var xbits;          /* extra bits */
	  var f;              /* frequency */
	  var overflow = 0;   /* number of elements with bit length too large */
	
	  for (bits = 0; bits <= MAX_BITS; bits++) {
	    s.bl_count[bits] = 0;
	  }
	
	  /* In a first pass, compute the optimal bit lengths (which may
	   * overflow in the case of the bit length tree).
	   */
	  tree[s.heap[s.heap_max] * 2 + 1]/*.Len*/ = 0; /* root of the heap */
	
	  for (h = s.heap_max + 1; h < HEAP_SIZE; h++) {
	    n = s.heap[h];
	    bits = tree[tree[n * 2 + 1]/*.Dad*/ * 2 + 1]/*.Len*/ + 1;
	    if (bits > max_length) {
	      bits = max_length;
	      overflow++;
	    }
	    tree[n * 2 + 1]/*.Len*/ = bits;
	    /* We overwrite tree[n].Dad which is no longer needed */
	
	    if (n > max_code) { continue; } /* not a leaf node */
	
	    s.bl_count[bits]++;
	    xbits = 0;
	    if (n >= base) {
	      xbits = extra[n - base];
	    }
	    f = tree[n * 2]/*.Freq*/;
	    s.opt_len += f * (bits + xbits);
	    if (has_stree) {
	      s.static_len += f * (stree[n * 2 + 1]/*.Len*/ + xbits);
	    }
	  }
	  if (overflow === 0) { return; }
	
	  // Trace((stderr,"\nbit length overflow\n"));
	  /* This happens for example on obj2 and pic of the Calgary corpus */
	
	  /* Find the first bit length which could increase: */
	  do {
	    bits = max_length - 1;
	    while (s.bl_count[bits] === 0) { bits--; }
	    s.bl_count[bits]--;      /* move one leaf down the tree */
	    s.bl_count[bits + 1] += 2; /* move one overflow item as its brother */
	    s.bl_count[max_length]--;
	    /* The brother of the overflow item also moves one step up,
	     * but this does not affect bl_count[max_length]
	     */
	    overflow -= 2;
	  } while (overflow > 0);
	
	  /* Now recompute all bit lengths, scanning in increasing frequency.
	   * h is still equal to HEAP_SIZE. (It is simpler to reconstruct all
	   * lengths instead of fixing only the wrong ones. This idea is taken
	   * from 'ar' written by Haruhiko Okumura.)
	   */
	  for (bits = max_length; bits !== 0; bits--) {
	    n = s.bl_count[bits];
	    while (n !== 0) {
	      m = s.heap[--h];
	      if (m > max_code) { continue; }
	      if (tree[m * 2 + 1]/*.Len*/ !== bits) {
	        // Trace((stderr,"code %d bits %d->%d\n", m, tree[m].Len, bits));
	        s.opt_len += (bits - tree[m * 2 + 1]/*.Len*/) * tree[m * 2]/*.Freq*/;
	        tree[m * 2 + 1]/*.Len*/ = bits;
	      }
	      n--;
	    }
	  }
	}
	
	
	/* ===========================================================================
	 * Generate the codes for a given tree and bit counts (which need not be
	 * optimal).
	 * IN assertion: the array bl_count contains the bit length statistics for
	 * the given tree and the field len is set for all tree elements.
	 * OUT assertion: the field code is set for all tree elements of non
	 *     zero code length.
	 */
	function gen_codes(tree, max_code, bl_count)
	//    ct_data *tree;             /* the tree to decorate */
	//    int max_code;              /* largest code with non zero frequency */
	//    ushf *bl_count;            /* number of codes at each bit length */
	{
	  var next_code = new Array(MAX_BITS + 1); /* next code value for each bit length */
	  var code = 0;              /* running code value */
	  var bits;                  /* bit index */
	  var n;                     /* code index */
	
	  /* The distribution counts are first used to generate the code values
	   * without bit reversal.
	   */
	  for (bits = 1; bits <= MAX_BITS; bits++) {
	    next_code[bits] = code = (code + bl_count[bits - 1]) << 1;
	  }
	  /* Check that the bit counts in bl_count are consistent. The last code
	   * must be all ones.
	   */
	  //Assert (code + bl_count[MAX_BITS]-1 == (1<<MAX_BITS)-1,
	  //        "inconsistent bit counts");
	  //Tracev((stderr,"\ngen_codes: max_code %d ", max_code));
	
	  for (n = 0;  n <= max_code; n++) {
	    var len = tree[n * 2 + 1]/*.Len*/;
	    if (len === 0) { continue; }
	    /* Now reverse the bits */
	    tree[n * 2]/*.Code*/ = bi_reverse(next_code[len]++, len);
	
	    //Tracecv(tree != static_ltree, (stderr,"\nn %3d %c l %2d c %4x (%x) ",
	    //     n, (isgraph(n) ? n : ' '), len, tree[n].Code, next_code[len]-1));
	  }
	}
	
	
	/* ===========================================================================
	 * Initialize the various 'constant' tables.
	 */
	function tr_static_init() {
	  var n;        /* iterates over tree elements */
	  var bits;     /* bit counter */
	  var length;   /* length value */
	  var code;     /* code value */
	  var dist;     /* distance index */
	  var bl_count = new Array(MAX_BITS + 1);
	  /* number of codes at each bit length for an optimal tree */
	
	  // do check in _tr_init()
	  //if (static_init_done) return;
	
	  /* For some embedded targets, global variables are not initialized: */
	/*#ifdef NO_INIT_GLOBAL_POINTERS
	  static_l_desc.static_tree = static_ltree;
	  static_l_desc.extra_bits = extra_lbits;
	  static_d_desc.static_tree = static_dtree;
	  static_d_desc.extra_bits = extra_dbits;
	  static_bl_desc.extra_bits = extra_blbits;
	#endif*/
	
	  /* Initialize the mapping length (0..255) -> length code (0..28) */
	  length = 0;
	  for (code = 0; code < LENGTH_CODES - 1; code++) {
	    base_length[code] = length;
	    for (n = 0; n < (1 << extra_lbits[code]); n++) {
	      _length_code[length++] = code;
	    }
	  }
	  //Assert (length == 256, "tr_static_init: length != 256");
	  /* Note that the length 255 (match length 258) can be represented
	   * in two different ways: code 284 + 5 bits or code 285, so we
	   * overwrite length_code[255] to use the best encoding:
	   */
	  _length_code[length - 1] = code;
	
	  /* Initialize the mapping dist (0..32K) -> dist code (0..29) */
	  dist = 0;
	  for (code = 0; code < 16; code++) {
	    base_dist[code] = dist;
	    for (n = 0; n < (1 << extra_dbits[code]); n++) {
	      _dist_code[dist++] = code;
	    }
	  }
	  //Assert (dist == 256, "tr_static_init: dist != 256");
	  dist >>= 7; /* from now on, all distances are divided by 128 */
	  for (; code < D_CODES; code++) {
	    base_dist[code] = dist << 7;
	    for (n = 0; n < (1 << (extra_dbits[code] - 7)); n++) {
	      _dist_code[256 + dist++] = code;
	    }
	  }
	  //Assert (dist == 256, "tr_static_init: 256+dist != 512");
	
	  /* Construct the codes of the static literal tree */
	  for (bits = 0; bits <= MAX_BITS; bits++) {
	    bl_count[bits] = 0;
	  }
	
	  n = 0;
	  while (n <= 143) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 8;
	    n++;
	    bl_count[8]++;
	  }
	  while (n <= 255) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 9;
	    n++;
	    bl_count[9]++;
	  }
	  while (n <= 279) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 7;
	    n++;
	    bl_count[7]++;
	  }
	  while (n <= 287) {
	    static_ltree[n * 2 + 1]/*.Len*/ = 8;
	    n++;
	    bl_count[8]++;
	  }
	  /* Codes 286 and 287 do not exist, but we must include them in the
	   * tree construction to get a canonical Huffman tree (longest code
	   * all ones)
	   */
	  gen_codes(static_ltree, L_CODES + 1, bl_count);
	
	  /* The static distance tree is trivial: */
	  for (n = 0; n < D_CODES; n++) {
	    static_dtree[n * 2 + 1]/*.Len*/ = 5;
	    static_dtree[n * 2]/*.Code*/ = bi_reverse(n, 5);
	  }
	
	  // Now data ready and we can init static trees
	  static_l_desc = new StaticTreeDesc(static_ltree, extra_lbits, LITERALS + 1, L_CODES, MAX_BITS);
	  static_d_desc = new StaticTreeDesc(static_dtree, extra_dbits, 0,          D_CODES, MAX_BITS);
	  static_bl_desc = new StaticTreeDesc(new Array(0), extra_blbits, 0,         BL_CODES, MAX_BL_BITS);
	
	  //static_init_done = true;
	}
	
	
	/* ===========================================================================
	 * Initialize a new block.
	 */
	function init_block(s) {
	  var n; /* iterates over tree elements */
	
	  /* Initialize the trees. */
	  for (n = 0; n < L_CODES;  n++) { s.dyn_ltree[n * 2]/*.Freq*/ = 0; }
	  for (n = 0; n < D_CODES;  n++) { s.dyn_dtree[n * 2]/*.Freq*/ = 0; }
	  for (n = 0; n < BL_CODES; n++) { s.bl_tree[n * 2]/*.Freq*/ = 0; }
	
	  s.dyn_ltree[END_BLOCK * 2]/*.Freq*/ = 1;
	  s.opt_len = s.static_len = 0;
	  s.last_lit = s.matches = 0;
	}
	
	
	/* ===========================================================================
	 * Flush the bit buffer and align the output on a byte boundary
	 */
	function bi_windup(s)
	{
	  if (s.bi_valid > 8) {
	    put_short(s, s.bi_buf);
	  } else if (s.bi_valid > 0) {
	    //put_byte(s, (Byte)s->bi_buf);
	    s.pending_buf[s.pending++] = s.bi_buf;
	  }
	  s.bi_buf = 0;
	  s.bi_valid = 0;
	}
	
	/* ===========================================================================
	 * Copy a stored block, storing first the length and its
	 * one's complement if requested.
	 */
	function copy_block(s, buf, len, header)
	//DeflateState *s;
	//charf    *buf;    /* the input data */
	//unsigned len;     /* its length */
	//int      header;  /* true if block header must be written */
	{
	  bi_windup(s);        /* align on byte boundary */
	
	  if (header) {
	    put_short(s, len);
	    put_short(s, ~len);
	  }
	//  while (len--) {
	//    put_byte(s, *buf++);
	//  }
	  utils.arraySet(s.pending_buf, s.window, buf, len, s.pending);
	  s.pending += len;
	}
	
	/* ===========================================================================
	 * Compares to subtrees, using the tree depth as tie breaker when
	 * the subtrees have equal frequency. This minimizes the worst case length.
	 */
	function smaller(tree, n, m, depth) {
	  var _n2 = n * 2;
	  var _m2 = m * 2;
	  return (tree[_n2]/*.Freq*/ < tree[_m2]/*.Freq*/ ||
	         (tree[_n2]/*.Freq*/ === tree[_m2]/*.Freq*/ && depth[n] <= depth[m]));
	}
	
	/* ===========================================================================
	 * Restore the heap property by moving down the tree starting at node k,
	 * exchanging a node with the smallest of its two sons if necessary, stopping
	 * when the heap property is re-established (each father smaller than its
	 * two sons).
	 */
	function pqdownheap(s, tree, k)
	//    deflate_state *s;
	//    ct_data *tree;  /* the tree to restore */
	//    int k;               /* node to move down */
	{
	  var v = s.heap[k];
	  var j = k << 1;  /* left son of k */
	  while (j <= s.heap_len) {
	    /* Set j to the smallest of the two sons: */
	    if (j < s.heap_len &&
	      smaller(tree, s.heap[j + 1], s.heap[j], s.depth)) {
	      j++;
	    }
	    /* Exit if v is smaller than both sons */
	    if (smaller(tree, v, s.heap[j], s.depth)) { break; }
	
	    /* Exchange v with the smallest son */
	    s.heap[k] = s.heap[j];
	    k = j;
	
	    /* And continue down the tree, setting j to the left son of k */
	    j <<= 1;
	  }
	  s.heap[k] = v;
	}
	
	
	// inlined manually
	// var SMALLEST = 1;
	
	/* ===========================================================================
	 * Send the block data compressed using the given Huffman trees
	 */
	function compress_block(s, ltree, dtree)
	//    deflate_state *s;
	//    const ct_data *ltree; /* literal tree */
	//    const ct_data *dtree; /* distance tree */
	{
	  var dist;           /* distance of matched string */
	  var lc;             /* match length or unmatched char (if dist == 0) */
	  var lx = 0;         /* running index in l_buf */
	  var code;           /* the code to send */
	  var extra;          /* number of extra bits to send */
	
	  if (s.last_lit !== 0) {
	    do {
	      dist = (s.pending_buf[s.d_buf + lx * 2] << 8) | (s.pending_buf[s.d_buf + lx * 2 + 1]);
	      lc = s.pending_buf[s.l_buf + lx];
	      lx++;
	
	      if (dist === 0) {
	        send_code(s, lc, ltree); /* send a literal byte */
	        //Tracecv(isgraph(lc), (stderr," '%c' ", lc));
	      } else {
	        /* Here, lc is the match length - MIN_MATCH */
	        code = _length_code[lc];
	        send_code(s, code + LITERALS + 1, ltree); /* send the length code */
	        extra = extra_lbits[code];
	        if (extra !== 0) {
	          lc -= base_length[code];
	          send_bits(s, lc, extra);       /* send the extra length bits */
	        }
	        dist--; /* dist is now the match distance - 1 */
	        code = d_code(dist);
	        //Assert (code < D_CODES, "bad d_code");
	
	        send_code(s, code, dtree);       /* send the distance code */
	        extra = extra_dbits[code];
	        if (extra !== 0) {
	          dist -= base_dist[code];
	          send_bits(s, dist, extra);   /* send the extra distance bits */
	        }
	      } /* literal or match pair ? */
	
	      /* Check that the overlay between pending_buf and d_buf+l_buf is ok: */
	      //Assert((uInt)(s->pending) < s->lit_bufsize + 2*lx,
	      //       "pendingBuf overflow");
	
	    } while (lx < s.last_lit);
	  }
	
	  send_code(s, END_BLOCK, ltree);
	}
	
	
	/* ===========================================================================
	 * Construct one Huffman tree and assigns the code bit strings and lengths.
	 * Update the total bit length for the current block.
	 * IN assertion: the field freq is set for all tree elements.
	 * OUT assertions: the fields len and code are set to the optimal bit length
	 *     and corresponding code. The length opt_len is updated; static_len is
	 *     also updated if stree is not null. The field max_code is set.
	 */
	function build_tree(s, desc)
	//    deflate_state *s;
	//    tree_desc *desc; /* the tree descriptor */
	{
	  var tree     = desc.dyn_tree;
	  var stree    = desc.stat_desc.static_tree;
	  var has_stree = desc.stat_desc.has_stree;
	  var elems    = desc.stat_desc.elems;
	  var n, m;          /* iterate over heap elements */
	  var max_code = -1; /* largest code with non zero frequency */
	  var node;          /* new node being created */
	
	  /* Construct the initial heap, with least frequent element in
	   * heap[SMALLEST]. The sons of heap[n] are heap[2*n] and heap[2*n+1].
	   * heap[0] is not used.
	   */
	  s.heap_len = 0;
	  s.heap_max = HEAP_SIZE;
	
	  for (n = 0; n < elems; n++) {
	    if (tree[n * 2]/*.Freq*/ !== 0) {
	      s.heap[++s.heap_len] = max_code = n;
	      s.depth[n] = 0;
	
	    } else {
	      tree[n * 2 + 1]/*.Len*/ = 0;
	    }
	  }
	
	  /* The pkzip format requires that at least one distance code exists,
	   * and that at least one bit should be sent even if there is only one
	   * possible code. So to avoid special checks later on we force at least
	   * two codes of non zero frequency.
	   */
	  while (s.heap_len < 2) {
	    node = s.heap[++s.heap_len] = (max_code < 2 ? ++max_code : 0);
	    tree[node * 2]/*.Freq*/ = 1;
	    s.depth[node] = 0;
	    s.opt_len--;
	
	    if (has_stree) {
	      s.static_len -= stree[node * 2 + 1]/*.Len*/;
	    }
	    /* node is 0 or 1 so it does not have extra bits */
	  }
	  desc.max_code = max_code;
	
	  /* The elements heap[heap_len/2+1 .. heap_len] are leaves of the tree,
	   * establish sub-heaps of increasing lengths:
	   */
	  for (n = (s.heap_len >> 1/*int /2*/); n >= 1; n--) { pqdownheap(s, tree, n); }
	
	  /* Construct the Huffman tree by repeatedly combining the least two
	   * frequent nodes.
	   */
	  node = elems;              /* next internal node of the tree */
	  do {
	    //pqremove(s, tree, n);  /* n = node of least frequency */
	    /*** pqremove ***/
	    n = s.heap[1/*SMALLEST*/];
	    s.heap[1/*SMALLEST*/] = s.heap[s.heap_len--];
	    pqdownheap(s, tree, 1/*SMALLEST*/);
	    /***/
	
	    m = s.heap[1/*SMALLEST*/]; /* m = node of next least frequency */
	
	    s.heap[--s.heap_max] = n; /* keep the nodes sorted by frequency */
	    s.heap[--s.heap_max] = m;
	
	    /* Create a new node father of n and m */
	    tree[node * 2]/*.Freq*/ = tree[n * 2]/*.Freq*/ + tree[m * 2]/*.Freq*/;
	    s.depth[node] = (s.depth[n] >= s.depth[m] ? s.depth[n] : s.depth[m]) + 1;
	    tree[n * 2 + 1]/*.Dad*/ = tree[m * 2 + 1]/*.Dad*/ = node;
	
	    /* and insert the new node in the heap */
	    s.heap[1/*SMALLEST*/] = node++;
	    pqdownheap(s, tree, 1/*SMALLEST*/);
	
	  } while (s.heap_len >= 2);
	
	  s.heap[--s.heap_max] = s.heap[1/*SMALLEST*/];
	
	  /* At this point, the fields freq and dad are set. We can now
	   * generate the bit lengths.
	   */
	  gen_bitlen(s, desc);
	
	  /* The field len is now set, we can generate the bit codes */
	  gen_codes(tree, max_code, s.bl_count);
	}
	
	
	/* ===========================================================================
	 * Scan a literal or distance tree to determine the frequencies of the codes
	 * in the bit length tree.
	 */
	function scan_tree(s, tree, max_code)
	//    deflate_state *s;
	//    ct_data *tree;   /* the tree to be scanned */
	//    int max_code;    /* and its largest code of non zero frequency */
	{
	  var n;                     /* iterates over all tree elements */
	  var prevlen = -1;          /* last emitted length */
	  var curlen;                /* length of current code */
	
	  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */
	
	  var count = 0;             /* repeat count of the current code */
	  var max_count = 7;         /* max repeat count */
	  var min_count = 4;         /* min repeat count */
	
	  if (nextlen === 0) {
	    max_count = 138;
	    min_count = 3;
	  }
	  tree[(max_code + 1) * 2 + 1]/*.Len*/ = 0xffff; /* guard */
	
	  for (n = 0; n <= max_code; n++) {
	    curlen = nextlen;
	    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;
	
	    if (++count < max_count && curlen === nextlen) {
	      continue;
	
	    } else if (count < min_count) {
	      s.bl_tree[curlen * 2]/*.Freq*/ += count;
	
	    } else if (curlen !== 0) {
	
	      if (curlen !== prevlen) { s.bl_tree[curlen * 2]/*.Freq*/++; }
	      s.bl_tree[REP_3_6 * 2]/*.Freq*/++;
	
	    } else if (count <= 10) {
	      s.bl_tree[REPZ_3_10 * 2]/*.Freq*/++;
	
	    } else {
	      s.bl_tree[REPZ_11_138 * 2]/*.Freq*/++;
	    }
	
	    count = 0;
	    prevlen = curlen;
	
	    if (nextlen === 0) {
	      max_count = 138;
	      min_count = 3;
	
	    } else if (curlen === nextlen) {
	      max_count = 6;
	      min_count = 3;
	
	    } else {
	      max_count = 7;
	      min_count = 4;
	    }
	  }
	}
	
	
	/* ===========================================================================
	 * Send a literal or distance tree in compressed form, using the codes in
	 * bl_tree.
	 */
	function send_tree(s, tree, max_code)
	//    deflate_state *s;
	//    ct_data *tree; /* the tree to be scanned */
	//    int max_code;       /* and its largest code of non zero frequency */
	{
	  var n;                     /* iterates over all tree elements */
	  var prevlen = -1;          /* last emitted length */
	  var curlen;                /* length of current code */
	
	  var nextlen = tree[0 * 2 + 1]/*.Len*/; /* length of next code */
	
	  var count = 0;             /* repeat count of the current code */
	  var max_count = 7;         /* max repeat count */
	  var min_count = 4;         /* min repeat count */
	
	  /* tree[max_code+1].Len = -1; */  /* guard already set */
	  if (nextlen === 0) {
	    max_count = 138;
	    min_count = 3;
	  }
	
	  for (n = 0; n <= max_code; n++) {
	    curlen = nextlen;
	    nextlen = tree[(n + 1) * 2 + 1]/*.Len*/;
	
	    if (++count < max_count && curlen === nextlen) {
	      continue;
	
	    } else if (count < min_count) {
	      do { send_code(s, curlen, s.bl_tree); } while (--count !== 0);
	
	    } else if (curlen !== 0) {
	      if (curlen !== prevlen) {
	        send_code(s, curlen, s.bl_tree);
	        count--;
	      }
	      //Assert(count >= 3 && count <= 6, " 3_6?");
	      send_code(s, REP_3_6, s.bl_tree);
	      send_bits(s, count - 3, 2);
	
	    } else if (count <= 10) {
	      send_code(s, REPZ_3_10, s.bl_tree);
	      send_bits(s, count - 3, 3);
	
	    } else {
	      send_code(s, REPZ_11_138, s.bl_tree);
	      send_bits(s, count - 11, 7);
	    }
	
	    count = 0;
	    prevlen = curlen;
	    if (nextlen === 0) {
	      max_count = 138;
	      min_count = 3;
	
	    } else if (curlen === nextlen) {
	      max_count = 6;
	      min_count = 3;
	
	    } else {
	      max_count = 7;
	      min_count = 4;
	    }
	  }
	}
	
	
	/* ===========================================================================
	 * Construct the Huffman tree for the bit lengths and return the index in
	 * bl_order of the last bit length code to send.
	 */
	function build_bl_tree(s) {
	  var max_blindex;  /* index of last bit length code of non zero freq */
	
	  /* Determine the bit length frequencies for literal and distance trees */
	  scan_tree(s, s.dyn_ltree, s.l_desc.max_code);
	  scan_tree(s, s.dyn_dtree, s.d_desc.max_code);
	
	  /* Build the bit length tree: */
	  build_tree(s, s.bl_desc);
	  /* opt_len now includes the length of the tree representations, except
	   * the lengths of the bit lengths codes and the 5+5+4 bits for the counts.
	   */
	
	  /* Determine the number of bit length codes to send. The pkzip format
	   * requires that at least 4 bit length codes be sent. (appnote.txt says
	   * 3 but the actual value used is 4.)
	   */
	  for (max_blindex = BL_CODES - 1; max_blindex >= 3; max_blindex--) {
	    if (s.bl_tree[bl_order[max_blindex] * 2 + 1]/*.Len*/ !== 0) {
	      break;
	    }
	  }
	  /* Update opt_len to include the bit length tree and counts */
	  s.opt_len += 3 * (max_blindex + 1) + 5 + 5 + 4;
	  //Tracev((stderr, "\ndyn trees: dyn %ld, stat %ld",
	  //        s->opt_len, s->static_len));
	
	  return max_blindex;
	}
	
	
	/* ===========================================================================
	 * Send the header for a block using dynamic Huffman trees: the counts, the
	 * lengths of the bit length codes, the literal tree and the distance tree.
	 * IN assertion: lcodes >= 257, dcodes >= 1, blcodes >= 4.
	 */
	function send_all_trees(s, lcodes, dcodes, blcodes)
	//    deflate_state *s;
	//    int lcodes, dcodes, blcodes; /* number of codes for each tree */
	{
	  var rank;                    /* index in bl_order */
	
	  //Assert (lcodes >= 257 && dcodes >= 1 && blcodes >= 4, "not enough codes");
	  //Assert (lcodes <= L_CODES && dcodes <= D_CODES && blcodes <= BL_CODES,
	  //        "too many codes");
	  //Tracev((stderr, "\nbl counts: "));
	  send_bits(s, lcodes - 257, 5); /* not +255 as stated in appnote.txt */
	  send_bits(s, dcodes - 1,   5);
	  send_bits(s, blcodes - 4,  4); /* not -3 as stated in appnote.txt */
	  for (rank = 0; rank < blcodes; rank++) {
	    //Tracev((stderr, "\nbl code %2d ", bl_order[rank]));
	    send_bits(s, s.bl_tree[bl_order[rank] * 2 + 1]/*.Len*/, 3);
	  }
	  //Tracev((stderr, "\nbl tree: sent %ld", s->bits_sent));
	
	  send_tree(s, s.dyn_ltree, lcodes - 1); /* literal tree */
	  //Tracev((stderr, "\nlit tree: sent %ld", s->bits_sent));
	
	  send_tree(s, s.dyn_dtree, dcodes - 1); /* distance tree */
	  //Tracev((stderr, "\ndist tree: sent %ld", s->bits_sent));
	}
	
	
	/* ===========================================================================
	 * Check if the data type is TEXT or BINARY, using the following algorithm:
	 * - TEXT if the two conditions below are satisfied:
	 *    a) There are no non-portable control characters belonging to the
	 *       "black list" (0..6, 14..25, 28..31).
	 *    b) There is at least one printable character belonging to the
	 *       "white list" (9 {TAB}, 10 {LF}, 13 {CR}, 32..255).
	 * - BINARY otherwise.
	 * - The following partially-portable control characters form a
	 *   "gray list" that is ignored in this detection algorithm:
	 *   (7 {BEL}, 8 {BS}, 11 {VT}, 12 {FF}, 26 {SUB}, 27 {ESC}).
	 * IN assertion: the fields Freq of dyn_ltree are set.
	 */
	function detect_data_type(s) {
	  /* black_mask is the bit mask of black-listed bytes
	   * set bits 0..6, 14..25, and 28..31
	   * 0xf3ffc07f = binary 11110011111111111100000001111111
	   */
	  var black_mask = 0xf3ffc07f;
	  var n;
	
	  /* Check for non-textual ("black-listed") bytes. */
	  for (n = 0; n <= 31; n++, black_mask >>>= 1) {
	    if ((black_mask & 1) && (s.dyn_ltree[n * 2]/*.Freq*/ !== 0)) {
	      return Z_BINARY;
	    }
	  }
	
	  /* Check for textual ("white-listed") bytes. */
	  if (s.dyn_ltree[9 * 2]/*.Freq*/ !== 0 || s.dyn_ltree[10 * 2]/*.Freq*/ !== 0 ||
	      s.dyn_ltree[13 * 2]/*.Freq*/ !== 0) {
	    return Z_TEXT;
	  }
	  for (n = 32; n < LITERALS; n++) {
	    if (s.dyn_ltree[n * 2]/*.Freq*/ !== 0) {
	      return Z_TEXT;
	    }
	  }
	
	  /* There are no "black-listed" or "white-listed" bytes:
	   * this stream either is empty or has tolerated ("gray-listed") bytes only.
	   */
	  return Z_BINARY;
	}
	
	
	var static_init_done = false;
	
	/* ===========================================================================
	 * Initialize the tree data structures for a new zlib stream.
	 */
	function _tr_init(s)
	{
	
	  if (!static_init_done) {
	    tr_static_init();
	    static_init_done = true;
	  }
	
	  s.l_desc  = new TreeDesc(s.dyn_ltree, static_l_desc);
	  s.d_desc  = new TreeDesc(s.dyn_dtree, static_d_desc);
	  s.bl_desc = new TreeDesc(s.bl_tree, static_bl_desc);
	
	  s.bi_buf = 0;
	  s.bi_valid = 0;
	
	  /* Initialize the first block of the first file: */
	  init_block(s);
	}
	
	
	/* ===========================================================================
	 * Send a stored block
	 */
	function _tr_stored_block(s, buf, stored_len, last)
	//DeflateState *s;
	//charf *buf;       /* input block */
	//ulg stored_len;   /* length of input block */
	//int last;         /* one if this is the last block for a file */
	{
	  send_bits(s, (STORED_BLOCK << 1) + (last ? 1 : 0), 3);    /* send block type */
	  copy_block(s, buf, stored_len, true); /* with header */
	}
	
	
	/* ===========================================================================
	 * Send one empty static block to give enough lookahead for inflate.
	 * This takes 10 bits, of which 7 may remain in the bit buffer.
	 */
	function _tr_align(s) {
	  send_bits(s, STATIC_TREES << 1, 3);
	  send_code(s, END_BLOCK, static_ltree);
	  bi_flush(s);
	}
	
	
	/* ===========================================================================
	 * Determine the best encoding for the current block: dynamic trees, static
	 * trees or store, and output the encoded block to the zip file.
	 */
	function _tr_flush_block(s, buf, stored_len, last)
	//DeflateState *s;
	//charf *buf;       /* input block, or NULL if too old */
	//ulg stored_len;   /* length of input block */
	//int last;         /* one if this is the last block for a file */
	{
	  var opt_lenb, static_lenb;  /* opt_len and static_len in bytes */
	  var max_blindex = 0;        /* index of last bit length code of non zero freq */
	
	  /* Build the Huffman trees unless a stored block is forced */
	  if (s.level > 0) {
	
	    /* Check if the file is binary or text */
	    if (s.strm.data_type === Z_UNKNOWN) {
	      s.strm.data_type = detect_data_type(s);
	    }
	
	    /* Construct the literal and distance trees */
	    build_tree(s, s.l_desc);
	    // Tracev((stderr, "\nlit data: dyn %ld, stat %ld", s->opt_len,
	    //        s->static_len));
	
	    build_tree(s, s.d_desc);
	    // Tracev((stderr, "\ndist data: dyn %ld, stat %ld", s->opt_len,
	    //        s->static_len));
	    /* At this point, opt_len and static_len are the total bit lengths of
	     * the compressed block data, excluding the tree representations.
	     */
	
	    /* Build the bit length tree for the above two trees, and get the index
	     * in bl_order of the last bit length code to send.
	     */
	    max_blindex = build_bl_tree(s);
	
	    /* Determine the best encoding. Compute the block lengths in bytes. */
	    opt_lenb = (s.opt_len + 3 + 7) >>> 3;
	    static_lenb = (s.static_len + 3 + 7) >>> 3;
	
	    // Tracev((stderr, "\nopt %lu(%lu) stat %lu(%lu) stored %lu lit %u ",
	    //        opt_lenb, s->opt_len, static_lenb, s->static_len, stored_len,
	    //        s->last_lit));
	
	    if (static_lenb <= opt_lenb) { opt_lenb = static_lenb; }
	
	  } else {
	    // Assert(buf != (char*)0, "lost buf");
	    opt_lenb = static_lenb = stored_len + 5; /* force a stored block */
	  }
	
	  if ((stored_len + 4 <= opt_lenb) && (buf !== -1)) {
	    /* 4: two words for the lengths */
	
	    /* The test buf != NULL is only necessary if LIT_BUFSIZE > WSIZE.
	     * Otherwise we can't have processed more than WSIZE input bytes since
	     * the last block flush, because compression would have been
	     * successful. If LIT_BUFSIZE <= WSIZE, it is never too late to
	     * transform a block into a stored block.
	     */
	    _tr_stored_block(s, buf, stored_len, last);
	
	  } else if (s.strategy === Z_FIXED || static_lenb === opt_lenb) {
	
	    send_bits(s, (STATIC_TREES << 1) + (last ? 1 : 0), 3);
	    compress_block(s, static_ltree, static_dtree);
	
	  } else {
	    send_bits(s, (DYN_TREES << 1) + (last ? 1 : 0), 3);
	    send_all_trees(s, s.l_desc.max_code + 1, s.d_desc.max_code + 1, max_blindex + 1);
	    compress_block(s, s.dyn_ltree, s.dyn_dtree);
	  }
	  // Assert (s->compressed_len == s->bits_sent, "bad compressed size");
	  /* The above check is made mod 2^32, for files larger than 512 MB
	   * and uLong implemented on 32 bits.
	   */
	  init_block(s);
	
	  if (last) {
	    bi_windup(s);
	  }
	  // Tracev((stderr,"\ncomprlen %lu(%lu) ", s->compressed_len>>3,
	  //       s->compressed_len-7*last));
	}
	
	/* ===========================================================================
	 * Save the match info and tally the frequency counts. Return true if
	 * the current block must be flushed.
	 */
	function _tr_tally(s, dist, lc)
	//    deflate_state *s;
	//    unsigned dist;  /* distance of matched string */
	//    unsigned lc;    /* match length-MIN_MATCH or unmatched char (if dist==0) */
	{
	  //var out_length, in_length, dcode;
	
	  s.pending_buf[s.d_buf + s.last_lit * 2]     = (dist >>> 8) & 0xff;
	  s.pending_buf[s.d_buf + s.last_lit * 2 + 1] = dist & 0xff;
	
	  s.pending_buf[s.l_buf + s.last_lit] = lc & 0xff;
	  s.last_lit++;
	
	  if (dist === 0) {
	    /* lc is the unmatched char */
	    s.dyn_ltree[lc * 2]/*.Freq*/++;
	  } else {
	    s.matches++;
	    /* Here, lc is the match length - MIN_MATCH */
	    dist--;             /* dist = match distance - 1 */
	    //Assert((ush)dist < (ush)MAX_DIST(s) &&
	    //       (ush)lc <= (ush)(MAX_MATCH-MIN_MATCH) &&
	    //       (ush)d_code(dist) < (ush)D_CODES,  "_tr_tally: bad match");
	
	    s.dyn_ltree[(_length_code[lc] + LITERALS + 1) * 2]/*.Freq*/++;
	    s.dyn_dtree[d_code(dist) * 2]/*.Freq*/++;
	  }
	
	// (!) This block is disabled in zlib defailts,
	// don't enable it for binary compatibility
	
	//#ifdef TRUNCATE_BLOCK
	//  /* Try to guess if it is profitable to stop the current block here */
	//  if ((s.last_lit & 0x1fff) === 0 && s.level > 2) {
	//    /* Compute an upper bound for the compressed length */
	//    out_length = s.last_lit*8;
	//    in_length = s.strstart - s.block_start;
	//
	//    for (dcode = 0; dcode < D_CODES; dcode++) {
	//      out_length += s.dyn_dtree[dcode*2]/*.Freq*/ * (5 + extra_dbits[dcode]);
	//    }
	//    out_length >>>= 3;
	//    //Tracev((stderr,"\nlast_lit %u, in %ld, out ~%ld(%ld%%) ",
	//    //       s->last_lit, in_length, out_length,
	//    //       100L - out_length*100L/in_length));
	//    if (s.matches < (s.last_lit>>1)/*int /2*/ && out_length < (in_length>>1)/*int /2*/) {
	//      return true;
	//    }
	//  }
	//#endif
	
	  return (s.last_lit === s.lit_bufsize - 1);
	  /* We avoid equality with lit_bufsize because of wraparound at 64K
	   * on 16 bit machines and because stored blocks are restricted to
	   * 64K-1 bytes.
	   */
	}
	
	exports._tr_init  = _tr_init;
	exports._tr_stored_block = _tr_stored_block;
	exports._tr_flush_block  = _tr_flush_block;
	exports._tr_tally = _tr_tally;
	exports._tr_align = _tr_align;


/***/ },
/* 199 */
/***/ function(module, exports) {

	'use strict';
	
	// Note: adler32 takes 12% for level 0 and 2% for level 6.
	// It doesn't worth to make additional optimizationa as in original.
	// Small size is preferable.
	
	function adler32(adler, buf, len, pos) {
	  var s1 = (adler & 0xffff) |0,
	      s2 = ((adler >>> 16) & 0xffff) |0,
	      n = 0;
	
	  while (len !== 0) {
	    // Set limit ~ twice less than 5552, to keep
	    // s2 in 31-bits, because we force signed ints.
	    // in other case %= will fail.
	    n = len > 2000 ? 2000 : len;
	    len -= n;
	
	    do {
	      s1 = (s1 + buf[pos++]) |0;
	      s2 = (s2 + s1) |0;
	    } while (--n);
	
	    s1 %= 65521;
	    s2 %= 65521;
	  }
	
	  return (s1 | (s2 << 16)) |0;
	}
	
	
	module.exports = adler32;


/***/ },
/* 200 */
/***/ function(module, exports) {

	'use strict';
	
	// Note: we can't get significant speed boost here.
	// So write code to minimize size - no pregenerated tables
	// and array tools dependencies.
	
	
	// Use ordinary array, since untyped makes no boost here
	function makeTable() {
	  var c, table = [];
	
	  for (var n = 0; n < 256; n++) {
	    c = n;
	    for (var k = 0; k < 8; k++) {
	      c = ((c & 1) ? (0xEDB88320 ^ (c >>> 1)) : (c >>> 1));
	    }
	    table[n] = c;
	  }
	
	  return table;
	}
	
	// Create table on load. Just 255 signed longs. Not a problem.
	var crcTable = makeTable();
	
	
	function crc32(crc, buf, len, pos) {
	  var t = crcTable,
	      end = pos + len;
	
	  crc ^= -1;
	
	  for (var i = pos; i < end; i++) {
	    crc = (crc >>> 8) ^ t[(crc ^ buf[i]) & 0xFF];
	  }
	
	  return (crc ^ (-1)); // >>> 0;
	}
	
	
	module.exports = crc32;


/***/ },
/* 201 */
/***/ function(module, exports) {

	'use strict';
	
	module.exports = {
	  2:      'need dictionary',     /* Z_NEED_DICT       2  */
	  1:      'stream end',          /* Z_STREAM_END      1  */
	  0:      '',                    /* Z_OK              0  */
	  '-1':   'file error',          /* Z_ERRNO         (-1) */
	  '-2':   'stream error',        /* Z_STREAM_ERROR  (-2) */
	  '-3':   'data error',          /* Z_DATA_ERROR    (-3) */
	  '-4':   'insufficient memory', /* Z_MEM_ERROR     (-4) */
	  '-5':   'buffer error',        /* Z_BUF_ERROR     (-5) */
	  '-6':   'incompatible version' /* Z_VERSION_ERROR (-6) */
	};


/***/ },
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	// String encode/decode helpers
	'use strict';
	
	
	var utils = __webpack_require__(195);
	
	
	// Quick check if we can use fast array to bin string conversion
	//
	// - apply(Array) can fail on Android 2.2
	// - apply(Uint8Array) can fail on iOS 5.1 Safary
	//
	var STR_APPLY_OK = true;
	var STR_APPLY_UIA_OK = true;
	
	try { String.fromCharCode.apply(null, [ 0 ]); } catch (__) { STR_APPLY_OK = false; }
	try { String.fromCharCode.apply(null, new Uint8Array(1)); } catch (__) { STR_APPLY_UIA_OK = false; }
	
	
	// Table with utf8 lengths (calculated by first byte of sequence)
	// Note, that 5 & 6-byte values and some 4-byte values can not be represented in JS,
	// because max possible codepoint is 0x10ffff
	var _utf8len = new utils.Buf8(256);
	for (var q = 0; q < 256; q++) {
	  _utf8len[q] = (q >= 252 ? 6 : q >= 248 ? 5 : q >= 240 ? 4 : q >= 224 ? 3 : q >= 192 ? 2 : 1);
	}
	_utf8len[254] = _utf8len[254] = 1; // Invalid sequence start
	
	
	// convert string to array (typed, when possible)
	exports.string2buf = function (str) {
	  var buf, c, c2, m_pos, i, str_len = str.length, buf_len = 0;
	
	  // count binary size
	  for (m_pos = 0; m_pos < str_len; m_pos++) {
	    c = str.charCodeAt(m_pos);
	    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
	      c2 = str.charCodeAt(m_pos + 1);
	      if ((c2 & 0xfc00) === 0xdc00) {
	        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	        m_pos++;
	      }
	    }
	    buf_len += c < 0x80 ? 1 : c < 0x800 ? 2 : c < 0x10000 ? 3 : 4;
	  }
	
	  // allocate buffer
	  buf = new utils.Buf8(buf_len);
	
	  // convert
	  for (i = 0, m_pos = 0; i < buf_len; m_pos++) {
	    c = str.charCodeAt(m_pos);
	    if ((c & 0xfc00) === 0xd800 && (m_pos + 1 < str_len)) {
	      c2 = str.charCodeAt(m_pos + 1);
	      if ((c2 & 0xfc00) === 0xdc00) {
	        c = 0x10000 + ((c - 0xd800) << 10) + (c2 - 0xdc00);
	        m_pos++;
	      }
	    }
	    if (c < 0x80) {
	      /* one byte */
	      buf[i++] = c;
	    } else if (c < 0x800) {
	      /* two bytes */
	      buf[i++] = 0xC0 | (c >>> 6);
	      buf[i++] = 0x80 | (c & 0x3f);
	    } else if (c < 0x10000) {
	      /* three bytes */
	      buf[i++] = 0xE0 | (c >>> 12);
	      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	      buf[i++] = 0x80 | (c & 0x3f);
	    } else {
	      /* four bytes */
	      buf[i++] = 0xf0 | (c >>> 18);
	      buf[i++] = 0x80 | (c >>> 12 & 0x3f);
	      buf[i++] = 0x80 | (c >>> 6 & 0x3f);
	      buf[i++] = 0x80 | (c & 0x3f);
	    }
	  }
	
	  return buf;
	};
	
	// Helper (used in 2 places)
	function buf2binstring(buf, len) {
	  // use fallback for big arrays to avoid stack overflow
	  if (len < 65537) {
	    if ((buf.subarray && STR_APPLY_UIA_OK) || (!buf.subarray && STR_APPLY_OK)) {
	      return String.fromCharCode.apply(null, utils.shrinkBuf(buf, len));
	    }
	  }
	
	  var result = '';
	  for (var i = 0; i < len; i++) {
	    result += String.fromCharCode(buf[i]);
	  }
	  return result;
	}
	
	
	// Convert byte array to binary string
	exports.buf2binstring = function (buf) {
	  return buf2binstring(buf, buf.length);
	};
	
	
	// Convert binary string (typed, when possible)
	exports.binstring2buf = function (str) {
	  var buf = new utils.Buf8(str.length);
	  for (var i = 0, len = buf.length; i < len; i++) {
	    buf[i] = str.charCodeAt(i);
	  }
	  return buf;
	};
	
	
	// convert array to string
	exports.buf2string = function (buf, max) {
	  var i, out, c, c_len;
	  var len = max || buf.length;
	
	  // Reserve max possible length (2 words per char)
	  // NB: by unknown reasons, Array is significantly faster for
	  //     String.fromCharCode.apply than Uint16Array.
	  var utf16buf = new Array(len * 2);
	
	  for (out = 0, i = 0; i < len;) {
	    c = buf[i++];
	    // quick process ascii
	    if (c < 0x80) { utf16buf[out++] = c; continue; }
	
	    c_len = _utf8len[c];
	    // skip 5 & 6 byte codes
	    if (c_len > 4) { utf16buf[out++] = 0xfffd; i += c_len - 1; continue; }
	
	    // apply mask on first byte
	    c &= c_len === 2 ? 0x1f : c_len === 3 ? 0x0f : 0x07;
	    // join the rest
	    while (c_len > 1 && i < len) {
	      c = (c << 6) | (buf[i++] & 0x3f);
	      c_len--;
	    }
	
	    // terminated by end of string?
	    if (c_len > 1) { utf16buf[out++] = 0xfffd; continue; }
	
	    if (c < 0x10000) {
	      utf16buf[out++] = c;
	    } else {
	      c -= 0x10000;
	      utf16buf[out++] = 0xd800 | ((c >> 10) & 0x3ff);
	      utf16buf[out++] = 0xdc00 | (c & 0x3ff);
	    }
	  }
	
	  return buf2binstring(utf16buf, out);
	};
	
	
	// Calculate max possible position in utf8 buffer,
	// that will not break sequence. If that's not possible
	// - (very small limits) return max size as is.
	//
	// buf[] - utf8 bytes array
	// max   - length limit (mandatory);
	exports.utf8border = function (buf, max) {
	  var pos;
	
	  max = max || buf.length;
	  if (max > buf.length) { max = buf.length; }
	
	  // go back from last position, until start of sequence found
	  pos = max - 1;
	  while (pos >= 0 && (buf[pos] & 0xC0) === 0x80) { pos--; }
	
	  // Fuckup - very small and broken sequence,
	  // return max, because we should return something anyway.
	  if (pos < 0) { return max; }
	
	  // If we came to start of buffer - that means vuffer is too small,
	  // return max too.
	  if (pos === 0) { return max; }
	
	  return (pos + _utf8len[buf[pos]] > max) ? pos : max;
	};


/***/ },
/* 203 */
/***/ function(module, exports) {

	'use strict';
	
	
	function ZStream() {
	  /* next input byte */
	  this.input = null; // JS specific, because we have no pointers
	  this.next_in = 0;
	  /* number of bytes available at input */
	  this.avail_in = 0;
	  /* total number of input bytes read so far */
	  this.total_in = 0;
	  /* next output byte should be put there */
	  this.output = null; // JS specific, because we have no pointers
	  this.next_out = 0;
	  /* remaining free space at output */
	  this.avail_out = 0;
	  /* total number of bytes output so far */
	  this.total_out = 0;
	  /* last error message, NULL if no error */
	  this.msg = ''/*Z_NULL*/;
	  /* not visible by applications */
	  this.state = null;
	  /* best guess about the data type: binary or text */
	  this.data_type = 2/*Z_UNKNOWN*/;
	  /* adler32 value of the uncompressed data */
	  this.adler = 0;
	}
	
	module.exports = ZStream;


/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	var zlib_inflate = __webpack_require__(205);
	var utils        = __webpack_require__(195);
	var strings      = __webpack_require__(202);
	var c            = __webpack_require__(208);
	var msg          = __webpack_require__(201);
	var ZStream      = __webpack_require__(203);
	var GZheader     = __webpack_require__(209);
	
	var toString = Object.prototype.toString;
	
	/**
	 * class Inflate
	 *
	 * Generic JS-style wrapper for zlib calls. If you don't need
	 * streaming behaviour - use more simple functions: [[inflate]]
	 * and [[inflateRaw]].
	 **/
	
	/* internal
	 * inflate.chunks -> Array
	 *
	 * Chunks of output data, if [[Inflate#onData]] not overriden.
	 **/
	
	/**
	 * Inflate.result -> Uint8Array|Array|String
	 *
	 * Uncompressed result, generated by default [[Inflate#onData]]
	 * and [[Inflate#onEnd]] handlers. Filled after you push last chunk
	 * (call [[Inflate#push]] with `Z_FINISH` / `true` param) or if you
	 * push a chunk with explicit flush (call [[Inflate#push]] with
	 * `Z_SYNC_FLUSH` param).
	 **/
	
	/**
	 * Inflate.err -> Number
	 *
	 * Error code after inflate finished. 0 (Z_OK) on success.
	 * Should be checked if broken data possible.
	 **/
	
	/**
	 * Inflate.msg -> String
	 *
	 * Error message, if [[Inflate.err]] != 0
	 **/
	
	
	/**
	 * new Inflate(options)
	 * - options (Object): zlib inflate options.
	 *
	 * Creates new inflator instance with specified params. Throws exception
	 * on bad params. Supported options:
	 *
	 * - `windowBits`
	 * - `dictionary`
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information on these.
	 *
	 * Additional options, for internal needs:
	 *
	 * - `chunkSize` - size of generated data chunks (16K by default)
	 * - `raw` (Boolean) - do raw inflate
	 * - `to` (String) - if equal to 'string', then result will be converted
	 *   from utf8 to utf16 (javascript) string. When string output requested,
	 *   chunk length can differ from `chunkSize`, depending on content.
	 *
	 * By default, when no options set, autodetect deflate/gzip data format via
	 * wrapper header.
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , chunk1 = Uint8Array([1,2,3,4,5,6,7,8,9])
	 *   , chunk2 = Uint8Array([10,11,12,13,14,15,16,17,18,19]);
	 *
	 * var inflate = new pako.Inflate({ level: 3});
	 *
	 * inflate.push(chunk1, false);
	 * inflate.push(chunk2, true);  // true -> last chunk
	 *
	 * if (inflate.err) { throw new Error(inflate.err); }
	 *
	 * console.log(inflate.result);
	 * ```
	 **/
	function Inflate(options) {
	  if (!(this instanceof Inflate)) return new Inflate(options);
	
	  this.options = utils.assign({
	    chunkSize: 16384,
	    windowBits: 0,
	    to: ''
	  }, options || {});
	
	  var opt = this.options;
	
	  // Force window size for `raw` data, if not set directly,
	  // because we have no header for autodetect.
	  if (opt.raw && (opt.windowBits >= 0) && (opt.windowBits < 16)) {
	    opt.windowBits = -opt.windowBits;
	    if (opt.windowBits === 0) { opt.windowBits = -15; }
	  }
	
	  // If `windowBits` not defined (and mode not raw) - set autodetect flag for gzip/deflate
	  if ((opt.windowBits >= 0) && (opt.windowBits < 16) &&
	      !(options && options.windowBits)) {
	    opt.windowBits += 32;
	  }
	
	  // Gzip header has no info about windows size, we can do autodetect only
	  // for deflate. So, if window size not set, force it to max when gzip possible
	  if ((opt.windowBits > 15) && (opt.windowBits < 48)) {
	    // bit 3 (16) -> gzipped data
	    // bit 4 (32) -> autodetect gzip/deflate
	    if ((opt.windowBits & 15) === 0) {
	      opt.windowBits |= 15;
	    }
	  }
	
	  this.err    = 0;      // error code, if happens (0 = Z_OK)
	  this.msg    = '';     // error message
	  this.ended  = false;  // used to avoid multiple onEnd() calls
	  this.chunks = [];     // chunks of compressed data
	
	  this.strm   = new ZStream();
	  this.strm.avail_out = 0;
	
	  var status  = zlib_inflate.inflateInit2(
	    this.strm,
	    opt.windowBits
	  );
	
	  if (status !== c.Z_OK) {
	    throw new Error(msg[status]);
	  }
	
	  this.header = new GZheader();
	
	  zlib_inflate.inflateGetHeader(this.strm, this.header);
	}
	
	/**
	 * Inflate#push(data[, mode]) -> Boolean
	 * - data (Uint8Array|Array|ArrayBuffer|String): input data
	 * - mode (Number|Boolean): 0..6 for corresponding Z_NO_FLUSH..Z_TREE modes.
	 *   See constants. Skipped or `false` means Z_NO_FLUSH, `true` meansh Z_FINISH.
	 *
	 * Sends input data to inflate pipe, generating [[Inflate#onData]] calls with
	 * new output chunks. Returns `true` on success. The last data block must have
	 * mode Z_FINISH (or `true`). That will flush internal pending buffers and call
	 * [[Inflate#onEnd]]. For interim explicit flushes (without ending the stream) you
	 * can use mode Z_SYNC_FLUSH, keeping the decompression context.
	 *
	 * On fail call [[Inflate#onEnd]] with error code and return false.
	 *
	 * We strongly recommend to use `Uint8Array` on input for best speed (output
	 * format is detected automatically). Also, don't skip last param and always
	 * use the same type in your code (boolean or number). That will improve JS speed.
	 *
	 * For regular `Array`-s make sure all elements are [0..255].
	 *
	 * ##### Example
	 *
	 * ```javascript
	 * push(chunk, false); // push one of data chunks
	 * ...
	 * push(chunk, true);  // push last chunk
	 * ```
	 **/
	Inflate.prototype.push = function (data, mode) {
	  var strm = this.strm;
	  var chunkSize = this.options.chunkSize;
	  var dictionary = this.options.dictionary;
	  var status, _mode;
	  var next_out_utf8, tail, utf8str;
	  var dict;
	
	  // Flag to properly process Z_BUF_ERROR on testing inflate call
	  // when we check that all output data was flushed.
	  var allowBufError = false;
	
	  if (this.ended) { return false; }
	  _mode = (mode === ~~mode) ? mode : ((mode === true) ? c.Z_FINISH : c.Z_NO_FLUSH);
	
	  // Convert data if needed
	  if (typeof data === 'string') {
	    // Only binary strings can be decompressed on practice
	    strm.input = strings.binstring2buf(data);
	  } else if (toString.call(data) === '[object ArrayBuffer]') {
	    strm.input = new Uint8Array(data);
	  } else {
	    strm.input = data;
	  }
	
	  strm.next_in = 0;
	  strm.avail_in = strm.input.length;
	
	  do {
	    if (strm.avail_out === 0) {
	      strm.output = new utils.Buf8(chunkSize);
	      strm.next_out = 0;
	      strm.avail_out = chunkSize;
	    }
	
	    status = zlib_inflate.inflate(strm, c.Z_NO_FLUSH);    /* no bad return value */
	
	    if (status === c.Z_NEED_DICT && dictionary) {
	      // Convert data if needed
	      if (typeof dictionary === 'string') {
	        dict = strings.string2buf(dictionary);
	      } else if (toString.call(dictionary) === '[object ArrayBuffer]') {
	        dict = new Uint8Array(dictionary);
	      } else {
	        dict = dictionary;
	      }
	
	      status = zlib_inflate.inflateSetDictionary(this.strm, dict);
	
	    }
	
	    if (status === c.Z_BUF_ERROR && allowBufError === true) {
	      status = c.Z_OK;
	      allowBufError = false;
	    }
	
	    if (status !== c.Z_STREAM_END && status !== c.Z_OK) {
	      this.onEnd(status);
	      this.ended = true;
	      return false;
	    }
	
	    if (strm.next_out) {
	      if (strm.avail_out === 0 || status === c.Z_STREAM_END || (strm.avail_in === 0 && (_mode === c.Z_FINISH || _mode === c.Z_SYNC_FLUSH))) {
	
	        if (this.options.to === 'string') {
	
	          next_out_utf8 = strings.utf8border(strm.output, strm.next_out);
	
	          tail = strm.next_out - next_out_utf8;
	          utf8str = strings.buf2string(strm.output, next_out_utf8);
	
	          // move tail
	          strm.next_out = tail;
	          strm.avail_out = chunkSize - tail;
	          if (tail) { utils.arraySet(strm.output, strm.output, next_out_utf8, tail, 0); }
	
	          this.onData(utf8str);
	
	        } else {
	          this.onData(utils.shrinkBuf(strm.output, strm.next_out));
	        }
	      }
	    }
	
	    // When no more input data, we should check that internal inflate buffers
	    // are flushed. The only way to do it when avail_out = 0 - run one more
	    // inflate pass. But if output data not exists, inflate return Z_BUF_ERROR.
	    // Here we set flag to process this error properly.
	    //
	    // NOTE. Deflate does not return error in this case and does not needs such
	    // logic.
	    if (strm.avail_in === 0 && strm.avail_out === 0) {
	      allowBufError = true;
	    }
	
	  } while ((strm.avail_in > 0 || strm.avail_out === 0) && status !== c.Z_STREAM_END);
	
	  if (status === c.Z_STREAM_END) {
	    _mode = c.Z_FINISH;
	  }
	
	  // Finalize on the last chunk.
	  if (_mode === c.Z_FINISH) {
	    status = zlib_inflate.inflateEnd(this.strm);
	    this.onEnd(status);
	    this.ended = true;
	    return status === c.Z_OK;
	  }
	
	  // callback interim results if Z_SYNC_FLUSH.
	  if (_mode === c.Z_SYNC_FLUSH) {
	    this.onEnd(c.Z_OK);
	    strm.avail_out = 0;
	    return true;
	  }
	
	  return true;
	};
	
	
	/**
	 * Inflate#onData(chunk) -> Void
	 * - chunk (Uint8Array|Array|String): ouput data. Type of array depends
	 *   on js engine support. When string output requested, each chunk
	 *   will be string.
	 *
	 * By default, stores data blocks in `chunks[]` property and glue
	 * those in `onEnd`. Override this handler, if you need another behaviour.
	 **/
	Inflate.prototype.onData = function (chunk) {
	  this.chunks.push(chunk);
	};
	
	
	/**
	 * Inflate#onEnd(status) -> Void
	 * - status (Number): inflate status. 0 (Z_OK) on success,
	 *   other if not.
	 *
	 * Called either after you tell inflate that the input stream is
	 * complete (Z_FINISH) or should be flushed (Z_SYNC_FLUSH)
	 * or if an error happened. By default - join collected chunks,
	 * free memory and fill `results` / `err` properties.
	 **/
	Inflate.prototype.onEnd = function (status) {
	  // On success - join
	  if (status === c.Z_OK) {
	    if (this.options.to === 'string') {
	      // Glue & convert here, until we teach pako to send
	      // utf8 alligned strings to onData
	      this.result = this.chunks.join('');
	    } else {
	      this.result = utils.flattenChunks(this.chunks);
	    }
	  }
	  this.chunks = [];
	  this.err = status;
	  this.msg = this.strm.msg;
	};
	
	
	/**
	 * inflate(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * Decompress `data` with inflate/ungzip and `options`. Autodetect
	 * format via wrapper header by default. That's why we don't provide
	 * separate `ungzip` method.
	 *
	 * Supported options are:
	 *
	 * - windowBits
	 *
	 * [http://zlib.net/manual.html#Advanced](http://zlib.net/manual.html#Advanced)
	 * for more information.
	 *
	 * Sugar (options):
	 *
	 * - `raw` (Boolean) - say that we work with raw stream, if you don't wish to specify
	 *   negative windowBits implicitly.
	 * - `to` (String) - if equal to 'string', then result will be converted
	 *   from utf8 to utf16 (javascript) string. When string output requested,
	 *   chunk length can differ from `chunkSize`, depending on content.
	 *
	 *
	 * ##### Example:
	 *
	 * ```javascript
	 * var pako = require('pako')
	 *   , input = pako.deflate([1,2,3,4,5,6,7,8,9])
	 *   , output;
	 *
	 * try {
	 *   output = pako.inflate(input);
	 * } catch (err)
	 *   console.log(err);
	 * }
	 * ```
	 **/
	function inflate(input, options) {
	  var inflator = new Inflate(options);
	
	  inflator.push(input, true);
	
	  // That will never happens, if you don't cheat with options :)
	  if (inflator.err) { throw inflator.msg; }
	
	  return inflator.result;
	}
	
	
	/**
	 * inflateRaw(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * The same as [[inflate]], but creates raw data, without wrapper
	 * (header and adler32 crc).
	 **/
	function inflateRaw(input, options) {
	  options = options || {};
	  options.raw = true;
	  return inflate(input, options);
	}
	
	
	/**
	 * ungzip(data[, options]) -> Uint8Array|Array|String
	 * - data (Uint8Array|Array|String): input data to decompress.
	 * - options (Object): zlib inflate options.
	 *
	 * Just shortcut to [[inflate]], because it autodetects format
	 * by header.content. Done for convenience.
	 **/
	
	
	exports.Inflate = Inflate;
	exports.inflate = inflate;
	exports.inflateRaw = inflateRaw;
	exports.ungzip  = inflate;


/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	var utils         = __webpack_require__(195);
	var adler32       = __webpack_require__(199);
	var crc32         = __webpack_require__(200);
	var inflate_fast  = __webpack_require__(206);
	var inflate_table = __webpack_require__(207);
	
	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;
	
	/* Public constants ==========================================================*/
	/* ===========================================================================*/
	
	
	/* Allowed flush values; see deflate() and inflate() below for details */
	//var Z_NO_FLUSH      = 0;
	//var Z_PARTIAL_FLUSH = 1;
	//var Z_SYNC_FLUSH    = 2;
	//var Z_FULL_FLUSH    = 3;
	var Z_FINISH        = 4;
	var Z_BLOCK         = 5;
	var Z_TREES         = 6;
	
	
	/* Return codes for the compression/decompression functions. Negative values
	 * are errors, positive values are used for special but normal events.
	 */
	var Z_OK            = 0;
	var Z_STREAM_END    = 1;
	var Z_NEED_DICT     = 2;
	//var Z_ERRNO         = -1;
	var Z_STREAM_ERROR  = -2;
	var Z_DATA_ERROR    = -3;
	var Z_MEM_ERROR     = -4;
	var Z_BUF_ERROR     = -5;
	//var Z_VERSION_ERROR = -6;
	
	/* The deflate compression method */
	var Z_DEFLATED  = 8;
	
	
	/* STATES ====================================================================*/
	/* ===========================================================================*/
	
	
	var    HEAD = 1;       /* i: waiting for magic header */
	var    FLAGS = 2;      /* i: waiting for method and flags (gzip) */
	var    TIME = 3;       /* i: waiting for modification time (gzip) */
	var    OS = 4;         /* i: waiting for extra flags and operating system (gzip) */
	var    EXLEN = 5;      /* i: waiting for extra length (gzip) */
	var    EXTRA = 6;      /* i: waiting for extra bytes (gzip) */
	var    NAME = 7;       /* i: waiting for end of file name (gzip) */
	var    COMMENT = 8;    /* i: waiting for end of comment (gzip) */
	var    HCRC = 9;       /* i: waiting for header crc (gzip) */
	var    DICTID = 10;    /* i: waiting for dictionary check value */
	var    DICT = 11;      /* waiting for inflateSetDictionary() call */
	var        TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
	var        TYPEDO = 13;    /* i: same, but skip check to exit inflate on new block */
	var        STORED = 14;    /* i: waiting for stored size (length and complement) */
	var        COPY_ = 15;     /* i/o: same as COPY below, but only first time in */
	var        COPY = 16;      /* i/o: waiting for input or output to copy stored block */
	var        TABLE = 17;     /* i: waiting for dynamic block table lengths */
	var        LENLENS = 18;   /* i: waiting for code length code lengths */
	var        CODELENS = 19;  /* i: waiting for length/lit and distance code lengths */
	var            LEN_ = 20;      /* i: same as LEN below, but only first time in */
	var            LEN = 21;       /* i: waiting for length/lit/eob code */
	var            LENEXT = 22;    /* i: waiting for length extra bits */
	var            DIST = 23;      /* i: waiting for distance code */
	var            DISTEXT = 24;   /* i: waiting for distance extra bits */
	var            MATCH = 25;     /* o: waiting for output space to copy string */
	var            LIT = 26;       /* o: waiting for output space to write literal */
	var    CHECK = 27;     /* i: waiting for 32-bit check value */
	var    LENGTH = 28;    /* i: waiting for 32-bit length (gzip) */
	var    DONE = 29;      /* finished check, done -- remain here until reset */
	var    BAD = 30;       /* got a data error -- remain here until reset */
	var    MEM = 31;       /* got an inflate() memory error -- remain here until reset */
	var    SYNC = 32;      /* looking for synchronization bytes to restart inflate() */
	
	/* ===========================================================================*/
	
	
	
	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	//var ENOUGH =  (ENOUGH_LENS+ENOUGH_DISTS);
	
	var MAX_WBITS = 15;
	/* 32K LZ77 window */
	var DEF_WBITS = MAX_WBITS;
	
	
	function zswap32(q) {
	  return  (((q >>> 24) & 0xff) +
	          ((q >>> 8) & 0xff00) +
	          ((q & 0xff00) << 8) +
	          ((q & 0xff) << 24));
	}
	
	
	function InflateState() {
	  this.mode = 0;             /* current inflate mode */
	  this.last = false;          /* true if processing last block */
	  this.wrap = 0;              /* bit 0 true for zlib, bit 1 true for gzip */
	  this.havedict = false;      /* true if dictionary provided */
	  this.flags = 0;             /* gzip header method and flags (0 if zlib) */
	  this.dmax = 0;              /* zlib header max distance (INFLATE_STRICT) */
	  this.check = 0;             /* protected copy of check value */
	  this.total = 0;             /* protected copy of output count */
	  // TODO: may be {}
	  this.head = null;           /* where to save gzip header information */
	
	  /* sliding window */
	  this.wbits = 0;             /* log base 2 of requested window size */
	  this.wsize = 0;             /* window size or zero if not using window */
	  this.whave = 0;             /* valid bytes in the window */
	  this.wnext = 0;             /* window write index */
	  this.window = null;         /* allocated sliding window, if needed */
	
	  /* bit accumulator */
	  this.hold = 0;              /* input bit accumulator */
	  this.bits = 0;              /* number of bits in "in" */
	
	  /* for string and stored block copying */
	  this.length = 0;            /* literal or length of data to copy */
	  this.offset = 0;            /* distance back to copy string from */
	
	  /* for table and code decoding */
	  this.extra = 0;             /* extra bits needed */
	
	  /* fixed and dynamic code tables */
	  this.lencode = null;          /* starting table for length/literal codes */
	  this.distcode = null;         /* starting table for distance codes */
	  this.lenbits = 0;           /* index bits for lencode */
	  this.distbits = 0;          /* index bits for distcode */
	
	  /* dynamic table building */
	  this.ncode = 0;             /* number of code length code lengths */
	  this.nlen = 0;              /* number of length code lengths */
	  this.ndist = 0;             /* number of distance code lengths */
	  this.have = 0;              /* number of code lengths in lens[] */
	  this.next = null;              /* next available space in codes[] */
	
	  this.lens = new utils.Buf16(320); /* temporary storage for code lengths */
	  this.work = new utils.Buf16(288); /* work area for code table building */
	
	  /*
	   because we don't have pointers in js, we use lencode and distcode directly
	   as buffers so we don't need codes
	  */
	  //this.codes = new utils.Buf32(ENOUGH);       /* space for code tables */
	  this.lendyn = null;              /* dynamic table for length/literal codes (JS specific) */
	  this.distdyn = null;             /* dynamic table for distance codes (JS specific) */
	  this.sane = 0;                   /* if false, allow invalid distance too far */
	  this.back = 0;                   /* bits back of last unprocessed length/lit */
	  this.was = 0;                    /* initial length of match */
	}
	
	function inflateResetKeep(strm) {
	  var state;
	
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  strm.total_in = strm.total_out = state.total = 0;
	  strm.msg = ''; /*Z_NULL*/
	  if (state.wrap) {       /* to support ill-conceived Java test suite */
	    strm.adler = state.wrap & 1;
	  }
	  state.mode = HEAD;
	  state.last = 0;
	  state.havedict = 0;
	  state.dmax = 32768;
	  state.head = null/*Z_NULL*/;
	  state.hold = 0;
	  state.bits = 0;
	  //state.lencode = state.distcode = state.next = state.codes;
	  state.lencode = state.lendyn = new utils.Buf32(ENOUGH_LENS);
	  state.distcode = state.distdyn = new utils.Buf32(ENOUGH_DISTS);
	
	  state.sane = 1;
	  state.back = -1;
	  //Tracev((stderr, "inflate: reset\n"));
	  return Z_OK;
	}
	
	function inflateReset(strm) {
	  var state;
	
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  state.wsize = 0;
	  state.whave = 0;
	  state.wnext = 0;
	  return inflateResetKeep(strm);
	
	}
	
	function inflateReset2(strm, windowBits) {
	  var wrap;
	  var state;
	
	  /* get the state */
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	
	  /* extract wrap request from windowBits parameter */
	  if (windowBits < 0) {
	    wrap = 0;
	    windowBits = -windowBits;
	  }
	  else {
	    wrap = (windowBits >> 4) + 1;
	    if (windowBits < 48) {
	      windowBits &= 15;
	    }
	  }
	
	  /* set number of window bits, free window if different */
	  if (windowBits && (windowBits < 8 || windowBits > 15)) {
	    return Z_STREAM_ERROR;
	  }
	  if (state.window !== null && state.wbits !== windowBits) {
	    state.window = null;
	  }
	
	  /* update state and reset the rest of it */
	  state.wrap = wrap;
	  state.wbits = windowBits;
	  return inflateReset(strm);
	}
	
	function inflateInit2(strm, windowBits) {
	  var ret;
	  var state;
	
	  if (!strm) { return Z_STREAM_ERROR; }
	  //strm.msg = Z_NULL;                 /* in case we return an error */
	
	  state = new InflateState();
	
	  //if (state === Z_NULL) return Z_MEM_ERROR;
	  //Tracev((stderr, "inflate: allocated\n"));
	  strm.state = state;
	  state.window = null/*Z_NULL*/;
	  ret = inflateReset2(strm, windowBits);
	  if (ret !== Z_OK) {
	    strm.state = null/*Z_NULL*/;
	  }
	  return ret;
	}
	
	function inflateInit(strm) {
	  return inflateInit2(strm, DEF_WBITS);
	}
	
	
	/*
	 Return state with length and distance decoding tables and index sizes set to
	 fixed code decoding.  Normally this returns fixed tables from inffixed.h.
	 If BUILDFIXED is defined, then instead this routine builds the tables the
	 first time it's called, and returns those tables the first time and
	 thereafter.  This reduces the size of the code by about 2K bytes, in
	 exchange for a little execution time.  However, BUILDFIXED should not be
	 used for threaded applications, since the rewriting of the tables and virgin
	 may not be thread-safe.
	 */
	var virgin = true;
	
	var lenfix, distfix; // We have no pointers in JS, so keep tables separate
	
	function fixedtables(state) {
	  /* build fixed huffman tables if first call (may not be thread safe) */
	  if (virgin) {
	    var sym;
	
	    lenfix = new utils.Buf32(512);
	    distfix = new utils.Buf32(32);
	
	    /* literal/length table */
	    sym = 0;
	    while (sym < 144) { state.lens[sym++] = 8; }
	    while (sym < 256) { state.lens[sym++] = 9; }
	    while (sym < 280) { state.lens[sym++] = 7; }
	    while (sym < 288) { state.lens[sym++] = 8; }
	
	    inflate_table(LENS,  state.lens, 0, 288, lenfix,   0, state.work, { bits: 9 });
	
	    /* distance table */
	    sym = 0;
	    while (sym < 32) { state.lens[sym++] = 5; }
	
	    inflate_table(DISTS, state.lens, 0, 32,   distfix, 0, state.work, { bits: 5 });
	
	    /* do this just once */
	    virgin = false;
	  }
	
	  state.lencode = lenfix;
	  state.lenbits = 9;
	  state.distcode = distfix;
	  state.distbits = 5;
	}
	
	
	/*
	 Update the window with the last wsize (normally 32K) bytes written before
	 returning.  If window does not exist yet, create it.  This is only called
	 when a window is already in use, or when output has been written during this
	 inflate call, but the end of the deflate stream has not been reached yet.
	 It is also called to create a window for dictionary data when a dictionary
	 is loaded.
	
	 Providing output buffers larger than 32K to inflate() should provide a speed
	 advantage, since only the last 32K of output is copied to the sliding window
	 upon return from inflate(), and since all distances after the first 32K of
	 output will fall in the output data, making match copies simpler and faster.
	 The advantage may be dependent on the size of the processor's data caches.
	 */
	function updatewindow(strm, src, end, copy) {
	  var dist;
	  var state = strm.state;
	
	  /* if it hasn't been done already, allocate space for the window */
	  if (state.window === null) {
	    state.wsize = 1 << state.wbits;
	    state.wnext = 0;
	    state.whave = 0;
	
	    state.window = new utils.Buf8(state.wsize);
	  }
	
	  /* copy state->wsize or less output bytes into the circular window */
	  if (copy >= state.wsize) {
	    utils.arraySet(state.window, src, end - state.wsize, state.wsize, 0);
	    state.wnext = 0;
	    state.whave = state.wsize;
	  }
	  else {
	    dist = state.wsize - state.wnext;
	    if (dist > copy) {
	      dist = copy;
	    }
	    //zmemcpy(state->window + state->wnext, end - copy, dist);
	    utils.arraySet(state.window, src, end - copy, dist, state.wnext);
	    copy -= dist;
	    if (copy) {
	      //zmemcpy(state->window, end - copy, copy);
	      utils.arraySet(state.window, src, end - copy, copy, 0);
	      state.wnext = copy;
	      state.whave = state.wsize;
	    }
	    else {
	      state.wnext += dist;
	      if (state.wnext === state.wsize) { state.wnext = 0; }
	      if (state.whave < state.wsize) { state.whave += dist; }
	    }
	  }
	  return 0;
	}
	
	function inflate(strm, flush) {
	  var state;
	  var input, output;          // input/output buffers
	  var next;                   /* next input INDEX */
	  var put;                    /* next output INDEX */
	  var have, left;             /* available input and output */
	  var hold;                   /* bit buffer */
	  var bits;                   /* bits in bit buffer */
	  var _in, _out;              /* save starting available input and output */
	  var copy;                   /* number of stored or match bytes to copy */
	  var from;                   /* where to copy match bytes from */
	  var from_source;
	  var here = 0;               /* current decoding table entry */
	  var here_bits, here_op, here_val; // paked "here" denormalized (JS specific)
	  //var last;                   /* parent table entry */
	  var last_bits, last_op, last_val; // paked "last" denormalized (JS specific)
	  var len;                    /* length to copy for repeats, bits to drop */
	  var ret;                    /* return code */
	  var hbuf = new utils.Buf8(4);    /* buffer for gzip header crc calculation */
	  var opts;
	
	  var n; // temporary var for NEED_BITS
	
	  var order = /* permutation of code lengths */
	    [ 16, 17, 18, 0, 8, 7, 9, 6, 10, 5, 11, 4, 12, 3, 13, 2, 14, 1, 15 ];
	
	
	  if (!strm || !strm.state || !strm.output ||
	      (!strm.input && strm.avail_in !== 0)) {
	    return Z_STREAM_ERROR;
	  }
	
	  state = strm.state;
	  if (state.mode === TYPE) { state.mode = TYPEDO; }    /* skip check */
	
	
	  //--- LOAD() ---
	  put = strm.next_out;
	  output = strm.output;
	  left = strm.avail_out;
	  next = strm.next_in;
	  input = strm.input;
	  have = strm.avail_in;
	  hold = state.hold;
	  bits = state.bits;
	  //---
	
	  _in = have;
	  _out = left;
	  ret = Z_OK;
	
	  inf_leave: // goto emulation
	  for (;;) {
	    switch (state.mode) {
	    case HEAD:
	      if (state.wrap === 0) {
	        state.mode = TYPEDO;
	        break;
	      }
	      //=== NEEDBITS(16);
	      while (bits < 16) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      if ((state.wrap & 2) && hold === 0x8b1f) {  /* gzip header */
	        state.check = 0/*crc32(0L, Z_NULL, 0)*/;
	        //=== CRC2(state.check, hold);
	        hbuf[0] = hold & 0xff;
	        hbuf[1] = (hold >>> 8) & 0xff;
	        state.check = crc32(state.check, hbuf, 2, 0);
	        //===//
	
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        state.mode = FLAGS;
	        break;
	      }
	      state.flags = 0;           /* expect zlib header */
	      if (state.head) {
	        state.head.done = false;
	      }
	      if (!(state.wrap & 1) ||   /* check if zlib header allowed */
	        (((hold & 0xff)/*BITS(8)*/ << 8) + (hold >> 8)) % 31) {
	        strm.msg = 'incorrect header check';
	        state.mode = BAD;
	        break;
	      }
	      if ((hold & 0x0f)/*BITS(4)*/ !== Z_DEFLATED) {
	        strm.msg = 'unknown compression method';
	        state.mode = BAD;
	        break;
	      }
	      //--- DROPBITS(4) ---//
	      hold >>>= 4;
	      bits -= 4;
	      //---//
	      len = (hold & 0x0f)/*BITS(4)*/ + 8;
	      if (state.wbits === 0) {
	        state.wbits = len;
	      }
	      else if (len > state.wbits) {
	        strm.msg = 'invalid window size';
	        state.mode = BAD;
	        break;
	      }
	      state.dmax = 1 << len;
	      //Tracev((stderr, "inflate:   zlib header ok\n"));
	      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
	      state.mode = hold & 0x200 ? DICTID : TYPE;
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      break;
	    case FLAGS:
	      //=== NEEDBITS(16); */
	      while (bits < 16) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      state.flags = hold;
	      if ((state.flags & 0xff) !== Z_DEFLATED) {
	        strm.msg = 'unknown compression method';
	        state.mode = BAD;
	        break;
	      }
	      if (state.flags & 0xe000) {
	        strm.msg = 'unknown header flags set';
	        state.mode = BAD;
	        break;
	      }
	      if (state.head) {
	        state.head.text = ((hold >> 8) & 1);
	      }
	      if (state.flags & 0x0200) {
	        //=== CRC2(state.check, hold);
	        hbuf[0] = hold & 0xff;
	        hbuf[1] = (hold >>> 8) & 0xff;
	        state.check = crc32(state.check, hbuf, 2, 0);
	        //===//
	      }
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = TIME;
	      /* falls through */
	    case TIME:
	      //=== NEEDBITS(32); */
	      while (bits < 32) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      if (state.head) {
	        state.head.time = hold;
	      }
	      if (state.flags & 0x0200) {
	        //=== CRC4(state.check, hold)
	        hbuf[0] = hold & 0xff;
	        hbuf[1] = (hold >>> 8) & 0xff;
	        hbuf[2] = (hold >>> 16) & 0xff;
	        hbuf[3] = (hold >>> 24) & 0xff;
	        state.check = crc32(state.check, hbuf, 4, 0);
	        //===
	      }
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = OS;
	      /* falls through */
	    case OS:
	      //=== NEEDBITS(16); */
	      while (bits < 16) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      if (state.head) {
	        state.head.xflags = (hold & 0xff);
	        state.head.os = (hold >> 8);
	      }
	      if (state.flags & 0x0200) {
	        //=== CRC2(state.check, hold);
	        hbuf[0] = hold & 0xff;
	        hbuf[1] = (hold >>> 8) & 0xff;
	        state.check = crc32(state.check, hbuf, 2, 0);
	        //===//
	      }
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = EXLEN;
	      /* falls through */
	    case EXLEN:
	      if (state.flags & 0x0400) {
	        //=== NEEDBITS(16); */
	        while (bits < 16) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.length = hold;
	        if (state.head) {
	          state.head.extra_len = hold;
	        }
	        if (state.flags & 0x0200) {
	          //=== CRC2(state.check, hold);
	          hbuf[0] = hold & 0xff;
	          hbuf[1] = (hold >>> 8) & 0xff;
	          state.check = crc32(state.check, hbuf, 2, 0);
	          //===//
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	      }
	      else if (state.head) {
	        state.head.extra = null/*Z_NULL*/;
	      }
	      state.mode = EXTRA;
	      /* falls through */
	    case EXTRA:
	      if (state.flags & 0x0400) {
	        copy = state.length;
	        if (copy > have) { copy = have; }
	        if (copy) {
	          if (state.head) {
	            len = state.head.extra_len - state.length;
	            if (!state.head.extra) {
	              // Use untyped array for more conveniend processing later
	              state.head.extra = new Array(state.head.extra_len);
	            }
	            utils.arraySet(
	              state.head.extra,
	              input,
	              next,
	              // extra field is limited to 65536 bytes
	              // - no need for additional size check
	              copy,
	              /*len + copy > state.head.extra_max - len ? state.head.extra_max : copy,*/
	              len
	            );
	            //zmemcpy(state.head.extra + len, next,
	            //        len + copy > state.head.extra_max ?
	            //        state.head.extra_max - len : copy);
	          }
	          if (state.flags & 0x0200) {
	            state.check = crc32(state.check, input, copy, next);
	          }
	          have -= copy;
	          next += copy;
	          state.length -= copy;
	        }
	        if (state.length) { break inf_leave; }
	      }
	      state.length = 0;
	      state.mode = NAME;
	      /* falls through */
	    case NAME:
	      if (state.flags & 0x0800) {
	        if (have === 0) { break inf_leave; }
	        copy = 0;
	        do {
	          // TODO: 2 or 1 bytes?
	          len = input[next + copy++];
	          /* use constant limit because in js we should not preallocate memory */
	          if (state.head && len &&
	              (state.length < 65536 /*state.head.name_max*/)) {
	            state.head.name += String.fromCharCode(len);
	          }
	        } while (len && copy < have);
	
	        if (state.flags & 0x0200) {
	          state.check = crc32(state.check, input, copy, next);
	        }
	        have -= copy;
	        next += copy;
	        if (len) { break inf_leave; }
	      }
	      else if (state.head) {
	        state.head.name = null;
	      }
	      state.length = 0;
	      state.mode = COMMENT;
	      /* falls through */
	    case COMMENT:
	      if (state.flags & 0x1000) {
	        if (have === 0) { break inf_leave; }
	        copy = 0;
	        do {
	          len = input[next + copy++];
	          /* use constant limit because in js we should not preallocate memory */
	          if (state.head && len &&
	              (state.length < 65536 /*state.head.comm_max*/)) {
	            state.head.comment += String.fromCharCode(len);
	          }
	        } while (len && copy < have);
	        if (state.flags & 0x0200) {
	          state.check = crc32(state.check, input, copy, next);
	        }
	        have -= copy;
	        next += copy;
	        if (len) { break inf_leave; }
	      }
	      else if (state.head) {
	        state.head.comment = null;
	      }
	      state.mode = HCRC;
	      /* falls through */
	    case HCRC:
	      if (state.flags & 0x0200) {
	        //=== NEEDBITS(16); */
	        while (bits < 16) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        if (hold !== (state.check & 0xffff)) {
	          strm.msg = 'header crc mismatch';
	          state.mode = BAD;
	          break;
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	      }
	      if (state.head) {
	        state.head.hcrc = ((state.flags >> 9) & 1);
	        state.head.done = true;
	      }
	      strm.adler = state.check = 0;
	      state.mode = TYPE;
	      break;
	    case DICTID:
	      //=== NEEDBITS(32); */
	      while (bits < 32) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      strm.adler = state.check = zswap32(hold);
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = DICT;
	      /* falls through */
	    case DICT:
	      if (state.havedict === 0) {
	        //--- RESTORE() ---
	        strm.next_out = put;
	        strm.avail_out = left;
	        strm.next_in = next;
	        strm.avail_in = have;
	        state.hold = hold;
	        state.bits = bits;
	        //---
	        return Z_NEED_DICT;
	      }
	      strm.adler = state.check = 1/*adler32(0L, Z_NULL, 0)*/;
	      state.mode = TYPE;
	      /* falls through */
	    case TYPE:
	      if (flush === Z_BLOCK || flush === Z_TREES) { break inf_leave; }
	      /* falls through */
	    case TYPEDO:
	      if (state.last) {
	        //--- BYTEBITS() ---//
	        hold >>>= bits & 7;
	        bits -= bits & 7;
	        //---//
	        state.mode = CHECK;
	        break;
	      }
	      //=== NEEDBITS(3); */
	      while (bits < 3) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      state.last = (hold & 0x01)/*BITS(1)*/;
	      //--- DROPBITS(1) ---//
	      hold >>>= 1;
	      bits -= 1;
	      //---//
	
	      switch ((hold & 0x03)/*BITS(2)*/) {
	      case 0:                             /* stored block */
	        //Tracev((stderr, "inflate:     stored block%s\n",
	        //        state.last ? " (last)" : ""));
	        state.mode = STORED;
	        break;
	      case 1:                             /* fixed block */
	        fixedtables(state);
	        //Tracev((stderr, "inflate:     fixed codes block%s\n",
	        //        state.last ? " (last)" : ""));
	        state.mode = LEN_;             /* decode codes */
	        if (flush === Z_TREES) {
	          //--- DROPBITS(2) ---//
	          hold >>>= 2;
	          bits -= 2;
	          //---//
	          break inf_leave;
	        }
	        break;
	      case 2:                             /* dynamic block */
	        //Tracev((stderr, "inflate:     dynamic codes block%s\n",
	        //        state.last ? " (last)" : ""));
	        state.mode = TABLE;
	        break;
	      case 3:
	        strm.msg = 'invalid block type';
	        state.mode = BAD;
	      }
	      //--- DROPBITS(2) ---//
	      hold >>>= 2;
	      bits -= 2;
	      //---//
	      break;
	    case STORED:
	      //--- BYTEBITS() ---// /* go to byte boundary */
	      hold >>>= bits & 7;
	      bits -= bits & 7;
	      //---//
	      //=== NEEDBITS(32); */
	      while (bits < 32) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      if ((hold & 0xffff) !== ((hold >>> 16) ^ 0xffff)) {
	        strm.msg = 'invalid stored block lengths';
	        state.mode = BAD;
	        break;
	      }
	      state.length = hold & 0xffff;
	      //Tracev((stderr, "inflate:       stored length %u\n",
	      //        state.length));
	      //=== INITBITS();
	      hold = 0;
	      bits = 0;
	      //===//
	      state.mode = COPY_;
	      if (flush === Z_TREES) { break inf_leave; }
	      /* falls through */
	    case COPY_:
	      state.mode = COPY;
	      /* falls through */
	    case COPY:
	      copy = state.length;
	      if (copy) {
	        if (copy > have) { copy = have; }
	        if (copy > left) { copy = left; }
	        if (copy === 0) { break inf_leave; }
	        //--- zmemcpy(put, next, copy); ---
	        utils.arraySet(output, input, next, copy, put);
	        //---//
	        have -= copy;
	        next += copy;
	        left -= copy;
	        put += copy;
	        state.length -= copy;
	        break;
	      }
	      //Tracev((stderr, "inflate:       stored end\n"));
	      state.mode = TYPE;
	      break;
	    case TABLE:
	      //=== NEEDBITS(14); */
	      while (bits < 14) {
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	      }
	      //===//
	      state.nlen = (hold & 0x1f)/*BITS(5)*/ + 257;
	      //--- DROPBITS(5) ---//
	      hold >>>= 5;
	      bits -= 5;
	      //---//
	      state.ndist = (hold & 0x1f)/*BITS(5)*/ + 1;
	      //--- DROPBITS(5) ---//
	      hold >>>= 5;
	      bits -= 5;
	      //---//
	      state.ncode = (hold & 0x0f)/*BITS(4)*/ + 4;
	      //--- DROPBITS(4) ---//
	      hold >>>= 4;
	      bits -= 4;
	      //---//
	//#ifndef PKZIP_BUG_WORKAROUND
	      if (state.nlen > 286 || state.ndist > 30) {
	        strm.msg = 'too many length or distance symbols';
	        state.mode = BAD;
	        break;
	      }
	//#endif
	      //Tracev((stderr, "inflate:       table sizes ok\n"));
	      state.have = 0;
	      state.mode = LENLENS;
	      /* falls through */
	    case LENLENS:
	      while (state.have < state.ncode) {
	        //=== NEEDBITS(3);
	        while (bits < 3) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.lens[order[state.have++]] = (hold & 0x07);//BITS(3);
	        //--- DROPBITS(3) ---//
	        hold >>>= 3;
	        bits -= 3;
	        //---//
	      }
	      while (state.have < 19) {
	        state.lens[order[state.have++]] = 0;
	      }
	      // We have separate tables & no pointers. 2 commented lines below not needed.
	      //state.next = state.codes;
	      //state.lencode = state.next;
	      // Switch to use dynamic table
	      state.lencode = state.lendyn;
	      state.lenbits = 7;
	
	      opts = { bits: state.lenbits };
	      ret = inflate_table(CODES, state.lens, 0, 19, state.lencode, 0, state.work, opts);
	      state.lenbits = opts.bits;
	
	      if (ret) {
	        strm.msg = 'invalid code lengths set';
	        state.mode = BAD;
	        break;
	      }
	      //Tracev((stderr, "inflate:       code lengths ok\n"));
	      state.have = 0;
	      state.mode = CODELENS;
	      /* falls through */
	    case CODELENS:
	      while (state.have < state.nlen + state.ndist) {
	        for (;;) {
	          here = state.lencode[hold & ((1 << state.lenbits) - 1)];/*BITS(state.lenbits)*/
	          here_bits = here >>> 24;
	          here_op = (here >>> 16) & 0xff;
	          here_val = here & 0xffff;
	
	          if ((here_bits) <= bits) { break; }
	          //--- PULLBYTE() ---//
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	          //---//
	        }
	        if (here_val < 16) {
	          //--- DROPBITS(here.bits) ---//
	          hold >>>= here_bits;
	          bits -= here_bits;
	          //---//
	          state.lens[state.have++] = here_val;
	        }
	        else {
	          if (here_val === 16) {
	            //=== NEEDBITS(here.bits + 2);
	            n = here_bits + 2;
	            while (bits < n) {
	              if (have === 0) { break inf_leave; }
	              have--;
	              hold += input[next++] << bits;
	              bits += 8;
	            }
	            //===//
	            //--- DROPBITS(here.bits) ---//
	            hold >>>= here_bits;
	            bits -= here_bits;
	            //---//
	            if (state.have === 0) {
	              strm.msg = 'invalid bit length repeat';
	              state.mode = BAD;
	              break;
	            }
	            len = state.lens[state.have - 1];
	            copy = 3 + (hold & 0x03);//BITS(2);
	            //--- DROPBITS(2) ---//
	            hold >>>= 2;
	            bits -= 2;
	            //---//
	          }
	          else if (here_val === 17) {
	            //=== NEEDBITS(here.bits + 3);
	            n = here_bits + 3;
	            while (bits < n) {
	              if (have === 0) { break inf_leave; }
	              have--;
	              hold += input[next++] << bits;
	              bits += 8;
	            }
	            //===//
	            //--- DROPBITS(here.bits) ---//
	            hold >>>= here_bits;
	            bits -= here_bits;
	            //---//
	            len = 0;
	            copy = 3 + (hold & 0x07);//BITS(3);
	            //--- DROPBITS(3) ---//
	            hold >>>= 3;
	            bits -= 3;
	            //---//
	          }
	          else {
	            //=== NEEDBITS(here.bits + 7);
	            n = here_bits + 7;
	            while (bits < n) {
	              if (have === 0) { break inf_leave; }
	              have--;
	              hold += input[next++] << bits;
	              bits += 8;
	            }
	            //===//
	            //--- DROPBITS(here.bits) ---//
	            hold >>>= here_bits;
	            bits -= here_bits;
	            //---//
	            len = 0;
	            copy = 11 + (hold & 0x7f);//BITS(7);
	            //--- DROPBITS(7) ---//
	            hold >>>= 7;
	            bits -= 7;
	            //---//
	          }
	          if (state.have + copy > state.nlen + state.ndist) {
	            strm.msg = 'invalid bit length repeat';
	            state.mode = BAD;
	            break;
	          }
	          while (copy--) {
	            state.lens[state.have++] = len;
	          }
	        }
	      }
	
	      /* handle error breaks in while */
	      if (state.mode === BAD) { break; }
	
	      /* check for end-of-block code (better have one) */
	      if (state.lens[256] === 0) {
	        strm.msg = 'invalid code -- missing end-of-block';
	        state.mode = BAD;
	        break;
	      }
	
	      /* build code tables -- note: do not change the lenbits or distbits
	         values here (9 and 6) without reading the comments in inftrees.h
	         concerning the ENOUGH constants, which depend on those values */
	      state.lenbits = 9;
	
	      opts = { bits: state.lenbits };
	      ret = inflate_table(LENS, state.lens, 0, state.nlen, state.lencode, 0, state.work, opts);
	      // We have separate tables & no pointers. 2 commented lines below not needed.
	      // state.next_index = opts.table_index;
	      state.lenbits = opts.bits;
	      // state.lencode = state.next;
	
	      if (ret) {
	        strm.msg = 'invalid literal/lengths set';
	        state.mode = BAD;
	        break;
	      }
	
	      state.distbits = 6;
	      //state.distcode.copy(state.codes);
	      // Switch to use dynamic table
	      state.distcode = state.distdyn;
	      opts = { bits: state.distbits };
	      ret = inflate_table(DISTS, state.lens, state.nlen, state.ndist, state.distcode, 0, state.work, opts);
	      // We have separate tables & no pointers. 2 commented lines below not needed.
	      // state.next_index = opts.table_index;
	      state.distbits = opts.bits;
	      // state.distcode = state.next;
	
	      if (ret) {
	        strm.msg = 'invalid distances set';
	        state.mode = BAD;
	        break;
	      }
	      //Tracev((stderr, 'inflate:       codes ok\n'));
	      state.mode = LEN_;
	      if (flush === Z_TREES) { break inf_leave; }
	      /* falls through */
	    case LEN_:
	      state.mode = LEN;
	      /* falls through */
	    case LEN:
	      if (have >= 6 && left >= 258) {
	        //--- RESTORE() ---
	        strm.next_out = put;
	        strm.avail_out = left;
	        strm.next_in = next;
	        strm.avail_in = have;
	        state.hold = hold;
	        state.bits = bits;
	        //---
	        inflate_fast(strm, _out);
	        //--- LOAD() ---
	        put = strm.next_out;
	        output = strm.output;
	        left = strm.avail_out;
	        next = strm.next_in;
	        input = strm.input;
	        have = strm.avail_in;
	        hold = state.hold;
	        bits = state.bits;
	        //---
	
	        if (state.mode === TYPE) {
	          state.back = -1;
	        }
	        break;
	      }
	      state.back = 0;
	      for (;;) {
	        here = state.lencode[hold & ((1 << state.lenbits) - 1)];  /*BITS(state.lenbits)*/
	        here_bits = here >>> 24;
	        here_op = (here >>> 16) & 0xff;
	        here_val = here & 0xffff;
	
	        if (here_bits <= bits) { break; }
	        //--- PULLBYTE() ---//
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	        //---//
	      }
	      if (here_op && (here_op & 0xf0) === 0) {
	        last_bits = here_bits;
	        last_op = here_op;
	        last_val = here_val;
	        for (;;) {
	          here = state.lencode[last_val +
	                  ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
	          here_bits = here >>> 24;
	          here_op = (here >>> 16) & 0xff;
	          here_val = here & 0xffff;
	
	          if ((last_bits + here_bits) <= bits) { break; }
	          //--- PULLBYTE() ---//
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	          //---//
	        }
	        //--- DROPBITS(last.bits) ---//
	        hold >>>= last_bits;
	        bits -= last_bits;
	        //---//
	        state.back += last_bits;
	      }
	      //--- DROPBITS(here.bits) ---//
	      hold >>>= here_bits;
	      bits -= here_bits;
	      //---//
	      state.back += here_bits;
	      state.length = here_val;
	      if (here_op === 0) {
	        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
	        //        "inflate:         literal '%c'\n" :
	        //        "inflate:         literal 0x%02x\n", here.val));
	        state.mode = LIT;
	        break;
	      }
	      if (here_op & 32) {
	        //Tracevv((stderr, "inflate:         end of block\n"));
	        state.back = -1;
	        state.mode = TYPE;
	        break;
	      }
	      if (here_op & 64) {
	        strm.msg = 'invalid literal/length code';
	        state.mode = BAD;
	        break;
	      }
	      state.extra = here_op & 15;
	      state.mode = LENEXT;
	      /* falls through */
	    case LENEXT:
	      if (state.extra) {
	        //=== NEEDBITS(state.extra);
	        n = state.extra;
	        while (bits < n) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.length += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
	        //--- DROPBITS(state.extra) ---//
	        hold >>>= state.extra;
	        bits -= state.extra;
	        //---//
	        state.back += state.extra;
	      }
	      //Tracevv((stderr, "inflate:         length %u\n", state.length));
	      state.was = state.length;
	      state.mode = DIST;
	      /* falls through */
	    case DIST:
	      for (;;) {
	        here = state.distcode[hold & ((1 << state.distbits) - 1)];/*BITS(state.distbits)*/
	        here_bits = here >>> 24;
	        here_op = (here >>> 16) & 0xff;
	        here_val = here & 0xffff;
	
	        if ((here_bits) <= bits) { break; }
	        //--- PULLBYTE() ---//
	        if (have === 0) { break inf_leave; }
	        have--;
	        hold += input[next++] << bits;
	        bits += 8;
	        //---//
	      }
	      if ((here_op & 0xf0) === 0) {
	        last_bits = here_bits;
	        last_op = here_op;
	        last_val = here_val;
	        for (;;) {
	          here = state.distcode[last_val +
	                  ((hold & ((1 << (last_bits + last_op)) - 1))/*BITS(last.bits + last.op)*/ >> last_bits)];
	          here_bits = here >>> 24;
	          here_op = (here >>> 16) & 0xff;
	          here_val = here & 0xffff;
	
	          if ((last_bits + here_bits) <= bits) { break; }
	          //--- PULLBYTE() ---//
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	          //---//
	        }
	        //--- DROPBITS(last.bits) ---//
	        hold >>>= last_bits;
	        bits -= last_bits;
	        //---//
	        state.back += last_bits;
	      }
	      //--- DROPBITS(here.bits) ---//
	      hold >>>= here_bits;
	      bits -= here_bits;
	      //---//
	      state.back += here_bits;
	      if (here_op & 64) {
	        strm.msg = 'invalid distance code';
	        state.mode = BAD;
	        break;
	      }
	      state.offset = here_val;
	      state.extra = (here_op) & 15;
	      state.mode = DISTEXT;
	      /* falls through */
	    case DISTEXT:
	      if (state.extra) {
	        //=== NEEDBITS(state.extra);
	        n = state.extra;
	        while (bits < n) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        state.offset += hold & ((1 << state.extra) - 1)/*BITS(state.extra)*/;
	        //--- DROPBITS(state.extra) ---//
	        hold >>>= state.extra;
	        bits -= state.extra;
	        //---//
	        state.back += state.extra;
	      }
	//#ifdef INFLATE_STRICT
	      if (state.offset > state.dmax) {
	        strm.msg = 'invalid distance too far back';
	        state.mode = BAD;
	        break;
	      }
	//#endif
	      //Tracevv((stderr, "inflate:         distance %u\n", state.offset));
	      state.mode = MATCH;
	      /* falls through */
	    case MATCH:
	      if (left === 0) { break inf_leave; }
	      copy = _out - left;
	      if (state.offset > copy) {         /* copy from window */
	        copy = state.offset - copy;
	        if (copy > state.whave) {
	          if (state.sane) {
	            strm.msg = 'invalid distance too far back';
	            state.mode = BAD;
	            break;
	          }
	// (!) This block is disabled in zlib defailts,
	// don't enable it for binary compatibility
	//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
	//          Trace((stderr, "inflate.c too far\n"));
	//          copy -= state.whave;
	//          if (copy > state.length) { copy = state.length; }
	//          if (copy > left) { copy = left; }
	//          left -= copy;
	//          state.length -= copy;
	//          do {
	//            output[put++] = 0;
	//          } while (--copy);
	//          if (state.length === 0) { state.mode = LEN; }
	//          break;
	//#endif
	        }
	        if (copy > state.wnext) {
	          copy -= state.wnext;
	          from = state.wsize - copy;
	        }
	        else {
	          from = state.wnext - copy;
	        }
	        if (copy > state.length) { copy = state.length; }
	        from_source = state.window;
	      }
	      else {                              /* copy from output */
	        from_source = output;
	        from = put - state.offset;
	        copy = state.length;
	      }
	      if (copy > left) { copy = left; }
	      left -= copy;
	      state.length -= copy;
	      do {
	        output[put++] = from_source[from++];
	      } while (--copy);
	      if (state.length === 0) { state.mode = LEN; }
	      break;
	    case LIT:
	      if (left === 0) { break inf_leave; }
	      output[put++] = state.length;
	      left--;
	      state.mode = LEN;
	      break;
	    case CHECK:
	      if (state.wrap) {
	        //=== NEEDBITS(32);
	        while (bits < 32) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          // Use '|' insdead of '+' to make sure that result is signed
	          hold |= input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        _out -= left;
	        strm.total_out += _out;
	        state.total += _out;
	        if (_out) {
	          strm.adler = state.check =
	              /*UPDATE(state.check, put - _out, _out);*/
	              (state.flags ? crc32(state.check, output, _out, put - _out) : adler32(state.check, output, _out, put - _out));
	
	        }
	        _out = left;
	        // NB: crc32 stored as signed 32-bit int, zswap32 returns signed too
	        if ((state.flags ? hold : zswap32(hold)) !== state.check) {
	          strm.msg = 'incorrect data check';
	          state.mode = BAD;
	          break;
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        //Tracev((stderr, "inflate:   check matches trailer\n"));
	      }
	      state.mode = LENGTH;
	      /* falls through */
	    case LENGTH:
	      if (state.wrap && state.flags) {
	        //=== NEEDBITS(32);
	        while (bits < 32) {
	          if (have === 0) { break inf_leave; }
	          have--;
	          hold += input[next++] << bits;
	          bits += 8;
	        }
	        //===//
	        if (hold !== (state.total & 0xffffffff)) {
	          strm.msg = 'incorrect length check';
	          state.mode = BAD;
	          break;
	        }
	        //=== INITBITS();
	        hold = 0;
	        bits = 0;
	        //===//
	        //Tracev((stderr, "inflate:   length matches trailer\n"));
	      }
	      state.mode = DONE;
	      /* falls through */
	    case DONE:
	      ret = Z_STREAM_END;
	      break inf_leave;
	    case BAD:
	      ret = Z_DATA_ERROR;
	      break inf_leave;
	    case MEM:
	      return Z_MEM_ERROR;
	    case SYNC:
	      /* falls through */
	    default:
	      return Z_STREAM_ERROR;
	    }
	  }
	
	  // inf_leave <- here is real place for "goto inf_leave", emulated via "break inf_leave"
	
	  /*
	     Return from inflate(), updating the total counts and the check value.
	     If there was no progress during the inflate() call, return a buffer
	     error.  Call updatewindow() to create and/or update the window state.
	     Note: a memory error from inflate() is non-recoverable.
	   */
	
	  //--- RESTORE() ---
	  strm.next_out = put;
	  strm.avail_out = left;
	  strm.next_in = next;
	  strm.avail_in = have;
	  state.hold = hold;
	  state.bits = bits;
	  //---
	
	  if (state.wsize || (_out !== strm.avail_out && state.mode < BAD &&
	                      (state.mode < CHECK || flush !== Z_FINISH))) {
	    if (updatewindow(strm, strm.output, strm.next_out, _out - strm.avail_out)) {
	      state.mode = MEM;
	      return Z_MEM_ERROR;
	    }
	  }
	  _in -= strm.avail_in;
	  _out -= strm.avail_out;
	  strm.total_in += _in;
	  strm.total_out += _out;
	  state.total += _out;
	  if (state.wrap && _out) {
	    strm.adler = state.check = /*UPDATE(state.check, strm.next_out - _out, _out);*/
	      (state.flags ? crc32(state.check, output, _out, strm.next_out - _out) : adler32(state.check, output, _out, strm.next_out - _out));
	  }
	  strm.data_type = state.bits + (state.last ? 64 : 0) +
	                    (state.mode === TYPE ? 128 : 0) +
	                    (state.mode === LEN_ || state.mode === COPY_ ? 256 : 0);
	  if (((_in === 0 && _out === 0) || flush === Z_FINISH) && ret === Z_OK) {
	    ret = Z_BUF_ERROR;
	  }
	  return ret;
	}
	
	function inflateEnd(strm) {
	
	  if (!strm || !strm.state /*|| strm->zfree == (free_func)0*/) {
	    return Z_STREAM_ERROR;
	  }
	
	  var state = strm.state;
	  if (state.window) {
	    state.window = null;
	  }
	  strm.state = null;
	  return Z_OK;
	}
	
	function inflateGetHeader(strm, head) {
	  var state;
	
	  /* check state */
	  if (!strm || !strm.state) { return Z_STREAM_ERROR; }
	  state = strm.state;
	  if ((state.wrap & 2) === 0) { return Z_STREAM_ERROR; }
	
	  /* save header structure */
	  state.head = head;
	  head.done = false;
	  return Z_OK;
	}
	
	function inflateSetDictionary(strm, dictionary) {
	  var dictLength = dictionary.length;
	
	  var state;
	  var dictid;
	  var ret;
	
	  /* check state */
	  if (!strm /* == Z_NULL */ || !strm.state /* == Z_NULL */) { return Z_STREAM_ERROR; }
	  state = strm.state;
	
	  if (state.wrap !== 0 && state.mode !== DICT) {
	    return Z_STREAM_ERROR;
	  }
	
	  /* check for correct dictionary identifier */
	  if (state.mode === DICT) {
	    dictid = 1; /* adler32(0, null, 0)*/
	    /* dictid = adler32(dictid, dictionary, dictLength); */
	    dictid = adler32(dictid, dictionary, dictLength, 0);
	    if (dictid !== state.check) {
	      return Z_DATA_ERROR;
	    }
	  }
	  /* copy dictionary to window using updatewindow(), which will amend the
	   existing dictionary if appropriate */
	  ret = updatewindow(strm, dictionary, dictLength, dictLength);
	  if (ret) {
	    state.mode = MEM;
	    return Z_MEM_ERROR;
	  }
	  state.havedict = 1;
	  // Tracev((stderr, "inflate:   dictionary set\n"));
	  return Z_OK;
	}
	
	exports.inflateReset = inflateReset;
	exports.inflateReset2 = inflateReset2;
	exports.inflateResetKeep = inflateResetKeep;
	exports.inflateInit = inflateInit;
	exports.inflateInit2 = inflateInit2;
	exports.inflate = inflate;
	exports.inflateEnd = inflateEnd;
	exports.inflateGetHeader = inflateGetHeader;
	exports.inflateSetDictionary = inflateSetDictionary;
	exports.inflateInfo = 'pako inflate (from Nodeca project)';
	
	/* Not implemented
	exports.inflateCopy = inflateCopy;
	exports.inflateGetDictionary = inflateGetDictionary;
	exports.inflateMark = inflateMark;
	exports.inflatePrime = inflatePrime;
	exports.inflateSync = inflateSync;
	exports.inflateSyncPoint = inflateSyncPoint;
	exports.inflateUndermine = inflateUndermine;
	*/


/***/ },
/* 206 */
/***/ function(module, exports) {

	'use strict';
	
	// See state defs from inflate.js
	var BAD = 30;       /* got a data error -- remain here until reset */
	var TYPE = 12;      /* i: waiting for type bits, including last-flag bit */
	
	/*
	   Decode literal, length, and distance codes and write out the resulting
	   literal and match bytes until either not enough input or output is
	   available, an end-of-block is encountered, or a data error is encountered.
	   When large enough input and output buffers are supplied to inflate(), for
	   example, a 16K input buffer and a 64K output buffer, more than 95% of the
	   inflate execution time is spent in this routine.
	
	   Entry assumptions:
	
	        state.mode === LEN
	        strm.avail_in >= 6
	        strm.avail_out >= 258
	        start >= strm.avail_out
	        state.bits < 8
	
	   On return, state.mode is one of:
	
	        LEN -- ran out of enough output space or enough available input
	        TYPE -- reached end of block code, inflate() to interpret next block
	        BAD -- error in block data
	
	   Notes:
	
	    - The maximum input bits used by a length/distance pair is 15 bits for the
	      length code, 5 bits for the length extra, 15 bits for the distance code,
	      and 13 bits for the distance extra.  This totals 48 bits, or six bytes.
	      Therefore if strm.avail_in >= 6, then there is enough input to avoid
	      checking for available input while decoding.
	
	    - The maximum bytes that a single length/distance pair can output is 258
	      bytes, which is the maximum length that can be coded.  inflate_fast()
	      requires strm.avail_out >= 258 for each loop to avoid checking for
	      output space.
	 */
	module.exports = function inflate_fast(strm, start) {
	  var state;
	  var _in;                    /* local strm.input */
	  var last;                   /* have enough input while in < last */
	  var _out;                   /* local strm.output */
	  var beg;                    /* inflate()'s initial strm.output */
	  var end;                    /* while out < end, enough space available */
	//#ifdef INFLATE_STRICT
	  var dmax;                   /* maximum distance from zlib header */
	//#endif
	  var wsize;                  /* window size or zero if not using window */
	  var whave;                  /* valid bytes in the window */
	  var wnext;                  /* window write index */
	  // Use `s_window` instead `window`, avoid conflict with instrumentation tools
	  var s_window;               /* allocated sliding window, if wsize != 0 */
	  var hold;                   /* local strm.hold */
	  var bits;                   /* local strm.bits */
	  var lcode;                  /* local strm.lencode */
	  var dcode;                  /* local strm.distcode */
	  var lmask;                  /* mask for first level of length codes */
	  var dmask;                  /* mask for first level of distance codes */
	  var here;                   /* retrieved table entry */
	  var op;                     /* code bits, operation, extra bits, or */
	                              /*  window position, window bytes to copy */
	  var len;                    /* match length, unused bytes */
	  var dist;                   /* match distance */
	  var from;                   /* where to copy match from */
	  var from_source;
	
	
	  var input, output; // JS specific, because we have no pointers
	
	  /* copy state to local variables */
	  state = strm.state;
	  //here = state.here;
	  _in = strm.next_in;
	  input = strm.input;
	  last = _in + (strm.avail_in - 5);
	  _out = strm.next_out;
	  output = strm.output;
	  beg = _out - (start - strm.avail_out);
	  end = _out + (strm.avail_out - 257);
	//#ifdef INFLATE_STRICT
	  dmax = state.dmax;
	//#endif
	  wsize = state.wsize;
	  whave = state.whave;
	  wnext = state.wnext;
	  s_window = state.window;
	  hold = state.hold;
	  bits = state.bits;
	  lcode = state.lencode;
	  dcode = state.distcode;
	  lmask = (1 << state.lenbits) - 1;
	  dmask = (1 << state.distbits) - 1;
	
	
	  /* decode literals and length/distances until end-of-block or not enough
	     input data or output space */
	
	  top:
	  do {
	    if (bits < 15) {
	      hold += input[_in++] << bits;
	      bits += 8;
	      hold += input[_in++] << bits;
	      bits += 8;
	    }
	
	    here = lcode[hold & lmask];
	
	    dolen:
	    for (;;) { // Goto emulation
	      op = here >>> 24/*here.bits*/;
	      hold >>>= op;
	      bits -= op;
	      op = (here >>> 16) & 0xff/*here.op*/;
	      if (op === 0) {                          /* literal */
	        //Tracevv((stderr, here.val >= 0x20 && here.val < 0x7f ?
	        //        "inflate:         literal '%c'\n" :
	        //        "inflate:         literal 0x%02x\n", here.val));
	        output[_out++] = here & 0xffff/*here.val*/;
	      }
	      else if (op & 16) {                     /* length base */
	        len = here & 0xffff/*here.val*/;
	        op &= 15;                           /* number of extra bits */
	        if (op) {
	          if (bits < op) {
	            hold += input[_in++] << bits;
	            bits += 8;
	          }
	          len += hold & ((1 << op) - 1);
	          hold >>>= op;
	          bits -= op;
	        }
	        //Tracevv((stderr, "inflate:         length %u\n", len));
	        if (bits < 15) {
	          hold += input[_in++] << bits;
	          bits += 8;
	          hold += input[_in++] << bits;
	          bits += 8;
	        }
	        here = dcode[hold & dmask];
	
	        dodist:
	        for (;;) { // goto emulation
	          op = here >>> 24/*here.bits*/;
	          hold >>>= op;
	          bits -= op;
	          op = (here >>> 16) & 0xff/*here.op*/;
	
	          if (op & 16) {                      /* distance base */
	            dist = here & 0xffff/*here.val*/;
	            op &= 15;                       /* number of extra bits */
	            if (bits < op) {
	              hold += input[_in++] << bits;
	              bits += 8;
	              if (bits < op) {
	                hold += input[_in++] << bits;
	                bits += 8;
	              }
	            }
	            dist += hold & ((1 << op) - 1);
	//#ifdef INFLATE_STRICT
	            if (dist > dmax) {
	              strm.msg = 'invalid distance too far back';
	              state.mode = BAD;
	              break top;
	            }
	//#endif
	            hold >>>= op;
	            bits -= op;
	            //Tracevv((stderr, "inflate:         distance %u\n", dist));
	            op = _out - beg;                /* max distance in output */
	            if (dist > op) {                /* see if copy from window */
	              op = dist - op;               /* distance back in window */
	              if (op > whave) {
	                if (state.sane) {
	                  strm.msg = 'invalid distance too far back';
	                  state.mode = BAD;
	                  break top;
	                }
	
	// (!) This block is disabled in zlib defailts,
	// don't enable it for binary compatibility
	//#ifdef INFLATE_ALLOW_INVALID_DISTANCE_TOOFAR_ARRR
	//                if (len <= op - whave) {
	//                  do {
	//                    output[_out++] = 0;
	//                  } while (--len);
	//                  continue top;
	//                }
	//                len -= op - whave;
	//                do {
	//                  output[_out++] = 0;
	//                } while (--op > whave);
	//                if (op === 0) {
	//                  from = _out - dist;
	//                  do {
	//                    output[_out++] = output[from++];
	//                  } while (--len);
	//                  continue top;
	//                }
	//#endif
	              }
	              from = 0; // window index
	              from_source = s_window;
	              if (wnext === 0) {           /* very common case */
	                from += wsize - op;
	                if (op < len) {         /* some from window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = _out - dist;  /* rest from output */
	                  from_source = output;
	                }
	              }
	              else if (wnext < op) {      /* wrap around window */
	                from += wsize + wnext - op;
	                op -= wnext;
	                if (op < len) {         /* some from end of window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = 0;
	                  if (wnext < len) {  /* some from start of window */
	                    op = wnext;
	                    len -= op;
	                    do {
	                      output[_out++] = s_window[from++];
	                    } while (--op);
	                    from = _out - dist;      /* rest from output */
	                    from_source = output;
	                  }
	                }
	              }
	              else {                      /* contiguous in window */
	                from += wnext - op;
	                if (op < len) {         /* some from window */
	                  len -= op;
	                  do {
	                    output[_out++] = s_window[from++];
	                  } while (--op);
	                  from = _out - dist;  /* rest from output */
	                  from_source = output;
	                }
	              }
	              while (len > 2) {
	                output[_out++] = from_source[from++];
	                output[_out++] = from_source[from++];
	                output[_out++] = from_source[from++];
	                len -= 3;
	              }
	              if (len) {
	                output[_out++] = from_source[from++];
	                if (len > 1) {
	                  output[_out++] = from_source[from++];
	                }
	              }
	            }
	            else {
	              from = _out - dist;          /* copy direct from output */
	              do {                        /* minimum length is three */
	                output[_out++] = output[from++];
	                output[_out++] = output[from++];
	                output[_out++] = output[from++];
	                len -= 3;
	              } while (len > 2);
	              if (len) {
	                output[_out++] = output[from++];
	                if (len > 1) {
	                  output[_out++] = output[from++];
	                }
	              }
	            }
	          }
	          else if ((op & 64) === 0) {          /* 2nd level distance code */
	            here = dcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
	            continue dodist;
	          }
	          else {
	            strm.msg = 'invalid distance code';
	            state.mode = BAD;
	            break top;
	          }
	
	          break; // need to emulate goto via "continue"
	        }
	      }
	      else if ((op & 64) === 0) {              /* 2nd level length code */
	        here = lcode[(here & 0xffff)/*here.val*/ + (hold & ((1 << op) - 1))];
	        continue dolen;
	      }
	      else if (op & 32) {                     /* end-of-block */
	        //Tracevv((stderr, "inflate:         end of block\n"));
	        state.mode = TYPE;
	        break top;
	      }
	      else {
	        strm.msg = 'invalid literal/length code';
	        state.mode = BAD;
	        break top;
	      }
	
	      break; // need to emulate goto via "continue"
	    }
	  } while (_in < last && _out < end);
	
	  /* return unused bytes (on entry, bits < 8, so in won't go too far back) */
	  len = bits >> 3;
	  _in -= len;
	  bits -= len << 3;
	  hold &= (1 << bits) - 1;
	
	  /* update state and return */
	  strm.next_in = _in;
	  strm.next_out = _out;
	  strm.avail_in = (_in < last ? 5 + (last - _in) : 5 - (_in - last));
	  strm.avail_out = (_out < end ? 257 + (end - _out) : 257 - (_out - end));
	  state.hold = hold;
	  state.bits = bits;
	  return;
	};


/***/ },
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	
	var utils = __webpack_require__(195);
	
	var MAXBITS = 15;
	var ENOUGH_LENS = 852;
	var ENOUGH_DISTS = 592;
	//var ENOUGH = (ENOUGH_LENS+ENOUGH_DISTS);
	
	var CODES = 0;
	var LENS = 1;
	var DISTS = 2;
	
	var lbase = [ /* Length codes 257..285 base */
	  3, 4, 5, 6, 7, 8, 9, 10, 11, 13, 15, 17, 19, 23, 27, 31,
	  35, 43, 51, 59, 67, 83, 99, 115, 131, 163, 195, 227, 258, 0, 0
	];
	
	var lext = [ /* Length codes 257..285 extra */
	  16, 16, 16, 16, 16, 16, 16, 16, 17, 17, 17, 17, 18, 18, 18, 18,
	  19, 19, 19, 19, 20, 20, 20, 20, 21, 21, 21, 21, 16, 72, 78
	];
	
	var dbase = [ /* Distance codes 0..29 base */
	  1, 2, 3, 4, 5, 7, 9, 13, 17, 25, 33, 49, 65, 97, 129, 193,
	  257, 385, 513, 769, 1025, 1537, 2049, 3073, 4097, 6145,
	  8193, 12289, 16385, 24577, 0, 0
	];
	
	var dext = [ /* Distance codes 0..29 extra */
	  16, 16, 16, 16, 17, 17, 18, 18, 19, 19, 20, 20, 21, 21, 22, 22,
	  23, 23, 24, 24, 25, 25, 26, 26, 27, 27,
	  28, 28, 29, 29, 64, 64
	];
	
	module.exports = function inflate_table(type, lens, lens_index, codes, table, table_index, work, opts)
	{
	  var bits = opts.bits;
	      //here = opts.here; /* table entry for duplication */
	
	  var len = 0;               /* a code's length in bits */
	  var sym = 0;               /* index of code symbols */
	  var min = 0, max = 0;          /* minimum and maximum code lengths */
	  var root = 0;              /* number of index bits for root table */
	  var curr = 0;              /* number of index bits for current table */
	  var drop = 0;              /* code bits to drop for sub-table */
	  var left = 0;                   /* number of prefix codes available */
	  var used = 0;              /* code entries in table used */
	  var huff = 0;              /* Huffman code */
	  var incr;              /* for incrementing code, index */
	  var fill;              /* index for replicating entries */
	  var low;               /* low bits for current root entry */
	  var mask;              /* mask for low root bits */
	  var next;             /* next available space in table */
	  var base = null;     /* base value table to use */
	  var base_index = 0;
	//  var shoextra;    /* extra bits table to use */
	  var end;                    /* use base and extra for symbol > end */
	  var count = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];    /* number of codes of each length */
	  var offs = new utils.Buf16(MAXBITS + 1); //[MAXBITS+1];     /* offsets in table for each length */
	  var extra = null;
	  var extra_index = 0;
	
	  var here_bits, here_op, here_val;
	
	  /*
	   Process a set of code lengths to create a canonical Huffman code.  The
	   code lengths are lens[0..codes-1].  Each length corresponds to the
	   symbols 0..codes-1.  The Huffman code is generated by first sorting the
	   symbols by length from short to long, and retaining the symbol order
	   for codes with equal lengths.  Then the code starts with all zero bits
	   for the first code of the shortest length, and the codes are integer
	   increments for the same length, and zeros are appended as the length
	   increases.  For the deflate format, these bits are stored backwards
	   from their more natural integer increment ordering, and so when the
	   decoding tables are built in the large loop below, the integer codes
	   are incremented backwards.
	
	   This routine assumes, but does not check, that all of the entries in
	   lens[] are in the range 0..MAXBITS.  The caller must assure this.
	   1..MAXBITS is interpreted as that code length.  zero means that that
	   symbol does not occur in this code.
	
	   The codes are sorted by computing a count of codes for each length,
	   creating from that a table of starting indices for each length in the
	   sorted table, and then entering the symbols in order in the sorted
	   table.  The sorted table is work[], with that space being provided by
	   the caller.
	
	   The length counts are used for other purposes as well, i.e. finding
	   the minimum and maximum length codes, determining if there are any
	   codes at all, checking for a valid set of lengths, and looking ahead
	   at length counts to determine sub-table sizes when building the
	   decoding tables.
	   */
	
	  /* accumulate lengths for codes (assumes lens[] all in 0..MAXBITS) */
	  for (len = 0; len <= MAXBITS; len++) {
	    count[len] = 0;
	  }
	  for (sym = 0; sym < codes; sym++) {
	    count[lens[lens_index + sym]]++;
	  }
	
	  /* bound code lengths, force root to be within code lengths */
	  root = bits;
	  for (max = MAXBITS; max >= 1; max--) {
	    if (count[max] !== 0) { break; }
	  }
	  if (root > max) {
	    root = max;
	  }
	  if (max === 0) {                     /* no symbols to code at all */
	    //table.op[opts.table_index] = 64;  //here.op = (var char)64;    /* invalid code marker */
	    //table.bits[opts.table_index] = 1;   //here.bits = (var char)1;
	    //table.val[opts.table_index++] = 0;   //here.val = (var short)0;
	    table[table_index++] = (1 << 24) | (64 << 16) | 0;
	
	
	    //table.op[opts.table_index] = 64;
	    //table.bits[opts.table_index] = 1;
	    //table.val[opts.table_index++] = 0;
	    table[table_index++] = (1 << 24) | (64 << 16) | 0;
	
	    opts.bits = 1;
	    return 0;     /* no symbols, but wait for decoding to report error */
	  }
	  for (min = 1; min < max; min++) {
	    if (count[min] !== 0) { break; }
	  }
	  if (root < min) {
	    root = min;
	  }
	
	  /* check for an over-subscribed or incomplete set of lengths */
	  left = 1;
	  for (len = 1; len <= MAXBITS; len++) {
	    left <<= 1;
	    left -= count[len];
	    if (left < 0) {
	      return -1;
	    }        /* over-subscribed */
	  }
	  if (left > 0 && (type === CODES || max !== 1)) {
	    return -1;                      /* incomplete set */
	  }
	
	  /* generate offsets into symbol table for each length for sorting */
	  offs[1] = 0;
	  for (len = 1; len < MAXBITS; len++) {
	    offs[len + 1] = offs[len] + count[len];
	  }
	
	  /* sort symbols by length, by symbol order within each length */
	  for (sym = 0; sym < codes; sym++) {
	    if (lens[lens_index + sym] !== 0) {
	      work[offs[lens[lens_index + sym]]++] = sym;
	    }
	  }
	
	  /*
	   Create and fill in decoding tables.  In this loop, the table being
	   filled is at next and has curr index bits.  The code being used is huff
	   with length len.  That code is converted to an index by dropping drop
	   bits off of the bottom.  For codes where len is less than drop + curr,
	   those top drop + curr - len bits are incremented through all values to
	   fill the table with replicated entries.
	
	   root is the number of index bits for the root table.  When len exceeds
	   root, sub-tables are created pointed to by the root entry with an index
	   of the low root bits of huff.  This is saved in low to check for when a
	   new sub-table should be started.  drop is zero when the root table is
	   being filled, and drop is root when sub-tables are being filled.
	
	   When a new sub-table is needed, it is necessary to look ahead in the
	   code lengths to determine what size sub-table is needed.  The length
	   counts are used for this, and so count[] is decremented as codes are
	   entered in the tables.
	
	   used keeps track of how many table entries have been allocated from the
	   provided *table space.  It is checked for LENS and DIST tables against
	   the constants ENOUGH_LENS and ENOUGH_DISTS to guard against changes in
	   the initial root table size constants.  See the comments in inftrees.h
	   for more information.
	
	   sym increments through all symbols, and the loop terminates when
	   all codes of length max, i.e. all codes, have been processed.  This
	   routine permits incomplete codes, so another loop after this one fills
	   in the rest of the decoding tables with invalid code markers.
	   */
	
	  /* set up for code type */
	  // poor man optimization - use if-else instead of switch,
	  // to avoid deopts in old v8
	  if (type === CODES) {
	    base = extra = work;    /* dummy value--not used */
	    end = 19;
	
	  } else if (type === LENS) {
	    base = lbase;
	    base_index -= 257;
	    extra = lext;
	    extra_index -= 257;
	    end = 256;
	
	  } else {                    /* DISTS */
	    base = dbase;
	    extra = dext;
	    end = -1;
	  }
	
	  /* initialize opts for loop */
	  huff = 0;                   /* starting code */
	  sym = 0;                    /* starting code symbol */
	  len = min;                  /* starting code length */
	  next = table_index;              /* current table to fill in */
	  curr = root;                /* current table index bits */
	  drop = 0;                   /* current bits to drop from code for index */
	  low = -1;                   /* trigger new sub-table when len > root */
	  used = 1 << root;          /* use root table entries */
	  mask = used - 1;            /* mask for comparing low */
	
	  /* check available table space */
	  if ((type === LENS && used > ENOUGH_LENS) ||
	    (type === DISTS && used > ENOUGH_DISTS)) {
	    return 1;
	  }
	
	  var i = 0;
	  /* process all codes and make table entries */
	  for (;;) {
	    i++;
	    /* create table entry */
	    here_bits = len - drop;
	    if (work[sym] < end) {
	      here_op = 0;
	      here_val = work[sym];
	    }
	    else if (work[sym] > end) {
	      here_op = extra[extra_index + work[sym]];
	      here_val = base[base_index + work[sym]];
	    }
	    else {
	      here_op = 32 + 64;         /* end of block */
	      here_val = 0;
	    }
	
	    /* replicate for those indices with low len bits equal to huff */
	    incr = 1 << (len - drop);
	    fill = 1 << curr;
	    min = fill;                 /* save offset to next table */
	    do {
	      fill -= incr;
	      table[next + (huff >> drop) + fill] = (here_bits << 24) | (here_op << 16) | here_val |0;
	    } while (fill !== 0);
	
	    /* backwards increment the len-bit code huff */
	    incr = 1 << (len - 1);
	    while (huff & incr) {
	      incr >>= 1;
	    }
	    if (incr !== 0) {
	      huff &= incr - 1;
	      huff += incr;
	    } else {
	      huff = 0;
	    }
	
	    /* go to next symbol, update count, len */
	    sym++;
	    if (--count[len] === 0) {
	      if (len === max) { break; }
	      len = lens[lens_index + work[sym]];
	    }
	
	    /* create new sub-table if needed */
	    if (len > root && (huff & mask) !== low) {
	      /* if first time, transition to sub-tables */
	      if (drop === 0) {
	        drop = root;
	      }
	
	      /* increment past last table */
	      next += min;            /* here min is 1 << curr */
	
	      /* determine length of next table */
	      curr = len - drop;
	      left = 1 << curr;
	      while (curr + drop < max) {
	        left -= count[curr + drop];
	        if (left <= 0) { break; }
	        curr++;
	        left <<= 1;
	      }
	
	      /* check for enough space */
	      used += 1 << curr;
	      if ((type === LENS && used > ENOUGH_LENS) ||
	        (type === DISTS && used > ENOUGH_DISTS)) {
	        return 1;
	      }
	
	      /* point entry in root table to sub-table */
	      low = huff & mask;
	      /*table.op[low] = curr;
	      table.bits[low] = root;
	      table.val[low] = next - opts.table_index;*/
	      table[low] = (root << 24) | (curr << 16) | (next - table_index) |0;
	    }
	  }
	
	  /* fill in remaining table entry if code is incomplete (guaranteed to have
	   at most one remaining entry, since if the code is incomplete, the
	   maximum code length that was allowed to get this far is one bit) */
	  if (huff !== 0) {
	    //table.op[next + huff] = 64;            /* invalid code marker */
	    //table.bits[next + huff] = len - drop;
	    //table.val[next + huff] = 0;
	    table[next + huff] = ((len - drop) << 24) | (64 << 16) |0;
	  }
	
	  /* set return parameters */
	  //opts.table_index += used;
	  opts.bits = root;
	  return 0;
	};


/***/ },
/* 208 */
/***/ function(module, exports) {

	'use strict';
	
	
	module.exports = {
	
	  /* Allowed flush values; see deflate() and inflate() below for details */
	  Z_NO_FLUSH:         0,
	  Z_PARTIAL_FLUSH:    1,
	  Z_SYNC_FLUSH:       2,
	  Z_FULL_FLUSH:       3,
	  Z_FINISH:           4,
	  Z_BLOCK:            5,
	  Z_TREES:            6,
	
	  /* Return codes for the compression/decompression functions. Negative values
	  * are errors, positive values are used for special but normal events.
	  */
	  Z_OK:               0,
	  Z_STREAM_END:       1,
	  Z_NEED_DICT:        2,
	  Z_ERRNO:           -1,
	  Z_STREAM_ERROR:    -2,
	  Z_DATA_ERROR:      -3,
	  //Z_MEM_ERROR:     -4,
	  Z_BUF_ERROR:       -5,
	  //Z_VERSION_ERROR: -6,
	
	  /* compression levels */
	  Z_NO_COMPRESSION:         0,
	  Z_BEST_SPEED:             1,
	  Z_BEST_COMPRESSION:       9,
	  Z_DEFAULT_COMPRESSION:   -1,
	
	
	  Z_FILTERED:               1,
	  Z_HUFFMAN_ONLY:           2,
	  Z_RLE:                    3,
	  Z_FIXED:                  4,
	  Z_DEFAULT_STRATEGY:       0,
	
	  /* Possible values of the data_type field (though see inflate()) */
	  Z_BINARY:                 0,
	  Z_TEXT:                   1,
	  //Z_ASCII:                1, // = Z_TEXT (deprecated)
	  Z_UNKNOWN:                2,
	
	  /* The deflate compression method */
	  Z_DEFLATED:               8
	  //Z_NULL:                 null // Use -1 or null inline, depending on var type
	};


/***/ },
/* 209 */
/***/ function(module, exports) {

	'use strict';
	
	
	function GZheader() {
	  /* true if compressed data believed to be text */
	  this.text       = 0;
	  /* modification time */
	  this.time       = 0;
	  /* extra flags (not used when writing a gzip file) */
	  this.xflags     = 0;
	  /* operating system */
	  this.os         = 0;
	  /* pointer to extra field or Z_NULL if none */
	  this.extra      = null;
	  /* extra field length (valid if extra != Z_NULL) */
	  this.extra_len  = 0; // Actually, we don't need it in JS,
	                       // but leave for few code modifications
	
	  //
	  // Setup limits is not necessary because in js we should not preallocate memory
	  // for inflate use constant limit in 65536 bytes
	  //
	
	  /* space at extra (only when reading header) */
	  // this.extra_max  = 0;
	  /* pointer to zero-terminated file name or Z_NULL */
	  this.name       = '';
	  /* space at name (only when reading header) */
	  // this.name_max   = 0;
	  /* pointer to zero-terminated comment or Z_NULL */
	  this.comment    = '';
	  /* space at comment (only when reading header) */
	  // this.comm_max   = 0;
	  /* true if there was or will be a header crc */
	  this.hcrc       = 0;
	  /* true when done reading gzip header (not used when writing a gzip file) */
	  this.done       = false;
	}
	
	module.exports = GZheader;


/***/ },
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(138);
	var GenericWorker = __webpack_require__(181);
	var utf8 = __webpack_require__(137);
	var crc32 = __webpack_require__(189);
	var signature = __webpack_require__(211);
	
	/**
	 * Transform an integer into a string in hexadecimal.
	 * @private
	 * @param {number} dec the number to convert.
	 * @param {number} bytes the number of bytes to generate.
	 * @returns {string} the result.
	 */
	var decToHex = function(dec, bytes) {
	    var hex = "", i;
	    for (i = 0; i < bytes; i++) {
	        hex += String.fromCharCode(dec & 0xff);
	        dec = dec >>> 8;
	    }
	    return hex;
	};
	
	/**
	 * Generate the UNIX part of the external file attributes.
	 * @param {Object} unixPermissions the unix permissions or null.
	 * @param {Boolean} isDir true if the entry is a directory, false otherwise.
	 * @return {Number} a 32 bit integer.
	 *
	 * adapted from http://unix.stackexchange.com/questions/14705/the-zip-formats-external-file-attribute :
	 *
	 * TTTTsstrwxrwxrwx0000000000ADVSHR
	 * ^^^^____________________________ file type, see zipinfo.c (UNX_*)
	 *     ^^^_________________________ setuid, setgid, sticky
	 *        ^^^^^^^^^________________ permissions
	 *                 ^^^^^^^^^^______ not used ?
	 *                           ^^^^^^ DOS attribute bits : Archive, Directory, Volume label, System file, Hidden, Read only
	 */
	var generateUnixExternalFileAttr = function (unixPermissions, isDir) {
	
	    var result = unixPermissions;
	    if (!unixPermissions) {
	        // I can't use octal values in strict mode, hence the hexa.
	        //  040775 => 0x41fd
	        // 0100664 => 0x81b4
	        result = isDir ? 0x41fd : 0x81b4;
	    }
	    return (result & 0xFFFF) << 16;
	};
	
	/**
	 * Generate the DOS part of the external file attributes.
	 * @param {Object} dosPermissions the dos permissions or null.
	 * @param {Boolean} isDir true if the entry is a directory, false otherwise.
	 * @return {Number} a 32 bit integer.
	 *
	 * Bit 0     Read-Only
	 * Bit 1     Hidden
	 * Bit 2     System
	 * Bit 3     Volume Label
	 * Bit 4     Directory
	 * Bit 5     Archive
	 */
	var generateDosExternalFileAttr = function (dosPermissions, isDir) {
	
	    // the dir flag is already set for compatibility
	    return (dosPermissions || 0)  & 0x3F;
	};
	
	/**
	 * Generate the various parts used in the construction of the final zip file.
	 * @param {Object} streamInfo the hash with informations about the compressed file.
	 * @param {Boolean} streamedContent is the content streamed ?
	 * @param {Boolean} streamingEnded is the stream finished ?
	 * @param {number} offset the current offset from the start of the zip file.
	 * @param {String} platform let's pretend we are this platform (change platform dependents fields)
	 * @param {Function} encodeFileName the function to encode the file name / comment.
	 * @return {Object} the zip parts.
	 */
	var generateZipParts = function(streamInfo, streamedContent, streamingEnded, offset, platform, encodeFileName) {
	    var file = streamInfo['file'],
	    compression = streamInfo['compression'],
	    useCustomEncoding = encodeFileName !== utf8.utf8encode,
	    encodedFileName = utils.transformTo("string", encodeFileName(file.name)),
	    utfEncodedFileName = utils.transformTo("string", utf8.utf8encode(file.name)),
	    comment = file.comment,
	    encodedComment = utils.transformTo("string", encodeFileName(comment)),
	    utfEncodedComment = utils.transformTo("string", utf8.utf8encode(comment)),
	    useUTF8ForFileName = utfEncodedFileName.length !== file.name.length,
	    useUTF8ForComment = utfEncodedComment.length !== comment.length,
	    dosTime,
	    dosDate,
	    extraFields = "",
	    unicodePathExtraField = "",
	    unicodeCommentExtraField = "",
	    dir = file.dir,
	    date = file.date;
	
	
	    var dataInfo = {
	        crc32 : 0,
	        compressedSize : 0,
	        uncompressedSize : 0
	    };
	
	    // if the content is streamed, the sizes/crc32 are only available AFTER
	    // the end of the stream.
	    if (!streamedContent || streamingEnded) {
	        dataInfo.crc32 = streamInfo['crc32'];
	        dataInfo.compressedSize = streamInfo['compressedSize'];
	        dataInfo.uncompressedSize = streamInfo['uncompressedSize'];
	    }
	
	    var bitflag = 0;
	    if (streamedContent) {
	        bitflag |= 0x0008;
	    }
	    if (!useCustomEncoding && (useUTF8ForFileName || useUTF8ForComment)) {
	        bitflag |= 0x0800;
	    }
	
	
	    var extFileAttr = 0;
	    var versionMadeBy = 0;
	    if (dir) {
	        // dos or unix, we set the dos dir flag
	        extFileAttr |= 0x00010;
	    }
	    if(platform === "UNIX") {
	        versionMadeBy = 0x031E; // UNIX, version 3.0
	        extFileAttr |= generateUnixExternalFileAttr(file.unixPermissions, dir);
	    } else { // DOS or other, fallback to DOS
	        versionMadeBy = 0x0014; // DOS, version 2.0
	        extFileAttr |= generateDosExternalFileAttr(file.dosPermissions, dir);
	    }
	
	    // date
	    // @see http://www.delorie.com/djgpp/doc/rbinter/it/52/13.html
	    // @see http://www.delorie.com/djgpp/doc/rbinter/it/65/16.html
	    // @see http://www.delorie.com/djgpp/doc/rbinter/it/66/16.html
	
	    dosTime = date.getUTCHours();
	    dosTime = dosTime << 6;
	    dosTime = dosTime | date.getUTCMinutes();
	    dosTime = dosTime << 5;
	    dosTime = dosTime | date.getUTCSeconds() / 2;
	
	    dosDate = date.getUTCFullYear() - 1980;
	    dosDate = dosDate << 4;
	    dosDate = dosDate | (date.getUTCMonth() + 1);
	    dosDate = dosDate << 5;
	    dosDate = dosDate | date.getUTCDate();
	
	    if (useUTF8ForFileName) {
	        // set the unicode path extra field. unzip needs at least one extra
	        // field to correctly handle unicode path, so using the path is as good
	        // as any other information. This could improve the situation with
	        // other archive managers too.
	        // This field is usually used without the utf8 flag, with a non
	        // unicode path in the header (winrar, winzip). This helps (a bit)
	        // with the messy Windows' default compressed folders feature but
	        // breaks on p7zip which doesn't seek the unicode path extra field.
	        // So for now, UTF-8 everywhere !
	        unicodePathExtraField =
	            // Version
	            decToHex(1, 1) +
	            // NameCRC32
	            decToHex(crc32(encodedFileName), 4) +
	            // UnicodeName
	            utfEncodedFileName;
	
	        extraFields +=
	            // Info-ZIP Unicode Path Extra Field
	            "\x75\x70" +
	            // size
	            decToHex(unicodePathExtraField.length, 2) +
	            // content
	            unicodePathExtraField;
	    }
	
	    if(useUTF8ForComment) {
	
	        unicodeCommentExtraField =
	            // Version
	            decToHex(1, 1) +
	            // CommentCRC32
	            decToHex(crc32(encodedComment), 4) +
	            // UnicodeName
	            utfEncodedComment;
	
	        extraFields +=
	            // Info-ZIP Unicode Path Extra Field
	            "\x75\x63" +
	            // size
	            decToHex(unicodeCommentExtraField.length, 2) +
	            // content
	            unicodeCommentExtraField;
	    }
	
	    var header = "";
	
	    // version needed to extract
	    header += "\x0A\x00";
	    // general purpose bit flag
	    // set bit 11 if utf8
	    header += decToHex(bitflag, 2);
	    // compression method
	    header += compression.magic;
	    // last mod file time
	    header += decToHex(dosTime, 2);
	    // last mod file date
	    header += decToHex(dosDate, 2);
	    // crc-32
	    header += decToHex(dataInfo.crc32, 4);
	    // compressed size
	    header += decToHex(dataInfo.compressedSize, 4);
	    // uncompressed size
	    header += decToHex(dataInfo.uncompressedSize, 4);
	    // file name length
	    header += decToHex(encodedFileName.length, 2);
	    // extra field length
	    header += decToHex(extraFields.length, 2);
	
	
	    var fileRecord = signature.LOCAL_FILE_HEADER + header + encodedFileName + extraFields;
	
	    var dirRecord = signature.CENTRAL_FILE_HEADER +
	        // version made by (00: DOS)
	        decToHex(versionMadeBy, 2) +
	        // file header (common to file and central directory)
	        header +
	        // file comment length
	        decToHex(encodedComment.length, 2) +
	        // disk number start
	        "\x00\x00" +
	        // internal file attributes TODO
	        "\x00\x00" +
	        // external file attributes
	        decToHex(extFileAttr, 4) +
	        // relative offset of local header
	        decToHex(offset, 4) +
	        // file name
	        encodedFileName +
	        // extra field
	        extraFields +
	        // file comment
	        encodedComment;
	
	    return {
	        fileRecord: fileRecord,
	        dirRecord: dirRecord
	    };
	};
	
	/**
	 * Generate the EOCD record.
	 * @param {Number} entriesCount the number of entries in the zip file.
	 * @param {Number} centralDirLength the length (in bytes) of the central dir.
	 * @param {Number} localDirLength the length (in bytes) of the local dir.
	 * @param {String} comment the zip file comment as a binary string.
	 * @param {Function} encodeFileName the function to encode the comment.
	 * @return {String} the EOCD record.
	 */
	var generateCentralDirectoryEnd = function (entriesCount, centralDirLength, localDirLength, comment, encodeFileName) {
	    var dirEnd = "";
	    var encodedComment = utils.transformTo("string", encodeFileName(comment));
	
	    // end of central dir signature
	    dirEnd = signature.CENTRAL_DIRECTORY_END +
	        // number of this disk
	        "\x00\x00" +
	        // number of the disk with the start of the central directory
	        "\x00\x00" +
	        // total number of entries in the central directory on this disk
	        decToHex(entriesCount, 2) +
	        // total number of entries in the central directory
	        decToHex(entriesCount, 2) +
	        // size of the central directory   4 bytes
	        decToHex(centralDirLength, 4) +
	        // offset of start of central directory with respect to the starting disk number
	        decToHex(localDirLength, 4) +
	        // .ZIP file comment length
	        decToHex(encodedComment.length, 2) +
	        // .ZIP file comment
	        encodedComment;
	
	    return dirEnd;
	};
	
	/**
	 * Generate data descriptors for a file entry.
	 * @param {Object} streamInfo the hash generated by a worker, containing informations
	 * on the file entry.
	 * @return {String} the data descriptors.
	 */
	var generateDataDescriptors = function (streamInfo) {
	    var descriptor = "";
	    descriptor = signature.DATA_DESCRIPTOR +
	        // crc-32                          4 bytes
	        decToHex(streamInfo['crc32'], 4) +
	        // compressed size                 4 bytes
	        decToHex(streamInfo['compressedSize'], 4) +
	        // uncompressed size               4 bytes
	        decToHex(streamInfo['uncompressedSize'], 4);
	
	    return descriptor;
	};
	
	
	/**
	 * A worker to concatenate other workers to create a zip file.
	 * @param {Boolean} streamFiles `true` to stream the content of the files,
	 * `false` to accumulate it.
	 * @param {String} comment the comment to use.
	 * @param {String} platform the platform to use, "UNIX" or "DOS".
	 * @param {Function} encodeFileName the function to encode file names and comments.
	 */
	function ZipFileWorker(streamFiles, comment, platform, encodeFileName) {
	    GenericWorker.call(this, "ZipFileWorker");
	    // The number of bytes written so far. This doesn't count accumulated chunks.
	    this.bytesWritten = 0;
	    // The comment of the zip file
	    this.zipComment = comment;
	    // The platform "generating" the zip file.
	    this.zipPlatform = platform;
	    // the function to encode file names and comments.
	    this.encodeFileName = encodeFileName;
	    // Should we stream the content of the files ?
	    this.streamFiles = streamFiles;
	    // If `streamFiles` is false, we will need to accumulate the content of the
	    // files to calculate sizes / crc32 (and write them *before* the content).
	    // This boolean indicates if we are accumulating chunks (it will change a lot
	    // during the lifetime of this worker).
	    this.accumulate = false;
	    // The buffer receiving chunks when accumulating content.
	    this.contentBuffer = [];
	    // The list of generated directory records.
	    this.dirRecords = [];
	    // The offset (in bytes) from the beginning of the zip file for the current source.
	    this.currentSourceOffset = 0;
	    // The total number of entries in this zip file.
	    this.entriesCount = 0;
	    // the name of the file currently being added, null when handling the end of the zip file.
	    // Used for the emited metadata.
	    this.currentFile = null;
	
	
	
	    this._sources = [];
	}
	utils.inherits(ZipFileWorker, GenericWorker);
	
	/**
	 * @see GenericWorker.push
	 */
	ZipFileWorker.prototype.push = function (chunk) {
	
	    var currentFilePercent = chunk.meta.percent || 0;
	    var entriesCount = this.entriesCount;
	    var remainingFiles = this._sources.length;
	
	    if(this.accumulate) {
	        this.contentBuffer.push(chunk);
	    } else {
	        this.bytesWritten += chunk.data.length;
	
	        GenericWorker.prototype.push.call(this, {
	            data : chunk.data,
	            meta : {
	                currentFile : this.currentFile,
	                percent : entriesCount ? (currentFilePercent + 100 * (entriesCount - remainingFiles - 1)) / entriesCount : 100
	            }
	        });
	    }
	};
	
	/**
	 * The worker started a new source (an other worker).
	 * @param {Object} streamInfo the streamInfo object from the new source.
	 */
	ZipFileWorker.prototype.openedSource = function (streamInfo) {
	    this.currentSourceOffset = this.bytesWritten;
	    this.currentFile = streamInfo['file'].name;
	
	    // don't stream folders (because they don't have any content)
	    if(this.streamFiles && !streamInfo['file'].dir) {
	        var record = generateZipParts(streamInfo, this.streamFiles, false, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
	        this.push({
	            data : record.fileRecord,
	            meta : {percent:0}
	        });
	    } else {
	        // we need to wait for the whole file before pushing anything
	        this.accumulate = true;
	    }
	};
	
	/**
	 * The worker finished a source (an other worker).
	 * @param {Object} streamInfo the streamInfo object from the finished source.
	 */
	ZipFileWorker.prototype.closedSource = function (streamInfo) {
	    this.accumulate = false;
	    var record = generateZipParts(streamInfo, this.streamFiles, true, this.currentSourceOffset, this.zipPlatform, this.encodeFileName);
	
	    this.dirRecords.push(record.dirRecord);
	    if(this.streamFiles && !streamInfo['file'].dir) {
	        // after the streamed file, we put data descriptors
	        this.push({
	            data : generateDataDescriptors(streamInfo),
	            meta : {percent:100}
	        });
	    } else {
	        // the content wasn't streamed, we need to push everything now
	        // first the file record, then the content
	        this.push({
	            data : record.fileRecord,
	            meta : {percent:0}
	        });
	        while(this.contentBuffer.length) {
	            this.push(this.contentBuffer.shift());
	        }
	    }
	    this.currentFile = null;
	};
	
	/**
	 * @see GenericWorker.flush
	 */
	ZipFileWorker.prototype.flush = function () {
	
	    var localDirLength = this.bytesWritten;
	    for(var i = 0; i < this.dirRecords.length; i++) {
	        this.push({
	            data : this.dirRecords[i],
	            meta : {percent:100}
	        });
	    }
	    var centralDirLength = this.bytesWritten - localDirLength;
	
	    var dirEnd = generateCentralDirectoryEnd(this.dirRecords.length, centralDirLength, localDirLength, this.zipComment, this.encodeFileName);
	
	    this.push({
	        data : dirEnd,
	        meta : {percent:100}
	    });
	};
	
	/**
	 * Prepare the next source to be read.
	 */
	ZipFileWorker.prototype.prepareNextSource = function () {
	    this.previous = this._sources.shift();
	    this.openedSource(this.previous.streamInfo);
	    if (this.isPaused) {
	        this.previous.pause();
	    } else {
	        this.previous.resume();
	    }
	};
	
	/**
	 * @see GenericWorker.registerPrevious
	 */
	ZipFileWorker.prototype.registerPrevious = function (previous) {
	    this._sources.push(previous);
	    var self = this;
	
	    previous.on('data', function (chunk) {
	        self.processChunk(chunk);
	    });
	    previous.on('end', function () {
	        self.closedSource(self.previous.streamInfo);
	        if(self._sources.length) {
	            self.prepareNextSource();
	        } else {
	            self.end();
	        }
	    });
	    previous.on('error', function (e) {
	        self.error(e);
	    });
	    return this;
	};
	
	/**
	 * @see GenericWorker.resume
	 */
	ZipFileWorker.prototype.resume = function () {
	    if(!GenericWorker.prototype.resume.call(this)) {
	        return false;
	    }
	
	    if (!this.previous && this._sources.length) {
	        this.prepareNextSource();
	        return true;
	    }
	    if (!this.previous && !this._sources.length && !this.generatedError) {
	        this.end();
	        return true;
	    }
	};
	
	/**
	 * @see GenericWorker.error
	 */
	ZipFileWorker.prototype.error = function (e) {
	    var sources = this._sources;
	    if(!GenericWorker.prototype.error.call(this, e)) {
	        return false;
	    }
	    for(var i = 0; i < sources.length; i++) {
	        try {
	            sources[i].error(e);
	        } catch(e) {
	            // the `error` exploded, nothing to do
	        }
	    }
	    return true;
	};
	
	/**
	 * @see GenericWorker.lock
	 */
	ZipFileWorker.prototype.lock = function () {
	    GenericWorker.prototype.lock.call(this);
	    var sources = this._sources;
	    for(var i = 0; i < sources.length; i++) {
	        sources[i].lock();
	    }
	};
	
	module.exports = ZipFileWorker;


/***/ },
/* 211 */
/***/ function(module, exports) {

	'use strict';
	exports.LOCAL_FILE_HEADER = "PK\x03\x04";
	exports.CENTRAL_FILE_HEADER = "PK\x01\x02";
	exports.CENTRAL_DIRECTORY_END = "PK\x05\x06";
	exports.ZIP64_CENTRAL_DIRECTORY_LOCATOR = "PK\x06\x07";
	exports.ZIP64_CENTRAL_DIRECTORY_END = "PK\x06\x06";
	exports.DATA_DESCRIPTOR = "PK\x07\x08";


/***/ },
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	
	var utils = __webpack_require__(138);
	var GenericWorker = __webpack_require__(181);
	
	/**
	 * A worker that use a nodejs stream as source.
	 * @constructor
	 * @param {String} filename the name of the file entry for this stream.
	 * @param {Readable} stream the nodejs stream.
	 */
	function NodejsStreamInputAdapter(filename, stream) {
	    GenericWorker.call(this, "Nodejs stream input adapter for " + filename);
	    this._upstreamEnded = false;
	    this._bindStream(stream);
	}
	
	utils.inherits(NodejsStreamInputAdapter, GenericWorker);
	
	/**
	 * Prepare the stream and bind the callbacks on it.
	 * Do this ASAP on node 0.10 ! A lazy binding doesn't always work.
	 * @param {Stream} stream the nodejs stream to use.
	 */
	NodejsStreamInputAdapter.prototype._bindStream = function (stream) {
	    var self = this;
	    this._stream = stream;
	    stream.pause();
	    stream
	    .on("data", function (chunk) {
	        self.push({
	            data: chunk,
	            meta : {
	                percent : 0
	            }
	        });
	    })
	    .on("error", function (e) {
	        if(self.isPaused) {
	            this.generatedError = e;
	        } else {
	            self.error(e);
	        }
	    })
	    .on("end", function () {
	        if(self.isPaused) {
	            self._upstreamEnded = true;
	        } else {
	            self.end();
	        }
	    });
	};
	NodejsStreamInputAdapter.prototype.pause = function () {
	    if(!GenericWorker.prototype.pause.call(this)) {
	        return false;
	    }
	    this._stream.pause();
	    return true;
	};
	NodejsStreamInputAdapter.prototype.resume = function () {
	    if(!GenericWorker.prototype.resume.call(this)) {
	        return false;
	    }
	
	    if(this._upstreamEnded) {
	        this.end();
	    } else {
	        this._stream.resume();
	    }
	
	    return true;
	};
	
	module.exports = NodejsStreamInputAdapter;


/***/ },
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var utils = __webpack_require__(138);
	var external = __webpack_require__(176);
	var utf8 = __webpack_require__(137);
	var utils = __webpack_require__(138);
	var ZipEntries = __webpack_require__(214);
	var Crc32Probe = __webpack_require__(188);
	var nodejsUtils = __webpack_require__(173);
	
	/**
	 * Check the CRC32 of an entry.
	 * @param {ZipEntry} zipEntry the zip entry to check.
	 * @return {Promise} the result.
	 */
	function checkEntryCRC32(zipEntry) {
	    return new external.Promise(function (resolve, reject) {
	        var worker = zipEntry.decompressed.getContentWorker().pipe(new Crc32Probe());
	        worker.on("error", function (e) {
	            reject(e);
	        })
	        .on("end", function () {
	            if (worker.streamInfo.crc32 !== zipEntry.decompressed.crc32) {
	                reject(new Error("Corrupted zip : CRC32 mismatch"));
	            } else {
	                resolve();
	            }
	        })
	        .resume();
	    });
	}
	
	module.exports = function(data, options) {
	    var zip = this;
	    options = utils.extend(options || {}, {
	        base64: false,
	        checkCRC32: false,
	        optimizedBinaryString: false,
	        createFolders: false,
	        decodeFileName: utf8.utf8decode
	    });
	
	    if (nodejsUtils.isNode && nodejsUtils.isStream(data)) {
	        return external.Promise.reject(new Error("JSZip can't accept a stream when loading a zip file."));
	    }
	
	    return utils.prepareContent("the loaded zip file", data, true, options.optimizedBinaryString, options.base64)
	    .then(function(data) {
	        var zipEntries = new ZipEntries(options);
	        zipEntries.load(data);
	        return zipEntries;
	    }).then(function checkCRC32(zipEntries) {
	        var promises = [external.Promise.resolve(zipEntries)];
	        var files = zipEntries.files;
	        if (options.checkCRC32) {
	            for (var i = 0; i < files.length; i++) {
	                promises.push(checkEntryCRC32(files[i]));
	            }
	        }
	        return external.Promise.all(promises);
	    }).then(function addFiles(results) {
	        var zipEntries = results.shift();
	        var files = zipEntries.files;
	        for (var i = 0; i < files.length; i++) {
	            var input = files[i];
	            zip.file(input.fileNameStr, input.decompressed, {
	                binary: true,
	                optimizedBinaryString: true,
	                date: input.date,
	                dir: input.dir,
	                comment : input.fileCommentStr.length ? input.fileCommentStr : null,
	                unixPermissions : input.unixPermissions,
	                dosPermissions : input.dosPermissions,
	                createFolders: options.createFolders
	            });
	        }
	        if (zipEntries.zipComment.length) {
	            zip.comment = zipEntries.zipComment;
	        }
	
	        return zip;
	    });
	};


/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var readerFor = __webpack_require__(215);
	var utils = __webpack_require__(138);
	var sig = __webpack_require__(211);
	var ZipEntry = __webpack_require__(221);
	var utf8 = __webpack_require__(137);
	var support = __webpack_require__(139);
	//  class ZipEntries {{{
	/**
	 * All the entries in the zip file.
	 * @constructor
	 * @param {Object} loadOptions Options for loading the stream.
	 */
	function ZipEntries(loadOptions) {
	    this.files = [];
	    this.loadOptions = loadOptions;
	}
	ZipEntries.prototype = {
	    /**
	     * Check that the reader is on the speficied signature.
	     * @param {string} expectedSignature the expected signature.
	     * @throws {Error} if it is an other signature.
	     */
	    checkSignature: function(expectedSignature) {
	        if (!this.reader.readAndCheckSignature(expectedSignature)) {
	            this.reader.index -= 4;
	            var signature = this.reader.readString(4);
	            throw new Error("Corrupted zip or bug : unexpected signature " + "(" + utils.pretty(signature) + ", expected " + utils.pretty(expectedSignature) + ")");
	        }
	    },
	    /**
	     * Check if the given signature is at the given index.
	     * @param {number} askedIndex the index to check.
	     * @param {string} expectedSignature the signature to expect.
	     * @return {boolean} true if the signature is here, false otherwise.
	     */
	    isSignature: function(askedIndex, expectedSignature) {
	        var currentIndex = this.reader.index;
	        this.reader.setIndex(askedIndex);
	        var signature = this.reader.readString(4);
	        var result = signature === expectedSignature;
	        this.reader.setIndex(currentIndex);
	        return result;
	    },
	    /**
	     * Read the end of the central directory.
	     */
	    readBlockEndOfCentral: function() {
	        this.diskNumber = this.reader.readInt(2);
	        this.diskWithCentralDirStart = this.reader.readInt(2);
	        this.centralDirRecordsOnThisDisk = this.reader.readInt(2);
	        this.centralDirRecords = this.reader.readInt(2);
	        this.centralDirSize = this.reader.readInt(4);
	        this.centralDirOffset = this.reader.readInt(4);
	
	        this.zipCommentLength = this.reader.readInt(2);
	        // warning : the encoding depends of the system locale
	        // On a linux machine with LANG=en_US.utf8, this field is utf8 encoded.
	        // On a windows machine, this field is encoded with the localized windows code page.
	        var zipComment = this.reader.readData(this.zipCommentLength);
	        var decodeParamType = support.uint8array ? "uint8array" : "array";
	        // To get consistent behavior with the generation part, we will assume that
	        // this is utf8 encoded unless specified otherwise.
	        var decodeContent = utils.transformTo(decodeParamType, zipComment);
	        this.zipComment = this.loadOptions.decodeFileName(decodeContent);
	    },
	    /**
	     * Read the end of the Zip 64 central directory.
	     * Not merged with the method readEndOfCentral :
	     * The end of central can coexist with its Zip64 brother,
	     * I don't want to read the wrong number of bytes !
	     */
	    readBlockZip64EndOfCentral: function() {
	        this.zip64EndOfCentralSize = this.reader.readInt(8);
	        this.reader.skip(4);
	        // this.versionMadeBy = this.reader.readString(2);
	        // this.versionNeeded = this.reader.readInt(2);
	        this.diskNumber = this.reader.readInt(4);
	        this.diskWithCentralDirStart = this.reader.readInt(4);
	        this.centralDirRecordsOnThisDisk = this.reader.readInt(8);
	        this.centralDirRecords = this.reader.readInt(8);
	        this.centralDirSize = this.reader.readInt(8);
	        this.centralDirOffset = this.reader.readInt(8);
	
	        this.zip64ExtensibleData = {};
	        var extraDataSize = this.zip64EndOfCentralSize - 44,
	            index = 0,
	            extraFieldId,
	            extraFieldLength,
	            extraFieldValue;
	        while (index < extraDataSize) {
	            extraFieldId = this.reader.readInt(2);
	            extraFieldLength = this.reader.readInt(4);
	            extraFieldValue = this.reader.readData(extraFieldLength);
	            this.zip64ExtensibleData[extraFieldId] = {
	                id: extraFieldId,
	                length: extraFieldLength,
	                value: extraFieldValue
	            };
	        }
	    },
	    /**
	     * Read the end of the Zip 64 central directory locator.
	     */
	    readBlockZip64EndOfCentralLocator: function() {
	        this.diskWithZip64CentralDirStart = this.reader.readInt(4);
	        this.relativeOffsetEndOfZip64CentralDir = this.reader.readInt(8);
	        this.disksCount = this.reader.readInt(4);
	        if (this.disksCount > 1) {
	            throw new Error("Multi-volumes zip are not supported");
	        }
	    },
	    /**
	     * Read the local files, based on the offset read in the central part.
	     */
	    readLocalFiles: function() {
	        var i, file;
	        for (i = 0; i < this.files.length; i++) {
	            file = this.files[i];
	            this.reader.setIndex(file.localHeaderOffset);
	            this.checkSignature(sig.LOCAL_FILE_HEADER);
	            file.readLocalPart(this.reader);
	            file.handleUTF8();
	            file.processAttributes();
	        }
	    },
	    /**
	     * Read the central directory.
	     */
	    readCentralDir: function() {
	        var file;
	
	        this.reader.setIndex(this.centralDirOffset);
	        while (this.reader.readAndCheckSignature(sig.CENTRAL_FILE_HEADER)) {
	            file = new ZipEntry({
	                zip64: this.zip64
	            }, this.loadOptions);
	            file.readCentralPart(this.reader);
	            this.files.push(file);
	        }
	
	        if (this.centralDirRecords !== this.files.length) {
	            if (this.centralDirRecords !== 0 && this.files.length === 0) {
	                // We expected some records but couldn't find ANY.
	                // This is really suspicious, as if something went wrong.
	                throw new Error("Corrupted zip or bug: expected " + this.centralDirRecords + " records in central dir, got " + this.files.length);
	            } else {
	                // We found some records but not all.
	                // Something is wrong but we got something for the user: no error here.
	                // console.warn("expected", this.centralDirRecords, "records in central dir, got", this.files.length);
	            }
	        }
	    },
	    /**
	     * Read the end of central directory.
	     */
	    readEndOfCentral: function() {
	        var offset = this.reader.lastIndexOfSignature(sig.CENTRAL_DIRECTORY_END);
	        if (offset < 0) {
	            // Check if the content is a truncated zip or complete garbage.
	            // A "LOCAL_FILE_HEADER" is not required at the beginning (auto
	            // extractible zip for example) but it can give a good hint.
	            // If an ajax request was used without responseType, we will also
	            // get unreadable data.
	            var isGarbage = !this.isSignature(0, sig.LOCAL_FILE_HEADER);
	
	            if (isGarbage) {
	                throw new Error("Can't find end of central directory : is this a zip file ? " +
	                                "If it is, see http://stuk.github.io/jszip/documentation/howto/read_zip.html");
	            } else {
	                throw new Error("Corrupted zip : can't find end of central directory");
	            }
	
	        }
	        this.reader.setIndex(offset);
	        var endOfCentralDirOffset = offset;
	        this.checkSignature(sig.CENTRAL_DIRECTORY_END);
	        this.readBlockEndOfCentral();
	
	
	        /* extract from the zip spec :
	            4)  If one of the fields in the end of central directory
	                record is too small to hold required data, the field
	                should be set to -1 (0xFFFF or 0xFFFFFFFF) and the
	                ZIP64 format record should be created.
	            5)  The end of central directory record and the
	                Zip64 end of central directory locator record must
	                reside on the same disk when splitting or spanning
	                an archive.
	         */
	        if (this.diskNumber === utils.MAX_VALUE_16BITS || this.diskWithCentralDirStart === utils.MAX_VALUE_16BITS || this.centralDirRecordsOnThisDisk === utils.MAX_VALUE_16BITS || this.centralDirRecords === utils.MAX_VALUE_16BITS || this.centralDirSize === utils.MAX_VALUE_32BITS || this.centralDirOffset === utils.MAX_VALUE_32BITS) {
	            this.zip64 = true;
	
	            /*
	            Warning : the zip64 extension is supported, but ONLY if the 64bits integer read from
	            the zip file can fit into a 32bits integer. This cannot be solved : Javascript represents
	            all numbers as 64-bit double precision IEEE 754 floating point numbers.
	            So, we have 53bits for integers and bitwise operations treat everything as 32bits.
	            see https://developer.mozilla.org/en-US/docs/JavaScript/Reference/Operators/Bitwise_Operators
	            and http://www.ecma-international.org/publications/files/ECMA-ST/ECMA-262.pdf section 8.5
	            */
	
	            // should look for a zip64 EOCD locator
	            offset = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
	            if (offset < 0) {
	                throw new Error("Corrupted zip : can't find the ZIP64 end of central directory locator");
	            }
	            this.reader.setIndex(offset);
	            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_LOCATOR);
	            this.readBlockZip64EndOfCentralLocator();
	
	            // now the zip64 EOCD record
	            if (!this.isSignature(this.relativeOffsetEndOfZip64CentralDir, sig.ZIP64_CENTRAL_DIRECTORY_END)) {
	                // console.warn("ZIP64 end of central directory not where expected.");
	                this.relativeOffsetEndOfZip64CentralDir = this.reader.lastIndexOfSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
	                if (this.relativeOffsetEndOfZip64CentralDir < 0) {
	                    throw new Error("Corrupted zip : can't find the ZIP64 end of central directory");
	                }
	            }
	            this.reader.setIndex(this.relativeOffsetEndOfZip64CentralDir);
	            this.checkSignature(sig.ZIP64_CENTRAL_DIRECTORY_END);
	            this.readBlockZip64EndOfCentral();
	        }
	
	        var expectedEndOfCentralDirOffset = this.centralDirOffset + this.centralDirSize;
	        if (this.zip64) {
	            expectedEndOfCentralDirOffset += 20; // end of central dir 64 locator
	            expectedEndOfCentralDirOffset += 12 /* should not include the leading 12 bytes */ + this.zip64EndOfCentralSize;
	        }
	
	        var extraBytes = endOfCentralDirOffset - expectedEndOfCentralDirOffset;
	
	        if (extraBytes > 0) {
	            // console.warn(extraBytes, "extra bytes at beginning or within zipfile");
	            if (this.isSignature(endOfCentralDirOffset, sig.CENTRAL_FILE_HEADER)) {
	                // The offsets seem wrong, but we have something at the specified offset.
	                // So… we keep it.
	            } else {
	                // the offset is wrong, update the "zero" of the reader
	                // this happens if data has been prepended (crx files for example)
	                this.reader.zero = extraBytes;
	            }
	        } else if (extraBytes < 0) {
	            throw new Error("Corrupted zip: missing " + Math.abs(extraBytes) + " bytes.");
	        }
	    },
	    prepareReader: function(data) {
	        this.reader = readerFor(data);
	    },
	    /**
	     * Read a zip file and create ZipEntries.
	     * @param {String|ArrayBuffer|Uint8Array|Buffer} data the binary string representing a zip file.
	     */
	    load: function(data) {
	        this.prepareReader(data);
	        this.readEndOfCentral();
	        this.readCentralDir();
	        this.readLocalFiles();
	    }
	};
	// }}} end of ZipEntries
	module.exports = ZipEntries;


/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var utils = __webpack_require__(138);
	var support = __webpack_require__(139);
	var ArrayReader = __webpack_require__(216);
	var StringReader = __webpack_require__(218);
	var NodeBufferReader = __webpack_require__(219);
	var Uint8ArrayReader = __webpack_require__(220);
	
	/**
	 * Create a reader adapted to the data.
	 * @param {String|ArrayBuffer|Uint8Array|Buffer} data the data to read.
	 * @return {DataReader} the data reader.
	 */
	module.exports = function (data) {
	    var type = utils.getTypeOf(data);
	    utils.checkSupport(type);
	    if (type === "string" && !support.uint8array) {
	        return new StringReader(data);
	    }
	    if (type === "nodebuffer") {
	        return new NodeBufferReader(data);
	    }
	    if (support.uint8array) {
	        return new Uint8ArrayReader(utils.transformTo("uint8array", data));
	    }
	    return new ArrayReader(utils.transformTo("array", data));
	};
	
	// vim: set shiftwidth=4 softtabstop=4:


/***/ },
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var DataReader = __webpack_require__(217);
	var utils = __webpack_require__(138);
	
	function ArrayReader(data) {
	    DataReader.call(this, data);
		for(var i = 0; i < this.data.length; i++) {
			data[i] = data[i] & 0xFF;
		}
	}
	utils.inherits(ArrayReader, DataReader);
	/**
	 * @see DataReader.byteAt
	 */
	ArrayReader.prototype.byteAt = function(i) {
	    return this.data[this.zero + i];
	};
	/**
	 * @see DataReader.lastIndexOfSignature
	 */
	ArrayReader.prototype.lastIndexOfSignature = function(sig) {
	    var sig0 = sig.charCodeAt(0),
	        sig1 = sig.charCodeAt(1),
	        sig2 = sig.charCodeAt(2),
	        sig3 = sig.charCodeAt(3);
	    for (var i = this.length - 4; i >= 0; --i) {
	        if (this.data[i] === sig0 && this.data[i + 1] === sig1 && this.data[i + 2] === sig2 && this.data[i + 3] === sig3) {
	            return i - this.zero;
	        }
	    }
	
	    return -1;
	};
	/**
	 * @see DataReader.readAndCheckSignature
	 */
	ArrayReader.prototype.readAndCheckSignature = function (sig) {
	    var sig0 = sig.charCodeAt(0),
	        sig1 = sig.charCodeAt(1),
	        sig2 = sig.charCodeAt(2),
	        sig3 = sig.charCodeAt(3),
	        data = this.readData(4);
	    return sig0 === data[0] && sig1 === data[1] && sig2 === data[2] && sig3 === data[3];
	};
	/**
	 * @see DataReader.readData
	 */
	ArrayReader.prototype.readData = function(size) {
	    this.checkOffset(size);
	    if(size === 0) {
	        return [];
	    }
	    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
	    this.index += size;
	    return result;
	};
	module.exports = ArrayReader;


/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var utils = __webpack_require__(138);
	
	function DataReader(data) {
	    this.data = data; // type : see implementation
	    this.length = data.length;
	    this.index = 0;
	    this.zero = 0;
	}
	DataReader.prototype = {
	    /**
	     * Check that the offset will not go too far.
	     * @param {string} offset the additional offset to check.
	     * @throws {Error} an Error if the offset is out of bounds.
	     */
	    checkOffset: function(offset) {
	        this.checkIndex(this.index + offset);
	    },
	    /**
	     * Check that the specifed index will not be too far.
	     * @param {string} newIndex the index to check.
	     * @throws {Error} an Error if the index is out of bounds.
	     */
	    checkIndex: function(newIndex) {
	        if (this.length < this.zero + newIndex || newIndex < 0) {
	            throw new Error("End of data reached (data length = " + this.length + ", asked index = " + (newIndex) + "). Corrupted zip ?");
	        }
	    },
	    /**
	     * Change the index.
	     * @param {number} newIndex The new index.
	     * @throws {Error} if the new index is out of the data.
	     */
	    setIndex: function(newIndex) {
	        this.checkIndex(newIndex);
	        this.index = newIndex;
	    },
	    /**
	     * Skip the next n bytes.
	     * @param {number} n the number of bytes to skip.
	     * @throws {Error} if the new index is out of the data.
	     */
	    skip: function(n) {
	        this.setIndex(this.index + n);
	    },
	    /**
	     * Get the byte at the specified index.
	     * @param {number} i the index to use.
	     * @return {number} a byte.
	     */
	    byteAt: function(i) {
	        // see implementations
	    },
	    /**
	     * Get the next number with a given byte size.
	     * @param {number} size the number of bytes to read.
	     * @return {number} the corresponding number.
	     */
	    readInt: function(size) {
	        var result = 0,
	            i;
	        this.checkOffset(size);
	        for (i = this.index + size - 1; i >= this.index; i--) {
	            result = (result << 8) + this.byteAt(i);
	        }
	        this.index += size;
	        return result;
	    },
	    /**
	     * Get the next string with a given byte size.
	     * @param {number} size the number of bytes to read.
	     * @return {string} the corresponding string.
	     */
	    readString: function(size) {
	        return utils.transformTo("string", this.readData(size));
	    },
	    /**
	     * Get raw data without conversion, <size> bytes.
	     * @param {number} size the number of bytes to read.
	     * @return {Object} the raw data, implementation specific.
	     */
	    readData: function(size) {
	        // see implementations
	    },
	    /**
	     * Find the last occurence of a zip signature (4 bytes).
	     * @param {string} sig the signature to find.
	     * @return {number} the index of the last occurence, -1 if not found.
	     */
	    lastIndexOfSignature: function(sig) {
	        // see implementations
	    },
	    /**
	     * Read the signature (4 bytes) at the current position and compare it with sig.
	     * @param {string} sig the expected signature
	     * @return {boolean} true if the signature matches, false otherwise.
	     */
	    readAndCheckSignature: function(sig) {
	        // see implementations
	    },
	    /**
	     * Get the next date.
	     * @return {Date} the date.
	     */
	    readDate: function() {
	        var dostime = this.readInt(4);
	        return new Date(Date.UTC(
	        ((dostime >> 25) & 0x7f) + 1980, // year
	        ((dostime >> 21) & 0x0f) - 1, // month
	        (dostime >> 16) & 0x1f, // day
	        (dostime >> 11) & 0x1f, // hour
	        (dostime >> 5) & 0x3f, // minute
	        (dostime & 0x1f) << 1)); // second
	    }
	};
	module.exports = DataReader;


/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var DataReader = __webpack_require__(217);
	var utils = __webpack_require__(138);
	
	function StringReader(data) {
	    DataReader.call(this, data);
	}
	utils.inherits(StringReader, DataReader);
	/**
	 * @see DataReader.byteAt
	 */
	StringReader.prototype.byteAt = function(i) {
	    return this.data.charCodeAt(this.zero + i);
	};
	/**
	 * @see DataReader.lastIndexOfSignature
	 */
	StringReader.prototype.lastIndexOfSignature = function(sig) {
	    return this.data.lastIndexOf(sig) - this.zero;
	};
	/**
	 * @see DataReader.readAndCheckSignature
	 */
	StringReader.prototype.readAndCheckSignature = function (sig) {
	    var data = this.readData(4);
	    return sig === data;
	};
	/**
	 * @see DataReader.readData
	 */
	StringReader.prototype.readData = function(size) {
	    this.checkOffset(size);
	    // this will work because the constructor applied the "& 0xff" mask.
	    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
	    this.index += size;
	    return result;
	};
	module.exports = StringReader;


/***/ },
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var Uint8ArrayReader = __webpack_require__(220);
	var utils = __webpack_require__(138);
	
	function NodeBufferReader(data) {
	    Uint8ArrayReader.call(this, data);
	}
	utils.inherits(NodeBufferReader, Uint8ArrayReader);
	
	/**
	 * @see DataReader.readData
	 */
	NodeBufferReader.prototype.readData = function(size) {
	    this.checkOffset(size);
	    var result = this.data.slice(this.zero + this.index, this.zero + this.index + size);
	    this.index += size;
	    return result;
	};
	module.exports = NodeBufferReader;


/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var ArrayReader = __webpack_require__(216);
	var utils = __webpack_require__(138);
	
	function Uint8ArrayReader(data) {
	    ArrayReader.call(this, data);
	}
	utils.inherits(Uint8ArrayReader, ArrayReader);
	/**
	 * @see DataReader.readData
	 */
	Uint8ArrayReader.prototype.readData = function(size) {
	    this.checkOffset(size);
	    if(size === 0) {
	        // in IE10, when using subarray(idx, idx), we get the array [0x00] instead of [].
	        return new Uint8Array(0);
	    }
	    var result = this.data.subarray(this.zero + this.index, this.zero + this.index + size);
	    this.index += size;
	    return result;
	};
	module.exports = Uint8ArrayReader;


/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	var readerFor = __webpack_require__(215);
	var utils = __webpack_require__(138);
	var CompressedObject = __webpack_require__(185);
	var crc32fn = __webpack_require__(189);
	var utf8 = __webpack_require__(137);
	var compressions = __webpack_require__(192);
	var support = __webpack_require__(139);
	
	var MADE_BY_DOS = 0x00;
	var MADE_BY_UNIX = 0x03;
	
	/**
	 * Find a compression registered in JSZip.
	 * @param {string} compressionMethod the method magic to find.
	 * @return {Object|null} the JSZip compression object, null if none found.
	 */
	var findCompression = function(compressionMethod) {
	    for (var method in compressions) {
	        if (!compressions.hasOwnProperty(method)) {
	            continue;
	        }
	        if (compressions[method].magic === compressionMethod) {
	            return compressions[method];
	        }
	    }
	    return null;
	};
	
	// class ZipEntry {{{
	/**
	 * An entry in the zip file.
	 * @constructor
	 * @param {Object} options Options of the current file.
	 * @param {Object} loadOptions Options for loading the stream.
	 */
	function ZipEntry(options, loadOptions) {
	    this.options = options;
	    this.loadOptions = loadOptions;
	}
	ZipEntry.prototype = {
	    /**
	     * say if the file is encrypted.
	     * @return {boolean} true if the file is encrypted, false otherwise.
	     */
	    isEncrypted: function() {
	        // bit 1 is set
	        return (this.bitFlag & 0x0001) === 0x0001;
	    },
	    /**
	     * say if the file has utf-8 filename/comment.
	     * @return {boolean} true if the filename/comment is in utf-8, false otherwise.
	     */
	    useUTF8: function() {
	        // bit 11 is set
	        return (this.bitFlag & 0x0800) === 0x0800;
	    },
	    /**
	     * Read the local part of a zip file and add the info in this object.
	     * @param {DataReader} reader the reader to use.
	     */
	    readLocalPart: function(reader) {
	        var compression, localExtraFieldsLength;
	
	        // we already know everything from the central dir !
	        // If the central dir data are false, we are doomed.
	        // On the bright side, the local part is scary  : zip64, data descriptors, both, etc.
	        // The less data we get here, the more reliable this should be.
	        // Let's skip the whole header and dash to the data !
	        reader.skip(22);
	        // in some zip created on windows, the filename stored in the central dir contains \ instead of /.
	        // Strangely, the filename here is OK.
	        // I would love to treat these zip files as corrupted (see http://www.info-zip.org/FAQ.html#backslashes
	        // or APPNOTE#4.4.17.1, "All slashes MUST be forward slashes '/'") but there are a lot of bad zip generators...
	        // Search "unzip mismatching "local" filename continuing with "central" filename version" on
	        // the internet.
	        //
	        // I think I see the logic here : the central directory is used to display
	        // content and the local directory is used to extract the files. Mixing / and \
	        // may be used to display \ to windows users and use / when extracting the files.
	        // Unfortunately, this lead also to some issues : http://seclists.org/fulldisclosure/2009/Sep/394
	        this.fileNameLength = reader.readInt(2);
	        localExtraFieldsLength = reader.readInt(2); // can't be sure this will be the same as the central dir
	        // the fileName is stored as binary data, the handleUTF8 method will take care of the encoding.
	        this.fileName = reader.readData(this.fileNameLength);
	        reader.skip(localExtraFieldsLength);
	
	        if (this.compressedSize === -1 || this.uncompressedSize === -1) {
	            throw new Error("Bug or corrupted zip : didn't get enough informations from the central directory " + "(compressedSize === -1 || uncompressedSize === -1)");
	        }
	
	        compression = findCompression(this.compressionMethod);
	        if (compression === null) { // no compression found
	            throw new Error("Corrupted zip : compression " + utils.pretty(this.compressionMethod) + " unknown (inner file : " + utils.transformTo("string", this.fileName) + ")");
	        }
	        this.decompressed = new CompressedObject(this.compressedSize, this.uncompressedSize, this.crc32, compression, reader.readData(this.compressedSize));
	    },
	
	    /**
	     * Read the central part of a zip file and add the info in this object.
	     * @param {DataReader} reader the reader to use.
	     */
	    readCentralPart: function(reader) {
	        this.versionMadeBy = reader.readInt(2);
	        reader.skip(2);
	        // this.versionNeeded = reader.readInt(2);
	        this.bitFlag = reader.readInt(2);
	        this.compressionMethod = reader.readString(2);
	        this.date = reader.readDate();
	        this.crc32 = reader.readInt(4);
	        this.compressedSize = reader.readInt(4);
	        this.uncompressedSize = reader.readInt(4);
	        var fileNameLength = reader.readInt(2);
	        this.extraFieldsLength = reader.readInt(2);
	        this.fileCommentLength = reader.readInt(2);
	        this.diskNumberStart = reader.readInt(2);
	        this.internalFileAttributes = reader.readInt(2);
	        this.externalFileAttributes = reader.readInt(4);
	        this.localHeaderOffset = reader.readInt(4);
	
	        if (this.isEncrypted()) {
	            throw new Error("Encrypted zip are not supported");
	        }
	
	        // will be read in the local part, see the comments there
	        reader.skip(fileNameLength);
	        this.readExtraFields(reader);
	        this.parseZIP64ExtraField(reader);
	        this.fileComment = reader.readData(this.fileCommentLength);
	    },
	
	    /**
	     * Parse the external file attributes and get the unix/dos permissions.
	     */
	    processAttributes: function () {
	        this.unixPermissions = null;
	        this.dosPermissions = null;
	        var madeBy = this.versionMadeBy >> 8;
	
	        // Check if we have the DOS directory flag set.
	        // We look for it in the DOS and UNIX permissions
	        // but some unknown platform could set it as a compatibility flag.
	        this.dir = this.externalFileAttributes & 0x0010 ? true : false;
	
	        if(madeBy === MADE_BY_DOS) {
	            // first 6 bits (0 to 5)
	            this.dosPermissions = this.externalFileAttributes & 0x3F;
	        }
	
	        if(madeBy === MADE_BY_UNIX) {
	            this.unixPermissions = (this.externalFileAttributes >> 16) & 0xFFFF;
	            // the octal permissions are in (this.unixPermissions & 0x01FF).toString(8);
	        }
	
	        // fail safe : if the name ends with a / it probably means a folder
	        if (!this.dir && this.fileNameStr.slice(-1) === '/') {
	            this.dir = true;
	        }
	    },
	
	    /**
	     * Parse the ZIP64 extra field and merge the info in the current ZipEntry.
	     * @param {DataReader} reader the reader to use.
	     */
	    parseZIP64ExtraField: function(reader) {
	
	        if (!this.extraFields[0x0001]) {
	            return;
	        }
	
	        // should be something, preparing the extra reader
	        var extraReader = readerFor(this.extraFields[0x0001].value);
	
	        // I really hope that these 64bits integer can fit in 32 bits integer, because js
	        // won't let us have more.
	        if (this.uncompressedSize === utils.MAX_VALUE_32BITS) {
	            this.uncompressedSize = extraReader.readInt(8);
	        }
	        if (this.compressedSize === utils.MAX_VALUE_32BITS) {
	            this.compressedSize = extraReader.readInt(8);
	        }
	        if (this.localHeaderOffset === utils.MAX_VALUE_32BITS) {
	            this.localHeaderOffset = extraReader.readInt(8);
	        }
	        if (this.diskNumberStart === utils.MAX_VALUE_32BITS) {
	            this.diskNumberStart = extraReader.readInt(4);
	        }
	    },
	    /**
	     * Read the central part of a zip file and add the info in this object.
	     * @param {DataReader} reader the reader to use.
	     */
	    readExtraFields: function(reader) {
	        var end = reader.index + this.extraFieldsLength,
	            extraFieldId,
	            extraFieldLength,
	            extraFieldValue;
	
	        if (!this.extraFields) {
	            this.extraFields = {};
	        }
	
	        while (reader.index < end) {
	            extraFieldId = reader.readInt(2);
	            extraFieldLength = reader.readInt(2);
	            extraFieldValue = reader.readData(extraFieldLength);
	
	            this.extraFields[extraFieldId] = {
	                id: extraFieldId,
	                length: extraFieldLength,
	                value: extraFieldValue
	            };
	        }
	    },
	    /**
	     * Apply an UTF8 transformation if needed.
	     */
	    handleUTF8: function() {
	        var decodeParamType = support.uint8array ? "uint8array" : "array";
	        if (this.useUTF8()) {
	            this.fileNameStr = utf8.utf8decode(this.fileName);
	            this.fileCommentStr = utf8.utf8decode(this.fileComment);
	        } else {
	            var upath = this.findExtraFieldUnicodePath();
	            if (upath !== null) {
	                this.fileNameStr = upath;
	            } else {
	                // ASCII text or unsupported code page
	                var fileNameByteArray =  utils.transformTo(decodeParamType, this.fileName);
	                this.fileNameStr = this.loadOptions.decodeFileName(fileNameByteArray);
	            }
	
	            var ucomment = this.findExtraFieldUnicodeComment();
	            if (ucomment !== null) {
	                this.fileCommentStr = ucomment;
	            } else {
	                // ASCII text or unsupported code page
	                var commentByteArray =  utils.transformTo(decodeParamType, this.fileComment);
	                this.fileCommentStr = this.loadOptions.decodeFileName(commentByteArray);
	            }
	        }
	    },
	
	    /**
	     * Find the unicode path declared in the extra field, if any.
	     * @return {String} the unicode path, null otherwise.
	     */
	    findExtraFieldUnicodePath: function() {
	        var upathField = this.extraFields[0x7075];
	        if (upathField) {
	            var extraReader = readerFor(upathField.value);
	
	            // wrong version
	            if (extraReader.readInt(1) !== 1) {
	                return null;
	            }
	
	            // the crc of the filename changed, this field is out of date.
	            if (crc32fn(this.fileName) !== extraReader.readInt(4)) {
	                return null;
	            }
	
	            return utf8.utf8decode(extraReader.readData(upathField.length - 5));
	        }
	        return null;
	    },
	
	    /**
	     * Find the unicode comment declared in the extra field, if any.
	     * @return {String} the unicode comment, null otherwise.
	     */
	    findExtraFieldUnicodeComment: function() {
	        var ucommentField = this.extraFields[0x6375];
	        if (ucommentField) {
	            var extraReader = readerFor(ucommentField.value);
	
	            // wrong version
	            if (extraReader.readInt(1) !== 1) {
	                return null;
	            }
	
	            // the crc of the comment changed, this field is out of date.
	            if (crc32fn(this.fileComment) !== extraReader.readInt(4)) {
	                return null;
	            }
	
	            return utf8.utf8decode(extraReader.readData(ucommentField.length - 5));
	        }
	        return null;
	    }
	};
	module.exports = ZipEntry;


/***/ },
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(24);
	const download = (filename, type, source) => {
	};
	exports.downloadAction = ({ input: { filename, mime, content } }) => {
	    const el = document.createElement('a');
	    el.setAttribute('href', `data:${mime};charset=utf-8;base64,` + content);
	    el.setAttribute('download', filename);
	    el.style.display = 'none';
	    document.body.appendChild(el);
	    el.click();
	    document.body.removeChild(el);
	};
	exports.downloadAction['async'] = true;
	exports.downloadAction['input'] =
	    { filename: check.string,
	        mime: check.string,
	        content: check.string // base64 encoded
	    };


/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const moveAction_1 = __webpack_require__(224);
	exports.move = [moveAction_1.moveAction // no need to throttle ( 10, [ moveAction ] )
	];


/***/ },
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const GraphHelper_1 = __webpack_require__(25);
	const NodeHelper_1 = __webpack_require__(26);
	const movep = ['$dragdrop', 'move'];
	const dropp = ['$dragdrop', 'drop'];
	const dragp = ['$dragdrop', 'drag'];
	const nextNodeId = NodeHelper_1.NodeHelper.nextNodeId;
	exports.moveAction = ({ state, input, output }) => {
	    const move = input.move;
	    const drag = state.get(dragp);
	    const { target, clientPos } = move;
	    // If target is not set = no drop operation
	    let drop = state.get(dropp);
	    if (target && target !== '') {
	        let [ownerType, nodeId, apos] = target.split('-');
	        if ((drop && target === drop.target) || nodeId === 'drop') {
	        }
	        else if (ownerType === 'library') {
	            if (drag.ownerType === 'library') {
	                // abort
	                drop = null;
	            }
	            else {
	                // drop on library
	                state.set(['$factory', 'pane', 'library'], true);
	                drop =
	                    { target,
	                        ownerType
	                    };
	            }
	        }
	        else {
	            // changed
	            let graph;
	            if (drag.ownerType === ownerType) {
	                // when dropping on drag origin, we use rest graph
	                graph = drag.rgraph;
	            }
	            else {
	                graph = state.get([ownerType, 'graph']);
	            }
	            let newId = nextNodeId(graph.nodesById);
	            let pos = parseInt(apos);
	            let parentId;
	            const child = drag.dgraph;
	            if (apos) {
	                // should have a way to set nodeId to 'drop' here or mark as ghost...
	                graph = GraphHelper_1.GraphHelper.insert(graph, nodeId, pos, child);
	                nodeId = null;
	            }
	            else {
	                // find node in graph
	                const node = graph.nodesById[nodeId];
	                if (!node) {
	                    // drag move happens before proper ui update
	                    return;
	                }
	                parentId = node.parent;
	                if (parentId) {
	                    const parent = graph.nodesById[parentId];
	                    pos = parent.children.indexOf(nodeId);
	                    graph = GraphHelper_1.GraphHelper.slip(graph, parent.id, pos, child);
	                }
	                else {
	                }
	            }
	            // TODO: we could save the operation so that we have live preview
	            // of the operation.
	            // eventual drop operation
	            drop =
	                { target,
	                    ghostId: newId,
	                    nodeId,
	                    graph,
	                    ownerType
	                };
	        }
	    }
	    else {
	        // no target = abort
	        drop = null;
	    }
	    state.set(dropp, drop);
	    state.set(movep, move);
	};


/***/ },
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(57));
	const Model = __webpack_require__(50);
	const add_1 = __webpack_require__(226);
	const name_1 = __webpack_require__(228);
	const remove_1 = __webpack_require__(229);
	const select_1 = __webpack_require__(231);
	const CurrentScene = Model.monkey({ cursors: { sceneById: ['data', 'scene'],
	        id: ['$sceneId']
	    },
	    get(data) {
	        const sceneById = data.sceneById || {};
	        return sceneById[data.id];
	    }
	});
	exports.Scene = (options = {}) => {
	    return (module, controller) => {
	        module.addState(CurrentScene);
	        module.addSignals({ add: add_1.add,
	            name: name_1.name,
	            remove: remove_1.remove,
	            select: select_1.select
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(227);
	const save_1 = __webpack_require__(47);
	const copy = __webpack_require__(76);
	exports.add = [addAction_1.addAction,
	    copy('input:/_id', 'state:/$sceneId'),
	    ...save_1.save
	];


/***/ },
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Scene_1 = __webpack_require__(225);
	exports.addAction = ({ state, input: {  }, output }) => {
	    const scene = Scene_1.SceneHelper.create();
	    const docs = [scene];
	    // This is a flag that will set name editing after db object
	    // is selected.
	    state.set(['$factory', 'editing'], scene._id);
	    // add to project
	    const project = state.get(['project']);
	    const scenes = project.scenes || [];
	    const list = [...scenes, scene._id];
	    docs.push(Object.assign({}, project, { scenes: list }));
	    // we set _id for select operation
	    output({ docs, _id: scene._id });
	};


/***/ },
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const saveDoc_1 = __webpack_require__(62);
	const set = __webpack_require__(64);
	exports.name = [set('output:/type', 'scene'),
	    set('output:/key', 'name'),
	    ...saveDoc_1.saveDoc
	];


/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const removeAction_1 = __webpack_require__(230);
	const save_1 = __webpack_require__(47);
	const Status_1 = __webpack_require__(120);
	exports.remove = [removeAction_1.removeAction,
	    { success: [...save_1.save],
	        error: [Status_1.status]
	    }
	];


/***/ },
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(225);
	exports.removeAction = ({ state, input: { _id }, output }) => {
	    // clear modal
	    state.set(['$factory', 'modal', 'active'], false);
	    // clear options pane
	    state.set(['$factory', 'pane', 'scene'], false);
	    if (!_id) {
	        output.error({ status: { type: 'error', message: 'No _id cannot delete scene' }
	        });
	        return;
	    }
	    const doc = state.get(['data', 'scene', _id]);
	    if (!doc) {
	        output.error({ status: { type: 'error', message: 'Cannot delete unselected scene.' }
	        });
	        return;
	    }
	    const sceneById = state.get(['data', 'scene']);
	    const docs = [];
	    // Remove ref in parent
	    const parent = state.get(['project']);
	    // Find current selection in ordered scenes
	    const sortedscenes = [...parent.scenes];
	    sortedscenes.sort((a, b) => sceneById[a].name > sceneById[b].name ? 1 : -1);
	    const oldidx = sortedscenes.indexOf(doc._id);
	    const scenes = sortedscenes.filter((id) => id !== doc._id);
	    const selidx = oldidx >= scenes.length ?
	        scenes.length - 1 : oldidx;
	    const sceneId = scenes[selidx];
	    // Change parent
	    docs.push(Object.assign({}, parent, { scenes }));
	    const user = state.get(['user']);
	    const newScene = sceneById[sceneId];
	    // Select new scene
	    docs.push(_1.SceneHelper.select(state, user, newScene));
	    // Remove element
	    docs.push(Object.assign({}, doc, { _deleted: true }));
	    // Remove graph
	    const graph = doc.graph;
	    if (graph) {
	        const nodes = graph.nodes;
	    }
	    output.success({ docs });
	};


/***/ },
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const copy = __webpack_require__(76);
	exports.select = [copy('input:/_id', 'state:/$sceneId')
	];


/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Model = __webpack_require__(50);
	const githubLibraryGet_1 = __webpack_require__(233);
	const libraryGithubPath_1 = __webpack_require__(235);
	const libraryGithubToken_1 = __webpack_require__(236);
	const name_1 = __webpack_require__(237);
	const defaultUser = { _id: 'gaspard' //makeId ()
	    ,
	    type: 'user',
	    name: 'New user',
	    projectId: null,
	    blockId: null,
	    sceneId: null
	};
	const CurrentUser = Model.monkey({ cursors: { userById: ['data', 'user'],
	        id: ['$auth', 'userId']
	    },
	    get(data) {
	        const userById = data.userById || {};
	        return userById[data.id || 'gaspard']
	            || defaultUser;
	    }
	});
	exports.User = (options = {}) => {
	    return (module, controller) => {
	        module.addState(CurrentUser);
	        module.addSignals({ name: name_1.name,
	            githubLibraryGet: githubLibraryGet_1.githubLibraryGet,
	            libraryGithubPath: libraryGithubPath_1.libraryGithubPath,
	            libraryGithubToken: libraryGithubToken_1.libraryGithubToken
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const githubLibraryGetAction_1 = __webpack_require__(234);
	const Status_1 = __webpack_require__(120);
	const copy = __webpack_require__(76);
	exports.githubLibraryGet = [githubLibraryGetAction_1.githubLibraryGetAction,
	    { success: [copy('input:/', 'state:/github')],
	        error: [Status_1.status]
	    }
	];


/***/ },
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const LibraryHelper_1 = __webpack_require__(134);
	const download = (filename, type, source) => {
	    const el = document.createElement('a');
	    el.setAttribute('href', `data:${type};charset=utf-8;base64,` + source);
	    el.setAttribute('download', filename);
	    el.style.display = 'none';
	    document.body.appendChild(el);
	    el.click();
	    document.body.removeChild(el);
	};
	exports.githubLibraryGetAction = ({ state, output }) => {
	    const user = state.get(['user']);
	    const libpath = user.libraryGithubPath;
	    const token = user.libraryGithubToken;
	    if (libpath && token) {
	    }
	    const library = state.get(['data', 'component']);
	    LibraryHelper_1.LibraryHelper.zip(library, (source) => {
	        download('library.zip', 'application/zip', source);
	    });
	};
	// githubLibraryGetAction [ 'async' ] = true


/***/ },
/* 235 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const saveDoc_1 = __webpack_require__(62);
	const set = __webpack_require__(64);
	exports.libraryGithubPath = [set('output:/type', 'user'),
	    set('output:/key', 'libraryGithubPath'),
	    ...saveDoc_1.saveDoc
	];


/***/ },
/* 236 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const saveDoc_1 = __webpack_require__(62);
	const set = __webpack_require__(64);
	exports.libraryGithubToken = [set('output:/type', 'user'),
	    set('output:/key', 'libraryGithubToken'),
	    ...saveDoc_1.saveDoc
	];


/***/ },
/* 237 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const saveDoc_1 = __webpack_require__(62);
	const set = __webpack_require__(64);
	exports.name = [set('output:/type', 'user'),
	    set('output:/key', 'name'),
	    ...saveDoc_1.saveDoc
	];


/***/ },
/* 238 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(239));
	__export(__webpack_require__(240));
	const db_1 = __webpack_require__(113);
	const changed_1 = __webpack_require__(241);
	const SyncHelper_1 = __webpack_require__(243);
	exports.Sync = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ status: 'offline'
	        });
	        module.addSignals({ changed: changed_1.changed
	        });
	        SyncHelper_1.SyncHelper.start({ controller, db: db_1.db });
	        return {}; // meta information
	    };
	};


/***/ },
/* 239 */
/***/ function(module, exports) {

	"use strict";
	exports.start = [];


/***/ },
/* 240 */
/***/ function(module, exports) {

	"use strict";
	exports.stop = [];


/***/ },
/* 241 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const changedAction_1 = __webpack_require__(242);
	const status_1 = __webpack_require__(3);
	exports.changed = [changedAction_1.changedAction,
	    { success: [], error: [status_1.status] }
	];


/***/ },
/* 242 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(24);
	exports.changedAction = ({ state, input: { type, message }, output }) => {
	    if (type === 'error') {
	        output.error({ status: { type, message } });
	    }
	    else {
	        state.set(['$sync', 'status'], type);
	        output.success();
	    }
	};
	// Cerebral type checking
	exports.changedAction['input'] = (k) => (check.string(k.type)
	    && check.maybe.string(k.message));


/***/ },
/* 243 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: we should probably move all db code
	// to a DatabaseHelper and use this to login, sync, etc
	// with proper try/catch/promise.
	//
	// CHECK CODE WITH
	// https://github.com/colinskow/ng-pouch-mirror/blob/master/src/ng-pouch-mirror.js
	const PouchDB = __webpack_require__(114);
	let sync;
	let remoteDB;
	const DB_NAME = 'lucidity-dev';
	const HOST = 'db.lucidity.io';
	const PROT = 'https';
	const PORT = 6984;
	var SyncHelper;
	(function (SyncHelper) {
	    SyncHelper.start = ({ controller, db }) => {
	        console.log('START SYNC');
	        const signals = controller.getSignals();
	        const changedSignal = signals.$sync.changed;
	        if (sync) {
	            SyncHelper.stop();
	        }
	        if (!remoteDB) {
	            // This never throws
	            remoteDB = new PouchDB(`${PROT}://${HOST}:${PORT}/${DB_NAME}`, { skipSetup: true });
	        }
	        const login = (retry) => {
	            try {
	                remoteDB.login('gaspard', 'devdoompasshopi')
	                    .then(() => {
	                    changedSignal({ type: 'paused' });
	                    startSync({ db, remoteDB, changedSignal, retry });
	                })
	                    .catch((err) => {
	                    // invalid credentials or offlinne ?
	                    SyncHelper.stop();
	                    changedSignal({ type: 'offline' });
	                    if (retry) {
	                        retry();
	                    }
	                });
	            }
	            catch (err) {
	                SyncHelper.stop();
	                changedSignal({ type: 'offline' });
	                if (retry) {
	                    retry();
	                }
	            }
	        };
	        const retry = () => {
	            setTimeout(() => login(retry), 5000);
	        };
	        login(retry);
	        remoteDB
	            .on('error', (err) => {
	            changedSignal({ type: 'error', message: err });
	        });
	    };
	    SyncHelper.stop = () => {
	        if (sync) {
	            sync.cancel();
	            sync = null;
	        }
	    };
	    const startSync = ({ db, remoteDB, changedSignal, retry }) => {
	        sync = db.sync(remoteDB, { live: true, retry: false })
	            .on('change', () => {
	            changedSignal({ type: 'change' });
	        })
	            .on('paused', () => {
	            changedSignal({ type: 'paused' });
	        })
	            .on('active', () => {
	            changedSignal({ type: 'active' });
	        })
	            .on('complete', () => {
	            changedSignal({ type: 'complete' });
	        })
	            .on('error', (err) => {
	            // going offline
	            changedSignal({ type: 'offline' });
	            if (retry) {
	                retry();
	            }
	        });
	    };
	})(SyncHelper = exports.SyncHelper || (exports.SyncHelper = {}));


/***/ },
/* 244 */
/***/ function(module, exports, __webpack_require__) {

	var MODULE = 'cerebral-module-router'
	var isObject = __webpack_require__(245)
	var get = __webpack_require__(246)
	
	var Mapper = __webpack_require__(249)
	var addressbar
	try {
	  addressbar = __webpack_require__(255)
	} catch (e) {
	  addressbar = {
	    pathname: '/',
	    value: '',
	    origin: '',
	    on: function () {},
	    removeListener: function () {}
	  }
	}
	
	module.exports = Router
	
	function Router (routesConfig, options) {
	  options = options || {}
	
	  if (!routesConfig) {
	    throw new Error('Cerebral router - Routes configuration wasn\'t provided.')
	  } else {
	    routesConfig = flattenConfig(routesConfig)
	  }
	
	  if (!options.baseUrl && options.onlyHash) {
	    // autodetect baseUrl
	    options.baseUrl = addressbar.pathname
	  }
	  options.baseUrl = (options.baseUrl || '') + (options.onlyHash ? '#' : '')
	  var urlMapper = Mapper(options.mapper)
	
	  return function init (module, controller) {
	    var signals = getRoutableSignals(routesConfig, controller.getSignals())
	    var rememberedUrl
	    var initialSignals
	
	    function setRememberedUrl () {
	      addressbar.value = rememberedUrl
	      rememberedUrl = null
	    }
	
	    function onUrlChange (event) {
	      var url = event ? event.target.value : addressbar.value
	      url = url.replace(addressbar.origin, '')
	
	      if (options.onlyHash && !~url.indexOf('#')) {
	        // treat hash absense as root route
	        url = url + '#/'
	      }
	
	      // check if url should be routed
	      if (url.indexOf(options.baseUrl) === 0) {
	        var map = urlMapper.map(url.replace(options.baseUrl, ''), routesConfig)
	
	        if (map) {
	          event && event.preventDefault()
	          addressbar.value = url
	
	          signals[map.match].signal(map.values, {
	            isRouted: true
	          })
	        } else {
	          if (options.allowEscape) return
	
	          event && event.preventDefault()
	          console.warn('Cerebral router - No route matched "' + url + '" url, navigation was prevented. ' +
	            'Please verify url or catch unmatched routes with a "/*" route.')
	        }
	      }
	    }
	
	    function onPredefinedSignal (event) {
	      var signal = signals[event.signal.name]
	      if (signal) {
	        if (!rememberedUrl) setTimeout(setRememberedUrl)
	
	        var route = signal.route
	        var input = event.signal.input || {}
	        rememberedUrl = options.baseUrl + urlMapper.stringify(route, input)
	      }
	    }
	
	    function onSignalStart (event) {
	      if (Array.isArray(initialSignals)) {
	        initialSignals.push(event.signal)
	      }
	
	      var signal = signals[event.signal.name]
	      if (signal && (!event.signal.isRouted && !(event.options && event.options.isRouted))) {
	        var route = signal.route
	        var input = event.signal.input || event.payload || {}
	        addressbar.value = options.baseUrl + urlMapper.stringify(route, input)
	      }
	    }
	
	    function onSignalEnd (event) {
	      if (Array.isArray(initialSignals)) {
	        initialSignals.splice(initialSignals.indexOf(event.signal), 1)
	
	        if (initialSignals.length === 0) {
	          controller.removeListener('signalEnd', onSignalEnd)
	          initialSignals = null
	          if (typeof rememberedUrl === 'undefined') setTimeout(onUrlChange)
	        }
	      }
	    }
	
	    function onModulesLoaded (event) {
	      if (rememberedUrl) return
	      if (Array.isArray(initialSignals) && initialSignals.length === 0) {
	        setTimeout(onUrlChange)
	        initialSignals = null
	      }
	    }
	
	    var services = {
	      trigger: function trigger (url) {
	        if (url) addressbar.value = url
	        onUrlChange()
	      },
	
	      detach: function detach () {
	        addressbar.removeListener('change', onUrlChange)
	      },
	
	      getUrl: function getUrl () {
	        return addressbar.value.replace(addressbar.origin + options.baseUrl, '')
	      },
	
	      getSignalUrl: function getSignalUrl (signalName, input) {
	        if (signals[signalName]) {
	          var route = signals[signalName].route
	          return options.baseUrl + urlMapper.stringify(route, input || {})
	        } else {
	          return false
	        }
	      },
	
	      redirect: function redirect (url, params) {
	        params = params || {}
	        params.replace = (typeof params.replace === 'undefined') ? true : params.replace
	
	        addressbar.value = {
	          value: options.baseUrl + url,
	          replace: params.replace
	        }
	
	        setTimeout(onUrlChange)
	      },
	
	      redirectToSignal: function redirectToSignal (signalName, payload) {
	        var signal = get(signals, signalName)
	        if (signal) {
	          setTimeout(signal.signal.bind(null, payload))
	        } else {
	          console.warn('Cerebral router - signal ' + signalName + ' is not bound to route. Redirect wouldn\'t happen.')
	        }
	      }
	    }
	
	    module.alias(MODULE)
	    module.addServices(services)
	    addressbar.on('change', onUrlChange)
	    controller.on('predefinedSignal', onPredefinedSignal)
	    controller.on('signalStart', onSignalStart)
	
	    if (!options.preventAutostart) {
	      initialSignals = []
	      controller.on('signalEnd', onSignalEnd)
	      controller.on('modulesLoaded', onModulesLoaded)
	    }
	
	    if (controller.addContextProvider) {
	      var context = {}
	      context[MODULE] = {
	        path: module.path
	      }
	      controller.addContextProvider(context)
	    }
	  }
	}
	
	var getRouterServices = function (context) {
	  var modulePath = context[MODULE] ? context[MODULE].path : context.modules[MODULE].path
	  return modulePath.reduce(function (services, key) {
	    return services[key]
	  }, context.services)
	}
	
	Router.redirect = function (url, params) {
	  function action (context) {
	    var services = getRouterServices(context)
	
	    return services.redirect(url, params)
	  }
	
	  action.displayName = 'redirect(' + url + ')'
	
	  return action
	}
	
	function flattenConfig (config, prev, flatten) {
	  flatten = flatten || {}
	  prev = prev || ''
	
	  Object.keys(config).forEach(function (key) {
	    if (isObject(config[key])) {
	      flattenConfig(config[key], prev + key, flatten)
	    } else {
	      flatten[prev + key] = config[key]
	    }
	  })
	
	  return flatten
	}
	
	function getRoutableSignals (config, signals) {
	  var routableSignals = {}
	
	  Object.keys(config).forEach(function (route) {
	    var signal = get(signals, config[route])
	    if (!signal) {
	      throw new Error('Cerebral router - The signal "' + config[route] +
	      '" for the route "' + route + '" does not exist. ' +
	      'Make sure that ' + MODULE + ' loaded after all modules with routable signals.')
	    }
	    if (routableSignals[config[route]]) {
	      throw new Error('Cerebral router - The signal "' + config[route] +
	      '" has already been bound to route "' + route +
	      '". Create a new signal and reuse actions instead if needed.')
	    }
	    routableSignals[config[route]] = {
	      route: route,
	      signal: signal
	    }
	  })
	
	  return routableSignals
	}


/***/ },
/* 245 */
/***/ function(module, exports) {

	/**
	 * lodash 3.0.2 (Custom Build) <https://lodash.com/>
	 * Build: `lodash modern modularize exports="npm" -o ./`
	 * Copyright 2012-2015 The Dojo Foundation <http://dojofoundation.org/>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright 2009-2015 Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 * Available under MIT license <https://lodash.com/license>
	 */
	
	/**
	 * Checks if `value` is the [language type](https://es5.github.io/#x8) of `Object`.
	 * (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(1);
	 * // => false
	 */
	function isObject(value) {
	  // Avoid a V8 JIT bug in Chrome 19-20.
	  // See https://code.google.com/p/v8/issues/detail?id=2291 for more details.
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	module.exports = isObject;


/***/ },
/* 246 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	var stringToPath = __webpack_require__(247);
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Used to match property names within property paths. */
	var reIsDeepProp = /\.|\[(?:[^[\]]*|(["'])(?:(?!\1)[^\\]|\\.)*?\1)\]/,
	    reIsPlainProp = /^\w*$/;
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/**
	 * The base implementation of `_.get` without support for default values.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @returns {*} Returns the resolved value.
	 */
	function baseGet(object, path) {
	  path = isKey(path, object) ? [path] : castPath(path);
	
	  var index = 0,
	      length = path.length;
	
	  while (object != null && index < length) {
	    object = object[toKey(path[index++])];
	  }
	  return (index && index == length) ? object : undefined;
	}
	
	/**
	 * Casts `value` to a path array if it's not one.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {Array} Returns the cast property path array.
	 */
	function castPath(value) {
	  return isArray(value) ? value : stringToPath(value);
	}
	
	/**
	 * Checks if `value` is a property name and not a property path.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @param {Object} [object] The object to query keys on.
	 * @returns {boolean} Returns `true` if `value` is a property name, else `false`.
	 */
	function isKey(value, object) {
	  if (isArray(value)) {
	    return false;
	  }
	  var type = typeof value;
	  if (type == 'number' || type == 'symbol' || type == 'boolean' ||
	      value == null || isSymbol(value)) {
	    return true;
	  }
	  return reIsPlainProp.test(value) || !reIsDeepProp.test(value) ||
	    (object != null && value in Object(object));
	}
	
	/**
	 * Converts `value` to a string key if it's not a string or symbol.
	 *
	 * @private
	 * @param {*} value The value to inspect.
	 * @returns {string|symbol} Returns the key.
	 */
	function toKey(value) {
	  if (typeof value == 'string' || isSymbol(value)) {
	    return value;
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}
	
	/**
	 * Checks if `value` is classified as an `Array` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @type {Function}
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isArray([1, 2, 3]);
	 * // => true
	 *
	 * _.isArray(document.body.children);
	 * // => false
	 *
	 * _.isArray('abc');
	 * // => false
	 *
	 * _.isArray(_.noop);
	 * // => false
	 */
	var isArray = Array.isArray;
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}
	
	/**
	 * Gets the value at `path` of `object`. If the resolved value is
	 * `undefined`, the `defaultValue` is used in its place.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.7.0
	 * @category Object
	 * @param {Object} object The object to query.
	 * @param {Array|string} path The path of the property to get.
	 * @param {*} [defaultValue] The value returned for `undefined` resolved values.
	 * @returns {*} Returns the resolved value.
	 * @example
	 *
	 * var object = { 'a': [{ 'b': { 'c': 3 } }] };
	 *
	 * _.get(object, 'a[0].b.c');
	 * // => 3
	 *
	 * _.get(object, ['a', '0', 'b', 'c']);
	 * // => 3
	 *
	 * _.get(object, 'a.b.c', 'default');
	 * // => 'default'
	 */
	function get(object, path, defaultValue) {
	  var result = object == null ? undefined : baseGet(object, path);
	  return result === undefined ? defaultValue : result;
	}
	
	module.exports = get;


/***/ },
/* 247 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	var baseToString = __webpack_require__(248);
	
	/** Used as the `TypeError` message for "Functions" methods. */
	var FUNC_ERROR_TEXT = 'Expected a function';
	
	/** Used to stand-in for `undefined` hash values. */
	var HASH_UNDEFINED = '__lodash_hash_undefined__';
	
	/** `Object#toString` result references. */
	var funcTag = '[object Function]',
	    genTag = '[object GeneratorFunction]';
	
	/** Used to match property names within property paths. */
	var rePropName = /[^.[\]]+|\[(?:(-?\d+(?:\.\d+)?)|(["'])((?:(?!\2)[^\\]|\\.)*?)\2)\]/g;
	
	/**
	 * Used to match `RegExp`
	 * [syntax characters](http://ecma-international.org/ecma-262/6.0/#sec-patterns).
	 */
	var reRegExpChar = /[\\^$.*+?()[\]{}|]/g;
	
	/** Used to match backslashes in property paths. */
	var reEscapeChar = /\\(\\)?/g;
	
	/** Used to detect host constructors (Safari). */
	var reIsHostCtor = /^\[object .+?Constructor\]$/;
	
	/** Used to determine if values are of the language type `Object`. */
	var objectTypes = {
	  'function': true,
	  'object': true
	};
	
	/** Detect free variable `exports`. */
	var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
	  ? exports
	  : undefined;
	
	/** Detect free variable `module`. */
	var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
	  ? module
	  : undefined;
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);
	
	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	
	/** Detect free variable `window`. */
	var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	
	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	
	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it's the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal ||
	  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
	    freeSelf || thisGlobal || Function('return this')();
	
	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}
	
	/**
	 * Checks if `value` is a host object in IE < 9.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a host object, else `false`.
	 */
	function isHostObject(value) {
	  // Many host objects are `Object` objects that can coerce to strings
	  // despite having improperly defined `toString` methods.
	  var result = false;
	  if (value != null && typeof value.toString != 'function') {
	    try {
	      result = !!(value + '');
	    } catch (e) {}
	  }
	  return result;
	}
	
	/** Used for built-in method references. */
	var arrayProto = Array.prototype,
	    objectProto = Object.prototype;
	
	/** Used to resolve the decompiled source of functions. */
	var funcToString = Function.prototype.toString;
	
	/** Used to check objects for own properties. */
	var hasOwnProperty = objectProto.hasOwnProperty;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Used to detect if a method is native. */
	var reIsNative = RegExp('^' +
	  funcToString.call(hasOwnProperty).replace(reRegExpChar, '\\$&')
	  .replace(/hasOwnProperty|(function).*?(?=\\\()| for .+?(?=\\\])/g, '$1.*?') + '$'
	);
	
	/** Built-in value references. */
	var splice = arrayProto.splice;
	
	/* Built-in method references that are verified to be native. */
	var Map = getNative(root, 'Map'),
	    nativeCreate = getNative(Object, 'create');
	
	/**
	 * Creates a hash object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function Hash(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the hash.
	 *
	 * @private
	 * @name clear
	 * @memberOf Hash
	 */
	function hashClear() {
	  this.__data__ = nativeCreate ? nativeCreate(null) : {};
	}
	
	/**
	 * Removes `key` and its value from the hash.
	 *
	 * @private
	 * @name delete
	 * @memberOf Hash
	 * @param {Object} hash The hash to modify.
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function hashDelete(key) {
	  return this.has(key) && delete this.__data__[key];
	}
	
	/**
	 * Gets the hash value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf Hash
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function hashGet(key) {
	  var data = this.__data__;
	  if (nativeCreate) {
	    var result = data[key];
	    return result === HASH_UNDEFINED ? undefined : result;
	  }
	  return hasOwnProperty.call(data, key) ? data[key] : undefined;
	}
	
	/**
	 * Checks if a hash value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf Hash
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function hashHas(key) {
	  var data = this.__data__;
	  return nativeCreate ? data[key] !== undefined : hasOwnProperty.call(data, key);
	}
	
	/**
	 * Sets the hash `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf Hash
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the hash instance.
	 */
	function hashSet(key, value) {
	  var data = this.__data__;
	  data[key] = (nativeCreate && value === undefined) ? HASH_UNDEFINED : value;
	  return this;
	}
	
	// Add methods to `Hash`.
	Hash.prototype.clear = hashClear;
	Hash.prototype['delete'] = hashDelete;
	Hash.prototype.get = hashGet;
	Hash.prototype.has = hashHas;
	Hash.prototype.set = hashSet;
	
	/**
	 * Creates an list cache object.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function ListCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the list cache.
	 *
	 * @private
	 * @name clear
	 * @memberOf ListCache
	 */
	function listCacheClear() {
	  this.__data__ = [];
	}
	
	/**
	 * Removes `key` and its value from the list cache.
	 *
	 * @private
	 * @name delete
	 * @memberOf ListCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function listCacheDelete(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    return false;
	  }
	  var lastIndex = data.length - 1;
	  if (index == lastIndex) {
	    data.pop();
	  } else {
	    splice.call(data, index, 1);
	  }
	  return true;
	}
	
	/**
	 * Gets the list cache value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf ListCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function listCacheGet(key) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  return index < 0 ? undefined : data[index][1];
	}
	
	/**
	 * Checks if a list cache value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf ListCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function listCacheHas(key) {
	  return assocIndexOf(this.__data__, key) > -1;
	}
	
	/**
	 * Sets the list cache `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf ListCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the list cache instance.
	 */
	function listCacheSet(key, value) {
	  var data = this.__data__,
	      index = assocIndexOf(data, key);
	
	  if (index < 0) {
	    data.push([key, value]);
	  } else {
	    data[index][1] = value;
	  }
	  return this;
	}
	
	// Add methods to `ListCache`.
	ListCache.prototype.clear = listCacheClear;
	ListCache.prototype['delete'] = listCacheDelete;
	ListCache.prototype.get = listCacheGet;
	ListCache.prototype.has = listCacheHas;
	ListCache.prototype.set = listCacheSet;
	
	/**
	 * Creates a map cache object to store key-value pairs.
	 *
	 * @private
	 * @constructor
	 * @param {Array} [entries] The key-value pairs to cache.
	 */
	function MapCache(entries) {
	  var index = -1,
	      length = entries ? entries.length : 0;
	
	  this.clear();
	  while (++index < length) {
	    var entry = entries[index];
	    this.set(entry[0], entry[1]);
	  }
	}
	
	/**
	 * Removes all key-value entries from the map.
	 *
	 * @private
	 * @name clear
	 * @memberOf MapCache
	 */
	function mapCacheClear() {
	  this.__data__ = {
	    'hash': new Hash,
	    'map': new (Map || ListCache),
	    'string': new Hash
	  };
	}
	
	/**
	 * Removes `key` and its value from the map.
	 *
	 * @private
	 * @name delete
	 * @memberOf MapCache
	 * @param {string} key The key of the value to remove.
	 * @returns {boolean} Returns `true` if the entry was removed, else `false`.
	 */
	function mapCacheDelete(key) {
	  return getMapData(this, key)['delete'](key);
	}
	
	/**
	 * Gets the map value for `key`.
	 *
	 * @private
	 * @name get
	 * @memberOf MapCache
	 * @param {string} key The key of the value to get.
	 * @returns {*} Returns the entry value.
	 */
	function mapCacheGet(key) {
	  return getMapData(this, key).get(key);
	}
	
	/**
	 * Checks if a map value for `key` exists.
	 *
	 * @private
	 * @name has
	 * @memberOf MapCache
	 * @param {string} key The key of the entry to check.
	 * @returns {boolean} Returns `true` if an entry for `key` exists, else `false`.
	 */
	function mapCacheHas(key) {
	  return getMapData(this, key).has(key);
	}
	
	/**
	 * Sets the map `key` to `value`.
	 *
	 * @private
	 * @name set
	 * @memberOf MapCache
	 * @param {string} key The key of the value to set.
	 * @param {*} value The value to set.
	 * @returns {Object} Returns the map cache instance.
	 */
	function mapCacheSet(key, value) {
	  getMapData(this, key).set(key, value);
	  return this;
	}
	
	// Add methods to `MapCache`.
	MapCache.prototype.clear = mapCacheClear;
	MapCache.prototype['delete'] = mapCacheDelete;
	MapCache.prototype.get = mapCacheGet;
	MapCache.prototype.has = mapCacheHas;
	MapCache.prototype.set = mapCacheSet;
	
	/**
	 * Gets the index at which the `key` is found in `array` of key-value pairs.
	 *
	 * @private
	 * @param {Array} array The array to search.
	 * @param {*} key The key to search for.
	 * @returns {number} Returns the index of the matched value, else `-1`.
	 */
	function assocIndexOf(array, key) {
	  var length = array.length;
	  while (length--) {
	    if (eq(array[length][0], key)) {
	      return length;
	    }
	  }
	  return -1;
	}
	
	/**
	 * Gets the data for `map`.
	 *
	 * @private
	 * @param {Object} map The map to query.
	 * @param {string} key The reference key.
	 * @returns {*} Returns the map data.
	 */
	function getMapData(map, key) {
	  var data = map.__data__;
	  return isKeyable(key)
	    ? data[typeof key == 'string' ? 'string' : 'hash']
	    : data.map;
	}
	
	/**
	 * Gets the native function at `key` of `object`.
	 *
	 * @private
	 * @param {Object} object The object to query.
	 * @param {string} key The key of the method to get.
	 * @returns {*} Returns the function if it's native, else `undefined`.
	 */
	function getNative(object, key) {
	  var value = object[key];
	  return isNative(value) ? value : undefined;
	}
	
	/**
	 * Checks if `value` is suitable for use as unique object key.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is suitable, else `false`.
	 */
	function isKeyable(value) {
	  var type = typeof value;
	  return (type == 'string' || type == 'number' || type == 'symbol' || type == 'boolean')
	    ? (value !== '__proto__')
	    : (value === null);
	}
	
	/**
	 * Converts `string` to a property path array.
	 *
	 * @private
	 * @param {string} string The string to convert.
	 * @returns {Array} Returns the property path array.
	 */
	var stringToPath = memoize(function(string) {
	  var result = [];
	  toString(string).replace(rePropName, function(match, number, quote, string) {
	    result.push(quote ? string.replace(reEscapeChar, '$1') : (number || match));
	  });
	  return result;
	});
	
	/**
	 * Converts `func` to its source code.
	 *
	 * @private
	 * @param {Function} func The function to process.
	 * @returns {string} Returns the source code.
	 */
	function toSource(func) {
	  if (func != null) {
	    try {
	      return funcToString.call(func);
	    } catch (e) {}
	    try {
	      return (func + '');
	    } catch (e) {}
	  }
	  return '';
	}
	
	/**
	 * Creates a function that memoizes the result of `func`. If `resolver` is
	 * provided, it determines the cache key for storing the result based on the
	 * arguments provided to the memoized function. By default, the first argument
	 * provided to the memoized function is used as the map cache key. The `func`
	 * is invoked with the `this` binding of the memoized function.
	 *
	 * **Note:** The cache is exposed as the `cache` property on the memoized
	 * function. Its creation may be customized by replacing the `_.memoize.Cache`
	 * constructor with one whose instances implement the
	 * [`Map`](http://ecma-international.org/ecma-262/6.0/#sec-properties-of-the-map-prototype-object)
	 * method interface of `delete`, `get`, `has`, and `set`.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Function
	 * @param {Function} func The function to have its output memoized.
	 * @param {Function} [resolver] The function to resolve the cache key.
	 * @returns {Function} Returns the new memoized function.
	 * @example
	 *
	 * var object = { 'a': 1, 'b': 2 };
	 * var other = { 'c': 3, 'd': 4 };
	 *
	 * var values = _.memoize(_.values);
	 * values(object);
	 * // => [1, 2]
	 *
	 * values(other);
	 * // => [3, 4]
	 *
	 * object.a = 2;
	 * values(object);
	 * // => [1, 2]
	 *
	 * // Modify the result cache.
	 * values.cache.set(object, ['a', 'b']);
	 * values(object);
	 * // => ['a', 'b']
	 *
	 * // Replace `_.memoize.Cache`.
	 * _.memoize.Cache = WeakMap;
	 */
	function memoize(func, resolver) {
	  if (typeof func != 'function' || (resolver && typeof resolver != 'function')) {
	    throw new TypeError(FUNC_ERROR_TEXT);
	  }
	  var memoized = function() {
	    var args = arguments,
	        key = resolver ? resolver.apply(this, args) : args[0],
	        cache = memoized.cache;
	
	    if (cache.has(key)) {
	      return cache.get(key);
	    }
	    var result = func.apply(this, args);
	    memoized.cache = cache.set(key, result);
	    return result;
	  };
	  memoized.cache = new (memoize.Cache || MapCache);
	  return memoized;
	}
	
	// Assign cache to `_.memoize`.
	memoize.Cache = MapCache;
	
	/**
	 * Performs a
	 * [`SameValueZero`](http://ecma-international.org/ecma-262/6.0/#sec-samevaluezero)
	 * comparison between two values to determine if they are equivalent.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to compare.
	 * @param {*} other The other value to compare.
	 * @returns {boolean} Returns `true` if the values are equivalent, else `false`.
	 * @example
	 *
	 * var object = { 'user': 'fred' };
	 * var other = { 'user': 'fred' };
	 *
	 * _.eq(object, object);
	 * // => true
	 *
	 * _.eq(object, other);
	 * // => false
	 *
	 * _.eq('a', 'a');
	 * // => true
	 *
	 * _.eq('a', Object('a'));
	 * // => false
	 *
	 * _.eq(NaN, NaN);
	 * // => true
	 */
	function eq(value, other) {
	  return value === other || (value !== value && other !== other);
	}
	
	/**
	 * Checks if `value` is classified as a `Function` object.
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isFunction(_);
	 * // => true
	 *
	 * _.isFunction(/abc/);
	 * // => false
	 */
	function isFunction(value) {
	  // The use of `Object#toString` avoids issues with the `typeof` operator
	  // in Safari 8 which returns 'object' for typed array and weak map constructors,
	  // and PhantomJS 1.9 which returns 'function' for `NodeList` instances.
	  var tag = isObject(value) ? objectToString.call(value) : '';
	  return tag == funcTag || tag == genTag;
	}
	
	/**
	 * Checks if `value` is the
	 * [language type](http://www.ecma-international.org/ecma-262/6.0/#sec-ecmascript-language-types)
	 * of `Object`. (e.g. arrays, functions, objects, regexes, `new Number(0)`, and `new String('')`)
	 *
	 * @static
	 * @memberOf _
	 * @since 0.1.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is an object, else `false`.
	 * @example
	 *
	 * _.isObject({});
	 * // => true
	 *
	 * _.isObject([1, 2, 3]);
	 * // => true
	 *
	 * _.isObject(_.noop);
	 * // => true
	 *
	 * _.isObject(null);
	 * // => false
	 */
	function isObject(value) {
	  var type = typeof value;
	  return !!value && (type == 'object' || type == 'function');
	}
	
	/**
	 * Checks if `value` is a native function.
	 *
	 * @static
	 * @memberOf _
	 * @since 3.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is a native function,
	 *  else `false`.
	 * @example
	 *
	 * _.isNative(Array.prototype.push);
	 * // => true
	 *
	 * _.isNative(_);
	 * // => false
	 */
	function isNative(value) {
	  if (!isObject(value)) {
	    return false;
	  }
	  var pattern = (isFunction(value) || isHostObject(value)) ? reIsNative : reIsHostCtor;
	  return pattern.test(toSource(value));
	}
	
	/**
	 * Converts `value` to a string. An empty string is returned for `null`
	 * and `undefined` values. The sign of `-0` is preserved.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 * @example
	 *
	 * _.toString(null);
	 * // => ''
	 *
	 * _.toString(-0);
	 * // => '-0'
	 *
	 * _.toString([1, 2, 3]);
	 * // => '1,2,3'
	 */
	function toString(value) {
	  return value == null ? '' : baseToString(value);
	}
	
	module.exports = stringToPath;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(178)(module), (function() { return this; }())))

/***/ },
/* 248 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	
	/** Used as references for various `Number` constants. */
	var INFINITY = 1 / 0;
	
	/** `Object#toString` result references. */
	var symbolTag = '[object Symbol]';
	
	/** Used to determine if values are of the language type `Object`. */
	var objectTypes = {
	  'function': true,
	  'object': true
	};
	
	/** Detect free variable `exports`. */
	var freeExports = (objectTypes[typeof exports] && exports && !exports.nodeType)
	  ? exports
	  : undefined;
	
	/** Detect free variable `module`. */
	var freeModule = (objectTypes[typeof module] && module && !module.nodeType)
	  ? module
	  : undefined;
	
	/** Detect free variable `global` from Node.js. */
	var freeGlobal = checkGlobal(freeExports && freeModule && typeof global == 'object' && global);
	
	/** Detect free variable `self`. */
	var freeSelf = checkGlobal(objectTypes[typeof self] && self);
	
	/** Detect free variable `window`. */
	var freeWindow = checkGlobal(objectTypes[typeof window] && window);
	
	/** Detect `this` as the global object. */
	var thisGlobal = checkGlobal(objectTypes[typeof this] && this);
	
	/**
	 * Used as a reference to the global object.
	 *
	 * The `this` value is used if it's the global object to avoid Greasemonkey's
	 * restricted `window` object, otherwise the `window` object is used.
	 */
	var root = freeGlobal ||
	  ((freeWindow !== (thisGlobal && thisGlobal.window)) && freeWindow) ||
	    freeSelf || thisGlobal || Function('return this')();
	
	/**
	 * Checks if `value` is a global object.
	 *
	 * @private
	 * @param {*} value The value to check.
	 * @returns {null|Object} Returns `value` if it's a global object, else `null`.
	 */
	function checkGlobal(value) {
	  return (value && value.Object === Object) ? value : null;
	}
	
	/** Used for built-in method references. */
	var objectProto = Object.prototype;
	
	/**
	 * Used to resolve the
	 * [`toStringTag`](http://ecma-international.org/ecma-262/6.0/#sec-object.prototype.tostring)
	 * of values.
	 */
	var objectToString = objectProto.toString;
	
	/** Built-in value references. */
	var Symbol = root.Symbol;
	
	/** Used to convert symbols to primitives and strings. */
	var symbolProto = Symbol ? Symbol.prototype : undefined,
	    symbolToString = symbolProto ? symbolProto.toString : undefined;
	
	/**
	 * The base implementation of `_.toString` which doesn't convert nullish
	 * values to empty strings.
	 *
	 * @private
	 * @param {*} value The value to process.
	 * @returns {string} Returns the string.
	 */
	function baseToString(value) {
	  // Exit early for strings to avoid a performance hit in some environments.
	  if (typeof value == 'string') {
	    return value;
	  }
	  if (isSymbol(value)) {
	    return symbolToString ? symbolToString.call(value) : '';
	  }
	  var result = (value + '');
	  return (result == '0' && (1 / value) == -INFINITY) ? '-0' : result;
	}
	
	/**
	 * Checks if `value` is object-like. A value is object-like if it's not `null`
	 * and has a `typeof` result of "object".
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is object-like, else `false`.
	 * @example
	 *
	 * _.isObjectLike({});
	 * // => true
	 *
	 * _.isObjectLike([1, 2, 3]);
	 * // => true
	 *
	 * _.isObjectLike(_.noop);
	 * // => false
	 *
	 * _.isObjectLike(null);
	 * // => false
	 */
	function isObjectLike(value) {
	  return !!value && typeof value == 'object';
	}
	
	/**
	 * Checks if `value` is classified as a `Symbol` primitive or object.
	 *
	 * @static
	 * @memberOf _
	 * @since 4.0.0
	 * @category Lang
	 * @param {*} value The value to check.
	 * @returns {boolean} Returns `true` if `value` is correctly classified,
	 *  else `false`.
	 * @example
	 *
	 * _.isSymbol(Symbol.iterator);
	 * // => true
	 *
	 * _.isSymbol('abc');
	 * // => false
	 */
	function isSymbol(value) {
	  return typeof value == 'symbol' ||
	    (isObjectLike(value) && objectToString.call(value) == symbolTag);
	}
	
	module.exports = baseToString;
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(178)(module), (function() { return this; }())))

/***/ },
/* 249 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	var mapper = __webpack_require__(250)
	var compileRoute = __webpack_require__(251)
	
	module.exports = function urlMapper (options) {
	  return mapper(compileRoute, options)
	}


/***/ },
/* 250 */
/***/ function(module, exports) {

	module.exports = function mapper (compileFn, options) {
	  if (typeof compileFn !== 'function') throw new Error('URL Mapper - function to compile a route expected as first argument')
	
	  options = options || {}
	  var cache = {}
	
	  function getCompiledRoute (route) {
	    if (!cache[route]) {
	      cache[route] = compileFn(route, options)
	    }
	
	    return cache[route]
	  }
	
	  function parse (route, url) {
	    if (arguments.length < 2) throw new Error('URL Mapper - parse method expects 2 arguments')
	    return getCompiledRoute(route).parse(url)
	  }
	
	  function stringify (route, values) {
	    if (arguments.length < 2) throw new Error('URL Mapper - stringify method expects 2 arguments')
	    return getCompiledRoute(route).stringify(values)
	  }
	
	  function map (url, routes) {
	    if (arguments.length < 2) throw new Error('URL Mapper - map method expects 2 arguments')
	    for (var route in routes) {
	      var compiled = getCompiledRoute(route)
	      var values = compiled.parse(url)
	      if (values) {
	        var match = routes[route]
	
	        return {
	          route: route,
	          match: match,
	          values: values
	        }
	      }
	    }
	  }
	
	  return {
	    parse: parse,
	    stringify: stringify,
	    map: map
	  }
	}


/***/ },
/* 251 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	var URLON = __webpack_require__(252)
	var pathToRegexp = __webpack_require__(253)
	
	function compileRoute (route, options) {
	  var re
	  var compiled
	  var keys = []
	  var querySeparator = options.querySeparator || '?'
	
	  re = pathToRegexp(route, keys)
	  keys = keys.map(function (key) { return key.name.toString() })
	  compiled = pathToRegexp.compile(route)
	
	  return {
	    parse: function (url) {
	      var path = url
	      var result = {}
	
	      if (~path.indexOf('#') && !~querySeparator.indexOf('#')) {
	        path = path.split('#')[0]
	      }
	
	      if (~path.indexOf(querySeparator)) {
	        if (options.query) {
	          var queryString = '_' + path.slice(path.indexOf(querySeparator) + querySeparator.length)
	          result = URLON.parse(queryString)
	        }
	        path = path.split(querySeparator)[0]
	      }
	
	      var match = re.exec(path)
	      if (!match) return null
	
	      for (var i = 1; i < match.length; ++i) {
	        var key = keys[i - 1]
	        var value = decodeURIComponent(match[i])
	        if (value[0] === ':') {
	          result[key] = URLON.parse(value)
	        } else {
	          result[key] = value
	        }
	      }
	
	      return result
	    },
	
	    stringify: function (values) {
	      var pathParams = {}
	      var queryParams = {}
	
	      Object.keys(values).forEach(function (key) {
	        if (~keys.indexOf(key)) {
	          switch (typeof values[key]) {
	            case 'boolean':
	            case 'number':
	              pathParams[key] = URLON.stringify(values[key])
	              break
	
	            case 'object':
	              throw new Error('URL Mapper - objects are not allowed to be stringified as part of path')
	
	            default:
	              pathParams[key] = values[key]
	          }
	        } else {
	          if (typeof values[key] !== 'undefined') queryParams[key] = values[key]
	        }
	      })
	
	      var path = compiled(pathParams)
	      var queryString = ''
	
	      if (options.query) {
	        if (Object.keys(queryParams).length) {
	          queryString = querySeparator + URLON.stringify(queryParams).slice(1)
	        }
	      }
	
	      return path + queryString
	    }
	  }
	}
	
	module.exports = compileRoute


/***/ },
/* 252 */
/***/ function(module, exports, __webpack_require__) {

	var URLON = {
		stringify: function (input) {
			function encodeString (str) {
				return encodeURI(str.replace(/([=:&@_;\/])/g, '/$1'));
			}
	
			function stringify (input) {
				// Number or Boolean or Null
				if (typeof input === 'number' || input === true || input === false || input === null) {
					return ':' + input;
				}
				// Array
				if (input instanceof Array) {
					var res = [];
					for (var i = 0; i < input.length; ++i) {
						res.push(stringify(input[i]));
					}
					return '@' + res.join('&') + ';';
				}
				// Object
				if (typeof input === 'object') {
					var res = [];
					for (var key in input) {
						res.push(encodeString(key) + stringify(input[key]));
					}
					return '_' + res.join('&') + ';';
				}
				// String or undefined
				return '=' + encodeString((input !== null ? (input !== undefined ? input : "undefined") : "null").toString());
			}
	
			return stringify(input).replace(/;+$/g, '');
		},
	
		parse: function (str) {
			var pos = 0;
			str = decodeURI(str);
	
			function read() {
				var token = '';
				for (; pos !== str.length; ++pos) {
					if (str.charAt(pos) === '/') {
						pos += 1;
						if (pos === str.length) {
							token += ';';
							break;
						}
					} else if (str.charAt(pos).match(/[=:&@_;]/)) {
						break;
					}
					token += str.charAt(pos);
				}
				return token;
			}
	
			function parse() {
				var type = str.charAt(pos++);
	
				// String
				if (type === '=') {
					return read();
				}
				// Number or Boolean
				if (type === ':') {
					var value = read();
					if (value === 'true') {
						return true;
					}
					if (value === 'false') {
						return false;
					}
					value = parseFloat(value);
					return isNaN(value) ? null : value;
				}
				// Array
				if (type === '@') {
					var res = [];
					loop: {
						if (pos >= str.length || str.charAt(pos) === ';') {
							break loop;
						}
						while (1) {
							res.push(parse());
							if (pos >= str.length || str.charAt(pos) === ';') {
								break loop;
							}
							pos += 1;
						}
					}
					pos += 1;
					return res;
				}
				// Object
				if (type === '_') {
					var res = {};
					loop: {
						if (pos >= str.length || str.charAt(pos) === ';') {
							break loop;
						}
						while (1) {
							var name = read();
							res[name] = parse();
							if (pos >= str.length || str.charAt(pos) === ';') {
								break loop;
							}
							pos += 1;
						}
					}
					pos += 1;
					return res;
				}
				// Error
				throw 'Unexpected char ' + type;
			}
	
			return parse();
		}
	};
	
	if (true) {
		exports.stringify = URLON.stringify;
		exports.parse = URLON.parse;
	}


/***/ },
/* 253 */
/***/ function(module, exports, __webpack_require__) {

	var isarray = __webpack_require__(254)
	
	/**
	 * Expose `pathToRegexp`.
	 */
	module.exports = pathToRegexp
	module.exports.parse = parse
	module.exports.compile = compile
	module.exports.tokensToFunction = tokensToFunction
	module.exports.tokensToRegExp = tokensToRegExp
	
	/**
	 * The main path matching regexp utility.
	 *
	 * @type {RegExp}
	 */
	var PATH_REGEXP = new RegExp([
	  // Match escaped characters that would otherwise appear in future matches.
	  // This allows the user to escape special characters that won't transform.
	  '(\\\\.)',
	  // Match Express-style parameters and un-named parameters with a prefix
	  // and optional suffixes. Matches appear as:
	  //
	  // "/:test(\\d+)?" => ["/", "test", "\d+", undefined, "?", undefined]
	  // "/route(\\d+)"  => [undefined, undefined, undefined, "\d+", undefined, undefined]
	  // "/*"            => ["/", undefined, undefined, undefined, undefined, "*"]
	  '([\\/.])?(?:(?:\\:(\\w+)(?:\\(((?:\\\\.|[^()])+)\\))?|\\(((?:\\\\.|[^()])+)\\))([+*?])?|(\\*))'
	].join('|'), 'g')
	
	/**
	 * Parse a string for the raw tokens.
	 *
	 * @param  {string} str
	 * @return {!Array}
	 */
	function parse (str) {
	  var tokens = []
	  var key = 0
	  var index = 0
	  var path = ''
	  var res
	
	  while ((res = PATH_REGEXP.exec(str)) != null) {
	    var m = res[0]
	    var escaped = res[1]
	    var offset = res.index
	    path += str.slice(index, offset)
	    index = offset + m.length
	
	    // Ignore already escaped sequences.
	    if (escaped) {
	      path += escaped[1]
	      continue
	    }
	
	    var next = str[index]
	    var prefix = res[2]
	    var name = res[3]
	    var capture = res[4]
	    var group = res[5]
	    var modifier = res[6]
	    var asterisk = res[7]
	
	    // Push the current path onto the tokens.
	    if (path) {
	      tokens.push(path)
	      path = ''
	    }
	
	    var partial = prefix != null && next != null && next !== prefix
	    var repeat = modifier === '+' || modifier === '*'
	    var optional = modifier === '?' || modifier === '*'
	    var delimiter = res[2] || '/'
	    var pattern = capture || group || (asterisk ? '.*' : '[^' + delimiter + ']+?')
	
	    tokens.push({
	      name: name || key++,
	      prefix: prefix || '',
	      delimiter: delimiter,
	      optional: optional,
	      repeat: repeat,
	      partial: partial,
	      asterisk: !!asterisk,
	      pattern: escapeGroup(pattern)
	    })
	  }
	
	  // Match any characters still remaining.
	  if (index < str.length) {
	    path += str.substr(index)
	  }
	
	  // If the path exists, push it onto the end.
	  if (path) {
	    tokens.push(path)
	  }
	
	  return tokens
	}
	
	/**
	 * Compile a string to a template function for the path.
	 *
	 * @param  {string}             str
	 * @return {!function(Object=, Object=)}
	 */
	function compile (str) {
	  return tokensToFunction(parse(str))
	}
	
	/**
	 * Prettier encoding of URI path segments.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeURIComponentPretty (str) {
	  return encodeURI(str).replace(/[\/?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
	  })
	}
	
	/**
	 * Encode the asterisk parameter. Similar to `pretty`, but allows slashes.
	 *
	 * @param  {string}
	 * @return {string}
	 */
	function encodeAsterisk (str) {
	  return encodeURI(str).replace(/[?#]/g, function (c) {
	    return '%' + c.charCodeAt(0).toString(16).toUpperCase()
	  })
	}
	
	/**
	 * Expose a method for transforming tokens into the path function.
	 */
	function tokensToFunction (tokens) {
	  // Compile all the tokens into regexps.
	  var matches = new Array(tokens.length)
	
	  // Compile all the patterns before compilation.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] === 'object') {
	      matches[i] = new RegExp('^(?:' + tokens[i].pattern + ')$')
	    }
	  }
	
	  return function (obj, opts) {
	    var path = ''
	    var data = obj || {}
	    var options = opts || {}
	    var encode = options.pretty ? encodeURIComponentPretty : encodeURIComponent
	
	    for (var i = 0; i < tokens.length; i++) {
	      var token = tokens[i]
	
	      if (typeof token === 'string') {
	        path += token
	
	        continue
	      }
	
	      var value = data[token.name]
	      var segment
	
	      if (value == null) {
	        if (token.optional) {
	          // Prepend partial segment prefixes.
	          if (token.partial) {
	            path += token.prefix
	          }
	
	          continue
	        } else {
	          throw new TypeError('Expected "' + token.name + '" to be defined')
	        }
	      }
	
	      if (isarray(value)) {
	        if (!token.repeat) {
	          throw new TypeError('Expected "' + token.name + '" to not repeat, but received `' + JSON.stringify(value) + '`')
	        }
	
	        if (value.length === 0) {
	          if (token.optional) {
	            continue
	          } else {
	            throw new TypeError('Expected "' + token.name + '" to not be empty')
	          }
	        }
	
	        for (var j = 0; j < value.length; j++) {
	          segment = encode(value[j])
	
	          if (!matches[i].test(segment)) {
	            throw new TypeError('Expected all "' + token.name + '" to match "' + token.pattern + '", but received `' + JSON.stringify(segment) + '`')
	          }
	
	          path += (j === 0 ? token.prefix : token.delimiter) + segment
	        }
	
	        continue
	      }
	
	      segment = token.asterisk ? encodeAsterisk(value) : encode(value)
	
	      if (!matches[i].test(segment)) {
	        throw new TypeError('Expected "' + token.name + '" to match "' + token.pattern + '", but received "' + segment + '"')
	      }
	
	      path += token.prefix + segment
	    }
	
	    return path
	  }
	}
	
	/**
	 * Escape a regular expression string.
	 *
	 * @param  {string} str
	 * @return {string}
	 */
	function escapeString (str) {
	  return str.replace(/([.+*?=^!:${}()[\]|\/])/g, '\\$1')
	}
	
	/**
	 * Escape the capturing group by escaping special characters and meaning.
	 *
	 * @param  {string} group
	 * @return {string}
	 */
	function escapeGroup (group) {
	  return group.replace(/([=!:$\/()])/g, '\\$1')
	}
	
	/**
	 * Attach the keys as a property of the regexp.
	 *
	 * @param  {!RegExp} re
	 * @param  {Array}   keys
	 * @return {!RegExp}
	 */
	function attachKeys (re, keys) {
	  re.keys = keys
	  return re
	}
	
	/**
	 * Get the flags for a regexp from the options.
	 *
	 * @param  {Object} options
	 * @return {string}
	 */
	function flags (options) {
	  return options.sensitive ? '' : 'i'
	}
	
	/**
	 * Pull out keys from a regexp.
	 *
	 * @param  {!RegExp} path
	 * @param  {!Array}  keys
	 * @return {!RegExp}
	 */
	function regexpToRegexp (path, keys) {
	  // Use a negative lookahead to match only capturing groups.
	  var groups = path.source.match(/\((?!\?)/g)
	
	  if (groups) {
	    for (var i = 0; i < groups.length; i++) {
	      keys.push({
	        name: i,
	        prefix: null,
	        delimiter: null,
	        optional: false,
	        repeat: false,
	        partial: false,
	        asterisk: false,
	        pattern: null
	      })
	    }
	  }
	
	  return attachKeys(path, keys)
	}
	
	/**
	 * Transform an array into a regexp.
	 *
	 * @param  {!Array}  path
	 * @param  {Array}   keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function arrayToRegexp (path, keys, options) {
	  var parts = []
	
	  for (var i = 0; i < path.length; i++) {
	    parts.push(pathToRegexp(path[i], keys, options).source)
	  }
	
	  var regexp = new RegExp('(?:' + parts.join('|') + ')', flags(options))
	
	  return attachKeys(regexp, keys)
	}
	
	/**
	 * Create a path regexp from string input.
	 *
	 * @param  {string}  path
	 * @param  {!Array}  keys
	 * @param  {!Object} options
	 * @return {!RegExp}
	 */
	function stringToRegexp (path, keys, options) {
	  var tokens = parse(path)
	  var re = tokensToRegExp(tokens, options)
	
	  // Attach keys back to the regexp.
	  for (var i = 0; i < tokens.length; i++) {
	    if (typeof tokens[i] !== 'string') {
	      keys.push(tokens[i])
	    }
	  }
	
	  return attachKeys(re, keys)
	}
	
	/**
	 * Expose a function for taking tokens and returning a RegExp.
	 *
	 * @param  {!Array}  tokens
	 * @param  {Object=} options
	 * @return {!RegExp}
	 */
	function tokensToRegExp (tokens, options) {
	  options = options || {}
	
	  var strict = options.strict
	  var end = options.end !== false
	  var route = ''
	  var lastToken = tokens[tokens.length - 1]
	  var endsWithSlash = typeof lastToken === 'string' && /\/$/.test(lastToken)
	
	  // Iterate over the tokens and create our regexp string.
	  for (var i = 0; i < tokens.length; i++) {
	    var token = tokens[i]
	
	    if (typeof token === 'string') {
	      route += escapeString(token)
	    } else {
	      var prefix = escapeString(token.prefix)
	      var capture = '(?:' + token.pattern + ')'
	
	      if (token.repeat) {
	        capture += '(?:' + prefix + capture + ')*'
	      }
	
	      if (token.optional) {
	        if (!token.partial) {
	          capture = '(?:' + prefix + '(' + capture + '))?'
	        } else {
	          capture = prefix + '(' + capture + ')?'
	        }
	      } else {
	        capture = prefix + '(' + capture + ')'
	      }
	
	      route += capture
	    }
	  }
	
	  // In non-strict mode we allow a slash at the end of match. If the path to
	  // match already ends with a slash, we remove it for consistency. The slash
	  // is valid at the end of a path match, not in the middle. This is important
	  // in non-ending mode, where "/test/" shouldn't match "/test//route".
	  if (!strict) {
	    route = (endsWithSlash ? route.slice(0, -2) : route) + '(?:\\/(?=$))?'
	  }
	
	  if (end) {
	    route += '$'
	  } else {
	    // In non-ending mode, we need the capturing groups to match as much as
	    // possible by using a positive lookahead to the end or next path segment.
	    route += strict && endsWithSlash ? '' : '(?=\\/|$)'
	  }
	
	  return new RegExp('^' + route, flags(options))
	}
	
	/**
	 * Normalize the given path string, returning a regular expression.
	 *
	 * An empty array can be passed in for the keys, which will hold the
	 * placeholder key descriptions. For example, using `/user/:id`, `keys` will
	 * contain `[{ name: 'id', delimiter: '/', optional: false, repeat: false }]`.
	 *
	 * @param  {(string|RegExp|Array)} path
	 * @param  {(Array|Object)=}       keys
	 * @param  {Object=}               options
	 * @return {!RegExp}
	 */
	function pathToRegexp (path, keys, options) {
	  keys = keys || []
	
	  if (!isarray(keys)) {
	    options = /** @type {!Object} */ (keys)
	    keys = []
	  } else if (!options) {
	    options = {}
	  }
	
	  if (path instanceof RegExp) {
	    return regexpToRegexp(path, /** @type {!Array} */ (keys))
	  }
	
	  if (isarray(path)) {
	    return arrayToRegexp(/** @type {!Array} */ (path), /** @type {!Array} */ (keys), options)
	  }
	
	  return stringToRegexp(/** @type {string} */ (path), /** @type {!Array} */ (keys), options)
	}


/***/ },
/* 254 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 255 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global history */
	
	var URL = __webpack_require__(256)
	var EventEmitter = __webpack_require__(144).EventEmitter
	var instance = null
	
	// Check if IE history polyfill is added
	var location = window.history.location || window.location
	
	module.exports = (function () {
	  if (instance) {
	    return instance
	  }
	
	  var eventEmitter = new EventEmitter()
	
	  eventEmitter.addEventListener = eventEmitter.addListener
	  eventEmitter.removeEventListener = eventEmitter.removeListener
	
	  var initialUrl = location.href
	  var uri = URL(initialUrl)
	  var origin = uri.protocol + '//' + uri.host
	  var isPreventingDefault = false
	  var doReplace = false
	  var prevUrl = ''
	  // var linkClicked = false
	  var isEmitting = false
	  var setSyncUrl = false
	
	  var emitChange = function (url, event) {
	    eventEmitter.emit('change', {
	      preventDefault: function () {
	        event && event.preventDefault()
	        isPreventingDefault = true
	      },
	      target: {
	        value: url ? origin + url : location.href
	      }
	    })
	  }
	
	  var onUrlChange = function (type) {
	    return function (event) {
	      if (location.href === prevUrl) {
	        return
	      }
	
	      // Fixes bug where trailing slash is converted to normal url
	      if (location.href[location.href.length - 1] === '/') {
	        doReplace = true
	      }
	
	      isEmitting = true
	      emitChange()
	      isEmitting = false
	
	      if (!setSyncUrl && isPreventingDefault) {
	        history.replaceState({}, '', (prevUrl || initialUrl).replace(origin, ''))
	      }
	
	      prevUrl = location.href
	      isPreventingDefault = false
	      setSyncUrl = false
	      doReplace = false
	    }
	  }
	
	  // this hack resolves issue with safari
	  // see issue from Page JS for reference https://github.com/visionmedia/page.js/issues/213
	  // see also https://github.com/visionmedia/page.js/pull/240
	  if (document.readyState !== 'complete') {
	    // load event has not fired
	    global.addEventListener('load', function () {
	      setTimeout(function () {
	        global.addEventListener('popstate', onUrlChange('pop'), false)
	      }, 0)
	    }, false)
	  } else {
	    // load event has fired
	    global.addEventListener('popstate', onUrlChange('pop'), false)
	  }
	
	  Object.defineProperty(eventEmitter, 'value', {
	    get: function () {
	      return location.href
	    },
	    set: function (value) {
	      if (typeof value !== 'string') {
	        doReplace = Boolean(value.replace)
	        value = value.value
	      }
	
	      // If emitting a change we flag that we are setting
	      // a url based on the event being emitted
	      if (isEmitting) {
	        setSyncUrl = true
	      }
	
	      // Ensure full url
	      if (value.indexOf(origin) === -1) {
	        value = origin + value
	      }
	
	      // If it is same url, forget about it
	      if (value === location.href) {
	        return
	      }
	
	      // We might need to replace the url if we are fixing
	      // for example trailing slash issue
	      if (doReplace) {
	        history.replaceState({}, '', value.replace(origin, ''))
	        doReplace = false
	      } else {
	        history.pushState({}, '', value.replace(origin, ''))
	      }
	
	      prevUrl = location.href
	      isPreventingDefault = false
	    }
	  })
	
	  // expose URLUtils like API https://developer.mozilla.org/en-US/docs/Web/API/URLUtils
	  // thanks https://github.com/cofounders/urlutils for reference
	  Object.defineProperty(eventEmitter, 'origin', {
	    get: function () {
	      var uri = URL(location.href)
	      return uri.protocol + '//' + uri.host
	    }
	  })
	
	  Object.defineProperty(eventEmitter, 'protocol', {
	    get: function () {
	      return URL(location.href).protocol
	    }
	  })
	
	  Object.defineProperty(eventEmitter, 'port', {
	    get: function () {
	      return URL(location.href).port
	    }
	  })
	
	  Object.defineProperty(eventEmitter, 'hostname', {
	    get: function () {
	      return URL(location.href).hostname
	    }
	  })
	
	  Object.defineProperty(eventEmitter, 'pathname', {
	    get: function () {
	      return URL(location.href).pathname
	    }
	  })
	
	  Object.defineProperty(eventEmitter, 'hash', {
	    get: function () {
	      return URL(location.href).hash
	    }
	  })
	
	  /*
	    This code is from the Page JS source code. Amazing work on handling all
	    kinds of scenarios with hyperlinks, thanks!
	  */
	
	  var isSameOrigin = function (href) {
	    return (href && (href.indexOf(origin) === 0))
	  }
	
	  var getClickedHref = function (event) {
	    // check which button
	    if ((event.which === null ? event.button : event.which) !== 1) { return false }
	
	    // check for modifiers
	    if (event.metaKey || event.ctrlKey || event.shiftKey) { return false }
	    if (event.defaultPrevented) { return false }
	
	    // ensure link
	    var element = event.target
	    while (element && element.nodeName !== 'A') { element = element.parentNode }
	    if (!element || element.nodeName !== 'A') { return false }
	
	    // Ignore if tag has
	    // 1. "download" attribute
	    // 2. rel="external" attribute
	    if (element.hasAttribute('download') || element.getAttribute('rel') === 'external') { return false }
	
	    // Check for mailto: in the href
	    var href = element.getAttribute('href')
	    if (href && href.indexOf('mailto:') > -1) { return false }
	
	    // check target
	    if (element.target) { return false }
	
	    // x-origin
	    if (!isSameOrigin(element.href)) { return false }
	
	    return href
	  }
	
	  global.addEventListener(document.ontouchstart ? 'touchstart' : 'click', function (event) {
	    var href = getClickedHref(event)
	    if (href) {
	      // linkClicked = true
	      isEmitting = true
	      emitChange(href, event)
	      isEmitting = false
	      if (isPreventingDefault) {
	        // linkClicked = false
	      }
	      prevUrl = href
	      isPreventingDefault = false
	    }
	  })
	
	  instance = eventEmitter
	
	  return eventEmitter
	}())
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 256 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var required = __webpack_require__(257)
	  , lolcation = __webpack_require__(258)
	  , qs = __webpack_require__(259)
	  , relativere = /^\/(?!\/)/
	  , protocolre = /^([a-z0-9.+-]+:)?(\/\/)?(.*)$/i; // actual protocol is first match
	
	/**
	 * These are the parse instructions for the URL parsers, it informs the parser
	 * about:
	 *
	 * 0. The char it Needs to parse, if it's a string it should be done using
	 *    indexOf, RegExp using exec and NaN means set as current value.
	 * 1. The property we should set when parsing this value.
	 * 2. Indication if it's backwards or forward parsing, when set as number it's
	 *    the value of extra chars that should be split off.
	 * 3. Inherit from location if non existing in the parser.
	 * 4. `toLowerCase` the resulting value.
	 */
	var instructions = [
	  ['#', 'hash'],                        // Extract from the back.
	  ['?', 'query'],                       // Extract from the back.
	  ['/', 'pathname'],                    // Extract from the back.
	  ['@', 'auth', 1],                     // Extract from the front.
	  [NaN, 'host', undefined, 1, 1],       // Set left over value.
	  [/\:(\d+)$/, 'port'],                 // RegExp the back.
	  [NaN, 'hostname', undefined, 1, 1]    // Set left over.
	];
	
	 /**
	 * @typedef ProtocolExtract
	 * @type Object
	 * @property {String} protocol Protocol matched in the URL, in lowercase
	 * @property {Boolean} slashes Indicates whether the protocol is followed by double slash ("//")
	 * @property {String} rest     Rest of the URL that is not part of the protocol
	 */
	
	 /**
	  * Extract protocol information from a URL with/without double slash ("//")
	  *
	  * @param  {String} address   URL we want to extract from.
	  * @return {ProtocolExtract}  Extracted information
	  * @private
	  */
	function extractProtocol(address) {
	  var match = protocolre.exec(address);
	  return {
	    protocol: match[1] ? match[1].toLowerCase() : '',
	    slashes: !!match[2],
	    rest: match[3] ? match[3] : ''
	  };
	}
	
	/**
	 * The actual URL instance. Instead of returning an object we've opted-in to
	 * create an actual constructor as it's much more memory efficient and
	 * faster and it pleases my CDO.
	 *
	 * @constructor
	 * @param {String} address URL we want to parse.
	 * @param {Object|String} location Location defaults for relative paths.
	 * @param {Boolean|Function} parser Parser for the query string.
	 * @api public
	 */
	function URL(address, location, parser) {
	  if (!(this instanceof URL)) {
	    return new URL(address, location, parser);
	  }
	
	  var relative = relativere.test(address)
	    , parse, instruction, index, key
	    , type = typeof location
	    , url = this
	    , i = 0;
	
	  //
	  // The following if statements allows this module two have compatibility with
	  // 2 different API:
	  //
	  // 1. Node.js's `url.parse` api which accepts a URL, boolean as arguments
	  //    where the boolean indicates that the query string should also be parsed.
	  //
	  // 2. The `URL` interface of the browser which accepts a URL, object as
	  //    arguments. The supplied object will be used as default values / fall-back
	  //    for relative paths.
	  //
	  if ('object' !== type && 'string' !== type) {
	    parser = location;
	    location = null;
	  }
	
	  if (parser && 'function' !== typeof parser) {
	    parser = qs.parse;
	  }
	
	  location = lolcation(location);
	
	  // extract protocol information before running the instructions
	  var extracted = extractProtocol(address);
	  url.protocol = extracted.protocol || location.protocol || '';
	  url.slashes = extracted.slashes || location.slashes;
	  address = extracted.rest;
	
	  for (; i < instructions.length; i++) {
	    instruction = instructions[i];
	    parse = instruction[0];
	    key = instruction[1];
	
	    if (parse !== parse) {
	      url[key] = address;
	    } else if ('string' === typeof parse) {
	      if (~(index = address.indexOf(parse))) {
	        if ('number' === typeof instruction[2]) {
	          url[key] = address.slice(0, index);
	          address = address.slice(index + instruction[2]);
	        } else {
	          url[key] = address.slice(index);
	          address = address.slice(0, index);
	        }
	      }
	    } else if (index = parse.exec(address)) {
	      url[key] = index[1];
	      address = address.slice(0, address.length - index[0].length);
	    }
	
	    url[key] = url[key] || (instruction[3] || ('port' === key && relative) ? location[key] || '' : '');
	
	    //
	    // Hostname, host and protocol should be lowercased so they can be used to
	    // create a proper `origin`.
	    //
	    if (instruction[4]) {
	      url[key] = url[key].toLowerCase();
	    }
	  }
	
	  //
	  // Also parse the supplied query string in to an object. If we're supplied
	  // with a custom parser as function use that instead of the default build-in
	  // parser.
	  //
	  if (parser) url.query = parser(url.query);
	
	  //
	  // We should not add port numbers if they are already the default port number
	  // for a given protocol. As the host also contains the port number we're going
	  // override it with the hostname which contains no port number.
	  //
	  if (!required(url.port, url.protocol)) {
	    url.host = url.hostname;
	    url.port = '';
	  }
	
	  //
	  // Parse down the `auth` for the username and password.
	  //
	  url.username = url.password = '';
	  if (url.auth) {
	    instruction = url.auth.split(':');
	    url.username = instruction[0] || '';
	    url.password = instruction[1] || '';
	  }
	
	  //
	  // The href is just the compiled result.
	  //
	  url.href = url.toString();
	}
	
	/**
	 * This is convenience method for changing properties in the URL instance to
	 * insure that they all propagate correctly.
	 *
	 * @param {String} prop          Property we need to adjust.
	 * @param {Mixed} value          The newly assigned value.
	 * @param {Boolean|Function} fn  When setting the query, it will be the function used to parse
	 *                               the query.
	 *                               When setting the protocol, double slash will be removed from
	 *                               the final url if it is true.
	 * @returns {URL}
	 * @api public
	 */
	URL.prototype.set = function set(part, value, fn) {
	  var url = this;
	
	  if ('query' === part) {
	    if ('string' === typeof value && value.length) {
	      value = (fn || qs.parse)(value);
	    }
	
	    url[part] = value;
	  } else if ('port' === part) {
	    url[part] = value;
	
	    if (!required(value, url.protocol)) {
	      url.host = url.hostname;
	      url[part] = '';
	    } else if (value) {
	      url.host = url.hostname +':'+ value;
	    }
	  } else if ('hostname' === part) {
	    url[part] = value;
	
	    if (url.port) value += ':'+ url.port;
	    url.host = value;
	  } else if ('host' === part) {
	    url[part] = value;
	
	    if (/\:\d+/.test(value)) {
	      value = value.split(':');
	      url.hostname = value[0];
	      url.port = value[1];
	    }
	  } else if ('protocol' === part) {
	    url.protocol = value;
	    url.slashes = !fn;
	  } else {
	    url[part] = value;
	  }
	
	  url.href = url.toString();
	  return url;
	};
	
	/**
	 * Transform the properties back in to a valid and full URL string.
	 *
	 * @param {Function} stringify Optional query stringify function.
	 * @returns {String}
	 * @api public
	 */
	URL.prototype.toString = function toString(stringify) {
	  if (!stringify || 'function' !== typeof stringify) stringify = qs.stringify;
	
	  var query
	    , url = this
	    , protocol = url.protocol;
	
	  if (protocol && protocol.charAt(protocol.length - 1) !== ':') protocol += ':';
	
	  var result = protocol + (url.slashes ? '//' : '');
	
	  if (url.username) {
	    result += url.username;
	    if (url.password) result += ':'+ url.password;
	    result += '@';
	  }
	
	  result += url.hostname;
	  if (url.port) result += ':'+ url.port;
	
	  result += url.pathname;
	
	  query = 'object' === typeof url.query ? stringify(url.query) : url.query;
	  if (query) result += '?' !== query.charAt(0) ? '?'+ query : query;
	
	  if (url.hash) result += url.hash;
	
	  return result;
	};
	
	//
	// Expose the URL parser and some additional properties that might be useful for
	// others.
	//
	URL.qs = qs;
	URL.location = lolcation;
	module.exports = URL;


/***/ },
/* 257 */
/***/ function(module, exports) {

	'use strict';
	
	/**
	 * Check if we're required to add a port number.
	 *
	 * @see https://url.spec.whatwg.org/#default-port
	 * @param {Number|String} port Port number we need to check
	 * @param {String} protocol Protocol we need to check against.
	 * @returns {Boolean} Is it a default port for the given protocol
	 * @api private
	 */
	module.exports = function required(port, protocol) {
	  protocol = protocol.split(':')[0];
	  port = +port;
	
	  if (!port) return false;
	
	  switch (protocol) {
	    case 'http':
	    case 'ws':
	    return port !== 80;
	
	    case 'https':
	    case 'wss':
	    return port !== 443;
	
	    case 'ftp':
	    return port !== 21;
	
	    case 'gopher':
	    return port !== 70;
	
	    case 'file':
	    return false;
	  }
	
	  return port !== 0;
	};


/***/ },
/* 258 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {'use strict';
	
	var slashes = /^[A-Za-z][A-Za-z0-9+-.]*:\/\//;
	
	/**
	 * These properties should not be copied or inherited from. This is only needed
	 * for all non blob URL's as a blob URL does not include a hash, only the
	 * origin.
	 *
	 * @type {Object}
	 * @private
	 */
	var ignore = { hash: 1, query: 1 }
	  , URL;
	
	/**
	 * The location object differs when your code is loaded through a normal page,
	 * Worker or through a worker using a blob. And with the blobble begins the
	 * trouble as the location object will contain the URL of the blob, not the
	 * location of the page where our code is loaded in. The actual origin is
	 * encoded in the `pathname` so we can thankfully generate a good "default"
	 * location from it so we can generate proper relative URL's again.
	 *
	 * @param {Object|String} loc Optional default location object.
	 * @returns {Object} lolcation object.
	 * @api public
	 */
	module.exports = function lolcation(loc) {
	  loc = loc || global.location || {};
	  URL = URL || __webpack_require__(256);
	
	  var finaldestination = {}
	    , type = typeof loc
	    , key;
	
	  if ('blob:' === loc.protocol) {
	    finaldestination = new URL(unescape(loc.pathname), {});
	  } else if ('string' === type) {
	    finaldestination = new URL(loc, {});
	    for (key in ignore) delete finaldestination[key];
	  } else if ('object' === type) {
	    for (key in loc) {
	      if (key in ignore) continue;
	      finaldestination[key] = loc[key];
	    }
	
	    if (finaldestination.slashes === undefined) {
	      finaldestination.slashes = slashes.test(loc.href);
	    }
	  }
	
	  return finaldestination;
	};
	
	/* WEBPACK VAR INJECTION */}.call(exports, (function() { return this; }())))

/***/ },
/* 259 */
/***/ function(module, exports) {

	'use strict';
	
	var has = Object.prototype.hasOwnProperty;
	
	/**
	 * Simple query string parser.
	 *
	 * @param {String} query The query string that needs to be parsed.
	 * @returns {Object}
	 * @api public
	 */
	function querystring(query) {
	  var parser = /([^=?&]+)=([^&]*)/g
	    , result = {}
	    , part;
	
	  //
	  // Little nifty parsing hack, leverage the fact that RegExp.exec increments
	  // the lastIndex property so we can continue executing this loop until we've
	  // parsed all results.
	  //
	  for (;
	    part = parser.exec(query);
	    result[decodeURIComponent(part[1])] = decodeURIComponent(part[2])
	  );
	
	  return result;
	}
	
	/**
	 * Transform a query string to an object.
	 *
	 * @param {Object} obj Object that should be transformed.
	 * @param {String} prefix Optional prefix.
	 * @returns {String}
	 * @api public
	 */
	function querystringify(obj, prefix) {
	  prefix = prefix || '';
	
	  var pairs = [];
	
	  //
	  // Optionally prefix with a '?' if needed
	  //
	  if ('string' !== typeof prefix) prefix = '?';
	
	  for (var key in obj) {
	    if (has.call(obj, key)) {
	      pairs.push(encodeURIComponent(key) +'='+ encodeURIComponent(obj[key]));
	    }
	  }
	
	  return pairs.length ? prefix + pairs.join('&') : '';
	}
	
	//
	// Expose the module.
	//
	exports.stringify = querystringify;
	exports.parse = querystring;


/***/ },
/* 260 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(61);

/***/ },
/* 261 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(100);

/***/ },
/* 262 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(263);
	__webpack_require__(267);
	const Component_1 = __webpack_require__(12);
	const Editor_1 = __webpack_require__(269);
	const Login_1 = __webpack_require__(309);
	const ProjectChooser_1 = __webpack_require__(312);
	const StatusBar_1 = __webpack_require__(315);
	const StatusDetail_1 = __webpack_require__(324);
	const User_1 = __webpack_require__(327);
	const route = (r) => {
	    switch (r) {
	        case 'login': return Component_1.Component.createElement(Login_1.Login, {key: 'Login'});
	        case 'home': // continue
	        case 'projects': return Component_1.Component.createElement(ProjectChooser_1.ProjectChooser, {key: 'ProjectChooser'});
	        case 'project': return Component_1.Component.createElement(Editor_1.Editor, null);
	        case 'user': return Component_1.Component.createElement(User_1.User, null);
	        default: return Component_1.Component.createElement("div", null);
	    }
	};
	exports.App = Component_1.Component({ route: ['$route']
	}, ({ state }) => {
	    return Component_1.Component.createElement("div", {class: 'App'}, 
	        Component_1.Component.createElement("div", {class: 'wrap'}, route(state.route)), 
	        Component_1.Component.createElement(StatusBar_1.StatusBar, {key: 'StatusBar'}), 
	        Component_1.Component.createElement(StatusDetail_1.StatusDetail, {key: 'StatusDetail'}));
	});


/***/ },
/* 263 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(264);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../node_modules/css-loader/index.js!./../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 264 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "@keyframes blinker {\n  50% {\n    opacity: 0.0; } }\n\n@keyframes pulse {\n  from {\n    stroke: black;\n    fill: white;\n    transform: translateY(0px); }\n  to {\n    stroke: white;\n    fill: transparent;\n    transform: translateY(-3px); } }\n\n@keyframes detached {\n  0% {\n    stroke: black; }\n  50% {\n    stroke: black; }\n  100% {\n    stroke: #c80000; } }\n\n@keyframes ghost {\n  to {\n    stroke-dashoffset: 10; } }\n\n.blink {\n  animation: blinker 1s linear infinite; }\n\n.pulse {\n  animation: pulse 0.4s infinite alternate; }\n\n._detachedFx {\n  animation: detached 0.8s infinite alternate; }\n\nh1, h2, h3, p, .name, .fa {\n  font-size: 1em;\n  font-weight: normal;\n  line-height: 1.2em;\n  padding: 4px;\n  margin: 4px 0; }\n\n.fa {\n  margin: 0;\n  padding-right: 8px;\n  color: #333333;\n  transition: background-color 0.3s;\n  border-radius: 4px;\n  cursor: pointer; }\n  .fa:hover {\n    background: #151414; }\n\np {\n  margin: 0; }\n\n.EditableText {\n  cursor: text;\n  background-color: transparent;\n  border-bottom: 1px dashed #fff;\n  border-bottom-color: rgba(204, 204, 204, 0);\n  transition: border-bottom-color 0.8s, background-color 0.3s, color 0.3s; }\n  .EditableText input.fld {\n    border: none;\n    padding: 4px;\n    font: inherit;\n    background-color: transparent;\n    border-radius: 0;\n    width: 100%;\n    outline: none; }\n  .EditableText.active {\n    padding: 0;\n    background-color: #bd9368; }\n  .EditableText.saving {\n    color: white; }\n  .EditableText:hover {\n    border-bottom-color: rgba(26, 26, 26, 0.4); }\n\n._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list, .console {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p, .console p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect, .li {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\nhtml,\nbody,\nul,\nol {\n  margin: 0;\n  padding: 0;\n  list-style-type: none; }\n\nle-test div {\n  border: 1px solid grey;\n  padding: 4px;\n  background: #999;\n  margin: 4px; }\n\nle-test .container div {\n  background: #944; }\n\nhtml, body, #app {\n  margin: 0;\n  height: 100%; }\n\n.App {\n  display: flex;\n  flex-direction: column; }\n  .App > .wrap {\n    flex-grow: 1;\n    display: flex;\n    flex-direction: column; }\n\na {\n  text-decoration: none;\n  color: inherit;\n  display: block; }\n\nbody {\n  font-family: \"Avenir Next\", \"Segoe ui\", \"Muli\", Helvetica, sans-serif;\n  font-size: 10pt;\n  background: #3d3838;\n  color: #000;\n  cursor: default; }\n\n.fld {\n  background: #807575;\n  border: none;\n  border-radius: 4px;\n  padding: 4px;\n  font: inherit; }\n\n._search, .search {\n  background: #4b4444;\n  padding: 4px;\n  border: 1px solid #353131;\n  position: relative; }\n  ._search p input, .search p input {\n    position: absolute;\n    top: 4px;\n    left: 4px;\n    width: 132px; }\n\n._saved, .search .saved {\n  padding: 4px; }\n  ._saved li, .search .saved li {\n    background: #585151;\n    display: inline-block;\n    border-radius: 4px;\n    border: 1px solid #353131;\n    margin: 2px;\n    text-align: center;\n    width: 1.4em; }\n    ._saved li.sel, .search .saved li.sel {\n      background: #71583e;\n      color: #000; }\n\n.li {\n  cursor: pointer;\n  color: #141414;\n  padding: 4px;\n  background: #585151;\n  border-bottom: 1px solid #353131; }\n  .li.drag {\n    padding: 0; }\n    .li.drag span {\n      padding: 4px; }\n      .li.drag span:before {\n        color: #222;\n        content: \":: \"; }\n  .li span {\n    display: block; }\n  .li.sel {\n    background: #71583e;\n    color: #000; }\n  .li.add {\n    background: none;\n    color: #585151;\n    border-bottom: none;\n    text-align: center;\n    font-weight: bold;\n    transition: background 0.5s, color 0.5s; }\n    .li.add:hover {\n      background: #585151;\n      color: #000; }\n\n._button, .refresh {\n  cursor: pointer; }\n\n.dragged {\n  opacity: 0.8;\n  border-width: 2px;\n  border-radius: 4px; }\n\n._drop .drag-enter {\n  background: #71583e;\n  color: #000;\n  cursor: copy; }\n\n.search {\n  border-right: 0; }\n\n.console {\n  border-right: 0;\n  position: relative; }\n  .console p input {\n    position: absolute;\n    top: 4px;\n    right: 4px;\n    width: 50%; }\n", ""]);
	
	// exports


/***/ },
/* 265 */
/***/ function(module, exports) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	// css base code, injected by the css-loader
	module.exports = function() {
		var list = [];
	
		// return the list of modules as css string
		list.toString = function toString() {
			var result = [];
			for(var i = 0; i < this.length; i++) {
				var item = this[i];
				if(item[2]) {
					result.push("@media " + item[2] + "{" + item[1] + "}");
				} else {
					result.push(item[1]);
				}
			}
			return result.join("");
		};
	
		// import a list of modules into the list
		list.i = function(modules, mediaQuery) {
			if(typeof modules === "string")
				modules = [[null, modules, ""]];
			var alreadyImportedModules = {};
			for(var i = 0; i < this.length; i++) {
				var id = this[i][0];
				if(typeof id === "number")
					alreadyImportedModules[id] = true;
			}
			for(i = 0; i < modules.length; i++) {
				var item = modules[i];
				// skip already imported module
				// this implementation is not 100% perfect for weird media query combinations
				//  when a module is imported multiple times with different media queries.
				//  I hope this will never occur (Hey this way we have smaller bundles)
				if(typeof item[0] !== "number" || !alreadyImportedModules[item[0]]) {
					if(mediaQuery && !item[2]) {
						item[2] = mediaQuery;
					} else if(mediaQuery) {
						item[2] = "(" + item[2] + ") and (" + mediaQuery + ")";
					}
					list.push(item);
				}
			}
		};
		return list;
	};


/***/ },
/* 266 */
/***/ function(module, exports, __webpack_require__) {

	/*
		MIT License http://www.opensource.org/licenses/mit-license.php
		Author Tobias Koppers @sokra
	*/
	var stylesInDom = {},
		memoize = function(fn) {
			var memo;
			return function () {
				if (typeof memo === "undefined") memo = fn.apply(this, arguments);
				return memo;
			};
		},
		isOldIE = memoize(function() {
			return /msie [6-9]\b/.test(window.navigator.userAgent.toLowerCase());
		}),
		getHeadElement = memoize(function () {
			return document.head || document.getElementsByTagName("head")[0];
		}),
		singletonElement = null,
		singletonCounter = 0,
		styleElementsInsertedAtTop = [];
	
	module.exports = function(list, options) {
		if(false) {
			if(typeof document !== "object") throw new Error("The style-loader cannot be used in a non-browser environment");
		}
	
		options = options || {};
		// Force single-tag solution on IE6-9, which has a hard limit on the # of <style>
		// tags it will allow on a page
		if (typeof options.singleton === "undefined") options.singleton = isOldIE();
	
		// By default, add <style> tags to the bottom of <head>.
		if (typeof options.insertAt === "undefined") options.insertAt = "bottom";
	
		var styles = listToStyles(list);
		addStylesToDom(styles, options);
	
		return function update(newList) {
			var mayRemove = [];
			for(var i = 0; i < styles.length; i++) {
				var item = styles[i];
				var domStyle = stylesInDom[item.id];
				domStyle.refs--;
				mayRemove.push(domStyle);
			}
			if(newList) {
				var newStyles = listToStyles(newList);
				addStylesToDom(newStyles, options);
			}
			for(var i = 0; i < mayRemove.length; i++) {
				var domStyle = mayRemove[i];
				if(domStyle.refs === 0) {
					for(var j = 0; j < domStyle.parts.length; j++)
						domStyle.parts[j]();
					delete stylesInDom[domStyle.id];
				}
			}
		};
	}
	
	function addStylesToDom(styles, options) {
		for(var i = 0; i < styles.length; i++) {
			var item = styles[i];
			var domStyle = stylesInDom[item.id];
			if(domStyle) {
				domStyle.refs++;
				for(var j = 0; j < domStyle.parts.length; j++) {
					domStyle.parts[j](item.parts[j]);
				}
				for(; j < item.parts.length; j++) {
					domStyle.parts.push(addStyle(item.parts[j], options));
				}
			} else {
				var parts = [];
				for(var j = 0; j < item.parts.length; j++) {
					parts.push(addStyle(item.parts[j], options));
				}
				stylesInDom[item.id] = {id: item.id, refs: 1, parts: parts};
			}
		}
	}
	
	function listToStyles(list) {
		var styles = [];
		var newStyles = {};
		for(var i = 0; i < list.length; i++) {
			var item = list[i];
			var id = item[0];
			var css = item[1];
			var media = item[2];
			var sourceMap = item[3];
			var part = {css: css, media: media, sourceMap: sourceMap};
			if(!newStyles[id])
				styles.push(newStyles[id] = {id: id, parts: [part]});
			else
				newStyles[id].parts.push(part);
		}
		return styles;
	}
	
	function insertStyleElement(options, styleElement) {
		var head = getHeadElement();
		var lastStyleElementInsertedAtTop = styleElementsInsertedAtTop[styleElementsInsertedAtTop.length - 1];
		if (options.insertAt === "top") {
			if(!lastStyleElementInsertedAtTop) {
				head.insertBefore(styleElement, head.firstChild);
			} else if(lastStyleElementInsertedAtTop.nextSibling) {
				head.insertBefore(styleElement, lastStyleElementInsertedAtTop.nextSibling);
			} else {
				head.appendChild(styleElement);
			}
			styleElementsInsertedAtTop.push(styleElement);
		} else if (options.insertAt === "bottom") {
			head.appendChild(styleElement);
		} else {
			throw new Error("Invalid value for parameter 'insertAt'. Must be 'top' or 'bottom'.");
		}
	}
	
	function removeStyleElement(styleElement) {
		styleElement.parentNode.removeChild(styleElement);
		var idx = styleElementsInsertedAtTop.indexOf(styleElement);
		if(idx >= 0) {
			styleElementsInsertedAtTop.splice(idx, 1);
		}
	}
	
	function createStyleElement(options) {
		var styleElement = document.createElement("style");
		styleElement.type = "text/css";
		insertStyleElement(options, styleElement);
		return styleElement;
	}
	
	function createLinkElement(options) {
		var linkElement = document.createElement("link");
		linkElement.rel = "stylesheet";
		insertStyleElement(options, linkElement);
		return linkElement;
	}
	
	function addStyle(obj, options) {
		var styleElement, update, remove;
	
		if (options.singleton) {
			var styleIndex = singletonCounter++;
			styleElement = singletonElement || (singletonElement = createStyleElement(options));
			update = applyToSingletonTag.bind(null, styleElement, styleIndex, false);
			remove = applyToSingletonTag.bind(null, styleElement, styleIndex, true);
		} else if(obj.sourceMap &&
			typeof URL === "function" &&
			typeof URL.createObjectURL === "function" &&
			typeof URL.revokeObjectURL === "function" &&
			typeof Blob === "function" &&
			typeof btoa === "function") {
			styleElement = createLinkElement(options);
			update = updateLink.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
				if(styleElement.href)
					URL.revokeObjectURL(styleElement.href);
			};
		} else {
			styleElement = createStyleElement(options);
			update = applyToTag.bind(null, styleElement);
			remove = function() {
				removeStyleElement(styleElement);
			};
		}
	
		update(obj);
	
		return function updateStyle(newObj) {
			if(newObj) {
				if(newObj.css === obj.css && newObj.media === obj.media && newObj.sourceMap === obj.sourceMap)
					return;
				update(obj = newObj);
			} else {
				remove();
			}
		};
	}
	
	var replaceText = (function () {
		var textStore = [];
	
		return function (index, replacement) {
			textStore[index] = replacement;
			return textStore.filter(Boolean).join('\n');
		};
	})();
	
	function applyToSingletonTag(styleElement, index, remove, obj) {
		var css = remove ? "" : obj.css;
	
		if (styleElement.styleSheet) {
			styleElement.styleSheet.cssText = replaceText(index, css);
		} else {
			var cssNode = document.createTextNode(css);
			var childNodes = styleElement.childNodes;
			if (childNodes[index]) styleElement.removeChild(childNodes[index]);
			if (childNodes.length) {
				styleElement.insertBefore(cssNode, childNodes[index]);
			} else {
				styleElement.appendChild(cssNode);
			}
		}
	}
	
	function applyToTag(styleElement, obj) {
		var css = obj.css;
		var media = obj.media;
	
		if(media) {
			styleElement.setAttribute("media", media)
		}
	
		if(styleElement.styleSheet) {
			styleElement.styleSheet.cssText = css;
		} else {
			while(styleElement.firstChild) {
				styleElement.removeChild(styleElement.firstChild);
			}
			styleElement.appendChild(document.createTextNode(css));
		}
	}
	
	function updateLink(linkElement, obj) {
		var css = obj.css;
		var sourceMap = obj.sourceMap;
	
		if(sourceMap) {
			// http://stackoverflow.com/a/26603875
			css += "\n/*# sourceMappingURL=data:application/json;base64," + btoa(unescape(encodeURIComponent(JSON.stringify(sourceMap)))) + " */";
		}
	
		var blob = new Blob([css], { type: "text/css" });
	
		var oldSrc = linkElement.href;
	
		linkElement.href = URL.createObjectURL(blob);
	
		if(oldSrc)
			URL.revokeObjectURL(oldSrc);
	}


/***/ },
/* 267 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(268);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 268 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.Workbench {\n  background: #3d3838;\n  width: 100%;\n  flex-grow: 1;\n  display: flex;\n  flex-direction: column; }\n  .Workbench > .stretch {\n    flex-grow: 1;\n    display: flex;\n    position: relative; }\n  .Workbench .Pane {\n    overflow: hidden;\n    position: absolute;\n    left: 0;\n    margin-left: -1px;\n    width: 0px;\n    transition: width 0.1s;\n    border-bottom-right-radius: 4px; }\n    .Workbench .Pane.active {\n      width: 140px; }\n    .Workbench .Pane .wrap {\n      background: #383333;\n      box-shadow: inset 0 0 10px #232020;\n      padding: 4px; }\n", ""]);
	
	// exports


/***/ },
/* 269 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(270);
	const Block_1 = __webpack_require__(272);
	const Component_1 = __webpack_require__(12);
	const Drag_1 = __webpack_require__(284);
	const Library_1 = __webpack_require__(293);
	const Factory_1 = __webpack_require__(10);
	const Playback_1 = __webpack_require__(296);
	const Project_1 = __webpack_require__(300);
	const ProjectPane_1 = __webpack_require__(303);
	const Scene_1 = __webpack_require__(306);
	// import { ToolsPane } from './ToolsPane'
	exports.Editor = Component_1.Component({}, () => (Component_1.Component.createElement("div", {class: 'Editor'}, 
	    Component_1.Component.createElement(Factory_1.Modal, {key: 'Modal'}), 
	    Component_1.Component.createElement("div", {class: 'Workbench'}, 
	        Component_1.Component.createElement(Playback_1.Playback, {key: 'playback'}), 
	        Component_1.Component.createElement("div", {class: 'stretch'}, 
	            Component_1.Component.createElement(Project_1.Project, {key: 'Project'}), 
	            Component_1.Component.createElement(Scene_1.Scene, {key: 'Scene'}), 
	            Component_1.Component.createElement(Block_1.Block, {key: 'Block'}))), 
	    Component_1.Component.createElement(Library_1.Library, {key: 'Library'}), 
	    Component_1.Component.createElement(ProjectPane_1.ProjectPane, {key: 'ProjectPane'}), 
	    Component_1.Component.createElement(Drag_1.Drag, {key: 'Drag'}))));


/***/ },
/* 270 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(271);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 271 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, ".Editor {\n  flex-grow: 1;\n  display: flex;\n  flex-direction: column; }\n", ""]);
	
	// exports


/***/ },
/* 272 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(273);
	const Component_1 = __webpack_require__(12);
	const CodeEditor_1 = __webpack_require__(275);
	const Factory_1 = __webpack_require__(10);
	// import { Graph } from '../Graph'
	const BlockName = Factory_1.editable(['block', 'name']);
	exports.Block = Component_1.Component({ block: ['block'],
	    blockId: ['$blockId'],
	    editing: BlockName.path
	}, ({ state, signals }) => {
	    const klass = { Block: true, hidden: !state.block };
	    return Component_1.Component.createElement("div", {class: klass}, 
	        Component_1.Component.createElement("div", {class: 'bar tabs'}, 
	            Component_1.Component.createElement("div", {class: 'stretch'}, 
	                Component_1.Component.createElement("div", {class: 'fa fa-cube'}), 
	                Component_1.Component.createElement(BlockName, {class: 'name'})), 
	            Component_1.Component.createElement("div", {class: 'tab sel'}, 
	                Component_1.Component.createElement("div", {class: 'fa fa-file-text'}), 
	                "index.js"), 
	            Component_1.Component.createElement("div", {class: 'tab'}, 
	                Component_1.Component.createElement("div", {class: 'fa fa-file-text'}), 
	                "frag.glsl"), 
	            Component_1.Component.createElement("div", {class: 'tab'}, 
	                Component_1.Component.createElement("div", {class: 'fa fa-sliders'}), 
	                "Control")), 
	        Component_1.Component.createElement(CodeEditor_1.CodeEditor, {key: 'CodeEditor', block: state.block || {}}));
	});


/***/ },
/* 273 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(274);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 274 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.Block {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 460px;\n  background: #232020;\n  border-top-left-radius: 4px; }\n  .Block .bar {\n    border-top-left-radius: 4px; }\n  .Block .CodeMirror {\n    height: 306px; }\n  .Block.hidden {\n    visibility: hidden; }\n", ""]);
	
	// exports


/***/ },
/* 275 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(276);
	const Component_1 = __webpack_require__(12);
	const CodeMirror = __webpack_require__(278);
	// JS mode
	__webpack_require__(279);
	// CSS
	__webpack_require__(280);
	__webpack_require__(282);
	// UGLY UI state...
	let code = null;
	let source;
	const FOOCODE = "// This is a comment\n\nexport const render =\n( a, b ) => {\n  // ... do something\n  return { text: '' }\n}";
	exports.CodeEditor = Component_1.Component({}, ({ props, signals }) => {
	    const block = props.block;
	    const create = (_, { elm }) => {
	        if (code === null) {
	            code = false;
	            setTimeout(() => {
	                code = CodeMirror(elm, { value: block.source || '',
	                    lineNumbers: true,
	                    theme: 'bespin',
	                    mode: 'javascript'
	                });
	                code.on('blur', () => {
	                    signals.block.source({ value: code.getValue() });
	                });
	            }, 100);
	        }
	    };
	    if (source !== block.source && code) {
	        source = block.source;
	        code.setValue(block.source || '');
	    }
	    return Component_1.Component.createElement("div", {class: 'CodeEditor'}, 
	        Component_1.Component.createElement("div", {"hook-create": create})
	    );
	});


/***/ },
/* 276 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(277);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 277 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n", ""]);
	
	// exports


/***/ },
/* 278 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(139);

/***/ },
/* 279 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	
	// TODO actually recognize syntax of TypeScript constructs
	
	(function(mod) {
	  if (true) // CommonJS
	    mod(__webpack_require__(278));
	  else if (typeof define == "function" && define.amd) // AMD
	    define(["../../lib/codemirror"], mod);
	  else // Plain browser env
	    mod(CodeMirror);
	})(function(CodeMirror) {
	"use strict";
	
	function expressionAllowed(stream, state, backUp) {
	  return /^(?:operator|sof|keyword c|case|new|[\[{}\(,;:]|=>)$/.test(state.lastType) ||
	    (state.lastType == "quasi" && /\{\s*$/.test(stream.string.slice(0, stream.pos - (backUp || 0))))
	}
	
	CodeMirror.defineMode("javascript", function(config, parserConfig) {
	  var indentUnit = config.indentUnit;
	  var statementIndent = parserConfig.statementIndent;
	  var jsonldMode = parserConfig.jsonld;
	  var jsonMode = parserConfig.json || jsonldMode;
	  var isTS = parserConfig.typescript;
	  var wordRE = parserConfig.wordCharacters || /[\w$\xa1-\uffff]/;
	
	  // Tokenizer
	
	  var keywords = function(){
	    function kw(type) {return {type: type, style: "keyword"};}
	    var A = kw("keyword a"), B = kw("keyword b"), C = kw("keyword c");
	    var operator = kw("operator"), atom = {type: "atom", style: "atom"};
	
	    var jsKeywords = {
	      "if": kw("if"), "while": A, "with": A, "else": B, "do": B, "try": B, "finally": B,
	      "return": C, "break": C, "continue": C, "new": kw("new"), "delete": C, "throw": C, "debugger": C,
	      "var": kw("var"), "const": kw("var"), "let": kw("var"),
	      "function": kw("function"), "catch": kw("catch"),
	      "for": kw("for"), "switch": kw("switch"), "case": kw("case"), "default": kw("default"),
	      "in": operator, "typeof": operator, "instanceof": operator,
	      "true": atom, "false": atom, "null": atom, "undefined": atom, "NaN": atom, "Infinity": atom,
	      "this": kw("this"), "class": kw("class"), "super": kw("atom"),
	      "yield": C, "export": kw("export"), "import": kw("import"), "extends": C,
	      "await": C, "async": kw("async")
	    };
	
	    // Extend the 'normal' keywords with the TypeScript language extensions
	    if (isTS) {
	      var type = {type: "variable", style: "variable-3"};
	      var tsKeywords = {
	        // object-like things
	        "interface": kw("class"),
	        "implements": C,
	        "namespace": C,
	        "module": kw("module"),
	        "enum": kw("module"),
	
	        // scope modifiers
	        "public": kw("modifier"),
	        "private": kw("modifier"),
	        "protected": kw("modifier"),
	        "abstract": kw("modifier"),
	
	        // operators
	        "as": operator,
	
	        // types
	        "string": type, "number": type, "boolean": type, "any": type
	      };
	
	      for (var attr in tsKeywords) {
	        jsKeywords[attr] = tsKeywords[attr];
	      }
	    }
	
	    return jsKeywords;
	  }();
	
	  var isOperatorChar = /[+\-*&%=<>!?|~^]/;
	  var isJsonldKeyword = /^@(context|id|value|language|type|container|list|set|reverse|index|base|vocab|graph)"/;
	
	  function readRegexp(stream) {
	    var escaped = false, next, inSet = false;
	    while ((next = stream.next()) != null) {
	      if (!escaped) {
	        if (next == "/" && !inSet) return;
	        if (next == "[") inSet = true;
	        else if (inSet && next == "]") inSet = false;
	      }
	      escaped = !escaped && next == "\\";
	    }
	  }
	
	  // Used as scratch variables to communicate multiple values without
	  // consing up tons of objects.
	  var type, content;
	  function ret(tp, style, cont) {
	    type = tp; content = cont;
	    return style;
	  }
	  function tokenBase(stream, state) {
	    var ch = stream.next();
	    if (ch == '"' || ch == "'") {
	      state.tokenize = tokenString(ch);
	      return state.tokenize(stream, state);
	    } else if (ch == "." && stream.match(/^\d+(?:[eE][+\-]?\d+)?/)) {
	      return ret("number", "number");
	    } else if (ch == "." && stream.match("..")) {
	      return ret("spread", "meta");
	    } else if (/[\[\]{}\(\),;\:\.]/.test(ch)) {
	      return ret(ch);
	    } else if (ch == "=" && stream.eat(">")) {
	      return ret("=>", "operator");
	    } else if (ch == "0" && stream.eat(/x/i)) {
	      stream.eatWhile(/[\da-f]/i);
	      return ret("number", "number");
	    } else if (ch == "0" && stream.eat(/o/i)) {
	      stream.eatWhile(/[0-7]/i);
	      return ret("number", "number");
	    } else if (ch == "0" && stream.eat(/b/i)) {
	      stream.eatWhile(/[01]/i);
	      return ret("number", "number");
	    } else if (/\d/.test(ch)) {
	      stream.match(/^\d*(?:\.\d*)?(?:[eE][+\-]?\d+)?/);
	      return ret("number", "number");
	    } else if (ch == "/") {
	      if (stream.eat("*")) {
	        state.tokenize = tokenComment;
	        return tokenComment(stream, state);
	      } else if (stream.eat("/")) {
	        stream.skipToEnd();
	        return ret("comment", "comment");
	      } else if (expressionAllowed(stream, state, 1)) {
	        readRegexp(stream);
	        stream.match(/^\b(([gimyu])(?![gimyu]*\2))+\b/);
	        return ret("regexp", "string-2");
	      } else {
	        stream.eatWhile(isOperatorChar);
	        return ret("operator", "operator", stream.current());
	      }
	    } else if (ch == "`") {
	      state.tokenize = tokenQuasi;
	      return tokenQuasi(stream, state);
	    } else if (ch == "#") {
	      stream.skipToEnd();
	      return ret("error", "error");
	    } else if (isOperatorChar.test(ch)) {
	      stream.eatWhile(isOperatorChar);
	      return ret("operator", "operator", stream.current());
	    } else if (wordRE.test(ch)) {
	      stream.eatWhile(wordRE);
	      var word = stream.current(), known = keywords.propertyIsEnumerable(word) && keywords[word];
	      return (known && state.lastType != ".") ? ret(known.type, known.style, word) :
	                     ret("variable", "variable", word);
	    }
	  }
	
	  function tokenString(quote) {
	    return function(stream, state) {
	      var escaped = false, next;
	      if (jsonldMode && stream.peek() == "@" && stream.match(isJsonldKeyword)){
	        state.tokenize = tokenBase;
	        return ret("jsonld-keyword", "meta");
	      }
	      while ((next = stream.next()) != null) {
	        if (next == quote && !escaped) break;
	        escaped = !escaped && next == "\\";
	      }
	      if (!escaped) state.tokenize = tokenBase;
	      return ret("string", "string");
	    };
	  }
	
	  function tokenComment(stream, state) {
	    var maybeEnd = false, ch;
	    while (ch = stream.next()) {
	      if (ch == "/" && maybeEnd) {
	        state.tokenize = tokenBase;
	        break;
	      }
	      maybeEnd = (ch == "*");
	    }
	    return ret("comment", "comment");
	  }
	
	  function tokenQuasi(stream, state) {
	    var escaped = false, next;
	    while ((next = stream.next()) != null) {
	      if (!escaped && (next == "`" || next == "$" && stream.eat("{"))) {
	        state.tokenize = tokenBase;
	        break;
	      }
	      escaped = !escaped && next == "\\";
	    }
	    return ret("quasi", "string-2", stream.current());
	  }
	
	  var brackets = "([{}])";
	  // This is a crude lookahead trick to try and notice that we're
	  // parsing the argument patterns for a fat-arrow function before we
	  // actually hit the arrow token. It only works if the arrow is on
	  // the same line as the arguments and there's no strange noise
	  // (comments) in between. Fallback is to only notice when we hit the
	  // arrow, and not declare the arguments as locals for the arrow
	  // body.
	  function findFatArrow(stream, state) {
	    if (state.fatArrowAt) state.fatArrowAt = null;
	    var arrow = stream.string.indexOf("=>", stream.start);
	    if (arrow < 0) return;
	
	    var depth = 0, sawSomething = false;
	    for (var pos = arrow - 1; pos >= 0; --pos) {
	      var ch = stream.string.charAt(pos);
	      var bracket = brackets.indexOf(ch);
	      if (bracket >= 0 && bracket < 3) {
	        if (!depth) { ++pos; break; }
	        if (--depth == 0) break;
	      } else if (bracket >= 3 && bracket < 6) {
	        ++depth;
	      } else if (wordRE.test(ch)) {
	        sawSomething = true;
	      } else if (/["'\/]/.test(ch)) {
	        return;
	      } else if (sawSomething && !depth) {
	        ++pos;
	        break;
	      }
	    }
	    if (sawSomething && !depth) state.fatArrowAt = pos;
	  }
	
	  // Parser
	
	  var atomicTypes = {"atom": true, "number": true, "variable": true, "string": true, "regexp": true, "this": true, "jsonld-keyword": true};
	
	  function JSLexical(indented, column, type, align, prev, info) {
	    this.indented = indented;
	    this.column = column;
	    this.type = type;
	    this.prev = prev;
	    this.info = info;
	    if (align != null) this.align = align;
	  }
	
	  function inScope(state, varname) {
	    for (var v = state.localVars; v; v = v.next)
	      if (v.name == varname) return true;
	    for (var cx = state.context; cx; cx = cx.prev) {
	      for (var v = cx.vars; v; v = v.next)
	        if (v.name == varname) return true;
	    }
	  }
	
	  function parseJS(state, style, type, content, stream) {
	    var cc = state.cc;
	    // Communicate our context to the combinators.
	    // (Less wasteful than consing up a hundred closures on every call.)
	    cx.state = state; cx.stream = stream; cx.marked = null, cx.cc = cc; cx.style = style;
	
	    if (!state.lexical.hasOwnProperty("align"))
	      state.lexical.align = true;
	
	    while(true) {
	      var combinator = cc.length ? cc.pop() : jsonMode ? expression : statement;
	      if (combinator(type, content)) {
	        while(cc.length && cc[cc.length - 1].lex)
	          cc.pop()();
	        if (cx.marked) return cx.marked;
	        if (type == "variable" && inScope(state, content)) return "variable-2";
	        return style;
	      }
	    }
	  }
	
	  // Combinator utils
	
	  var cx = {state: null, column: null, marked: null, cc: null};
	  function pass() {
	    for (var i = arguments.length - 1; i >= 0; i--) cx.cc.push(arguments[i]);
	  }
	  function cont() {
	    pass.apply(null, arguments);
	    return true;
	  }
	  function register(varname) {
	    function inList(list) {
	      for (var v = list; v; v = v.next)
	        if (v.name == varname) return true;
	      return false;
	    }
	    var state = cx.state;
	    cx.marked = "def";
	    if (state.context) {
	      if (inList(state.localVars)) return;
	      state.localVars = {name: varname, next: state.localVars};
	    } else {
	      if (inList(state.globalVars)) return;
	      if (parserConfig.globalVars)
	        state.globalVars = {name: varname, next: state.globalVars};
	    }
	  }
	
	  // Combinators
	
	  var defaultVars = {name: "this", next: {name: "arguments"}};
	  function pushcontext() {
	    cx.state.context = {prev: cx.state.context, vars: cx.state.localVars};
	    cx.state.localVars = defaultVars;
	  }
	  function popcontext() {
	    cx.state.localVars = cx.state.context.vars;
	    cx.state.context = cx.state.context.prev;
	  }
	  function pushlex(type, info) {
	    var result = function() {
	      var state = cx.state, indent = state.indented;
	      if (state.lexical.type == "stat") indent = state.lexical.indented;
	      else for (var outer = state.lexical; outer && outer.type == ")" && outer.align; outer = outer.prev)
	        indent = outer.indented;
	      state.lexical = new JSLexical(indent, cx.stream.column(), type, null, state.lexical, info);
	    };
	    result.lex = true;
	    return result;
	  }
	  function poplex() {
	    var state = cx.state;
	    if (state.lexical.prev) {
	      if (state.lexical.type == ")")
	        state.indented = state.lexical.indented;
	      state.lexical = state.lexical.prev;
	    }
	  }
	  poplex.lex = true;
	
	  function expect(wanted) {
	    function exp(type) {
	      if (type == wanted) return cont();
	      else if (wanted == ";") return pass();
	      else return cont(exp);
	    };
	    return exp;
	  }
	
	  function statement(type, value) {
	    if (type == "var") return cont(pushlex("vardef", value.length), vardef, expect(";"), poplex);
	    if (type == "keyword a") return cont(pushlex("form"), expression, statement, poplex);
	    if (type == "keyword b") return cont(pushlex("form"), statement, poplex);
	    if (type == "{") return cont(pushlex("}"), block, poplex);
	    if (type == ";") return cont();
	    if (type == "if") {
	      if (cx.state.lexical.info == "else" && cx.state.cc[cx.state.cc.length - 1] == poplex)
	        cx.state.cc.pop()();
	      return cont(pushlex("form"), expression, statement, poplex, maybeelse);
	    }
	    if (type == "function") return cont(functiondef);
	    if (type == "for") return cont(pushlex("form"), forspec, statement, poplex);
	    if (type == "variable") return cont(pushlex("stat"), maybelabel);
	    if (type == "switch") return cont(pushlex("form"), expression, pushlex("}", "switch"), expect("{"),
	                                      block, poplex, poplex);
	    if (type == "case") return cont(expression, expect(":"));
	    if (type == "default") return cont(expect(":"));
	    if (type == "catch") return cont(pushlex("form"), pushcontext, expect("("), funarg, expect(")"),
	                                     statement, poplex, popcontext);
	    if (type == "class") return cont(pushlex("form"), className, poplex);
	    if (type == "export") return cont(pushlex("stat"), afterExport, poplex);
	    if (type == "import") return cont(pushlex("stat"), afterImport, poplex);
	    if (type == "module") return cont(pushlex("form"), pattern, pushlex("}"), expect("{"), block, poplex, poplex)
	    if (type == "async") return cont(statement)
	    return pass(pushlex("stat"), expression, expect(";"), poplex);
	  }
	  function expression(type) {
	    return expressionInner(type, false);
	  }
	  function expressionNoComma(type) {
	    return expressionInner(type, true);
	  }
	  function expressionInner(type, noComma) {
	    if (cx.state.fatArrowAt == cx.stream.start) {
	      var body = noComma ? arrowBodyNoComma : arrowBody;
	      if (type == "(") return cont(pushcontext, pushlex(")"), commasep(pattern, ")"), poplex, expect("=>"), body, popcontext);
	      else if (type == "variable") return pass(pushcontext, pattern, expect("=>"), body, popcontext);
	    }
	
	    var maybeop = noComma ? maybeoperatorNoComma : maybeoperatorComma;
	    if (atomicTypes.hasOwnProperty(type)) return cont(maybeop);
	    if (type == "function") return cont(functiondef, maybeop);
	    if (type == "keyword c") return cont(noComma ? maybeexpressionNoComma : maybeexpression);
	    if (type == "(") return cont(pushlex(")"), maybeexpression, comprehension, expect(")"), poplex, maybeop);
	    if (type == "operator" || type == "spread") return cont(noComma ? expressionNoComma : expression);
	    if (type == "[") return cont(pushlex("]"), arrayLiteral, poplex, maybeop);
	    if (type == "{") return contCommasep(objprop, "}", null, maybeop);
	    if (type == "quasi") return pass(quasi, maybeop);
	    if (type == "new") return cont(maybeTarget(noComma));
	    return cont();
	  }
	  function maybeexpression(type) {
	    if (type.match(/[;\}\)\],]/)) return pass();
	    return pass(expression);
	  }
	  function maybeexpressionNoComma(type) {
	    if (type.match(/[;\}\)\],]/)) return pass();
	    return pass(expressionNoComma);
	  }
	
	  function maybeoperatorComma(type, value) {
	    if (type == ",") return cont(expression);
	    return maybeoperatorNoComma(type, value, false);
	  }
	  function maybeoperatorNoComma(type, value, noComma) {
	    var me = noComma == false ? maybeoperatorComma : maybeoperatorNoComma;
	    var expr = noComma == false ? expression : expressionNoComma;
	    if (type == "=>") return cont(pushcontext, noComma ? arrowBodyNoComma : arrowBody, popcontext);
	    if (type == "operator") {
	      if (/\+\+|--/.test(value)) return cont(me);
	      if (value == "?") return cont(expression, expect(":"), expr);
	      return cont(expr);
	    }
	    if (type == "quasi") { return pass(quasi, me); }
	    if (type == ";") return;
	    if (type == "(") return contCommasep(expressionNoComma, ")", "call", me);
	    if (type == ".") return cont(property, me);
	    if (type == "[") return cont(pushlex("]"), maybeexpression, expect("]"), poplex, me);
	  }
	  function quasi(type, value) {
	    if (type != "quasi") return pass();
	    if (value.slice(value.length - 2) != "${") return cont(quasi);
	    return cont(expression, continueQuasi);
	  }
	  function continueQuasi(type) {
	    if (type == "}") {
	      cx.marked = "string-2";
	      cx.state.tokenize = tokenQuasi;
	      return cont(quasi);
	    }
	  }
	  function arrowBody(type) {
	    findFatArrow(cx.stream, cx.state);
	    return pass(type == "{" ? statement : expression);
	  }
	  function arrowBodyNoComma(type) {
	    findFatArrow(cx.stream, cx.state);
	    return pass(type == "{" ? statement : expressionNoComma);
	  }
	  function maybeTarget(noComma) {
	    return function(type) {
	      if (type == ".") return cont(noComma ? targetNoComma : target);
	      else return pass(noComma ? expressionNoComma : expression);
	    };
	  }
	  function target(_, value) {
	    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorComma); }
	  }
	  function targetNoComma(_, value) {
	    if (value == "target") { cx.marked = "keyword"; return cont(maybeoperatorNoComma); }
	  }
	  function maybelabel(type) {
	    if (type == ":") return cont(poplex, statement);
	    return pass(maybeoperatorComma, expect(";"), poplex);
	  }
	  function property(type) {
	    if (type == "variable") {cx.marked = "property"; return cont();}
	  }
	  function objprop(type, value) {
	    if (type == "variable" || cx.style == "keyword") {
	      cx.marked = "property";
	      if (value == "get" || value == "set") return cont(getterSetter);
	      return cont(afterprop);
	    } else if (type == "number" || type == "string") {
	      cx.marked = jsonldMode ? "property" : (cx.style + " property");
	      return cont(afterprop);
	    } else if (type == "jsonld-keyword") {
	      return cont(afterprop);
	    } else if (type == "modifier") {
	      return cont(objprop)
	    } else if (type == "[") {
	      return cont(expression, expect("]"), afterprop);
	    } else if (type == "spread") {
	      return cont(expression);
	    }
	  }
	  function getterSetter(type) {
	    if (type != "variable") return pass(afterprop);
	    cx.marked = "property";
	    return cont(functiondef);
	  }
	  function afterprop(type) {
	    if (type == ":") return cont(expressionNoComma);
	    if (type == "(") return pass(functiondef);
	  }
	  function commasep(what, end) {
	    function proceed(type, value) {
	      if (type == ",") {
	        var lex = cx.state.lexical;
	        if (lex.info == "call") lex.pos = (lex.pos || 0) + 1;
	        return cont(what, proceed);
	      }
	      if (type == end || value == end) return cont();
	      return cont(expect(end));
	    }
	    return function(type, value) {
	      if (type == end || value == end) return cont();
	      return pass(what, proceed);
	    };
	  }
	  function contCommasep(what, end, info) {
	    for (var i = 3; i < arguments.length; i++)
	      cx.cc.push(arguments[i]);
	    return cont(pushlex(end, info), commasep(what, end), poplex);
	  }
	  function block(type) {
	    if (type == "}") return cont();
	    return pass(statement, block);
	  }
	  function maybetype(type) {
	    if (isTS && type == ":") return cont(typeexpr);
	  }
	  function maybedefault(_, value) {
	    if (value == "=") return cont(expressionNoComma);
	  }
	  function typeexpr(type) {
	    if (type == "variable") {cx.marked = "variable-3"; return cont(afterType);}
	  }
	  function afterType(type, value) {
	    if (value == "<") return cont(commasep(typeexpr, ">"), afterType)
	    if (type == "[") return cont(expect("]"), afterType)
	  }
	  function vardef() {
	    return pass(pattern, maybetype, maybeAssign, vardefCont);
	  }
	  function pattern(type, value) {
	    if (type == "modifier") return cont(pattern)
	    if (type == "variable") { register(value); return cont(); }
	    if (type == "spread") return cont(pattern);
	    if (type == "[") return contCommasep(pattern, "]");
	    if (type == "{") return contCommasep(proppattern, "}");
	  }
	  function proppattern(type, value) {
	    if (type == "variable" && !cx.stream.match(/^\s*:/, false)) {
	      register(value);
	      return cont(maybeAssign);
	    }
	    if (type == "variable") cx.marked = "property";
	    if (type == "spread") return cont(pattern);
	    if (type == "}") return pass();
	    return cont(expect(":"), pattern, maybeAssign);
	  }
	  function maybeAssign(_type, value) {
	    if (value == "=") return cont(expressionNoComma);
	  }
	  function vardefCont(type) {
	    if (type == ",") return cont(vardef);
	  }
	  function maybeelse(type, value) {
	    if (type == "keyword b" && value == "else") return cont(pushlex("form", "else"), statement, poplex);
	  }
	  function forspec(type) {
	    if (type == "(") return cont(pushlex(")"), forspec1, expect(")"), poplex);
	  }
	  function forspec1(type) {
	    if (type == "var") return cont(vardef, expect(";"), forspec2);
	    if (type == ";") return cont(forspec2);
	    if (type == "variable") return cont(formaybeinof);
	    return pass(expression, expect(";"), forspec2);
	  }
	  function formaybeinof(_type, value) {
	    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
	    return cont(maybeoperatorComma, forspec2);
	  }
	  function forspec2(type, value) {
	    if (type == ";") return cont(forspec3);
	    if (value == "in" || value == "of") { cx.marked = "keyword"; return cont(expression); }
	    return pass(expression, expect(";"), forspec3);
	  }
	  function forspec3(type) {
	    if (type != ")") cont(expression);
	  }
	  function functiondef(type, value) {
	    if (value == "*") {cx.marked = "keyword"; return cont(functiondef);}
	    if (type == "variable") {register(value); return cont(functiondef);}
	    if (type == "(") return cont(pushcontext, pushlex(")"), commasep(funarg, ")"), poplex, maybetype, statement, popcontext);
	  }
	  function funarg(type) {
	    if (type == "spread") return cont(funarg);
	    return pass(pattern, maybetype, maybedefault);
	  }
	  function className(type, value) {
	    if (type == "variable") {register(value); return cont(classNameAfter);}
	  }
	  function classNameAfter(type, value) {
	    if (value == "extends") return cont(expression, classNameAfter);
	    if (type == "{") return cont(pushlex("}"), classBody, poplex);
	  }
	  function classBody(type, value) {
	    if (type == "variable" || cx.style == "keyword") {
	      if (value == "static") {
	        cx.marked = "keyword";
	        return cont(classBody);
	      }
	      cx.marked = "property";
	      if (value == "get" || value == "set") return cont(classGetterSetter, functiondef, classBody);
	      return cont(functiondef, classBody);
	    }
	    if (value == "*") {
	      cx.marked = "keyword";
	      return cont(classBody);
	    }
	    if (type == ";") return cont(classBody);
	    if (type == "}") return cont();
	  }
	  function classGetterSetter(type) {
	    if (type != "variable") return pass();
	    cx.marked = "property";
	    return cont();
	  }
	  function afterExport(_type, value) {
	    if (value == "*") { cx.marked = "keyword"; return cont(maybeFrom, expect(";")); }
	    if (value == "default") { cx.marked = "keyword"; return cont(expression, expect(";")); }
	    return pass(statement);
	  }
	  function afterImport(type) {
	    if (type == "string") return cont();
	    return pass(importSpec, maybeFrom);
	  }
	  function importSpec(type, value) {
	    if (type == "{") return contCommasep(importSpec, "}");
	    if (type == "variable") register(value);
	    if (value == "*") cx.marked = "keyword";
	    return cont(maybeAs);
	  }
	  function maybeAs(_type, value) {
	    if (value == "as") { cx.marked = "keyword"; return cont(importSpec); }
	  }
	  function maybeFrom(_type, value) {
	    if (value == "from") { cx.marked = "keyword"; return cont(expression); }
	  }
	  function arrayLiteral(type) {
	    if (type == "]") return cont();
	    return pass(expressionNoComma, maybeArrayComprehension);
	  }
	  function maybeArrayComprehension(type) {
	    if (type == "for") return pass(comprehension, expect("]"));
	    if (type == ",") return cont(commasep(maybeexpressionNoComma, "]"));
	    return pass(commasep(expressionNoComma, "]"));
	  }
	  function comprehension(type) {
	    if (type == "for") return cont(forspec, comprehension);
	    if (type == "if") return cont(expression, comprehension);
	  }
	
	  function isContinuedStatement(state, textAfter) {
	    return state.lastType == "operator" || state.lastType == "," ||
	      isOperatorChar.test(textAfter.charAt(0)) ||
	      /[,.]/.test(textAfter.charAt(0));
	  }
	
	  // Interface
	
	  return {
	    startState: function(basecolumn) {
	      var state = {
	        tokenize: tokenBase,
	        lastType: "sof",
	        cc: [],
	        lexical: new JSLexical((basecolumn || 0) - indentUnit, 0, "block", false),
	        localVars: parserConfig.localVars,
	        context: parserConfig.localVars && {vars: parserConfig.localVars},
	        indented: basecolumn || 0
	      };
	      if (parserConfig.globalVars && typeof parserConfig.globalVars == "object")
	        state.globalVars = parserConfig.globalVars;
	      return state;
	    },
	
	    token: function(stream, state) {
	      if (stream.sol()) {
	        if (!state.lexical.hasOwnProperty("align"))
	          state.lexical.align = false;
	        state.indented = stream.indentation();
	        findFatArrow(stream, state);
	      }
	      if (state.tokenize != tokenComment && stream.eatSpace()) return null;
	      var style = state.tokenize(stream, state);
	      if (type == "comment") return style;
	      state.lastType = type == "operator" && (content == "++" || content == "--") ? "incdec" : type;
	      return parseJS(state, style, type, content, stream);
	    },
	
	    indent: function(state, textAfter) {
	      if (state.tokenize == tokenComment) return CodeMirror.Pass;
	      if (state.tokenize != tokenBase) return 0;
	      var firstChar = textAfter && textAfter.charAt(0), lexical = state.lexical;
	      // Kludge to prevent 'maybelse' from blocking lexical scope pops
	      if (!/^\s*else\b/.test(textAfter)) for (var i = state.cc.length - 1; i >= 0; --i) {
	        var c = state.cc[i];
	        if (c == poplex) lexical = lexical.prev;
	        else if (c != maybeelse) break;
	      }
	      if (lexical.type == "stat" && firstChar == "}") lexical = lexical.prev;
	      if (statementIndent && lexical.type == ")" && lexical.prev.type == "stat")
	        lexical = lexical.prev;
	      var type = lexical.type, closing = firstChar == type;
	
	      if (type == "vardef") return lexical.indented + (state.lastType == "operator" || state.lastType == "," ? lexical.info + 1 : 0);
	      else if (type == "form" && firstChar == "{") return lexical.indented;
	      else if (type == "form") return lexical.indented + indentUnit;
	      else if (type == "stat")
	        return lexical.indented + (isContinuedStatement(state, textAfter) ? statementIndent || indentUnit : 0);
	      else if (lexical.info == "switch" && !closing && parserConfig.doubleIndentSwitch != false)
	        return lexical.indented + (/^(?:case|default)\b/.test(textAfter) ? indentUnit : 2 * indentUnit);
	      else if (lexical.align) return lexical.column + (closing ? 0 : 1);
	      else return lexical.indented + (closing ? 0 : indentUnit);
	    },
	
	    electricInput: /^\s*(?:case .*?:|default:|\{|\})$/,
	    blockCommentStart: jsonMode ? null : "/*",
	    blockCommentEnd: jsonMode ? null : "*/",
	    lineComment: jsonMode ? null : "//",
	    fold: "brace",
	    closeBrackets: "()[]{}''\"\"``",
	
	    helperType: jsonMode ? "json" : "javascript",
	    jsonldMode: jsonldMode,
	    jsonMode: jsonMode,
	
	    expressionAllowed: expressionAllowed,
	    skipExpression: function(state) {
	      var top = state.cc[state.cc.length - 1]
	      if (top == expression || top == expressionNoComma) state.cc.pop()
	    }
	  };
	});
	
	CodeMirror.registerHelper("wordChars", "javascript", /[\w$]/);
	
	CodeMirror.defineMIME("text/javascript", "javascript");
	CodeMirror.defineMIME("text/ecmascript", "javascript");
	CodeMirror.defineMIME("application/javascript", "javascript");
	CodeMirror.defineMIME("application/x-javascript", "javascript");
	CodeMirror.defineMIME("application/ecmascript", "javascript");
	CodeMirror.defineMIME("application/json", {name: "javascript", json: true});
	CodeMirror.defineMIME("application/x-json", {name: "javascript", json: true});
	CodeMirror.defineMIME("application/ld+json", {name: "javascript", jsonld: true});
	CodeMirror.defineMIME("text/typescript", { name: "javascript", typescript: true });
	CodeMirror.defineMIME("application/typescript", { name: "javascript", typescript: true });
	
	});


/***/ },
/* 280 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(281);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../css-loader/index.js!./../../sass-loader/index.js!./codemirror.css", function() {
				var newContent = require("!!./../../css-loader/index.js!./../../sass-loader/index.js!./codemirror.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 281 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "/* BASICS */\n.CodeMirror {\n  /* Set height, width, borders, and global font properties here */\n  font-family: monospace;\n  height: 300px;\n  color: black; }\n\n/* PADDING */\n.CodeMirror-lines {\n  padding: 4px 0;\n  /* Vertical padding around content */ }\n\n.CodeMirror pre {\n  padding: 0 4px;\n  /* Horizontal padding of content */ }\n\n.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  background-color: white;\n  /* The little square between H and V scrollbars */ }\n\n/* GUTTER */\n.CodeMirror-gutters {\n  border-right: 1px solid #ddd;\n  background-color: #f7f7f7;\n  white-space: nowrap; }\n\n.CodeMirror-linenumber {\n  padding: 0 3px 0 5px;\n  min-width: 20px;\n  text-align: right;\n  color: #999;\n  white-space: nowrap; }\n\n.CodeMirror-guttermarker {\n  color: black; }\n\n.CodeMirror-guttermarker-subtle {\n  color: #999; }\n\n/* CURSOR */\n.CodeMirror-cursor {\n  border-left: 1px solid black;\n  border-right: none;\n  width: 0; }\n\n/* Shown when moving in bi-directional text */\n.CodeMirror div.CodeMirror-secondarycursor {\n  border-left: 1px solid silver; }\n\n.cm-fat-cursor .CodeMirror-cursor {\n  width: auto;\n  border: 0 !important;\n  background: #7e7; }\n\n.cm-fat-cursor div.CodeMirror-cursors {\n  z-index: 1; }\n\n.cm-animate-fat-cursor {\n  width: auto;\n  border: 0;\n  -webkit-animation: blink 1.06s steps(1) infinite;\n  -moz-animation: blink 1.06s steps(1) infinite;\n  animation: blink 1.06s steps(1) infinite;\n  background-color: #7e7; }\n\n@-moz-keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n@-webkit-keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n@keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n/* Can style cursor different in overwrite (non-insert) mode */\n.cm-tab {\n  display: inline-block;\n  text-decoration: inherit; }\n\n.CodeMirror-ruler {\n  border-left: 1px solid #ccc;\n  position: absolute; }\n\n/* DEFAULT THEME */\n.cm-s-default .cm-header {\n  color: blue; }\n\n.cm-s-default .cm-quote {\n  color: #090; }\n\n.cm-negative {\n  color: #d44; }\n\n.cm-positive {\n  color: #292; }\n\n.cm-header, .cm-strong {\n  font-weight: bold; }\n\n.cm-em {\n  font-style: italic; }\n\n.cm-link {\n  text-decoration: underline; }\n\n.cm-strikethrough {\n  text-decoration: line-through; }\n\n.cm-s-default .cm-keyword {\n  color: #708; }\n\n.cm-s-default .cm-atom {\n  color: #219; }\n\n.cm-s-default .cm-number {\n  color: #164; }\n\n.cm-s-default .cm-def {\n  color: #00f; }\n\n.cm-s-default .cm-variable-2 {\n  color: #05a; }\n\n.cm-s-default .cm-variable-3 {\n  color: #085; }\n\n.cm-s-default .cm-comment {\n  color: #a50; }\n\n.cm-s-default .cm-string {\n  color: #a11; }\n\n.cm-s-default .cm-string-2 {\n  color: #f50; }\n\n.cm-s-default .cm-meta {\n  color: #555; }\n\n.cm-s-default .cm-qualifier {\n  color: #555; }\n\n.cm-s-default .cm-builtin {\n  color: #30a; }\n\n.cm-s-default .cm-bracket {\n  color: #997; }\n\n.cm-s-default .cm-tag {\n  color: #170; }\n\n.cm-s-default .cm-attribute {\n  color: #00c; }\n\n.cm-s-default .cm-hr {\n  color: #999; }\n\n.cm-s-default .cm-link {\n  color: #00c; }\n\n.cm-s-default .cm-error {\n  color: #f00; }\n\n.cm-invalidchar {\n  color: #f00; }\n\n.CodeMirror-composing {\n  border-bottom: 2px solid; }\n\n/* Default styles for common addons */\ndiv.CodeMirror span.CodeMirror-matchingbracket {\n  color: #0f0; }\n\ndiv.CodeMirror span.CodeMirror-nonmatchingbracket {\n  color: #f22; }\n\n.CodeMirror-matchingtag {\n  background: rgba(255, 150, 0, 0.3); }\n\n.CodeMirror-activeline-background {\n  background: #e8f2ff; }\n\n/* STOP */\n/* The rest of this file contains styles related to the mechanics of\n   the editor. You probably shouldn't touch them. */\n.CodeMirror {\n  position: relative;\n  overflow: hidden;\n  background: white; }\n\n.CodeMirror-scroll {\n  overflow: scroll !important;\n  /* Things will break if this is overridden */\n  /* 30px is the magic margin used to hide the element's real scrollbars */\n  /* See overflow: hidden in .CodeMirror */\n  margin-bottom: -30px;\n  margin-right: -30px;\n  padding-bottom: 30px;\n  height: 100%;\n  outline: none;\n  /* Prevent dragging from highlighting the element */\n  position: relative; }\n\n.CodeMirror-sizer {\n  position: relative;\n  border-right: 30px solid transparent; }\n\n/* The fake, visible scrollbars. Used to force redraw during scrolling\n   before actual scrolling happens, thus preventing shaking and\n   flickering artifacts. */\n.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  position: absolute;\n  z-index: 6;\n  display: none; }\n\n.CodeMirror-vscrollbar {\n  right: 0;\n  top: 0;\n  overflow-x: hidden;\n  overflow-y: scroll; }\n\n.CodeMirror-hscrollbar {\n  bottom: 0;\n  left: 0;\n  overflow-y: hidden;\n  overflow-x: scroll; }\n\n.CodeMirror-scrollbar-filler {\n  right: 0;\n  bottom: 0; }\n\n.CodeMirror-gutter-filler {\n  left: 0;\n  bottom: 0; }\n\n.CodeMirror-gutters {\n  position: absolute;\n  left: 0;\n  top: 0;\n  min-height: 100%;\n  z-index: 3; }\n\n.CodeMirror-gutter {\n  white-space: normal;\n  height: 100%;\n  display: inline-block;\n  vertical-align: top;\n  margin-bottom: -30px;\n  /* Hack to make IE7 behave */\n  *zoom: 1;\n  *display: inline; }\n\n.CodeMirror-gutter-wrapper {\n  position: absolute;\n  z-index: 4;\n  background: none !important;\n  border: none !important; }\n\n.CodeMirror-gutter-background {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 4; }\n\n.CodeMirror-gutter-elt {\n  position: absolute;\n  cursor: default;\n  z-index: 4; }\n\n.CodeMirror-gutter-wrapper {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none; }\n\n.CodeMirror-lines {\n  cursor: text;\n  min-height: 1px;\n  /* prevents collapsing before first draw */ }\n\n.CodeMirror pre {\n  /* Reset some styles that the rest of the page might have set */\n  -moz-border-radius: 0;\n  -webkit-border-radius: 0;\n  border-radius: 0;\n  border-width: 0;\n  background: transparent;\n  font-family: inherit;\n  font-size: inherit;\n  margin: 0;\n  white-space: pre;\n  word-wrap: normal;\n  line-height: inherit;\n  color: inherit;\n  z-index: 2;\n  position: relative;\n  overflow: visible;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none; }\n\n.CodeMirror-wrap pre {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  word-break: normal; }\n\n.CodeMirror-linebackground {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  z-index: 0; }\n\n.CodeMirror-linewidget {\n  position: relative;\n  z-index: 2;\n  overflow: auto; }\n\n.CodeMirror-code {\n  outline: none; }\n\n/* Force content-box sizing for the elements where we expect it */\n.CodeMirror-scroll,\n.CodeMirror-sizer,\n.CodeMirror-gutter,\n.CodeMirror-gutters,\n.CodeMirror-linenumber {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box; }\n\n.CodeMirror-measure {\n  position: absolute;\n  width: 100%;\n  height: 0;\n  overflow: hidden;\n  visibility: hidden; }\n\n.CodeMirror-cursor {\n  position: absolute; }\n\n.CodeMirror-measure pre {\n  position: static; }\n\ndiv.CodeMirror-cursors {\n  visibility: hidden;\n  position: relative;\n  z-index: 3; }\n\ndiv.CodeMirror-dragcursors {\n  visibility: visible; }\n\n.CodeMirror-focused div.CodeMirror-cursors {\n  visibility: visible; }\n\n.CodeMirror-selected {\n  background: #d9d9d9; }\n\n.CodeMirror-focused .CodeMirror-selected {\n  background: #d7d4f0; }\n\n.CodeMirror-crosshair {\n  cursor: crosshair; }\n\n.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection {\n  background: #d7d4f0; }\n\n.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection {\n  background: #d7d4f0; }\n\n.cm-searching {\n  background: #ffa;\n  background: rgba(255, 255, 0, 0.4); }\n\n/* IE7 hack to prevent it from returning funny offsetTops on the spans */\n.CodeMirror span {\n  *vertical-align: text-bottom; }\n\n/* Used to force a border model for a node */\n.cm-force-border {\n  padding-right: .1px; }\n\n@media print {\n  /* Hide the cursor when printing */\n  .CodeMirror div.CodeMirror-cursors {\n    visibility: hidden; } }\n\n/* See issue #2901 */\n.cm-tab-wrap-hack:after {\n  content: ''; }\n\n/* Help users use markselection to safely style text background */\nspan.CodeMirror-selectedtext {\n  background: none; }\n", ""]);
	
	// exports


/***/ },
/* 282 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(283);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../css-loader/index.js!./../../sass-loader/index.js!./bespin.css", function() {
				var newContent = require("!!./../../css-loader/index.js!./../../sass-loader/index.js!./bespin.css");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 283 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "/*\n\n    Name:       Bespin\n    Author:     Mozilla / Jan T. Sott\n\n    CodeMirror template by Jan T. Sott (https://github.com/idleberg/base16-codemirror)\n    Original Base16 color scheme by Chris Kempson (https://github.com/chriskempson/base16)\n\n*/\n.cm-s-bespin.CodeMirror {\n  background: #28211c;\n  color: #9d9b97; }\n\n.cm-s-bespin div.CodeMirror-selected {\n  background: #36312e !important; }\n\n.cm-s-bespin .CodeMirror-gutters {\n  background: #28211c;\n  border-right: 0px; }\n\n.cm-s-bespin .CodeMirror-linenumber {\n  color: #666666; }\n\n.cm-s-bespin .CodeMirror-cursor {\n  border-left: 1px solid #797977 !important; }\n\n.cm-s-bespin span.cm-comment {\n  color: #937121; }\n\n.cm-s-bespin span.cm-atom {\n  color: #9b859d; }\n\n.cm-s-bespin span.cm-number {\n  color: #9b859d; }\n\n.cm-s-bespin span.cm-property, .cm-s-bespin span.cm-attribute {\n  color: #54be0d; }\n\n.cm-s-bespin span.cm-keyword {\n  color: #cf6a4c; }\n\n.cm-s-bespin span.cm-string {\n  color: #f9ee98; }\n\n.cm-s-bespin span.cm-variable {\n  color: #54be0d; }\n\n.cm-s-bespin span.cm-variable-2 {\n  color: #5ea6ea; }\n\n.cm-s-bespin span.cm-def {\n  color: #cf7d34; }\n\n.cm-s-bespin span.cm-error {\n  background: #cf6a4c;\n  color: #797977; }\n\n.cm-s-bespin span.cm-bracket {\n  color: #9d9b97; }\n\n.cm-s-bespin span.cm-tag {\n  color: #cf6a4c; }\n\n.cm-s-bespin span.cm-link {\n  color: #9b859d; }\n\n.cm-s-bespin .CodeMirror-matchingbracket {\n  text-decoration: underline;\n  color: white !important; }\n\n.cm-s-bespin .CodeMirror-activeline-background {\n  background: #404040; }\n", ""]);
	
	// exports


/***/ },
/* 284 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(285);
	const Component_1 = __webpack_require__(12);
	const Graph_1 = __webpack_require__(34);
	const Graph_2 = __webpack_require__(287);
	const ARROW_POS = { x: Graph_1.defaultUILayout.RADIUS + Graph_1.defaultUILayout.SPAD + Graph_1.defaultUILayout.SLOT,
	    y: 3 * Graph_1.defaultUILayout.SLOT
	};
	exports.Drag = Component_1.Component({ drag: ['$dragdrop', 'drag'],
	    move: ['$dragdrop', 'move'],
	    drop: ['$dragdrop', 'drop']
	}, ({ state, signals }) => {
	    const drag = state.drag;
	    const move = state.move;
	    const klass = { Drag: true };
	    if (!drag || !move) {
	        return Component_1.Component.createElement("svg", {id: 'drag', class: klass});
	    }
	    if (state.drop && state.drop.ownerType !== 'library') {
	        // hide drag element
	        klass['hide'] = true;
	    }
	    const x = move.clientPos.x - ARROW_POS.x;
	    const y = move.clientPos.y - ARROW_POS.y;
	    const style = { top: y, left: x };
	    // draw Graph
	    return Component_1.Component.createElement(Graph_2.Graph, {key: 'drag.graph', class: klass, style: style, ownerType: 'drag', rootId: drag.nodeId, graph: drag.dgraph});
	});


/***/ },
/* 285 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(286);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 286 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, ".Drag {\n  position: fixed;\n  display: block;\n  opacity: 0.8;\n  z-index: 6;\n  pointer-events: none;\n  margin: 0;\n  cursor: grabbing;\n  cursor: -moz-grabbing;\n  cursor: -webkit-grabbing; }\n  .Drag.drag-hide {\n    display: none; }\n  .Drag.hide {\n    display: none; }\n  .Drag .plus, .Drag .click {\n    display: none; }\n", ""]);
	
	// exports


/***/ },
/* 287 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(288);
	const Component_1 = __webpack_require__(12);
	const Graph_1 = __webpack_require__(34);
	const Node_1 = __webpack_require__(290);
	const mapUINodes = (graph, uigraph, ownerType, blockId) => {
	    const nodesById = graph.nodesById;
	    const nodes = uigraph.nodes;
	    const uiNodeById = uigraph.uiNodeById;
	    const key = `Node-${ownerType}-`;
	    return nodes.map((n) => {
	        const uinode = uiNodeById[n];
	        const node = nodesById[n];
	        return Component_1.Component.createElement(Node_1.Node, {key: key + uinode.id, blockId: blockId, uinode: uinode, node: node, ownerType: ownerType});
	    });
	};
	exports.Graph = Component_1.Component({
	    // update graph on drag op
	    drop: ['$dragdrop', 'drop'] // react to drag op
	    ,
	    drag: ['$dragdrop', 'drag'],
	    select: ['$block']
	}, ({ props, state, signals }) => {
	    const ownerType = props.ownerType;
	    const select = state.select || {};
	    const blockId = select.ownerType === ownerType ? select.id : null;
	    let graph = props.graph;
	    const drop = state.drop;
	    const drag = state.drag;
	    const rootId = props.rootId || Graph_1.NodeHelper.rootNodeId;
	    if (graph) {
	        let nodeId;
	        let ghostId;
	        if (drop && drop.ownerType === ownerType) {
	            graph = drop.graph;
	            nodeId = drop.nodeId;
	            ghostId = drop.ghostId;
	        }
	        else if (drag && drag.ownerType === ownerType) {
	            graph = drag.rgraph;
	        }
	        const uigraph = Graph_1.uimap(graph, ghostId, nodeId);
	        const klass = Object.assign({ Graph: true }, props.class);
	        const style = props.style || {};
	        return Component_1.Component.createElement("svg", {class: klass, style: style, "on-click": () => signals.block.select({ id: '', ownerType: '' })}, mapUINodes(graph, uigraph, ownerType, blockId));
	    }
	    else {
	        return '';
	    }
	});


/***/ },
/* 288 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(289);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 289 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.Graph {\n  margin-left: 16px;\n  flex-grow: 1;\n  width: 100%;\n  height: 100%; }\n", ""]);
	
	// exports


/***/ },
/* 290 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(291);
	const Component_1 = __webpack_require__(12);
	const DragDrop_1 = __webpack_require__(123);
	const makeSlot = (slot, datainfo, clbk) => {
	    const flags = slot.flags;
	    const { x, y } = slot.pos;
	    const klass = Object.assign({}, flags, { slot: true });
	    const slotinfo = `${datainfo}-${slot.idx}`;
	    const transform = `translate(${x}, ${y})`;
	    if (flags.free) {
	        return Component_1.Component.createElement("g", {transform: transform}, 
	            Component_1.Component.createElement("path", {d: slot.plus, class: 'plus'}), 
	            Component_1.Component.createElement("path", {d: slot.click, "data-drop": slotinfo, "on-click": (e) => clbk(e, slot.idx), class: 'click'}));
	    }
	    else if (!flags.detached) {
	        // do not draw slot
	        return '';
	    }
	    else {
	        return Component_1.Component.createElement("g", {transform: transform}, 
	            Component_1.Component.createElement("path", {d: slot.path, class: klass})
	        );
	    }
	};
	exports.Node = Component_1.Component({ blockId: ['user', 'blockId'],
	    move: ['$dragdrop', 'move'] // react to drag op
	}, ({ state, props, signals }) => {
	    const uinode = props.uinode;
	    const node = props.node;
	    const ownerType = props.ownerType;
	    const x = uinode.pos.x;
	    const y = uinode.pos.y;
	    const transform = `translate(${x},${y})`;
	    let datainfo = `${ownerType}-${uinode.id}`;
	    if (uinode.isghost) {
	        if (uinode.isghost === node.id) {
	            // hovering on main element: do nothing
	            datainfo = `${ownerType}-drop`;
	        }
	        else {
	            // force change of drop layout
	            datainfo = ``;
	        }
	    }
	    const klass = { sel: node.blockId === props.blockId,
	        [uinode.className]: true,
	        ghost: uinode.isghost
	    };
	    const { click, mousedown, mousemove, mouseup } = DragDrop_1.DragDropHelper.drag(signals, (nodePos) => {
	        // start drag
	        signals.$dragdrop.drag({ drag: { ownerType,
	                nodeId: node.id,
	                nodePos
	            }
	        });
	    }, (e) => {
	        // normal click
	        signals.block.select({ id: node.blockId, ownerType });
	    });
	    const slotclick = (e, pos) => {
	        e.stopPropagation();
	        signals.block.add({ pos,
	            parentId: uinode.id,
	            ownerType
	        });
	    };
	    return Component_1.Component.createElement("g", {transform: transform}, 
	        Component_1.Component.createElement("path", {d: uinode.path, class: klass, "data-drop": datainfo, "on-mousedown": mousedown, "on-mouseup": mouseup, "on-mousemove": mousemove, "on-click": click}), 
	        Component_1.Component.createElement("text", {x: uinode.size.tx, y: uinode.size.ty}, uinode.name), 
	        uinode.slots.map((s) => makeSlot(s, datainfo, slotclick)));
	});


/***/ },
/* 291 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(292);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 292 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "@keyframes blinker {\n  50% {\n    opacity: 0.0; } }\n\n@keyframes pulse {\n  from {\n    stroke: black;\n    fill: white;\n    transform: translateY(0px); }\n  to {\n    stroke: white;\n    fill: transparent;\n    transform: translateY(-3px); } }\n\n@keyframes detached {\n  0% {\n    stroke: black; }\n  50% {\n    stroke: black; }\n  100% {\n    stroke: #c80000; } }\n\n@keyframes ghost {\n  to {\n    stroke-dashoffset: 10; } }\n\n.blink {\n  animation: blinker 1s linear infinite; }\n\n.pulse {\n  animation: pulse 0.4s infinite alternate; }\n\n._detachedFx, svg .slot.detached {\n  animation: detached 0.8s infinite alternate; }\n\n._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect, svg * {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\nsvg path.box1 {\n  fill: #756b4e;\n  cursor: pointer; }\n  svg path.box1:hover {\n    fill: #8e815f; }\n  svg path.box1.dark {\n    fill: #222222; }\n  svg path.box1.sel {\n    fill: #db8b3a; }\n\n.li.box1 {\n  background: #907e4d; }\n\nsvg path.box2 {\n  fill: #6c754e;\n  cursor: pointer; }\n  svg path.box2:hover {\n    fill: #838e5f; }\n  svg path.box2.dark {\n    fill: #222222; }\n  svg path.box2.sel {\n    fill: #db8b3a; }\n\n.li.box2 {\n  background: #80904d; }\n\nsvg path.box3 {\n  fill: #59754e;\n  cursor: pointer; }\n  svg path.box3:hover {\n    fill: #6b8e5f; }\n  svg path.box3.dark {\n    fill: #222222; }\n  svg path.box3.sel {\n    fill: #db8b3a; }\n\n.li.box3 {\n  background: #5f904d; }\n\nsvg path.box4 {\n  fill: #4e7557;\n  cursor: pointer; }\n  svg path.box4:hover {\n    fill: #5f8e69; }\n  svg path.box4.dark {\n    fill: #222222; }\n  svg path.box4.sel {\n    fill: #db8b3a; }\n\n.li.box4 {\n  background: #4d905d; }\n\nsvg path.box5 {\n  fill: #4e756b;\n  cursor: pointer; }\n  svg path.box5:hover {\n    fill: #5f8e81; }\n  svg path.box5.dark {\n    fill: #222222; }\n  svg path.box5.sel {\n    fill: #db8b3a; }\n\n.li.box5 {\n  background: #4d907e; }\n\nsvg path.box6 {\n  fill: #4e6c75;\n  cursor: pointer; }\n  svg path.box6:hover {\n    fill: #5f838e; }\n  svg path.box6.dark {\n    fill: #222222; }\n  svg path.box6.sel {\n    fill: #db8b3a; }\n\n.li.box6 {\n  background: #4d8090; }\n\nsvg path.box7 {\n  fill: #4e5975;\n  cursor: pointer; }\n  svg path.box7:hover {\n    fill: #5f6b8e; }\n  svg path.box7.dark {\n    fill: #222222; }\n  svg path.box7.sel {\n    fill: #db8b3a; }\n\n.li.box7 {\n  background: #4d5f90; }\n\nsvg path.box8 {\n  fill: #574e75;\n  cursor: pointer; }\n  svg path.box8:hover {\n    fill: #695f8e; }\n  svg path.box8.dark {\n    fill: #222222; }\n  svg path.box8.sel {\n    fill: #db8b3a; }\n\n.li.box8 {\n  background: #5d4d90; }\n\nsvg path.box9 {\n  fill: #6b4e75;\n  cursor: pointer; }\n  svg path.box9:hover {\n    fill: #815f8e; }\n  svg path.box9.dark {\n    fill: #222222; }\n  svg path.box9.sel {\n    fill: #db8b3a; }\n\n.li.box9 {\n  background: #7e4d90; }\n\nsvg path.box10 {\n  fill: #754e6c;\n  cursor: pointer; }\n  svg path.box10:hover {\n    fill: #8e5f83; }\n  svg path.box10.dark {\n    fill: #222222; }\n  svg path.box10.sel {\n    fill: #db8b3a; }\n\n.li.box10 {\n  background: #904d80; }\n\nsvg path.box11 {\n  fill: #754e59;\n  cursor: pointer; }\n  svg path.box11:hover {\n    fill: #8e5f6b; }\n  svg path.box11.dark {\n    fill: #222222; }\n  svg path.box11.sel {\n    fill: #db8b3a; }\n\n.li.box11 {\n  background: #904d5f; }\n\nsvg path.box12 {\n  fill: #75574e;\n  cursor: pointer; }\n  svg path.box12:hover {\n    fill: #8e695f; }\n  svg path.box12.dark {\n    fill: #222222; }\n  svg path.box12.sel {\n    fill: #db8b3a; }\n\n.li.box12 {\n  background: #905d4d; }\n\nsvg .slot {\n  fill: none;\n  stroke: black;\n  stroke-width: 1px; }\n  svg .slot.detached {\n    stroke-width: 3px;\n    stroke: black;\n    transform: translateY(-1px); }\n\nsvg .plus {\n  fill: none;\n  stroke: #302c2c;\n  stroke-width: 1px;\n  cursor: pointer; }\n\nsvg .click {\n  fill: transparent;\n  transition: fill 0.8s;\n  stroke: none;\n  cursor: pointer; }\n  svg .click:hover, svg .click.active {\n    fill: rgba(0, 0, 0, 0.3); }\n\nsvg text {\n  pointer-events: none;\n  font-size: getfont(size);\n  fill: #000; }\n  svg text.main {\n    fill: #d98632; }\n\nsvg path {\n  stroke-width: 1px;\n  stroke: black; }\n  svg path.main {\n    cursor: pointer;\n    fill: #3d3838; }\n    svg path.main:hover {\n      fill: #4b4444; }\n    svg path.main.sel {\n      fill: #db8b3a; }\n\npath.ghost, .Drag path {\n  stroke: white;\n  stroke-dasharray: 5;\n  stroke-dashoffset: 0;\n  animation: ghost 1.2s linear infinite; }\n\n#app path.invalid {\n  fill: red; }\n\nsvg#files {\n  border: 2px dashed transparent; }\n  svg#files.drag-over {\n    border-color: #71583e; }\n\nsvg#scratch {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: -999;\n  opacity: 0; }\n", ""]);
	
	// exports


/***/ },
/* 293 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(294);
	const Component_1 = __webpack_require__(12);
	const DragDrop_1 = __webpack_require__(123);
	const Factory_1 = __webpack_require__(10);
	const renderLibrary = (component, signals) => {
	    // const uinode =
	    const { mousedown, mousemove, mouseup } = DragDrop_1.DragDropHelper.drag(signals, (nodePos) => {
	        signals.$dragdrop.drag({ drag: { componentId: component._id, ownerType: 'library', nodePos }
	        });
	    }, (e) => { });
	    return Component_1.Component.createElement("div", {class: 'li', "data-drop": 'library', "on-mousedown": mousedown, "on-mouseup": mouseup, "on-mousemove": mousemove}, 
	        Component_1.Component.createElement("span", {"data-drop": 'library'}, component.name)
	    );
	};
	const Pane = Factory_1.pane('library');
	exports.Library = Component_1.Component({ rows: ['library', '$rows'],
	    status: ['$status', 'list'],
	    active: Pane.path,
	    drop: ['$dragdrop', 'drop']
	}, ({ state, signals }) => {
	    // TODO: highlight on drop
	    const drop = state.drop && state.drop.ownerType === 'library';
	    const klass = { results: true, drop };
	    return Component_1.Component.createElement(Pane, {class: 'Library'}, 
	        Component_1.Component.createElement(Pane.toggle, {class: 'fbar bar', "data-drop": 'library'}, 
	            Component_1.Component.createElement("div", {class: 'fa fa-book', "data-drop": 'library'}), 
	            Component_1.Component.createElement("div", {class: 'name', "data-drop": 'library'}, "Library"), 
	            Component_1.Component.createElement("div", {class: 'rarrow', "data-drop": 'library'})), 
	        Component_1.Component.createElement(Pane.toggle, {class: 'bar'}, 
	            Component_1.Component.createElement("div", {class: 'spacer'}), 
	            Component_1.Component.createElement("div", {class: 'larrow'}), 
	            " "), 
	        Component_1.Component.createElement("div", {class: 'op', "on-click": () => signals.library.zip()}, 
	            "download ", 
	            Component_1.Component.createElement("div", {class: 'fa fa-download'})), 
	        Component_1.Component.createElement("div", {class: 'search'}, 
	            Component_1.Component.createElement("p", null, 
	                " ", 
	                Component_1.Component.createElement("input", {value: 'search', class: 'fld'}))
	        ), 
	        Component_1.Component.createElement("div", {class: klass, "data-drop": 'library'}, 
	            Component_1.Component.createElement("div", {"data-drop": 'library'}, state.rows.map((component) => renderLibrary(component, signals)))
	        ));
	});


/***/ },
/* 294 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(295);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 295 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane, .Library {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap, .Library .wrap {\n    overflow: visible; }\n  ._pane .bar, .Library .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow, .Library .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow, .Library .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar, .Library .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow, .Library .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow, .Library .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, .Library .bar .fa, ._pane .bar .name, .Library .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name, .Library .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover, .Library .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer, .Library .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow, .Library .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow, .Library .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.Library {\n  left: -168px;\n  transition: left 0.2s;\n  border-bottom-right-radius: 4px;\n  padding-bottom: 4px; }\n  .Library .bar {\n    flex-direction: row-reverse; }\n    .Library .bar.fbar {\n      flex-direction: row;\n      left: 0; }\n  .Library.active {\n    left: 0; }\n  .Library .results {\n    min-height: 200px;\n    max-height: 400px; }\n    .Library .results .li {\n      padding-left: 12px; }\n    .Library .results.drop {\n      border: 2px solid #D76D01; }\n", ""]);
	
	// exports


/***/ },
/* 296 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(297);
	const Component_1 = __webpack_require__(12);
	const Playback_1 = __webpack_require__(32);
	const cache = {};
	const context = Playback_1.PlaybackHelper.context({});
	/* ====== PLAYBACK LIBS ======= */
	const THREE = __webpack_require__(299);
	const PRELOADED = { THREE };
	/* ====== PLAYBACK LIBS ======= */
	exports.Playback = Component_1.Component({ graph: ['scene', 'graph'],
	    drop: ['$dragdrop', 'drop'] // react to drag op
	    ,
	    drag: ['$dragdrop', 'drag']
	}, ({ state, signals }) => {
	    const w = 320;
	    const h = 180;
	    const hair = 6;
	    const usedh = 2 * (4 + hair) + h;
	    const usedw = 2 * (4 + hair) + w;
	    const portStyle = { top: 4 + hair + 'px',
	        left: 4 + hair + 'px',
	        width: w + 'px',
	        height: h + 'px'
	    };
	    const ownerType = 'scene';
	    const drop = state.drop;
	    const drag = state.drag;
	    let graph = state.graph;
	    if (drop && drop.ownerType === ownerType) {
	        graph = drop.graph;
	    }
	    else if (drag && drag.ownerType === ownerType) {
	        graph = drag.rgraph;
	    }
	    if (graph) {
	        const require = (name) => PRELOADED[name];
	        // TODO: Get project graph and branch with scene...
	        Playback_1.PlaybackHelper.compile(graph, cache);
	        Playback_1.PlaybackHelper.init(cache, { require });
	        try {
	            cache.main(context);
	        }
	        catch (err) {
	            console.error(err);
	        }
	    }
	    return Component_1.Component.createElement("div", {class: 'Playback', style: { height: usedh + 'px' }}, 
	        Component_1.Component.createElement("div", {class: 'wrap', style: { height: usedh + 'px',
	            width: usedw + 'px' }}, 
	            Component_1.Component.createElement("div", {class: 'Screen', style: portStyle}, 
	                Component_1.Component.createElement("svg", {width: w + 2 + 2 * hair, height: h + 2 + 2 * hair, class: 'tv', style: { marginLeft: -1 - hair, marginTop: -1 - hair }}, 
	                    Component_1.Component.createElement("rect", {x: 0.5 - 1, y: 0.5 + hair, width: w + 3 + 2 * hair, height: h + 1}), 
	                    Component_1.Component.createElement("rect", {x: 0.5 + hair, y: 0.5 - 1, width: w + 1, height: h + 3 + 2 * hair})), 
	                Component_1.Component.createElement("div", {id: 'screen'}))
	        )
	    );
	});


/***/ },
/* 297 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(298);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 298 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.Playback {\n  background: #232020;\n  color: #999999;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%; }\n  .Playback .wrap {\n    position: relative; }\n  .Playback .Screen {\n    position: absolute; }\n    .Playback .Screen #screen {\n      background: black;\n      width: 100%;\n      height: 100%; }\n    .Playback .Screen svg {\n      position: absolute;\n      top: 0;\n      left: 0; }\n  .Playback .tv rect {\n    stroke: #333333;\n    stroke-width: 1px;\n    fill: none; }\n", ""]);
	
	// exports


/***/ },
/* 299 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(14))(99);

/***/ },
/* 300 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(301);
	const Component_1 = __webpack_require__(12);
	const Factory_1 = __webpack_require__(10);
	const Graph_1 = __webpack_require__(287);
	const ProjectName = Factory_1.editable(['project', 'name']);
	const ProjectOptions = Factory_1.pane('project-opts');
	exports.Project = Component_1.Component({ graph: ['project', 'graph'],
	    project: ['project'],
	    editing: ProjectName.path,
	    pane: ProjectOptions.path,
	    block: ['block'],
	    drop: ['$dragdrop', 'drop']
	}, ({ state, signals }) => {
	    const dclass = state.drop && state.drop.ownerType === 'project';
	    const klass = { Project: true, drop: dclass };
	    return Component_1.Component.createElement("div", {class: klass}, 
	        Component_1.Component.createElement("div", {class: 'bar'}, 
	            Component_1.Component.createElement(ProjectOptions.toggle, {class: 'fa fa-diamond'}), 
	            Component_1.Component.createElement(ProjectName, {class: 'name'})), 
	        Component_1.Component.createElement(ProjectOptions, null, 
	            Component_1.Component.createElement("div", {class: 'button delete'}, "delete"), 
	            Component_1.Component.createElement("div", {class: 'button'}, "duplicate")), 
	        Component_1.Component.createElement(Graph_1.Graph, {key: 'project.graph', ownerType: 'project', graph: state.graph}));
	});


/***/ },
/* 301 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(302);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 302 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.Project {\n  width: 200px;\n  flex-grow: 1;\n  border: 1px solid #353131;\n  border-width: 1px 0 0 0;\n  display: flex;\n  flex-direction: column; }\n  .Project .name {\n    color: #d98632; }\n", ""]);
	
	// exports


/***/ },
/* 303 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(304);
	const Component_1 = __webpack_require__(12);
	const Factory_1 = __webpack_require__(10);
	const sortByName = (a, b) => a.name > b.name ? 1 : -1;
	let oldprops;
	const showScenes = ({ scenes, sceneById, selectedSceneId }, signals) => {
	    if (!scenes || !sceneById) {
	        return '';
	    }
	    const list = scenes.map((id) => sceneById[id] || {});
	    list.sort(sortByName);
	    return list.map((scene) => (Component_1.Component.createElement("div", {class: { li: true,
	        sel: scene._id === selectedSceneId
	    }, "on-click": () => signals.scene.select({ _id: scene._id })}, 
	        Component_1.Component.createElement("div", {class: 'fa fa-film'}), 
	        scene.name)));
	};
	const Scenes = Component_1.Component({}, ({ props, signals }) => (Component_1.Component.createElement("div", {class: 'scenes'}, 
	    Component_1.Component.createElement("p", null, "Scenes"), 
	    Component_1.Component.createElement("div", null, 
	        showScenes(props, signals), 
	        Component_1.Component.createElement("div", {class: 'li add', "on-click": () => signals.scene.add({})}, "+")))));
	const Pane = Factory_1.pane('project');
	exports.ProjectPane = Component_1.Component({ project: ['project'],
	    sceneById: ['data', 'scene'],
	    selectedSceneId: ['$sceneId'],
	    pane: Pane.path
	}, ({ state, signals }) => (Component_1.Component.createElement(Pane, {class: 'ProjectPane'}, 
	    Component_1.Component.createElement(Pane.toggle, {class: 'fbar bar'}, 
	        Component_1.Component.createElement("div", {class: 'fa fa-diamond'}), 
	        Component_1.Component.createElement("div", {class: 'name'}, "Project"), 
	        Component_1.Component.createElement("div", {class: 'larrow'})), 
	    Component_1.Component.createElement(Pane.toggle, {class: 'bar'}, 
	        Component_1.Component.createElement("div", {class: 'spacer'}), 
	        Component_1.Component.createElement("div", {class: 'rarrow'}), 
	        " "), 
	    Component_1.Component.createElement("a", {class: 'op', href: '/#/project'}, 
	        "projects", 
	        Component_1.Component.createElement("div", {class: 'fa fa-hand-o-right'})), 
	    Component_1.Component.createElement("div", {class: 'control'}, 
	        Component_1.Component.createElement("p", null, "Control"), 
	        Component_1.Component.createElement("div", null, 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "OSC")
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "MIDI")
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "VST Plugin")
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "Keyboard")
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "Mouse")
	            ))), 
	    Component_1.Component.createElement(Scenes, {scenes: (state.project || {}).scenes, sceneById: state.sceneById, selectedSceneId: state.selectedSceneId, key: 'project.scenes'}), 
	    Component_1.Component.createElement("div", {class: 'assets'}, 
	        Component_1.Component.createElement("p", null, "assets"), 
	        Component_1.Component.createElement("div", null, 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "dancing queen.mp4")
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "shiva.jpg")
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "components (lib)")
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement("span", null, "lucy-forge (lib)")
	            ))))));


/***/ },
/* 304 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(305);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 305 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane, .ProjectPane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap, .ProjectPane .wrap {\n    overflow: visible; }\n  ._pane .bar, .ProjectPane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow, .ProjectPane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow, .ProjectPane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar, .ProjectPane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow, .ProjectPane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow, .ProjectPane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, .ProjectPane .bar .fa, ._pane .bar .name, .ProjectPane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name, .ProjectPane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover, .ProjectPane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer, .ProjectPane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow, .ProjectPane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow, .ProjectPane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.ProjectPane {\n  right: -168px;\n  transition: right 0.2s;\n  border-bottom-left-radius: 4px;\n  padding-bottom: 4px; }\n  .ProjectPane .bar {\n    flex-direction: row; }\n    .ProjectPane .bar.fbar {\n      flex-direction: row-reverse;\n      right: 0; }\n  .ProjectPane.active {\n    right: 0; }\n", ""]);
	
	// exports


/***/ },
/* 306 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(307);
	const Component_1 = __webpack_require__(12);
	const Factory_1 = __webpack_require__(10);
	const Graph_1 = __webpack_require__(287);
	const SceneName = Factory_1.editable(['scene', 'name']);
	const SceneOptions = Factory_1.pane('scene');
	exports.Scene = Component_1.Component({ scene: ['scene'],
	    editing: SceneName.path,
	    pane: SceneOptions.path,
	    block: ['block'],
	    drop: ['$dragdrop', 'drop']
	}, ({ state, signals }) => {
	    const dclass = state.drop && state.drop.ownerType === 'scene';
	    const klass = { Scene: true, drop: dclass };
	    const scene = state.scene;
	    if (!scene) {
	        return '';
	    }
	    // console.log ( JSON.stringify ( scene.graph, null, 2 ) )
	    const deleteModal = Factory_1.openModal({ message: 'Delete scene ?',
	        type: 'scene',
	        _id: scene._id,
	        operation: 'remove',
	        confirm: 'Delete'
	    }, signals);
	    return Component_1.Component.createElement("div", {class: klass}, 
	        Component_1.Component.createElement("div", {class: 'bar'}, 
	            Component_1.Component.createElement(SceneOptions.toggle, {class: 'fa fa-film'}), 
	            Component_1.Component.createElement(SceneName, {class: 'name'})), 
	        Component_1.Component.createElement(SceneOptions, null, 
	            Component_1.Component.createElement("div", {class: 'button delete', "on-click": deleteModal}, "delete"), 
	            Component_1.Component.createElement("div", {class: 'button'}, "duplicate")), 
	        Component_1.Component.createElement(Graph_1.Graph, {key: 'scene.graph', selectedBlockId: state.blockId, ownerType: 'scene', graph: scene.graph}));
	});


/***/ },
/* 307 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(308);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 308 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.Scene {\n  position: relative;\n  flex-grow: 1;\n  border: 1px solid #353131;\n  border-width: 1px 0 0 1px;\n  display: flex;\n  flex-direction: column; }\n  .Scene .name {\n    color: #d98632; }\n", ""]);
	
	// exports


/***/ },
/* 309 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(310);
	const Component_1 = __webpack_require__(12);
	exports.Login = Component_1.Component({}, ({ signals }) => (Component_1.Component.createElement("div", {class: 'Login'}, 
	    Component_1.Component.createElement("div", {class: 'wrap'}, 
	        Component_1.Component.createElement("h3", null, "Please login"), 
	        Component_1.Component.createElement("div", null, "todo"))
	)));


/***/ },
/* 310 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(311);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 311 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ },
/* 312 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(313);
	const Component_1 = __webpack_require__(12);
	const selectProject = (signals, _id) => {
	    signals.project.select({ _id });
	};
	const sortByName = (a, b) => a.name > b.name ? 1 : -1;
	const showProjects = ({ projectsById, selectedProjectId }, signals) => {
	    const list = [];
	    for (const k in (projectsById || {})) {
	        list.push(projectsById[k]);
	    }
	    list.sort(sortByName);
	    return list.map((project) => (Component_1.Component.createElement("a", {class: { li: true,
	        sel: project._id === selectedProjectId
	    }, href: `/#/project/${project._id}`}, 
	        Component_1.Component.createElement("div", {class: 'fa fa-film'}), 
	        project.name)));
	};
	exports.ProjectChooser = Component_1.Component({ projectsById: ['data', 'project'],
	    selectedProjectId: ['$projectId']
	}, ({ state, signals }) => (Component_1.Component.createElement("div", {class: { ProjectChooser: true, Modal: true, active: true }}, 
	    Component_1.Component.createElement("div", {class: 'wrap'}, 
	        Component_1.Component.createElement("p", {class: 'message'}, "Select project"), 
	        Component_1.Component.createElement("div", {class: 'list'}, 
	            showProjects(state, signals), 
	            Component_1.Component.createElement("div", {class: 'li add', "on-click": () => signals.project.add({})}, "+")))
	)));


/***/ },
/* 313 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(314);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 314 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.ProjectChooser .wrap {\n  width: 300px; }\n", ""]);
	
	// exports


/***/ },
/* 315 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(316);
	const Component_1 = __webpack_require__(12);
	const Status_1 = __webpack_require__(318);
	const Sync_1 = __webpack_require__(321);
	exports.StatusBar = Component_1.Component({ status: ['$status', 'list']
	}, ({ state, signals }) => {
	    const l = state.status || [];
	    const s = l[0];
	    return Component_1.Component.createElement("div", {class: 'StatusBar'}, 
	        s ? Component_1.Component.createElement(Status_1.Status, {status: s}) : '', 
	        Component_1.Component.createElement(Sync_1.Sync, null));
	});


/***/ },
/* 316 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(317);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 317 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.StatusBar {\n  height: 20px;\n  width: 100%;\n  background: #3d3838;\n  border: 1px solid #353131;\n  padding: 8px;\n  color: #999999;\n  z-index: 4;\n  display: flex;\n  justify-content: flex-start; }\n  .StatusBar .Status {\n    flex-grow: 1; }\n  .StatusBar .Sync {\n    flex-grow: 0;\n    align-content: flex-end; }\n", ""]);
	
	// exports


/***/ },
/* 318 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(319);
	const Component_1 = __webpack_require__(12);
	exports.Status = Component_1.Component({}, ({ props, signals }) => {
	    const status = props.status;
	    const toggleDetail = (e) => {
	        signals.$status.toggledDetail({ detail: status
	        });
	    };
	    const klass = Object.assign({}, props.class || {}, { Status: true, [status.type]: true });
	    return Component_1.Component.createElement("div", {class: klass, "on-click": toggleDetail}, 
	        props.nosvg ? '' :
	            Component_1.Component.createElement("svg", {height: '12', width: '18'}, 
	                Component_1.Component.createElement("circle", {cx: '5.5', cy: '6.5', r: '5', class: 'outer'}), 
	                Component_1.Component.createElement("circle", {cx: '5.5', cy: '6.5', r: '3', class: 'inner'})), 
	        status.message);
	});


/***/ },
/* 319 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(320);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 320 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n@keyframes fadea {\n  0% {\n    opacity: 1.0; }\n  100% {\n    opacity: 0.1; } }\n\n@keyframes fadeb {\n  0% {\n    opacity: 1.0; }\n  100% {\n    opacity: 0.1; } }\n\n.Status {\n  cursor: pointer; }\n  .Status.info {\n    color: #777; }\n    .Status.info .outer {\n      stroke: #666; }\n    .Status.info .inner {\n      fill: #666;\n      animation: fadea 2s 1 both; }\n  .Status.error {\n    color: #a77; }\n    .Status.error .outer {\n      stroke: #b22; }\n    .Status.error .inner {\n      fill: #f00;\n      animation: fadea 2s 1 both; }\n  .Status.warn {\n    color: #997; }\n    .Status.warn .outer {\n      stroke: #bb0; }\n    .Status.warn .inner {\n      fill: #ff0;\n      animation: fadeb 2s 1 both; }\n  .Status.success {\n    color: #686; }\n    .Status.success .outer {\n      stroke: #0b0; }\n    .Status.success .inner {\n      fill: #0f0;\n      animation: fadeb 2s 1 both; }\n  .Status .outer {\n    stroke-width: 1px;\n    stroke: #000;\n    fill: none; }\n  .Status .inner {\n    stroke: none;\n    fill: #000; }\n", ""]);
	
	// exports


/***/ },
/* 321 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(322);
	const Component_1 = __webpack_require__(12);
	const ICON = 'fa-exchange';
	const BASE = { Sync: true, fa: true, [ICON]: true };
	const SYNC_TO_FA = { paused: Object.assign({}, BASE, { paused: true }),
	    active: Object.assign({}, BASE, { active: true }),
	    complete: Object.assign({}, BASE, { complete: true }),
	    offline: Object.assign({}, BASE, { offline: true }),
	    error: Object.assign({}, BASE, { error: true })
	};
	const syncToClass = (sync) => {
	    return { fa: true, [sync || '']: true };
	};
	exports.Sync = Component_1.Component({ status: ['$sync', 'status']
	}, ({ state }) => (Component_1.Component.createElement("div", {class: SYNC_TO_FA[state.status || 'paused']})));


/***/ },
/* 322 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(323);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 323 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.Sync {\n  width: 1em;\n  height: 1em;\n  margin-right: 8px;\n  color: #686; }\n  .Sync.paused {\n    color: #686; }\n  .Sync.active {\n    color: #fe9327; }\n  .Sync.offline {\n    color: #a77; }\n  .Sync.error {\n    color: #a77; }\n", ""]);
	
	// exports


/***/ },
/* 324 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(325);
	const Component_1 = __webpack_require__(12);
	const Status_1 = __webpack_require__(318);
	exports.StatusDetail = Component_1.Component({ detail: ['$status', 'detail'],
	    visible: ['$status', 'showDetail']
	}, ({ state, signals }) => {
	    const status = state.detail || {};
	    return Component_1.Component.createElement("div", {class: { StatusDetail: true, active: state.visible }}, 
	        Component_1.Component.createElement("div", {class: 'bar'}, 
	            Component_1.Component.createElement(Status_1.Status, {status: status, class: 'name'})
	        ), 
	        Component_1.Component.createElement("div", {class: 'wrap'}, (status.detail || []).map((s) => Component_1.Component.createElement("div", {class: 'entry'}, s))));
	});


/***/ },
/* 325 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(326);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 326 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "._info, .StatusDetail {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap, .StatusDetail .wrap {\n    padding: 8px; }\n  ._info .bar, .StatusDetail .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap, .StatusDetail .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Pane .op {\n  cursor: pointer;\n  padding: 4px;\n  background: #232020;\n  color: #4d4d4d;\n  text-align: right; }\n  .Pane .op:hover {\n    color: #999999; }\n\n.StatusDetail {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0.3s, opacity 0.3s;\n  z-index: 4; }\n  .StatusDetail.active {\n    opacity: 1;\n    visibility: visible; }\n  .StatusDetail .entry {\n    border-top: 1px solid rgba(88, 81, 81, 0.95);\n    padding: 4px 0;\n    white-space: pre-wrap; }\n    .StatusDetail .entry:first-child {\n      border: 0; }\n", ""]);
	
	// exports


/***/ },
/* 327 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(328);
	const Component_1 = __webpack_require__(12);
	const Factory_1 = __webpack_require__(10);
	const GithubToken = Factory_1.editable(['user', 'libraryGithubToken']);
	const GithubPath = Factory_1.editable(['user', 'libraryGithubPath']);
	const UserName = Factory_1.editable(['user', 'name']);
	const showFiles = (entries) => {
	    return Object.keys(entries || {}).sort().map(s => Component_1.Component.createElement("div", {class: 'li'}, s));
	};
	exports.User = Component_1.Component({ user: ['user'],
	    files: ['github', 'library'],
	    editing: ['$factory', 'user']
	}, ({ state, signals }) => (Component_1.Component.createElement("div", {class: { User: true, Modal: true, active: true }}, 
	    Component_1.Component.createElement("div", {class: 'wrap'}, 
	        Component_1.Component.createElement("p", {class: 'message'}, "User preferences"), 
	        Component_1.Component.createElement("div", {class: 'list'}, 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement(UserName, null)
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement(GithubToken, {default: 'somelongauthtoken'})
	            ), 
	            Component_1.Component.createElement("div", {class: 'li'}, 
	                Component_1.Component.createElement(GithubPath, {default: 'user'})
	            )), 
	        Component_1.Component.createElement("div", {class: 'list'}, showFiles(state.files)))
	)));


/***/ },
/* 328 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(329);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(266)(content, {});
	if(content.locals) module.exports = content.locals;
	// Hot Module Replacement
	if(false) {
		// When the styles change, update the <style> tags
		if(!content.locals) {
			module.hot.accept("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss", function() {
				var newContent = require("!!./../../node_modules/css-loader/index.js!./../../node_modules/sass-loader/index.js!./style.scss");
				if(typeof newContent === 'string') newContent = [[module.id, newContent, '']];
				update(newContent);
			});
		}
		// When the module is disposed, remove the <style> tags
		module.hot.dispose(function() { update(); });
	}

/***/ },
/* 329 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(265)();
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map