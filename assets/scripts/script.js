//Global Variables
let deck = [];
let winLossDrawRate = [0,0,0]; //will keep as-is before making it cached page data variable thingie
let client = 0;
let dealer = 0;

const CARD_NUMBER = { 0: "ace", 10: "jack", 11: "queen", 12: "king" };
const CARD_VALUES = { 0:0, 10:10, 11:10, 12:10 };
const SPECIAL_NUMBER = [0,10, 11, 12];

//display the modal when it's ready
$(document).ready(function() {
    generateYoutubeModal();
});

/*
    generateYoutubeModal

    This function creates a modal and the video contained within when clicking the button with the ID of HowToPlay.
    It also adds an event listener to the close button to destroy the video to prevent it playing when unseen.

    Returns nothing.
*/
function generateYoutubeModal() {
    let trigger = $("#HowToPlay");
    trigger.click(function() {
        let targetModal = $(this).data("target");
        videoSource = $(this).attr("data-video");
        $(`${targetModal} iframe`).attr('src', videoSource);
        $(`${targetModal} button.close`).click(function() {//fast and kinda dirty way of getting the elements in the modal, but as long as it works
            $(`${targetModal} iframe`).attr('src', ''); //destroys the videoplayer when the modal closes, should keep potential issues to a minimum.
        });
    });
}

//Blackjack Game Code

