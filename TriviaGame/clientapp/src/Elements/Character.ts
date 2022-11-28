declare function require(name:string);
import 'pixi.js';
import 'pixi-spine';
const Spine = PIXI['spine'].Spine;
import Animation from './Animation';
import MyLoader from '../Helpers/MyLoader';
import { gameData } from '../Helpers/GameData';
/*
Constructor of this class takes object with such fields:
name - char's name (part of animations names in json)
charPath - string path to char assets (required)
resourceName - name of preloaded assets
width - width of the char (required)
height - height of the char (required)
preloadName - name of preload animation for char (required)
preloadX - horizontal position of the character when preload animation is showing (required)
preloadY - vertical position of the character when preload animation is showing (required)
mainName - name of the main animation for char (required)
mainX - horizontal position of the character when main or other animation is showing (required)
mainY -  vertical position of the character when main or other animation is showing (required)
*/


export default class Character extends Animation {
    private charPath : string;
    private preloadName : string;
    private mainName : string;
    private preloadX : number;
    private preloadY : number;
    private mainX : number;
    private mainY : number; 

    constructor(options) {
        super(options);

        this.charPath = options.charPath;

        this.preloadName = options.preloadName;
        this.preloadX = options.preloadX;
        this.preloadY = options.preloadY;

        this.mainName = options.mainName;
        this.mainX = options.mainX;
        this.mainY = options.mainY;
    }

    //loads character assets, creates character spine
    public async createCharacterAsync() : Promise<object> {
        //adding all scene resources we need to loader:
        return new Promise(resolve => {
            MyLoader.loader.add(this.name, this.charPath, gameData.spineLoaderOptions)
                .load((loader, resources) => {
                    this.animation = new Spine(resources[this.name].spineData);
                    this.animation.skeleton.setToSetupPose();
                    this.animation.update(0);
                    const localBounds = this.animation.getLocalBounds();
                    this.width = localBounds.width;
                    this.height = localBounds.height;
                    this.animation.height = this.height;
                    this.animation.autoUpdate = true;
                    this.animation.zOrder = this.zOrder;
                    resolve();
                });
        });
    }

    //shows preload animation for current character
    public showPreloadAnimation() : void {
        this.animation.x = this.preloadX;
        this.animation.y = this.preloadY;
        this.setAnimationLoop(this.preloadName);
        this.state = this.preloadName;
    }

    //shows main animation for current character
    public showMainAnimation() : void {
        this.animation.x = this.mainX;
        this.animation.y = this.mainY;
        this.setAnimationLoop(this.mainName);
        this.state = this.mainName;
    }
}