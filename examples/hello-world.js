const {
    App, 
    adw: {Window, HeaderBar, WindowTitle, Clamp},
    gtk: {Box, Label}, 
    on,
    set: {content, orientation, titleWidget, title, child, vexpand, label}, 
    orientation: {vertical}, 
    go: {append, present, setDefaultSize},
    style,
    quit
} = require("..")

App("org.yuta.Test", app => 
    Window(
        setDefaultSize(400,400),
        on["close-request"](quit(app)),
        content(
            Box(
                orientation(vertical),
                append(
                    HeaderBar(
                        titleWidget(WindowTitle(title("Hello World App"))),
                    )
                ),
                append(
                    Clamp(
                        child(
                            Label(
                                vexpand(true),
                                style("title-1"),
                                label("Hello World")
                            )
                        )
                    )
                )
            )
        ),
        present()
    )
)