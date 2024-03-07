const {
    App, 
    adw: {Window, HeaderBar, WindowTitle, Clamp},
    gtk: {Box, ListBox, ListBoxRow, Label, Button}, 
    on, 
    set: {content, orientation, titleWidget, title, label, iconName, child, vexpand}, 
    orientation: {vertical}, 
    go: {append, present, packEnd, setDefaultSize, addCssClass},
    bind,
    each,
    state,
    style,
    quit
} = require("..")

const counter = state(0)

const AppHeader = () =>
    HeaderBar(
        titleWidget(WindowTitle(title("Counter App"))),
        packEnd(
            Button(
                iconName("list-add"),
                on.clicked(() => counter.value++)
            )
        ),
        packEnd(
            Button(
                iconName("list-remove"),
                on.clicked(() => counter.value--)
            )
        )
    )

const AppBody = () => 
    Clamp(
        child(
            Label(
                vexpand(true),
                style("title-1", "dim-label"),
                bind.label(counter, v => v.toString())
            )
        )
    )

App("org.yuta.Test", app => 
    Window(
        setDefaultSize(400,400),
        on["close-request"](quit(app)),
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