import Scene from '../Scene';
import Animation from '../Elements/Animation';
import QuestionFrame from '../Elements/QuestionFrame';
import FunctionsLib from '../Helpers/FunctionsLib';
import Button from '../Elements/Button';
import {
    ColorsEnum
} from '../Helpers/ColorsEnum';
import DataSource from '../Helpers/DataSource';
import {
    Container,
    Sprite
} from 'pixi.js';
import MyLoader from '../Helpers/MyLoader';
import {
    IQuestion
} from '../Server/Models';
import GameEvent from '../state/GameEvent';
import GameStateMachine from '../state/GameStateMachine';
import MultiplayerServer from '../Server/MultiplayerServer';

export default class QuestionScene extends Scene {

    private question: IQuestion;
    private bg_animation: Animation;
    private resultPopups;
    private questionContainer: Container;
    private questionFrame: QuestionFrame;
    private answerBtns: Array < Button > ;
    private playerAnswerIndex: number = -1;
    private opponentAnswerIndex: number = -1;
    private popupBtnsDisabled: boolean;

    constructor(options) {
        super(options);
    }

    //defines and initializes all properties of a scene
    protected initializeScene(options: any): void {
        this.question = options.question;
        this.bg_animation = null;
        //result popups:
        this.resultPopups = {};
        this.resultPopups.Win = null;
        this.resultPopups.Lose = null;
        this.resultPopups.Draw = null;
        this.questionContainer = null;
        this.questionFrame = null;

        //displaying character if it was hidden
        this.game.character.displayOnScene(true);
    }

    //adds all elements on scene
    //takes PIXI container to store all elements
    //returns nothing
    //has to be implemented in child classes
    protected addSpecificElements(container: Container): void {
        //background animation:
        this.addBackgroundAnimation(container);
        this.displayQuestion(container);
    }

    private addBackgroundAnimation(container: Container): void {
        this.bg_animation = new Animation({
            name: "Trivia_gameplay_animation_background",
            resourceName: "main_bg_animation",
            x: 566,
            y: 1217,
            zOrder: 5
        });
        this.bg_animation.createAnimation();
        this.bg_animation.setAnimationByFullName("Trivia_gameplay_animation_background");
        container.addChild(this.bg_animation.animation);
    }

    private displayQuestion(container: Container): void {
        //topics container
        this.questionContainer = new Container();
        this.questionContainer.name = "questionContainer";
        const element = new Sprite(MyLoader.getResource("topics_bg_part").texture);
        element.name = "topics_bg_part";
        element.x = 0;
        element.y = 0;
        this.questionContainer.addChild(element);
        this.questionContainer.y = 1327;
        ( < any > this.questionContainer).zOrder = 1;

        //add question frame
        this.questionFrame = new QuestionFrame({
            name: "questionFrame",
            x: 110,
            y: 110,
            hasLabel: true,
            label: this.question.text,
            fontSize: 45,
            wordWrap: true,
            wordWrapWidth: 800,
            resource: "question_frame"
        });

        this.questionContainer.addChild(this.questionFrame.shapeContainer);

        //add answer variants:
        this.answerBtns = [];
        for (let i = 0; i < this.question.answers.length; i++) {
            const answerButton = new Button({
                name: "answerBtn" + i,
                hasLabel: true,
                label: this.question.answers[i].text,
                fontSize: 35,
                resource: "question_btn"
            });

            answerButton.onClick(this.processPlayersAnswer, this);
            this.answerBtns.push(answerButton);
            this.questionContainer.addChild(answerButton.shapeContainer);
        }

        this.answerBtns[0].shapeContainer.position.set(110, 475);
        this.answerBtns[1].shapeContainer.position.set(575, 475);
        this.answerBtns[2].shapeContainer.position.set(110, 625);
        this.answerBtns[3].shapeContainer.position.set(575, 625);

        container.addChild(this.questionContainer);
        FunctionsLib.sortContainerChildren(container);

    }

    private async processPlayersAnswer(event): Promise < void > {
        event.stopPropagation();
        const btn: Container = event.target; //btn pushed
        let answerIndex: number = -1;
        for (let i = 0; i < this.answerBtns.length; i++) {
            if (this.answerBtns[i].shapeContainer === btn) {
                answerIndex = i;
                break;
            }
        }
        console.log(answerIndex);
        if (answerIndex !== -1) //button found
        {
            this.playerAnswerIndex = answerIndex;
            const playerAnswerEvent = new GameEvent("ingame", {
                name: "answerIndex",
                index: answerIndex
            });
            GameStateMachine.instance.processEvent(playerAnswerEvent);

            //change button color:
            this.answerBtns[answerIndex].changeTexture("question_btn_active");
            //disable all buttons:
            for (let i = 0; i < this.answerBtns.length; i++) {
                this.answerBtns[i].removeAllListeners();
            }
            //change opponent character if it is Mystery
            if (this.game.opponentPlayer.character.name === "Mystery") {
                this.game.changeOpponentCharacterByIndex(0); //get default red character     
            }

            this.checkGameCompleted();
        }
    }

