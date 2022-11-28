import Scene from '../Scene';
import Animation from '../Elements/Animation';
import FunctionsLib from '../Helpers/FunctionsLib';
import ScrollContainer from '../Elements/ScrollContainer';
import QuestionScene from './QuestionScene';
import {
    Container,
    Sprite
} from 'pixi.js';
import MyLoader from '../Helpers/MyLoader';
import ApiServer from '../Server/ApiServer';
import {
    TextStyle
} from 'pixi.js';
import GameEvent from '../state/GameEvent';
import GameStateMachine from '../state/GameStateMachine';

export default class TopicsScene extends Scene {

    private bg_animation: Animation;
    private topicsBtns: Array < Animation > ;
    private topics = [];
    private topicSelectedIndex: number;
    private topicSelectedCounter: number;
    private topicsListContainer: Container;
    private scrollContainer: ScrollContainer;
    private scrollLineHeight: number;
    private thumb: Sprite;

    constructor(options) {
        super(options);
    }

    //defines and initializes all properties of a scene
    protected initializeScene(options: any): void {
        this.bg_animation = null;
        this.topicsBtns = [];
        this.topics = [];
        this.topicSelectedIndex = null;
        this.topicSelectedCounter = 0;
        this.topicsListContainer = null;
        this.scrollContainer = null;
        this.scrollLineHeight = 0;
        this.thumb = null;

        //displaying character if it was hidden
        this.game.character.displayOnScene(true);
    }

    //adds all elements on scene
    //takes PIXI container to store all elements
    //returns nothing
    protected addSpecificElements(container: any): void {
        //background animation:
        this.addBackgroundAnimation(container);
        if (this.game.player.isGameOrganizer) {
            console.log(`Game organizer ${JSON.stringify(this.game.player)}`);
            this.addTopicsList(container);
        } else {
            this.addWaitingOpponentText(container);
            console.log(`Not a game organizer ${JSON.stringify(this.game.player)}`);
        }
    }


