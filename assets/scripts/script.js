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
    gameArea.generate();
}

//Blackjack Game Code
//Global Variables
var deck = [];
var playerHand = [];
var dealerHand = [];
var winLossRate = [0,0];

//card class
class card {
    constructor(number, suit) {
        switch(number){
            case 0:
                this.rank = "ace";
                this.value = 0;
                break;
            case 1:
                this.rank = "2";
                this.value = 2;
                break;
            case 2:
                this.rank = "3";
                this.value = 3;
                break;
            case 3:
                this.rank = "4";
                this.value = 4;
                break;
            case 4:
                this.rank = "5";
                this.value = 5;
                break;
            case 5:
                this.rank = "6";
                this.value = 6;
                break;
            case 6:
                this.rank = "7";
                this.value = 7;
                break;
            case 7:
                this.rank = "8";
                this.value = 8;
                break;
            case 8:
                this.rank = "9";
                this.value = 9;
                break;
            case 9:
                this.rank = "10";
                this.value = 10;
                break;
            case 10:
                this.rank = "jack";
                this.value = 10;
                break;
            case 11:
                this.rank = "queen";
                this.value = 10;
                break;
            case 12:
                this.rank = "king";
                this.value = 10;
                break;
            default:
                console.log("Invalid Rank Number"); //debug error message, to be removed for deployment branch
                break;
        };
        switch(suit){
            case 0:
                this.suit = "clubs";
                break;
            case 1:
                this.suit = "diamonds";
                break;
            case 2:
                this.suit = "hearts";
                break;
            case 3:
                this.suit = "spades";
                break;
            default:
                console.log("Invalid Suit Number");
                break;
        };
    }
}

//Deck Generation Function
function deckGeneration(){
    deck.length = 0;//empty any potentially existing instance of the deck, to prevent it duplicating entries.
    deck = [];
    for(var suitNo = 0; suitNo < 4; suitNo++){ //condensed it all down to two for loops, and a two switch statements in a constructor.
        for(var rankNo = 0; rankNo< 13; rankNo++){
            deck.push(new card(rankNo, suitNo));
        }
    }
    console.log(deck);
    shuffle(deck);
    console.log(deck);
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

//Calculates the total value for the given hand.
function handCalc(Hand){
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
    generate : function(){
        //Width and height for the play-space.
        this.canvas.width = "700";
        this.canvas.height = "700";
        this.context = this.canvas.getContext("2d"); //Gets the context for image drawing and manipulation methods.
        this.container[0].insertBefore(this.canvas, null); //Adds the canvas to the DOM.

        //then, need to generate the deck before any gamplay can occur.
        deckGeneration();
    }
}

//Display Code