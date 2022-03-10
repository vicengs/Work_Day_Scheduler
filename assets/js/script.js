/* ----------------------------- */
/* Project  : Work Day Scheduler */
/* File     : script.js          */
/* Author   : Vicente Garcia     */
/* Date     : 03/08/2022         */
/* Modified : 03/10/2022         */
/* ----------------------------- */
var currentDay = $("#currentDay");
var timeBlocksArea = $(".container");
var iniWorkHour = 9;
var lastWorkHour = 17;
var timeActivity = [];
var loadTimeBlocks = function(){
    timeActivity = JSON.parse(localStorage.getItem('timeBlocks'));
    if (!timeActivity){
        timeActivity = [];
    };
};
var saveTimeBlock = function(hour, activity){
    var update = false;
    var date = getCurrentDay(false);
    for (var i=0; i < timeActivity.length; i++){
        if (timeActivity[i].hour === hour){
            timeActivity[i].date = date;
            timeActivity[i].activity = activity;
            update = true;
        };
    };
    if (!update){
        var updateActivity = [];
        updateActivity = {date: date
                         ,hour: hour
                         ,activity: activity};
        timeActivity.push(updateActivity);
    };
    localStorage.setItem("timeBlocks", JSON.stringify(timeActivity));
};
var blockStatus = function(){
    $(".time-blocks textarea").each(function(index, block){
        var hourBlock = parseInt(block.id);
        var currentTime = moment().format("HH");
        var status;
        $(block).removeClass();
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
var timeBlocks = function(){
    loadTimeBlocks();
    for (var i=iniWorkHour; i<=lastWorkHour; i++){
        var timeBlock = $("<div>").addClass("row align-items-start time-blocks");
        var meridiem = "pm";
        var hour = i;
        var txtActivity = "";
        if (i === 0){
            hour = 12;
            meridiem = "am";
        }else if (i < 12){
            meridiem = "am";
        }else if (i > 12){
            hour = i - 12;
        };
        try {
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
    blockStatus();
};
var getCurrentDay = function(showScreen){
    var inFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
    var lastTime = moment().format("HH");
    currentDay.text(moment().format(inFormat));
    if (showScreen){
        setInterval(function(){
            currentDay.text(moment().format(inFormat));
            if (lastTime < moment().format("HH")){
                blockStatus();
            };
        }, 1000);
        timeBlocks();
    }else{
        inFormat = "L";
        return moment().format(inFormat); 
    };
};
getCurrentDay(true);
$(".time-blocks textarea").change(function(){
    var blockChange = ".time-blocks #btn-" + this.id;
    $(blockChange)
    .addClass("btnUpdate")
    .prop("disabled", false);
    blockChange = blockChange + " .fa";
    $(blockChange)
    .removeClass("fa-save")
    .addClass("fa-upload");
});
$(".time-blocks button").click(function(){
    var numId = this.id.replace("btn-","");
    $(this)
    .removeClass("btnUpdate")
    .prop("disabled", true);
    $(this.firstChild)
    .removeClass("fa-upload")
    .addClass("fa-save");
    saveTimeBlock(parseInt(numId),$(".time-blocks #" + numId).val().trim());
});
$(".time-blocks textarea").mouseover(function(){
    $(this).addClass("onUpdate");
});
$(".time-blocks textarea").mouseleave(function(){
    $(this).removeClass("onUpdate");
});
$(".time-blocks textarea").focus(function(){
    $(this).addClass("focusUpdate");
});
$(".time-blocks textarea").focusout(function(){
    $(this).removeClass("focusUpdate");
});