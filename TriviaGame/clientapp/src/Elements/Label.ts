
import GameElement from '../SuperClasses/GameElement';
import {ColorsEnum} from '../Helpers/ColorsEnum';
import {Sprite} from 'pixi.js';
import { gameSettings } from '../Helpers/GameSettings';

/*
Constructor of this class takes object with such fields:
name - name of the element container ("lbl" is default)
x - horizontal position of element in px (0 is default)
y - vertical position of element in px (0 is default)
label - string, text of the label (empty string is default)
fontSize - font size for the label (14 is default)
fontColor -  font color for the label (white is default)
fontFamily -  font face for the label ("MuseoSlab-900" is default)
*/

export default class Label extends GameElement{
   
    constructor(options){
        super({
            name: (options === undefined || options.name === undefined) ? "lbl" : options.name,
            x: (options === undefined || options.x === undefined) ? 0 : options.x,
            y: (options === undefined || options.y === undefined) ? 0 : options.y,
            width: 0,
            height: 0,
            hasLabel: true,
            label: (options === undefined || options.label === undefined) ? "" : options.label,
            fontSize: (options === undefined || options.fontSize === undefined) ? 14 : options.fontSize,
            fontColor: (options === undefined || options.fontColor === undefined) ? ColorsEnum.white : options.fontColor,
            fontFamily: (options === undefined || options.fontFamily === undefined) ? gameSettings.font : options.fontFamily
        });
        (<any>this.shapeContainer).zOrder = 2;
    }

    protected createShape(): Sprite {
        return null;
      }
}