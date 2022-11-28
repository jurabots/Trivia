/*
Super class for all scenes

constructor of this class takes such params:
game - reference to main game object (required)
name - name of scene
*/

import FunctionsLib from './Helpers/FunctionsLib';
import Game from './SuperClasses/Game';
import TriviaGame from './TriviaGame';
import {Container} from 'pixi.js';

export default abstract class Scene{

    protected game: TriviaGame;
    protected _name: string;
    protected _sceneContainer: Container;

    constructor(options) {
        this.game = options.game;
        this.name = options.name;
        this.initializeScene(options);
        this.sceneContainer = this.buildScene();
    }

    /*_______________GETTERS AND SETTERS_____________ */
    public get name(): string {
		return this._name;
	}

	public set name(value: string) {
		this._name = value;
	}

    public get sceneContainer(): Container {
		return this._sceneContainer;
	}

	public set sceneContainer(value: Container) {
		this._sceneContainer = value;
	}

    //returns container with scene
    protected buildScene() : Container{
        const container = new Container();
        container.name = this.name + "Container";
        container.position.set(0, 0);
        (<any>container).zOrder = 5;
        this.addSpecificElements(container); //child class implementation
        return container;
    }

    //defines and initializes all properties of a scene
    //takes nothing
    //returns nothing
    //has to be implemented in child classes
    protected abstract initializeScene(options);

    //adds all elements on scene
    //takes PIXI container to store all elements
    //returns nothing
    //has to be implemented in child classes
    protected abstract addSpecificElements(container);

    public showScene(): void{
        this.game.showScene(this);
    }

    public destroyScene(): void{
        this.game.destroyScene(this);
    }

    //hides element with alpha
    //no params
    //returns void
    public setInvisible(): void {
        this.sceneContainer.visible = false;
    }

    //shows element with alpha
    //no params
    //returns void
    public setVisible(): void {
        this.sceneContainer.visible = true;
    }

    //shows element slowly with alpha
    //takes step of opacity changing
    //returns void
    public async fadeIn(step = 0.1) : Promise<void>{
        while (this.sceneContainer.alpha < 1) {
            this.sceneContainer.alpha += step;
            await FunctionsLib.timeout(50);
        }
        this.sceneContainer.alpha = 1;
    }

    //hides element slowly with alpha
    //takes step of opacity changing
    //returns void
    public async fadeOut(step = 0.1) : Promise<void> {
        while (this.sceneContainer.alpha > 0) {
            this.sceneContainer.alpha -= step;
            await FunctionsLib.timeout(50);
        }
    }
}