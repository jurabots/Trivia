import {Container, Text, Sprite} from 'pixi.js';
import {
    ColorsEnum
} from '../Helpers/ColorsEnum';
import FunctionsLib from '../Helpers/FunctionsLib';
import { gameSettings } from '../Helpers/GameSettings';

/*
Constructor of this class takes object with such fields:
name - name of the element container ("card" is default)
x - horizontal position of element in px (0 is default)
y - vertical position of element in px (0 is default)
width - width of the element (0 is default)
height - height of the element (0 is default)
hasLabel - boolean, indicates if element has some label on it (false is default)
label - string, text of the label (empty string is default)
fontSize - font size for the label (22 is default)
fontColor -  font color for the label (brown is default)
fontFamily -  font face for the label ("MuseoSlab-900" is default)
wordWrap - boolean, indicates if text should be wrapped
wordWrapWidth - number, max width to start wrapping text
resource - resource name for sprite
*/

//parent class for all game (UI) elements
export default abstract class GameElement {

    public name: string;
    public x: number;
    public y: number;
    public width: number;
    public height: number;
    public color: string;
    public resource: string;
    public hasLabel: boolean;
    public label: string;
    public fontSize: number;
    public fontColor: string;
    public fontFamily: string;
    public wordWrap: boolean;
    public wordWrapWidth: number;
    public shapeContainer: Container;
    public textElement: Text;



    constructor(options) {
        this.name = (options === undefined || options.name === undefined) ? "card" : options.name; //container name
        this.x = (options === undefined || options.x === undefined) ? 0 : options.x;
        this.y = (options === undefined || options.y === undefined) ? 0 : options.y;

        //display settings - for prototype only:
        this.width = (options === undefined || options.width === undefined) ? 0 : options.width;
        this.height = (options === undefined || options.height === undefined) ? 0 : options.height;
        this.color = ColorsEnum.white; //default color
        this.resource = (options === undefined || options.resource === undefined) ? null : options.resource;

        //text label data:
        this.hasLabel = (options === undefined || options.hasLabel === undefined) ? false : options.hasLabel; //flag to indicate, does element have some text title or not
        this.label = (options === undefined || options.label === undefined) ? "" : options.label;
        this.fontSize = (options === undefined || options.fontSize === undefined) ? 22 : options.fontSize;
        this.fontColor = (options === undefined || options.fontColor === undefined) ? ColorsEnum.brown : options.fontColor;
        this.fontFamily = (options === undefined || options.fontFamily === undefined) ? gameSettings.font : options.fontFamily;
        this.wordWrap = (options === undefined || options.wordWrap === undefined) ? false : options.wordWrap;
        this.wordWrapWidth = (options === undefined || options.wordWrapWidth === undefined) ? this.width - 20 : options.wordWrapWidth;

        //container with card and its number:
        // this.shapeContainer =
        this.createShapeContainer();
        ( < any > this.shapeContainer).zOrder = 2; //default zOrder value
    }



    //creates container with shape and label (if exists)
    //no params
    //returns PIXI Container with sprite and label inside
    protected createShapeContainer(): Container {
        this.shapeContainer = new Container();
        this.shapeContainer.interactive = true;
        this.shapeContainer.name = this.name;
        this.shapeContainer.position.set(this.x, this.y);

        //designed for prototype; has to be rewritten for sprites usage
        //creating shape (simple rectangle by default, override in child objects):
        let shape = this.createShape();
        if (shape) {
            ( < any > shape).zOrder = 2;
            this.shapeContainer.addChild(shape);
        }

        //creating text label with card number:
        if (this.hasLabel) {
            this.textElement = new Text(this.label, {
                fontSize: this.fontSize, //this.fontSize,
                fontFamily: this.fontFamily,
                fill: this.fontColor,
                wordWrap: this.wordWrap,
                wordWrapWidth: this.wordWrapWidth
            });
            this.textElement.name = "label";
            //placing label in the center of a shape: 
            let i;
            if (this.name.includes("btn"))
                i = 4;
            else
                i = 2;
            if (shape !== undefined && shape.width !== 0 && shape.height !== 0) {
                this.textElement.x = (shape.width - this.textElement.width) / 2;
                this.textElement.y = (shape.height - this.textElement.height) / i;
            }
            ( < any > this.textElement).zOrder = 3;
            this.shapeContainer.addChild(this.textElement);
        }
        return this.shapeContainer;
    }

    //creating shape (simple rectangle by default, override in child objects):
    //no params
    protected abstract createShape(): Sprite;

    //adds event listener to shape container
    //no params
    //returns void
    public addEventListener(event: string, callback: any, context: Object = null): void {
        if (context != null) {
            this.shapeContainer.on(event, callback.bind(context));
        } else {
            this.shapeContainer.on(event, callback);
        }
    }

    //removes event listener from shape container
    //no params
    //returns void
    public removeEventListener(event: string, callback: any, context: Object = null): void {
        if (context != null) {
            this.shapeContainer.off(event, callback.bind(context));
        } else {
            this.shapeContainer.off(event, callback);
        }
    }

    //removes all event listener from shape container
    //no params
    //returns void
    public removeAllListeners(): void {
        this.shapeContainer.removeAllListeners();
    }

    //adds both click and touch event listeners
    //callback must starts with event.stopPropagation() to avoid double call
    public onClick(callback: any, context: Object = null): void {
        if (context != null) {
            this.shapeContainer.on("pointerdown", callback.bind(context));
            this.shapeContainer.on("touchstart", callback.bind(context));
        } else {
            this.shapeContainer.on("pointerdown", callback);
            this.shapeContainer.on("touchstart", callback);
        }
    }