//Class Decelarations
//Card Class
class card {
    constructor(number, suit) {
        this.setCardValue(number);
        this.setCardSuit(suit);
    }
    /*  Generates and returns a text string of the location of the card's art.*/
    getImageSource(){
        return `assets/images/cards/${this.rank}_of_${this.suit}.png`;
    }
    /* Takes takes a number and sets the cards rank and value based on that number, 
    with special considerations taken for Aces, Jacks, Queens, and Kings.*/
    setCardValue(number){
        this.rank = SPECIAL_NUMBER.includes(number) ? CARD_NUMBER[number] : (number + 1).toString();
        this.value = SPECIAL_NUMBER.includes(number) ? CARD_VALUES[number] : (number+1);
    }
    /* Sets the suit based on the value passed via the 'suit' variable.*/
    setCardSuit(suit){
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

//Player Class
class player{
    constructor(x, y, cardWidth){
        this.turn = true;
        this.hand = [];
        this.originX = x;
        this.originY = y;
        this.cardWidth = cardWidth;
        this.cardHeight = cardWidth*1.5;
    }

    /*  Calculates the total value for the player's hand

        Returns this total as a number.*/
    calulateHandValue(){
        //Sorts the hand by in ascending order of card value, then reverses it for simpler calculation.
        var sortedHand = this.hand.slice().sort((a,b)=>a.value - b.value).reverse();

        //Now, to add up the sum of the cards.
        var handTotal = 0;
        sortedHand.forEach(element => {
            if(element.value === 0)
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

    /*  Draws a card from the targeted deck 'tarDeck' and adds it to the player's hand. It then checks if the new value of the hand
        would cause the player's turn to end. 
        
        Returns true if the player's turn has not ended, and false if it has ended. */
    hit(tarDeck){//returns false if the drawn card causes the player's turn to end, either by hitting 21 or going bust, or by hitting 5 cards.
        this.hand.push(tarDeck.shift());//removes a card from the top of the deck into the entity's hand.
        var total = this.calulateHandValue();//I know i should probably have the total be a member variable, but the amount of work it'd take to get it working neatly with display code and aces is too much to bother with.
        if(total >= 21 || this.hand.length == 5) this.endTurn();
        return this.turn;
    };

    /*  Sets the player's turn value to false, as this acts oddly without a method.
        Returns nothing.*/
    endTurn(){
        this.turn = false;
    }

    //Runs the card.getImageSource() method for each card in the player's hand, then returns an array of these strings.
    getHandImages(){
        var handImageSources = [];
        this.hand.forEach(element => handImageSources.push(element.getImageSource()));
        return handImageSources;
    }

    //updates the card sizes based on 'width' and relocates the originX and originY values based on the passed x and y values.
    updateSize(width, x, y){
        this.cardWidth = width;
        this.cardHeight = width*1.5;
        this.originX = x;
        this.originY = y;
    }
}

//The game area class code, along with a constructor.
let gameArea = {
    canvas : document.createElement("canvas"), //Creates a canvas object. 
    container: document.getElementsByClassName("GameContainer"),//Gets where the canvas is to be positioned.
    
    /*  This method acts as the constructor for the gameArea class, setting up the gameplay <canvas> element, setting it's size based on the viewport width,
        then renders the player's newly drawn hands.
        
        Returns nothing.
    */
    generate : function(){
        //Width and height for the play-space.
        this.canvas.width = 700;
        this.canvas.height = 700;
        let cardWidth = 100;

        if(window.innerWidth < 700)
        {
            cardWidth = 50;
            this.canvas.width = 300;
            this.canvas.height = 500;
        }

        this.canvas.id= "GameCanvas";
        this.context = this.canvas.getContext("2d"); //Gets the context for image drawing and manipulation methods.
        this.container[0].insertBefore(this.canvas, null); //Adds the canvas to the DOM.
        this.container[0].style.display = "block";

        //then, need to generate the deck before any gamplay can occur.
        deckGeneration();
        //then, show the game controls.
        document.getElementById("startGame").style.display = "none";
        document.getElementById("replayGame").style.display = "none";
        document.getElementById("gameControlHit").style.display = "inline-block";
        document.getElementById("gameControlStand").style.display = "inline-block";

        //ensures the controls are active
        document.getElementById("gameControlHit").disabled = false;
        document.getElementById("gameControlStand").disabled = false;
        //Display the current score

        //Create the Player Hand objects, along with the Alignment value.
        let xAlign = (this.canvas.width/2)-(cardWidth * 1.25);

        client = new player(xAlign, this.canvas.height - cardWidth*1.5, cardWidth);
        dealer = new player(xAlign, 10, cardWidth);

        //initial card draws
        client.hit(deck);
        dealer.hit(deck);
        client.hit(deck);
        
        loadImages(dealer.getHandImages(), drawImageCallback, dealer.originX, dealer.originY, dealer.cardWidth, dealer.cardHeight);
        loadImages(client.getHandImages(), drawImageCallback, client.originX, client.originY, client.cardWidth, client.cardHeight);

        if(client.calulateHandValue() == 21){
            client.endTurn();
            dealer.endTurn();
            gameLogic(false);
        }
    },

    /*  gameArea.resize()
        This method runs when the viewport is resized, altering the playarea and card sizes to better fit the new width of the viewport.

        Returns nothing.
    */
    resize: function(){
        if(client && dealer){
            let newX = 0;
            if(window.innerWidth < 700)
            {
                this.canvas.width = 300;
                this.canvas.height = 500;
                newX = (this.canvas.width/2)-(50*1.25);
                client.updateSize(50, newX,this.canvas.height-client.cardHeight);
                dealer.updateSize(50, newX, 10);
            }
            else{
                this.canvas.width = 700;
                this.canvas.height = 700;
                newX = (this.canvas.width/2)-(100*1.25);
                client.updateSize(100, newX,this.canvas.height-client.cardHeight);
                dealer.updateSize(100, newX, 10);
            }
        
            wipeCanvas();//clearing canvas to prevent any bugs from redrawing images.
            loadImages(dealer.getHandImages(), drawImageCallback, dealer.originX, dealer.originY, dealer.cardWidth, dealer.cardHeight);
            loadImages(client.getHandImages(), drawImageCallback, client.originX, client.originY, client.cardWidth, client.cardHeight);
        }
    },

    /*
        resetGame

        This method takes no parameters.

        This method sets the winLossDrawRate global variable to its initial state on loading the page, then updates the score display accordingly.
        It then runs the generate method of gameArea in order to finish resetting the game by re-initialising the game state.

        This method returns no values.

    */
    resetGame: function(){
        winLossDrawRate = [0,0,0];
        document.getElementById("ScoreDisplay").textContent=`Wins: ${winLossDrawRate[0]} | Losses: ${winLossDrawRate[1]} | Draws: ${winLossDrawRate[2]}`
        this.generate();
    }
}

/*  deckGeneration()
    This function takes no parameters.

    This function creates a new deck in the deck[] global variable, and is run when generating the game area to ensure every card remains draw-able in a given round.

    This function does not return a value.
*/
function deckGeneration(){
    deck.length = 0;//empty any potentially existing instance of the deck, to prevent it duplicating entries.
    deck = [];
    for(let suitNo = 0; suitNo < 4; suitNo++){ //condensed it all down to two for loops, and a two switch statements in a constructor.
        for(let rankNo = 0; rankNo< 13; rankNo++){
            deck.push(new card(rankNo, suitNo));
        }
    }
    shuffle(deck);
}

/*  Implementation of a Fisher-Yates shuffle, taken from bost.ocks

    Takes an array.

    Returns a shuffled array in an efficient manner.
*/
function shuffle(array) {
  let m = array.length, t, i;

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

/*  gameLogic(moveChoice)
    Takes a variable - moveChoice - A boolean which denotes which move the player chose, true for 'hit', false for 'stand'.

    It then performs the necessary logic for the game: checking to see if the player's turn ended with that move, then allowing the dealer to act
    according to its rules.
    The canvas is then cleared and the new hands are drawn.

    If the last move taken resulted in an end state, this function then passes the appropriate value to the gameEnd(state) function.

    This function has no return value.
*/
function gameLogic(moveChoice){
    //moveChoice is True if the player decided to hit, and false if they decided to stand.
    let dealerIsActive = false;

    if(moveChoice){
        dealerIsActive = !client.hit(deck);
    }

    if(dealerIsActive || !moveChoice){//dealer turn is true if the player has gotten 21 or bust, !movechoice is true if the player chose to stand.
        client.endTurn();
        document.getElementById("gameControlHit").disabled = true;
        document.getElementById("gameControlStand").disabled = true;

        while(dealer.turn && dealer.calulateHandValue() < 17){//dealer's turn loop.
            dealer.hit(deck); 
        }
        dealer.endTurn();
    }

    wipeCanvas();//clearing canvas to prevent any bugs from redrawing images.
    loadImages(dealer.getHandImages(), drawImageCallback, dealer.originX, dealer.originY, dealer.cardWidth, dealer.cardHeight);
    loadImages(client.getHandImages(), drawImageCallback, client.originX, client.originY, client.cardWidth, client.cardHeight);
    //Game has ended if it runs this if() statement.
    if(!client.turn && !dealer.turn){
        document.getElementById("gameControlHit").style.display = "none";
        document.getElementById("gameControlStand").style.display = "none";
        document.getElementById("replayGame").style.display = "inline-block";

        let clientTotal = client.calulateHandValue();
        let dealerTotal = dealer.calulateHandValue();
        
        if((client.hand.length == 2 && clientTotal == 21)&& dealer.hand.length != 2){
            gameEnd("Win");
        }
        else if(clientTotal > 21){
            gameEnd("Lose");
        }
        else if(dealerTotal > 21){
            gameEnd("Win");
        }
        else if(clientTotal > dealerTotal){
            gameEnd("Win");
        }
        else if(dealerTotal > clientTotal){
            gameEnd("Lose");
        }
        else{
            gameEnd("Draw");
        }
    }
}

//loadImages code taken & adapted from: html5canvastutorials.com
/*
    loadImages(sources, callback, x, y, width, height)

    This function takes 6 parameters.
    These are:
        - sources - An array of strings that are locations of images to be loaded.
        - callback - A function to be run for each of the elements within sources.
        - x - the X position to start the image drawing at.
        - y - the Y position to start the image drawing at.
        - width - the width of the image to be drawn.
        - height - the height of the image to be drawn.

    The function begins by retreiving the canvas and context for the images to be drawn to,
    it then calculates the number of images to be drawn, and stores the value in numImages.
    Then, it begins to create an Image element for each of these sources, waiting for it to load.
    Once the image loads, it increments the number of loaded images.
    It then sets the source for the generated image.
    Once all the requesite images have loaded it performs the callback function with the necessary parameters.

    This function has no return value.
*/
function loadImages(sources, callback, x, y, width, height) {
    let images = {};
    let loadedImages = 0;
    let numImages = 0;
    let canvas = document.getElementById('GameCanvas');
    let context = canvas.getContext('2d');
        
    // get num of sources
    for(let src in sources) {
        numImages++;
    }
    for(let src in sources) {
        images[src] = new Image();
        images[src].onload = function() {
            if(++loadedImages >= numImages) {
                callback(context, images, x, y, width, height);
            }
        };
        images[src].src = sources[src];
    }
}

/*
    drawImageCallback
    
    This function takes 6 parameters:
        - context - the context of the canvas element to draw to.
        - images - an array of image elements to be drawn to said canvas.
        - x & y - the pixel coordinate position of the start point of the desired location of the images.
        - width & height - The width and height of the images to be drawn.

    This function simply iterates through the images array, drawing each image onto the canvas, then moving half the image width across to draw the next image in the array.
    This creates a visually pleasing overlap that somewhat resembles an actual hand of cards.

    This image has no return values.
*/
function drawImageCallback(context, images, x, y, width, height){
    for(let imageNo in images){
        context.drawImage(images[imageNo],x + ((0.5*imageNo)*width),y,width, height);
    }
}

/*
    wipeCanvas

    This function has no Parameters.

    This function obtains the canvas and context to be cleared, then runs the context method clearRect to empty the canvas of images and text.

    This function returns no values.
*/
function wipeCanvas(){
    let canvas = document.getElementById('GameCanvas');
    let context = canvas.getContext('2d');
    context.clearRect(0,0,canvas.width,canvas.height);
}


/*  
    gameEnd

    This function takes a string 'state' as a parameter, which represents the state of the game in regards to the client player when it is called.

    This function gets the canvas and context, setting appropriate font styles to use in drawing text.
    It then draws a message to the canvas based on if the player won, lost, or drew with the dealer.
    It finally increments the appropriate entry for winLossDrawRate. entry 0 being wins, 1 being losses, and 2 being draws.

    This function returns no values.
*/
function gameEnd(state){
    //get the canvas context for drawing
    let canvas = document.getElementById('GameCanvas');
    let context = canvas.getContext('2d');
    context.font = "3rem Sriracha";
    context.fillStyle = "white";
    context.textAlign = "center"
    //then, we need to draw the right statement based on the game state.
    switch(state){
        case "Win":
            context.fillText("You Win!",canvas.width/2, canvas.height/2);
            winLossDrawRate[0]++;
            break;
        case "Lose":
            context.fillText("You Lose...",canvas.width/2, canvas.height/2);
            winLossDrawRate[1]++;
            break;
        case "Draw":
            context.fillText("It's A Draw!",canvas.width/2, canvas.height/2);
            winLossDrawRate[2]++;
            break;
        //no default, as that was handled in the only place this function is called.
    }
    document.getElementById("ScoreDisplay").textContent=`Wins: ${winLossDrawRate[0]} | Losses: ${winLossDrawRate[1]} | Draws: ${winLossDrawRate[2]}`
}