    public processOpponentAnswer(answerIndex) {
        this.opponentAnswerIndex = answerIndex;
        //change button color:
        this.answerBtns[answerIndex].changeTexture("question_btn_active_opponent");
        this.checkGameCompleted();
    }

    public async checkGameCompleted() {
        if (this.playerAnswerIndex > -1 && this.opponentAnswerIndex > -1) { //both answers got
            let isPlayerWin: boolean = this.question.answers[this.playerAnswerIndex].isCorrect;
            let isOpponentWin: boolean = this.question.answers[this.opponentAnswerIndex].isCorrect;
            DataSource.sendOpponentState(isOpponentWin);
            //animations names:
            const charHappy = this.game.character.animationsList.happy;
            const charSad = this.game.character.animationsList.sad;
            const charIdle = this.game.character.animationsList.idle_gameplay;

            const opponentHappy = this.game.opponentPlayer.character.animationsList.happy;
            const opponentSad = this.game.opponentPlayer.character.animationsList.sad;
            const opponentIdle = this.game.opponentPlayer.character.animationsList.idle_gameplay;

            //show player's char reaction:
            if (isPlayerWin) {
                this.game.character.showTwoLoops(charHappy, charIdle);
            } else {
                this.game.character.showTwoLoops(charSad, charIdle);
            }

            //show opponent's char reaction:
            if (isOpponentWin) {
                this.game.opponentPlayer.character.showTwoLoops(opponentHappy, opponentIdle);
            } else {
                this.game.opponentPlayer.character.showTwoLoops(opponentSad, opponentIdle);
            }
            await FunctionsLib.timeout(4000);

            //show result on popup:
            if (isPlayerWin && isOpponentWin) //draw
            {
                this.game.player.getMoney(10); //TODO: change draw win sum
                this.showDrawPopup();
            } else if (isPlayerWin) //player wins
            {
                this.game.player.getMoney(100); //TODO: change win sum
                this.showWinPopup(isOpponentWin);
            } else if (!isPlayerWin) //player lose
            {
                this.showLosePopup(isOpponentWin);
            }
            const gameCompletedEvent = new GameEvent("ingame", {
                name: "gameCompleted"
            });
            GameStateMachine.instance.processEvent(gameCompletedEvent);
        }
    }

    private showDrawPopup(): void {
        console.log("DRAW POPUP");
        this.resultPopups.Draw = new Animation({
            name: "draw_popup",
            width: this.game.width,
            height: this.game.height,
            x: 566,
            y: this.game.screenHeight === this.game.height ? 1217 : 1385,
            zOrder: 101,
            resourceName: "draw_popup"
        });
        this.resultPopups.Draw.createAnimation();
        this.setUpPopupData(this.resultPopups.Draw, true, true, "DRAW", {
            playerAva: 5,
            opponentAva: 6,
            resultFrame: 9,
            exitBtn: 1,
            playAgain: 3,
            playerName: 2,
            opponentName: 2
        });
        //show popup:
        this.resultPopups.Draw.setAnimationByFullName("animation_open", false);
        this.game.addChild(this.resultPopups.Draw.animation);
    }

    private showWinPopup(isOpponentWin: boolean): void {
        console.log("WIN POPUP");
        this.resultPopups.Win = new Animation({
            name: "win_popup",
            width: this.game.width,
            height: this.game.height,
            x: 566,
            y: this.game.screenHeight === this.game.height ? 1217 : 1385,
            zOrder: 101,
            resourceName: "win_popup"
        });
        this.resultPopups.Win.createAnimation();
        this.setUpPopupData(this.resultPopups.Win, true, isOpponentWin, this.game.player.name.toUpperCase() + " WINS", {
            playerAva: 5,
            opponentAva: 6,
            resultFrame: 10,
            exitBtn: 1,
            playAgain: 3,
            playerName: 2,
            opponentName: 2
        });
        this.resultPopups.Win.setAnimationByFullName("animation_open", false);
        this.game.addChild(this.resultPopups.Win.animation);
    }

    private showLosePopup(isOpponentWin: boolean): void {
        console.log("LOSE POPUP");
        this.resultPopups.Lose = new Animation({
            name: "lose_popup",
            width: this.game.width,
            height: this.game.height,
            x: 566,
            y: this.game.screenHeight === this.game.height ? 1217 : 1385,
            zOrder: 101,
            resourceName: "lose_popup"
        });
        this.resultPopups.Lose.createAnimation();
        this.setUpPopupData(this.resultPopups.Lose, false, isOpponentWin, this.game.player.name.toUpperCase() + " LOSE", {
            playerAva: 5,
            opponentAva: 6,
            resultFrame: 14,
            exitBtn: 1,
            playAgain: 3,
            playerName: 2,
            opponentName: 2
        });
        this.resultPopups.Lose.setAnimationByFullName("animation_open", false);
        this.game.addChild(this.resultPopups.Lose.animation);
    }