    //removes both click and touch event listeners
    public offClick(callback: any, context: Object = null): void {
        if (context != null) {
            this.shapeContainer.off("pointerdown", callback.bind(context));
            this.shapeContainer.off("touchstart", callback.bind(context));
        } else {
            this.shapeContainer.off("pointerdown", callback);
            this.shapeContainer.off("touchstart", callback);
        }
    }


    //hides element with alpha
    //no params
    //returns void
    public setInvisible(): void {
        this.shapeContainer.visible = false;
    }

    //shows element with alpha
    //no params
    //returns void
    public setVisible(): void {
        this.shapeContainer.visible = true;
    }

    //shows element slowly with alpha
    //takes step of opacity changing
    //returns void
    public async fadeIn(step = 0.1): Promise < void > {
        this.setInvisible();
        while (this.shapeContainer.alpha < 1) {
            this.shapeContainer.alpha += step;
            await FunctionsLib.timeout(50);
        }
        this.shapeContainer.alpha = 1;
        this.setVisible();
    }

    //hides element slowly with alpha
    //takes step of opacity changing
    //returns void
    public async fadeOut(step = 0.1): Promise < void > {
        this.setVisible();
        while (this.shapeContainer.alpha > 0) {
            this.shapeContainer.alpha -= step;
            await FunctionsLib.timeout(50);
        }
        this.setInvisible();
    }

    //if label exists, hides it  
    //no params
    //returns void
    public hideLabel(): void {
        if (this.hasLabel && this.textElement !== null) {
            ( < any > this.textElement).zOrder = 0;
            FunctionsLib.sortContainerChildren(this.shapeContainer);
        }
    }

    //if label exists, shows it
    //no params
    //returns void
    public showLabel() : void {
        if (this.hasLabel && this.textElement !== null) {
            ( < any > this.textElement).zOrder = 5;
            FunctionsLib.sortContainerChildren(this.shapeContainer);
        }
    }

    //changes the color of a label(if exists)
    //takes a new color
    //returns void
    public changeLabelColor(newColor: string) : void {
        if (this.hasLabel && this.textElement !== null) {
            this.textElement.style.fill = newColor;
        }
    }

    //changes the font family of a label(if exists)
    //takes string with a new font name
    //returns void
    public changeLabelFontFamily(newFont: string) : void {
        if (this.hasLabel && this.textElement !== null) {
            this.textElement.style.fontFamily = newFont;
        }
    }

    //changes the font size of a label(if exists)
    //takes string with a new font size
    //returns void
    public changeLabelFontSize(newSize: number) : void {
        if (this.hasLabel && this.textElement !== null) {
            this.textElement.style.fontSize = newSize;
        }
    }

    //changes the text of a label(if exists)
    //takes string with a new label text and position object with x and y props:
    //returns void
    public changeLabelText(newText: string, position: any) : void{
        if (this.hasLabel  && this.textElement !== null) {
            this.textElement.text = newText;
                if (position === undefined || position.x === undefined)
                this.textElement.x = (this.width -  this.textElement.width) / 2;
                else
                this.textElement.x = position.x;
                if (position === undefined || position.y === undefined) {
                    let i;
                    if (this.name.includes("btn"))
                        i = 4;
                    else
                        i = 2;
                        this.textElement.y = (this.height -  this.textElement.height) / i;
                } else
                this.textElement.y = position.y;
        }
    }

    public changeMultilineLabelText(linesArray: Array<string>, position: any, distance: number = 10) : void {
        if (this.hasLabel) {
            FunctionsLib.removeContainerChildByNameContains(this.shapeContainer, "label");
            let labelHeight : number;
            for (let i = 0; i < linesArray.length; i++) {
                let label = new Text(linesArray[i], {
                    fontSize: this.fontSize,
                    fontFamily: this.fontFamily,
                    fill: this.fontColor
                });
                if (labelHeight === undefined)
                    labelHeight = label.height;
                label.name = "label" + i;
                if (position === undefined || position.x === undefined)
                    label.x = (this.width - label.width) / 2;
                else
                    label.x = position.x;
                if (position === undefined || position.y === undefined)
                    label.y = (this.height - label.height) / 2;
                else {
                    label.y = position.y + i * labelHeight;
                    if (i > 0)
                        label.y += distance;
                }
                this.shapeContainer.addChild(label);
            }
        }
    }

    //changes the position of a label(if exists)
    //takes new x and y
    //returns void
    public changeLabelPosition(x: number, y: number) : void {
        if (this.hasLabel  && this.textElement !== null) {
            this.textElement.x = x !== undefined && x !== null ? x : this.textElement.x;
            this.textElement.y = y !== undefined && y !== null ? y : this.textElement.y;
        }
    }

    //adds other game element into container
    //takes child element of a GameElement type
    //returns void
    public addChild(child : any) : void{
        if (child instanceof GameElement) {
            this.shapeContainer.addChild(child.shapeContainer);
        } else if (child !== undefined && child !== null) {
            this.shapeContainer.addChild(child);
        }
    }

    //adds event listener to child
    //no params
    //returns void
    public addEventListenerToChild(childName: string, event: any, callback: any, context: Function = null) :void {
        const child = FunctionsLib.getContainerChildByName(this.shapeContainer, childName);
        if (child !== null) {
            child.interactive = true;
            if (context != null) {
                child.on(event, callback.bind(context));
            } else {
                child.on(event, callback);
            }
        }
    }

    //removes event listener from child
    //no params
    //returns void
    public removeEventListenerFromChild(childName: string, event: string, callback: any, context: Function = null) :void {
        if (context != null) {
            this.shapeContainer.off(event, callback.bind(context));
        } else {
            this.shapeContainer.off(event, callback);
        }
    }

}