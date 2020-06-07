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

//prototyping card class
class card {
    constructor(value, suit) {
        this.value = value;
        this.suit = suit;
        this.flipped = false;
    }
}

//implementation of a Fisher-Yates shuffle, taken from bost.ocks
//takes an array, returns a shuffled array in an efficient manner.
function shuffle(array) {
  var m = array.length, t, i;

  // While there remain elements to shuffle…
  while (m) {

    // Pick a remaining element…
    i = Math.floor(Math.random() * m--);

    // And swap it with the current element.
    t = array[m];
    array[m] = array[i];
    array[i] = t;
  }

  return array;
}

//the game area class code, along with a constructor
var gameArea = {
    canvas : document.createElement("canvas"), //creates a canvas object  
    container: document.getElementsByClassName("GameContainer"),//gets where the canvas is to go
    start : function(){
        //width and height for the function
        this.canvas.width = "700";
        this.canvas.height = "700";
        this.context = this.canvas.getContext("2d"); //gets the context for image drawing and manipulation methods
        this.container[0].insertBefore(this.canvas, null); //adds the canvas to the DOM
    }
}


