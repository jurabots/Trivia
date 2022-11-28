import Popup from "./Popup";
import {
    ColorsEnum
} from "../Helpers/ColorsEnum";
import { TextStyle, Text } from "pixi.js";
import ScrollContainer from "./ScrollContainer";
import { Container } from "pixi.js";
import Button from "./Button";
import { EventEmitter } from "events";

export default class LeaderboardPopup extends Popup {

    private scrollContainer: ScrollContainer;
    public currentDaysPeriod: number;
    private emitter = new EventEmitter();

    constructor(options) {
        super({
            name: "leaderboardPopup",
            x: 0,
            y: 0,
            resource: "leaderboard_bg",
            hasCloseIcon: true,
            closeIconResource: "close_icon",
            fontColor: ColorsEnum.white,
            hasLabel: true,
            fontSize: 50,
            closeIconPosition: options.closeIconPosition,
            app: options.app,
            maxHeight: options.maxHeight
        });
        this.addLabel();
        this.currentDaysPeriod = 5;
        this.addBtns();
    }

    private addLabel(): void {
        const style = new TextStyle({
            fill: "#d84676",
            fontFamily: "MuseoSlab-900",
            fontSize: 80,
            letterSpacing: 2,
            stroke: "white",
            strokeThickness: 15
        });
        const text = new Text('Leaderboard', style);
        text.y = 460;
        text.x = (this.app.view.width - text.width) / 2;

        this.addChild(text);

        ( < any > this.shapeContainer).zOrder = 1001;

        this.setInvisible();

        this.changeCloseIconCallback((event) => {
            event.stopPropagation();
            this.disappearWithAlpha();
        });
    }

    private addBtns(){
        const periods = [5, 30, 60];
        for(let i = 0; i < periods.length; i++){
            const period = periods[i];
            const btn = new Button({
                name: `btn_${period}`,
                x: 100 + 300 * i,
                y: 1750,
                width: 40,
                resource: "btn_orange",
                hasLabel: true,
                label: `${period} days`,
                fontColor: ColorsEnum.white
            });
            btn.shapeContainer.scale.x = 0.4;
            btn.shapeContainer.interactive = true;
            btn.changeLabelPosition(null, 23);
            this.shapeContainer.addChild(btn.shapeContainer);
            btn.onClick(()=>{
                console.log(`updateLeaderBoard: ${period}`);
                this.currentDaysPeriod = period;
                this.emitter.emit("updateLeaderBoard", period);
            }, this);
        }
    }

    onUpdateLeaderBoard(callback){
        this.emitter.on("updateLeaderBoard", callback);
    }

    public show(leadersData){
        if(this.scrollContainer){
            this.scrollContainer.removeFromContainer(this.shapeContainer);
        }

       //creating scroll container
        this.scrollContainer = new ScrollContainer({
            width: 900,
            height: 800,
            outerX: 80,
            outerY: 764,
            itemHeight: 185,
            thumb: null,
            scrollLineHeight: 0,
            sceneContainer: this.shapeContainer
        });
        //creating topics buttons and pushing them into scroll container
        const style = new TextStyle({
            fill: "#ffffff",
            fontFamily: "MuseoSlab-500",
            fontSize: 55,
            letterSpacing: 0,
        });
        

        for (let i = 0; i < leadersData.length; i++) {
            const leader = leadersData[i];
            const leaderContainer = new Container();

            const leaderName = new Text(leader.name, style);
            leaderName.x = 0;
            const leaderScore = new Text(`${leader.score}`, style);
            leaderScore.x = 650;

            leaderContainer.addChild(leaderName, leaderScore);
            leaderContainer.y = 150 + i * 100;
            leaderContainer.x = 150;//(this.app.view.width - leaderContainer.width) / 2;
            
            this.scrollContainer.addItemToContainer(leaderContainer);
            this.scrollContainer.addItemToArray(leaderContainer);
        }

        this.scrollContainer.hideOffscreenElements();

        //adding scroll container on the scene
        this.scrollContainer.addToContainer(this.shapeContainer);
        this.appearWithAlpha();
    }
    

}