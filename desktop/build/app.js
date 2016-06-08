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
	const Block_1 = __webpack_require__(51);
	const Data_1 = __webpack_require__(5);
	const DragDrop_1 = __webpack_require__(95);
	const Factory_1 = __webpack_require__(104);
	const Graph_1 = __webpack_require__(59);
	const Library_1 = __webpack_require__(101);
	const Playback_1 = __webpack_require__(118);
	const Project_1 = __webpack_require__(120);
	const Scene_1 = __webpack_require__(128);
	const Status_1 = __webpack_require__(22);
	const User_1 = __webpack_require__(136);
	const Sync_1 = __webpack_require__(142);
	const Router = __webpack_require__(148);
	const Controller = __webpack_require__(166);
	const Devtools = __webpack_require__(167);
	const Http = __webpack_require__(168);
	const Model = __webpack_require__(56);
	const Component_1 = __webpack_require__(30); // Component for jsx on this page
	const App_2 = __webpack_require__(169);
	//import { TestView as AppView } from './TestView'
	const model = Model({});
	const controller = Controller(model);
	const router = Router({ '/': 'app.homeUrl',
	    '/project': 'app.projectsUrl',
	    '/project/:id': 'app.projectUrl',
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
	const homeUrl_1 = __webpack_require__(76);
	const projectUrl_1 = __webpack_require__(88);
	const projectsUrl_1 = __webpack_require__(93);
	const userUrl_1 = __webpack_require__(94);
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
	const Data_1 = __webpack_require__(5);
	const runtests_1 = __webpack_require__(25);
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
	__export(__webpack_require__(13));
	const db_1 = __webpack_require__(15);
	const dbChanged_1 = __webpack_require__(18);
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
	const docAction_1 = __webpack_require__(14);
	const save_1 = __webpack_require__(9);
	exports.saveDoc = [docAction_1.docAction,
	    ...save_1.save
	];


/***/ },
/* 14 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const check = __webpack_require__(11);
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
/* 15 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const PouchDB = __webpack_require__(16);
	const PouchDBAuthentication = __webpack_require__(17);
	// https://github.com/nolanlawson/pouchdb-authentication
	PouchDB.plugin(PouchDBAuthentication);
	exports.db = new PouchDB('lucidity');


/***/ },
/* 16 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(140);

/***/ },
/* 17 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(154);

/***/ },
/* 18 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const update_1 = __webpack_require__(19);
	const saved_1 = __webpack_require__(20);
	const edit_1 = __webpack_require__(21);
	const Status_1 = __webpack_require__(22);
	exports.dbChanged = [update_1.update,
	    Status_1.status,
	    saved_1.saved,
	    edit_1.edit // open name for editing (depends on a flag in $factory)
	];


/***/ },
/* 19 */
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
/* 20 */
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
/* 21 */
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
/* 22 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(3));
	const changed_1 = __webpack_require__(23);
	const toggledDetail_1 = __webpack_require__(24);
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
/* 23 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const status_1 = __webpack_require__(3);
	exports.changed = [status_1.status
	];


/***/ },
/* 24 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const toggleDetail_1 = __webpack_require__(4);
	exports.toggledDetail = [toggleDetail_1.toggleDetail
	];


/***/ },
/* 25 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const testing_1 = __webpack_require__(26);
	const runall_1 = __webpack_require__(27);
	const stats_1 = __webpack_require__(75);
	const status_1 = __webpack_require__(3);
	exports.runtests = [testing_1.testing,
	    status_1.status,
	    [runall_1.runall, { success: [stats_1.stats, { success: [status_1.status] }] }] // async
	];


/***/ },
/* 26 */
/***/ function(module, exports) {

	"use strict";
	exports.testing = ({ state, output }) => {
	    output({ status: { type: 'info', message: 'Started testing' } });
	};


/***/ },
/* 27 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(28);
	const runner_1 = __webpack_require__(32);
	exports.runall = ({ state, output }) => {
	    runner_1.run((stats) => {
	        output.success({ stats });
	    });
	};
	exports.runall['async'] = true;


/***/ },
/* 28 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(29);
	__webpack_require__(36);
	__webpack_require__(38);
	__webpack_require__(40);
	__webpack_require__(42);
	__webpack_require__(48);
	__webpack_require__(71);
	__webpack_require__(72);
	__webpack_require__(73);
	__webpack_require__(74);


/***/ },
/* 29 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(30);
	const runner_1 = __webpack_require__(32);
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
/* 30 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const cerebral_view_snabbdom_1 = __webpack_require__(31);
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
/* 31 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(127);

/***/ },
/* 32 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const deepEqual = __webpack_require__(33);
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
/* 33 */
/***/ function(module, exports, __webpack_require__) {

	var pSlice = Array.prototype.slice;
	var objectKeys = __webpack_require__(34);
	var isArguments = __webpack_require__(35);
	
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
/* 34 */
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
/* 35 */
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
/* 36 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
	const save_1 = __webpack_require__(10);
	const Baobab = __webpack_require__(37);
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
/* 37 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(119);

/***/ },
/* 38 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
	const makeDoc_action_1 = __webpack_require__(39);
	const Baobab = __webpack_require__(37);
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
/* 39 */
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
/* 40 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
	const set_action_1 = __webpack_require__(41);
	const Baobab = __webpack_require__(37);
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
/* 41 */
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
/* 42 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
	const BlockHelper_1 = __webpack_require__(43);
	const SOURCE_A = ``;
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
/* 43 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const ts = __webpack_require__(44);
	const Immutable_1 = __webpack_require__(45);
	const DEFAULT_SOURCE = __webpack_require__(46);
	var BlockHelper;
	(function (BlockHelper) {
	    BlockHelper.MAIN_SOURCE = __webpack_require__(47);
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
/* 44 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(73);

/***/ },
/* 45 */
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
/* 46 */
/***/ function(module, exports) {

	module.exports = "export const render =\n( ctx ) => {\n\n}\n"

/***/ },
/* 47 */
/***/ function(module, exports) {

	module.exports = "export const render =\n( ctx, child ) => {\n  child ()\n}\n"

/***/ },
/* 48 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
	const GraphHelper_1 = __webpack_require__(49);
	const NodeHelper_1 = __webpack_require__(50);
	const Block_1 = __webpack_require__(51);
	const rootNodeId = NodeHelper_1.NodeHelper.rootNodeId;
	const rootBlockId = Block_1.BlockHelper.rootBlockId;
	const SOURCE_A = ``;
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


/***/ },
/* 49 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const NodeHelper_1 = __webpack_require__(50);
	const Block_1 = __webpack_require__(51);
	const Immutable_1 = __webpack_require__(45);
	var GraphHelper;
	(function (GraphHelper) {
	    const createNode = NodeHelper_1.NodeHelper.create;
	    const nextNodeId = NodeHelper_1.NodeHelper.nextNodeId;
	    const nextBlockId = Block_1.BlockHelper.nextBlockId;
	    GraphHelper.create = (name = 'main', source = Block_1.BlockHelper.MAIN_SOURCE) => {
	        const block = Block_1.BlockHelper.create(name, source);
	        const nid = NodeHelper_1.NodeHelper.rootNodeId;
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
	        newgraph.nodesById[nid] = Object.freeze(node);
	        return nid;
	    };
	    GraphHelper.insert = (graph, parentId, pos, achild) => {
	        // add nodes
	        let g = { nodesById: Object.assign({}, graph.nodesById),
	            blocksById: Object.assign({}, graph.blocksById),
	            blockId: graph.blockId
	        };
	        const oldgraph = { nodesById: Object.assign({}, achild.nodesById),
	            blocksById: Object.assign({}, achild.blocksById)
	        };
	        const tail = { nid: null };
	        // copy nodes and rename ids
	        const nid = insertInGraph(g, oldgraph, NodeHelper_1.NodeHelper.rootNodeId, parentId, tail);
	        g.blockId = g.nodesById[nid].blockId;
	        // link in parent
	        g = Immutable_1.Immutable.update(g, 'nodesById', parentId, 'children', (children) => Immutable_1.Immutable.insert(children, pos, nid));
	        g = Immutable_1.Immutable.update(g, 'blocksById', Object.freeze(g.blocksById));
	        return g;
	    };
	    GraphHelper.append = function (graph, parentId, child) {
	        return GraphHelper.insert(graph, parentId, -1, child);
	    };
	    // slip a new graph between parent and child
	    // FIXME: need to detect deepest child on first slot in graph
	    GraphHelper.slip = (graph, parentId, pos, achild) => {
	        let g = { nodesById: Object.assign({}, graph.nodesById),
	            blocksById: Object.assign({}, graph.blocksById),
	            blockId: graph.blockId
	        };
	        const oldgraph = { nodesById: Object.assign({}, achild.nodesById),
	            blocksById: Object.assign({}, achild.blocksById)
	        };
	        const tail = { nid: null };
	        // copy nodes and rename ids
	        const nid = insertInGraph(g, oldgraph, NodeHelper_1.NodeHelper.rootNodeId, parentId, tail);
	        g.blockId = g.nodesById[nid].blockId;
	        // get previous child at this position
	        const parent = g.nodesById[parentId];
	        const previd = parent.children[pos];
	        const prevnode = g.nodesById[previd];
	        // This is where the previous child will go
	        const tailnode = g.nodesById[tail.nid];
	        // tail.children [ 0 ] = previd
	        const children = Immutable_1.Immutable.aset(tailnode.children, 0, previd);
	        g = Immutable_1.Immutable.update(g, 'nodesById', tail.nid, Object.assign({}, tailnode, { children }));
	        // prevnode.parent = tail.nid
	        g = Immutable_1.Immutable.update(g, 'nodesById', previd, 'parent', tail.nid);
	        // parent.children [ pos ] = nid
	        g = Immutable_1.Immutable.update(g, 'nodesById', parentId, 'children', (children) => Immutable_1.Immutable.aset(children, pos, nid));
	        g = Immutable_1.Immutable.update(g, 'blocksById', Object.freeze(g.blocksById));
	        return Object.freeze(g);
	    };
	    // Cut a branch a return the branch as a new graph.
	    GraphHelper.cut = (graph, nodeId) => {
	        let g = { nodesById: {},
	            blocksById: {},
	            blockId: Block_1.BlockHelper.rootBlockId
	        };
	        const oldgraph = { nodesById: Object.assign({}, graph.nodesById),
	            blocksById: Object.assign({}, graph.blocksById)
	        };
	        const tail = { nid: null };
	        insertInGraph(g, oldgraph, nodeId, null, tail);
	        return g;
	    };
	    // Remove a branch and return the smaller tree.
	    GraphHelper.drop = (graph, nodeId) => {
	        let g = { nodesById: {},
	            blocksById: {},
	            blockId: Block_1.BlockHelper.rootBlockId
	        };
	        const oldgraph = { nodesById: Object.assign({}, graph.nodesById),
	            blocksById: Object.assign({}, graph.blocksById)
	        };
	        const tail = { nid: null };
	        insertInGraph(g, oldgraph, NodeHelper_1.NodeHelper.rootNodeId, null, tail, nodeId);
	        return g;
	    };
	})(GraphHelper = exports.GraphHelper || (exports.GraphHelper = {}));


/***/ },
/* 50 */
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
/* 51 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(52));
	__export(__webpack_require__(53));
	__export(__webpack_require__(55));
	const Model = __webpack_require__(56);
	const add_2 = __webpack_require__(53);
	const name_1 = __webpack_require__(57);
	const select_1 = __webpack_require__(67);
	const source_1 = __webpack_require__(69);
	const CurrentBlock = Model.monkey({ cursors: { sceneById: ['data', 'scene'],
	        sceneId: ['user', 'sceneId'],
	        projectById: ['data', 'project'],
	        projectId: ['user', 'projectId'],
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
/* 52 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(43));


/***/ },
/* 53 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(54);
	const Data_1 = __webpack_require__(5);
	exports.add = [addAction_1.addAction,
	    ...Data_1.save
	];


/***/ },
/* 54 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: why is this 'undefined' if imported from 'Graph' above ?
	const GraphHelper_1 = __webpack_require__(49);
	exports.addAction = ({ state, input, output }) => {
	    const { pos, parentId, ownerType, componentId } = input;
	    const owner = state.get([ownerType]);
	    let child;
	    if (componentId) {
	        child = state.get(['data', 'component', componentId]).graph;
	    }
	    else {
	        child = GraphHelper_1.GraphHelper.create('new block');
	    }
	    const graph = GraphHelper_1.GraphHelper.insert(owner.graph, parentId, pos, child);
	    const ownerupdate = Object.assign({}, owner, { graph });
	    // triger name edit after object save
	    // FIXME
	    // state.set ( [ '$factory', 'editing' ], child._id )
	    output({ doc: ownerupdate });
	};


/***/ },
/* 55 */
/***/ function(module, exports) {

	"use strict";
	exports.AnySlot = 'any';


/***/ },
/* 56 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(118);

/***/ },
/* 57 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const nameAction_1 = __webpack_require__(58);
	const Data_1 = __webpack_require__(5);
	exports.name = [nameAction_1.nameAction,
	    ...Data_1.save
	];


/***/ },
/* 58 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(51);
	const Graph_1 = __webpack_require__(59);
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
/* 59 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(60));
	__export(__webpack_require__(62));
	exports.Graph = (options = {}) => {
	    return (module, controller) => {
	        return {}; // meta information
	    };
	};


/***/ },
/* 60 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(61));


/***/ },
/* 61 */
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
/* 62 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(63));
	__export(__webpack_require__(64));
	__export(__webpack_require__(49));
	__export(__webpack_require__(50));
	// FIXME: Immutable should be in 'utils'
	__export(__webpack_require__(45));


/***/ },
/* 63 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const uilayout_1 = __webpack_require__(64);
	const NodeHelper_1 = __webpack_require__(50);
	const nextNodeId = NodeHelper_1.NodeHelper.nextNodeId;
	const rootNodeId = NodeHelper_1.NodeHelper.rootNodeId;
	const minSize_1 = __webpack_require__(66);
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
	    let num = 7;
	    for (let i = 0; i < name.length; i += 1) {
	        num += name.charCodeAt(i);
	    }
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
/* 64 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const getTextSizeCanvas_1 = __webpack_require__(65);
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
/* 65 */
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
/* 66 */
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
/* 67 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const selectAction_1 = __webpack_require__(68);
	exports.select = 
	// prepare things to add
	[selectAction_1.selectAction
	];


/***/ },
/* 68 */
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
	            state.set(['$block'], { id, ownerType });
	        }
	    }
	};


