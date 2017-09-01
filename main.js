"use strict";
const {app, BrowserWindow, ipcMain} = require("electron");

let mainWin = null; // keep main window global
let timerCreator = null; // keep timer creator window global;

let createWindow = (url, width=625, height=280) => { // function to create a new window
    let win = new BrowserWindow({
        width: width,
        height: height,
        frame: false,
        show: false,
        maximizable: true,
        useContentSize: true,
        minWidth: 625,
        minHeight: 280,
        title: "Time Till",
        icon: "./icon.png",
        webPreferences: {
            devTools: false,
            acceptFirstMouse: true
        }
    });
    win.loadURL(`${__dirname}\\${url}`);
    win.on("closed", () => {
        win = null;
    });

    win.setMenu(null);

    return win;
}

let createModal = (url, parent, width=400, height=340) => {
    let win = new BrowserWindow({
        parent: parent,
        modal: true,
        width: width,
        height: height,
        frame: false,
        show: false,
        useContentSize: true,
        resizable: false,
        maximizable: false,
        title: "Create Timer",
        webPreferences: {
             devTools: false,
             acceptFirstMouse: true
        }
    });
    win.loadURL(`${__dirname}\\${url}`);
    win.on("closed", () => {
        win = null;
    });

    win.setMenu(null);

    return win;
}


app.on("ready", () => {
    mainWin = createWindow("pages/index.html"); // make window opening index.html
    mainWin.once("ready-to-show", () => {
        mainWin.show();
    });
     // mainWin.openDevTools();
});

app.on('window-all-closed', () => {
    mainWin.webContents.session.clearCache(() => {
        app.quit()
    });
});

exports.exit = () => {
     // minimise the main window
     mainWin.webContents.session.clearCache(() => {
         mainWin.close();
     });
};

exports.exitModal = () => {
    timerCreator.webContents.session.clearCache(() => {
        timerCreator.close();
    });
};

exports.reload = () => {
    app.relaunch(); // will relaunch app once quit
    app.quit(); // quit the app to make it relaunch
};

let mainWinMaximised = false;

exports.maximise = () => {
    if (mainWinMaximised) {
        mainWin.unmaximize();
        mainWinMaximised = false;
    } else {
        mainWin.maximize();
        mainWinMaximised = true;
    }
};

exports.minimise = () => {
    mainWin.minimize();
};

exports.setResizable = (resizable) => {
    mainWin.setResizable(resizable);
};

exports.setMaximizable = (maximizable) => {
    mainWin.setMaximizable(maximizable);
};

exports.timerCreatorWindow = () => {
    timerCreator = createModal("pages/modal-index.html", mainWin);
    timerCreator.once("ready-to-show", () => {
        timerCreator.show();
    });
};

exports.setFullScreen = (fullScreen) => {
    mainWin.setFullScreen(fullScreen);
};

exports.setOnTop = (onTop) => {
    mainWin.setAlwaysOnTop(onTop);
};

exports.setMinimumSize = (width, height) => {
    mainWin.setMinimumSize(width, height);
};

exports.setMaximumSize = (width, height) => {
    mainWin.setMaximumSize(width, height);
};

exports.setSize = (w, h) => {
    mainWin.setSize(w, h);
};

exports.getSize = () => {
    return mainWin.getSize();
};

ipcMain.on("create-new-timer", (event, name, formattedTime, timeSet) => {
    console.log(formattedTime);
    timerCreator.close();

    mainWin.webContents.send("create-new", name, formattedTime, timeSet);
});
