import {Application, Sprite} from 'pixi.js';
import GameElement from '../SuperClasses/GameElement';
import {ColorsEnum} from '../Helpers/ColorsEnum';
import FunctionsLib from '../Helpers/FunctionsLib';
import MyLoader from '../Helpers/MyLoader';
import { gameSettings } from '../Helpers/GameSettings';


/*
Constructor of this class takes object with such fields:
name - name of the element container ("popup" is default)
x - horizontal position of element in px (0 is default)
y - vertical position of element in px (0 is default)
width - width of the element (0 is default)
height - height of the element (0 is default)
hasCloseIcon - boolean, indicates if there shoul be a close icon on popup (false is default)
closeIconResource - string with close icon resource name (empty string is default)
closeIconPosition - object with 'top' and 'right' fields ({top: 50, right: 50} is default)
app - PIXI app instance where popup will be used (required)
hasLabel - boolean, indicates if element has some label on it (false is default)
label - string, text of the label (empty string is default)
fontSize - font size for the label (22 is default)
fontColor -  font color for the label (brown is default)
fontFamily -  font face for the label (gameSettings.font is default)
hiddenOnStart - boolean, indicates if popup should be hidden on init (true is default)
hidePosition - where will popup appear from ('top' or 'bottom'; 'bottom' is default)
maxHeight - height of the game field (required)
iterations - total number of moving iterations to show or hide popup (80 is default)
*/

export default class Popup extends GameElement {
    protected iterations: number;
    protected app: Application;
    protected hidePosition: string;
    protected hasCloseIcon: boolean;
    protected closeIconResource: string;
    protected closeIconPosition: any;
    protected closeIcon: Sprite;
    protected hiddenOnStart: boolean;
    protected maxHeight: number;
    protected onHiddenDown: Function;
    protected visible: boolean;

    constructor(options) {
        super({
            name: (options === undefined || options.name === undefined) ? "popup" : options.name,
            x: (options === undefined || options.x === undefined) ? 0 : options.x,
            y: (options === undefined || options.y === undefined) ? 0 : options.y,
            width: (options === undefined || options.width === undefined) ? 0 : options.width,
            height: (options === undefined || options.height === undefined) ? 0 : options.height,
            hasLabel: (options === undefined || options.hasLabel === undefined) ? false : options.hasLabel,
            label: (options === undefined || options.label === undefined) ? "" : options.label,
            fontSize: (options === undefined || options.fontSize === undefined) ? 60 : options.fontSize,
            fontColor: (options === undefined || options.fontColor === undefined) ? ColorsEnum.blue : options.fontColor,
            fontFamily: (options === undefined || options.fontFamily === undefined) ? gameSettings.font : options.fontFamily,
            resource:  (options === undefined || options.resource === undefined) ? null : options.resource   
        });
        this.iterations = (options === undefined || options.iterations === undefined) ? 80 : options.iterations,
        this.app = options.app;

        this.hidePosition = (options === undefined || options.hidePosition === undefined) ? "bottom" : options.hidePosition;
        (<any>this.shapeContainer).zOrder = 200; //always on top
        this.hasCloseIcon = (options === undefined || options.hasCloseIcon === undefined) ? false : options.hasCloseIcon;
        this.closeIconResource = (options === undefined || options.closeIconResource === undefined) ? "" : options.closeIconResource;
        this.closeIconPosition  = (options === undefined || options.closeIconPosition === undefined) ? {top: 50, right: 50} : options.closeIconPosition; 
        if (this.hasCloseIcon) {
            this.closeIcon = this.addCloseIcon();
        }
        this.hiddenOnStart = (options === undefined || options.hiddenOnStart === undefined) ? true : options.hiddenOnStart;
        this.maxHeight = options.maxHeight;
        this.onHiddenDown = null; //callback for popup hidden event

        if(this.hiddenOnStart) //hidden by default
            {
                this.hide(); 
                this.visible = false;
            }
        else{
            this.visible = true;
        }
        console.log(`max height ${this.name}: ${this.maxHeight}`);
    }

