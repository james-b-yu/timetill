const moment = require("moment"); // include the moment.js library for time calculations

const { remote, ipcRenderer } = require("electron"); // remote and ipc
const main = remote.require("./main.js"); // main export functions
const fs = require("fs"); // writing to file system
const zenscroll = require("zenscroll");

let currentTimeDisplayDiv = document.getElementById("current-time-display"); // div displaying current time
const databaseLocation = `${process.env.APPDATA}/Time Till/database.json`;

// make appdata folder if non existant
if (!fs.existsSync(`${process.env.APPDATA}/Time Till/`)) {
    fs.mkdirSync(`${process.env.APPDATA}/Time Till/`);
}

// attempt to load database file
let database; // keep database global
let timers = []; // array of all timers
let addedTimers = false;

// make database template
let plainDatabase = {
    timers: [], // will hold all timers
    settings: { // will hold all settings
        theme: 0, // default theme is dark
        onTop: false, // window on top?
    },
};

// create function to create new timer and add timer to array in database

try {
    database = require(databaseLocation);
    // load timers and settings from disk
    window.setTimeout(() => {
        for (let i = 0; i < database.timers.length; i++) {
            console.log("hi");
            timers.push(new Timer(database.timers[i].label, database.timers[i].time, database.timers[i].timeSet, database.timers[i].hidden, false));

            if (!database.timers[i].hidden) {
                addedTimers = true;
            }
        }

        loadTheme(database.settings.theme); // loads theme from database
        if (database.settings.onTop) toggleOnTop(); // toggles if database settings are true
        plainDatabase.settings.theme = database.settings.theme; // transfer settings over to plain database
        console.log("database loaded");
    }, 50);
} catch (e) {
    console.log("database non-existant");

    fs.writeFile(databaseLocation, JSON.stringify(plainDatabase), "utf8", () => {
        // load database once written
        database = require(databaseLocation);
        loadTheme(database.settings.theme); // loads theme from database
        if (database.settings.onTop) toggleOnTop(); // toggles if database settings are true
        console.log("database loaded");
    });
}

// function to load theme
let loadTheme = (theme) => {
    // for ease of reading make a pointer to document.style.setProperty
    /* DEFAULT THEME
    :root {
        --colour-1: black;
        --colour-2: white;
        --colour-disabled: grey;

        --colour-rich: #001F3F;
        --colour-shallow: #0074D9;
        --colour-light: #7FDBFF;
        --colour-natural: #01FF70;
        --colour-peace: #39CCCC;

        --colour-error: #F012BE;
        --colour-danger: #85144B;
        --colour-warn: #FFDC00;
    }*/
    switch (theme) {
        case "dark":
        case 0:
            document.body.style.setProperty("--colour-1", "black");
            document.body.style.setProperty("--colour-2", "white");
            document.body.style.setProperty("--colour-disabled", "grey");
            document.body.style.setProperty("--colour-rich", "#001F3F");
            document.body.style.setProperty("--colour-shallow", "#68B1D1");
            document.body.style.setProperty("--colour-light", "#7FD8FF");
            document.body.style.setProperty("--colour-natural", "#01FF70");
            document.body.style.setProperty("--colour-peace", "#39CCCC");
            document.body.style.setProperty("--colour-error", "#F012BE");
            document.body.style.setProperty("--colour-danger", "#85144B");
            document.body.style.setProperty("--colour-warn", "#FFDC00");
            break;
        case "green":
        case 1:
            document.body.style.setProperty("--colour-1", "#F3FFBD");
            document.body.style.setProperty("--colour-2", "#061E3A");
            document.body.style.setProperty("--colour-disabled", "#C4B538");
            document.body.style.setProperty("--colour-rich", "#14757a");
            document.body.style.setProperty("--colour-shallow", "#70C1B3");
            document.body.style.setProperty("--colour-light", "#B2DBBF");
            document.body.style.setProperty("--colour-natural", "#01FF70");
            document.body.style.setProperty("--colour-peace", "#39CCCC");
            document.body.style.setProperty("--colour-error", "#F012BE");
            document.body.style.setProperty("--colour-danger", "#85144B");
            document.body.style.setProperty("--colour-warn", "#B2F1F4");
            break;
        case "ocean":
        case 2:
            document.body.style.setProperty("--colour-1", "#68D6FE");
            document.body.style.setProperty("--colour-2", "#11172F");
            document.body.style.setProperty("--colour-disabled", "#3669A9");
            document.body.style.setProperty("--colour-rich", "#73FBD3");
            document.body.style.setProperty("--colour-shallow", "#4C9CB9");
            document.body.style.setProperty("--colour-light", "#44E5E7");
            document.body.style.setProperty("--colour-natural", "#44E5E7");
            document.body.style.setProperty("--colour-peace", "#3669A9");
            document.body.style.setProperty("--colour-error", "#3669A9");
            document.body.style.setProperty("--colour-danger", "#11172F");
            document.body.style.setProperty("--colour-warn", "#11172F");
            break;
        case "modern":
        case 3:
            document.body.style.setProperty("--colour-1", "#FFFF82");
            document.body.style.setProperty("--colour-2", "#0F0326");
            document.body.style.setProperty("--colour-disabled", "#E65F5C");
            document.body.style.setProperty("--colour-rich", "#E65F5C");
            document.body.style.setProperty("--colour-shallow", "#B5D99C");
            document.body.style.setProperty("--colour-light", "#F5F7DC");
            document.body.style.setProperty("--colour-natural", "#B5D99C");
            document.body.style.setProperty("--colour-peace", "#FFFF82");
            document.body.style.setProperty("--colour-error", "#FFFF82");
            document.body.style.setProperty("--colour-danger", "#0F0326");
            document.body.style.setProperty("--colour-warn", "#FFFF82");
            break;
        case "modern":
        case 4:
            document.body.style.setProperty("--colour-1", "#EEEDEF");
            document.body.style.setProperty("--colour-2", "#E25B12");
            document.body.style.setProperty("--colour-disabled", "#FFA3A3");
            document.body.style.setProperty("--colour-rich", "#004489");
            document.body.style.setProperty("--colour-shallow", "#96EF47");
            document.body.style.setProperty("--colour-light", "#FFA3A3");
            document.body.style.setProperty("--colour-natural", "#96EF47");
            document.body.style.setProperty("--colour-peace", "#96EF47");
            document.body.style.setProperty("--colour-error", "#E25B12");
            document.body.style.setProperty("--colour-danger", "#004489");
            document.body.style.setProperty("--colour-warn", "#FFA3A3");
            break;
    }
};

