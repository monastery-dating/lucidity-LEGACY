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
	const Block_1 = __webpack_require__(68);
	const Data_1 = __webpack_require__(5);
	const DragDrop_1 = __webpack_require__(84);
	const Factory_1 = __webpack_require__(42);
	const Graph_1 = __webpack_require__(54);
	const Library_1 = __webpack_require__(92);
	const Playback_1 = __webpack_require__(93);
	const Project_1 = __webpack_require__(95);
	const Scene_1 = __webpack_require__(97);
	const Status_1 = __webpack_require__(20);
	const User_1 = __webpack_require__(113);
	const Sync_1 = __webpack_require__(114);
	// import Router from 'cerebral-module-router'
	const Controller = __webpack_require__(119);
	const Devtools = __webpack_require__(120);
	const Http = __webpack_require__(121);
	const Model = __webpack_require__(73);
	const Component_1 = __webpack_require__(28); // Component for jsx on this page
	const App_2 = __webpack_require__(122);
	//import { TestView as AppView } from './TestView'
	const model = Model({});
	const controller = Controller(model);
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
	exports.App = (options = {}) => {
	    return (module, controller) => {
	        // no state added
	        module.addSignals({ mounted: mounted_1.mounted
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 2 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const status_1 = __webpack_require__(3);
	const Data_1 = __webpack_require__(5);
	const runtests_1 = __webpack_require__(23);
	const output = (a) => {
	    return ({ output }) => {
	        output(a);
	    };
	};
	exports.mounted = [status_1.setStatus({ type: 'info', message: 'Lucidity started' }),
	    [...Data_1.reload] // async
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
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	// Exposed actions and signals from Data (used directly in other signals composition)
	__export(__webpack_require__(6));
	__export(__webpack_require__(9));
	__export(__webpack_require__(10));
	const db_1 = __webpack_require__(13);
	const dbChanged_1 = __webpack_require__(16);
	const reload_2 = __webpack_require__(6);
	const save_3 = __webpack_require__(9);
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
	            reload: reload_2.reload,
	            save: save_3.save
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
/* 6 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const reload_1 = __webpack_require__(7);
	const dataToState_1 = __webpack_require__(8);
	exports.reload = [reload_1.reload,
	    { success: [dataToState_1.dataToState /*, connect */],
	        error: []
	    }
	];


/***/ },
/* 7 */
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
/* 8 */
/***/ function(module, exports) {

	"use strict";
	exports.dataToState = ({ state, input }) => {
	    state.set(input.path, input.data);
	};


/***/ },
/* 9 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const save_1 = __webpack_require__(10);
	const status_1 = __webpack_require__(3);
	exports.save = [save_1.saveAction,
	    { success: [],
	        error: [status_1.status]
	    }
	];


/***/ },
/* 10 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(11);
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
/* 11 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(163);

/***/ },
/* 12 */
/***/ function(module, exports) {

	module.exports = vendor_lib;

/***/ },
/* 13 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const PouchDB = __webpack_require__(14);
	const PouchDBAuthentication = __webpack_require__(15);
	// https://github.com/nolanlawson/pouchdb-authentication
	PouchDB.plugin(PouchDBAuthentication);
	exports.db = new PouchDB('lucidity');


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(140);

/***/ },
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(154);

/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const update_1 = __webpack_require__(17);
	const saved_1 = __webpack_require__(18);
	const edit_1 = __webpack_require__(19);
	const Status_1 = __webpack_require__(20);
	exports.dbChanged = [update_1.update,
	    Status_1.status,
	    saved_1.saved,
	    edit_1.edit // open name for editing (depends on a flag in $factory)
	];


/***/ },
/* 17 */
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
	        if (type === 'user') {
	        }
	        else {
	            if (_id === cid || cid === undefined) {
	                saved = type;
	            }
	        }
	    }
	    output({ saved, status, doc });
	};


/***/ },
/* 18 */
/***/ function(module, exports) {

	"use strict";
	exports.saved = ({ state, input: { saved } }) => {
	    if (saved) {
	        // clear all 'saving' flags on props if main object is saved
	        state.unset(['$factory', saved]);
	    }
	};


/***/ },
/* 19 */
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
/* 20 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(3));
	const changed_1 = __webpack_require__(21);
	const toggledDetail_1 = __webpack_require__(22);
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
/* 21 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const status_1 = __webpack_require__(3);
	exports.changed = [status_1.status
	];


/***/ },
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const toggleDetail_1 = __webpack_require__(4);
	exports.toggledDetail = [toggleDetail_1.toggleDetail
	];


/***/ },
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const testing_1 = __webpack_require__(24);
	const runall_1 = __webpack_require__(25);
	const stats_1 = __webpack_require__(83);
	const status_1 = __webpack_require__(3);
	exports.runtests = [testing_1.testing,
	    status_1.status,
	    [runall_1.runall, { success: [stats_1.stats, { success: [status_1.status] }] }] // async
	];


/***/ },
/* 24 */
/***/ function(module, exports) {

	"use strict";
	exports.testing = ({ state, output }) => {
	    output({ status: { type: 'info', message: 'Started testing' } });
	};


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(26);
	const runner_1 = __webpack_require__(30);
	exports.runall = ({ state, output }) => {
	    runner_1.run((stats) => {
	        output.success({ stats });
	    });
	};
	exports.runall['async'] = true;


/***/ },
/* 26 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(27);
	__webpack_require__(34);
	__webpack_require__(36);
	__webpack_require__(38);
	__webpack_require__(40);
	__webpack_require__(67);
	__webpack_require__(79);
	__webpack_require__(80);
	__webpack_require__(81);
	__webpack_require__(82);


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(28);
	const runner_1 = __webpack_require__(30);
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
	    it('should move data-xx in props', (assert) => {
	        assert.equal(Component_1.Component.createElement("foo", {"data-bing": 'top'}), { sel: 'foo',
	            data: { props: { ['data-bing']: 'top' } },
	            children: []
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
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const cerebral_view_snabbdom_1 = __webpack_require__(29);
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
	            if (dash > 0 && !hasData.test(k)) {
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
	    adata.attrs = Object.assign(props.attrs || {}, props);
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
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(127);

/***/ },
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const deepEqual = __webpack_require__(31);
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(32);
	var isArguments = __webpack_require__(33);
	
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
/* 32 */
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
/* 33 */
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
/* 34 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
	const save_1 = __webpack_require__(10);
	const Baobab = __webpack_require__(35);
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
	        save_1.saveAction({ state,
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
	        save_1.saveAction({ state, output, services, input: { doc: { name: 'newname' } } });
	        assert.equal(res, { status: { type: 'error', message: 'no good' } });
	    });
	});


/***/ },
/* 35 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(119);

/***/ },
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
	const makeDoc_action_1 = __webpack_require__(37);
	const Baobab = __webpack_require__(35);
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(11);
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
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
	const set_action_1 = __webpack_require__(39);
	const Baobab = __webpack_require__(35);
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
/* 39 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(11);
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
	const BlockHelper_1 = __webpack_require__(41);
	const SOURCE_A = ``;
	runner_1.describe('BlockHelper.create', (it) => {
	    it('should new _id', (assert) => {
	        const node = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	        assert.equal(typeof node._id, 'string');
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
	        assert.throws(function () {
	            node.name = 'foobar';
	        });
	    });
	    it('should parse source', (assert) => {
	        const node = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	        assert.pending('should parse source');
	        assert.equal(node.input, ['text:string', 'text:string']);
	        assert.equal(node.output, 'text:string');
	        assert.same(node.init, false);
	    });
	});
	runner_1.describe('BlockHelper.copy', (it) => {
	    it('assign new _id', (assert) => {
	        const a = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	        const b = BlockHelper_1.BlockHelper.copy(a);
	        assert.notSame(a, b);
	        assert.notSame(a._id, b._id);
	        assert.equal(typeof b._id, 'string');
	    });
	});
	runner_1.describe('BlockHelper.update', (it) => {
	    const node = BlockHelper_1.BlockHelper.create('hello', SOURCE_A);
	    it('should set name', (assert) => {
	        const node2 = BlockHelper_1.BlockHelper.update(node, { name: 'new name' });
	        assert.equal(node.name, 'hello');
	    });
	    it('should set source', (assert) => {
	        assert.equal(node.source, SOURCE_A);
	    });
	    it('should parse source', (assert) => {
	        assert.pending('should parse source');
	        assert.equal(node.input, ['text:string', 'text:string']);
	        assert.equal(node.output, 'text:string');
	        assert.same(node.init, false);
	    });
	});


/***/ },
/* 41 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Factory_1 = __webpack_require__(42);
	const ts = __webpack_require__(53);
	const Graph_1 = __webpack_require__(54);
	const MAIN_SOURCE = __webpack_require__(65);
	const DEFAULT_SOURCE = __webpack_require__(66);
	var BlockHelper;
	(function (BlockHelper) {
	    BlockHelper.main = () => {
	        return BlockHelper.create('main', MAIN_SOURCE);
	    };
	    BlockHelper.copy = (block) => {
	        const info = processSource(block.source);
	        return Graph_1.Immutable.merge({ _id: Factory_1.makeId(),
	            type: 'block',
	            name: block.name,
	            source: block.source
	        }, info);
	    };
	    BlockHelper.create = (name, source = DEFAULT_SOURCE) => {
	        const info = processSource(source);
	        return Graph_1.Immutable.merge({ _id: Factory_1.makeId(),
	            type: 'block',
	            name,
	            source
	        }, info);
	    };
	    BlockHelper.update = (block, changes) => {
	        const newobj = Graph_1.Immutable.merge(block, changes);
	        if (changes.source) {
	            const info = processSource(changes.source);
	            return Graph_1.Immutable.merge(newobj, info);
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
	            // We now run the code. The exports is the cache.
	            const exports = {};
	            codefunc(exports);
	            const render = exports.render;
	            if (!render) {
	                return { input: [],
	                    js,
	                    output: null,
	                    init: exports.init ? true : false
	                };
	            }
	            const input = [];
	            for (let i = 0; i < render.length - 1; ++i) {
	                // FIXME: detect input type
	                input.push('string');
	            }
	            // FIXME: output type
	            const output = 'string';
	            return { input,
	                js,
	                output,
	                init: exports.init ? true : false
	            };
	        }
	        catch (err) {
	            // FIXME: what do we do with bad code ?
	            // Should we keep old source and js ?
	            return { input: ['string', 'string'],
	                js,
	                output: 'string',
	                init: false
	            };
	        }
	    };
	})(BlockHelper = exports.BlockHelper || (exports.BlockHelper = {}));


/***/ },
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(43));
	__export(__webpack_require__(44));
	__export(__webpack_require__(46));
	__export(__webpack_require__(47));
	__export(__webpack_require__(48));
	const common_1 = __webpack_require__(49);
	exports.Factory = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ editing: false // would contain the path of edited element
	        });
	        // FIXME: none of these should exist.
	        module.addSignals({ add: common_1.add,
	            set: common_1.set
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(28);
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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(28);
	const EditableText_1 = __webpack_require__(45);
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
	        return Component_1.Component.createElement(EditableText_1.EditableText, {class: props.class, text: state.text, stext: state.stext, editing: isediting, saving: state.saving, "on-edit": edit, "on-change": changed});
	    });
	    comp.path = fpath;
	    return comp;
	};


/***/ },
/* 45 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(28);
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
/* 46 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(28);
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
/* 47 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(28);
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
/* 48 */
/***/ function(module, exports) {

	"use strict";
	let counter = 0;
	exports.makeId = () => {
	    // ensures unique DB id
	    const date = new Date().toISOString();
	    return `${date}-${++counter}`;
	};


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(50));
	__export(__webpack_require__(51));


/***/ },
/* 50 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set_action_1 = __webpack_require__(39);
	// import { makeDoc } from './makeDoc.action'
	// import { save as saveData } from '../../Data'
	exports.set = [set_action_1.setAction
	];


/***/ },
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const add_action_1 = __webpack_require__(52);
	const Data_1 = __webpack_require__(5);
	exports.add = 
	// prepare things to add
	[add_action_1.addAction,
	    ...Data_1.save
	];