/***/ },
/* 69 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const sourceAction_1 = __webpack_require__(70);
	const Data_1 = __webpack_require__(5);
	exports.source = [sourceAction_1.sourceAction,
	    ...Data_1.save
	];


/***/ },
/* 70 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(51);
	const Graph_1 = __webpack_require__(59);
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
/* 71 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
	const Immutable_1 = __webpack_require__(45);
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
/* 72 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
	const NodeHelper_1 = __webpack_require__(50);
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
/* 73 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
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
/* 74 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
	const status_1 = __webpack_require__(3);
	const Baobab = __webpack_require__(37);
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
/* 75 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const runner_1 = __webpack_require__(32);
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
/* 76 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set = __webpack_require__(77);
	exports.homeUrl = [set('state:/$route', 'home')
	];


/***/ },
/* 77 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(78).default


/***/ },
/* 78 */
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
	
	var _set = __webpack_require__(79);
	
	var _set2 = _interopRequireDefault(_set);
	
	var _toDisplayName = __webpack_require__(87);
	
	var _toDisplayName2 = _interopRequireDefault(_toDisplayName);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 79 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(80).default


/***/ },
/* 80 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = compile;
	
	var _compiler = __webpack_require__(81);
	
	var _compiler2 = _interopRequireDefault(_compiler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function compile(path) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? 'set' : arguments[1];
	
	  return (0, _compiler2.default)(path, fn, false);
	}

/***/ },
/* 81 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = compile;
	
	var _input = __webpack_require__(82);
	
	var _input2 = _interopRequireDefault(_input);
	
	var _output = __webpack_require__(84);
	
	var _output2 = _interopRequireDefault(_output);
	
	var _state = __webpack_require__(85);
	
	var _state2 = _interopRequireDefault(_state);
	
	var _parseUrl = __webpack_require__(86);
	
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
/* 82 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _objectPath = __webpack_require__(83);
	
	exports.default = function (path, url, urlPath) {
	  // get the value from the input object
	  return function input(_ref) {
	    var input = _ref.input;
	
	    return urlPath ? (0, _objectPath.getPathValue)(input, urlPath) : input;
	  };
	};

/***/ },
/* 83 */
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
/* 84 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	var _objectPath = __webpack_require__(83);
	
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
/* 85 */
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
/* 86 */
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
/* 87 */
/***/ function(module, exports) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	
	exports.default = function (path, getter) {
	  return typeof path === 'function' ? getter.displayName || getter.name : JSON.stringify(path);
	};

/***/ },
/* 88 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set = __webpack_require__(77);
	const copy = __webpack_require__(89);
	exports.projectUrl = [set('state:/$route', 'project'),
	    copy('input:/id', 'state:/$projectId')
	];


/***/ },
/* 89 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(90).default


/***/ },
/* 90 */
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
	
	var _get = __webpack_require__(91);
	
	var _get2 = _interopRequireDefault(_get);
	
	var _set = __webpack_require__(79);
	
	var _set2 = _interopRequireDefault(_set);
	
	var _toDisplayName = __webpack_require__(87);
	
	var _toDisplayName2 = _interopRequireDefault(_toDisplayName);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }

/***/ },
/* 91 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = __webpack_require__(92).default


/***/ },
/* 92 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	Object.defineProperty(exports, "__esModule", {
	  value: true
	});
	exports.default = compile;
	
	var _compiler = __webpack_require__(81);
	
	var _compiler2 = _interopRequireDefault(_compiler);
	
	function _interopRequireDefault(obj) { return obj && obj.__esModule ? obj : { default: obj }; }
	
	function compile(path) {
	  var fn = arguments.length <= 1 || arguments[1] === undefined ? 'get' : arguments[1];
	
	  return (0, _compiler2.default)(path, fn, true);
	}

/***/ },
/* 93 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set = __webpack_require__(77);
	exports.projectsUrl = [set('state:/$route', 'projects')
	];


/***/ },
/* 94 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set = __webpack_require__(77);
	exports.userUrl = [set('state:/$route', 'user')
	];


/***/ },
/* 95 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(96));
	const drag_1 = __webpack_require__(97);
	const drop_1 = __webpack_require__(99);
	const move_1 = __webpack_require__(116);
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
/* 96 */
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
	    DragDropHelper.drag = (signals, dragclbk, click) => {
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
	                dragclbk(nodePos);
	                startDrag(signals);
	            }
	        };
	        return { mousedown, mousemove, mouseup };
	    };
	})(DragDropHelper = exports.DragDropHelper || (exports.DragDropHelper = {}));


