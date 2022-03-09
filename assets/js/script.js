var currentDay = $("#currentDay");
var timeBlocksArea = $(".container");
var updateStatus;
var iniWorkHour = 0;
var lastWorkHour = 23;
var getCurrentDay = function(show){
    var inFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
    currentDay.text(moment().format(inFormat));
    if (show === "complete"){
        setInterval(function(){
            currentDay.text(moment().format(inFormat));
        }, 1000);
    }else{
        inFormat = "L";
        var date = moment().format(inFormat); 
        console.log(date);
    };
};
var setBlockStatus = function(){
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
var getTimeBlocks = function(){
    //loadTimeBlocks();
    for (var i=iniWorkHour; i<=lastWorkHour; i++){
        var timeBlock = $("<div>").addClass("row align-items-start time-blocks");
        var meridiem = "pm";
        var hour = i;
        if (i === 0){
            hour = 12;
            meridiem = "am";
        }else if (i < 12){
            meridiem = "am";
        }else if (i > 12){
            hour = i - 12;
        };
        timeBlock.append("<p class='hour'>" + hour + " " + meridiem + "</p><textarea id=" + i + "></textarea><button class='saveBtn'></button>");
        timeBlocksArea.append(timeBlock);
    };
    setBlockStatus();
    setInterval(function(){
        setBlockStatus();
    }, 10000);
};
getCurrentDay("complete");
getTimeBlocks();