/***/ },
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const makeId_1 = __webpack_require__(48);
	exports.addAction = ({ state, input: { path, type }, services, output }) => {
	    // path = [ 'project', 'scenes' ]
	    // type = 'scene'
	    const root = path[0];
	    const docs = [];
	    const _id = makeId_1.makeId();
	    // create new element
	    const helper = services[type];
	    if (helper && helper.create) {
	        const create = helper.create;
	        // creates documents for initial object of type 'type'
	        create({ _id, type })
	            .forEach((d) => {
	            console.log(d);
	            docs.push(d);
	        });
	    }
	    else {
	        docs.push({ _id,
	            type,
	            name: `New ${type}`
	        });
	    }
	    // Select this new element
	    docs.push(Object.assign({}, state.get(['data', 'main', type]) || {}, { type: 'main', _id: type, value: _id }));
	    // This is a flag that will set editing after db object
	    // is selected.
	    state.set(['$factory', 'editing'], type);
	    if (path.length > 1) {
	        // add to parent
	        // project.scenes
	        const parent = state.get(path[0]);
	        const key = path[path.length - 1];
	        const skey = `${type}Id`;
	        const list = [...(parent[key] || []), _id];
	        docs.push(Object.assign({}, parent, { [key]: list, [skey]: _id }));
	    }
	    output({ docs });
	};


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(73);

/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(55));
	__export(__webpack_require__(57));
	exports.Graph = (options = {}) => {
	    return (module, controller) => {
	        return {}; // meta information
	    };
	};