/***/ },
/* 97 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const dragAction_1 = __webpack_require__(98);
	exports.drag = [dragAction_1.dragAction
	];


/***/ },
/* 98 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const NodeHelper_1 = __webpack_require__(50);
	const GraphHelper_1 = __webpack_require__(49);
	const uimap_1 = __webpack_require__(63);
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
/* 99 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const dropAction_1 = __webpack_require__(100);
	const Data_1 = __webpack_require__(5);
	exports.drop = [dropAction_1.dropAction,
	    { success: [...Data_1.save]
	    }
	];


/***/ },
/* 100 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Graph_1 = __webpack_require__(59);
	const Library_1 = __webpack_require__(101);
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
/* 101 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(102));
	const Model = __webpack_require__(56);
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
	        module.addSignals({});
	        return {}; // meta information
	    };
	};


/***/ },
/* 102 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(103));


/***/ },
/* 103 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Factory_1 = __webpack_require__(104);
	const Graph_1 = __webpack_require__(59);
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
/* 104 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(105));
	__export(__webpack_require__(106));
	__export(__webpack_require__(108));
	__export(__webpack_require__(109));
	__export(__webpack_require__(110));
	const common_1 = __webpack_require__(112);
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
/* 105 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(30);
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
/* 106 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(30);
	const EditableText_1 = __webpack_require__(107);
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
/* 107 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Component_1 = __webpack_require__(30);
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
/* 108 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(30);
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
/* 109 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: move Component to '/lib' ?
	// FIXME: move Factory to '/lib' ?
	// FIXME: should import styles ?
	const Component_1 = __webpack_require__(30);
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
/* 110 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const uuid = __webpack_require__(111);
	exports.makeId = uuid.generate;


/***/ },
/* 111 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(63);

/***/ },
/* 112 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(113));
	__export(__webpack_require__(114));


/***/ },
/* 113 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const set_action_1 = __webpack_require__(41);
	// import { makeDoc } from './makeDoc.action'
	// import { save as saveData } from '../../Data'
	exports.set = [set_action_1.setAction
	];


/***/ },
/* 114 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const add_action_1 = __webpack_require__(115);
	const Data_1 = __webpack_require__(5);
	exports.add = 
	// prepare things to add
	[add_action_1.addAction,
	    ...Data_1.save
	];


/***/ },
/* 115 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const makeId_1 = __webpack_require__(110);
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
/* 116 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const moveAction_1 = __webpack_require__(117);
	exports.move = [moveAction_1.moveAction // no need to throttle ( 10, [ moveAction ] )
	];


/***/ },
/* 117 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const GraphHelper_1 = __webpack_require__(49);
	const NodeHelper_1 = __webpack_require__(50);
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
	            // drop on library
	            state.set(['$factory', 'pane', 'library'], true);
	            drop =
	                { target,
	                    ownerType
	                };
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
/* 118 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(119));
	exports.Playback = (options = {}) => {
	    return (module, controller) => {
	        module.addState({ $main: function () { },
	            $visible: true
	        });
	        return {}; // meta information
	    };
	};


/***/ },
/* 119 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Graph_1 = __webpack_require__(59);
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
	            throw `Corrupt graph. Child '${key}' not in 'nodesById'.`;
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
	    PlaybackHelper.compile = (graph, cache) => {
	        const output = [];
	        // update render functions for each node
	        const shouldClear = updateRender(graph, cache.nodecache);
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
/* 120 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(121));
	const Model = __webpack_require__(56);
	const add_1 = __webpack_require__(123);
	const name_1 = __webpack_require__(125);
	const select_1 = __webpack_require__(126);
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
/* 121 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Factory_1 = __webpack_require__(104);
	const GraphHelper_1 = __webpack_require__(49);
	const SceneHelper_1 = __webpack_require__(122);
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
/* 122 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Block_1 = __webpack_require__(51);
	const Factory_1 = __webpack_require__(104);
	const GraphHelper_1 = __webpack_require__(49);
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
/* 123 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(124);
	const Data_1 = __webpack_require__(5);
	exports.add = [addAction_1.addAction,
	    ...Data_1.save
	];


/***/ },
/* 124 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Project_1 = __webpack_require__(120);
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
/* 125 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Data_1 = __webpack_require__(5);
	const set = __webpack_require__(77);
	exports.name = [set('output:/type', 'project'),
	    set('output:/key', 'name'),
	    ...Data_1.saveDoc
	];


/***/ },
/* 126 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const selectAction_1 = __webpack_require__(127);
	const Data_1 = __webpack_require__(5);
	exports.select = 
	// prepare things to add
	[selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 127 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(120);
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
	        state.unset(['$blockId']);
	        const sel = _1.ProjectHelper.select(state, user, project);
	        if (sel) {
	            output({ doc: sel });
	        }
	    }
	};


/***/ },
/* 128 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(122));
	const Model = __webpack_require__(56);
	const add_1 = __webpack_require__(129);
	const name_1 = __webpack_require__(132);
	const remove_1 = __webpack_require__(133);
	const select_1 = __webpack_require__(135);
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
/* 129 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const addAction_1 = __webpack_require__(130);
	const selectAction_1 = __webpack_require__(131);
	const Data_1 = __webpack_require__(5);
	exports.add = [addAction_1.addAction,
	    selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 130 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Scene_1 = __webpack_require__(128);
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
	    // we set doc for select operation
	    output({ docs, doc: scene });
	};


/***/ },
/* 131 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(128);
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
/* 132 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Data_1 = __webpack_require__(5);
	const set = __webpack_require__(77);
	exports.name = [set('output:/type', 'scene'),
	    set('output:/key', 'name'),
	    ...Data_1.saveDoc
	];


/***/ },
/* 133 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const removeAction_1 = __webpack_require__(134);
	const Data_1 = __webpack_require__(5);
	const Status_1 = __webpack_require__(22);
	exports.remove = [removeAction_1.removeAction,
	    { success: [...Data_1.save],
	        error: [Status_1.status]
	    }
	];


/***/ },
/* 134 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const _1 = __webpack_require__(128);
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
/* 135 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const selectAction_1 = __webpack_require__(131);
	const Data_1 = __webpack_require__(5);
	exports.select = 
	// prepare things to add
	[selectAction_1.selectAction,
	    ...Data_1.save
	];


/***/ },
/* 136 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Model = __webpack_require__(56);
	const githubLibraryGet_1 = __webpack_require__(137);
	const libraryGithubPath_1 = __webpack_require__(139);
	const libraryGithubToken_1 = __webpack_require__(140);
	const name_1 = __webpack_require__(141);
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
/* 137 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const githubLibraryGetAction_1 = __webpack_require__(138);
	const Status_1 = __webpack_require__(22);
	const copy = __webpack_require__(89);
	exports.githubLibraryGet = [githubLibraryGetAction_1.githubLibraryGetAction,
	    { success: [copy('input:/', 'state:/github')],
	        error: [Status_1.status]
	    }
	];


/***/ },
/* 138 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const NodeHelper_1 = __webpack_require__(50);
	const rootNodeId = NodeHelper_1.NodeHelper.rootNodeId;
	const insert = (entry, graph, nodeId, slotref) => {
	    const node = graph.nodesById[nodeId];
	    const block = graph.blocksById[node.blockId];
	    const name = slotref ? `${slotref}.${block.name}` : block.name;
	    const f = { name: `${name}.ts`, source: block.source, type: 'file' };
	    entry[f.name] = f;
	    let sub;
	    const children = node.children;
	    for (let i = 0; i < children.length; ++i) {
	        const slotref = i < 10 ? `0${i}` : String(i);
	        const childId = children[i];
	        if (childId) {
	            if (!sub) {
	                // create folder for children
	                sub = { name, content: {}, type: 'folder' };
	                entry[sub.name] = sub;
	                insert(sub.content, graph, childId, slotref);
	            }
	        }
	    }
	};
	exports.githubLibraryGetAction = ({ state, output }) => {
	    const user = state.get(['user']);
	    const libpath = user.libraryGithubPath;
	    const token = user.libraryGithubToken;
	    if (libpath && token) {
	        // const tree = `https://api.github.com/repos/${path}/git/trees`
	        // const url = `https://api.github.com/repos/${path}`
	        const get = (path, clbk) => {
	            const url = `https://api.github.com/repos/${libpath}${path}`;
	            const xhr = new XMLHttpRequest();
	            xhr.open('get', url, true);
	            xhr.setRequestHeader('Accept', 'application/vnd.github.v3+json');
	            xhr.onload = () => {
	                clbk(JSON.parse(xhr.response));
	            };
	            xhr.send();
	        };
	        const components = state.get(['data', 'component']);
	        const library = {};
	        for (const k in components) {
	            const comp = components[k];
	            insert(library, comp.graph, rootNodeId);
	        }
	        // Now we need to compare this with online library and
	        // push changes to github...
	        console.log(library);
	        get('/git/refs/heads/master', (o) => {
	            const sha = o.object.sha;
	            get(`/git/trees/${sha}`, (o) => {
	                const tree = {};
	                o.tree.forEach(e => tree[e.path] = e);
	                console.log(tree);
	            });
	        });
	    }
	};
	exports.githubLibraryGetAction['async'] = true;


/***/ },
/* 139 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Data_1 = __webpack_require__(5);
	const set = __webpack_require__(77);
	exports.libraryGithubPath = [set('output:/type', 'user'),
	    set('output:/key', 'libraryGithubPath'),
	    ...Data_1.saveDoc
	];


/***/ },
/* 140 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Data_1 = __webpack_require__(5);
	const set = __webpack_require__(77);
	exports.libraryGithubToken = [set('output:/type', 'user'),
	    set('output:/key', 'libraryGithubToken'),
	    ...Data_1.saveDoc
	];


/***/ },
/* 141 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Data_1 = __webpack_require__(5);
	const set = __webpack_require__(77);
	exports.name = [set('output:/type', 'user'),
	    set('output:/key', 'name'),
	    ...Data_1.saveDoc
	];


/***/ },
/* 142 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	function __export(m) {
	    for (var p in m) if (!exports.hasOwnProperty(p)) exports[p] = m[p];
	}
	__export(__webpack_require__(143));
	__export(__webpack_require__(144));
	const db_1 = __webpack_require__(15);
	const changed_1 = __webpack_require__(145);
	const SyncHelper_1 = __webpack_require__(147);
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
/* 143 */
/***/ function(module, exports) {

	"use strict";
	exports.start = [];


/***/ },
/* 144 */
/***/ function(module, exports) {

	"use strict";
	exports.stop = [];


/***/ },
/* 145 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const changedAction_1 = __webpack_require__(146);
	const status_1 = __webpack_require__(3);
	exports.changed = [changedAction_1.changedAction,
	    { success: [], error: [status_1.status] }
	];


/***/ },
/* 146 */
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
/* 147 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	// FIXME: we should probably move all db code
	// to a DatabaseHelper and use this to login, sync, etc
	// with proper try/catch/promise.
	//
	// CHECK CODE WITH
	// https://github.com/colinskow/ng-pouch-mirror/blob/master/src/ng-pouch-mirror.js
	const PouchDB = __webpack_require__(16);
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
/* 148 */
/***/ function(module, exports, __webpack_require__) {

	var MODULE = 'cerebral-module-router'
	var isObject = __webpack_require__(149)
	var get = __webpack_require__(150)
	
	var Mapper = __webpack_require__(154)
	var addressbar
	try {
	  addressbar = __webpack_require__(160)
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
/* 149 */
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
/* 150 */
/***/ function(module, exports, __webpack_require__) {

	/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	var stringToPath = __webpack_require__(151);
	
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
/* 151 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(module, global) {/**
	 * lodash (Custom Build) <https://lodash.com/>
	 * Build: `lodash modularize exports="npm" -o ./`
	 * Copyright jQuery Foundation and other contributors <https://jquery.org/>
	 * Released under MIT license <https://lodash.com/license>
	 * Based on Underscore.js 1.8.3 <http://underscorejs.org/LICENSE>
	 * Copyright Jeremy Ashkenas, DocumentCloud and Investigative Reporters & Editors
	 */
	var baseToString = __webpack_require__(153);
	
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(152)(module), (function() { return this; }())))

/***/ },
/* 152 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(33);

/***/ },
/* 153 */
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
	
	/* WEBPACK VAR INJECTION */}.call(exports, __webpack_require__(152)(module), (function() { return this; }())))

