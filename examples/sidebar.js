const {
    App, 
    adw: {Window, HeaderBar, WindowTitle, Clamp, Flap, Bin},
    gtk: {Box, Label, ListBox, Button, CssProvider, StyleContext}, 
    on,
    set: {content, flap, orientation, titleWidget, title, child,  iconName, vexpand, label, visible}, 
    orientation: {vertical}, 
    go: {append, present, setDefaultSize, setSizeRequest, packStart, loadFromFile, addProviderForDisplay},
    style,
    state,
    bind,
    quit,
    css
} = require("@ostov-larion/yuta")

const st = state(false)
const op = state(true)

const AppStyle = 
`
listbox {
    background-color: #1d2021;
}
  
clamp {
    background-color: rgba(221, 199, 161, 0.1);
    border-radius: 12px;
    margin-right: 6px;
    margin-bottom: 6px;
    margin-left: 6px;
}
`

const AppHeader = () => 
    HeaderBar(
        titleWidget(WindowTitle(title("Sidebar Example"))),
        packStart(
            Button(
                iconName("sidebar"),
                bind.opacity(st, v => v+0),
                bind.sensitive(st),
                on["clicked"] (() => op.value = !op.value)
            )
        )
    )

const Main = () => 
    Clamp(
        child(
            Label(setSizeRequest(500, 400),bind.label(st, v => v ? "Folded" : "Unfolded"))
        )
    )

const Sidebar = () =>
    Bin(
        style("background"), 
        child(
            ListBox(
                style("navigation-sidebar","background"),
                setSizeRequest(300, 400),
                orientation(vertical),
                vexpand(true),
                append(Label( label("Sidebar")))
            )
        )
    )

const AppBody = () => 
    Flap(
        on["notify"] (obj => obj.folded ? st.value = true : st.value = false),
        bind.revealFlap(op),
        flap(Sidebar()),
        content(Main())
    )

App("org.yuta.Test", app => 
    Window(
        setDefaultSize(1000,400),
        on["close-request"](() => {quit(app); process.exit(0)}),
        css(AppStyle),
        content(
            Box(
                orientation(vertical),
                append(AppHeader()),
                append(AppBody())
            )
        ),
        present()
    )
)