/***/ },
/* 55 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(56));


/***/ },
/* 56 */
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
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(58));
	__export(__webpack_require__(63));
	__export(__webpack_require__(61));
	// FIXME: Immutable should be in 'utils'
	__export(__webpack_require__(64));


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const uilayout_1 = __webpack_require__(59);
	const NodeHelper_1 = __webpack_require__(61);
	const nextNodeId = NodeHelper_1.NodeHelper.nextNodeId;
	const rootNodeId = NodeHelper_1.NodeHelper.rootNodeId;
	const minSize_1 = __webpack_require__(62);
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
	/** Compute a class name from an object.
	 *
	 * @param {object} obj    - the object definition
	 * @param {object} layout - constants and tmp svg element
	 *
	 * @returns {string}   - the class name
	 */
	const className = (obj, link, layout) => {
	    if (link.id === rootNodeId) {
	        return 'scene';
	    }
	    const name = obj.name.split('.')[0];
	    let num = 7;
	    for (let i = 0; i < name.length; i += 1) {
	        num += name.charCodeAt(i);
	    }
	    return `box${1 + num % layout.PCOUNT}`;
	};
	/** Compute box position.
	 */
	const boxPosition = function (graph, id, layout, uigraph, drop, ctx) {
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
	        const cname = link.children[i];
	        const wtonext = (sextra[i] || 0) + layout.SPAD + 2 * layout.SLOT;
	        if (cname) {
	            let dropy = 0;
	            if (drop && drop.parentId === id) {
	                if (drop.operation === 'insert' && drop.pos === i) {
	                    dropy = 4;
	                }
	                else if (drop.operation === 'add') {
	                }
	            }
	            boxPosition(graph, cname, layout, uigraph, drop, { x, y: ctx.y + dy + dropy });
	            x += layout.BPAD + uigraph.uiNodeById[cname].size.w;
	        }
	        else if (cname === null) {
	            // empty slot, add padding and click width
	            x += layout.SCLICKW / 2 + layout.SPAD + 2 * layout.SLOT;
	        }
	    }
	    return dy;
	};
	const uimapOne = function (graph, id, layout, uigraph, cachebox) {
	    uigraph.uiNodeById[id] = { id };
	    /*
	    if ( graph.type !== 'processing' ) {
	      // not in graph: draw parent first
	      uigraph.list.push ( id )
	    }
	    */
	    const uibox = uigraph.uiNodeById[id];
	    const cache = cachebox[id] || {};
	    const link = graph.nodesById[id];
	    const obj = graph.blocksById[link.blockId];
	    uibox.name = obj.name;
	    uibox.blockId = obj._id;
	    uibox.type = obj.type;
	    uibox.className = uibox.name === cache.name
	        ? cache.className
	        : className(obj, link, layout);
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
	        const sline = `M${-sl} ${sl} h${2 * sl}`;
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
	            const cname = link.children[i];
	            const pos = { x: x + sl, y };
	            if (!input[i]) {
	                // extra links outside of inputs...
	                slots.push({ path: sline,
	                    idx: i,
	                    pos,
	                    plus,
	                    click,
	                    flags: { detached: true, free: !cname }
	                });
	            }
	            else {
	                slots.push({ path: spath,
	                    idx: i,
	                    pos,
	                    plus,
	                    click,
	                    flags: { free: !cname }
	                });
	            }
	            if (cname) {
	                // We push in sextra the delta for slot i
	                const w = uimapOne(graph, cname, layout, uigraph, cachebox);
	                if (i === len - 1) {
	                    // last
	                    sextra.push(w + layout.BPAD - 2 * slotpad);
	                }
	                else {
	                    sextra.push(w + layout.BPAD - slotpad);
	                }
	                x += w;
	            }
	            else if (i === len - 1) {
	                sextra.push(0);
	            }
	            else {
	                // empty slot adds extra padding for click
	                const w = layout.SCLICKW / 2 + slotpad;
	                x += w; // layout.SPAD + 2 * layout.SLOT
	                sextra.push(w + layout.BPAD - slotpad);
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
	    return uibox.size.w;
	};
	/** Compute the layout of a graph.
	 */
	exports.uimap = (agraph, blocksById, drop, alayout, cache) => {
	    const graph = { nodes: agraph.nodes,
	        nodesById: agraph.nodesById,
	        blocksById
	    };
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
	    uimapOne(graph, rootNodeId, layout, uigraph, cachebox);
	    boxPosition(graph, rootNodeId, layout, uigraph, drop, startpos);
	    return uigraph;
	};


/***/ },
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const getTextSizeCanvas_1 = __webpack_require__(60);
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
/* 60 */
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
/* 61 */
/***/ function(module, exports) {

	"use strict";
	var NodeHelper;
	(function (NodeHelper) {
	    NodeHelper.nextNodeId = (nodesById) => {
	        let n = 0;
	        while (nodesById[`id${n}`]) {
	            n += 1;
	        }
	        return `id${n}`;
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
/* 62 */
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
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const NodeHelper_1 = __webpack_require__(61);
	const Immutable_1 = __webpack_require__(64);
	var GraphHelper;
	(function (GraphHelper) {
	    const createNode = NodeHelper_1.NodeHelper.create;
	    const nextNodeId = NodeHelper_1.NodeHelper.nextNodeId;
	    GraphHelper.create = (block) => {
	        const id = NodeHelper_1.NodeHelper.rootNodeId;
	        return Object.freeze({ nodesById: Object.freeze({ [id]: createNode(block._id, id, null) }),
	            nodes: Object.freeze([id])
	        });
	    };
	    GraphHelper.insert = function (graph, parentId, pos, child) {
	        const id = nextNodeId(graph.nodesById);
	        let g = graph;
	        // new information for the added element
	        g = Immutable_1.Immutable.update(g, 'nodesById', id, createNode(child._id, id, parentId));
	        g = Immutable_1.Immutable.update(g, 'nodesById', parentId, 'children', (children) => Immutable_1.Immutable.insert(children, pos, id));
	        g = Immutable_1.Immutable.update(g, 'nodes', (nodes) => Immutable_1.Immutable.append(nodes, id));
	        return g;
	    };
	    GraphHelper.append = function (graph, parentId, child) {
	        return GraphHelper.insert(graph, parentId, -1, child);
	    };
	})(GraphHelper = exports.GraphHelper || (exports.GraphHelper = {}));


/***/ },
/* 64 */
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
	    Immutable.aset = function (t, pos, s) {
	        const res = [];
	        const len = t.length;
	        let p = pos;
	        if (p >= len || p < 0) {
	            throw `Cannot set indice ${p} in array of length ${len}.`;
	        }
	        for (let i = 0; i < len; i += 1) {
	            if (i === p) {
	                res[i] = s;
	            }
	            else {
	                res[i] = t[i];
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
/* 65 */
/***/ function(module, exports) {

	module.exports = "export const render =\n( ctx, child ) => {\n  child ()\n}\n"

/***/ },
/* 66 */
/***/ function(module, exports) {

	module.exports = "export const render =\n( ctx ) => {\n\n}\n"

/***/ },
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
	const GraphHelper_1 = __webpack_require__(63);
	const NodeHelper_1 = __webpack_require__(61);
	const Block_1 = __webpack_require__(68);
	const rootId = NodeHelper_1.NodeHelper.rootNodeId;
	const SOURCE_A = ``;
	runner_1.describe('GraphHelper.create', (it) => {
	    const block = Block_1.BlockHelper.create('main');
	    const graph = GraphHelper_1.GraphHelper.create(block);
	    it('create node for block', (assert) => {
	        assert.equal(graph.nodesById[rootId], { id: rootId,
	            blockId: block._id,
	            parent: null,
	            children: []
	        });
	    });
	    it('create nodes entry', (assert) => {
	        assert.equal(graph.nodes, ['id0']);
	    });
	    it('should be immutable', (assert) => {
	        assert.throws(function () {
	            graph.nodesById['foo'] =
	                NodeHelper_1.NodeHelper.create('abc', 'idid', null);
	        });
	    });
	});
	runner_1.describe('GraphHelper.append', (it) => {
	    const block = Block_1.BlockHelper.create('main');
	    const graph = GraphHelper_1.GraphHelper.create(block);
	    const block2 = Block_1.BlockHelper.create('foo', SOURCE_A);
	    const graph2 = GraphHelper_1.GraphHelper.append(graph, 'id0', block2);
	    it('append child in parent', (assert) => {
	        assert.equal(graph2.nodesById['id0'].children, ['id1']);
	    });
	    it('add child in nodes', (assert) => {
	        assert.equal(graph2.nodes, ['id0', 'id1']);
	    });
	    it('add new node in nodesById', (assert) => {
	        assert.equal(graph2.nodesById['id1'], { id: 'id1',
	            blockId: block2._id,
	            parent: 'id0',
	            children: []
	        });
	    });
	});
	runner_1.describe('GraphHelper.insert', (it) => {
	    const block = Block_1.BlockHelper.create('main');
	    const graph = GraphHelper_1.GraphHelper.create(block);
	    const block1 = Block_1.BlockHelper.create('foo', SOURCE_A);
	    const block2 = Block_1.BlockHelper.create('bar', SOURCE_A);
	    let graph2 = GraphHelper_1.GraphHelper.insert(graph, 'id0', 0, block1);
	    graph2 = GraphHelper_1.GraphHelper.insert(graph2, 'id0', 0, block2);
	    it('insert child in parent', (assert) => {
	        assert.equal(graph2.nodesById['id0'].children, ['id2', 'id1']);
	    });
	    it('insert null', (assert) => {
	        let graph3 = GraphHelper_1.GraphHelper.insert(graph, 'id0', 1, block1);
	        assert.equal(graph3.nodesById['id0'].children, [null, 'id1']);
	    });
	    it('replace null', (assert) => {
	        let graph3 = GraphHelper_1.GraphHelper.insert(graph, 'id0', 1, block1);
	        graph3 = GraphHelper_1.GraphHelper.insert(graph2, 'id0', 0, block2);
	        assert.equal(graph2.nodesById['id0'].children, ['id2', 'id1']);
	    });
	    it('add child in nodes', (assert) => {
	        assert.equal(graph2.nodes, ['id0', 'id1', 'id2']);
	    });
	    it('set child nodesById', (assert) => {
	        assert.equal(graph2.nodesById['id1'], { blockId: block1._id, id: 'id1', parent: 'id0', children: [] });
	    });
	});


/***/ },
/* 68 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(41));
	__export(__webpack_require__(69));
	__export(__webpack_require__(72));
	const Model = __webpack_require__(73);
	const add_2 = __webpack_require__(69);
	const name_1 = __webpack_require__(74);
	const select_1 = __webpack_require__(76);
	const source_1 = __webpack_require__(77);
	const CurrentBlock = Model.monkey({ cursors: { blockById: ['data', 'block'],
	        id: ['user', 'blockId']
	    },
	    get(data) {
	        const blockById = data.blockById || {};
	        return blockById[data.id] || {};
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
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(70);
	const selectAction_1 = __webpack_require__(71);
	const Data_1 = __webpack_require__(5);
	exports.add = [addAction_1.addAction,
	    selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Graph_1 = __webpack_require__(54);
	const BlockHelper_1 = __webpack_require__(41);
	exports.addAction = ({ state, input, output }) => {
	    const { pos, parentId, ownerType, blockId } = input;
	    const owner = state.get([ownerType]);
	    let child;
	    if (blockId) {
	        child = BlockHelper_1.BlockHelper.copy(state.get(['data', 'block', blockId]));
	    }
	    else {
	        child = BlockHelper_1.BlockHelper.create('new block');
	    }
	    const graph = Graph_1.GraphHelper.insert(owner.graph, parentId, pos, child);
	    const ownerupdate = Object.assign({}, owner, { graph });
	    // triger name edit after object save
	    state.set(['$factory', 'editing'], child._id);
	    output({ docs: [child, ownerupdate], doc: child });
	};


/***/ },
/* 71 */
/***/ function(module, exports) {

	"use strict";
	exports.selectAction = ({ state, input: { doc, docs, _id }, output }) => {
	    const user = state.get(['user']);
	    if (doc) {
	        const sel = Object.assign({}, user, { blockId: doc._id });
	        if (docs) {
	            output({ docs: [...docs, sel] });
	        }
	        else {
	            output({ docs: [doc, sel] });
	        }
	    }
	    else {
	        // simple select
	        const sel = Object.assign({}, user, { blockId: _id });
	        output({ doc: sel });
	    }
	};


/***/ },
/* 72 */
/***/ function(module, exports) {

	"use strict";
	exports.AnySlot = 'any';


/***/ },
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(118);

/***/ },
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const nameAction_1 = __webpack_require__(75);
	const Data_1 = __webpack_require__(5);
	exports.name = [nameAction_1.nameAction,
	    ...Data_1.save
	];


/***/ },
/* 75 */
/***/ function(module, exports) {

	"use strict";
	exports.nameAction = ({ state, input: { value }, output }) => {
	    // prepare doc
	    const doc = Object.assign({}, state.get(['block']), { name: value });
	    const path = ['block', 'name'];
	    // close editable
	    state.set(['$factory', 'editing'], false);
	    // mark element as 'saving'
	    state.set(['$factory', ...path, 'saving'], true);
	    // temporary value during save
	    state.set(['$factory', ...path, 'value'], value);
	    output({ doc });
	};


/***/ },
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const selectAction_1 = __webpack_require__(71);
	const Data_1 = __webpack_require__(5);
	exports.select = 
	// prepare things to add
	[selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const sourceAction_1 = __webpack_require__(78);
	const Data_1 = __webpack_require__(5);
	exports.source = [sourceAction_1.sourceAction,
	    ...Data_1.save
	];


/***/ },
/* 78 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(68);
	exports.sourceAction = ({ state, input: { value }, output }) => {
	    // prepare doc
	    const doc = _1.BlockHelper.update(state.get(['block']), { source: value });
	    // close editable
	    /*
	    const path = [ 'block', 'source' ]
	    state.set ( [ '$factory', 'editing' ], false )
	    // mark element as 'saving'
	    state.set ( [ '$factory', ...path, 'saving' ], true )
	    // temporary value during save
	    state.set ( [ '$factory', ...path, 'value' ], value )
	    */
	    output({ doc });
	};


/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
	const Immutable_1 = __webpack_require__(64);
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
	    it('should not set outside array', (assert) => {
	        assert.throws(function () {
	            const a = [10, 20];
	            const b = 30;
	            Immutable_1.Immutable.aset(a, 3, b);
	        });
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
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
	const NodeHelper_1 = __webpack_require__(61);
	runner_1.describe('NodeHelper.create', (it) => {
	    it('should set defaults', (assert) => {
	        const node = NodeHelper_1.NodeHelper.create('blockxx', 'id0', 'pa');
	        assert.equal(node, { id: 'id0',
	            blockId: 'blockxx',
	            parent: 'pa',
	            children: []
	        });
	    });
	    it('should set values', (assert) => {
	        const node = NodeHelper_1.NodeHelper.create('blockxx', 'id99', 'id0', ['id7', 'id8']);
	        assert.equal(node, { id: 'id99',
	            blockId: 'blockxx',
	            parent: 'id0',
	            children: ['id7', 'id8']
	        });
	    });
	});
	runner_1.describe('NodeHelper.nextNodeHelperId', (it) => {
	    it('should return id0 on empty map', (assert) => {
	        assert.equal(NodeHelper_1.NodeHelper.nextNodeId({}), 'id0');
	    });
	    it('should return first free in graph', (assert) => {
	        const n = NodeHelper_1.NodeHelper.create('foo', '', '');
	        assert.equal(NodeHelper_1.NodeHelper.nextNodeId({ id0: n, id3: n }), 'id1');
	    });
	});


/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
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
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
	const status_1 = __webpack_require__(3);
	const Baobab = __webpack_require__(35);
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
/* 83 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(30);
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
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(85));
	const drag_1 = __webpack_require__(86);
	const drop_1 = __webpack_require__(88);
	const move_1 = __webpack_require__(90);
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
/* 85 */
/***/ function(module, exports) {

	"use strict";
	const MIN_DRAG_DIST = 4; // manhattan distance to trigger a drag
	const startDrag = (signals) => {
	    const doc = document.documentElement;
	    const dragel = document.getElementById('drag');
	    console.log('START DRAG', dragel);
	    let getElementUnderMouse;
	    if (dragel.tagName === 'svg') {
	        const baseclass = dragel.getAttribute('class');
	        const hidden = baseclass + ' drag-hide';
	        getElementUnderMouse = (e) => {
	            dragel.setAttribute('class', hidden);
	            const el = document.elementFromPoint(e.clientX, e.clientY);
	            dragel.setAttribute('class', baseclass);
	            return el;
	        };
	    }
	    else {
	        const baseclass = dragel.className;
	        const hidden = baseclass + ' drag-hide';
	        getElementUnderMouse = (e) => {
	            dragel.className = hidden;
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
	        console.log(target);
	        const clientPos = { x: e.clientX, y: e.clientY };
	        signals.$dragdrop.move({ move: { target, clientPos } });
	    };
	    const mouseup = (e) => {
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
	    DragDropHelper.drag = (signals, ownerType, uinode, click) => {
	        let evstate = 'up';
	        let clickpos, nodePos;
	        const mouseup = (e) => {
	            if (evstate === 'down') {
	                // Only handle simple click here. The drop operation happens in
	                // docup.
	                click(e);
	            }
	            evstate = 'up';
	        };
	        const mousedown = (e) => {
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
	                signals.$dragdrop.drag({ drag: { ownerType, uinode, nodePos } });
	                startDrag(signals);
	            }
	        };
	        return { mousedown, mousemove, mouseup };
	    };
	})(DragDropHelper = exports.DragDropHelper || (exports.DragDropHelper = {}));


/***/ },
/* 86 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const dragAction_1 = __webpack_require__(87);
	exports.drag = [dragAction_1.dragAction
	];


/***/ },
/* 87 */
/***/ function(module, exports) {

	"use strict";
	const path = ['$dragdrop', 'drag'];
	exports.dragAction = ({ state, input, output }) => {
	    const drag = input.drag;
	    state.set(path, drag);
	};


/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const dropAction_1 = __webpack_require__(89);
	const Block_1 = __webpack_require__(68);
	exports.drop = [dropAction_1.dropAction,
	    { add: [...Block_1.add],
	        move: [],
	        insert: [],
	        abort: []
	    }
	];


/***/ },
/* 89 */
/***/ function(module, exports) {

	"use strict";
	const dragPath = ['$dragdrop', 'drag'];
	const movePath = ['$dragdrop', 'move'];
	const dropPath = ['$dragdrop', 'drop'];
	exports.dropAction = ({ state, input, output }) => {
	    const drag = state.get(dragPath);
	    const drop = state.get(dropPath);
	    state.unset(dragPath);
	    state.unset(movePath);
	    const blockId = drag.uinode.blockId;
	    if (!drop) {
	        // Not dropping on a valid zone.
	        // Should it be a remove operation ?
	        return;
	    }
	    if (drop.ownerType === 'library') {
	        if (drag.ownerType === 'library') {
	        }
	        else {
	        }
	    }
	    else {
	        // graph operation
	        if (drop.operation === 'add') {
	            // add
	            output.add(Object.assign({}, drop, { blockId }));
	        }
	        else {
	        }
	        if (drop.ownerType === drag.ownerType) {
	            // move
	            output.move(drop);
	        }
	        else {
	        }
	    }
	};


/***/ },
/* 90 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const moveAction_1 = __webpack_require__(91);
	exports.move = [moveAction_1.moveAction
	];


/***/ },
/* 91 */
/***/ function(module, exports) {

	"use strict";
	const mpath = ['$dragdrop', 'move'];
	const dpath = ['$dragdrop', 'drop'];
	exports.moveAction = ({ state, input, output }) => {
	    const move = input.move;
	    const { target, clientPos } = move;
	    // If target is not set = no drop operation
	    let drop = null;
	    if (target) {
	        const [ownerType, nodeId, apos] = target.split('-');
	        let pos = null;
	        let operation = 'abort';
	        let parentId;
	        if (apos) {
	            parentId = nodeId;
	            operation = 'add';
	            pos = parseInt(apos);
	        }
	        else {
	            // find node in graph
	            const graph = state.get([ownerType, 'graph']);
	            const node = graph.nodesById[nodeId];
	            parentId = node.parent;
	            if (parentId) {
	                operation = 'insert';
	                const parent = graph.nodesById[parentId];
	                pos = parent.children.indexOf(nodeId);
	            }
	            else {
	                operation = null;
	            }
	        }
	        if (operation) {
	            // eventual drop operation
	            drop =
	                { operation,
	                    parentId,
	                    pos,
	                    ownerType
	                };
	        }
	    }
	    state.set(dpath, drop);
	    state.set(mpath, move);
	};


/***/ },
/* 92 */
/***/ function(module, exports) {

	"use strict";
	exports.Library = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ $rows: [{ name: 'Hello' },
	                { name: 'Lucy' },
	                { name: 'I am happy' },
	                { name: 'Life is good' }
	            ]
	        });
	        module.addSignals({});
	        return {}; // meta information
	    };
	};


