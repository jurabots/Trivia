import {Sprite} from 'pixi.js';
import GameElement from '../SuperClasses/GameElement';
import {ColorsEnum} from '../Helpers/ColorsEnum';
import MyLoader from '../Helpers/MyLoader';
import { gameSettings } from '../Helpers/GameSettings';

/*
Constructor of this class takes object with such fields:
name - name of the element container ("btn" is default)
x - horizontal position of element in px (0 is default)
y - vertical position of element in px (0 is default)
width - width of the element (87 is default)
height - height of the element (27 is default)
hasLabel - boolean, indicates if element has some label on it (false is default)
label - string, text of the label (empty string is default)
fontSize - font size for the label (56 is default)
fontColor -  font color for the label (brown is default)
fontFamily -  font face for the label (gameSettings.font is default)
*/

//a class for button data
export default class QuestionFrame extends GameElement{
    constructor(options)  {
        super({
            name: (options === undefined || options.name === undefined) ? "btn" : options.name, 
            x: (options === undefined || options.x === undefined) ? 0 : options.x, 
            y: (options === undefined || options.y === undefined) ? 0 : options.y, 
            width: (options === undefined || options.width === undefined) ? 87 : options.width, 
            height: (options === undefined || options.height === undefined) ? 27 : options.height, 
            hasLabel: (options === undefined || options.hasLabel === undefined) ? true : options.hasLabel,  
            label: (options === undefined || options.label === undefined) ? "" : options.label,  
            fontSize: (options === undefined || options.fontSize === undefined) ? 65 : options.fontSize,   
            fontColor: (options === undefined || options.fontColor === undefined) ? ColorsEnum.white : options.fontColor, 
            fontFamily: (options === undefined || options.fontFamily === undefined) ? gameSettings.font : options.fontFamily,
            resource:  (options === undefined || options.resource === undefined) ? null : options.resource,
            wordWrap: (options === undefined || options.wordWrap === undefined) ? false : options.wordWrap,
            wordWrapWidth: (options === undefined || options.wordWrapWidth === undefined) ? undefined : options.wordWrapWidth
        });
        (<any>this.shapeContainer).zOrder = 3;
    }
 
    //overrides parent method
    //takes resource name to get texture (enabled button texture by default)
    //returns sprite
    protected createShape() : Sprite {
        let element = new Sprite(MyLoader.getResource(this.resource).texture);
        element.name = "questionFrame";
        this.width = element.width;
        this.height = element.height;
        (<any>element).zOrder = 3;
        return element;
    }
}
