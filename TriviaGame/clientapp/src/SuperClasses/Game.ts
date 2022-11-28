/// <reference path="../../node_modules/@types/webfontloader/index.d.ts" />
import * as WebFont  from "webfontloader";
import {Application, Container, Sprite} from 'pixi.js';
import FunctionsLib from '../Helpers/FunctionsLib';
import Scene from '../Scene';
import Character from '../Elements/Character';
import GameElement from './GameElement';
import Player from '../Player';

/*
Constructor of this class takes object with such fields:
player - instance of Player class, required
width - width of stage in px, required
height - height of stage in px, required
character -  instance of Character class, required
*/

export default abstract class Game {

    public gamesCounter: number;
    public player: Player;
    public width: number;
    public height: number;
    public app: Application;
    protected stage: Container;
    public character: Character;
    public screenWidth: number;
    public screenHeight: number;
    public mainContainer; //to place all other stage elements  
    public scenes;
    public currentScene: Scene;
    protected buttons: object;
    protected labels: object;
    protected isGameStarted: boolean;


    constructor(options) //params: Player instance, width and height of the play field
    {
        this.gamesCounter = 0;

        this.player = options.player;
        this.width = options.width;
        this.height = options.height;

        //declaration, has to be initialized in init() method
        this.app = null;
        this.stage = null;
        this.character = options.character;
        this.screenWidth = 0;
        this.screenHeight = 0;

        //declaration of a main containers 
        this.mainContainer = null; //to place all other stage elements  

        //object to store scenes:
        this.scenes = {};
        this.currentScene = null;

        //object to store buttons:
        this.buttons = {};
        //object to store labels:
        this.labels = {};
        //indicates if game is started
        this.isGameStarted = false;
    }


    //initial method to build everything to be ready to start game
    //no params
    //returns Promise
    public async init(): Promise < void > {

        this.app = new Application({
            width: this.width,
            height: this.height
        });
        this.defineScreenSize();
        document.body.appendChild(this.app.view);
        this.stage = this.app.stage;
        //loads character assets, creates character spine
        await this.addCharacter(this.stage);
        this.character.showPreloadAnimation();


        //load all assets
        await this.loadLobbyAssets();
        await this.getData();
        await this.loadFont(); 
        this.buildStage();
        this.character.displayOnScene(false);
        this.character.changeParent(this.stage, this.mainContainer);
        this.character.showMainAnimation();
        FunctionsLib.sortContainerChildren(this.mainContainer);

    }

    protected loadFont():Promise<void>{
        return new Promise(resolve => {
            //loading fonts
            WebFont.load({
                custom: {
                    families: ['MuseoSlab-900'],
                    urls: ['./main.css']
                },
                active: () => {
                    console.log("fonts loaded");
                    resolve();
                },
            });
        });
    }

    //defines client screen size for mobile view 
    protected defineScreenSize(): void {
        const clientWidth: number = document.documentElement.clientWidth;
        const clientHeight: number = window.innerHeight;
        const assetsProportion: number = this.height / this.width;
        const screenProportions: number = clientHeight / clientWidth;
        if (clientWidth <= 414 && Math.abs(assetsProportion - screenProportions) > 0.1) //proportions are different
        {
            this.screenHeight = this.width * screenProportions;
        } else {
            this.screenHeight = this.height;
        }
        this.screenWidth = this.width;
    }


    //removes all items from the stage and builds it from scratch
    //with the same Player account for now
    //takes bool flag to indicate if game has to be started immediately
    public async playAgain(start : boolean): Promise < void > {
        this.stage.removeChild(this.mainContainer);
        this.clearGameProperties();

        await this.getData();
        await this.buildStage();
        this.character.showMainAnimation();
        await this.addCharacter(this.mainContainer);
        FunctionsLib.sortContainerChildren(this.mainContainer);
        this.isGameStarted = false;
        if (start) {
            this.startGame();
        }
    }

    //has to be called in derived classes methods
    //parent method contains logic to implement a correct game loop
    //child methods has to contain all actions, that happens after game starts
    public async startGame(): Promise < void > {
        if (this.isGameStarted) {
            this.playAgain(true);
            return;
        }
    }