/***/ },
/* 154 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	var mapper = __webpack_require__(155)
	var compileRoute = __webpack_require__(156)
	
	module.exports = function urlMapper (options) {
	  return mapper(compileRoute, options)
	}


/***/ },
/* 155 */
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
/* 156 */
/***/ function(module, exports, __webpack_require__) {

	'use strict'
	var URLON = __webpack_require__(157)
	var pathToRegexp = __webpack_require__(158)
	
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
/* 157 */
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
/* 158 */
/***/ function(module, exports, __webpack_require__) {

	var isarray = __webpack_require__(159)
	
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
/* 159 */
/***/ function(module, exports) {

	module.exports = Array.isArray || function (arr) {
	  return Object.prototype.toString.call(arr) == '[object Array]';
	};


/***/ },
/* 160 */
/***/ function(module, exports, __webpack_require__) {

	/* WEBPACK VAR INJECTION */(function(global) {/* global history */
	
	var URL = __webpack_require__(161)
	var EventEmitter = __webpack_require__(165).EventEmitter
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
/* 161 */
/***/ function(module, exports, __webpack_require__) {

	'use strict';
	
	var required = __webpack_require__(162)
	  , lolcation = __webpack_require__(163)
	  , qs = __webpack_require__(164)
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
/* 162 */
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
/* 163 */
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
	  URL = URL || __webpack_require__(161);
	
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
/* 164 */
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
/* 165 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(59);

/***/ },
/* 166 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(1);

/***/ },
/* 167 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(61);

/***/ },
/* 168 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(100);

/***/ },
/* 169 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(170);
	__webpack_require__(174);
	const Component_1 = __webpack_require__(30);
	const Editor_1 = __webpack_require__(176);
	const Login_1 = __webpack_require__(214);
	const ProjectChooser_1 = __webpack_require__(217);
	const StatusBar_1 = __webpack_require__(220);
	const StatusDetail_1 = __webpack_require__(229);
	const User_1 = __webpack_require__(232);
	const route = (r) => {
	    switch (r) {
	        case 'login': return Component_1.Component.createElement(Login_1.Login, {key: 'Login'});
	        case 'projects': return Component_1.Component.createElement(ProjectChooser_1.ProjectChooser, {key: 'ProjectChooser'});
	        case 'project': return Component_1.Component.createElement(Editor_1.Editor, null);
	        case 'user': return Component_1.Component.createElement(User_1.User, null);
	    }
	};
	exports.App = Component_1.Component({ route: ['$route']
	}, ({ state }) => {
	    return Component_1.Component.createElement("div", {class: 'App'}, 
	        route(state.route), 
	        Component_1.Component.createElement(StatusBar_1.StatusBar, {key: 'StatusBar'}), 
	        Component_1.Component.createElement(StatusDetail_1.StatusDetail, {key: 'StatusDetail'}));
	});


/***/ },
/* 170 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(171);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 171 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "@keyframes blinker {\n  50% {\n    opacity: 0.0; } }\n\n@keyframes pulse {\n  from {\n    stroke: black;\n    fill: white;\n    transform: translateY(0px); }\n  to {\n    stroke: white;\n    fill: transparent;\n    transform: translateY(-3px); } }\n\n@keyframes detached {\n  0% {\n    stroke: black; }\n  50% {\n    stroke: black; }\n  100% {\n    stroke: #c80000; } }\n\n@keyframes ghost {\n  0% {\n    opacity: 0.7; }\n  100% {\n    opacity: 1.0; } }\n\n.blink {\n  animation: blinker 1s linear infinite; }\n\n.pulse {\n  animation: pulse 0.4s infinite alternate; }\n\n._detachedFx {\n  animation: detached 0.8s infinite alternate; }\n\nh1, h2, h3, p, .name, .fa {\n  font-size: 1em;\n  font-weight: normal;\n  line-height: 1.2em;\n  padding: 4px;\n  margin: 4px 0; }\n\n.fa {\n  margin: 0;\n  padding-right: 8px;\n  color: #333333;\n  transition: background-color 0.3s;\n  border-radius: 4px;\n  cursor: pointer; }\n  .fa:hover {\n    background: #151414; }\n\np {\n  margin: 0; }\n\n.EditableText {\n  cursor: text;\n  background-color: transparent;\n  border-bottom: 1px dashed #fff;\n  border-bottom-color: rgba(204, 204, 204, 0);\n  transition: border-bottom-color 0.8s, background-color 0.3s, color 0.3s; }\n  .EditableText input.fld {\n    border: none;\n    padding: 4px;\n    font: inherit;\n    background-color: transparent;\n    border-radius: 0;\n    width: 100%;\n    outline: none; }\n  .EditableText.active {\n    padding: 0;\n    background-color: #bd9368; }\n  .EditableText.saving {\n    color: white; }\n  .EditableText:hover {\n    border-bottom-color: rgba(26, 26, 26, 0.4); }\n\n._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list, .console {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p, .console p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect, .li {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\nhtml,\nbody,\nul,\nol {\n  margin: 0;\n  padding: 0;\n  list-style-type: none; }\n\nle-test div {\n  border: 1px solid grey;\n  padding: 4px;\n  background: #999;\n  margin: 4px; }\n\nle-test .container div {\n  background: #944; }\n\nhtml, body, #app {\n  margin: 0;\n  height: 100%; }\n\n#app > .wrap {\n  height: 100%; }\n\nbody {\n  font-family: \"Avenir Next\", \"Segoe ui\", \"Muli\", Helvetica, sans-serif;\n  font-size: 10pt;\n  background: #3d3838;\n  color: #000;\n  cursor: default; }\n\n.fld {\n  background: #807575;\n  border: none;\n  border-radius: 4px;\n  padding: 4px;\n  font: inherit; }\n\n._search, .search {\n  background: #4b4444;\n  padding: 4px;\n  border: 1px solid #353131;\n  position: relative; }\n  ._search p input, .search p input {\n    position: absolute;\n    top: 4px;\n    left: 4px;\n    width: 132px; }\n\n._saved, .search .saved {\n  padding: 4px; }\n  ._saved li, .search .saved li {\n    background: #585151;\n    display: inline-block;\n    border-radius: 4px;\n    border: 1px solid #353131;\n    margin: 2px;\n    text-align: center;\n    width: 1.4em; }\n    ._saved li.sel, .search .saved li.sel {\n      background: #71583e;\n      color: #000; }\n\n.li {\n  cursor: pointer;\n  color: #141414;\n  padding: 4px;\n  background: #585151;\n  border-bottom: 1px solid #353131; }\n  .li.drag {\n    padding: 0; }\n    .li.drag span {\n      padding: 4px; }\n      .li.drag span:before {\n        color: #222;\n        content: \":: \"; }\n  .li span {\n    display: block; }\n  .li.sel {\n    background: #71583e;\n    color: #000; }\n  .li.add {\n    background: none;\n    color: #585151;\n    border-bottom: none;\n    text-align: center;\n    font-weight: bold;\n    transition: background 0.5s, color 0.5s; }\n    .li.add:hover {\n      background: #585151;\n      color: #000; }\n\n._button, .refresh {\n  cursor: pointer; }\n\n.dragged {\n  opacity: 0.8;\n  border-width: 2px;\n  border-radius: 4px; }\n\n._drop .drag-enter {\n  background: #71583e;\n  color: #000;\n  cursor: copy; }\n\n.search {\n  border-right: 0; }\n\n.console {\n  border-right: 0;\n  position: relative; }\n  .console p input {\n    position: absolute;\n    top: 4px;\n    right: 4px;\n    width: 50%; }\n", ""]);
	
	// exports


/***/ },
/* 172 */
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
/* 173 */
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
/* 174 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(175);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 175 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Workbench {\n  background: #3d3838;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  flex-direction: column; }\n  .Workbench > .stretch {\n    flex-grow: 1;\n    display: flex; }\n  .Workbench .Pane {\n    overflow: hidden;\n    position: absolute;\n    left: 0;\n    margin-left: -1px;\n    width: 0px;\n    transition: width 0.1s;\n    border-bottom-right-radius: 4px; }\n    .Workbench .Pane.active {\n      width: 140px; }\n    .Workbench .Pane .wrap {\n      background: #383333;\n      box-shadow: inset 0 0 10px #232020;\n      padding: 4px; }\n", ""]);
	
	// exports


/***/ },
/* 176 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	const Block_1 = __webpack_require__(177);
	const Component_1 = __webpack_require__(30);
	const Drag_1 = __webpack_require__(189);
	const Library_1 = __webpack_require__(198);
	const Factory_1 = __webpack_require__(104);
	const Playback_1 = __webpack_require__(201);
	const Project_1 = __webpack_require__(205);
	const ProjectPane_1 = __webpack_require__(208);
	const Scene_1 = __webpack_require__(211);
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
/* 177 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(178);
	const Component_1 = __webpack_require__(30);
	const CodeEditor_1 = __webpack_require__(180);
	const Factory_1 = __webpack_require__(104);
	// import { Graph } from '../Graph'
	const BlockName = Factory_1.editable(['block', 'name']);
	exports.Block = Component_1.Component({ block: ['block'],
	    select: ['$block'],
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
/* 178 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(179);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 179 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Block {\n  position: absolute;\n  bottom: 0;\n  right: 0;\n  width: 460px;\n  background: #232020;\n  border-top-left-radius: 4px; }\n  .Block .bar {\n    border-top-left-radius: 4px; }\n  .Block .CodeMirror {\n    height: 300px; }\n  .Block.hidden {\n    visibility: hidden; }\n", ""]);
	
	// exports


/***/ },
/* 180 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(181);
	const Component_1 = __webpack_require__(30);
	const CodeMirror = __webpack_require__(183);
	// JS mode
	__webpack_require__(184);
	// CSS
	__webpack_require__(185);
	__webpack_require__(187);
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
/* 181 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(182);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 182 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n", ""]);
	
	// exports


/***/ },
/* 183 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(139);

/***/ },
/* 184 */
/***/ function(module, exports, __webpack_require__) {

	// CodeMirror, copyright (c) by Marijn Haverbeke and others
	// Distributed under an MIT license: http://codemirror.net/LICENSE
	
	// TODO actually recognize syntax of TypeScript constructs
	
	(function(mod) {
	  if (true) // CommonJS
	    mod(__webpack_require__(183));
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
/* 185 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(186);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 186 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "/* BASICS */\n.CodeMirror {\n  /* Set height, width, borders, and global font properties here */\n  font-family: monospace;\n  height: 300px;\n  color: black; }\n\n/* PADDING */\n.CodeMirror-lines {\n  padding: 4px 0;\n  /* Vertical padding around content */ }\n\n.CodeMirror pre {\n  padding: 0 4px;\n  /* Horizontal padding of content */ }\n\n.CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  background-color: white;\n  /* The little square between H and V scrollbars */ }\n\n/* GUTTER */\n.CodeMirror-gutters {\n  border-right: 1px solid #ddd;\n  background-color: #f7f7f7;\n  white-space: nowrap; }\n\n.CodeMirror-linenumber {\n  padding: 0 3px 0 5px;\n  min-width: 20px;\n  text-align: right;\n  color: #999;\n  white-space: nowrap; }\n\n.CodeMirror-guttermarker {\n  color: black; }\n\n.CodeMirror-guttermarker-subtle {\n  color: #999; }\n\n/* CURSOR */\n.CodeMirror-cursor {\n  border-left: 1px solid black;\n  border-right: none;\n  width: 0; }\n\n/* Shown when moving in bi-directional text */\n.CodeMirror div.CodeMirror-secondarycursor {\n  border-left: 1px solid silver; }\n\n.cm-fat-cursor .CodeMirror-cursor {\n  width: auto;\n  border: 0 !important;\n  background: #7e7; }\n\n.cm-fat-cursor div.CodeMirror-cursors {\n  z-index: 1; }\n\n.cm-animate-fat-cursor {\n  width: auto;\n  border: 0;\n  -webkit-animation: blink 1.06s steps(1) infinite;\n  -moz-animation: blink 1.06s steps(1) infinite;\n  animation: blink 1.06s steps(1) infinite;\n  background-color: #7e7; }\n\n@-moz-keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n@-webkit-keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n@keyframes blink {\n  0% { }\n  50% {\n    background-color: transparent; }\n  100% { } }\n\n/* Can style cursor different in overwrite (non-insert) mode */\n.cm-tab {\n  display: inline-block;\n  text-decoration: inherit; }\n\n.CodeMirror-ruler {\n  border-left: 1px solid #ccc;\n  position: absolute; }\n\n/* DEFAULT THEME */\n.cm-s-default .cm-header {\n  color: blue; }\n\n.cm-s-default .cm-quote {\n  color: #090; }\n\n.cm-negative {\n  color: #d44; }\n\n.cm-positive {\n  color: #292; }\n\n.cm-header, .cm-strong {\n  font-weight: bold; }\n\n.cm-em {\n  font-style: italic; }\n\n.cm-link {\n  text-decoration: underline; }\n\n.cm-strikethrough {\n  text-decoration: line-through; }\n\n.cm-s-default .cm-keyword {\n  color: #708; }\n\n.cm-s-default .cm-atom {\n  color: #219; }\n\n.cm-s-default .cm-number {\n  color: #164; }\n\n.cm-s-default .cm-def {\n  color: #00f; }\n\n.cm-s-default .cm-variable-2 {\n  color: #05a; }\n\n.cm-s-default .cm-variable-3 {\n  color: #085; }\n\n.cm-s-default .cm-comment {\n  color: #a50; }\n\n.cm-s-default .cm-string {\n  color: #a11; }\n\n.cm-s-default .cm-string-2 {\n  color: #f50; }\n\n.cm-s-default .cm-meta {\n  color: #555; }\n\n.cm-s-default .cm-qualifier {\n  color: #555; }\n\n.cm-s-default .cm-builtin {\n  color: #30a; }\n\n.cm-s-default .cm-bracket {\n  color: #997; }\n\n.cm-s-default .cm-tag {\n  color: #170; }\n\n.cm-s-default .cm-attribute {\n  color: #00c; }\n\n.cm-s-default .cm-hr {\n  color: #999; }\n\n.cm-s-default .cm-link {\n  color: #00c; }\n\n.cm-s-default .cm-error {\n  color: #f00; }\n\n.cm-invalidchar {\n  color: #f00; }\n\n.CodeMirror-composing {\n  border-bottom: 2px solid; }\n\n/* Default styles for common addons */\ndiv.CodeMirror span.CodeMirror-matchingbracket {\n  color: #0f0; }\n\ndiv.CodeMirror span.CodeMirror-nonmatchingbracket {\n  color: #f22; }\n\n.CodeMirror-matchingtag {\n  background: rgba(255, 150, 0, 0.3); }\n\n.CodeMirror-activeline-background {\n  background: #e8f2ff; }\n\n/* STOP */\n/* The rest of this file contains styles related to the mechanics of\n   the editor. You probably shouldn't touch them. */\n.CodeMirror {\n  position: relative;\n  overflow: hidden;\n  background: white; }\n\n.CodeMirror-scroll {\n  overflow: scroll !important;\n  /* Things will break if this is overridden */\n  /* 30px is the magic margin used to hide the element's real scrollbars */\n  /* See overflow: hidden in .CodeMirror */\n  margin-bottom: -30px;\n  margin-right: -30px;\n  padding-bottom: 30px;\n  height: 100%;\n  outline: none;\n  /* Prevent dragging from highlighting the element */\n  position: relative; }\n\n.CodeMirror-sizer {\n  position: relative;\n  border-right: 30px solid transparent; }\n\n/* The fake, visible scrollbars. Used to force redraw during scrolling\n   before actual scrolling happens, thus preventing shaking and\n   flickering artifacts. */\n.CodeMirror-vscrollbar, .CodeMirror-hscrollbar, .CodeMirror-scrollbar-filler, .CodeMirror-gutter-filler {\n  position: absolute;\n  z-index: 6;\n  display: none; }\n\n.CodeMirror-vscrollbar {\n  right: 0;\n  top: 0;\n  overflow-x: hidden;\n  overflow-y: scroll; }\n\n.CodeMirror-hscrollbar {\n  bottom: 0;\n  left: 0;\n  overflow-y: hidden;\n  overflow-x: scroll; }\n\n.CodeMirror-scrollbar-filler {\n  right: 0;\n  bottom: 0; }\n\n.CodeMirror-gutter-filler {\n  left: 0;\n  bottom: 0; }\n\n.CodeMirror-gutters {\n  position: absolute;\n  left: 0;\n  top: 0;\n  min-height: 100%;\n  z-index: 3; }\n\n.CodeMirror-gutter {\n  white-space: normal;\n  height: 100%;\n  display: inline-block;\n  vertical-align: top;\n  margin-bottom: -30px;\n  /* Hack to make IE7 behave */\n  *zoom: 1;\n  *display: inline; }\n\n.CodeMirror-gutter-wrapper {\n  position: absolute;\n  z-index: 4;\n  background: none !important;\n  border: none !important; }\n\n.CodeMirror-gutter-background {\n  position: absolute;\n  top: 0;\n  bottom: 0;\n  z-index: 4; }\n\n.CodeMirror-gutter-elt {\n  position: absolute;\n  cursor: default;\n  z-index: 4; }\n\n.CodeMirror-gutter-wrapper {\n  -webkit-user-select: none;\n  -moz-user-select: none;\n  user-select: none; }\n\n.CodeMirror-lines {\n  cursor: text;\n  min-height: 1px;\n  /* prevents collapsing before first draw */ }\n\n.CodeMirror pre {\n  /* Reset some styles that the rest of the page might have set */\n  -moz-border-radius: 0;\n  -webkit-border-radius: 0;\n  border-radius: 0;\n  border-width: 0;\n  background: transparent;\n  font-family: inherit;\n  font-size: inherit;\n  margin: 0;\n  white-space: pre;\n  word-wrap: normal;\n  line-height: inherit;\n  color: inherit;\n  z-index: 2;\n  position: relative;\n  overflow: visible;\n  -webkit-tap-highlight-color: transparent;\n  -webkit-font-variant-ligatures: none;\n  font-variant-ligatures: none; }\n\n.CodeMirror-wrap pre {\n  word-wrap: break-word;\n  white-space: pre-wrap;\n  word-break: normal; }\n\n.CodeMirror-linebackground {\n  position: absolute;\n  left: 0;\n  right: 0;\n  top: 0;\n  bottom: 0;\n  z-index: 0; }\n\n.CodeMirror-linewidget {\n  position: relative;\n  z-index: 2;\n  overflow: auto; }\n\n.CodeMirror-code {\n  outline: none; }\n\n/* Force content-box sizing for the elements where we expect it */\n.CodeMirror-scroll,\n.CodeMirror-sizer,\n.CodeMirror-gutter,\n.CodeMirror-gutters,\n.CodeMirror-linenumber {\n  -moz-box-sizing: content-box;\n  box-sizing: content-box; }\n\n.CodeMirror-measure {\n  position: absolute;\n  width: 100%;\n  height: 0;\n  overflow: hidden;\n  visibility: hidden; }\n\n.CodeMirror-cursor {\n  position: absolute; }\n\n.CodeMirror-measure pre {\n  position: static; }\n\ndiv.CodeMirror-cursors {\n  visibility: hidden;\n  position: relative;\n  z-index: 3; }\n\ndiv.CodeMirror-dragcursors {\n  visibility: visible; }\n\n.CodeMirror-focused div.CodeMirror-cursors {\n  visibility: visible; }\n\n.CodeMirror-selected {\n  background: #d9d9d9; }\n\n.CodeMirror-focused .CodeMirror-selected {\n  background: #d7d4f0; }\n\n.CodeMirror-crosshair {\n  cursor: crosshair; }\n\n.CodeMirror-line::selection, .CodeMirror-line > span::selection, .CodeMirror-line > span > span::selection {\n  background: #d7d4f0; }\n\n.CodeMirror-line::-moz-selection, .CodeMirror-line > span::-moz-selection, .CodeMirror-line > span > span::-moz-selection {\n  background: #d7d4f0; }\n\n.cm-searching {\n  background: #ffa;\n  background: rgba(255, 255, 0, 0.4); }\n\n/* IE7 hack to prevent it from returning funny offsetTops on the spans */\n.CodeMirror span {\n  *vertical-align: text-bottom; }\n\n/* Used to force a border model for a node */\n.cm-force-border {\n  padding-right: .1px; }\n\n@media print {\n  /* Hide the cursor when printing */\n  .CodeMirror div.CodeMirror-cursors {\n    visibility: hidden; } }\n\n/* See issue #2901 */\n.cm-tab-wrap-hack:after {\n  content: ''; }\n\n/* Help users use markselection to safely style text background */\nspan.CodeMirror-selectedtext {\n  background: none; }\n", ""]);
	
	// exports


/***/ },
/* 187 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(188);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 188 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "/*\n\n    Name:       Bespin\n    Author:     Mozilla / Jan T. Sott\n\n    CodeMirror template by Jan T. Sott (https://github.com/idleberg/base16-codemirror)\n    Original Base16 color scheme by Chris Kempson (https://github.com/chriskempson/base16)\n\n*/\n.cm-s-bespin.CodeMirror {\n  background: #28211c;\n  color: #9d9b97; }\n\n.cm-s-bespin div.CodeMirror-selected {\n  background: #36312e !important; }\n\n.cm-s-bespin .CodeMirror-gutters {\n  background: #28211c;\n  border-right: 0px; }\n\n.cm-s-bespin .CodeMirror-linenumber {\n  color: #666666; }\n\n.cm-s-bespin .CodeMirror-cursor {\n  border-left: 1px solid #797977 !important; }\n\n.cm-s-bespin span.cm-comment {\n  color: #937121; }\n\n.cm-s-bespin span.cm-atom {\n  color: #9b859d; }\n\n.cm-s-bespin span.cm-number {\n  color: #9b859d; }\n\n.cm-s-bespin span.cm-property, .cm-s-bespin span.cm-attribute {\n  color: #54be0d; }\n\n.cm-s-bespin span.cm-keyword {\n  color: #cf6a4c; }\n\n.cm-s-bespin span.cm-string {\n  color: #f9ee98; }\n\n.cm-s-bespin span.cm-variable {\n  color: #54be0d; }\n\n.cm-s-bespin span.cm-variable-2 {\n  color: #5ea6ea; }\n\n.cm-s-bespin span.cm-def {\n  color: #cf7d34; }\n\n.cm-s-bespin span.cm-error {\n  background: #cf6a4c;\n  color: #797977; }\n\n.cm-s-bespin span.cm-bracket {\n  color: #9d9b97; }\n\n.cm-s-bespin span.cm-tag {\n  color: #cf6a4c; }\n\n.cm-s-bespin span.cm-link {\n  color: #9b859d; }\n\n.cm-s-bespin .CodeMirror-matchingbracket {\n  text-decoration: underline;\n  color: white !important; }\n\n.cm-s-bespin .CodeMirror-activeline-background {\n  background: #404040; }\n", ""]);
	
	// exports


/***/ },
/* 189 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(190);
	const Component_1 = __webpack_require__(30);
	const Graph_1 = __webpack_require__(59);
	const Graph_2 = __webpack_require__(192);
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
/* 190 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(191);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 191 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, ".Graph.Drag {\n  position: fixed;\n  display: block;\n  opacity: 0.8;\n  z-index: 6;\n  pointer-events: none;\n  margin: 0;\n  cursor: grabbing;\n  cursor: -moz-grabbing;\n  cursor: -webkit-grabbing; }\n  .Graph.Drag.drag-hide {\n    display: none; }\n  .Graph.Drag.hide {\n    display: none; }\n  .Graph.Drag .plus, .Graph.Drag .click {\n    display: none; }\n", ""]);
	
	// exports


/***/ },
/* 192 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(193);
	const Component_1 = __webpack_require__(30);
	const Graph_1 = __webpack_require__(59);
	const Node_1 = __webpack_require__(195);
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
	        return Component_1.Component.createElement("svg", {class: klass, style: style}, mapUINodes(graph, uigraph, ownerType, blockId));
	    }
	    else {
	        return '';
	    }
	});


/***/ },
/* 193 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(194);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 194 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Graph {\n  margin-left: 16px;\n  flex-grow: 1;\n  width: 100%;\n  height: 100%; }\n", ""]);
	
	// exports


/***/ },
/* 195 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(196);
	const Component_1 = __webpack_require__(30);
	const DragDrop_1 = __webpack_require__(95);
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
	    const { mousedown, mousemove, mouseup } = DragDrop_1.DragDropHelper.drag(signals, (nodePos) => {
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
/* 196 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(197);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 197 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "@keyframes blinker {\n  50% {\n    opacity: 0.0; } }\n\n@keyframes pulse {\n  from {\n    stroke: black;\n    fill: white;\n    transform: translateY(0px); }\n  to {\n    stroke: white;\n    fill: transparent;\n    transform: translateY(-3px); } }\n\n@keyframes detached {\n  0% {\n    stroke: black; }\n  50% {\n    stroke: black; }\n  100% {\n    stroke: #c80000; } }\n\n@keyframes ghost {\n  0% {\n    opacity: 0.7; }\n  100% {\n    opacity: 1.0; } }\n\n.blink {\n  animation: blinker 1s linear infinite; }\n\n.pulse {\n  animation: pulse 0.4s infinite alternate; }\n\n._detachedFx, svg .slot.detached {\n  animation: detached 0.8s infinite alternate; }\n\n._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect, svg * {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\nsvg path.box1 {\n  fill: #756b4e;\n  cursor: pointer; }\n  svg path.box1:hover {\n    fill: #8e815f; }\n  svg path.box1.dark {\n    fill: #222222; }\n  svg path.box1.sel {\n    fill: #db8b3a; }\n\n.li.box1 {\n  background: #907e4d; }\n\nsvg path.box2 {\n  fill: #6c754e;\n  cursor: pointer; }\n  svg path.box2:hover {\n    fill: #838e5f; }\n  svg path.box2.dark {\n    fill: #222222; }\n  svg path.box2.sel {\n    fill: #db8b3a; }\n\n.li.box2 {\n  background: #80904d; }\n\nsvg path.box3 {\n  fill: #59754e;\n  cursor: pointer; }\n  svg path.box3:hover {\n    fill: #6b8e5f; }\n  svg path.box3.dark {\n    fill: #222222; }\n  svg path.box3.sel {\n    fill: #db8b3a; }\n\n.li.box3 {\n  background: #5f904d; }\n\nsvg path.box4 {\n  fill: #4e7557;\n  cursor: pointer; }\n  svg path.box4:hover {\n    fill: #5f8e69; }\n  svg path.box4.dark {\n    fill: #222222; }\n  svg path.box4.sel {\n    fill: #db8b3a; }\n\n.li.box4 {\n  background: #4d905d; }\n\nsvg path.box5 {\n  fill: #4e756b;\n  cursor: pointer; }\n  svg path.box5:hover {\n    fill: #5f8e81; }\n  svg path.box5.dark {\n    fill: #222222; }\n  svg path.box5.sel {\n    fill: #db8b3a; }\n\n.li.box5 {\n  background: #4d907e; }\n\nsvg path.box6 {\n  fill: #4e6c75;\n  cursor: pointer; }\n  svg path.box6:hover {\n    fill: #5f838e; }\n  svg path.box6.dark {\n    fill: #222222; }\n  svg path.box6.sel {\n    fill: #db8b3a; }\n\n.li.box6 {\n  background: #4d8090; }\n\nsvg path.box7 {\n  fill: #4e5975;\n  cursor: pointer; }\n  svg path.box7:hover {\n    fill: #5f6b8e; }\n  svg path.box7.dark {\n    fill: #222222; }\n  svg path.box7.sel {\n    fill: #db8b3a; }\n\n.li.box7 {\n  background: #4d5f90; }\n\nsvg path.box8 {\n  fill: #574e75;\n  cursor: pointer; }\n  svg path.box8:hover {\n    fill: #695f8e; }\n  svg path.box8.dark {\n    fill: #222222; }\n  svg path.box8.sel {\n    fill: #db8b3a; }\n\n.li.box8 {\n  background: #5d4d90; }\n\nsvg path.box9 {\n  fill: #6b4e75;\n  cursor: pointer; }\n  svg path.box9:hover {\n    fill: #815f8e; }\n  svg path.box9.dark {\n    fill: #222222; }\n  svg path.box9.sel {\n    fill: #db8b3a; }\n\n.li.box9 {\n  background: #7e4d90; }\n\nsvg path.box10 {\n  fill: #754e6c;\n  cursor: pointer; }\n  svg path.box10:hover {\n    fill: #8e5f83; }\n  svg path.box10.dark {\n    fill: #222222; }\n  svg path.box10.sel {\n    fill: #db8b3a; }\n\n.li.box10 {\n  background: #904d80; }\n\nsvg path.box11 {\n  fill: #754e59;\n  cursor: pointer; }\n  svg path.box11:hover {\n    fill: #8e5f6b; }\n  svg path.box11.dark {\n    fill: #222222; }\n  svg path.box11.sel {\n    fill: #db8b3a; }\n\n.li.box11 {\n  background: #904d5f; }\n\nsvg path.box12 {\n  fill: #75574e;\n  cursor: pointer; }\n  svg path.box12:hover {\n    fill: #8e695f; }\n  svg path.box12.dark {\n    fill: #222222; }\n  svg path.box12.sel {\n    fill: #db8b3a; }\n\n.li.box12 {\n  background: #905d4d; }\n\nsvg .slot {\n  fill: none;\n  stroke: black;\n  stroke-width: 1px; }\n  svg .slot.detached {\n    stroke-width: 3px;\n    stroke: black;\n    transform: translateY(-1px); }\n\nsvg .plus {\n  fill: none;\n  stroke: #302c2c;\n  stroke-width: 1px;\n  cursor: pointer; }\n\nsvg .click {\n  fill: transparent;\n  transition: fill 0.8s;\n  stroke: none;\n  cursor: pointer; }\n  svg .click:hover, svg .click.active {\n    fill: rgba(0, 0, 0, 0.3); }\n\nsvg text {\n  pointer-events: none;\n  font-size: getfont(size);\n  fill: #000; }\n  svg text.main {\n    fill: #d98632; }\n\nsvg path {\n  stroke-width: 1px;\n  stroke: black; }\n  svg path.main {\n    cursor: pointer;\n    fill: #3d3838; }\n    svg path.main:hover {\n      fill: #4b4444; }\n    svg path.main.sel {\n      fill: #db8b3a; }\n  svg path.ghost {\n    stroke: #D76D01; }\n\nsvg#files {\n  border: 2px dashed transparent; }\n  svg#files.drag-over {\n    border-color: #71583e; }\n\nsvg#scratch {\n  position: fixed;\n  top: 0;\n  left: 0;\n  z-index: -999;\n  opacity: 0; }\n", ""]);
	
	// exports


/***/ },
/* 198 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(199);
	const Component_1 = __webpack_require__(30);
	const DragDrop_1 = __webpack_require__(95);
	const Factory_1 = __webpack_require__(104);
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
/* 199 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(200);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 200 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane, .Library {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap, .Library .wrap {\n    overflow: visible; }\n  ._pane .bar, .Library .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow, .Library .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow, .Library .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar, .Library .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow, .Library .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow, .Library .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, .Library .bar .fa, ._pane .bar .name, .Library .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name, .Library .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover, .Library .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer, .Library .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow, .Library .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow, .Library .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Library {\n  left: -168px;\n  transition: left 0.2s;\n  border-bottom-right-radius: 4px;\n  padding-bottom: 4px; }\n  .Library .bar {\n    flex-direction: row-reverse; }\n    .Library .bar.fbar {\n      flex-direction: row;\n      left: 0; }\n  .Library.active {\n    left: 0; }\n  .Library .results {\n    min-height: 200px;\n    max-height: 400px; }\n    .Library .results .li {\n      padding-left: 12px; }\n    .Library .results.drop {\n      border: 2px solid #D76D01; }\n", ""]);
	
	// exports


/***/ },
/* 201 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(202);
	const Component_1 = __webpack_require__(30);
	const Playback_1 = __webpack_require__(118);
	const cache = { nodecache: {} };
	/* ====== PLAYBACK LIBS ======= */
	const THREE = __webpack_require__(204);
	window['THREE'] = THREE;
	/* ====== PLAYBACK LIBS ======= */
	exports.Playback = Component_1.Component({ graph: ['scene', 'graph']
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
	        const func = Playback_1.PlaybackHelper.compile(state.graph, cache);
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
/* 202 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(203);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 203 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Playback {\n  background: #232020;\n  color: #999999;\n  display: flex;\n  justify-content: center;\n  align-items: center;\n  width: 100%; }\n  .Playback .wrap {\n    position: relative; }\n  .Playback .Screen {\n    position: absolute; }\n    .Playback .Screen #screen {\n      background: black;\n      width: 100%;\n      height: 100%; }\n    .Playback .Screen svg {\n      position: absolute;\n      top: 0;\n      left: 0; }\n  .Playback .tv rect {\n    stroke: #333333;\n    stroke-width: 1px;\n    fill: none; }\n", ""]);
	
	// exports


/***/ },
/* 204 */
/***/ function(module, exports, __webpack_require__) {

	module.exports = (__webpack_require__(12))(99);

/***/ },
/* 205 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(206);
	const Component_1 = __webpack_require__(30);
	const Factory_1 = __webpack_require__(104);
	const Graph_1 = __webpack_require__(192);
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
/* 206 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(207);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 207 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Project {\n  width: 200px;\n  flex-grow: 1;\n  border: 1px solid #353131;\n  border-width: 1px 0 0 0;\n  display: flex;\n  flex-direction: column; }\n  .Project .name {\n    color: #d98632; }\n", ""]);
	
	// exports


/***/ },
/* 208 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(209);
	const Component_1 = __webpack_require__(30);
	const Factory_1 = __webpack_require__(104);
	const selectScene = (signals, _id) => {
	    signals.scene.select({ _id });
	};
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
/* 209 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(210);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 210 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane, .ProjectPane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap, .ProjectPane .wrap {\n    overflow: visible; }\n  ._pane .bar, .ProjectPane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow, .ProjectPane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow, .ProjectPane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar, .ProjectPane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow, .ProjectPane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow, .ProjectPane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, .ProjectPane .bar .fa, ._pane .bar .name, .ProjectPane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name, .ProjectPane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover, .ProjectPane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer, .ProjectPane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow, .ProjectPane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow, .ProjectPane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.ProjectPane {\n  right: -168px;\n  transition: right 0.2s;\n  border-bottom-left-radius: 4px;\n  padding-bottom: 4px; }\n  .ProjectPane .bar {\n    flex-direction: row; }\n    .ProjectPane .bar.fbar {\n      flex-direction: row-reverse;\n      right: 0; }\n  .ProjectPane.active {\n    right: 0; }\n", ""]);
	
	// exports


/***/ },
/* 211 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(212);
	const Component_1 = __webpack_require__(30);
	const Factory_1 = __webpack_require__(104);
	const Graph_1 = __webpack_require__(192);
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
/* 212 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(213);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 213 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Scene {\n  position: relative;\n  flex-grow: 1;\n  border: 1px solid #353131;\n  border-width: 1px 0 0 1px;\n  display: flex;\n  flex-direction: column; }\n  .Scene .name {\n    color: #d98632; }\n", ""]);
	
	// exports


/***/ },
/* 214 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(215);
	const Component_1 = __webpack_require__(30);
	exports.Login = Component_1.Component({}, ({ signals }) => (Component_1.Component.createElement("div", {class: 'Login'}, 
	    Component_1.Component.createElement("div", {class: 'wrap'}, 
	        Component_1.Component.createElement("h3", null, "Please login"), 
	        Component_1.Component.createElement("div", null, "todo"))
	)));


/***/ },
/* 215 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(216);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 216 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ },
/* 217 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(218);
	const Component_1 = __webpack_require__(30);
	const selectProject = (signals, _id) => {
	    signals.project.select({ _id });
	};
	const sortByName = (a, b) => a.name > b.name ? 1 : -1;
	const showProjects = ({ projectsById, selectedProjectId }, signals, services) => {
	    const list = [];
	    for (const k in (projectsById || {})) {
	        list.push(projectsById[k]);
	    }
	    list.sort(sortByName);
	    return list.map((project) => (Component_1.Component.createElement("div", {class: { li: true,
	        sel: project._id === selectedProjectId
	    }}, 
	        Component_1.Component.createElement("a", {href: services.router.getSignalUrl('project', { id: project._id })}, 
	            Component_1.Component.createElement("div", {class: 'fa fa-film'}), 
	            project.name)
	    )));
	};
	exports.ProjectChooser = Component_1.Component({ projectsById: ['data', 'project'],
	    selectedProjectId: ['user', 'projectId']
	}, ({ state, signals, services }) => (Component_1.Component.createElement("div", {class: { ProjectChooser: true, Modal: true, active: true }}, 
	    Component_1.Component.createElement("div", {class: 'wrap'}, 
	        Component_1.Component.createElement("p", {class: 'message'}, "Select project"), 
	        Component_1.Component.createElement("div", {class: 'list'}, 
	            showProjects(state, signals, services), 
	            Component_1.Component.createElement("div", {class: 'li add', "on-click": () => signals.project.add({})}, "+")))
	)));


/***/ },
/* 218 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(219);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 219 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.ProjectChooser .wrap {\n  width: 300px; }\n", ""]);
	
	// exports


/***/ },
/* 220 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(221);
	const Component_1 = __webpack_require__(30);
	const Status_1 = __webpack_require__(223);
	const Sync_1 = __webpack_require__(226);
	exports.StatusBar = Component_1.Component({ status: ['$status', 'list']
	}, ({ state, signals }) => {
	    const l = state.status || [];
	    const s = l[0];
	    return Component_1.Component.createElement("div", {class: 'StatusBar'}, 
	        s ? Component_1.Component.createElement(Status_1.Status, {status: s}) : '', 
	        Component_1.Component.createElement(Sync_1.Sync, null));
	});


/***/ },
/* 221 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(222);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 222 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.StatusBar {\n  position: fixed;\n  bottom: 0;\n  height: 20px;\n  width: 100%;\n  background: #3d3838;\n  border: 1px solid #353131;\n  padding: 8px;\n  color: #999999;\n  z-index: 4;\n  display: flex;\n  justify-content: flex-start; }\n  .StatusBar .Status {\n    flex-grow: 1; }\n  .StatusBar .Sync {\n    flex-grow: 0;\n    align-content: flex-end; }\n", ""]);
	
	// exports


/***/ },
/* 223 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(224);
	const Component_1 = __webpack_require__(30);
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
/* 224 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(225);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 225 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n@keyframes fadea {\n  0% {\n    opacity: 1.0; }\n  100% {\n    opacity: 0.1; } }\n\n@keyframes fadeb {\n  0% {\n    opacity: 1.0; }\n  100% {\n    opacity: 0.1; } }\n\n.Status {\n  cursor: pointer; }\n  .Status.info {\n    color: #777; }\n    .Status.info .outer {\n      stroke: #666; }\n    .Status.info .inner {\n      fill: #666;\n      animation: fadea 2s 1 both; }\n  .Status.error {\n    color: #a77; }\n    .Status.error .outer {\n      stroke: #b22; }\n    .Status.error .inner {\n      fill: #f00;\n      animation: fadea 2s 1 both; }\n  .Status.warn {\n    color: #997; }\n    .Status.warn .outer {\n      stroke: #bb0; }\n    .Status.warn .inner {\n      fill: #ff0;\n      animation: fadeb 2s 1 both; }\n  .Status.success {\n    color: #686; }\n    .Status.success .outer {\n      stroke: #0b0; }\n    .Status.success .inner {\n      fill: #0f0;\n      animation: fadeb 2s 1 both; }\n  .Status .outer {\n    stroke-width: 1px;\n    stroke: #000;\n    fill: none; }\n  .Status .inner {\n    stroke: none;\n    fill: #000; }\n", ""]);
	
	// exports


/***/ },
/* 226 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(227);
	const Component_1 = __webpack_require__(30);
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
/* 227 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(228);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 228 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap {\n    padding: 8px; }\n  ._info .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.Sync {\n  width: 1em;\n  height: 1em;\n  margin-right: 8px;\n  color: #686; }\n  .Sync.paused {\n    color: #686; }\n  .Sync.active {\n    color: #fe9327; }\n  .Sync.offline {\n    color: #a77; }\n  .Sync.error {\n    color: #a77; }\n", ""]);
	
	// exports


/***/ },
/* 229 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(230);
	const Component_1 = __webpack_require__(30);
	const Status_1 = __webpack_require__(223);
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
/* 230 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(231);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 231 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "._info, .StatusDetail {\n  background: rgba(35, 32, 32, 0.95);\n  border: 1px solid #353131;\n  border-top-right-radius: 4px;\n  color: #999999;\n  min-width: 180px;\n  max-width: 380px;\n  min-height: 100px;\n  position: fixed;\n  bottom: 37px;\n  left: 0; }\n  ._info .wrap, .StatusDetail .wrap {\n    padding: 8px; }\n  ._info .bar, .StatusDetail .bar {\n    border-top-right-radius: 4px; }\n  ._info .wrap, .StatusDetail .wrap {\n    max-height: 300px;\n    overflow: auto; }\n\n._list {\n  background: #3d3838;\n  height: 200px;\n  border: 1px solid #353131;\n  margin-top: -1px;\n  overflow-x: hidden; }\n  ._list p {\n    background: #4b4444;\n    border: 1px solid #353131;\n    padding: 8px 4px;\n    margin: -1px; }\n\n._noselect {\n  -webkit-touch-callout: none;\n  -webkit-user-select: none;\n  -khtml-user-select: none;\n  -moz-user-select: none;\n  -ms-user-select: none;\n  user-select: none; }\n\n.bar {\n  background: #302c2c;\n  padding-left: 4px; }\n  .bar div {\n    display: inline-block; }\n  .bar .fa {\n    color: #5a534b; }\n  .bar .fa.active, .bar .active > .fa {\n    color: #f1d2b3; }\n  .bar.tabs {\n    display: flex;\n    justify-content: flex-end;\n    align-items: flex-end; }\n    .bar.tabs .stretch {\n      flex-grow: 1; }\n  .bar .tab {\n    border-left: 1px solid #232020;\n    color: #868686;\n    padding: 4px 8px; }\n    .bar .tab.sel {\n      background: #28211c; }\n\n._pane {\n  z-index: 5;\n  position: fixed;\n  top: 4px;\n  box-shadow: 0 0 10px #151414;\n  background: rgba(75, 68, 68, 0.95);\n  width: 160px; }\n  ._pane .wrap {\n    overflow: visible; }\n  ._pane .bar {\n    display: flex;\n    align-items: center;\n    flex-direction: row-reverse;\n    cursor: pointer;\n    padding: 0;\n    height: 32px; }\n    ._pane .bar .rarrow {\n      border-left-color: #282525; }\n    ._pane .bar .larrow {\n      border-right-color: #282525; }\n    ._pane .bar.fbar {\n      flex-direction: row;\n      background: none;\n      position: fixed;\n      height: 32px;\n      top: 4px; }\n      ._pane .bar.fbar .rarrow {\n        border-left-color: #302c2c; }\n      ._pane .bar.fbar .larrow {\n        border-right-color: #302c2c; }\n    ._pane .bar .fa, ._pane .bar .name {\n      padding: 8px;\n      border-radius: 0;\n      background: #302c2c; }\n    ._pane .bar .name {\n      color: #868686; }\n      ._pane .bar .name:hover {\n        color: #9f9f9f; }\n    ._pane .bar .spacer {\n      width: 16px;\n      height: 100%;\n      background-color: #282525; }\n  ._pane .larrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-left: none; }\n  ._pane .rarrow {\n    margin: 0;\n    padding: 0;\n    width: 0;\n    height: 0;\n    border: 16px solid transparent;\n    border-right: none; }\n\n.Modal {\n  position: fixed;\n  top: 0;\n  left: 0;\n  width: 100%;\n  height: 100%;\n  display: flex;\n  background-color: rgba(20, 20, 20, 0);\n  transition: background-color 0.8s, opacity 0.3s;\n  z-index: -9;\n  opacity: 0;\n  justify-content: center;\n  align-items: center; }\n  .Modal.active {\n    background-color: rgba(20, 20, 20, 0.5);\n    opacity: 1;\n    z-index: 9; }\n  .Modal .wrap {\n    background: #918787;\n    padding: 8px;\n    border: 1px solid #353131;\n    border-radius: 4px;\n    min-width: 160px; }\n  .Modal .message {\n    margin: 4px 0; }\n  .Modal .bwrap {\n    margin-top: 32px;\n    display: flex;\n    flex-direction: row;\n    align-items: flex-end; }\n\n.button {\n  padding: 2px 4px;\n  border-radius: 4px;\n  border: 2px solid #332e2e;\n  border-top-color: #383333;\n  border-right-color: #383333;\n  margin: 8px;\n  cursor: pointer;\n  background: linear-gradient(#b1aaaa, #7d7373); }\n  .button:active {\n    position: relative;\n    top: 1px; }\n  .button:active {\n    background: linear-gradient(#7d7373, #b1aaaa); }\n  .button.delete {\n    background: linear-gradient(#a97e7e, #815656); }\n  .button.continue {\n    background: linear-gradient(#b0906f, #8b6c4d);\n    align-self: flex-end; }\n\n.StatusDetail {\n  visibility: hidden;\n  opacity: 0;\n  transition: visibility 0.3s, opacity 0.3s;\n  z-index: 4; }\n  .StatusDetail.active {\n    opacity: 1;\n    visibility: visible; }\n  .StatusDetail .entry {\n    border-top: 1px solid rgba(88, 81, 81, 0.95);\n    padding: 4px 0;\n    white-space: pre-wrap; }\n    .StatusDetail .entry:first-child {\n      border: 0; }\n", ""]);
	
	// exports


/***/ },
/* 232 */
/***/ function(module, exports, __webpack_require__) {

	"use strict";
	__webpack_require__(233);
	const Component_1 = __webpack_require__(30);
	const Factory_1 = __webpack_require__(104);
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
	        Component_1.Component.createElement("p", {class: 'message', "on-click": () => signals.user.githubLibraryGet()}, "User preferences"), 
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
/* 233 */
/***/ function(module, exports, __webpack_require__) {

	// style-loader: Adds some css to the DOM by adding a <style> tag
	
	// load the styles
	var content = __webpack_require__(234);
	if(typeof content === 'string') content = [[module.id, content, '']];
	// add the styles to the DOM
	var update = __webpack_require__(173)(content, {});
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
/* 234 */
/***/ function(module, exports, __webpack_require__) {

	exports = module.exports = __webpack_require__(172)();
	// imports
	
	
	// module
	exports.push([module.id, "", ""]);
	
	// exports


/***/ }
/******/ ]);
//# sourceMappingURL=app.js.map