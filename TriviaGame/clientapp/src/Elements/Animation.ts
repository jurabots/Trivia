/// <reference path="../../node_modules/@types/pixi.js/index.d.ts" />
import 'pixi-spine';
import 'pixi.js';
const Spine = PIXI['spine'].Spine;
import {Container, Text, Transform, DisplayObject, Sprite, settings } from 'pixi.js';
import {ColorsEnum} from '../Helpers/ColorsEnum';
import MyLoader from '../Helpers/MyLoader';
import { gameSettings } from '../Helpers/GameSettings';

/*
Constructor of this class takes object with such fields:
name - name of animation (part of animations names in json)
width - width of the animation  (0 is default - e.g. unset)
height - height of the animation (0 is default - e.g. unset)
resourceName - name of preloaded resource for animation
zOrder - zOrder for animation (1 is default)
animationsList - list of available animations 
*/

export default class Animation {
    public animation;
    public state : string;
    public name : string;
    public width : number;
    public height: number;
    protected x : number;
    protected y : number;
    public resourceName : string;
    protected zOrder : number;
    public animationsList;

    constructor(options) {
        this.animation = null;
        this.state = null;
        this.name = options.name;
        this.width = (options !== undefined && options.width !== undefined) ? options.width : 0;
        this.height = (options !== undefined && options.height !== undefined) ? options.height : 0;
        this.x = (options !== undefined && options.x !== undefined) ? options.x : 0;
        this.y = (options !== undefined && options.y !== undefined) ? options.y : 0;
        this.resourceName = options.resourceName;
        this.zOrder = (options !== undefined && options.zOrder !== undefined) ? options.zOrder : 1;
        this.animationsList = options.animationsList;
    }


    public createAnimation() : void{
        this.animation = new Spine(MyLoader.getResource(this.resourceName).spineData);
        this.animation.name = this.name;
        this.animation.skeleton.setToSetupPose();
        this.animation.update(0);
        const localBounds = this.animation.getLocalBounds();
                    
                    
        if (this.width !== 0 && this.width !== undefined)
            this.animation.width = this.width;
        else    
            this.width = localBounds.width;
        
        if (this.height !== 0 && this.height !== undefined)
            this.animation.height = this.height;
        else
            this.height = localBounds.height;
            
        this.animation.autoUpdate = true;
        this.animation.position.x = this.x;
        this.animation.position.y = this.y;
        this.animation.zOrder = this.zOrder;
    }

    public showTwoLoops(newLoopFullName, baseLoopFullName) : void{
        this.setAnimationByFullName(newLoopFullName, false);
        this.animation.state.addListener({
            complete: (entry) => {
                this.setAnimationByFullName(baseLoopFullName, true);
                }
        });    
    }



    //checks if animation had already been created
    //returns bool
    public isCreated() : boolean {
        return this.animation !== null;
    }

    //removes animation from old parent and adds to the new one
    //takes two containers: old and new
    public changeParent(oldParent : Container, newParent: Container) : void {
        oldParent.removeChild(this.animation);
        newParent.addChild(this.animation);
    }


    //sets animation with name from param as a loop 
    public setAnimationLoop(name : string) : void {
        const fullName = this.name + '_' + name + '_loop';
        if (this.animation.state.hasAnimation(fullName) && this.state !== fullName) {
            this.animation.skeleton.setToSetupPose();
            this.animation.update(0);
            this.animation.state.setAnimation(0, fullName, true);
            this.state = name;
        }
    }

    //sets animation with name from param as a loop 
    public setAnimationByFullName(name : string, isLoop : boolean = true) : void {
        if (this.animation.state.hasAnimation(name) && this.state !== name) {
            this.animation.skeleton.setToSetupPose();
            this.animation.update(0);
            this.animation.state.setAnimation(0, name, isLoop);
            this.state = name;
        }
    }

    public showAnimation(nameShow : string, nameBase : string) : void {
        this.animation.skeleton.setToSetupPose();
        this.animation.update(0);

        //show full animation once:
        this.animation.state.setAnimation(0, nameShow + '_st', false);
        this.animation.state.addAnimation(0, nameShow + '_loop', false, 0);
        this.animation.state.addAnimation(0, nameShow + '_end', false, 0);

        this.state = nameShow;

        this.animation.skeleton.setToSetupPose();
        this.animation.update(0);

        //set default animation loop:
        this.animation.state.addAnimation(0, nameBase + '_loop', true, 0);
    }