/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(94));
	exports.Playback = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ $main: function () { },
	            $visible: true
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Graph_1 = __webpack_require__(54);
	const rootNodeId = Graph_1.NodeHelper.rootNodeId;
	const DUMMY = { 'text:string': 'dummy.emptyText'
	};
	const mainRender = (ctx, child) => {
	    if (child) {
	        child(ctx);
	    }
	};
	const mainCache = () => {
	    return { js: '',
	        render: mainRender,
	        curry: null
	    };
	};
	var PlaybackHelper;
	(function (PlaybackHelper) {
	    const clearCurry = (cache) => {
	        for (const k in cache) {
	            delete cache[k].curry;
	        }
	    };
	    const updateRender = (graph, blocksById, cache) => {
	        let shouldClear = false;
	        for (const nodeId of graph.nodes) {
	            const node = graph.nodesById[nodeId];
	            if (!node) {
	                throw (`Error in graph: missing '${nodeId}'.`);
	            }
	            const block = blocksById[node.blockId];
	            // main
	            let n = cache[nodeId];
	            if (nodeId == rootNodeId) {
	                if (!n) {
	                    cache[nodeId] = mainCache();
	                }
	                continue;
	            }
	            if (!n || n.js !== block.js) {
	                // clear curry cache
	                shouldClear = true;
	                if (!n) {
	                    n = cache[nodeId] = {};
	                }
	                else {
	                    // clear
	                    n.render = null;
	                }
	                try {
	                    const codefunc = new Function('exports', block.js);
	                    // We now run the code. The exports is the cache.
	                    codefunc(n);
	                    n.js = block.js;
	                }
	                catch (err) {
	                    // TODO: proper error handling
	                    console.log(`${block.name} error: ${err}`);
	                }
	                if (!n.render) {
	                    n.render = () => { console.log(`${block.name} error`); };
	                }
	            }
	        }
	        // Now every node has a render function
	        return shouldClear;
	    };
	    const updateCurry = (graph, cache, key) => {
	        const nc = cache[key];
	        if (!nc) {
	            console.log(graph, cache);
	            throw `Corrupt graph. Child '${key}' not in 'nodes'.`;
	        }
	        if (nc.curry) {
	            return nc.curry;
	        }
	        const render = nc.render;
	        const e = graph.nodesById[key];
	        if (!e) {
	            // corrupt graph
	            console.log(`Invalid child ${key} in graph (node not found).`);
	            return () => { };
	        }
	        // Depth-first processing.
	        const args = [];
	        for (const child of e.children) {
	            if (child === null) {
	                // FIXME: use a dummy input
	                args.push(() => ({}));
	            }
	            else {
	                const f = updateCurry(graph, cache, child);
	                args.push(f);
	            }
	        }
	        // Create the curry function
	        const curry = (ctx) => {
	            return render(ctx, ...args);
	        };
	        nc.curry = curry;
	        return curry;
	    };
	    PlaybackHelper.compile = (graph, blocksById, cache) => {
	        const output = [];
	        // update render functions for each node
	        const shouldClear = updateRender(graph, blocksById, cache.nodecache);
	        if (shouldClear || graph !== cache.oldgraph) {
	            // One of the files has changed or the graph has changed:
	            // we need to rebuild all curry functions.
	            clearCurry(cache.nodecache);
	            cache.main = updateCurry(graph, cache.nodecache, rootNodeId);
	            cache.oldgraph = graph;
	        }
	        return cache.main;
	    };
	})(PlaybackHelper = exports.PlaybackHelper || (exports.PlaybackHelper = {}));


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(96));
	const Model = __webpack_require__(73);
	const add_1 = __webpack_require__(107);
	const name_1 = __webpack_require__(109);
	const select_1 = __webpack_require__(112);
	const CurrentProject = Model.monkey({ cursors: { projectById: ['data', 'project'],
	        id: ['user', 'projectId']
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
/* 96 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Block_1 = __webpack_require__(68);
	const Factory_1 = __webpack_require__(42);
	const Graph_1 = __webpack_require__(54);
	const Scene_1 = __webpack_require__(97);
	var ProjectHelper;
	(function (ProjectHelper) {
	    ProjectHelper.create = () => {
	        const _id = Factory_1.makeId();
	        const block = Block_1.BlockHelper.main();
	        const graph = Graph_1.GraphHelper.create(block);
	        const scene = Scene_1.SceneHelper.create();
	        const project = Object.assign({ _id,
	            type: 'project',
	            name: 'New project',
	            graph
	        });
	        return { scene, block, project };
	    };
	    ProjectHelper.select = (state, user, project) => {
	        const nuser = Object.assign({}, user, { projectId: project._id,
	            sceneId: null,
	            blockId: null
	        });
	        const scenes = project.scenes || [];
	        const sceneId = scenes[0]; // can be null
	        if (sceneId) {
	            const scene = state.get['data', 'scene', sceneId];
	            if (scene) {
	                return Scene_1.SceneHelper.select(state, nuser, scene);
	            }
	        }
	        return nuser;
	    };
	})(ProjectHelper = exports.ProjectHelper || (exports.ProjectHelper = {}));


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(98));
	const Model = __webpack_require__(73);
	const add_1 = __webpack_require__(99);
	const name_1 = __webpack_require__(102);
	const remove_1 = __webpack_require__(104);
	const select_1 = __webpack_require__(106);
	const CurrentScene = Model.monkey({ cursors: { sceneById: ['data', 'scene'],
	        id: ['user', 'sceneId']
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
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Block_1 = __webpack_require__(68);
	const Factory_1 = __webpack_require__(42);
	const Graph_1 = __webpack_require__(54);
	var SceneHelper;
	(function (SceneHelper) {
	    SceneHelper.create = () => {
	        const _id = Factory_1.makeId();
	        const block = Block_1.BlockHelper.main();
	        const graph = Graph_1.GraphHelper.create(block);
	        const scene = Object.assign({ _id,
	            type: 'scene',
	            name: 'New scene',
	            graph
	        });
	        return { block, scene };
	    };
	    SceneHelper.select = (state, user, scene) => {
	        if (!scene) {
	            return Object.assign({}, user, { sceneId: null
	            });
	        }
	        // do not select block on scene change
	        return Object.assign({}, user, { sceneId: scene._id
	        });
	    };
	})(SceneHelper = exports.SceneHelper || (exports.SceneHelper = {}));


/***/ },
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(100);
	const selectAction_1 = __webpack_require__(101);
	const Data_1 = __webpack_require__(5);
	exports.add = [addAction_1.addAction,
	    selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Scene_1 = __webpack_require__(97);
	exports.addAction = ({ state, input: {  }, output }) => {
	    const { scene, block } = Scene_1.SceneHelper.create();
	    const docs = [block, scene];
	    // This is a flag that will set name editing after db object
	    // is selected.
	    state.set(['$factory', 'editing'], scene._id);
	    // add to project
	    const project = state.get(['project']);
	    const scenes = project.scenes || [];
	    const list = [...scenes, scene._id];
	    docs.push(Object.assign({}, project, { scenes: list }));
	    // we set doc for select operation
	    output({ docs, doc: scene });
	};


/***/ },
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(97);
	exports.selectAction = ({ state, input: { docs, doc, _id }, output }) => {
	    const user = state.get(['user']);
	    if (doc) {
	        // Editing project properties
	        if (!doc._rev) {
	            // New scene, we select it after creation.
	            const alldocs = docs ? [...docs] : [doc];
	            alldocs.push(_1.SceneHelper.select(state, user, doc));
	            output({ docs: alldocs });
	        }
	        else {
	        }
	    }
	    else {
	        // simple select
	        const scene = state.get(['data', 'scene', _id]);
	        const sel = _1.SceneHelper.select(state, user, scene);
	        if (sel) {
	            output({ doc: sel });
	        }
	    }
	};


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const nameAction_1 = __webpack_require__(103);
	const selectAction_1 = __webpack_require__(101);
	const Data_1 = __webpack_require__(5);
	exports.name = [nameAction_1.nameAction,
	    selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 103 */
/***/ function(module, exports) {

	"use strict";
	exports.nameAction = ({ state, input: { value }, output }) => {
	    // prepare doc
	    const doc = Object.assign({}, state.get(['scene']), { name: value });
	    const path = ['scene', 'name'];
	    // mark element as 'saving'
	    state.set(['$factory', ...path, 'saving'], true);
	    // temporary value during save
	    state.set(['$factory', ...path, 'value'], value);
	    output({ doc });
	};


/***/ },
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const removeAction_1 = __webpack_require__(105);
	const Data_1 = __webpack_require__(5);
	const Status_1 = __webpack_require__(20);
	exports.remove = [removeAction_1.removeAction,
	    { success: [...Data_1.save],
	        error: [Status_1.status]
	    }
	];


/***/ },
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(97);
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
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const selectAction_1 = __webpack_require__(101);
	const Data_1 = __webpack_require__(5);
	exports.select = 
	// prepare things to add
	[selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(108);
	const Data_1 = __webpack_require__(5);
	exports.add = [addAction_1.addAction,
	    ...Data_1.save
	];


/***/ },
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Project_1 = __webpack_require__(95);
	exports.addAction = ({ state, input: {  }, output }) => {
	    const { project, block, scene } = Project_1.ProjectHelper.create();
	    const docs = [scene.block, scene.scene, block, project];
	    // This is a flag that will set name editing after db object
	    // is selected.
	    state.set(['$factory', 'editing'], project._id);
	    // add to user's projects
	    const user = state.get(['user']);
	    const projects = [project._id, ...(user.projects || [])];
	    docs.push(Object.assign({}, user, { projectId: project._id, sceneId: scene.scene._id }));
	    output({ docs });
	};


/***/ },
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const nameAction_1 = __webpack_require__(110);
	const selectAction_1 = __webpack_require__(111);
	const Data_1 = __webpack_require__(5);
	exports.name = [nameAction_1.nameAction,
	    selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 110 */
/***/ function(module, exports) {

	"use strict";
	exports.nameAction = ({ state, input: { value }, output }) => {
	    // prepare doc
	    const doc = Object.assign({}, state.get(['project']), { name: value });
	    const path = ['project', 'name'];
	    // mark element as 'saving'
	    state.set(['$factory', ...path, 'saving'], true);
	    // temporary value during save
	    state.set(['$factory', ...path, 'value'], value);
	    output({ doc });
	};


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(95);
	exports.selectAction = ({ state, input: { docs, doc, _id }, output }) => {
	    const user = state.get(['user']) || {};
	    if (doc) {
	        // Editing project properties
	        if (!user.projectId || !doc._rev) {
	            // New project, we select it after creation.
	            const alldocs = docs ? [...docs] : [doc];
	            alldocs.push(_1.ProjectHelper.select(state, user, doc));
	            output({ docs: alldocs });
	        }
	        else {
	        }
	    }
	    else {
	        // simple select
	        const project = state.get(['data', 'project', _id]);
	        const sel = _1.ProjectHelper.select(state, user, project);
	        if (sel) {
	            output({ doc: sel });
	        }
	    }
	};


/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const selectAction_1 = __webpack_require__(111);
	const Data_1 = __webpack_require__(5);
	exports.select = 
	// prepare things to add
	[selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Model = __webpack_require__(73);
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
	        module.addSignals({});
	        return {}; // meta information
	    };
	};


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(115));
	__export(__webpack_require__(116));
	const changed_1 = __webpack_require__(117);
	exports.Sync = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ status: 'offline'
	        });
	        module.addSignals({ changed: changed_1.changed
	        });
	        // SyncHelper.start ( { controller, db } )
	        return {}; // meta information
	    };
	};


/***/ },
/* 115 */
/***/ function(module, exports) {

	"use strict";
	exports.start = [];


/***/ },
/* 116 */
/***/ function(module, exports) {

	"use strict";
	exports.stop = [];


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const changedAction_1 = __webpack_require__(118);
	const status_1 = __webpack_require__(3);
	exports.changed = [changedAction_1.changedAction,
	    { success: [], error: [status_1.status] }
	];


/***/ },
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(11);
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
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(1);

/***/ },
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(61);

/***/ },
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(100);