// create class TimeValue
class TimeValue {
    constructor(label, formattedTime, timeSet, hidden = false) {
        this.label = label;
        this.time = formattedTime;
        this.timeSet = timeSet;
        this.hidden = false;
    }
}

// // change welcome message after 2000ms
// let timeUnlocked = false;
// window.setTimeout(() => {
//     timeUnlocked = true;
// }, 2000);

// remove welcome message
let timeUnlocked = true;

// scrolling wrapper
let wrapperScroller = zenscroll.createScroller(wrapper, 250, 0);
let wrapperIndex = Infinity; // begin at top
let scrollingWrapper;

let scrollWrapper = (up) => { // scrolling up or down
    window.clearTimeout(scrollingWrapper);

    let oldWrapperIndex = wrapperIndex; // prevent duplicates

    // create array of visible timers
    let arrayOfVisibleTimers = [];
    for (let i = 0; i < timers.length; i++) {
        if (!timers[i].hidden) arrayOfVisibleTimers.push(i);
    }

    if (wrapperIndex <= 0 && !up) {
        wrapperIndex = -1;
    } else if (wrapperIndex == -1 && up) {
        wrapperIndex = 0;
    } else {
        // bound wrapperIndex to make smoother after user closes many timers
        if (wrapperIndex >= arrayOfVisibleTimers.length - 1) wrapperIndex = arrayOfVisibleTimers.length - 1;
        if (wrapperIndex <= 0) wrapperIndex = 0;

        if (up) {
            wrapperIndex++;
            if (wrapperIndex >= arrayOfVisibleTimers.length - 1) wrapperIndex = arrayOfVisibleTimers.length - 1;
        } else {
            wrapperIndex--;
            if (wrapperIndex <= -1) wrapperIndex = -1;
        }
    }

    // prevent duplicates
    if (wrapperIndex == oldWrapperIndex) {
        return false;
    }

    scrollingWrapper = window.setTimeout(() => {
        if (!(wrapperIndex < 0)) {
            wrapperScroller.center(timers[arrayOfVisibleTimers[wrapperIndex]].timerDiv);
        } else {
            wrapperScroller.center(themeToggler);
        }
    }, 100);

    console.log(wrapperIndex);
};

// add event listeners for scrolling
let scrollEvent = () => {
    if (event.keyCode == 37 || event.keyCode == 38) { scrollWrapper(true); return false; } else if (event.keyCode == 39 || event.keyCode == 40) { scrollWrapper(false); return false; };
};


document.body.addEventListener("keydown", scrollEvent);

// disable default scrolling and tabbing
window.addEventListener("keydown", function(e) {
    // space and arrow keys
    if ([32, 37, 38, 39, 40, 9].indexOf(e.keyCode) > -1) {
        e.preventDefault();
    }
}, false);