    //hides or shows spine on scene
    //takes boolean: true if spine has to be displayed, false if spine has to be hidden
    public displayOnScene(isDisplayed : boolean) : void{
        if (this.isCreated()) { //animation exists
            this.animation.visible = isDisplayed;
        }
    }

    //adds event listener to shape container
    //takes event name, callback function and context
    //returns void
    public addEventListener(event : string, callback : Function, context : object = null) : void {
        if (context != null) {
            this.animation.on(event, callback.bind(context));
        } else {
            this.animation.on(event, callback);
        }
    }

    //removes event listener from shape container
    //takes event name, callback function and context
    //returns void
    public removeEventListener(event : string, callback : Function, context : object = null) : void {
        if (context != null) {
            this.animation.off(event, callback.bind(context));
        } else {
            this.animation.off(event, callback);
        }
    }

    //removes all event listener from shape container
    //no params
    //returns void
    public removeAllListeners() : void {
        this.animation.removeAllListeners();
    }

    //_________________ACTIONS WITH SPINE PARTS__________________
    public addText(containerNumber: number, options) : Text {
        let container: Container;
        if (containerNumber !== -1)
            container = this.animation.children[containerNumber]; //specified container
        else
            container = this.animation; //main container of animation 
        const label: string = (options === undefined || options.label === undefined) ? "" : options.label;
        const fontSize: number = (options === undefined || options.fontSize === undefined) ? 60 : options.fontSize;
        const fontColor: string = (options === undefined || options.fontColor === undefined) ? ColorsEnum.white : options.fontColor;
        const fontFamily: string = (options === undefined || options.fontFamily === undefined) ? gameSettings.font : options.fontFamily;
        const x: number = (options === undefined || options.x === undefined) ? -1 : options.x;
        const y: number = (options === undefined || options.y === undefined) ? -1 : options.y;
        const borderMinX: number = (options === undefined || options.borderMinX === undefined) ? -1 : options.borderMinX;
        const borderMaxX: number = (options === undefined || options.borderMaxX === undefined) ? -1 : options.borderMaxX;
        const borderMinY: number = (options === undefined || options.borderMinY === undefined) ? -1 : options.borderMinY;
        const borderMaxY: number = (options === undefined || options.borderMaxY === undefined) ? -1 : options.borderMaxY;

        let txt: Text = new Text(label, {
            fontSize: fontSize, 
            fontFamily: fontFamily,
            fill: fontColor,
        });
        txt.name = "label";
        if (containerNumber !== -1)
            (<Transform>txt.transform).skew.x = 3.1;
        //placing label in coordinates from options or in the center of a container: 
        txt.x = x === -1 ? borderMinX + (borderMaxX - borderMinX - txt.width) / 2 : x;
        txt.y = y === -1 ? borderMinY + (borderMaxY - borderMinY - txt.height) / 2 : y;
        container.addChild(txt);
        return txt;
    }

    public changeElementTexture(containerIndex: number, resourceName: string) : void {
        const container: Container = this.animation.children[containerIndex]; //specified container
        const sprite: DisplayObject = container.children[0]; //the only one sprite in container by default
        (<Sprite>sprite).texture = MyLoader.getResource(resourceName).texture;
    }

    //adds event listener to animation sprite
    //takes inner container index (inside spine object),
    //event name, callback function and context
    //returns void
    public addEventListenerToSpineChild(containerIndex: number, event: string, callback: any, context: object = null): void {
        let container: Container;
        if (containerIndex !== -1)
            container = this.animation.children[containerIndex]; //specified container
        else
            container = this.animation; //main container of animation 
        container.interactive = true;
        if (context != null) {
            container.on(event, callback.bind(context));
        } else {
            container.on(event, callback);
        }
    }

    //removes event listener from shape container
    //takes 
    //returns void
    public removeEventListenerFromSpineChild(containerIndex: number, event: string, callback: any, context: object = null) : void {
        let container: Container;
        if (containerIndex !== -1)
            container = this.animation.children[containerIndex]; //specified container
        else
            container = this.animation; //main container of animation 
        if (context != null) {
            container.off(event, callback.bind(context));
        } else {
            container.off(event, callback);
        }
    }

    //removes all event listener from shape container
    //takes inner container index (inside spine object)
    //returns void
    public removeAllListenersFromSpineChild(containerIndex: number): void {
        let container: Container;
        if (containerIndex !== -1)
            container = this.animation.children[containerIndex]; //specified container
        else
            container = this.animation; //main container of animation 
        container.removeAllListeners();
    }
}