/***/ },
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(123);
	__webpack_require__(127);
	const Block_1 = __webpack_require__(129);
	const cerebral_view_snabbdom_1 = __webpack_require__(29);
	const Drag_1 = __webpack_require__(141);
	const Library_1 = __webpack_require__(147);
	const Login_1 = __webpack_require__(150);
	const Factory_1 = __webpack_require__(42);
	const Playback_1 = __webpack_require__(153);
	const Project_1 = __webpack_require__(157);
	const ProjectChooser_1 = __webpack_require__(163);
	const ProjectPane_1 = __webpack_require__(166);
	const Scene_1 = __webpack_require__(169);
	const StatusBar_1 = __webpack_require__(172);
	const StatusDetail_1 = __webpack_require__(181);
	// import { ToolsPane } from './ToolsPane'
	const appStateChooser = (state) => {
	    /*
	    if ( true ) {
	      return <Signup/>
	    }
	    else
	    */
	    // FIXME: it's time to use the router !!
	    if (!state.user) {
	        return cerebral_view_snabbdom_1.Component.createElement(Login_1.Login, {key: 'Login'});
	    }
	    else if (!state.project) {
	        return cerebral_view_snabbdom_1.Component.createElement(ProjectChooser_1.ProjectChooser, {key: 'ProjectChooser'});
	    }
	    else {
	        return cerebral_view_snabbdom_1.Component.createElement("div", null, 
	            cerebral_view_snabbdom_1.Component.createElement(Factory_1.Modal, {key: 'Modal'}), 
	            cerebral_view_snabbdom_1.Component.createElement("div", {class: 'Workbench'}, 
	                cerebral_view_snabbdom_1.Component.createElement(Playback_1.Playback, {key: 'playback'}), 
	                cerebral_view_snabbdom_1.Component.createElement("div", {class: 'stretch'}, 
	                    cerebral_view_snabbdom_1.Component.createElement(Project_1.Project, {key: 'Project'}), 
	                    cerebral_view_snabbdom_1.Component.createElement(Scene_1.Scene, {key: 'Scene'}), 
	                    cerebral_view_snabbdom_1.Component.createElement(Block_1.Block, {key: 'Block'}))), 
	            cerebral_view_snabbdom_1.Component.createElement(Library_1.Library, {key: 'Library'}), 
	            cerebral_view_snabbdom_1.Component.createElement(ProjectPane_1.ProjectPane, {key: 'ProjectPane'}), 
	            cerebral_view_snabbdom_1.Component.createElement(ProjectChooser_1.ProjectChooser, {key: 'ProjectChooser'}), 
	            cerebral_view_snabbdom_1.Component.createElement(StatusBar_1.StatusBar, {key: 'StatusBar'}), 
	            cerebral_view_snabbdom_1.Component.createElement(StatusDetail_1.StatusDetail, {key: 'StatusDetail'}), 
	            cerebral_view_snabbdom_1.Component.createElement(Drag_1.Drag, {key: 'Drag'}));
	    }
	};
	exports.App = cerebral_view_snabbdom_1.Component({ project: ['project'],
	    user: ['user']
	}, ({ state, signals }) => (cerebral_view_snabbdom_1.Component.createElement("div", null, appStateChooser(state))));


/***/ },
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(124);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "@keyframes blinker {\n  50% {\n    opacity: 0.0; } }\n\n@keyframes pulse {\n  from {\n    stroke: black;\n    fill: white;\n    transform: translateY(0px); }\n  to {\n    stroke: white;\n    fill: transparent;\n    transform: translateY(-3px); } }\n\n@keyframes detached {\n  0% {\n    stroke: black; }\n  50% {\n    stroke: black; }\n  100% {\n    stroke: #c80000; } }\n\n.blink {\n  animation: blinker 1s linear infinite; }\n\n.pulse {\n  animation: pulse 0.4s infinite alternate; }\n\n._detachedFx {\n  animation: detached 0.8s infinite alternate; }\n\nh1, h2, h3, p, .name, .fa {\n  font-size: 1em;\n  font-weight: normal;\n  line-height: 1.2em;\n  padding: 4px;\n  margin: 4px 0; }\n\n.fa {\n  margin: 0;\n  padding-right: 8px;\n  color: #333333;\n  transition: background-color 0.3s;\n  border-radius: 4px;\n  cursor: pointer; }\n  .fa:hover {\n    background: #151414; }\n\np {\n  margin: 0; }\n\n.EditableText {\n  cursor: text;\n  background-color: transparent;\n  border-bottom: 1px dashed #fff;\n  border-bottom-color: rgba(204, 204, 204, 0);\n  transition: border-bottom-color 0.8s, background-color 0.3s, color 0.3s; }\n  .EditableText input.fld {\n    border: none;\n    padding: 4px;\n    font: inherit;\n    background-color: transparent;\n    border-radius: 0;\n    width: 100%;\n    outline: none; }\n  .EditableText.active {\n    padding: 0;\n    background-color: #bd9368; }\n  .EditableText.saving {\n    color: white; }\n  .EditableText:hover {\n    border-bottom-color: rgba(26, 26, 26, 0.4); }\n\n._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list, .console {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p, .console p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect, .li {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\nhtml,\nbody,\nul,\nol {\n  margin: 0;\n  padding: 0;\n  list-style-type: none; }\n\nle-test div {\n  border: 1px solid grey;\n  padding: 4px;\n  background: #999;\n  margin: 4px; }\n\nle-test .container div {\n  background: #944; }\n\nhtml, body, #app {\n  margin: 0;\n  height: 100%; }\n\nbody {\n  font-family: \"Avenir Next\", \"Segoe ui\", \"Muli\", Helvetica, sans-serif;\n  font-size: 10pt;\n  background: #3d3838;\n  color: #000;\n  cursor: default; }\n\n.fld {\n  background: #807575;\n  border: none;\n  border-radius: 4px;\n  padding: 4px;\n  font: inherit; }\n\n._search, .search {\n  background: #4b4444;\n  padding: 4px;\n  border: 1px solid #353131;\n  position: relative; }\n  ._search p input, .search p input {\n    position: absolute;\n    top: 4px;\n    left: 4px;\n    width: 132px; }\n\n._saved, .search .saved {\n  padding: 4px; }\n  ._saved li, .search .saved li {\n    background: #585151;\n    display: inline-block;\n    border-radius: 4px;\n    border: 1px solid #353131;\n    margin: 2px;\n    text-align: center;\n    width: 1.4em; }\n    ._saved li.sel, .search .saved li.sel {\n      background: #71583e;\n      color: #000; }\n\n.li {\n  cursor: pointer;\n  color: #141414;\n  padding: 4px;\n  background: #585151;\n  border-bottom: 1px solid #353131; }\n  .li.drag {\n    padding: 0; }\n    .li.drag span {\n      padding: 4px; }\n      .li.drag span:before {\n        color: #222;\n        content: \":: \"; }\n  .li span {\n    display: block; }\n  .li.sel {\n    background: #71583e;\n    color: #000; }\n  .li.add {\n    background: none;\n    color: #585151;\n    border-bottom: none;\n    text-align: center;\n    font-weight: bold;\n    transition: background 0.5s, color 0.5s; }\n    .li.add:hover {\n      background: #585151;\n      color: #000; }\n\n._button, .refresh {\n  cursor: pointer; }\n\n.dragged {\n  opacity: 0.8;\n  border-width: 2px;\n  border-radius: 4px; }\n\n._drop .drag-enter {\n  background: #71583e;\n  color: #000;\n  cursor: copy; }\n\n.search {\n  border-right: 0; }\n\n.console {\n  border-right: 0;\n  position: relative; }\n  .console p input {\n    position: absolute;\n    top: 4px;\n    right: 4px;\n    width: 50%; }\n", ""]);
	
	// exports


