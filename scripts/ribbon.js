 // const remote = require("electron").remote; // remote
 // const main = remote.require("./main.js"); // main export functions
const currentWindow = remote.getCurrentWindow(); // current window

 // FOR THE RIBBON
let reloadButton = document.getElementById("reload-button");
let maximiseButton = document.getElementById("maximise-button");
let minimiseButton = document.getElementById("minimise-button");
let exitButton = document.getElementById("exit-button");
let inFullScreen = false;

 // programme button events in the ribbon
minimiseButton.onclick = () => {
    main.minimise();
};

maximiseButton.onclick = () => {
    main.maximise();
};

exitButton.onclick = () => {
    main.exit();
};

reloadButton.onclick = () => {
     // main.reload();
    document.body.style.filter = "blur(10px)"; // blur body out
    document.body.style.opacity = "0";

    window.setTimeout(() => {
        inFullScreen = (inFullScreen) ? false : true; // toggle inFullScreen
        main.setFullScreen(inFullScreen);

        if (inFullScreen) { // hide extra buttons
            maximiseButton.style.display = "none";
            minimiseButton.style.display = "none";
            onTopToggler.style.display = "none";
        } else { // show extra buttons
            maximiseButton.style.display = "flex";
            minimiseButton.style.display = "flex";
            onTopToggler.style.display = "flex";

        }

        window.setTimeout(() => {
            document.body.style.filter = "blur(0)";
            document.body.style.opacity = "1";
        }, 200);
    }, 200);


};