    //type is a string "win", "lose" or "draw"
    private setUpPopupData(popup: Animation, isPlayerWin: boolean, isOpponentWin: boolean, resultText: string, containers): void {
        //define avatars' resources:
        const playerAva = isPlayerWin ? `${this.game.character.name}Avatar` : `${this.game.character.name}AvatarLose`;
        const opponentAva = isOpponentWin ? `${this.game.opponentCharacter ? this.game.opponentCharacter.name : "Red"}Avatar` :
            `${this.game.opponentCharacter ? this.game.opponentCharacter.name : "Red"}AvatarLose`;
        //setting up popup data:
        popup.changeElementTexture(containers.playerAva, playerAva);
        popup.changeElementTexture(containers.opponentAva, opponentAva);
        //draw frame
        popup.addText(containers.resultFrame, {
            label: resultText,
            fontSize: 90,
            fontColor: ColorsEnum.white,
            borderMinX: -215,
            borderMaxX: 633,
            y: 40
        });
        //pink exit button
        popup.addText(containers.exitBtn, {
            label: "Exit",
            fontSize: 50,
            fontColor: ColorsEnum.white,
            borderMinX: -240,
            borderMaxX: 478,
            y: 30
        });
        popup.addEventListenerToSpineChild(containers.exitBtn, "pointerdown", this.exitBtnOnClick, this);
        popup.addEventListenerToSpineChild(containers.exitBtn, "touchstart", this.exitBtnOnClick, this);

        //purple play again button
        popup.addText(containers.playAgain, {
            label: "Play again for 10",
            fontSize: 50,
            fontColor: ColorsEnum.white,
            x: -100,
            y: 28
        });
        popup.addEventListenerToSpineChild(containers.playAgain, "pointerdown", this.playAgainBtnOnClick, this);
        popup.addEventListenerToSpineChild(containers.playAgain, "touchstart", this.playAgainBtnOnClick, this);

        //player name
        popup.addText(containers.playerName, {
            label: "Me", //this.game.player.name,
            fontSize: 40,
            fontColor: ColorsEnum.darkPink,
            borderMinX: -300,
            borderMaxX: -16,
            y: -382
        });

        //opponent name
        popup.addText(containers.opponentName, {
            label: this.game.opponentPlayer.name,
            fontSize: 40,
            fontColor: ColorsEnum.darkPink,
            borderMinX: 30,
            borderMaxX: 316,
            y: -382
        });
    }

    private async playAgainBtnOnClick(event): Promise < void > {
        event.stopPropagation();
        //disable button to avoid multiple taps
        const btn = event.currentTarget;
        btn.interactive = false;
        
        const playAgainEvent = new GameEvent("ingame", {
            name: "playAgain"
        });
        GameStateMachine.instance.processEvent(playAgainEvent);
    }

    public async executePlayAgain():Promise<void>{
        if (!this.game.player.payBet()) {
            //show no money reaction 
            console.log("No money left");
            return;
        }
        this.hideAllPopups();
        await FunctionsLib.timeout(2700); //waiting for pop-up to close
        this.game.showScene(this.game.scenes.topicsScene);
        this.game.scenes.questionScene = null;
        this.game.destroyScene(this);
        this._destroyAllPopups();
    }

    private async exitBtnOnClick(event): Promise < void > {
        event.stopPropagation();
        //disable button to avoid multiple taps
        const btn = event.currentTarget;
        btn.interactive = false;

        const exitEvent = new GameEvent("ingame", {
            name: "exit"
        });
        GameStateMachine.instance.processEvent(exitEvent);
        MultiplayerServer.instance.leave();
    }

    public async executeExit(): Promise<void> {
        //exit to lobby or send exit to server
        this.hideAllPopups();
        await this._destroyAllPopups();
        this.game.gamesCounter = 0;
        this.game.playAgain(true);
    }

    public async hideAllPopups(): Promise < void > {
        for (let popupName in this.resultPopups) {
            if (this.resultPopups[popupName] !== null)
                this.resultPopups[popupName].setAnimationByFullName("animation_close", false);
        }
    }

    //destroy all popups after delay
    private async _destroyAllPopups(delay = 2500): Promise < void > {
        await FunctionsLib.timeout(delay); //waiting for pop-up to close
        for (let popupName in this.resultPopups) {
            if (this.resultPopups[popupName] !== null) {
                this.game.destroyChild(this.resultPopups[popupName].animation);
            }
        }
    }


}