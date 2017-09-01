
let ISOFormat; // keep iso format global
const moment = require("moment"); // include the moment.js library for time calculations

const databaseLocation = `${process.env.APPDATA}/Time Till/database.json`;
const database = require(databaseLocation);

const { remote, ipcRenderer } = require("electron"); // remote
const main = remote.require("./main.js"); // main export functions

// define variables
let dateInputs = document.getElementsByClassName("date-input");
let dayInput = document.getElementById("date-input-day");
let monthInput = document.getElementById("date-input-month");
let yearInput = document.getElementById("date-input-year");
let hourInput = document.getElementById("time-input-hour");
let minuteInput = document.getElementById("time-input-minute");
let secondInput = document.getElementById("time-input-second");

let labelInput = document.getElementById("label-input");
let labelWidthTest = document.getElementById("timer-label-width-test");

let validationMessage = document.getElementById("validation-message");
let createNewButton = document.getElementById("create-new-button");

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
    }
};

loadTheme(database.settings.theme);
let validateDate = () => {
    ISOFormat = `${yearInput.value}-${monthInput.value}-${dayInput.value} ${hourInput.value}:${minuteInput.value}:${secondInput.value}`;
    let test = /^[0-9]{4}-[0-9]{2}-[0-9]{2} [0-9]{2}:[0-9]{2}:[0-9]{2}$/;
    // console.log(ISOFormat);
    let dateValid = false; // default valid = false;

    // check if label is existant
    if (labelInput.value != "") {
        // check if input format is correct
        if (dayInput.value != "" && monthInput.value != "" && yearInput.value != "" && hourInput.value != "" && minuteInput.value != "" && secondInput.value != "") {
            // if all values are inputted, check if date is valid
            if (test.test(ISOFormat)) {
                if (moment(ISOFormat).isValid()) {
                    // date is valid
                    dateValid = true;
                    // check if date is in the future and display warning if not
                    if (moment().diff(moment(ISOFormat)) < 0) {
                        validationMessage.innerHTML = "VALID DATE";
                        validationMessage.setAttribute("class", "valid");
                    } else {
                        // date is in the past
                        validationMessage.innerHTML = "DATE IS IN THE PAST";
                        validationMessage.setAttribute("class", "warning");
                    }
                } else {
                    validationMessage.innerHTML = "INVALID DATE";
                    validationMessage.setAttribute("class", "invalid");
                }
            } else {
                validationMessage.innerHTML = "INVALID FORMAT";
                validationMessage.setAttribute("class", "invalid");
            }
        } else {
            validationMessage.innerHTML = "NOT ALL VALUES ENTERED";
            validationMessage.setAttribute("class", "plain");
        }
    } else {
        validationMessage.innerHTML = "LABEL EMPTY";
        validationMessage.setAttribute("class", "invalid");
    }

    if (dateValid) {
        // console.log("date valid");
    } else {
        // console.log("date invalid");
    }

    // disable or enable the create new button accordingly
    createNewButton.disabled = 1 - dateValid;

    return dateValid;
};


for (let i = 0; i < dateInputs.length; i++) {
    // expand/contrat size of date inputs depending on their contents

    let _this = dateInputs[i];

    _this.onkeyup = () => {
        // change the width of the input as they release a key
        _this.style.width = `${(_this.value.length / 2 > 0.5) ? _this.value.length / 2 : 0.5}em`;

        // validate input time when user changes variables
        validateDate();

    };

}


// set default values to be 1 min from now
dayInput.value = moment().clone().add(1, "days").format("DD");
monthInput.value = moment().clone().add(1, "days").format("MM");
yearInput.value = moment().clone().add(1, "days").format("YYYY");

hourInput.value = "00";
minuteInput.value = "00";
secondInput.value = "00";


validateDate; // validation at page load to style the message box

let validateDateIntervals = window.setInterval(validateDate, 10); // validate date every 10 milliseconds

createNewButton.onclick = () => {
    ipcRenderer.send("create-new-timer", labelInput.value, moment(ISOFormat).format("DD.MM.YYYY.HH.mm.ss"), moment().format("DD.MM.YYYY.HH.mm.ss")); // gives time in format like 02.03.2012.12.12.07
};

// change value of timer-label-width-test when user types in the label input
labelInput.onkeyup = () => {
    // change value
    labelWidthTest.innerHTML = labelInput.value;
    // set width to width of labelWidthTest
    labelInput.style.width = `${labelWidthTest.clientWidth + 50}px`;

    // validate date;
    validateDate();
};

labelInput.changed = false;
yearInput.changed = false;
monthInput.changed = false;
dayInput.changed = false;
hourInput.changed = false;
minuteInput.changed = false;
secondInput.changed = false;

labelInput.onkeydown = () => { // focus next input if typed enter
    labelInput.changed = true;
    if (event.keyCode == 13 || event.keyCode == 9) {
        dayInput.focus();
        if (!dayInput.changed) dayInput.value = "";
        return false;
    }
};

