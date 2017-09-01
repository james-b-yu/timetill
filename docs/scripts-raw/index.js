window.setTimeout(() => {
    zenscroll.setup(999, 0);
}, 500);

let navLinks = document.querySelectorAll(".nav-link");
let screens = document.querySelectorAll(".screen");
let navBar = document.querySelector(".nav-bar");

let navBarHovered = false;
navBar.onmouseover = () => {
    navBarHovered = true;
};
navBar.onmouseout = () => {
    navBarHovered = false;
};

// code for the navbar

// hide navbar after 2secs of inactivity
let hideNavBarTimeout = window.setTimeout(() => {
    navBar.style.opacity = "0";
}, 2000);

let showNavBar = () => {
    window.clearTimeout(hideNavBarTimeout);
    navBar.style.opacity = "1";

    if (!navBarHovered) hideNavBarTimeout = window.setTimeout(() => {
        navBar.style.opacity = "0";
    }, 300);
};

// let showNavBarTranslucent = () => {
//     document.removeEventListener("mousemove", showNavBar);
//     window.clearTimeout(hideNavBarTimeout);
//     navBar.style.opacity = "0.5";
//     hideNavBarTimeout = window.setTimeout(() => {
//         navBar.style.opacity = "0";
//         document.addEventListener("mousemove", showNavBar);
//     }, 250);
// };

document.addEventListener("mousemove", showNavBar);

// highlight nav-link based on scroll position in website

let currentAnchor = 0; // current anchor index in navLinks array

let scrollUpdate = (e) => {
    showNavBar(); // show when scrolling

    for (let i = 0; i < screens.length; i++) {
        // if the distance between the top of the screen and the the top of the div is less than half the height of the screen, the div is focused, so show it in the navbar. otherwise, make sure it is not shown.
        if ((Math.abs(screens[i].getBoundingClientRect().top) < (window.innerHeight / 2)) && i != 0) { // do not highlight top button
            navLinks[i].classList.add("focus");
            currentAnchor = i;
        } else {
            navLinks[i].classList.remove("focus");
        }

        // if none of the navlinks are in focus, currentAnchor is 0
        if ((Math.abs(screens[i].getBoundingClientRect().top) < (window.innerHeight / 2)) && i == 0) currentAnchor = 0;
    }
};

document.addEventListener("scroll", scrollUpdate);


// DOWNLOAD BUTTON
let downloadButton = document.querySelector(".download");

// UPDATOR
let update = () => {
    downloadButton.setAttribute("href", `https://github.com/fiercedeityproductions/timetill/raw/master/dist/time-till-${pickers[0].value}${pickers[0].value != "src" ? "-" : ""}${pickers[1].value}.zip`);

    // show/hide armv7l accordingly
    pickers[1].querySelector(".arm").style.display = (pickers[0].value != "linux") ? "none" : "block";

    if (pickers[0].value == "win32" && pickers[1].value == "armv7l") pickers[1].querySelectorAll("button:not(.expand)")[1].onmouseup();

    // show/hide other archs accordingly
    let otherArchs = pickers[1].querySelectorAll("button:not(.expand):not(.no-data):not(.arm)");
    for (let i of otherArchs) i.style.display = (pickers[0].value == "src") ? "none" : "block";

    if (pickers[0].value == "src") pickers[1].querySelector(".no-data").onmouseup();
    else if (pickers[1].value == "") pickers[1].querySelectorAll("button:not(.expand)")[0].onmouseup();
};

// PICKERS
// define picker elements
let expandButtons = document.querySelectorAll(".expand");
let pickers = document.querySelectorAll(".picker");
let pickerButtons = document.querySelectorAll(".picker button:not(.expand)");

for (let i = 0; i < pickers.length; i++) {
    // picker update method
    pickers[i].update = () => {
        pickers[i].value = pickers[i].querySelector("button:not(.expand)[current-item]").getAttribute("data-value");
        // run custom onupdate attribute function of element
        try {
            eval(`(${pickers[i].getAttribute("onupdate")})()`);
        } catch (e) {
            console.log(e);
        }
    };
    // allow pickers to be focused
    pickers[i].setAttribute("tabindex", `${i}`);

    // expand picker when expend button focused
    expandButtons[i].onclick = () => {
        // pickers[i].focus();
        if (pickers[i].hasAttribute("expanded")) pickers[i].removeAttribute("expanded");
        else pickers[i].setAttribute("expanded", "");
    };
    // hide picker when picker blured
    document.addEventListener("click", () => {
        if (event.target != pickers[i] && event.target.parentNode != pickers[i]) {
            pickers[i].removeAttribute("expanded");
        }
    });
    // set default current item to first item in list
    pickers[i].setAttribute("data-current-item", pickers[i].querySelector("button:not(.expand)").innerHTML);
    // highlight the default item's button
    pickers[i].querySelector("button:not(.expand)").setAttribute("current-item", "");
    // set value accordingly
    pickers[i].update();
}

for (let i = 0; i < pickerButtons.length; i++) {
    // when picker selection buttons mouse up
    pickerButtons[i].onmouseup = () => {
        // hide parent picker
        pickerButtons[i].parentNode.removeAttribute("expanded");
        // set current-item attr
        pickerButtons[i].parentNode.setAttribute("data-current-item", pickerButtons[i].innerHTML);
        // set current button item to be itself
        for (let i of pickerButtons[i].parentNode.children) i.removeAttribute("current-item");
        pickerButtons[i].setAttribute("current-item", "");
        // set value of parent picker to be item's value
        pickerButtons[i].parentNode.update();
    };
}

// zenscroll centers
for (let i = 0; i < navLinks.length; i++) {
    console.log(navLinks[i].getAttribute("href"));
    navLinks[i].onmousedown = () => {
        currentAnchor = i;
        zenscroll.center(document.querySelector(navLinks[i].getAttribute("scroll-to")), Math.abs(document.querySelector(navLinks[i].getAttribute("scroll-to")).getBoundingClientRect().top / (window.innerHeight / 2000)));
    };

    navLinks[i].onmouseup = () => {
        zenscroll.center(document.querySelector(navLinks[i].getAttribute("scroll-to")), Math.abs(document.querySelector(navLinks[i].getAttribute("scroll-to")).getBoundingClientRect().top / (window.innerHeight / 250)));
    };
}

// scolling up and down with arrow keys

let scroll = (down = true) => {
    // default to scrolling down
    try {
        let i = down ? currentAnchor + 1 < navLinks.length ? ++currentAnchor : currentAnchor : currentAnchor - 1 >= 0 ? --currentAnchor : 0;
        zenscroll.center(document.querySelector(navLinks[i].getAttribute("scroll-to")), Math.abs(document.querySelector(navLinks[i].getAttribute("scroll-to")).getBoundingClientRect().top / (window.innerHeight / 250)));
    } catch (e) {}
};

document.addEventListener("keydown", (e) => {
    switch (e.keyCode) {
        case 37:
        case 38:
            scroll(false);
            break;
        case 39:
        case 40:
            scroll(true);
            break;
    }
});