// programme button for creating new timer
let createNewButton = document.getElementById("create-new-button");
createNewButton.onclick = () => {
    wrapperScroller.toY(0);
    wrapperIndex = Infinity;
    main.timerCreatorWindow();
};


// if timers empty, animate create button
window.setTimeout(() => {
    if (addedTimers == false) {
        wrapper.style.justifyContent = "center";
        createNewButton.style.transitionTimingFunction = "ease-in-out";

        createNewButton.setAttribute("class", "create-new-button overlay");
        themeToggler.setAttribute("class", "change-theme overlay small");
        onTopToggler.setAttribute("class", "toggle-on-top overlay small");

        window.setTimeout(() => {
            createNewButton.style.transitionTimingFunction = "ease-out";
        }, 100);
    }
}, 100);

let createNewTimer = (label, formattedTime, timeSet) => {
    database.timers.push(new TimeValue(label, formattedTime, timeSet));

    timers.push(new Timer(label, formattedTime, timeSet, false, true));
    // make wrapper justify to flex-end
    wrapper.style.justifyContent = "flex-start";

    // make buttom small as well, after a delay
    window.setTimeout(() => {
        createNewButton.style.transitionTimingFunction = "ease-in-out";

        createNewButton.setAttribute("class", "create-new-button overlay small");
        themeToggler.setAttribute("class", "change-theme overlay small show-when-mouse-moved");
        onTopToggler.setAttribute("class", "toggle-on-top overlay small show-when-mouse-moved");

        window.setTimeout(() => {
            createNewButton.style.transitionTimingFunction = "ease-out";
        }, 100);
    }, 250);
};

// what to do once user has created a new timer using the modal window
ipcRenderer.on("create-new", (event, label, formattedTime, timeSet) => {
    console.log("label", label, "formattedTime", formattedTime, "time at which was set", timeSet); // prints time value
    // create new timer
    createNewTimer(label, formattedTime, timeSet);

    // save new timer to disk
    fs.writeFile(databaseLocation, JSON.stringify(database), "utf8", () => {
        console.log("Added new timer and saved to disk.");
    });
});

// update all timers every 100ms
let updater = window.setInterval(() => {
    let formattedCurrentTime = moment().add(500, "milliseconds").format("dddd[, the] Do [of] MMMM YYYY, HH:mm:ss"); // get formatted current time
    // only display current time once unlocked
    if (timeUnlocked) {
        currentTimeDisplayDiv.innerHTML = formattedCurrentTime; // set contents of time indicator to formattedCurrentTime
    }

    for (let i = 0; i < timers.length; i++) {
        timers[i].update();
    }
}, 100);

// hide hidden timers

let hideHiddenTimers = () => {

    // check if all timers are hidden
    let allTimersHidden = true;
    for (let i = 0; i < timers.length; i++) {
        if (!timers[i].hidden) { // if not hidden, set all timers hidden to false
            allTimersHidden = false;
        }
    }

    // if all timers are hidden,
    if (allTimersHidden) {
        console.log("alltimershiden");
        // expand the create new timer button
        wrapper.style.justifyContent = "center";
        createNewButton.style.transitionTimingFunction = "ease-in-out";

        createNewButton.setAttribute("class", "create-new-button overlay");
        themeToggler.setAttribute("class", "change-theme overlay small");
        onTopToggler.setAttribute("class", "toggle-on-top overlay small");

        window.setTimeout(() => {
            createNewButton.style.transitionTimingFunction = "ease-out";
        }, 100);

        // reset the database timers
        database.timers = [];
        timers = [];
        fs.writeFile(databaseLocation, "", "utf8", () => {
            fs.writeFile(databaseLocation, JSON.stringify(database), "utf8", () => {
                // load database once written
                database = require(databaseLocation);
            });
        });
    } else {
        for (let i = 0; i < timers.length; i++) {
            console.log(i);
            if (timers[i].hidden) { // mark matching timer in database as hidden
                database.timers[i].hidden = true;
            }
        }
        // now write changes to disk
        fs.writeFile(databaseLocation, JSON.stringify(database), "utf8", () => {
            console.log("Hidden timers and saved to disk.");
        });
    }
};

let themeToggler = document.getElementById("change-theme");
let saveToDiskTimeout;

themeToggler.onmousedown = () => {
    window.clearTimeout(saveToDiskTimeout);
    database.settings.theme = (database.settings.theme + 1) % 5;
    loadTheme(database.settings.theme);

    saveToDiskTimeout = window.setTimeout(() => {
        fs.writeFile(databaseLocation, "", "utf8", () => {
            fs.writeFile(databaseLocation, JSON.stringify(database), "utf8", () => {
                // load database once written
                database = require(databaseLocation);
            });
        });
        console.log("saved changes to disk");
    }, 250);
};