    private addBackgroundAnimation(container): void {
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

    private addWaitingOpponentText(container) {
        this.addTopicsBg(container);
        const style = new TextStyle({
            align: "center",
            fill: "white",
            fontFamily: "MuseoSlab-900",
            fontSize: 50,
            stroke: "white",
            wordWrap: true,
            wordWrapWidth: 800
        });
        container.addChild(this.topicsListContainer);
        const text = new PIXI.Text('Waiting until your opponent selects a topic...', style);
        text.x = (this.game.width - text.width) / 2;
        text.y = 350;
        this.topicsListContainer.addChild(text);
        FunctionsLib.sortContainerChildren(container);
    }

    private addScrollLine(container): void {
        const scrollLine = new Sprite(MyLoader.getResource("scroll_line").texture);
        scrollLine.name = "scrollLine";
        scrollLine.position.set(975, 195);
        this.scrollLineHeight = scrollLine.height;
        container.addChild(scrollLine);

        this.thumb = new Sprite(MyLoader.getResource("scroll_thumb").texture);
        this.thumb.name = "thumb";
        this.thumb.position.set(957, 195);
        container.addChild(this.thumb);
    }

    private async addTopicsList(container): Promise < void > {
        //topics container
        this.addTopicsBg(container);

        this.addScrollLine(this.topicsListContainer);

        this.topics = await ApiServer.instance.getCategories(); //await DataSource.getAllTopics();
        console.log(this.topics);

        //creating scroll container
        this.scrollContainer = new ScrollContainer({
            width: 900,
            height: 800,
            outerX: 0,
            outerY: 64,
            itemHeight: 185,
            thumb: this.thumb,
            scrollLineHeight: this.scrollLineHeight,
            sceneContainer: this.sceneContainer
        });
        //creating topics buttons and pushing them into scroll container
        for (let i = 0; i < this.topics.length; i++) {
            let topicBtn = new Animation({
                name: "topic" + i,
                resourceName: "btn_off_animation",
                width: 700,
                height: 131,
                x: 560,
                y: 150 + i * (131 + 50)
            });

            topicBtn.createAnimation();
            topicBtn.animation.interactive = true;
            topicBtn.setAnimationByFullName("Trivia_gameplay_animation_btn_off", false);
            //add label
            const txt = topicBtn.addText(-1, {
                label: this.topics[i].name,
                borderMinX: -327,
                borderMaxX: 293,
                y: -38
            });

            //add eventListener
            topicBtn.addEventListener("pointerdown", this.topicBtnOnClick, this);
            topicBtn.addEventListener("touchstart", this.topicBtnOnClick, this);

            topicBtn.addEventListener("mouseup", this.topicBtnOnMouseUp, this);
            topicBtn.addEventListener("touchend", this.topicBtnOnMouseUp, this);

            this.topicsBtns.push(topicBtn);
            this.scrollContainer.addItemToContainer(topicBtn.animation);
            this.scrollContainer.addItemToArray(topicBtn);
        }

        this.scrollContainer.addToContainer(this.topicsListContainer);
        this.scrollContainer.hideOffscreenElements();

        //adding scroll container on the scene
        container.addChild(this.topicsListContainer);
        FunctionsLib.sortContainerChildren(container);
    }

    private addTopicsBg(container) {
        this.topicsListContainer = new Container();
        this.topicsListContainer.name = "topicsListContainer";
        const element = new Sprite(MyLoader.getResource("topics_bg_part").texture);
        element.name = "topics_bg_part";
        element.x = 0;
        element.y = 0;
        this.topicsListContainer.addChild(element);
        this.topicsListContainer.y = 1315;
        ( < any > this.topicsListContainer).zOrder = 1;
    }

    private async topicBtnOnClick(event): Promise < void > {
        const btn = event.target;
        let btnIndex = -1;
        for (let i = 0; i < this.topicsBtns.length; i++) {
            if (this.topicsBtns[i].animation === btn) //clicked button found
            {
                btnIndex = i;
                break;
            }
        }
        if (btnIndex !== -1) //button found
        {
            if (this.topicSelectedIndex !== btnIndex) { //first click
                this.topicSelectedIndex = btnIndex;
                this.topicSelectedCounter = event.type === "pointerdown" ? 2 :
                    event.type === "touchstart" ? 1 : 0;
            } else {
                this.topicSelectedCounter = event.type === "pointerdown" ? this.topicSelectedCounter + 2 :
                    event.type === "touchstart" ? this.topicSelectedCounter + 1 : this.topicSelectedCounter;
            }
        }
    }

    private async topicBtnOnMouseUp(event) {
        const btn = event.target;
        let btnIndex = -1;
        for (let i = 0; i < this.topicsBtns.length; i++) {
            if (this.topicsBtns[i].animation === btn) //clicked button found
            {
                btnIndex = i;
                break;
            }
        }
        if (btnIndex !== -1) //button found
        {
            if (this.topicSelectedIndex === btnIndex) { //the same button clicked
                if (this.topicSelectedCounter >= 4) { //selection confirmed
                    this.setAllButtonsEnabled(false);
                    const topicSelected = this.topics[this.topicSelectedIndex];
                    //invoke event with selected topic information
                    const topicGameEvent = new GameEvent("ingame", {
                        name: "topicSelected",
                        topic: topicSelected
                    });
                    GameStateMachine.instance.processEvent(topicGameEvent);

                    const question = await ApiServer.instance.getQuestion(topicSelected.id); //await DataSource.getQuestion(this.topicSelectedIndex);
                    //invoke event with generated question information
                    const questionGameEvent = new GameEvent("ingame", {
                        name: "questionGot",
                        question: question
                    });
                    GameStateMachine.instance.processEvent(questionGameEvent);

                    console.log(question);
                    if (this.game.scenes.questionScene !== null)
                        this.game.destroyScene(this.game.scenes.questionScene);
                    this.game.scenes.questionScene = new QuestionScene({
                        game: this.game,
                        name: "questionsScene",
                        question: question
                    });
                    this.game.showScene(this.game.scenes.questionScene);
                    await FunctionsLib.timeout(1000);
                    this.setAllButtonsSelected(false);
                    this.setAllButtonsEnabled(true);
                } else { //selection was not confirmed yet
                    this.setAllButtonsSelected(false);
                    this.setButtonSelected(btnIndex, true);
                }
            }
        }
    }

    private setAllButtonsEnabled(isEnabled: boolean): void {
        for (let i = 0; i < this.topicsBtns.length; i++) {
            this.topicsBtns[i].animation.interactive = isEnabled;
        }
    }

    private setAllButtonsSelected(isSelected: boolean): void {
        for (let i = 0; i < this.topicsBtns.length; i++) {
            if (isSelected) {
                this.topicsBtns[i].setAnimationByFullName("Trivia_gameplay_animation_btn_on", false);
            } else {
                this.topicsBtns[i].setAnimationByFullName("Trivia_gameplay_animation_btn_off", false);
            }
        }
    }

    private setButtonSelected(index: number, isSelected: boolean): void {
        if (isSelected) {
            this.topicsBtns[index].setAnimationByFullName("Trivia_gameplay_animation_btn_on", false);
        } else {
            this.topicsBtns[index].setAnimationByFullName("Trivia_gameplay_animation_btn_off", false);
        }
    }
}