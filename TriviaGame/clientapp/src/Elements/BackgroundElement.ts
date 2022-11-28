import {Graphics, Sprite} from 'pixi.js';
import {
    ColorsEnum
} from '../Helpers/ColorsEnum';
import MyLoader from '../Helpers/MyLoader';
/*
Constructor of this class takes object with such fields:
name - name of background element (empty string is default)
x - horizontal position of element in px (0 is default)
y - vertical position of element in px (0 is default)
width - width of the element (0 is default)
height - height of the element (0 is default)
color - color to fill the element (white is default)
resource - resource name for sprite
*/
export default class BackgroundElement {
    private _name: string;
    private _x: number;
    private _y: number;
    private _width: number;
    private _height: number;
    private _color: string;
    private _resource: string;
    private _zOrder: number;
    private _element: any;

    constructor(options) {
        this.name = (options === undefined || options.name === undefined) ? "" : options.name;
        this.x = (options === undefined || options.x === undefined) ? 0 : options.x;
        this.y = (options === undefined || options.y === undefined) ? 0 : options.y;
        this.width = (options === undefined || options.width === undefined) ? 0 : options.width;
        this.height = (options === undefined || options.height === undefined) ? 0 : options.height;
        this.color = (options === undefined || options.color === undefined) ? ColorsEnum.white : options.color;
        this.resource = (options === undefined || options.resource === undefined) ? null : options.resource;
        this.zOrder = (options === undefined || options.zOrder === undefined) ? 1 : options.zOrder;
        this.element = this.getElement();
    }

    /*_____________GETTERS AND SETTERS____________ */
    public get name(): string {
        return this._name;
    }

    public get x(): number {
        return this._x;
    }

    public get y(): number {
        return this._y;
    }

    public get width(): number {
        return this._width;
    }

    public get height(): number {
        return this._height;
    }

    public get color(): string {
        return this._color;
    }

    public get resource(): string {
        return this._resource;
    }

    public get zOrder(): number {
        return this._zOrder;
    }

    public get element() {
        return this._element;
    }

    public set element(value) {
        this._element = value;
    }

    public set name(value: string) {
        this._name = value;
    }

    public set x(value: number) {
        this._x = value;
    }

    public set y(value: number) {
        this._y = value;
    }

    public set width(value: number) {
        this._width = value;
    }

    public set height(value: number) {
        this._height = value;
    }

    public set color(value: string) {
        this._color = value;
    }

    public set resource(value: string) {
        this._resource = value;
    }

    public set zOrder(value: number) {
        this._zOrder = value;
    }

    /*__________________CLASS METHODS_______________ */

    //creates graphics according to current options
    //no params
    //returns PIXI.Graphics element
    private getElement() : any {
        let element;
        if (this.resource === null) {
            element = new Graphics();
            element.beginFill(this.color, 1);
            element.drawRect(this.x, this.y, this.width, this.height);
            element.endFill();
        } else {
            element = new Sprite(MyLoader.getResource(this.resource).texture);
            element.x = this.x;
            element.y = this.y;
        }
        element.name = this.name;
        element.zOrder = this.zOrder;
        return element;
    }

}