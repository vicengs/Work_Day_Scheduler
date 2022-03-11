/* ----------------------------- */
/* Project  : Work Day Scheduler */
/* File     : script.js          */
/* Author   : Vicente Garcia     */
/* Date     : 03/08/2022         */
/* Modified : 03/11/2022         */
/* ----------------------------- */
// Declare variables DOM
var currentDay = $("#currentDay");
var timeBlocksArea = $(".container");
// Declare global variables
var iniWorkHour = 9;
var lastWorkHour = 17;
var timeActivity = [];
var txtChange = false;
// Function to load time blocks
var loadTimeBlocks = function(){
    // Get local storage array and assign to global array variable
    timeActivity = JSON.parse(localStorage.getItem('timeBlocks'));
    // If there are nothing in local storage initializes global array variable
    if (!timeActivity){
        timeActivity = [];
    };
};
// Function to save in local storage time block with hour and activity parameters to change
var saveTimeBlock = function(hour, activity){
    // Declare local variables
    var update = false;
    var date = getCurrentDay(false);
    // Loop to each time block in array
    for (var i=0; i < timeActivity.length; i++){
        // Validate if the hour in the array matches with the hour to save
        if (timeActivity[i].hour === hour){
            timeActivity[i].date = date;
            timeActivity[i].activity = activity;
            update = true;
        };
    };
    // If nothing was updated then it is the first time and is neccessary to create the local storage array
    if (!update){
        var updateActivity = [];
        updateActivity = {date: date
                         ,hour: hour
                         ,activity: activity};
        timeActivity.push(updateActivity);
    };
    localStorage.setItem("timeBlocks", JSON.stringify(timeActivity));
};
// Function to set status in time of time blocks
var blockStatus = function(){
    // Loop each time block
    $(".time-blocks textarea").each(function(index, block){
        // Declare local variables
        var hourBlock = parseInt(block.id);
        var currentTime = moment().format("HH");
        var status;
        // Remove actual style classes on time block
        $(block).removeClass();
        // Asign new class to style time block depending the actual hour
        if (hourBlock < currentTime){
            status = "past";
        }else if (hourBlock > currentTime){
            status = "future";
        }else{
            status = "present";
        };
        $(block).addClass(status);
    });
};
// Function to build time blocks
var timeBlocks = function(){
    // Call funtion to get array from local storage
    loadTimeBlocks();
    // Loop to print time blocks from initial work hour to las work hour
    for (var i=iniWorkHour; i<=lastWorkHour; i++){
        // Declare local variables
        var timeBlock = $("<div>").addClass("row align-items-start time-blocks");
        var meridiem = "pm";
        var hour = i;
        var txtActivity = "";
        // Validate if work hour (in 24 hr format) is the first hour in the day (12 am)
        if (i === 0){
            hour = 12;
            meridiem = "am";
        // Validate if work hour (in 24 hr format) is less than 12 pm to asign ante meridiem
        }else if (i < 12){
            meridiem = "am";
        // Validate if work hour (in 24 hr format) is greater than 12 pm to keep post meridiem and substrat 12 to shoow 12 hr format
        }else if (i > 12){
            hour = i - 12;
        };
        try {
            // Loop to show in screen activities load from local storage
            for (var j=0; j<=lastWorkHour-iniWorkHour; j++){
                if (parseInt(timeActivity[j].hour) === i){
                    txtActivity = timeActivity[j].activity;
                    break;
                };
            };
        }catch(ArrayIndexOutOfBoundsException){
            // Catch when there are not value in the index array
        };
        timeBlock.append("<p class='hour'>" + hour + " " + meridiem + "</p><textarea id=" + i + ">"+ txtActivity +"</textarea><button disabled id='btn-" + i + "'class='saveBtn'><i class='fa fa-save'></i></button>");
        timeBlocksArea.append(timeBlock);
    };
    // Call function to to change status on time blocks
    blockStatus();
};
// Function to get the current day and time or date mm/dd/yyyy to save in local storage
var getCurrentDay = function(showScreen){
    // Declare local vartiable to get format moment
    var inFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
    // Variable to get the actual hour
    var lastTime = moment().format("HH");
    // Show in screen date and time
    currentDay.text(moment().format(inFormat));
    // Begins interval by 1 second just first time when load page
    if (showScreen){
        // Interval each 1 second
        setInterval(function(){
            // Prints new hour (hour:minutes:seconds)
            currentDay.text(moment().format(inFormat));
            // Just if hour changes in comparission the last time, change status on time blocks.
            if (lastTime < moment().format("HH")){
                // Call function to change status on time blocks
                blockStatus();
                // Assign the new last time that change status
                lastTime = moment().format("HH");
            };
        }, 1000);
        // Call function to print time blocks on page
        timeBlocks();
    // If the function was called to get date to save in local storage
    }else{
        // Assign format mm/dd/yyyy
        inFormat = "L";
        return moment().format(inFormat); 
    };
};
// Call function to begin, first getting the current day and time
getCurrentDay(true);
// Function to change button style and functionality depending if is called to save or not, receives the object parameter and desired button enabled property 
var activateBtn = function(save, object, disable){
    // Declare local variables
    var blockChange = ".time-blocks #btn-" + object.id;
    var removeClass = "fa-save";
    var addClass = "fa-upload";
    // By default the button is assigned the update style class and disable
    $(blockChange)
    .addClass("btnUpdate")
    .prop("disabled", disable);
    // I f the function was called when button to save was clicked the button changes a normal form
    if (save){
        $(blockChange).removeClass("btnUpdate");
        removeClass = "fa-upload";
        addClass = "fa-save";
    };
    blockChange = blockChange + " .fa";
    $(blockChange)
    .removeClass(removeClass)
    .addClass(addClass);
};
// Event when something changed (type or delete) in textarea
$(".time-blocks textarea").change(function(){
    activateBtn(false, this, false);
    txtChange = true;
    idChange = this.id;
});
// Event when button is clicked to save
$(".time-blocks button").click(function(){
    var numId = this.id.replace("btn-","");
    $(this)
    .removeClass("btnUpdate")
    .prop("disabled", true);
    $(this.firstChild)
    .removeClass("fa-upload")
    .addClass("fa-save");
    $(".time-blocks #"+numId).prop("disabled", false);
    // Call function to save
    saveTimeBlock(parseInt(numId),$(".time-blocks #" + numId).val().trim());
});
// Event when mouse is over a textarea to change style
$(".time-blocks textarea").mouseover(function(){
    $(this).addClass("onUpdate");
});
// Event when mouse is leave a textarea to return style
$(".time-blocks textarea").mouseleave(function(){
    $(this).removeClass("onUpdate");
});
// Event when text area is clicked to type (or delete)
$(".time-blocks textarea").focus(function(){
    $(this).addClass("focusUpdate");
    activateBtn(false, this, true);
});
// Event when pointer is leaving from textarea
$(".time-blocks textarea").focusout(function(){
    $(this).removeClass("focusUpdate");
    // If nothing changed reverse the button to original form
    if (!txtChange){
        activateBtn(true, this, true);
    // If something changed disable text area until the change will be saved
    }else{
        $(this).prop("disabled",true);
    };
    txtChange = false;
});