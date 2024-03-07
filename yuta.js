const gi = require("node-gtk");
const Gtk = gi.require("Gtk", '4.0') 
const Adw = gi.require("Adw", '1')
const GLib = gi.require("GLib", '2.0')

const App = (id, onActivate) => {
    const loop = GLib.MainLoop.new(null, false)
    const app = new Gtk.Application(id, 0)
    app.on('activate', () => {
        onActivate({app, loop})
        gi.startLoop()
        loop.run()
    })
    return app.run([])
}

const makeNS = rawNS => 
    new Proxy({}, {
        get: (t, klass) => (... fns) => fns.reduce((obj, fn) => fn(obj), new rawNS[klass]({}))
    })

const gtk = makeNS(Gtk)

const adw = makeNS(Adw)

const set = new Proxy({}, {
    get: (t, prop) => data => obj => (obj[prop] = data, obj)
})

const on = new Proxy({}, {
    get: (t, event) => listener => obj => (obj.on(event, listener), obj)
})

const go = new Proxy({}, {
    get: (t, method) => (... args) => obj => (obj[method](... args), obj)
})

const bind = new Proxy({}, {
    get: (t, prop) => (state, fn) => obj => {
        state.on(v => obj[prop] = fn ? fn(v) : v)
        obj[prop] = fn ? fn(state.value) : state.value
        return obj
    }
})

const each = state => fn => obj => {
    let widgets = []
    let update = v => {
        widgets.forEach((_, i) => obj.remove(widgets[i]))
        widgets = []
        state.value.forEach(e => {
            let child = fn(e)
            obj.append(child)
            widgets.push(child)
        })
    }
    state.on(update)
    update(state.value)
    return obj
}

const state = value => new Proxy({value, on(fn) {this.listeners.push(fn)}, listeners: []}, {
    get: (t, prop) => t[prop],
    set: (t, prop, v) => {
        t[prop] = v
        t.listeners.forEach(fn => fn(v))
    }
})

const style = (...classes) => obj => (classes.forEach(c => obj.addCssClass(c)), obj)

const orientation = {
    vertical: Gtk.Orientation.VERTICAL,
    horizontal: Gtk.Orientation.HORIZONTAL
}

const quit = ({app, loop}) => () => {
    loop.quit()
    app.quit()
    return false
}

module.exports = {App, gtk, adw, set, on, go, each, state, bind, style, quit, orientation}