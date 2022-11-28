import Popup from "./Popup";
import {
    ColorsEnum
} from "../Helpers/ColorsEnum";
import {
    TextStyle,
    Text
} from "pixi.js";
import {
    Container
} from "pixi.js";
import Button from "./Button";
import {
    EventEmitter
} from "events";
import { Sprite } from "pixi.js";
import MyLoader from "../Helpers/MyLoader";

export default class InfoPopup extends Popup {

    private text: Text;
    private emitter = new EventEmitter();

    constructor(options) {
        super({
            name: "infoPopup",
            x: 0,
            y: 500,
            resource: "topics_bg_part",
            hasCloseIcon: true,
            closeIconResource: "close_icon",
            fontColor: ColorsEnum.white,
            hasLabel: true,
            fontSize: 80,
            closeIconPosition: {right: 80, top:80},
            app: options.app,
            maxHeight: options.maxHeight
        });
        this.addLabel();
    }

    private addLabel(): void {
        const style = new TextStyle({
            align: "center",
            fill: "white",
            fontFamily: "MuseoSlab-900",
            fontSize: 80,
            wordWrap: true,
            wordWrapWidth: 800
        });
        this.text = new Text('', style);
        this.text.y = 460;
        this.text.x = (this.app.view.width - this.text.width) / 2;

        this.addChild(this.text);

        this.setInvisible();

        this.changeCloseIconCallback((event) => {
            event.stopPropagation();
            this.disappearWithAlpha();
            this.emitter.emit("close");
        });
    }

    public show(infoText: string): Promise<void> {
        return new Promise(resolve => {
            this.text.text = infoText;
            this.text.x = (this.app.view.width - this.text.width) / 2;
            this.appearWithAlpha();
            this.emitter.once("close", resolve);
        });
    }
}