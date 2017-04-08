import * as Store from '@hoodie/store-client'

/*
function Hoodie (store, options) {
  options = options || {}
  var chains = hoodieChains(options.path || ['data'])
  var callbacks = {}

  return {
    init: function init (args) {
      callbacks.onStoreChange = function onStoreChange (action, doc) {
        args.controller.signals[args.name].storeChanged({
          action: action,
          doc: doc
        })
      }

      callbacks.onStoreClear = function onStoreClear (action, doc) {
        args.controller.signals[args.name].storeChanged({
          action: 'clear'
        })
      }

      store.on('change', callbacks.onStoreChange)
      store.on('clear', callbacks.onStoreClear)

      args.signals.attached({
        connect: options.connect
      })
    },
    signals: {
      attached: chains.attached,
      storeChanged: chains.storeChanged
    },
    services: {
      store: store,
      detach: function detach () {
        store.off('change', callbacks.onStoreChange)
        store.off('clear', callbacks.onStoreClear)
      }
    }
  }
}

Hoodie.Store = Store
module.exports = Hoodie

function hoodieChains (path) {
  function connect (args) {
    var store = args.services.hoodie.store

    if (args.input.connect) {
      store.connect()
    }
  }

  function checkAction (args) {
    args.output[args.input.action]()
  }
  checkAction.outputs = ['add', 'update', 'remove', 'clear']

  function setHoodieDoc (args) {
    args.state.set(path.concat([args.input.doc.type, args.input.doc.id]), args.input.doc)
  }

  function unsetHoodieDoc (args) {
    args.state.unset(path.concat([args.input.doc.type, args.input.doc.id]))
  }

  function clearHoodiePath (args) {
    args.state.set(path, {})
  }

  function reload (args) {
    var store = args.services.hoodie.store

    store.findAll(function () {
      return true
    }).then(function (allObjects) {
      var data = allObjects.reduce(function (data, object) {
        data[object.type] = data[object.type] || {}
        data[object.type][object.id] = object
        return data
      }, {})
      args.output.success({
        data: data
      })
    })
  }

  return {
    attached: [
      [reload, {
        success: [inputToState('data', path), connect],
        error: []
      }]
    ],

    storeChanged: [
      checkAction, {
        add: [setHoodieDoc],
        update: [setHoodieDoc],
        remove: [unsetHoodieDoc],
        clear: [clearHoodiePath]
      }
    ]
  }
}
*/
