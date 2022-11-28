import {Application, Container, Sprite, Graphics } from 'pixi.js';
import Swipeable from '../SuperClasses/Swipeable';
import {ColorsEnum} from '../Helpers/ColorsEnum';

/*
Constructor of this class takes object with such fields:
mainApp - PIXI app instance where slider will be used (required)
width - width of the element (0 is default)
height - height of the element (0 is default)
nHorizontal - number of elements to place horizontal on slider (2 is default)
nVertical - number of elements to place vertical on slider (3 is default)
elements - array of containers to show on slider (empty array is default)
*/

export default class HorizontalSlideManager extends Swipeable {
    protected app: Application;
    protected width: number;
    protected height: number;
    protected nHorizontal: number;
    protected nVertical: number;
    protected elements: Array<Container|Sprite>;
    protected slidesTotal: number;
    protected _currentSlide: number;
    protected marginTop: number;
    protected marginLeft: number;
    protected spaceVertical: number;
    protected spaceHorizontal: number;
    protected totalContainerWidth: number;
    protected slideContainer: Container;
    protected allSlides:  Array<Container|Sprite>;
    protected containerPrev: Container;
    protected containerCurrent: Container;
    protected containerNext: Container;
    protected stepsCounter: number;
    
    constructor(options) {
        super();
        this.app = options.mainApp;
        this.width = (options === undefined || options.width === undefined) ? 0 : options.width; //total width of slide manager (its visible part)
        this.height = (options === undefined || options.height === undefined) ? 0 : options.height; //total width of slide manager (its visible part)
        this.nHorizontal = (options === undefined || options.nHorizontal === undefined) ? 2 : options.nHorizontal; //number of items columns per slide
        this.nVertical = (options === undefined || options.nVertical === undefined) ? 3 : options.nVertical; //number of items rows per slide
        this.elements = (options === undefined || options.elements === undefined) ? [] : options.elements; //array of pixi elements to show on slide
        //total amount of slides:
        this.slidesTotal = Math.ceil(this.elements.length / (this.nVertical * this.nHorizontal));
        this._currentSlide = 1; //current slide number

        this.marginTop =940;
        this.marginLeft = 570;
        this.spaceVertical = 5;
        this.spaceHorizontal = 5;

        this.totalContainerWidth = this.width * this.slidesTotal;

        this.slideContainer = this.createShapeContainer();
        (<any>this.slideContainer).zOrder = 201; //always on top

        this.allSlides = this.prepareAllSlides();

        this.containerPrev = null;
        this.containerCurrent = null;
        this.containerNext = null;
        this.initSlider(); //places first three slides on slider to create carousel

        this.stepsCounter = 0;

        this.makeSwipeable(this.slideContainer);
        this.addSwipeLeftListener(this.showNext.bind(this));
        this.addSwipeRightListener(this.showPrevious.bind(this));
    }

    public get currentSlide() : number {
		return this._currentSlide;
	}


    protected createShapeContainer() : Container {
        const slideContainer = new Container();
        slideContainer.width = this.width;
        slideContainer.height = this.height;
        slideContainer.name = "slider";

        const grTransparentBackground = new Graphics();
        grTransparentBackground.beginFill(<any>ColorsEnum.white); //any color - sprite will have opacity 0
        grTransparentBackground.drawRect(0, 0, this.width, this.height - 35);
        grTransparentBackground.endFill();
        const textureTransparentBackground = grTransparentBackground.generateCanvasTexture();
        const transparentBackground = new Sprite(textureTransparentBackground);
        transparentBackground.width = this.width;
        transparentBackground.height = this.height;
        transparentBackground.x = 0;
        transparentBackground.y = 35;
        transparentBackground.alpha = 0;
        slideContainer.addChild(transparentBackground);
        return slideContainer;
    }