    //gets or calculates all data for current game
    //no params
    //returns void
    //has to be implemented in child class
    protected abstract getData(): void;

    //sets default empty values for all properties, defined in child class
    //no params
    //returns void
    //has to be implemented in child class
    protected abstract clearGameProperties(): void;

    //creates all play field elements and places them on the stage
    //no params
    //returns void
    //has to be called in override child method  
    protected async buildStage(): Promise < void > {
        //creating main container and placing it on the stage
        this.mainContainer = new Container();
        this.mainContainer.name = "mainContainer";
        this.mainContainer.position.set(0, 0);
        this.stage.addChild(this.mainContainer);

        //add game background
        this.addBackground();

        //add labels
        this.addLabels();

        //adding two buttons under cards field
        this.addButtons();
        this.gamesCounter++;
    }

    //creates (if not created yet) character and adds it on the stage
    //takes container for character (main container is default)
    public async addCharacter(parent): Promise < void > {
        parent = parent == undefined || parent == null ? this.mainContainer : parent;
        if (!this.character.isCreated())
            await this.character.createCharacterAsync();
        parent.addChild(this.character.animation);
    }

    //removes current character and adds a new one on the stage
    //takes new Character instance (required)
    public changeCharacter(newCharacter: Character): void {
        if (this.character !== null && this.character.isCreated()) {
            this.mainContainer.removeChild(this.character.animation);
        }
        if (newCharacter instanceof Character) {
            this.character = newCharacter;
            this.mainContainer.addChild(newCharacter.animation);
        }
    }

    //loads all assets
    //no params
    //returns Promise
    //has to be implemented in a child class
    protected abstract loadLobbyAssets(): Promise < object | void> ;

    public async showScene(scene: Scene): Promise < void > {
        //avoiding hidden scene events firing
        if (this.currentScene !== null) {
            this.currentScene.sceneContainer.interactive = false;
            this.currentScene.sceneContainer.interactiveChildren = false;
        }
        //change scene
        this.currentScene = scene;
        //set current scene interactive
        this.currentScene.sceneContainer.interactive = true;
        this.currentScene.sceneContainer.interactiveChildren = true;

        scene.sceneContainer.alpha = 0;
        //if this scene already exists in main container:
        if (!this.mainContainer.children.includes(scene.sceneContainer)) {
            this.mainContainer.addChild(scene.sceneContainer);
            FunctionsLib.sortContainerChildren(this.mainContainer);
            this.currentScene.fadeIn();
        }
        //hiding all scenes except scene from agrs
        for (const s in this.scenes) {
            if (this.scenes.hasOwnProperty(s)) {
                if (this.scenes[s] === scene)
                    await this.scenes[s].fadeIn();
                else if (this.scenes[s] !== null)
                    await this.scenes[s].fadeOut();
            }
        }
    }

    public destroyScene(scene: Scene) : void {
        if (this.mainContainer.children.includes(scene.sceneContainer)) {
            this.mainContainer.removeChild(scene.sceneContainer);
            FunctionsLib.sortContainerChildren(this.mainContainer);
        }
        for (let sceneName in this.scenes) {
            if (this.scenes[sceneName] === scene) {
                this.scenes[sceneName] = null;
                break;
            }
        }
    }

    public destroyGameElement(gameElement : GameElement) : void{
        if (this.mainContainer.children.includes(gameElement.shapeContainer)) {
            this.mainContainer.removeChild(gameElement.shapeContainer);
            FunctionsLib.sortContainerChildren(this.mainContainer);
        }
    }

    public destroyChild(child : any) : void {
        if (child !== null && this.mainContainer.children.includes(child)) {
            this.mainContainer.removeChild(child);
            FunctionsLib.sortContainerChildren(this.mainContainer);
        }
    }

    public addChild(child : Container | Sprite){
        this.mainContainer.addChild(child);
    }

    //sets a background sprite for a stage
    //no params
    //returns void
    //has to be implemented in a child class
    protected abstract addBackground() : void; 

    //adds all labels on the stage
    //no params
    //returns void
    //has to be implemented in a child class
    protected abstract addLabels() : void;

    //adds all buttons on the stage
    //no params
    //returns void
    //has to be implemented in a child class
    protected abstract addButtons() : void; 
}