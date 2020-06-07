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

//card class
class card {
    constructor(face, suit) {
        //ok so this hits a really weird taxonomic problem, where i don't think there's a specific name for non-face cards,
        //so I need to differentiate the numeric values of the cards for the hand sorting in the handValCalc function.
        //for simplicity's sake, this.face refers to the proper name of the card,
        //and this.value is the card's numeric value in a hand under normal conditions, with the exception of the ace, which needs special handling.
        this.face = face;
        this.suit = suit;
        this.flipped = false;
        //and that whole bit above leads to this switch statement, to properly assign the numeric value for sorting.
        switch(this.face){
            case "ace":
                this.value = 0;//ok so this is really weird but i need the ace last in the sort
                break;
            case "2"://Don't like having the values stored like this, but it's too awkward otherwise, as it'd need a specific face value only certain cards have
                this.value = 2;
                break;
            case "3"://while that'd assuredly have a smaller memory footprint, this is faster to make.
                this.value = 3;
                break;
            case "4":
                this.value = 4;
                break;
            case "5":
                this.value = 5;
                break;
            case "6":
                this.value = 6;
                break;
            case "7":
                this.value = 7;
                break;
            case "8":
                this.value = 8;
                break;
            case "9":
                this.value = 9;
                break;
            case "10":
                this.value = 10;
                break;
            case "jack":
                this.value = 10;
                break;
            case "queen":
                this.value = 10;
                break;
            case "king":
                this.value = 10;
                break;
            default:
                console.log("this should never happen, default switch case in card constructor being triggered"); //debug error message, to be removed for deployment branch
                break;
        };
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
};

function handValCheck(playerHand, dealerHand){
//custom sorting function
    var pEndHand = playerHand.slice().sort(function(a,b){return a.value - b.value}).reverse();//sorts the hand by in ascending order of card value, then reverses it for easier calculation
    var dEndHand = dealerHand.slice().sort(function(a,b){return a.value - b.value}).reverse();
    
    
};
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