    protected prepareAllSlides() : Array<Container|Sprite> {
        const allSlides : Array<Container> = [];
        //creating containers for each slide and store them into array
        let elementsCounter : number = 0;
        for (let s = 0; s < this.slidesTotal; s++) { //each slide loop
            const container = new Container();
            container.width = this.width;
            container.height = this.height;
            container.x = 0;
            container.y = 0;
            let nextY = this.marginTop;
            let globalX = this.marginLeft;

            for (let i = 0; i < this.nVertical; i++) { //rows loop
                let maxHeight = 0;
                let nextX = globalX;
                for (let j = 0; j < this.nHorizontal && elementsCounter < this.elements.length; j++) { //columns loop
                    const element = this.elements[elementsCounter];
                    maxHeight = element.height > maxHeight ? element.height : maxHeight;
                    element.y = nextY;
                    element.x = nextX;
                    nextX += element.width + this.spaceHorizontal;
                    container.addChild(element);
                    elementsCounter++;
                }
                nextY += maxHeight + this.spaceVertical;
            }
            allSlides.push(container);
        }
        return allSlides;
    }

    public initSlider() : void {
        this._currentSlide = 1;
        this.setCurrent(1); //first slide
    }

    public setCurrent(slideNumber: number) : void {
        const index = slideNumber - 1;
        const indexPrev = (index === 0) ? this.slidesTotal - 1 : index - 1;
        const indexNext = (index === this.slidesTotal - 1) ? 0 : index + 1;

        if (this.containerCurrent !== null) {
            this.slideContainer.removeChild(this.containerCurrent);
        }
        if (this.containerPrev !== null) {
            this.slideContainer.removeChild(this.containerPrev);
        }
        if (this.containerNext !== null) {
            this.slideContainer.removeChild(this.containerNext);
        }

        this.containerCurrent = this.allSlides[index];
        //this.containerCurrent.x = 0;
        this.slideContainer.addChild(this.containerCurrent);

        this.containerPrev = this.allSlides[indexPrev];
        this.containerPrev.x = -this.width;
        this.slideContainer.addChild(this.containerPrev);

        this.containerNext = this.allSlides[indexNext];
        this.containerNext.x = this.width;
        this.slideContainer.addChild(this.containerNext);
    }

    public setPosition(x: number, y: number): void{
        this.slideContainer.y = y;
        this.slideContainer.x = x;
    }

    public addToContainer(container : Container) :void {
        container.addChild(this.slideContainer);
    }

    public showNext() : void {
        this.app.ticker.add(this.moveLeft, this);
    }

    public showPrevious() : void {
        this.app.ticker.add(this.moveRight, this);
    }

    public moveToFirst() : void {
        this.initSlider();
    }

    protected moveRight() : void {
        if (this.stepsCounter < (this.width - this.spaceHorizontal)) {
            const step = (this.width - this.spaceHorizontal) / 15;
            this.containerCurrent.x += step;
            this.containerPrev.x += step;
            this.stepsCounter += step;
        } else {
            this.app.ticker.remove(this.moveRight, this);
            this.stepsCounter = 0;
            this._currentSlide =  (this.currentSlide === 1) ? this.slidesTotal : --this._currentSlide;
            console.log("Current slide" + this.currentSlide);
            this.containerCurrent = this.allSlides[this.currentSlide - 1];
            this.setCurrent(this.currentSlide);
        }
    }

    protected moveLeft() : void {
        if (this.stepsCounter < (this.width - this.spaceHorizontal)) {
            const step = (this.width - this.spaceHorizontal) / 15;
            this.containerCurrent.x -= step;
            this.containerNext.x -= step;
            this.stepsCounter += step;
        } else {
            this.app.ticker.remove(this.moveLeft, this);
            this.stepsCounter = 0;
            this._currentSlide = (this.currentSlide === this.slidesTotal) ? 1 : ++this._currentSlide;
            console.log("Current slide" + this.currentSlide);
            this.setCurrent(this.currentSlide);
        }
    }
}