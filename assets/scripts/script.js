//Function to generate youtube vid in modal taken from indicated stackoverflow answer, modified slightly to not autoplay
function generateYoutubeModal(){//actually, gonna see if i can optimise this function any after i'm done
    var trigger = $("#HowToPlay");
    trigger.click(function(){//still need to get the trigger to do this, so can't avoid this bit
        var targetModal = $(this).data("target"),
        videoSource = $(this).attr("data-video");
        $(`${targetModal} iframe`).attr('src', videoSource);//fairly sure template literals are faster than just appending the string(only fairly sure, might have to research later)
        $(`${targetModal} button.close`).click(function(){//fast and kinda dirty way of getting the elements in the modal, but as long as it works
            $(`${targetModal} iframe`).attr('src', ''); //destroys the videoplayer when the modal closes, should keep potential issues to a minimum.
        });
    });
}

//and then prime the modal when the page is done loading.
$(document).ready(function(){
    generateYoutubeModal();
});

function initGame(){
    gameArea.start();
}

//Blackjack Game Code
var gameArea = {
    canvas : document.createElement("canvas"),
    container: document.getElementsByClassName("GameContainer"),
    start : function(){
        this.canvas.width = "700";
        this.canvas.height = "700";
        this.context = this.canvas.getContext("2d");
        this.container[0].insertBefore(this.canvas, null);
    },
}