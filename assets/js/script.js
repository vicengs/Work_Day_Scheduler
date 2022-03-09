var currentDay = $("#currentDay");
var timeBlocksArea = $(".container");
var updateStatus;
var iniWorkHour = 7;
var lastWorkHour = 20;
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
        timeBlock.append("<p class='hour'>" + hour + " " + meridiem + "</p><textarea id=" + i + "></textarea><button id='btn-" + i + "'class='saveBtn'><i class='fa fa-save'></i></button>");
        timeBlocksArea.append(timeBlock);
    };
    setBlockStatus();
};
var getCurrentDay = function(show){
    var inFormat = "dddd, MMMM Do YYYY, h:mm:ss a";
    var lastTime = moment().format("HH");
    currentDay.text(moment().format(inFormat));
    if (show === "show"){
        setInterval(function(){
            currentDay.text(moment().format(inFormat));
            if (lastTime < moment().format("HH")){
                setBlockStatus();
            };
        }, 1000);
        getTimeBlocks();
    }else{
        inFormat = "L";
        var date = moment().format(inFormat); 
        console.log(date);
    };
};

getCurrentDay("show");
$(".time-blocks").on("change", "textarea", function(){
    var numId = this.id;
    var blockChange = ".time-blocks #btn-" + numId;
    $(blockChange).addClass("btnUpdate");
});
$(".time-blocks").on("click", "button", function(){
    $(this).removeClass("btnUpdate");
});
$(".time-blocks").on("focus", "textarea", function(){
    $(this).addClass("focusUpdate");
});
$(".time-blocks").on("focusout", "textarea", function(){
    $(this).removeClass("focusUpdate");
});
$(".time-blocks textarea").mouseover(function(){
    $(this).addClass("onUpdate");
});
$(".time-blocks textarea").mouseleave(function(){
    $(this).removeClass("onUpdate");
});

// save button in modal was clicked
//$(".time-blocks .saveBtn").click(function() {
    //var prueba = $(this);
    //console.log(prueba);
    // get form values
    //var taskText = $("#modalTaskDescription").val();
  
    /*if (taskText && taskDate) {
      createTask(taskText, taskDate, "toDo");
  
      // close modal
      $("#task-form-modal").modal("hide");
  
      // save in tasks array
      tasks.toDo.push({
        text: taskText,
        date: taskDate
      });
    }*/
  //});