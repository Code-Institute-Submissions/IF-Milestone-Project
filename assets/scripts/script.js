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

//don't forget to re-organise all this once you're done, this is pretty messy dude.

function initGame(){
    gameArea.start();
}

//Blackjack Game Code

//card class
class card {
    constructor(face, suit) {
        //This hits a really weird taxonomic problem where I don't think there's a specific name for non-face cards,
        //so I need to differentiate the numeric values of the cards for the sake of sorting in the handCalc function.
        //For simplicity's sake, this.face refers to the proper name of the card,
        //And this.value is the card's numeric value in a hand under normal conditions, with the exception of the ace, which needs special handling.
        //This will also allow for a nice and easy string literal for pulling the card art from the image folder.
        this.face = face;
        this.suit = suit;
        this.flipped = false;
        //And that whole bit above leads to this switch statement which properly assigns the numeric values for sorting.
        switch(this.face){
            case "ace":
                this.value = 0;//This is a little odd, but I need the ace last in the sort
                break;
            case "2"://Don't much like having the values assigned like this but it's too awkward otherwise, as it'd need a specific face value only certain cards have
                this.value = 2;
                break;
            case "3"://while that'd assuredly have a smaller memory footprint, this is faster to code.
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

//Implementation of a Fisher-Yates shuffle, taken from bost.ocks
//Takes an array, returns a shuffled array in an efficient manner.
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

function handCalc(Hand){//Calculates the total value for the given hand.
    //Sorts the hand by in ascending order of card value, then reverses it for simpler calculation.
    var sortedHand = Hand.slice().sort(function(a,b){return a.value - b.value}).reverse();

    //Now, to add up the sum of the cards.
    var handTotal = 0;
    sortedHand.forEach(element => {
        if(element.value == 0)
        {
            if(handTotal <= 10){
                handTotal += 11; //Ace is 11 if it wouldn't make the hand go bust,
            }else{
                handTotal += 1;//and is 1 otherwise.
            }
        }else{
            handTotal += element.value;
        }
    });
    return handTotal;
};

//The game area class code, along with a constructor.
var gameArea = {
    canvas : document.createElement("canvas"), //Creates a canvas object. 
    container: document.getElementsByClassName("GameContainer"),//Gets where the canvas is to be positioned.
    start : function(){
        //Width and height for the play-space.
        this.canvas.width = "700";
        this.canvas.height = "700";
        this.context = this.canvas.getContext("2d"); //Gets the context for image drawing and manipulation methods.
        this.container[0].insertBefore(this.canvas, null); //Adds the canvas to the DOM.
    }
}

//Display Code