/***/ },
/* 125 */
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
/* 126 */
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
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(128);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Workbench {\n  background: #3d3838;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column; }\n  .Workbench > .stretch {\n    flex-grow: 1;\n    display: flex; }\n  .Workbench .Pane {\n    overflow: hidden;\n    position: absolute;\n    left: 0;\n    margin-left: -1px;\n    width: 0px;\n    transition: width 0.1s;\n    border-bottom-right-radius: 4px; }\n    .Workbench .Pane.active {\n      width: 140px; }\n    .Workbench .Pane .wrap {\n      background: #383333;\n      box-shadow: inset 0 0 10px #232020;\n      padding: 4px; }\n", ""]);
	
	// exports


/***/ },
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(130);
	const Component_1 = __webpack_require__(28);
	const Editor_1 = __webpack_require__(132);
	const Factory_1 = __webpack_require__(42);
	// import { Graph } from '../Graph'
	const BlockName = Factory_1.editable(['block', 'name']);
	exports.Block = Component_1.Component({ block: ['block'],
	    editing: BlockName.path
	}, ({ state, signals }) => {
	    if (!state.block) {
	        return '';
	    }
	    return Component_1.Component.createElement("div", {class: 'Block'}, 
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
	        Component_1.Component.createElement(Editor_1.Editor, null));
	});


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(131);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Block {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 380px;\n  background: #232020;\n  border-top-left-radius: 4px; }\n  .Block .bar {\n    border-top-left-radius: 4px; }\n  .Block .CodeMirror {\n    height: 300px; }\n", ""]);
	
	// exports


/***/ },
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(133);
	const Component_1 = __webpack_require__(28);
	const CodeMirror = __webpack_require__(135);
	// JS mode
	__webpack_require__(136);
	// CSS
	__webpack_require__(137);
	__webpack_require__(139);
	// UGLY UI state...
	let code = null;
	let block;
	const FOOCODE = "// This is a comment\n\nexport const render =\n( a, b ) => {\n  // ... do something\n  return { text: '' }\n}";
	exports.Editor = Component_1.Component({ source: ['block', 'source'],
	    block: ['block']
	}, ({ state, signals }) => {
	    if (!state.block) {
	        return '';
	    }
	    const create = (_, { elm }) => {
	        if (code === null) {
	            code = false;
	            setTimeout(() => {
	                code = CodeMirror(elm, { value: state.source || '',
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
	    if (block !== state.block && code) {
	        block = state.block;
	        code.setValue(state.source || '');
	    }
	    return Component_1.Component.createElement("div", {class: 'Editor'}, 
	        Component_1.Component.createElement("div", {"hook-create": create})
	    );
	});


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(134);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n", ""]);
	
	// exports


/***/ },
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(139);

/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	
	// TODO actually recognize syntax of TypeScript constructs
	
	(function(mod) {
	  if (true) // CommonJS
	    mod(__webpack_require__(135));
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
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(138);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "/* BASICS */\n.CodeMirror {\n  /* Set height, width, borders, and global font properties here */\n  font-family: monospace;\n  height: 300px;\n  color: black; }\n\n/* PADDING */\n.CodeMirror-lines {\n  padding: 4px 0;\n  /* Vertical padding around content */ }\n\n.CodeMirror pre {\n  padding: 0 4px;\n  /* Horizontal padding of content */ }\n\n.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  background-color: white;\n  /* The little square between H and V scrollbars */ }\n\n/* GUTTER */\n.CodeMirror-gutters {\n  border-right: 1px solid #ddd;\n  background-color: #f7f7f7;\n  white-space: nowrap; }\n\n.CodeMirror-linenumber {\n  padding: 0 3px 0 5px;\n  min-width: 20px;\n  text-align: right;\n  color: #999;\n  white-space: nowrap; }\n\n.CodeMirror-guttermarker {\n  color: black; }\n\n.CodeMirror-guttermarker-subtle {\n  color: #999; }\n\n/* CURSOR */\n.CodeMirror-cursor {\n  border-left: 1px solid black;\n  border-right: none;\n  width: 0; }\n\n/* Shown when moving in bi-directional text */\n.CodeMirror div.CodeMirror-secondarycursor {\n  border-left: 1px solid silver; }\n\n.cm-fat-cursor .CodeMirror-cursor {\n  width: auto;\n  border: 0 !important;\n  background: #7e7; }\n\n.cm-fat-cursor div.CodeMirror-cursors {\n  z-index: 1; }\n\n.cm-animate-fat-cursor {\n  width: auto;\n  border: 0;\n  -webkit-animation: blink 1.06s steps(1) infinite;\n  -moz-animation: blink 1.06s steps(1) infinite;\n  animation: blink 1.06s steps(1) infinite;\n  background-color: #7e7; }\n\n@-moz-keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n@-webkit-keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n@keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n/* Can style cursor different in overwrite (non-insert) mode */\n.cm-tab {\n  display: inline-block;\n  text-decoration: inherit; }\n\n.CodeMirror-ruler {\n  border-left: 1px solid #ccc;\n  position: absolute; }\n\n/* DEFAULT THEME */\n.cm-s-default .cm-header {\n  color: blue; }\n\n.cm-s-default .cm-quote {\n  color: #090; }\n\n.cm-negative {\n  color: #d44; }\n\n.cm-positive {\n  color: #292; }\n\n.cm-header, .cm-strong {\n  font-weight: bold; }\n\n.cm-em {\n  font-style: italic; }\n\n.cm-link {\n  text-decoration: underline; }\n\n.cm-strikethrough {\n  text-decoration: line-through; }\n\n.cm-s-default .cm-keyword {\n  color: #708; }\n\n.cm-s-default .cm-atom {\n  color: #219; }\n\n.cm-s-default .cm-number {\n  color: #164; }\n\n.cm-s-default .cm-def {\n  color: #00f; }\n\n.cm-s-default .cm-variable-2 {\n  color: #05a; }\n\n.cm-s-default .cm-variable-3 {\n  color: #085; }\n\n.cm-s-default .cm-comment {\n  color: #a50; }\n\n.cm-s-default .cm-string {\n  color: #a11; }\n\n.cm-s-default .cm-string-2 {\n  color: #f50; }\n\n.cm-s-default .cm-meta {\n  color: #555; }\n\n.cm-s-default .cm-qualifier {\n  color: #555; }\n\n.cm-s-default .cm-builtin {\n  color: #30a; }\n\n.cm-s-default .cm-bracket {\n  color: #997; }\n\n.cm-s-default .cm-tag {\n  color: #170; }\n\n.cm-s-default .cm-attribute {\n  color: #00c; }\n\n.cm-s-default .cm-hr {\n  color: #999; }\n\n.cm-s-default .cm-link {\n  color: #00c; }\n\n.cm-s-default .cm-error {\n  color: #f00; }\n\n.cm-invalidchar {\n  color: #f00; }\n\n.CodeMirror-composing {\n  border-bottom: 2px solid; }\n\n/* Default styles for common addons */\ndiv.CodeMirror span.CodeMirror-matchingbracket {\n  color: #0f0; }\n\ndiv.CodeMirror span.CodeMirror-nonmatchingbracket {\n  color: #f22; }\n\n.CodeMirror-matchingtag {\n  background: rgba(255, 150, 0, 0.3); }\n\n.CodeMirror-activeline-background {\n  background: #e8f2ff; }\n\n/* STOP */\n/* The rest of this file contains styles related to the mechanics of\n   the editor. You probably shouldn't touch them. */\n.CodeMirror {\n  position: relative;\n  overflow: hidden;\n  background: white; }\n\n.CodeMirror-scroll {\n  overflow: scroll !important;\n  /* Things will break if this is overridden */\n  /* 30px is the magic margin used to hide the element's real scrollbars */\n  /* See overflow: hidden in .CodeMirror */\n  margin-bottom: -30px;\n  margin-right: -30px;\n  padding-bottom: 30px;\n  height: 100%;\n  outline: none;\n  /* Prevent dragging from highlighting the element */\n  position: relative; }\n\n.CodeMirror-sizer {\n  position: relative;\n  border-right: 30px solid transparent; }\n\n/* The fake, visible scrollbars. Used to force redraw during scrolling\n   before actual scrolling happens, thus preventing shaking and\n   flickering artifacts. */\n.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  position: absolute;\n  z-index: 6;\n  display: none; }\n\n.CodeMirror-vscrollbar {\n  right: 0;\n  top: 0;\n  overflow-x: hidden;\n  overflow-y: scroll; }\n\n.CodeMirror-hscrollbar {\n  bottom: 0;\n  left: 0;\n  overflow-y: hidden;\n  overflow-x: scroll; }\n\n.CodeMirror-scrollbar-filler {\n  right: 0;\n  bottom: 0; }\n\n.CodeMirror-gutter-filler {\n  left: 0;\n  bottom: 0; }\n\n.CodeMirror-gutters {\n  position: absolute;\n  left: 0;\n  top: 0;\n  min-height: 100%;\n  z-index: 3; }\n\n.CodeMirror-gutter {\n  white-space: normal;\n  height: 100%;\n  display: inline-block;\n  vertical-align: top;\n  margin-bottom: -30px;\n  /* Hack to make IE7 behave */\n  *zoom: 1;\n  *display: inline; }\n\n.CodeMirror-gutter-wrapper {\n  position: absolute;\n  z-index: 4;\n  background: none !important;\n  border: none !important; }\n\n.CodeMirror-gutter-background {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 4; }\n\n.CodeMirror-gutter-elt {\n  position: absolute;\n  cursor: default;\n  z-index: 4; }\n\n.CodeMirror-gutter-wrapper {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none; }\n\n.CodeMirror-lines {\n  cursor: text;\n  min-height: 1px;\n  /* prevents collapsing before first draw */ }\n\n.CodeMirror pre {\n  /* Reset some styles that the rest of the page might have set */\n  -moz-border-radius: 0;\n  -webkit-border-radius: 0;\n  border-radius: 0;\n  border-width: 0;\n  background: transparent;\n  font-family: inherit;\n  font-size: inherit;\n  margin: 0;\n  white-space: pre;\n  word-wrap: normal;\n  line-height: inherit;\n  color: inherit;\n  z-index: 2;\n  position: relative;\n  overflow: visible;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none; }\n\n.CodeMirror-wrap pre {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  word-break: normal; }\n\n.CodeMirror-linebackground {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  z-index: 0; }\n\n.CodeMirror-linewidget {\n  position: relative;\n  z-index: 2;\n  overflow: auto; }\n\n.CodeMirror-code {\n  outline: none; }\n\n/* Force content-box sizing for the elements where we expect it */\n.CodeMirror-scroll,\n.CodeMirror-sizer,\n.CodeMirror-gutter,\n.CodeMirror-gutters,\n.CodeMirror-linenumber {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box; }\n\n.CodeMirror-measure {\n  position: absolute;\n  width: 100%;\n  height: 0;\n  overflow: hidden;\n  visibility: hidden; }\n\n.CodeMirror-cursor {\n  position: absolute; }\n\n.CodeMirror-measure pre {\n  position: static; }\n\ndiv.CodeMirror-cursors {\n  visibility: hidden;\n  position: relative;\n  z-index: 3; }\n\ndiv.CodeMirror-dragcursors {\n  visibility: visible; }\n\n.CodeMirror-focused div.CodeMirror-cursors {\n  visibility: visible; }\n\n.CodeMirror-selected {\n  background: #d9d9d9; }\n\n.CodeMirror-focused .CodeMirror-selected {\n  background: #d7d4f0; }\n\n.CodeMirror-crosshair {\n  cursor: crosshair; }\n\n.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection {\n  background: #d7d4f0; }\n\n.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection {\n  background: #d7d4f0; }\n\n.cm-searching {\n  background: #ffa;\n  background: rgba(255, 255, 0, 0.4); }\n\n/* IE7 hack to prevent it from returning funny offsetTops on the spans */\n.CodeMirror span {\n  *vertical-align: text-bottom; }\n\n/* Used to force a border model for a node */\n.cm-force-border {\n  padding-right: .1px; }\n\n@media print {\n  /* Hide the cursor when printing */\n  .CodeMirror div.CodeMirror-cursors {\n    visibility: hidden; } }\n\n/* See issue #2901 */\n.cm-tab-wrap-hack:after {\n  content: ''; }\n\n/* Help users use markselection to safely style text background */\nspan.CodeMirror-selectedtext {\n  background: none; }\n", ""]);
	
	// exports


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(140);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "/*\n\n    Name:       Bespin\n    Author:     Mozilla / Jan T. Sott\n\n    CodeMirror template by Jan T. Sott (https://github.com/idleberg/base16-codemirror)\n    Original Base16 color scheme by Chris Kempson (https://github.com/chriskempson/base16)\n\n*/\n.cm-s-bespin.CodeMirror {\n  background: #28211c;\n  color: #9d9b97; }\n\n.cm-s-bespin div.CodeMirror-selected {\n  background: #36312e !important; }\n\n.cm-s-bespin .CodeMirror-gutters {\n  background: #28211c;\n  border-right: 0px; }\n\n.cm-s-bespin .CodeMirror-linenumber {\n  color: #666666; }\n\n.cm-s-bespin .CodeMirror-cursor {\n  border-left: 1px solid #797977 !important; }\n\n.cm-s-bespin span.cm-comment {\n  color: #937121; }\n\n.cm-s-bespin span.cm-atom {\n  color: #9b859d; }\n\n.cm-s-bespin span.cm-number {\n  color: #9b859d; }\n\n.cm-s-bespin span.cm-property, .cm-s-bespin span.cm-attribute {\n  color: #54be0d; }\n\n.cm-s-bespin span.cm-keyword {\n  color: #cf6a4c; }\n\n.cm-s-bespin span.cm-string {\n  color: #f9ee98; }\n\n.cm-s-bespin span.cm-variable {\n  color: #54be0d; }\n\n.cm-s-bespin span.cm-variable-2 {\n  color: #5ea6ea; }\n\n.cm-s-bespin span.cm-def {\n  color: #cf7d34; }\n\n.cm-s-bespin span.cm-error {\n  background: #cf6a4c;\n  color: #797977; }\n\n.cm-s-bespin span.cm-bracket {\n  color: #9d9b97; }\n\n.cm-s-bespin span.cm-tag {\n  color: #cf6a4c; }\n\n.cm-s-bespin span.cm-link {\n  color: #9b859d; }\n\n.cm-s-bespin .CodeMirror-matchingbracket {\n  text-decoration: underline;\n  color: white !important; }\n\n.cm-s-bespin .CodeMirror-activeline-background {\n  background: #404040; }\n", ""]);
	
	// exports


/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(142);
	const Component_1 = __webpack_require__(28);
	const Node_1 = __webpack_require__(144);
	exports.Drag = Component_1.Component({ drag: ['$dragdrop', 'drag'],
	    move: ['$dragdrop', 'move']
	}, ({ state, signals }) => {
	    const drag = state.drag;
	    const move = state.move;
	    const klass = { Drag: true };
	    if (!drag || !move) {
	        return Component_1.Component.createElement("svg", {id: 'drag', class: klass});
	    }
	    const uinode = drag.uinode;
	    const x = move.clientPos.x - uinode.pos.x - drag.nodePos.x;
	    const y = move.clientPos.y - uinode.pos.y - drag.nodePos.y;
	    const style = { top: y, left: x };
	    return Component_1.Component.createElement("svg", {id: 'drag', class: klass, style: style}, 
	        Component_1.Component.createElement(Node_1.Node, {ownerType: 'drag', uinode: uinode})
	    );
	});


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(143);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 143 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, ".Drag {\n  position: fixed;\n  display: block;\n  opacity: 0.8;\n  pointer-events: none;\n  cursor: grabbing;\n  cursor: -moz-grabbing;\n  cursor: -webkit-grabbing; }\n  .Drag.drag-hide {\n    display: none; }\n", ""]);
	
	// exports


/***/ },
/* 144 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(145);
	const Component_1 = __webpack_require__(28);
	const DragDrop_1 = __webpack_require__(84);
	const makeSlot = (slot, datainfo, clbk) => {
	    const flags = slot.flags;
	    const { x, y } = slot.pos;
	    const klass = Object.assign({}, flags, { slot: true });
	    const slotinfo = `${datainfo}-${slot.idx}`;
	    const transform = `translate(${x}, ${y})`;
	    if (flags.free) {
	        return Component_1.Component.createElement("g", {transform: transform}, 
	            Component_1.Component.createElement("path", {d: slot.plus, class: 'plus'}), 
	            Component_1.Component.createElement("path", {d: slot.click, "data-drop": slotinfo, "on-click": () => clbk(slot.idx), class: 'click'}));
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
	    const ownerType = props.ownerType;
	    const x = uinode.pos.x;
	    const y = uinode.pos.y;
	    const transform = `translate(${x},${y})`;
	    const datainfo = `${ownerType}-${uinode.id}`;
	    const klass = { sel: uinode.blockId === state.blockId,
	        [uinode.className]: true
	    };
	    const { mousedown, mousemove, mouseup } = DragDrop_1.DragDropHelper.drag(signals, ownerType, uinode, (e) => {
	        signals.block.select({ _id: uinode.blockId });
	    });
	    const slotclick = (pos) => {
	        signals.block.add({ pos,
	            parentId: uinode.id,
	            ownerType
	        });
	    };
	    return Component_1.Component.createElement("g", {transform: transform}, 
	        Component_1.Component.createElement("path", {d: uinode.path, class: klass, "data-drop": datainfo, "on-mousedown": mousedown, "on-mouseup": mouseup, "on-mousemove": mousemove}), 
	        Component_1.Component.createElement("text", {x: uinode.size.tx, y: uinode.size.ty}, uinode.name), 
	        uinode.slots.map((s) => makeSlot(s, datainfo, slotclick)));
	});


/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(146);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 146 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "@keyframes blinker {\n  50% {\n    opacity: 0.0; } }\n\n@keyframes pulse {\n  from {\n    stroke: black;\n    fill: white;\n    transform: translateY(0px); }\n  to {\n    stroke: white;\n    fill: transparent;\n    transform: translateY(-3px); } }\n\n@keyframes detached {\n  0% {\n    stroke: black; }\n  50% {\n    stroke: black; }\n  100% {\n    stroke: #c80000; } }\n\n.blink {\n  animation: blinker 1s linear infinite; }\n\n.pulse {\n  animation: pulse 0.4s infinite alternate; }\n\n._detachedFx, svg .slot.detached {\n  animation: detached 0.8s infinite alternate; }\n\n._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect, svg * {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\nsvg path.box1 {\n  fill: #756b4e;\n  cursor: pointer; }\n  svg path.box1:hover {\n    fill: #8e815f; }\n  svg path.box1.dark {\n    fill: #222222; }\n  svg path.box1.sel {\n    fill: #db8b3a; }\n\n.li.box1 {\n  background: #907e4d; }\n\nsvg path.box2 {\n  fill: #6c754e;\n  cursor: pointer; }\n  svg path.box2:hover {\n    fill: #838e5f; }\n  svg path.box2.dark {\n    fill: #222222; }\n  svg path.box2.sel {\n    fill: #db8b3a; }\n\n.li.box2 {\n  background: #80904d; }\n\nsvg path.box3 {\n  fill: #59754e;\n  cursor: pointer; }\n  svg path.box3:hover {\n    fill: #6b8e5f; }\n  svg path.box3.dark {\n    fill: #222222; }\n  svg path.box3.sel {\n    fill: #db8b3a; }\n\n.li.box3 {\n  background: #5f904d; }\n\nsvg path.box4 {\n  fill: #4e7557;\n  cursor: pointer; }\n  svg path.box4:hover {\n    fill: #5f8e69; }\n  svg path.box4.dark {\n    fill: #222222; }\n  svg path.box4.sel {\n    fill: #db8b3a; }\n\n.li.box4 {\n  background: #4d905d; }\n\nsvg path.box5 {\n  fill: #4e756b;\n  cursor: pointer; }\n  svg path.box5:hover {\n    fill: #5f8e81; }\n  svg path.box5.dark {\n    fill: #222222; }\n  svg path.box5.sel {\n    fill: #db8b3a; }\n\n.li.box5 {\n  background: #4d907e; }\n\nsvg path.box6 {\n  fill: #4e6c75;\n  cursor: pointer; }\n  svg path.box6:hover {\n    fill: #5f838e; }\n  svg path.box6.dark {\n    fill: #222222; }\n  svg path.box6.sel {\n    fill: #db8b3a; }\n\n.li.box6 {\n  background: #4d8090; }\n\nsvg path.box7 {\n  fill: #4e5975;\n  cursor: pointer; }\n  svg path.box7:hover {\n    fill: #5f6b8e; }\n  svg path.box7.dark {\n    fill: #222222; }\n  svg path.box7.sel {\n    fill: #db8b3a; }\n\n.li.box7 {\n  background: #4d5f90; }\n\nsvg path.box8 {\n  fill: #574e75;\n  cursor: pointer; }\n  svg path.box8:hover {\n    fill: #695f8e; }\n  svg path.box8.dark {\n    fill: #222222; }\n  svg path.box8.sel {\n    fill: #db8b3a; }\n\n.li.box8 {\n  background: #5d4d90; }\n\nsvg path.box9 {\n  fill: #6b4e75;\n  cursor: pointer; }\n  svg path.box9:hover {\n    fill: #815f8e; }\n  svg path.box9.dark {\n    fill: #222222; }\n  svg path.box9.sel {\n    fill: #db8b3a; }\n\n.li.box9 {\n  background: #7e4d90; }\n\nsvg path.box10 {\n  fill: #754e6c;\n  cursor: pointer; }\n  svg path.box10:hover {\n    fill: #8e5f83; }\n  svg path.box10.dark {\n    fill: #222222; }\n  svg path.box10.sel {\n    fill: #db8b3a; }\n\n.li.box10 {\n  background: #904d80; }\n\nsvg path.box11 {\n  fill: #754e59;\n  cursor: pointer; }\n  svg path.box11:hover {\n    fill: #8e5f6b; }\n  svg path.box11.dark {\n    fill: #222222; }\n  svg path.box11.sel {\n    fill: #db8b3a; }\n\n.li.box11 {\n  background: #904d5f; }\n\nsvg path.box12 {\n  fill: #75574e;\n  cursor: pointer; }\n  svg path.box12:hover {\n    fill: #8e695f; }\n  svg path.box12.dark {\n    fill: #222222; }\n  svg path.box12.sel {\n    fill: #db8b3a; }\n\n.li.box12 {\n  background: #905d4d; }\n\nsvg .slot {\n  fill: none;\n  stroke: black;\n  stroke-width: 1px; }\n  svg .slot.detached {\n    stroke-width: 3px;\n    stroke: black;\n    transform: translateY(-1px); }\n\nsvg .plus {\n  fill: none;\n  stroke: #302c2c;\n  stroke-width: 1px;\n  cursor: pointer; }\n\nsvg .click {\n  fill: transparent;\n  transition: fill 0.8s;\n  stroke: none;\n  cursor: pointer; }\n  svg .click:hover, svg .click.active {\n    fill: rgba(0, 0, 0, 0.3); }\n\nsvg text {\n  pointer-events: none;\n  font-size: getfont(size);\n  fill: #000; }\n  svg text.scene {\n    fill: #d98632; }\n  svg text.ghost {\n    opacity: 0.2; }\n\nsvg path {\n  stroke-width: 1px;\n  stroke: black; }\n  svg path.scene {\n    cursor: pointer;\n    fill: #3d3838; }\n    svg path.scene:hover {\n      fill: #4b4444; }\n    svg path.scene.sel {\n      fill: #db8b3a; }\n  svg path.ghost {\n    fill: #3d3838;\n    opacity: 0.3; }\n\nsvg#files {\n  border: 2px dashed transparent; }\n  svg#files.drag-over {\n    border-color: #71583e; }\n\nsvg#scratch {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: -999;\n  opacity: 0; }\n", ""]);
	
	// exports


/***/ },
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(148);
	const Component_1 = __webpack_require__(28);
	const Factory_1 = __webpack_require__(42);
	const renderLibrary = (el) => (Component_1.Component.createElement("div", {class: 'li'}, 
	    Component_1.Component.createElement("span", null, el.name)
	));
	const Pane = Factory_1.pane('library');
	exports.Library = Component_1.Component({ rows: ['library', '$rows'],
	    status: ['$status', 'list'],
	    active: Pane.path
	}, ({ state, signals }) => (Component_1.Component.createElement(Pane, {class: 'Library'}, 
	    Component_1.Component.createElement(Pane.toggle, {class: 'fbar bar'}, 
	        Component_1.Component.createElement("div", {class: 'fa fa-book'}), 
	        Component_1.Component.createElement("div", {class: 'name'}, "Library"), 
	        Component_1.Component.createElement("div", {class: 'rarrow'})), 
	    Component_1.Component.createElement(Pane.toggle, {class: 'bar'}, 
	        Component_1.Component.createElement("div", {class: 'spacer'}), 
	        Component_1.Component.createElement("div", {class: 'larrow'}), 
	        " "), 
	    Component_1.Component.createElement("div", {class: 'search'}, 
	        Component_1.Component.createElement("p", null, 
	            " ", 
	            Component_1.Component.createElement("input", {value: 'search', class: 'fld'}))
	    ), 
	    Component_1.Component.createElement("div", {class: 'results'}, 
	        Component_1.Component.createElement("div", null, state.rows.map(renderLibrary))
	    ))));