dayInput.onfocus = () => {
    if (!dayInput.changed) dayInput.value = "";
};

monthInput.onfocus = () => {
    if (!monthInput.changed) monthInput.value = "";
};

yearInput.onfocus = () => {
    if (!yearInput.changed) yearInput.value = "";
};

hourInput.onfocus = () => {
    if (!hourInput.changed) hourInput.value = "";
};

minuteInput.onfocus = () => {
    if (!minuteInput.changed) minuteInput.value = "";
};

secondInput.onfocus = () => {
    if (!secondInput.changed) secondInput.value = "";
};


dayInput.onkeydown = () => { // focus next input if typed enter
    dayInput.changed = true;
    if (event.keyCode == 13 || event.keyCode == 9) {
        monthInput.focus();
        if (!monthInput.changed) monthInput.value = "";
        return false;
    } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) { // user typed number 1-9
        if (dayInput.value.length == 2) { // do not let typing if there are already 2 values
            return false;
        }
    }
};

monthInput.onkeydown = () => { // focus next input if typed enter
    monthInput.changed = true;
    if (event.keyCode == 13 || event.keyCode == 9) {
        yearInput.focus();
        if (!yearInput.changed) yearInput.value = "";
        return false;
    } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) { // user typed number 1-9
        if (monthInput.value.length == 2) { // do not let typing if there are already 2 values
            return false;
        }
    }
};

yearInput.onkeydown = () => { // focus next input if typed enter
    yearInput.changed = true;
    if (event.keyCode == 13 || event.keyCode == 9) {
        hourInput.focus();
        if (!hourInput.changed) hourInput.value = "";
        return false;
    } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) { // user typed number 1-9
        if (yearInput.value.length == 4) { // do not let typing if there are already 2 values
            return false;
        }
    }
};

hourInput.onkeydown = () => { // focus next input if typed enter
    hourInput.changed = true;
    if (event.keyCode == 13 || event.keyCode == 9) {
        minuteInput.focus();
        if (!minuteInput.changed) minuteInput.value = "";
        return false;
    } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) { // user typed number 1-9
        if (hourInput.value.length == 2) { // do not let typing if there are already 2 values
            return false;
        }
    }
};

minuteInput.onkeydown = () => { // focus next input if typed enter
    minuteInput.changed = true;
    if (event.keyCode == 13 || event.keyCode == 9) {
        secondInput.focus();
        if (!secondInput.changed) secondInput.value = "";
        return false;
    } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) { // user typed number 1-9
        if (minuteInput.value.length == 2) { // do not let typing if there are already 2 values
            return false;
        }
    }
};

secondInput.onkeydown = () => { // simulate click of create button if typed enter and date is valid
    secondInput.changed = true;
    if (event.keyCode == 13 || event.keyCode == 9) {
        if (!createNewButton.disabled) {
            createNewButton.click();
            return false;
        } else {
            labelInput.focus();
            return false;
        }
    } else if ((event.keyCode >= 48 && event.keyCode <= 57) || (event.keyCode >= 96 && event.keyCode <= 105)) { // user typed number 1-9
        if (secondInput.value.length == 2) { // do not let typing if there are already 2 values
            return false;
        }
    }
};

labelInput.onkeyup(); // change width of label input on page load;
labelInput.focus(); // focus label input on page load
labelInput.select(); // select label ... .. ... ...

// add trailing 0s if user missed them out
dayInput.onblur = () => {
    if (dayInput.value == 0 || dayInput.value == "") dayInput.value = moment().add(1, "days").format("DD"); // change value to current day
    while (dayInput.value.length < 2) dayInput.value = "0" + dayInput.value;
};

monthInput.onblur = () => {
    if (monthInput.value == 0 || monthInput.value == "") monthInput.value = moment().add(1, "days").format("MM"); // change value to current month
    while (monthInput.value.length < 2) monthInput.value = "0" + monthInput.value;
};

yearInput.onblur = () => {
    if (yearInput.value == 0 || yearInput.value == "") yearInput.value = moment().add(1, "days").format("YYYY"); // change value to current year if empty
    while (yearInput.value.length < 4) yearInput.value = "0" + yearInput.value;
};

hourInput.onblur = () => {
    if (hourInput.value == "") hourInput.value = "0"; // change value to 1 if empty
    while (hourInput.value.length < 2) hourInput.value = "0" + hourInput.value;
};

minuteInput.onblur = () => {
    if (minuteInput.value == "") minuteInput.value = "0"; // change value to 1 if empty
    while (minuteInput.value.length < 2) minuteInput.value = "0" + minuteInput.value;
};

secondInput.onblur = () => {
    if (secondInput.value == "") secondInput.value = "0"; // change value to 1 if empty
    while (secondInput.value.length < 2) secondInput.value = "0" + secondInput.value;
};
