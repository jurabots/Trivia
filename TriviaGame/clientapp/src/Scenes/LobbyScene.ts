import Scene from '../Scene';
import Animation from '../Elements/Animation';
import Button from '../Elements/Button';
import {
    ColorsEnum
} from '../Helpers/ColorsEnum';
import Character from '../Elements/Character';
//import HorizontalSlideManager from '../Elements/HorizontalSlideManager';
import MyLoader from '../Helpers/MyLoader';
import HorizontalCharsSlideManager from '../Elements/HorizontalCharsSlideManager';
import ApiServer from '../Server/ApiServer';
import GameEvent from '../state/GameEvent';
import GameStateMachine from '../state/GameStateMachine';
import { gameData } from '../Helpers/GameData';


export default class LobbyScene extends Scene {
    currentChar: Character;
    bg_animation: Animation;
    charactersSlider: HorizontalCharsSlideManager;
    buttons; //object to store buttons

    constructor(options) {
        super(options);
    }

    //defines and initializes all properties of a scene
    protected initializeScene(options: any): void {
        this.game.loadGameplayAssets();
        //array of all characters available (spine objects)
        this.currentChar = this.game.animatedCharsList[0];
        this.bg_animation = null;
        this.charactersSlider = null;
        this.buttons = {}; //object to store buttons
        this.buttons.play = null;
        this.buttons.howToPlay = null;
        this.buttons.leaderboard = null;
        this.buttons.nextChar = null;
        this.buttons.prevChar = null;

    }


    //adds all elements on scene
    //takes PIXI container to store all elements
    //returns nothing
    //has to be implemented in child classes
    protected addSpecificElements(container: any): void {
        //hide character
        this.game.character.displayOnScene(false);
        if(this.game.opponentPlayer.character){
            this.game.opponentPlayer.character.displayOnScene(false);
        }
        //background animation:
        this.addBackgroundAnimation(container);

        //buttons:
        this.addPlayButton(container);
        this.addHowToPlayButton(container);
        this.addLeaderboardButton(container);
        this.addNextCharButton(container);
        this.addPrevCharButton(container);

        //characters slider:
        this.addCharactersSlider(container);
    }

    protected addBackgroundAnimation(container): void {
        this.bg_animation = new Animation({
            name: "Trivia_lobby_screen_animation",
            resourceName: "lobby_bg_animation",
            x: 566,
            y: 1217,
            zOrder: 5
        });
        this.bg_animation.createAnimation();
        this.bg_animation.setAnimationByFullName("Trivia_lobby_screen_animation");
        container.addChild(this.bg_animation.animation);
    }

    /*____________________________BUTTONS_____________________________*/
    protected addPlayButton(container): void {
        this.buttons.play = new Button({
            name: "btnPlay",
            x: 300,
            y: 1750 - 250,
            width: 200,
            resource: "btn_orange",
            hasLabel: true,
            label: "PLAY",
            fontColor: ColorsEnum.white
        });
        this.buttons.play.shapeContainer.scale.x = 0.8;
        this.buttons.play.changeLabelPosition(null, 23);
        container.addChild(this.buttons.play.shapeContainer);
        this.buttons.play.onClick(this.playBtnOnClick, this);
    }

    //Play button event listener
    protected async playBtnOnClick(event): Promise < void > {
        event.stopPropagation();
        if (!this.game.player.payBet()) {
            //show no money reaction 
            console.log("No money left");
            return;
        }
        this.buttons.play.shapeContainer.interactive = false;

        //send ingame play event to the state machine
        const playEvent = new GameEvent("ingame", {
            name: "play"
        });
        GameStateMachine.instance.processEvent(playEvent);
    }

    protected addHowToPlayButton(container): void {
        this.buttons.howToPlay = new Button({
            name: "btnHowToPlay",
            x: 300,
            y: 1960 - 250,
            width: 200,
            resource: "btn_purple",
            hasLabel: true,
            label: "How to play?",
            fontColor: ColorsEnum.white
        });
        this.buttons.howToPlay.shapeContainer.scale.x = 0.8;
        this.buttons.howToPlay.changeLabelPosition(null, 23);
        container.addChild(this.buttons.howToPlay.shapeContainer);

        this.buttons.howToPlay.onClick(this.howToPlayBtnOnClick, this);
    }

    protected howToPlayBtnOnClick(event): void {
        event.stopPropagation();
        this.game.howToPlayPopup.appearWithAlpha();
    }

    protected addLeaderboardButton(container): void {
        this.buttons.leaderboard = new Button({
            name: "btnLeaderboard",
            x: 300,
            y: 2170 - 250,
            width: 200,
            resource: "btn_purple",
            hasLabel: true,
            label: "Leaderboard",
            fontColor: ColorsEnum.white
        });
        this.buttons.leaderboard.shapeContainer.scale.x = 0.8;
        this.buttons.leaderboard.changeLabelPosition(null, 23);
        container.addChild(this.buttons.leaderboard.shapeContainer);

        this.buttons.leaderboard.onClick(this.leaderboardBtnOnclick, this);
    }

    protected async leaderboardBtnOnclick(event): Promise < void > {
        event.stopPropagation();
        const leaders = await ApiServer.instance.getLeaders(5);
        this.game.leaderboardPopup.show(leaders);
    }

    protected addNextCharButton(container): void {
        this.buttons.nextChar = new Button({
            name: "btnNextChar",
            x: 890,
            y: 1136,
            resource: "arrow_right",
            hasLabel: false
        });

        this.buttons.nextChar.onClick(this.nextCharBtnOnClick, this);
        container.addChild(this.buttons.nextChar.shapeContainer);
    }

    protected nextCharBtnOnClick(event): void {
        event.stopPropagation();
        if (this.charactersSlider !== undefined && this.charactersSlider !== null) {
            this.charactersSlider.showNext();
        }
    }

    protected addPrevCharButton(container): void {
        this.buttons.prevChar = new Button({
            name: "btnPrevChar",
            x: 100,
            y: 1136,
            resource: "arrow_left",
            hasLabel: false
        });

        this.buttons.prevChar.onClick(this.prevCharBtnOnClick, this);
        container.addChild(this.buttons.prevChar.shapeContainer);

    }

    protected prevCharBtnOnClick(event): void {
        event.stopPropagation();
        if (this.charactersSlider !== undefined && this.charactersSlider !== null) {
            this.charactersSlider.showPrevious();
        }
    }

    /*________________________Characters slider__________________*/
    protected addCharactersSlider(container): void {
        let charsList = this.game.animatedCharsList;
        this.charactersSlider = new HorizontalCharsSlideManager({
            mainApp: this.game.app,
            width: this.game.width,
            height: 700,
            nHorizontal: 1,
            nVertical: 1,
            elements: charsList
        });
        this.charactersSlider.setPosition(0, 0);
        this.charactersSlider.addToContainer(container);
    }

    /*________________________Actions processing__________________*/
    public startSerachingForOpponent() {
        const playButton = this.buttons.play;
        playButton.changeLabelText("Searching for opponent...", {
            x: 70,
            y: 30
        });
        playButton.changeLabelFontSize(45);
    }

    public async prepareCharacters(){
        const opponentIndex = gameData.charsNames.indexOf(this.game.opponentPlayer.color);
        const currentCharIndex = this.charactersSlider.currentSlide - 1;
        await MyLoader.awaitLoadCompleted(this.game.gameplayLoader);
        this.game.setUpCharacters(currentCharIndex, opponentIndex);
    }
}