/***/ },
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(149);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 149 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane, .Library {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap, .Library .wrap {\n    overflow: visible; }\n  ._pane .bar, .Library .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow, .Library .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow, .Library .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar, .Library .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow, .Library .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow, .Library .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, .Library .bar .fa, ._pane .bar .name, .Library .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name, .Library .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover, .Library .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer, .Library .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow, .Library .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow, .Library .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Library {\n  left: -168px;\n  transition: left 0.2s;\n  border-bottom-right-radius: 4px;\n  padding-bottom: 4px; }\n  .Library .bar {\n    flex-direction: row-reverse; }\n    .Library .bar.fbar {\n      flex-direction: row;\n      left: 0; }\n  .Library.active {\n    left: 0; }\n  .Library .results {\n    min-height: 200px;\n    max-height: 400px; }\n    .Library .results .li {\n      padding-left: 12px; }\n", ""]);
	
	// exports


/***/ },
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(151);
	const Component_1 = __webpack_require__(28);
	exports.Login = Component_1.Component({}, ({ signals }) => (Component_1.Component.createElement("div", {class: 'Login'}, 
	    Component_1.Component.createElement("div", {class: 'wrap'}, 
	        Component_1.Component.createElement("h3", null, "Please login"), 
	        Component_1.Component.createElement("div", null, "todo"))
	)));


