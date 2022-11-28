import {Container, Sprite} from 'pixi.js';

export default abstract class Swipeable {

    protected swipeable : boolean;
    protected swipeObject : Container | Sprite;
    protected swipeStart : number
    protected swipeEnd : number;
    protected isPointerdown : boolean;
    protected onSwipeLeft : Function;
    protected onSwipeRight : Function;

    constructor() {
        this.swipeable = false;
        this.swipeObject = null;
        this.swipeStart = 0;
        this.swipeEnd = 0;
        this.isPointerdown = false;
        this.onSwipeLeft = null;
        this.onSwipeRight = null;
    }

    public makeSwipeable(swipeObject : Container | Sprite) : void {
        this.swipeable = true;
        this.swipeObject = swipeObject;
        this.swipeObject.interactive = true;
        this.swipeObject.on('pointerdown', this.onPointerDown.bind(this));
        this.swipeObject.on('pointermove', this.onPointerMove.bind(this));
        this.swipeObject.on('pointerup', this.onPointerUp.bind(this));

        this.swipeObject.on('touchstart', this.onPointerDown.bind(this));
        this.swipeObject.on('touchmove', this.onPointerMove.bind(this));
        this.swipeObject.on('touchend', this.onPointerUp.bind(this));
    }

    public addSwipeLeftListener(callback : Function) : void {
        this.onSwipeLeft = callback;
    }

    public addSwipeRightListener(callback : Function) : void {
        this.onSwipeRight = callback;
    }

    protected onPointerDown(event) : void {
        event.stopPropagation();
        this.isPointerdown = true;
        this.swipeStart = event.data.global.x;
    }

    protected onPointerMove(event) : void {
        event.stopPropagation();
        if (this.isPointerdown) {
            this.swipeEnd = event.data.global.x;
            if (this.swipeStart - this.swipeEnd > 15 && //swipe action detected
                this.onSwipeLeft !== null) {
                this.onSwipeLeft();
                this.isPointerdown = false;
            } else if (this.swipeEnd - this.swipeStart > 15 && //swipe action detected
                this.onSwipeRight !== null) {
                this.onSwipeRight();
                this.isPointerdown = false;
            }
        }
    }

    protected onPointerUp(event) : void {
        event.stopPropagation();
        this.isPointerdown = false;
        this.swipeStart = 0;
    }
}