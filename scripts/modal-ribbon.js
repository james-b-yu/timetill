 // const remote = require("electron").remote; // remote
 // const main = remote.require("./main.js"); // main export functions
 
 // FOR THE RIBBON
let exitButton = document.getElementById("exit-button");

// programme button events in the ribbon

exitButton.onclick = () => {
    main.exitModal();
};
