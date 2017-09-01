 // class for timer

 

 // define function to create an element with a class
 let createElement = (tagName, className) => {
     let element = document.createElement(tagName); // create element
     element.setAttribute("class", `${className}`); // set class

     return element;
 };

 class Timer {
     constructor(label, time, timeSet, hidden, animate) { // label = name, time = time to, time set = time at which timer was set
         // set essential info
         this.label = label;
         this.time = time;
         this.timeSet = timeSet;

         // set statuses
         this.yearsExpanded = false;
         this.monthsExpanded = false;
         this.daysExpanded = false;
         this.hoursExpanded = false;
         this.minutesExpanded = false;
         this.secondsExpanded = false;

         this.transitioning = false;
         this.hidden = hidden;


         // create elements
         this.timerDiv = createElement("DIV", "timer overlay");
         this.timerDiv.setAttribute("data-label", this.label); // show label of the timer

         // show close button when mouse enters the timer div, hide when leaves
         this.timerDiv.onmouseenter = () => {
             this.closeButton.style.opacity = "1";
         };

         this.timerDiv.onmouseleave = () => {
             this.closeButton.style.opacity = "0";
         };

         this.container = createElement("DIV", "container");
         this.timerDiv.appendChild(this.container);
         this.topRow = createElement("DIV", "value-row");
         this.container.appendChild(this.topRow);
         this.bottomRow = createElement("DIV", "value-row");
         this.container.appendChild(this.bottomRow);

         this.yearContainer = createElement("DIV", "value-container");
         this.year = createElement("DIV", "value");
         this.yearText = createElement("BUTTON", "value-text");
         this.yearText.innerHTML = "YEARS";
         this.topRow.appendChild(this.yearContainer);
         this.yearContainer.appendChild(this.year);
         this.yearContainer.appendChild(this.yearText);
         this.monthContainer = createElement("DIV", "value-container");
         this.month = createElement("DIV", "value");
         this.monthText = createElement("BUTTON", "value-text");
         this.monthText.innerHTML = "MONTHS";
         this.topRow.appendChild(this.monthContainer);
         this.monthContainer.appendChild(this.month);
         this.monthContainer.appendChild(this.monthText);
         this.dayContainer = createElement("DIV", "value-container");
         this.day = createElement("DIV", "value");
         this.dayText = createElement("BUTTON", "value-text");
         this.dayText.innerHTML = "DAYS";
         this.topRow.appendChild(this.dayContainer);
         this.dayContainer.appendChild(this.day);
         this.dayContainer.appendChild(this.dayText);

         this.hourContainer = createElement("DIV", "value-container");
         this.hour = createElement("DIV", "value");
         this.hourText = createElement("BUTTON", "value-text");
         this.hourText.innerHTML = "HOURS";
         this.bottomRow.appendChild(this.hourContainer);
         this.hourContainer.appendChild(this.hour);
         this.hourContainer.appendChild(this.hourText);
         this.minuteContainer = createElement("DIV", "value-container");
         this.minute = createElement("DIV", "value");
         this.minuteText = createElement("BUTTON", "value-text");
         this.minuteText.innerHTML = "MINUTES";
         this.bottomRow.appendChild(this.minuteContainer);
         this.minuteContainer.appendChild(this.minute);
         this.minuteContainer.appendChild(this.minuteText);
         this.secondContainer = createElement("DIV", "value-container");
         this.second = createElement("DIV", "value");
         this.secondText = createElement("BUTTON", "value-text");
         this.secondText.innerHTML = "SECONDS";
         this.bottomRow.appendChild(this.secondContainer);
         this.secondContainer.appendChild(this.second);
         this.secondContainer.appendChild(this.secondText);

         this.timeTillDisplay = createElement("DIV", "time-till-display");
         this.timeTillDisplay.setAttribute("data-seton", `${Timer.extractDate(this.timeSet)[0][0]}.${Timer.extractDate(this.timeSet)[0][1]}.${Timer.extractDate(this.timeSet)[0][2]} at ${Timer.extractDate(this.timeSet)[1][0]}:${Timer.extractDate(this.timeSet)[1][1]}:${Timer.extractDate(this.timeSet)[1][2]}`);
         this.timerDiv.appendChild(this.timeTillDisplay);
         this.dateTimeTill = createElement("SPAN", "date-time-till");
         this.timeTimeTill = createElement("SPAN", "time-time-till");
         this.dayOfWeekTimeTill = createElement("SPAN", "day-of-week-time-till");
         this.dateTimeTill.innerHTML = `${Timer.extractDate(this.time)[0][0]}.${Timer.extractDate(this.time)[0][1]}.${Timer.extractDate(this.time)[0][2]}`;
         this.timeTimeTill.innerHTML = `${Timer.extractDate(this.time)[1][0]}:${Timer.extractDate(this.time)[1][1]}:${Timer.extractDate(this.time)[1][2]}`;
         this.timeTillDisplay.appendChild(this.dateTimeTill);
         this.timeTillDisplay.appendChild(this.timeTimeTill);
         this.timeTillDisplay.appendChild(this.dayOfWeekTimeTill);

         // add close button
         this.closeButton = createElement("DIV", "close");
         this.closeButtonGraphic = createElement("DIV", "close-button-graphic");
         this.closeButton.style.opacity = "0"; // default hidden, will show when mouse moved
         this.timerDiv.appendChild(this.closeButton);
         this.closeButton.appendChild(this.closeButtonGraphic);
         this.closeButton.onclick = () => {
             this.close();
         };

         // set elements' innerHTML for debug
         this.year.innerHTML = "2017";
         this.month.innerHTML = "05";
         this.day.innerHTML = "31";
         this.hour.innerHTML = "13";
         this.minute.innerHTML = "21";
         this.second.innerHTML = "07";

         document.getElementById("wrapper").insertBefore(this.timerDiv, document.getElementById("wrapper").firstChild); // add to wrapper
         this.update(); // update all displays

         // set buttons
         this.secondText.onclick = () => {
             this.toggleSecondsExpanded();
         };

         this.minuteText.onclick = () => {
             this.toggleMinutesExpanded();
         };

         this.hourText.onclick = () => {
             this.toggleHoursExpanded();
         };

         this.yearText.onclick = () => {
             this.toggleYearsExpanded();
         };

         this.monthText.onclick = () => {
             this.toggleMonthsExpanded();
         };

         this.dayText.onclick = () => {
             this.toggleDaysExpanded();
         };

         // make timer hidden if animating or hidden


         if (!animate && !hidden) this.timerDiv.setAttribute("class", "timer overlay");
         else this.timerDiv.setAttribute("class", "timer overlay hidden");

         // animate the timer in if not hidden
         if (!this.hidden && animate) {
             window.setTimeout(() => {
                 this.timerDiv.setAttribute("class", "timer overlay");
             }, 10);
         }
     }

     close() { // close the timer
         // first hide the timer
         this.timerDiv.style.transitionTimingFunction = "ease-in-out";
         this.timerDiv.setAttribute("class", "timer overlay hidden");
         this.hidden = true;
         // next, call function in index.js
         // as hidden on the disk
         hideHiddenTimers();
     }

     static extractDate(date) { // date in form DD.MM.YYYY.HH.mm.ss
         let split = date.split("."); // split date by "."
         return [
             [split[0], split[1], split[2]],
             [split[3], split[4], split[5]]
         ]; // gets [[DD, MM, YY], [HH, mm, ss]];
     }

     timeTill() {
         // create moment for counted time
         let timeMoment = moment(this.time, "DD.MM.YYYY.HH.mm.ss");
         let diff = moment().diff(timeMoment);
         if (diff > 0) { diff += 500; } else { diff -= 500; }
         let diffDuration = moment.duration(diff); // get diff in milliseconds

         this.diffDuration = diffDuration; // let other parts of class access diffDuration

         // change milliseconds to duration and return
         return [
             [diffDuration.get("years"), diffDuration.get("months"), diffDuration.get("days")],
             [diffDuration.get("hours"), diffDuration.get("minutes"), diffDuration.get("seconds")]
         ];
     }

     absoluteTo(digits = 0) { // years and months and days are rounded to [digits], seconds and minutes and hours are truncated
         // create moment for counted time
         let timeMoment = moment(this.time, "DD.MM.YYYY.HH.mm.ss");
         let diff = moment().diff(timeMoment);
         if (diff > 0) { diff += 500; } else { diff -= 500; }
         let diffDuration = moment.duration(diff); // get diff in milliseconds

         return [
             [Math.abs(diffDuration.asYears().toFixed(digits)), Math.abs(diffDuration.asMonths().toFixed(digits)), Math.abs(diffDuration.asDays().toFixed(digits))],
             [Math.abs(Math.trunc(diffDuration.asHours())), Math.abs(Math.trunc(diffDuration.asMinutes())), Math.abs(Math.trunc(diffDuration.asSeconds()))]
         ];
     }

     update() {
         // change numbers when not transitioning
         if (!this.transitioning) {
             this.year.innerHTML = Math.abs(this.timeTill()[0][0]);
             this.month.innerHTML = Math.abs(this.timeTill()[0][1]);
             this.day.innerHTML = Math.abs(this.timeTill()[0][2]);

             this.hour.innerHTML = Math.abs(this.timeTill()[1][0]);
             this.minute.innerHTML = Math.abs(this.timeTill()[1][1]);
             this.second.innerHTML = Math.abs(this.timeTill()[1][2]);

             // add 0s to text of numbers to add uniformity
             while (this.year.innerHTML.length < 2) { this.year.innerHTML = "0" + this.year.innerHTML; }
             while (this.month.innerHTML.length < 2) { this.month.innerHTML = "0" + this.month.innerHTML; }
             while (this.day.innerHTML.length < 2) { this.day.innerHTML = "0" + this.day.innerHTML; }
             while (this.hour.innerHTML.length < 2) { this.hour.innerHTML = "0" + this.hour.innerHTML; }
             while (this.minute.innerHTML.length < 2) { this.minute.innerHTML = "0" + this.minute.innerHTML; }
             while (this.second.innerHTML.length < 2) { this.second.innerHTML = "0" + this.second.innerHTML; }

             // change text to match plural / singular
             this.yearText.innerHTML = (Math.abs(this.timeTill()[0][0]) == 1) ? "YEAR" : "YEARS";
             this.monthText.innerHTML = (Math.abs(this.timeTill()[0][1]) == 1) ? "MONTH" : "MONTHS";
             this.dayText.innerHTML = (Math.abs(this.timeTill()[0][2]) == 1) ? "DAY" : "DAYS";
             this.hourText.innerHTML = (Math.abs(this.timeTill()[1][0]) == 1) ? "HOUR" : "HOURS";
             this.minuteText.innerHTML = (Math.abs(this.timeTill()[1][1]) == 1) ? "MINUTE" : "MINUTES";
             this.secondText.innerHTML = (Math.abs(this.timeTill()[1][2]) == 1) ? "SECOND" : "SECONDS";

             // deal with expanded views
             if ((this.yearsExpanded || this.monthsExpanded || this.daysExpanded || this.hoursExpanded || this.minutesExpanded || this.secondsExpanded)) {
                 // set value to absolute value
                 this.year.innerHTML = this.absoluteTo()[0][0];
                 this.month.innerHTML = this.absoluteTo()[0][1];
                 this.day.innerHTML = this.absoluteTo()[0][2];

                 this.hour.innerHTML = this.absoluteTo()[1][0];
                 this.minute.innerHTML = this.absoluteTo()[1][1];
                 this.second.innerHTML = this.absoluteTo()[1][2];

                 // change text to match plural/singular
                 this.yearText.innerHTML = (this.absoluteTo()[0][0] == 1) ? "YEAR" : "YEARS";
                 this.monthText.innerHTML = (this.absoluteTo()[0][1] == 1) ? "MONTH" : "MONTHS";
                 this.dayText.innerHTML = (this.absoluteTo()[0][2] == 1) ? "DAY" : "DAYS";
                 this.hourText.innerHTML = (this.absoluteTo()[1][0] == 1) ? "HOUR" : "HOURS";
                 this.minuteText.innerHTML = (this.absoluteTo()[1][1] == 1) ? "MINUTE" : "MINUTES";
                 this.secondText.innerHTML = (this.absoluteTo()[1][2] == 1) ? "SECOND" : "SECONDS";
             }
         }

         if (this.diffDuration > 0) { // if count down timer is in the past
             this.timeTillDisplay.setAttribute("data-ba", "FROM"); // change text to say TIME FROM
         } else { // count down is in the future
             this.timeTillDisplay.setAttribute("data-ba", "UNTIL"); // change text to say TIME TILL
         }

         // find day of the week of countdown date
         let dayOfWeek = moment(this.time, "DD.MM.YYYY.HH.mm.ss").format("dddd");
         this.dayOfWeekTimeTill.innerHTML = dayOfWeek;
     }

     toggleSecondsExpanded() {
         // toggle seconds expanded
         this.transitioning = true;
         this.secondsExpanded = (this.secondsExpanded) ? false : true;
         if (this.secondsExpanded) { // expand seconds
             // hide all displays
             this.yearContainer.style.opacity = "0";
             this.monthContainer.style.opacity = "0";
             this.dayContainer.style.opacity = "0";
             this.hourContainer.style.opacity = "0";
             this.minuteContainer.style.opacity = "0";
             this.secondContainer.style.opacity = "0";

             window.setTimeout(() => {
                 // remove all other displays after delay of 100ms
                 this.topRow.style.display = "none";
                 this.yearContainer.style.display = "none";
                 this.monthContainer.style.display = "none";
                 this.dayContainer.style.display = "none";
                 this.hourContainer.style.display = "none";
                 this.minuteContainer.style.display = "none";
                 // this.secondContainer.style.display = "none";
                 // make second container visible again
                 this.secondContainer.style.opacity = "1";

                 this.transitioning = false;
                 this.update(); // make sure value is changed to absolute value
             }, 100);
         } else {
             // hide second container display
             this.secondContainer.style.opacity = "0";

             // make all displays visible again
             window.setTimeout(() => {
                 this.topRow.style.display = "flex";
                 this.yearContainer.style.display = "flex";
                 this.monthContainer.style.display = "flex";
                 this.dayContainer.style.display = "flex";
                 this.hourContainer.style.display = "flex";
                 this.minuteContainer.style.display = "flex";
                 this.secondContainer.style.display = "flex";

                 this.transitioning = false;
                 this.update(); // change all values back to relative

                 window.setTimeout(() => {
                     this.yearContainer.style.opacity = "1";
                     this.monthContainer.style.opacity = "1";
                     this.dayContainer.style.opacity = "1";
                     this.hourContainer.style.opacity = "1";
                     this.minuteContainer.style.opacity = "1";
                     this.secondContainer.style.opacity = "1";
                 }, 10);
             }, 100);
         }
     }

     toggleMinutesExpanded() {
         // toggle minutes expanded
         this.transitioning = true;
         this.minutesExpanded = (this.minutesExpanded) ? false : true;
         if (this.minutesExpanded) { // expand minutes
             // hide all displays
             this.yearContainer.style.opacity = "0";
             this.monthContainer.style.opacity = "0";
             this.dayContainer.style.opacity = "0";
             this.hourContainer.style.opacity = "0";
             this.minuteContainer.style.opacity = "0";
             this.secondContainer.style.opacity = "0";

             window.setTimeout(() => {
                 // remove all other displays after delay of 100ms
                 this.topRow.style.display = "none";
                 this.yearContainer.style.display = "none";
                 this.monthContainer.style.display = "none";
                 this.dayContainer.style.display = "none";
                 this.hourContainer.style.display = "none";
                 // this.minuteContainer.style.display = "none";
                 this.secondContainer.style.display = "none";
                 // make minute container visible again
                 this.minuteContainer.style.opacity = "1";

                 this.transitioning = false;
                 this.update(); // make sure value is changed to absolute value
             }, 100);
         } else {
             // hide minute container display
             this.minuteContainer.style.opacity = "0";

             // make all displays visible again
             window.setTimeout(() => {
                 this.topRow.style.display = "flex";
                 this.yearContainer.style.display = "flex";
                 this.monthContainer.style.display = "flex";
                 this.dayContainer.style.display = "flex";
                 this.hourContainer.style.display = "flex";
                 this.minuteContainer.style.display = "flex";
                 this.secondContainer.style.display = "flex";

                 this.transitioning = false;
                 this.update(); // change all values back to relative

                 window.setTimeout(() => {
                     this.yearContainer.style.opacity = "1";
                     this.monthContainer.style.opacity = "1";
                     this.dayContainer.style.opacity = "1";
                     this.hourContainer.style.opacity = "1";
                     this.minuteContainer.style.opacity = "1";
                     this.secondContainer.style.opacity = "1";
                 }, 10);
             }, 100);
         }
     }

     toggleHoursExpanded() {
         // toggle hours expanded
         this.transitioning = true;
         this.hoursExpanded = (this.hoursExpanded) ? false : true;
         if (this.hoursExpanded) { // expand minutes
             // hide all displays
             this.yearContainer.style.opacity = "0";
             this.monthContainer.style.opacity = "0";
             this.dayContainer.style.opacity = "0";
             this.hourContainer.style.opacity = "0";
             this.minuteContainer.style.opacity = "0";
             this.secondContainer.style.opacity = "0";

             window.setTimeout(() => {
                 // remove all other displays after delay of 100ms
                 this.topRow.style.display = "none";
                 this.yearContainer.style.display = "none";
                 this.monthContainer.style.display = "none";
                 this.dayContainer.style.display = "none";
                 // this.hourContainer.style.display = "none";
                 this.minuteContainer.style.display = "none";
                 this.secondContainer.style.display = "none";
                 // make hour container visible again
                 this.hourContainer.style.opacity = "1";

                 this.transitioning = false;
                 this.update(); // make sure value is changed to absolute value
             }, 100);
         } else {
             // hide hour container display
             this.hourContainer.style.opacity = "0";

             // make all displays visible again
             window.setTimeout(() => {
                 this.topRow.style.display = "flex";
                 this.yearContainer.style.display = "flex";
                 this.monthContainer.style.display = "flex";
                 this.dayContainer.style.display = "flex";
                 this.hourContainer.style.display = "flex";
                 this.minuteContainer.style.display = "flex";
                 this.secondContainer.style.display = "flex";

                 this.transitioning = false;
                 this.update(); // change all values back to relative

                 window.setTimeout(() => {
                     this.yearContainer.style.opacity = "1";
                     this.monthContainer.style.opacity = "1";
                     this.dayContainer.style.opacity = "1";
                     this.hourContainer.style.opacity = "1";
                     this.minuteContainer.style.opacity = "1";
                     this.secondContainer.style.opacity = "1";
                 }, 10);
             }, 100);
         }
     }

     toggleDaysExpanded() {
         // toggle days expanded
         this.transitioning = true;
         this.daysExpanded = (this.daysExpanded) ? false : true;
         if (this.daysExpanded) { // expand days
             // hide all displays
             this.yearContainer.style.opacity = "0";
             this.monthContainer.style.opacity = "0";
             this.dayContainer.style.opacity = "0";
             this.hourContainer.style.opacity = "0";
             this.minuteContainer.style.opacity = "0";
             this.secondContainer.style.opacity = "0";

             window.setTimeout(() => {
                 // remove all other displays after delay of 100ms
                 this.bottomRow.style.display = "none";
                 this.yearContainer.style.display = "none";
                 this.monthContainer.style.display = "none";
                 // this.dayContainer.style.display = "none";
                 this.hourContainer.style.display = "none";
                 this.minuteContainer.style.display = "none";
                 this.secondContainer.style.display = "none";
                 // make day container visible again
                 this.dayContainer.style.opacity = "1";

                 this.transitioning = false;
                 this.update(); // make sure value is changed to absolute value
             }, 100);
         } else {
             // hide day container display
             this.dayContainer.style.opacity = "0";

             // make all displays visible again
             window.setTimeout(() => {
                 this.bottomRow.style.display = "flex";
                 this.yearContainer.style.display = "flex";
                 this.monthContainer.style.display = "flex";
                 this.dayContainer.style.display = "flex";
                 this.hourContainer.style.display = "flex";
                 this.minuteContainer.style.display = "flex";
                 this.secondContainer.style.display = "flex";

                 this.transitioning = false;
                 this.update(); // change all values back to relative

                 window.setTimeout(() => {
                     this.yearContainer.style.opacity = "1";
                     this.monthContainer.style.opacity = "1";
                     this.dayContainer.style.opacity = "1";
                     this.hourContainer.style.opacity = "1";
                     this.minuteContainer.style.opacity = "1";
                     this.secondContainer.style.opacity = "1";
                 }, 10);
             }, 100);
         }
     }

     toggleMonthsExpanded() {
         // toggle months expanded
         this.transitioning = true;
         this.monthsExpanded = (this.monthsExpanded) ? false : true;
         if (this.monthsExpanded) { // expand months
             // hide all displays
             this.yearContainer.style.opacity = "0";
             this.monthContainer.style.opacity = "0";
             this.dayContainer.style.opacity = "0";
             this.hourContainer.style.opacity = "0";
             this.minuteContainer.style.opacity = "0";
             this.secondContainer.style.opacity = "0";

             window.setTimeout(() => {
                 // remove all other displays after delay of 100ms
                 this.bottomRow.style.display = "none";
                 this.yearContainer.style.display = "none";
                 // this.monthContainer.style.display = "none";
                 this.dayContainer.style.display = "none";
                 this.hourContainer.style.display = "none";
                 this.minuteContainer.style.display = "none";
                 this.secondContainer.style.display = "none";
                 // make month container visible again
                 this.monthContainer.style.opacity = "1";

                 this.transitioning = false;
                 this.update(); // make sure value is changed to absolute value
             }, 100);
         } else {
             // hide month container display
             this.monthContainer.style.opacity = "0";

             // make all displays visible again
             window.setTimeout(() => {
                 this.bottomRow.style.display = "flex";
                 this.yearContainer.style.display = "flex";
                 this.monthContainer.style.display = "flex";
                 this.dayContainer.style.display = "flex";
                 this.hourContainer.style.display = "flex";
                 this.minuteContainer.style.display = "flex";
                 this.secondContainer.style.display = "flex";

                 this.transitioning = false;
                 this.update(); // change all values back to relative

                 window.setTimeout(() => {
                     this.yearContainer.style.opacity = "1";
                     this.monthContainer.style.opacity = "1";
                     this.dayContainer.style.opacity = "1";
                     this.hourContainer.style.opacity = "1";
                     this.minuteContainer.style.opacity = "1";
                     this.secondContainer.style.opacity = "1";
                 }, 10);
             }, 100);
         }
     }

     toggleYearsExpanded() {
         // toggle years expanded
         this.transitioning = true;
         this.yearsExpanded = (this.yearsExpanded) ? false : true;
         if (this.yearsExpanded) { // expand minutes
             // hide all displays
             this.yearContainer.style.opacity = "0";
             this.monthContainer.style.opacity = "0";
             this.dayContainer.style.opacity = "0";
             this.hourContainer.style.opacity = "0";
             this.minuteContainer.style.opacity = "0";
             this.secondContainer.style.opacity = "0";

             window.setTimeout(() => {
                 // remove all other displays after delay of 100ms
                 // this.yearContainer.style.display = "none";
                 this.bottomRow.style.display = "none";
                 this.monthContainer.style.display = "none";
                 this.dayContainer.style.display = "none";
                 this.hourContainer.style.display = "none";
                 this.minuteContainer.style.display = "none";
                 this.secondContainer.style.display = "none";
                 // make second container visible again
                 this.yearContainer.style.opacity = "1";

                 this.transitioning = false;
                 this.update(); // make sure value is changed to absolute value
             }, 100);
         } else {
             // hide minute container display
             this.yearContainer.style.opacity = "0";

             // make all displays visible again
             window.setTimeout(() => {
                 this.bottomRow.style.display = "flex";
                 this.yearContainer.style.display = "flex";
                 this.monthContainer.style.display = "flex";
                 this.dayContainer.style.display = "flex";
                 this.hourContainer.style.display = "flex";
                 this.minuteContainer.style.display = "flex";
                 this.secondContainer.style.display = "flex";

                 this.transitioning = false;
                 this.update(); // change all values back to relative

                 window.setTimeout(() => {
                     this.yearContainer.style.opacity = "1";
                     this.monthContainer.style.opacity = "1";
                     this.dayContainer.style.opacity = "1";
                     this.hourContainer.style.opacity = "1";
                     this.minuteContainer.style.opacity = "1";
                     this.secondContainer.style.opacity = "1";
                 }, 10);
             }, 100);
         }
     }
 }