// hide theme toggler and close buttons after 1 second of not moving the mouse, then show it once mouse is moved again
let hidePeripheralButtons;
// do not hide whilst user hovers over the buttons
let canBeHidden = true;
let showWhenMouseMoved = document.getElementsByClassName("show-when-mouse-moved"); // get class of elements to show when mouse moved

for (let i = 0; i < showWhenMouseMoved.length; i++) {
    showWhenMouseMoved[i].onmouseenter = () => { canBeHidden = false; }; // do not hide when mouse is hovering on the items
    showWhenMouseMoved[i].onmouseleave = () => { canBeHidden = true; }; // let hiding once mouse left
}


document.body.onmousemove = () => {
    // cancel timer and show themeToggler
    window.clearTimeout(hidePeripheralButtons);

    for (let i = 0; i < showWhenMouseMoved.length; i++) {
        showWhenMouseMoved[i].style.opacity = "1";
    }

    // set timer of 1s to hide theme toggler
    hidePeripheralButtons = window.setTimeout(() => {
        if (canBeHidden) {
            for (let i = 0; i < showWhenMouseMoved.length; i++) {
                showWhenMouseMoved[i].style.opacity = "0";
            }
        }
    }, 1000);
};

let setWrapperDrag = () => {
    if (event.keyCode == 17) {
        let dragger = document.getElementById("dragger");
        dragger.style.display = "flex";
        window.setTimeout(() => {
            dragger.style.opacity = "1";
        }, 10);

        wrapper.style.webkitAppRegion = "drag";
    }

    window.clearTimeout(hideInfo);

    document.getElementById("info").style.opacity = "0";
    window.setTimeout(() => {
        document.getElementById("info").style.display = "none";
    }, 100);
};

let setWrapperNoDrag = () => {
    if (event.keyCode == 17) {
        let dragger = document.getElementById("dragger");
        dragger.style.opacity = "0";
        window.setTimeout(() => {
            dragger.style.display = "none";
        }, 100);

        wrapper.style.webkitAppRegion = "no-drag";
    }
};

// toggle on top button
let onTop = false;
let onTopToggler = document.getElementById("toggle-on-top");
let hideInfo; // hide info timeout
let toggleOnTop = () => {
    onTop = (onTop) ? false : true; // toggles on top boolean
    main.setOnTop(onTop); // well set on top depending on the state of the boolean

    onTopToggler.setAttribute("on-top", onTop); // sets attribute in HTML for css to style

    // expand wrapper if ontop
    if (onTop) {
        wrapper.style.top = "0";
        window.setTimeout(() => {
            document.getElementsByClassName("ribbon")[0].style.height = "0";
        }, 100);

        main.setMinimumSize(625, 212);
        main.setMaximumSize(625, 212);
        main.setSize(625, 212);

        // main.setResizable(false);
        // main.setMaximizable(false);

        document.body.addEventListener("keydown", setWrapperDrag);
        document.body.addEventListener("keyup", setWrapperNoDrag);

        document.getElementById("info").style.display = "block";
        document.getElementById("info").style.opacity = "1";
        hideInfo = window.setTimeout(() => {
            document.getElementById("info").style.opacity = "0";
            window.setTimeout(() => {
                document.getElementById("info").style.display = "none";
            }, 100);
        }, 5000);
    } else {
        window.clearTimeout(hideInfo);

        document.getElementById("info").style.opacity = "0";
        window.setTimeout(() => {
            document.getElementById("info").style.display = "none";
        }, 100);

        document.getElementsByClassName("ribbon")[0].style.height = "32px";
        wrapper.style.top = "68px";

        main.setMinimumSize(625, 280);
        main.setMaximumSize(1000000, 1000000);
        main.setSize(625, 280);

        // main.setResizable(true);
        // main.setMaximizable(true);

        document.body.removeEventListener("keydown", setWrapperDrag);
        document.body.removeEventListener("keyup", setWrapperNoDrag);
        wrapper.removeEventListener("mouseout", setWrapperNoDrag);
    }
};

onTopToggler.onclick = () => {
    // when clicked, toggle on top
    toggleOnTop();
    database.settings.onTop = onTop; // save to database

    // clear timeout, then save to disk after delay
    window.clearTimeout(saveToDiskTimeout);
    saveToDiskTimeout = window.setTimeout(() => {
        fs.writeFile(databaseLocation, "", "utf8", () => {
            fs.writeFile(databaseLocation, JSON.stringify(database), "utf8", () => {
                // load database once written
                database = require(databaseLocation);
            });
        });
        console.log("saved changes to disk");
    }, 250);
};
