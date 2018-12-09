'use strict'

class MainViewContainer {
    constructor() {

        this.app = new PIXI.Application({width: 600, height: 380, backgroundColor: 0x214d27 });
        document.querySelector('.table').appendChild( this.app.view );
        
        this.cardsContainer = new PIXI.Container();
        this.playZone = new PIXI.Container();
        this.app.stage.addChild(this.cardsContainer);
        this.app.stage.addChild(this.playZone);

    }

}
const StartApp = new MainViewContainer;

class Card {

    constructor( cardFront ) {
        
        this.cardFront = cardFront;
        this.cardBack = './images/cardItem-deck/back.png';
        this.cardWidth =  74;
        this.cardHeight = 115;

    }
    
    createPixiCard() {

        this.pixiContainer = new PIXI.Container();
        this.cardFront = new PIXI.Sprite.fromImage(this.cardFront);
        this.cardBack = new PIXI.Sprite.fromImage(this.cardBack);

        this.pixiContainer.addChild( this.cardFront );
        this.pixiContainer.addChild( this.cardBack );

        /* Add Dimensions */
        this.cardFront.width = this.cardWidth;
        this.cardFront.height = this.cardHeight; 

        this.cardBack.width = this.cardWidth;
        this.cardBack.height = this.cardHeight;        
        
        /* Add Card position end rotation */
        this.pixiContainer.x = 0;            
        this.pixiContainer.y = 0;   

        /* Add Card Front */
        this.pixiContainer.addChild(this.cardFront);
        /* Add Card Back */
        this.pixiContainer.addChild(this.cardBack);

    }

}

class ShuffledCardDeck {
    
    constructor( arrayToShuffle ) {
        this.shuffledDeck = [];
        this.cardVariety = arrayToShuffle;
        this.shuffledPixiDeck = [];
        this.pos = 74;

    }

    shuffleCards() {
        
        const cardVariety = this.cardVariety; 
        const shuffledDeck = this.shuffledDeck; 
        const fullDeckNumbers = this.cardVariety.length; 
        
        while( shuffledDeck.length < cardVariety.length ) {
            
            const randomNumber = Math.floor( Math.random()*fullDeckNumbers ); 
                        
            if( this.shuffledDeck.indexOf(cardVariety[randomNumber]) < 0 ) {
                this.shuffledDeck.push( cardVariety[randomNumber] );
            }
            
        }
        this.shufflePixiCards();
    }

    shufflePixiCards() {

        this.shuffledDeck.forEach( cardEl => {
            
            const SingleCard = new Card(`./images/cardItem-deck/${cardEl + 1}.png`);
            SingleCard.createPixiCard();
            this.shuffledPixiDeck.push(SingleCard);

        });
        this.addAllCardToView();
    }

    addAllCardToView() {
        
        this.shuffledPixiDeck.forEach( card => {

            const cardsContainerCenter = StartApp.app.view.width/2 - card.cardFront.width/2;
            StartApp.cardsContainer.addChild(card.pixiContainer);
            card.pixiContainer.x = cardsContainerCenter;

        });
    }

    filterNeededCards( numToShow ) {

        const cardsInContainer =  StartApp.playZone.children.length;

        this.shuffledPixiDeck.length < 1 ? alert( 'No more cards in the deck! Please restart game.' ) : null;

        if ( cardsInContainer > 3 ) {
            StartApp.playZone.removeChildren();    
            numToShow = 2;
            this.pos = 74;
        } 

        const showCards = this.shuffledPixiDeck.filter( (el, index) => {
            while( numToShow > index ) {
                return el;
            }
        });

        const newDeck = this.shuffledPixiDeck.slice( numToShow, this.shuffledPixiDeck.length );
        this.shuffledPixiDeck = newDeck;

        showCards.forEach( el => {
            
            StartApp.playZone.addChild(el.pixiContainer)
 
            el.pixiContainer.x = StartApp.app.view.width/12;
            el.pixiContainer.y = 150;
            
            const cardsContainerCenter = StartApp.app.view.width/2 - el.width/2;
            el.pixiContainer.children[1].x = cardsContainerCenter;
            el.pixiContainer.children[0].x = cardsContainerCenter;
            
        });
        
        this.animationShowCards(showCards);
    }

    animationShowCards(showCards) {
        const ticker = StartApp.app.ticker;
        const speedSwap = 0.2;
        const finalPoint = Math.PI;
        let isFinished = false;

        showCards.forEach( (el, index) => {
    
            const front = el.pixiContainer.children[0];
            const back = el.pixiContainer.children[1];     

            this.pos += 74 + 10;

            back.x = this.pos - back.width/2;
            back.y = 50;
            back.scale.x = -1;
            back.anchor.x = 0.5;
            
            front.x = this.pos - front.width/2;
            front.y = 50;
            front.scale.x = -1;
            front.anchor.x = 0.5;      

            
            ticker.add( () => {
                if( index > 0 && !isFinished ){ return }
                
                if( back.skew.y < finalPoint ) {
                    
                    front.skew.y += speedSwap;  
                    back.skew.y += speedSwap; 

                    if( back.skew.y > finalPoint/2 ) {
                        back.visible = false;
                        
                    }
                } else {
                    front.skew.y = finalPoint;  
                    back.skew.y = finalPoint;
                    isFinished = true;
                }

            });
        });

    }

}
const fullDeckCards = Array.from(Array(52).keys());
const ShuffledCards = new ShuffledCardDeck( fullDeckCards );
ShuffledCards.shuffleCards();
ShuffledCards.filterNeededCards(2);

class Button {

    constructor( buttonProps, textProps ) {

        /* Button props */
        this.button = new PIXI.Graphics();
        this.buttonFill = buttonProps.fill;
        this.buttonBorder = buttonProps.buttonBorder;
        this.buttonDimensions = buttonProps.buttonDimensions;
        this.buttonMargin = buttonProps.buttonMargin;
        
        this.buttonMode = true;
        this.interactive = true;
        
        /* Text props */
        this.textProps = textProps.mainProps;
        this.offset = textProps.textOffsets;

    }

    createButton() {

        this.button.beginFill( this.buttonFill );
        this.button.lineStyle( ...this.buttonBorder );
        this.button.drawRoundedRect( ...this.buttonDimensions )
        this.button.endFill();

        const horizontalPosition = StartApp.app.screen.width - this.button.getBounds().width;
        const verticalPosition = 0 - this.button.getBounds().y + 4 ;
        
        /* Little space from table borders */ 
        this.button.x = horizontalPosition - this.buttonMargin;
        this.button.y = verticalPosition + this.buttonMargin;

        this.button.buttonMode = this.buttonMode;
        this.button.interactive = this.interactive;

        StartApp.app.stage.addChild( this.button );      
        
        this.addButtonText();
    }

    addButtonText() {

        /* Add Button Text */
        const buttonText = new PIXI.Text('Draw new card', this.textProps);
        buttonText.x = this.offset.x;
        buttonText.y = this.offset.y;

        // buttenText
        this.button.addChild(buttonText);

        this.buttonListener();
    }

    buttonListener() {

        this.button.on('pointerdown', function(){
            ShuffledCards.filterNeededCards(1);
        });
    }
         
}
const buttonProps = { fill: 0xff8000, buttonBorder: [4, 0x99CCFF, 1], buttonDimensions: [0, 0, 120, 50, 7], buttonMargin: 5 }
const textProps = { 
    mainProps: { fontSize: 14, fill : 0xffffff, fontWeight: 700}, 
    textOffsets: {x: 10, y: 15} 
}
const DrawButton = new Button( buttonProps, textProps );
DrawButton.createButton();