/***/ },
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(152);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ },
/* 153 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(154);
	const Component_1 = __webpack_require__(28);
	const Playback_1 = __webpack_require__(93);
	const cache = { nodecache: {} };
	/* ====== PLAYBACK LIBS ======= */
	const THREE = __webpack_require__(156);
	window['THREE'] = THREE;
	/* ====== PLAYBACK LIBS ======= */
	exports.Playback = Component_1.Component({ graph: ['scene', 'graph'],
	    blocksById: ['data', 'block']
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
	    if (state.graph) {
	        const func = Playback_1.PlaybackHelper.compile(state.graph, state.blocksById, cache);
	        console.log('play once MOTHER and FATHER');
	        try {
	            const context = {};
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
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(155);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 155 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Playback {\n  background: #232020;\n  color: #999999;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%; }\n  .Playback .wrap {\n    position: relative; }\n  .Playback .Screen {\n    position: absolute; }\n    .Playback .Screen #screen {\n      background: black;\n      width: 100%;\n      height: 100%; }\n    .Playback .Screen svg {\n      position: absolute;\n      top: 0;\n      left: 0; }\n  .Playback .tv rect {\n    stroke: #333333;\n    stroke-width: 1px;\n    fill: none; }\n", ""]);
	
	// exports


/***/ },
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(99);

/***/ },
/* 157 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(158);
	const Component_1 = __webpack_require__(28);
	const Factory_1 = __webpack_require__(42);
	const Graph_1 = __webpack_require__(160);
	const ProjectName = Factory_1.editable(['project', 'name']);
	const ProjectOptions = Factory_1.pane('project-opts');
	exports.Project = Component_1.Component({ graph: ['project', 'graph'],
	    project: ['project'],
	    editing: ProjectName.path,
	    pane: ProjectOptions.path,
	    blockId: ['block', '_id'],
	    blockName: ['block', 'name'],
	    move: ['$dragdrop', 'drop']
	}, ({ state, signals }) => (Component_1.Component.createElement("div", {class: 'Project'}, 
	    Component_1.Component.createElement("div", {class: 'bar'}, 
	        Component_1.Component.createElement(ProjectOptions.toggle, {class: 'fa fa-diamond'}), 
	        Component_1.Component.createElement(ProjectName, {class: 'name'})), 
	    Component_1.Component.createElement(ProjectOptions, null, 
	        Component_1.Component.createElement("div", {class: 'button delete'}, "delete"), 
	        Component_1.Component.createElement("div", {class: 'button'}, "duplicate")), 
	    Component_1.Component.createElement(Graph_1.Graph, {key: 'project.graph', ownerType: 'project', graph: state.graph}))));


/***/ },
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(159);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 159 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Project {\n  width: 200px;\n  height: 100%;\n  border: 1px solid #353131;\n  border-width: 1px 0 0 0; }\n  .Project .name {\n    color: #d98632; }\n", ""]);
	
	// exports


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(161);
	const Component_1 = __webpack_require__(28);
	const Graph_1 = __webpack_require__(54);
	const Node_1 = __webpack_require__(144);
	const mapUINodes = (graph, uigraph, ownerType) => {
	    const nodes = graph.nodes;
	    const uiNodeById = uigraph.uiNodeById;
	    const key = `Node-${ownerType}-`;
	    return nodes.map((n) => {
	        const uinode = uiNodeById[n];
	        return Component_1.Component.createElement(Node_1.Node, {key: key + uinode.id, uinode: uinode, ownerType: ownerType});
	    });
	};
	exports.Graph = Component_1.Component({ blocksById: ['data', 'block'],
	    blockId: ['user', 'blockId'],
	    blockName: ['block', 'name'],
	    drop: ['$dragdrop', 'drop'] // react to drag op
	}, ({ props, state, signals }) => {
	    const ownerType = props.ownerType;
	    const graph = props.graph;
	    const drop = state.drop;
	    if (graph) {
	        // Could we get rid of blocksById dependency ? Or just
	        // pass the required elements from 'scene' to avoid redraw if
	        // any existing block changes ?
	        let dropinfo;
	        if (drop && drop.ownerType === ownerType) {
	            dropinfo = drop;
	        }
	        const uigraph = Graph_1.uimap(graph, state.blocksById, dropinfo);
	        return Component_1.Component.createElement("svg", {class: 'Graph'}, mapUINodes(graph, uigraph, ownerType));
	    }
	    else {
	        return '';
	    }
	});


/***/ },
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(162);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 162 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Graph {\n  margin-left: 16px;\n  flex-grow: 1; }\n  .Graph svg {\n    width: 100%;\n    height: 100%; }\n", ""]);
	
	// exports


/***/ },
/* 163 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(164);
	const cerebral_view_snabbdom_1 = __webpack_require__(29);
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
	    return list.map((project) => (cerebral_view_snabbdom_1.Component.createElement("div", {class: { li: true,
	        sel: project._id === selectedProjectId
	    }, "on-click": () => selectProject(signals, project._id)}, 
	        cerebral_view_snabbdom_1.Component.createElement("div", {class: 'fa fa-film'}), 
	        project.name)));
	};
	exports.ProjectChooser = cerebral_view_snabbdom_1.Component({ projectsById: ['data', 'project'],
	    selectedProjectId: ['user', 'projectId'],
	    hasProject: ['project']
	}, ({ state, signals }) => (cerebral_view_snabbdom_1.Component.createElement("div", {class: { ProjectChooser: true, Modal: true, active: !state.hasProject }}, 
	    cerebral_view_snabbdom_1.Component.createElement("div", {class: 'wrap'}, 
	        cerebral_view_snabbdom_1.Component.createElement("p", {class: 'message'}, "Select project"), 
	        cerebral_view_snabbdom_1.Component.createElement("div", {class: 'list'}, 
	            showProjects(state, signals), 
	            cerebral_view_snabbdom_1.Component.createElement("div", {class: 'li add', "on-click": () => signals.project.add({})}, "+")))
	)));


/***/ },
/* 164 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(165);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.ProjectChooser .wrap {\n  width: 300px; }\n", ""]);
	
	// exports


/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(167);
	const Component_1 = __webpack_require__(28);
	const Factory_1 = __webpack_require__(42);
	const selectScene = (signals, _id) => {
	    signals.scene.select({ _id });
	};
	const sortByName = (a, b) => a.name > b.name ? 1 : -1;
	let oldprops;
	const showScenes = ({ scenes, sceneById, selectedSceneId }, signals) => {
	    console.log('showScenes');
	    if (!scenes || !sceneById) {
	        return '';
	    }
	    const list = scenes.map((id) => sceneById[id] || {});
	    list.sort(sortByName);
	    return list.map((scene) => (Component_1.Component.createElement("div", {class: { li: true,
	        sel: scene._id === selectedSceneId
	    }, "on-click": () => selectScene(signals, scene._id)}, 
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
	    selectedSceneId: ['scene', '_id'],
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
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(168);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane, .ProjectPane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap, .ProjectPane .wrap {\n    overflow: visible; }\n  ._pane .bar, .ProjectPane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow, .ProjectPane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow, .ProjectPane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar, .ProjectPane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow, .ProjectPane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow, .ProjectPane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, .ProjectPane .bar .fa, ._pane .bar .name, .ProjectPane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name, .ProjectPane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover, .ProjectPane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer, .ProjectPane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow, .ProjectPane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow, .ProjectPane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.ProjectPane {\n  right: -168px;\n  transition: right 0.2s;\n  border-bottom-left-radius: 4px;\n  padding-bottom: 4px; }\n  .ProjectPane .bar {\n    flex-direction: row; }\n    .ProjectPane .bar.fbar {\n      flex-direction: row-reverse;\n      right: 0; }\n  .ProjectPane.active {\n    right: 0; }\n", ""]);
	
	// exports


/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(170);
	const Component_1 = __webpack_require__(28);
	const Factory_1 = __webpack_require__(42);
	const Graph_1 = __webpack_require__(160);
	const SceneName = Factory_1.editable(['scene', 'name']);
	const SceneOptions = Factory_1.pane('scene');
	exports.Scene = Component_1.Component({ scene: ['scene'],
	    editing: SceneName.path,
	    pane: SceneOptions.path,
	    blockId: ['block', '_id'],
	    blockName: ['block', 'name'],
	    move: ['$dragdrop', 'drop']
	}, ({ state, signals }) => {
	    const scene = state.scene;
	    if (!scene) {
	        return '';
	    }
	    const deleteModal = Factory_1.openModal({ message: 'Delete scene ?',
	        type: 'scene',
	        _id: scene._id,
	        operation: 'remove',
	        confirm: 'Delete'
	    }, signals);
	    return Component_1.Component.createElement("div", {class: 'Scene'}, 
	        Component_1.Component.createElement("div", {class: 'bar'}, 
	            Component_1.Component.createElement(SceneOptions.toggle, {class: 'fa fa-film'}), 
	            Component_1.Component.createElement(SceneName, {class: 'name'})), 
	        Component_1.Component.createElement(SceneOptions, null, 
	            Component_1.Component.createElement("div", {class: 'button delete', "on-click": deleteModal}, "delete"), 
	            Component_1.Component.createElement("div", {class: 'button'}, "duplicate")), 
	        Component_1.Component.createElement(Graph_1.Graph, {key: 'scene.graph', selectedBlockId: state.blockId, ownerType: 'scene', graph: scene.graph}));
	});


/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(171);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Scene {\n  position: relative;\n  flex-grow: 1;\n  border: 1px solid #353131;\n  border-width: 1px 0 0 1px;\n  display: flex;\n  flex-direction: column; }\n  .Scene .name {\n    color: #d98632; }\n", ""]);
	
	// exports


/***/ },
/* 172 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(173);
	const Component_1 = __webpack_require__(28);
	const Status_1 = __webpack_require__(175);
	const Sync_1 = __webpack_require__(178);
	exports.StatusBar = Component_1.Component({ status: ['$status', 'list']
	}, ({ state, signals }) => {
	    const l = state.status || [];
	    const s = l[0];
	    return Component_1.Component.createElement("div", {class: 'StatusBar'}, 
	        s ? Component_1.Component.createElement(Status_1.Status, {status: s}) : '', 
	        Component_1.Component.createElement(Sync_1.Sync, null));
	});


/***/ },
/* 173 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(174);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.StatusBar {\n  position: fixed;\n  bottom: 0;\n  height: 20px;\n  width: 100%;\n  background: #3d3838;\n  border: 1px solid #353131;\n  padding: 8px;\n  color: #999999;\n  z-index: 4;\n  display: flex;\n  justify-content: flex-start; }\n  .StatusBar .Status {\n    flex-grow: 1; }\n  .StatusBar .Sync {\n    flex-grow: 0;\n    align-content: flex-end; }\n", ""]);
	
	// exports


/***/ },
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(176);
	const Component_1 = __webpack_require__(28);
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
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(177);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n@keyframes fadea {\n  0% {\n    opacity: 1.0; }\n  100% {\n    opacity: 0.1; } }\n\n@keyframes fadeb {\n  0% {\n    opacity: 1.0; }\n  100% {\n    opacity: 0.1; } }\n\n.Status {\n  cursor: pointer; }\n  .Status.info {\n    color: #777; }\n    .Status.info .outer {\n      stroke: #666; }\n    .Status.info .inner {\n      fill: #666;\n      animation: fadea 2s 1 both; }\n  .Status.error {\n    color: #a77; }\n    .Status.error .outer {\n      stroke: #b22; }\n    .Status.error .inner {\n      fill: #f00;\n      animation: fadea 2s 1 both; }\n  .Status.warn {\n    color: #997; }\n    .Status.warn .outer {\n      stroke: #bb0; }\n    .Status.warn .inner {\n      fill: #ff0;\n      animation: fadeb 2s 1 both; }\n  .Status.success {\n    color: #686; }\n    .Status.success .outer {\n      stroke: #0b0; }\n    .Status.success .inner {\n      fill: #0f0;\n      animation: fadeb 2s 1 both; }\n  .Status .outer {\n    stroke-width: 1px;\n    stroke: #000;\n    fill: none; }\n  .Status .inner {\n    stroke: none;\n    fill: #000; }\n", ""]);
	
	// exports


/***/ },
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(179);
	const Component_1 = __webpack_require__(28);
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
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(180);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Sync {\n  width: 1em;\n  height: 1em;\n  margin-right: 8px;\n  color: #686; }\n  .Sync.paused {\n    color: #686; }\n  .Sync.active {\n    color: #fe9327; }\n  .Sync.offline {\n    color: #a77; }\n  .Sync.error {\n    color: #a77; }\n", ""]);
	
	// exports


/***/ },
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(182);
	const Component_1 = __webpack_require__(28);
	const Status_1 = __webpack_require__(175);
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
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(183);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(126)(content, {});
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
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(125)();
	// imports
	
	
	// module
	exports.push([module.id, "._info, .StatusDetail {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap, .StatusDetail .wrap {\n    padding: 8px; }\n  ._info .bar, .StatusDetail .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap, .StatusDetail .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.StatusDetail {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0.3s, opacity 0.3s;\n  z-index: 4; }\n  .StatusDetail.active {\n    opacity: 1;\n    visibility: visible; }\n  .StatusDetail .entry {\n    border-top: 1px solid rgba(88, 81, 81, 0.95);\n    padding: 4px 0;\n    white-space: pre-wrap; }\n    .StatusDetail .entry:first-child {\n      border: 0; }\n", ""]);
	
	// exports


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map