    //overrides parent method
    //takes resource name to get texture (enabled button texture by default)
    //returns sprite
    protected createShape() : Sprite {
        let shape = new Sprite(MyLoader.getResource(this.resource).texture);
        shape.name = "popupbg";
        this.width = shape.width;
        this.height = shape.height;
        return shape;
    }

    private getCloseIcon() : Sprite {
        let shape = new Sprite(MyLoader.getResource(this.closeIconResource).texture);
        shape.name = "close_icon";
        shape.x = this.width - shape.width - this.closeIconPosition.right;
        shape.y = this.closeIconPosition.top;
        (<any>shape).zOrder = 201;
        return shape;
    }

    private addCloseIcon() : Sprite {
        const closeIcon : Sprite = this.getCloseIcon();
        this.shapeContainer.addChild(closeIcon);
        FunctionsLib.sortContainerChildren(this.shapeContainer);
        closeIcon.interactive = true;
        (<any>closeIcon).zOrder = 300; //always on top
        closeIcon.on("pointerdown", this.closeIconCallback.bind(this));
        closeIcon.on("touchstart", this.closeIconCallback.bind(this));
        return closeIcon;
    }

    private closeIconCallback(event) : void {
        if (event !== undefined) {
            event.stopPropagation();
        }
        this.down();
    }

    
    public changeCloseIconCallback(callback : Function) : void{
        const closeIcon = FunctionsLib.getContainerChildByName(this.shapeContainer, "close_icon");
        closeIcon.removeAllListeners(); 
        closeIcon.on("pointerdown", callback.bind(this));
        closeIcon.on("touchstart", callback.bind(this));
    }

    public hide() : void {
        if (this.hidePosition === "bottom")
            this.shapeContainer.y = this.maxHeight;
        else
            this.shapeContainer.y = -this.height;
        this.visible = false;
    }

    public up() : void {
        this.app.ticker.add(this.moveUp, this);
        this.visible = this.hidePosition === "bottom" ? true : false;
    }

    private moveUp() : void {
        const step : number = this.height / this.iterations;
        if (this.hidePosition === "bottom" && this.shapeContainer.y > this.y ||
            this.hidePosition === "top" && this.shapeContainer.y > -this.height) //container is still not on its place
        {
            this.shapeContainer.y -= step; //30
        } else //container has arrived on its place
        {
            this.app.ticker.remove(this.moveUp, this);
        }
    }

    public down() : void {
        this.app.ticker.add(this.moveDown, this);
        this.visible = this.hidePosition === "bottom" ? false : true;
    }

    private moveDown() : void {
        const step : number = this.height / this.iterations;
        if (this.hidePosition === "bottom" && this.shapeContainer.y < this.maxHeight ||
            this.hidePosition === "top" && this.shapeContainer.y < this.y) //container is still not on its place
        {
            this.shapeContainer.y += step;
        } else //container has arrived on his place
        {
            this.app.ticker.remove(this.moveDown, this);
            if (this.onHiddenDown !== null) {
                this.onHiddenDown();
            }
        }
    }

    public appearUp() : void {
        if (this.hidePosition === "bottom" ){
            this.shapeContainer.y = this.y; 
        }
        else if(this.hidePosition === "top"){
            this.shapeContainer.y = this.maxHeight;
        }
    }

    public appearDown() : void {
        if (this.hidePosition === "bottom" ){
            this.shapeContainer.y = this.maxHeight;
        }
        else if(this.hidePosition === "top"){
            this.shapeContainer.y = this.y; 
        }
    }

    public appearWithAlpha() : void {
        if(!this.visible){
            this.appearUp();
            this.fadeIn();
        }
    }

    public disappearWithAlpha() : void {
        this.fadeOut();
            setTimeout(()=>{
                this.appearDown();
            }, 1000); 
    }


    //changes the position of a label(if exists)
    //takes new x and y
    //returns void
    public changeLabelPosition(x : number, y : number) : void {
        if (this.hasLabel) {
            let label = FunctionsLib.getContainerChildByNameContains(this.shapeContainer, "label");
            if (label !== undefined) {
                label.x = x !== undefined && x !== null ? x : label.x;
                label.y = y !== undefined && y !== null ? y : label.y;
            }
        }
    }
}