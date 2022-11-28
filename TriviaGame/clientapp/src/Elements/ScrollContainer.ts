import {Container, Graphics} from 'pixi.js';
import {TweenMax, Power4, Elastic} from '../../node_modules/gsap/TweenMax';

export default class ScrollContainer {
  private width: any;
  private height: any;
  private outerX: any;
  private itemHeight: any;
  private thumb: any;
  private thumbBasicY: any;
  private scrollLineHeight: any;
  private hasThumb: boolean;
  private sceneContainer: any;
  private po: Container;
  private scrollContainer: Container;
  private items: any[];
  private mask: Graphics;
  private _mousedown: boolean;
  private lastPos: any;
  private lastDiff: any;
  private scrollTween: any;
  private maxVel: number;
  private _hideOffscreenElements: any;
  private outerY: number;

  constructor(options) {
    this.width = options.width ? options.width : window.innerWidth;
    this.height = options.height ? options.height : window.innerHeight;
    this.outerX = options.outerX;
    this.outerY = options.outerY;
    this.itemHeight = options.itemHeight;

    this.thumb = options.thumb ? options.thumb : null;
    this.thumbBasicY = this.thumb ? this.thumb.y : 0;
    this.scrollLineHeight = options.scrollLineHeight ? options.scrollLineHeight : 0;
    this.hasThumb = this.thumb ? true : false;

    this.sceneContainer = options.sceneContainer ? options.sceneContainer : null;

    this.po = new Container(); //outer container
    this.po.position.set(this.outerX, this.outerY);
    this.scrollContainer = new Container(); //inner container

    this.po.addChild(this.scrollContainer);
    this.items = [];

    this.mask = new Graphics();
    this.mask
      .beginFill(0xFFFFFF)
      .drawRect(0, 0, this.width, this.height)
      .endFill();

    this.po.addChild(this.mask);
    this.scrollContainer.mask = this.mask;

    this._mousedown = false;
    this.lastPos = null;
    this.lastDiff = null;
    this.scrollTween = null;
    this.maxVel = 0;


    this.po.interactive = true;
    ( < any > this.po).mousemove = this.onmousemove.bind(this);
    ( < any > this.po).mousedown = this.onmousedown.bind(this);
    ( < any > this.po).mouseup = this.onmouseup.bind(this);
    ( < any > this.po).touchmove = this.onmousemove.bind(this);
    ( < any > this.po).touchstart = this.onmousedown.bind(this);
    ( < any > this.po).touchend = this.onmouseup.bind(this);
    this._hideOffscreenElements = this.hideOffscreenElementsHandler.bind(this);

    if (this.sceneContainer !== null) {
      this.sceneContainer.mouseup = this.onmouseup.bind(this);
      this.sceneContainer.touchend = this.onmouseup.bind(this);
    }
  }

  public get mousedown () : boolean{
    return this._mousedown;
  }

  public get hideOffscreenElements () : Function{
    return this._hideOffscreenElements;
  }

  public addItemToContainer(item : any) : void {
    this.scrollContainer.addChild(item);
  }

  public addItemToArray(item : any) : void {
    this.items.push(item);
  }

  public addToContainer(container : Container) : void{
      container.addChild(this.po);
  }

  public removeFromContainer(container : Container) : void{
    container.removeChild(this.po);
}

  private onmousedown(e) : void  {
    const clientY = !e.data.originalEvent.touches ? e.data.originalEvent.clientY : e.data.originalEvent.touches[0].clientY;
    this._mousedown = true;
    if (this.scrollTween) this.scrollTween.kill();
    this.lastPos = {
      y: clientY
    }
  }

  private onmousemove(e) : void {
    const clientY = !e.data.originalEvent.touches ? e.data.originalEvent.clientY : e.data.originalEvent.touches[0].clientY;
    if (this._mousedown) {
      this.lastDiff = clientY - this.lastPos.y;
      this.lastPos.y = clientY;

      if (-this.scrollContainer.y < 0) {
        this.scrollContainer.y += this.lastDiff / 2;
      } else {
        this.scrollContainer.y += this.lastDiff;
      }
    }
  }

  private onmouseup(e) : void {
    if (this.lastDiff) {
      let goY = this.scrollContainer.y + this.lastDiff * 10;
      let ease = Power4.easeOut;
      let time = Math.abs(this.lastDiff / 150);

      //back if too much down
      if (goY < -this.items.length * this.itemHeight + this.height) {
        goY = -this.items.length * this.itemHeight + this.height;
        ease = Elastic.easeOut;
        time = .1 + Math.abs(this.lastDiff / 150);
      }
      if (goY > 0) {
        goY = 0;
        ease = Elastic.easeOut;
        time = .1 + Math.abs(this.lastDiff / 150);
      }

      //forward
      if (this.scrollContainer.y > 0) {
        time = 1 + this.scrollContainer.y / 500;
        ease = Elastic.easeOut;
      }
      if (this.scrollContainer.y < -this.items.length * this.itemHeight + this.height) {
        time = 1 + (this.items.length * this.itemHeight + this.height + this.scrollContainer.y) / 500;
        ease = Elastic.easeOut;
      }

      this.scrollTween = TweenMax.to(this.scrollContainer, time, {
        y: goY,
        ease: ease
      });
      this.moveThumb(goY, time, ease);
    }

    this._mousedown = false;
    this.lastPos = null;
    this.lastDiff = null;
  }

  private moveThumb(goY : number, time: number, ease) : void {
    if(!this.thumb){
      return;
    }
    console.log("goY: " + goY);
    let thumbGoY;
    if (ease !== Power4.easeOut) {
      if (goY == 0)
        thumbGoY = this.thumbBasicY;
      else
        thumbGoY = this.thumbBasicY + this.scrollLineHeight - this.thumb.height;
    } else {
      const proportion = (goY) / ((this.items.length * this.itemHeight) + this.outerY);
      thumbGoY = (this.thumbBasicY + (this.scrollLineHeight) * -proportion);
    }

    TweenMax.to(this.thumb, time, {
      y: thumbGoY,
      ease: ease
    });
  }


  private hideOffscreenElementsHandler() : void {
    const startIndex = Math.floor(-this.scrollContainer.y / this.itemHeight);
    const endIndex = Math.floor(startIndex + (this.height / this.itemHeight));

    for (let i = 0; i < this.items.length; i++) {
      let item = this.items[i];
      item.visible = false;
      if (i >= startIndex && i <= endIndex + 1) {
        item.visible = true;
      }
    }
  }
}